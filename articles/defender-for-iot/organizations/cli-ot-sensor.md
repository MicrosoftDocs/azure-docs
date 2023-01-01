---
title: CLI command reference from OT network sensors- Microsoft Defender for IoT
description: Learn about the CLI commands available from Microsoft Defender for IoT OT network sensors.
ms.date: 12/29/2022
ms.topic: reference
---

# CLI command reference from OT network sensors

This article lists the CLI commands available from Defender for IoT OT network sensors.

Command syntax differs depending on the user performing the command, as indicated below for each activity.

## Prerequisites

Before you can run any of the following CLI commands, you'll need access to the CLI on your OT network sensor as a privileged user.

Each activity listed below is accessible by a different set of privileged users, including the *cyberx*, *support*, or *cyber_x_host* users. Command syntax is listed only for the users supported for a specific activity.

>[!IMPORTANT]
> We recommend that customers using the Defender for IoT CLI use the *support* user whenever possible.

For more information, see [Access the CLI](../references-work-with-defender-for-iot-cli-commands.md#access-the-cli) and [Privileged user access for OT monitoring](../references-work-with-defender-for-iot-cli-commands.md#privileged-user-access-for-ot-monitoring).

## Appliance maintenance

### Check OT monitoring services health

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


### Restart and shutdown
#### Restart an appliance

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

#### Shut down an appliance

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

### Software versions
#### Show installed software version

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

#### Update sensor software from CLI

For more information, see [Update your sensors](update-ot-software.md#update-your-sensors&tabs=cli).

### Date, time, and NTP
#### Show current system date/time

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

#### Turn on NTP time sync

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

#### Turn off NTP time sync

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
|**cyberx**     |   ` cyberx-xsense-system-backup-list`      |   No attributes      |


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


## SSL and TLS certificates


### Import TLS/SSL certificates to your OT sensor

Use the following command to import TLS/SSL certificates to the sensor from the CLI.

To use this command:

- Verify that the certificate file you want to import is readable on the appliance. Upload certificate files to the appliance using tools such as WinSCP or Wget.
- Confirm with your IT office that the appliance domain as it appears in the certificate is correct for your DNS server and the corresponding IP address.

For more information, see [Certificates for appliance encryption and authentication (OT appliances)](how-to-deploy-certificates.md).

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

### Restore the default self-signed certificate

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


## Local user management

### Change local user passwords

Use the following commands to change passwords for local users on your OT sensor.

When resetting the password for the *cyberx*, *support*, or *cyberx_host* user, the password is reset for both SSH and web access.


|User  |Command  |Full command syntax   |
|---------|---------|---------|
|**cyberx**     |   `cyberx-users-password-reset`      | `cyberx-users-password-reset -u <user> -p <password>`      |
|**cyberx_host**  |   `passwd` | No attributes   |


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

Use the following command to re-run the OT monitoring software configuration wizard, which helps you define or re-configure the following OT sensor settings:

- Enable/disable SPAN monitoring interfaces
- Configure network settings for the management interface (IP, subnet, default gateway, DNS)
- Setting up for [ERSPAN monitoring](https://learn.microsoft.com/en-us/azure/defender-for-iot/organizations/traffic-mirroring/configure-mirror-erspan)
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


#### Validate and show network interface configuration

Use the following commands to send a validate and show the current network interface configuration on the OT sensor.

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
|**cyberx**      |   `ping <IP address>`      |   No attributes |

In these commands, `<IP address>` is the IP address of a valid IPv4 network host accessible from the management port on your OT sensor.

#### Check network interface current load

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

#### Check internet connection

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

## Traffic capture filters

## Alerts
### Trigger a test alert

Use the following command to test connectivity and alert forwarding from the sensor to management consoles, including the Azure portal, a Defender for IoT on-premises management console, or a third-party SIEM.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **cyberx** | `cyberx-xsense-trigger-test-alert` | No attributes |

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
|**cyberx**     |  `alerts cyberx-xsense-exclusion-rule-list`       |   `alerts cyberx-xsense-exclusion-rule-list [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |

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
| **cyberx** |`cyberx-xsense-exclusion-rule-create`  |`cyberx-xsense-exclusion-rule-create [-h] [-n NAME] [-ts TIMES] [-dir DIRECTION] [-dev DEVICES] [-a ALERTS]`   |

Supported attributes are defined as follows:

|Attribute  |Description  |
|---------|---------|
|`-h`, `--help`     |  Shows the help message and exits.      |
|`[-n <NAME>]`, `[--name <NAME>]` | Define the rule's name.|
|`[-ts <TIMES>]` `[--time_span <TIMES>]` | Defines the time span for which the rule is active, using the following syntax: `xx:yy-xx:yy, xx:yy-xx:yy` |
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
| **cyberx** |`exclusion-rule-append`  |`exclusion-rule-append [-h] [-n NAME] [-ts TIMES] [-dir DIRECTION] [-dev DEVICES] [-a ALERTS]`   |

Supported attributes are defined as follows:

|Attribute  |Description  |
|---------|---------|
|`-h`, `--help`     |  Shows the help message and exits.      |
|`[-n <NAME>]`, `[--name <NAME>]` | The name of the rule you want to modify.|
|`[-ts <TIMES>]` `[--time_span <TIMES>]` | Defines the time span for which the rule is active, using the following syntax: `xx:yy-xx:yy, xx:yy-xx:yy` |
|`[-dir <DIRECTION>]`, `--direction <DIRECTION>` | Address direction to exclude. Use one of the following values: `both`, `src`, `dst`|
|`[-dev <DEVICES>]`, `[--devices <DEVICES>]` | Device addresses or address types to exclude, using the following syntax: `ip-x.x.x.x`, `mac-xx:xx:xx:xx:xx:xx`, `subnet:x.x.x.x/x`|
| `[-a <ALERTS>]`, `--alerts <ALERTS>`|Alert names to exclude, by hex value. For example: `0x00000, 0x000001` |

Use the following command syntax with the **support* user:

```bash
alerts exclusion-rule-append [-h] -n NAME [-ts TIMES] [-dir DIRECTION]
[-dev DEVICES] [-a ALERTS]
```

#### Delete an alert exclusion rule

Use the following commands to delete an existing local alert exclusion rule on your sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **support** | `exclusion-rule-remove` |  `exclusion-rule-append [-h] [-n NAME] [-ts TIMES] [-dir DIRECTION] [-dev DEVICES] [-a ALERTS]`|
| **cyberx** |`exclusion-rule-remove`  |`exclusion-rule-append [-h] [-n NAME] [-ts TIMES] [-dir DIRECTION] [-dev DEVICES] [-a ALERTS]`   |

Supported attributes are defined as follows:

|Attribute  |Description  |
|---------|---------|
|`-h`, `--help`     |  Shows the help message and exits.      |
|`[-n <NAME>]`, `[--name <NAME>]` | The name of the rule you want to delete.|
|`[-ts <TIMES>]` `[--time_span <TIMES>]` | Defines the time span for which the rule is active, using the following syntax: `xx:yy-xx:yy, xx:yy-xx:yy` |
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
