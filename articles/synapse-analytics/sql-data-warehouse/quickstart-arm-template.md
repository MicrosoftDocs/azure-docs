---
title: Create a dedicated SQL pool (formerly SQL DW) by using Azure Resource Manager template
description: Learn how to create an Azure Synapse Analytics SQL pool by using Azure Resource Manager template.
services: azure-resource-manager
author: WilliamDAssafMSFT
ms.service: azure-resource-manager
ms.topic: quickstart
ms.author: wiassaf
ms.date: 06/09/2020
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Create an Azure Synapse Analytics dedicated SQL pool (formerly SQL DW) by using an ARM template

This Azure Resource Manager template (ARM template) will create an dedicated SQL pool (formerly SQL DW) with Transparent Data Encryption enabled. Dedicated SQL pool (formerly SQL DW) refers to the enterprise data warehousing features that are generally available in Azure Synapse.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.sql%2Fsql-data-warehouse-transparent-encryption-create%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/sql-data-warehouse-transparent-encryption-create/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.sql/sql-data-warehouse-transparent-encryption-create/azuredeploy.json":::

The template defines one resource:

- [Microsoft.Sql/servers](/azure/templates/microsoft.sql/servers)

## Deploy the template

1. Select the following image to sign in to Azure and open the template. This template creates a dedicated SQL pool (formerly SQL DW).
   
   [![Deploy to Azure](../../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.sql%2Fsql-data-warehouse-transparent-encryption-create%2Fazuredeploy.json)

1. Enter or update the following values:

   * **Subscription**: Select an Azure subscription.
   * **Resource group**: Select **Create new** and enter a unique name for the resource group and select **OK**. A new resource group will facilitate resource clean up.
   * **Region**: Select a region.  For example, **Central US**.
   * **SQL Server name**: Accept the default name or enter a name for the SQL Server name.
   * **SQL Administrator login**: Enter the administrator username for the SQL Server.
   * **SQL Administrator password**: Enter the administrator password for the SQL Server.
   * **Data Warehouse Name**: Enter a dedicated SQL pool name.
   * **Transparent Data Encryption**: Accept the default, enabled. 
   * **Service Level Objective**: Accept the default, DW400c.
   * **Location**: Accept the default location of the resource group.
   * **Review and Create**: Select.
   * **Create**: Select.

## Review deployed resources

You can either use the Azure portal to check the deployed resources, or use Azure CLI or Azure PowerShell script to list the deployed resources.

# [CLI](#tab/CLI)

```azurecli-interactive
echo "Enter the resource group where your dedicated SQL pool (formerly SQL DW) exists:" &&
read resourcegroupName &&
az resource list --resource-group $resourcegroupName 
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the resource group name where your dedicated SQL pool (formerly SQL DW) account exists"
(Get-AzResource -ResourceType "Microsoft.Sql/servers/databases" -ResourceGroupName $resourceGroupName).Name
 Write-Host "Press [ENTER] to continue..."
```

---

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

In this quickstart, you created a dedicated SQL pool (formerly SQL DW) using an ARM template and validated the deployment. To learn more about Azure Synapse Analytics and Azure Resource Manager, see the articles below.

- Read an [Overview of Azure Synapse Analytics](sql-data-warehouse-overview-what-is.md)
- Learn more about [Azure Resource Manager](../../azure-resource-manager/management/overview.md)
- [Create and deploy your first ARM template](../../azure-resource-manager/templates/template-tutorial-create-first-template.md)
