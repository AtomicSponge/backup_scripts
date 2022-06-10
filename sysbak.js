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
    LASTRUN_FILE: `lastrun`
}

/*
 * Main script
 */
process.stdout.write(`${wtf.colors.CYAN}System Backup Script${wtf.colors.CLEAR}\n\n`)

const settings = wtf.loadSettings(`${constants.SETTINGS_LOCATION}/${constants.SETTINGS_FILE}`)

settings['jobs'].forEach(job => {
    exec(settings['backup_command'], (error, stdout, stderr) => {
        //
    })
})

try {
    fs.unlinkSync(`${constants.SETTINGS_LOCATION}/${constants.LASTRUN_FILE}`)
} catch (err) {}

fs.appendFileSync(
    `${constants.SETTINGS_LOCATION}/${constants.LASTRUN_FILE}`,
    new Date().toString()
)

process.stdout.write(`\n${wtf.colors.GREEN}Done!${wtf.colors.CLEAR}\n`)