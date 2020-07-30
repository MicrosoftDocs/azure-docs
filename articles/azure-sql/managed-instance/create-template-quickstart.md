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

# Quickstart: Create an Azure SQL Managed Instance using an ARM template

This quickstart focuses on the process of deploying an Azure Resource Manager template (ARM template) to create an Azure SQL Managed Instance and vNet. [Azure SQL Managed Instance](sql-managed-instance-paas-overview.md) is an intelligent, fully managed, scalable cloud database, with almost 100% feature parity with the SQL Server database engine.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-sqlmi-new-vnet%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-sqlmi-new-vnet/).

:::code language="json" source="~/quickstart-templates/101-sqlmi-new-vnet/azuredeploy.json" range="001-249" highlight="113,178,188,226":::

These resources are defined in the template:

- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.Network/networkSecurityGroups)
- [**Microsoft.Network/routeTables**](/azure/templates/microsoft.Network/routeTables)
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.Network/virtualNetworks)
- [**Microsoft.Sql/managedinstances**](/azure/templates/microsoft.sql/managedinstances)

More template samples can be found in [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Sql&pageNumber=1&sort=Popular).

## Deploy the template

Select **Try it** from the following PowerShell code block to open Azure Cloud Shell.

> [!IMPORTANT]
> Deploying a managed instance is a long-running operation. Deployment of the first instance in the subnet typically takes much longer than deploying into a subnet with existing managed instances. For average provisioning times, see [SQL Managed Instance management operations](sql-managed-instance-paas-overview.md#management-operations).

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

# [Azure CLI](#tab/azure-cli)

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

---

## Review deployed resources

Visit the [Azure portal](https://portal.azure.com/#blade/HubsExtension/BrowseResourceGroups) and verify the managed instance is in your selected resource group. Because creating a managed instance can take some time, you might need to check the **Deployments** link on your resource group's **Overview** page.

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

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName
```

---

## Next steps

> [!div class="nextstepaction"]
> [Configure an Azure VM to connect to Azure SQL Managed Instance](connect-vm-instance-configure.md)
