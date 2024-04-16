---
title: Monitor Azure Cosmos DB
description: Start here to learn how to monitor Azure Cosmos DB.
ms.date: 03/05/2024
ms.custom: horz-monitor
ms.topic: conceptual
ms.author: esarroyo
author: StefArroyo
ms.service: cosmos-db
---

# Monitor Azure Cosmos DB

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

### Azure Cosmos DB insights

Azure Cosmos DB insights is a feature based on the [workbooks feature of Azure Monitor](/azure/azure-monitor/visualize/workbooks-overview). Use Azure Cosmos DB insights for a view of the overall performance, failures, capacity, and operational health of all your Azure Cosmos DB resources in a unified interactive experience.

For more information about Azure Cosmos DB insights, see the following articles:

- [Explore Azure Cosmos DB insights](insights-overview.md)
- [Monitor and debug with insights in Azure Cosmos DB](use-metrics.md).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure Cosmos DB, see [Azure Cosmos DB monitoring data reference](monitor-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

Azure Monitor collects Azure Cosmos DB metrics by default. You don't need to explicitly configure anything. Most of the metrics are available from the Azure Cosmos DB portal page or from the Azure Monitor page. By default, the metrics are collected with one-minute granularity. The granularity might vary based on the metric you choose. By default, these metrics have a retention period of 30 days.

Azure Cosmos DB server-side metrics include throughput, storage, availability, latency, consistency, and system level metrics. On the client side, you can collect details for request charge, activity ID, exception and stack trace information, HTTP status and substatus code, and diagnostic string. By default, these metrics have a retention period of seven days. You can use this data to debug issues or if you need to contact the Azure Cosmos DB support team.

The dimension values for the metrics, such as container name, are case insensitive. This situation can result in confusion or collision of telemetry and actions on containers with such names. Use case insensitive comparison when doing string comparisons on these dimension values.

For a list of available metrics for Azure Cosmos DB, see [Azure Cosmos DB monitoring data reference](monitor-reference.md#metrics).

[!INCLUDE [horz-monitor-custom-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)]

- For information about partner solutions and tools that can help monitor Azure Cosmos DB, see [Monitor Azure Cosmos DB using third-party solutions](monitoring-solutions.md).
- To implement Micrometer metrics in the Java SDK for Azure Cosmos DB by consuming Prometheus metrics, see [Use Micrometer client metrics for Java](nosql/client-metrics-java.md).

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

You can monitor diagnostic logs from your Azure Cosmos DB account and create dashboards from Azure Monitor. Data such as events and traces that occur at a second granularity are stored as logs. For example, if the throughput of a container changes, the properties of an Azure Cosmos DB account change. The logs capture these events. You can analyze these logs by running queries on the gathered data.

For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Azure Cosmos DB, see [Azure Cosmos DB monitoring data reference](monitor-reference.md#resource-logs).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

<a name="analyzing-metrics"></a>
<a name="view-operation-level-metrics-for-azure-cosmos-db"></a>
## Analyze Azure Cosmos DB metrics

You can use Azure Monitor Metrics Explorer to analyze metrics for Azure Cosmos DB with metrics from other Azure services by selecting **Metrics** under **Monitoring** in your Azure Cosmos DB account portal navigation. For more information about how to use metrics explorer, see [Analyze metrics with Azure Monitor metrics explorer](/azure/azure-monitor/essentials/analyze-metrics).

You can monitor server-side latency, request unit usage, and normalized request unit usage for your Azure Cosmos DB resources. You can select metrics specific to request units, storage, latency, availability, Cassandra, and others.

On the client side, you can debug issues by collecting metrics for request charge, activity ID, exception and stack trace information, HTTP status and substatus code, and diagnostic string.

For more information and detailed instructions, see the following articles:

- [Monitor server-side latency](monitor-server-side-latency.md)
- [Monitor request unit usage](monitor-request-unit-usage.md)
- [Monitor normalized request unit usage](monitor-normalized-request-units.md)
- [Monitor key updates](monitor-account-key-updates.md)

For a list of all resource metrics supported in Azure Monitor, see [Supported Azure Monitor metrics](/azure/azure-monitor/essentials/metrics-supported). For a list of the platform metrics collected for Azure Cosmos DB, see [Monitoring Azure Cosmos DB data reference metrics](monitor-reference.md#metrics).

## Monitor Azure Cosmos DB programmatically

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

## Analyze Azure Cosmos DB logs

Data in Azure Monitor Logs is stored in tables. Each table has its own set of unique properties. All resource logs in Azure Monitor have the same fields followed by service-specific fields. The common schema is outlined in [Azure Monitor resource log schema](/azure/azure-monitor/essentials/resource-logs-schema#top-level-common-schema).

For the types of resource logs collected for Azure Cosmos DB, see [Azure Cosmos DB monitoring data reference](monitor-reference.md#resource-logs).

See the following articles for more information about working with Azure Monitor Logs for Azure Cosmos DB:

- [Monitor data by using Azure Diagnostic settings](monitor-resource-logs.md)
- [Audit control plane logs](audit-control-plane-logs.md)
- [Add a transformation for workspace data](tutorial-log-transformation.md)

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

Prior to using Log Analytics to issue Kusto queries, you must [enable diagnostic logs for control plane operations](audit-control-plane-logs.md#enable-diagnostic-logs-for-control-plane-operations). When you enable diagnostic logs, you select between storing your data in [resource-specific tables](/azure/azure-monitor/essentials/resource-logs#resource-specific) or the single [AzureDiagnostics table (legacy)](/azure/azure-monitor/essentials/resource-logs#azure-diagnostics-mode). The exact text of Kusto queries depends on the [collection mode](/azure/azure-monitor/essentials/resource-logs#select-the-collection-mode) you select.

Here are some queries that you can enter into the **Log search** search bar to help you monitor your Azure Cosmos DB resources. 

### [Resource-specific table](#tab/resource-specific-diagnostics)

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

### [AzureDiagnostics table (legacy)](#tab/azure-diagnostics)

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

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### Azure Cosmos DB alert rules

The following table lists some common and recommended alert rules for Azure Cosmos DB.

| Alert type | Condition | Description  |
|:---|:---|:---|
|Rate limiting on request units (metric alert) |Dimension name: *StatusCode*, Operator: *Equals*, Dimension values: 429  | Alerts if the container or a database has exceeded the provisioned throughput limit. |
|Region failed over |Operator: *Greater than*, Aggregation type: *Count*, Threshold value: 1 | When a single region is failed over. This alert is helpful if you didn't enable service-managed failover. |
|Rotate keys (activity log alert)| Event level: *Informational*, *Status*: started| Alerts when the account keys are rotated. You can update your application with the new keys. |

For more information and instructions on creating alerts for Azure Cosmos DB, see [Create alert on metrics](create-alerts.md). To create an alert to monitor if storage for a logical partition key is approaching 20 GB, see [Create alert on logical partition key size](how-to-alert-on-logical-partition-key-storage-size.md).

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Azure Cosmos DB monitoring data reference](monitor-reference.md) for a reference of the metrics, logs, and other important values created for Azure Cosmos DB.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
