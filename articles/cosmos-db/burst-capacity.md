---
<<<<<<< HEAD
title: Burst capacity (preview) in Azure Cosmos DB
description: Learn more about burst capacity in Azure Cosmos DB
author: deborahc
ms.author: dech
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/24/2022
---

# Azure Cosmos DB Burst Capacity (preview)
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

Azure Cosmos DB burst capacity (preview) allows you to take advantage of your database or container's idle throughput capacity to handle spikes of traffic. With burst capacity, each physical partition can accumulate up to 5 minutes of idle capacity, which can be consumed at a rate up to 3000 RU/s. This means that requests that would have otherwise been rate limited (429) can now be served with burst capacity while it's available.

Burst capacity applies only to Cosmos accounts using provisioned throughput (manual and autoscale) and doesn't apply to serverless containers. The feature is configured at the Cosmos account level and will automatically apply to all databases and containers in the account that have physical partitions with less than 3000 RU/s of provisioned throughput. Resources that have greater than or equal to 3000 RU/s per physical partition won't benefit from or be able to use burst capacity.
=======
title: Burst capacity in Azure Cosmos DB (preview)
description: Learn more about burst capacity in Azure Cosmos DB
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.topic: conceptual
ms.reviewer: dech
ms.date: 05/09/2022
---

# Burst capacity in Azure Cosmos DB (preview)
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

Azure Cosmos DB burst capacity (preview) allows you to take advantage of your database or container's idle throughput capacity to handle spikes of traffic. With burst capacity, each physical partition can accumulate up to 5 minutes of idle capacity, which can be consumed at a rate up to 3000 RU/s. With burst capacity, requests that would have otherwise been rate limited can now be served with burst capacity while it's available.

Burst capacity applies only to Azure Cosmos DB accounts using provisioned throughput (manual and autoscale) and doesn't apply to serverless containers. The feature is configured at the Azure Cosmos DB account level and will automatically apply to all databases and containers in the account that have physical partitions with less than 3000 RU/s of provisioned throughput. Resources that have greater than or equal to 3000 RU/s per physical partition won't benefit from or be able to use burst capacity.
>>>>>>> upstream/release-cosmosdb-build2022

## How burst capacity works

> [!NOTE]
<<<<<<< HEAD
> This section describes the current implementation of burst capacity and is subject to change in the future. Usage of burst capacity is subject to availability, so if your workload requires consistent throughput beyond what you have provisioned, it's recommended to provision your RU/s accordingly.

Let's take an example of a physical partition that has 100 RU/s of provisioned throughput and is idle for 5 minutes. With burst capacity, it can accumulate a maximum of 100 RU/s * 300 seconds = 30,000 RU of burst capacity. The capacity can be consumed at a maximum rate of 3000 RU/s, so if there's a sudden spike in request volume, the partition can burst up to 3000 RU/s for up 30,000 RU / 3000 RU/s = 10 seconds. Without burst capacity, any requests that consumed beyond the provisioned 100 RU/s would have been rate limited (429).

After the 10 seconds is over, the burst capacity has been used up, so if the workload continues to exceed the provisioned 100 RU/s, requests will be rate limited (429). The maximum amount of burst capacity a physical partition can accumulate at any point in time is equal to 300 seconds * the provisioned RU/s of the container. 


## How to enroll in the preview
To enroll in the preview, file a support ticket in the [Azure portal](https://portal.azure.com/) under the path TBD.

## Frequently asked questions (FAQ)
### How does burst capacity work with autoscale?
Autoscale and burst capacity are compatible. Autoscale gives you a guaranteed instant 10x scale range. Burst capacity allows you to take advantage of unused, idle capacity to handle temporary spikes, potentially beyond your autoscale max RU/s. For example, suppose we have an autoscale container with one physical partition that scales between 100 - 1000 RU/s. Without burst capacity, any requests that consume beyond 1000 RU/s would be rate limited. With burst capacity however, the partition can accumulate a maximum of 1000 RU/s of idle capacity each second. This allows the partition to burst at a maximum rate of 3000 RU/s for a limited amount of time. 

The autoscale max RU/s per physical partition must be less than 3000 RU/s for burst capacity to be applicable.

### What resources can use burst capacity?
When your account is enrolled in the preview, any shared throughput databases or containers with dedicated throughput that have less than 3000 RU/s per physical partition can use burst capacity. The resource can use either manual or autoscale throughput.

### How can I monitor burst capacity?
In Azure Cosmos DB's built-in [Azure Monitor metrics](monitor-cosmos-db.md#analyzing-metrics), you can filter by the dimension **CapacityType** on the **TotalRequests** and **TotalRequestUnits** metrics. Requests served with burst capacity will have **CapacityType** equal to **Burst**.

### How can I see which resources have less than 3000 RU/s per physical partition?
You can use the new Azure Monitor metric **PhysicalPartitionThroughput** and split by the dimension **PhysicalPartitionId** to see how many RU/s you have per physical partition.

## Limitations

### SDK requirements
In the preview, in order to take advantage of burst capacity, your application **must use the latest version of the .NET V3 SDK (version 3.27.0 or later).** When the feature is enabled on your account, only requests sent from this SDK version will be accepted. Other requests will fail. As a result, you should ensure that before enrolling in the preview, your application has been updated to use the right SDK version. If you're using the legacy .NET V2 SDK, follow the guide to [migrate your application to use the Azure Cosmos DB .NET SDK v3](sql/migrate-dotnet-v3.md). Support for other SDKs is planned for the future.

### Unsupported connectors
- Azure Data Factory
- Azure Stream Analytics
- Logic Apps
- Azure Functions
- Azure Search

If you enroll in the preview, requests from the connectors will fail. Support for these connectors is planned for the future.

## Next steps

Learn about how to use provisioned throughput with the following articles:

- [Introduction to provisioned throughput in Azure Cosmos DB](set-throughput.md)
- [Request Units in Azure Cosmos DB](request-units.md)
- [Choose between provisioned throughput and serverless](throughput-serverless.md)
- [Best practices for scaling provisioned throughput (RU/s)](scaling-provisioned-throughput-best-practices.md)
=======
> The current implementation of burst capacity is subject to change in the future. Usage of burst capacity is subject to system resource availability and is not guaranteed. Azure Cosmos DB may also use burst capacity for background maintenance tasks. If your workload requires consistent throughput beyond what you have provisioned, it's recommended to provision your RU/s accordingly without relying on burst capacity.

Let's take an example of a physical partition that has 100 RU/s of provisioned throughput and is idle for 5 minutes. With burst capacity, it can accumulate a maximum of 100 RU/s * 300 seconds = 30,000 RU of burst capacity. The capacity can be consumed at a maximum rate of 3000 RU/s, so if there's a sudden spike in request volume, the partition can burst up to 3000 RU/s for up 30,000 RU / 3000 RU/s = 10 seconds. Without burst capacity, any requests that are consumed beyond the provisioned 100 RU/s would have been rate limited (429).

After the 10 seconds is over, the burst capacity has been used up. If the workload continues to exceed the provisioned 100 RU/s, any requests that are consumed beyond the provisioned 100 RU/s would now be rate limited (429). The maximum amount of burst capacity a physical partition can accumulate at any point in time is equal to 300 seconds * the provisioned RU/s of the physical partition. 

## Getting started

To get started using burst capacity, enroll in the preview by filing a support ticket in the [Azure portal](https://portal.azure.com). 

## Limitations

### SDK requirements (SQL API only)

Burst capacity is supported only in the latest preview version of the .NET v3 SDK. When the feature is enabled on your account, you must only use the supported SDK. Requests sent from other SDKs or earlier versions won't be accepted. There are no driver or SDK requirements to use burst capacity with other APIs.

Find the latest preview version the supported SDK:

| SDK | Supported versions | Package manager link |
| --- | --- | --- |
| **.NET SDK v3** | *>= 3.27.0* | <https://www.nuget.org/packages/Microsoft.Azure.Cosmos/> |

Support for other SDKs is planned for the future.

> [!TIP]
> You should ensure that your application has been updated to use a compatible SDK version prior to enrolling in the preview. If you're using the legacy .NET V2 SDK, follow the [.NET SDK v3 migration guide](sql/migrate-dotnet-v3.md). 

### Unsupported connectors

If you enroll in the preview, the following connectors will fail.

* Azure Data Factory
* Azure Stream Analytics
* Logic Apps
* Azure Functions
* Azure Search

Support for these connectors is planned for the future.

## Next steps

* See the FAQ on [burst capacity.](burst-capacity-faq.yml)
* Learn more about [provisioned throughput.](set-throughput.md)
* Learn more about [request units.](request-units.md)
* Trying to decide between provisioned throughput and serverless? See [choose between provisioned throughput and serverless.](throughput-serverless.md)
* Want to learn the best practices? See [best practices for scaling provisioned throughput.](scaling-provisioned-throughput-best-practices.md)
>>>>>>> upstream/release-cosmosdb-build2022
