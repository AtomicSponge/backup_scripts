#!/usr/bin/env node
/**
 * @author Matthew Evans
 * @module spongex/backup_scripts
 * @see README.md
 * @copyright MIT see LICENSE.md
 */

const fs = require('fs')
const os = require('os')
const { exec } = require('child_process')
const wtf = require('./_common')

/**
 * Constants
 */
const constants = {
    SETTINGS_FILE: `_config.json`,
    SETTINGS_LOCATION: `${os.homedir()}/.sysbak`,
    LOG_LOCATION: `${os.homedir()}/.sysbak/log`,
    SYSBAK_LOG: `sysbak.log`,
    LASTRUN_FILE: `lastrun`
}

/**
 * Write a message to the log file
 * @param {String} message String to write
 * @throws Error on fail then exits script
 */
 const writeLog = (message) => {
    try {
        fs.appendFileSync(`${constants.LOG_LOCATION}/${constants.SYSBAK_LOG}`, message)
    } catch (err) { scriptError(err) }
}

/**
 * Job runner - wraps exec in a promise array and runs all jobs
 * @param {Array} jobs An array of jobs to run
 * @param {String} command The system command to run
 * @param {Function} splicer The splicer function to edit the command
 * @param {Function} callback Command callback
 * @return {Promise} Result of all jobs
 */
const jobRunner = async (jobs, command, splicer, callback) => {
    splicer = splicer || (() => { return command })
    callback = callback || (() => {})
    //  Wrapper class for promises
    class Resolver {
        constructor() {
            this.promise = new Promise((resolve, reject) => {
                this.reject = reject
                this.resolve = resolve
            })
        }
    }
    //  Run all the jobs, resolve/reject promise once done
    var runningJobs = []
    jobs.forEach(job => {
        runningJobs.push(new Resolver())
        const jobIDX = runningJobs.length - 1
        const run_command = splicer(job, command)
        exec(run_command, (error, stdout, stderr) => {
            if(error) runningJobs[jobIDX].reject(
                { name: job['name'], command: run_command,
                  code: error.code, stdout: stdout, stderr: stderr })
            else runningJobs[jobIDX].resolve(
                { name: job['name'], command: run_command,
                  code: 0, stdout: stdout, stderr: stderr })
            callback(error, stdout, stderr)
        })
    })
    //  Collect the promises and return once all complete
    var jobPromises = []
    runningJobs.forEach(job => { jobPromises.push(job.promise) })
    return await Promise.allSettled(jobPromises)
}

/*
 * Main script
 */
process.stdout.write(`${wtf.colors.CYAN}System Backup Script${wtf.colors.CLEAR}\n\n`)

const settings = wtf.loadSettings(`${constants.SETTINGS_LOCATION}/${constants.SETTINGS_FILE}`)

//  Verify jobs format
if(!(settings['jobs'] instanceof Array)) wtf.scriptError(`No Jobs defined.`)
settings['jobs'].forEach((job, IDX) => {
    if(job['name'] === undefined || job['location'] === undefined)
        wtf.scriptError(`Job ${IDX+1} of ${settings['jobs'].length} incorrect format.`)
})
//  Verify backup_command
if(!settings['backup_command']) wtf.scriptError(`No backup command defined.`)

//  Remove old log file
try{
    fs.unlinkSync(`${constants.LOG_LOCATION}/${constants.SYSBAK_LOG}`)
} catch (err) {}

process.stdout.write(`Running backup jobs, please wait...  `)

writeLog(`Backup job started at ${new Date().toString()}\n\n`)

// Run all jobs, splicing in the command variables
jobRunner(settings['jobs'], settings['backup_command'],
    (job, backup_command) => {
        //  Use job specific backup command if one is defined
        if(job['backup_command']) backup_command = job['backup_command']
        backup_command = backup_command.replaceAll('$JOB_NAME', job['name'])
        backup_command = backup_command.replaceAll('$JOB_LOCATION', job['location'])
        backup_command = backup_command.replaceAll('$LOG_LOCATION', constants.LOG_LOCATION)
        //  Process job specific variables
        if(job['vars'] instanceof Array) job['vars'].forEach(cmdVar => {
            backup_command = backup_command.replaceAll(cmdVar['variable'], cmdVar['value'])
        })
        //  Process global variabls
        if(settings['cmdVars'] instanceof Array) settings['cmdVars'].forEach(cmdVar => {
            backup_command = backup_command.replaceAll(cmdVar['variable'], cmdVar['value'])
        })
        return backup_command
    }
).then((jobResults) => {
    //  Check for any failed jobs
    var failedJobs = []
    jobResults.forEach(job => {
        if(job.status == 'rejected') {
            failedJobs.push({ name: job.reason.name,
                              command:  job.reason.command,
                              code: job.reason.code,
                              error: job.reason.stderr })
        }
    })
    if(failedJobs.length > 0) {
        var errorMsg = 'The following jobs failed:\n\n'
        failedJobs.forEach(job => {
            errorMsg += `==============================\n\n`
            errorMsg += `Job: '${job.name}'\tCode: ${job.code}\n\nCommand: ${job.command}`
            errorMsg += `\n\nReason:\n${job.error}\n`
        })
        errorMsg += `\n${failedJobs.length} of ${jobResults.length} jobs completed with errors.`
        writeLog(errorMsg)
        wtf.scriptError(errorMsg)
    }

    //  Log last run time
    try {
        fs.unlinkSync(`${constants.SETTINGS_LOCATION}/${constants.LASTRUN_FILE}`)
    } catch (err) {}
    try {
        fs.appendFileSync(
            `${constants.SETTINGS_LOCATION}/${constants.LASTRUN_FILE}`,
            new Date().toString()
        )
    } catch (err) { wtf.scriptError(err) }

    writeLog(`${jobResults.length} jobs completed successfully at ${new Date().toString()}`)
    process.stdout.write(`${wtf.colors.GREEN}Done!${wtf.colors.CLEAR}\n`)
})