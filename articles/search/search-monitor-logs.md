---
title: Collect log data
titleSuffix: Azure Cognitive Search
description: Collect and analyze log data by enabling a diagnostic setting, and then use the Kusto Query Language to explore results.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/11/2020
---

# Collect and analyze log data for Azure Cognitive Search

Diagnostic or operational logs provide insight into the detailed operations of Azure Cognitive Search and are useful for monitoring service and workload processes. Internally, logs exist on the backend for a short period of time, sufficient for investigation and analysis if you file a support ticket. However, if you want self-direction over operational data, you should configure a diagnostic setting to specify where logging information is collected. 

Setting up logs is useful for diagnostics and preserving operational history. After you enable logging, you can run queries or build reports for structured analysis.

The following table enumerates options for collecting and persisting data.

| Resource | Used for |
|----------|----------|
| [Send to Log Analytics workspace](https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-resource-logs) | Logged events and query metrics, based on the schemas below. Events are logged to a Log Analytics workspace. Using Log Analytics, you can run queries to return detailed information. For more information, see [Get started with Azure Monitor logs](https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-viewdata) |
| [Archive with Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-overview) | Logged events and query metrics, based on the schemas below. Events are logged to a Blob container and stored in JSON files. Use a JSON editor to view the log.|
| [Stream to Event Hub](https://docs.microsoft.com/azure/event-hubs/) | Logged events and query metrics, based on the schemas documented in this article. Choose this as an alternative data collection service for very large logs. |

Both Azure Monitor logs and Blob storage are available as a free service so that you can try it out at no charge for the lifetime of your Azure subscription. Application Insights is free to sign up and use as long as application data size is under certain limits (see the [pricing page](https://azure.microsoft.com/pricing/details/monitor/) for details).

## Prerequisites

If you are using Log Analytics or Azure Storage, you can create resources in advance.

+ [Create a log analytics workspace](https://docs.microsoft.com/azure/azure-monitor/learn/quick-create-workspace)

+ [Create a storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account) if you don't already have one. If possible, choose the same region as Azure Cognitive Search.

## Create a diagnostic setting

Each setting specifies how and what is collected. Besides storage, you can choose whether to collect operational logs, metrics, or both.

1. Under **Monitoring**, select **Diagnostic settings**.

   ![Diagnostic settings](./media/search-monitor-usage/diagnostic-settings.png "Diagnostic settings")

1. Select **+ Add diagnostic setting**

1. Choose the data you want to export: Logs, Metrics or both. You can collect data in a storage account, a log analytics workspace, or stream it to Event Hub.

   Log analytics is recommended because you can query the workspace in the portal.

   If you are also using Blob storage, only the storage account must exist. Containers and blobs will be created as-needed when log data is exported.

   ![Configure data collection](./media/search-monitor-usage/configure-storage.png "Configure data collection")

1. Save the setting.

1. Test by creating or deleting objects (creates log events) and by submitting queries (generates metrics). 

In Blob storage, containers are only created when there is an activity to log or measure. When the data is copied to a storage account, the data is formatted as JSON and placed in two containers:

* insights-logs-operationlogs: for search traffic logs
* insights-metrics-pt1m: for metrics

**It takes one hour before the containers will appear in Blob storage. There is one blob, per hour, per container.**

<!-- ### Example path

```http
resourceId=/subscriptions/<subscriptionID>/resourcegroups/<resourceGroupName>/providers/microsoft.search/searchservices/<searchServiceName>/y=2018/m=12/d=25/h=01/m=00/name=PT1H.json
``` -->

## Log schema

Data structures that contain Azure Cognitive Search log data conform to the schema below. 

For Blob storage, each blob has one root object called **records** containing an array of log objects. Each blob contains records for all the operations that took place during the same hour.

| Name | Type | Example | Notes |
| --- | --- | --- | --- |
| time |datetime |"2018-12-07T00:00:43.6872559Z" |Timestamp of the operation |
| resourceId |string |"/SUBSCRIPTIONS/11111111-1111-1111-1111-111111111111/<br/>RESOURCEGROUPS/DEFAULT/PROVIDERS/<br/> MICROSOFT.SEARCH/SEARCHSERVICES/SEARCHSERVICE" |Your ResourceId |
| operationName |string |"Query.Search" |The name of the operation |
| operationVersion |string |"2019-05-06" |The api-version used |
| category |string |"OperationLogs" |constant |
| resultType |string |"Success" |Possible values: Success or Failure |
| resultSignature |int |200 |HTTP result code |
| durationMS |int |50 |Duration of the operation in milliseconds |
| properties |object |see the following table |Object containing operation-specific data |

**Properties schema**

| Name | Type | Example | Notes |
| --- | --- | --- | --- |
| Description |string |"GET /indexes('content')/docs" |The operation's endpoint |
| Query |string |"?search=AzureSearch&$count=true&api-version=2019-05-06" |The query parameters |
| Documents |int |42 |Number of documents processed |
| IndexName |string |"test-index" |Name of the index associated with the operation |

## Metrics schema

Metrics are captured for query requests. For more information, see [Monitor query requests](search-monitor-queries.md).

| Name | Type | Example | Notes |
| --- | --- | --- | --- |
| resourceId |string |"/SUBSCRIPTIONS/11111111-1111-1111-1111-111111111111/<br/>RESOURCEGROUPS/DEFAULT/PROVIDERS/<br/>MICROSOFT.SEARCH/SEARCHSERVICES/SEARCHSERVICE" |your resource ID |
| metricName |string |"Latency" |the name of the metric |
| time |datetime |"2018-12-07T00:00:43.6872559Z" |the operation's timestamp |
| average |int |64 |The average value of the raw samples in the metric time interval |
| minimum |int |37 |The minimum value of the raw samples in the metric time interval |
| maximum |int |78 |The maximum value of the raw samples in the metric time interval |
| total |int |258 |The total value of the raw samples in the metric time interval |
| count |int |4 |The number of raw samples used to generate the metric |
| timegrain |string |"PT1M" |The time grain of the metric in ISO 8601 |

All metrics are reported in one-minute intervals. Every metric exposes minimum, maximum and average values per minute.

For the **Search Queries Per Second** metric, minimum is the lowest value for search queries per second that was registered during that minute. The same applies to the maximum value. Average, is the aggregate across the entire minute. For example, within one minute, you might have a pattern like this: one second of high load that is the maximum for SearchQueriesPerSecond, followed by 58 seconds of average load, and finally one second with only one query, which is the minimum.

For **Throttled Search Queries Percentage**, minimum, maximum, average and total, all have the same value: the percentage of search queries that were throttled, from the total number of search queries during one minute.

## View log files

You can use any JSON editor to view the log file. If you don't have one, we recommend [Visual Studio Code](https://code.visualstudio.com/download).

1. In Azure portal, open your Storage account. 

2. In the left-navigation pane, click **Blobs**. You should see **insights-logs-operationlogs** and **insights-metrics-pt1m**. These containers are created by Azure Cognitive Search when the log data is exported to Blob storage.

3. Click down the folder hierarchy until you reach the .json file.  Use the context-menu to download the file.

Once the file is downloaded, open it in a JSON editor to view the contents.

## Next steps

If you haven't done so already, review the fundamentals of search service monitoring to learn about the full range of oversight capabilities.

> [!div class="nextstepaction"]
> [Monitor operations and activity in Azure Cognitive Search](search-monitor-usage.md)