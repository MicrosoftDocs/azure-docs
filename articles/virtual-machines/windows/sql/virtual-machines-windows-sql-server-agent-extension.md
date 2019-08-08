---
title: Automate management tasks on Azure virtual machines by using the SQL Server IaaS Agent Extension | Microsoft Docs
description: This article describes how to manage the SQL Server IaaS Agent Extension, which automates specific SQL Server administration tasks. These include automated backup, automated patching, and Azure Key Vault integration.
services: virtual-machines-windows
documentationcenter: ''
author: MashaMSFT
manager: jroth
editor: ''
tags: azure-resource-manager
ms.assetid: effe4e2f-35b5-490a-b5ef-b06746083da4
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 06/24/2019
ms.author: mathoma
ms.reviewer: jroth
---
# Automate management tasks on Azure virtual machines by using the SQL Server IaaS Agent Extension
> [!div class="op_single_selector"]
> * [Resource Manager](virtual-machines-windows-sql-server-agent-extension.md)
> * [Classic](../sqlclassic/virtual-machines-windows-classic-sql-server-agent-extension.md)

The SQL Server IaaS Agent Extension (SqlIaasExtension) runs on Azure virtual machines to automate administration tasks. This article provides an overview of the services that the extension supports. This article also provides instructions for installation, status, and removal of the extension.

[!INCLUDE [learn-about-deployment-models](../../../../includes/learn-about-deployment-models-rm-include.md)]

To view the classic version of this article, see [SQL Server IaaS Agent Extension for SQL Server VMs (classic)](../sqlclassic/virtual-machines-windows-classic-sql-server-agent-extension.md).

There are three manageability modes for the SQL Server IaaS extension: 

- **Full** mode delivers all functionality, but requires a restart of the SQL Server and system administrator permissions. This is the option that's installed by default. Use it for managing a SQL Server VM with a single instance. 

- **Lightweight** does not require the restart of SQL Server, but it supports only changing the license type and edition of SQL Server. Use this option for SQL Server VMs with multiple instances, or for participating in a failover cluster instance (FCI). 

- **NoAgent** is dedicated for SQL Server 2008 and SQL Server 2008 R2 installed on Windows Server 2008. For information on using this mode for your Windows Server 2008 image, see [Windows Server 2008 registration](virtual-machines-windows-sql-register-with-resource-provider.md#register-sql-server-2008-or-2008-r2-on-windows-server-2008-vms). 

## Supported services
The SQL Server IaaS Agent Extension supports the following administration tasks:

| Administration feature | Description |
| --- | --- |
| **SQL Server automated backup** |Automates the scheduling of backups for all databases for either the default instance or a [properly installed](virtual-machines-windows-sql-server-iaas-faq.md#administration) named instance of SQL Server on the VM. For more information, see [Automated backup for SQL Server in Azure virtual machines (Resource Manager)](virtual-machines-windows-sql-automated-backup.md). |
| **SQL Server automated patching** |Configures a maintenance window during which important Windows updates to your VM can take place, so  you can avoid updates during peak times for your workload. For more information, see [Automated patching for SQL Server in Azure virtual machines (Resource Manager)](virtual-machines-windows-sql-automated-patching.md). |
| **Azure Key Vault integration** |Enables you to automatically install and configure Azure Key Vault on your SQL Server VM. For more information, see [Configure Azure Key Vault integration for SQL Server on Azure Virtual Machines (Resource Manager)](virtual-machines-windows-ps-sql-keyvault.md). |

After the SQL Server Iaas Agent Extension is installed and running, it makes the administration features available:

* On the SQL Server panel of the virtual machine in the Azure portal and through Azure PowerShell for SQL Server images on Azure Marketplace.
* Through Azure PowerShell for manual installations of the extension. 

## Prerequisites
Here are the requirements to use the SQL Server IaaS Agent Extension on your VM:

**Operating system**:

* Windows Server 2008 R2
* Windows Server 2012
* Windows Server 2012 R2
* Windows Server 2016
* Windows Server 2019 

**SQL Server version**:

* SQL Server 2008 
* SQL Server 2008 R2
* SQL Server 2012
* SQL Server 2014
* SQL Server 2016
* SQL Server 2017

**Azure PowerShell**:

* [Download and configure the latest Azure PowerShell commands](/powershell/azure/overview)

[!INCLUDE [updated-for-az.md](../../../../includes/updated-for-az.md)]


## Change management modes

You can view the current mode of your SQL Server IaaS agent by using PowerShell: 

  ```powershell-interactive
     //Get the SqlVirtualMachine
     $sqlvm = Get-AzResource -Name $vm.Name  -ResourceGroupName $vm.ResourceGroupName  -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines
     $sqlvm.Properties.sqlManagement
  ```

SQL Server VMs that have the *lightweight* IaaS extension installed can upgrade the mode to _full_ using the Azure portal. SQL Server VMs in _No-Agent_ mode can upgrade to _full_ after the OS is upgraded to Windows 2008 R2 and above. It is not possible to downgrade - to do so, you will need to completely uninstall the SQL IaaS extension and install it again. 

To upgrade the agent mode to full: 


# [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to your [SQL virtual machines](virtual-machines-windows-sql-manage-portal.md#access-the-sql-virtual-machines-resource) resource. 
1. Select your SQL Server virtual machine, and select **Overview**. 
1. For SQL Server VMs with the NoAgent or lightweight IaaS mode, select the **Only license type and edition updates are available with the SQL IaaS extension** message.

   ![Selections for changing the mode from the portal](media/virtual-machines-windows-sql-server-agent-extension/change-sql-iaas-mode-portal.png)

1. Select the **I agree to restart the SQL Server service on the virtual machine** check box, and then select **Confirm** to upgrade your IaaS mode to full. 

    ![Check box for agreeing to restart the SQL Server service on the virtual machine](media/virtual-machines-windows-sql-server-agent-extension/enable-full-mode-iaas.png)

# [AZ CLI](#tab/bash)

Run the following Az CLI code snippet:

  ```azurecli-interactive
  # Update to full mode

  az sql vm update --name <vm_name> --resource-group <resource_group_name> --sql-mgmt-type full  
  ```

# [PowerShell](#tab/powershell)

Run the following PowerShell code snippet:

  ```powershell-interactive
  # Update to full mode

  $SqlVm = Get-AzResource -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines -ResourceGroupName <resource_group_name> -ResourceName <VM_name>
  $SqlVm.Properties.sqlManagement="Full"
  $SqlVm | Set-AzResource -Force
  ```

---


##  Installation
The SQL Server IaaS extension is installed when you register your SQL Server VM with the [SQL VM resource provider](virtual-machines-windows-sql-register-with-resource-provider.md). If necessary, you can install the SQL Server IaaS agent manually by using full or lightweight mode. 

The SQL Server IaaS Agent Extension in full mode is automatically installed when you provision one of the SQL Server virtual machine Azure Marketplace images by using the Azure portal. 

### Install in full mode
The full mode for the SQL Server IaaS extension offers full manageability for a single instance on the SQL Server VM. If there is a default instance, the extension will work with the default instance, and it won't support managing other instances. If there is no default instance but only one named instance, it will manage the named instance. If there is no default instance and there are multiple named instances, the extension will fail to be installed. 

Install the SQL Server IaaS agent with full mode by using PowerShell:

  ```powershell-interactive
     // Get the existing compute VM
     $vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
          
     // Register the SQL Server VM with 'Full' SQL Server IaaS agent
     New-AzResource -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
        -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines `
        -Properties @{virtualMachineResourceId=$vm.Id;sqlServerLicenseType='AHUB';sqlManagement='Full'}  
  
  ```

| Parameter | Acceptable values                        |
| :------------------| :-------------------------------|
| **sqlServerLicenseType** | `AHUB` or `PAYG`     |
| &nbsp;             | &nbsp;                          |


> [!NOTE]
> If the extension is not already installed, installing the full extension restarts the SQL Server service. To avoid restarting the SQL Server service, install the lightweight mode with limited manageability instead.
> 
> Updating the SQL Server IaaS extension does not restart the SQL Server service. 

### Install on a VM with a single named SQL Server instance
The SQL Server IaaS extension will work with a named instance on SQL Server if the default instance is uninstalled and the IaaS extension is reinstalled.

To use a named instance of SQL Server:
   1. Deploy a SQL Server VM from Azure Marketplace. 
   1. Uninstall the IaaS extension from the [Azure portal](https://portal.azure.com).
   1. Uninstall SQL Server completely within the SQL Server VM.
   1. Install SQL Server with a named instance within the SQL Server VM. 
   1. Install the IaaS extension from the Azure portal.  


### Install in lightweight mode
Lightweight mode will not restart your SQL Server service, but it offers limited functionality. 

Install the SQL Server IaaS agent with lightweight mode by using PowerShell:


  ```powershell-interactive
     // Get the existing  Compute VM
     $vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
          
     // Register the SQL Server VM with the 'Lightweight' SQL IaaS agent
     New-AzResource -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
        -ResourceType Microsoft.SqlVirtualMachine/SqlVirtualMachines `
        -Properties @{virtualMachineResourceId=$vm.Id;sqlServerLicenseType='AHUB';sqlManagement='LightWeight'}  
  
  ```

| Parameter | Acceptable values                        |
| :------------------| :-------------------------------|
| **sqlServerLicenseType** | `AHUB` or `PAYG`     |
| &nbsp;             | &nbsp;                          |


## Get the status of the SQL Server IaaS extension
One way to verify that the extension is installed is to view the agent status in the Azure portal. Select **All settings** in the virtual machine window, and then select **Extensions**. You should see the **SqlIaasExtension** extension listed.

![Status of the SQL Server IaaS Agent Extension in the Azure portal](./media/virtual-machines-windows-sql-server-agent-extension/azure-rm-sql-server-iaas-agent-portal.png)

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

## Removal
In the Azure portal, you can uninstall the extension by selecting the ellipsis in the **Extensions** window of your virtual machine properties. Then select **Delete**.

![Uninstalling the SQL Server IaaS Agent Extension in Azure portal](./media/virtual-machines-windows-sql-server-agent-extension/azure-rm-sql-server-iaas-agent-uninstall.png)

You can also use the **Remove-AzVMSqlServerExtension** PowerShell cmdlet:

   ```powershell-interactive
    Remove-AzVMSqlServerExtension -ResourceGroupName "resourcegroupname" -VMName "vmname" -Name "SqlIaasExtension"
   ```

## Next steps
Begin using one of the services that the extension supports. For more information, see the articles referenced in the [Supported services](#supported-services) section of this article.

For more information about running SQL Server on Azure Virtual Machines, see the [What is SQL Server on Azure Virtual Machines?](virtual-machines-windows-sql-server-iaas-overview.md).

