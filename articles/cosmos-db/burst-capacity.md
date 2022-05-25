---
title: Burst capacity in Azure Cosmos DB (preview)
description: Learn more about burst capacity in Azure Cosmos DB
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.custom: event-tier1-build-2022
ms.topic: conceptual
ms.reviewer: dech
ms.date: 05/09/2022
---

# Burst capacity in Azure Cosmos DB (preview)
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

Azure Cosmos DB burst capacity (preview) allows you to take advantage of your database or container's idle throughput capacity to handle spikes of traffic. With burst capacity, each physical partition can accumulate up to 5 minutes of idle capacity, which can be consumed at a rate up to 3000 RU/s. With burst capacity, requests that would have otherwise been rate limited can now be served with burst capacity while it's available.

Burst capacity applies only to Azure Cosmos DB accounts using provisioned throughput (manual and autoscale) and doesn't apply to serverless containers. The feature is configured at the Azure Cosmos DB account level and will automatically apply to all databases and containers in the account that have physical partitions with less than 3000 RU/s of provisioned throughput. Resources that have greater than or equal to 3000 RU/s per physical partition won't benefit from or be able to use burst capacity.

## How burst capacity works

> [!NOTE]
> The current implementation of burst capacity is subject to change in the future. Usage of burst capacity is subject to system resource availability and is not guaranteed. Azure Cosmos DB may also use burst capacity for background maintenance tasks. If your workload requires consistent throughput beyond what you have provisioned, it's recommended to provision your RU/s accordingly without relying on burst capacity.

Let's take an example of a physical partition that has 100 RU/s of provisioned throughput and is idle for 5 minutes. With burst capacity, it can accumulate a maximum of 100 RU/s * 300 seconds = 30,000 RU of burst capacity. The capacity can be consumed at a maximum rate of 3000 RU/s, so if there's a sudden spike in request volume, the partition can burst up to 3000 RU/s for up 30,000 RU / 3000 RU/s = 10 seconds. Without burst capacity, any requests that are consumed beyond the provisioned 100 RU/s would have been rate limited (429).

After the 10 seconds is over, the burst capacity has been used up. If the workload continues to exceed the provisioned 100 RU/s, any requests that are consumed beyond the provisioned 100 RU/s would now be rate limited (429). The maximum amount of burst capacity a physical partition can accumulate at any point in time is equal to 300 seconds * the provisioned RU/s of the physical partition. 

## Getting started

To get started using burst capacity, enroll in the preview by submitting a request for the **Azure Cosmos DB Burst Capacity** feature via the [**Preview Features** page](../azure-resource-manager/management/preview-features.md) in your Azure Subscription overview page.
- Before submitting your request, verify that your Azure Cosmos DB account(s) meet all the [preview eligibility criteria](#preview-eligibility-criteria).
- The Azure Cosmos DB team will review your request and contact you via email to confirm which account(s) in the subscription you want to enroll in the preview.

## Limitations

### Preview eligibility criteria
To enroll in the preview, your Cosmos account must meet all the following criteria:
  - Your Cosmos account is using provisioned throughput (manual or autoscale). Burst capacity doesn't apply to serverless accounts.
  - If you're using SQL API, your application must use the Azure Cosmos DB .NET V3 SDK, version 3.27.0 or higher. When burst capacity is enabled on your account, all requests sent from non .NET SDKs, or older .NET SDK versions won't be accepted.
    - There are no SDK or driver requirements to use the feature with Cassandra API, Gremlin API, Table API, or API for MongoDB.
  - Your Cosmos account isn't using any unsupported connectors
    - Azure Data Factory
    - Azure Stream Analytics
    - Logic Apps
    - Azure Functions
    - Azure Search

### SDK requirements (SQL and Table API only)
#### SQL API
For SQL API accounts, burst capacity is supported only in the latest version of the .NET v3 SDK. When the feature is enabled on your account, you must only use the supported SDK. Requests sent from other SDKs or earlier versions won't be accepted. There are no driver or SDK requirements to use burst capacity with Gremlin API, Cassandra API, or API for MongoDB.

Find the latest version of the supported SDK:

| SDK | Supported versions | Package manager link |
| --- | --- | --- |
| **.NET SDK v3** | *>= 3.27.0* | <https://www.nuget.org/packages/Microsoft.Azure.Cosmos/> |

Support for other SQL API SDKs is planned for the future.

> [!TIP]
> You should ensure that your application has been updated to use a compatible SDK version prior to enrolling in the preview. If you're using the legacy .NET V2 SDK, follow the [.NET SDK v3 migration guide](sql/migrate-dotnet-v3.md). 

#### Table  API
For Table API accounts, burst capacity is supported only when using the latest version of the Tables SDK. When the feature is enabled on your account, you must only use the supported SDK. Requests sent from other SDKs or earlier versions won't be accepted. The legacy SDK with namespace `Microsoft.Azure.CosmosDB.Table` isn't supported. Follow the [migration guide](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/tables/Azure.Data.Tables/MigrationGuide.md) to upgrade to the latest SDK.

| SDK | Supported versions | Package manager link |
| --- | --- | --- |
| **Azure Tables client library for .NET** | *>= 12.0.0* | <https://www.nuget.org/packages/Azure.Data.Tables/> |
| **Azure Tables client library for Java** | *>= 12.0.0* | <https://mvnrepository.com/artifact/com.azure/azure-data-tables> |
| **Azure Tables client library for JavaScript** | *>= 12.0.0* | <https://www.npmjs.com/package/@azure/data-tables> |
| **Azure Tables client library for Python** | *>= 12.0.0* | <https://pypi.org/project/azure-data-tables/> |

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
