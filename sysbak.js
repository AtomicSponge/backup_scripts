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
 * Job runner - wraps exec in a promise array and runs all jobs
 * @param {Array} jobs An array of jobs to run
 * @param {String} command The system command to run
 * @param {Function} splicer The splicer function to edit the command
 * @param {Function} callback Command callback
 */
const jobRunner = async (jobs, command, splicer, callback) => {
    var runningJobs = []
    jobs.forEach(job => {
        runningJobs.push(new wtf.Resolver())
        jobIDX = runningJobs.length - 1
        command = splicer(job, command)
        exec(command, (error, stdout, stderr) => {
            if(error) runningJobs[jobIDX].reject(stderr)
            else runningJobs[jobIDX].resolve(stdout)
            callback(error, stdout, stderr)
        })
    })
    return await Promise.allSettled(runningJobs)
}

/*
 * Main script
 */
process.stdout.write(`${wtf.colors.CYAN}System Backup Script${wtf.colors.CLEAR}\n\n`)

const settings = wtf.loadSettings(`${constants.SETTINGS_LOCATION}/${constants.SETTINGS_FILE}`)

//  Verify jobs format
if(!settings['jobs']) wtf.scriptError(`No Jobs defined.`)
settings['jobs'].forEach((job, IDX) => {
    if(job['name'] === undefined || job['location'] === undefined)
        wtf.scriptError(`Job ${IDX+1} of ${settings['jobs'].length} incorrect format.`)
})
//  Verify backup_command
if(!settings['backup_command']) wtf.scriptError(`No backup command defined.`)

jobRunner(settings['jobs'], settings['backup_command'],
    (job, backup_command) => {
        backup_command.replaceAll('$BACKUP_LOCATION', job['location'])
        //return backup_command
        return 'sleep 5'
    },
    (error, stdout, stderr) => {
        console.log('callback')
    }
).then(() => {
    //  Log last run time
    try {
        fs.unlinkSync(`${constants.SETTINGS_LOCATION}/${constants.LASTRUN_FILE}`)
        fs.appendFileSync(
            `${constants.SETTINGS_LOCATION}/${constants.LASTRUN_FILE}`,
            new Date().toString()
        )
    } catch (err) { wtf.scriptError(err) }

    process.stdout.write(`\n${wtf.colors.GREEN}Done!${wtf.colors.CLEAR}\n`)
})