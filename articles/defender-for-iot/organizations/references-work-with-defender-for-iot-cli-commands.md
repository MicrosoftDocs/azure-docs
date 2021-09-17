---
title: Work with Defender for IoT CLI commands
description: This article describes Defender for IoT CLI commands for sensors and on-premises management consoles.  
ms.date: 05/20/2021
ms.topic: article
---

# Work with Defender for IoT CLI commands

This article describes CLI commands for sensors and on-premises management consoles. The commands are accessible to the following users:

- Administrator
- CyberX 
- Support

To start working in the CLI, connect using a terminal. For example, terminal name `Putty`, and `Support` user. 

## Create local alert exclusion rules

You can create a local alert exclusion rule by entering the following command into the CLI:

```azurecli-interactive
alerts exclusion-rule-create [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  
[-dev DEVICES] [-a ALERTS]
```

The following attributes can be used with the alert exclusion rules:

| Attribute | Description |
|--|--|
| [-h] | Prints the help information for the command. |
| -n NAME | The name of the rule being created. |
| [-ts TIMES] | The time span for which the rule is active. This should be specified as:<br />`xx:yy-xx:yy`<br />You can define more than one time period by using a comma between them. For example: `xx:yy-xx:yy, xx:yy-xx:yy`. |
| [-dir DIRECTION] | The direction in which the rule is applied. This should be specified as:<br />`both | src | dst` |
| [-dev DEVICES] | The IP address and the address type of the devices to be excluded by the rule, specified as:<br />`ip-x.x.x.x`<br />`mac-xx:xx:xx:xx:xx:xx`<br />`subnet: x.x.x.x/x` |
| [-a ALERTS] | The name of the alert that the rule will exclude:<br />`0x00000`<br />`0x000001` |

## Append local alert exclusion rules

You can append local alert exclusion rules by entering the following command in the CLI:

```azurecli-interactive
alerts exclusion-rule-append [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  
[-dev DEVICES] [-a ALERTS]
```

The attributes used here are the same as the attributes explained in the Create local alert exclusion rules section. The difference in the usage is that here the attributes are applied on the existing rules.

## Show local alert exclusion rules

Enter the following command to present the existing list of exclusion rules:

```azurecli-interactive
alerts exclusion-rule-list [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  
[-dev DEVICES] [-a ALERTS]
```

## Delete local alert exclusion rules

You can delete an existing alert exclusion rule by entering the following command:

```azurecli-interactive
alerts exclusion-rule-remove [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  
[-dev DEVICES] [-a ALERTS]
```

The following attribute can be used with the alert exclusion rules:

| Attribute | Description|
| --------- | ---------------------------------- |
| -n NAME | The name of the rule to be deleted. |

## Sync time from the NTP server

You can enable, or disable a time sync from a specified NTP server.

### Enable NTP sync

Enter the following command to periodically retrieve the time from the specified NTP server:

```azurecli-interactive
ntp enable IP
```

The attribute that you can define within the command is the IP address of the NTP server.

### Disable NTP sync

Enter the following command to disable the time sync with the specified NTP server:

```azurecli-interactive
ntp disable IP
```

The attribute that you can define within the command is the IP address of the NTP server.

## Network configuration

The following table describes the commands available to configure your network options for Azure Defender for IoT:

|Name|Command|Description|
|-----------|-------|-----------|
|Ping|`ping IP`| Ping an address outside the Defender for IoT platform.|
|Blink|`network blink`| Locate a connection by causing the interface lights to blink. |
|Reconfigure the network |`network edit-settings`| Enable a change in the network configuration parameters. |
|Show network settings |`network list`|Displays the network adapter parameters. |
|Validate the network configuration |`network validate` |Presents the output network settings. <br /> <br />For example: <br /> <br />Current Network Settings: <br /> interface: eth0 <br /> ip: 10.100.100.1 <br />subnet: 255.255.255.0 <br />default gateway: 10.100.100.254 <br />dns: 10.100.100.254 <br />monitor interfaces: eth1|
|Import a certificate |`certificate import FILE` |Imports the HTTPS certificate. You'll need to specify the full path, which leads to a \*.crt file. |
|Show the date |`date` |Returns the current date on the host in GMT format. |

## Network capture filter configuration

The `network capture-filter` command allows administrators to eliminate network traffic that doesn't need to be analyzed. You can filter traffic by using an include list, or an exclude list.

```azurecli-interactive
network capture-filter
```

After you enter the command, you'll be prompted with the following question:

>`Would you like to supply devices and subnet masks you wish to include in the capture filter? [Y/N]:`

Select `Y` to open a nano file where you can add a device, channel, port, and subset according to the following syntax:

| Attribute | Description |
|--|--|
| 1.1.1.1 | Includes all of the traffic for this device. |
| 1.1.1.1,2.2.2.2 | Includes all of the traffic for this channel. |
| 1.1.1,2.2.2 | Includes all of the traffic for this subnet. |

Separate arguments by dropping a row.

When you include a device, channel, or subnet, the sensor processes all the valid traffic for that argument, including ports and traffic that wouldn't usually be processed.

You'll then be asked the following question:

>`Would you like to supply devices and subnet masks you wish to exclude from the capture filter? [Y/N]:`

Select `Y` to open a nano file where you can add a device, channel, port, and subsets according to the following syntax:

| Attribute | Description |
|--|--|
| 1.1.1.1 | Excludes all the traffic for this device. |
| 1.1.1.1,2.2.2.2 | Excludes all the traffic for this channel, meaning all the traffic between two devices. |
| 1.1.1.1,2.2.2.2,443 | Excludes all the traffic for this channel by port. |
| 1.1.1 | Excludes all the traffic for this subnet. |
| 1.1.1,2.2.2 | Excludes all the traffic for between subnets. |

Separate arguments by dropping a row.

When you exclude a device, channel, or subnet, the sensor will exclude all the valid traffic for that argument.

### Ports

Include or exclude UDP and TCP ports for all the traffic.

>`502`: single port

>`502,443`: both ports

>`Enter tcp ports to include (delimited by comma or Enter to skip):`

>`Enter udp ports to include (delimited by comma or Enter to skip):`

>`Enter tcp ports to exclude (delimited by comma or Enter to skip):`

>`Enter udp ports to exclude (delimited by comma or Enter to skip):`

### Components

You're asked the following question:

>`In which component do you wish to apply this capture filter?`

Your options are: `all`, `dissector`, `collector`, `statistics-collector`, `rpc-parser`, or `smb-parser`.

In most use-cases, select `all`.

### Custom base capture filter

The base capture filter is the baseline for the components. For example, the filter determines which ports are available to the component.

Select `Y` for all of the following options. All of the filters are added to the baseline after the changes are set. If you make a change, it will overwrite the existing baseline.

>`Would you like to supply a custom base capture filter for the dissector component? [Y/N]:`

>`Would you like to supply a custom base capture filter for the collector component? [Y/N]:`

>`Would you like to supply a custom base capture filter for the statistics-collector component? [Y/N]:`

>`Would you like to supply a custom base capture filter for the rpc-parser component? [Y/N]:`

>`Would you like to supply a custom base capture filter for the smb-parser component? [Y/N]:`

>`Type Y for "internal" otherwise N for "all-connected" (custom operation mode enabled) [Y/N]:`

If you choose to exclude a subnet such as 1.1.1:

- `internal` will exclude only that subnet.

- `all-connected` will exclude that subnet and all the traffic to and from that subnet.

We recommend that you select `internal`.

> [!NOTE]
> Your choices are used for all the filters in the tool and are not session dependent. In other words, you can't ever choose `internal` for some filters and `all-connected` for others.

### Comments

You can view filters in ```/var/cyberx/properties/cybershark.properties```:

- **statistics-collector**: `bpf_filter property` in ```/var/cyberx/properties/net.stats.collector.properties```

- **dissector**: `override.capture_filter` property in ```/var/cyberx/properties/cybershark.properties```

- **rpc-parser**: `override.capture_filter` property in ```/var/cyberx/properties/rpc-parser.properties```

- **smb-parser**: `override.capture_filter` property in ```/var/cyberx/properties/smb-parser.properties```

- **collector**: `general.bpf_filter` property in ```/var/cyberx/properties/collector.properties```

You can restore the default configuration by entering the following code for the cyberx user:

```azurecli-interactive
sudo cyberx-xsense-capture-filter -p all -m all-connected
```

## Define client and server hosts

If Defender for IoT didn't automatically detect the client, and server hosts, enter the following command to set the client and server hosts:

```azurecli-interactive
directions [-h] [--identifier IDENTIFIER] [--port PORT] [--remove] [--add]  
[--tcp] [--udp]
```

You can use the following attributes with the `directions` command:

| Attribute | Description |
|--|--|
| [-h] | Prints help information for the command. |
| [--identifier IDENTIFIER] | The server identifier. |
| [--port PORT] | The server port. |
| [--remove] | Removes a client or server host from the list. |
| [--add] | Adds a client or server host to the list. |
| [--tcp] | Use TCP when communicating with this host. |
| [--udp] | Use UDP when communicating with this host. |

## System actions
The following table describes the commands available to perform various system actions within Defender for IoT:

|Name|Code|Description|
|----|----|-----------|
|Show the date|`date`|Returns the current date on the host in GMT format.|
|Reboot the host|`system reboot`|Reboots the host device.|
|Shut down the host|`system shutdown`|Shuts down the host.|
|Back up the system|`system backup`|Initiates an immediate backup (an unscheduled backup).|
|Restore the system from a backup|`system restore`|Restores from the most recent backup.|
|List the backup files|`system backup-list`|Lists the available backup files.|
|Display the status of all Defender for IoT platform services|`system sanity`|Checks the performance of the system by listing the current status of all Defender for IoT platform services.|
|Show the software version|`system version`|Displays the version of the software currently running on the system.|

## Deploy SSL and TLS certificates to appliances

Enter the following command to import SSL and TLS enterprise certificates into the CLI:

```azurecli-interactive
cyberx-xsense-certificate-import
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
    
## See also

[Defender for IoT API sensor and management console APIs](references-work-with-defender-for-iot-apis.md)
