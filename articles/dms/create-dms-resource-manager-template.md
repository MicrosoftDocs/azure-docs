---
title: Create instance of DMS (Azure Resource Manager template)
description: Learn how to create Database Migration Service by using Azure Resource Manager template (ARM template).
author: MashaMSFT
ms.topic: quickstart
ms.custom: subject-armqs
ms.author: mathoma
ms.date: 06/29/2020
ms.service: dms
---

# Quickstart: Create instance of Azure Database Migration Service using ARM template

Use this Azure Resource Manager template (ARM template) to deploy an instance of the Azure Database Migration Service. 

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.datamigration%2fazure-database-migration-simple-deploy%2fazuredeploy.json)

## Prerequisites

The Azure Database Migration Service ARM template requires the following: 

- The latest version of the [Azure CLI](/cli/azure/install-azure-cli) and/or [PowerShell](/powershell/scripting/install/installing-powershell). 
- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-azure-database-migration-simple-deploy/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.datamigration/azure-database-migration-simple-deploy/azuredeploy.json":::

Three Azure resources are defined in the template: 

- [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks): Creates the virtual network. 
- [Microsoft.Network/virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets): Creates the subnet. 
- [Microsoft.DataMigration/services](/azure/templates/microsoft.datamigration/services): Deploys an instance of the Azure Database Migration Service. 

More Azure Database Migration Services templates can be found in the [quickstart template gallery](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Datamigration&pageNumber=1&sort=Popular).


## Deploy the template

1. Select the following image to sign in to Azure and open a template. The template creates an instance of the Azure Database Migration Service. 

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.datamigration%2fazure-database-migration-simple-deploy%2fazuredeploy.json)

2. Select or enter the following values.

    * **Subscription**: Select an Azure subscription.
    * **Resource group**: Select an existing resource group from the drop down, or select **Create new** to create a new resource group. 
    * **Region**: Location where the resources will be deployed.
    * **Service Name**: Name of the new migration service.
    * **Location**: The location of the resource group, leave as the default of `[resourceGroup().location]`.
    * **Vnet Name**: Name of the new virtual network.
    * **Subnet Name**: Name of the new subnet associated with the virtual network.



3. Select **Review + create**. After the instance of Azure Database Migration Service has been deployed successfully, you get a notification. 


The Azure portal is used to deploy the template. In addition to the Azure portal, you can also use the Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-powershell.md).

## Review deployed resources

You can use the Azure CLI to check deployed resources. 


```azurecli-interactive
echo "Enter the resource group where your SQL Server VM exists:" &&
read resourcegroupName &&
az resource list --resource-group $resourcegroupName 
```


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

For a step-by-step tutorial that guides you through the process of creating a template, see:

> [!div class="nextstepaction"]
> [ Tutorial: Create and deploy your first ARM template](../azure-resource-manager/templates/template-tutorial-create-first-template.md)

For other ways to deploy Azure Database Migration Service, see: 
- [Azure portal](quickstart-create-data-migration-service-portal.md)

To learn more, see [an overview of Azure Database Migration Service](dms-overview.md)