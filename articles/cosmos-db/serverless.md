---
title: Azure Cosmos DB serverless
description: Learn more about Azure Cosmos DB's consumption-based serverless offer.
author: ThomasWeiss
ms.author: thweiss
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 08/13/2020
---

# Azure Cosmos DB serverless (Preview)

Azure Cosmos DB serverless lets you use your Azure Cosmos account in a real consumption-based fashion where you only get charged for the Request Units consumed by your database operations and the storage consumed by your data. There is no minimum charge involved when using Azure Cosmos DB in serverless mode as it eliminates the concept of provisioned capacity.

> [!IMPORTANT] 
> Got any feedback about serverless? We want to hear it! Feel free to drop a line to the Azure Cosmos DB team: [azurecosmosdbserverless@service.microsoft.com](mailto:azurecosmosdbserverless@service.microsoft.com).

When using Azure Cosmos DB, any database operation has an associated cost expressed in [Request Units](request-units.md). How this cost is charged to you depends on the type of Azure Cosmos account you are using:

- In [provisioned throughput](set-throughput.md) mode, you have to commit to some amount of throughput (expressed in Request Units per second) that will be provisioned for your databases and containers. The cost of your database operations is then deducted from the amount of Request Units available every second. At the end of your billing period, you get billed for the amount of throughput you have provisioned.
- In serverless mode, you don't have to provision any throughput when creating containers in your Azure Cosmos account. At the end of your billing period, you get billed for the amount of Request Units that has been consumed by your database operations.

## Use-cases

Azure Cosmos DB serverless best fits scenarios where you expect:

- **light traffic**, because provisioning capacity in such situations isn't required and may be cost-prohibitive
- **moderate burstability**, because serverless containers can deliver up to 5,000 Request Units per second
- **moderate performance**, because serverless containers have [specific performance characteristics](#performance)

For these reasons, Azure Cosmos DB serverless should be considered for the following types of workload:

- Development
- Testing
- Prototyping
- Proofs-of-concept
- Non-critical applications with light traffic

See [this page](how-to-choose-offer.md) for further guidance on how to choose the offer that best fits your use-case.

## Using serverless resources

Serverless is a new Azure Cosmos account type, which means that you have to choose between **provisioned throughput** and **serverless** when creating a new account. This also means that you have to create a new serverless account to get started with serverless. During preview, the only supported way to create a new serverless account is by [using the Azure portal](create-cosmosdb-resources-portal.md).

> [!NOTE]
> The Cassandra API is currently not supported, so creating a serverless Cassandra API account is not possible at the moment. This will be supported in the very near future.

Any container created in a serverless account is a serverless container. Serverless containers expose the same capabilities as containers created in provisioned throughput mode so you read, write and query your data the exact same way. But serverless accounts and containers also have specific characteristics:

- A serverless account can only run in a single Azure region and it is not possible to add additional Azure regions to a serverless account after it has been created
- It is not possible to enable the [Synapse Link preview](synapse-link.md) on a serverless account
- You don't provision any throughput on serverless containers, so
    - You can't pass any throughput when creating a serverless container and doing so returns an error
    - You can't read or update the throughput on a serverless container and doing so returns an error
- The concept of shared throughput databases doesn't exist in serverless accounts and trying to create such a database in a serverless account returns an error
- Serverless containers can deliver a maximum burstability of 5,000 Request Units per second
- Serverless containers can store a maximum of 50 GB of data (index included)

> [!IMPORTANT]
> Some of these limitations may be eased or removed when serverless becomes generally available and **your feedback** will help us decide! Reach out and tell us more about your serverless experience: [azurecosmosdbserverless@service.microsoft.com](mailto:azurecosmosdbserverless@service.microsoft.com).

## Monitoring your consumption

If you have used Azure Cosmos DB in provisioned throughput mode before, you will find that serverless is more cost-effective when your traffic doesn't justify provisioned capacity. The trade-off is that your costs will become less predictable as the amount you will get billed directly depends on the number of requests your database will have processed. Because of that, it's important to keep an eye of your current consumption.

When browsing the **Metrics** pane of your account, you will find a chart named **Request Units consumed** under the **Overview** tab. This chart shows how many Request Units your account has consumed:

:::image type="content" source="./media/serverless/request-units-consumed.png" alt-text="Chart showing the consumed Request Units" border="false":::

You can find the same chart when using Azure Monitor, as described [here](monitor-request-unit-usage.md). Note that Azure Monitor lets you setup [alerts](../azure-monitor/platform/alerts-metric-overview.md), which can be used to notify you when your Request Unit consumption has passed a certain threshold.

## <a id="performance"></a>Performance

Serverless resources yield specific performance characteristics that are different from what provisioned throughput resources deliver:

- **Availability**: When generally available, the availability of serverless containers will be covered by a Service Level Agreement (SLA) of 99.9% when Availability Zones (zone redundancy) aren't used, or 99.99% when Availability Zones are used.
- **Latency**: When generally available, the latency of serverless containers will be covered by a Service Level Objective (SLO) of 10 milliseconds or less for "point-reads" (fetching a single item by its ID and partition key value) and 30 milliseconds or less for writes.
- **Burstability**: When generally available, the burstability of serverless containers will be covered by a Service Level Objective (SLO) of 95% (which means that the maximum burstability can be attained at least 95% of the time).

> [!NOTE]
> As any Azure preview, Azure Cosmos DB serverless is excluded from Service Level Agreements (SLA). The performance characteristics mentioned above are provided as a preview of what this offer will deliver when generally available.

## Next steps

Get started with serverless with the following articles:

- [Request Units in Azure Cosmos DB](request-units.md)
- [Choose between provisioned throughput and serverless](throughput-vs-serverless.md)
- [Pricing model in Azure Cosmos DB](how-pricing-works.md)
