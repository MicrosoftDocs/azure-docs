---
title: Advanced CLI reference: OT sensor network monitoring - Microsoft Defender for IoT
description: Learn about the CLI commands available for configuring Microsoft Defender for IoT OT network sensors.
ms.date: 09/07/2022
ms.topic: reference
---

# Advanced CLI reference: OT sensor network monitoring

## Trigger test alert
With the following command, you can test connectivity and alert forwarding from the sensor to management products such as the Azure portal, on-premises management console, or third-party SIEM.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|  | `` | ``|

## Review audit logs

An audit log of sensor activity can be reviewed from the command line using the following command. More information isa available [here](how-to-create-and-manage-users)

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|  | `` | ``|

## Apply ingress traffic filters (capture filter)
### Block by IP address range
Administrators can use the capture filter to eliminate network traffic that doesn't need to be monitored. Filtering traffic can be accomplished using include or exclude lists. 

> [!NOTE]
>This command doesn't support the malware detection engine.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|  | `` | ``|

```bash
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

### Block by port

Include or exclude UDP and TCP ports for all the traffic.

>`502`: single port

>`502,443`: both ports

>`Enter tcp ports to include (delimited by comma or Enter to skip):`

>`Enter udp ports to include (delimited by comma or Enter to skip):`

>`Enter tcp ports to exclude (delimited by comma or Enter to skip):`

>`Enter udp ports to exclude (delimited by comma or Enter to skip):`
>

### Components

You're asked the following question:

>`In which component do you wish to apply this capture filter?`

Your options are: `all`, `dissector`, `collector`, `statistics-collector`, `rpc-parser`, or `smb-parser`.

In most common use cases, we recommend that you select `all`. Selecting `all` doesn't include the malware detection engine, which isn't supported by this command.

### Base capture filter

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

### Viewing capture filters on the appliance components

You can view filters in ```/var/cyberx/properties/cybershark.properties```:

- **statistics-collector**: `bpf_filter property` in ```/var/cyberx/properties/net.stats.collector.properties```

- **dissector**: `override.capture_filter` property in ```/var/cyberx/properties/cybershark.properties```

- **rpc-parser**: `override.capture_filter` property in ```/var/cyberx/properties/rpc-parser.properties```

- **smb-parser**: `override.capture_filter` property in ```/var/cyberx/properties/smb-parser.properties```

- **collector**: `general.bpf_filter` property in ```/var/cyberx/properties/collector.properties```

### Resetting all capture filters
The default capture filter configuration can be restored by entering the following command:
|User  |Command  |Full command syntax   |
|---------|---------|---------|
| cyberx  | `sudo cyberx-xsense-capture-filter -p all -m all-connected ` | N/A|

```bash
sudo cyberx-xsense-capture-filter -p all -m all-connected
```


## Local alert suppression
### Show alert suppression rules
If you wish to see a list of exclusion rules that are already in place, enter the following command:

|User  |Command  |Full command syntax   |
|---------|---------|---------|
|  | `` | ``|

```bash
alerts exclusion-rule-list [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  
[-dev DEVICES] [-a ALERTS]
```

### Create new alert suppression rule
Using the CLI, it is possible to create a local alert exclusion rule by entering the following command:


```bash
alerts exclusion-rule-create [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  
[-dev DEVICES] [-a ALERTS]
```

There are a number of attributes that can be used with the alert exclusion rules, including:

| Attribute | Description |
|--|--|
| [-h] | Prints the help information for the command. |
| -n NAME | The name of the rule being created. |
| [-ts TIMES] | The time span for which the rule is active. This should be specified as:<br />`xx:yy-xx:yy`<br />You can define more than one time period by using a comma between them. For example: `xx:yy-xx:yy, xx:yy-xx:yy`. |
| [-dir DIRECTION] | The direction in which the rule is applied. This should be specified as:<br />`both | src | dst` |
| [-dev DEVICES] | The IP address and the address type of the devices to be excluded by the rule, specified as:<br />`ip-x.x.x.x`<br />`mac-xx:xx:xx:xx:xx:xx`<br />`subnet: x.x.x.x/x` |
| [-a ALERTS] | The name of the alert that the rule will exclude:<br />`0x00000`<br />`0x000001` |

### Append/Edit an alert suppression rule
In the CLI, enter the following command to append local alert exclusion rules:


```bash
alerts exclusion-rule-append [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  
[-dev DEVICES] [-a ALERTS]
```

As explained in the section Create local alert exclusion rules, these attributes are also used here. In this case, the attributes are applied to existing rules.


### Remove (Delete) an alert suppression rule
The following command can be used to remove an existing alert exclusion rule:

```bash
alerts exclusion-rule-remove [-h] -n NAME [-ts TIMES] [-dir DIRECTION]  
[-dev DEVICES] [-a ALERTS]
```

The following attribute can be used with the alert exclusion rules:

| Attribute | Description|
| --------- | ---------------------------------- |
| -n NAME | The name of the rule to be deleted. |

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
