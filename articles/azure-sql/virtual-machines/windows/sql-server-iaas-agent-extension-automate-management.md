---
title: What is the SQL Server IaaS Agent extension? 
description: This article describes how the SQL Server IaaS Agent extension helps automate management specific administration tasks of of SQL Server on Azure VMs. These include automated backup, automated patching, and Azure Key Vault integration.
services: virtual-machines-windows
documentationcenter: ''
author: MashaMSFT
editor: ''
tags: azure-resource-manager
ms.assetid: effe4e2f-35b5-490a-b5ef-b06746083da4
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 08/30/2019
ms.author: mathoma
ms.reviewer: jroth
ms.custom: "seo-lt-2019"
---
# What is the SQL Server IaaS Agent extension?
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]


The SQL Server IaaS Agent extension (SqlIaasExtension) runs on SQL Server on Azure Virtual Machines (VMs) to automate management and administration tasks. 

This article provides an overview of the extension. To install the SQL Server IaaS extension to SQL Server on Azure VMs, see the articles for [Automatic installation](sql-vm-resource-provider-automatic-registration.md), [Single VMs](sql-vm-resource-provider-register.md),  or [VMs in bulk](sql-vm-resource-provider-bulk-register). 

## Overview

The SQL Server IaaS Agent extension provides a number of benefits for SQL Server on Azure VMs: 

- **Feature benefits**: The extension unlocks a number of automation feature benefits, such as portal management, license flexibility, automated backup, automated patching and more. See [Feature benefits](#feature-benefits) later in this article for details. 

- **Compliance**: The extension offers a simplified method of fulfilling the requirement to notify Microsoft that the Azure Hybrid Benefit has been enabled as is specified in the product terms. This process negates needing to manage licensing registration forms for each resource.  

- **Free**: The extension in all three manageability modes is completely free. There is no additional cost associated with the resource provider, or with changing management modes. 

- **Simplified license management**: The extension simplifies SQL Server license management, and allows you to quickly identify SQL Server VMs with the Azure Hybrid Benefit enabled using the [Azure portal](manage-sql-vm-portal.md), the Azure CLI, or PowerShell: 

   # [Azure CLI](#tab/azure-cli)

   ```azurecli-interactive
   $vms = az sql vm list | ConvertFrom-Json
   $vms | Where-Object {$_.sqlServerLicenseType -eq "AHUB"}
   ```

   # [PowerShell](#tab/azure-powershell)

   ```powershell-interactive
   Get-AzSqlVM | Where-Object {$_.LicenseType -eq 'AHUB'}
   ```

   ---

## Management modes

The SQL IaaS extension has three management modes:

- **Lightweight** mode does not require the restart of SQL Server, but supports only changing the license type and edition of SQL Server. Use this option for SQL Server VMs with multiple instances, or participating in a failover cluster instance (FCI). There is no impact to memory or CPU when using the lightweight mode, and there is no associated cost. It is recommended to register your SQL Server VM in lightweight mode first, and then upgrade to Full mode during a scheduled maintenance window.  

- **Full** mode delivers all functionality, but requires a restart of the SQL Server and system administrator permissions. This is the option that's installed by default when installing the SQL IaaS extension manually. Use it for managing a SQL Server VM with a single instance. Full mode installs two windows services that have a minimal impact to memory and CPU - these can be monitored through task manager. There is no cost associated with using the full manageability mode. 

- **NoAgent** mode is dedicated to SQL Server 2008 and SQL Server 2008 R2 installed on Windows Server 2008. There is no impact to memory or CPU when using the NoAgent mode. There is no cost associated with using the NoAgent manageability mode. 

You can view the current mode of your SQL Server IaaS agent by using Azure Powershell: 

  ```powershell-interactive
  # Get the SqlVirtualMachine
  $sqlvm = Get-AzSqlVM -Name $vm.Name  -ResourceGroupName $vm.ResourceGroupName
  $sqlvm.SqlManagementType
  ```

## Feature benefits 

The SQL Server IaaS Agent extension unlocks a number of feature benefits for managing your SQL Server VM. 

The following table details these benefits: 


| Feature | Description |
| --- | --- |
| **Portal management** | Unlocks [management in the portal](manage-sql-vm-portal.md), so that you can view all of your SQL Server VMs in one place, and so that you can enable and disable SQL specific features directly from the portal. 
| **Automated backup** |Automates the scheduling of backups for all databases for either the default instance or a [properly installed](frequently-asked-questions-faq.md#administration) named instance of SQL Server on the VM. For more information, see [Automated backup for SQL Server in Azure virtual machines (Resource Manager)](automated-backup-sql-2014.md). |
| **Automated patching** |Configures a maintenance window during which important Windows updates to your VM can take place, so  you can avoid updates during peak times for your workload. For more information, see [Automated patching for SQL Server in Azure virtual machines (Resource Manager)](automated-patching.md). |
| **Azure Key Vault integration** |Enables you to automatically install and configure Azure Key Vault on your SQL Server VM. For more information, see [Configure Azure Key Vault integration for SQL Server on Azure Virtual Machines (Resource Manager)](azure-key-vault-integration-configure.md). |
| **Flexible licensing** | Save on cost by [seamlessly transitioning](licensing-model-azure-hybrid-benefit-ahb-change.md) from the bring-your-own-license (also known as the Azure Hybrid Benefit) to the pay-as-you-go licensing model and back again. You can also [change the ] | 
| **Flexible version / edition** | If you decide to change the [version](change-sql-server-version.md) or [edition](change-sql-server-edition.md) of SQL Server, you can update the metadata within the Azure portal without having to redeploy the entire SQL Server VM.  | 


## Installation

The SQL Server IaaS Agent extension is installed when you register your SQL Server VMs with the SQL VM resource provider. Registering with the resource provider creates the **SQL virtual machine** _resource_ within your subscription, which is a _separate_ resource from the virtual machine resource. Unregistering your SQL Server VM from the resource provider will remove the **SQL virtual machine** _resource_ but will not drop the actual virtual machine.

Deploying a SQL Server VM Azure Marketplace image through the Azure portal automatically registers the SQL Server VM with the resource provider. However, if you choose to self-install SQL Server on an Azure virtual machine, or provision an Azure virtual machine from a custom VHD, then you must register your SQL Server VM with the SQL VM resource provider to install the SQL IaaS Agent extension. 

To install the extension, register the SQL Server VM with the resource provider:
- [Automatically for all current and future VMs in a subscription](sql-vm-resource-provider-automatic-registration.md)
- [For a single VM](sql-vm-resource-provider-register.md)
- [For multiple VMs in bulk](sql-vm-resource-provider-bulk-register)




### Install on a VM with a single named SQL Server instance

The SQL Server IaaS extension will work with a named instance on SQL Server if the default instance is uninstalled and the SQL IaaS extension is reinstalled.

To use a named instance of SQL Server, follow these steps:
   1. Deploy a SQL Server VM from Azure Marketplace. 
   1. Uninstall the IaaS extension from the [Azure portal](https://portal.azure.com).
   1. Uninstall SQL Server completely within the SQL Server VM.
   1. Install SQL Server with a named instance within the SQL Server VM. 
   1. Install the IaaS extension from the Azure portal.  


## Get status of extension

One way to verify that the extension is installed is to view the agent status in the Azure portal. Select **All settings** in the virtual machine window, and then select **Extensions**. You should see the **SqlIaasExtension** extension listed.

![Status of the SQL Server IaaS Agent extension in the Azure portal](./media/sql-server-iaas-agent-extension-automate-management/azure-rm-sql-server-iaas-agent-portal.png)

You can also use the **Get-AzVMSqlServerExtension** Azure Powershell cmdlet:

   ```powershell-interactive
   Get-AzVMSqlServerExtension -VMName "vmname" -ResourceGroupName "resourcegroupname"
   ```

The previous command confirms that the agent is installed and provides general status information. You can get specific status information about automated backup and patching by using the following commands:

   ```powershell-interactive
    $sqlext = Get-AzVMSqlServerExtension -VMName "vmname" -ResourceGroupName "resourcegroupname"
    $sqlext.AutoPatchingSettings
    $sqlext.AutoBackupSettings
   ```

## Removal

In the Azure portal, you can uninstall the extension by selecting the ellipsis in the **Extensions** window of your virtual machine properties. Then select **Delete**.

![Uninstalling the SQL Server IaaS Agent extension in Azure portal](./media/sql-server-iaas-agent-extension-automate-management/azure-rm-sql-server-iaas-agent-uninstall.png)

You can also use the **Remove-AzVMSqlServerExtension** Azure Powershell cmdlet:

   ```powershell-interactive
    Remove-AzVMSqlServerExtension -ResourceGroupName "resourcegroupname" -VMName "vmname" -Name "SqlIaasExtension"
   ```

## Next steps

To install the SQL Server IaaS extension to SQL Server on Azure VMs, see the articles for [Automatic installation](sql-vm-resource-provider-automatic-registration.md), [Single VMs](sql-vm-resource-provider-register.md), or [VMs in bulk](sql-vm-resource-provider-bulk-register).

For more information about running SQL Server on Azure Virtual Machines, see the [What is SQL Server on Azure Virtual Machines?](sql-server-on-azure-vm-iaas-what-is-overview.md).
