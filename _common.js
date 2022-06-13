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
 * @param {String} SETTINGS_FILE File to load
 * @param {boolean} noerror Pass true to ignore the script error
 * @returns Settings JSON object
 * @throws Error on fail then exits script
 */
const loadSettings = (SETTINGS_FILE, noerror) => {
    try {
        return JSON.parse(fs.readFileSync(SETTINGS_FILE))
    } catch (err) {
        if(!noerror) scriptError(`Can't find a '${SETTINGS_FILE}' configuration file.`)
    }
}
exports.loadSettings = loadSettings

/**
 * Resolver class
 * Wraps a promise
 */
class Resolver {
	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.reject = reject
			this.resolve = resolve
		})
	}
}
exports.Resolver = Resolver