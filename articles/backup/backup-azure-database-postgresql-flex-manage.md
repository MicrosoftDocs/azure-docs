---
title: Manage backups of Azure Database for PostgreSQL - Flexible Server using Azure portal
description: Learn about managing backup for the Azure PostgreSQL - Flexible servers from the Azure portal.
ms.topic: how-to
ms.date: 03/18/2025
author: jyothisuri
ms.author: jsuri
ms.service: azure-backup
ms.custom: engagement-fy24, ignite-2024
# Customer intent: "As a database administrator, I want to manage backup policies and monitor backup operations for Azure Database for PostgreSQL - Flexible Server, so that I can ensure data protection and recoverability in accordance with my organization's requirements."
---

# Manage backups of Azure Database for PostgreSQL - Flexible Server using Azure portal

This article describes how to manage backup of Azure Database for PostgreSQL - Flexible Server using Azure portal.

## Change policy

You can change the associated policy with a backup instance.

1. Select the **Backup Instance** -> **Change Policy**.


   :::image type="content" source="./media/manage-azure-database-postgresql/change-policy.png" alt-text="Screenshot showing the option to change policy.":::
   
1. Select the new policy that you wish to apply to the database.

   :::image type="content" source="./media/manage-azure-database-postgresql/reassign-policy.png" alt-text="Screenshot showing the option to reassign policy.":::

> [!NOTE]
>
> Changing a backup policy assigned to a backup instance does not affect existing recovery points and their retention duration. The updated retention settings will apply only to new recovery points created after the policy change.

## Monitor a backup operation

The Azure Backup service creates a job for scheduled backups or if you trigger on-demand backup operation for tracking. To view the backup job status:

1. Go to the **Azure Business Continuity Center** and select **Protected Items** under **Protection Inventory**.

   The **Protected Items** blade shows all the backup instances created across the subscriptions. Use the filters to access the backup instance you would like to take a look at. Select on the protected item and open it.

   :::image type="content" source="./media/backup-managed-disks/jobs-dashboard.png" alt-text="Screenshot shows the jobs dashboard." lightbox="./media/backup-managed-disks/jobs-dashboard.png":::

1. Now select on the **Associated Items** to open up the dashboard for the backup instance. Here you can see the backup jobs for the last seven days. 

1. To view the status of the backup operation, select **View all** to show ongoing and past jobs of this backup instance.

   ![Screenshot shows how to select the view all option.](./media/backup-managed-disks/view-all.png)

1. Review the list of backup and restore jobs and their status. Select a job from the list of jobs to view job details.

   ![Screenshot shows how to select a job to see details.](./media/backup-managed-disks/select-job.png)

## Monitor a restore operation

After you trigger the restore operation, the backup service creates a job for tracking. Azure Backup displays notifications about the job in the portal. To view the restore job progress:

1. Go to the **Azure Business Continuity Center** and select **Protected Items** under **Protection Inventory**.

   The **Protected Items** blade shows all the backup instances created across the subscriptions. Use the filters to access the backup instance you would like to take a look at. Select on the protected item and open it.

   :::image type="content" source="./media/backup-managed-disks/jobs-dashboard.png" alt-text="Screenshot shows the jobs dashboard." lightbox="./media/backup-managed-disks/jobs-dashboard.png":::

1. Now select on the **Associated Items** to open up the dashboard for the backup instance. Here you can see the backup jobs for the last seven days. 

1. To view the status of the restore operation, select **View all** to show ongoing and past jobs of this backup instance.

    ![Screenshot shows how to select View all.](./media/restore-managed-disks/view-all.png)

1. Review the list of backup and restore jobs and their status. Select a job from the list of jobs to view job details.

    ![Screenshot shows the list of jobs.](./media/restore-managed-disks/list-of-jobs.png)

## Manage operations using the Azure portal

This section describes several Azure Backup supported management operations that make it easy to manage Azure PostgreSQL - Flexible servers.

### Enable public network access for the database storage account

Ensure the target storage account for restoring backup as a file is accessible via a public network. If the storage account uses a private endpoint, update its public network access settings before executing a restore operation.

To enable public network access for the target storage account, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the **target storage account** > **Security + Networking** > **Networking**. 

2. Select **Manage** under **Public network access**. 

3. On the **Public network access** pane, select **Enable from selected networks** as **Default action**. 

   :::image type="content" source="./media/backup-azure-database-postgresql-flex-manage/enable-public-network-access.png" alt-text="Screenshot shows how to enable public network access for the database storage account." lightbox="./media/backup-azure-database-postgresql-flex-manage/enable-public-network-access.png":::

4. Under **Resource instances**, choose **Resource type** as `Microsoft.DataProtection/BackupVaults`, and then select the **Backup vault** where your backup is stored.

5. Under **Exceptions**, select **Allow trusted Microsoft services to access this resource**. 

6. Select **Save** to implement the updates.
 
### Stop Protection

There are three ways by which you can stop protecting an Azure Disk:

- **Stop Protection and Retain Data (Retain forever)**: This option helps you stop all future backup jobs from protecting your server. However, Azure Backup service retains the recovery points that are backed up forever. You need to pay to keep the recovery points in the vault (see [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/) for details). You are able to restore the disk, if needed. To resume server protection, use the **Resume backup** option.

- **Stop Protection and Retain Data (Retain as per Policy)**: This option helps you stop all future backup jobs from protecting your server. The recovery points are retained as per policy and will be chargeable according to [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/). However, the latest recovery point is retained forever.

- **Stop Protection and Delete Data**: This option helps you stop all future backup jobs from protecting your servers and delete all the recovery points. You won't be able to restore the disk or use the **Resume backup** option.

#### Stop Protection and Retain Data

1. Go to the **Azure Business Continuity Center** and select **Protected Items** under **Protection Inventory**.

   The **Protected Items** blade shows all the backup instances created across the subscriptions. Use the filters to access the backup instance you would like to take a look at. Select on the protected item and open it.

   :::image type="content" source="./media/backup-managed-disks/jobs-dashboard.png" alt-text="Screenshot shows the jobs dashboard." lightbox="./media/backup-managed-disks/jobs-dashboard.png":::

1. Now select on the **Associated Items** to open up the dashboard for the backup instance. 

1. Select **Stop Backup**.

   :::image type="content" source="./media/manage-azure-managed-disks/select-disk-backup-instance-to-stop-inline.png" alt-text="Screenshot showing the selection of the backup instance to be stopped." lightbox="./media/manage-azure-managed-disks/select-disk-backup-instance-to-stop-expanded.png":::
 
1. Select one of the following data retention options:

   1. Retain forever
   1. Retain as per policy
 
   :::image type="content" source="./media/manage-azure-managed-disks/data-retention-options-for-disk-inline.png" alt-text="Screenshot showing the options to stop backup instance protection." lightbox="./media/manage-azure-managed-disks/data-retention-options-for-disk-expanded.png":::

   You can also select the reason for stopping backups  from the drop-down list.

1. Select **Stop Backup**.

1. Select **Confirm** to stop data protection.

   :::image type="content" source="./media/manage-azure-managed-disks/confirm-stopping-disk-backup-inline.png" alt-text="Screenshot showing the options for backup instance retention to be selected." lightbox="./media/manage-azure-managed-disks/confirm-stopping-disk-backup-expanded.png":::

#### Stop Protection and Delete Data

1. Go to the **Azure Business Continuity Center** and select **Protected Items** under **Protection Inventory**.

   The **Protected Items** blade shows all the backup instances created across the subscriptions. Use the filters to access the backup instance you would like to take a look at. Select on the protected item and open it.

   :::image type="content" source="./media/backup-managed-disks/jobs-dashboard.png" alt-text="Screenshot shows the jobs dashboard." lightbox="./media/backup-managed-disks/jobs-dashboard.png":::

1. Now select on the **Associated Items** to open up the dashboard for the backup instance. 

1. Select **Stop Backup**.

1. Select **Delete Backup Data**.

   Provide the name of the backup instance, reason for deletion, and any other comments.

   :::image type="content" source="./media/manage-azure-managed-disks/details-to-stop-disk-backup-inline.png" alt-text="Screenshot for the confirmation for stopping backup." lightbox="./media/manage-azure-managed-disks/details-to-stop-disk-backup-expanded.png":::

1. Select **Stop Backup**.

1. Select **Confirm** to stop data protection.

   :::image type="content" source="./media/manage-azure-managed-disks/confirm-stopping-disk-backup-inline.png" alt-text="Screenshot showing the options for backup instance retention to be selected." lightbox="./media/manage-azure-managed-disks/confirm-stopping-disk-backup-expanded.png":::

### Resume Protection

If you have selected the **Stop Protection and Retain data** option, you can resume protection for your servers.

>[!Note]
>When you resume protecting a backup instance, the existing backup policy will start applying to new recovery points only. Recovery points that have already expired based on their original retention duration, as defined by the backup policy in effect at the time of their creation, will be cleaned up.

Use the following steps:

1. Go to the **Azure Business Continuity Center** and select **Protected Items** under **Protection Inventory**.

   The **Protected Items** blade shows all the backup instances created across the subscriptions. Use the filters to access the backup instance you would like to take a look at. Select on the protected item and open it.

   :::image type="content" source="./media/backup-managed-disks/jobs-dashboard.png" alt-text="Screenshot shows the jobs dashboard." lightbox="./media/backup-managed-disks/jobs-dashboard.png":::

1. Now select on the **Associated Items** to open up the dashboard for the backup instance. 

1. Select **Resume Backup**.

   :::image type="content" source="./media/manage-azure-managed-disks/resume-disk-protection-inline.png" alt-text="Screenshot showing the option to resume protection of server." lightbox="./media/manage-azure-managed-disks/resume-disk-protection-expanded.png":::

1. Select **Resume backup**.

   :::image type="content" source="./media/manage-azure-managed-disks/resume-disk-backup-inline.png" alt-text="Screenshot showing the option to resume backup." lightbox="./media/manage-azure-managed-disks/resume-disk-backup-expanded.png":::

### Delete Backup Instance

If you choose to stop all scheduled backup jobs and delete all existing backups, use **Delete Backup Instance**.

To delete a PostgreSQL server backup instance, follow these steps:

1. Select **Delete** on the backup instance screen.

   :::image type="content" source="./media/manage-azure-managed-disks/initiate-deleting-backup-instance-inline.png" alt-text="Screenshot showing the process to delete a backup instance." lightbox="./media/manage-azure-managed-disks/initiate-deleting-backup-instance-expanded.png":::

1. Provide confirmation details including name of the Backup instance, reason for deletion, and other comments.

   :::image type="content" source="./media/manage-azure-managed-disks/confirm-deleting-backup-instance-inline.png" alt-text="Screenshot showing how to confirm the deletion of backup instances." lightbox="./media/manage-azure-managed-disks/confirm-deleting-backup-instance-expanded.png":::

1. Select **Delete** to confirm and proceed with deleting backup instance.


## Next step

[Troubleshoot common errors for backup and restore operations for Azure Database for PostgreSQL - Flexible Server](backup-azure-database-postgresql-flex-troubleshoot.md).