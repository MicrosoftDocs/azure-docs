---
title: Monitor normalized RU/s for an Azure Cosmos container or an account
description: Learn how to monitor the normalized request unit usage of an operation in Azure Cosmos DB. Owners of an Azure Cosmos DB account can understand which operations are consuming more request units. 
ms.service: cosmos-db
ms.topic: how-to
author: kanshiG   
ms.author: govindk
ms.date: 01/07/2021

---

# How to monitor normalized RU/s for an Azure Cosmos container or an account
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

Azure Monitor for Azure Cosmos DB provides a metrics view to monitor your account and create dashboards. The Azure Cosmos DB metrics are collected by default, this feature does not require you to enable or configure anything explicitly.

The **Normalized RU Consumption** metric is used to see how well saturated the  partition key ranges are  with respect to the traffic. Azure Cosmos DB distributes the throughput equally across all the partition key ranges. This metric provides a per second view of the maximum throughput utilization for partition key range. Use this metric to calculate the RU/s usage across partition key range for given container. By using this metric, if you see high percentage of request units utilization across all partition key ranges in Azure monitor, you should increase the throughput to meet the needs of your workload. 
Example - Normalized utilization is defined as the max of the RU/s utilization across all partition key ranges. For example, suppose your max throughput is 20,000 RU/s and you have two   partition key ranges, P_1 and P_2, each capable of scaling to 10,000 RU/s. In a given second, if P_1 has used 6000 RUs, and P_2 8000 RUs, the normalized utilization is MAX(6000 RU / 10,000 RU, 8000 RU / 10,000 RU) = 0.8.

## What to expect and do when normalized RU/s is higher

When the normalized RU/s consumption reaches 100% for given partition key range, and if a client still makes requests in that time window of 1 second to that specific partition key range - it receives a rate limited error. The client should respect the suggested wait time and retry the request. The SDK makes it easy to handle this situation by retrying preconfigured times by waiting appropriately.  It is not necessary that you see the RU rate limiting error just because the normalized RU has reached 100%. That's because the normalized RU is a single value that represents the max usage over all partition key ranges, one partition key range may be busy but the other partition key ranges can serve the requests without issues. For example, a single operation such as a stored procedure that consumes all the RU/s on a partition key range will lead to a short spike in the normalized RU/s consumption. In such cases, there will not be any immediate rate limiting errors if the request rate is low or requests are made to other partitions on different partition key ranges. 

The Azure Monitor metrics help you to find the operations per status code for SQL API by using the **Total Requests** metric. Later you can filter on these requests by the 429 status code and split them by **Operation Type**.  

To find the requests, which are rate limited, the recommended way is to get this information through diagnostic logs.

If there is continuous peak of 100% normalized RU/s consumption or close to 100% across multiple partition key ranges, it's recommended to increase the throughput. You can find out which operations are heavy and their peak usage by utilizing the Azure monitor metrics and Azure monitor diagnostic logs.

In summary, the **Normalized RU Consumption** metric is  used to see which partition key range is more warm in terms of usage. So it gives you the skew of throughput towards a partition key range. You can later follow up to see the **PartitionKeyRUConsumption** log in Azure Monitor logs to get information about which logical partition keys are hot in terms of usage. This will point to change in either the partition key choice, or the change in application logic. To resolve the rate limiting, distribute the load of data say across multiple partitions or just increase in the throughput as it is required. 

## View the normalized request unit consumption metric

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Select **Monitor** from the left-hand navigation bar, and select **Metrics**.

   :::image type="content" source="./media/monitor-normalized-request-units/monitor-metrics-blade.png" alt-text="Metrics pane in Azure Monitor":::

3. From the **Metrics** pane > **Select a resource** > choose the required **subscription**, and **resource group**. For the **Resource type**, select **Azure Cosmos DB accounts**, choose one of your existing Azure Cosmos accounts, and select **Apply**.

   :::image type="content" source="./media/monitor-normalized-request-units/select-cosmos-db-account.png" alt-text="Choose an Azure Cosmos account to view metrics":::

4. Next you can select a metric from the list of available metrics. You can select metrics specific to request units, storage, latency, availability, Cassandra, and others. To learn in detail about all the available metrics in this list, see the [Metrics by category](monitor-cosmos-db-reference.md) article. In this example, let’s select **Normalized RU Consumption** metric and **Max** as the aggregation value.

   In addition to these details, you can also select the **Time range** and **Time granularity** of the metrics. At max, you can view metrics for the past 30 days.  After you apply the filter, a chart is displayed based on your filter.

   :::image type="content" source="./media/monitor-normalized-request-units/normalized-request-unit-usage-metric.png" alt-text="Choose a metric from the Azure portal":::

### Filters for normalized request unit consumption

You can also filter metrics and the chart displayed by a specific **CollectionName**, **DatabaseName**, **PartitionKeyRangeID**, and **Region**. To filter the metrics, select **Add filter** and choose the required property such as **CollectionName** and corresponding value you are interested in. The graph then displays the Normalized RU Consumption units consumed for the container for the selected period.  

You can group metrics by using the **Apply splitting** option. For shared throughput databases, the normalized RU metric shows data at the database granularity only, it doesn't show any data per collection. So for shared throughput database, you won't see any data when you apply splitting by collection name.

The normalized request unit consumption metric for each container is displayed as shown in the following image:

:::image type="content" source="./media/monitor-normalized-request-units/normalized-request-unit-usage-filters.png" alt-text="Apply filters to normalized request unit consumption metric":::

## Next steps

* Monitor Azure Cosmos DB data by using [diagnostic settings](cosmosdb-monitor-resource-logs.md) in Azure.
* [Audit Azure Cosmos DB control plane operations](audit-control-plane-logs.md)
