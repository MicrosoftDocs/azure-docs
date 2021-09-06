---
title: Manage Azure Managed Disks
description: Learn about managing Azure Managed Disk from the Azure portal.
ms.topic: conceptual
ms.date: 09/06/2021
ms.custom: references_regions , devx-track-azurecli
---

# Manage Azure Managed Disks

This article explains how to manage Azure Managed Disk from the Azure portal.

## Stop Protection (Preview)


There are three ways by which you can stop protecting an Azure Disk:

- **Stop Protection and Retain Data (Retain forever)**: This option helps you stop all future backup jobs from protecting your disk. However, Azure Backup service will retain the recovery points that are backed up forever. You'll need to pay to keep the recovery points in the vault (see [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/) for details). You'll be able to restore the disk, if needed. To resume disk protection, use the **Resume backup** option.

- **Stop Protection and Retain Data (Retain as per Policy)**: This option helps you stop all future backup jobs from protecting your disk. The recovery points will be retained as per policy and will be chargeable according to [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/). However, the latest recovery point will be retained forever.

- **Stop Protection and Delete Data**: This option helps you stop all future backup jobs from protecting your disks and delete all the recovery points. You won't be able to restore the disk or use the **Resume backup** option.

### Stop Protection and Retain Data

1. Go to **Backup center** and select **Azure Disks**.

1. From the list of backup instances, select the disk backup instance that you want to retain.

1. Select **Stop Backup (Preview)**.

   :::image type="content" source="./media/manage-azure-managed-disks/select-disk-backup-instance-to-stop.png" alt-text="Screenshot showing the selection of the Azure disk backup instance to be stopped.":::
 
1. Select one of the following data retention options:

   1. Retain forever
   1. Retain as per policy
 
   :::image type="content" source="./media/manage-azure-managed-disks/data-retention-options-for-disk.png" alt-text="Screenshot showing the options for disk backup instance retention to be selected.":::

   You can also select the reason for stopping backups  from the drop-down list.

1. Click **Stop Backup**.

### Stop Protection and Delete Data

1. Go to **Backup center** and select **Azure Disks**.

1. From the list of backup instances, select the disk backup instance that you want to delete.

1. Click **Stop Backup (Preview)**.

1. Select **Delete Backup Data**.

   Provide the name of the backup instance, reason for deletion, and any other comments.

   :::image type="content" source="./media/manage-azure-managed-disks/confirmation-to-stop-disk-backup.png" alt-text="Screenshot for the confirmation for stopping disk backup.":::

1. Select **Stop Backup**.

## Resume Protection

If you have selected the **Stop Protection and Retain data** option, you can resume protection for your disks.

Use the following steps:

1. Go to **Backup center** and select **Azure Disks**.

1. From the list of backup instances, select the disk backup instance that you want to resume.

1. Select **Resume Protection (Preview)**.

   :::image type="content" source="./media/manage-azure-managed-disks/resume-disk-protection.png" alt-text="Screenshot showing the option to resume protection of disk.":::

1. Select **Resume backup**.

   :::image type="content" source="./media/manage-azure-managed-disks/resume-disk-backup.png" alt-text="Screenshot showing the option to resume disk backup.":::


## Next steps

[Backup vaults overview](backup-vault-overview.md)
