# Backup Scripts

Local and system backup scripts

## Local Backup

Create a local ___backup__ folder and copy the current folder to the new one.  Allows for certain files and folders to be ignored.

```
JSON
```

## System Backup

__Does heavy command injection, use at your own risk!__

See [NodeJS's documentation](https://nodejs.org/api/child_process.html#child_processexeccommand-options-callback) on [exec](https://nodejs.org/api/child_process.html#child_processexeccommand-options-callback) for more information on how commands work.

Use a third party backup utility such as [rclone](https://rclone.org/) and automate folder syncronization.

```
JSON
```