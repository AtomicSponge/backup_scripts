#!/usr/bin/env node
/**
 * @author Matthew Evans
 * @module spongex/backup_scripts
 * @see README.md
 * @copyright MIT see LICENSE.md
 */

const fs = require('fs')
const os = require('os')
const shell = require('shelljs')
const wtf = require('./_common')

/**
 * Constants
 */
const constants = {
    SETTINGS_FILE: `_config.json`,
    SETTINGS_LOCATION: `${os.homedir()}/.sysbak`,
    LOG_LOCATION: `${os.homedir()}/sysbak/log`
}

/*
 * Main script
 */
process.stdout.write(`${wtf.colors.CYAN}System Backup Script${wtf.colors.CLEAR}\n\n`)

const settings = wtf.loadSettings(`${constants.SETTINGS_LOCATION}/${constants.SETTINGS_FILE}`)

process.stdout.write(`\n${wtf.colors.GREEN}Done!${wtf.colors.CLEAR}\n`)