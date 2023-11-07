---
title: Tutorial - Back up SQL Server databases to Azure 
description: In this tutorial, learn how to back up a SQL Server database running on an Azure VM to an Azure Backup Recovery Services vault.
ms.topic: tutorial
ms.date: 08/09/2022
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up a SQL Server database in an Azure VM

This tutorial shows you how to back up a SQL Server database running on an Azure VM to an Azure Backup Recovery Services vault. In this article, you learn how to:

> [!div class="checklist"]
>
> * Create and configure a vault.
> * Discover databases, and set up backups.
> * Set up auto-protection for databases.
> * Run an on-demand backup.

## Prerequisites

Before you back up your SQL Server database, check the following conditions:

1. Identify or [create](backup-sql-server-database-azure-vms.md#create-a-recovery-services-vault) a Recovery Services vault in the same region or locale as the VM hosting the SQL Server instance.
1. [Check the VM permissions](backup-azure-sql-database.md#set-vm-permissions) needed to back up the SQL databases.
1. Verify that the  VM has [network connectivity](backup-sql-server-database-azure-vms.md#establish-network-connectivity).
1. Check that the SQL Server databases are named in accordance with [naming guidelines](backup-sql-server-database-azure-vms.md#database-naming-guidelines-for-azure-backup) for Azure Backup.
1. Verify that you don't have any other backup solutions enabled for the database. Disable all other SQL Server backups before you set up this scenario. You can enable Azure Backup for an Azure VM along with Azure Backup for a SQL Server database running on the VM without any conflict.

[!INCLUDE [How to create a Recovery Services vault](../../includes/backup-create-rs-vault.md)]

## Discover SQL Server databases

Discover databases running on the VM.

1. In the [Azure portal](https://portal.azure.com), go to **Backup center** and click **+Backup**.

1. Select **SQL in Azure VM** as the datasource type, select the Recovery Services vault you have created, and then click **Continue**.

   :::image type="content" source="./media/backup-azure-sql-database/configure-sql-backup.png" alt-text="Screenshot showing to select Backup to view the databases running in a VM.":::

1. In **Backup Goal** > **Discover DBs in VMs**, select **Start Discovery** to search for unprotected VMs in the subscription. It can take a while, depending on the number of unprotected virtual machines in the subscription.

   * Unprotected VMs should appear in the list after discovery, listed by name and resource group.
   * If a VM isn't listed as you expect, check whether it's already backed up in a vault.
   * Multiple VMs can have the same name but they'll belong to different resource groups.

     ![Backup is pending during search for DBs in VMs](./media/backup-azure-sql-database/discovering-sql-databases.png)

1. In the VM list, select the VM running the SQL Server database > **Discover DBs**.

1. Track database discovery in the **Notifications** area. It can take a while for the job to complete, depending on how many databases are on the VM. When the selected databases are discovered, a success message appears.

    ![Deployment success message](./media/backup-azure-sql-database/notifications-db-discovered.png)

1. Azure Backup discovers all SQL Server databases on the VM. During discovery, the following occurs in the background:

    * Azure Backup register the VM with the vault for workload backup. All databases on the registered VM can only be backed up to this vault.
    * Azure Backup installs the **AzureBackupWindowsWorkload** extension on the VM. No agent is installed on the SQL database.
    * Azure Backup creates the service account **NT Service\AzureWLBackupPluginSvc** on the VM.
      * All backup and restore operations use the service account.
      * **NT Service\AzureWLBackupPluginSvc** needs SQL sysadmin permissions. All SQL Server VMs created in Azure Marketplace come with the **SqlIaaSExtension** installed. The **AzureBackupWindowsWorkload** extension uses the **SQLIaaSExtension** to automatically get the required permissions.
    * If you didn't create the VM from the marketplace, then the VM doesn't have the **SqlIaaSExtension** installed, and the discovery operation fails with the error message **UserErrorSQLNoSysAdminMembership**. Follow the [instructions](backup-azure-sql-database.md#set-vm-permissions) to fix this issue.

        ![Select the VM and database](./media/backup-azure-sql-database/registration-errors.png)

## Configure backup  

Configure backup as follows:

1. In **Backup Goal** > **Step 2: Configure Backup**, select **Configure Backup**.

   ![Select Configure Backup](./media/backup-azure-sql-database/backup-goal-configure-backup.png)

1. Select **Add Resources** to see all the registered availability groups and standalone SQL Server instances.

    ![Select add resources](./media/backup-azure-sql-database/add-resources.png)

1. In the **Select items to backup** screen, select the arrow to the left of a row to expand the list of all the unprotected databases in that instance or Always On availability group.

    ![Select items to backup](./media/backup-azure-sql-database/select-items-to-backup.png)

1. Choose all the databases you want to protect, and then select **OK**.

   ![Protecting the database](./media/backup-azure-sql-database/select-database-to-protect.png)

   To optimize backup loads, Azure Backup sets a maximum number of databases in one backup job to 50.

     * To protect more than 50 databases, configure multiple backups.
     * To [enable](./backup-sql-server-database-azure-vms.md#enable-auto-protection) the entire instance or the Always On availability group, in the **AUTOPROTECT** drop-down list, select  **ON**, and then select **OK**.

         > [!NOTE]
         > The [auto-protection](./backup-sql-server-database-azure-vms.md#enable-auto-protection) feature not only enables protection on all the existing databases at once, but also automatically protects any new databases added to that instance or the availability group.  

1. Define the **Backup policy**. You can do one of the following:

   * Select the default policy as *HourlyLogBackup*.
   * Choose an existing backup policy previously created for SQL.
   * Define a new policy based on your RPO and retention range.

     ![Select Backup policy](./media/backup-azure-sql-database/select-backup-policy.png)

1. Select **Enable Backup** to submit the **Configure Protection** operation and track the configuration progress in the **Notifications** area of the portal.

   ![Track configuration progress](./media/backup-azure-sql-database/track-configuration-progress.png)

### Create a backup policy

A backup policy defines when backups are taken and how long they're retained.

* A policy is created at the vault level.
* Multiple vaults can use the same backup policy, but you must apply the backup policy to each vault.
* When you create a backup policy, a daily full backup is the default.
* You can add a differential backup, but only if you configure full backups to occur weekly.
* Learn about [different types of backup policies](backup-architecture.md#sql-server-backup-types).

To create a backup policy:

1. Go to **Backup center** and click **+Policy**.

1. Select **SQL Server in Azure VM** as the datasource type, select the vault under which the policy should be created, and then click **Continue**.

   :::image type="content" source="./media/backup-azure-sql-database/create-sql-policy.png" alt-text="Screenshot showing to choose a policy type for the new backup policy.":::

1. In **Policy name**, enter a name for the new policy.

   :::image type="content" source="./media/backup-azure-sql-database/sql-policy-summary.png" alt-text="Screenshot to showing to enter policy name.":::

1. Select the **Edit** link corresponding, to **Full backup**, to modify the default settings.

   * Select a **Backup Frequency**. Choose either **Daily** or **Weekly**.
   * For **Daily**, select the hour and time zone when the backup job begins. You can't create differential backups for daily full backups.

   :::image type="content" source="./media/backup-azure-sql-database/sql-backup-schedule-inline.png" alt-text="Screenshot showing new backup policy fields." lightbox="./media/backup-azure-sql-database/sql-backup-schedule-expanded.png":::

1. In **RETENTION RANGE**, all options are selected by default. Clear any retention range limits that you don't want, and then set the intervals to use.

    * Minimum retention period for any type of backup (full, differential, and log) is seven days.
    * Recovery points are tagged for retention based on their retention range. For example, if you select a daily full backup, only one full backup is triggered each day.
    * The backup for a specific day is tagged and retained based on the weekly retention range and the weekly retention setting.
    * Monthly and yearly retention ranges behave in a similar way.

    :::image type="content" source="./media/backup-azure-sql-database/sql-retention-range-inline.png" alt-text="Screenshot showing the retention range interval settings." lightbox="./media/backup-azure-sql-database/sql-retention-range-expanded.png":::

1. Select **OK** to accept the setting for full backups.
1. Select the **Edit** link corresponding to **Differential backup**, to modify the default settings.

    * In **Differential Backup policy**, select **Enable** to open the frequency and retention controls.
    * You can trigger only one differential backup per day. A differential backup can't be triggered on the same day as a full backup.
    * Differential backups can be retained for a maximum of 180 days.
    * The differential backup retention period can't be greater than that of the full backup (as the differential backups are dependent on the full backups for recovery).
    * Differential Backup isn't supported for the master database.

    :::image type="content" source="./media/backup-azure-sql-database/sql-differential-backup-inline.png" alt-text="Screenshot showing the differential Backup policy." lightbox="./media/backup-azure-sql-database/sql-differential-backup-expanded.png":::

1. Select the **Edit** link corresponding to **Log backup**, to modify the default settings

    * In **Log Backup**, select **Enable**, and then set the frequency and retention controls.
    * Log backups can occur as often as every 15 minutes and can be retained for up to 35 days.
    * If the database is in the [simple recovery model](/sql/relational-databases/backup-restore/recovery-models-sql-server), the log backup schedule for that database will be paused and so no log backups will be triggered.
    * If the recovery model of the database changes from **Full** to **Simple**, log backups will be paused within 24 hours of the change in the recovery model. Similarly, if the recovery model changes from **Simple**, implying log backups can now be supported for the database, the log backups schedules will be enabled within 24 hours of the change in recovery model.

    :::image type="content" source="./media/backup-azure-sql-database/sql-log-backup-inline.png" alt-text="Screenshot showing the log Backup policy." lightbox="./media/backup-azure-sql-database/sql-log-backup-expanded.png":::

1. On the **Backup policy** menu, choose whether to enable **SQL Backup Compression** or not. This option is disabled by default. If enabled, SQL Server will send a compressed backup stream to the VDI. Azure Backup overrides instance level defaults with COMPRESSION / NO_COMPRESSION clause depending on the value of this control.

1. After you complete the edits to the backup policy, select **OK**.

> [!NOTE]
> Each log backup is chained to the previous full backup to form a recovery chain. This full backup will be retained until the retention of the last log backup has expired. This might mean that the full backup is retained for an extra period to make sure all the logs can be recovered. Let's assume you have a weekly full backup, daily differential and 2 hour logs. All of them are retained for 30 days. But, the weekly full can be really cleaned up/deleted only after the next full backup is available, that is, after 30 + 7 days. For example, a weekly full backup happens on Nov 16th. According to the retention policy, it should be retained until Dec 16th. The last log backup for this full happens before the next scheduled full, on Nov 22nd. Until this log is available until Dec 22nd, the Nov 16th full can't be deleted. So, the Nov 16th full is retained until Dec 22nd.

## Run an on-demand backup

1. In your Recovery Services vault, choose Backup items.
1. Select "SQL in Azure VM".
1. Right-click on a database, and choose "Backup now".
1. Choose the Backup Type (Full/Differential/Log/Copy Only Full) and Compression (Enable/Disable).
   - *On-demand full* retains backups for a minimum of *45 days* and a maximum of *99 years*.
   - *On-demand copy only full* accepts any value for retention.
   - *On-demand differential* retains backups as per the retention of scheduled differentials set in policy.
   - *On-demand log* retains backups as per the retention of scheduled logs set in policy.
1. Select OK to begin the backup.
1. Monitor the backup job by going to your Recovery Services vault and choosing "Backup Jobs".

## Next steps

In this tutorial, you used the Azure portal to:

> [!div class="checklist"]
>
> * Create and configure a vault.
> * Discover databases, and set up backups.
> * Set up auto-protection for databases.
> * Run an on-demand backup.

Continue to the next tutorial to restore an Azure virtual machine from disk.

> [!div class="nextstepaction"]
> [Restore SQL Server databases on Azure VMs](./restore-sql-database-azure-vm.md)