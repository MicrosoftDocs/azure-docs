---
title: Quickstart - Create an Azure Cosmos DB database and container using Terraform
description: Quickstart showing how to an Azure Cosmos DB database and a container using Terraform
author: ginsiucheng
ms.author: mjbrown
tags: azure-resource-manager, terraform
ms.custom: ignite-2022, devx-track-terraform
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: quickstart
ms.date: 09/22/2022
---

# Quickstart - Create an Azure Cosmos DB database and container using Terraform

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Azure Cosmos DB is Microsoft’s fast NoSQL database with open APIs for any scale. You can use Azure Cosmos DB to quickly create and query key/value databases, document databases, and graph databases. Without a credit card or an Azure subscription, you can set up a free [Try Azure Cosmos DB account](https://aka.ms/trycosmosdb). This quickstart focuses on the process of deployments via Terraform to create an Azure Cosmos database and a container within that database. You can later store data in this container.

## Prerequisites

An Azure subscription or free Azure Cosmos DB trial account

- [!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

Terraform should be installed on your local computer. Installation instructions can be found [here](https://learn.hashicorp.com/tutorials/terraform/install-cli).

## Review the Terraform File

The Terraform files used in this quickstart can be found on the [terraform samples repository](https://github.com/Azure/terraform). Create the below three files: providers.tf, main.tf and variables.tf. Variables can be set in command line or alternatively with a terraforms.tfvars file.

### Provider Terraform File

:::code language="terraform" source="~/terraform_samples/quickstart/101-cosmos-db-autoscale/providers.tf":::

### Main Terraform File

:::code language="terraform" source="~/terraform_samples/quickstart/101-cosmos-db-manualscale/main.tf":::

### Variables Terraform File

:::code language="terraform" source="~/terraform_samples/quickstart/101-cosmos-db-manualscale/variables.tf":::

Three Cosmos DB resources are defined in the main terraform file.

- [Microsoft.DocumentDB/databaseAccounts](/azure/templates/microsoft.documentdb/databaseaccounts): Create an Azure Cosmos account.

- [Microsoft.DocumentDB/databaseAccounts/sqlDatabases](/azure/templates/microsoft.documentdb/databaseaccounts/sqldatabases): Create an Azure Cosmos database.

- [Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers](/azure/templates/microsoft.documentdb/databaseaccounts/sqldatabases/containers): Create an Azure Cosmos container.

## Deploy via terraform

1. Save the terraform files as main.tf, variables.tf and providers.tf to your local computer.
2. Sign in to your terminal via Azure CLI or PowerShell
3. Deploy via Terraform commands
    - terraform init
    - terraform plan
    - terraform apply

## Validate the deployment

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az resource list --resource-group "your resource group name"
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName "your resource group name"
```

---

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place.
When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group delete --name "your resource group name"
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name "your resource group name"
```

---

## Next steps

In this quickstart, you created an Azure Cosmos account, a database and a container via terraform and validated the deployment. To learn more about Azure Cosmos DB and Terraform, continue on to the articles below.

- Read an [Overview of Azure Cosmos DB](../introduction.md).
- Learn more about [Terraform](https://www.terraform.io/intro).
- Learn more about [Azure Terraform Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs).
- [Manage Cosmos DB with Terraform](manage-with-terraform.md)
- Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
  - If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md).
  - If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md).
