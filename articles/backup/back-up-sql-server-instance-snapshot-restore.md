---
title: Restore SQL Instance or Database in Azure Virtual Machine (VM)
description: Learn how to restore SQL instances or individual databases in Azure VMs using snapshot backups. Follow step-by-step instructions for efficient recovery.
#customer intent: As a database administrator, I want to restore an entire SQL instance from a snapshot so that I can recover all databases after a failure.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 03/11/2026
ms.topic: how-to
---

# Restore snapshot for SQL database in Azure VM(preview)

This article describes how to restore a SQL Server instance or an individual database in an Azure virtual machine (VM) by using snapshot backups. It provides step‑by‑step guidance for instance‑level and database‑level restores.

>[!NOTE]
>This preview feature supports Alternate Location Restore (ALR) only.

## Prerequisites

Before you restore from SQL instance snapshot recovery point, ensure that the following prerequisites are met:

- The SQL instance is backed up using snapshot backup, and the backup is available in the Recovery Services vault.
- The required permissions to perform restore operations in Azure are available.

## Restore the entire SQL instance

The SQL instance restore from snapshot backup allows you to restore the entire SQL instance, including all databases, to a previous state. This operation is useful in scenarios where the entire instance encounters issues such as corruption, configuration errors, or other failures.

To restore the entire SQL instance, follow these steps:

1. Go to the **Recovery Services vault**, and then select **Protected items** \> **Backup items**.

1. On the **Backup items** pane, select **SQL Server in Azure VM (Snapshot backup) (Preview)**.  
      
   :::image type="content" source="media/back-up-sql-server-instance-snapshot-restore/sql-backup-items-overview.png" alt-text="Screenshot that shows the selection of SQL Server in Azure VM (Snapshot backup) (Preview) datasource type." lightbox="media/back-up-sql-server-instance-snapshot-restore/sql-backup-items-overview.png":::

1. On the **Backup Items** pane, for the required backup instance, select **View details**.

1. On the selected backup instance pane, select **Restore**.

1. On the **Restore** pane, on the **Basics** tab, select **Next> Restore point**.

1. On the **Restore point** tab, for **Selected restore point**, click **Select**.

   :::image type="content" source="media/back-up-sql-server-instance-snapshot-restore/select-snapshot-restore-point.png" alt-text="Screenshot that shows the selection of a snapshot restore point." lightbox="media/back-up-sql-server-instance-snapshot-restore/select-snapshot-restore-point.png":::

1. On the **Select restore point** pane, select the required snapshot restore point from the list, and then select **OK**.  

1. On the **Restore** pane, on the **Restore point** tab, select **Next > Restore parameters**.

1. On the **Restore parameters** tab, select the **Target Server** and **Target Instance** where you want to restore.  

   :::image type="content" source="media/back-up-sql-server-instance-snapshot-restore/select-target-server-instance.png" alt-text="Screenshot that shows the selection of the target server and instance for the restore operation." lightbox="media/back-up-sql-server-instance-snapshot-restore/select-target-server-instance.png":::

1. For **Managed Identities**, select the required managed identity for Azure Backup to do the restore operation, and then select **Validate**.

   :::image type="content" source="media/back-up-sql-server-instance-snapshot-restore/select-managed-identity.png" alt-text="Screenshot that shows the selection of a managed identity for the restore operation." lightbox="media/back-up-sql-server-instance-snapshot-restore/select-managed-identity.png":::

   If necessary roles are missing, select **Assign missing roles**. If you lack permissions, download the assignment template and share it with your admin to complete the role assignment.

1. After validation, select **Next > Review + restore**.

1. On the **Review + restore** tab, review the restore settings, and then select **Restore**.

## Restore an individual SQL database

You can restore an individual SQL database from a snapshot backup without affecting the entire SQL instance. This operation is useful when only a specific database encounters issues such as corruption, accidental deletion, or other failures, and you want to restore just that database to a previous state.

To restore an individual SQL database in an instance, follow these steps:

1. Go to the **Recovery Services vault**, and then select **Protected items** \> **Backup items**.

1. On the **Backup items** pane, select **SQL Database in Azure VM**.  
      
   :::image type="content" source="media/back-up-sql-server-instance-snapshot-restore/sql-backup-items-overview.png" alt-text="Screenshot that shows the selection of SQL Database in Azure VM datasource type." lightbox="media/back-up-sql-server-instance-snapshot-restore/sql-backup-items-overview.png":::

1. On the **Backup Items** pane, select **View details** corresponding to the database listed under its instance with the **Backup type** set to **Snapshot backup**.  
      
1. On the selected SQL database backup item pane, select **Restore**.

1. On the **Restore** pane, on the **Basics** tab, select **Next> Restore point**.

1. On the **Restore point** tab, for **Selected restore point**, click **Select**.

   :::image type="content" source="media/back-up-sql-server-instance-snapshot-restore/select-snapshot-restore-point.png" alt-text="Screenshot that shows the selection of a snapshot restore point for SQL database restore." lightbox="media/back-up-sql-server-instance-snapshot-restore/select-snapshot-restore-point.png":::

1. On the **Restore point** tab, for **Restore point details**, select **Log** or **Snapshot** to choose the required restore point.

   - **Snapshot**: Allows you to select from available snapshot restore points in the subscription (Snapshot data store) or the vault (Vault standard), with snapshot data store selections providing faster restores.  
   - **Log**: Allows you to restore the database by applying the appropriate logs to the closest available snapshot restore point, enabling granular point-in-time recovery.  

   :::image type="content" source="media/back-up-sql-server-instance-snapshot-restore/select-restore-point-details.png" alt-text="Screenshot that shows the selection of restore point details for SQL database restore." lightbox="media/back-up-sql-server-instance-snapshot-restore/select-restore-point-details.png":::

1. For **Selected restore point**, click **Select**.

1. On the **Select restore point** pane, select the required snapshot restore point or log point-in-time based on the selected option, and then select **OK**.  

1. On the **Restore** pane, on the **Restore point** tab, select **Next > Restore parameters**.

1. On the **Restore parameters** tab, select the **Target Server** and **Target Instance**, and **Target resource group** where you want to restore.  

1. For **Restored DB Name**, enter the restored database name along with the target path.

1. For **Managed Identity**, select the required identity, and then select **Validate**.  
      
   If necessary roles are missing, select **Assign missing roles**. If you lack permissions, download the assignment template and share it with your admin to complete the role assignment.

1. After validation, select **Next > Review + restore**.

1. On the **Review + restore** tab, review the restore settings, and then select **Restore**.

## Next step

[Manage and monitor backed up SQL Server databases using Azure portal](manage-monitor-sql-database-backup.md).








      
    