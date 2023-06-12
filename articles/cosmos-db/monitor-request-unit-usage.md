---
title: Monitor the throughput usage of an operation in Azure Cosmos DB 
description: Learn how to monitor the throughput or request unit usage of an operation in Azure Cosmos DB. Owners of an Azure Cosmos DB account can understand which operations are taking more request units. 
ms.service:  cosmos-db
ms.custom: ignite-2022
ms.topic: how-to
ms.author: esarroyo
author: StefArroyo 
ms.date: 09/16/2021
---

# How to monitor throughput or request unit usage of an operation in Azure Cosmos DB
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Azure Monitor for Azure Cosmos DB provides a metrics view to monitor your account and create dashboards. The Azure Cosmos DB metrics are collected by default, this feature does not require you to enable or configure anything explicitly. The **Total Request Units** metric is used to get the request units usage for different types of operations. Later you can analyze which operations used most of the throughput. By default, the throughput data is aggregated at one-minute interval. However, you can change the aggregation unit by changing the time granularity option.

There are two ways to analyze the request unit usage data:

* Within the given time interval which operations are taking more request units.
* Which operations in general dominate your workload by consuming more request units.
This analysis allows you to focus on operations such as insert, upsert and look at their indexing. You can find out if you are over/under indexing specific fields and modify the [indexing policy](index-policy.md#include-exclude-paths) to include or exclude the paths.

If you notice certain queries are taking more request units, you can take actions such as:

* Reconsider if you are requesting the right amount of data.
* Modify the query to use index with filter clause.
* Perform less expensive UDF function calls.
* Define partition keys to minimize the fan out of query into different partitions.
* You can also use the query metrics returned in the call response, the diagnostic log details and refer to [query performance tuning](nosql/query-metrics.md) article to learn more about the query execution.
* You can start from sum and then look at avg utilization using the right dimension.

## View the total request unit usage metric

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **Monitor** from the left-hand navigation bar and select **Metrics**.

   :::image type="content" source="./media/monitor-request-unit-usage/monitor-metrics-blade.png" alt-text="Metrics pane in Azure Monitor":::

1. From the **Metrics** pane > **Select a resource** > choose the required **subscription**, and **resource group**. For the **Resource type**, select **Azure Cosmos DB accounts**, choose one of your existing Azure Cosmos DB accounts, and select **Apply**.

   :::image type="content" source="./media/monitor-account-key-updates/select-account-scope.png" alt-text="Select the account scope to view metrics" border="true":::

1. Next select the **Total Request Units** metric from the list of available metrics. To learn in detail about all the available metrics in this list, see the [Metrics by category](monitor-reference.md) article. In this example, let's select **Total Request Units** and **Avg** as the aggregation value. In addition to these details, you can also select the **Time range** and **Time granularity** of the metrics. At max, you can view metrics for the past 30 days.  After you apply the filter, a chart is displayed based on your filter. You can see the average number of request units consumed per minute for the selected period.  

   :::image type="content" source="./media/monitor-request-unit-usage/request-unit-usage-metric.png" alt-text="Choose a metric from the Azure portal" border="true":::

## Filters for request unit usage

You can also filter metrics and get the charts displayed by a specific **CollectionName**, **DatabaseName**, **OperationType**, **Region**, **Status**, and **StatusCode**. The **Add filter** and **Apply splitting** options allows you to filter the request unit usage and group the metrics.

To get the request unit usage of each operation either by total(sum) or average, select **Apply splitting** and choose **Operation type** and the filter value as shown in the following image:

   :::image type="content" source="./media/monitor-request-unit-usage/request-unit-usage-operations.png" alt-text="Azure Cosmos DB Request units for operations in Azure monitor":::

If you want to see the request unit usage by collection, select **Apply splitting** and choose the collection name as a filter. You will see a chart like the following with a choice of collections within the dashboard. You can then select a specific collection name to view more details:

   :::image type="content" source="./media/monitor-request-unit-usage/request-unit-usage-collection.png" alt-text="Azure Cosmos DB Request units for all operations by the collection in Azure monitor" border="true":::

## Next steps

* Monitor Azure Cosmos DB data by using [diagnostic settings](monitor-resource-logs.md) in Azure.
* [Audit Azure Cosmos DB control plane operations](audit-control-plane-logs.md)
