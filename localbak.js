#!/usr/bin/env node
/**
 * @author Matthew Evans
 * @module spongex/backup_scripts
 * @see README.md
 * @copyright MIT see LICENSE.md
 */

const fs = require('fs')
const wtf = require('_common')

/**
 * Constants
 */
const constants = {
    SETTINGS_FILE: `.localbak_config.json`,
    BACKUP_FOLDER: `_bak`
}

/*
 * Main script
 */
process.stdout.write(`${wtf.colors.CYAN}Local Backup Script${wtf.colors.CLEAR}\n\n`)

const settings = wtf.loadSettings(`${process.cwd()}/${constants.SETTINGS_FILE}`)

process.stdout.write(`\n${wtf.colors.GREEN}Done!${wtf.colors.CLEAR}\n`)
