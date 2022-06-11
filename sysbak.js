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
 * @param {Function} resolver Promise resolver function
 * @param {Function} rejector Promise rejector function
 * @returns {Array} An array of results for each job
 */
const jobRunner = async (jobs, command, splicer, resolver, rejector) => {
    var runningJobs = []
    jobs.forEach(job => {
        runningJobs.push(new wtf.Resolver())
        jobIDX = runningJobs.length - 1
        command = splicer(job, command)
        {(async () => {
            exec(command, (error, stdout, stderr) => {
                if(error) runningJobs[jobIDX].reject = rejector(error, stdout, stderr)
                runningJobs[jobIDX].resolve = resolver(stdout)
            })
        })()}
    })
    return await Promise.all(runningJobs).then(res => { return res })
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

const jobResults = jobRunner(settings['jobs'], settings['backup_command'],
    (job, backup_command) => {
        // do command splicing
        //return backup_command
        return 'ls'
    },
    (stdout) => {
        // resolver
        return true
    },
    (error, stdout, stderr) => {
        // rejector
        return false
    }
)

// do stuff with results
console.log(jobResults)

//  Log last run time
try {
    fs.unlinkSync(`${constants.SETTINGS_LOCATION}/${constants.LASTRUN_FILE}`)
    fs.appendFileSync(
        `${constants.SETTINGS_LOCATION}/${constants.LASTRUN_FILE}`,
        new Date().toString()
    )
} catch (err) { wtf.scriptError(err) }

process.stdout.write(`\n${wtf.colors.GREEN}Done!${wtf.colors.CLEAR}\n`)