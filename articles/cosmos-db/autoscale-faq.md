---
title: Frequently asked questions on autoscale provisioned throughput in Azure Cosmos DB 
description: Frequently asked questions about autoscale provisioned throughput for Azure Cosmos DB databases and containers
author: deborahc
ms.author: dech
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/28/2020
---

# Frequently asked questions about autoscale provisioned throughput in Azure Cosmos DB

With autoscale provisioned throughput, Azure Cosmos DB will automatically manage and scale the RU/s of your container or database based on usage. This article answers commonly asked questions about autoscale.

## Frequently asked questions

### Is autoscale supported for all APIs?
Yes, autoscale is supported for all APIs: Core (SQL), Gremlin, Table, Cassandra, and API for MongoDB.

### Is autoscale supported for multi-master accounts?
Yes, autoscale is supported for multi-master accounts. The max RU/s are available in each region that is added to the Cosmos account. 

### What is the pricing for autoscale ?
Refer to the Azure Cosmos DB [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) for details. 

### How do I enable autoscale for my containers or databases?
Autoscale can be enabled on new containers and databases created using the Azure portal.

### Is there CLI or SDK support to create containers or databases with autoscale provisioned throughput?
Currently, you can only create resources with autoscale provisioned throughput from the Azure portal. Support for CLI and SDK is not yet available.

### Can I enable autoscale on an existing container or a database?
Currently, you can enable autoscale on new containers and databases when creating them. Support to enable autoscale on existing containers and databases is not yet available. You can migrate existing containers to a new container using [Azure Data Factory](../data-factory/connector-azure-cosmos-db.md) or [change feed](change-feed.md). 

### Can I turn off autoscale on a container or database?
Yes, you can turn off autoscale by switching to the 'standard (Manual)' option for the provisioned throughput. In the current release, after switching from autoscale to standard provisioned throughput, you cannot enable autoscale again for the same resource. 

### Is autoscale supported for shared throughput databases?
Yes, autoscale is supported for shared throughput databases. To enable this feature, select autoscale and the **Provision throughput** option when creating the database. 

### What is the number of allowed collections per shared throughput database when autoscale is enabled?
For shared throughput databases with autoscale enabled, the number of allowed collections is: MIN(25, Max RU/s of database / 1000). For example, if the max throughput of the database is 20,000 RU/s, the database can have MIN(25, 20,000 RU/s / 1000) = 20 collections. 


### What is the storage limit associated with each max RU/s option?  
The storage limit in GB for each max RU/s is: Max RU/s of database or container / 100. For example, if the max RU/s is 20,000 RU/s, the resource can support 200 GB of storage. 
See the [autoscale limits](provision-throughput-autoscale.md#autoscale-limits) article for the available max RU/s and storage options. 

### What happens if I exceed the storage limit associated with my max throughput?
If the storage limit associated with the max throughput of the database or container is exceeded, Azure Cosmos DB will automatically increase the max throughput to the next highest tier that can support that level of storage. For example, suppose a database or container is provisioned with the 4000 RU/s max throughput option, which has a storage limit of 50 GB. If the storage of the resource increases to 100 GB, the max RU/s of the database or container will be automatically increased to 20,000 RU/s, which can support up to 200 GB. 

### How quickly will autoscale up and down based on spikes in traffic?
With autoscale, you can instantaneously scale up or scale down the RU/s within the minimum and maximum RU/s range, based on incoming traffic. Billing is done at a 1-hour granularity, where you are charged for the highest RU/s in a particular hour.

### Can I specify a custom max throughput (RU/s) value for autoscale?
Currently, you can select between [four options](provision-throughput-autoscale.md#autoscale-limits) for max throughput (RU/s).

### Can I increase the max RU/s (move to a higher tier) on the database or container? 
Yes. From the **Scale & Settings** option for your container, or **Scale** option for your database, you can select a higher max RU/s for autoscale. This is an asynchronous scale-up operation that may take sometime to complete (typically 4-6 hours, depending on the RU/s selected) as the service provisions more resources to support the higher scale. 

### Can I reduce the max RU/s (move to a lower tier) on the database or container?
Yes. As long as the current storage of the database or container is below the [storage limit](#what-is-the-storage-limit-associated-with-each-max-rus-option) associated with the max RU/s tier you want to scale down to, you can reduce the max RU/s to that tier. For example, if you have selected 20,000 RU/s as the max RU/s, you can scale down the max RU/s to 4000 RU/s if you have less than 50 GB of storage (the storage limit associated with 4000 RU/s).

### What is the mapping between the max RU/s and physical partitions?
When you first select the max RU/s, Azure Cosmos DB will provision: Max RU/s / 10,000 RU/s = # of physical partitions. Each [physical partition](partition-data.md#physical-partitions) can support up to 10,000 RU/s and 50 GB storage. As storage size grows, Azure Cosmos DB will automatically split the partitions to add more physical partitions to handle the storage increase, or increase the max RU/s tier if storage [exceeds the associated limit](#what-is-the-storage-limit-associated-with-each-max-rus-option). 

The Max RU/s of the database or container is divided evenly across all physical partitions. So, the total throughput any single physical partition can scale to is: Max RU/s of database or container / # physical partitions. 

### What happens if incoming requests exceed the max RU/s of the database or container?
If the overall consumed RU/s exceeds the max RU/s of the container or database, requests that exceed the max RU/s will be throttled and return a 429 status code. Requests that result in over 100% normalized utilization will also be throttled. Normalized utilization is defined as the max of the RU/s utilization across all physical partitions. For example, suppose your max throughput is 20,000 RU/s and you have two physical partitions, P_1 and P_2, each capable of scaling to 10,000 RU/s. In a given second, if P_1 has used 6000 RUs, and P_2 8000 RUs, the normalized utilization is MAX(6000 RU / 10,000 RU, 8000 RU / 10,000 RU) = 0.8.

> [!NOTE]
> The Azure Cosmos DB client SDKs and data import tools (Azure Data Factory, bulk executor library) automatically retry on 429s, so occasional 429s are fine. A sustained high number of 429s may indicate you need to increase the max RU/s or review your partitioning strategy for a [hot partition](#autoscale-rate-limiting).

### <a id="autoscale-rate-limiting"></a> Is it still possible to see 429s (throttling/rate limiting) when autoscale is enabled? 
Yes. It is possible to see 429s in two scenarios. First, when the overall consumed RU/s exceeds the max RU/s of the container or database, the service will throttle requests accordingly. 

Second, if there is a hot partition, i.e. a logical partition key value that has a disproportionately higher amount of requests compared to other partition key values, it is possible for the underlying physical partition to exceed its RU/s budget. As a best practice, to avoid hot partitions, [choose a good partition key](partitioning-overview.md#choose-partitionkey) that results in an even distribution of both storage and throughput. 

For example, if you select the 20,000 RU/s max throughput option and have 200 GB of storage, with four physical partitions, each physical partition can be autoscaled up to 5000 RU/s. If there was a hot partition on a particular logical partition key, you will see 429s when the underlying physical partition it resides in exceeds 5000 RU/s, i.e. exceeds 100% normalized utilization.

## Next steps

* Learn how to [enable autoscale on an Azure Cosmos container or database](provision-throughput-autoscale.md#create-db-container-autoscale).
* Learn about the [benefits of provisioned throughput with autoscale ](provision-throughput-autoscale.md#autoscale-benefits).
* Learn more about [logical and physical partitions](partition-data.md).
