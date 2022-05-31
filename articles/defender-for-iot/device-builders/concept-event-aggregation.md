---
title: Micro agent event collection (Preview)
description: Defender for IoT security agents collects data and system events from your local device, and sends the data to the Azure cloud for processing, and analytics.
ms.date: 11/09/2021
ms.topic: conceptual
---

# Micro agent event collection (Preview)

Defender for IoT security agents collects data, and system events from your local device, and sends the data to the Azure cloud for processing, and analytics. The Defender for IoT micro agent collects many types of device events including new processes, and all new connection events. Both the new process, and new connection events may occur frequently on a device. This capability is important for comprehensive security, however, the number of messages the security agents send may quickly meet, or exceed your IoT Hub quota, and cost limits. These messages, and events contain highly valuable security information that is crucial to protecting your device.

To reduce the number of messages, and costs while maintaining your device's security, Defender for IoT agents aggregate the following types of events:

- ProcessCreate (Linux only)

- Network ConnectionCreate

Event-based collectors are collectors that are triggered based on corresponding activity from within the device. For example, ``a process was started in the device``.

Triggered based collectors are collectors that are triggered in a scheduled manner based on the customer's configurations.

## How does event aggregation work?

Defender for IoT agents aggregate events for the interval period, or time window. Once the interval period has passed, the agent sends the aggregated events to the Azure cloud for further analysis. The aggregated events are stored in memory until being sent to the Azure cloud.

The agent collects identical events to the ones that are already stored in memory. This collection causes the agent to increase the hit count of this specific event to reduce the memory footprint of the agent. When the aggregation time window passes, the agent sends the hit count of each type of event that occurred. Event aggregation is simply the aggregation of the hit counts of each collected type of event.

## Process events (event based)

Process events are supported on Linux operating systems.

Process events are considered identical when the *command line*, and *userid* are identical.

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

## Network Connection events (event-based collector)

Network Connection events are considered identical when the local port, remote port, transport protocol, local address, and remote address are identical.

The default buffer for a network connection event is 256. For situations where the cache is full:

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
| **DNS hit count** | Total hit count of DNS requests |


## Login collector (event-based collector)

The Login collector, collects user sign-ins, sign-outs, and failed sign-in attempts.

The Login collector supports the following types of collection methods:

- **Syslog**. If syslog is running on the device, the Login collector collects SSH sign-in events via the syslog file named **auth.log**.

- **Pluggable Authentication Modules (PAM)**. Collects SSH, telnet, and local sign-in events. For more information, see [Configure Pluggable Authentication Modules (PAM) to audit sign-in events](configure-pam-to-audit-sign-in-events.md).

The following data is collected:

| Parameter | Description|
|--|--|
| **operation** | One of the following: `Login`, `Logout`, `LoginFailed` |
| **process_id** | The Linux PID. |
| **user_name** | The Linux user. |
| **executable** | The terminal device. For example, `tty1..6` or `pts/n`. |
| **remote_address** | The source of connection, either a remote IP address in IPv6 or IPv4 format, or `127.0.0.1/0.0.0.0` to indicate local connection. |


## System information (trigger based collector))

The data collected for each event is:

| Parameter | Description|
|--|--|
| **hardware_vendor** | The name of the vendor of the device. |
| **hardware_model** | The model number of the device. |
| **os_dist** | The distribution of the operating system. For example, `Linux`. |
| **os_version** | The version of the operating system. For example, `Windows 10`, or `Ubuntu 20.04.1`. |
| **os_platform** | The OS of the device. |
| **os_arch** | The architecture of the OS. For example, `x86_64`. |
| **nics** | The network interface controller. The full list of properties are listed below. |

The **nics** properties are composed of the following;

| Parameter | Description|
|--|--|
|**type** | one of the following values: `UNKNOWN`, `ETH`, `WIFI`, `MOBILE`, or `SATELLITE`. |
| **vlans** | The virtual lan associated with the network interface. |
| **vendor** | The vendor of the network controller. |
| **info** | IPS, and MACs associated with the network controller. This Includes the following fields; <br> - **ipv4_address**: The IPv4 address. <br> - **ipv6_address**: The IPv6 address. <br> - **mac**: The MAC address.|

## Baseline (trigger based)

The baseline collector performs CIS checks periodically. Only the failed results are sent to the cloud. The cloud aggregates the results, and provides recommendations.

### Data collection

The data collected for each event is:

| Parameter | Description|
|--|--|
| **Check ID** | In CIS format. For example, `CIS-debian-9-Filesystem-1.1.2`. |
| **Check result** | Can be `Error`, or `Fail`. For example, `Error` in a situation where the check can’t run. |
| **Error** | The error's information, and description. |
| **Description** | The description of the check from CIS. |
| **Remediation** | The recommendation for remediation from CIS. |
| **Severity** | The severity level. |

## SBoM (trigger based)

The SBoM (Software Bill of Materials) collector collects the packages installed on the device periodically.

The data collected on each package includes:

|Parameter  |Description  |
|---------|---------|
|**Name**     |   The package name      |
|**Version**     |  The package version       |
|**Vendor**     |    The package's vendor, which is the **Maintainer** field in deb packages     |
|     |         |


## Next steps

Check your [Defender for IoT security alerts](concept-security-alerts.md).
