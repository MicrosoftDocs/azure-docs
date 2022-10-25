---
title: Burst capacity in Azure Cosmos DB (preview)
description: Learn more about burst capacity in Azure Cosmos DB
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.custom: event-tier1-build-2022, ignite-2022
ms.topic: conceptual
ms.reviewer: dech
ms.date: 05/09/2022
---

# Burst capacity in Azure Cosmos DB (preview)
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Azure Cosmos DB burst capacity (preview) allows you to take advantage of your database or container's idle throughput capacity to handle spikes of traffic. With burst capacity, each physical partition can accumulate up to 5 minutes of idle capacity, which can be consumed at a rate up to 3000 RU/s. With burst capacity, requests that would have otherwise been rate limited can now be served with burst capacity while it's available.

Burst capacity applies only to Azure Cosmos DB accounts using provisioned throughput (manual and autoscale) and doesn't apply to serverless containers. The feature is configured at the Azure Cosmos DB account level and will automatically apply to all databases and containers in the account that have physical partitions with less than 3000 RU/s of provisioned throughput. Resources that have greater than or equal to 3000 RU/s per physical partition won't benefit from or be able to use burst capacity.

## How burst capacity works

> [!NOTE]
> The current implementation of burst capacity is subject to change in the future. Usage of burst capacity is subject to system resource availability and is not guaranteed. Azure Cosmos DB may also use burst capacity for background maintenance tasks. If your workload requires consistent throughput beyond what you have provisioned, it's recommended to provision your RU/s accordingly without relying on burst capacity. Before enabling burst capacity, it is also recommended to evaluate if your partition layout can be [merged](merge.md) to permanently give more RU/s per physical partition without relying on burst capacity.

Let's take an example of a physical partition that has 100 RU/s of provisioned throughput and is idle for 5 minutes. With burst capacity, it can accumulate a maximum of 100 RU/s * 300 seconds = 30,000 RU of burst capacity. The capacity can be consumed at a maximum rate of 3000 RU/s, so if there's a sudden spike in request volume, the partition can burst up to 3000 RU/s for up 30,000 RU / 3000 RU/s = 10 seconds. Without burst capacity, any requests that are consumed beyond the provisioned 100 RU/s would have been rate limited (429).

After the 10 seconds is over, the burst capacity has been used up. If the workload continues to exceed the provisioned 100 RU/s, any requests that are consumed beyond the provisioned 100 RU/s would now be rate limited (429). The maximum amount of burst capacity a physical partition can accumulate at any point in time is equal to 300 seconds * the provisioned RU/s of the physical partition. 

## Getting started

To get started using burst capacity, enroll in the preview by submitting a request for the **Azure Cosmos DB Burst Capacity** feature via the [**Preview Features** page](../azure-resource-manager/management/preview-features.md) in your Azure Subscription overview page. You can also select the **Register for preview** button in the eligibility check page to open the **Preview Features** page. 

Before submitting your request:
- Ensure that you have at least 1 Azure Cosmos DB account in the subscription. This may be an existing account or a new one you've created to try out the preview feature. If you have no accounts in the subscription when the Azure Cosmos DB team receives your request, it will be declined, as there are no accounts to apply the feature to.
- Verify that your Azure Cosmos DB account(s) meet all the [preview eligibility criteria](#preview-eligibility-criteria).

The Azure Cosmos DB team will review your request and contact you via email to confirm which account(s) in the subscription you want to enroll in the preview.

To check whether an Azure Cosmos DB account is eligible for the preview, you can use the built-in eligibility checker in the Azure portal. From your Azure Cosmos DB account overview page in the Azure portal, navigate to **Diagnose and solve problems** -> **Throughput and Scaling** ->  **Burst Capacity**. Run the **Check eligibility for burst capacity preview** diagnostic.

:::image type="content" source="media/burst-capacity/throughput-and-scaling-category.png" alt-text="Throughput and Scaling topic in Diagnose and solve issues page":::

:::image type="content" source="media/burst-capacity/burst-capacity-eligibility-check.png" alt-text="Burst capacity eligibility check with table of all preview eligibility criteria":::

## Limitations

### Preview eligibility criteria
To enroll in the preview, your Azure Cosmos DB account must meet all the following criteria:
  - Your Azure Cosmos DB account is using provisioned throughput (manual or autoscale). Burst capacity doesn't apply to serverless accounts.
  - If you're using API for NoSQL, your application must use the Azure Cosmos DB .NET V3 SDK, version 3.27.0 or higher. When burst capacity is enabled on your account, all requests sent from non .NET SDKs, or older .NET SDK versions won't be accepted.
    - There are no SDK or driver requirements to use the feature with API for Cassandra, Gremlin, or MongoDB.
  - Your Azure Cosmos DB account isn't using any unsupported connectors
    - Azure Data Factory
    - Azure Stream Analytics
    - Logic Apps
    - Azure Functions
    - Azure Search
    - Azure Cosmos DB Spark connector
    - Azure Cosmos DB data migration tool
    - Any 3rd party library or tool that has a dependency on an Azure Cosmos DB SDK that is not .NET V3 SDK v3.27.0 or higher

### SDK requirements (API for NoSQL and Table only)
#### API for NoSQL
For API for NoSQL accounts, burst capacity is supported only in the latest version of the .NET v3 SDK. When the feature is enabled on your account, you must only use the supported SDK. Requests sent from other SDKs or earlier versions won't be accepted. There are no driver or SDK requirements to use burst capacity with API for Gremlin, Cassandra, or MongoDB.

Find the latest version of the supported SDK:

| SDK | Supported versions | Package manager link |
| --- | --- | --- |
| **.NET SDK v3** | *>= 3.27.0* | <https://www.nuget.org/packages/Microsoft.Azure.Cosmos/> |

Support for other API for NoSQL SDKs is planned for the future.

> [!TIP]
> You should ensure that your application has been updated to use a compatible SDK version prior to enrolling in the preview. If you're using the legacy .NET V2 SDK, follow the [.NET SDK v3 migration guide](sql/migrate-dotnet-v3.md). 

#### Table  API
For API for Table accounts, burst capacity is supported only when using the latest version of the Tables SDK. When the feature is enabled on your account, you must only use the supported SDK. Requests sent from other SDKs or earlier versions won't be accepted. The legacy SDK with namespace `Microsoft.Azure.CosmosDB.Table` isn't supported. Follow the [migration guide](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/tables/Azure.Data.Tables/MigrationGuide.md) to upgrade to the latest SDK.

| SDK | Supported versions | Package manager link |
| --- | --- | --- |
| **Azure Tables client library for .NET** | *>= 12.0.0* | <https://www.nuget.org/packages/Azure.Data.Tables/> |
| **Azure Tables client library for Java** | *>= 12.0.0* | <https://mvnrepository.com/artifact/com.azure/azure-data-tables> |
| **Azure Tables client library for JavaScript** | *>= 12.0.0* | <https://www.npmjs.com/package/@azure/data-tables> |
| **Azure Tables client library for Python** | *>= 12.0.0* | <https://pypi.org/project/azure-data-tables/> |

### Unsupported connectors

If you enroll in the preview, the following connectors will fail.

* Azure Data Factory<sup>1</sup>
* Azure Stream Analytics<sup>1</sup>
* Logic Apps<sup>1</sup>
* Azure Functions<sup>1</sup>
* Azure Search<sup>1</sup>
* Azure Cosmos DB Spark connector<sup>1</sup>
* Azure Cosmos DB data migration tool
* Any 3rd party library or tool that has a dependency on an Azure Cosmos DB SDK that is not .NET V3 SDK v3.27.0 or higher

<sup>1</sup>Support for these connectors is planned for the future.

## Next steps

* See the FAQ on [burst capacity.](burst-capacity-faq.yml)
* Learn more about [provisioned throughput.](set-throughput.md)
* Learn more about [request units.](request-units.md)
* Trying to decide between provisioned throughput and serverless? See [choose between provisioned throughput and serverless.](throughput-serverless.md)
* Want to learn the best practices? See [best practices for scaling provisioned throughput.](scaling-provisioned-throughput-best-practices.md)
