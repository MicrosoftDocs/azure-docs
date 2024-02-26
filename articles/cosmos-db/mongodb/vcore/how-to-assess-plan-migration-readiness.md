---
title: Assess for readiness and plan migration
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Assess an existing MongoDB installation to determine if it's suitable for migration to Azure Cosmos DB for MongoDB vCore.
author: sandnair
ms.author: sandnair
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 10/24/2023
# CustomerIntent: As a database owner, I want to assess my existing MongoDB installation so that I can ensure that I can migrate to Azure Cosmos DB for MongoDB vCore.
---

# Assess a MongoDB installation and plan for migration to Azure Cosmos DB for MongoDB vCore

Carry out up-front planning tasks and make critical decisions before migrating your data to Azure Cosmos DB for MongoDB vCore. These decisions make your migration process run smoothly.

## Prerequisites

- An existing Azure Cosmos DB for MongoDB vCore cluster.
  - If you don't have an Azure subscription, [create an account for free](https://azure.microsoft.com/free).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for MongoDB vCore cluster](quickstart-portal.md).
- An existing MongoDB installation.

## Assess the readiness of your resources for migration

Before planning your migration, assess the state of your existing MongoDB resources to help plan for migration. The **discovery** process involves creating a comprehensive list of the existing databases and collections in your MongoDB installation (or data estate).

1. [Azure Cosmos DB Migration for MongoDB extension](/azure-data-studio/extensions/database-migration-for-mongo-extension) in Azure Data Studio to survey your existing databases and collections. List the data that you wish to migrate to API for MongoDB vCore.
1. Use the extension to perform a migration assessment. The assessment determines if your existing databases and collections re using [features and syntax that are supported](compatibility.md) in the API for MongoDB vCore.

## Capacity planning

Plan your target account so that it has enough storage and processing resources to serve your data needs both during and after migration.

> [!TIP]
> Ideally, this step is performed before creating your API for MongoDB vCore account.

1. Ensure that the target API for MongoDB vCore account has enough allocated storage for the data ingestion during migration. If necessary, adjust so that there's enough storage for the incoming data.
1. Ensure your API for MongoDB vCore SKU meets your application's processing and throughput needs.

## Plan migration batches and sequence

Migrations are ideally broken down into batches so they can be performed in a scalable and recoverable way. Use this step to plan for batches that break up your migration workload in a logical manner.

1. Break the migration workload into small batches based on your source and target server capacity.

    > [!IMPORTANT]
    > Do not club large collections with smaller collections.

1. Identify an optimal sequence for migrating your batches of data.

## Firewall configuration

Ensure that your network configuration is correctly configured to perform a migration from your current host to the API for MongoDB vCore.

1. Configure firewall exceptions for your MongoDB host machines to access the API for MongoDB vCore account.
1. Additionally, configure firewall exceptions for any intermediate hosts used during the migration process whether they are on local machines or Azure services.

## Next step

> [!div class="nextstepaction"]
> [Azure Cosmos DB Migration for MongoDB extension](/azure-data-studio/extensions/database-migration-for-mongo-extension)
