---
title: Create and manage Azure Cosmos DB with Resource Manager templates
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB for API for NoSQL
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: devx-track-arm-template
ms.topic: how-to
ms.date: 02/18/2022
ms.author: sidandrews
ms.reviewer: mjbrown
---

# Manage Azure Cosmos DB for NoSQL resources with Azure Resource Manager templates

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

In this article, you learn how to use Azure Resource Manager templates to help deploy and manage your Azure Cosmos DB accounts, databases, and containers.

This article only shows Azure Resource Manager template examples for API for NoSQL accounts. You can also find template examples for [Cassandra](../cassandra/templates-samples.md), [Gremlin](../graph/resource-manager-template-samples.md), [MongoDB](../mongodb/resource-manager-template-samples.md), and [Table](../table/resource-manager-templates.md) APIs.

> [!IMPORTANT]
>
> * Account names are limited to 44 characters, all lowercase.
> * To change the throughput values, redeploy the template with updated RU/s.
> * When you add or remove locations to an Azure Cosmos DB account, you can't simultaneously modify other properties. These operations must be done separately.
> * To provision throughput at the database level and share across all containers, apply the throughput values to the database options property.

To create any of the Azure Cosmos DB resources below, copy the following example template into a new json file. You can optionally create a parameters json file to use when deploying multiple instances of the same resource with different names and values. There are many ways to deploy Azure Resource Manager templates including, [Azure portal](../../azure-resource-manager/templates/deploy-portal.md), [Azure CLI](../../azure-resource-manager/templates/deploy-cli.md), [Azure PowerShell](../../azure-resource-manager/templates/deploy-powershell.md) and [GitHub](../../azure-resource-manager/templates/deploy-to-azure-button.md).

<a id="create-autoscale"></a>

## Azure Cosmos DB account with autoscale throughput

This template creates an Azure Cosmos DB account in two regions with options for consistency and failover, with database and container configured for autoscale throughput that has most policy options enabled. This template is also available for one-click deploy from Azure Quickstart Templates Gallery.

> [!NOTE]
> You can use Azure Resource Manager templates update the autoscale max RU/s setting on an database and container resources already configured with autoscale. Migrating between manual and autoscale throughput is a POST operation and not supported with Azure Resource Manager templates. To migrate throughput use [Azure CLI](how-to-provision-autoscale-throughput.md#azure-cli) or [PowerShell](how-to-provision-autoscale-throughput.md#azure-powershell).

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.documentdb%2Fcosmosdb-sql-autoscale%2Fazuredeploy.json":::

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-sql-autoscale/azuredeploy.json":::

<a id="create-analytical-store"></a>

## Azure Cosmos DB account with analytical store

This template creates an Azure Cosmos DB account in one region with a container with Analytical TTL enabled and options for manual or autoscale throughput. This template is also available for one-click deploy from Azure Quickstart Templates Gallery.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.documentdb%2Fcosmosdb-sql-analytical-store%2Fazuredeploy.json":::

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-sql-analytical-store/azuredeploy.json":::

<a id="create-manual"></a>

## Azure Cosmos DB account with standard provisioned throughput

This template creates an Azure Cosmos DB account in two regions with options for consistency and failover, with database and container configured for standard throughput with many indexing policy options configured. This template is also available for one-click deploy from Azure Quickstart Templates Gallery.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.documentdb%2Fcosmosdb-sql%2Fazuredeploy.json":::

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-sql/azuredeploy.json":::

<a id="create-sproc"></a>

## Azure Cosmos DB container with server-side functionality

This template creates an Azure Cosmos DB account, database and container with a stored procedure, trigger, and user-defined function. This template is also available for one-click deploy from Azure Quickstart Templates Gallery.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.documentdb%2Fcosmosdb-sql-container-sprocs%2Fazuredeploy.json":::

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-sql-container-sprocs/azuredeploy.json":::

<a id="create-rbac"></a>

<a name='azure-cosmos-db-account-with-azure-ad-and-rbac'></a>

## Azure Cosmos DB account with Microsoft Entra ID and RBAC

This template will create a SQL Azure Cosmos DB account, a natively maintained Role Definition, and a natively maintained Role Assignment for a Microsoft Entra identity. This template is also available for one-click deploy from Azure Quickstart Templates Gallery.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.documentdb%2Fcosmosdb-sql-rbac%2Fazuredeploy.json":::

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-sql-rbac/azuredeploy.json":::

<a id="free-tier"></a>

## Free tier Azure Cosmos DB account

This template creates a free-tier Azure Cosmos DB account and a database with shared throughput that can be shared with up to 25 containers. This template is also available for one-click deploy from Azure Quickstart Templates Gallery.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.documentdb%2Fcosmosdb-free%2Fazuredeploy.json":::

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-free/azuredeploy.json":::

## Next steps

Here are some additional resources:

* [Azure Resource Manager documentation](../../azure-resource-manager/index.yml)
* [Azure Cosmos DB resource provider schema](/azure/templates/microsoft.documentdb/allversions)
* [Azure Cosmos DB Quickstart templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Documentdb&pageNumber=1&sort=Popular)
* [Troubleshoot common Azure Resource Manager deployment errors](../../azure-resource-manager/templates/common-deployment-errors.md)
