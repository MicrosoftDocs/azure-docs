---
title: Tutorial - Back Up SQL Server Databases to Azure 
description: In this tutorial, you learn how to back up a SQL Server database running on an Azure VM to an Azure Backup Recovery Services vault.
ms.topic: tutorial
ms.date: 12/18/2025
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
#customer intent: As a database administrator, I want to back up SQL Server databases on an Azure VM to a cloud-based recovery vault, so that I can ensure data protection and meet recovery objectives efficiently.
---

# Tutorial: Back up a SQL Server database on an Azure VM

This tutorial describes how to back up a SQL Server database running on an Azure virtual machine (VM) to an Azure Backup Recovery Services vault.

In this tutorial, you use the Azure portal to:

> [!div class="checklist"]
>
> - Create and configure a vault.
> - Discover databases and set up backups.
> - Set up auto-protection for databases.
> - Run an on-demand backup.

## Prerequisites

- Identify or [create](backup-sql-server-database-azure-vms.md#create-a-recovery-services-vault) a Recovery Services vault in the same region or locale as the VM that hosts the SQL Server instance.
- [Check the VM permissions](backup-azure-sql-database.md#set-vm-permissions) that you need for backing up the SQL Server database.
- Verify that the VM has [network connectivity](backup-sql-server-database-azure-vms.md#establish-network-connectivity).
- Check that your SQL Server databases are named in accordance with [naming guidelines](backup-sql-server-database-azure-vms.md#database-naming-guidelines-for-azure-backup) for Azure Backup.
- Verify that you don't have any other backup solutions enabled for the database. Disable all other SQL Server backups before you set up this scenario. You can enable Azure Backup for an Azure VM, along with Azure Backup for a SQL Server database running on the VM, without any conflict.

[!INCLUDE [How to create a Recovery Services vault](../../includes/backup-create-rs-vault.md)]

## Discover SQL Server databases

To discover databases running on a VM, follow these steps:

1. In the [Azure portal](https://portal.azure.com), go to **Resiliency**, and then select **+ Configure protection**.

1. On the **Configure protection** pane, for **Datasource type**, select **SQL in Azure VM**. Then select **Continue**.

   :::image type="content" source="./media/backup-azure-sql-database/configure-sql-backup.png" alt-text="Screenshot that shows selection of a SQL Server database as the datasource for backup.":::

1. On the **Start: Configure Backup** pane, under **Vault**, choose **Select vault**.

1. On the **Select a Vault** pane, choose the Recovery Services vault in which you want to back up the database. Then choose **Select**.

1. Select **Continue**.

1. On the **Backup Goal** pane, under **Discover DBs in VMs**, select **Start Discovery** to search for unprotected VMs in the subscription. This search can take a while, depending on the number of unprotected VMs in the subscription.

1. On the **Select Virtual Machine** pane, select the VMs running the SQL Server database, and then select **Discover DBs**.

   :::image type="content" source="./media/backup-azure-sql-database/discovering-sql-databases.png" alt-text="Screenshot that shows a list of virtual machines and the option for discovering databases." lightbox="./media/backup-azure-sql-database/discovering-sql-databases.png":::

   > [!NOTE]
   > Unprotected VMs should appear in the list after discovery, sorted by name and resource group. If a VM isn't listed as you expect, see whether it's already backed up in a vault.
   >
   > Multiple VMs can have the same name, but they belong to different resource groups.

1. You can track database discovery in **Notifications**. The time required for this action depends on the number of VM databases. When the selected databases are discovered, a success message appears.

   :::image type="content" source="./media/backup-azure-sql-database/notifications-db-discovered.png" alt-text="Screenshot that shows a deployment success message.":::

Azure Backup discovers all SQL Server databases on the VM. During discovery, the following activities happen in the background:

- Azure Backup registers the VM with the vault for workload backup. All databases on the registered VM can be backed up to this vault only.

- Azure Backup installs the `AzureBackupWindowsWorkload` extension on the VM. No agent is installed on a SQL Server database.

- Azure Backup creates the service account `NT Service\AzureWLBackupPluginSvc` on the VM. Note that:

  - All backup and restore operations use the service account.
  - `NT Service\AzureWLBackupPluginSvc` requires SQL Server `sysadmin` permissions.
  - All SQL Server VMs created in Azure Marketplace come with `SqlIaaSExtension` installed. The `AzureBackupWindowsWorkload` extension uses `SQLIaaSExtension` to automatically get the required permissions.

- If you didn't create the VM from Azure Marketplace or if you're using SQL Server 2008 or SQL Server 2008 R2, the VM might not have `SqlIaaSExtension` installed. The discovery operation then fails with the error message `UserErrorSQLNoSysAdminMembership`. To fix this problem, follow the instructions in [Set VM permissions](backup-azure-sql-database.md#set-vm-permissions).

  :::image type="content" source="./media/backup-azure-sql-database/registration-errors.png" alt-text="Screenshot that shows error details for protected servers.":::

## Configure backups

To configure SQL Server database backups, follow these steps:

1. On the **Backup Goal** pane, under **Step 2: Configure Backup**, select **Configure Backup**.

   :::image type="content" source="./media/backup-azure-sql-database/backup-goal-configure-backup.png" alt-text="Screenshot that shows the Configure Backup button.":::

1. Select **Add Resources** to display all the registered availability groups and standalone SQL Server instances.

    :::image type="content" source="./media/backup-azure-sql-database/add-resources.png" alt-text="Screenshot that shows the Add Resources button.":::

1. On the **Select items to backup** pane, select the arrow to the left of a row to expand the list of all the unprotected databases in that instance or Always On availability group.

    :::image type="content" source="./media/backup-azure-sql-database/select-items-to-backup.png" alt-text="Screenshot of the pane for selecting items to back up.":::

1. Choose all the databases that you want to back up, and then select **OK**.

   :::image type="content" source="./media/backup-azure-sql-database/select-database-to-protect.png" alt-text="Screenshot that shows databases selected for backup.":::

   To optimize backup loads, Azure Backup sets the maximum number of databases in one backup job to 50. To protect more than 50 databases, configure multiple backups.

   To [enable](backup-sql-server-database-azure-vms.md#enable-auto-protection) the entire instance or the Always On availability group, in the **AUTOPROTECT** dropdown list, select  **ON**. Then select **OK**.

   > [!NOTE]
   > The [auto-protection](backup-sql-server-database-azure-vms.md#enable-auto-protection) feature doesn't just enable protection on all the existing databases at once. It also automatically protects any new databases added to that instance or availability group.  

1. Define the backup policy. You can take one of the following actions:

   - Select the default policy as **HourlyLogBackup**.
   - Choose an existing backup policy that you created for SQL Server.
   - Define a new policy based on your recovery point objective and your retention range.

   :::image type="content" source="./media/backup-azure-sql-database/select-backup-policy.png" alt-text="Screenshot that shows the pane for defining a backup policy.":::

1. Select **Enable Backup** to submit the **Configure Protection** operation. You can track the configuration progress in the **Notifications** area of the portal.

   :::image type="content" source="./media/backup-azure-sql-database/track-configuration-progress.png" alt-text="Screenshot that shows the area for tracking configuration progress.":::

## Create a backup policy

A backup policy defines when backups run and how long they're retained. Keep these considerations in mind:

- A policy is created at the vault level.
- Multiple vaults can use the same backup policy, but you must apply the backup policy to each vault.
- When you create a backup policy, a daily full backup is the default.
- You can add a differential backup, but only if you configure full backups to occur weekly. [Learn more about the SQL Server backup types](backup-architecture.md#sql-server-backup-types).

To create a backup policy:

1. Go to **Resiliency**, and then select **Manage** > **Protection policies** > **+ Create policy** > **Create backup policy**.

1. On the **Start: Create Policy** pane, select **SQL in Azure VM** as the datasource type. Select the vault under which the policy should be created, and then select **Continue**.

   :::image type="content" source="./media/backup-azure-sql-database/create-sql-policy.png" alt-text="Screenshot that shows choosing a policy type for a new backup policy." lightbox="./media/backup-azure-sql-database/create-sql-policy.png":::

1. On the **Create policy** pane, for **Policy name**, enter a name for the new policy.

   :::image type="content" source="./media/backup-azure-sql-database/sql-policy-summary.png" alt-text="Screenshot that shows how to enter a policy name." lightbox="./media/backup-azure-sql-database/sql-policy-summary.png":::

1. To modify the default settings for backup frequency, select the **Edit** link that corresponds to **Full backup**.

1. On the **Full Backup Policy** pane, configure the following settings under **Backup schedule**:

   1. For **Frequency**, select either **Daily** or **Weekly**.
   1. In the other boxes, select the time and the time zone for when the backup job begins. You can't create differential backups for daily full backups.

   :::image type="content" source="./media/backup-azure-sql-database/sql-backup-schedule.png" alt-text="Screenshot that shows options for a new backup policy." lightbox="./media/backup-azure-sql-database/sql-backup-schedule.png":::

1. Under **Retention range**, all options are selected by default. Clear any retention range limits that you don't want, and then set the intervals to use. Keep this information in mind:

    - The minimum retention period for any type of backup (full, differential, or log) is 7 days.
    - Recovery points are tagged for retention based on their retention range. For example, if you select a daily full backup, only one full backup is triggered every day.
    - The backup for a specific day is tagged and retained based on the weekly retention range and the weekly retention setting.
    - Monthly and yearly retention ranges behave in a similar way.

    :::image type="content" source="./media/backup-azure-sql-database/sql-retention-range.png" alt-text="Screenshot that shows settings for the retention range interval." lightbox="./media/backup-azure-sql-database/sql-retention-range.png":::

1. Select **OK** to accept the setting for full backups.

1. On the **Create policy** pane, to modify the default settings, select the **Edit** link that corresponds to **Differential backup**.

1. On the **Differential Backup Policy** pane, configure the following settings:

    - For **Differential Backup**, select **Enable**.
    - For the **Backup frequency** and **Retained for** controls, keep this information in mind:
      - You can trigger only one differential backup per day. A differential backup can't be triggered on the same day as a full backup.
      - Differential backups can be retained for a maximum of 180 days.
      - The retention period for a differential backup can't be greater than the retention period of the full backup, because differential backups are dependent on full backups for recovery.
      - Differential backups aren't supported for the master database.

    :::image type="content" source="./media/backup-azure-sql-database/sql-differential-backup.png" alt-text="Screenshot that shows the pane for modifying a differential backup policy." lightbox="./media/backup-azure-sql-database/sql-differential-backup.png":::

1. On the **Create policy** pane, to modify the default settings, select the **Edit** link that corresponds to **Log backup**.

1. On the **Log Backup Policy** pane, configure the following settings:

    - For **Log Backup**, select **Enable**.
    - For the **Backup schedule** and **Retained for** controls, keep this information in mind:
      - Log backups can occur as often as every 15 minutes and can be retained for up to 35 days.
      - If the database is in the [simple recovery model](/sql/relational-databases/backup-restore/recovery-models-sql-server), the log backup schedule for that database is paused and no log backups are triggered.
      - If the recovery model of the database changes from **Full** to **Simple**, log backups are paused within 24 hours of the change in the recovery model. Similarly, if the recovery model changes from **Simple** (which implies that log backups can now be supported for the database), the log backup schedules are enabled within 24 hours of the change in the recovery model.

    :::image type="content" source="./media/backup-azure-sql-database/sql-log-backup.png" alt-text="Screenshot that shows the pane for modifying a log backup policy." lightbox="./media/backup-azure-sql-database/sql-log-backup.png":::

1. On the **Backup policy** menu, choose whether to enable **SQL Backup Compression** or not.

   This option is disabled by default. If you enable it, SQL Server sends a compressed backup stream to the virtual device interface (VDI). Azure Backup overrides instance-level defaults with a `COMPRESSION` or `NO_COMPRESSION` clause, depending on the value of this control.

1. After you complete the edits to the backup policy, select **OK**.

> [!NOTE]
> Each log backup is chained to the previous full backup to form a recovery chain. This full backup is retained until the retention of the last log backup expires. This behavior might mean that the full backup is retained for an extra period to make sure all the logs can be recovered.
>
> Assume that you have a weekly full backup, a daily differential, and 2-hour logs. All of them are retained for 30 days. But, the weekly full backup can be cleaned up or deleted only after the next full backup is available; that is, after 30 + 7 days.
>
> For example, a weekly full backup happens on November 16. According to the retention policy, this backup should be retained until December 16. The last log backup happens before the next scheduled full backup, on November 22. Until this log backup is available on December 22, the November 16 full backup can't be deleted. So, the November 16 full backup is retained until December 22.

## Run an on-demand backup

1. In your Recovery Services vault, choose backup items.

1. Select **SQL in Azure VM**.

1. Right-click a database, and then select **Backup now**.

1. Choose the backup type:

   - **On-demand full** retains backups for a minimum of 45 days and a maximum of 99 years.
   - **On-demand copy only full** accepts any value for retention.
   - **On-demand differential** retains backups according to the retention of scheduled differentials set in the policy.
   - **On-demand log** retains backups according to the retention of scheduled logs set in the policy.

1. Choose whether to enable or disable compression.

1. Select **OK** to begin the backup.

1. Monitor the backup job by going to your Recovery Services vault and selecting **Backup Jobs**.

## Next step

Continue to the next tutorial to restore an Azure virtual machine from disk:

> [!div class="nextstepaction"]
> [Restore SQL Server databases on Azure VMs](./restore-sql-database-azure-vm.md)
