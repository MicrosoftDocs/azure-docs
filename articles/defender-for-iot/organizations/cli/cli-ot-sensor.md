---
title: Application management CLI commands - Microsoft Defender for IoT
description: Learn about the CLI commands available for managing the Defender for IoT on-premises applications.
ms.date: 09/07/2022
ms.topic: reference
---

# Application Management CLI Reference (OT Sensor)

## Check service status

Ensure that all application components, including the web console and traffic analysis, are working correctly.

|User  |Command  |Full command syntax <!--remove this column if no attributes-->  |
|---------|---------|---------|
|**support**     |   `system sanity`      |   `no attributes`      |
|**cyberx**     |   `cyberx-xsense-sanity`      |   `no attributes`      |
|**cyberx_host**     |   n/a      |   n/a      |


For example, for the **support** user:
```bash
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
Provides information on the version of the software installed

|User  |Command  |Full command syntax <!--remove this column if no attributes-->  |
|---------|---------|---------|
|**support**     |   `system version`      |   `no attributes`      |
|**cyberx**     |   `cyberx-xsense-version`      |   `no attributes`      |
|**cyberx_host**     |   n/a      |   n/a      |


For example, for the **support** user:
```bash
root@xsense: system version
Version: 22.2.5.9-r-2121448
```


## Reboot appliance
Reboots the host device.

|User  |Command  |Full command syntax <!--remove this column if no attributes-->  |
|---------|---------|---------|
|**support**     |   `system reboot`      |   `no attributes`      |
|**cyberx**     |   `sudo reboot`      |   `no attributes`      |
|**cyberx_host**     |   `sudo reboot`      |   `no attributes`      |


For example, for the **support** user:
```bash
root@xsense: system reboot
```

## Shut down appliance
Shuts down the host.


|User  |Command  |Full command syntax <!--remove this column if no attributes-->  |
|---------|---------|---------|
|**support**     |   `system shutdown`      |   `no attributes`      |
|**cyberx**     |   `sudo shutdown -r now`      |   `no attributes`      |
|**cyberx_host**     |   `sudo shutdown -r now`      |   `no attributes`      |


For example, for the **support** user:
```bash
root@xsense: system shutdown
```

## Back up and restore appliance data

### Initiates an immediate backup (an unscheduled backup).
|User  |Command  |Full command syntax <!--remove this column if no attributes-->  |
|---------|---------|---------|
|**support**     |   `system backup`      |   `no attributes`      |
|**cyberx**     |   ` cyberx-xsense-system-backup`      |   `no attributes`      |
|**cyberx_host**     |   n/a      |   n/a      |


For example, for the **support** user:
```bash
root@xsense: system backup
Backing up DATA_KEY
...
...
Finished backup. Backup is stored at /var/cyberx/backups/e2e-xsense-1664469968212-backup-version-22.3.0.318-r-71e6295-2022-09-29_18:29:55.tar
Setting backup status 'SUCCESS' in redis
root@xsense:
```
### Lists available backup files
|User  |Command  |Full command syntax <!--remove this column if no attributes-->  |
|---------|---------|---------|
|**support**     |   `system backup-list`      |   `no attributes`      |
|**cyberx**     |   ` cyberx-xsense-system-backup-list`      |   `no attributes`      |
|**cyberx_host**     |   n/a      |   n/a      |


For example, for the **support** user:
```bash
backup files:
        e2e-xsense-1664469968212-backup-version-22.3.0.318-r-71e6295-2022-09-29_18:30:20.tar
        e2e-xsense-1664469968212-backup-version-22.3.0.318-r-71e6295-2022-09-29_18:29:55.tar
root@xsense:
```

### Restore appliance data from the most recent backup
|User  |Command  |Full command syntax <!--remove this column if no attributes-->  |
|---------|---------|---------|
|**support**     |   `system restore`      |   `no attributes`      |
|**cyberx**     |   ` cyberx-xsense-system-restore`      |   `no attributes`      |
|**cyberx_host**     |   n/a      |   n/a      |


For example, for the **support** user:
```bash
root@xsense: system restore
Waiting for redis to start...
Redis is up
Use backup file as "/var/cyberx/backups/e2e-xsense-1664469968212-backup-version-22.3.0.318-r-71e6295-2022-09-29_18:30:20.tar" ? [Y/n]: y
WARNING - the following procedure will restore data. do not stop or power off the server machine while this procedure is running. Are you sure you wish to proceed? [Y/n]: y
...
...
watchdog started
starting components
root@xsense:
```

## Show current system date/time
Returns the current date on the host in GMT format.

|User  |Command  |Full command syntax <!--remove this column if no attributes-->  |
|---------|---------|---------|
|**support**     |   `date`      |   `no attributes`      |
|**cyberx**     |   `date`      |   `no attributes`      |
|**cyberx_host**     |   `date`      |  `no attributes`    |


For example, for the **support** user:
```bash
root@xsense: date
Thu Sep 29 18:38:23 UTC 2022
root@xsense:
```

## Reset administrative user passwords
Reset password for **cyberx** or **support** built-in users
|User  |Command  |Full command syntax <!--remove this column if no attributes-->  |
|---------|---------|---------|
|**support**      |   n/a      |  n/a    |
|**cyberx**     |   `cyberx-users-password-reset`      |   `cyberx-users-password-reset -u user -p password`      |
|**cyberx_host**     |   n/a      |  n/a    |


For example, for the **cyberx** user:
```bash
root@xsense:/# cyberx-users-password-reset -u support -p password
resetting the password of OS user "support"
Sending USER_PASSWORD request to OS manager
Open UDS connection with /var/cyberx/system/os_manager.sock
Received data: b'ack'
resetting the password of UI user "support"
root@xsense:/#
```

## Setup appliance network interfaces
Re-configure roles for attached network interfaces: monitoring and management (more information [here](how-to-install-software?tabs=sensor#install-ot-monitoring-software). 

|User  |Command  |Full command syntax <!--remove this column if no attributes-->  |
|---------|---------|---------|
|**support**      |   n/a      |  n/a    |
|**cyberx**     |   `sudo dpkg-reconfigure iot-sensor`      |   `no attributes`     |
|**cyberx_host**     |   n/a      |  n/a    |


For example, for the **cyberx** user:
```bash
root@xsense:/# sudo dpkg-reconfigure iot-sensor
<graphical prompts will appear>
```

## Next steps


For more information, see:

- [Appliance management commands](cli-appliance.md)
- [Configuration commands](cli-configuration.md)
- [On-premises management console commands](cli-management.md)
