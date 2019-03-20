---
title: How to change the licensing model for a SQL Server VM in Azure | Microsoft Docs
description: Learn how to switch licensing for a SQL virtual machine in Azure. 
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
manager: craigg
tags: azure-resource-manager
ms.assetid: aa5bf144-37a3-4781-892d-e0e300913d03
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 02/13/2019
ms.author: mathoma
ms.reviewer: jroth

---
# How to change the licensing model for a SQL Server virtual machine in Azure
This article describes how to change the licensing model for a SQL Server virtual machine in Azure using the new SQL VM resource provider - **Microsoft.SqlVirtualMachine**. There are two licensing models for a virtual machine (VM) hosting SQL Server - pay-as-you-go, and bring your own license (BYOL). And now, using either PowerShell or Azure CLI, you can modify which licensing model your SQL Server VM uses. 

The **pay-as-you-go** (PAYG) model means that the per-second cost of running the Azure VM includes the cost of the SQL Server license.

The **bring-your-own-license** (BYOL) model is also known as the [Azure Hybrid Benefit (AHB)](https://azure.microsoft.com/pricing/hybrid-benefit/), and it allows you to use your own SQL Server license with a VM running SQL Server. For more information about prices, see [SQL Server VM pricing guide](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-pricing-guidance).

Switching between the two license models incurs **no downtime**, does not restart the VM, adds **no additional cost** (in fact, activating AHB *reduces* cost) and is **effective immediately**. 

  >[!NOTE]
  > - The ability to convert the licensing model is currently only available when starting with a pay-as-you-go SQL Server VM image. If you start with a bring-your-own-license image from the portal, you will not be able to convert that image to pay-as-you-go.
  > - CSP customers can utilize the AHB benefit by first deploying a pay-as-you-go VM and then converting it to bring-your-own-license. 
  > - Currently this ability is only enabled for Public Cloud installations.


## Prerequisites
The use of the SQL VM resource provider requires the SQL IaaS extension. As such, to proceed with utilizing the SQL VM resource provider, you need the following:
- An [Azure subscription](https://azure.microsoft.com/free/).
- [Software assurance](https://www.microsoft.com/licensing/licensing-programs/software-assurance-default). 
- A *pay-as-you-go* [SQL Server VM](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-server-provision) with the [SQL IaaS extension](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-agent-extension) installed. 


## Register SQL resource provider with your subscription 

The ability to switch between licensing models is a feature provided by the new SQL VM resource provider (Microsoft.SqlVirtualMachine). SQL Server VMs deployed after December 2018 are automatically registered with the new resource provider. However, existing VMs that were deployed prior to this date need to be manually registered with the resource provider before they are able to switch their licensing model. 

  > [!NOTE] 
  > If you drop your SQL Server VM resource, you will go back to the hard coded license setting of the image. 

To register your SQL Server VM with the SQL resource provider, you must register the resource provider to your subscription. You can do so with Azure CLI, PowerShell, or with the Azure portal. 

### With the Azure portal
The following steps will register the SQL resource provider with your Azure subscription using the Azure portal. 

1. Open the Azure portal and navigate to **All Services**. 
1. Navigate to **Subscriptions** and select the subscription of interest.  
1. In the **Subscriptions** blade, navigate to **Resource providers**. 
1. Type `sql` in the filter to bring up the SQL-related resource providers. 
1. Select either *Register*, *Re-register*, or *Unregister* for the  **Microsoft.SqlVirtualMachine** provider depending on your desired action. 

   ![Modify the provider](media/virtual-machines-windows-sql-ahb/select-resource-provider-sql.png)

### With Azure CLI
The following code snippet will register the SQL resource provider with your Azure subscription. 

```cli
# Register the new SQL resource provider for your subscription 
az provider register --namespace Microsoft.SqlVirtualMachine 
```

### With PowerShell
The following code snippet will register the SQL resource provider with your Azure subscription. 

```powershell
# Register the new SQL resource provider for your subscription
Register-AzResourceProvider -ProviderNamespace Microsoft.SqlVirtualMachine
```


## Register SQL Server VM with SQL resource provider
Once the SQL resource provider has been registered with your subscription, you can then register your SQL Server VM with the resource provider. You can do so using Azure CLI, and PowerShell. 

### With Azure CLI

Register SQL Server VM using Azure CLI with the following code snippet: 

```cli
# Register your existing SQL Server VM with the new resource provider
az sql vm create -n <VMName> -g <ResourceGroupName> -l <VMLocation>
```

### With PowerShell

Register SQL Server VM using PowerShell with the following code snippet: 
```powershell
# Register your existing SQL Server VM with the new resource provider
# example: $vm=Get-AzureRmVm -ResourceGroupName AHBTest -Name AHBTest
$vm=Get-AzureRmVm -ResourceGroupName <ResourceGroupName> -Name <VMName>
New-AzureRmResource -ResourceName $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location -ResourceType Microsoft.SqlVirtualMachine/sqlVirtualMachines -Properties @{virtualMachineResourceId=$vm.Id}
```


## Change licensing model
Once your SQL Server VM has been registered with the resource provider, you can change the licensing model using either the Azure portal, Azure CLI, or PowerShell. 


  >[!NOTE]
  >  The ability to convert the licensing model is currently only available when starting with a pay-as-you-go SQL Server VM image. If you start with a bring-your-own-license image from the portal, you will not be able to convert that image to pay-as-you-go. 

### With the Azure portal
You can modify the licensing model directly from the portal. 

1. Navigate to your SQL Server VM within the [Azure portal](https://portal.azure.com). 
1. Select **SQL Server configuration** in the **Settings** pane. 
1. Select **Edit** in the **SQL Server License** pane to modify the license. 

![AHB in Portal](media/virtual-machines-windows-sql-ahb/ahb-in-portal.png)

  >[!NOTE]
  > This option is not available for bring-your-own-license images. 

### With Azure CLI
You can use Azure CLI to change your licensing model.  

The following code snippet switches your pay-as-you-go license model to BYOL (or using Azure Hybrid Benefit):
```azurecli
# Switch  your SQL Server VM license from pay-as-you-go to bring-your-own
# example: az sql vm update -n AHBTest -g AHBTest --license-type AHUB

az sql vm update -n <VMName> -g <ResourceGroupName> --license-type AHUB
```

The following code snippet switches your BYOL model to pay-as-you-go: 
```azurecli
# Switch  your SQL Server VM license from bring-your-own to pay-as-you-go
# example: az sql vm update -n AHBTest -g AHBTest --license-type PAYG

az sql vm update -n <VMName> -g <ResourceGroupName> --license-type PAYG
```

### With PowerShell 
You can use PowerShell to change your licensing model. 

The following code snippet switches your pay-as-you-go license model to BYOL (or using Azure Hybrid Benefit): 
```PowerShell
# Switch  your SQL Server VM license from pay-as-you-go to bring-your-own
#example: $SqlVm = Get-AzResource -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines -ResourceGroupName AHBTest -ResourceName AHBTest

$SqlVm = Get-AzResource -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines -ResourceGroupName <resource_group_name> -ResourceName <VM_name>
$SqlVm.Properties.sqlServerLicenseType="AHUB"
<# the following code snippet is only necessary if using Azure Powershell version > 4
$SqlVm.Kind= "LicenseChange"
$SqlVm.Plan= [Microsoft.Azure.Management.ResourceManager.Models.Plan]::new()
$SqlVm.Sku= [Microsoft.Azure.Management.ResourceManager.Models.Sku]::new() #>
$SqlVm | Set-AzResource -Force 
```

The following code snippet switches your BYOL model to pay-as-you-go:
```PowerShell
# Switch  your SQL Server VM license from bring-your-own to pay-as-you-go
#example: $SqlVm = Get-AzResource -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines -ResourceGroupName AHBTest -ResourceName AHBTest

$SqlVm = Get-AzResource -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines -ResourceGroupName <resource_group_name> -ResourceName <VM_name>
$SqlVm.Properties.sqlServerLicenseType="PAYG"
<# the following code snippet is only necessary if using Azure Powershell version > 4
$SqlVm.Kind= "LicenseChange"
$SqlVm.Plan= [Microsoft.Azure.Management.ResourceManager.Models.Plan]::new()
$SqlVm.Sku= [Microsoft.Azure.Management.ResourceManager.Models.Sku]::new() #>
$SqlVm | Set-AzResource -Force 
``` 


## View current licensing 

The following code snippet allows you to view your current licensing model for your SQL Server VM. 

```PowerShell
# View current licensing model for your SQL Server VM
#example: $SqlVm = Get-AzResource -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines -ResourceGroupName <resource_group_name> -ResourceName <VM_name>

$SqlVm = Get-AzResource -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines -ResourceGroupName <resource_group_name> -ResourceName <VM_name>
$SqlVm.Properties.sqlServerLicenseType
```

## Known errors

### Sql IaaS Extension is not installed on Virtual Machine
The SQL IaaS extension is a necessary prerequisite for registering your SQL Server VM with the SQL VM resource provider. If you attempt to register your SQL Server VM before installing the SQL IaaS extension, you will encounter the following error:

`Sql IaaS Extension is not installed on Virtual Machine: '{0}'. Please make sure it is installed and in running state and try again later.`

To resolve this issue, install the SQL IaaS extension before attempting to register your SQL Server VM. 

  > [!NOTE]
  > Installing the SQL IaaS extension will restart the SQL Server service and should only be done during a maintenance window. For more information, see [SQL IaaS Extension installation](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-agent-extension#installation). 

### Cannot validate argument on parameter 'Sku'
You may encounter this error when attempting to change your SQL Server VM licensing model when using Azure PowerShell > 4.0:

`Set-AzResource : Cannot validate argument on parameter 'Sku'. The argument is null or empty. Provide an argument that is not null or empty, and then try the command again.`

To resolve this error, uncomment these lines in the previously mentioned PowerShell code snippet when switching your licensing model: 
```PowerShell
# the following code snippet is necessary if using Azure Powershell version > 4
$SqlVm.Kind= "LicenseChange"
$SqlVm.Plan= [Microsoft.Azure.Management.ResourceManager.Models.Plan]::new()
$SqlVm.Sku= [Microsoft.Azure.Management.ResourceManager.Models.Sku]::new()
```

Use the following code to verify your Azure PowerShell version:

```PowerShell
Get-Module -ListAvailable -Name Azure -Refresh
```

### The Resource 'Microsoft.SqlVirtualMachine/SqlVirtualMachines/<resource-group>' under resource group '<resource-group>' was not found. The property 'sqlServerLicenseType' cannot be found on this object. Verify that the property exists and can be set.
This error occurs when the SQL Server VM has not been registered with the SQL resource provider. You'll need to register the resource provider with your [subscription](#register-sql-resource-provider-with-your-subscription), and then register your SQL Server VM with the SQL [resource provider](#register-sql-server-vm-with-sql-resource-provider). 

## Next steps

For more information, see the following articles: 

* [Overview of SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-overview.md)
* [SQL Server on a Windows VM FAQ](virtual-machines-windows-sql-server-iaas-faq.md)
* [SQL Server on a Windows VM pricing guidance](virtual-machines-windows-sql-server-pricing-guidance.md)
* [SQL Server on a Windows VM release notes](virtual-machines-windows-sql-server-iaas-release-notes.md)


