<properties 
	pageTitle="SQL Server IaaS Agent Extension" 
	description="Describes the SQL Server agent extension, which enables virtual machines running SQL Server in the cloud on Azure to use automation features, and how to install the agent if it isn't already installed automatically." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="jeffgoll" 
	manager="jeffreyg"
	editor=""/>

<tags
	ms.service="virtual-machines"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows-sql-server"
	ms.workload="infrastructure-services" 
	ms.date="06/17/2015"
	ms.author="jeffreyg"/>

# SQL Server IaaS Agent Extension

This extension enables SQL Server in Azure Virtual Machines to use certain services, listed in this article, which can only be used with this extension installed. This extension is automatically installed for SQL Server Gallery Images in the Azure Preview Portal. It can be installed on any SQL Server VM in Azure which has the Azure VM Guest Agent installed.
 
## Prerequisites
Requirements for using Powershell cmdlets:

- Latest Azure command-line SDK [available here](http://azure.microsoft.com/downloads/)

Requirements to use the extension on your VM:

- Azure VM Guest Agent
- Windows Server 2012, Windows Server 2012 R2, or later
- SQL Server 2012, SQL Server 2014, or later
 
## Services available with the extension

- **SQL automated backup**: This service automates the scheduling of backups for all databases for the default instance of SQL Server in the VM. To see more information about this service, see [Automated backup for SQL Server in Azure Virtual Machines](virtual-machines-sql-server-automated-backup.md).
- **SQL automated patching**: This service lets you configure a maintenance window during which updates to your VM can take place, so  you can avoid updates during peak times for your workload. To see more information about this service, see [Automated patching for SQL Server in Azure Virtual Machines](virtual-machines-sql-server-automated-patching.md).

## Add the extension with Powershell
If you provision your SQL Server VM using the [Azure Preview Portal](https://portal.azure.com/), the extension will be automatically installed. For SQL Server VMs provisioned with the [Azure Management Portal](https://manage.windowsazure.com), or for VMs which you bring your own SQL license to, you can add this extension to an existing VM using the following Azure PowerShell cmdlet.

**Set-AzureVMSqlServerExtension**

### Syntax

Set-AzureVMSqlServerExtension [-VM] <IPersistentVM> [[-Version] <string>] [-AutoBackupSettings <AutoBackupSettings>] [-AutoPatchingSetttings <AutoPatchingSetttings>] [-Confirm] [-WhatIf] [<CommonParameters>]

> [AZURE.NOTE] Omitting the –Version parameter is recommended. Without it, the default is the latest version of the extension.

### Example
	Get-AzureVM –ServiceName serviceName –Name vmName | Set-AzureVMSqlServerExtension –AutoBackupSettings $abs | Update-AzureVM**

## Check the status of the extension
If you want to check the status of this extension and the services associated with it, you can use either portal. In the details of your existing VM, find **Extensions** under **Settings**. 

You can also use the following Azure Powershell cmdlet.

**Get-AzureVMSqlServerExtension**

### Syntax

Get-AzureVMSqlServerExtension [[-VM] <IPersistentVM>] [[-Version] <string>] [<CommonParameters>]

> [AZURE.NOTE] You can omit the –Version parameter. Without it, the default is the latest version of the extension.

### Example
	Get-AzureVM –ServiceName "service" –Name "vmname" | Get-AzureVMSqlServerExtension

## Remove the extension with Powershell   
If you want to remove this extension from your VM, you can use the following Azure Powershell cmdlet.

**Remove-AzureVMSqlServerExtension**

### Syntax
Remove-AzureVMSqlServerExtension -VM <IPersistentVM> [<CommonParameters>] 
