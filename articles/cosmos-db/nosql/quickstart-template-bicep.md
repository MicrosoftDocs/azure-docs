---
title: Quickstart - Create an Azure Cosmos DB and a container using Bicep
description: Quickstart showing how to an Azure Cosmos DB database and a container using Bicep
author: seesharprun
ms.author: sidandrews
tags: azure-resource-manager, bicep
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: quickstart
ms.date: 04/18/2022
ms.custom: subject-armqs, mode-arm, ignite-2022, devx-track-bicep
#Customer intent: As a database admin who is new to Azure, I want to use Azure Cosmos DB to store and manage my data.
---

# Quickstart: Create an Azure Cosmos DB and a container using Bicep

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Azure Cosmos DB is Microsoft’s fast NoSQL database with open APIs for any scale. You can use Azure Cosmos DB to quickly create and query key/value databases, document databases, and graph databases. Without a credit card or an Azure subscription, you can set up a free [Try Azure Cosmos DB account](https://aka.ms/trycosmosdb). This quickstart focuses on the process of deploying a Bicep file to create an Azure Cosmos DB database and a container within that database. You can later store data in this container.

[!INCLUDE [About Bicep](../../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

An Azure subscription or free Azure Cosmos DB trial account.

- [!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/cosmosdb-sql/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-sql/main.bicep":::

Three Azure resources are defined in the Bicep file:

- [Microsoft.DocumentDB/databaseAccounts](/azure/templates/microsoft.documentdb/databaseaccounts): Create an Azure Cosmos DB account.

- [Microsoft.DocumentDB/databaseAccounts/sqlDatabases](/azure/templates/microsoft.documentdb/databaseaccounts/sqldatabases): Create an Azure Cosmos DB database.

- [Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers](/azure/templates/microsoft.documentdb/databaseaccounts/sqldatabases/containers): Create an Azure Cosmos DB container.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters primaryRegion=<primary-region> secondaryRegion=<secondary-region>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -primaryRegion "<primary-region>" -secondaryRegion "<secondary-region>"
    ```

    ---

   > [!NOTE]
   > Replace **\<primary-region\>** with the primary replica region for the Azure Cosmos DB account, such as **WestUS**. Replace **\<secondary-region\>** with the secondary replica region for the Azure Cosmos DB account, such as **EastUS**.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the deployment

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place.
When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this quickstart, you created an Azure Cosmos DB account, a database and a container by using a Bicep file and validated the deployment. To learn more about Azure Cosmos DB and Bicep, continue on to the articles below.

- Read an [Overview of Azure Cosmos DB](../introduction.md).
- Learn more about [Bicep](../../azure-resource-manager/bicep/overview.md).
- Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    - If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md).
    - If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md).
