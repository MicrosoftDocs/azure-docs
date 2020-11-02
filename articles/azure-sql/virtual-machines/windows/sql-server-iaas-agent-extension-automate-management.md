---
title: What is the SQL Server IaaS Agent extension? 
description: This article describes how the SQL Server IaaS Agent extension helps automate management specific administration tasks of SQL Server on Azure VMs. These include features such as automated backup, automated patching, Azure Key Vault integration, licensing management, and central management of all SQL Server VM instances and storage configuration.
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
ms.date: 10/30/2020
ms.author: mathoma
ms.reviewer: jroth
ms.custom: "seo-lt-2019"
---
# What is the SQL Server IaaS Agent extension?
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]


The SQL Server IaaS Agent extension (SqlIaasExtension) runs on SQL Server on Azure Virtual Machines (VMs) to automate management and administration tasks. 

This article provides an overview of the extension. To install the SQL Server IaaS extension to SQL Server on Azure VMs, see the articles for [Automatic installation](sql-vm-resource-provider-automatic-registration.md), [Single VMs](sql-vm-resource-provider-register.md),  or [VMs in bulk](sql-vm-resource-provider-bulk-register.md). 

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


## Management modes

The SQL IaaS extension has three management modes:

- **Lightweight** mode does not require the restart of SQL Server, but supports only changing the license type and edition of SQL Server. Use this option for SQL Server VMs with multiple instances, or participating in a failover cluster instance (FCI). This management mode keeps the SQL IaaS Agent extension binaries on the machine, but does not install the Agent. Lightweight mode is the default management mode when using the [automatic registration](sql-vm-resource-provider-automatic-registration.md) feature, or when a management type is not specified during manual registration. There is no impact to memory or CPU when using the lightweight mode, and there is no associated cost. It is recommended to register your SQL Server VM in lightweight mode first, and then upgrade to Full mode during a scheduled maintenance window.

- **Full** mode delivers all functionality, but requires a restart of the SQL Server and system administrator permissions. Use it for managing a SQL Server VM with a single instance. Full mode installs two windows services that have a minimal impact to memory and CPU - these can be monitored through task manager. There is no cost associated with using the full manageability mode. 

- **NoAgent** mode is dedicated to SQL Server 2008 and SQL Server 2008 R2 installed on Windows Server 2008. There is no impact to memory or CPU when using the NoAgent mode. There is no cost associated with using the NoAgent manageability mode. 

You can view the current mode of your SQL Server IaaS agent by using Azure PowerShell: 

  ```powershell-interactive
  # Get the SqlVirtualMachine
  $sqlvm = Get-AzSqlVM -Name $vm.Name  -ResourceGroupName $vm.ResourceGroupName
  $sqlvm.SqlManagementType
  ```

## Installation

The SQL Server IaaS Agent extension is installed when you register your SQL Server VMs with the SQL VM resource provider. Registering with the resource provider creates the **SQL virtual machine** _resource_ within your subscription, which is a _separate_ resource from the virtual machine resource. Unregistering your SQL Server VM from the resource provider will remove the **SQL virtual machine** _resource_ but will not drop the actual virtual machine.

Deploying a SQL Server VM Azure Marketplace image through the Azure portal automatically registers the SQL Server VM with the resource provider. However, if you choose to self-install SQL Server on an Azure virtual machine, or provision an Azure virtual machine from a custom VHD, then you must register your SQL Server VM with the SQL VM resource provider to install the SQL IaaS Agent extension. 

To install the extension, register the SQL Server VM with the resource provider:
- [Automatically for all current and future VMs in a subscription](sql-vm-resource-provider-automatic-registration.md)
- [For a single VM](sql-vm-resource-provider-register.md)
- [For multiple VMs in bulk](sql-vm-resource-provider-bulk-register.md)

### Named instance support

The SQL Server IaaS extension will work with a named instance of SQL Server if that is the only SQL Server instance available on the virtual machine. The extension will fail to install on VMs that have multiple SQL Server instances. 

To use a named instance of SQL Server, deploy an Azure virtual machine, install a single named SQL Server instance to it, and then register it with the [SQL VM resource provider](sql-vm-resource-provider-register.md) to install the extension.

Alternatively, to use a named instance with an Azure marketplace SQL Server image, follow these steps: 

   1. Deploy a SQL Server VM from Azure Marketplace. 
   1. [Unregister](sql-vm-resource-provider-register.md#unregister-from-rp) the SQL Server VM from the SQL VM resource provider. 
   1. Uninstall SQL Server completely within the SQL Server VM.
   1. Install SQL Server with a named instance within the SQL Server VM. 
   1. Install the SQL IaaS Agent extension by [registering the SQL Server VM with the SQL VM resource provider](sql-vm-resource-provider-register.md#register-with-rp). 

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


## Frequently asked questions 

**Should I register my SQL Server VM provisioned from a SQL Server image in Azure Marketplace?**

No. Microsoft automatically registers VMs provisioned from the SQL Server images in Azure Marketplace. Registering with the SQL VM resource provider is required only if the VM was *not* provisioned from the SQL Server images in Azure Marketplace and SQL Server was self-installed.

**Is the SQL VM resource provider available for all customers?** 

Yes. Customers should register their SQL Server VMs with the SQL VM resource provider if they did not use a SQL Server image from Azure Marketplace and instead self-installed SQL Server, or if they brought their custom VHD. VMs owned by all types of subscriptions (Direct, Enterprise Agreement, and Cloud Solution Provider) can register with the SQL VM resource provider.

**What is the default management mode when registering with the SQL VM resource provider?**

The default management mode when you register with the SQL VM resource provider is *lightweight*. If the SQL Server management property isn't set when you register with the SQL VM resource provider, the mode will be set as lightweight, and your SQL Server service will not restart. It is recommended to register with the SQL VM resource provider in lightweight mode first, and then upgrade to full during a maintenance window. Likewise, the default management is also lightweight when using the [automatic registration feature](sql-vm-resource-provider-automatic-registration.md).

**What are the prerequisites to register with the SQL VM resource provider?**

There are no prerequisites to registering with the SQL VM resource provider other than having SQL Server installed on the VM. Note that if the SQL IaaS agent extension is installed in full mode the SQL Server service will restart, so doing so during a maintenance window is recommended.

**Will registering with the SQL VM resource provider install an agent on my VM?**

Yes, registering with the SQL VM resource provider in full manageability mode installs an agent to the VM. Registering in lightweight, or NoAgent mode does not. 

Registering with the SQL VM resource provider in lightweight mode only copies the SQL IaaS Agent extension *binaries* to the VM, it does not install the agent. These binaries are then used to install the agent when the management mode is upgraded to full.


**Will registering with the SQL VM resource provider restart SQL Server on my VM?**

It depends on the mode specified during registration. If lightweight or NoAgent mode is specified, then the SQL Server service will not restart. However, specifying the management mode as full which will cause the SQL Server service to restart. The automatic registration feature registers your SQL Server VMs in lightweight mode, unless the Windows Server version is 2008, in which case the SQL Server VM will be registered in NoAgent mode. 

**What is the difference between lightweight and NoAgent management modes when registering with the SQL VM resource provider?** 

NoAgent management mode is the only available management mode for SQL Server 2008 and SQL Server 2008 R2 on Windows Server 2008. For all later versions of Windows Server, the two available manageability modes are lightweight and full. 

NoAgent mode requires SQL Server version and edition properties to be set by the customer. Lightweight mode queries the VM to find the version and edition of the SQL Server instance.

**Can I register with the SQL VM resource provider without specifying the SQL Server license type?**

No. The SQL Server license type is not an optional property when you're registering with the SQL VM resource provider. You have to set the SQL Server license type as pay-as-you-go or Azure Hybrid Benefit when registering with the SQL VM resource provider in all manageability modes (NoAgent, lightweight, and full).

**Can I upgrade the SQL Server IaaS extension from NoAgent mode to full mode?**

No. Upgrading the manageability mode to full or lightweight is not available for NoAgent mode. This is a technical limitation of Windows Server 2008. You will need to upgrade the OS first to Windows Server 2008 R2 or greater, and then you will be able to upgrade to full management mode. 

**Can I upgrade the SQL Server IaaS extension from lightweight mode to full mode?**

Yes. Upgrading the manageability mode from lightweight to full is supported via Azure PowerShell or the Azure portal. It requires restarting SQL Server service.

**Can I downgrade the SQL Server IaaS extension from full mode to NoAgent or lightweight management mode?**

No. Downgrading the SQL Server IaaS extension manageability mode is not supported. The manageability mode can't be downgraded from full mode to lightweight or NoAgent mode, and it can't be downgraded from lightweight mode to NoAgent mode. 

To change the manageability mode from full manageability, [unregister](sql-vm-resource-provider-register.md#unregister-from-rp) the SQL Server VM from the SQL VM resource provider by dropping the SQL Server *resource* and re-register the SQL Server VM with the SQL VM resource provider again in a different management mode.

**Can I register with the SQL VM resource provider from the Azure portal?**

No. Registering with the SQL VM resource provider is not available in the Azure portal. Registering with the SQL VM resource provider is only supported with the Azure CLI or Azure PowerShell. 

**Can I register a VM with the SQL VM resource provider before SQL Server is installed?**

No. A VM should have at least one SQL Server (Database Engine) instance to successfully register with the SQL VM resource provider. If there is no SQL Server instance on the VM, the new Microsoft.SqlVirtualMachine resource will be in a failed state.

**Can I register a VM with the SQL VM resource provider if there are multiple SQL Server instances?**

Yes. The SQL VM resource provider will register only one SQL Server (Database Engine) instance. The SQL VM resource provider will register the default SQL Server instance in the case of multiple instances. If there is no default instance, then only registering in lightweight mode is supported. To upgrade from lightweight to full manageability mode, either the default SQL Server instance should exist or the VM should have only one named SQL Server instance.

**Can I register a SQL Server failover cluster instance with the SQL VM resource provider?**

Yes. SQL Server failover cluster instances on an Azure VM can be registered with the SQL VM resource provider in lightweight mode. However, SQL Server failover cluster instances can't be upgraded to full manageability mode.

**Can I register my VM with the SQL VM resource provider if an Always On availability group is configured?**

Yes. There are no restrictions to registering a SQL Server instance on an Azure VM with the SQL VM resource provider if you're participating in an Always On availability group configuration.

**What is the cost for registering with the SQL VM resource provider, or with upgrading to full manageability mode?**

None. There is no fee associated with registering with the SQL VM resource provider, or with using any of the three manageability modes. Managing your SQL Server VM with the resource provider is completely free. 

**What is the performance impact of using the different manageability modes?**

There is no impact when using the *NoAgent* and *lightweight* manageability modes. There is minimal impact when using the *full* manageability mode from two services that are installed to the OS. These can be monitored via task manager and seen in the built-in Windows Services console. 

The two service names are:
- `SqlIaaSExtensionQuery` (Display name - `Microsoft SQL Server IaaS Query Service`)
- `SQLIaaSExtension` (Display name - `Microsoft SQL Server IaaS Agent`)

**How do I remove the extension?**

Remove the extension by [unregistering](sql-vm-resource-provider-register.md#unregister-from-rp) the SQL Server VM from the SQL VM resource provider. 

## Next steps

To install the SQL Server IaaS extension to SQL Server on Azure VMs, see the articles for [Automatic installation](sql-vm-resource-provider-automatic-registration.md), [Single VMs](sql-vm-resource-provider-register.md), or [VMs in bulk](sql-vm-resource-provider-bulk-register.md).

For more information about running SQL Server on Azure Virtual Machines, see the [What is SQL Server on Azure Virtual Machines?](sql-server-on-azure-vm-iaas-what-is-overview.md).