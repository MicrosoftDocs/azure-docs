---
title: Switch licensing model for a SQL VM in Azure | Microsoft Docs
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
ms.date: 11/14/2018
ms.author: mathoma
ms.reviewer: jroth

---
# Switch licensing model for a SQL virtual machine in Azure

## Overview

There are two licensing models for a virtual machine (VM) hosting SQL Server - pay-per-usage, and bring your own license (BYOL). And now, using either Powershell or Azure CLI, you can modify the licensing model for your SQL VM to switch between the two. 

Paying the SQL Server license per usage means that the per-second cost of running the Azure VM includes the cost of the SQL Server license.
The BYOL model is also known as the Azure Hybrid Benefit, and it allows you to use your own SQL Server license with a VM running SQL Server. For more information about prices, see [SQL VM pricing guide](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-pricing-guidance) and [Azure hybrid benefit](https://azure.microsoft.com/pricing/hybrid-benefit/). 

  >[!IMPORTANT]
  > If you drop your SQL VM resource, you will go back to the hard coded license setting of the image. 


## Register legacy SQL VM with new SQL VM resource provider
The ability to switch between licensing models is a feature provided by the new SQL VM resource provider (Microsoft.SqlVirtualMachine). At this time, to be able to switch your licensing model, you will first need to register your legacy VM with the new SQL VM resource provider. To register your SQL VM with the provider, use the below code. 

```powershell
$vm=Get-AzureRmVm -ResourceGroupName <ResourceGroupName> -Name <VMName>​
# example: $vm=Get-AzureRmVm -ResourceGroupName AHBTest -Name AHBTest​

New-AzureRmResource -ResourceName $vm.Name ResourceGroupName $vm.ResourceGroupName -Location $vm.Location -ResourceType Microsoft.SqlVirtualMachine/sqlVirtualMachines -Properties @{virtualMachineResourceId=$vm.Id} ​
```

## Use Powershell 
Once your VM has been registered with the SQL VM resource provider, you can use the below powershell code to switch the licensing model. 

This code snippet switches your pay-per-usage license model to BYOL (or using Azure Hybrid Benefit): 
```powershell
$SqlVm = Get-AzureRmResource -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines -ResourceGroupName <resource_grou_name> -ResourceName <VM_name>
#example: $SqlVm = Get-AzureRmResource -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines -ResourceGroupName AHBTest -ResourceName AHBTest
$SqlVm.Properties.sqlServerLicenseType="AHUB"
$SqlVm | Set-AzureRmResource -Force 
``` 

This code snippet switches your BYOL model to pay-per-usage:
```powershell
$SqlVm = Get-AzureRmResource -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines -ResourceGroupName <resource_grou_name> -ResourceName <VM_name>
#example: $SqlVm = Get-AzureRmResource -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines -ResourceGroupName AHBTest -ResourceName AHBTest
$SqlVm.Properties.sqlServerLicenseType="NeedValue"
$SqlVm | Set-AzureRmResource -Force 
``` 

  >[NOTE]
  > To switch between licenses, you must be using the new SQL VM resource provider. If you try to run these commands before registering your SQL VM with the new provider, you may encounter this error: `Get-AzureRmResource : The Resource 'Microsoft.SqlVirtualMachine/SqlVirtualMachines/AHBTest' under resource group 'AHBTest' was not found. The property 'sqlServerLicenseType' cannot be found on this object. Verify that the property exists and can be set. ` If you see this error, please [register with the SQL resource provider](#register-legacy-SQL-vm-with-new-SQL-VM-resource-provider). 
 

## Use Azure CLI
Once your VM has been registered with the SQL VM resource provider, you can use the below Azure CLI code to switch the licensing model.  

This code snippet switches your pay-per-usage license model to BYOL (or using Azure Hybrid Benefit):
```azurecli-interactive
az resource update -g <resource_group_name> -n <sql_virtual_machine_name> --resource-type "Microsoft.SqlVirtualMachine/SqlVirtualMachines" --set properties.sqlServerLicenseType=AHUB
# example: az resource update -g AHBTest -n AHBTest --resource-type "Microsoft.SqlVirtualMachine/SqlVirtualMachines" --set properties.sqlServerLicenseType=AHUB
```

This code snippet switches your BYOL model to pay-per-usage: 
```azurecli-interactive
az resource update -g <resource_group_name> -n <sql_virtual_machine_name> --resource-type "Microsoft.SqlVirtualMachine/SqlVirtualMachines" --set properties.sqlServerLicenseType=NeedValue
# example: az resource update -g AHBTest -n AHBTest --resource-type "Microsoft.SqlVirtualMachine/SqlVirtualMachines" --set properties.sqlServerLicenseType=NeedValue
```

  >[NOTE]
  > To switch between licenses, you must be using the new SQL VM resource provider. If you try to run these commands before registering your SQL VM with the new provider, you may encounter this error: `The Resource 'Microsoft.SqlVirtualMachine/SqlVirtualMachines/AHBTest' under resource group 'AHBTest' was not found. ` If you see this error, please [register with the SQL resource provider](#register-legacy-SQL-vm-with-new-SQL-VM-resource-provider). 

## View current licensing 

The below code snippets will allow you to view your current licensing model for your SQL VM. 

```powershell
// Update new SqlVm
$SqlVm = Get-AzureRmResource -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines -ResourceGroupName AHBTest -ResourceName AHBTest
$SqlVm.Properties.sqlServerLicenseType
```

## Verify SQL resource provider

The below code snippets will allow you to verify if your SQL VM has been registered with the new resource provider. 


## Register SQL IaaS Extension
There is a new extension that improves the manageability of your VM. With this IaaS extension, you can configure auto patching, set cloud backup policies, and use Advanced Analytics in the UI within Azure.  To register the SQL IaaS extension, use the below code snippets. 

```powershell
Set-AzureRmVMSqlServerExtension -ResourceGroupName "<resourcegroupname>" -VMName "<vmname>" -Name "SQLIaasExtension" -Version "2.0" -Location "<location>"
# example: Set-AzureRmVMSqlServerExtension -ResourceGroupName "AHBTest" -VMName "AHBTest" -Name "SQLIaasExtension" -Version "2.0" -Location "East US 2"
```

**Windows VMs**:

* [Overview of SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-overview.md).
* [Provision a SQL Server Windows VM](virtual-machines-windows-portal-sql-server-provision.md)
* [Migrating a Database to SQL Server on an Azure VM](virtual-machines-windows-migrate-sql.md)
* [High Availability and Disaster Recovery for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-high-availability-dr.md)
* [Performance best practices for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-performance.md)
* [Application Patterns and Development Strategies for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-server-app-patterns-dev-strategies.md)

**Linux VMs**:

* [Overview of SQL Server on a Linux VM](../../linux/sql/sql-server-linux-virtual-machines-overview.md)
* [Provision a SQL Server Linux VM](../../linux/sql/provision-sql-server-linux-virtual-machine.md)
* [FAQ (Linux)](../../linux/sql/sql-server-linux-faq.md)
* [SQL Server on Linux documentation](https://docs.microsoft.com/sql/linux/sql-server-linux-overview)