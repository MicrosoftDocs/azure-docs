---
title: Change log for Azure Cosmos DB API for MongoDB vcore
description: Notifies our customers of updates pushed to the product
author: avijitgupta
ms.author: avijitgupta
ms.reviewer: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: release-notes
ms.date: 03/07/2024
---

# Change log for Azure Cosmos DB for MongoDB vcore

The Change log for the API for MongoDB is meant to inform you about our feature updates. This document covers more granular updates and complements [Azure Updates](https://azure.microsoft.com/updates/).

## [3 March'24] Enhancements to `Explain` plan & Vector filtering abilities

* Azure Cosmos DB for MongoDB vCore allows filtering by metadata columns while performing vector searches. 
* `Explain` plan now offer different modes
	* allShardsQueryPlan: Introduces a new explain mode to view the query plan for all shards involved in the query execution, offering a comprehensive perspective for distributed queries.
	* allShardsExecution: Presents an another explain mode to inspect the execution details across all shards involved in the query, providing users with comprehensive information for better optimization. 
* Free Tier support added to East US 2
* Ability for building indexes in background (Private Preview)

## Next steps

* Learn how to [use Studio 3T](../connect-using-mongochef.md) with Azure Cosmos DB for MongoDB.
* Learn how to [use Robo 3T](/articles/cosmos-db/mongodb/connect-using-robomongo.md) with Azure Cosmos DB for MongoDB.
* Explore MongoDB [samples](/articles/cosmos-db/mongodb/nodejs-console-app.md) with Azure Cosmos DB for MongoDB.
