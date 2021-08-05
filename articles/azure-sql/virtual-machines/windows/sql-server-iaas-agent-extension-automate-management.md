---
title: What is the SQL Server IaaS Agent extension? 
description: This article describes how the SQL Server IaaS Agent extension helps automate management specific administration tasks of SQL Server on Azure VMs. These include features such as automated backup, automated patching, Azure Key Vault integration, licensing management, storage configuration, and central management of all SQL Server VM instances.
services: virtual-machines-windows
documentationcenter: ''
author: MashaMSFT
editor: ''
tags: azure-resource-manager
ms.assetid: effe4e2f-35b5-490a-b5ef-b06746083da4
ms.service: virtual-machines-sql
ms.subservice: management
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 11/07/2020
ms.author: mathoma
ms.reviewer: jroth
ms.custom: "seo-lt-2019"
---
# Automate management with the SQL Server IaaS Agent extension
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]


The SQL Server IaaS Agent extension (SqlIaasExtension) runs on SQL Server on Azure Virtual Machines (VMs) to automate management and administration tasks. 

This article provides an overview of the extension. To install the SQL Server IaaS extension to SQL Server on Azure VMs, see the articles for [Automatic installation](sql-agent-extension-automatic-registration-all-vms.md), [Single VMs](sql-agent-extension-manually-register-single-vm.md),  or [VMs in bulk](sql-agent-extension-manually-register-vms-bulk.md). 

## Overview

The SQL Server IaaS Agent extension allows for integration with the Azure portal, and depending on the management mode, unlocks a number of feature benefits for SQL Server on Azure VMs: 

- **Feature benefits**: The extension unlocks a number of automation feature benefits, such as portal management, license flexibility, automated backup, automated patching and more. See [Feature benefits](#feature-benefits) later in this article for details. 

- **Compliance**: The extension offers a simplified method of fulfilling the requirement to notify Microsoft that the Azure Hybrid Benefit has been enabled as is specified in the product terms. This process negates needing to manage licensing registration forms for each resource.  

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


> [!IMPORTANT]
> The SQL IaaS Agent extension collects data for the express purpose of giving customers optional benefits when using SQL Server within Azure Virtual Machines. Microsoft will not use this data for licensing audits without the customer's advance consent. See the [SQL Server privacy supplement](/sql/sql-server/sql-server-privacy#non-personal-data) for more information.


## Feature benefits 

The SQL Server IaaS Agent extension unlocks a number of feature benefits for managing your SQL Server VM. 

The following table details these benefits: 


| Feature | Description |
| --- | --- |
| **Portal management** | Unlocks [management in the portal](manage-sql-vm-portal.md), so that you can view all of your SQL Server VMs in one place, and so that you can enable and disable SQL specific features directly from the portal. <br/> Management mode: Lightweight & full|  
| **Automated backup** |Automates the scheduling of backups for all databases for either the default instance or a [properly installed](./frequently-asked-questions-faq.yml#administration) named instance of SQL Server on the VM. For more information, see [Automated backup for SQL Server in Azure virtual machines (Resource Manager)](automated-backup-sql-2014.md). <br/> Management mode: Full|
| **Automated patching** |Configures a maintenance window during which important Windows and SQL Server security updates to your VM can take place, so  you can avoid updates during peak times for your workload. For more information, see [Automated patching for SQL Server in Azure virtual machines (Resource Manager)](automated-patching.md). <br/> Management mode: Full|
| **Azure Key Vault integration** |Enables you to automatically install and configure Azure Key Vault on your SQL Server VM. For more information, see [Configure Azure Key Vault integration for SQL Server on Azure Virtual Machines (Resource Manager)](azure-key-vault-integration-configure.md). <br/> Management mode: Full|
| **View disk utilization in portal** | Allows you to view a graphical representation of the disk utilization of your SQL data files in the Azure portal.  <br/> Management mode: Full | 
| **Flexible licensing** | Save on cost by [seamlessly transitioning](licensing-model-azure-hybrid-benefit-ahb-change.md) from the bring-your-own-license (also known as the Azure Hybrid Benefit) to the pay-as-you-go licensing model and back again. <br/> Management mode: Lightweight & full| 
| **Flexible version / edition** | If you decide to change the [version](change-sql-server-version.md) or [edition](change-sql-server-edition.md) of SQL Server, you can update the metadata within the Azure portal without having to redeploy the entire SQL Server VM.  <br/> Management mode: Lightweight & full| 
| **Security Center Portal integration** | If you've enabled [Azure Defender for SQL](../../../security-center/defender-for-sql-usage.md), then you can view Security Center recommendations directly in the [SQL virtual machines](manage-sql-vm-portal.md) resource of the Azure portal. See [Security best practices](security-considerations-best-practices.md) to learn more.  <br/> Management mode: Lightweight & full| 


## Management modes

You can choose to register your SQL IaaS extension in three management modes: 

- **Lightweight** mode copies extension binaries to the VM, but does not install the agent, and does not restart the SQL Server service. Lightweight mode only supports changing the license type and edition of SQL Server and provides limited portal management. Use this option for SQL Server VMs with multiple instances, or those participating in a failover cluster instance (FCI). Lightweight mode is the default management mode when using the [automatic registration](sql-agent-extension-automatic-registration-all-vms.md) feature, or when a management type is not specified during manual registration. There is no impact to memory or CPU when using the lightweight mode, and there is no associated cost. It is recommended to register your SQL Server VM in lightweight mode first, and then upgrade to Full mode during a scheduled maintenance window. 

- **Full** mode installs the SQL IaaS Agent to the VM to deliver all functionality, but requires a restart of the SQL Server service and system administrator permissions. Use it for managing a SQL Server VM with a single instance. Full mode installs two windows services that have a minimal impact to memory and CPU - these can be monitored through task manager. There is no cost associated with using the full manageability mode. 

- **NoAgent** mode is dedicated to SQL Server 2008 and SQL Server 2008 R2 installed on Windows Server 2008. There is no impact to memory or CPU when using the NoAgent mode. There is no cost associated with using the NoAgent manageability mode, the SQL Server is not restarted, and an agent is not installed to the VM. 

You can view the current mode of your SQL Server IaaS agent by using Azure PowerShell: 

  ```powershell-interactive
  # Get the SqlVirtualMachine
  $sqlvm = Get-AzSqlVM -Name $vm.Name  -ResourceGroupName $vm.ResourceGroupName
  $sqlvm.SqlManagementType
  ```


## Installation

Register your SQL Server VM with the SQL Server IaaS Agent extension to create the **SQL virtual machine** _resource_ within your subscription, which is a _separate_ resource from the virtual machine resource. Unregistering your SQL Server VM from the extension will remove the **SQL virtual machine** _resource_ but will not drop the actual virtual machine.

Deploying a SQL Server VM Azure Marketplace image through the Azure portal automatically registers the SQL Server VM with the extension. However, if you choose to self-install SQL Server on an Azure virtual machine, or provision an Azure virtual machine from a custom VHD, then you must register your SQL Server VM with the SQL IaaS extension to unlock feature benefits. 

Registering the extension in lightweight mode will copy the binaries but not install the agent to the VM. The agent is installed to the VM when the extension is upgraded to full management mode. 

There are three ways to register with the extension: 
- [Automatically for all current and future VMs in a subscription](sql-agent-extension-automatic-registration-all-vms.md)
- [Manually for a single VM](sql-agent-extension-manually-register-single-vm.md)
- [Manually for multiple VMs in bulk](sql-agent-extension-manually-register-vms-bulk.md)

### Named instance support

The SQL Server IaaS Agent extension works with a named instance of SQL Server if it is the only SQL Server instance available on the virtual machine. The extension fails to install on VMs that have multiple named SQL Server instances if there is no default instance on the VM. 

To use a named instance of SQL Server, deploy an Azure virtual machine, install a single named SQL Server instance to it, and then register it with the [SQL IaaS Extension](sql-agent-extension-manually-register-single-vm.md).

Alternatively, to use a named instance with an Azure Marketplace SQL Server image, follow these steps: 

   1. Deploy a SQL Server VM from Azure Marketplace. 
   1. [Unregister](sql-agent-extension-manually-register-single-vm.md#unregister-from-extension) the SQL Server VM from the SQL IaaS Agent extension. 
   1. Uninstall SQL Server completely within the SQL Server VM.
   1. Install SQL Server with a named instance within the SQL Server VM. 
   1. [Register the VM with the SQL IaaS Agent Extension](sql-agent-extension-manually-register-single-vm.md#register-with-extension). 

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

- SQL Server VMs deployed through the Azure Resource Manager. SQL Server VMs deployed through the classic model are not supported. 
- SQL Server VMs deployed to the public or Azure Government cloud. Deployments to other private or government clouds are not supported. 


## In-region data residency
Azure SQL virtual machine and the SQL IaaS Agent Extension do not move or store customer data out of the region in which they are deployed.

## Next steps

To install the SQL Server IaaS extension to SQL Server on Azure VMs, see the articles for [Automatic installation](sql-agent-extension-automatic-registration-all-vms.md), [Single VMs](sql-agent-extension-manually-register-single-vm.md), or [VMs in bulk](sql-agent-extension-manually-register-vms-bulk.md).

For more information about running SQL Server on Azure Virtual Machines, see the [What is SQL Server on Azure Virtual Machines?](sql-server-on-azure-vm-iaas-what-is-overview.md).

To learn more, see [frequently asked questions](frequently-asked-questions-faq.yml).