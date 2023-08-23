---
title: Change log for Azure Cosmos DB API for MongoDB
description: Notifies our customers of any minor/medium updates that were pushed
author: seesharprun
ms.author: sidandrews
ms.reviewer: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: release-notes
ms.date: 03/28/2023
ms.custom: ignite-2022
---

# Change log for Azure Cosmos DB for MongoDB

The Change log for the API for MongoDB is meant to inform you about our feature updates. This document covers more granular updates and complements [Azure Updates](https://azure.microsoft.com/updates/).

## Azure Cosmos DB for MongoDB updates

### Azure Cosmos DB for MongoDB vCore (with 5.0 support) (Preview)

Azure Cosmos DB for MongoDB vCore supports many new features such as distributed ACID transactions, higher limits for unsharded collections and for shards themselves, improved performance for aggregation pipelines and complex queries, and more.

[Get started now!](./vcore/quickstart-portal.md)

### Role-based access control (RBAC) (GA)

Azure Cosmos DB for MongoDB now offers a built-in role-based access control (RBAC) that allows you to authorize your data requests with a fine-grained, role-based permission model. Using this role-based access control (RBAC) allows you access with more options for control, security, and auditability of your database account data.

[Learn more](./how-to-setup-rbac.md)

### 16-MB limit per document in Cosmos DB for MongoDB (GA)

The 16-MB document limit in Azure Cosmos DB for MongoDB provides developers the flexibility to store more data per document. This ease-of-use feature will speed up your development process and provide you with more flexibility in certain new application and migration cases.

[Learn more](./feature-support-42.md#data-types)

### Azure Data Studio MongoDB extension for Azure Cosmos DB (Preview)

You can now use the free and lightweight tool feature to manage and query your MongoDB resources using mongo shell. Azure Data Studio MongoDB extension for Azure Cosmos DB allows you to manage multiple accounts all in one view by:

1. Connecting your Mongo resources
1. Configuring the database settings
1. Performing create, read, update, and delete (CRUD) across Windows, macOS, and Linux

[Learn more](https://aka.ms/cosmosdb-ads)

### Linux emulator with Azure Cosmos DB for MongoDB

The Azure Cosmos DB Linux emulator with API for MongoDB support provides a local environment that emulates the Azure Cosmos DB service for development purposes on Linux and macOS. Using the emulator, you can develop and test your MongoDB applications locally, without creating an Azure subscription or incurring any costs.

[Learn more](https://aka.ms/linux-emulator-mongo)

### 16-MB limit per document in Azure Cosmos DB for MongoDB (Preview)

The 16-MB document limit in the Azure Cosmos DB for MongoDB provides developers the flexibility to store more data per document. This ease-of-use feature will speed up your development process in these cases.

[Learn more](./introduction.md)

### Azure Cosmos DB for MongoDB data plane Role-Based Access Control (RBAC) (Preview)

Azure Cosmos DB for MongoDB now offers a built-in role-based access control (RBAC) that allows you to authorize your data requests with a fine-grained, role-based permission model. Using this role-based access control (RBAC) allows you access with more options for control, security, and auditability of your database account data.

[Learn more](./how-to-setup-rbac.md)

### Azure Cosmos DB for MongoDB supports version 4.2

The Azure Cosmos DB for MongoDB version 4.2 includes new aggregation functionality and improved security features such as client-side field encryption. These features help you accelerate development by applying the new functionality instead of developing it yourself.

[Learn more](./feature-support-42.md)

### Support $expr in Mongo 3.6+

`$expr` allows the use of [aggregation expressions](https://www.mongodb.com/docs/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions) within the query language.
`$expr` can build query expressions that compare fields from the same document in a `$match` stage.  

[Learn more](https://www.mongodb.com/docs/manual/reference/operator/query/expr/)

### Role-Based Access Control for $merge stage

- Added Role-Based Access Control(RBAC) for `$merge` stage.
- `$merge` writes the results of aggregation pipeline to specified collection. The `$merge` operator must be the last stage in the pipeline

[Learn more](https://www.mongodb.com/docs/manual/reference/operator/aggregation/merge/)

## Next steps

- Learn how to [use Studio 3T](connect-using-mongochef.md) with Azure Cosmos DB for MongoDB.
- Learn how to [use Robo 3T](connect-using-robomongo.md) with Azure Cosmos DB for MongoDB.
- Explore MongoDB [samples](nodejs-console-app.md) with Azure Cosmos DB for MongoDB.
- Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
  - If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md).
  - If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md).
