---
title: Resiliency recommendations for Azure Cosmos DB for NoSQL
description: Learn about resiliency recommendations for Azure Cosmos DB for NoSQL
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions, resiliency-recommendations
ms.service: cosmos-db
ms.date: 5/06/2024 
---


# Resiliency recommendations for Azure Cosmos DB for NoSQL

This article contains recommendations for achieving resiliency for Azure Cosmos DB for NoSQL.  Many of the recommendations contain supporting Azure Resource Graph (ARG) queries to help identify non-compliant resources.

## Resiliency recommendations impact matrix

Each recommendation is marked in accordance with the following impact matrix:

| Image | Impact | Description
|----|----|----|
|:::image type="icon" source="../media/icon-recommendation-high.svg"::: |High|Immediate fix needed.|
|:::image type="icon" source="../media/icon-recommendation-medium.svg":::|Medium|Fix within 3-6 months.|
|:::image type="icon" source="../media/icon-recommendation-low.svg":::|Low|Needs to be reviewed.|

 
## Resiliency recommendations summary

| Category | Priority |Recommendation | 
|---------------|--------|---|
| [**Availability**](#availability) |:::image type="icon" source="../media/icon-recommendation-high.svg":::| [Configure at least two regions for high availability](#-configure-at-least-two-regions-for-high-availability)|
| [**Disaster recovery**](#disaster-recovery) |:::image type="icon" source="../media/icon-recommendation-high.svg":::| [Enable service-managed failover for multi-region accounts with single write region](#-enable-service-managed-failover-for-multi-region-accounts-with-single-write-region)|
||:::image type="icon" source="../media/icon-recommendation-high.svg":::| [Evaluate multi-region write capability](#-evaluate-multi-region-write-capability)|
|| :::image type="icon" source="../media/icon-recommendation-high.svg"::: | [Choose appropriate consistency mode reflecting data durability requirements](#-choose-appropriate-consistency-mode-reflecting-data-durability-requirements)|
||:::image type="icon" source="../media/icon-recommendation-high.svg":::| [Configure continuous backup mode](#-configure-continuous-backup-mode)|
|[**System efficiency**](#system-efficiency)|:::image type="icon" source="../media/icon-recommendation-high.svg":::| [Ensure query results are fully drained](#-ensure-query-results-are-fully-drained)|
||:::image type="icon" source="../media/icon-recommendation-medium.svg":::| [Maintain singleton pattern in your client](#-maintain-singleton-pattern-in-your-client)|
|[**Application resilience**](#application-resilience)|:::image type="icon" source="../media/icon-recommendation-medium.svg":::| [Implement retry logic in your client](#-implement-retry-logic-in-your-client)|
|[**Monitoring**](#monitoring)|:::image type="icon" source="../media/icon-recommendation-medium.svg":::| [Monitor Cosmos DB health and set up alerts](#-monitor-cosmos-db-health-and-set-up-alerts)|



### Availability
 
#### :::image type="icon" source="../media/icon-recommendation-high.svg"::: **Configure at least two regions for high availability** 

It's crucial to enable a secondary region on your Cosmos DB to achieve higher SLA. Doing so doesn't incur any downtime and it's as easy as selecting a pin on map. Cosmos DB instances utilizing Strong consistency need to configure at least three regions to retain write availability if there is one region failure.

**Potential benefits:** Enhances SLA and resilience.

**Learn more:** [Reliability (High availability) in Cosmos DB for No SQL](../reliability-cosmos-db-nosql.md)


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/database/cosmosdb/code/cosmos-1/cosmos-1.kql":::

----

### Disaster recovery

#### :::image type="icon" source="../media/icon-recommendation-high.svg"::: **Enable service-managed failover for multi-region accounts with single write region** 

Cosmos DB boasts high uptime and resiliency. Even so, issues may arise. With [Service-Managed failover](../reliability-cosmos-db-nosql.md#service-managed-failover), if a region is down, Cosmos DB automatically switches to the next available region, requiring no user action.


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/database/cosmosdb/code/cosmos-2/cosmos-2.kql":::

----


#### :::image type="icon" source="../media/icon-recommendation-high.svg"::: **Evaluate multi-region write capability** 

Multi-region write capability allows for designing applications that are highly available across multiple regions, though it demands careful attention to consistency requirements and conflict resolution. Improper setup may decrease availability and cause data corruption due to unhandled conflicts.

**Potential benefits:** Enhances high availability.

**Learn more:**  
- [Distribute your data globally with Azure Cosmos DB](/azure/cosmos-db/distribute-data-globally)
- [Conflict types and resolution policies when using multiple write regions](/azure/cosmos-db/conflict-resolution-policies)



# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/database/cosmosdb/code/cosmos-3/cosmos-3.kql":::

----

#### :::image type="icon" source="../media/icon-recommendation-high.svg"::: **Choose appropriate consistency mode reflecting data durability requirements** 

In a globally distributed database, consistency level impacts data durability during regional outages. Understand data loss tolerance for recovery planning. Use Session consistency unless stronger is needed, accepting higher write latencies and potential write region impact from read-only outages.

**Potential benefits:** Enhances data durability and recovery.

**Learn more:**  [Consistency levels in Azure Cosmos DB](/azure/cosmos-db/consistency-levels)




#### :::image type="icon" source="../media/icon-recommendation-high.svg"::: **Configure continuous backup mode** 


Cosmos DB's backup is always on, offering protection against data mishaps. Continuous mode allows for self-serve restoration to a pre-mishap point, unlike periodic mode, which requires contacting Microsoft support, leading to longer restore times.


**Potential Benefits:** Faster self-serve data restore.

**Learn more:** [Continuous backup with point in time restore feature in Azure Cosmos DB](/azure/cosmos-db/continuous-backup-restore-introduction)

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/database/cosmosdb/code/cosmos-5/cosmos-5.kql":::

----

### System efficiency

#### :::image type="icon" source="../media/icon-recommendation-high.svg"::: **Ensure query results are fully drained** 

Cosmos DB has a 4 MB response limit, leading to paginated results for large or partition-spanning queries. Each page shows availability and provides a continuation token for the next. A while loop in code is necessary to traverse all pages until completion.


**Potential Benefits:** Maximizes data retrieval efficiency.

**Learn more:**  [Pagination in Azure Cosmos DB for No SQL](/azure/cosmos-db/nosql/query/pagination#handling-multiple-pages-of-results).



#### :::image type="icon" source="../media/icon-recommendation-medium.svg"::: **Maintain singleton pattern in your client** 


Using a single instance of the SDK client for each account and application is crucial as connections are tied to the client. Compute environments have a limit on open connections, affecting connectivity when exceeded.



**Potential Benefits:** Optimizes connections and efficiency.

**Learn more:** [Designing resilient applications with Azure Cosmos DB SDKs](/azure/cosmos-db/nosql/conceptual-resilient-sdk-applications).


### Application resilience


#### :::image type="icon" source="../media/icon-recommendation-medium.svg"::: **Implement retry logic in your client** 

Cosmos DB SDKs automatically manage many transient errors through retries. Despite this, it's crucial for applications to implement additional retry policies targeting specific cases that the SDKs can't generically address, ensuring more robust error handling.

**Potential Benefits:** Enhances error handling resilience.

**Learn more:** [Designing resilient applications with Azure Cosmos DB SDKs](/azure/cosmos-db/nosql/conceptual-resilient-sdk-applications).





### Monitoring

#### :::image type="icon" source="../media/icon-recommendation-medium.svg"::: **Monitor Cosmos DB health and set up alerts** 

Monitoring the availability and responsiveness of Azure Cosmos DB resources and having alerts set up for your workload is a good practice. This ensures you stay proactive in handling unforeseen events.

**Potential Benefits:** Proactive issue management.

**Learn more:** [Create alerts for Azure Cosmos DB using Azure Monitor](/azure/cosmos-db/create-alerts) 
