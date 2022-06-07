#!/usr/bin/env node
/**
 * @author Matthew Evans
 * @module spongex/backup_scripts
 * @see README.md
 * @copyright MIT see LICENSE.md
 */

const fs = require('fs')

/**
 * Font colors
 */
const colors = {
    RED:    `\x1b[31m`,
    GREEN:  `\x1b[32m`,
    YELLOW: `\x1b[33m`,
    CYAN:   `\x1b[36m`,
    DIM:    `\x1b[2m`,
    CLEAR:  `\x1b[0m`
}
exports.colors = colors

/**
 * Constants
 */
const constants = {
    SETTINGS_LOCATION: ``,
    SETTINGS_FILE: `.sysbak_config.json`,
    BACKUP_FOLDER: `_bak`
}
exports.constants = constants

/**
 * Display an error message and exit script.
 * @param {String} message Message to display.
 */
const scriptError = (message) => {
    process.stdout.write(`${colors.RED}Error:  ${message}  Exiting...${colors.CLEAR}\n`)
    process.exit(1)
}
exports.scriptError = scriptError

/**
 * Load local settings file
 * @returns Settings JSON object
 * @throws Error on fail then exits script
 */
const loadSettings = () => {
    try {
        return JSON.parse(fs.readFileSync(
            `${process.cwd()}/${constants.SETTINGS_FILE}`))
    } catch (err) {
        scriptError(`Can't find a local '${constants.SETTINGS_FILE}' configuration file.`)
    }
}
exports.loadSettings = loadSettings