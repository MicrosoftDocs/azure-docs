---
title: What is the SQL Server IaaS Agent extension? (Windows)
description: This article describes how the SQL Server IaaS Agent extension helps automate management specific administration tasks of SQL Server on Windows Azure VMs. These include features such as automated backup, automated patching, Azure Key Vault integration, licensing management, storage configuration, and central management of all SQL Server VM instances.
services: virtual-machines-windows
documentationcenter: ''
author: adbadram
editor: ''
tags: azure-resource-manager
ms.assetid: effe4e2f-35b5-490a-b5ef-b06746083da4
ms.service: virtual-machines-sql
ms.subservice: management
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 10/26/2021
ms.author: adbadram
ms.reviewer: mathoma
ms.custom: seo-lt-2019, ignite-fall-2021
---
# Automate management with the Windows SQL Server IaaS Agent extension
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

> [!div class="op_single_selector"]
> * [Windows](sql-server-iaas-agent-extension-automate-management.md)
> * [Linux](../linux/sql-server-iaas-agent-extension-linux.md)



The SQL Server IaaS Agent extension (SqlIaasExtension) runs on SQL Server on Windows Azure Virtual Machines (VMs) to automate management and administration tasks. 

This article provides an overview of the extension. To install the SQL Server IaaS extension to SQL Server on Azure VMs, see the articles for [Automatic installation](sql-agent-extension-automatic-registration-all-vms.md), [Single VMs](sql-agent-extension-manually-register-single-vm.md),  or [VMs in bulk](sql-agent-extension-manually-register-vms-bulk.md). 

> [!NOTE]
> Starting in September 2021, registering with the SQL IaaS extension in full mode no longer requires restarting the SQL Server service. 

To learn more about the Azure VM deployment and management experience, including recent improvements, see:
- [Azure SQL VM: Automate Management with the SQL Server IaaS Agent extension (Ep. 2)](/shows/data-exposed/azure-sql-vm-automate-management-with-the-sql-server-iaas-agent-extension-ep-2?WT.mc_id=dataexposed-c9-niner-mighub)
- [Azure SQL VM: New and Improved SQL on Azure VM deployment and management experience (Ep.8) | Data Exposed](/shows/data-exposed/new-and-improved-sql-on-azure-vm-deployment-and-management-experience?WT.mc_id=dataexposed-c9-niner-mighub).

## Overview

The SQL Server IaaS Agent extension allows for integration with the Azure portal, and depending on the management mode, unlocks a number of feature benefits for SQL Server on Azure VMs: 

- **Feature benefits**: The extension unlocks a number of automation feature benefits, such as portal management, license flexibility, automated backup, automated patching and more. See [Feature benefits](#feature-benefits) later in this article for details. 

- **Compliance**: The extension offers a simplified method to fulfill the requirement of notifying Microsoft that the Azure Hybrid Benefit has been enabled as is specified in the product terms. This process negates needing to manage licensing registration forms for each resource.  

- **Free**: The extension in all three manageability modes is completely free. There is no additional cost associated with the extension, or with changing management modes. 

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



## Feature benefits 

The SQL Server IaaS Agent extension unlocks a number of feature benefits for managing your SQL Server VM. You can register your SQL Server VM in lightweight management mode, which unlocks a few of the benefits, or in full management mode, which unlocks all available benefits.

The following table details these benefits: 

[!INCLUDE [SQL VM feature benefits](../../includes/sql-vm-feature-benefits.md)]



## Management modes

You can choose to register your SQL IaaS extension in three management modes: 

- **Lightweight** mode copies extension binaries to the VM, but does not install the agent. Lightweight mode _only_ supports changing the license type and edition of SQL Server and provides limited portal management. Use this option for SQL Server VMs with multiple instances, or those participating in a failover cluster instance (FCI). Lightweight mode is the default management mode when using the [automatic registration](sql-agent-extension-automatic-registration-all-vms.md) feature, or when a management type is not specified during manual registration. There is no impact to memory or CPU when using the lightweight mode, and there is no associated cost. 

- **Full** mode installs the SQL IaaS Agent to the VM to deliver full functionality. Use it for managing a SQL Server VM with a single instance. Full mode installs two Windows services that have a minimal impact to memory and CPU - these can be monitored through task manager. There is no cost associated with using the full manageability mode. System administrator permissions are required. As of September 2021, restarting the SQL Server service is no longer necessary when registering your SQL Server VM in full management mode. 

- **NoAgent** mode is dedicated to SQL Server 2008 and SQL Server 2008 R2 installed on Windows Server 2008. There is no impact to memory or CPU when using the NoAgent mode. There is no cost associated with using the NoAgent manageability mode, the SQL Server is not restarted, and an agent is not installed to the VM. 

You can view the current mode of your SQL Server IaaS agent by using Azure PowerShell: 

  ```powershell-interactive
  # Get the SqlVirtualMachine
  $sqlvm = Get-AzSqlVM -Name $vm.Name  -ResourceGroupName $vm.ResourceGroupName
  $sqlvm.SqlManagementType
  ```


## Installation

Register your SQL Server VM with the SQL Server IaaS Agent extension to create the [**SQL virtual machine** _resource_](manage-sql-vm-portal.md) within your subscription, which is a _separate_ resource from the virtual machine resource. Unregistering your SQL Server VM from the extension will remove the **SQL virtual machine** _resource_ from your subscription but will not drop the actual virtual machine.

Deploying a SQL Server VM Azure Marketplace image through the Azure portal automatically registers the SQL Server VM with the extension in full. However, if you choose to self-install SQL Server on an Azure virtual machine, or provision an Azure virtual machine from a custom VHD, then you must register your SQL Server VM with the SQL IaaS extension to unlock feature benefits. 

Registering the extension in lightweight mode copies binaries but does not install the agent to the VM. The agent is installed to the VM when the extension is installed in full management mode. 

There are three ways to register with the extension: 
- [Automatically for all current and future VMs in a subscription](sql-agent-extension-automatic-registration-all-vms.md)
- [Manually for a single VM](sql-agent-extension-manually-register-single-vm.md)
- [Manually for multiple VMs in bulk](sql-agent-extension-manually-register-vms-bulk.md)

By default, Azure VMs with SQL Server 2016 or later installed will be automatically registered with the SQL IaaS Agent extension when detected by the [CEIP service](/sql/sql-server/usage-and-diagnostic-data-configuration-for-sql-server).  See the [SQL Server privacy supplement](/sql/sql-server/sql-server-privacy#non-personal-data) for more information.


### Named instance support

The SQL Server IaaS Agent extension works with a named instance of SQL Server if it is the only SQL Server instance available on the virtual machine. If a VM has multiple named SQL Server instances and no default instance, then the SQL IaaS extension will register in lightweight mode and pick either the instance with the highest edition, or the first instance, if all the instances have the same edition. 

To use a named instance of SQL Server, deploy an Azure virtual machine, install a single named SQL Server instance to it, and then register it with the [SQL IaaS Extension](sql-agent-extension-manually-register-single-vm.md).

Alternatively, to use a named instance with an Azure Marketplace SQL Server image, follow these steps: 

   1. Deploy a SQL Server VM from Azure Marketplace. 
   1. [Unregister](sql-agent-extension-manually-register-single-vm.md#unregister-from-extension) the SQL Server VM from the SQL IaaS Agent extension. 
   1. Uninstall SQL Server completely within the SQL Server VM.
   1. Install SQL Server with a named instance within the SQL Server VM. 
   1. [Register the VM with the SQL IaaS Agent Extension](sql-agent-extension-manually-register-single-vm.md#full-mode). 

## Verify status of extension

Use the Azure portal or Azure PowerShell to check the status of the extension. 

### Azure portal

Verify the extension is installed in the Azure portal. 

Go to your **Virtual machine** resource in the Azure portal (not the *SQL virtual machines* resource, but the resource for your VM). Select **Extensions** under **Settings**.  You should see the **SqlIaasExtension** extension listed, as in the following example: 

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

- SQL Server VMs deployed through the Azure Resource Manager. SQL Server VMs deployed through the classic model are not supported. 
- SQL Server VMs deployed to the public or Azure Government cloud. Deployments to other private or government clouds are not supported. 
- Failover cluster instances (FCIs) in lightweight mode. 
- Named instances with multiple instances on a single VM in lightweight mode. 


## <a id="in-region-data-residency"></a> Privacy statement

When using SQL Server on Azure VMs and the SQL IaaS extension, consider the following privacy statements: 

- **Data collection**: The SQL IaaS Agent extension collects data for the express purpose of giving customers optional benefits when using SQL Server on Azure Virtual Machines. Microsoft **will not use this data for licensing audits** without the customer's advance consent.See the [SQL Server privacy supplement](/sql/sql-server/sql-server-privacy#non-personal-data) for more information.

- **In-region data residency**: SQL Server on Azure VMs and SQL IaaS Agent Extension do not move or store customer data out of the region in which the VMs are deployed.


## Next steps

To install the SQL Server IaaS extension to SQL Server on Azure VMs, see the articles for [Automatic installation](sql-agent-extension-automatic-registration-all-vms.md), [Single VMs](sql-agent-extension-manually-register-single-vm.md), or [VMs in bulk](sql-agent-extension-manually-register-vms-bulk.md).

For more information about running SQL Server on Azure Virtual Machines, see the [What is SQL Server on Azure Virtual Machines?](sql-server-on-azure-vm-iaas-what-is-overview.md).

To learn more, see [frequently asked questions](frequently-asked-questions-faq.yml).
