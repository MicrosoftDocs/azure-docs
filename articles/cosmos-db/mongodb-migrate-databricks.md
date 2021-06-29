---
title: Migrate MongoDB offline to Azure Cosmos DB API for MongoDB, using Databricks Spark
description: Learn how Databricks Spark can be used to migrate large datasets from MongoDB instances to Azure Cosmos DB
author: Shweta Nayak
ms.author: shwetn
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: how-to
ms.date: 06/29/2021
---
# Migrate data from MongoDB to an Azure Cosmos DB API for MongoDB account by using Azure Databricks
[!INCLUDE[appliesto-mongodb-api](includes/appliesto-mongodb-api.md)]

This MongoDB migration guide is part of series on MongoDB migration. The critical MongoDB migration steps are [pre-migration](mongodb-pre-migration.md), migration, and [post-migration](mongodb-post-migration.md), as shown below.

![Diagram of migration steps.](./media/mongodb-pre-migration/overall-migration-steps.png)


## Overview of data migration using Azure Databricks

[Azure Databricks](https://azure.microsoft.com/services/databricks/) is a platform as a service (PaaS) offering for [Apache Spark](https://spark.apache.org/) that offers a way to perform offline migrations on a large scale. You can use Azure Databricks to perform an offline migration of databases from an on-premises or cloud instance of MongoDB to Azure Cosmos DB's API for MongoDB.

In this tutorial, you learn how to:

- Provision an Azure Databricks cluster

- Add dependencies

- Create and run Scala or Python Notebook to perform the migration

- How to optimize the migration performance

- Troubleshoot rate-limiting errors that may be observed during migration

## Prerequisites

To complete this tutorial, you need to:

- [Complete the pre-migration](mongodb-pre-migration.md) steps such as estimating throughput, choosing a partition key, and the indexing policy.
- [Create an Azure Cosmos DB API for MongoDB account](https://ms.portal.azure.com/#create/Microsoft.DocumentDB).

