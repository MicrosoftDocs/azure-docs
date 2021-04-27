---
title: Create and manage Azure Cosmos DB with Resource Manager templates
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB for Core (SQL) API 
author: markjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: how-to
ms.date: 03/24/2021
ms.author: mjbrown
---

# Manage Azure Cosmos DB Core (SQL) API resources with Azure Resource Manager templates

[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

In this article, you learn how to use Azure Resource Manager templates to help deploy and manage your Azure Cosmos DB accounts, databases, and containers.

This article only shows Azure Resource Manager template examples for Core (SQL) API accounts. You can also find template examples for [Cassandra](templates-samples-cassandra.md), [Gremlin](templates-samples-gremlin.md), [MongoDB](templates-samples-mongodb.md), and [Table](templates-samples-table.md) APIs.

> [!IMPORTANT]
>
> * Account names are limited to 44 characters, all lowercase.
> * To change the throughput values, redeploy the template with updated RU/s.
> * When you add or remove locations to an Azure Cosmos account, you can't simultaneously modify other properties. These operations must be done separately.
> * Azure Cosmos DB resources cannot be renamed as this violates how Azure Resource Manager works with resource URIs.

To create any of the Azure Cosmos DB resources below, copy the following example template into a new json file. You can optionally create a parameters json file to use when deploying multiple instances of the same resource with different names and values. There are many ways to deploy Azure Resource Manager templates including, [Azure portal](../azure-resource-manager/templates/deploy-portal.md), [Azure CLI](../azure-resource-manager/templates/deploy-cli.md), [Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md) and [GitHub](../azure-resource-manager/templates/deploy-to-azure-button.md).

<a id="create-autoscale"></a>

## Azure Cosmos account with autoscale throughput

This template creates an Azure Cosmos account in two regions with options for consistency and failover, with database and container configured for autoscale throughput that has most policy options enabled. This template is also available for one-click deploy from Azure Quickstart Templates Gallery.

[:::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Deploy to Azure":::](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.documentdb%2Fcosmosdb-sql-autoscale%2Fazuredeploy.json)

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-sql-autoscale/azuredeploy.json":::

<a id="create-analytical-store"></a>

## Azure Cosmos account with analytical store

This template creates an Azure Cosmos account in one region with a container with Analytical TTL enabled and options for manual or autoscale throughput. This template is also available for one-click deploy from Azure Quickstart Templates Gallery.

[:::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Deploy to Azure":::](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-cosmosdb-sql-analytical-store%2Fazuredeploy.json)

:::code language="json" source="~/quickstart-templates/101-cosmosdb-sql-analytical-store/azuredeploy.json":::

<a id="create-manual"></a>

## Azure Cosmos account with standard provisioned throughput

This template creates an Azure Cosmos account in two regions with options for consistency and failover, with database and container configured for standard throughput that has most policy options enabled. This template is also available for one-click deploy from Azure Quickstart Templates Gallery.

[:::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Deploy to Azure":::](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.documentdb%2Fcosmosdb-sql%2Fazuredeploy.json)

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-sql/azuredeploy.json":::

<a id="create-sproc"></a>

## Azure Cosmos DB container with server-side functionality

This template creates an Azure Cosmos account, database and container with with a stored procedure, trigger, and user-defined function. This template is also available for one-click deploy from Azure Quickstart Templates Gallery.

[:::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Deploy to Azure":::](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-cosmosdb-sql-container-sprocs%2Fazuredeploy.json)

:::code language="json" source="~/quickstart-templates/101-cosmosdb-sql-container-sprocs/azuredeploy.json":::

<a id="create-rbac"></a>

## Azure Cosmos DB account with Azure AD and RBAC

This template will create a SQL Cosmos account, a natively maintained Role Definition, and a natively maintained Role Assignment for an AAD identity. This template is also available for one-click deploy from Azure Quickstart Templates Gallery.

[:::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Deploy to Azure":::](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-cosmosdb-sql-rbac%2Fazuredeploy.json)

:::code language="json" source="~/quickstart-templates/101-cosmosdb-sql-rbac/azuredeploy.json":::

<a id="free-tier"></a>

## Free tier Azure Cosmos DB account

This template creates a free-tier Azure Cosmos account and a database with shared throughput that can be shared with up to 25 containers. This template is also available for one-click deploy from Azure Quickstart Templates Gallery.

[:::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Deploy to Azure":::](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.documentdb%2Fcosmosdb-free%2Fazuredeploy.json)

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-free/azuredeploy.json":::

## Next steps

Here are some additional resources:

* [Azure Resource Manager documentation](../azure-resource-manager/index.yml)
* [Azure Cosmos DB resource provider schema](/azure/templates/microsoft.documentdb/allversions)
* [Azure Cosmos DB Quickstart templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Documentdb&pageNumber=1&sort=Popular)
* [Troubleshoot common Azure Resource Manager deployment errors](../azure-resource-manager/templates/common-deployment-errors.md)