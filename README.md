# Backup NodeJS Scripts

Local and system backup scripts.  See each section for usage of each script.

*(note: not yet uploaded)*
Install globally:
```
npm i -g @spongex/backup_scrips
```
Or per-project as a dev-dependency:
```
npm i @spongex/backup_scrips --save-dev
```

---

## Local Backup

Create a local ___backup__ folder and copy the current folder to the new one.

Allows for certain files and folders to be ignored.  In the running folder, create a file called __.localbak_config.json__ with the following format:
```
{
    "ignore": [
        ".cmake",
        ".git",
        "build",
        "docs",
        "node_modules"
    ]
}
```

---

## System Backup

__Does heavy command injection, use at your own risk!__

See [NodeJS's documentation](https://nodejs.org/api/child_process.html#child_processexeccommand-options-callback) on [exec](https://nodejs.org/api/child_process.html#child_processexeccommand-options-callback) for more information on how commands work.

Use a third party sync utility such as [rclone](https://rclone.org/) and automate folder syncronization.

To use, define a command to run a sync utility and a list of jobs in a ___config.json__ file located in a __.sysbak__ folder placed in your user home directory.

An exampe format is as follows:
```
{
    "backup_command": "rclone --log-file=$LOG_LOCATION/$JOB_NAME.log --log-level $LOGGING_LEVEL --skip-links --ask-password=false --password-command $RCLONE_PASSWORD_COMMAND sync $JOB_LOCATION $BACKUP_NAME:$JOB_NAME",
    "jobs": [
        {
            "name": "Backup",
            "location": "/home/matthew/Backup"
        },
        {
            "name": "Documents",
            "location": "/home/matthew/Documents"
        },
        {
            "name": "Music",
            "location": "/home/matthew/Music"
        },
        {
            "name": "Pictures",
            "location": "/home/matthew/Pictures"
        },
        {
            "name": "Projects",
            "location": "/home/matthew/Projects"
        },
        {
            "name": "Videos",
            "location": "/home/matthew/Videos"
        }
    ],
    "cmdVars": [
        {
            "variable": "$LOGGING_LEVEL",
            "value": "NOTICE"
        },
        {
            "variable": "$RCLONE_PASSWORD_COMMAND",
            "value": "\"pass rclone/config\""
        },
        {
            "variable": "$BACKUP_NAME",
            "value": "backup_crypt"
        }
    ]
}
```

### Additional options