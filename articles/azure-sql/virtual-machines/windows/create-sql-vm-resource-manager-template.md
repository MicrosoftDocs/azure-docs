---
title: Create SQL Server VM using an ARM template
description: Learn how to create a SQL Server on Azure Virtual Machine (VM) by using an Azure Resource Manager template (ARM template).
author: MashaMSFT
ms.topic: quickstart
ms.custom: subject-armqs
ms.author: mathoma
ms.date: 06/29/2020
ms.service: virtual-machines-sql
ms.subservice: deployment
---

# Quickstart: Create SQL Server VM using an ARM template

Use this Azure Resource Manager template (ARM template) to deploy a SQL Server on Azure Virtual Machine (VM). 

[!INCLUDE [About Azure Resource Manager](../../../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../../../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2f101-sql-vm-new-storage%2fazuredeploy.json)

## Prerequisites

The SQL Server VM ARM template requires the following:

- The latest version of the [Azure CLI](/cli/azure/install-azure-cli) and/or [PowerShell](/powershell/scripting/install/installing-powershell). 
- A preconfigured [resource group](../../../azure-resource-manager/management/manage-resource-groups-portal.md#create-resource-groups) with a prepared [virtual network](../../../virtual-network/quick-create-portal.md) and [subnet](../../../virtual-network/virtual-network-manage-subnet.md#add-a-subnet).
- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-sql-vm-new-storage/).

:::code language="json" source="~/quickstart-templates/101-sql-vm-new-storage/azuredeploy.json":::

Five Azure resources are defined in the template: 

- [Microsoft.Network/publicIpAddresses](/azure/templates/microsoft.network/publicipaddresses): Creates a public IP address. 
- [Microsoft.Network/networkSecurityGroups](/azure/templates/microsoft.network/networksecuritygroups): Creates a network security group. 
- [Microsoft.Network/networkInterfaces](/azure/templates/microsoft.network/networkinterfaces): Configures the network interface. 
- [Microsoft.Compute/virtualMachines](/azure/templates/microsoft.compute/virtualmachines): Creates a virtual machine in Azure. 
- [Microsoft.SqlVirtualMachine/SqlVirtualMachines](/azure/templates/microsoft.sqlvirtualmachine/sqlvirtualmachines): registers the virtual machine with the SQL IaaS Agent extension. 

More SQL Server on Azure VM templates can be found in the [quickstart template gallery](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Sqlvirtualmachine&pageNumber=1&sort=Popular).


## Deploy the template

1. Select the following image to sign in to Azure and open a template. The template creates a virtual machine with the intended SQL Server version installed to it, and registered with the SQL IaaS Agent extension. 

   [![Deploy to Azure](../../../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2f101-sql-vm-new-storage%2fazuredeploy.json)

2. Select or enter the following values.

    * **Subscription**: Select an Azure subscription.
    * **Resource group**: The prepared resource group for your SQL Server VM. 
    * **Region**: Select a region.  For example, **Central US**.
    * **Virtual Machine Name**: Enter a name for SQL Server virtual machine. 
    * **Virtual Machine Size**: Choose the appropriate size for your virtual machine from the drop-down.
    * **Existing Virtual Network Name**: Enter the name of the prepared virtual network for your SQL Server VM. 
    * **Existing Vnet Resource Group**: Enter the resource group where your virtual network was prepared. 
    * **Existing Subnet Name**: The name of your prepared subnet. 
    * **Image Offer**: Choose the SQL Server and Windows Server image that best suits your business needs. 
    * **SQL Sku**: Choose the edition of SQL Server SKU that best suits your business needs. 
    * **Admin Username**: The username for the administrator of the virtual machine. 
    * **Admin Password**: The password used by the VM administrator account. 
    * **Storage Workload Type**:  The type of storage for the workload that best matches your business. 
    * **Sql Data Disks Count**:  The number of disks SQL Server uses for data files.  
    * **Data Path**:  The path for the SQL Server data files. 
    * **Sql Log Disks Count**:  The number of disks SQL Server uses for log files. 
    * **Log Path**:  The path for the SQL Server log files. 
    * **Location**:  The location for all of the resources, this value should remain the default of `[resourceGroup().location]`. 

3. Select **Review + create**. After the SQL Server VM has been deployed successfully, you get a notification.

The Azure portal is used to deploy the template. In addition to the Azure portal, you can also use Azure PowerShell, the Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../../../azure-resource-manager/templates/deploy-powershell.md).

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
> [ Tutorial: Create and deploy your first ARM template](../../../azure-resource-manager/templates/template-tutorial-create-first-template.md)

For other ways to deploy a SQL Server VM, see: 
- [Azure portal](create-sql-vm-portal.md)
- [PowerShell](create-sql-vm-powershell.md)

To learn more, see [an overview of SQL Server on Azure VMs](sql-server-on-azure-vm-iaas-what-is-overview.md).