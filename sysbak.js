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
 * Job runner
 * @param {Array} jobs 
 * @param {String} command 
 * @param {Function} splicer 
 */
const jobRunner = async (jobs, command, splicer, resolver, rejector) => {
    var runningJobs = []
    jobs.forEach(job => {
        runningJobs.push(new wtf.Resolver())
        jobIDX = runningJobs.length - 1
        command = splicer(job, command)
        (async () => {
            exec(command, (error, stdout, stderr) => {
                runningJobs[jobIDX].resolve = resolver(error, stdout, stderr)
                runningJobs[jobIDX].reject = rejector(error, stdout, stderr)
            })
        })
    })
    return Promise.all(runningJobs)
}

/*
 * Main script
 */
process.stdout.write(`${wtf.colors.CYAN}System Backup Script${wtf.colors.CLEAR}\n\n`)

const settings = wtf.loadSettings(`${constants.SETTINGS_LOCATION}/${constants.SETTINGS_FILE}`)

// verify jobs format
// verify backup_command

const jobResults = await jobRunner(settings['jobs'], settings[backup_command],
    (job, backup_command) => {
        // do command splicing
        return backup_command
    },
    (error, stdout, stderr) => {
        // resolver
    },
    (error, stdout, stderr) => {
        // rejector
    }
)

try {
    fs.unlinkSync(`${constants.SETTINGS_LOCATION}/${constants.LASTRUN_FILE}`)
} catch (err) {}

fs.appendFileSync(
    `${constants.SETTINGS_LOCATION}/${constants.LASTRUN_FILE}`,
    new Date().toString()
)

process.stdout.write(`\n${wtf.colors.GREEN}Done!${wtf.colors.CLEAR}\n`)