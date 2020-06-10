---
title: Automated Backup for SQL Server 2014 Azure virtual machines
description: Explains the Automated Backup feature for SQL Server 2014 VMs running in Azure. This article is specific to VMs using the Resource Manager.
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
tags: azure-resource-manager
ms.assetid: bdc63fd1-db49-4e76-87d5-b5c6a890e53c
ms.service: virtual-machines-sql

ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 05/03/2018
ms.author: mathoma
ms.reviewer: jroth
---

# Automated Backup for SQL Server 2014 virtual machines (Resource Manager)
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

> [!div class="op_single_selector"]
> * [SQL Server 2014](automated-backup-sql-2014.md)
> * [SQL Server 2016/2017](automated-backup.md)

Automated Backup automatically configures [Managed Backup to Microsoft Azure](https://msdn.microsoft.com/library/dn449496.aspx) for all existing and new databases on an Azure VM running SQL Server 2014 Standard or Enterprise. This enables you to configure regular database backups that utilize durable Azure Blob storage. Automated Backup depends on the [SQL Server infrastructure as a service (IaaS) Agent Extension](sql-server-iaas-agent-extension-automate-management.md).

[!INCLUDE [learn-about-deployment-models](../../../../includes/learn-about-deployment-models-rm-include.md)]

## Prerequisites
To use Automated Backup, consider the following prerequisites:

**Operating system**:

- Windows Server 2012
- Windows Server 2012 R2
- Windows Server 2016

**SQL Server version/edition**:

- SQL Server 2014 Standard
- SQL Server 2014 Enterprise

> [!IMPORTANT]
> Automated Backup works with SQL Server 2014. If you are using SQL Server 2016/2017, you can use Automated Backup v2 to back up your databases. For more information, see [Automated Backup v2 for SQL Server 2016 Azure virtual machines](automated-backup.md).

**Database configuration**:

- Target databases must use the full recovery model. For more information about the impact of the full recovery model on backups, see [Backup under the full recovery model](https://technet.microsoft.com/library/ms190217.aspx).
- Target databases must be on the default SQL Server instance. The SQL Server IaaS Agent Extension does not support named instances.

> [!NOTE]
> Automated Backup relies on the SQL Server IaaS Agent Extension. Current SQL virtual machine gallery images add this extension by default. For more information, see [SQL Server IaaS Agent Extension](sql-server-iaas-agent-extension-automate-management.md).

## Settings

The following table describes the options that can be configured for Automated Backup. The actual configuration steps vary depending on whether you use the Azure portal or Azure Windows PowerShell commands.

| Setting | Range (Default) | Description |
| --- | --- | --- |
| **Automated Backup** | Enable/Disable (Disabled) | Enables or disables Automated Backup for an Azure VM running SQL Server 2014 Standard or Enterprise. |
| **Retention Period** | 1-30 days (30 days) | The number of days to retain a backup. |
| **Storage Account** | Azure storage account | An Azure storage account to use for storing Automated Backup files in blob storage. A container is created at this location to store all backup files. The backup file naming convention includes the date, time, and machine name. |
| **Encryption** | Enable/Disable (Disabled) | Enables or disables encryption. When encryption is enabled, the certificates used to restore the backup are located in the specified storage account in the same `automaticbackup` container using the same naming convention. If the password changes, a new certificate is generated with that password, but the old certificate remains to restore prior backups. |
| **Password** | Password text | A password for encryption keys. This is only required if encryption is enabled. In order to restore an encrypted backup, you must have the correct password and related certificate that was used at the time the backup was taken. |


## Configure new VMs

Use the Azure portal to configure Automated Backup when you create a new SQL Server 2014 virtual machine in the Resource Manager deployment model.

On the **SQL Server settings** tab, scroll down to **Automated backup** and select **Enable**. The following Azure portal screenshot shows the **SQL Automated Backup** settings.

![SQL Automated Backup configuration in the Azure portal](./media/automated-backup-sql-2014/azure-sql-arm-autobackup.png)

## Configure existing VMs

[!INCLUDE [windows-virtual-machines-sql-use-new-management-blade](../../../../includes/windows-virtual-machines-sql-new-resource.md)]

For existing SQL Server VMs, you can enable and disable automated backups, change the retention period, specify the storage account, and enable encryption from the Azure portal. 

Navigate to the [SQL virtual machines resource](manage-sql-vm-portal.md#access-the-sql-virtual-machines-resource) for your SQL Server 2014 virtual machine and then select **Backups**. 

![SQL Automated Backup for existing VMs](./media/automated-backup-sql-2014/azure-sql-rm-autobackup-existing-vms.png)

When finished, select the **Apply** button on the bottom of the **Backups** page to save your changes.

If you are enabling Automated Backup for the first time, Azure configures the SQL Server IaaS Agent in the background. During this time, the Azure portal might not show that Automated Backup is configured. Wait several minutes for the agent to be installed and configured. After that, the Azure portal will reflect the new settings.

> [!NOTE]
> You can also configure Automated Backup using a template. For more information, see [Azure quickstart template for Automated Backup](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-sql-existing-autobackup-update).

## Configure with PowerShell

You can use PowerShell to configure Automated Backup. Before you begin, you must:

- [Download and install the latest Azure PowerShell](https://aka.ms/webpi-azps).
- Open Windows PowerShell and associate it with your account with the **Connect-AzAccount** command. 

[!INCLUDE [updated-for-az.md](../../../../includes/updated-for-az.md)]

### Install the SQL Server IaaS Extension
If you provisioned a SQL Server VM from the Azure portal, the SQL Server IaaS Extension should already be installed. You can determine whether it is installed for your VM by calling **Get-AzVM** command and examining the **Extensions** property.

```powershell
$vmname = "vmname"
$resourcegroupname = "resourcegroupname"

(Get-AzVM -Name $vmname -ResourceGroupName $resourcegroupname).Extensions
```

If the SQL Server IaaS Agent extension is installed, you should see it listed as "SqlIaaSAgent" or "SQLIaaSExtension." **ProvisioningState** for the extension should also show "Succeeded."

If it is not installed or it has failed to be provisioned, you can install it with the following command. In addition to the VM name and resource group, you must also specify the region (**$region**) that your VM is located in. Specify the license type for your SQL Server VM, choosing between either pay-as-you-go or bring-your-own-license via the [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/). For more information about licensing, see [licensing model](licensing-model-azure-hybrid-benefit-ahb-change.md). 

```powershell
New-AzSqlVM  -Name $vmname `
    -ResourceGroupName $resourcegroupname `
    -Location $region -LicenseType <PAYG/AHUB>
```

> [!IMPORTANT]
> If the extension is not already installed, installing the extension restarts SQL Server.

### <a id="verifysettings"></a> Verify current settings

If you enabled automated backup during provisioning, you can use PowerShell to check your current configuration. Run the **Get-AzVMSqlServerExtension** command and examine the **AutoBackupSettings** property:

```powershell
(Get-AzVMSqlServerExtension -VMName $vmname -ResourceGroupName $resourcegroupname).AutoBackupSettings
```

You should get output similar to the following:

```
Enable                      : False
EnableEncryption            : False
RetentionPeriod             : -1
StorageUrl                  : NOTSET
StorageAccessKey            : 
Password                    : 
BackupSystemDbs             : False
BackupScheduleType          : 
FullBackupFrequency         : 
FullBackupStartTime         : 
FullBackupWindowHours       : 
LogBackupFrequency          : 
```

If your output shows that **Enable** is set to **False**, then you have to enable automated backup. The good news is that you enable and configure Automated Backup in the same way. See the next section for this information.

> [!NOTE] 
> If you check the settings immediately after making a change, it is possible that you will get back the old configuration values. Wait a few minutes and check the settings again to make sure that your changes were applied.

### Configure Automated Backup
You can use PowerShell to enable Automated Backup as well as to modify its configuration and behavior at any time.

First, select or create a storage account for the backup files. The following script selects a storage account or creates it if it does not exist.

```powershell
$storage_accountname = "yourstorageaccount"
$storage_resourcegroupname = $resourcegroupname

$storage = Get-AzStorageAccount -ResourceGroupName $resourcegroupname `
    -Name $storage_accountname -ErrorAction SilentlyContinue
If (-Not $storage)
    { $storage = New-AzStorageAccount -ResourceGroupName $storage_resourcegroupname `
    -Name $storage_accountname -SkuName Standard_GRS -Location $region }
```

> [!NOTE]
> Automated Backup does not support storing backups in premium storage, but it can take backups from VM disks which use Premium Storage.

Then use the **New-AzVMSqlServerAutoBackupConfig** command to enable and configure the Automated Backup settings to store backups in the Azure storage account. In this example, the backups are retained for 10 days. The second command, **Set-AzVMSqlServerExtension**, updates the specified Azure VM with these settings.

```powershell
$autobackupconfig = New-AzVMSqlServerAutoBackupConfig -Enable `
    -RetentionPeriodInDays 10 -StorageContext $storage.Context `
    -ResourceGroupName $storage_resourcegroupname

Set-AzVMSqlServerExtension -AutoBackupSettings $autobackupconfig `
    -VMName $vmname -ResourceGroupName $resourcegroupname
```

It could take several minutes to install and configure the SQL Server IaaS Agent.

> [!NOTE]
> There are other settings for **New-AzVMSqlServerAutoBackupConfig** that apply only to SQL Server 2016 and Automated Backup v2. SQL Server 2014 does not support the following settings: **BackupSystemDbs**, **BackupScheduleType**, **FullBackupFrequency**, **FullBackupStartHour**, **FullBackupWindowInHours**, and **LogBackupFrequencyInMinutes**. If you attempt to configure these settings on a SQL Server 2014 virtual machine, there is no error, but the settings do not get applied. If you want to use these settings on a SQL Server 2016 virtual machine, see [Automated Backup v2 for SQL Server 2016 Azure virtual machines](automated-backup.md).

To enable encryption, modify the previous script to pass the **EnableEncryption** parameter along with a password (secure string) for the **CertificatePassword** parameter. The following script enables the Automated Backup settings in the previous example and adds encryption.

```powershell
$password = "P@ssw0rd"
$encryptionpassword = $password | ConvertTo-SecureString -AsPlainText -Force

$autobackupconfig = New-AzVMSqlServerAutoBackupConfig -Enable `
    -EnableEncryption -CertificatePassword $encryptionpassword `
    -RetentionPeriodInDays 10 -StorageContext $storage.Context `
    -ResourceGroupName $storage_resourcegroupname

Set-AzVMSqlServerExtension -AutoBackupSettings $autobackupconfig `
    -VMName $vmname -ResourceGroupName $resourcegroupname
```

To confirm your settings are applied, [verify the Automated Backup configuration](#verifysettings).

### Disable Automated Backup

To disable Automated Backup, run the same script without the **-Enable** parameter to the **New-AzVMSqlServerAutoBackupConfig** command. The absence of the **-Enable** parameter signals the command to disable the feature. As with installation, it can take several minutes to disable Automated Backup.

```powershell
$autobackupconfig = New-AzVMSqlServerAutoBackupConfig -ResourceGroupName $storage_resourcegroupname

Set-AzVMSqlServerExtension -AutoBackupSettings $autobackupconfig `
    -VMName $vmname -ResourceGroupName $resourcegroupname
```

### Example script

The following script provides a set of variables that you can customize to enable and configure Automated Backup for your VM. In your case, you might need to customize the script based on your requirements. For example, you would have to make changes if you wanted to disable the backup of system databases or enable encryption.

```powershell
$vmname = "yourvmname"
$resourcegroupname = "vmresourcegroupname"
$region = "Azure region name such as EASTUS2"
$storage_accountname = "storageaccountname"
$storage_resourcegroupname = $resourcegroupname
$retentionperiod = 10

# ResourceGroupName is the resource group which is hosting the VM where you are deploying the SQL Server IaaS Extension

Set-AzVMSqlServerExtension -VMName $vmname `
    -ResourceGroupName $resourcegroupname -Name "SQLIaasExtension" `
    -Version "2.0" -Location $region

# Creates/use a storage account to store the backups

$storage = Get-AzStorageAccount -ResourceGroupName $resourcegroupname `
    -Name $storage_accountname -ErrorAction SilentlyContinue
If (-Not $storage)
    { $storage = New-AzStorageAccount -ResourceGroupName $storage_resourcegroupname `
    -Name $storage_accountname -SkuName Standard_GRS -Location $region }

# Configure Automated Backup settings

$autobackupconfig = New-AzVMSqlServerAutoBackupConfig -Enable `
    -RetentionPeriodInDays $retentionperiod -StorageContext $storage.Context `
    -ResourceGroupName $storage_resourcegroupname

# Apply the Automated Backup settings to the VM

Set-AzVMSqlServerExtension -AutoBackupSettings $autobackupconfig `
    -VMName $vmname -ResourceGroupName $resourcegroupname
```

## Monitoring

To monitor Automated Backup on SQL Server 2014, you have two main options. Because Automated Backup uses the SQL Server Managed Backup feature, the same monitoring techniques apply to both.

First, you can poll the status by calling [msdb.smart_admin.sp_get_backup_diagnostics](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/managed-backup-sp-get-backup-diagnostics-transact-sql). Or query the [msdb.smart_admin.fn_get_health_status](https://docs.microsoft.com/sql/relational-databases/system-functions/managed-backup-fn-get-health-status-transact-sql) table valued function.

> [!NOTE]
> The schema for Managed Backup in SQL Server 2014 is **msdb.smart_admin**. In SQL Server 2016 this changed to **msdb.managed_backup**, and the reference topics use this newer schema. But for SQL Server 2014, you must continue to use the **smart_admin** schema for all Managed Backup objects.

Another option is to take advantage of the built-in Database Mail feature for notifications.

1. Call the [msdb.smart_admin.sp_set_parameter](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/managed-backup-sp-set-parameter-transact-sql) stored procedure to assign an email address to the **SSMBackup2WANotificationEmailIds** parameter. 
1. Enable [SendGrid](../../../sendgrid-dotnet-how-to-send-email.md) to send the emails from the Azure VM.
1. Use the SMTP server and user name to configure Database Mail. You can configure Database Mail in SQL Server Management Studio or with Transact-SQL commands. For more information, see [Database Mail](https://docs.microsoft.com/sql/relational-databases/database-mail/database-mail).
1. [Configure SQL Server Agent to use Database Mail](https://docs.microsoft.com/sql/relational-databases/database-mail/configure-sql-server-agent-mail-to-use-database-mail).
1. Verify that the SMTP port is allowed both through the local VM firewall and the network security group for the VM.

## Next steps

Automated Backup configures Managed Backup on Azure VMs. So it is important to [review the documentation for Managed Backup on SQL Server 2014](https://msdn.microsoft.com/library/dn449497(v=sql.120).aspx).

You can find additional backup and restore guidance for SQL Server on Azure VMs in the following article: [Backup and restore for SQL Server on Azure virtual machines](backup-restore.md).

For information about other available automation tasks, see [SQL Server IaaS Agent Extension](sql-server-iaas-agent-extension-automate-management.md).

For more information about running SQL Server on Azure VMs, see [SQL Server on Azure virtual machines overview](sql-server-on-azure-vm-iaas-what-is-overview.md).
