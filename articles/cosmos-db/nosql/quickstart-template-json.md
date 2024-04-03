---
title: Quickstart - Create an Azure Cosmos DB and a container by using Azure Resource Manager template
description: Quickstart showing how to an Azure Cosmos DB database and a container by using Azure Resource Manager template
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
tags: azure-resource-manager
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: quickstart
ms.date: 08/26/2021
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
#Customer intent: As a database admin who is new to Azure, I want to use Azure Cosmos DB to store and manage my data.
---

# Quickstart: Create an Azure Cosmos DB and a container by using an ARM template
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Azure Cosmos DB is Microsoft’s fast NoSQL database with open APIs for any scale. You can use Azure Cosmos DB to quickly create and query key/value databases, document databases, and graph databases. Without a credit card or an Azure subscription, you can set up a free [Try Azure Cosmos DB account](https://aka.ms/trycosmosdb). This quickstart focuses on the process of deploying an Azure Resource Manager template (ARM template) to create an Azure Cosmos DB database and a container within that database. You can later store data in this container.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.documentdb%2Fcosmosdb-sql%2Fazuredeploy.json":::

## Prerequisites

An Azure subscription or free Azure Cosmos DB trial account

- [!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

- [!INCLUDE [cosmos-db-emulator-docdb-api](../includes/cosmos-db-emulator-docdb-api.md)]

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/cosmosdb-sql/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-sql/azuredeploy.json":::

Three Azure resources are defined in the template:

* [Microsoft.DocumentDB/databaseAccounts](/azure/templates/microsoft.documentdb/databaseaccounts): Create an Azure Cosmos DB account.

* [Microsoft.DocumentDB/databaseAccounts/sqlDatabases](/azure/templates/microsoft.documentdb/databaseaccounts/sqldatabases): Create an Azure Cosmos DB database.

* [Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers](/azure/templates/microsoft.documentdb/databaseaccounts/sqldatabases/containers): Create an Azure Cosmos DB container.

More Azure Cosmos DB template samples can be found in the [quickstart template gallery](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Documentdb).

## Deploy the template

1. Select the following image to sign in to Azure and open a template. The template creates an Azure Cosmos DB account, a database, and a container.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.documentdb%2Fcosmosdb-sql%2Fazuredeploy.json":::

2. Select or enter the following values.

   :::image type="content" source="../media/quick-create-template/create-cosmosdb-using-template-portal.png" alt-text="ARM template, Azure Cosmos DB integration, deploy portal":::

    Unless it is specified, use the default values to create the Azure Cosmos DB resources.

    * **Subscription**: select an Azure subscription.
    * **Resource group**: select **Create new**, enter a unique name for the resource group, and then click **OK**.
    * **Location**: select a location.  For example, **Central US**.
    * **Account Name**: enter a name for the Azure Cosmos DB account. It must be globally unique.
    * **Location**: enter a location where you want to create your Azure Cosmos DB account. The Azure Cosmos DB account can be in the same location as the resource group.
    * **Primary Region**: The primary replica region for the Azure Cosmos DB account.
    * **Secondary region**: The secondary replica region for the Azure Cosmos DB account.
    * **Default Consistency Level**: The default consistency level for the Azure Cosmos DB account.
    * **Max Staleness Prefix**: Max stale requests. Required for BoundedStaleness.
    * **Max Interval in Seconds**: Max lag time. Required for BoundedStaleness.
    * **Database Name**: The name of the Azure Cosmos DB database.
    * **Container Name**: The name of the Azure Cosmos DB container.
    * **Throughput**:  The throughput for the container, minimum throughput value is 400 RU/s.
    * **I agree to the terms and conditions state above**: Select.

3. Select **Purchase**. After the Azure Cosmos DB account has been deployed successfully, you get a notification:

   :::image type="content" source="../media/quick-create-template/resource-manager-template-portal-deployment-notification.png" alt-text="ARM template, Azure Cosmos DB integration, deploy portal notification":::

The Azure portal is used to deploy the template. In addition to the Azure portal, you can also use the Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../../azure-resource-manager/templates/deploy-powershell.md).

## Validate the deployment

You can either use the Azure portal to check the Azure Cosmos DB account, the database, and the container or use the following Azure CLI or Azure PowerShell script to list the secret created.

# [CLI](#tab/CLI)

```azurecli-interactive
echo "Enter your Azure Cosmos DB account name:" &&
read cosmosAccountName &&
echo "Enter the resource group where the Azure Cosmos DB account exists:" &&
read resourcegroupName &&
az cosmosdb show -g $resourcegroupName -n $cosmosAccountName
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the resource group name where your Azure Cosmos DB account exists"
(Get-AzResource -ResourceType "Microsoft.DocumentDB/databaseAccounts" -ResourceGroupName $resourceGroupName).Name
 Write-Host "Press [ENTER] to continue..."
```

---

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place.
When no longer needed, delete the resource group, which deletes the Azure Cosmos DB account and the related resources. To delete the resource group by using Azure CLI or Azure PowerShell:

# [CLI](#tab/CLI)

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

---

## Next steps

In this quickstart, you created an Azure Cosmos DB account, a database and a container by using an ARM template and validated the deployment. To learn more about Azure Cosmos DB and Azure Resource Manager, continue on to the articles below.

- Read an [Overview of Azure Cosmos DB](../introduction.md)
- Learn more about [Azure Resource Manager](../../azure-resource-manager/management/overview.md)
- Get other [Azure Cosmos DB Resource Manager templates](./samples-resource-manager-templates.md)
- Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    - If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
    - If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
