---
title: Restore SQL Instance or Database in Azure Virtual Machine (VM) from Snapshot Backup using Azure portal (Preview)
description: Learn how to restore SQL instances or individual databases in Azure VMs using snapshot backups.
#customer intent: As a database administrator, I want to restore an entire SQL instance from a snapshot so that I can recover all databases after a failure.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 04/06/2026
ms.topic: how-to
---

# Restore SQL Server instance or database in Azure VM from snapshot backup by using Azure portal (preview)

This article describes how to restore a [SQL Server instance or an individual database in an Azure virtual machine (VM) by using snapshot backups (preview)](backup-azure-sql-database.md#snapshot-backup-for-sql-instances-in-azure-vm-preview). It provides step‑by‑step guidance for instance‑level and database‑level restores.

>[!NOTE]
>- This preview feature supports the Alternate Location Restore (ALR) only.
>- Integration with the **Resiliency** experience is currently not supported for snapshot backup of SQL Server instances (preview).

[Learn about the supported scenarios and limitations for SQL Server instance snapshot backup (preview)](sql-support-matrix.md#sql-server-instance-snapshot-backups-supported-scenarios-preview).

## Prerequisites

Before you restore from a SQL instance snapshot recovery point, review the following prerequisites:

- The SQL instance is backed up using snapshot backup, and the backup is available in the Recovery Services vault.
- The required permissions to perform restore operations in Azure are available.

## Restore the entire SQL instance

The SQL instance restore from snapshot backup allows you to restore the entire SQL instance, including all databases, to a previous state. This operation is useful in scenarios when you need to restore the entire SQL Server instance at once.

To restore the entire SQL instance, follow these steps:

1. Go to the **Recovery Services vault** and select  **Protected items** \> **Backup items**.

1. On the **Backup items** pane, select **SQL Server in Azure VM (Snapshot backup) (Preview)**.  
      
   :::image type="content" source="media/back-up-sql-server-instance-snapshot-restore/sql-backup-items-overview.png" alt-text="Screenshot that shows the selection of SQL Server in Azure VM (Snapshot backup) (Preview) datasource type." lightbox="media/back-up-sql-server-instance-snapshot-restore/sql-backup-items-overview.png":::

1. On the **Backup Items** pane, for the required backup instance, select **View details**.

1. On the selected backup instance pane, select **Restore**.

1. On the **Restore** pane, on the **Basics** tab, select **Next > Restore point**.

1. On the **Restore point** tab, for **Select restore type**, choose **Alternate location restore (ALR)** or **Restore as disk**.

   - **Alternate location restore**: Restores the SQL instance or database to a different location on another virtual machine (VM).
   - **Restore as disk**: Restores individual disks and attach them to the virtual machine of your choice.

   :::image type="content" source="media/back-up-sql-server-instance-snapshot-restore/select-snapshot-restore-point.png" alt-text="Screenshot that shows the selection of a snapshot restore point." lightbox="media/back-up-sql-server-instance-snapshot-restore/select-snapshot-restore-point.png":::

1. For **Selected restore point**, click **Select** to select an available restore point.

   By default, the latest restore point is selected.

1. On the **Select restore point** pane, select the required snapshot restore point from the list, and select **OK**.  

1. On the **Restore** pane, on the **Restore point** tab, you can select **Point in time restore** to apply transaction logs for a more granular restore.

   The available log points for each database show the log backup frequency you set up during backup configuration.

   :::image type="content" source="media/back-up-sql-server-instance-snapshot-restore/select-point-in-time-restore.png" alt-text="Screenshot that shows the selection of Point in time restore." lightbox="media/back-up-sql-server-instance-snapshot-restore/select-point-in-time-restore.png":::

1. Select **Next > Restore parameters**.

1. On the **Restore parameters** tab, select the **Target Server** and **Target Instance** where you want to restore.  

   :::image type="content" source="media/back-up-sql-server-instance-snapshot-restore/select-target-server-instance.png" alt-text="Screenshot that shows the selection of the target server and instance for the restore operation." lightbox="media/back-up-sql-server-instance-snapshot-restore/select-target-server-instance.png":::

1. For **Managed Identities**, select the required managed identity for Azure Backup to do the restore operation, and select **Validate**.

   :::image type="content" source="media/back-up-sql-server-instance-snapshot-restore/select-managed-identity.png" alt-text="Screenshot that shows the selection of a managed identity for the restore operation." lightbox="media/back-up-sql-server-instance-snapshot-restore/select-managed-identity.png":::

   If necessary roles are missing, select **Assign missing roles**. If you don't have permissions, download the assignment template and share it with your admin to complete the role assignment.

1. After validation, select **Next > Review + restore**.

1. On the **Review + restore** tab, review the restore settings, and select **Restore**.

## Restore an individual SQL database

You can restore an individual SQL database from a snapshot backup without affecting the entire SQL instance. Use this operation when an issue affects a single database, such as corruption, accidental deletion, or other failures. You can restore only the affected database to a previous state.

To restore an individual SQL database in an instance, follow these steps:

1. Go to the **Recovery Services vault** and select **Protected items** \> **Backup items**.

1. On the **Backup items** pane, select **SQL Database in Azure VM**.  
      
   :::image type="content" source="media/back-up-sql-server-instance-snapshot-restore/sql-backup-items-overview.png" alt-text="Screenshot that shows the selection of SQL Database in Azure VM datasource type." lightbox="media/back-up-sql-server-instance-snapshot-restore/sql-backup-items-overview.png":::

1. On the **Backup Items** pane, select **View details** corresponding to the database listed under its instance with the **Backup type** set to **Snapshot backup**.  
      
1. On the selected SQL database backup item pane, select **Restore**.

1. On the **Restore** pane, on the **Basics** tab, select **Next > Restore point**.

1. On the **Restore point** tab, for **Selected restore point**, click **Select**.

   :::image type="content" source="media/back-up-sql-server-instance-snapshot-restore/select-snapshot-restore-point.png" alt-text="Screenshot that shows the selection of a snapshot restore point for SQL database restore." lightbox="media/back-up-sql-server-instance-snapshot-restore/select-snapshot-restore-point.png":::

1. On the **Restore point** tab, for **Restore point details**, select **Log** or **Snapshot** to choose the required restore point.

   - **Snapshot**: Allows you to select from available snapshot restore points in the subscription (Snapshot data store) or the vault (Vault standard), with snapshot data store selections providing faster restores.  
   - **Log**: Allows you to restore the database by applying the appropriate logs to the closest available snapshot restore point, enabling granular point-in-time recovery.  

   :::image type="content" source="media/back-up-sql-server-instance-snapshot-restore/select-restore-point-details.png" alt-text="Screenshot that shows the selection of restore point details for SQL database restore." lightbox="media/back-up-sql-server-instance-snapshot-restore/select-restore-point-details.png":::

1. For **Selected restore point**, click **Select**.

1. On the **Select restore point** pane, select the required snapshot restore point or log point-in-time based on the selected option, and select **OK**.  

1. On the **Restore** pane, on the **Restore point** tab, select **Next > Restore parameters**.

1. On the **Restore parameters** tab, select the **Target Server** and **Target Instance**, and **Target resource group** where you want to restore.  

1. For **Restored DB Name**, enter the restored database name along with the target path.

1. For **Managed Identity**, select the required identity, and select **Validate**.  
      
   If necessary roles are missing, select **Assign missing roles**. If you don't have permissions, download the assignment template and share it with your admin to complete the role assignment.

1. After validation, select **Next > Review + restore**.

1. On the **Review + restore** tab, review the restore settings, and select **Restore**.

## Next step

[Manage and monitor SQL Server database and instance snapshot (preview) backups](manage-monitor-sql-database-backup.md).








      
    