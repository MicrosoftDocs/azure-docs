---
title: Serverless (consumption-based) account type
titleSuffix: Azure Cosmos DB
description: Learn how to use Azure Cosmos DB based on consumption by choosing the serverless account type. Learn how the serverless model compares to the provisioned throughput model.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.custom: event-tier1-build-2022, ignite-2022, build-2023
ms.topic: conceptual
ms.date: 03/16/2023
ms.reviewer: thweiss
---

# Azure Cosmos DB serverless account type

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

For an Azure Cosmos DB pricing option that's based on only the resources that you use, choose the Azure Cosmos DB serverless account type. With the serverless option, you're charged only for the request units (RUs) that your database operations consume and for the storage that your data consumes. Serverless containers can serve thousands of requests per second with no minimum charge and no capacity planning required.

> [!IMPORTANT]
> Do you have any feedback about serverless? We want to hear it! Feel free to drop a message to the Azure Cosmos DB serverless team: [azurecosmosdbserverless@service.microsoft.com](mailto:azurecosmosdbserverless@service.microsoft.com).

Every database operation in Azure Cosmos DB has a cost that's expressed in [RUs](request-units.md). How you're charged for this cost depends on the type of Azure Cosmos DB account you choose:

- **Provisioned throughput**: In the [provisioned throughput](set-throughput.md) account type, you commit to a certain amount of throughput (expressed in RUs per second or *RU/s*) that is provisioned on your databases and containers. The cost of your database operations is then deducted from the number of RUs that are available every second. For each billing period, you're billed for the amount of throughput that you provisioned.
- **Serverless**: In the serverless account type, you don't have to configure provisioned throughput when you create containers in your Azure Cosmos DB account. For each billing period, you're billed for the number of RUs that your database operations consumed.

## Use cases

The Azure Cosmos DB serverless option best fits scenarios in which you expect *intermittent and unpredictable traffic* and long idle times. Because provisioning capacity in these types of scenarios isn't required and might be cost-prohibitive, Azure Cosmos DB serverless should be considered in the following use cases:

- You're getting started with Azure Cosmos DB.
- You're running applications that have one of the following patterns:
  - Bursting, intermittent traffic that is hard to forecast.
  - Low (less than 10 percent) average-to-peak traffic ratio.
- You're developing, testing, prototyping, or offering your users a new application, and you don't yet know the traffic pattern.
- You're integrating with a serverless compute service, like [Azure Functions](../azure-functions/functions-overview.md).

For more information, see [Choose between provisioned throughput and serverless](throughput-serverless.md).

## Use serverless resources

Azure Cosmos DB serverless is a new account type in Azure Cosmos DB. When you create an Azure Cosmos DB account, you choose between *provisioned throughput* and *serverless* options.

To get started with using the serverless model, you must create a new serverless account. Migrating an existing account to or from the serverless model currently isn't supported.

Any container that's created in a serverless account is a serverless container. Serverless containers have the same capabilities as containers that are created in a provisioned throughput account type. You read, write, and query your data exactly the same way. But a serverless account and a serverless container also have other specific characteristics:

- A serverless account can run only in a single Azure region. It isn't possible to add more Azure regions to a serverless account after you create the account.
- Provisioning throughput isn't required on a serverless container, so the following statements apply:
  - You can't pass any throughput when you create a serverless container or an error is returned.
  - You can't read or update the throughput on a serverless container or an error is returned.
  - You can't create a shared throughput database in a serverless account or an error is returned.
- A serverless container can store a maximum of 1 TB of data and indexes.
- A serverless container offers a maximum throughput that ranges from 5,000 RU/s to 20,000 RU/s. The maximum throughput depends on the number of partitions that are available in the container. In the ideal scenario, a 1-TB dataset would require 20,000 RU/s, but the available throughput can exceed this amount. For more information, see [Azure Cosmos DB serverless performance](serverless-performance.md).

## Monitor your consumption

If you've used the Azure Cosmos DB provisioned throughput model before, you might find that the serverless model is more cost-effective when your traffic doesn't justify provisioned capacity. The tradeoff is that your costs become less predictable because you're billed based on the number of requests that your database processes. Because of the lack of predictability when you use the serverless option, it's important to monitor your current consumption.

You can monitor consumption by viewing a chart in your Azure Cosmos DB account in the Azure portal. For your Azure Cosmos DB account, go to the **Metrics** pane. On the **Overview** tab, view the chart that's named **Request Units consumed**. The chart shows how many RUs your account has consumed for different periods of time.

:::image type="content" source="./media/serverless/request-units-consumed.png" alt-text="Screenshot that shows a chart of the consumed request units.":::

You can use the same [chart in Azure Monitor](monitor-request-unit-usage.md). When you use Azure Monitor, you can set up [alerts](../azure-monitor/alerts/alerts-metric-overview.md) so that you're notified when your RU consumption passes a threshold that you set.

## High availability

Azure Cosmos DB serverless extends high availability support with availability zones in [designated regions](https://learn.microsoft.com/azure/reliability/availability-zones-service-support#azure-regions-with-availability-zone-support). The associated Service Level Agreements (SLAs) are aligned with the [Single-region writes with availability zone](https://learn.microsoft.com/azure/cosmos-db/high-availability#slas) configuration, ensuring reliability for your deployments.


## Next steps

To get started with using the serverless pricing option in Azure Cosmos DB, review the following articles:

- [Azure Cosmos DB serverless performance](serverless-performance.md)
- [Choose between provisioned throughput and serverless](throughput-serverless.md)
- [Pricing model in Azure Cosmos DB](how-pricing-works.md)
