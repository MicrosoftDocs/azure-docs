---
title: "Azure Resource Manager: Create an Azure SQL Managed Instance"
description: Learn how to create an Azure SQL Managed Instance by using an Azure Resource Manager template.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: subject-armqs
ms.devlang:
ms.topic: quickstart
author: stevestein
ms.author: sstein
ms.reviewer: carlrab
ms.date: 06/22/2020
---

# Quickstart: Create an Azure SQL Managed Instance using an Azure Resource Manager template

This quickstart focuses on the process of deploying a Resource Manager template to create an Azure SQL Managed Instance and vNet.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).

## Prerequisites

None.

## Create an Azure SQL Managed Instance

[Azure SQL Managed Instance](sql-managed-instance-paas-overview.md) is an intelligent, fully managed, scalabale cloud database, with almost 100% feature parity with the SQL Server database engine.

### Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://azure.microsoft.com/resources/templates/101-sqlmi-new-vnet/).

:::code language="json" source="~/quickstart-templates/101-sqlmi-new-vnet/azuredeploy.json":::

These resources are defined in the template:

- [**Microsoft.Sql/managedinstances**](/azure/templates/microsoft.sql/managedinstances)
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.Network/virtualNetworks)
- [**Microsoft.Network/routeTables**](/azure/templates/microsoft.Network/routeTables)
- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.Network/networkSecurityGroups)



More template samples can be found in [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Sql&pageNumber=1&sort=Popular).

## Deploy the template

Select **Try it** from the following PowerShell code block to open Azure Cloud Shell.

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"
$templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-sqlmi-new-vnet/azuredeploy.json"

$resourceGroupName = "${projectName}rg"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri

Read-Host -Prompt "Press [ENTER] to continue ..."
```

# [The Azure CLI](#tab/azure-cli)

```azurecli-interactive
read -p "Enter a project name that is used for generating resource names:" projectName &&
read -p "Enter the location (i.e. centralus):" location &&
templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-sqlmi-new-vnet/azuredeploy.json" &&
resourceGroupName="${projectName}rg" &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-uri  $templateUri &&
echo "Press [ENTER] to continue ..." &&
read
```

* * *

## Review deployed resources

- For a quickstart that shows how to connect to SQL Managed Instance from an Azure virtual machine, see [Configure an Azure virtual machine connection](connect-vm-instance-configure.md).
- For a quickstart that shows how to connect to SQL Managed Instance from an on-premises client computer by using a point-to-site connection, see [Configure a point-to-site connection](point-to-site-p2s-configure.md).

## Clean up resources

Keep the managed instance if you want to go to the [Next steps](#next-steps), but delete the managed instance and related resources after completing any additional tutorials. After deleting a managed instance, see [Delete a subnet after deleting a managed instance](virtual-cluster-delete.md).


To delete the resource group:

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
```

# [The Azure CLI](#tab/azure-cli)

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName
```

* * *

## Next steps

> [!div class="nextstepaction"]
> [Configure an Azure VM to connect to Azure SQL Managed Instance](connect-vm-instance-configure.md)
