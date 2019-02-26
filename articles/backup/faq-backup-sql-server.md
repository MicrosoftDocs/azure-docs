---
title: Frequently asked questions about backing up SQL Server databases on Azure VMs with Azure Backup
description: Provides answers to common questions about backing up SQL Server databases on Azure VMs with Azure Backup.
services: backup
author: sogup
manager: vijayts
ms.service: backup
ms.topic: conceptual
ms.date: 8/16/2018
ms.author: sogup
---
# FAQ on SQL Server running on Azure VM backup

This article answers common questions about backing up SQL Server databases running on Azure VMs with the [Azure Backup](backup-overview.md) service.

> [!NOTE]
> This feature is currently in public preview.



## Can I throttle the backup speed?

Yes. You can throttle the rate at which the backup policy runs to minimize the impact on a SQL Server instance. To change the setting:
1. On the SQL Server instance, in the *C:\Program Files\Azure Workload Backup\bin folder*, create the **ExtensionSettingsOverrides.json** file.
2. In the **ExtensionSettingsOverrides.json** file, change the **DefaultBackupTasksThreshold** setting to a lower value (for example, 5) <br>
  ` {"DefaultBackupTasksThreshold": 5}`

3. Save your changes. Close the file.
4. On the SQL Server instance, open **Task Manager**. Restart the **AzureWLBackupCoordinatorSvc** service.

## Can I run a full backup from a secondary replica?
No. This feature isn't supported.

## Do successful backup jobs create alerts?

No. Successful backup jobs don't generate alerts. Alerts are sent only for backup jobs that fail.

## Can I see scheduled backup jobs in the Jobs menu?

No. The **Backup Jobs** menu shows on-demand job details, but not scheduled backup jobs. If any scheduled backup jobs fail, the details are available in the failed job alerts. To monitor all scheduled and adhoc backup jobs, use [SQL Server Management Studio](manage-monitor-sql-database-backup.md).

## Are future databases automatically added for backup?

No. When you configure protection for a SQL Server instance, if you select the server level option, all databases are added. If you add databases to a SQL Server instance after you configure protection, you must manually add the new databases to protect them. The databases aren't automatically included in the configured protection.

##  How do I restart protection after changing recovery type?

Trigger a full backup. Log backups begin as expected.

## Can I protect Availability Groups on-premises?

No. Azure Backup protects SQL Servers running in Azure. If an Availability Group (AG) is spread between Azure and on-premises machines, the AG can be protected only if the primary replica is running in Azure. Additionally, Azure Backup only protects the nodes running in the same Azure region as the Recovery Services vault.

## Can I protect Availability Groups across regions?

Azure Backup Recovery Services Vault can detect and protect all nodes which are in the same region as the Recovery Services Vault. If you have a SQL Always On Availability group spanning multiple Azure regions, you need to configure backup from the region which has the primary node. Azure Backup will be able to detect and protect all databases in the availability group as per backup preference. If the backup preference is not met, backups will fail and you will get the failure alert.

## Can I exclude databases with auto-protection enabled?

No, [auto-protection](backup-azure-sql-database.md#enable-auto-protection) applies to the entire instance. You cannot selectively protect databases an instance using auto-protection.

## Can I have different policies in an auto-protected instance?

If you already have some protected databases in an instance, they will continue to be protected with their respective policies even after you turn **ON** the [auto-protection](backup-azure-sql-database.md#enable-auto-protection) option. However, all the unprotected databases along with the ones that you would add in future will have only a single policy that you define under **Configure Backup** after the databases are selected. In fact, unlike other protected databases, you cannot even change the policy for a database under an auto-protected instance.
If you want to do so, the only way is to disable the auto-protection on the instance for the time being and then change the policy for that database. You can now re-enable auto-protection for this instance.

## If I delete a database from auto-protection will backups stop?

No, if a database is dropped from an auto-protected instance, the backups on that database are still attempted. This implies that the deleted database begins to show up as unhealthy under **Backup Items** and is still treated as protected.

The only way to stop protecting this database is to disable the [auto-protection](backup-azure-sql-database.md#enable-auto-protection) on the instance for the time being and then choose the **Stop Backup** option under **Backup Items** for that database. You can now re-enable auto-protection for this instance.

##  Why can’t I see an added database for an auto-protected instance?

You may not see a newly added database to an [auto-protected](backup-azure-sql-database.md#enable-auto-protection) instance protected instantly under protected items. This is because the discovery typically runs every 8 hours. However, the user can run a manual discovery using **Recover DBs** option to discover and protect new databases immediately as shown in the below image:

  ![View Newly Added Database](./media/backup-azure-sql-database/view-newly-added-database.png)

## Next steps

[Learn how to](backup-azure-sql-database.md) back up a SQL Server database running on an Azure VM.
