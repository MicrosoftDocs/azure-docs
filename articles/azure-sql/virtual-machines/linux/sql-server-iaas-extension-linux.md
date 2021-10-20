---
title: SQL Server IaaS Agent extension for Linux
description: This article describes how the SQL Server IaaS Agent extension helps automate management specific administration tasks of SQL Server on Linux Azure VMs. 
services: virtual-machines-windows
documentationcenter: ''
author: adbadram
tags: azure-resource-manager
ms.service: virtual-machines-sql
ms.subservice: management
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 10/15/2021 
ms.author: adbadram
ms.reviewer: mathoma
---
# SQL Server IaaS Agent extension for Linux
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]


The SQL Server IaaS Agent extension (SqlIaasExtension) runs on SQL Server on Linux Azure Virtual Machines (VMs) to automate management and administration tasks. 

This article provides an overview of the extension. See [Register with the extension](sql-agent-extension-register-vm-linx.md) to learn more. 


## Overview

The SQL Server IaaS Agent extension allows for integration with the Azure portal and allows following benefits for SQL Server on Azure VMs: 

- **Compliance**: The extension offers a simplified method of fulfilling the requirement to notify Microsoft that the Azure Hybrid Benefit has been enabled as is specified in the product terms. This process negates needing to manage licensing registration forms for each resource.  

- **Simplified license management**: The extension simplifies SQL Server license management, and allows you to quickly identify SQL Server VMs with the Azure Hybrid Benefit enabled using the [Azure portal](manage-sql-vm-portal.md),  PowerShell or the Azure CLI: 

   # [PowerShell](#tab/azure-powershell)

   ```powershell-interactive
   Get-AzSqlVM | Where-Object {$_.LicenseType -eq 'AHUB'}
   ```

   # [Azure CLI](#tab/azure-cli)

   ```azurecli-interactive
   $ az sql vm list --query "[?sqlServerLicenseType=='AHUB']"
   ```
   ---

- **Free**: There is no additional cost associated with the extension. 

> [!IMPORTANT]
> The SQL IaaS Agent extension collects data for the express purpose of giving customers optional benefits when using SQL Server within Azure Virtual Machines. Microsoft will not use this data for licensing audits without the customer's advance consent. See the [SQL Server privacy supplement](/sql/sql-server/sql-server-privacy#non-personal-data) for more information.

## Installation

Register your SQL Server VM with the SQL Server IaaS Agent extension to create the [**SQL virtual machine** _resource_](manage-sql-vm-portal.md) within your subscription, which is a _separate_ resource from the virtual machine resource. Unregistering your SQL Server VM from the extension will remove the **SQL virtual machine** _resource_ but will not drop the actual virtual machine.

Today SQL Server IaaS Agent extension is only available in lightweight mode. You can manually register Azure Linux Virtual machine using following command
# [Azure CLI](#tab/bash)

Register a SQL Server VM in lightweight mode with the Azure CLI:

  ```azurecli-interactive
  # Register Enterprise or Standard self-installed VM in Lightweight mode
  az sql vm create --name <vm_name> --resource-group <resource_group_name> --location <vm_location> --license-type <license_type> 
  ```

# [Azure PowerShell](#tab/powershell)

Register a SQL Server VM in lightweight mode with Azure PowerShell:

  ```powershell-interactive
  # Get the existing compute VM
  $vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>

  # Register SQL VM with 'Lightweight' SQL IaaS agent
  New-AzSqlVM -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
    -LicenseType <license_type>  -SqlManagementType LightWeight  
  ```

## Verify status of extension

Use the Azure portal or Azure PowerShell to check the status of the extension. 

### Azure portal

Verify the extension is installed in the Azure portal. 

Select **All settings** in the virtual machine pane, and then select **Extensions**. You should see the **SqlIaasExtension** extension listed.

![Status of the SQL Server IaaS Agent extension in the Azure portal](./media/sql-server-iaas-agent-extension-automate-management/azure-rm-sql-server-iaas-agent-portal.png)


### Azure PowerShell

You can also use the **Get-AzVMSqlServerExtension** Azure PowerShell cmdlet:

   ```powershell-interactive
   Get-AzVMSqlServerExtension -VMName "vmname" -ResourceGroupName "resourcegroupname"
   ```

The previous command confirms that the agent is installed and provides general status information. You can get specific status information about automated backup and patching by using the following commands:

   ```powershell-interactive
    $sqlext = Get-AzVMSqlServerExtension -VMName "vmname" -ResourceGroupName "resourcegroupname"
    $sqlext.AutoPatchingSettings
    $sqlext.AutoBackupSettings
   ```

## Limitations

The SQL IaaS Agent extension only supports: 

- SQL Server VMs running Ubuntu Linux Operating system is only supported. Other Linux distributions are not supported today.
- SQL Server VMs running Ubuntu Pro Linux are not supported.
- SQL Server VMs running on the generalized images are not supported.
- SQL Server VMs deployed through the Azure Resource Manager. SQL Server VMs deployed through the classic model are not supported. 

## In-region data residency

Azure SQL virtual machine and the SQL IaaS Agent Extension do not move or store customer data out of the region in which they are deployed.

## Next steps

For more information about running SQL Server on Azure Virtual Machines, see the [What is SQL Server on Azure Virtual Machines?](sql-server-on-azure-vm-iaas-what-is-overview.md).

To learn more, see [frequently asked questions](frequently-asked-questions-faq.yml).
