---
title: Micro agent event collection (Preview)
description: Defender for IoT security agents collects data and system events from your local device, and sends the data to the Azure cloud for processing, and analytics.
ms.date: 08/22/2021
ms.topic: conceptual
---

# Micro agent event collection (Preview)

Defender for IoT security agents collects data, and system events from your local device, and sends the data to the Azure cloud for processing, and analytics. The Defender for IoT micro agent collects many types of device events including new processes, and all new connection events. Both the new process, and new connection events may occur frequently on a device. This capability is important for comprehensive security, however, the number of messages the security agents send may quickly meet, or exceed your IoT Hub quota, and cost limits. These messages, and events contain highly valuable security information that is crucial to protecting your device.

To reduce the amount of messages, and costs while maintaining your device's security, Defender for IoT agents aggregates the following types of events:

- ProcessCreate (Linux only)

- Network ConnectionCreate

- System information

- Baseline

Event based collectors are collectors that are triggered based on corresponding activity from within the device. For example, ``a process was started in the device``.  

Triggered based collectors are collectors that are triggered in a scheduled manner based on the customer's configurations.

## How does event aggregation work?

Defender for IoT agents aggregate events for the interval period, or time window. Once the interval period has passed, the agent sends the aggregated events to the Azure cloud for further analysis. The aggregated events are stored in memory until being sent to the Azure cloud.

The agent collects identical events to the ones that are already stored in memory. This collection causes the agent to increases the hit count of this specific event to reduce the memory footprint of the agent. When the aggregation time window passes, the agent sends the hit count of each type of event that occurred. Event aggregation is simply the aggregation of the hit counts of each collected type of event.

## Process events (event based)

Process events are supported on Linux operating systems.

Process events are considered identical when the *command line*, and *userid* are identical.

The default buffer for process events is 256 processes. When this limit is met, the buffer will cycle, and the oldest process event is discarded in order to make room for the newest processed event. A warning to increase the cache size will be logged.

The data collected for each event is:

- **Timestamp** - The first time the process was observed.

- **process_id** - The Linux PID.

- **parent_process_id** - The Linux parent PID, if it exists.

- **Commandline** - The command line.

- **Type** - Can be either `fork`, or `exec`.

- **hit_count** - The aggregate count. The number of executions of the same process, during the same time frame, until the events are sent to the cloud.

## Network Connection events (event based collector)

Network Connection events are considered identical when the local port, remote port, transport protocol, local address, and remote address are identical.

The default buffer for a network connection events is 256. For situations where the cache is full:

- **Azure RTOS devices**: No new network events will be cached until the next collection cycle starts.  

- **Linux devices**: The oldest event will be replaced by every new event. A warning to increase the cache size will be logged.

For Linux devices, only IPv4 is supported.

The data collected for each event is:

- **Local address** – The source address of the connection.

- **Remote address** – The destination address of the connection.

- **Local port** - The source port of the connection.

- **Remote port** - The destination port of the connection.

- **Bytes_in** – The total aggregated RX bytes of the connection.

- **Bytes_out** – The total aggregated TX bytes of the connection.

- **Transport_protocol** – Can be TCP, UDP, or ICMP.

- **Application protocol** – The application protocol associated with the connection.

- **Extended properties** – The Additional details of the connection. For example, `host name`.

## Login collector (event based collector)

The Login collector, collects user logins, logouts, and failed login attempts.

Currently SSH, and Telnet are fully supported.  

The following data is collected:

- operation -  Login, Logout, or LoginFailed.

- process_id

- user_name

- executable

- remote_address

## System information (trigger based collector))

The data collected for each event is:

- Device Vendor

- Device Model

- Serial Number

- OS Build

- OS distribution

- OS version

- OS platform

- OS architecture

- IP address

- MAC address

- First seen  

- Last seen

## Baseline (trigger based)

The baseline collector performs CIS checks periodically. Only the failed results are sent to the cloud. The cloud aggregates the results, and provides recommendations.

### Data collection

The data collected for each event is:

- **Check ID** – In CIS format, CIS-debian-9-Filesystem-1.1.2.

- **Check result** - Can be `Error`, or `Fail`. For example, `Error` in a situation where the check can’t run.

- **Error** - The error's information, and description.

- **Description** – The description of the check from CIS.

- **Remediation** – The recommendation for remediation from CIS.

- **Severity** - the severity level.

## Next steps

Check your [Defender for IoT security alerts](concept-security-alerts.md).
