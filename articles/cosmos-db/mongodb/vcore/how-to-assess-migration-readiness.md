---
title: Assess for migration readiness
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Assess an existing MongoDB database to determine if it's suitable for migration to Azure Cosmos DB for MongoDB vCore.
author: sandnair
ms.author: sandnair
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: how-to
ms.date: 10/24/2023
# CustomerIntent: As a database owner, I want to assess my existing MongoDB database so that I can ensure that I can migrate to Azure Cosmos DB for MongoDB vCore.
---

# Assess a MongoDB database for migration to Azure Cosmos DB for MongoDB vCore

It's critical to carry out certain up-front planning and decision-making about your migration before you actually move any data.

## Prerequisites

- TODO

## Assess the readiness of your resources for migration

The first step is to discover your existing MongoDB resources and assess the readiness of your resources for migration. Discovery involves creating a comprehensive list of the existing resources (databases or collections) in your MongoDB data estate.

Assessment involves finding out whether you're using the [features and syntax that are supported](./compatibility.md). The [Azure Cosmos DB Migration for MongoDB extension](/azure-data-studio/extensions/database-migration-for-mongo-extension) in Azure Data Studio helps you assess a MongoDB workload for migrating to Azure Cosmos DB for MongoDB.

## Capacity planning

TODO

1. Ensure the target Cosmos DB for Mongo DBvCore account has enough Storage to capacity for the data ingestion during migration.
1. Select a vCore SKU that meets your application needs.

## Plan migration batches and sequence

TODO

1. Break the migration workload into small batches based on your source and target server capacity.
1. It's advised not to club large collections with smaller collections.
1. Identify the desired sequence for migration.

## Firewall Configuration

TODO

1. Ensure the firewall exceptions allow incoming requests from all the host machine(s) and Azure Service(s) that participate in the migration.
1. TODO

## Next step

> [!div class="nextstepaction"]
> [Azure Cosmos DB Migration for MongoDB extension](/azure-data-studio/extensions/database-migration-for-mongo-extension)
