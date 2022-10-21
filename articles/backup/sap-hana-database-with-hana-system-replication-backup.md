---
title: Back up SAP HANA System Replication database on Azure VMs (preview)    
description: In this article, discover how to back up SAP HANA database with HANA System Replication enabled.
ms.topic: conceptual
ms.date: 10/05/2022
author: v-amallick
ms.service: backup
ms.custom: ignite-2022
ms.author: v-amallick
---

# Back up SAP HANA System Replication databases in Azure VMs (preview)

SAP HANA databases are critical workloads that require a low recovery-point objective (RPO) and long-term retention. You can back up SAP HANA databases running on Azure virtual machines (VMs) by using [Azure Backup](backup-overview.md).

This article describes about how to back up SAP HANA System Replication (HSR) databases running in Azure VMs to an Azure Backup Recovery Services vault.

In this article, you'll learn how to:

>[!div class="checklist"]
>- Create and configure a Recovery Services vault
>- Create a policy
>- Discover databases
>- Run the pre-registration script
>- Configure backups
>- Run an on-demand backup
>- Run SAP HANA Studio backup

>[!Note]
>See [SAP HANA backup support matrix](sap-hana-backup-support-matrix.md) for more information about the supported configurations and scenarios.

## Prerequisites

- Identify/create a Recovery Services vault in the same region and subscription as the two VMs/nodes of the HSR.
- Allow connectivity from each of the VMs/nodes to the internet for communication with Azure. 

>[!Important]
>Ensure that the combined length of the SAP HANA Server VM name and the Resource Group name doesn't exceed 84 characters for Azure Resource Manager (ARM) VMs and 77 characters for classic VMs. This is because some characters are reserved by the service.


[!INCLUDE [How to create a Recovery Services vault](../../includes/backup-create-rs-vault.md)]

## Discover the databases

To discover the HSR database, follow these steps:

1. In the Azure portal, go to **Backup center** and select **+ Backup**.

   :::image type="content" source="./media/sap-hana-database-with-hana-system-replication-backup/initiate-database-discovery.png" alt-text="Screenshot showing about how to start database discovery.":::

1. Select **SAP HANA in Azure VM** as the data source type, select the Recovery Services vault to use for the backup, and then select **Continue**.

   :::image type="content" source="./media/sap-hana-database-with-hana-system-replication-backup/configure-backup.png" alt-text="Screenshot showing how to configure database backup.":::

1. Select **Start Discovery**.

   This initiates discovery of unprotected Linux VMs in the vault region.
   - After discovery, unprotected VMs appear in the portal, listed by name and resource group.
   - If a VM isn't listed as expected, check whether it's already backed up in a vault.
   - Multiple VMs can have the same name, but they belong to different resource groups.

   :::image type="content" source="./media/sap-hana-database-with-hana-system-replication-backup/discover-hana-database.png" alt-text="Screenshot showing how to discover the HANA database.":::

1. In **Select Virtual Machines**, select the *link to download the script* that provides permissions to the Azure Backup service to access the SAP HANA VMs for database discovery.

   :::image type="content" source="./media/sap-hana-database-with-hana-system-replication-backup/download-script.png" alt-text="Screenshot showing the link location to download the script.":::

1. Run the script on each VM hosting SAP HANA databases that you want to back up.

1. After running the script on the VMs, in **Select Virtual Machines**, select the VMs > **Discover DBs**.

   Azure Backup discovers all SAP HANA databases on the VM. During discovery, Azure Backup registers the VM with the vault, and installs an extension on the VM. It doesn't install any agent on the database.

  To view the details of all databases of each of the discovered VMs, select View details under the **Step 1: Discover DBs in VMs section**.

## Run the pre-registration script

1. When a failover occurs, the users are replicated to the new primary, but the *hdbuserstore* isn't replicated. So, you need to create the same key in all nodes of the HSR setup that allows the Azure Backup service to connect to any new primary node automatically, without any manual intervention. 

1. Create a custom backup user in the HANA system with the following roles and permissions:

   | Role | Permission | Description |
   | --- | --- | --- |
   | MDC | DATABASE ADMIN and BACKUP ADMIN (HANA 2.0 SPS05 and higher) | Creates new databases during restore. |
   | SDC | BACKUP ADMIN | Reads the backup catalog. |
   | SAP_INTERNAL_HANA_SUPPORT |      | Accesses a few private tables. <br><br> This is only required for SDC and MDC versions lower than HANA 2.0 SPS04 Rev 46. This isn't required for HANA 2.0 SPS04 Rev 46 versions and higher because we receive the required information from public tables now after the fix from HANA team. |

1. Then add the key to *hdbuserstore* for your custom backup user that enables the HANA backup plug-in to manage all operations (database queries, restore operations, configuring, and running backup). Pass the custom Backup user key to the script as a parameter: `-bk CUSTOM_BACKUP_KEY_NAME` or `-backup-key CUSTOM_BACKUP_KEY_NAME`. If the password of this custom backup key expires, it could lead to back up and restore failures.

1. Create the same customer backup user (with the same password) and key (in hdbuserstore) on both nodes/VMs.

1. Run the SAP HANA backup configuration script (pre-registration script) in the VMs where HANA is installed as the root user. This script sets up the HANA system for backup. For more information about the script actions, see the [What the pre-registration script does](tutorial-backup-sap-hana-db.md#what-the-pre-registration-script-does) section.

1. There's no HANA generated unique ID for an HSR setup. So, you need to provide a unique ID that helps the backup service to group all nodes of an HSR as a single data source. Provide a unique HSR ID as input to the script: `-hn HSR_UNIQUE_VALUE` or `--hsr-unique-value HSR_Unique_Value`. You must provide the same HSR ID on both the VMs/nodes. This ID must be unique within a vault and should be an alphanumeric value (containing at least one digit, lower-case, and upper-case character) with a length of *6* to *35* characters.

1. While running the pre-registration script on the secondary node, you must specify the SDC/MDC port as input. This is because SQL commands to identify the SDC/MDC setup can't be run on the secondary node. You must provide the port number as parameter as shown below: `-p PORT_NUMER` or `–port_number PORT_NUMBER`.

   - For MDC, it should have the format as `3<instancenumber>13`.
   - For SDC, it should have the format as `3<instancenumber>15`.
1. If your HANA setup uses Private Endpoints, run the pre-registration script with the `-sn` or `--skip-network-checks` parameter. Once the pre-registration script runs successfully, proceed to the next steps.
   
To set up the database for backup, see the [prerequisites](tutorial-backup-sap-hana-db.md#prerequisites) and the [What the pre-registration script does sections](tutorial-backup-sap-hana-db.md#what-the-pre-registration-script-does).

## Configure backup

To enable the backup, follow these steps:

1. In **Step 2**, select **Configure Backup**.

   :::image type="content" source="./media/sap-hana-database-with-hana-system-replication-backup/configure-database-backup.png" alt-text="Screenshot showing how to start backup configuration.":::

1. In **Select items to back up**, select all the databases you want to protect and select **OK**.

   :::image type="content" source="./media/sap-hana-database-with-hana-system-replication-backup/select-virtual-machines-for-protection.png" alt-text="Screenshot showing how to select virtual machines for protection.":::

1. Select  **Backup Policy** > **+Add**.
1. Choose and configure a backup policy type and select **Add** to create a new backup policy for the databases. 

   :::image type="content" source="./media/sap-hana-database-with-hana-system-replication-backup/create-backup-policy.png" alt-text="Screenshot showing how to select and add a backup policy.":::

1. After creating the policy, on the **Backup** menu, select **Enable backup**.

   :::image type="content" source="./media/sap-hana-database-with-hana-system-replication-backup/enable-backup.png" alt-text="Screenshot showing how to enable backup of database.":::

1. Track the backup configuration progress under **Notifications** in Azure portal.

## Create a backup policy

A backup policy defines the backup schedules and the backup retention duration.

>[!Note]
>-  A policy is created at the vault level.
>-  Multiple vaults can use the same backup policy, but you must apply the backup policy to each vault.
>- Azure Backup doesn’t automatically adjust for daylight saving time changes when backing up a SAP HANA database running in an Azure VM.
Modify the policy manually as needed.

To configure the policy settings, follow these steps:

1. In **Policy name**, enter a name for the new policy.

   :::image type="content" source="./media/sap-hana-database-with-hana-system-replication-backup/add-policy-name.png" alt-text="Screenshot showing how to add a policy name.":::

1. In **Full Backup** policy, select a **Backup Frequency**, choose **Daily** or **Weekly**.

   - **Daily**: Select the hour and time zone in which the backup job must begin.
     - You must run a full backup. You can't turn off this option.
     - Select **Full Backup** to view the policy.
     - You can't create differential backups for daily full backups.

   - **Weekly**: Select the day of the week, hour, and time zone in which the backup job must run.

   :::image type="content" source="./media/sap-hana-database-with-hana-system-replication-backup/select-backup-frequency.png" alt-text="Screenshot showing how to configure backup frequency.":::

1. In **Retention Range**, configure retention settings for the full backup.

   - By default, all options are selected. Clear any retention range limits you don't want to use and set them as required.
   - The minimum retention period for any type of backup (full/differential/log) is seven days.
   - Recovery points are tagged for retention based on their retention range. For example, if you select a daily full backup, only one full backup is triggered each day.
   - The backup data for a specific day is tagged and retained based on the weekly retention range and settings.

1. In the **Full Backup** policy menu, select **OK** to save the policy settings.
1. Select **Differential Backup** to add a differential policy.
1. In **Differential Backup policy**, select **Enable** to open the frequency and retention controls.

   - You can trigger a maximum of one differential backup per day.
   - You can retain differential backups for a maximum of 180 days. If you need a longer retention, you must use full backups.

   :::image type="content" source="./media/sap-hana-database-with-hana-system-replication-backup/configure-differential-backup-policy.png" alt-text="Screenshot showing how to configure differential backup policy for database.":::

   >[!Note]
   >You can choose either a differential or an incremental backup as a daily backup at a time.

1. In **Incremental Backup policy**, select **Enable** to open the frequency and retention controls.

   - You can trigger a maximum of one incremental backup per day.
   - You can retain incremental backups for a maximum of 180 days. If you need a longer retention, you must use full backups.

   :::image type="content" source="./media/sap-hana-database-with-hana-system-replication-backup/enable-incremental-backup-policy.png" alt-text="Screenshot showing how to enable incremental backup policy.":::

1. Select **OK** to save the policy and return to the main **Backup policy** menu.
1. Select **Log Backup** to add a transactional log backup policy.

   - In **Log Backup**, select **Enable**.

     You can't disable this option, because SAP HANA manages all log backups.

   - Set the frequency and retention controls.

   >[!Note]
   >Streaming of Log backups only begins after a successful full backup is complete.

1. Select **OK** to save the policy and return to the main **Backup policy** menu.
1. After  the backup policy configuration is complete, select **OK**.

>[!Note]
>All log-backups are chained to the previous full backup to form a recovery chain. A full backup is retained until the retention of expiry of the last log backup. So, the full backup is retained for an extra period to ensure that all logs can be recovered. 
>
>For example, consider that you've a weekly full backup, daily differential, and *2 hour* logs. All of them are retained for *30 days*. But the weekly full backup is deleted only after the next full backup is available, that is, after 30 + 7 days.
>
>If a weekly full backup happens on November 16, then as per the retention policy, it should be retained until *December 16*. The last log backup for this full backup happens before the next scheduled full backup, on *November 22*. Until this log is available on *December 22*, the November 16 full backup isn't deleted. So, the *November* 16 full backup is retained until *December 22*.

## Run an on-demand backup

The backup operations run in accordance with the policy schedule. You can also run an on-demand backup.

To run a backup on-demand backup, follow these steps:

1. In the vault menu, select **Backup items**.

1. In **Backup Items**, select the *VM running the SAP HANA database* > **Backup now**.

1. In **Backup now**, choose the *type of backup* you want to perform, and then select **OK**. 

   This backup will be retained for 45 days.

To monitor the portal notifications and the job progress in the vault dashboard, select  **Backup Jobs** > **In progress**.

>[!Note]
>Time taken to create the initial backup depends  on the size of your database.

## Run SAP HANA Studio backup on a database with Azure Backup enabled

To take a local backup (using HANA Studio) of a database that is backed-up using Azure Backup, follow these steps:

1. After full or log backups for the database are complete, check the status in *SAP HANA Studio*/ *Cockpit*.

1. Disable the log backups and set the backup catalog to the file system for relevant database.

   To do so, double-click **systemdb** > **Configuration** > **Select Database** > **Filter (Log)** and:
   - Set **enable_auto_log_backup** to **No**.
   - Set **log_backup_using_backint** to **False**.
   - Set **catalog_backup_using_backint** to **False**.

1. Run an on-demand full backup of the database.

1. Once the full and catalog backups are complete, change the settings to  point to Azure:

   - Set **enable_auto_log_backup** to **Yes**.
   - Set **log_backup_using_backint** to **True**.
   - Set **catalog_backup_using_backint** to **True**.

## Next steps

- [Restore SAP HANA System Replication databases in Azure VMs (preview)](sap-hana-database-restore.md).
- [About backup of SAP HANA System Replication databases in Azure VMs (preview)](sap-hana-database-about.md#back-up-a-hana-system-with-replication-enabled-preview).
