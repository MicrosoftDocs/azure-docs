---
title: Azure Load Balancer health event logs
titleSuffix: Azure Load Balancer
description: Learn what health event logs are available for Azure Load Balancer including severity definitions, health event types, and publishing frequency.
author: mbender-ms
ms.service: load-balancer
ms.topic: concept-article
ms.date: 05/21/2024
ms.author: mbender
ms.custom: references_regions
# customer intent: As a network admin, I want to use LoadBalancerHealthEvent logs for Azure Load Balancer for monitoring and alerting so that I can identify and troubleshoot ongoing issues affecting my load balancer resource’s health.
---

# Azure Load Balancer health event logs

Azure Load Balancer supports health event logs to help you identify and troubleshoot ongoing issues affecting your load balancer resource’s health. These events are provided through the Azure Monitor resource log category LoadBalancerHealthEvent.

These logs are supported for Standard (regional and global tier) and Gateway Load Balancers.

[!INCLUDE [load-balancer-health-event-logs-preview](../../includes/load-balancer-health-event-logs-preview.md)]


## Severity definitions 

Each health event type has an associated severity to indicate the level of expected impact. This property can help with filtering logs and creating more individualized alerts based on the urgency of the issue.  

| **Severity** | **Description** |
| --- | --- |
| **Critical** | The load balancer resource needs immediate attention. The functionality of the load balancer is affected. This impact can cause issues such as failed connections, unsuccessful CRUD (create, read, update, delete) operations, or misconfigured load balancer components. |
| **Warning** | The load balancer resource needs to be monitored or reviewed. The functionality of the load balancer can be affected in certain scenarios or is operating in a partially degraded state. |
 

## Health event types and publishing frequency 

Health events can be detected in various ways – some events are generated through actively checking the state of the load balancer, while others can be generated when an explicit condition being met. Each event has the possibility of being published every minute, if the event occurred during the detection window. 

Once a health event is published, there's an extended window of time when the event isn't republished. This window of time prevents publication of excessive logs when there's a persistent issue. Following this redetection interval, the health event is republished if the issue still persists.

Each event log is published with a timestamp that indicates the time that Azure Load Balancer detects the event at the platform level. There can be a delay between the detection and the event publishing by Azure Monitor.

| **Status** | **LoadBalancerHealthEventType** | **Severity** | **Description** | **Detection window** | **Re-detection interval** | **Supported properties** |
| --- | --- | --- | --- | --- | --- | --- |
| **Preview** | *DataPathAvailabilityWarning* | Warning | This event is published per affected Load Balancer frontend IP, when the Data Path Availability metric of the frontend IP is less than 90% due to platform issues | 1 minute | 5 minutes | Frontend IP address, List of frontend ports associated with affected load balancing rules |
| **Preview** | *DataPathAvailabilityCritical* | Critical | This event is published per affected Load Balancer frontend IP, when the Data Path Availability metric of the frontend IP is less than 25% due to platform issues | 1 minute | 5 minutes | Frontend IP address, List of frontend ports associated with affected load balancing rules |
| **Preview** | *NoHealthyBackends* | Critical | This event is published per Load Balancer frontend IP, when an associated backend pool has no backend instances responding to the configured health probes. As a result, the load balancer has no healthy backends to distribute traffic to. | On-demand | 60 minutes | Frontend IP address, Pairwise list of protocol and frontend ports associated with affected load balancing rules |
| **Preview** | *HighSnatPortUsage* | Warning | This event is published on a per backend instance-level, when a backend instance utilizes more than 75% of its allocated ports from a single frontend IP. | On-demand | 5 minutes | Backend IP address, Frontend IP address |
| **Preview** | *SnatPortExhaustion* | Critical | This event is published on a per backend instance-level. Publication occurs when a backend instance exhausts all allocated ports and fails any further outbound connections. This event continues until ports are released or more ports are allocated. | On-demand | 5 minutes | Backend IP address, Frontend IP address |

For more information on the properties published with each health event log, refer to the Azure Log Analytics reference documentation for the log table [*ALBHealthEvent*](/azure/azure-monitor/reference/tables/albhealthevent).

## Next steps
In this article, you learned about Azure Load Balancer health event logs and health event types.

For more information about how to collect, analyze, and create alerts using these logs, along with troubleshooting each health event type, see:

- [Learn to monitor and alert with Azure Load Balancer health event logs](load-balancer-monitor-alert-health-event-logs.md).
- [Troubleshoot Azure Load Balancer health event logs](load-balancer-troubleshoot-health-event-logs.md)
