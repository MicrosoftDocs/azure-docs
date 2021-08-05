---
title: Resource Manager templates for Azure Cosmos DB API for MongoDB
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB API for MongoDB. 
author: markjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: how-to
ms.date: 10/14/2020
ms.author: mjbrown
---

# Manage Azure Cosmos DB MongoDB API resources using Azure Resource Manager templates
[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

In this article, you learn how to use Azure Resource Manager templates to help deploy and manage your Azure Cosmos DB accounts for MongoDB API, databases, and collections.

This article has examples for Azure Cosmos DB's API for MongoDB only, to find examples for other API type accounts see: use Azure Resource Manager templates with Azure Cosmos DB's API for [Cassandra](cassandra/templates-samples.md), [Gremlin](templates-samples-gremlin.md), [SQL](templates-samples-sql.md), [Table](table/resource-manager-templates.md) articles.

> [!IMPORTANT]
>
> * Account names are limited to 44 characters, all lowercase.
> * To change the throughput values, redeploy the template with updated RU/s.
> * When you add or remove locations to an Azure Cosmos account, you can't simultaneously modify other properties. These operations must be done separately.

To create any of the Azure Cosmos DB resources below, copy the following example template into a new json file. You can optionally create a parameters json file to use when deploying multiple instances of the same resource with different names and values. There are many ways to deploy Azure Resource Manager templates including, [Azure portal](../azure-resource-manager/templates/deploy-portal.md), [Azure CLI](../azure-resource-manager/templates/deploy-cli.md), [Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md) and [GitHub](../azure-resource-manager/templates/deploy-to-azure-button.md).

<a id="create-autoscale"></a>

## Azure Cosmos account for MongoDB with autoscale provisioned throughput

This template will create an Azure Cosmos account for MongoDB API (3.2 or 3.6) with two collections that share autoscale throughput at the database level. This template is also available for one-click deploy from Azure Quickstart Templates Gallery.

[:::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Deploy to Azure":::](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.documentdb%2Fcosmosdb-mongodb-autoscale%2Fazuredeploy.json)

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-mongodb-autoscale/azuredeploy.json":::

<a id="create-manual"></a>

## Azure Cosmos account for MongoDB with standard provisioned throughput

This template will create an Azure Cosmos account for MongoDB API (3.2 or 3.6) with two collections that share 400 RU/s standard (manual) throughput at the database level. This template is also available for one-click deploy from Azure Quickstart Templates Gallery.

[:::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Deploy to Azure":::](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.documentdb%2Fcosmosdb-mongodb%2Fazuredeploy.json)

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-mongodb/azuredeploy.json":::

## Next steps

Here are some additional resources:

* [Azure Resource Manager documentation](../azure-resource-manager/index.yml)
* [Azure Cosmos DB resource provider schema](/azure/templates/microsoft.documentdb/allversions)
* [Azure Cosmos DB Quickstart templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.DocumentDB&pageNumber=1&sort=Popular)
* [Troubleshoot common Azure Resource Manager deployment errors](../azure-resource-manager/templates/common-deployment-errors.md)