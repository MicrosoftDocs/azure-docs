---
title: Sources of data in Azure Monitor | Microsoft Docs
description: Describes the data available to monitor the health and performance of your Azure resources and the applications running on them.
ms.service:  azure-monitor
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/28/2019

---

# Sources of monitoring data for Azure Monitor
Data collected by Azure Monitor is stored as either [Logs](data-platform-logs.md) or [Metrics](data-platform-metrics.md). This article provides a reference of the different sources of data for Azure Monitor. Use this article to determine how your particular application or service is monitored.


## Collection patterns
All data collected by Azure Monitor will fit into one of the patterns described in the following table. Different applications and services will support different patterns. 

| Pattern | Description |
|:---|:---|
| Platform metrics | Platform metrics are automatically collected for Azure services that support them. |
| Diagnostic settings | Diagnostic settings collect platform logs and metrics to Azure Monitor Logs and to send to destinations outside of Azure Monitor. |
| Insights | Insights provide a customized monitoring experience for particular applications and services. They collect and analyze both logs and metrics. |
| Solutions | Solutions are based on log queries and views customized for a particular application or service. They collect and analyze logs only and are being deprecated over time in favor of insights. |
| Agents | Compute resources such as virtual machines require an agent to collect logs and metrics from their guest operating system. |
| API | Separate APIs are available to write data to Azure Monitor Logs and Metrics from any REST API client. |

## Azure services
The following table lists Azure services and the monitoring patterns they support.

| Service | Platform<br>Metrics | Diagnostic<br>Settings | Insight | Solution | Notes |
|:---|:---|:---|:---|:---|:---|
| Cosmos DB | Yes | Yes | Yes | No | |
| Storage | Yes | No | Yes | No |


## Compute resources


## Other solutions



## Solutions

[Activity log analytics](activity-log-collect.md)
[Agent health](../insights/solution-agenthealth.md)
[Alert management](alert-management-solution.md)
[Application Gateway Analytics](../insights/azure-networking-analytics.md)
[Network Security Group analytics](../insights/azure-networking-analytics.md)
[Change Tracking](../../automation/change-tracking.md)
[Containers](../insights/containers.md)
[SCOM Asessment](../insights/scom-assessment.md)
[Office 365](../insights/solution-office-365.md)
[Surface Hub](../insights/surface-hubs.md)
[Update Management](../../automation/automation-update-management.md)
[Upgrade readiness](https://docs.microsoft.com/windows/deployment/upgrade/upgrade-readiness-get-started)
[Wire Data](../insights/wire-data.md)
[Network performance monitor](../insights/azure-networking-analytics.md)







## Next steps

- Learn more about the [types of monitoring data collected by Azure Monitor](data-platform.md) and how to view and analyze this data.
- List the [different locations where Azure resources store data](data-locations.md) and how you can access it. 
