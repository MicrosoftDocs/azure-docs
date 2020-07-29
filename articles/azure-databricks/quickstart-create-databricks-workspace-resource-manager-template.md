---
title: Quickstart - Create an Azure Databricks workspace by Azure Resource Manager template
description: This quickstart shows how to use the Azure Resource Manager template to create an Azure Databricks workspace.
services: azure-databricks
ms.service: azure-databricks
author: mamccrea
ms.author: mamccrea
ms.reviewer: jasonh
ms.workload: big-data
ms.topic: quickstart
ms.custom: mvc, subject-armqs
ms.date: 05/27/2020
---

# Quickstart: Create an Azure Databricks workspace by using the Azure Resource Manager template

In this quickstart, you use an Azure Resource Manager template to create an Azure Databricks workspace. Once the workspace is created, you validate the deployment.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

To complete this article, you need to:

* Have an Azure subscription - [create one for free](https://azure.microsoft.com/free/)

## Create an Azure Databricks workspace

### Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-databricks-workspace/).

:::code language="json" source="~/quickstart-templates/101-databricks-workspace/azuredeploy.json" range="1-53" highlight="33-46":::

The Azure resource defined in the template is [Microsoft.Databricks/workspaces](/azure/templates/microsoft.databricks/workspaces): create an Azure Databricks workspace.

### Deploy the template

In this section, you create an Azure Databricks workspace using the Azure Resource Manager template.

1. Select the following image to sign in to Azure and open a template. The template creates an Azure Databricks workspace.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-databricks-workspace%2Fazuredeploy.json)

2. Provide the required values to create your Azure Databricks workspace

   ![Create Azure Databricks workspace using an Azure Resource Manager template](./media/quickstart-create-databricks-workspace-resource-manager-template/create-databricks-workspace-using-resource-manager-template.png "Create Azure Databricks workspace using an Azure Resource Manager template")

   Provide the following values:

   |Property  |Description  |
   |---------|---------|
   |**Subscription**     | From the drop-down, select your Azure subscription.        |
   |**Resource group**     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview](../azure-resource-manager/management/overview.md). |
   |**Location**     | Select **East US 2**. For other available regions, see [Azure services available by region](https://azure.microsoft.com/regions/services/).        |
   |**Workspace name**     | Provide a name for your Databricks workspace        |
   |**Pricing Tier**     |  Choose between **Standard** or **Premium**. For more information on these tiers, see [Databricks pricing page](https://azure.microsoft.com/pricing/details/databricks/).       |

3. Select **Review + Create**, then **Create**.

4. The workspace creation takes a few minutes. When a workspace deployment fails, the workspace is still created in a failed state. Delete the failed workspace and create a new workspace that resolves the deployment errors. When you delete the failed workspace, the managed resource group and any successfully deployed resources are also deleted.

## Review deployed resources

You can either use the Azure portal to check the Azure Databricks workspace or use the following Azure CLI or Azure PowerShell script to list the resource.

### Azure CLI

```azurecli-interactive
echo "Enter your Azure Databricks workspace name:" &&
read databricksWorkspaceName &&
echo "Enter the resource group where the Azure Databricks workspace exists:" &&
read resourcegroupName &&
az databricks workspace show -g $resourcegroupName -n $databricksWorkspaceName
```

### Azure PowerShell

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the resource group name where your Azure Databricks workspace exists"
(Get-AzResource -ResourceType "Microsoft.Databricks/workspaces" -ResourceGroupName $resourceGroupName).Name
 Write-Host "Press [ENTER] to continue..."
```

## Clean up resources

If you plan to continue on to subsequent tutorials, you may wish to leave these resources in place. When no longer needed, delete the resource group, which deletes the Azure Databricks workspace and the related managed resources. To delete the resource group by using Azure CLI or Azure PowerShell:

### Azure CLI

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

### Azure PowerShell

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

## Next steps

In this quickstart, you created an Azure Databricks workspace by using an Azure Resource Manager template and validated the deployment. Advance to the next article to learn how to perform an ETL operation (extract, transform, and load data) using Azure Databricks.

> [!div class="nextstepaction"]
> [Extract, transform, and load data using Azure Databricks](databricks-extract-load-sql-data-warehouse.md)
