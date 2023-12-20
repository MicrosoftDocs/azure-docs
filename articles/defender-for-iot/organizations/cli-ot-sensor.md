---
title: CLI command reference from OT network sensors- Microsoft Defender for IoT
description: Learn about the CLI commands available from Microsoft Defender for IoT OT network sensors.
ms.date: 08/09/2023
ms.topic: reference
---

# CLI command reference from OT network sensors

This article lists the CLI commands available from Defender for IoT OT network sensors.

[!INCLUDE [caution do not use manual configurations](includes/caution-manual-configurations.md)]

## Prerequisites

Before you can run any of the following CLI commands, you'll need access to the CLI on your OT network sensor as a *support* user.

For more information, see [Access the CLI](../references-work-with-defender-for-iot-cli-commands.md#access-the-cli) and [Privileged user access for OT monitoring](../references-work-with-defender-for-iot-cli-commands.md#privileged-user-access-for-ot-monitoring).

OT sensor versions earlier than 23.1.x also include the *cyberx* and *cyberx_host* privileged users. In versions 23.1.x and higher, these users are installed, but not enabled by default.

While this article lists the command syntax for each user, we recommend using the *support* user for all CLI commands where the *support* user is supported.

For more information, see [Default privileged users](manage-users-sensor.md#default-privileged-users).

## Appliance maintenance

### Check OT monitoring services health

Use the following commands to verify that the Defender for IoT application on the OT sensor is working correctly, including the web console and traffic analysis processes.

Health checks are also available from the OT sensor console. For more information, see [Troubleshoot the sensor](how-to-troubleshoot-sensor.md).

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system sanity`      |  No attributes      |
|**cyberx**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)   |   `cyberx-xsense-sanity`      |   No attributes     |


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


### Restart and shutdown

#### Restart an appliance

Use the following commands to restart the OT sensor appliance.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system reboot`      |   No attributes     |
|**cyberx**  , or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)    |   `sudo reboot`      |   No attributes      |
|**cyberx_host**  , or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)    |   `sudo reboot`      |   No attributes      |


For example, for the *support* user:

```bash
root@xsense: system reboot
```

#### Shut down an appliance

Use the following commands to shut down the OT sensor appliance.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system shutdown`      |   No attributes      |
|**cyberx**  , or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)    |   `sudo shutdown -r now`      |   No attributes      |
|**cyberx_host**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)     |   `sudo shutdown -r now`      |   No attributes      |


For example, for the *support* user:

```bash
root@xsense: system shutdown
```

### Software versions

#### Show installed software version

Use the following commands to list the Defender for IoT software version installed on your OT sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system version`      |   No attributes      |
|**cyberx**  , or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)    |   `cyberx-xsense-version`      |   No attributes      |


For example, for the *support* user:

```bash
root@xsense: system version
Version: 22.2.5.9-r-2121448
```

#### Update sensor software from CLI

For more information, see [Update your sensors](update-ot-software.md#update-ot-sensors).

### Date, time, and NTP

#### Show current system date/time

Use the following commands to show the current system date and time on your OT network sensor, in GMT format.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `date`      |   No attributes      |
|**cyberx**  , or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)    |   `date`      |   No attributes      |
|**cyberx_host**  , or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)    |   `date`      |  No attributes    |


For example, for the *support* user:

```bash
root@xsense: date
Thu Sep 29 18:38:23 UTC 2022
root@xsense:
```

#### Turn on NTP time sync

Use the following commands to turn on synchronization for the appliance time with an NTP server.

To use these commands, make sure that:

- The NTP server can be reached from the appliance management port
- You use the same NTP server to synchronize all sensor appliances and the on-premises management console

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `ntp enable <IP address>`      |  No attributes |
|**cyberx**  , or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)    |   `cyberx-xsense-ntp-enable <IP address>`      |  No attributes      |

In these commands, `<IP address>` is the IP address of a valid IPv4 NTP server using port 123.

For example, for the *support* user:

```bash
root@xsense: ntp enable 129.6.15.28
root@xsense:
```

#### Turn off NTP time sync

Use the following commands to turn off the synchronization for the appliance time with an NTP server.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `ntp disable <IP address>`      |   No attributes      |
|**cyberx**  , or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)    |   `cyberx-xsense-ntp-disable <IP address>`      |  No attributes |

In these commands, `<IP address>` is the IP address of a valid IPv4 NTP server using port 123.

For example, for the *support* user:

```bash
root@xsense: ntp disable 129.6.15.28
root@xsense:
```

## Backup and restore

The following sections describe the CLI commands supported for backing up and restoring a system snapshot of your OT network sensor.

Backup files include a full snapshot of the sensor state, including configuration settings, baseline values, inventory data, and logs.

>[!CAUTION]
> Do not interrupt a system backup or restore operation as this may cause the system to become unusable.

### List current backup files

Use the following commands to list the backup files currently stored on your OT network sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system backup-list`      |   No attributes      |
|**cyberx**  , or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)    |   ` cyberx-xsense-system-backup-list`      |   No attributes      |


For example, for the *support* user:

```bash
root@xsense: system backup-list
backup files:
        e2e-xsense-1664469968212-backup-version-22.3.0.318-r-71e6295-2022-09-29_18:30:20.tar
        e2e-xsense-1664469968212-backup-version-22.3.0.318-r-71e6295-2022-09-29_18:29:55.tar
root@xsense:
```


### Start an immediate, unscheduled backup

Use the following commands to start an immediate, unscheduled backup of the data on your OT sensor. For more information, see [Set up backup and restore files](../how-to-manage-individual-sensors.md#set-up-backup-and-restore-files).

> [!CAUTION]
> Make sure not to stop or power off the appliance while backing up data.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `system backup`      |   No attributes      |
|**cyberx**  , or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)    |   ` cyberx-xsense-system-backup`      |   No attributes      |


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
|**cyberx**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)   |   ` cyberx-xsense-system-restore`      |   `-f` `<filename>`      |


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


### Display backup disk space allocation

The following command lists the current backup disk space allocation, including the following details:

- Backup folder location
- Backup folder size
- Backup folder limitations
- Last backup operation time
- Free disk space available for backups

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)     |   ` cyberx-backup-memory-check`      |   No attributes      |

For example, for the *cyberx* user:

```bash
root@xsense:/# cyberx-backup-memory-check
2.1M    /var/cyberx/backups
Backup limit is: 20Gb
root@xsense:/#
```


## TLS/SSL certificates


### Import TLS/SSL certificates to your OT sensor

Use the following command to import TLS/SSL certificates to the sensor from the CLI.

To use this command:

- Verify that the certificate file you want to import is readable on the appliance. Upload certificate files to the appliance using tools such as WinSCP or Wget.
- Confirm with your IT office that the appliance domain as it appears in the certificate is correct for your DNS server and the corresponding IP address.

For more information, see [Prepare CA-signed certificates](best-practices/plan-prepare-deploy.md#prepare-ca-signed-certificates) and [Create SSL/TLS certificates for OT appliances](ot-deploy/create-ssl-certificates.md).

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **cyberx**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user) | `cyberx-xsense-certificate-import` | cyberx-xsense-certificate-import [-h] [--crt &lt;PATH&gt;] [--key &lt;FILE NAME&gt;] [--chain &lt;PATH&gt;] [--pass &lt;PASSPHRASE&gt;] [--passphrase-set &lt;VALUE&gt;]`

In this command:

- `-h`: Shows the full command help syntax
- `--crt`: The path to the certificate file you want to upload, with a `.crt` extension
- `--key`: The `\*.key` file you want to use for the certificate. Key length must be a minimum of 2,048 bits
- `--chain`: The path to a certificate chain file. Optional.
- `--pass`: A passphrase used to encrypt the certificate. Optional. 

    The following characters are supported for creating a key or certificate with a passphrase:
    - ASCII characters, including **a-z**, **A-Z**, **0-9**
    - The following special characters: **! #  % ( ) + , - . /  :  =  ?  @  [  \  ]  ^  _  {  }  ~**
- `--passphrase-set`: Unused and set to *False* by default. Set to *True* to use passphrase supplied with the previous certificate. Optional.

For example, for the *cyberx* user:

```bash
root@xsense:/# cyberx-xsense-certificate-import
```

### Restore the default self-signed certificate

Use the following command to restore the default, self-signed certificates on your sensor appliance. We recommend that you use this activity for troubleshooting only, and not on production environments.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)     |   `cyberx-xsense-create-self-signed-certificate`      |   No attributes     |

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


## Local user management

### Change local user passwords

Use the following commands to change passwords for local users on your OT sensor.

When you change the password for the *cyberx*, *support*, or *cyberx_host* user, the password is changed for both SSH and web access.


|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**  , or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)    |   `cyberx-users-password-reset`      | `cyberx-users-password-reset -u <user> -p <password>`      |
|**cyberx_host**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)  |   `passwd` | No attributes   |


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

The following example shows the *cyberx_host* user changing the *cyberx_host* user's password.

```bash
cyberx_host@xsense:/# passwd
Changing password for user cyberx_host.
(current) UNIX password:
New password:
Retype new password:
passwd: all authentication tokens updated successfully.
cyberx_host@xsense:/#
```


### Control user session timeouts

Define the time after which users are automatically signed out of the OT sensor. Define this value in a properties file saved on the sensor.
not that
For more information, see [Control user session timeouts](manage-users-sensor.md#control-user-session-timeouts).

### Define maximum number of failed sign-ins

Define the number of maximum failed sign-ins before an OT sensor will prevent the user from signing in again from the same IP address. Define this value in a properties file saved on the sensor.

For more information, see [Define maximum number of failed sign-ins](manage-users-sensor.md#define-maximum-number-of-failed-sign-ins).

## Network configuration

### Network settings

#### Change networking configuration or reassign network interface roles

Use the following command to rerun the OT monitoring software configuration wizard, which helps you define or reconfigure the following OT sensor settings:

- Enable/disable SPAN monitoring interfaces
- Configure network settings for the management interface (IP, subnet, default gateway, DNS)
- Assigning a backup directory

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx_host**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)      |   `sudo dpkg-reconfigure iot-sensor`      |   No attributes     |

For example, with the **cyberx_host** user:

```bash
root@xsense:/# sudo dpkg-reconfigure iot-sensor
```

The configuration wizard starts automatically after you run this command.
For more information, see [Install OT monitoring software](../how-to-install-software.md#install-ot-monitoring-software).


#### Validate and show network interface configuration

Use the following commands to validate and show the current network interface configuration on the OT sensor.

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

### Network connectivity
#### Check network connectivity from the OT sensor

Use the following commands to send a ping message from the OT sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `ping <IP address>`      |  No attributes|
|**cyberx**  , or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)     |   `ping <IP address>`      |   No attributes |

In these commands, `<IP address>` is the IP address of a valid IPv4 network host accessible from the management port on your OT sensor.

#### Check network interface current load

Use the following command to display network traffic and bandwidth using a six-second test.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**  , or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)   |   `cyberx-nload`      |   No attributes     |

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

#### Check internet connection

Use the following command to check the internet connectivity on your appliance.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)     |   `cyberx-xsense-internet-connectivity`      |   No attributes |

```bash
root@xsense:/# cyberx-xsense-internet-connectivity
Checking internet connectivity...
The machine was successfully able to connect the internet.
root@xsense:/#
```


### Set bandwidth limit for the management network interface

Use the following command to set the outbound bandwidth limit for uploads from the OT sensor's management interface to the Azure portal or an on-premises management console.

Setting outbound bandwidth limits can be helpful in maintaining networking quality of service (QoS). This command is supported only in bandwidth-constrained environments, such as over a satellite or serial link.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)     |  `cyberx-xsense-limit-interface` |  `cyberx-xsense-limit-interface [-h] --interface <INTERFACE VALUE> [--limit <LIMIT VALUE] [--clear]`    |

In this command:

- `-h` or `--help`: Shows the command help syntax

- `--interface <INTERFACE VALUE>`: Is the interface you want to limit, such as `eth0`

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




### Physical interfaces

#### Locate a physical port by blinking interface lights

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

#### List connected physical interfaces

Use the following commands to list the connected physical interfaces on your OT sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `network list`      |   No attributes |
|**cyberx**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)     |   `ifconfig`      |   No attributes |

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

## Traffic capture filters


To reduce alert fatigue and focus your network monitoring on high priority traffic, you may decide to filter the traffic that streams into Defender for IoT at the source. Capture filters allow you to block high-bandwidth traffic at the hardware layer, optimizing both appliance performance and resource usage.

Use include an/or exclude lists to create and configure capture filters on your OT network sensors, making sure that you don't block any of the traffic that you want to monitor.

The basic use case for capture filters uses the same filter for all Defender for IoT components. However, for advanced use cases, you may want to configure separate filters for each of the following Defender for IoT components:

- `horizon`: Captures deep packet inspection (DPI) data
- `collector`: Captures PCAP data
- `traffic-monitor`: Captures communication statistics

> [!NOTE]
> - Capture filters don't apply to [Defender for IoT malware alerts](../alert-engine-messages.md#malware-engine-alerts), which are triggered on all detected network traffic.
>
> - The capture filter command has a character length limit that's based on the complexity of the capture filter definition and the available network interface card capabilities. If your requested filter commmand fails, try grouping subnets into larger scopes and using a shorter capture filter command.

### Create a basic filter for all components

The method used to configure a basic capture filter differs, depending on the user performing the command:

- **cyberx** user: Run the specified command with specific attributes to configure your capture filter.
- **support** user: Run the specified command, and then enter values as [prompted by the CLI](#create-a-basic-capture-filter-using-the-support-user), editing your include and exclude lists in a nano editor.

Use the following commands to create a new capture filter:

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **support** | `network capture-filter` | No attributes.|
| **cyberx**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user) | `cyberx-xsense-capture-filter` | `cyberx-xsense-capture-filter [-h] [-i INCLUDE] [-x EXCLUDE] [-etp EXCLUDE_TCP_PORT] [-eup EXCLUDE_UDP_PORT] [-itp INCLUDE_TCP_PORT] [-iup INCLUDE_UDP_PORT] [-vlan INCLUDE_VLAN_IDS] -m MODE [-S]`   |

Supported attributes for the *cyberx* user are defined as follows:

|Attribute  |Description  |
|---------|---------|
|`-h`, `--help`     |  Shows the help message and exits.      |
|`-i <INCLUDE>`, `--include <INCLUDE>`     |  The path to a file that contains the devices and subnet masks you want to include, where `<INCLUDE>` is the path to the file. For example, see [Sample include or exclude file](#txt).   |
|`-x EXCLUDE`, `--exclude EXCLUDE`     |  The path to a file that contains the devices and subnet masks you want to exclude, where `<EXCLUDE>` is the path to the file. For example, see [Sample include or exclude file](#txt).      |
|- `-etp <EXCLUDE_TCP_PORT>`, `--exclude-tcp-port <EXCLUDE_TCP_PORT>`     | Excludes TCP traffic on any specified ports, where the `<EXCLUDE_TCP_PORT>` defines the port or ports you want to exclude. Delimitate multiple ports by commas, with no spaces.        |
|`-eup <EXCLUDE_UDP_PORT>`, `--exclude-udp-port <EXCLUDE_UDP_PORT>`     |   Excludes UDP traffic on any specified ports, where the `<EXCLUDE_UDP_PORT>` defines the port or ports you want to exclude. Delimitate multiple ports by commas, with no spaces.              |
|`-itp <INCLUDE_TCP_PORT>`, `--include-tcp-port <INCLUDE_TCP_PORT>`     |   Includes TCP traffic on any specified ports, where the `<INCLUDE_TCP_PORT>` defines the port or ports you want to include. Delimitate multiple ports by commas, with no spaces.                   |
|`-iup <INCLUDE_UDP_PORT>`, `--include-udp-port <INCLUDE_UDP_PORT>`     |  Includes UDP traffic on any specified ports, where the `<INCLUDE_UDP_PORT>` defines the port or ports you want to include. Delimitate multiple ports by commas, with no spaces.                    |
|`-vlan <INCLUDE_VLAN_IDS>`, `--include-vlan-ids <INCLUDE_VLAN_IDS>`     |  Includes VLAN traffic by specified VLAN IDs, `<INCLUDE_VLAN_IDS>` defines the VLAN ID or IDs you want to include. Delimitate multiple VLAN IDs by commas, with no spaces.                          |
|`-p <PROGRAM>`, `--program <PROGRAM>`     | Defines the component for which you want to configure a capture filter. Use `all` for basic use cases, to create a single capture filter for all components. <br><br>For advanced use cases, create separate capture filters for each component. For more information, see [Create an advanced filter for specific components](#create-an-advanced-filter-for-specific-components).|
|`-m <MODE>`, `--mode <MODE>`     | Defines an include list mode, and is relevant only when an include list is used. Use one of the following values: <br><br>- `internal`: Includes all communication between the specified source and destination <br>- `all-connected`: Includes all communication between either of the specified endpoints and external endpoints. <br><br>For example, for endpoints A and B, if you use the `internal` mode, included traffic will only include communications between endpoints **A** and **B**. <br>However, if you use the `all-connected` mode, included traffic will include all communications between A *or* B and other, external endpoints. |

<a name="txt"></a>**Sample include or exclude file**

For example, an include or exclude **.txt** file might include the following entries:

```txt
192.168.50.10
172.20.248.1
```

#### Create a basic capture filter using the support user

If you're creating a basic capture filter as the *support* user, no attributes are passed in the [original command](#create-a-basic-filter-for-all-components). Instead, a series of prompts is displayed to help you create the capture filter interactively.

Reply to the prompts displayed as follows:

1. `Would you like to supply devices and subnet masks you wish to include in the capture filter? [Y/N]:`

    Select `Y` to open a new include file, where you can add a device, channel, and/or subnet that you want to include in monitored traffic. Any other traffic, not listed in your include file, isn't ingested to Defender for IoT.

    The include file is opened in the [Nano](https://www.nano-editor.org/dist/latest/cheatsheet.html) text editor.  In the include file, define devices, channels, and subnets as follows:

    |Type  |Description  |Example  |
    |---------|---------|---------|
    |**Device**     |   Define a device by its IP address.      |    `1.1.1.1` includes all traffic for this device.     |
    |**Channel**    |    Define a channel by the IP addresses of its source and destination devices, separated by a comma.     |   `1.1.1.1,2.2.2.2` includes all of the traffic for this channel.      |
    |**Subnet**     |    Define a subnet by its network address.     |   `1.1.1` includes all traffic for this subnet.      |
    |**Subnet channel**     |    Define subnet channel network addresses for the source and destination subnets.     |   `1.1.1,2.2.2` includes all of the traffic between these subnets.      |

    List multiple arguments in separate rows.

1. `Would you like to supply devices and subnet masks you wish to exclude from the capture filter? [Y/N]:`

    Select `Y` to open a new exclude file where you can add a device, channel, and/or subnet that you want to exclude from monitored traffic. Any other traffic, not listed in your exclude file, is ingested to Defender for IoT.

    The exclude file is opened in the [Nano](https://www.nano-editor.org/dist/latest/cheatsheet.html) text editor.  In the exclude file, define devices, channels, and subnets as follows:

    |Type  |Description  |Example  |
    |---------|---------|---------|
    | **Device** | Define a device by its IP address. | `1.1.1.1` excludes all traffic for this device. |
    | **Channel** | Define a channel by the IP addresses of its source and destination devices, separated by a comma. | `1.1.1.1,2.2.2.2` excludes all of the traffic between these devices. |
    | **Channel by port** | Define a channel by the IP addresses of its source and destination devices, and the traffic port. | `1.1.1.1,2.2.2.2,443` excludes all of the traffic between these devices and using the specified port.|
    | **Subnet** | Define a subnet by its network address. | `1.1.1` excludes all traffic for this subnet. |
    | **Subnet channel** | Define subnet channel network addresses for the source and destination subnets. | `1.1.1,2.2.2` excludes all of the traffic between these subnets. |

    List multiple arguments in separate rows.

1. Reply to the following prompts to define any TCP or UDP ports to include or exclude. Separate multiple ports by comma, and press ENTER to skip any specific prompt.

    - `Enter tcp ports to include (delimited by comma or Enter to skip):`
    - `Enter udp ports to include (delimited by comma or Enter to skip):`
    - `Enter tcp ports to exclude (delimited by comma or Enter to skip):`
    - `Enter udp ports to exclude (delimited by comma or Enter to skip):`
    - `Enter VLAN ids to include (delimited by comma or Enter to skip):`

    For example, enter multiple ports as follows: `502,443`

1. `In which component do you wish to apply this capture filter?`

    Enter `all` for a basic capture filter. For [advanced use cases](#create-an-advanced-capture-filter-using-the-support-user), create capture filters for each Defender for IoT component separately.

1. `Type Y for "internal" otherwise N for "all-connected" (custom operation mode enabled) [Y/N]:`

    This prompt allows you to configure which traffic is in scope. Define whether you want to collect traffic where both endpoints are in scope, or only one of them is in the specified subnet. Supported values include:

    - `internal`: Includes all communication between the specified source and destination
    - `all-connected`: Includes all communication between either of the specified endpoints and external endpoints.

    For example, for endpoints A and B, if you use the `internal` mode, included traffic will only include communications between endpoints **A** and **B**. <br>However, if you use the `all-connected` mode, included traffic will include all communications between A *or* B and other, external endpoints.

    The default mode is `internal`. To use the `all-connected` mode, select `Y` at the prompt, and then enter `all-connected`.

The following example shows a series of prompts that creates a capture filter to exclude subnet `192.168.x.x` and port `9000:`

```bash
root@xsense: network capture-filter
Would you like to supply devices and subnet masks you wish to include in the capture filter? [y/N]: n
Would you like to supply devices and subnet masks you wish to exclude from the capture filter? [y/N]: y
You've exited the editor. Would you like to apply your modifications? [y/N]: y
Enter tcp ports to include (delimited by comma or Enter to skip):
Enter udp ports to include (delimited by comma or Enter to skip):
Enter tcp ports to exclude (delimited by comma or Enter to skip):9000
Enter udp ports to exclude (delimited by comma or Enter to skip):9000
Enter VLAN ids to include (delimited by comma or Enter to skip):
In which component do you wish to apply this capture filter?all
Would you like to supply a custom base capture filter for the collector component? [y/N]: n
Would you like to supply a custom base capture filter for the traffic_monitor component? [y/N]: n
Would you like to supply a custom base capture filter for the horizon component? [y/N]: n
type Y for "internal" otherwise N for "all-connected" (custom operation mode enabled) [Y/n]: internal
Please respond with 'yes' or 'no' (or 'y' or 'n').
type Y for "internal" otherwise N for "all-connected" (custom operation mode enabled) [Y/n]: y
starting "/usr/local/bin/cyberx-xsense-capture-filter --exclude /var/cyberx/media/capture-filter/exclude --exclude-tcp-port 9000 --exclude-udp-port 9000 --program all --mode internal --from-shell"
No include file given
Loaded 1 unique channels
(000) ret      #262144
(000) ldh      [12]
......
......
......
debug: set new filter for horizon '(((not (net 192.168))) and (not (tcp port 9000)) and (not (udp port 9000))) or (vlan and ((not (net 192.168))) and (not (tcp port 9000)) and (not (udp port 9000)))'
root@xsense:
```

### Create an advanced filter for specific components

When configuring advanced capture filters for specific components, you can use your initial include and exclude files as a base, or template, capture filter. Then, configure extra filters for each component on top of the base as needed.

To create a capture filter for *each* component, make sure to repeat the entire process for each component.

> [!NOTE]
> If you've created different capture filters for different components, the mode selection is used for all components. Defining the capture filter for one component as `internal` and the capture filter for another component as `all-connected` isn't supported.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **support** | `network capture-filter` | No attributes.|
| **cyberx**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)  | `cyberx-xsense-capture-filter` | `cyberx-xsense-capture-filter [-h] [-i INCLUDE] [-x EXCLUDE] [-etp EXCLUDE_TCP_PORT] [-eup EXCLUDE_UDP_PORT] [-itp INCLUDE_TCP_PORT] [-iup INCLUDE_UDP_PORT] [-vlan INCLUDE_VLAN_IDS] -p PROGRAM [-o BASE_HORIZON] [-s BASE_TRAFFIC_MONITOR] [-c BASE_COLLECTOR] -m MODE [-S]`   |

The following extra attributes are used for the *cyberx* user to create capture filters for each component separately:

|Attribute  |Description  |
|---------|---------|
|`-p <PROGRAM>`, `--program <PROGRAM>`     | Defines the component for which you want to configure a capture filter, where `<PROGRAM>` has the following supported values: <br>- `traffic-monitor` <br>- `collector` <br>- `horizon` <br>- `all`: Creates a single capture filter for all components. For more information, see [Create a basic filter for all components](#create-a-basic-filter-for-all-components).|
|`-o <BASE_HORIZON>`, `--base-horizon <BASE_HORIZON>`     | Defines a base capture filter for the `horizon` component, where `<BASE_HORIZON>` is the filter you want to use. <br> Default value = `""`       |
|`-s BASE_TRAFFIC_MONITOR`, `--base-traffic-monitor BASE_TRAFFIC_MONITOR`     |     Defines a base capture filter for the `traffic-monitor` component. <br> Default value = `""`    |
|`-c BASE_COLLECTOR`, `--base-collector BASE_COLLECTOR`     |  Defines a base capture filter for the `collector` component.  <br> Default value = `""`             |

Other attribute values have the same descriptions as in the basic use case, described [earlier](#create-a-basic-filter-for-all-components).

#### Create an advanced capture filter using the support user

If you're creating a capture filter for each component separately as the *support* user, no attributes are passed in the [original command](#create-an-advanced-filter-for-specific-components). Instead, a series of prompts is displayed to help you create the capture filter interactively.

Most of the prompts are identical to [basic use case](#create-a-basic-capture-filter-using-the-support-user). Reply to the following extra prompts as follows:

1. `In which component do you wish to apply this capture filter?`

    Enter one of the following values, depending on the component you want to filter:

    - `horizon`
    - `traffic-monitor`
    - `collector`

1. You're prompted to configure a custom base capture filter for the selected component. This option uses the capture filter you configured in the previous steps as a base, or template, where you can add extra configurations on top of the base.

    For example, if you'd selected to configure a capture filter for the `collector` component in the previous step, you're prompted: `Would you like to supply a custom base capture filter for the collector component? [Y/N]:`

    Enter `Y` to customize the template for the specified component, or `N` to use the capture filter you'd configured earlier as it is.

Continue with the remaining prompts as in the [basic use case](#create-a-basic-capture-filter-using-the-support-user).

### List current capture filters for specific components

Use the following commands to show details about the current capture filters configured for your sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **support** | Use the following commands to view the capture filters for each component: <br><br>- **horizon**: `edit-config horizon_parser/horizon.properties` <br>- **traffic-monitor**: `edit-config traffic_monitor/traffic-monitor` <br>- **collector**: `edit-config dumpark.properties` | No attributes |
| **cyberx**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user) | Use the following commands to view the capture filters for each component: <br><br>-**horizon**: `nano /var/cyberx/properties/horizon_parser/horizon.properties` <br>- **traffic-monitor**: `nano /var/cyberx/properties/traffic_monitor/traffic-monitor.properties` <br>- **collector**: `nano /var/cyberx/properties/dumpark.properties` | No attributes |

These commands open the following files, which list the capture filters configured for each component:

|Name  |File |Property  |
|---------|---------|---------|
|**horizon**     |  `/var/cyberx/properties/horizon.properties`       |  `horizon.processor.filter`       |
|**traffic-monitor**     |   `/var/cyberx/properties/traffic-monitor.properties`      |    `horizon.processor.filter`     |
|**collector**     |   `/var/cyberx/properties/dumpark.properties`      |   `dumpark.network.filter`      |

For example with the **support** user, with a capture filter defined for the *collector* component that excludes subnet 192.168.x.x and port 9000:

```bash

root@xsense: edit-config dumpark.properties
  GNU nano 2.9.3                      /tmp/tmpevt4igo7/tmpevt4igo7

dumpark.network.filter=(((not (net 192.168))) and (not (tcp port 9000)) and (not
dumpark.network.snaplen=4096
dumpark.packet.filter.data.transfer=false
dumpark.infinite=true
dumpark.output.session=false
dumpark.output.single=false
dumpark.output.raw=true
dumpark.output.rotate=true
dumpark.output.rotate.history=300
dumpark.output.size=20M
dumpark.output.time=30S
```

### Reset all capture filters

Use the following command to reset your sensor to the default capture configuration with the *cyberx* user, removing all capture filters.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **cyberx**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)  | `cyberx-xsense-capture-filter -p all -m all-connected` | No attributes |

If you want to modify the existing capture filters, run the [earlier](#create-a-basic-filter-for-all-components) command again, with new attribute values.

To reset all capture filters using the *support* user, run the [earlier](#create-a-basic-filter-for-all-components) command again, and respond `N` to all [prompts](#create-a-basic-capture-filter-using-the-support-user) to reset all capture filters.

The following example shows the command syntax and response for the *cyberx* user:

```bash
root@xsense:/#  cyberx-xsense-capture-filter -p all -m all-connected
starting "/usr/local/bin/cyberx-xsense-capture-filter -p all -m all-connected"
No include file given
No exclude file given
(000) ret      #262144
(000) ret      #262144
debug: set new filter for dumpark ''
No include file given
No exclude file given
(000) ret      #262144
(000) ret      #262144
debug: set new filter for traffic-monitor ''
No include file given
No exclude file given
(000) ret      #262144
(000) ret      #262144
debug: set new filter for horizon ''
root@xsense:/#
```

## Alerts

### Trigger a test alert

Use the following command to test connectivity and alert forwarding from the sensor to management consoles, including the Azure portal, a Defender for IoT on-premises management console, or a third-party SIEM.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **cyberx**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user) | `cyberx-xsense-trigger-test-alert` | No attributes |

The following example shows the command syntax and response for the *cyberx* user:

```bash
root@xsense:/# cyberx-xsense-trigger-test-alert
Triggering Test Alert...
Test Alert was successfully triggered.
```

### Alert exclusion rules from an OT sensor

The following commands support alert exclusion features on your OT sensor, including showing current exclusion rules, adding and editing rules, and deleting rules.

> [!NOTE]
> Alert exclusion rules defined on an OT sensor can be overwritten by alert exclusion rules defined on your on-premises management console.

#### Show current alert exclusion rules

Use the following command to display a list of currently configured exclusion rules.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**support**     |   `alerts exclusion-rule-list`      |   `alerts exclusion-rule-list [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |
|**cyberx**  , or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)    |  `alerts cyberx-xsense-exclusion-rule-list`       |   `alerts cyberx-xsense-exclusion-rule-list [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |

The following example shows the command syntax and response for the *support* user:

```bash
root@xsense: alerts exclusion-rule-list
starting "/usr/local/bin/cyberx-xsense-exclusion-rule-list"
root@xsense:
```

#### Create a new alert exclusion rule

Use the following commands to create a local alert exclusion rule on your sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **support** | `cyberx-xsense-exclusion-rule-create` |  `cyberx-xsense-exclusion-rule-create [-h] [-n NAME] [-ts TIMES] [-dir DIRECTION] [-dev DEVICES] [-a ALERTS]`|
| **cyberx**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user) |`cyberx-xsense-exclusion-rule-create`  |`cyberx-xsense-exclusion-rule-create [-h] [-n NAME] [-ts TIMES] [-dir DIRECTION] [-dev DEVICES] [-a ALERTS]`   |

Supported attributes are defined as follows:

|Attribute  |Description  |
|---------|---------|
|`-h`, `--help`     |  Shows the help message and exits.      |
|`[-n <NAME>]`, `[--name <NAME>]` | Define the rule's name.|
|`[-ts <TIMES>]` `[--time_span <TIMES>]` | Defines the time span for which the rule is active, using the following syntax: `hh:mm-hh:mm, hh:mm-hh:mm` |
|`[-dir <DIRECTION>]`, `--direction <DIRECTION>` | Address direction to exclude. Use one of the following values: `both`, `src`, `dst`|
|`[-dev <DEVICES>]`, `[--devices <DEVICES>]` | Device addresses or address types to exclude, using the following syntax: `ip-x.x.x.x`, `mac-xx:xx:xx:xx:xx:xx`, `subnet:x.x.x.x/x`|
| `[-a <ALERTS>]`, `--alerts <ALERTS>`|Alert names to exclude, by hex value. For example: `0x00000, 0x000001` |

The following example shows the command syntax and response for the *support* user:

```bash
alerts exclusion-rule-create [-h] -n NAME [-ts TIMES] [-dir DIRECTION]
[-dev DEVICES] [-a ALERTS]
```

#### Modify an alert exclusion rule

Use the following commands to modify an existing local alert exclusion rule on your sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **support** | `exclusion-rule-append` |  `exclusion-rule-append [-h] [-n NAME] [-ts TIMES] [-dir DIRECTION] [-dev DEVICES] [-a ALERTS]`|
| **cyberx**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)  |`exclusion-rule-append`  |`exclusion-rule-append [-h] [-n NAME] [-ts TIMES] [-dir DIRECTION] [-dev DEVICES] [-a ALERTS]`   |

Supported attributes are defined as follows:

|Attribute  |Description  |
|---------|---------|
|`-h`, `--help`     |  Shows the help message and exits.      |
|`[-n <NAME>]`, `[--name <NAME>]` | The name of the rule you want to modify.|
|`[-ts <TIMES>]` `[--time_span <TIMES>]` | Defines the time span for which the rule is active, using the following syntax:  `hh:mm-hh:mm, hh:mm-hh:mm` |
|`[-dir <DIRECTION>]`, `--direction <DIRECTION>` | Address direction to exclude. Use one of the following values: `both`, `src`, `dst`|
|`[-dev <DEVICES>]`, `[--devices <DEVICES>]` | Device addresses or address types to exclude, using the following syntax: `ip-x.x.x.x`, `mac-xx:xx:xx:xx:xx:xx`, `subnet:x.x.x.x/x`|
| `[-a <ALERTS>]`, `--alerts <ALERTS>`|Alert names to exclude, by hex value. For example: `0x00000, 0x000001` |

Use the following command syntax with the *support* user:

```bash
alerts exclusion-rule-append [-h] -n NAME [-ts TIMES] [-dir DIRECTION]
[-dev DEVICES] [-a ALERTS]
```

#### Delete an alert exclusion rule

Use the following commands to delete an existing local alert exclusion rule on your sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **support** | `exclusion-rule-remove` |  `exclusion-rule-append [-h] [-n NAME] [-ts TIMES] [-dir DIRECTION] [-dev DEVICES] [-a ALERTS]`|
| **cyberx**, or **support** with [root access](references-work-with-defender-for-iot-cli-commands.md#access-the-system-root-as-a-support-user)  |`exclusion-rule-remove`  |`exclusion-rule-append [-h] [-n NAME] [-ts TIMES] [-dir DIRECTION] [-dev DEVICES] [-a ALERTS]`   |

Supported attributes are defined as follows:

|Attribute  |Description  |
|---------|---------|
|`-h`, `--help`     |  Shows the help message and exits.      |
|`[-n <NAME>]`, `[--name <NAME>]` | The name of the rule you want to delete.|
|`[-ts <TIMES>]` `[--time_span <TIMES>]` | Defines the time span for which the rule is active, using the following syntax:  `hh:mm-hh:mm, hh:mm-hh:mm` |
|`[-dir <DIRECTION>]`, `--direction <DIRECTION>` | Address direction to exclude. Use one of the following values: `both`, `src`, `dst`|
|`[-dev <DEVICES>]`, `[--devices <DEVICES>]` | Device addresses or address types to exclude, using the following syntax: `ip-x.x.x.x`, `mac-xx:xx:xx:xx:xx:xx`, `subnet:x.x.x.x/x`|
| `[-a <ALERTS>]`, `--alerts <ALERTS>`|Alert names to exclude, by hex value. For example: `0x00000, 0x000001` |

The following example shows the command syntax and response for the *support* user:

```bash
alerts exclusion-rule-remove [-h] -n NAME [-ts TIMES] [-dir DIRECTION]
[-dev DEVICES] [-a ALERTS]
```


## Next steps

> [!div class="nextstepaction"]
> [Learn more about Defender for IoT CLI commands](references-work-with-defender-for-iot-cli-commands.md)
