---
title: Create an Azure Synapse workspace Azure Resource Manager template
description: Learn how to create a Synapse workspace by using Azure Resource Manager template.
services: azure-resource-manager
author: julieMSFT
ms.service: azure-resource-manager
ms.topic: quickstart
ms.custom: subject-armqs
ms.author: jrasnick
ms.date: 08/07/2020
---

# Quickstart: Create an Azure Synapse workspace using a deployment template

This Azure Resource Manager template (ARM template) will create an Azure Synapse workspace with underlying Data Lake Storage. The Azure Synapse workspace is a securable collaboration boundary for analytics processes in Azure Synapse Analytics.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2FSynapse%2Fmaster%2FManage%2FDeployWorkspace%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

You can review the template by selecting the **Visualize** link as follows:

[![Visualize](../media/template-deployments/template-visualize-button.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2FSynapse%2Fmaster%2FManage%2FDeployWorkspace%2Fazuredeploy.json)

The template defines two resources:

- Storage account
- Workspace

## Deploy the template

1. Select the following image to sign in to Azure and open the template. This template creates a Synapse workspace.
   
   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2FSynapse%2Fmaster%2FManage%2FDeployWorkspace%2Fazuredeploy.json)

1. Enter or update the following values:

   * **Subscription**: Select an Azure subscription.
   * **Resource group**: Select **Create new** and enter a unique name for the resource group and select **OK**. A new resource group will facilitate resource clean up.
   * **Region**: Select a region.  For example, **Central US**.
   * **Name**: Enter a name for your workspace.
   * **SQL Administrator login**: Enter the administrator username for the SQL Server.
   * **SQL Administrator password**: Enter the administrator password for the SQL Server.
   * **Tag Values**: Accept the default. 
   * **Review and Create**: Select.
   * **Create**: Select.

## Review deployed resources

You can either use the Azure portal to check the deployed resources, or use Azure CLI or Azure PowerShell script to list the deployed resources.

###NEED NEW SCRIPTING?####

# [CLI](#tab/CLI)

```azurecli-interactive
echo "Enter the resource group where your Synapse SQL pool exists:" &&
read resourcegroupName &&
az resource list --resource-group $resourcegroupName 
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the resource group name where your SQL pool account exists"
(Get-AzResource -ResourceType "Microsoft.Sql/servers/databases" -ResourceGroupName $resourceGroupName).Name
 Write-Host "Press [ENTER] to continue..."
```

---
####NEED NEW SCRIPTING?####

## Clean up resources

When no longer needed, delete the resource group by using Azure CLI or Azure PowerShell:

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

To learn more about Azure Synapse Analytics and Azure Resource Manager, continue on to the articles below.

- Read an [Overview of Azure Synapse Analytics](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) 
- Learn more about [Azure Resource Manager](../azure-resource-manager/management/overview.md)
- [Create and deploy your first ARM template](../azure-resource-manager/templates/template-tutorial-create-first-template.md)
