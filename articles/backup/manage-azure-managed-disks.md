---
title: Manage Azure Managed Disks
description: Learn about managing Azure Managed Disk from the Azure portal.
ms.topic: how-to
ms.date: 01/30/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.service: azure-backup
ms.custom: engagement-fy24
# Customer intent: "As an IT administrator, I want to manage Azure Managed Disks through the portal so that I can efficiently change backup policies, monitor operations, and control data protection settings."
---

# Manage Azure Managed Disks backup using the Azure portal

This article describes how to manage Azure Managed Disk using the Azure portal.


## Change policy

You can change the associated policy with a backup instance.

To change the backup policy for Azure Disk, follow these steps:

1. Go to the **Backup vault**, and then select **Manage** > **Backup instances**.

1. On the **Backup instances** pane, select the Azure Disk backup instance > **More icon** > **Edit backup instance**.

1. On the **Edit backup instance** pane, under **Policy**, select a new backup policy from the drop-down list, and then select **Validate**.

   :::image type="content" source="./media/manage-azure-managed-disks/edit-backup-policy.png" alt-text="Screenshot shows the option to change the backup policy.":::
   
1. After a successful validation, select **Apply**.


> [!NOTE]
>
> Changing a backup policy assigned to a backup instance doesn't affect existing recovery points and their retention duration. The updated retention settings will apply only to new recovery points created after the policy change.

## Monitor the backup and restore operations for Azure Managed Disks

The Azure Backup service creates a job to track the progress of backup (scheduled and on-demand) and restore operations. After you trigger a backup or restore, Azure Backup initiates a job and shows notifications about its status in the Azure portal. To view the job progress for backup or restore, follow these steps:

1. Go to the **Resiliency** and select **Monitoring + Reporting** > **Jobs**.

   The **Jobs** pane shows the jobs dashboard with operation and status for the past six hours. You can extend the list upto two weeks or set a custom time range.

   :::image type="content" source="./media/manage-azure-managed-disks/jobs-dashboard.png" alt-text="Screenshot shows the jobs dashboard." lightbox="./media/manage-azure-managed-disks/jobs-dashboard.png":::

1. On the **Jobs** pane, select the **Datasource type** as **Azure Disks**.

1. Review the list of backup and restore jobs and their status. To view job details, select a job from the list.

   The following screenshots show completed backup and restore jobs.

   :::image type="content" source="./media/manage-azure-managed-disks/backup-job-details.png" alt-text="Screenshot shows the job details of a disk backup." lightbox="./media/manage-azure-managed-disks/backup-job-details.png":::

   :::image type="content" source="./media/manage-azure-managed-disks/restore-job-details.png" alt-text="Screenshot shows the job details of a disk restore." lightbox="./media/manage-azure-managed-disks/restore-job-details.png":::

## Manage operations using the Azure portal

This section describes several Azure Backup supported management operations that make it easy to manage Azure Managed disks.

### Stop Protection

You can stop protecting an Azure Disk using one of the following methods:

- **Stop Protection and Retain Data (Retain forever)**: This option helps you stop all future backup jobs from protecting your disk. However, Azure Backup service retains the recovery points that are backed up forever, which allows you to restore the disk when needed. You're charged to keep the recovery points in the vault (see [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/) for details). To resume disk protection, use the **Resume backup** option.

- **Stop Protection and Retain Data (Retain as per Policy)**: This option helps you stop all future backup jobs from protecting your disk. The recovery points are retained as per policy and are chargeable as per the [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/). However, the latest recovery points are retained forever.

- **Stop Protection and Delete Data**: This option helps you stop all future backup jobs from protecting your disks and delete all the recovery points. You can't restore the disk or use the **Resume backup** option.

#### Stop Protection and Retain Data

1. Go to **Resiliency** and select **Protection inventory** > **Protected items**.

   :::image type="content" source="./media/manage-azure-managed-disks/protected-items.png" alt-text="Screenshot shows the list of protected Azure Disks." lightbox="./media/manage-azure-managed-disks/protected-items.png":::

1. On the **Protected items** pane, select **Datasource type** as **Azure Disks**, and then select the required protected item from the list.

1. On the protected disk pane, choose the required disk backup instance from the list that you want to stop backup and retain data.

1. On the protected disk instance pane, select **Stop Backup**.

   :::image type="content" source="./media/manage-azure-managed-disks/disk-backup-instance-to-stop.png" alt-text="Screenshot shows how to initiate the stop backup operation for Azure Disks." lightbox="./media/manage-azure-managed-disks/disk-backup-instance-to-stop.png":::
 
1. On the **Stop Backup** pane, select one of the following data retention options:

   - Retain forever
   - Retain as per policy
 
   :::image type="content" source="./media/manage-azure-managed-disks/data-retention-options-for-disk.png" alt-text="Screenshot shows the options to stop disk backup instance protection and retain data." lightbox="./media/manage-azure-managed-disks/data-retention-options-for-disk.png":::

   You can also select the reason for stopping backups  from the drop-down list.

1. Select **Stop backup** > **Confirm** to stop data protection.

#### Stop Protection and Delete Data

1. Go to **Resiliency** and select **Protection inventory** > **Protected items**.

   :::image type="content" source="./media/manage-azure-managed-disks/protected-items.png" alt-text="Screenshot shows the list of protected Azure Disks." lightbox="./media/manage-azure-managed-disks/protected-items.png":::

1. On the **Protected items** pane, select **Datasource type** as **Azure Disks**, and then select the required protected item from the list.

1. On the protected disk pane, choose the required disk backup instance from the list that you want to stop backup and delete data.

1. On the protected disk instance pane, select **Stop Backup**.

   :::image type="content" source="./media/manage-azure-managed-disks/disk-backup-instance-to-stop.png" alt-text="Screenshot shows how to initiate the stop backup operation for Azure Disks." lightbox="./media/manage-azure-managed-disks/disk-backup-instance-to-stop.png":::
 
1. On the **Stop Backup** pane, select **Stop backup level** as **Delete backup data**, enter **Name of backup item**, and then choose a reason for stopping backups from the dropdown list.
 
   :::image type="content" source="./media/manage-azure-managed-disks/data-deletion-option-for-disk.png" alt-text="Screenshot shows the option to stop disk backup instance protection and delete data." lightbox="./media/manage-azure-managed-disks/data-deletion-option-for-disk.png":::

1. Select **Stop backup** > **Confirm** to stop data protection.

### Resume Protection

If you stop protection with the **Retain backup data** option, you can resume protection for your disks.

>[!Note]
>When you resume protecting a backup instance, the existing backup policy will start applying to new recovery points only. Recovery points that have already expired based on their original retention duration, as defined by the backup policy in effect at the time of their creation, will be cleaned up.

To resume protection for a disk backup instance, follow these steps:

1. Go to **Resiliency** and select **Protection inventory** > **Protected items**.

   :::image type="content" source="./media/manage-azure-managed-disks/protected-items.png" alt-text="Screenshot shows the list of protected Azure Disks." lightbox="./media/manage-azure-managed-disks/protected-items.png":::

1. On the **Protected items** pane, select **Datasource type** as **Azure Disks**, and then select the required protected item from the list.

1. On the protected disk pane, choose the required disk backup instance from the list that you want to resume backup.

1. On the protected disk instance pane, select **Resume Backup**.

   :::image type="content" source="./media/manage-azure-managed-disks/resume-disk-protection.png" alt-text="Screenshot shows how to initiate the resume protection operation for Azure Disks." lightbox="./media/manage-azure-managed-disks/resume-disk-protection.png":::

1. On the **Resume Backup** pane, select **Resume backup**.

   :::image type="content" source="./media/manage-azure-managed-disks/resume-disk-backup.png" alt-text="Screenshot shows how to resume disk backup." lightbox="./media/manage-azure-managed-disks/resume-disk-backup.png":::

### Delete Backup Instance

If you choose to stop all scheduled backup jobs and delete all existing backups, use **Delete Backup Instance**.

>[!Note]
>Deleting a backup instance will fail if the Snapshot Resource Group is deleted manually or permission to the Backup vault’s managed identity is revoked. In such failure cases, create the Snapshot Resource Group (with the same name) temporarily and provide Backup vault’s managed identity with required role permissions as documented [here](./backup-managed-disks-ps.md#assign-permissions). You can find the name of Snapshot Resource Group on the **Essentials** tab of **Backup instance** screen. 

To delete a disk backup instance, follow these steps:

1. Go to **Resiliency** and select **Protection inventory** > **Protected items**.

   :::image type="content" source="./media/manage-azure-managed-disks/protected-items.png" alt-text="Screenshot shows the list of protected Azure Disks." lightbox="./media/manage-azure-managed-disks/protected-items.png":::

1. On the **Protected items** pane, select **Datasource type** as **Azure Disks**, and then select the required protected item from the list.

1. On the protected disk pane, choose the required disk backup instance from the list that you want to delete.

1. On the protected disk instance pane, select **Delete**.

   :::image type="content" source="./media/manage-azure-managed-disks/initiate-delete-backup-instance.png" alt-text="Screenshot showing the process to delete a backup instance." lightbox="./media/manage-azure-managed-disks/initiate-delete-backup-instance.png":::

1. On the **Delete Backup Data** pane, enter confirmation details including name of the Backup instance, reason for deletion, and other comments.

   :::image type="content" source="./media/manage-azure-managed-disks/confirm-delete-backup-instance.png" alt-text="Screenshot shows how to confirm the deletion of backup instances." lightbox="./media/manage-azure-managed-disks/confirm-delete-backup-instance.png":::

1. Select **Delete** > **Confirm** to proceed with deleting backup instance.

## Next steps

[Troubleshoot Azure Managed Disk backup failures](disk-backup-troubleshoot.md).

## Related content

- [Create a Backup policy for Azure Managed Disk using REST API](backup-azure-dataprotection-use-rest-api-create-update-disk-policy.md).
- [Configure backup for Azure Managed Disk using REST API](backup-azure-dataprotection-use-rest-api-backup-disks.md).
- [Restore Azure Managed Disk using REST API](backup-azure-dataprotection-use-rest-api-restore-disks.md).