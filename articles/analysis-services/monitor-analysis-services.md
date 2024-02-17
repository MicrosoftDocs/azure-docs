---
title: Monitor Azure Analysis Services
description: Start here to learn how to monitor Azure Analysis Services.
ms.date: 02/16/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: kfollis
ms.author: kfollis
ms.service: analysis-services
---

<!-- 
IMPORTANT 
To make this template easier to use, first:
1. Search and replace Analysis Services with the official name of your service.
2. Search and replace analysis-services with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_07
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- Most services can use the following sections unchanged. The sections use #included text you don't have to maintain, which changes when Azure Monitor functionality changes. Add info into the designated service-specific places if necessary. Remove #includes or template content that aren't relevant to your service.
At a minimum your service should have the following two articles:
1. The primary monitoring article (based on this template)
   - Title: "Monitor Analysis Services"
   - TOC title: "Monitor"
   - Filename: "monitor-analysis-services.md"
2. A reference article that lists all the metrics and logs for your service (based on the template data-reference-template.md).
   - Title: "Analysis Services monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-analysis-services-reference.md".
-->

# Monitor Azure Analysis Services

<!-- Intro. Required. -->
[!INCLUDE [horz-monitor-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

Analysis Services also provides several non-Azure Monitor monitoring mechanisms:

- SQL Server Profiler, installed with SQL Server Management Studio (SSMS), captures data about engine process events such as the start of a batch or a transaction, enabling you to monitor server and database activity. For more information, see [Monitor Analysis Services with SQL Server Profiler](/analysis-services/instances/use-sql-server-profiler-to-monitor-analysis-services)
- Extended Events (xEvents) is a light-weight tracing and performance monitoring system that uses few system resources, making it an ideal tool for diagnosing problems on both production and test servers. For more information, see [Monitor Analysis Services with SQL Server Extended Events](/analysis-services/instances/monitor-analysis-services-with-sql-server-extended-events).
- Dynamic Management Views (DMVs) use SQL syntax to interface schema rowsets that return metadata and monitoring information about server instances. For more information, see [Use Dynamic Management Views (DMVs) to monitor Analysis Services](/analysis-services/instances/use-dynamic-management-views-dmvs-to-monitor-analysis-services).

<!-- ## Insights. Optional section. If your service has insights, add the following include and information. 
[!INCLUDE [horz-monitor-insights](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]
Insights service-specific information. Add brief information about what your Azure Monitor insights provide here. You can refer to another article that gives details or add a screenshot. -->

<!-- ## Resource types. Required section. -->
[!INCLUDE [horz-monitor-resource-types](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Analysis Services, see [Analysis Services monitoring data reference](monitor-analysis-services-reference.md).

<!-- ## Data storage. Required section. Optionally, add service-specific information about storing your monitoring data after the include. -->
[!INCLUDE [horz-monitor-data-storage](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]
<!-- Add service-specific information about storing monitoring data here, if applicable. For example, SQL Server stores other monitoring data in its own databases. -->

<!-- METRICS SECTION START ------------------------------------->

<a name="server-metrics"></a>
<!-- ## Platform metrics. Required section.
  - If your service doesn't collect platform metrics, use the following include: [!INCLUDE [horz-monitor-no-platform-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-platform-metrics.md)]
  - If your service collects platform metrics, add the following include, statement, and service-specific information as appropriate. -->
[!INCLUDE [horz-monitor-platform-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]
For a list of available metrics for Analysis Services, see [Analysis Services monitoring data reference](monitor-analysis-services-reference.md#metrics).
<!-- Platform metrics service-specific information. Add service-specific information about your platform metrics here.-->

<!-- ## Prometheus/container metrics. Optional. If your service uses containers/Prometheus metrics, add the following include and information. 
[!INCLUDE [horz-monitor-container-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-container-metrics.md)]
Add service-specific information about your container/Prometheus metrics here.-->

<!-- ## System metrics. Optional. If your service uses system-imported metrics, add the following include and information. 
[!INCLUDE [horz-monitor-system-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-system-metrics.md)]
Add service-specific information about your system-imported metrics here.-->

<!-- ## Custom metrics. Optional. If your service uses custom imported metrics, add the following include and information.
[!INCLUDE [horz-monitor-custom-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-custom-metrics.md)]
Custom imported service-specific information. Add service-specific information about your custom imported metrics here.-->

<!-- ## Non-Azure Monitor metrics. Optional. If your service uses any non-Azure Monitor based metrics, add the following include and information.
[!INCLUDE [horz-monitor-custom-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)]
Non-Monitor metrics service-specific information. Add service-specific information about your non-Azure Monitor metrics here.-->

<!-- METRICS SECTION END ------------------------------------->

<!-- LOGS SECTION START -------------------------------------->

<!-- ## Resource logs. Required section.
  - If your service doesn't collect resource logs, use the following include [!INCLUDE [horz-monitor-no-resource-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-resource-logs.md)]
  - If your service collects resource logs, add the following include, statement, and service-specific information as appropriate. -->
[!INCLUDE [horz-monitor-resource-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]
For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Analysis Services, see [Analysis Services monitoring data reference](monitor-analysis-services-reference.md#resource-logs).

<!-- Resource logs service-specific information. Add service-specific information about your resource logs here.
NOTE: Azure Monitor already has general information on how to configure and route resource logs. See https://learn.microsoft.com/azure/azure-monitor/platform/diagnostic-settings. Ideally, don't repeat that information here. You can provide a single screenshot of the diagnostic settings portal experience if you want. -->
For detailed instructions on how to set up logging for your Analysis Services server, see [Set up diagnostic logging for Azure Analysis Services](analysis-services-logging.md).

### Analysis Services resource log data

When you set up logging, you can select **Engine** or **Service** categories to log, or select **AllMetrics** to log metrics data.

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

#### Metrics

**AllMetrics** logs the [server metrics](monitor-analysis-services-reference.md#metrics) to the [AzureMetrics](/azure/azure-monitor/reference/tables/AzureMetrics) table. If you're using query [scale-out](analysis-services-scale-out.md) and need to separate metrics for each read replica, use the [AzureDiagnostics](/azure/azure-monitor/reference/tables/AzureDiagnostics) table instead, where **OperationName** is equal to **LogMetric**.

<!-- ## Activity log. Required section. Optionally, add service-specific information about your activity log after the include. -->
[!INCLUDE [horz-monitor-activity-log](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]
<!-- Activity log service-specific information. Add service-specific information about your activity log here. -->

<!-- ## Imported logs. Optional section. If your service uses imported logs, add the following include and information. 
[!INCLUDE [horz-monitor-imported-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-imported-logs.md)]
Add service-specific information about your imported logs here. -->

<!-- ## Other logs. Optional section.
If your service has other logs that aren't resource logs or in the activity log, add information that states what they are and what they cover here. You can describe how to route them in a later section. -->

<!-- LOGS SECTION END ------------------------------------->

<!-- ANALYSIS SECTION START -------------------------------------->

<!-- ## Analyze data. Required section. -->
[!INCLUDE [horz-monitor-analyze-data](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

<!-- ### External tools. Required section. -->
[!INCLUDE [horz-monitor-external-tools](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

### Analyze Analysis Services metrics

You can use Analysis Services metrics in Azure Monitor Metrics Explorer to help you monitor the performance and health of your servers. For example, you can monitor memory and CPU usage, number of client connections, and query resource consumption.

To determine if scale-out for your server is necessary, monitor your server **QPU** and **Query pool job queue length** metrics. A good metric to watch is average QPU by ServerResourceType, which compares average QPU for the primary server with the query pool. For detailed instructions on how to scale out your server based on metrics data, see [Azure Analysis Services scale-out](analysis-services-scale-out.md).

![Query scale out metrics](media/analysis-services-scale-out/aas-scale-out-monitor.png)

For a complete listing of metrics collected for Analysis Services, see [Analysis Services monitoring data reference](monitor-analysis-services-reference.md#metrics).

### Analyze logs in Log Analytics workspace

Metrics and server events are integrated with xEvents in your Log Analytics workspace resource for side-by-side analysis. Log Analytics workspace can also be configured to receive events from other Azure services, providing a holistic view of diagnostic logging data across your architecture.

To view your diagnostic data, in Log Analytics workspace, open **Logs**  from the left menu.

![Screenshot showing log Search options in the Azure portal.](./media/analysis-services-logging/aas-logging-open-log-search.png)

In the query builder, expand **LogManagement** > **AzureDiagnostics**. AzureDiagnostics includes **Engine** and **Service** events. Notice a query is created on the fly. The **EventClass\_s** field contains xEvent names, which might look familiar if you use xEvents for on-premises logging. Select **EventClass\_s** or one of the event names, and Log Analytics workspace continues constructing a query. Be sure to save your queries to reuse later.

<!-- ### Sample Kusto queries. Required section. If you have sample Kusto queries for your service, add them after the include. -->
[!INCLUDE [horz-monitor-kusto-queries](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]
<!-- Add sample Kusto queries for your service here. -->

<a name="example-queries"></a>
#### Example 1

The following query returns durations for each query end/refresh end event for a model database and server. If scaled out, the results are broken out by replica because the replica number is included in ServerName_s. Grouping by RootActivityId_g reduces the row count retrieved from the Azure Diagnostics REST API and helps stay within the limits as described in Log Analytics Rate limits.

```Kusto
let window = AzureDiagnostics
   | where ResourceProvider == "MICROSOFT.ANALYSISSERVICES" and Resource =~ "MyServerName" and DatabaseName_s =~ "MyDatabaseName" ;
window
| where OperationName has "QueryEnd" or (OperationName has "CommandEnd" and EventSubclass_s == 38)
| where extract(@"([^,]*)", 1,Duration_s, typeof(long)) > 0
| extend DurationMs=extract(@"([^,]*)", 1,Duration_s, typeof(long))
| project  StartTime_t,EndTime_t,ServerName_s,OperationName,RootActivityId_g,TextData_s,DatabaseName_s,ApplicationName_s,Duration_s,EffectiveUsername_s,User_s,EventSubclass_s,DurationMs
| order by StartTime_t asc
```

#### Example 2

The following query returns memory and QPU consumption for a server. If scaled out, the results are broken out by replica because the replica number is included in ServerName_s.

```Kusto
let window = AzureDiagnostics
   | where ResourceProvider == "MICROSOFT.ANALYSISSERVICES" and Resource =~ "MyServerName";
window
| where OperationName == "LogMetric" 
| where name_s == "memory_metric" or name_s == "qpu_metric"
| project ServerName_s, TimeGenerated, name_s, value_s
| summarize avg(todecimal(value_s)) by ServerName_s, name_s, bin(TimeGenerated, 1m)
| order by TimeGenerated asc 
```

#### Example 3

The following query returns the Rows read/sec Analysis Services engine performance counters for a server.

```Kusto
let window =  AzureDiagnostics
   | where ResourceProvider == "MICROSOFT.ANALYSISSERVICES" and Resource =~ "MyServerName";
window
| where OperationName == "LogMetric" 
| where parse_json(tostring(parse_json(perfobject_s).counters))[0].name == "Rows read/sec" 
| extend Value = tostring(parse_json(tostring(parse_json(perfobject_s).counters))[0].value) 
| project ServerName_s, TimeGenerated, Value
| summarize avg(todecimal(Value)) by ServerName_s, bin(TimeGenerated, 1m)
| order by TimeGenerated asc 
```

<!-- ANALYSIS SECTION END ------------------------------------->

<!-- ALERTS SECTION START -------------------------------------->

<!-- ## Alerts. Required section. -->
[!INCLUDE [horz-monitor-alerts](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

<!-- ONLY if your service (Azure VMs, AKS, or Log Analytics workspaces) offer out-of-the-box recommended alerts, add the following include. 
[!INCLUDE [horz-monitor-insights-alerts](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-recommended-alert-rules.md)]
<!-- ONLY if applications run on your service that work with Application Insights, add the following include. 
[!INCLUDE [horz-monitor-insights-alerts](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]
<!-- ### Analysis Services alert rules. Required section.
**MUST HAVE** service-specific alert rules. Include useful alerts on metrics, logs, log conditions, or activity log.
Fill in the following table with metric and log alerts that would be valuable for your service. Change the format as necessary for readability. You can instead link to an article that discusses your common alerts in detail.
Ask your PMs if you don't know. This information is the BIGGEST request we get in Azure Monitor, so don't avoid it long term. People don't know what to monitor for best results. Be prescriptive. -->

### Analysis Services alert rules
The following table lists some common and popular alert rules for Analysis Services.

| Alert type | Condition | Description  |
|:---|:---|:---|
|Metric | Whenever the average QPU is greater or less than dynamic threshold. | If your QPU regularly maxes out, it means the number of queries against your models is exceeding the QPU limit for your plan.|
|Metric | The Query pool job queue length is greater than a threshold length. | The number of queries in the query thread pool queue exceeds available QPU.|
|Metric | Whenever the average Memory: Memory Usage is greater than a threshold number of bytes. | |

<!-- ### Advisor recommendations. Required section. -->
[!INCLUDE [horz-monitor-advisor-recommendations](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]
<!-- Add any service-specific advisor recommendations or screenshots here. -->

<!-- ALERTS SECTION END -------------------------------------->

## Related content
<!-- You can change the wording and add more links if useful. -->

- See [Analysis Services monitoring data reference](monitor-analysis-services-reference.md) for a reference of the metrics, logs, and other important values created for Analysis Services.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
