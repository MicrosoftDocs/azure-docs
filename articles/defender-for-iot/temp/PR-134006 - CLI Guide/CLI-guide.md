---
title: Azure Defender for IoT overview
description: The Azure Defender for IoT sensor enables customer business continuity with regard to cyberattacks and improves everyday operations and uptime by automatically modeling the SCADA network as a state machine.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 10/22/2020
ms.topic: article
ms.service: azure
---

# Azure Defender for IoT overview

The Azure Defender for IoT Sensor enables customer business continuity with regard to cyberattacks and improves everyday operations and uptime by automatically modeling the SCADA network as a state machine. Multiple proprietary and patented analysis engines continually monitor and alert you on any suspicious network activity.

The Central Manager provides centralized deployment of software, threat intelligence, and configuration updates across all of Azure Defender for IoT sensors in the organization.

Both, the Central Manager and the sensors, are managed through the user-friendly GUI. You can also configure Azure Defender for IoT with the CLI.

Most of the GUI configuration options can be performed also using the CLI. There are highly technical configuration options that can be performed using the CLI only.

## Audience

This guide is written for administrator level users.

## Alert exclusion rules

Alerts can be suppressed for specific situations where you do not need or want the alerts to be generated. Exclusion rules are useful when planning maintenance activities or for network events for which you do not want to receive alerts.

### Create local alert exclusion rules

You can create an exclusion rule by entering the following command into the CLI.

```azurecli-interactive
alerts exclusion-rule-create [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  
[-dev DEVICES] [-a ALERTS]
```

The attributes that can be defined within the alert exclusion rules are as follows:

| Attribute                        | Description |
| -------------------------------- | ------------------------------------- |
| [-h] | Prints the help information for the command |
| -n NAME | The name of the rule being created |
| [-ts TIMES] | The time span for which the rule is active. The command should be specified as:<br>```xx:yy-xx:yy```<br>You can define more that one time period by using a comma between them. For example, ```xx:yy-xx:yy, xx:yy-xx:yy``` |
| [-dir DIRECTION] | The direction in which the rule is applied. This command should be specified as:<br>```both | src | dst``` |
| [-dev DEVICES] | The IP address and the address type of the devices to be excluded by the rule, specified as:<br>```ip-x.x.x.x```<br>```mac-xx:xx:xx:xx:xx:xx```<br>```subnet: x.x.x.x/x``` |
| [-a ALERTS] | The name of the alert to be excluded by the rule:<br>```0x00000```<br>```0x000001``` |

### Append local alert exclusion rules

You can add new rules to the current alert exclusion rules by entering the following command in the CLI.

```azurecli-interactive
alerts exclusion-rule-append [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  
[-dev DEVICES] [-a ALERTS]
```

The attributes used here match the attributes in the create local alert exclusion rules section. However, here the attributes are applied to a rule that already exists. 

### Show local alert exclusion rules

You can enter the following command to view all existing exclusion rules.

```azurecli-interactive
alerts exclusion-rule-list [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  
[-dev DEVICES] [-a ALERTS]
```

### Delete local alert exclusion rules

You can delete an existing alert exclusion rule by entering the following command.

```azurecli-interactive
alerts exclusion-rule-remove [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  
[-dev DEVICES] [-a ALERTS]
```

The following attribute can be used with the alert exclusion rules:

| Attribute | Description                        |
| --------- | ---------------------------------- |
| -n NAME | The name of the rule to be deleted |

## Sync time from NTP server

You can enable and disable time synchronization between a device and a NTP server.

### Enable NTP

Entering the following command will enable a periodic retrieval of the current time from a specified NTP server.

```azurecli-interactive
ntp enable IP.
```

The attribute that can be defined within the command is the IP address of the NTP server.

### Disable NTP sync

Entering the following command will disable the time sync with the specified NTP server:

```azurecli-interactive
ntp disable IP
```

The attribute that can be defined within the command is the IP address of the NTP server.

## Network configuration

The following commands are available to configure your Azure Defender for IoT network.

### Network configuration commands

|Name|Command|Description|
|-----------|-------|-----------|
|Ping|`ping IP`| Ping addresses outside the Azure Defender for IoT platform|
|Blink|`network blink`|Enables changing the network configuration parameters|
|Reconfigure the network |`network edit-settings`| Enables changing the network configuration parameters |
|Show network settings |`network list`|Displays the network adapter parameters |
|Validate the network configuration |`network validate` |Presents the output network settings <br> <br>For example: <br> <br>Current Network Settings: <br> interface: eth0 <br> ip: 10.100.100.1 <br>subnet: 255.255.255.0 <br>default gateway: 10.100.100.254 <br>dns: 10.100.100.254 <br>monitor interfaces: eth1|
|Import a certificate |`certificate import FILE` |Imports the HTTPS certificate. You will need to select the full  filepath, which leads to a *.crt file |
|Show the date |`date` |Returns the current date on the host in GMT format |

### Filter network configurations

The network capture filter command allows administrators to eliminate network traffic noise that the devices receive but do not need to analyze.

This capability delivers the ability to filter using an include list and, or an exclude list.

```azurecli-interactive
network capture-filter
```

After entering the command, you will be prompted with the following question:

>Would you like to supply devices and subnet masks you wish to **include** in the capture filter? [Y/N]:*

Select **Yes**, this will open a nano file where you can add devices, channels, ports, and subsets according to the following syntax:

| Attribute       | Description                               |
| --------------- | ----------------------------------------- |
| 1.1.1.1| Includes all the traffic for this device |
| 1.1.1.1,2.2.2.2| Includes all the traffic for this channel |
|1.1.1,2.2.2| Includes all the traffic for this subnet |

Arguments should be separated by dropping a row.

When you include an device, channel, or subnet, the sensor processes all of the traffic that is valid for that argument, including ports and traffic that would not usually be processed.

You will then be asked the following question:
>Would you like to supply devices and subnet masks you wish to **exclude** from the capture filter? [Y/N]:*

Select **Yes** to open a nano file where you can add devices, channels, ports, and subsets according to the following syntax:

| Attribute   |  Description          |
| ------------------- | ------------------------------------------------------------ |
| 1.1.1.1             | Excludes all the traffic for this device |
| 1.1.1.1,2.2.2.2     | Excludes all the traffic for this channel, meaning all the traffic between two devices |
| 1.1.1.1,2.2.2.2,443 | Excludes all the traffic for this channel by port |
| 1.1.1               | Excludes all the traffic for this subnet |
| 1.1.1,2.2.2         | Excludes all the traffic for between subnets |

Divide arguments by dropping a row.

When you exclude an device, channel or subnet, the will sensor excludes all the traffic valid for that argument.

**ports**:

Include or exclude UDP and TCP ports is executed for all the traffic.

*502* single port

*502,443* both ports

*Enter tcp ports to include (delimited by comma or Enter to skip):*

*Enter udp ports to include (delimited by comma or Enter to skip):*

*Enter tcp ports to exclude (delimited by comma or Enter to skip):*

*Enter udp ports to exclude (delimited by comma or Enter to skip):*

**components**:

*In which component do you wish to apply this capture filter?*

Your options are: `all, dissector, collector, statistics-collector, rpc-parser, smb-parser`

In most use-cases, select `all`.

**custom base capture filter**:

The base capture filter is the base line for the components. For example, which ports are available to the  component.

Select **Yes**  for all of the following options. All of the filters are added to the base line after the changes are set. If you make a change, it will overwrite the existing base line.

>*Would you like to supply a custom base capture filter for the dissector component? [Y/N]:*

>*Would you like to supply a custom base capture filter for the collector component? [Y/N]:*

>*Would you like to supply a custom base capture filter for the statistics-collector component? [Y/N]:*

>*Would you like to supply a custom base capture filter for the rpc-parser component? [Y/N]:*

>*Would you like to supply a custom base capture filter for the smb-parser component? [Y/N]:*

>*Type Y for "internal" otherwise N for "all-connected" (custom operation mode enabled) [Y/N]:*

If you choose to exclude a subnet, for example 1.1.1.

- *internal* will exclude only that subnet.

- *all connected* will exclude that subnet and all the traffic to and from that subnet.

We recommend that you select *internal*.

> [!NOTE]
> All connected and *internal* are for all the filters in the tool, and are not session dependent, meaning you can't ever choose to do *internal* for some filters and *all connected* for others.

**Comments**:

filters can be viewed in ```/var/cyberx/properties/cybershark.properties```

statistics-collector - bpf_filter property in ```/var/cyberx/properties/net.stats.collector.properties```

dissector - override.capture_filter property in ```/var/cyberx/properties/cybershark.properties```

rpc-parser - override.capture_filter property in ```/var/cyberx/properties/rpc-parser.properties```

smb-parser - override.capture_filter property in ```/var/cyberx/properties/smb-parser.properties```

collector - general.bpf_filter property in ```/var/cyberx/properties/collector.properties```

You can restore the default configuration by entering the following command:

user: **cyberx**

```azurecli-interactive
sudo cyberx-xsense-capture-filter -p all -m all-connected
```

### Define a client and server hosts

If Azure Defender for IoT did not automatically detect the client and server hosts, enter the following command to set the client and server hosts.

```azurecli-interactive
directions [-h] [--identifier IDENTIFIER] [--port PORT] [--remove] [--add]  
[--tcp] [--udp]
```

The following attributes can be used with the directions command:

| Attribute                 | Description                                        |
| ------------------------- | -------------------------------------------------- |
| [-h]| Prints help information for the command |
| [--identifier IDENTIFIER] | The server identifier|
| [--port PORT]| The server port |
| [--remove]| Removes a client or server host from the list|
| [--add]| Adds a client or server host to the list|
| [--tcp]| Use TCP protocol when communicating with this host |
| [--udp]| Use UDP protocol when communicating with this host |

## System actions
The following commands are available to perform various system actions within Azure Defender for IoT.

### System Action Commands

|Name|Code|Description|
|----|----|-----------|
|Reboot the host|```system reboot```|Reboots the host device|
|Shut down the host|```system shutdown```|Shuts down the host|
|Back up the system|```system backup```|Launches an immediate backup (a non-scheduled backup)|
|Restore the system from a backup|```system restore```|Restores from the most recent backup|
|List the backup files|```system backup-list```|Lists the available backup files|
|Display the status of all Azure Defender for IoT platform services|```system sanity```|Checks the sanity of the system, by listing the current status of all Azure Defender for IoT platform services|
|Show the software version|```system version```|Displays the version of the software currently running on the system|

## Glossary

| Abbreviation | Meaning                                   |
| ------------ | ----------------------------------------- |
| AD           | Active Directory                          |
| DB           | Database                                  |
| CM           | Central Manager                           |
| DHCP         | Dynamic Host Configuration Protocol       |
| DMZ          | Demilitarized Zone                        |
| DNS          | Domain Name System                        |
| DR           | Disaster Recovery                         |
| FW           | Firewall                                  |
| Gbps         | Billions of bits per second               |
| HA           | High Availability                         |
| HDD          | Hard Disc Drive                           |
| HMI          | Human Machine Interface                   |
| ICS          | Industrialized Control System             |
| M2M          | Machine to Machine                        |
| SOC          | Security Operations Center                |
| NTP          | Network Time Protocol                     |
| OPC          | Open Platform Communications              |
| OT           | Operational Technology                    |
| PCAP         | Packet Capture Application Programming    |
| PLC          | Programmable Logic Controller             |
| SCADA        | Supervisory Control and Data Acquisition  |
| SIEM         | Security Information and Event Management |
| SNMP         | Simple Network Management Protocol        |
| SOC          | Security Operations Center                |
| SPAN         | Switched Port Analyzer                    |
| SYSLOG       | System Logging Protocol                   |
| TCP          | Transmission Control Protocol             |
| UI           | User Interface                            |
| VLAN         | Virtual Local Area Network                |
| VM           | Virtual Machine                           |
| VNET         | Virtual Network                           |
