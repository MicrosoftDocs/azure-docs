---
title: Micro agent configurations
description: The collector sends all current data immediately after any configuration change is made. The configuration changes are then applied.
ms.date: 05/03/2022
ms.topic: conceptual
---

# Micro agent configurations

This article describes the different types of configurations that the micro agent supports. Customers can configure the micro agent to fit the needs of their devices, and network environments.  

The micro agent's behavior is configured by a set of module twin properties. You can configure the micro agent to best suit your needs. For example, you can turn off certain events to minimize power consumption, and reduce other resource usage.

After any change in configuration, the collector will immediately send all unsent event data. After the data is sent, the changes will be applied, and collectors will be restarted as needed.

## General configuration

Define the frequency in which messages are sent for each priority level. All values are required.

Default values are as follows:

| Frequency | Time period (in minutes) |
|--|--|
| **Low** | 1440 (24 hours) |
| **Medium** | 120 (2 hours) |
| **High** | 30 (.5 hours) |

To reduce resource consumption on the device, each priority should be set as a multiple of the one below it. For example, High: 60 minutes, Medium: 120 minutes, Low: 480 minutes.

The syntax for configuring the frequencies is as follows:

`"CollectorsCore_PriorityIntervals"` : `"<High>,<Medium>,<Low>"`

For example:

`"CollectorsCore_PriorityIntervals"` : `"30,120,1440"`


## Collector types and properties

Configure the micro agent using the following collector-specific properties and settings:

### Baseline collector-specific settings

| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **Baseline_Disabled** | `True`/`False` | Disables the Baseline collector. | `False` |
| **Baseline_MessageFrequency** | `Low`/`Medium`/`High` | Defines the frequency in which to send Baseline events. | `Low` |
| **Baseline_GroupsDisabled** | A list of Baseline group names, separated by a comma. <br><br>For example: `Time Synchronization, Network Parameters Host` | Defines the full list of Baseline group names that should be disabled. | `Null` |
| **Baseline_ChecksDisabled** |A list of Baseline check IDs, separated by a comma. <br><br>For example: `3.3.5,2.2.1.1` | Defines the full list of Baseline check IDs that should be disabled. | `Null` |

### System Information collector-specific settings

| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **SystemInformation_Disabled** | `True`/`False` | Disables the System Information collector. | `False` |
| **SystemInformation_MessageFrequency** | `Low`/`Medium`/`High` | Defines the frequency in which to send System Information events. | `Low` |
| **SystemInformation_HardwareVendor** | string | Set hardware vendor information. | `None` |
| **SystemInformation_HardwareModel** | string | Set hardware model information. | `None` |
| **SystemInformation_HardwareSerialNumber** | string | Set hardware serial number information. | `None` |
| **SystemInformation_FirmwareVendor** | string | Set firmware vendor information. | `None` |
| **SystemInformation_FirmwareVersion** | string | Set firmware version information. | `None` |

### SBoM collector-specific settings

| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **SBoM_Disabled** | `True`/`False` | Disables the SBoM collector. | `False` |
| **SBoM_MessageFrequency** | `Low`/`Medium`/`High` | Defines the frequency in which to send SBoM events. | `Low` |

### Heartbeat collector-specific settings

| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **Heartbeat_Disabled** | `True`/`False` | Disables sending the Heartbeat event. | `False` |
| **Heartbeat_MessageFrequency** | `Low`/`Medium`/`High` | Defines the frequency in which to send Heartbeat events. | `Low` |

### Login collector-specific settings

| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **Login_Disabled** | `True`/`False` | Disables the Login collector. | `False` |
| **Login_MessageFrequency** | `Low`/`Medium`/`High` | Defines the frequency in which to send Login events. | `Medium` |
| **Login_UsePAM** | `True`/`False` | Use a PAM module to gather login events. Without PAM, the agent uses a combination of reading UTMP and Syslog to gather login events. If the system doesn't have UTMP or Syslog enabled, using PAM is an option, but will require additional configuration to work properly. For more information, see [Configure Pluggable Authentication Modules (PAM) to audit sign-in events](configure-pam-to-audit-sign-in-events.md) | `False` |

### IoT Hub module-specific settings

| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **IothubModule_MessageTimeout** | Positive integer, including limits | Defines the number of minutes to retain messages in the outbound queue to the IoT Hub, after which point the messages are dropped. | `2880` (=2 days) |

### Network Activity collector-specific settings

| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **NetworkActivity_Disabled** | `True`/`False` | Disables the Network Activity collector. | `False` |
| **NetworkActivity_MessageFrequency** | `Low`/`Medium`/`High` | Defines the frequency in which to send Network Activity events. | `Medium` |
| **NetworkActivity_Devices** | A list of the network devices separated by a comma. <br><br>For example `eth0,eth1` | Defines the list of network devices (interfaces) that the agent will use to monitor the traffic. <br><br>If a network device isn't listed, the network raw events won't be recorded for the missing device.| `eth0` |
| **NetworkActivity_CacheSize** | Positive integer | The number of Network Activity events (after aggregation) to keep in the cache between send intervals. Beyond that number, older events will be dropped (lost).| `256` |
| **NetworkActivity_PacketBufferSize** | Positive integer | Configure the buffer size (in bytes) that will be used to capture packets for a single device per direction (incoming or outcoming traffic). | `2097152 (=2MB)` |

### Process collector-specific settings

| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **Process_Disabled** | `True`/`False` | Disables the Process collector. | `False` |
| **Process_MessageFrequency** | `Low`/`Medium`/`High` | Defines the frequency in which to send Process events. | `Medium` |
|**Process_PollingInterval** | Positive Integer | Defines the polling interval in microseconds. This value is used when the **Process_Mode** is in `Polling` mode. | `100000` (=0.1 second) |
| **Process_Mode** | `1` = Auto <br>`2` = Netlink <br>`3`= Polling | Determines the Process collector mode. In `Auto` mode, the agent first tries to enable the Netlink mode. <br><br>If that fails, it will automatically fall back / switch to the Polling mode.| `1` |
| **Process_CacheSize** | Positive integer | The number of Process events (after aggregation) to keep in the cache between send intervals. Beyond that number, older events will be dropped (lost).| `256` |

### Log collector-specific settings

| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **LogCollector_Disabled** | `True`/`False` | Disables the Logs collector. | `False` |
| **LogCollector_MessageFrequency** | `Low`/`Medium`/`High` | Defines the frequency in which to send Log events. | `Low` |

### File system collector-specific settings

| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **FileSystem_Disabled** | `True`/`False` | Disables the file system collector. | `False` |
| **FileSystem_MessageFrequency** | `Low`/`Medium`/`High` | Defines the frequency in which to send file system events. | `Low` |
| **FileSystem_Recursive** | `True`/`False` | If set to true, monitors all directories under the given path. | `True` |
| **FileSystem_Paths** | Paths to monitor. <br><br> For example: `/path/to/monitor`, `/another/path/to/monitor`| Defines which paths to monitor, more than one path can be monitored. | `Null` |
| **FileSystem_CacheSize** | Positive integer | The number of File system events (after aggregation) to keep in the cache between send intervals. Beyond that number, older events will be dropped (lost). | `256` |

### Peripheral collector-specific settings

| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **Peripheral_Disabled** | `True`/`False` | Disables the peripheral collector. | `False` |
| **Peripheral_MessageFrequency** | `Low`/`Medium`/`High` | Defines the frequency in which to send peripheral events. | `Low` |
| **Peripheral_CacheSize** | Positive integer | The number of peripheral events (after aggregation) to keep in the cache between send intervals. Beyond that number, older events will be dropped (lost). | `256` |

### Statistics collector-specific settings

| Setting Name | Setting options | Description | Default |
|--|--|--|--|
| **Statistics_Disabled** | `True`/`False` | Disables the statistics collector. | `False` |
| **Statistics_MessageFrequency** | `Low`/`Medium`/`High` | Defines the frequency in which to send statistics events. | `Low` |
| **Statistics_CacheSize** | Positive integer | The number of statistics events (after aggregation) to keep in the cache between send intervals. Beyond that number, older events will be dropped (lost). | `256` |

## Next steps

For more information, see:

- [Configure a micro agent twin](how-to-configure-micro-agent-twin.md).

- [Micro agent event collection](concept-event-aggregation.md)
