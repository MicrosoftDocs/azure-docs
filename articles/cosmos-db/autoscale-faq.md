---
title: Frequently asked questions on autoscale provisioned throughput in Azure Cosmos DB 
description: Frequently asked questions about autoscale provisioned throughput for Azure Cosmos DB databases and containers
author: deborahc
ms.author: dech
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/10/2020
---

# Frequently asked questions about autoscale provisioned throughput in Azure Cosmos DB

With autoscale provisioned throughput, Azure Cosmos DB will automatically manage and scale the RU/s of your database or container based on usage. This article answers commonly asked questions about autoscale.

## Frequently asked questions

### What is the difference between "autopilot" and "autoscale" in Azure Cosmos DB?
"Autoscale" or "autoscale provisioned throughput" is the updated name for the feature, previously known as "autopilot." With the current release of autoscale, we've added new features, including the ability to set custom max RU/s and programmatic support. 

### What happens to databases or containers created in the previous autopilot tier model?
Resources that were created with the previous tier model are automatically supported with the new autoscale custom maximum RU/s model. The upper bound of the tier becomes the new maximum RU/s, which results in the same scale range. 

For example, if you previously selected the tier that scaled between 400 to 4000 RU/s, the database or container will now show as having a maximum RU/s of 4000 RU/s, which scales between 400 to 4000 RU/s. From here, you can change the maximum RU/s to a custom value to suit your workload. 

### How quickly will autoscale scale up and down based on spikes in traffic?
With autoscale, the system scales the throughput (RU/s) `T` up or down within the `0.1 * Tmax` and `Tmax` range, based on incoming traffic. Because the scaling is automatic and instantaneous, at any point in time, you can consume up to the provisioned `Tmax` with no delay. 

### Is autoscale supported for all APIs?
Yes, autoscale is supported for all APIs: Core (SQL), Gremlin, Table, Cassandra, and API for MongoDB.

### Is autoscale  supported for multi-master accounts?
Yes, autoscale is supported for multi-master accounts. The max RU/s are available in each region that is added to the Azure Cosmos DB account. 

### What is the pricing for autoscale?
Refer to the Azure Cosmos DB [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) for details. 

### How do I enable autoscale for my containers or databases?
Autoscale can be currently enabled on new containers and databases created using the Azure portal, the Azure Cosmos DB [.NET V3 SDK](how-to-provision-autoscale-throughput.md#azure-cosmos-db-net-v3-sdk), version 3.9 or higher, or through a [Resource Manager template](manage-sql-with-resource-manager.md#azure-cosmos-account-with-autoscale-throughput).

### Is there Azure CLI or PowerShell support to create containers or databases with autoscale?
Currently, you can only create resources with autoscale from the Azure portal and .NET V3 SDK. Support in Azure CLI, PowerShell, and other SDKs is not yet available.

### Can I enable autoscale on an existing container or a database?
Currently, you can enable autoscale on new containers and databases when creating them. Support to enable autoscale on existing containers and databases is not yet available. You can migrate existing containers to a new container using [Azure Data Factory](../data-factory/connector-azure-cosmos-db.md) or [change feed](change-feed.md). 

### Can I turn off autoscale on a database or container?
Yes, you can turn off autoscale by switching to the 'Standard (Manual)' option for the provisioned throughput. In the current release, after switching from autoscale to standard (manual) provisioned throughput, you cannot enable autoscale again for the same resource. 

### Is autoscale supported for shared throughput databases?
Yes, autoscale is supported for shared throughput databases. To enable this feature, select autoscale and the **Provision throughput** option when creating the database. 

### What is the number of allowed collections per shared throughput database when autoscale is enabled?
For shared throughput databases with autoscale enabled, the number of allowed collections is: MIN(25, Max RU/s of database / 1000). For example, if the max throughput of the database is 20,000 RU/s, the database can have MIN(25, 20,000 RU/s / 1000) = 20 collections. 

### What is the storage limit associated with each max RU/s option?  
The storage limit in GB for each max RU/s is: Max RU/s of database or container / 100. For example, if the max RU/s is 20,000 RU/s, the resource can support 200 GB of storage. 
See the [autoscale limits](provision-throughput-autoscale.md#autoscale-limits) article for the available max RU/s and storage options. 

### What happens if I exceed the storage limit associated with my max throughput?
If the storage limit associated with the max throughput of the database or container is exceeded, Azure Cosmos DB will automatically increase the max throughput to the next highest RU/s that can support that level of storage.

For example, if you start with a max RU/s of 50,000 RU/s (scales between 5000 - 50,000 RU/s), you can store up to 500 GB of data. If you exceed 500 GB - e.g. storage is now 600 GB, the new maximum RU/s will be 60,000 RU/s (scales between 6000 - 60,000 RU/s).

Billing is done at a 1-hour granularity, where you are billed for the highest throughput `T` the system scaled to within the hour. 
### Can I specify a custom max throughput (RU/s) value for autoscale?
Yes. See this [documentation](provision-throughput-autopilot.md#how-autoscale-provisioned-throughput-works) describing how autoscale provisioned throughput works.

### Can I change the max RU/s on the database or container? 
Yes. See this [article](how-to-provision-autoscale-throughput.md) on how to change the max RU/s.

**Increasing the max RU/s**

When you send a request to increase the max RU/s `Tmax`, depending on the requested value `Tmax_new`, this can be an asynchronous  operation that may take some time to complete (typically 4-6 hours, depending on the RU/s selected). 

During this time, the service provisions more resources to support the higher max RU/s. While this is happening, your existing workload and operations will not be affected. The system will continue to scale your database or container between the previous `0.1*Tmax` to `Tmax` until the new scale range of `0.1*Tmax_new` to `Tmax_new` is ready.

**Lowering the max RU/s**

When you lower the max RU/s, the minimum value you can set it to is: `10 * MAX(400, highest max RU/s ever provisioned / 100, current storage in GB * 10)`, rounded to the nearest 1000 RU/s. 

Example #1: Suppose you have an autoscale container with max RU/s of 20,000 RU/s (scales between 2000 - 20,000 RU/s) and 50 GB of storage. The lowest, minimum value you can set max RU/s to is: 10 * MAX(400, 20,000 / 100, **50 * 10**) = 5000 RU/s (scales between 500 - 5000 RU/s). 

Example #2: Suppose you have an autoscale container with max RU/s of 100,000 RU/s and 100 GB of storage. Now, you scale max RU/s up to 150,000 RU/s (scales between 15,000 - 150,000 RU/s). The lowest, minimum value you can now set max RU/s to is: 10 * MAX(400, **150,000 / 100**, 100 * 10) = 15,000 RU/s (scales between 1500 - 15,000 RU/s). 

The above examples relate to the minimum autoscale max RU/s you can set, and is distinct from the `0.1 * Tmax` to `Tmax` range the system automatically scales between. No matter what the max RU/s is, the system will always scale between `0.1 * Tmax` to `Tmax`. 

### How does TTL work with autoscale?
With autoscale, TTL operations do not affect the scaling of RU/s. Any RUs consumed due to TTL are not part of the billed RU/s of the autoscale container. 

For example, suppose you have an autoscale container with 400 – 4000 RU/s:
- Hour 1: T=0: The container has no usage (no TTL or workload requests). The billable RU/s is 400 RU/s.
- Hour 1: T=1: TTL is enabled.
- Hour 1: T=2: The container starts getting requests, which consume 1000 RU in 1 second. There are also 200 RUs worths of TTL that need to happen. 
The billable RU/s is still 1000 RU/s. Regardless of when the TTLs occur, they will not affect the autopilot scaling logic.

### What is the mapping between the max RU/s and physical partitions?
When you first select the max RU/s, Azure Cosmos DB will provision: Max RU/s / 10,000 RU/s = # of physical partitions. Each [physical partition](partition-data.md#physical-partitions) can support up to 10,000 RU/s and 50 GB of storage. As storage size grows, Azure Cosmos DB will automatically split the partitions to add more physical partitions to handle the storage increase, or increase the max RU/s if storage [exceeds the associated limit](#what-is-the-storage-limit-associated-with-each-max-rus-option). 

The Max RU/s of the database or container is divided evenly across all physical partitions. So, the total throughput any single physical partition can scale to is: Max RU/s of database or container / # physical partitions. 

### What happens if incoming requests exceed the max RU/s of the database or container?
If the overall consumed RU/s exceeds the max RU/s of the database or container, requests that exceed the max RU/s will be throttled and return a 429 status code. Requests that result in over 100% normalized utilization will also be throttled. Normalized utilization is defined as the max of the RU/s utilization across all physical partitions. For example, suppose your max throughput is 20,000 RU/s and you have two physical partitions, P_1 and P_2, each capable of scaling to 10,000 RU/s. In a given second, if P_1 has used 6000 RUs, and P_2 8000 RUs, the normalized utilization is MAX(6000 RU / 10,000 RU, 8000 RU / 10,000 RU) = 0.8.

> [!NOTE]
> The Azure Cosmos DB client SDKs and data import tools (Azure Data Factory, bulk executor library) automatically retry on 429s, so occasional 429s are fine. A sustained high number of 429s may indicate you need to increase the max RU/s or review your partitioning strategy for a [hot partition](#autoscale-rate-limiting).

### <a id="autoscale-rate-limiting"></a> Is it still possible to see 429s (throttling/rate limiting) when autoscale is enabled? 
Yes. It is possible to see 429s in two scenarios. First, when the overall consumed RU/s exceeds the max RU/s of the database or container, the service will throttle requests accordingly. 

Second, if there is a hot partition, i.e. a logical partition key value that has a disproportionately higher amount of requests compared to other partition key values, it is possible for the underlying physical partition to exceed its RU/s budget. As a best practice, to avoid hot partitions, [choose a good partition key](partitioning-overview.md#choose-partitionkey) that results in an even distribution of both storage and throughput. 

For example, if you select the 20,000 RU/s max throughput option and have 200 GB of storage, with four physical partitions, each physical partition can be autoscaled up to 5000 RU/s. If there was a hot partition on a particular logical partition key, you will see 429s when the underlying physical partition it resides in exceeds 5000 RU/s, i.e. exceeds 100% normalized utilization.


## Next steps

* Learn how to [enable autoscale on an Azure Cosmos DB database or container](how-to-provision-autoscale-throughput.md).
* Learn about the [benefits of provisioned throughput with autoscale](provision-throughput-autoscale.md#benefits-of-autoscale).
* Learn more about [logical and physical partitions](partition-data.md).
