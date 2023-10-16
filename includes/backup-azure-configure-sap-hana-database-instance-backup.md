---
title: include file
description: include file
services: backup
ms.service: backup
ms.topic: include
ms.date: 02/17/2023
author: jyothisuri
ms.author: jsuri
---

## Configure snapshot backup

Before you configure a snapshot backup in this section, [configure the backup for the database](backup-azure-sap-hana-database.md#configure-backup).

Then, to configure a snapshot backup, do the following:

1. In the Recovery Services vault, select **Backup**.

1. Select **SAP HANA in Azure VM** as the data source type, select a Recovery Services vault to use for backup, and then select **Continue**.

1. On the **Backup Goal** pane, under **Step 2: Configure Backup**, select **DB Instance via snapshot**, and then select **Configure Backup**.

   :::image type="content" source="./media/backup-azure-configure-sap-hana-database-instance-backup/select-db-instance-via-snapshot.png" alt-text="Screenshot that shows the 'DB Instance via snapshot' option.":::

1. On the **Configure Backup** pane, in the **Backup policy** dropdown list, select the database instance policy, and then select **Add/Edit** to check the available database instances.

   :::image type="content" source="./media/backup-azure-configure-sap-hana-database-instance-backup/add-database-instance-backup-policy.png" alt-text="Screenshot that shows where to select and add a database instance policy.":::

   To edit a DB instance selection, select the checkbox that corresponds to the instance name, and then select **Add/Edit**.

1. On the **Select items to backup** pane, select the checkboxes next to the database instances that you want to back up, and then select **OK**.

   :::image type="content" source="./media/backup-azure-configure-sap-hana-database-instance-backup/select-database-instance-for-backup.png" alt-text="Screenshot that shows the 'Select items to backup' pane and a list of database instances.":::

   When you select HANA instances for backup, the Azure portal validates for missing permissions in the system-assigned managed identity that's assigned to the policy.

   If the permissions aren't present, you need to select **Assign missing roles/identity** to assign all permissions.

   The Azure portal then automatically re-validates the permissions, and the **Backup readiness** column displays the status as *Success*.

1. When the backup readiness check is successful, select **Enable backup**.

   :::image type="content" source="./media/backup-azure-configure-sap-hana-database-instance-backup/enable-hana-database-instance-backup.png" alt-text="Screenshot that shows that the HANA database instance backup is ready to be enabled.":::
 
## Run an on-demand backup

To run an on-demand backup, do the following:

1. In the Azure portal, select a Recovery Services vault.

1. In the Recovery Services vault, on the left pane, select **Backup items**.

1. By default, **Primary Region** is selected. Select **SAP HANA in Azure VM**.

1. On the **Backup Items** pane, select the **View details** link next to the SAP HANA snapshot instance.

   :::image type="content" source="./media/backup-azure-configure-sap-hana-database-instance-backup/hana-snapshot-view-details.png" alt-text="Screenshot that shows the 'View details' links next to the HANA database snapshot instances.":::

1. Select **Backup now**.

   :::image type="content" source="./media/backup-azure-configure-sap-hana-database-instance-backup/start-backup-hana-snapshot.png" alt-text="Screenshot that shows the 'Backup now' button for starting a backup of a HANA database snapshot instance.":::

1. On the **Backup now** pane, select **OK**.

   :::image type="content" source="./media/backup-azure-configure-sap-hana-database-instance-backup/trigger-backup-hana-snapshot.png" alt-text="Screenshot showing to trigger HANA database snapshot instance backup.":::

## Track a backup job

The Azure Backup service creates a job if you schedule backups or if you trigger an on-demand backup operation for tracking. To view the backup job status, do the following:

1. In the Recovery Services vault, on the left pane, select **Backup Jobs**.

   The jobs dashboard displays the status of the jobs that were triggered in the past 24 hours. To modify the time range, select **Filter**, and then make the required changes.

1. To review the details of a job, select the **View details** link next to the job name.