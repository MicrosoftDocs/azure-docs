---
title: Micro agent configurations (Preview)
description: The collector sends all current data immediately after any configuration change is made. The changes are then applied.
ms.date: 12/22/2021
ms.topic: conceptual
---

# Micro agent configurations (Preview)

This article describes the different types of configurations that the micro agent supports. Customers can configure the micro agent to fit the needs of their devices, and network environments.  

The micro agent's behavior is configured by a set of module twin properties. You can configure the micro agent to best suit your needs. For example, you can exclude events automatically, minimize power consumption, and reduce network bandwidth.

After any change in configuration, the collector will immediately send all unsent event data. After the data is sent, the changes will be applied, and all the collectors will restart.

## General configuration

Define the frequency in which messages are sent for each priority level. All values are required.

Default values are as follows:

| Frequency | Time period (in minutes) |
|--|--|
| **Low** | 1440 (24 hours) |
| **Medium** | 120 (2 hours) |
| **High** | 30 (.5 hours) |
| | |

To reduce the number of messages sent to cloud, each priority should be set as a multiple of the one below it. For example, High: 60 minutes, Medium: 120 minutes, Low: 480 minutes.

The syntax for configuring the frequencies is as follows:

`"CollectorsCore_PriorityIntervals"` : `"<High>,<Medium>,<Low>"`

For example:

`"CollectorsCore_PriorityIntervals"` : `"30,120,1440"`

## Baseline collector-specific settings

| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **Baseline_GroupsDisabled** | A list of Baseline group names, separated by a comma. <br><br>For example: `Time Synchronization, Network Parameters Host` | Defines the full list of Baseline group names that should be disabled. | Null |
| **Baseline_ChecksDisabled** |A list of Baseline check IDs, separated by a comma. <br><br>For example: `3.3.5,2.2.1.1` | Defines the full list of Baseline check IDs that should be disabled. | Null |
| | | | |


## Event-based collector configurations

These configurations include process, and network activity collectors.

| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **Interval** | `High` <br>`Medium`<br>`Low` | Determines the sending frequency.  | `Medium` |
| **Aggregation mode** | `True` <br>`False` | Determines whether to process event aggregation for an identical event.  | `True` |
| **Cache size** | cycle FIFO | Defines the number of events collected in between the the times that data is sent. | `256` |
| **Disable collector** | `True` <br> `False` | Determines whether or not the collector is operational. | `False` |
| | | | |

## IoT Hub Module-specific settings

| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **IothubModule_MessageTimeout** | Positive integer, including limits | Defines the number of minutes to retain messages in the outbound queue to the IoT Hub, after which point the messages are dropped. | `2880` (=2 days) |
| | | | |
## Network activity collector-specific settings

| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **Devices** | A list of the network devices separated by a comma. <br><br>For example `eth0,eth1` | Defines the list of network devices (interfaces) that the agent will use to monitor the traffic. <br><br>If a network device is not listed, the Network Raw events will not be recorded for the missing device.| `eth0` |
| | | | |

## Process collector specific-settings


| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **Process_Mode** | `1` = Auto <br>`2` = Netlink <br>`3`= Polling | Determines the process collector mode. In `Auto` mode, the agent first tries to enable the Netlink mode. <br><br>If that fails, it will automatically fall back / switch to the Polling mode.| `1` |
|**Process_PollingInterval** |Integer |Defines the polling interval in microseconds. This value is used when the **Process_Mode** is in `Polling` mode. | `100000` (=0.1 second) |
| | | | |

## Trigger-based collector configurations

These configurations include system information, and baseline collectors.

| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **Interval** | `High` <br>`Medium`<br>`Low`  | The frequency in which data is sent. | `Low` |
| **Disable collector** | `True` <br> `False` | Whether or not the collector is operational. | `False` |
| | | | |


## Next steps

For more information, see [Configure a micro agent twin](how-to-configure-micro-agent-twin.md).
