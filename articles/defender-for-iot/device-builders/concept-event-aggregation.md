---
title: Micro agent event collection
description: Defender for IoT security agents collect data and system events from your local device, and send the data to the Azure cloud for processing, and analytics.
ms.date: 04/26/2022
ms.topic: conceptual
---

# Micro agent event collection

Defender for IoT security agents collect data and system events from your local device, and send the data to the Azure cloud for processing.

If you've configured and connected a Log Analytics workspace, you'll see these events in Log Analytics. For more information, see [Tutorial: Investigate security alerts](tutorial-investigate-security-alerts.md).

The Defender for IoT micro agent collects many types of device events including new processes, and all new connection events. Both the new process and new connection events may occur frequently on a device. This capability is important for comprehensive security, however, the number of messages the security agents send may quickly meet, or exceed your IoT Hub quota, and cost limits. These messages and events contain highly valuable security information that is crucial to protecting your device.

To reduce the number of messages and costs while maintaining your device's security, Defender for IoT agents aggregate the following types of events:

- Process events (Linux only)

- Network activity events

- File system events

- Statistics events
 
For more information, see [event aggregation for process and network collectors](#event-aggregation-for-process-and-network-collectors).

Event-based collectors are collectors that are triggered based on corresponding activity from within the device. For example, ``a process was started in the device``.

Trigger-based collectors are collectors that are triggered in a scheduled manner based on the customer's configurations.

## Process events (event-based collector)

Process events are supported on Linux operating systems.

Process events are considered identical when the *command line* and *userid* are identical.

The default buffer for process events is 256 processes. When this limit is met, the buffer will cycle, and the oldest process event is discarded in order to make room for the newest processed event. A warning to increase the cache size will be logged.

The data collected for each event is:

| Parameter | Description|
|--|--|
| **Timestamp** | The first time the process was observed. |
| **process_id** | The Linux PID. |
| **parent_process_id** | The Linux parent PID, if it exists. |
| **Commandline** | The command line. |
| **Type** | Can be either `fork`, or `exec`. |
| **hit_count** | The aggregate count. The number of executions of the same process, during the same time frame, until the events are sent to the cloud. |

## Network Activity events (event-based collector)

Network activity events are considered identical when the local port, remote port, transport protocol, local address, and remote address are identical.

The default buffer for a network activity event is 256. For situations where the cache is full:

- **Azure RTOS devices**: No new network events will be cached until the next collection cycle starts.  

- **Linux devices**: The oldest event will be replaced by every new event. A warning to increase the cache size will be logged.

For Linux devices, only IPv4 is supported.

The data collected for each event is:

| Parameter | Description|
|--|--|
| **Local address** | The source address of the connection. |
| **Remote address** | The destination address of the connection. |
| **Local port** | The source port of the connection. |
| **Remote port** | The destination port of the connection. |
| **Bytes_in** | The total aggregated RX bytes of the connection. |
| **Bytes_out** | The total aggregated TX bytes of the connection. |
| **Transport_protocol** | Can be TCP, UDP, or ICMP. |
| **Application protocol** | The application protocol associated with the connection. |
| **Extended properties** | The Additional details of the connection. For example, `host name`. |
| **Hit count** | The count of packets observed |

## Login collector (event-based collector)

The Login collector collects user sign-ins, sign-outs, and failed sign-in attempts.

The Login collector supports the following types of collection methods:

- **UTMP and SYSLOG**. UTMP catches SSH interactive events, telnet events, and terminal logins, as well as all failed login events from SSH, telnet, and terminal. If SYSLOG is enabled on the device, the Login collector also collects SSH sign-in events via the SYSLOG file named **auth.log**.

- **Pluggable Authentication Modules (PAM)**. Collects SSH, telnet, and local sign-in events. For more information, see [Configure Pluggable Authentication Modules (PAM) to audit sign-in events](configure-pam-to-audit-sign-in-events.md).

The following data is collected:

| Parameter | Description|
|--|--|
| **operation** | One of the following: `Login`, `Logout`, `LoginFailed` |
| **process_id** | The Linux PID. |
| **user_name** | The Linux user. |
| **executable** | The terminal device. For example, `tty1..6` or `pts/n`. |
| **remote_address** | The source of connection, either a remote IP address in IPv6 or IPv4 format, or `127.0.0.1/0.0.0.0` to indicate local connection. |

## System Information (trigger-based collector)

The data collected for each event is:

| Parameter | Description|
|--|--|
| **hardware_vendor** | The name of the vendor of the device. |
| **hardware_model** | The model number of the device. |
| **os_dist** | The distribution of the operating system. For example, `Linux`. |
| **os_version** | The version of the operating system. For example, `Windows 10`, or `Ubuntu 20.04.1`. |
| **os_platform** | The OS of the device. |
| **os_arch** | The architecture of the OS. For example, `x86_64`. |
| **agent_type** | The type of the agent (Edge/Standalone). |
| **agent_version** | The version of the agent. |
| **nics** | The network interface controller. The full list of properties is listed below. |

The **nics** properties are composed of the following;

| Parameter | Description|
|--|--|
|**type** | One of the following values: `UNKNOWN`, `ETH`, `WIFI`, `MOBILE`, or `SATELLITE`. |
| **vlans** | The virtual lan associated with the network interface. |
| **vendor** | The vendor of the network controller. |
| **info** | IPS, and MACs associated with the network controller. This Includes the following fields; <br> - **ipv4_address**: The IPv4 address. <br> - **ipv6_address**: The IPv6 address. <br> - **mac**: The MAC address.|

## Baseline (trigger-based collector)

The baseline collector performs periodic CIS checks, and *failed*, *pass*, and *skip* check results are sent to the Defender for IoT cloud service. Defender for IoT aggregates the results and provides recommendations based on any failures.

The data collected for each event is:

| Parameter | Description|
|--|--|
| **Check ID** | In CIS format. For example, `CIS-debian-9-Filesystem-1.1.2`. |
| **Check result** | Can be `Fail`, `Pass`, `Skip`, or `Error`. For example, `Error` in a situation where the check can’t run. |
| **Error** | The error's information, and description. |
| **Description** | The description of the check from CIS. |
| **Remediation** | The recommendation for remediation from CIS. |
| **Severity** | The severity level. |

## SBoM (trigger-based collector)

The SBoM (Software Bill of Materials) collector collects the packages installed on the device periodically.

The data collected on each package includes:

|Parameter  |Description  |
|---------|---------|
|**Name**     |   The package name.      |
|**Version**     |  The package version.       |
|**Vendor**     |    The package's vendor, which is the **Maintainer** field in deb packages.     |

## Peripheral events (event-based collector)

The Peripheral events collector collect connections and disconnections of USB and Ethernet events.

Collected fields depend on the type of event:

**USB events**

| Parameter | Description|
|--|--|
| **Timestamp** | The time the event occurred. |
| **ActionType** | Whether the event was a connection or disconnection event. |
| **bus_number** | Specific controller identifier, each USB device can have several. |
| **kernel_device_number** | Representation in the kernel of the device, not unique and can each time the device is connected. |
| **device_class** | Identifier specifying the class of device.  |
| **device_subclass** | Identifier specifying the type of device. |
| **device_protocol** | Identifier specifying the device protocol. |
| **interface_class** | In case device class is 0, indicate the type of device. |
| **interface_subclass** | In case device class is 0, indicate the type of device. |
| **interface_protocol** | In case device class is 0, indicate the type of device. |

**Ethernet events**

| Parameter | Description|
|--|--|
| **Timestamp** | The time the event occurred. |
| **ActionType** | Whether the event was a connection or disconnection event. |
| **bus_number** | Specific controller identifier, each USB device can have several. |
| **Interface name** | The interface name. |

## File system events (event-based collector)

The file system events collector collects events whenever there are changes under watch directories for: creation, deletion, move, and modification of directories and files.
To define which directories and files you would like to monitor, see [System information collector specific settings](concept-micro-agent-configuration.md).

The following data is collected:

| Parameter | Description|
|--|--|
| **Timestamp** | The time the event occurred. |
| **Mask** | Linux inotify mask related to the file system event, the mask identifies the type of the action and can be one of the following: Access/Modified/Metadata changed/Closed/Opened/Moved/Created/Deleted. |
| **Path** | Directory/file path the event was generated to. |
| **Hitcount** | Number of times this event was aggregated. |

## Statistics data (trigger-based collector)

The Statistics collector generates various statistics on the different micro agent collectors. These statistics provide information about the performance of the collectors in the previous collection cycle.
Examples of possible statistics include the number of events that were successfully sent, and the number of events that were dropped, along with the reasons for the failures.

Collected fields:

| Parameter | Description|
|--|--|
| **Timestamp** | The time the event occurred. |
| **Name** | Name of the collector. |
| **Events** | An array of pairs formatted as JSON with description and hit count. |
| **Description** | Whether the message was sent/dropped and the reason for dropping. |
| **Hitcount** | Number of respective messages. |

## Event aggregation for Process and Network collectors

How event aggregation works for the [Process events](#process-events-event-based-collector) and [Network Activity events](#network-activity-events-event-based-collector):

Defender for IoT agents aggregate events during the send interval defined in the message frequency configuration for each collector, such as [**Process_MessageFrequency**](concept-micro-agent-configuration.md#process-collector-specific-settings) or [**NetworkActivity_MessageFrequency**](concept-micro-agent-configuration.md#network-activity-collector-specific-settings). Once the send interval period has passed, the agent sends the aggregated events to the Azure cloud for further analysis. The aggregated events are stored in memory until being sent to the Azure cloud.

When the agent collects similar events to the ones that are already stored in memory, the agent will increase the hit count of this specific event to reduce the memory footprint of the agent. When the aggregation time window passes, the agent sends the hit count of each type of event that occurred. Event aggregation is the aggregation of the hit counts of similar events. For example, network activity with the same remote host and on the same port, is aggregated as one event, instead of as a separate event for each packet.

> [!NOTE]
> By default, the micro agent sends logs and telemetry to the cloud for troubleshooting and monitoring purposes. This behavior can be configured or turned off through the twin.

## Next steps

For more information, see:

- [Micro agent configurations](concept-micro-agent-configuration.md)
- Check your [Defender for IoT security alerts](concept-security-alerts.md).
