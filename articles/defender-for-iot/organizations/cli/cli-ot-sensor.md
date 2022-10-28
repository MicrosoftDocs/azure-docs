---
title: Advanced CLI reference for OT sensor appliance management - Microsoft Defender for IoT
description: Learn about the CLI commands available for managing the Defender for IoT on-premises applications.
ms.date: 09/07/2022
ms.topic: reference
---

# Advanced CLI reference: OT sensor appliance management

This article lists the CLI commands available for managing the OT network sensor appliance and Defender for IoT software applications.

Command syntax differs depending on the user performing the command, as indicated below for each activity.

## Prerequisites

Before you can run any of the following CLI commands, you'll need access to the CLI on your OT network sensor as a privileged user.

Each activity listed below is accessible by a different set of privileged users, including the *cyberx*, *support*, or *cyber_x_host* users. Command syntax is listed only for the users supported for a specific activity.

>[!IMPORTANT]
> We recommend that you use the *support* user for CLI access whenever possible.

For more information, see [Access the CLI](cli-overview.md#access-the-cli) and [Privileged user access for OT monitoring](cli-overview.md#privileged-user-access-for-ot-monitoring).


## Check OT monitoring services health

Use the following commands to verify that all Defender for IoT application components on the OT sensor are working correctly, including the web console and traffic analysis processes.

Health checks are also available from the OT sensor console. For more information, see [Troubleshoot the sensor and on-premises management console](../how-to-troubleshoot-the-sensor-and-on-premises-management-console.md).

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system sanity`      |  No attributes      |
|**cyberx**     |   `cyberx-xsense-sanity`      |   No attributes     |


The following example shows the command syntax and response for the *support* user:

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

## Restart and shutdown an appliance

### Restart an appliance

Use the following commands to restart the OT sensor appliance.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system reboot`      |   No attributes     |
|**cyberx**     |   `sudo reboot`      |   No attributes      |
|**cyberx_host**     |   `sudo reboot`      |   No attributes      |


For example, for the *support* user:

```bash
root@xsense: system reboot
```

### Shut down an appliance

Use the following commands to shut down the OT sensor appliance.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system shutdown`      |   No attributes      |
|**cyberx**     |   `sudo shutdown -r now`      |   No attributes      |
|**cyberx_host**     |   `sudo shutdown -r now`      |   No attributes      |


For example, for the *support* user:

```bash
root@xsense: system shutdown
```

## Show installed software version

Use the following commands to list the Defender for IoT software version installed on your OT sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system version`      |   No attributes      |
|**cyberx**     |   `cyberx-xsense-version`      |   No attributes      |


For example, for the *support* user:

```bash
root@xsense: system version
Version: 22.2.5.9-r-2121448
```

## Manage date, time, and NTP settings

### Show current system date/time

Use the following commands to show the current system date and time on your OT network sensor, in GMT format.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `date`      |   No attributes      |
|**cyberx**     |   `date`      |   No attributes      |
|**cyberx_host**     |   `date`      |  No attributes    |


For example, for the *support* user:

```bash
root@xsense: date
Thu Sep 29 18:38:23 UTC 2022
root@xsense:
```

### Turn on NTP time sync

Use the following commands to turn on synchronization for the appliance time with an NTP server.

To use these commands, make sure that:

- The NTP server can be reached from the appliance management port
- You use the same NTP server to synchronize all sensor appliances and the on-premises management console

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `ntp enable <IP address>`      |  No attributes |
|**cyberx**     |   `cyberx-xsense-ntp-enable <IP address>`      |  No attributes      |

In these commands, `<IP address>` is the IP address of a valid IPv4 NTP server using port 123.

For example, for the *support* user:

```bash
root@xsense: ntp enable 129.6.15.28
root@xsense:
```

### Turn off NTP time sync

Use the following commands to turn off the synchronization for the appliance time with an NTP server.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `ntp disable <IP address>`      |   No attributes      |
|**cyberx**     |   `cyberx-xsense-ntp-disable <IP address>`      |  No attributes |

In these commands, `<IP address>` is the IP address of a valid IPv4 NTP server using port 123.

For example, for the *support* user:

```bash
root@xsense: ntp disable 129.6.15.28
root@xsense:
```

## Local Login & Passwords
### Reset local user passwords

Use the following commands to reset passwords for local users on your OT sensor.

- To reset the password for the *cyberx* or *support* user. Passwords will be reset for both SSH and web access.
- To reset the password for locally defined users accessing the local management web-interface.


|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**     |   `cyberx-users-password-reset`      | `cyberx-users-password-reset -u <user> -p <password>`      |


The following example shows the *cyberx* user resetting the *support* user's password to `jI8iD9kE6hB8qN0h`:

```bash
root@xsense:/# cyberx-users-password-reset -u support -p jI8iD9kE6hB8qN0h
resetting the password of OS user "support"
Sending USER_PASSWORD request to OS manager
Open UDS connection with /var/cyberx/system/os_manager.sock
Received data: b'ack'
resetting the password of UI user "support"
root@xsense:/#
```

The *cyberx_host* user can be changed after a successful login with the following command:

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx_host**  |   `passwd` | No attributes   |

For example with the cyberx_host user:

```bash
cyberx_host@xsense:/# passwd
Changing password for user cyberx_host.
(current) UNIX password:
New password:
Retype new password:
passwd: all authentication tokens updated successfully.
cyberx_host@xsense:/#
```

### Adjust protection against failed logins

In the case of too many failed logins, the failed logins protection mechanism will disallow any user from logging in from that IP address.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**  |   `nano /var/cyberx/components/xsense-web/cyberx_web/settings.py` | No attributes   |

1. By using SSH, log in as **cyberx** to sensor

1. To change the setting, run the following command: <br>`nano /var/cyberx/components/xsense-web/cyberx_web/settings.py`

1. Set  `"MAX_FAILED_LOGINS = 5"` to a desired value (eg. 10, 20 up to 100), taking into account the number of concurrent users.

1. Write to the file and exit

1. To apply changes, run the following command: `sudo monit restart all`


## Validate network settings

### Validate and show network interface configuration

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `network validate`      |   No attributes |

For example, for the *support* user:

```bash
root@xsense: network validate
Success! (Appliance configuration matches the network settings)
Current Network Settings:
interface: eth0
ip: 172.20.248.69
subnet: 255.255.192.0
default gateway: 10.1.0.1
dns: 168.63.129.16
monitor interfaces mapping: local_listener=adiot0
root@xsense:
```

### Check network connectivity from the OT sensor

Use the following commands to send a ping message from the OT sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `ping <IP address>`      |  No attributes|
|**cyberx**      |   `ping <IP address>`      |   No attributes |

In these commands, `<IP address>` is the IP address of a valid IPv4 network host accessible from the management port on your OT sensor.

### Locate a physical port by blinking interface lights

Use the following command to locate a specific physical interface by causing the interface lights to blink.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `network blink <INT>`      | No attributes |

In this command, `<INT>` is a physical ethernet port on the appliance.

The following example shows the *support* user blinking the *eth0* interface:

```bash
root@xsense: network blink eth0
Blinking interface for 20 seconds ...
```

### List connected physical interfaces

Use the following commands to list the connected physical interfaces on your OT sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `network list`      |   No attributes |
|**cyberx**     |   `ifconfig`      |   No attributes |

For example, for the *support* user:

```bash
root@xsense: network list
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

root@xsense:
```

### Check internet connection

Use the following command to check the internet connectivity on your appliance.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**     |   `cyberx-xsense-internet-connectivity`      |   No attributes |

```bash
root@xsense:/# cyberx-xsense-internet-connectivity
Checking internet connectivity...
The machine was successfully able to connect the internet.
root@xsense:/#
```

### Check network interface current load

Use the following command to display network traffic and bandwidth using a six-second test.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**     |   `cyberx-nload`      |   No attributes     |

```bash
root@xsense:/# cyberx-nload
eth0:
        Received: 66.95 KBit/s Sent: 87.94 KBit/s
        Received: 58.95 KBit/s Sent: 107.25 KBit/s
        Received: 43.67 KBit/s Sent: 107.86 KBit/s
        Received: 87.00 KBit/s Sent: 191.47 KBit/s
        Received: 79.71 KBit/s Sent: 85.45 KBit/s
        Received: 54.68 KBit/s Sent: 48.77 KBit/s
local_listener (virtual adiot0):
        Received: 0.0 Bit Sent: 0.0 Bit
        Received: 0.0 Bit Sent: 0.0 Bit
        Received: 0.0 Bit Sent: 0.0 Bit
        Received: 0.0 Bit Sent: 0.0 Bit
        Received: 0.0 Bit Sent: 0.0 Bit
        Received: 0.0 Bit Sent: 0.0 Bit
root@xsense:/#
```

## Configure network settings

### Set bandwidth limit for the management network interface

Use the following command to set the outbound bandwidth limit for uploads from the OT sensor's management interface to the Azure portal or an on-premises management console.

Setting outbound bandwidth limits can be helpful in maintaining networking quality of service (QoS). This command is supported only in bandwidth-constrained environments, such as over a satellite or serial link.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**     |  `cyberx-xsense-limit-interface` |  `cyberx-xsense-limit-interface [-h] --interface <INTERFACE VALUE> [--limit <LIMIT VALUE] [--clear]`    |

In this command:

- `-h` or `--help`: Shows the command help syntax

- `--interface <INTERFACE VALUE>`: Is the interface you you want to limit, such as `eth0`

- `--limit <LIMIT VALUE>`: The limit you want to set, such as `30kbit`. Use one of the following units:

    - `kbps`: Kilobytes per second
    - `mbps`: Megabytes per second
    - `kbit`: Kilobits per second
    - `mbit`: Megabits per second
    - `bps` or a bare number: Bytes per second

- `--clear`: Clears all settings for the specified interface


For example, for the *cyberx* user:

```bash
root@xsense:/# cyberx-xsense-limit-interface -h
usage: cyberx-xsense-limit-interface [-h] --interface INTERFACE [--limit LIMIT] [--clear]

optional arguments:
  -h, --help            show this help message and exit
  --interface INTERFACE
                        interface (e.g. eth0)
  --limit LIMIT         limit value (e.g. 30kbit). kbps - Kilobytes per second, mbps - Megabytes per second, kbit -
                        Kilobits per second, mbit - Megabits per second, bps or a bare number - Bytes per second
  --clear               flag, will clear settings for the given interface
root@xsense:/#
root@xsense:/# cyberx-xsense-limit-interface --interface eth0 --limit 1000mbps
setting the bandwidth limit of interface "eth0" to 1000mbps
```


### Change networking configuration or reassign network interface roles

Use the following command to re-run the OT monitoring software configuration wizard, which helps you define the following OT sensor settings:

- Mapping monitoring interfaces
- Mapping and configuring network settings for the management interface
- Assigning ERSPAN interfaces
- Assigning a backup directory

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx_host**     |   `sudo dpkg-reconfigure iot-sensor`      |   No attributes     |

For example with the **cyberx_host** user:

```bash
root@xsense:/# sudo dpkg-reconfigure iot-sensor
```

The configuration wizard starts automatically after you run this command. 
For more information, see [Install OT monitoring software](../how-to-install-software.md#install-ot-monitoring-software).

## Manage SSL and TLS certificates
### Set up SSL certificates by CLI
Use the following command to import SSL and TLS certificates to the sensor from the CLI.

To use this command:

- Verify that the certificate file you want to import is readable on the appliance. Upload certificate files to the appliance using tools such as WinSCP or Wget.
- Confirm with your IT office that the appliance domain as it appears in the certificate is correct for your DNS server and the corresponding IP address.

For more information, see [Certificates for appliance encryption and authentication (OT appliances)](../how-to-deploy-certificates.md).

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **cyberx** | `cyberx-xsense-certificate-import` | cyberx-xsense-certificate-import [-h] [--crt &lt;PATH&gt;] [--key &lt;FILE NAME&gt;] [--chain &lt;PATH&gt;] [--pass &lt;PASSPHRASE&gt;] [--passphrase-set &lt;VALUE&gt;]`

In this command:

- `-h`: Shows the full command help syntax
- `--crt`: The path to the certificate file you want to upload, with a `.crt` extension
- `--key`: The `\*.key` file you want to use for the certificate. Key length must be a minimum of 2,048 bits
- `--chain`: The path to a certificate chain file. Optional.
- `--pass`: A passphrase used to encrypt the certificate. Optional.
- `--passphrase-set`: Unused and set to *False* by default. Set to *True* to use passphrase supplied with the previous certificate. Optional.

For example, for the *cyberx* user:

```bash
root@xsense:/# cyberx-xsense-certificate-import
```

<!--better example with attributes showing and also response?-->

### Restore default self-signed certificate by CLI
Use this command in order to restore the default self-signed certificates on the appliance (This should be used only for troubleshooting and not production environments).

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**     |   `cyberx-xsense-create-self-signed-certificate`      |   No attributes     |

For example, for the *cyberx* user:

```bash
root@xsense:/# cyberx-xsense-create-self-signed-certificate
Creating a self-signed certificate for Apache2...
random directory name for the new certificate is 348
Generating a RSA private key
................+++++
....................................+++++
writing new private key to '/var/cyberx/keys/certificates/348/apache.key'
-----
executing a query to add the certificate to db
finished
root@xsense:/#
```

## Upgrade sensor software from CLI

In this procedure, you will learn how to update the OT sensor software through the command line interface.

1. Transfer the upgrade file to the sensor (sftp or scp can be used)<br><br>Login as `cyberx_host` user and Transfer the file to  `/opt/sensor/logs/`
 
1. Login as cyberx user <br>Move the file to the location accessible for the upgrade process
```bash
cd /var/host-logs/ 
mv <filename> /var/cyberx/media/device-info/update_agent.tar
```
1. Start the upgrade process:<br>
```bash
curl -X POST http://127.0.0.1:9090/core/api/v1/configuration/agent
```

1. Monitoring the upgrade progress has started<br>
```bash
tail -f /var/cyberx/logs/upgrade.log
```
Output will appear similar to the example below<br>

```bash
2022-05-23 15:39:00,632 [http-nio-0.0.0.0-9090-exec-2] INFO  com.cyberx.infrastructure.common.utils.UpgradeUtils- [32200] Extracting upgrade package from /var/cyberx/media/device-info/update_agent.tar to /var/cyberx/media/device-info/update

2022-05-23 15:39:33,180 [http-nio-0.0.0.0-9090-exec-2] INFO  com.cyberx.infrastructure.common.utils.UpgradeUtils- [32200] Prepared upgrade, scheduling in 30 seconds

2022-05-23 15:40:03,181 [pool-34-thread-1] INFO  com.cyberx.infrastructure.common.utils.UpgradeUtils- [32200] Send upgrade request to os-manager. file location: /var/cyberx/media/device-info/update
```
1. During the upgrade, ssh will disconnect - an indication that it is running.<br>

1. Monitoring the upgrade process is possible using the following command (login as `cyberx_host`)<br>

```bash
tail -f /opt/sensor/logs/install.log
```

## Back up and restore appliance snapshot

The following sections describe the CLI commands supported for backing up and restoring a system snapshot of your OT network sensor.

Backup files include a full snapshot of the sensor state, including configuration settings, baseline values, inventory data, and logs.

>[!CAUTION]
> Do not interrupt a system backup or restore operation as this may cause the system to become unusable.

### List current backup files

Use the following commands to list the backup files currently stored on your OT network sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system backup-list`      |   No attributes      |
|**cyberx**     |   ` cyberx-xsense-system-backup-list`      |   No attributes      |


For example, for the *support* user:

```bash
root@xsense: system backup-list
backup files:
        e2e-xsense-1664469968212-backup-version-22.3.0.318-r-71e6295-2022-09-29_18:30:20.tar
        e2e-xsense-1664469968212-backup-version-22.3.0.318-r-71e6295-2022-09-29_18:29:55.tar
root@xsense:
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
|**cyberx**     |   ` cyberx-backup-memory-check`      |   No attributes      |

For example, for the *cyberx* user:

```bash
root@xsense:/# cyberx-backup-memory-check
2.1M    /var/cyberx/backups
Backup limit is: 20Gb
root@xsense:/#
```

### Start an immediate, unscheduled backup

Use the following commands to start an immediate, unscheduled backup of the data on your OT sensor. For more information, see [Set up backup and restore files](../how-to-manage-individual-sensors.md#set-up-backup-and-restore-files).

> [!CAUTION]
> Make sure not to stop or power off the appliance while backing up data.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system backup`      |   No attributes      |
|**cyberx**     |   ` cyberx-xsense-system-backup`      |   No attributes      |


For example, for the *support* user:

```bash
root@xsense: system backup
Backing up DATA_KEY
...
...
Finished backup. Backup is stored at /var/cyberx/backups/e2e-xsense-1664469968212-backup-version-22.2.6.318-r-71e6295-2022-09-29_18:29:55.tar
Setting backup status 'SUCCESS' in redis
root@xsense:
```

### Restore data from the most recent backup

Use the following commands to restore data on your OT network sensor using the most recent backup file. When prompted, confirm that you want to proceed.

> [!CAUTION]
> Make sure not to stop or power off the appliance while restoring data.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system restore`      |   No attributes      |
|**cyberx**     |   ` cyberx-xsense-system-restore`      |   No attributes      |


For example, for the *support* user:

```bash
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


## Next steps


For more information, see [Getting started with the Defender for IoT CLI](cli-overview.md).
