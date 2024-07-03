---
title: Monitoring data reference for Azure Analysis Services
description: This article contains important reference material you need when you monitor Azure Analysis Services.
ms.date: 02/28/2024
ms.custom: horz-monitor
ms.topic: reference
author: kfollis
ms.author: kfollis
ms.service: analysis-services
---

# Azure Analysis Services monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Analysis Services](monitor-analysis-services.md) for details on the data you can collect for Azure Analysis Services and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.AnalysisServices/servers
The following table lists the metrics available for the Microsoft.AnalysisServices/servers resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.AnalysisServices/servers](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-analysisservices-servers-metrics-include.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]
[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]
Analysis Services metrics have the dimension `ServerResourceType`.

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.AnalysisServices/servers
[!INCLUDE [Microsoft.AnalysisServices/servers](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-analysisservices-servers-logs-include.md)]

When you set up logging for Analysis Services, you can select **Engine** or **Service** events to log.

#### Engine

The **Engine** category logs all [xEvents](/analysis-services/instances/monitor-analysis-services-with-sql-server-extended-events). You can't select individual events.

|XEvent categories |Event name  |
|---------|---------|
|Security Audit    |   Audit Login      |
|Security Audit    |   Audit Logout      |
|Security Audit    |   Audit Server Starts And Stops      |
|Progress Reports     |   Progress Report Begin      |
|Progress Reports     |   Progress Report End      |
|Progress Reports     |   Progress Report Current      |
|Queries     |  Query Begin       |
|Queries     |   Query End      |
|Commands     |  Command Begin       |
|Commands     |  Command End       |
|Errors & Warnings     |   Error      |
|Discover     |   Discover End      |
|Notification     |    Notification     |
|Session     |  Session Initialize       |
|Locks    |  Deadlock       |
|Query Processing     |   VertiPaq SE Query Begin      |
|Query Processing     |   VertiPaq SE Query End      |
|Query Processing     |   VertiPaq SE Query Cache Match      |
|Query Processing     |   Direct Query Begin      |
|Query Processing     |  Direct Query End       |

#### Service

The **Service** category logs the following events:

|Operation name  |Occurs when  |
|---------|---------|
|ResumeServer     |    Resume a server     |
|SuspendServer    |   Pause a server      |
|DeleteServer     |    Delete a server     |
|RestartServer    |     User restarts a server through SSMS or PowerShell    |
|GetServerLogFiles    |    User exports server log through PowerShell     |
|ExportModel     |   User exports a model in the portal by using Open in Visual Studio     |

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]
### Analysis Services
microsoft.analysisservices/servers

- [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/AzureMetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/AzureDiagnostics#columns)

When you set up logging, selecting **AllMetrics** logs the [server metrics](#metrics) to the [AzureMetrics](/azure/azure-monitor/reference/tables/AzureMetrics) table. If you're using query [scale-out](analysis-services-scale-out.md) and need to separate metrics for each read replica, use the [AzureDiagnostics](/azure/azure-monitor/reference/tables/AzureDiagnostics) table instead, where **OperationName** is equal to **LogMetric**.

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.AnalysisServices resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftanalysisservices)

## Related content

- See [Monitor Analysis Services](monitor-analysis-services.md) for a description of monitoring Analysis Services.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.

