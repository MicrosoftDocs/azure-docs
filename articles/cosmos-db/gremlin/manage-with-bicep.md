---
title: Create and manage Azure Cosmos DB for Gremlin with Bicep
description: Use Bicep to create and configure Azure Cosmos DB for Gremlin. 
author: seesharprun
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.custom: ignite-2022, devx-track-bicep
ms.topic: how-to
ms.date: 9/13/2021
ms.author: sidandrews
ms.reviewer: mjbrown
---

# Manage Azure Cosmos DB for Gremlin resources using Bicep

[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

In this article, you learn how to use Bicep to deploy and manage your Azure Cosmos DB for Gremlin accounts, databases, and graphs.

This article shows Bicep samples for API for Gremlin accounts. You can also find Bicep samples for [SQL](../sql/manage-with-bicep.md), [Cassandra](../cassandra/manage-with-bicep.md), [MongoDB](../mongodb/manage-with-bicep.md), and [Table](../table/manage-with-bicep.md) APIs.

> [!IMPORTANT]
>
> * Account names are limited to 44 characters, all lowercase.
> * To change the throughput values, redeploy the template with updated RU/s.
> * When you add or remove locations to an Azure Cosmos DB account, you can't simultaneously modify other properties. These operations must be done separately.

To create any of the Azure Cosmos DB resources below, copy the following example into a new bicep file. You can optionally create a parameters file to use when deploying multiple instances of the same resource with different names and values. There are many ways to deploy Azure Resource Manager templates including, [Azure CLI](../../azure-resource-manager/bicep/deploy-cli.md), [Azure PowerShell](../../azure-resource-manager/bicep/deploy-powershell.md) and [Cloud Shell](../../azure-resource-manager/bicep/deploy-cloud-shell.md).

<a id="create-autoscale"></a>

## API for Gremlin with autoscale provisioned throughput

Create an Azure Cosmos DB account for API for Gremlin with a database and graph with autoscale throughput.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-gremlin-autoscale/main.bicep":::

<a id="create-manual"></a>

## API for Gremlin with standard provisioned throughput

Create an Azure Cosmos DB account for API for Gremlin with a database and graph with standard provisioned throughput.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-gremlin/main.bicep":::

## Next steps

Here are some additional resources:

* [Bicep documentation](../../azure-resource-manager/bicep/index.yml)
* [Install Bicep tools](../../azure-resource-manager/bicep/install.md)
