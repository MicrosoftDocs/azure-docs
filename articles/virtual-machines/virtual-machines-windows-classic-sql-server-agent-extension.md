<properties
	pageTitle="SQL Server Agent Extension for SQL Server VMs (Classic) | Microsoft Azure"
	description="This topic describes how to manage the SQL Server agent extension, which automates specific SQL Server administration tasks. These include Automated Backup, Automated Patching, and Azure Key Vault Integration. This topic uses the classic deployment mode."
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
	ms.date="07/14/2016"
	ms.author="jroth"/>

# SQL Server Agent Extension for SQL Server VMs (Classic)

> [AZURE.SELECTOR]
- [Resource Manager](virtual-machines-windows-sql-server-agent-extension.md)
- [Classic](virtual-machines-windows-classic-sql-server-agent-extension.md)

The SQL Server IaaS Agent Extension (SQLIaaSAgent) runs on Azure virtual machines to automate administration tasks. This topic provides an overview of the services supported by the extension as well as instructions for installation, status, and removal.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)] To view the Resource Manager version of this article, see [SQL Server Agent Extension for SQL Server VMs Resource Manager](virtual-machines-windows-sql-server-agent-extension.md).

## Supported services

The SQL Server IaaS Agent Extension supports the following administration tasks:

| Administration feature | Description |
|---------------------|-------------------------------|
| **SQL Automated Backup** | Automates the scheduling of backups for all databases for the default instance of SQL Server in the VM. For more information, see [Automated backup for SQL Server in Azure Virtual Machines (Classic)](virtual-machines-windows-classic-sql-automated-backup.md).|
| **SQL Automated Patching** | Configures a maintenance window during which updates to your VM can take place, so  you can avoid updates during peak times for your workload. For more information, see [Automated patching for SQL Server in Azure Virtual Machines (Classic)](virtual-machines-windows-classic-sql-automated-patching.md).|
| **Azure Key Vault Integration** | Enables you to automatically install and configure Azure Key Vault on your SQL Server VM. For more information, see [Configure Azure Key Vault Integration for SQL Server on Azure VMs (Classic)](virtual-machines-windows-classic-ps-sql-keyvault.md).|

## Prerequisites

Requirements to use the SQL Server IaaS Agent Extension on your VM:

**Operating System**:

- Windows Server 2012
- Windows Server 2012 R2

**SQL Server versions**:

- SQL Server 2012
- SQL Server 2014
- SQL Server 2016

**Azure PowerShell**:

- [Download and configure the latest Azure PowerShell commands](../powershell-install-configure.md)

**Virtual machine guest agent**:

- The VM guest agent is required to be runnnig on your virtual machine. It is automatically installed on new Azure VMs, so this is normally not something you must do manually.

## Installation

The SQL Server IaaS Agent Extension is automatically installed when you provision one of the SQL Server virtual machine gallery images.

If you create an OS-only Windows Server virtual machine, you can install the extension manually by using the **Set-AzureVMSqlServerExtension** PowerShell cmdlet. For example, the following command installs the extension on an OS-only Windows Server VM (classic) and names it "SQLIaaSExtension".

	Get-AzureVM -ServiceName <vmservicename> -Name <vmname> | Set-AzureVMSqlServerExtension --ReferenceName "SQLIaasExtension" -Version "1.2" | Update-AzureVM

If you update to the latest version of the SQL IaaS Agent Extension, you must restart your virtual machine after updating the extension.

>[AZURE.NOTE] If you install the SQL Server IaaS Agent Extension manually on a Windows Server VM, you must use and manage its features using PowerShell commands. The portal interface is available only for SQL Server gallery images.

## Status

One way to verify that the extension is installed is to view the agent status in the Azure Portal. Select **All settings** in the virtual machine blade, and then click on **Extensions**. You should see the **SQLIaaSAgent** extension listed.

![SQL Server IaaS Agent Extension in Azure Portal](./media/virtual-machines-windows-classic-sql-server-agent-extension/azure-sql-server-iaas-agent-portal.png)

You can also use the **Get-AzureVMSqlServerExtension** Azure Powershell cmdlet.

	Get-AzureVM –ServiceName "service" –Name "vmname" | Get-AzureVMSqlServerExtension

## Removal   

In the Azure Portal, you can uninstall the extension by clicking the ellipsis on the **Extensions** blade of your virtual machine properties. Then click **Delete**.

![Uninstall the SQL Server IaaS Agent Extension in Azure Portal](./media/virtual-machines-windows-classic-sql-server-agent-extension/azure-sql-server-iaas-agent-uninstall.png)

You can also use the **Remove-AzureVMSqlServerExtension** Powershell cmdlet.

	Get-AzureVM –ServiceName "service" –Name "vmname" | Remove-AzureVMSqlServerExtension | Update-AzureVM

## Next Steps

Begin using one of the services supported by the extension. For more details, see the topics referenced in the [Supported services](#supported-services) section of this article.

For more information about running SQL Server on Azure Virtual Machines, see [SQL Server on Azure Virtual Machines overview](virtual-machines-windows-sql-server-iaas-overview.md).
