#!/usr/bin/env node
/**
 * @author Matthew Evans
 * @module spongex/backup_scripts
 * @see README.md
 * @copyright MIT see LICENSE.md
 */

const fs = require('fs')
const shell = require('shelljs')
const wtf = require('_common')

/*
 * Main script
 */
process.stdout.write(`${wtf.colors.CYAN}System Backup Script${wtf.colors.CLEAR}\n\n`)

const settings = wtf.loadSettings()

process.stdout.write(`\n${wtf.colors.GREEN}Done!${wtf.colors.CLEAR}\n`)