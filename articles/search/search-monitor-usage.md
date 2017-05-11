---
title: Monitor usage and statistics in an Azure Search service | Microsoft Docs
description: Track resource consumption and index size for Azure Search, a hosted cloud search service on Microsoft Azure.
services: search
documentationcenter: ''
author: bernitorres
manager: jlembicz
editor: ''
tags: azure-portal

ms.assetid: 122948de-d29a-426e-88b4-58cbcee4bc23
ms.service: search
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: required
ms.date: 05/01/2017
ms.author: betorres

---
# Monitoring an Azure Search service

Azure Search offers various resources for tracking usage and performance of search services. It gives you access to metrics, logs, index statistics, and extended monitoring capabilities on Power BI. This article describes how to enable the different monitoring strategies and how to interpret the resulting data.

## Azure Search metrics
Metrics give you near real-time visibility into your search service and are available for every service, with no additional setup. They let you track the performance of your service for up to 30 days.

Azure Search collects data for three different metrics:

* Search latency: Time the search service needed to process search queries, aggregated per minute.
* Search queries per second (QPS): Number of search queries received per second, aggregated per minute.
* Throttled search queries percentage: Percentage of search queries that were throttled, aggregated per minute.

![Screenshot of QPS activity][1]

### Set up alerts
From the metric detail page, you can configure alerts to trigger an email notification or an automated action when a metric crosses a threshold that you have defined.

For more information about metrics, check the full documentation on Azure Monitor.  

## How to track resource usage
Tracking the growth of indexes and document size can help you proactively adjust capacity before hitting the upper limit you've established for your service. You can do this on the portal or programmatically using the REST API.

### Using the portal

To monitor resource usage, view the counts and statistics for your service in the [portal](https://portal.azure.com).

1. Sign in to the [portal](https://portal.azure.com).
2. Open the service dashboard of your Azure Search service. Tiles for the service can be found on the Home page, or you can browse to the service from Browse on the JumpBar.

The Usage section includes a meter that tells you what portion of available resources are currently in use. For information on per-service limits for indexes, documents, and storage, see [Service limits](search-limits-quotas-capacity.md).

  ![Usage tile][2]

> [!NOTE]
> The screenshot above is for the Free service, which has a maximum of one replica and partition each, and can only host 3 indexes, 10,000 documents, or 50 MB of data, whichever comes first. Services created at a Basic or Standard tier have much larger service limits. For more information on choosing a tier, see [Choose a tier or SKU](search-sku-tier.md).
>
>

### Using the REST API
Both the Azure Search REST API and the .NET SDK provide programmatic access to service metrics.  If you are using [indexers](https://msdn.microsoft.com/library/azure/dn946891.aspx) to load an index from Azure SQL Database or Azure Cosmos DB, an additional API is available to get the numbers you require.

* [Get Index Statistics](/rest/api/searchservice/get-index-statistics)
* [Count Documents](/rest/api/searchservice/count-documents)
* [Get Indexer Status](/rest/api/searchservice/get-indexer-status)

## How to export logs and metrics

You can export the operation logs for your service and the raw data for the metrics described in the preceding section. Operation logs let you know how the service is being used and can be consumed from Power BI when data is copied to a storage account. Azure search provides a monitoring Power BI content pack for this purpose.


### Enabling monitoring
Open your Azure Search service in the [Azure portal](http://portal.azure.com) under the Enable Monitoring option.

Choose the data you want to export: Logs, Metrics or both. You can copy it to a storage account, send it to an event hub or export it to Log Analytics.

![How to enable monitoring in the portal][3]

To enable using PowerShell or the Azure CLI, see the documentation [here](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs#how-to-enable-collection-of-diagnostic-logs).

### Logs and metrics schemas
When the data is copied to a storage account, the data is formatted as JSON and it's place in two containers:

* insights-logs-operationlogs: for search traffic logs
* insights-metrics-pt1m: for metrics

There is one blob, per hour, per container.

Example path: `resourceId=/subscriptions/<subscriptionID>/resourcegroups/<resourceGroupName>/providers/microsoft.search/searchservices/<searchServiceName>/y=2015/m=12/d=25/h=01/m=00/name=PT1H.json`

#### Log schema
The logs blobs contain your search service traffic logs.
Each blob has one root object called **records** that contains an array of log objects.
Each blob has records on all the operation that took place during the same hour.

| Name | Type | Example | Notes |
| --- | --- | --- | --- |
| time |datetime |"2015-12-07T00:00:43.6872559Z" |Timestamp of the operation |
| resourceId |string |"/SUBSCRIPTIONS/11111111-1111-1111-1111-111111111111/<br/>RESOURCEGROUPS/DEFAULT/PROVIDERS/<br/> MICROSOFT.SEARCH/SEARCHSERVICES/SEARCHSERVICE" |Your ResourceId |
| operationName |string |"Query.Search" |The name of the operation |
| operationVersion |string |"2015-02-28" |The api-version used |
| category |string |"OperationLogs" |constant |
| resultType |string |"Success" |Possible values: Success or Failure |
| resultSignature |int |200 |HTTP result code |
| durationMS |int |50 |Duration of the operation in milliseconds |
| properties |object |see the following table |Object containing operation-specific data |

**Properties schema**
| Name | Type | Example | Notes |
| --- | --- | --- | --- |
| Description |string |"GET /indexes('content')/docs" |The operation's endpoint |
| Query |string |"?search=AzureSearch&$count=true&api-version=2015-02-28" |The query parameters |
| Documents |int |42 |Number of documents processed |
| IndexName |string |"testindex" |Name of the index associated with the operation |

#### Metrics schema
| Name | Type | Example | Notes |
| --- | --- | --- | --- |
| resourceId |string |"/SUBSCRIPTIONS/11111111-1111-1111-1111-111111111111/<br/>RESOURCEGROUPS/DEFAULT/PROVIDERS/<br/>MICROSOFT.SEARCH/SEARCHSERVICES/SEARCHSERVICE" |your resource id |
| metricName |string |"Latency" |the name of the metric |
| time |datetime |"2015-12-07T00:00:43.6872559Z" |the operation's timestamp |
| average |int |64 |The average value of the raw samples in the metric time interval |
| minimum |int |37 |The minimum value of the raw samples in the metric time interval |
| maximum |int |78 |The maximum value of the raw samples in the metric time interval |
| total |int |258 |The total value of the raw samples in the metric time interval |
| count |int |4 |The number of raw samples used to generate the metric |
| timegrain |string |"PT1M" |The time grain of the metric in ISO 8601 |

All metrics are reported in one-minute intervals. Every metric exposes minimum, maximum and average values per minute.

For the SearchQueriesPerSecond metric, minimum is the lowest value for search queries per second that was registered during that minute. The same applies to the maximum value. Average, is the aggregate across the entire minute.
Think about this scenario during one minute: one second of high load that is the maximum for SearchQueriesPerSecond, followed by 58 seconds of average load, and finally one second with only one query, which is the minimum.

For ThrottledSearchQueriesPercentage, minimum, maximum, average and total, all have the same value: the percentage of search queries that were throttled, from the total number of search queries during one minute.

## Analyzing your data With Power BI

We recommend using [Power BI](https://powerbi.microsoft.com) to explore and visualize your data. You can easily connect it to your Azure Storage Account and quickly start analyzing your data.

Azure Search provides a [Power BI Content Pack](https://app.powerbi.com/getdata/services/azure-search) that allows you to monitor and understand your search traffic with predefined charts and tables. It contains a set of Power BI reports that automatically connect to your data and provide visual insights about your search service. For more information, see the [content pack help page](https://powerbi.microsoft.com/documentation/powerbi-content-pack-azure-search/).

![Power BI dashboard for Azure Search][4]

## Next steps
Review [Scale replicas and partitions](search-limits-quotas-capacity.md) for guidance on how to balance the allocation of partitions and replicas for an existing service.

Visit [Manage your Search service on Microsoft Azure](search-manage.md) for more information on service administration, or [Performance and optimization](search-performance-optimization.md) for tuning guidance.

Learn more about creating amazing reports. See [Getting started with Power BI Desktop](https://powerbi.microsoft.com/documentation/powerbi-desktop-getting-started/) for details

<!--Image references-->
[1]: ./media/search-monitor-usage/AzSearch-Monitor-BarChart.PNG
[2]: ./media/search-monitor-usage/AzureSearch-Monitor1.PNG
[3]: ./media/search-monitor-usage/AzureSearch-Enable-Monitoring.PNG
[4]: ./media/search-monitor-usage/AzureSearch-PowerBI-Dashboard.png
