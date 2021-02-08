---
title: Event aggregation (Preview)
titleSuffix: Azure Defender for IoT
description: Defender for IoT security agents collects data and system events from your local device, and sends the data to the Azure cloud for processing, and analytics.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 1/20/2021
ms.topic: conceptual
ms.service: azure
---

# Event aggregation (Preview)

Defender for IoT security agents collects data and system events from your local device, and sends the data to the Azure cloud for processing, and analytics. The Defender for IoT micro agent collects many types of device events including new processes, and all new connection events. Both the new process, and new connection events may occur frequently on a device within a second. This ability is important for comprehensive security, however, the number of messages security agents send may quickly meet, or exceed your IoT Hub quota and cost limits. Nevertheless, these events contain highly valuable security information that is crucial to protecting your device. 

To reduce the extra quota, and costs while keeping your devices protected, Defender for IoT agents aggregates these types of events: 

- ProcessCreate (Linux only) 

- ConnectionCreate (Azure RTOS only) 

## How does event aggregation work? 

Defender for IoT agents aggregate events for the interval period, or time window. Once the interval period has passed, the agent sends the aggregated events to the Azure cloud for further analysis. The aggregated events are stored in memory until being sent to the Azure cloud. 

When the agent collects an identical event to one that is already kept in memory, the agent increases the hit count of this specific event, in order to reduce the memory footprint of the agent. When the aggregation time window passes, the agent sends the hit count of each type of event that occurred. Event aggregation is simply the aggregation of the hit counts of each collected type of event. 

## Process events 

Process events are currently only supported on Linux operating systems. 

Process events are considered identical when the *command line*, and *userid* are identical. 

The default buffer for process events is 32 processes, after which the buffer will cycle, and the oldest process events are discarded in order to make room for new process events.  

## Network Connection events 

Network Connection events are currently only supported on Azure RTOS. 

Network Connection events are considered identical when the *local port*, *remote port*, *transport protocol*, *local address*, and *remote address* are identical. 

The default buffer for network connection events is 64. No new network events will be cached until the next collection cycle. A warning to increase the cache size will be logged.

## Next steps

Check your [Defender for IoT security alerts](concept-security-alerts.md).
