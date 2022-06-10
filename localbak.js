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

const processFolder = (location, backupLocation, ignoreList) => {
    if(ignoreList === undefined) ignoreList = []
    const fileList = fs.readdirSync(location, { withFileTypes: "true" })
    fs.mkdirSync(backupLocation)
    fileList.forEach(item => {
        //  Check for ignore
        if(ignoreList.find(ignore => { item.name == ignore})) return
        //  Process the item
        if(item.isDirectory()) {
            processFolder(`${location}/${item.name}`, `${backupLocation}/${item.name}`, ignoreList)
        } else fs.copyFileSync(`${location}/${item.name}`, `${backupLocation}/${item.name}`)
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

//  If an extra name is specified, add it to the backup folder name
if(process.argv[2] != undefined) constants.BACKUP_FOLDER += process.argv[2]

//  Remove old backup
fs.rmSync(`${process.cwd()}/${constants.BACKUP_FOLDER}`, {recursive: true, force: true})

//  Process the backup
try {
    processFolder(process.cwd(), `${process.cwd()}/${constants.BACKUP_FOLDER}`, settings['ignore'])
} catch (err) { wtf.scriptError(err) }

process.stdout.write(`${wtf.colors.GREEN}Done!${wtf.colors.CLEAR}\n`)