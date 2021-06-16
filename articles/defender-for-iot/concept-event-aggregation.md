---
title: Event aggregation (Preview)
description: Defender for IoT security agents collects data and system events from your local device, and sends the data to the Azure cloud for processing, and analytics.
ms.date: 06/16/2021
ms.topic: conceptual
---

# Event aggregation (Preview)

Defender for IoT security agents collects data and system events from your local device, and sends the data to the Azure cloud for processing, and analytics. The Defender for IoT micro agent collects many types of device events including new processes, and all new connection events. Both the new process, and new connection events may occur frequently on a device within a second. This ability is important for comprehensive security, however, the number of messages the security agents send may quickly meet, or exceed your IoT Hub quota, and cost limits. In any case, these events contain highly valuable security information that is crucial to protecting your device. 

To reduce the extra quota, and costs while keeping your devices protected, Defender for IoT agents aggregates these types of events: 

- ProcessCreate (Linux only) 

- Network ConnectionCreate

- System information

## How does event aggregation work? 

Defender for IoT agents aggregate events for the interval period, or time window. Once the interval period has passed, the agent sends the aggregated events to the Azure cloud for further analysis. The aggregated events are stored in memory until being sent to the Azure cloud. 

The agent can collect identical events to ones that are already stored in memory. This collection causes the agent to increases the hit count of this specific event to reduce the memory footprint of the agent. When the aggregation time window passes, the agent sends the hit count of each type of event that occurred. Event aggregation is simply the aggregation of the hit counts of each collected type of event. 

## Process events (event based)

Process events are supported on Linux operating systems. 

Process events are considered identical when the *command line*, and *userid* are identical. 

The default buffer for process events is 256 processes. When this limit is hit, the buffer will cycle, and the oldest event is discarded in order to make room for the newest processed event. A warning to increase the cache size will be logged.

### Data collection

The data collected for each event:

- **Timestamp** - the first time the process was observed.

- **Process_id** - The Linux PID.

- **Parent_process_id** - Linux parent PID, if it exists.

- **Commandline** - The command line. 

- **Type** - Can be either `fork`, or `exec`.

- **hit_count** - The aggregate count. The number of executions of the same process, during the same time frame, until the events are sent to the cloud. 

## Network Connection events (event based)

Network Connection events are considered identical when the local port, remote port, transport protocol, local address, and remote address are identical.

The default buffer for network connection events is 256. In situations where the cache is full: 

- **Azure RTOS devices**: No new network events will be cached until the next collection cycle.  

- **Linux devices**: The oldest event will be replaced by every new event. A warning to increase the cache size will be logged. 

### Data collection

The data collected for each event:

- **Local address** – The source address of the connection.

- **Remote address** – The destination address of the connection.

- **Local port** - The source port of the connection.

- **Remote port** - The destination port of the connection.

- **Bytes_in** – The total aggregated RX bytes of the connection.

- **Bytes_out** – The total aggregated TX bytes of the connection.

- **Transport_protocol** – Can be TCP, UDP, or ICMP.

- **Application protocol** – The domain name server (DNS).

- **Extra details** – The extension for more details of the connection. For example, `host name`. 

## Baseline (trigger based) 

The baseline collector performs CIS checks periodically. Only the failed results are sent to the cloud. The cloud aggregates the results, and provides recommendations. 

### Data collection

The data collected for each event:

- **Check ID** – In CIS format, CIS-debian-9-Filesystem-1.1.2.

- **Check result** - Can be `Error`, or `Fail`. For example, `Error` in a situation where the check can’t run.

- **Error** - The error's information, and description.

- **Description** – The description of the check from CIS.

- **Remediation** – The recommendation for remediation from CIS.

- **Severity** - The severity check.

## Configurations 

After a change is made to the configurations, the collector immediately sends the current data. After the data is sent, the changes are applied. 

### Event-based collectors configurations 

Event-based collector configurations include Process, and Network collectors:

- ***Priority*** - Can be ``high``, ``medium``, or ``low``. The default frequency in which this information is sent is ``medium``.

- **Aggregation mode** - Can be ``true``, or ``false``. Indicate whether to enable event aggregation for identical events. The default is ``true``.

- **Cache size** - The number of events collected in-between being sent. For example, First In First Out (cycle FIFO). The default is ``256``. 

- **Collector** - ``Enable``, or ``Disable`` the collector.

### Trigger based collectors configurations 

Trigger based collectors configurations include System information, and Baseline collectors 

- **Interval** – Can be ``high``, ``medium``, or ``low``. The default frequency in which this information is sent is ``low``.

- **Collector** - ``Enable``, or ``Disable`` the collector.

### Baseline collector specific configurations  

The baseline collector specific configurations include:

- **Group** - ``Enable``, or ``Disable`` the group.

- **Check** - ``Enable``, or ``Disable`` the per check.

## Next steps

Check your [Defender for IoT security alerts](concept-security-alerts.md).
