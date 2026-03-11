---
title: Manage SQL Snapshot Backups in Azure VM
description: Learn how to manage SQL database snapshot backups in Azure VMs, including viewing backup items, monitoring jobs, and modifying backup policies.
#customer intent: As a database administrator, I want to view backup items for SQL database snapshots so that I can verify the backup status of my databases.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 03/11/2026
ms.topic: how-to
---

# Manage backups for SQL database in Azure VM snapshot(preview)

This article describes how to perform the common tasks to manage your SQL Snapshot backups.

## View backup items for SQL database snapshot

After you configure snapshot backup for a SQL instance, Azure Backup shows the backup items in the Azure portal. Azure creates one backup item for the protected SQL instance, which you use for instance-level actions. These items appear under **SQL Server in Azure VM (Snapshot backup)**.

Azure also creates a separate backup item for each protected database in the instance. You use these items to perform database-level actions, such as restoring a database. These items appear under **SQL database in Azure VM (Snapshot backup)**.

:::image type="content" source="media/back-up-manage-sql-instance-snapshot/sql-backup-items-overview.png" alt-text="Screenshot of Backup items pane in Azure portal, showing SQL backup management types and item counts for databases and instances." lightbox="media/back-up-manage-sql-instance-snapshot/sql-backup-items-overview.png":::

When you drill down into **SQL Database in Azure VM**, you see a list of all database-level backup items. The Backup type field indicates whether Azure Backup uses **streaming** or **snapshot** for each database.

Similarly, when you drill down into **SQL Server in Azure VM (Snapshot)**, you see the list of available instance-level snapshots.

:::image type="content" source="media/back-up-manage-sql-instance-snapshot/sql-database-backup-items.png" alt-text="Screenshot of Backup Items list in Azure portal displaying SQL databases, backup types, statuses, and View details links." lightbox="media/back-up-manage-sql-instance-snapshot/sql-database-backup-items.png":::

## Monitor SQL in Azure VM backups

To monitor SQL in Azure VM backups, go to the **Recovery Services vault**, and then select **Monitor** \> **Backup jobs**.

The Backup job pane provides the following details:

- **Backup jobs**: Jobs for streaming backups appear with the type **SQLDatabase**, where as jobs for snapshot backups appear with the type **SQLInstance**.

### Backup item health: The backup item status might appear as **Unhealthy** immediately after you configure backup. This status occurs when log backups run before the first full snapshot backup completes. The status updates automatically after the first scheduled Snapshot-Full backup finishes. Alternatively, you can trigger an on-demand Snapshot-Full backup to resolve the issue.

## Modify backup operations for SQL in Azure VM

Add or remove databases from SQL instance backup configuration

To add or remove databases from the backed-up SQL instance, follow these steps:

1.  Go to the Recovery Services vault, and then select **Protected items** \> **Backup items**.

2.  On the **Backup items** pane, select **SQL Server in Azure VM (Snapshot backup) (Preview)**.

3.  On the **Backup Items** pane, for the required backup instance where you want to add or remove the database, select **View details**.

4.  On the selected backup instance pane, select **Add new database** and add the required database to the SQL backup instance.  
      
    To remove a database from the SQL backup instance, select **Remove database**.  
      
      
    :::image type="content" source="media/back-up-manage-sql-instance-snapshot/add-remove-database-sql.png" alt-text="Screenshot of Azure Backup Items pane for SQL Server VM showing Add new database and Remove database buttons highlighted." lightbox="media/back-up-manage-sql-instance-snapshot/add-remove-database-sql.png":::

## Modify a backup policy

When you modify retention settings, the changes apply to all existing and future recovery points. However, any new retention category (weekly, monthly, or yearly) that you add to an existing policy applies only to future recovery points.

To modify an existing SQL Server backup policy , follow these steps:

1.  Go to the Recovery Services vault, and then select Manage \> **Backup policies**.

2.  On the **Backup policies** pane, select the required existing backup policy type from the list:

    - SQL Server in Azure VM (Streaming backup)

    - SQL Server in Azure VM (Snapshot backup)

> :::image type="content" source="media/back-up-manage-sql-instance-snapshot/sql-backup-policy-list.png" alt-text="Screenshot of Azure Recovery Services vault with Backup policies tab selected, listing SQL Server and VM backup policy options." lightbox="media/back-up-manage-sql-instance-snapshot/sql-backup-policy-list.png":::

3.  On the **Modify policy** pane, do the required changes, and then select **Update**.

### Change a backup policy for SQL in Azure VM

To change the policy associated with a backup item for SQL in Azure VM, follow these steps:

1.  Go to the Recovery Services vault, and then select **Protected items** \> **Backup items**.

2.  On the **Backup items** pane, select **SQL Server in Azure VM (Snapshot backup) (Preview)**.

3.  On the **Backup Items** pane, for the required backup instance for which you want to change policy, select **View details**.

4.  On the selected backup instance pane, under **Essentials**, select the backup policy.  
      
    :::image type="content" source="media/back-up-manage-sql-instance-snapshot/backup-policy-details.png" alt-text="Screenshot of SQL Server in Azure VM backup details with Essentials section, backup policy link, and recent snapshot backups listed." lightbox="media/back-up-manage-sql-instance-snapshot/backup-policy-details.png":::

5.  On the **Change Backup Policy** pane, for **Backup policy**, select a policy from the list, and then select **Change**.

## Stop backup operations for SQL in Azure VM

You can stop and resume snapshot backups at both the database and instance levels. You access the Stop backup and Resume backup options from the backup item details.

- **Stop backup at instance level**: When you stop backup at the instance level, Azure Backup stops backups for the instance and all underlying databases. You can choose to delete data or retain data (forever or per policy). Azure retains restore points for the underlying databases indefinitely, regardless of the selected retention or deletion option. To remove these restore points, you must explicitly stop backup and delete data for each database.

- **Stop backup at database level**: When you stop backup at the database level, only the selected database stops backing up. Azure deletes or retains restore points based on your selection. Other databases in the instance and instance-level backups remain unaffected.

[Learn how to stop backup for SQL in azure VM](https://learn.microsoft.com/en-us/azure/backup/manage-monitor-sql-database-backup#stop-protection-for-a-sql-server-database).
