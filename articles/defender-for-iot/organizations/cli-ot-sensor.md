---
title: CLI command reference from OT network sensors- Microsoft Defender for IoT
description: Learn about the CLI commands available from Microsoft Defender for IoT OT network sensors.
ms.date: 12/19/2023
ms.topic: reference
---

# CLI command reference from OT network sensors

This article lists the CLI commands available from Defender for IoT OT network sensors.

[!INCLUDE [caution do not use manual configurations](includes/caution-manual-configurations.md)]

## Prerequisites

Before you can run any of the following CLI commands, you'll need access to the CLI on your OT network sensor as a privileged user.

While this article lists the command syntax for each user, we recommend using the *admin* user for all CLI commands where the *admin* user is supported.

For more information, see [Access the CLI](../references-work-with-defender-for-iot-cli-commands.md#access-the-cli) and [Privileged user access for OT monitoring](references-work-with-defender-for-iot-cli-commands.md#privileged-user-access-for-ot-monitoring).

## Appliance maintenance

### Check OT monitoring services health

Use the following commands to verify that the Defender for IoT application on the OT sensor is working correctly, including the web console and traffic analysis processes.

Health checks are also available from the OT sensor console. For more information, see [Troubleshoot the sensor](how-to-troubleshoot-sensor.md).

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**admin**     |   `system sanity`      |  No attributes      |
|**cyberx**, or **admin** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-an-admin-user)   |   `cyberx-xsense-sanity`      |   No attributes     |

The following example shows the command syntax and response for the *admin* user:

```bash
shell> system sanity
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

### Restart an appliance

Use the following commands to restart the OT sensor appliance.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**admin**     |   `system reboot`      |   No attributes     |
|**cyberx**  , or **admin** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-an-admin-user)    |   `sudo reboot`      |   No attributes      |
|**cyberx_host**  , or **admin** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-an-admin-user)    |   `sudo reboot`      |   No attributes      |

For example, for the *admin* user:

```bash
shell> system reboot
```

### Shutdown an appliance

Use the following commands to shut down the OT sensor appliance.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**admin**     |   `system shutdown`      |   No attributes      |
|**cyberx**  , or **admin** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-an-admin-user)    |   `sudo shutdown -r now`      |   No attributes      |
|**cyberx_host**, or **admin** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-an-admin-user)     |   `sudo shutdown -r now`      |   No attributes      |

For example, for the *admin* user:

```bash
shell> system shutdown
```

### Show installed software version

Use the following commands to list the Defender for IoT software version installed on your OT sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**admin**     |   `system version`      |   No attributes      |
|**cyberx**  , or **admin** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-an-admin-user)    |   `cyberx-xsense-version`      |   No attributes      |

For example, for the *admin* user:

```bash
shell> system version
Version: 22.2.5.9-r-2121448
```

### Show current system date/time

Use the following commands to show the current system date and time on your OT network sensor, in GMT format.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**admin**     |   `date`      |   No attributes      |
|**cyberx**  , or **admin** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-an-admin-user)    |   `date`      |   No attributes      |
|**cyberx_host**  , or **admin** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-an-admin-user)    |   `date`      |  No attributes    |

For example, for the *admin* user:

```bash
shell> date
Thu Sep 29 18:38:23 UTC 2022
shell>
```

### Turn on NTP time sync

Use the following commands to turn on synchronization for the appliance time with an NTP server.

To use these commands, make sure that:

- The NTP server can be reached from the appliance management port
- You use the same NTP server to synchronize all sensor appliances and the on-premises management console

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**admin**     |   `ntp enable <IP address>`      |  No attributes |
|**cyberx**  , or **admin** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-an-admin-user)    |   `cyberx-xsense-ntp-enable <IP address>`      |  No attributes      |

In these commands, `<IP address>` is the IP address of a valid IPv4 NTP server using port 123.

For example, for the *admin* user:

```bash
shell> ntp enable 129.6.15.28
shell>
```

### Turn off NTP time sync

Use the following commands to turn off the synchronization for the appliance time with an NTP server.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**admin**     |   `ntp disable <IP address>`      |   No attributes      |
|**cyberx**  , or **admin** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-an-admin-user)    |   `cyberx-xsense-ntp-disable <IP address>`      |  No attributes |

In these commands, `<IP address>` is the IP address of a valid IPv4 NTP server using port 123.

For example, for the *admin* user:

```bash
shell> ntp disable 129.6.15.28
shell>
```

## Backup and restore

The following sections describe the CLI commands supported for backing up and restoring a system snapshot of your OT network sensor.

Backup files include a full snapshot of the sensor state, including configuration settings, baseline values, inventory data, and logs.

>[!CAUTION]
> Do not interrupt a system backup or restore operation as this may cause the system to become unusable.

### Start an immediate, unscheduled backup

Use the following command to start an immediate, unscheduled backup of the data on your OT sensor. For more information, see [Set up backup and restore files](../how-to-manage-individual-sensors.md#set-up-backup-and-restore-files).

> [!CAUTION]
> Make sure not to stop or power off the appliance while backing up data.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**admin**     |   `system backup create`      |   No attributes      |
|**cyberx**  , or **admin** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-an-admin-user)    |   ` cyberx-xsense-system-backup`      |   No attributes      |

For example, for the *admin* user:

```bash
shell> system backup create
Backing up DATA_KEY
...
...
Finished backup. Backup is stored at /var/cyberx/backups/e2e-xsense-1664469968212-backup-version-22.2.6.318-r-71e6295-2022-09-29_18:29:55.tar
Setting backup status 'SUCCESS' in redis
shell>
```

### List current backup files

Use the following commands to list the backup files currently stored on your OT network sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**admin**     |   `system backup list`      |   No attributes      |
|**cyberx**  , or **admin** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-an-admin-user)    |   `cyberx-xsense-system-backup-list`      |   No attributes      |

For example, for the *admin* user:

```bash
shell> system backup list
backup files:
        e2e-xsense-1664469968212-backup-version-22.3.0.318-r-71e6295-2022-09-29_18:30:20.tar
        e2e-xsense-1664469968212-backup-version-22.3.0.318-r-71e6295-2022-09-29_18:29:55.tar
shell>
```

### Restore data from the most recent backup

Use the following command to restore data on your OT network sensor using the most recent backup file. When prompted, confirm that you want to proceed.

> [!CAUTION]
> Make sure not to stop or power off the appliance while restoring data.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**admin**     |   `system restore`      |   No attributes      |
|**cyberx**, or **admin** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-an-admin-user)   |   ` cyberx-xsense-system-restore`      |   `-f` `<filename>`      |

For example, for the *admin* user:

```bash
shell> system restore
Waiting for redis to start...
Redis is up
Use backup file as "/var/cyberx/backups/e2e-xsense-1664469968212-backup-version-22.2.6.318-r-71e6295-2022-09-29_18:30:20.tar" ? [Y/n]: y
WARNING - the following procedure will restore data. do not stop or power off the server machine while this procedure is running. Are you sure you wish to proceed? [Y/n]: y
...
...
watchdog started
starting components
shell>
```

### Display backup disk space allocation

The following command lists the current backup disk space allocation, including the following details:

- Backup folder location
- Backup folder size
- Backup folder limitations
- Last backup operation time
- Free disk space available for backups

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **admin**  |   `cyberx-backup-memory-check`      |   No attributes      |

For example, for the *admin* user:

```bash
shell> cyberx-backup-memory-check
2.1M    /var/cyberx/backups
Backup limit is: 20Gb
shell>
```

## Local user management

### Change local user passwords

Use the following commands to change passwords for local users on your OT sensor. The new password must be at least 8 characters, contain lowercase and uppercase, alphabetic characters, numbers and symbols.

When you change the password for the *admin* the password is changed for both SSH and web access.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**admin**  |   `system password` |  `<username>`     |

The following example shows the *admin* user's changing the password. The new password does not appear on the screen when you type it, make sure to write to make a note of it and ensure that it is correctly typed when asked to reenter the password.

```bash
shell>system password user1
Enter New Password for user1: 
Reenter Password:
shell>
```

## Network configuration

### Change networking configuration or reassign network interface roles

Use the following command to rerun the OT monitoring software configuration wizard, which helps you define or reconfigure the following OT sensor settings:

- Enable/disable SPAN monitoring interfaces
- Configure network settings for the management interface (IP, subnet, default gateway, DNS)
- Assigning a backup directory

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**admin**   |   `sudo dpkg-reconfigure iot-sensor`      |   No attributes     |

For example, with the **admin** user:

```bash
shell> sudo dpkg-reconfigure iot-sensor
```

The configuration wizard starts automatically after you run this command.
For more information, see [Install OT monitoring software](../how-to-install-software.md#install-ot-monitoring-software).

### Validate and show network interface configuration

Use the following commands to validate and show the current network interface configuration on the OT sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**admin**     |   `network validate`      |   No attributes |

For example, for the *admin* user:

```bash
shell> network validate
Success! (Appliance configuration matches the network settings)
Current Network Settings:
interface: eth0
ip: 172.20.248.69
subnet: 255.255.192.0
default gateway: 10.1.0.1
dns: 168.63.129.16
monitor interfaces mapping: local_listener=adiot0
shell>
```

### Check network connectivity from the OT sensor

Use the following command to send a ping message from the OT sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**admin**     |   `ping <IP address>`      |  No attributes|
|**cyberx**  , or **admin** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-an-admin-user)     |   `ping <IP address>`      |   No attributes |

In these commands, `<IP address>` is the IP address of a valid IPv4 network host accessible from the management port on your OT sensor.

### Locate a physical port by blinking interface lights

Use the following command to locate a specific physical interface by causing the interface lights to blink.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**admin**     |   `network blink <INT>`      | No attributes |

In this command, `<INT>` is a physical ethernet port on the appliance.

The following example shows the *admin* user blinking the *eth0* interface:

```bash
shell> network blink eth0
Blinking interface for 20 seconds ...
```

### List connected physical interfaces

Use the following command to list the connected physical interfaces on your OT sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**admin**     |   `network list`      |   No attributes |
|**cyberx**, or **admin** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-an-admin-user)     |   `ifconfig`      |   No attributes |

For example, for the *admin* user:

```bash
shell> network list
adiot0: flags=4419<UP,BROADCAST,RUNNING,PROMISC,MULTICAST>  mtu 4096
        ether be:b1:01:1f:91:88  txqueuelen 1000  (Ethernet)
        RX packets 2589575  bytes 740011013 (740.0 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1  bytes 90 (90.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.18.0.2  netmask 255.255.0.0  broadcast 172.18.255.255
        ether 02:42:ac:12:00:02  txqueuelen 0  (Ethernet)
        RX packets 22419372  bytes 5757035946 (5.7 GB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 23078301  bytes 2544599581 (2.5 GB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 837196  bytes 259542408 (259.5 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 837196  bytes 259542408 (259.5 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

shell>
```

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Defender for IoT CLI commands](references-work-with-defender-for-iot-cli-commands.md)
