---
title: How to switch licensing model for a SQL Server VM in Azure
description: Learn how to switch licensing for a SQL virtual machine in Azure from 'pay-as-you-go' to 'bring-your-own-license' using the Azure Hybrid Benefit. 
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
manager: jroth
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
# How to switch licensing model for a SQL Server virtual machine in Azure
This article describes how to change the licensing model for a SQL Server virtual machine in Azure using the new SQL VM resource provider - **Microsoft.SqlVirtualMachine**. There are two licensing models for a virtual machine (VM) hosting SQL Server - pay-as-you-go, and bring your own license (BYOL). And now, using either the Azure portal, Azure CLI, or PowerShell you can modify which licensing model your SQL Server VM uses. 

The **pay-as-you-go** (PAYG) model means that the per-second cost of running the Azure VM includes the cost of the SQL Server license.

The **bring-your-own-license** (BYOL) model is also known as the [Azure Hybrid Benefit (AHB)](https://azure.microsoft.com/pricing/hybrid-benefit/), and it allows you to use your own SQL Server license with a VM running SQL Server. In many cases, this option is more cost-effective, but you should review your specific requirements and costs. For more information, see [SQL Server VM pricing guide](virtual-machines-windows-sql-server-pricing-guidance.md).

Switching between the two license models incurs **no downtime**, does not restart the VM, adds **no additional cost** (in fact, activating AHB *reduces* cost) and is **effective immediately**. 

## Remarks

 - Azure Cloud Solution Partner (CSP) customers can utilize the Azure Hybrid Benefit by first deploying a pay-as-you-go VM and then converting it to bring-your-own-license. 
 - If you drop your SQL Server VM resource, you will go back to the hard-coded license setting of the image. 
 - BYOL marketplace images must register as 'AHUB' initially before changing the license type to 'PAYG'.
 - Adding a SQL Server VM to an availability set requires recreating the VM. As such, any VMs added to an availability set will go back to the default pay-as-you-go license type and AHB will need to be enabled again. 
 - The ability to change the licensing model is a feature of the SQL VM resource provider. Deploying a marketplace image through the Azure portal automatically registers a SQL Server VM with the resource provider. However, customers who are self-installing SQL Server will need to manually [register their SQL Server VM](virtual-machines-windows-sql-register-with-rp.md) and first enable 'AHUB' as the license type before switching to 'PAYG'. 


 
## Limitations

 - Changing the licensing model is only available to customers with software assurance.
 - Changing the licensing model is only supported for the standard and enterprise edition of SQL Server. License changes for Express, Web, and Developer are unsupported. 
 - Changing the licensing model is only supported for virtual machines deployed using the Resource Manager model. VMs deployed using the classic model are not supported. 
 - Changing the licensing model is only enabled for Public Cloud installations.
 - Changing the licensing model is supported only on virtual machines that have a single NIC (network interface). On virtual machines that have more than one NIC, you should first remove one of the NICs (by using the Azure portal) before you attempt the procedure. Otherwise, you will run into an error similar to the following: 
   `The virtual machine '\<vmname\>' has more than one NIC associated.` Although you might be able to add the NIC back to the VM after you change the licensing mode, operations done through the SQL configuration page in the Azure portal, like automatic patching and backup, will no longer be considered supported.

## Prerequisites

The use of the SQL VM resource provider requires the SQL IaaS extension. As such, to proceed with utilizing the SQL VM resource provider, you need the following:
- An [Azure subscription](https://azure.microsoft.com/free/).
- [Software assurance](https://www.microsoft.com/licensing/licensing-programs/software-assurance-default). 
- A [SQL Server VM](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-server-provision) with the [SQL IaaS extension](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-agent-extension) installed. 

## With the Azure portal

[!INCLUDE [windows-virtual-machines-sql-use-new-management-blade](../../../../includes/windows-virtual-machines-sql-new-resource.md)]

You can modify the licensing model directly from the portal. 

1. Open the [Azure portal](https://portal.azure.com) and launch the [SQL virtual machines resource](virtual-machines-windows-sql-manage-portal.md#access-sql-virtual-machine-resource) for your SQL Server VM. 
1. Select **Configure** under **Settings**. 
1. Select the **Azure Hybrid Benefit** option and select the checkbox to confirm that you have a SQL Server license with Software Assurance. 
1. Select **Apply** at the bottom of the **Configure** page. 

![AHB in Portal](media/virtual-machines-windows-sql-ahb/ahb-in-portal.png)


## With Azure CLI

You can use Azure CLI to change your licensing model.  

The following code snippet switches your pay-as-you-go license model to BYOL (or using Azure Hybrid Benefit):

```azurecli-interactive
# Switch your SQL Server VM license from pay-as-you-go to bring-your-own
# example: az sql vm update -n AHBTest -g AHBTest --license-type AHUB

az sql vm update -n <VMName> -g <ResourceGroupName> --license-type AHUB
```

The following code snippet switches your bring-your-own-license model to pay-as-you-go: 

```azurecli-interactive
# Switch your SQL Server VM license from bring-your-own to pay-as-you-go
# example: az sql vm update -n AHBTest -g AHBTest --license-type PAYG

az sql vm update -n <VMName> -g <ResourceGroupName> --license-type PAYG
```

## With PowerShell
You can use PowerShell to change your licensing model.

The following code snippet switches your pay-as-you-go license model to BYOL (or using Azure Hybrid Benefit):

```powershell-interactive
# Switch your SQL Server VM license from pay-as-you-go to bring-your-own
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

```powershell-interactive
# Switch your SQL Server VM license from bring-your-own to pay-as-you-go
#example: $SqlVm = Get-AzResource -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines -ResourceGroupName AHBTest -ResourceName AHBTest
$SqlVm = Get-AzResource -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines -ResourceGroupName <resource_group_name> -ResourceName <VM_name>
$SqlVm.Properties.sqlServerLicenseType="PAYG"
<# the following code snippet is only necessary if using Azure Powershell version > 4
$SqlVm.Kind= "LicenseChange"
$SqlVm.Plan= [Microsoft.Azure.Management.ResourceManager.Models.Plan]::new()
$SqlVm.Sku= [Microsoft.Azure.Management.ResourceManager.Models.Sku]::new() #>
$SqlVm | Set-AzResource -Force 
```

## Known errors

### The Resource 'Microsoft.SqlVirtualMachine/SqlVirtualMachines/\<resource-group>' under resource group '\<resource-group>' was not found. The property 'sqlServerLicenseType' cannot be found on this object. Verify that the property exists and can be set.
This error occurs when attempting to change the licensing model on a SQL Server VM that has not been registered with the SQL VM resource provider. You'll need to register the resource provider to your [subscription](#register-sql-vm-resource-provider-with-subscription), and then register your SQL Server VM with the SQL [resource provider](virtual-machines-windows-sql-register-with-rp.md). 

### Cannot validate argument on parameter 'Sku'
You may encounter this error when attempting to change your SQL Server VM licensing model when using Azure PowerShell > 4.0:
`Set-AzResource: Cannot validate argument on parameter 'Sku'. The argument is null or empty. Provide an argument that is not null or empty, and then try the command again.`

To resolve this error, uncomment these lines in the previously mentioned PowerShell code snippet when switching your licensing model:

  ```powershell-interactive
  # the following code snippet is necessary if using Azure Powershell version > 4
  $SqlVm.Kind= "LicenseChange"
  $SqlVm.Plan= [Microsoft.Azure.Management.ResourceManager.Models.Plan]::new()
  $SqlVm.Sku= [Microsoft.Azure.Management.ResourceManager.Models.Sku]::new()
  ```
  
Use the following code to verify your Azure PowerShell version:
  
  ```powershell-interactive
  Get-Module -ListAvailable -Name Azure -Refresh
  ```

## Next steps

For more information, see the following articles: 

* [Overview of SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-overview.md)
* [SQL Server on a Windows VM FAQ](virtual-machines-windows-sql-server-iaas-faq.md)
* [SQL Server on a Windows VM pricing guidance](virtual-machines-windows-sql-server-pricing-guidance.md)
* [SQL Server on a Windows VM release notes](virtual-machines-windows-sql-server-iaas-release-notes.md)


