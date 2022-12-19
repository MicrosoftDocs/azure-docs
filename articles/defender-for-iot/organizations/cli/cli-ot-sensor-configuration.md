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

For more information, see [Access the CLI](../references-work-with-defender-for-iot-cli-commands.md#access-the-cli) and [Privileged user access for OT monitoring](../references-work-with-defender-for-iot-cli-commands.md#privileged-user-access-for-ot-monitoring).

## Triggering a test alert

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

## Applying capture filters for incoming traffic

To reduce alert fatigue and focus your network monitoring on high priority traffic, you may decide to filter the traffic that streams into Defender for IoT at the source.

In such cases, use include and/or exclude lists to create and configure capture filters on your OT network sensors. Capture filters ensure that the data that reaches Defender for IoT is only the data that you need to monitor.

Capture filters don't apply to [Defender for IoT malware alerts](../alert-engine-messages.md#malware-engine-alerts), which are triggered on all detected network traffic.

Configure capture filters on each of the following sensor components, or on all sensor components at once:

- `horizon`: Captures deep packet inspection (DPI) data
- `collector`: Captures PCAP data
- `traffic-monitor`: Captures communication statistics

If you configure capture filters for specific components, you can use your initial include and exclude files as a base, or template, capture filter. Then, configure extra filters for each component on top of the base as needed.

> [!TIP]
> We recommend configuring capture filters on all components at once, and this is the method most often used.

### Creating a new capture filter

The method used to configure the capture filter differs, depending on the user performing the command:

- **support** user: Run the specified command, and then enter values as [prompted by the CLI](#create-a-new-capture-filter-using-the-support-user), editing your include and exclude lists in a nano editor.
- **cyberx** user: Run the specified command with specific attributes to configure your capture filter.

Use the following commands to create a new capture filter:

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **support** | `network capture-filter` | No attributes.|
| **cyberx** | `cyberx-xsense-capture-filter` | `cyberx-xsense-capture-filter [-h] [-i INCLUDE] [-x EXCLUDE] [-etp EXCLUDE_TCP_PORT] [-eup EXCLUDE_UDP_PORT] [-itp INCLUDE_TCP_PORT] [-iup INCLUDE_UDP_PORT] [-vlan INCLUDE_VLAN_IDS] -p PROGRAM [-o BASE_HORIZON] [-s BASE_TRAFFIC_MONITOR] [-c BASE_COLLECTOR] -m MODE [-S]`   |

Supported attributes for the *cyberx* user are defined as follows:

|Attribute  |Description  |
|---------|---------|
|`-h`, `--help`     |  Shows the help message and exits.      |
|`-i <INCLUDE>`, `--include <INCLUDE>`     |  The path to a file that contains the devices and subnet masks you want to include, where `<INCLUDE>` is the path to the file.       |
|`-x EXCLUDE`, `--exclude EXCLUDE`     |  The path to a file that contains the devices and subnet masks you want to exclude, where `<EXCLUDE>` is the path to the file.       |
|- `-etp <EXCLUDE_TCP_PORT>`, `--exclude-tcp-port <EXCLUDE_TCP_PORT>`     | Excludes TCP traffic on any specified ports, where the `<EXCLUDE_TCP_PORT>` defines the port or ports you want to exclude. Delimitate multiple ports by commas, with no spaces.        |
|`-eup <EXCLUDE_UDP_PORT>`, `--exclude-udp-port <EXCLUDE_UDP_PORT>`     |   Excludes UDP traffic on any specified ports, where the `<EXCLUDE_UDP_PORT>` defines the port or ports you want to exclude. Delimitate multiple ports by commas, with no spaces.              |
|`-itp <INCLUDE_TCP_PORT>`, `--include-tcp-port <INCLUDE_TCP_PORT>`     |   Includes TCP traffic on any specified ports, where the `<INCLUDE_TCP_PORT>` defines the port or ports you want to include. Delimitate multiple ports by commas, with no spaces.                   |
|`-iup <INCLUDE_UDP_PORT>`, `--include-udp-port <INCLUDE_UDP_PORT>`     |  Includes UDP traffic on any specified ports, where the `<INCLUDE_UDP_PORT>` defines the port or ports you want to include. Delimitate multiple ports by commas, with no spaces.                    |
|`-vlan <INCLUDE_VLAN_IDS>`, `--include-vlan-ids <INCLUDE_VLAN_IDS>`     |  Includes VLAN traffic by specified VLAN IDs, `<INCLUDE_VLAN_IDS>` defines the VLAN ID or IDs you want to include. Delimitate multiple VLAN IDs by commas, with no spaces.                          |
|`-p <PROGRAM>`, `--program <PROGRAM>`     | Defines the [component](#applying-capture-filters-for-incoming-traffic) for which you want to configure a capture filter, where `<PROGRAM>` has the following supported values: <br>- `traffic-monitor` <br>- `collector` <br>- `horizon` <br>- `all`: Recommended, and creates a single capture filter for all components       |
|`-o <BASE_HORIZON>`, `--base-horizon <BASE_HORIZON>`     | Defines the base capture filter for the `horizon` component, where `<BASE_HORIZON>` is the filter you want to use. <br> Default value = `""`       |
|`-s BASE_TRAFFIC_MONITOR`, `--base-traffic-monitor BASE_TRAFFIC_MONITOR`     |    Defines the basic capture filter for the `traffic-monitor` component. <br> Default value = `""`    |
|`-c BASE_COLLECTOR`, `--base-collector BASE_COLLECTOR`     | Defines the basic capture filter for the `collector` component.  <br> Default value = `""`             |
|`-m <MODE>`, `--mode <MODE>`     | Defines an include list mode, and is relevant only when an include list is used. Use one of the following values: <br><br>- `internal`: Includes all communication between the specified source and destination <br>- `all-connected`: Includes all communication between either of the specified endpoints and external endpoints. <br><br>For example, for endpoints A and B, if you use the `internal` mode, included traffic will only include communications between endpoints **A** and **B**. <br>However, if you use the `all-connected` mode, included traffic will include all communications between A *or* B and other, external endpoints. |

#### Create a new capture filter using the support user

If you are creating a new capture filter as the *support* user, no attributes are passed in the [original command](#creating-a-new-capture-filter). Instead, a series of prompts are displayed to help you create the capture filter interactively.

Reply to the prompts displayed as follows:

1. `Would you like to supply devices and subnet masks you wish to include in the capture filter? [Y/N]:`

    Select `Y` to open a new include file, where you can add a device, channel, and/or subnet that you want to include in monitored traffic. Any other traffic, not listed in your include file, isn't ingested to Defender for IoT.

    The include file is opened in the [Nano](https://www.nano-editor.org/dist/latest/cheatsheet.html) text editor.  In the include file, define devices, channels, and subnets as follows:

    |Type  |Description  |Example  |
    |---------|---------|---------|
    |**Device**     |   Define a device by its IP address.      |    `1.1.1.1` includes all traffic for this device.     |
    |**Channel****     |    Define a channel by the IP addresses of its source and destination devices, separated by a comma.     |   `1.1.1.1,2.2.2.2` includes all of the traffic for this channel.      |
    |**Subnet**     |    Define a subnet by its network address.     |   `1.1.1` incudes all traffic for this subnet.      |
    |**Subnet channel**     |    Define a subnet channel network addresses of the source and destination subnets.     |   `1.1.1,2.2.2` incudes all of the traffic between these subnets.      |

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
    | **Subnet channel**: Define a subnet channel network addresses of the source and destination subnets. | `1.1.1,2.2.2` excludes all of the traffic between these subnets. |

    List multiple arguments in separate rows.

1. Reply to the following prompts to define any TCP or UDP ports to include or exclude. Separate multiple ports by comma, and press ENTER to skip any specific prompt.

    - `Enter tcp ports to include (delimited by comma or Enter to skip):`
    - `Enter udp ports to include (delimited by comma or Enter to skip):`
    - `Enter tcp ports to exclude (delimited by comma or Enter to skip):`
    - `Enter udp ports to exclude (delimited by comma or Enter to skip):`
    - `Enter VLAN ids to include (delimited by comma or Enter to skip):`

    For example, enter multiple ports as follows: `502,443`


1. `In which component do you wish to apply this capture filter?`

    Enter one of the following values to configure a capture filter for a specific component only. If you select a specific component, you'll need to run the commands and prompts again to configure other capture filters for the other components.

    - `all` (Recommended)
    - `horizon`
    - `traffic-monitor`
    - `collector`

1. If you're configuring a capture filter for a specific component, you're prompted to configure a custom base capture filter for the selected component. This option uses the capture filter you configured in the previous steps as a base, or template, where you can add extra configurations on top of the base.

    For example, if you'd selected to configure a capture filter for the `collector` component in the previous step, you're prompted: `Would you like to supply a custom base capture filter for the collector component? [Y/N]:`

    Enter `Y` to customize the template for the specified component, or `N` to use the capture filter you'd configured earlier as it is.

1. `Type Y for "internal" otherwise N for "all-connected" (custom operation mode enabled) [Y/N]:`

    This prompt supports the ability to define an include file's mode, or scope. Define whether you want to collect traffic within the specified subnet only, or traffic where even only one of the endpoints is in the specified subnet.

    Supported values include:

    - `internal`: Includes all communication between the specified source and destination
    - `all-connected`: Includes all communication between either of the specified endpoints and external endpoints.

    For example, for endpoints A and B, if you use the `internal` mode, included traffic will only include communications between endpoints **A** and **B**. <br>However, if you use the `all-connected` mode, included traffic will include all communications between A *or* B and other, external endpoints.

    The default mode is `internal`. To use the `all-connected` mode, select `Y` at the prompt, and then enter `all-connected`.

    > [!NOTE]
    > If you've created different capture filters for different components, the mode selection is used for all components. Defining the capture filter for one component as `internal` and the capture filter for another component as `all-connected` isn't supported.

If you're configuring separate capture filters for each component, repeat these steps for each component as needed.

### Viewing capture filters on the sensor components

Use the following commands to show details about the current capture filters configured for your sensor.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **support** | Use the following commands to view the capture filters for each component: <br><br>**horizon**: `edit-config horizon_parser/horizon.properties` <br>**traffic-monitor**: `edit-config traffic_monitor/traffic-monitor` <br>**collector**: `edit-config dumpark.properties` | No attributes |
| **cyberx** | Use the following commands to view the capture filters for each component: <br><br>**horizon**: `nano /var/cyberx/properties/horizon_parser/horizon.properties` <br>- **traffic-monitor**: `nano /var/cyberx/properties/traffic_monitor/traffic-monitor.properties` <br>- **collector**: `nano /var/cyberx/properties/dumpark.properties` | No attributes |

These commands open the following files, which list the capture filters configured for each component:

|Name  |File |Property  |
|---------|---------|---------|
|**horizon**     |  `/var/cyberx/properties/horizon.properties`       |  `horizon.processor.filter`       |
|**traffic-monitor**     |   `/var/cyberx/properties/traffic-monitor.properties`      |    `horizon.processor.filter`     |
|**collector**     |   `/var/cyberx/properties/dumpark.properties`      |   `dumpark.network.filter`      |


### Resetting all capture filters

Use the following command to reset your sensor to the default capture configuration with the *cyberx* user, removing all capture filters.

|User  |Command  |Full command syntax   |
|---------|---------|---------|
| **cyberx**  | `cyberx-xsense-capture-filter -p all -m all-connected` | No attributes |

If you want to modify the existing capture filters, run the [earlier](#creating-a-new-capture-filter) command again, with new attribute values.

To reset all capture filters using the *support* user, run the [earlier](#creating-a-new-capture-filter) command again, and respond `N` to all [prompts](#create-a-new-capture-filter-using-the-support-user) to reset all capture filters.

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

## Alert exclusion rules from an OT sensor

The following commands support alert exclusion features on your OT sensor, including showing current exclusion rules, adding and editing rules, and deleting rules.

### Showing alert exclusion rules

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

### Creating a new alert exclusion rule

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

### Modify an alert exclusion rule

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

### Deleting an alert exclusion rule

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

For more information, see:

- [Getting started with the Defender for IoT CLI](../references-work-with-defender-for-iot-cli-commands.md)
- [Advanced CLI reference: OT sensor appliance management](cli-ot-sensor.md)
