---
title: Azure Cosmos DB Serverless 1-TB container (preview)
description: Learn more about Serverless 1-TB container.
author: richagaur
ms.author: richagaur
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 12/01/2022
ms.reviewer: dech
---

# Azure Cosmos DB Serverless 1-TB container (preview)

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Azure Cosmos DB serverless 1-TB container (preview) allows you to take advantage of serverless offering with up-to 1 TB of storage size for a container. You can now store up-to 1 TB of data in a serverless container.

## Changes in Request Unit

Azure Cosmos DB serverless 1-TB container provides you 5000 RU/s for a container. However, if your workload increases beyond 250 GB or more than five partitions, whichever is earlier, then the request units grow linearly with number of underlying physical partitions created in the container. Beyond 5 physical partitions, with every addition of a new physical partition, 1000 RU/s are added to the container's maximum throughput capacity.

To understand request unit growth with storage, lets look at the table below.

| Maximum storage | Minimum physical partitions | RU/s per container | RU/s per physical partition  
|:---:|:---:|:---:|:---:| 
|<=50 GB | 1 | 5000 | 5000 |
|<=100 GB | 2 | 5000 | 2500 | 
|<=150 GB | 3 | 5000 | 1666 |
|<=200 GB | 4 | 5000 | 1250 |
|<=250 GB | 5 | 5000 | 1000 |
|<=300 GB | 6 | 6000 | 1000 |
|<=350 GB | 7 | 7000 | 1000 |
|<=400 GB | 8 | 8000 | 1000 |
|.........|...|......|......|
|<= 1 TB  | 20 | 20000| 1000 | 

Note: The request units can increase beyond 20000 RU/s for a serverless 1-TB container if more than 20 partitions are created in the container. It depends on the distribution of logical partition keys in your serverless 1-TB container.

## How to get started

 To get started with serverless 1-TB container, register the *"Azure Cosmos DB Serverless 1 TB Container Preview"* [preview feature in your Azure subscription](../azure-resource-manager/management/preview-features.md). After the request is approved, all existing and future serverless accounts in the subscription will be able to use containers with size up to 1 TB.

:::image type="content" source="media/serverless/enable-1-tb-preview.png" alt-text="Screenshot of serverless 1-TB container in Preview Features page in Subscription overview in Azure portal.":::


To check whether an Azure Cosmos DB account is enabled for the serverless 1-TB container preview, you can use the built-in status checker in the Azure portal. From your Azure Cosmos DB account overview page in the Azure portal, navigate to Diagnose and solve problems -> Account Administration -> Serverless. On this page, you can check the status of preview on your serverless account.

:::image type="content" source="media/serverless/diagnose-and-solve-account-admin.png" alt-text="Screenshot of Diagnose and Solve tab and issue categories in Azure portal.":::

:::image type="content" source="media/serverless/serverless-1tb-status-check.png" alt-text="Screenshot of serverless 1-TB container status check insight in Azure portal.":::

## Next steps

- Learn more about [serverless](serverless.md)
- Learn more about [request units.](request-units.md)
- Trying to decide between provisioned throughput and serverless? See [choose between provisioned throughput and serverless.](throughput-serverless.md)