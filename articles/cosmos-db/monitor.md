---
title: Monitor Azure Cosmos DB
description: Start here to learn how to monitor Azure Cosmos DB.
ms.date: 02/24/2024
ms.custom: horz-monitor
ms.topic: conceptual
ms.author: esarroyo
author: StefArroyo
ms.service: cosmos-db
---

<!-- 
IMPORTANT 
To make this template easier to use, first:
1. Search and replace Azure Cosmos DB with the official name of your service.
2. Search and replace [TODO-replace-with-service-filename] with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_07
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- Most services can use the following sections unchanged. The sections use #included text you don't have to maintain, which changes when Azure Monitor functionality changes. Add info into the designated service-specific places if necessary. Remove #includes or template content that aren't relevant to your service.
At a minimum your service should have the following two articles:
1. The primary monitoring article (based on this template)
   - Title: "Monitor Azure Cosmos DB"
   - TOC title: "Monitor"
   - Filename: "monitor.md"
2. A reference article that lists all the metrics and logs for your service (based on the template data-reference-template.md).
   - Title: "Azure Cosmos DB monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-reference.md".
-->

# Monitor Azure Cosmos DB

<!-- Intro. Required. -->
[!INCLUDE [horz-monitor-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

In the Azure portal, you can monitor Azure Cosmos DB from your Azure Cosmos DB account page or the Azure Monitor page.

- **Azure Cosmos DB account page:** The **Overview** page for your Azure Cosmos DB account shows a brief view of the resource usage, such as total requests, requests that resulted in a specific HTTP status code, and hourly billing. Use the **Monitoring** section in the left menu of the page to access detailed **Insights**, **Alerts**, **Metrics**, **Logs**, and **Workbooks** for your account.

- **Azure Monitor:** You can also monitor metrics and logs and create dashboards for your Azure Cosmos DB account by using Azure Monitor in the Azure portal. Monitor collects most Azure Cosmos DB metrics by default. You can use Monitor to collect diagnostic logs and activity logs, capture event and trace data as logs, and analyze these logs by running queries on the gathered data.

Azure Cosmos DB monitoring includes server-side and client-side data. Server-side metrics include throughput, storage, availability, latency, consistency, and system level metrics. Client-side metrics include request charge, activity ID, exception and stack trace information, HTTP status and substatus code, and diagnostic string.

The following image shows available options to monitor your Azure Cosmos DB server-side metrics, client-side metrics, and logs through the Azure portal. You can also monitor Azure Cosmos DB programmatically by using the .NET, Java, Python, or Node.js SDKs, and the headers in REST API.

:::image type="content" source="media/monitor/monitoring-options-portal.png" alt-text="Diagram shows monitoring options available in Azure portal." border="false":::

<!-- ## Insights. Optional section. If your service has insights, add the following include and information. -->
[!INCLUDE [horz-monitor-insights](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

Azure Cosmos DB insights is a feature based on the [workbooks feature of Azure Monitor](/azure/azure-monitor/visualize/workbooks-overview). Use Azure Cosmos DB insights for a view of the overall performance, failures, capacity, and operational health of all your Azure Cosmos DB resources in a unified interactive experience.

For more information about Azure Cosmos DB insights, see the following articles:

- [Explore Azure Cosmos DB insights](insights-overview.md)
- [Monitor and debug with insights in Azure Cosmos DB](use-metrics.md).

<!-- ## Resource types. Required section. -->
[!INCLUDE [horz-monitor-resource-types](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure Cosmos DB, see [Azure Cosmos DB monitoring data reference](monitor-reference.md).

<!-- ## Data storage. Required section. Optionally, add service-specific information about storing your monitoring data after the include. -->
[!INCLUDE [horz-monitor-data-storage](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]
<!-- Add service-specific information about storing monitoring data here, if applicable. For example, SQL Server stores other monitoring data in its own databases. -->

<!-- METRICS SECTION START ------------------------------------->

<!-- ## Platform metrics. Required section.
  - If your service doesn't collect platform metrics, use the following include: [!INCLUDE [horz-monitor-no-platform-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-platform-metrics.md)]
  - If your service collects platform metrics, add the following include, statement, and service-specific information as appropriate. -->
[!INCLUDE [horz-monitor-platform-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]
For a list of available metrics for Azure Cosmos DB, see [Azure Cosmos DB monitoring data reference](monitor-reference.md#metrics).

### Azure Cosmos DB metrics

In Azure Cosmos DB, you can monitor your client-side and server-side metrics data by selecting **Metrics** on your Azure Cosmos DB portal page navigation. Server-side metrics include throughput, storage, availability, latency, consistency, and system level metrics. By default, these metrics have a retention period of seven days.

Azure Monitor also collects the Azure Cosmos DB metrics by default. Most of the metrics that are available from the Azure Cosmos DB portal page are also available in these metrics. You don't need to explicitly configure anything. The metrics are collected with one-minute granularity. The granularity might vary based on the metric you choose. By default, these metrics have a retention period of 30 days.

The dimension values for the metrics, such as container name, are case insensitive. Use case insensitive comparison when doing string comparisons on these dimension values.

> [!NOTE]
> Some parts of the Azure platform aren't case sensitive. This situation can result in confusion or collision of telemetry and actions on containers with such names.

On the client side, you can collect the details for request charge, activity ID, exception and stack trace information, HTTP status and substatus code, and diagnostic string. You can use this data to debug issues or if you need to contact the Azure Cosmos DB support team.

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

<!-- ## Non-Azure Monitor metrics. Optional. If your service uses any non-Azure Monitor based metrics, add the following include and information.-->
[!INCLUDE [horz-monitor-custom-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)]
- For information about partner solutions and tools that can help monitor Azure Cosmos DB, see [Monitor Azure Cosmos DB using third-party solutions](monitoring-solutions.md).
- To implement Micrometer metrics in the Java SDK for Azure Cosmos DB by consuming Prometheus metrics, see [Use Micrometer client metrics for Java](nosql/client-metrics-java.md).

<!-- METRICS SECTION END ------------------------------------->

<!-- LOGS SECTION START -------------------------------------->

<!-- ## Resource logs. Required section.
  - If your service doesn't collect resource logs, use the following include [!INCLUDE [horz-monitor-no-resource-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-resource-logs.md)]
  - If your service collects resource logs, add the following include, statement, and service-specific information as appropriate. -->
[!INCLUDE [horz-monitor-resource-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]
For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Azure Cosmos DB, see [Azure Cosmos DB monitoring data reference](monitor-reference.md#resource-logs).

### Azure Cosmos DB logs

You can monitor diagnostic logs from your Azure Cosmos DB account and create dashboards from Azure Monitor. Data such as events and traces that occur at a second granularity are stored as logs. For example, if the throughput of a container changes, the properties of an Azure Cosmos DB account change. The logs capture these events. You can analyze these logs by running queries on the gathered data.
<!-- Resource logs service-specific information. Add service-specific information about your resource logs here.
NOTE: Azure Monitor already has general information on how to configure and route resource logs. See https://learn.microsoft.com/azure/azure-monitor/platform/diagnostic-settings. Ideally, don't repeat that information here. You can provide a single screenshot of the diagnostic settings portal experience if you want. -->

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

<a name="analyzing-metrics"></a>
<a name="view-operation-level-metrics-for-azure-cosmos-db"></a>
### Analyze Azure Cosmos DB metrics

You can use Azure Monitor Metrics Explorer to analyze metrics for Azure Cosmos DB with metrics from other Azure services by selecting **Metrics** under **Monitoring** in your Azure Cosmos DB account portal navigation. For more information about how to use metrics explorer, see [Analyze metrics with Azure Monitor metrics explorer](/azure/azure-monitor/essentials/analyze-metrics).

You can monitor server-side latency, request unit usage, and normalized request unit usage for your Azure Cosmos DB resources. You can select metrics specific to request units, storage, latency, availability, Cassandra, and others.

On the client side, you can debug issues by collecting metrics for request charge, activity ID, exception and stack trace information, HTTP status and substatus code, and diagnostic string.

For more information and detailed instructions, see the following articles:

- [Monitor server-side latency](monitor-server-side-latency.md)
- [Monitor request unit usage](monitor-request-unit-usage.md)
- [Monitor normalized request unit usage](monitor-normalized-request-units.md)
- [Monitor key updates](monitor-account-key-updates.md)

For a list of all resource metrics supported in Azure Monitor, see [Supported Azure Monitor metrics](/azure/azure-monitor/essentials/metrics-supported). For a list of the platform metrics collected for Azure Cosmos DB, see [Monitoring Azure Cosmos DB data reference metrics](monitor-reference.md#metrics).

### Monitor Azure Cosmos DB programmatically

The account level metrics available in the portal, such as account storage usage and total requests, aren't available by using the API for NoSQL. However, you can retrieve usage data at the collection level by using the API for NoSQL. To retrieve collection level data, use one of the following approaches:

- To use the REST API, [perform a GET on the collection](/rest/api/cosmos-db/get-a-collection). The quota and usage information for the collection is returned in the `x-ms-resource-quota` and `x-ms-resource-usage` headers in the response.

- To use the .NET SDK, use the [DocumentClient.ReadDocumentCollectionAsync](/dotnet/api/microsoft.azure.documents.client.documentclient.readdocumentcollectionasync) method, which returns a [ResourceResponse](/dotnet/api/microsoft.azure.documents.client.resourceresponse-1) that contains many usage properties such as **CollectionSizeUsage**, **DatabaseUsage**, and **DocumentUsage**.

To access more metrics, use the [Azure Monitor SDK](https://www.nuget.org/packages/Microsoft.Azure.Insights). Available metric definitions can be retrieved by using this format:

```http
https://management.azure.com/subscriptions/{SubscriptionId}/resourceGroups/{ResourceGroup}/providers/Microsoft.DocumentDb/databaseAccounts/{DocumentDBAccountName}/providers/microsoft.insights/metricDefinitions?api-version=2018-01-01
```

To retrieve individual metrics, use the following format:

```http
https://management.azure.com/subscriptions/{SubscriptionId}/resourceGroups/{ResourceGroup}/providers/Microsoft.DocumentDb/databaseAccounts/{DocumentDBAccountName}/providers/microsoft.insights/metrics?timespan={StartTime}/{EndTime}&interval={AggregationInterval}&metricnames={MetricName}&aggregation={AggregationType}&`$filter={Filter}&api-version=2018-01-01
```

To learn more, see [Azure monitoring REST API](/azure/azure-monitor/essentials/rest-api-walkthrough).

### Analyze Azure Cosmos DB logs

Data in Azure Monitor Logs is stored in tables. Each table has its own set of unique properties. All resource logs in Azure Monitor have the same fields followed by service-specific fields. The common schema is outlined in [Azure Monitor resource log schema](/azure/azure-monitor/essentials/resource-logs-schema#top-level-common-schema).

For the types of resource logs collected for Azure Cosmos DB, see [Azure Cosmos DB monitoring data reference](monitor-reference.md#resource-logs).

See the following articles for more information about working with Azure Monitor Logs for Azure Cosmos DB:

- [Monitor data by using Azure Diagnostic settings](monitor-resource-logs.md)
- [Audit control plane logs](audit-control-plane-logs.md)
- [Add a transformation for workspace data](tutorial-log-transformation.md)

<!-- ### Sample Kusto queries. Required section. If you have sample Kusto queries for your service, add them after the include. -->
[!INCLUDE [horz-monitor-kusto-queries](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

Prior to using Log Analytics to issue Kusto queries, you must [enable diagnostic logs for control plane operations](audit-control-plane-logs.md#enable-diagnostic-logs-for-control-plane-operations). When you enable diagnostic logs, you select between storing your data in a [resource-specific tables](/azure/azure-monitor/essentials/resource-logs#resource-specific) or single [AzureDiagnostics table (legacy)](/azure/azure-monitor/essentials/resource-logs#azure-diagnostics-mode). The exact text of Kusto queries depends on the [collection mode](/azure/azure-monitor/essentials/resource-logs#select-the-collection-mode) you select.

Here are some queries that you can enter into the **Log search** search bar to help you monitor your Azure Cosmos DB resources. 

#### [Resource-specific table](#tab/resource-specific-diagnostics)

To query for all control-plane logs from Azure Cosmos DB:

```kusto
CDBControlPlaneRequests
```

To query for all data-plane logs from Azure Cosmos DB:

```kusto
CDBDataPlaneRequests
```

To query for a filtered list of data-plane logs, specific to a single resource:

```kusto
CDBDataPlaneRequests
| where AccountName=="<account-name>"
```

To get a count of data-plane logs, grouped by resource:

```kusto
CDBDataPlaneRequests
| summarize count() by AccountName
```

To generate a chart for data-plane logs, grouped by the type of operation:

```kusto
CDBDataPlaneRequests
| summarize count() by OperationName
| render piechart
```

#### [AzureDiagnostics table (legacy)](#tab/azure-diagnostics)

To query for all control-plane logs from Azure Cosmos DB:

```kusto
AzureDiagnostics
| where ResourceProvider=="MICROSOFT.DOCUMENTDB"
| where Category=="ControlPlaneRequests"
```

To query for all data-plane logs from Azure Cosmos DB:

```kusto
AzureDiagnostics
| where ResourceProvider=="MICROSOFT.DOCUMENTDB"
| where Category=="DataPlaneRequests"
```

To query for a filtered list of data-plane logs, specific to a single resource:

```kusto
AzureDiagnostics
| where ResourceProvider=="MICROSOFT.DOCUMENTDB"
| where Category=="DataPlaneRequests"
| where Resource=="<account-name>"
```

> [!IMPORTANT]
> In the **AzureDiagnostics** table, many fields are case sensitive and uppercase including, but not limited to *ResourceId*, *ResourceGroup*, *ResourceProvider*, and *Resource*.

To get a count of data-plane logs, grouped by resource:

```kusto
AzureDiagnostics
| where ResourceProvider=="MICROSOFT.DOCUMENTDB"
| where Category=="DataPlaneRequests"
| summarize count() by Resource
```

To generate a chart for data-plane logs, grouped by the type of operation:

```kusto
AzureDiagnostics
| where ResourceProvider=="MICROSOFT.DOCUMENTDB"
| where Category=="DataPlaneRequests"
| summarize count() by OperationName
| render columnchart
```

---

For Kusto queries you can use to troubleshoot issues with Azure Cosmos DB, see the following articles:

- [Troubleshoot issues by using basic queries](monitor-logs-basic-queries.md)
- [Troubleshoot issues by using advanced diagnostic queries](nosql/diagnostic-queries.md)

These examples are just a small sampling of the rich queries you can run in Azure Monitor by using the Kusto Query Language (KQL). For more examples, see [samples for Kusto queries](/azure/data-explorer/kusto/query/samples?pivots=azuremonitor).


<!-- ANALYSIS SECTION END ------------------------------------->

<!-- ALERTS SECTION START -------------------------------------->

<!-- ## Alerts. Required section. -->
[!INCLUDE [horz-monitor-alerts](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

<!-- ONLY if your service (Azure VMs, AKS, or Log Analytics workspaces) offer out-of-the-box recommended alerts, add the following include. 
[!INCLUDE [horz-monitor-insights-alerts](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-recommended-alert-rules.md)]
<!-- ONLY if applications run on your service that work with Application Insights, add the following include. 
[!INCLUDE [horz-monitor-insights-alerts](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]
<!-- ### Azure Cosmos DB alert rules. Required section.
**MUST HAVE** service-specific alert rules. Include useful alerts on metrics, logs, log conditions, or activity log.
Fill in the following table with metric and log alerts that would be valuable for your service. Change the format as necessary for readability. You can instead link to an article that discusses your common alerts in detail.
Ask your PMs if you don't know. This information is the BIGGEST request we get in Azure Monitor, so don't avoid it long term. People don't know what to monitor for best results. Be prescriptive. -->

### Azure Cosmos DB alert rules

The following table lists some common and recommended alert rules for Azure Cosmos DB.

| Alert type | Condition | Description  |
|:---|:---|:---|
|Rate limiting on request units (metric alert) |Dimension name: *StatusCode*, Operator: *Equals*, Dimension values: 429  | Alerts if the container or a database has exceeded the provisioned throughput limit. |
|Region failed over |Operator: *Greater than*, Aggregation type: *Count*, Threshold value: 1 | When a single region is failed over. This alert is helpful if you didn't enable service-managed failover. |
|Rotate keys (activity log alert)| Event level: *Informational*, *Status*: started| Alerts when the account keys are rotated. You can update your application with the new keys. |

For more information and instructions on creating alerts for Azure Cosmos DB, see [Create alert on metrics](create-alerts.md). To create an alert to monitor if storage for a logical partition key is approaching 20 GB, see [Create alert on logical partition key size](how-to-alert-on-logical-partition-key-storage-size.md).

<!-- ### Advisor recommendations. Required section. -->
[!INCLUDE [horz-monitor-advisor-recommendations](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]
<!-- Add any service-specific advisor recommendations or screenshots here. -->

<!-- ALERTS SECTION END -------------------------------------->

## Related content
<!-- You can change the wording and add more links if useful. -->

- See [Azure Cosmos DB monitoring data reference](monitor-reference.md) for a reference of the metrics, logs, and other important values created for Azure Cosmos DB.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
