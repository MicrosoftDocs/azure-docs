---
title: Monitor and debug with insights in Azure Cosmos DB for Apache Cassandra
description: Learn how to debug and monitor your Azure Cosmos DB for Apache Cassandra account using insights
author: iriaosara
ms.author: iriaosara
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: how-to
ms.date: 05/02/2022
ms.custom: template-how-to, ignite-2022
---

# Monitor and debug with insights in Azure Cosmos DB for Apache Cassandra
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

Azure Cosmos DB helps provide insights into your application’s performance using the Azure Monitor API.  Azure Monitor for Azure Cosmos DB provides metrics view to monitor your API for Cassandra Account and create dashboards.

This article walks through some common use cases  and how best to use Azure Cosmos DB insights to analyze and debug your API for Cassandra account.
> [!NOTE]
> The Azure Cosmos DB metrics are collected by default, this feature does not require you to enable or configure anything.


## Availability
The availability shows the percentage of successful requests over the total requests per hour. Monitor service availability for a specified API for Cassandra account. 

:::image type="content" source="./media/monitor-insights/service-availability-min.png" alt-text=" Screenshot for service availability for an Azure Cosmos DB for Apache Cassandra account.":::


## Latency
These charts below show the read and write latency observed by your API for Cassandra account in the region where your account is operating. You can visualize latency across regions for a geo-replicated account. This metric doesn't represent the end-to-end request latency. Use diagnostic log for cases where you experience high latency for query operations.

The server side latency (Avg) by region also displays a sudden latency spike on the server. It can help a customer differentiate between a client side latency spike and a server-side latency spike.

:::image type="content" source="./media/monitor-insights/avg-server-side-latency-by-region.png" alt-text="Diagram showing the average server side latency by region.":::

Also view server-side latency by different operations in a specific keyspace.

:::image type="content" source="./media/monitor-insights/avg-ss-latency-keyspace-operation.png" alt-text="Screenshot showing the average server side latency for a specific keyspace based on operation.":::


:::image type="content" source="./media/monitor-insights/avg-ss-latency-region-keyspace.png" alt-text="Screenshot showing the average server side latency by region and keyspace.":::


Is your application experiencing any throttling? The chart below shows the total number of requests failed with a 429-response code. 
Exceeding provisioned throughput could be one of the reasons. Enable [Server Side Retry](./prevent-rate-limiting-errors.md) when your application experiences high throttling due to higher consumption of request units than what is allocated.

:::image type="content" source="./media/monitor-insights/throttled-requests.png" alt-text="Screenshot of graph showing throttled request with a defined time frame.":::



## System and management operations
The system view helps show metadata requests count by primary partition. It also helps identify throttled requests. The management operation shows the account activities such as creation, deletion, key, network and replication settings. Request volume per status code over a time period.

:::image type="content" source="./media/monitor-insights/metadata-requests-status-code.png" alt-text="Screenshot showing request status code based on metadata.":::

- Metric chart for account diagnostic, network and replication settings over a specified period and filtered based on a Keyspace.

:::image type="content" source="./media/monitor-insights/diagnostic-network-replication.png" alt-text="Screenshot of diagnostic network replication for a API for Cassandra account.":::


- Metric chart to view account key rotation.

You can view changes to primary or secondary password for your API for Cassandra account.

:::image type="content" source="./media/monitor-insights/cosmos-db-account-key.png" alt-text="Screenshot showing Azure Cosmos DB rotation key for a API for Cassandra account.":::


## Storage
Storage distribution for raw and index storage. Also a count of documents in the API for Cassandra account.

:::image type="content" source="./media/monitor-insights/data-index-usage.png" alt-text="Diagram showing the document count within a API for Cassandra account.":::

Maximum request units consumption for an account over a defined time period.

:::image type="content" source="./media/monitor-insights/normalized-ru-consumption.png" alt-text="Diagram showing the maximum request unit consumption.":::


## Throughput and requests
The Total Request Units metric displays the requests unit   usage based on operation types. 

These operations can be analyzed within a given time interval, defined keyspace or table.

:::image type="content" source="./media/monitor-insights/total-cassandra-requests.png" alt-text="Screenshot image of a graph showing the total Cassandra requests for an account.":::

:::image type="content" source="./media/monitor-insights/total-request-units.png" alt-text="Screenshot image of a graph showing the total request units for a Cassandra account.":::

The Normalized RU Consumption metric is a metric between 0% to 100% that is used to help measure the utilization of provisioned throughput on a database or container. The metric can also be used to view the utilization of individual partition key ranges on a database or container. One of the main factors of a scalable application is having a good cardinality of partition keys.
The chart below shows if your application’s high RU consumption is because of hot partition.

:::image type="content" source="./media/monitor-insights/normalized-ru-pk-rangeid.png" alt-text="Screenshot showing normalized request unit consumption by partition key range ID.":::

The chart below shows a breakdown of requests by different status code. Understand the meaning of the different codes for your  [API for Cassandra codes](./error-codes-solution.md).

:::image type="content" source="./media/monitor-insights/total-request-by-status-code.png" alt-text="Screenshot image of a graph showing the total request by status code for a cassandra api account.":::


## Next steps
- [Monitor and debug with insights in Azure Cosmos DB](../use-metrics.md)
- [Create alerts for Azure Cosmos DB using Azure Monitor](../create-alerts.md)
