#!/usr/bin/env node
/**
 * @author Matthew Evans
 * @module spongex/backup_scripts
 * @see README.md
 * @copyright MIT see LICENSE.md
 */

const fs = require('fs')
const wtf = require('./_common')

/**
 * Constants
 */
const constants = {
    SETTINGS_FILE: `.localbak_config.json`,
    BACKUP_FOLDER: `_backup`
}

const processFolder = (location, backup_location) => {
    const fileList = fs.readdirSync(location, { withFileTypes: "true" })
    fileList.forEach(item => {
        if(`${location}/${item.name}` == `${process.cwd()}/${constants.BACKUP_FOLDER}`) return
        //  Check for ignore
        if(item.isDirectory()) {
            fs.mkdirSync(`${backup_location}/${item.name}`)
            processFolder(`${location}/${item.name}`, `${backup_location}/${item.name}`)
        } else fs.copyFileSync(`${location}/${item.name}`, `${backup_location}/${item.name}`)
    })
}

/*
 * Main script
 */
process.stdout.write(`${wtf.colors.CYAN}Local Backup Script${wtf.colors.CLEAR}\n\n`)

//  Check for a settings file
var settings = wtf.loadSettings(`${process.cwd()}/${constants.SETTINGS_FILE}`, true)
if(!settings) settings = {}

//  Overrwite backup name if exists in settings
if(settings['backup_name']) constants.BACKUP_FOLDER = settings['backup_name']

//  Remove old backup
fs.rmSync(`${process.cwd()}/${constants.BACKUP_FOLDER}`, {recursive: true, force: true})

//  Create the new backup folder
try {
    fs.mkdirSync(`${process.cwd()}/${constants.BACKUP_FOLDER}`)
} catch (err) { wtf.scriptError(err) }

//  Process the backup
processFolder(process.cwd(), `${process.cwd()}/${constants.BACKUP_FOLDER}`)

process.stdout.write(`\n${wtf.colors.GREEN}Done!${wtf.colors.CLEAR}\n`)