---
title: Configuration CLI commands - Microsoft Defender for IoT
description: Learn about the CLI commands available for configuring Defender for IoT on-premises resources.
ms.date: 09/07/2022
ms.topic: reference
---

# Configuration CLI command reference

## SSL/TLS Certificates

## Trigger test alert

## Review audit logs

## Apply ingress traffic filters (capture filter)
### Block by IP address range
### Block by port
### Base capture filter

## Local Alert Suppression
### Show Alert Suppression
### Create new Alert Suppression
### Append Alert Suppression
### Delete Alert Suppression

## Define Clients/Servers


## Upgrade Sensor from CLI


##After mounting the file (secured patch)  to /home/cyberx copy it to /tmp
cp /home/cyberx/<file name> /tmp

##Validate the file is not corrupted:
md5sum <filename>

##Create the upgrade flag – without it the upgrade itself will not start:
touch /var/cyberx/media/device-info/pending_update

##In case this is not the first update and to make sure no old files are being used (if /update does not exist skip this step):
cd /update
sudo rm -rf *

##Extract the secured patch file:
sudo monit stop tomcat
	• Without stopping tomcat the file will not be extracted
sudo /usr/local/bin/cyberx-update-extract --encrypted-file-path /tmp/<file name> --output-dir-path /var/cyberx/media/device-info/update

sudo monit start tomcat

##Make sure you are not in /tmp or in /var/cyberx/media/device-info/update
cd /home/cyberx

##Run the upgrade manually:
sudo python /var/cyberx/media/device-info/update/setup_upgrade.py --pre_reboot

##To trace the upgrade:
tail -f /var/cyberx/logs/upgrade.log





## Manage local alert exclusions

<!--extra intro about what these are and xref to where we talk about them in the main docs-->

### Show local alert exclusion rules

Run one of the following commands to show the current alert exclusion rules:

|User  |Command  |Full command syntax |
|---------|---------|---------|
|**support**     |   `alerts exclusion-rule-list`      |   `alerts exclusion-rule-list [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |
|**cyberx**     |  `alerts cyberx-xsense-exclusion-rule-list`       |   `alerts cyberx-xsense-exclusion-rule-list [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |

For example, for the **support** user:

<!-- tbd full example including response-->

For more information, see [Alert exclusion rule attributes](#alert-exclusion-rule-attributes).

### Create local alert exclusion rules

Run one of the following commands to create a new local alert exclusion rule:

|User  |Command  |Full command syntax |
|---------|---------|---------|
|**support**     |   `alerts exclusion-rule-create`      |   `alerts exclusion-rule-create [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |
|**cyberx**     |  `alerts cyberx-xsense-exclusion-rule-create`       |   `alerts cyberx-xsense-exclusion-rule-create [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |

For example, for the **support** user:

<!-- tbd full example including response-->

For more information, see [Alert exclusion rule attributes](#alert-exclusion-rule-attributes).

### Append local alert exclusion rules

Create a local alert exclusion rule by running one of the following commands:

|User  |Command  |Full command syntax |
|---------|---------|---------|
|**support**     |   `alerts exclusion-rule-append`      |   `alerts exclusion-rule-append [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |
|**cyberx**     |  `alerts cyberx-xsense-exclusion-rule-append`       |   `alerts cyberx-xsense-exclusion-rule-append [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |


For example, for the **support** user:

<!-- tbd full example including response-->

For more information, see [Alert exclusion rule attributes](#alert-exclusion-rule-attributes).

### Delete local alert exclusion rules

Delete a local alert exclusion rule by running one of the following commands:

|User  |Command  |Full command syntax  |
|---------|---------|---------|
|**support**     |   `alerts exclusion-rule-remove`      |   `alerts exclusion-rule-remove [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |
|**cyberx**     |  `alerts cyberx-xsense-exclusion-rule-remove`       |   `alerts cyberx-xsense-exclusion-rule-remove [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  [-dev DEVICES] [-a ALERTS]`      |


For example, for the **support** user:

<!-- tbd full example including response-->

For more information, see [Alert exclusion rule attributes](#alert-exclusion-rule-attributes).

### Alert exclusion rule attributes

The following attributes are available for [creating](#create-local-alert-exclusion-rules) or [appending](#append-local-alert-exclusion-rules) alert exclusion rules.

| Attribute | Description |
|--|--|
| `[-h]` | Prints the help information for the command. |
| `-n NAME` | The name of the rule being created. |
| `[-ts TIMES]` | The time span for which the rule is active. This should be specified as:<br />`xx:yy-xx:yy`<br />You can define more than one time period by using a comma between them. For example: `xx:yy-xx:yy, xx:yy-xx:yy`. |
| `[-dir DIRECTION]` | The direction in which the rule is applied. This should be specified as:<br />`both | src | dst` |
|` [-dev DEVICES]` | The IP address and the address type of the devices to be excluded by the rule, specified as:<br />`ip-x.x.x.x`<br />`mac-xx:xx:xx:xx:xx:xx`<br />`subnet: x.x.x.x/x` |
| `[-a ALERTS]` | The name of the alert that the rule will exclude:<br />`0x00000`<br />`0x000001` |


## Manage network configurations

## Capture data filter

## Manage SSL certificates

## Manage time synchronization (NTP)

## template section

<!--do x--> by running one of the following commands:

|User  |Command  |Full command syntax <!--remove this column if no attributes-->  |
|---------|---------|---------|
|**support**     |   `<command>`      |   `<full command syntax with attributes`      |
|**cyberx**     |   `<command>`      |   `<full command syntax with attributes`      |


For example, for the **support** user:

<!-- tbd full example including response-->

For more information, see <!--xref to section w attributes listed if we have any-->.

## Next steps

For more information, see [Getting started with the Defender for IoT CLI](cli-overview.md).
