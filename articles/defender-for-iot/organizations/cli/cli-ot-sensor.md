---
title:Advanced CLI reference: OT sensor appliance management - Microsoft Defender for IoT
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

>[!TIP]
>We recommend that you use the *support* user for CLI access whenever possible.

For more information, see [Access the CLI](cli-overview.md#access-the-cli) and [Privileged user access for OT monitoring](cli-overview.md#privileged-user-access-for-ot-monitoring).


## Check appliance health

Use the following commands to verify that all Defender for IoT application components on the OT sensor are working correctly, including the web console and traffic analysis processes. For further information and [health checks that can be performed from the web console](how-to-troubleshoot-the-sensor-and-on-premises-management-console).

### OT monitoring services health
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


## Power Control
### Reboot (Restart) appliance

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

### Shut down appliance

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

## Show installed software version

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

## Setup time/date and NTP
### Show current system time/date

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

### Enable NTP time sync

The ability to sync time to a specified NTP server can be enabled or disabled. Ensure the server can be reached from the appliance management port, and utilize the same time source to sync all sensors and the on-premise management console.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `ntp enable IP`      |   `IP` is a valid IPv4 NTP server using port 123      |
|**cyberx**     |   `cyberx-xsense-ntp-enable IP`      |  `IP` is a valid IPv4 NTP server using port 123      |


For example, for the *support* user:

```cli
root@xsense: ntp enable 129.6.15.28
root@xsense:
```

### Disable NTP time sync

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `ntp disable IP`      |   `IP` is a valid IPv4 NTP server using port 123      |
|**cyberx**     |   `cyberx-xsense-ntp-disable IP`      |  `IP` is a valid IPv4 NTP server using port 123      |


For example, for the *support* user:

```cli
root@xsense: ntp disable 129.6.15.28
root@xsense:
```

## Reset local user passwords

Use the following command to reset passwords for local users configured on the appliance.
This includes:
- Priviledged (*cyberx* or *support*) users with both SSH and web console access.
- Local users with access to the web console.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**     |   `cyberx-users-password-reset`      | `cyberx-users-password-reset -u <user> -p <password>`      |
|**cyberx_host  |   `passwd` | No attributes      |


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

## Network Configuration

### Validate Network interfaces
The following table describes the commands available to validate your network setup:

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `network validate`      |   Validate and show network interfaces configuration|
|**support**     |   `ping IP`      |   `IP` - a valid IPv4 network host (from management port)      |
|**support**     |   `network blink INT`      |   `INT` - a physical ehternet port on the appliance<br> Locate a connection by causing the interface lights to blink.|
|**support**     |   `network list`      |   No attibutes<br> List connected ethernet interfaces |
|**cyberx**      |   `ping IP`      |   `IP` - a valid IPv4 network host (from management port)      |
|**cyberx**     |   `ifconfig`      |   No attibutes<br> List connected ethernet interfaces |
|**cyberx**     |   `ifconfig`      |   No attibutes<br> Check if the appliance is connected to the internet |



The following example shows the *support* user blinking eth0:
```cli
root@xsense: network blink eth0
Blinking interface for 20 seconds ...
```

The following example shows the *support* user validating network configuration:
```cli
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

The following example shows the *support* user reviewing network interface statistics:
```cli
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

### Bandwidth limit for the management network interface (QoS)
Set outbound (upload) bandwidth limit for the management interface to the on-premesis management console or Azure portal in bandwidth constrained environments (for example over a satellite or serial link)

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**     |   ` cyberx-xsense-limit-interface [-h] --interface INTERFACE [--limit LIMIT] [--clear]`      |   `-h, --help` - show this help message and exit<br>  `--interface INTERFACE` - interface (e.g. eth0) <br> `--limit LIMIT` - limit value (e.g. 30kbit). kbps - Kilobytes per second, mbps - Megabytes per second, kbit -Kilobits per second, mbit - Megabits per second, bps or a bare number - Bytes per second<br>`--clear` - flag, will clear settings for the given interface|

For example, for the *cyberx* user:
```cli
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

### Network interfaces utilization
Displays network traffic and bandwidth by using the six-second tests.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**     |   `cyberx-nload`      |   No attributes     |

```cli
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

### Change networking configuration or reassign network interface roles

Use the following command to re-run the software configuration wizard which allows to set the OT sensor:
- Monitoring interfaces mapping
- Management Interface mapping and network configuration
- Assign ERSPAN interfaces
- Assign the backup directory

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**     |   `sudo dpkg-reconfigure iot-sensor`      |   No attributes     |


For example, for the **cyberx** user:
```cli
root@xsense:/# sudo dpkg-reconfigure iot-sensor
```

The configuration wizard starts. For more information, see [Install OT monitoring software](../how-to-install-software.md#install-ot-monitoring-software).

## Manage SSL and TLS certificates

Enter the following command to import SSL and TLS certificates into the sensor from the CLI (review this guide [for more information about SSL/TLS certificates](../how-to-deploy-certificates) ).

```cli
root@xsense:/# cyberx-xsense-certificate-import
```
To use the tool, you need to upload the certificate files to the device. You can do this through tools such as WinSCP or Wget. 

The command supports the following input flags:

| Flag | Description |
|--|--|
| -h | Shows the command-line help syntax. |
| --crt | The path to the certificate file (.crt extension). |
| --key | The \*.key file. Key length should be a minimum of 2,048 bits. |
| --chain | Path to the certificate chain file (optional). |
| --pass | Passphrase used to encrypt the certificate (optional). |
| --passphrase-set | The default is **False**, **unused**. <br />Set to **True** to use the previous passphrase supplied with the previous certificate (optional). | 

When you're using the tool:

- Verify that the certificate files are readable on the appliance. 
- Confirm with IT the appliance domain (as it appears in the certificate) with your DNS server and the corresponding IP address. 

## Back up and restore appliance snapshot

The following sections describe the CLI commands supported for backing up and restoring a system snapshot of your OT network sensor.
Backup includes a full snapshot of the sensor state including: configuration, baseline, inventory and logs.

>[!WARNING]
>Do not interrupt a system backup or restore operation as this may cause the system to become unusable

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

### Allocation of backup diskspace
Provides the status of the backup allocation, displaying the following:

- Location of the backup folder
- Size of the backup folder
- Limitations of the backup folder
- Time of last backup operation
- Free diskspace available for backups

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**     |   ` cyberx-backup-memory-check`      |   No attributes      |

```cli
root@xsense:/# cyberx-backup-memory-check
2.1M    /var/cyberx/backups
Backup limit is: 20Gb
root@xsense:/#
```

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


## Next steps


For more information, see [Getting started with the Defender for IoT CLI](cli-overview.md).
