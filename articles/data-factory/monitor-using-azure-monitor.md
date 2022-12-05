---
title: Monitor data factories using Azure Monitor 
description: Learn how to use Azure Monitor to monitor Azure Data Factory pipelines by enabling diagnostic logs with information from Data Factory.
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.custom: contperf-fy22q1
ms.service: data-factory
ms.subservice: monitoring
ms.topic: conceptual
ms.date: 10/22/2022
---

# Monitor and Alert Data Factory by using Azure Monitor

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

Cloud applications are complex and have many moving parts. Monitors provide data to help ensure that your applications stay up and running in a healthy state. Monitors also help you avoid potential problems and troubleshoot past ones. You can use monitoring data to gain deep insights about your applications. This knowledge helps you improve application performance and maintainability. It also helps you automate actions that otherwise require manual intervention.
Azure Monitor provides base-level infrastructure metrics and logs for most Azure services. Azure diagnostic logs are emitted by a resource and provide rich, frequent data about the operation of that resource. Azure Data Factory (ADF) can write diagnostic logs in Azure Monitor. 
For more information, see [Azure Monitor overview](../azure-monitor/overview.md).

## Keeping Azure Data Factory metrics and pipeline-run data

Data Factory stores pipeline-run data for only 45 days. Use Azure Monitor if you want to keep that data for a longer time. With Monitor, you can route diagnostic logs for analysis to multiple different targets.

* **Storage Account**: Save your diagnostic logs to a storage account for auditing or manual inspection. You can use the diagnostic settings to specify the retention time in days.
* **Event Hub**: Stream the logs to Azure Event Hubs. The logs become input to a partner service/custom analytics solution like Power BI.
* **Log Analytics**: Analyze the logs with Log Analytics. The Data Factory integration with Azure Monitor is useful in the following scenarios:
  * You want to write complex queries on a rich set of metrics that are published by Data Factory to Monitor. You can create custom alerts on these queries via Monitor.
  - You want to monitor across data factories. You can route data from multiple data factories to a single Monitor workspace.
* **Partner Solution:** Diagnostic logs could be sent to Partner solutions through integration. For potential partner integrations, [click to learn more about partner integration.](../partner-solutions/overview.md)
   You can also use a storage account or event-hub namespace that isn't in the subscription of the resource that emits logs. The user who configures the setting must have appropriate Azure role-based access control (Azure RBAC) access to both subscriptions.
## Next steps

- [Azure Data Factory metrics and alerts](monitor-metrics-alerts.md)
- [Monitor and manage pipelines programmatically](monitor-programmatically.md)