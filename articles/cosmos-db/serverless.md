---
title: Consumption-based serverless offer in Azure Cosmos DB
description: Learn more about Azure Cosmos DB's consumption-based serverless offer.
author: ThomasWeiss
ms.author: thweiss
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/25/2021
---

# Azure Cosmos DB serverless
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

Azure Cosmos DB serverless lets you use your Azure Cosmos account in a consumption-based fashion where you are only charged for the Request Units consumed by your database operations and the storage consumed by your data. Serverless containers can serve thousands of requests per second with no minimum charge and no capacity planning required.

> [!IMPORTANT] 
> Do you have any feedback about serverless? We want to hear it! Feel free to drop a message to the Azure Cosmos DB serverless team: [azurecosmosdbserverless@service.microsoft.com](mailto:azurecosmosdbserverless@service.microsoft.com).

When using Azure Cosmos DB, every database operation has a cost expressed in [Request Units](request-units.md). How you are charged for this cost depends on the type of Azure Cosmos account you are using:

- In [provisioned throughput](set-throughput.md) mode, you have to commit to a certain amount of throughput (expressed in Request Units per second) that is provisioned on your databases and containers. The cost of your database operations is then deducted from the number of Request Units available every second. At the end of your billing period, you get billed for the amount of throughput you have provisioned.
- In serverless mode, you don't have to provision any throughput when creating containers in your Azure Cosmos account. At the end of your billing period, you get billed for the number of Request Units that were consumed by your database operations.

## Use-cases

Azure Cosmos DB serverless best fits scenarios where you expect **intermittent and unpredictable traffic** with long idle times. Because provisioning capacity in such situations isn't required and may be cost-prohibitive, Azure Cosmos DB serverless should be considered in the following use-cases:

- Getting started with Azure Cosmos DB
- Running applications with
    - bursty, intermittent traffic that is hard to forecast, or
    - low (<10%) average-to-peak traffic ratio
- Developing, testing, prototyping and running in production new applications where the traffic pattern is unknown
- Integrating with serverless compute services like [Azure Functions](../azure-functions/functions-overview.md)

See the [how to choose between provisioned throughput and serverless](throughput-serverless.md) article for more guidance on how to choose the offer that best fits your use-case.

## Using serverless resources

Serverless is a new Azure Cosmos account type, which means that you have to choose between **provisioned throughput** and **serverless** when creating a new account. You must create a new serverless account to get started with serverless. Migrating existing accounts to/from serverless mode is not currently supported.

Any container that is created in a serverless account is a serverless container. Serverless containers expose the same capabilities as containers created in provisioned throughput mode, so you read, write and query your data the exact same way. However serverless accounts and containers also have specific characteristics:

- A serverless account can only run in a single Azure region. It is not possible to add additional Azure regions to a serverless account after you create it.
- It is not possible to enable the [Synapse Link feature](synapse-link.md) on a serverless account.
- Provisioning throughput is not required on serverless containers, so the following statements are applicable:
    - You can't pass any throughput when creating a serverless container and doing so returns an error.
    - You can't read or update the throughput on a serverless container and doing so returns an error.
    - You can't create a shared throughput database in a serverless account and doing so returns an error.
- Serverless containers can store a maximum of 50 GB of data and indexes.

## Monitoring your consumption

If you have used Azure Cosmos DB in provisioned throughput mode before, you will find that serverless is more cost-effective when your traffic doesn't justify provisioned capacity. The trade-off is that your costs will become less predictable because you are billed based on the number of requests your database has processed. Because of that, it's important to keep an eye on your current consumption.

When browsing the **Metrics** pane of your account, you will find a chart named **Request Units consumed** under the **Overview** tab. This chart shows how many Request Units your account has consumed:

:::image type="content" source="./media/serverless/request-units-consumed.png" alt-text="Chart showing the consumed Request Units" border="false":::

You can find the same chart when using Azure Monitor, as described [here](monitor-request-unit-usage.md). Note that Azure Monitor lets you setup [alerts](../azure-monitor/alerts/alerts-metric-overview.md), which can be used to notify you when your Request Unit consumption has passed a certain threshold.

## <a id="performance"></a>Performance

Serverless resources yield specific performance characteristics that are different from what provisioned throughput resources deliver. The latency of serverless containers are covered by a Service Level Objective (SLO) of 10 milliseconds or less for point-reads and 30 milliseconds or less for writes. A point-read operation consists in fetching a single item by its ID and partition key value.

## Next steps

Get started with serverless with the following articles:

- [Request Units in Azure Cosmos DB](request-units.md)
- [Choose between provisioned throughput and serverless](throughput-serverless.md)
- [Pricing model in Azure Cosmos DB](how-pricing-works.md)
