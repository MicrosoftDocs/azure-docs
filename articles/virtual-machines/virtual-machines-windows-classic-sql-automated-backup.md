<properties
	pageTitle="Automated Backup for SQL Server Virtual Machines (Classic) | Microsoft Azure"
	description="Explains the Automated Backup feature for SQL Server running in Azure Virtual Machines using Resource Manager. "
	services="virtual-machines-windows"
	documentationCenter="na"
	authors="rothja"
	manager="jhubbard"
	editor=""
	tags="azure-service-management" />
<tags
	ms.service="virtual-machines-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows-sql-server"
	ms.workload="infrastructure-services"
	ms.date="07/14/2016"
	ms.author="jroth" />

# Automated Backup for SQL Server in Azure Virtual Machines (Classic)

> [AZURE.SELECTOR]
- [Resource Manager](virtual-machines-windows-sql-automated-backup.md)
- [Classic](virtual-machines-windows-classic-sql-automated-backup.md)

Automated Backup automatically configures [Managed Backup to Microsoft Azure](https://msdn.microsoft.com/library/dn449496.aspx) for all existing and new databases on an Azure VM running SQL Server 2014 Standard or Enterprise. This enables you to configure regular database backups that utilize durable Azure blob storage. Automated Backup depends on the [SQL Server IaaS Agent Extension](virtual-machines-windows-classic-sql-server-agent-extension.md).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)] To view the Resource Manager version of this article, see [Automated Backup for SQL Server in Azure Virtual Machines Resource Manager](virtual-machines-windows-sql-automated-backup.md).

## Prerequisites

To use Automated Backup, consider the following prerequisites:

**Operating System**:

- Windows Server 2012
- Windows Server 2012 R2

**SQL Server version/edition**:

- SQL Server 2014 Standard
- SQL Server 2014 Enterprise

**Database configuration**:

- Target databases must use the full recovery model

**Azure PowerShell**:

- [Install the latest Azure PowerShell commands](../powershell-install-configure.md) if you plan to configure Automated Backup with PowerShell.

>[AZURE.NOTE] Automated Backup relies on the SQL Server IaaS Agent Extension. Current SQL virtual machine gallery images add this extension by default. For more information, see [SQL Server IaaS Agent Extension](virtual-machines-windows-classic-sql-server-agent-extension.md).

## Settings

The following table describes the options that can be configured for Automated Backup. The actual configuration steps vary depending on whether you use the Azure portal or Azure Windows PowerShell commands.

|Setting|Range (Default)|Description|
|---|---|---|
|**Automated Backup**|Enable/Disable (Disabled)|Enables or disables Automated Backup for an Azure VM running SQL Server 2014 Standard or Enterprise.|
|**Retention Period**|1-30 days (30 days)|The number of days to retain a backup.|
|**Storage Account**|Azure storage account (the storage account created for the specified VM)|An Azure storage account to use for storing Automated Backup files in blob storage. A container is created at this location to store all backup files. The backup file naming convention includes the date, time, and machine name.|
|**Encryption**|Enable/Disable (Disabled)|Enables or disables encryption. When encryption is enabled, the certificates used to restore the backup are located in the specified storage account in the same automaticbackup container using the same naming convention. If the password changes, a new certificate is generated with that password, but the old certificate remains to restore prior backups.|
|**Password**|Password text (None)|A password for encryption keys. This is only required if encryption is enabled. In order to restore an encrypted backup, you must have the correct password and related certificate that was used at the time the backup was taken.|

## Configuration in the Portal
You can use the Azure Portal to configure Automated Backup during provisioning or for existing VMs.

### New VMs
Use the Azure portal to configure Automated Backup when you create a new SQL Server 2014 Virtual Machine in the classic deployment model.

The following Azure portal screenshot shows these options under **OPTIONAL CONFIGURATION** | **SQL AUTOMATED BACKUP**.

![SQL Automatic Backup configuration in Azure portal](./media/virtual-machines-windows-classic-sql-automated-backup/IC778483.jpg)

### Existing VMs
For existing SQL Server 2014 virtual machines, select the **Auto backup** settings in the **Configuration** section of the virtual machine properties. In the **Automated backup** window, you can enable the feature, set the retention period, select the storage account, and set encryption. This is shown in the following screenshot.

![Automated Backup Configuration in Azure portal](./media/virtual-machines-windows-classic-sql-automated-backup/IC792133.jpg)

>[AZURE.NOTE] When you enable Automated Backup for the first time, Azure configures the SQL Server IaaS Agent in the background. During this time, the Azure portal might not show that Automated Backup is configured. Wait several minutes for the agent to be installed, configured. After that the Azure portal will reflect the new settings.

## Configuration with PowerShell

In the following PowerShell example, Automated Backup is configured for an existing SQL Server 2014 VM. The **New-AzureVMSqlServerAutoBackupConfig** command configures the Automated Backup settings to store backups in the Azure storage account specified by the $storageaccount variable. These backups will be retained for 10 days. The **Set-AzureVMSqlServerExtension** command updates the specified Azure VM with these settings.

    $storageaccount = "<storageaccountname>"
    $storageaccountkey = (Get-AzureStorageKey -StorageAccountName $storageaccount).Primary
    $storagecontext = New-AzureStorageContext -StorageAccountName $storageaccount -StorageAccountKey $storageaccountkey
    $autobackupconfig = New-AzureVMSqlServerAutoBackupConfig -StorageContext $storagecontext -Enable -RetentionPeriod 10

    Get-AzureVM -ServiceName <vmservicename> -Name <vmname> | Set-AzureVMSqlServerExtension -AutoBackupSettings $autobackupconfig | Update-AzureVM

It could take several minutes to install and configure the SQL Server IaaS Agent.

To enable encryption, modify the previous script to pass the EnableEncryption parameter along with a password (secure string) for the CertificatePassword parameter. The following script enables the Automated Backup settings in the previous example and adds encryption.

    $storageaccount = "<storageaccountname>"
    $storageaccountkey = (Get-AzureStorageKey -StorageAccountName $storageaccount).Primary
    $storagecontext = New-AzureStorageContext -StorageAccountName $storageaccount -StorageAccountKey $storageaccountkey
    $password = "P@ssw0rd"
    $encryptionpassword = $password | ConvertTo-SecureString -AsPlainText -Force  
    $autobackupconfig = New-AzureVMSqlServerAutoBackupConfig -StorageContext $storagecontext -Enable -RetentionPeriod 10 -EnableEncryption -CertificatePassword $encryptionpassword

    Get-AzureVM -ServiceName <vmservicename> -Name <vmname> | Set-AzureVMSqlServerExtension -AutoBackupSettings $autobackupconfig | Update-AzureVM

To disable automatic backup, run the same script without the **-Enable** parameter to the **New-AzureVMSqlServerAutoBackupConfig**. As with installation, it can take several minutes to disable Automated Backup.

>[AZURE.NOTE] Disabling and uninstalling the SQL Server IaaS Agent does not remove the previously configured Managed Backup settings. You should disable Automated Backup before disabling or uninstalling the SQL Server IaaS Agent.

## Next steps

Automated Backup configures Managed Backup on Azure VMs. So it is important to [review the documentation for Managed Backup](https://msdn.microsoft.com/library/dn449496.aspx) to understand the behavior and implications.

You can find additional backup and restore guidance for SQL Server on Azure VMs in the following topic: [Backup and Restore for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-backup-recovery.md).

For information about other available automation tasks, see [SQL Server IaaS Agent Extension](virtual-machines-windows-classic-sql-server-agent-extension.md).

For more information about running SQL Server on Azure VMs, see [SQL Server on Azure Virtual Machines overview](virtual-machines-windows-sql-server-iaas-overview.md).
