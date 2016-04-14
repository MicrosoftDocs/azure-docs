<properties
	pageTitle="SQL Server IaaS Agent Extension (Classic) | Microsoft Azure"
	description="This topic describes the SQL Server agent extension, which enables a VM running SQL Server on Azure to use automation features. It uses the classic deployment mode."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="rothja"
	manager="jhubbard"
   editor=""    
   tags="azure-service-management"/>

<tags
	ms.service="virtual-machines-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows-sql-server"
	ms.workload="infrastructure-services"
	ms.date="04/08/2016"
	ms.author="jroth"/>

# SQL Server IaaS Agent Extension (Classic)

This extension enables SQL Server in Azure Virtual Machines to use certain services, listed in this article, which can only be used with this extension installed. This extension is automatically installed for SQL Server Gallery Images in the Azure portal. It can be installed on any SQL Server VM in Azure which has the Azure VM Guest Agent installed.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)] Resource Manager model.


## Prerequisites
Requirements for using Powershell cmdlets:

- Latest Azure PowerShell [available here](../powershell-install-configure.md)

Requirements to use the extension on your VM:

- Azure VM Guest Agent
- Windows Server 2012, Windows Server 2012 R2, or later
- SQL Server 2012, SQL Server 2014, or later

## Services available with the extension

- **SQL Automated Backup**: This service automates the scheduling of backups for all databases for the default instance of SQL Server in the VM. For more information, see [Automated backup for SQL Server in Azure Virtual Machines (Classic)](virtual-machines-windows-classic-sql-automated-backup.md).
- **SQL Automated Patching**: This service lets you configure a maintenance window during which updates to your VM can take place, so  you can avoid updates during peak times for your workload. For more information, see [Automated patching for SQL Server in Azure Virtual Machines (Classic)](virtual-machines-windows-classic-sql-automated-patching.md).
- **Azure Key Vault Integration**: This service allows you to automatically install and configure Azure Key Vault on your SQL Server VM. For more information, see [Configure Azure Key Vault Integration for SQL Server on Azure VMs (Classic)](virtual-machines-windows-classic-ps-sql-keyvault.md).

## Add the extension with Powershell
If you provision your SQL Server VM using the [Azure portal](virtual-machines-windows-portal-sql-server-provision.md), the extension will be automatically installed. For SQL Server VMs provisioned with the Azure classic portal, or for VMs to which you bring your own SQL license, you can add this extension using the **Set-AzureVMSqlServerExtension** Azure PowerShell cmdlet.

### Syntax

Set-AzureVMSqlServerExtension [[-ReferenceName] [String]] [-VM] IPersistentVM [[-Version] [String]] [[-AutoPatchingSettings] [AutoPatchingSettings]] [-AutoBackupSettings[AutoBackupSettings]] [-Profile [AzureProfile]] [CommonParameters]

> [AZURE.NOTE] Omitting the –Version parameter is recommended. Without it, the default is the latest version of the extension.

### Example
The following example configures automatic backup settings using a configuration defined in $abs (not shown here). The serviceName is the cloud service name that hosts the virtual machine. For a full example, see [Automated backup for SQL Server in Azure Virtual Machines (Classic)](virtual-machines-windows-classic-sql-automated-backup.md).

	Get-AzureVM –ServiceName "serviceName" –Name "vmName" | Set-AzureVMSqlServerExtension –AutoBackupSettings $abs | Update-AzureVM**

## Check the status of the extension
If you want to check the status of this extension and the services associated with it, you can use either portal. In the details of your existing VM, find **Extensions** under **Settings**.

You can also use the **Get-AzureVMSqlServerExtension** Azure Powershell cmdlet.

### Syntax

Get-AzureVMSqlServerExtension [[-VM] [IPersistentVM]] [-Profile [AzureProfile]] [CommonParameters]

### Example
	Get-AzureVM –ServiceName "service" –Name "vmname" | Get-AzureVMSqlServerExtension

## Remove the extension with Powershell   
If you want to remove this extension from your VM, you can use the **Remove-AzureVMSqlServerExtension** Azure Powershell cmdlet.

### Syntax

Remove-AzureVMSqlServerExtension [-Profile [AzureProfile]] -VM IPersistentVM [CommonParameters]
