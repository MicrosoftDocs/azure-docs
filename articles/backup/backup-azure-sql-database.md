---
title: Back up SQL Server databases to Azure 
description: This article explains how to back up SQL Server to Azure. The article also explains SQL Server recovery.
ms.topic: overview
ms.date: 04/06/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a database administrator, I want to implement SQL Server backups to Azure, so that I can ensure reliable data recovery and minimize downtime in case of data loss."
---
# About SQL Server Backup in Azure VMs

[Azure Backup](backup-overview.md) offers a stream-based, specialized solution to back up SQL Server running in Azure Virtual Machines (VMs). This solution aligns with Azure Backup's benefits of zero-infrastructure backup, long-term retention, and central management. It additionally provides the following advantages specifically for SQL Server:

- Workload aware backups that support all backup types - full, differential, and log
- 15 minute RPO (recovery point objective) with frequent log backups
- Point-in-time recovery up to a second
- Individual-database-levels backup and restore

>[!NOTE]
>Azure Backup now provides snapshot-based backup for SQL Server instances in Azure VMs, which is currently in preview. Snapshot-based backups allow you to protect large databases with improved performance and achieve faster restores from the instant recovery tier. To know the latest product enhancements and feature updates in Azure, see [Microsoft Azure Updates](https://azure.microsoft.com/updates?id=564668).

To view the backup and restore scenarios that we support today, see the [support matrix](sql-support-matrix.md#scenario-support). For common questions, see the [frequently asked questions](faq-backup-sql-server.yml).

## Snapshot backup for SQL Instances in Azure VM (preview)

Azure Backup provides a snapshot‑based SQL backup solution that improves performance for large databases. You can use disk snapshots for fast restores and frequent log backups to minimize data loss, helping you achieve lower Recovery Time Objective (RTO) and improved Recovery Point Objective (RPO).

>[!Note]
>Snapshot Backup for SQL Server instances is available in preview. Snapshot‑based backups allow you to protect large databases with improved performance and achieve faster restores from the instant recovery tier.

Snapshot backups provide the following benefits while backing up large databases:

- **Instance level snapshot**: Creates snapshot backups at the SQL instance level and select multiple databases in a single operation. Restore the entire instance or individual databases as needed.

- **Minimal impact on the source server**: Azure Backup briefly quiesces the database to capture an application-consistent snapshot. While the database is quiesced only for a few seconds, snapshot creation and availability in operational tier complete within minutes. Unlike streaming backups, the source machine’s resources aren't consumed for a long duration.

- **Cost-effective**: Optimizes storage cost with incremental snapshots.

- **Improved RTO**: Uses faster restores from Instant/operational tier.

- **Low RPO**: Combines log backups with snapshots to achieve a lower RPO and enable point-in-time restores.

Learn about the supported scenarios and limitations for SQL backup using snapshots in the [support matrix](sql-support-matrix.md#sql-server-instance-snapshot-backups-supported-scenarios-preview). To back up SQL Server instance snapshot in Azure VM using the Azure portal, see [this article](back-up-sql-server-instance-snapshot.md).

## Backup process for SQL Server database

This solution uses the SQL native APIs to take backups of your SQL databases.

* Once you specify the SQL Server VM that you want to protect and query for the databases in it, Azure Backup service installs a workload backup extension on the VM by the name `AzureBackupWindowsWorkload` extension.
* This extension consists of a coordinator and a SQL plugin. While the coordinator is responsible for triggering workflows for various operations like configure backup, backup, and restore, the plugin is responsible for actual data flow.
* To be able to discover databases on this VM, Azure Backup creates the account `NT SERVICE\AzureWLBackupPluginSvc`. This account is used for backup and restore and requires SQL sysadmin permissions. The `NT SERVICE\AzureWLBackupPluginSvc` account is a [Virtual Service Account](/windows/security/identity-protection/access-control/service-accounts#virtual-accounts), and so doesn't require any password management. Azure Backup uses the `NT AUTHORITY\SYSTEM` account for database discovery/inquiry, so this account needs to be a public login on SQL. If you didn't create the SQL Server VM from Azure Marketplace, you might receive an error **UserErrorSQLNoSysadminMembership**. If the error message appears, [follow these instructions](#set-vm-permissions).
* Once you trigger configure protection on the selected databases, the backup service sets up the coordinator with the backup schedules and other policy details, which the extension caches locally on the VM.
* At the scheduled time, the coordinator communicates with the plugin and it starts streaming the backup data from the SQL server using VDI(Virtual Device Interface).  
* The plugin sends the data directly to the Recovery Services vault, thus eliminating the need for a staging location. The Azure Backup service encrypts and stores the data in storage accounts.
* When the data transfer is complete, coordinator confirms the commit with the backup service.

  ![SQL Backup architecture](./media/backup-azure-sql-database/azure-backup-sql-overview.png)

## Backup process for SQL Server instance snapshots

Azure Backup uses managed-disk incremental snapshots to protect SQL databases in Azure VMs. The backup policy controls snapshot creation, retention, and logs backup behavior to enable fast restores and point-in-time recovery.

The backup and restore flow outlines a logical, end-to-end sequence of operations performed by Azure Backup that include the following operations:

- Creates managed-disk incremental snapshots based on the user-defined backup policy. Currently, the Azure Backup service supports one snapshot every 6 hours or higher. You can configure Log backups for every 15 minutes or higher.

- Takes snapshot backups at the SQL instance level. You can select up to 12 databases per snapshot operation.

- Captures an application-consistent snapshot across all selected databases by snapping the underlying disks for the combined set of databases.

- Retains snapshots in the Azure subscription within a specified resource group for a user-defined duration (up to 7 days). Azure Backup then moves the data to the Recovery Services vault as vaulted backup for long-term retention based on the configured policy.

- Streams log backups at the database level to the vault. During restore, the service restores the snapshot to an alternate VM and applies log backups to achieve point-in-time recovery.

[Learn how to back up SQL Server instance snapshot in Azure VM using Azure portal (preview)](back-up-sql-server-instance-snapshot.md).

## Prerequisites for SQL Server backup

Before you start the SQL Server backup, review the following prerequisites:

1. Make sure you have a SQL Server instance running in Azure. You can [quickly create a SQL Server instance](/azure/azure-sql/virtual-machines/windows/sql-vm-create-portal-quickstart) in the marketplace.
2. Review the [feature considerations](sql-support-matrix.md#feature-considerations-and-limitations) and [scenario support](sql-support-matrix.md#scenario-support).
3. [Review common questions](faq-backup-sql-server.yml) about this scenario.

## Set VM permissions

  When you run discovery on a SQL Server, Azure Backup performs the following actions:

* Adds the AzureBackupWindowsWorkload extension.
* Creates an NT SERVICE\AzureWLBackupPluginSvc account to discover databases on the virtual machine. This account is used for a backup and restore and requires SQL sysadmin permissions.
* Discovers databases that are running on a VM, Azure Backup uses the NT AUTHORITY\SYSTEM account. This account must be a public sign-in on SQL.

If you didn't create the SQL Server VM in Azure Marketplace or if you're on SQL 2008 or 2008 R2, you might receive a **UserErrorSQLNoSysadminMembership** error.

For giving permissions to **SQL 2008** and **2008 R2** running on Windows 2008 R2, see [this section](#assign-sql-sysadmin-permissions-for-sql-2008-and-sql-2008-r2).

For all other versions, assign the permissions using the following steps:

1. Use an account with **SQL Server sysadmin** permissions to sign in to **SQL Server Management Studio (SSMS)**. Unless you need special permissions, Windows authentication should work.

1. On the **SQL Server**, open the **Security/Logins** folder.

   ![Open the Security/Logins folder to see accounts](./media/backup-azure-sql-database/security-login-list.png)

1. Right-click the **Logins** folder and select **New Login**. In **Login - New**, select **Search**.

   ![In the Login - New dialog box, select Search](./media/backup-azure-sql-database/new-login-search.png)

1. The Windows virtual service account **NT SERVICE\AzureWLBackupPluginSvc** was created during the virtual machine registration and SQL discovery phase. Enter the account name as shown in **Enter the object name to select**. Select **Check Names** to resolve the name. Select **OK**.

   ![Select Check Names to resolve the unknown service name](./media/backup-azure-sql-database/check-name.png)

1. On **Server Roles**, make sure the **sysadmin** role is selected. Select **OK**. The required permissions should now exist.

   ![Make sure the sysadmin server role is selected](./media/backup-azure-sql-database/sysadmin-server-role.png)
  
   If the SQL Server instance is part of an **Always-On Availability Group (AG)**, ensure that the **NT AUTHORITY\SYSTEM** account has the **VIEW SERVER STATE** permission enabled.

   :::image type="content" source="./media/backup-azure-sql-database/view-server-state-permission.png" alt-text="Screenshot shows how to check permission on a SQL server instance selected for backup." lightbox="./media/backup-azure-sql-database/view-server-state-permission.png":::

1. Now associate the database with the Recovery Services vault. In the Azure portal, in the **Protected Servers** list, right-click the server that's in an error state > **Rediscover DBs**.

   ![Verify the server has appropriate permissions](./media/backup-azure-sql-database/check-erroneous-server.png)

1. Check progress in the **Notifications** area. When the selected databases are found, a success message appears.

   ![Deployment success message](./media/backup-azure-sql-database/notifications-db-discovered.png)

> [!NOTE]
> If your SQL Server has multiple instances of SQL Server installed, then you must add sysadmin permission for **NT Service\AzureWLBackupPluginSvc** account to all SQL instances.

### Assign SQL sysadmin permissions for SQL 2008 and SQL 2008 R2

To add **NT AUTHORITY\SYSTEM** and **NT Service\AzureWLBackupPluginSvc** logins to the SQL Server Instance, follow these steps:

1. Go to the **SQL Server Instance** in the Object explorer.

1. Go to **Security** > **Logins**.

1. Right-click the **Logins** and select **New Login**
   ![New Login using SSMS](media/backup-azure-sql-database/sql-2k8-new-login-ssms.png)

1. Go to the **General** tab and enter **NT AUTHORITY\SYSTEM** as the Login Name.

   ![Login name for SSMS](media/backup-azure-sql-database/sql-2k8-nt-authority-ssms.png)

1. Go to the **Server Roles** tab and choose **public** and **sysadmin** roles.

   ![Choosing roles in SSMS](media/backup-azure-sql-database/sql-2k8-server-roles-ssms.png)

1. Go to **Status**, select **Grant** for the **Permission to connect to database engine**, and then select **Enabled** for **Login**.

   ![Grant permissions in SSMS](media/backup-azure-sql-database/sql-2k8-grant-permission-ssms.png)

1. Select **OK**.

1. To add the **NT Service\AzureWLBackupPluginSvc** login to the **SQL Server instance**, repeat steps **1-7**. 

   If the login already exists, make sure it has the sysadmin server role and under **Status** it has the **Grant** option for the **Permission to connect to database engine** and **Login** as **Enabled**.

1. After granting permission, **Rediscover DBs** in the Azure portal by going to the **Recovery Services vault** > **Manage** > **Backup Infrastructure** > **Workload in Azure VM**.

   ![Rediscover DBs in Azure portal](media/backup-azure-sql-database/sql-rediscover-dbs.png)

Alternatively, you can automate the permission assignment by running the following cmdlets in admin mode. 

   >[!NOTE]
   >The instance name is set to MSSQLSERVER by default. Change the instance name argument in script if needed.

```powershell
param(
    [Parameter(Mandatory=$false)]
    [string] $InstanceName = "MSSQLSERVER"
)
if ($InstanceName -eq "MSSQLSERVER")
{
    $fullInstance = $env:COMPUTERNAME   # In case it's the default SQL Server Instance
}
else
{
    $fullInstance = $env:COMPUTERNAME + "\" + $InstanceName   # In case of named instance
}
try
{
    sqlcmd.exe -S $fullInstance -Q "sp_addsrvrolemember 'NT Service\AzureWLBackupPluginSvc', 'sysadmin'" # Adds login with sysadmin permission if already not available
}
catch
{
    Write-Host "An error occurred:"
    Write-Host $_.Exception|format-list -force
}
try
{
    sqlcmd.exe -S $fullInstance -Q "sp_addsrvrolemember 'NT AUTHORITY\SYSTEM', 'sysadmin'" # Adds login with sysadmin permission if already not available
}
catch
{
    Write-Host "An error occurred:"
    Write-Host $_.Exception|format-list -force
}
```

## Pricing for snapshot backup of SQL Server instances in Azure VMs

Backup of SQL in Azure VM snapshot incurs the following charges:

- Snapshot backups stored in a Recovery Services vault are priced based on [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/?msockid=229ace64ee9568201c64da31efc769d2).

- In addition to the Protected Instance fee and vault storage cost, Azure Backup incurs extra charges for snapshot storage in the operational tier.

- Managed disk snapshots incur charges based on [Managed Disk snapshot pricing](https://azure.microsoft.com/pricing/details/managed-disks/) for the duration they're retained in your subscription.

## Next steps

* [Configure simultaneous backups](manage-monitor-sql-database-backup.md#configure-simultaneous-backups).
* [Back up SQL Server databases running on an Azure VM](backup-sql-server-database-azure-vms.md).
* [Back up SQL Server instance snapshot in Azure VM using Azure portal (preview)](back-up-sql-server-instance-snapshot.md).
* [Restore backed up SQL Server databases](restore-sql-database-azure-vm.md).
* [Manage and monitor SQL Server database and instance snapshot (preview) backups](manage-monitor-sql-database-backup.md).

## Related content

- [Back up SQL server databases in Azure VMs using Azure Backup via REST API](backup-azure-sql-vm-rest-api.md).
- [Restore SQL Server databases in Azure VMs with REST API](restore-azure-sql-vm-rest-api.md).
- [Manage SQL server databases in Azure VMs with REST API](manage-azure-sql-vm-rest-api.md).

