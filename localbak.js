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

/**
 * Counters to track items backed up
 */
const counters = {
    files: 0,
    folders: 0
}

/**
 * Recursively back up files & folders starting at a location
 * @param {String} location Current processing location
 * @param {String} backupLocation Current backup location
 * @param {Array} ignoreList List of files & folders to ignore
 */
const processFolder = (location, backupLocation, ignoreList) => {
    if(ignoreList === undefined) ignoreList = []
    const fileList = fs.readdirSync(location, { withFileTypes: 'true' })
    fs.mkdirSync(backupLocation)
    fileList.forEach(item => {
        //  Check if the item is in the ignore list
        var ignoreMatch = false
        ignoreList.forEach(ignore => { if(item.name == ignore) ignoreMatch = true; return })
        if(ignoreMatch) return
        //  Process the item
        if(item.isDirectory()) {
            counters.folders++
            processFolder(`${location}/${item.name}`, `${backupLocation}/${item.name}`, ignoreList)
        }
        if(item.isFile()) {
            counters.files++
            fs.copyFileSync(`${location}/${item.name}`, `${backupLocation}/${item.name}`)
        }
        //  Ignore other things such as symlinks
    })
}

/*
 * Main script
 */
process.stdout.write(`${wtf.colors.CYAN}Local Backup Script${wtf.colors.CLEAR}\n\n`)

//  Check for a settings file
var settings = wtf.loadSettings(`${process.cwd()}/${constants.SETTINGS_FILE}`, true)
if(!settings) settings = {}
else process.stdout.write(`Loaded settings from a local '${constants.SETTINGS_FILE}' file.\n`)

//  Overrwite backup name if exists in settings
if(settings['backup_name']) constants.BACKUP_FOLDER = settings['backup_name']

//  If an extra name is specified, add it to the backup folder name
if(process.argv[2] != undefined) constants.BACKUP_FOLDER += process.argv[2]

//  Remove old backup
fs.rmSync(`${process.cwd()}/${constants.BACKUP_FOLDER}`, {recursive: true, force: true})

process.stdout.write(`Backing up '${process.cwd()}' to '${constants.BACKUP_FOLDER}'...\n`)

//  Process the backup
try {
    processFolder(process.cwd(), `${process.cwd()}/${constants.BACKUP_FOLDER}`, settings['ignore'])
} catch (err) { wtf.scriptError(err) }

process.stdout.write(`Backed up ${wtf.colors.YELLOW}${counters.files} files${wtf.colors.CLEAR} `)
process.stdout.write(`and ${wtf.colors.YELLOW}${counters.folders} folders${wtf.colors.CLEAR}.\n\n`)
process.stdout.write(`${wtf.colors.GREEN}Done!${wtf.colors.CLEAR}\n`)