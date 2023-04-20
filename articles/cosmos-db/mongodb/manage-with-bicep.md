---
title: Create and manage API for MongoDB for Azure Cosmos DB with Bicep
description: Use Bicep to create and configure API for MongoDB Azure Cosmos DB API.
author: seesharprun
ms.service: cosmos-db
ms.subservice: mongodb
ms.custom: ignite-2022, devx-track-bicep
ms.topic: how-to
ms.date: 05/23/2022
ms.author: sidandrews
ms.reviewer: mjbrown
---

# Manage Azure Cosmos DB for MongoDB resources using Bicep

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

In this article, you learn how to use Bicep to deploy and manage your Azure Cosmos DB accounts for API for MongoDB, databases, and collections.

This article shows Bicep samples for API for MongoDB accounts. You can also find Bicep samples for [SQL](../sql/manage-with-bicep.md), [Cassandra](../cassandra/manage-with-bicep.md), [Gremlin](../graph/manage-with-bicep.md), and [Table](../table/manage-with-bicep.md) APIs.

> [!IMPORTANT]
>
> * Account names are limited to 44 characters, all lowercase.
> * To change the throughput values, redeploy the template with updated RU/s.
> * When you add or remove locations to an Azure Cosmos DB account, you can't simultaneously modify other properties. These operations must be done separately.

To create any of the Azure Cosmos DB resources below, copy the following example into a new bicep file. You can optionally create a parameters file to use when deploying multiple instances of the same resource with different names and values. There are many ways to deploy Azure Resource Manager templates including, [Azure CLI](../../azure-resource-manager/bicep/deploy-cli.md), [Azure PowerShell](../../azure-resource-manager/bicep/deploy-powershell.md) and [Cloud Shell](../../azure-resource-manager/bicep/deploy-cloud-shell.md).

<a id="create-autoscale"></a>

## API for MongoDB with autoscale provisioned throughput

This template will create an Azure Cosmos DB account for API for MongoDB (3.2, 3.6, 4.0, or 4.2) with two collections that share autoscale throughput at the database level.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-mongodb-autoscale/main.bicep":::

<a id="create-manual"></a>

## API for MongoDB with standard provisioned throughput

Create an Azure Cosmos DB account for API for MongoDB (3.2, 3.6, 4.0, or 4.2) with two collections that share 400 RU/s standard (manual) throughput at the database level.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-mongodb/main.bicep":::

## Next steps

Here are some additional resources:

* [Bicep documentation](../../azure-resource-manager/bicep/index.yml)
* [Install Bicep tools](../../azure-resource-manager/bicep/install.md)
* Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
  * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md)
  * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)
