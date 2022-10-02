---
title: Application management CLI commands - Microsoft Defender for IoT
description: Learn about the CLI commands available for managing the Defender for IoT on-premises applications.
ms.date: 09/07/2022
ms.topic: reference
---

# OT sensor application management CLI reference

This article lists the CLI commands available for managing the OT network sensor appliance and Defender for IoT software applications.

Command syntax differs depending on the user performing the command, as indicated below for each activity.

## Prerequisites

Before you can run any of the following CLI commands, you'll need access to the CLI on your OT network sensor as a privileged user.

Each activity listed below is accessible by a different set of privileged users, including the *cyberx*, *support*, or *cyber_x_host* users. Command syntax is listed only for the users supported for a specific activity.

We recommend that you use the *support* user for CLI access whenever possible.

For more information, see [Access the CLI](cli-overview.md#access-the-cli) and [Privileged user access for OT monitoring](cli-overview.md#privileged-user-access-for-ot-monitoring).


## Check service status

Use the following commands to verify that all Defender for IoT application components on the OT sensor are working correctly, including the web console and traffic analysis processes.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system sanity`      |  No attributes      |
|**cyberx**     |   `cyberx-xsense-sanity`      |   No attributes     |


The following example shows the command syntax and response for the *support* user:

```cli
root@xsense: system sanity
[+] C-Cabra Engine | Running for 17:26:30.191945
[+] Cache Layer | Running for 17:26:32.352745
[+] Core API | Running for 17:26:28
[+] Health Monitor | Running for 17:26:28
[+] Horizon Agent 1 | Running for 17:26:27
[+] Horizon Parser | Running for 17:26:30.183145
[+] Network Processor | Running for 17:26:27
[+] Persistence Layer | Running for 17:26:33.577045
[+] Profiling Service | Running for 17:26:34.105745
[+] Traffic Monitor | Running for 17:26:30.345145
[+] Upload Manager Service | Running for 17:26:31.514645
[+] Watch Dog | Running for 17:26:30
[+] Web Apps | Running for 17:26:30

System is UP! (medium)
```

## Check software version

Use the following commands to list the Defender for IoT software version installed on your OT sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system version`      |   No attributes      |
|**cyberx**     |   `cyberx-xsense-version`      |   No attributes      |


For example, for the *support* user:

```cli
root@xsense: system version
Version: 22.2.5.9-r-2121448
```

## Reboot appliance

Use the following commands to reboot the OT sensor appliance.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system reboot`      |   No attributes     |
|**cyberx**     |   `sudo reboot`      |   No attributes      |
|**cyberx_host**     |   `sudo reboot`      |   No attributes      |


For example, for the *support* user:

```cli
root@xsense: system reboot
```

## Shut down appliance

Use the following commands to shut down the OT sensor appliance.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system shutdown`      |   No attributes      |
|**cyberx**     |   `sudo shutdown -r now`      |   No attributes      |
|**cyberx_host**     |   `sudo shutdown -r now`      |   No attributes      |


For example, for the *support* user:

```cli
root@xsense: system shutdown
```

## Back up and restore appliance data

The following sections describe the CLI commands supported for backing up and restoring data on your OT network sensor.

### Start an immediate, unscheduled backup

Use the following commands to start an immediate, unscheduled backup of the data on your OT sensor. For more information, see [Set up backup and restore files](../how-to-manage-individual-sensors.md#set-up-backup-and-restore-files).

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system backup`      |   No attributes      |
|**cyberx**     |   ` cyberx-xsense-system-backup`      |   No attributes      |


For example, for the *support* user:

```cli
root@xsense: system backup
Backing up DATA_KEY
...
...
Finished backup. Backup is stored at /var/cyberx/backups/e2e-xsense-1664469968212-backup-version-22.2.6.318-r-71e6295-2022-09-29_18:29:55.tar
Setting backup status 'SUCCESS' in redis
root@xsense:
```

### List current backup files

Use the following commands to list the backup files currently stored on your OT network sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system backup-list`      |   No attributes      |
|**cyberx**     |   ` cyberx-xsense-system-backup-list`      |   No attributes      |


For example, for the *support* user:

<!--ariel, i added in the first line, seemed to have been missing?-->
```cli
root@xsense: system backup-list
backup files:
        e2e-xsense-1664469968212-backup-version-22.3.0.318-r-71e6295-2022-09-29_18:30:20.tar
        e2e-xsense-1664469968212-backup-version-22.3.0.318-r-71e6295-2022-09-29_18:29:55.tar
root@xsense:
```

### Restore data from the most recent backup

Use the following commands to restore data on your OT network sensor using the most recent backup file.

Make sure not to stop or power off the appliance while restoring data. When prompted, confirm that you want to proceed.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system restore`      |   No attributes      |
|**cyberx**     |   ` cyberx-xsense-system-restore`      |   No attributes      |


For example, for the *support* user:

```cli
root@xsense: system restore
Waiting for redis to start...
Redis is up
Use backup file as "/var/cyberx/backups/e2e-xsense-1664469968212-backup-version-22.2.6.318-r-71e6295-2022-09-29_18:30:20.tar" ? [Y/n]: y
WARNING - the following procedure will restore data. do not stop or power off the server machine while this procedure is running. Are you sure you wish to proceed? [Y/n]: y
...
...
watchdog started
starting components
root@xsense:
```

## Show current system date/time

Use the following commands to show the current system date and time on your OT network sensor, in GMT format.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `date`      |   No attributes      |
|**cyberx**     |   `date`      |   No attributes      |
|**cyberx_host**     |   `date`      |  No attributes    |


For example, for the *support* user:

```cli
root@xsense: date
Thu Sep 29 18:38:23 UTC 2022
root@xsense:
```

## Reset privileged user passwords

Use the following command to reset the password for the *cyberx* or *support* user.

This command requires attributes to define the user whose password you're resetting and the password you want to use.

 <!--how do you reset password for the cyberx_host password?-->

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**     |   `cyberx-users-password-reset`      | `cyberx-users-password-reset -u <user> -p <password>`      |

<!--can we use a better password example in this code sample? like something as below?-->

The following example shows the *cyberx* user resetting the *support* user's password to `jI8iD9kE6hB8qN0h`:

```cli
root@xsense:/# cyberx-users-password-reset -u support -p jI8iD9kE6hB8qN0h
resetting the password of OS user "support"
Sending USER_PASSWORD request to OS manager
Open UDS connection with /var/cyberx/system/os_manager.sock
Received data: b'ack'
resetting the password of UI user "support"
root@xsense:/#
```

## Setup appliance network interfaces

Use the following command to run the software installation wizard from scratch and redefine the OT sensor's monitoring and management interfaces.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**     |   `sudo dpkg-reconfigure iot-sensor`      |   No attributes     |


For example, for the **cyberx** user:
```cli
root@xsense:/# sudo dpkg-reconfigure iot-sensor
```

The installation wizard starts. For more information, see [Install OT monitoring software](../how-to-install-software.md#install-ot-monitoring-software).

## Next steps


For more information, see [Getting started with the Defender for IoT CLI](cli-overview.md).
