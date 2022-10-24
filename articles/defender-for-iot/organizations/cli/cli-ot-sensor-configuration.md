---
title: Advanced CLI reference - OT sensor network monitoring - Microsoft Defender for IoT
description: Learn about the CLI commands available for configuring Microsoft Defender for IoT OT network sensors.
ms.date: 09/07/2022
ms.topic: reference
---

# Advanced CLI reference: OT sensor network monitoring

This article lists the CLI commands available for monitoring OT networks with Microsoft Defender for IoT OT network sensors.

Command syntax differs depending on the user performing the command, as indicated below for each activity.

## Prerequisites

Before you can run any of the following CLI commands, you'll need access to the CLI on your OT network sensor as a privileged user.

Each activity listed below is accessible by a different set of privileged users, including the *cyberx*, *support*, or *cyber_x_host* users. Command syntax is listed only for the users supported for a specific activity.

>[!IMPORTANT]
> We recommend that you use the *support* user for CLI access whenever possible.

For more information, see [Access the CLI](cli-overview.md#access-the-cli) and [Privileged user access for OT monitoring](cli-overview.md#privileged-user-access-for-ot-monitoring).

## Trigger test alert

Use the following command to test connectivity and alert forwarding from the sensor to management consoles, including the Azure portal, a Defender for IoT on-premises management console, or a third-party SIEM.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| cyberx | `cyberx-xsense-trigger-test-alert` | No attributes |

For example:

```bash
root@xsense:/# cyberx-xsense-trigger-test-alert
Triggering Test Alert...
Test Alert was successfully triggered.
```

## Apply ingress traffic filters (*capture* filter)

For advanced network scenarios, administrators can use the **capture** filter <!--not sure what this is, we should clarify--> to eliminate network traffic that doesn't need to be monitored from detected data. Use either include or exclude lists to filter traffic.

> [!NOTE]
> Commands for applying traffic filters don't support Defender for IoT malware detections.
>

### Create a new capture-filter

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **support** | `network capture-filter` | No attributes |
| **cyberx** | `cyberx-xsense-capture-filter` | `cyberx-xsense-capture-filter [-h] [-i INCLUDE] [-x EXCLUDE] [-etp EXCLUDE_TCP_PORT] [-eup EXCLUDE_UDP_PORT] [-itp INCLUDE_TCP_PORT] [-iup INCLUDE_UDP_PORT] [-vlan INCLUDE_VLAN_IDS] -p PROGRAM [-o BASE_HORIZON] [-s BASE_TRAFFIC_MONITOR] [-c BASE_COLLECTOR] -m MODE [-S]`   |

Supported attributes are defined as follows:

|Attribute  |Description  |
|---------|---------|
|`-h`, `--help`     |  Shows the help message and exits.      |
|`-i <INCLUDE>`, `--include <INCLUDE>`     |  The path to a file that contains the devices and subnet masks you want to include, where `<INCLUDE>` is the path to the file.       |
|`-x EXCLUDE`, `--exclude EXCLUDE`     |  The path to a file that contains the devices and subnet masks you want to exclude, where `<EXCLUDE>` is the path to the file.       |
|- `-etp <EXCLUDE_TCP_PORT>`, `--exclude-tcp-port <EXCLUDE_TCP_PORT>`     | Excludes TCP traffic on any specified ports, where the `<EXCLUDE_TCP_PORT>` defines the port or ports you want to exclude. Delimitate multiple reports by commas, with no spaces.        |
|`-eup <EXCLUDE_UDP_PORT>`, `--exclude-udp-port <EXCLUDE_UDP_PORT>`     |   Excludes UDP traffic on any specified ports, where the `<EXCLUDE_UDP_PORT>` defines the port or ports you want to exclude. Delimitate multiple reports by commas, with no spaces.              |
|`-itp <INCLUDE_TCP_PORT>`, `--include-tcp-port <INCLUDE_TCP_PORT>`     |   Includes TCP traffic on any specified ports, where the `<INCLUDE_TCP_PORT>` defines the port or ports you want to include. Delimitate multiple reports by commas, with no spaces.                   |
|`-iup <INCLUDE_UDP_PORT>`, `--include-udp-port <INCLUDE_UDP_PORT>`     |  Includes UDP traffic on any specified ports, where the `<INCLUDE_UDP_PORT>` defines the port or ports you want to include. Delimitate multiple reports by commas, with no spaces.                    |
|`-vlan <INCLUDE_VLAN_IDS>`, `--include-vlan-ids <INCLUDE_VLAN_IDS>`     |  Includes VLAN traffic by specified VLAN IDs, `<INCLUDE_VLAN_IDS>` defines the VLAN ID or IDs you want to include. Delimitate multiple reports by commas, with no spaces.                          |
|`-p <PROGRAM>`, `--program <PROGRAM>`     | Defines the program you're working with, where `<PROGRAM>` has the following supported values: <br>- `traffic-monitor` <br>- `collector` <br>- `horizon` <br>- `all` <!--do we need more information about when to use each?-->        |
|`-o <BASE_HORIZON>`, `--base-horizon <BASE_HORIZON>`     | Defines the base capture filter, where `<BASE_HORIZON>` is the filter you want to use. <br> Default value = `""`       |
|`-s BASE_TRAFFIC_MONITOR`, `--base-traffic-monitor BASE_TRAFFIC_MONITOR`     |    The basic capture filter (the default is "") <!--this is the same as the prev-->     |
|`-c BASE_COLLECTOR`, `--base-collector BASE_COLLECTOR`     | The basic capture filter (the default is "") <!--this is the same as the prev-->             |
|`-m <MODE>`, `--mode <MODE>`     | Relevant only when an include list is used.  <!--the following description is unclear--> Assume A and B are in the included set and X isn't so "-m  internal" allows only [A B] and "-m all-connected" also allows [A X] [B X]    |
| `-S`, `--from-shell` | Replaces special characters in arguments received from the shell CLI. <!--can we give an example?--> |

After you run the command, answer the questions that are prompted as follows:

1. `Would you like to supply devices and subnet masks you wish to include in the capture filter? [Y/N]:`

    Select `Y` to open a nano file where you can add a device, channel, port, and subset. Including a device, channel, or subnet causes the sensor to process all valid traffic for the supplied argument, including ports and traffic that wouldn't otherwise be processed. <!--for example?-->

    In the nano file, use the following syntax:

    | Attribute | Description |
    |--|--|
    | `1.1.1.1` | Includes all of the traffic for this device. |
    | `1.1.1.1,2.2.2.2` | Includes all of the traffic for this channel. |
    | `1.1.1,2.2.2` | Includes all of the traffic for this subnet. |

    Separate arguments by dropping a row.

1. `Would you like to supply devices and subnet masks you wish to exclude from the capture filter? [Y/N]:`

    Select `Y` to open a nano file where you can add a device, channel, port, and subset. Excluding a device, channel, or subnet prevents the sensor from processing traffic for the supplied argument, including ports and traffic that would otherwise be processed. <!--for example?-->

    In the nano file, use the following syntax:

    | Attribute | Description |
    |--|--|
    | `1.1.1.1` | Excludes all the traffic for this device. |
    | `1.1.1.1,2.2.2.2` | Excludes all the traffic for this channel, meaning all the traffic between two devices. |
    | `1.1.1.1,2.2.2.2,443` | Excludes all the traffic for this channel by port. |
    | `1.1.1` | Excludes all the traffic for this subnet. |
    | `1.1.1,2.2.2` | Excludes all the traffic for between subnets. |

    Separate arguments by dropping a row.

1. Define any TCP or UDP ports to include or exclude, using the following syntax:

    - `502`: single port
    - `502,443`: both ports

    Separate multiple ports by comma. If you don't want to include or exclude ports, press `ENTER` to skip the step.

1. `In which component do you wish to apply this capture filter?`

    Configure a filter for a specific component. <!--left off editing here-->

In the next step, the filter can be setup for a specific component (advanced troubleshooting).
In most common use cases, we recommend that you select `all` (Selecting `all` doesn't include the malware detection engine, which isn't supported by this command).


Your options are: `all`, `dissector`, `collector`, `statistics-collector`, `rpc-parser`, or `smb-parser`.

In the next step, a base capture filter can be setup for the components. For example, a filter can allow which ports are available to the component.
Select `Y` for all of the following options. All of the filters are added to the baseline after the changes are set. If you make a change, it will overwrite the existing baseline.

>`Would you like to supply a custom base capture filter for the dissector component? [Y/N]:`
>
>`Would you like to supply a custom base capture filter for the collector component? [Y/N]:`
>
>`Would you like to supply a custom base capture filter for the statistics-collector component? [Y/N]:`
>
>`Would you like to supply a custom base capture filter for the rpc-parser component? [Y/N]:`
>
>`Would you like to supply a custom base capture filter for the smb-parser component? [Y/N]:`
>

In the next step, the breadth of the capture filter is set:
We recommend that you select `internal`.

For example, for a subnet such as 1.1.1:
- `internal` will exclude only traffic within the specific subnet.
- `all-connected` will exclude that subnet and all the traffic to and from that subnet.

>`Type Y for "internal" otherwise N for "all-connected" (custom operation mode enabled) [Y/N]:`

> [!NOTE]
> Your choices are used for all the filters in the tool and are not session dependent. In other words, you can't ever choose `internal` for some filters and `all-connected` for others.

The following example shows the command syntax and response for the *support* user:

```bash
root@xsense: network capture-filter
Would you like to supply devices and subnet masks you wish to include in the capture filter? [y/N]: n
Would you like to supply devices and subnet masks you wish to exclude from the capture filter? [y/N]: n
Enter tcp ports to include (delimited by comma or Enter to skip):
Enter udp ports to include (delimited by comma or Enter to skip):
Enter tcp ports to exclude (delimited by comma or Enter to skip):
Enter udp ports to exclude (delimited by comma or Enter to skip):
Enter VLAN ids to include (delimited by comma or Enter to skip):
In which component do you wish to apply this capture filter?all
Would you like to supply a custom base capture filter for the collector component? [y/N]: n
Would you like to supply a custom base capture filter for the traffic_monitor component? [y/N]: n
Would you like to supply a custom base capture filter for the horizon component? [y/N]: n
type Y for "internal" otherwise N for "all-connected" (custom operation mode enabled) [Y/n]: n 
starting "/usr/local/bin/cyberx-xsense-capture-filter --program all --mode internal --from-shell"
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
root@xsense:
```


### Viewing capture filters on the appliance components

You can view filters in ```/var/cyberx/properties/cybershark.properties```:

- **statistics-collector**: `bpf_filter property` in ```/var/cyberx/properties/net.stats.collector.properties```
- **dissector**: `override.capture_filter` property in ```/var/cyberx/properties/cybershark.properties```
- **rpc-parser**: `override.capture_filter` property in ```/var/cyberx/properties/rpc-parser.properties```
- **smb-parser**: `override.capture_filter` property in ```/var/cyberx/properties/smb-parser.properties```
- **collector**: `general.bpf_filter` property in ```/var/cyberx/properties/collector.properties```

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| support | `edit-config cybershark` | No attributes |
| cyberx | `nano /var/cyberx/properties/cybershark.properties` | No attributes |

### Resetting all capture filters

The default capture filter configuration can be restored by entering the following command:
|User  |Command  |Full command syntax   |
|---------|---------|---------|
| cyberx  | `cyberx-xsense-capture-filter -p all -m all-connected ` | N/A|

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


## Local alert suppression
### Show alert suppression rules

If you wish to see a list of exclusion rules that are already in place, enter the following command:

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| support | `alerts exclusion-rule-list` | No attributes |
| cyberx | `cyberx-xsense-exclusion-rule-list` | No attributes |

For example, for the support user:

```bash
root@xsense: alerts exclusion-rule-list
starting "/usr/local/bin/cyberx-xsense-exclusion-rule-list"
root@xsense:
```

### Create new alert suppression rule

Using the CLI, it is possible to create a local alert exclusion rule by entering the following command:

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| support | `cyberx-xsense-exclusion-rule-create [-h] -n NAME [-ts TIMES] [-dir DIRECTION] [-dev DEVICES] [-a ALERTS]` |  -h, --help show this help message and exit<br> -n NAME, --name NAME  Rule name<br>  -ts TIMES, --time_span TIMES Excluded time periods (xx:yy-xx:yy, xx:yy-xx:yy)<br>  -dir DIRECTION, --direction DIRECTION Excluded address direction (both / src / dst)<br>  -dev DEVICES, --devices DEVICES Device address and address type (ip-x.x.x.x, mac-xx:xx:xx:xx:xx:xx, subnet:x.x.x.x/x)<br> -a ALERTS, --alerts ALERTS scenario names by hex (0x00000, 0x000001) |
| cyberx | `cyberx-xsense-exclusion-rule-create [-h] -n NAME [-ts TIMES] [-dir DIRECTION] [-dev DEVICES] [-a ALERTS]` | -h, --help show this help message and exit<br> -n NAME, --name NAME  Rule name<br>  -ts TIMES, --time_span TIMES Excluded time periods (xx:yy-xx:yy, xx:yy-xx:yy)<br>  -dir DIRECTION, --direction DIRECTION Excluded address direction (both / src / dst)<br>  -dev DEVICES, --devices DEVICES Device address and address type (ip-x.x.x.x, mac-xx:xx:xx:xx:xx:xx, subnet:x.x.x.x/x)<br> -a ALERTS, --alerts ALERTS scenario names by hex (0x00000, 0x000001)  |

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
