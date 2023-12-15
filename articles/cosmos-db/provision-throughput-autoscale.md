---
title: Create Azure Cosmos DB containers and databases in autoscale mode.
description: Learn about the benefits, use cases, and how to provision Azure Cosmos DB databases and containers in autoscale mode.
author: kirillg
ms.author: kirillg
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/01/2022
ms.custom: seo-nov-2020, ignite-2022
---

# Create Azure Cosmos DB containers and databases with autoscale throughput
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

In Azure Cosmos DB, you can configure either standard (manual) or autoscale provisioned throughput on your databases and containers. Autoscale provisioned throughput in Azure Cosmos DB allows you to **scale the throughput (RU/s) of your database or container automatically and instantly**. The throughput is scaled based on the usage, without impacting the availability, latency, throughput, or performance of the workload.

Autoscale provisioned throughput is well suited for mission-critical workloads that have variable or unpredictable traffic patterns, and require SLAs on high performance and scale. This article describes the benefits and use cases of autoscale provisioned throughput.

## Benefits of autoscale

Azure Cosmos DB databases and containers that are configured with autoscale provisioned throughput have the following benefits:

* **Simple:** Autoscale removes the complexity of managing RU/s with custom scripting or manually scaling capacity. 

* **Scalable:** Databases and containers automatically scale the provisioned throughput as needed. There is no disruption to client connections, applications, or impact to Azure Cosmos DB SLAs.

* **Cost-effective:** Autoscale helps optimize your RU/s usage and cost usage by scaling down when not in use. You only pay for the resources that your workloads need on a per-hour basis. Of all hours in a month, if you set autoscale max RU/s(Tmax) and use the full amount Tmax for 66% of the hours or less, you'll save with autoscale. To learn more, see the [how to choose between standard (manual) and autoscale provisioned throughput](how-to-choose-offer.md) article.

* **Highly available:** Databases and containers using autoscale use the same globally distributed, fault-tolerant, highly available Azure Cosmos DB backend to ensure data durability and high availability.

## Use cases of autoscale

The use cases of autoscale include:

* **Variable or unpredictable workloads:** When your workloads have variable or unpredictable spikes in usage, autoscale helps by automatically scaling up and down based on usage. Examples include retail websites that have different traffic patterns depending on seasonality; IOT workloads that have spikes at various times during the day; line of business applications that see peak usage a few times a month or year, and more. With autoscale, you no longer need to manually provision for peak or average capacity. 

* **New applications:** If you're developing a new application and not sure about the throughput (RU/s) you need, autoscale makes it easy to get started. You can start with the autoscale entry point of 100 - 1000 RU/s, monitor your usage, and determine the right RU/s over time.

* **Infrequently used applications:** If you have an application that's only used for a few hours several times a day, week, or month — such as a low-volume application/web/blog site — autoscale adjusts the capacity to handle peak usage and scales down when it's over. 

* **Development and test workloads:** If you or your team use Azure Cosmos DB databases and containers during work hours, but don't need them on nights or weekends, autoscale helps save cost by scaling down to a minimum when not in use. 

* **Scheduled production workloads/queries:** If you have a series of scheduled requests, operations, or queries that you want to run during idle periods, you can do that easily with autoscale. When you need to run the workload, the throughput will automatically scale to what's needed and scale down afterward. 

Building a custom solution to these problems not only requires an enormous amount of time, but also introduces complexity in your application's configuration or code. Autoscale enables the above scenarios out of the box and removes the need for custom or manual scaling of capacity. 

## How autoscale provisioned throughput works

When configuring containers and databases with autoscale, you specify the maximum throughput `Tmax` required. Azure Cosmos DB scales the throughput `T` such `0.1*Tmax <= T <= Tmax`. For example, if you set the maximum throughput to 20,000 RU/s, the throughput will scale between 2000 to 20,000 RU/s. Because scaling is automatic and instantaneous, at any point in time, you can consume up to the provisioned `Tmax` with no delay. 

Each hour, you will be billed for the highest throughput `T` the system scaled to within the hour.

The entry point for autoscale maximum throughput `Tmax` starts at 1000 RU/s, which scales between 100 - 1000 RU/s. You can set `Tmax` in increments of 1000 RU/s and change the value at any time.  

## Enable autoscale on existing resources

Use the [Azure portal](how-to-provision-autoscale-throughput.md#enable-autoscale-on-existing-database-or-container), [CLI](how-to-provision-autoscale-throughput.md#azure-cli) or [PowerShell](how-to-provision-autoscale-throughput.md#azure-powershell) to enable autoscale on an existing database or container. You can switch between autoscale and standard (manual) provisioned throughput at any time. See this [documentation](autoscale-faq.yml#how-does-the-migration-between-autoscale-and-standard--manual--provisioned-throughput-work-) for more information.

## <a id="autoscale-limits"></a> Throughput and storage limits for autoscale

For any value of `Tmax`, the database or container can store a total of `0.1 * Tmax GB`. After this amount of storage is reached, the maximum RU/s will be automatically increased based on the new storage value, with no impact to your application. 

For example, if you start with a maximum RU/s of 50,000 RU/s (scales between 5000 - 50,000 RU/s), you can store up to 5000 GB of data. If you exceed 5000 GB - e.g. storage is now 6000 GB, the new maximum RU/s will be 60,000 RU/s (scales between 6000 - 60,000 RU/s).

When you use database level throughput with autoscale, you can have the first 25 containers share an autoscale maximum RU/s of 1000 (scales between 100 - 1000 RU/s), as long as you don't exceed 100 GB of storage. See this [documentation](autoscale-faq.yml#can-i-change-the-maximum-ru-s-on-a-database-or-container--) for more information.

## Comparison – containers configured with manual vs autoscale throughput
For more detail, see this [documentation](how-to-choose-offer.md) on how to choose between standard (manual) and autoscale throughput.  

|| Containers with standard (manual) throughput  | Containers with autoscale throughput |
|---------|---------|---------|
| **Provisioned throughput (RU/s)** | Manually provisioned. | Automatically and instantaneously scaled based on the workload usage patterns. |
| **Rate-limiting of requests/operations (429)**  | May happen, if consumption exceeds provisioned capacity. | Will not happen if you consume RU/s within the autoscale throughput range that you've set.    |
| **Capacity planning** |  You have to do capacity planning and provision the exact throughput you need. |    The system automatically takes care of capacity planning and capacity management. |
| **Pricing** | You pay for the manually provisioned RU/s per hour, using the [standard (manual) RU/s per hour rate](https://azure.microsoft.com/pricing/details/cosmos-db/). | You pay per hour for the highest RU/s the system scaled up to within the hour. <br/><br/> For single write region accounts, you pay for the RU/s used on an hourly basis, using the [autoscale RU/s per hour rate](https://azure.microsoft.com/pricing/details/cosmos-db/). <br/><br/>For accounts with multiple write regions, there is no extra charge for autoscale. You pay for the throughput used on hourly basis using the same [multi-region write RU/s per hour rate](https://azure.microsoft.com/pricing/details/cosmos-db/). |
| **Best suited for workload types** |  Predictable and stable workloads|   Unpredictable and variable workloads  |

## Next steps

* Review the [autoscale FAQ](autoscale-faq.yml).
* Learn how to [choose between manual and autoscale throughput](how-to-choose-offer.md).
* Learn how to [provision autoscale throughput on an Azure Cosmos DB database or container](how-to-provision-autoscale-throughput.md).
* Learn more about [partitioning](partitioning-overview.md) in Azure Cosmos DB.
* Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
