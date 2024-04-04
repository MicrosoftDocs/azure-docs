---
title: Manage Azure Database for PostgreSQL server 
description: Learn about managing Azure Database for PostgreSQL server.
ms.topic: conceptual
ms.date: 01/24/2022
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Manage Azure Database for PostgreSQL server

This article describes how to manage Azure Database for PostgreSQL servers that are backed up with the Azure Backup service.

## Change policy

You can change the associated policy with a backup instance.

1. Select the **Backup Instance** -> **Change Policy**.


   :::image type="content" source="./media/manage-azure-database-postgresql/change-policy.png" alt-text="Screenshot showing the option to change policy.":::
   
1. Select the new policy that you wish to apply to the database.

   :::image type="content" source="./media/manage-azure-database-postgresql/reassign-policy.png" alt-text="Screenshot showing the option to reassign policy.":::

## Stop protection

There are three ways to stop protecting an Azure Database for PostgreSQL server.

- **Stop Protection and Retain Data (Retain forever)**: This option helps you stop all future backup jobs from protecting your Azure Database for PostgreSQL server. However, Azure Backup service will retain the recovery points that are backed up forever. You'll need to pay to keep the recovery points in the vault (see [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/) for details). You'll be able to restore from these recovery points, if needed. To resume protection, use the **Resume backup** option.

- **Stop Protection and Retain Data (Retain as per Policy)**: This option helps you stop all future backup jobs from protecting your Azure Database for PostgreSQL server. The recovery points will be retained as per policy and will be chargeable according to [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/). However, the latest recovery point will be retained forever.

- **Stop Protection and Delete Data**: This option helps you stop all future backup jobs from protecting your Azure Database for PostgreSQL server and delete all the recovery points. You won't be able to restore the database or use the **Resume backup** option.

### Stop protection and retain data

1. Go to **Backup center** and select **Azure Database for PostgreSQL server**.

1. From the list of server backup instances, select the instance that you want to retain.

1. Select **Stop Backup**.

   :::image type="content" source="./media/manage-azure-database-postgresql/select-postgresql-server-backup-instance-to-delete-inline.png" alt-text="Screenshot showing the selection of the Azure Database for PostgreSQL server backup instance to be stopped." lightbox="./media/manage-azure-database-postgresql/select-postgresql-server-backup-instance-to-delete-expanded.png":::

1. Select one of the following data retention options:

   1. Retain forever
   1. Retain as per policy
   
   :::image type="content" source="./media/manage-azure-database-postgresql/data-retention-options-inline.png" alt-text="Screenshot showing the options for data retention to be selected." lightbox="./media/manage-azure-database-postgresql/data-retention-options-expanded.png":::

   You can also select the reason for stopping backups from the drop-down list.

1. Click **Stop Backup**.

1. Select **Confirm** to stop backup.

   :::image type="content" source="./media/manage-azure-database-postgresql/confirmation-to-stop-backup-inline.png" alt-text="Screenshot for the confirmation for stopping backup." lightbox="./media/manage-azure-database-postgresql/confirmation-to-stop-backup-expanded.png":::

### Stop protection and delete data

1. Go to **Backup center** and select **Azure Database for PostgreSQL server**.

1.  From the list of server backup instances, select the instance that you want to delete.

1. Click **Stop Backup**.

1. Select **Delete Backup Data**.

   Provide the name of the backup instance, reason for deletion, and any other comments.

   :::image type="content" source="./media/manage-azure-database-postgresql/delete-backup-data-and-provide-details-inline.png" alt-text="Screenshot showing the option to delete backup data and the detail required to be added." lightbox="./media/manage-azure-database-postgresql/delete-backup-data-and-provide-details-expanded.png":::

1. Select **Stop Backup**.

1. Select **Confirm** to stop backup.

   :::image type="content" source="./media/manage-azure-database-postgresql/confirmation-to-stop-backup-inline.png" alt-text="Screenshot for the confirmation for stopping backup." lightbox="./media/manage-azure-database-postgresql/confirmation-to-stop-backup-expanded.png":::

## Resume protection

If you have selected the **Stop Protection and Retain data** option while stopping the data backup, you can resume protection for your Azure Database for PostgreSQL server.

>[!Note]
>When you start protecting a database, the backup policy is applied to the retained data as well. The recovery points that have expired as per the policy will be cleaned up.

Follow these steps:

1. Go to **Backup center** and select **Azure Database for PostgreSQL server**.

1. From the list of server backup instances, select the instance that you want resume.

1. Select **Resume Backup**.

   :::image type="content" source="./media/manage-azure-database-postgresql/resume-data-protection-inline.png" alt-text="Screenshot showing the option to resume data protection." lightbox="./media/manage-azure-database-postgresql/resume-data-protection-expanded.png":::

1. Select **Resume backup**.

   :::image type="content" source="./media/manage-azure-database-postgresql/resume-data-backup-inline.png" alt-text="Screenshot showing the option to resume data backup." lightbox="./media/manage-azure-database-postgresql/resume-data-backup-expanded.png":::

## Next steps

[Backup vaults overview](backup-vault-overview.md)
