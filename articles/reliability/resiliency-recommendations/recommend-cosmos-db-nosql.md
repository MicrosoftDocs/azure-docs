---
title: Azure resiliency recommendations for Azure Cosmos DB for NoSQL
description: Learn Azure resiliency recommendations for Azure Cosmos DB for NoSQL
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: cosmos-db
ms.date: 5/06/2024 
---


# Azure resiliency recommendations for Azure Cosmos DB for NoSQL

[!INCLUDE [Reliability recommendations](../includes/reliability-recommendations-include.md)]
 
## Resiliency recommendations summary

| Category | Priority |Recommendation |  
|---------------|--------|---|
| [**Availability**](#availability) |:::image type="icon" source="../media/icon-recommendation-high.svg":::| [Configure at least two regions for high availability](#-configure-at-least-two-regions-for-high-availability)|
| [**Disaster recovery**](#disaster-recovery) |:::image type="icon" source="../media/icon-recommendation-high.svg":::| [Enable service-managed failover for multi-region accounts with single write region](#-enable-service-managed-failover-for-multi-region-accounts-with-single-write-region)|
||:::image type="icon" source="../media/icon-recommendation-high.svg":::| [Evaluate multi-region write capability](#-evaluate-multi-region-write-capability)|
||:::image type="icon" source="../media/icon-recommendation-high.svg":::| [Choose appropriate consistency mode reflecting data durability requirements](#-choose-appropriate-consistency-mode-reflecting-data-durability-requirements)|
||:::image type="icon" source="../media/icon-recommendation-high.svg":::| [Configure continuous backup mode](#-configure-continuous-backup-mode)|
|[**System efficiency**](#system-efficiency)|:::image type="icon" source="../media/icon-recommendation-high.svg":::| [Ensure query results are fully drained](#-ensure-query-results-are-fully-drained)|
||:::image type="icon" source="../media/icon-recommendation-medium.svg":::| [Maintain singleton pattern in your client](#-maintain-singleton-pattern-in-your-client)|
|[**Application resilience**](#application-resilience)|:::image type="icon" source="../media/icon-recommendation-medium.svg":::| [Implement retry logic in your client](#-implement-retry-logic-in-your-client)|
|[**Monitoring**](#monitoring)|:::image type="icon" source="../media/icon-recommendation-medium.svg":::| [Monitor Cosmos DB health and set up alerts](#-monitor-cosmos-db-health-and-set-up-alerts)|



### Availability
 
#### :::image type="icon" source="../media/icon-recommendation-high.svg"::: **Configure at least two regions for high availability** 

Azure implements multi-tier isolation approach with rack, DC, zone, and region isolation levels. Cosmos DB is by default highly resilient by running four replicas, but it's still susceptible to failures or issues with entire regions or availability zones. To achieve the highest possible availability, you must add at least one secondary region to the account. Downtime is minimal and adding a region is easy. Cosmos DB instances utilizing Strong consistency need to configure at least three regions to retain zero downtime write availability in case of one failure in a read region.


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/database/cosmosdb/code/cosmos-1/cosmos-1.kql":::

----

### Disaster recovery

#### :::image type="icon" source="../media/icon-recommendation-high.svg"::: **Enable service-managed failover for multi-region accounts with single write region** 

Cosmos DB is a battle-tested service with extremely high uptime and resiliency, but even the most resilient of systems sometimes run into a small hiccup. Should a region become unavailable, the [Service-Managed failover](./reliability-cosmos-db-nosql.md#service-managed-failover) option allows Azure Cosmos DB to be failed over by the service to the next available region with no user action needed.



# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/database/cosmosdb/code/cosmos-2/cosmos-2.kql":::

----


#### :::image type="icon" source="../media/icon-recommendation-high.svg"::: **Evaluate multi-region write capability** 

With multi-region write capability, you can design a multi-region application that's inherently highly available by virtue of being active in multiple regions. Using multi-region write, however, requires that you pay close atention to consistency requirements and handle potential [writes conflicts by way of conflict resolution policy](/azure/cosmos-db/conflict-resolution-policies). On the flip side, blindly enabling this configuration can lead to decreased availability due to unexpected application behavior and data corruption due to unhandled conflicts.

With multi-region write capability, you can design a multi-region application that's inherently highly available by virtue of its active-active configuration in multiple regions. Using multi-region write requires an asynchronous consistency level such as Session or weaker. You must also monitor and handle potential [writes conflicts by way of conflict resolution policy](/azure/cosmos-db/conflict-resolution-policies).

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/database/cosmosdb/code/cosmos-3/cosmos-3.kql":::

----


#### :::image type="icon" source="../media/icon-recommendation-high.svg"::: **Choose appropriate consistency mode reflecting data durability requirements** 

Within a [globally distributed database environment](/azure/cosmos-db/distribute-data-globally), there is a direct relationship between data consistency and data durability should a region-wide outage occur. As you develop your business continuity plan, you need to understand the maximum period of recent data updates the application can tolerate losing when recovering after a disruptive event. We recommend using Session consistency unless you have established that zero data loss (RPO = 0) is required. In this scenario you may use strong consistency. However, you will incur greater write latency, and potentially reduce write availability in a two-region configuration should either region encounter an outage.



#### :::image type="icon" source="../media/icon-recommendation-high.svg"::: **Configure continuous backup mode** 

Cosmos DB automatically [backs up your data](/azure/cosmos-db/continuous-backup-restore-introduction) and there is no way to turn back ups off. In short, you are always protected. But should any mishap occur – a process that went haywire and deleted data it shouldn’t, customer data was overwritten by accident, etc. – minimizing the time it takes to revert the changes is of the essence. With continuous mode, you can self-serve restore your database/collection to a point in time before such mishap occurred. With periodic mode, however, you must contact Microsoft support, which despite us striving to provide speedy help will inevitably increase the restore time.



# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/database/cosmosdb/code/cosmos-5/cosmos-5.kql":::

----

### System efficiency

#### :::image type="icon" source="../media/icon-recommendation-high.svg"::: **Ensure query results are fully drained** 

Cosmos DB limits single response to 4 MB. If your query requests a large amount of data or data from multiple backend partitions, the results will span multiple pages for which separate requests must be issued. Each result page will indicate whether more results are available and provide a continuation token to access the next page. You must include a while loop in your code and traverse the pages until no more results are available. For more information, see [Pagination in Azure Cosmos DB for No SQL](/azure/cosmos-db/nosql/query/pagination#handling-multiple-pages-of-results).



#### :::image type="icon" source="../media/icon-recommendation-medium.svg"::: **Maintain singleton pattern in your client** 


Not only is establishing a new database connection expensive, so is maintaining it. As such, it is critical to maintain only one instance, a so-called “singleton”, of the SDK client per account per application. Connections, both HTTP and TCP, are scoped to the client instance. Most compute environments have limitations in terms of the number of connections that can be open at the same time and when these limits are reached, connectivity will be affected. For more information, see [Designing resilient applications with Azure Cosmos DB SDKs](/azure/cosmos-db/nosql/conceptual-resilient-sdk-applications).


### Application resilience


#### :::image type="icon" source="../media/icon-recommendation-medium.svg"::: **Implement retry logic in your client** 

Cosmos DB SDKs by default handle large number of transient errors and automatically retry operations, where possible. That said, for any application or service that communicates over a network, you should add retry policies for any operations not handled by the SDK. Any scenarios involving writes should also include concurrency checks which can be configured with the SDK. For more information, see [Designing resilient applications with Azure Cosmos DB SDKs](/azure/cosmos-db/nosql/conceptual-resilient-sdk-applications).





### Monitoring

#### :::image type="icon" source="../media/icon-recommendation-medium.svg"::: **Monitor Cosmos DB health and set up alerts** 

It is good practice to monitor the availability and responsiveness of your Azure Cosmos DB resources and [have alerts in place](/azure/cosmos-db/create-alerts) for your workload to stay proactive in case an unforeseen event occurs.

