---
title: Manage Azure Database for PostgreSQL server 
description: Learn about managing Azure Database for PostgreSQL server.
ms.topic: conceptual
ms.date: 09/06/2021
ms.custom: references_regions , devx-track-azurecli
---

# Manage Azure Database for PostgreSQL server

This article describes how to manage Azure Database for PostgreSQL servers that are backed up with the Azure Backup service.

## Stop Protection (Preview)

There are three ways by which you can stop protecting an Azure Database for PostgreSQL server.

- **Stop Protection and Retain Data (Retain forever)**: This option helps you stop all future backup jobs from protecting your Azure Database for PostgreSQL server. However, Azure Backup service will retain the recovery points that are backed up forever. You'll need to pay to keep the recovery points in the vault (see [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/) for details). You'll be able to restore from these recovery points, if needed. To resume protection, use the **Resume backup** option.

- **Stop Protection and Retain Data (Retain as per Policy)**: This option helps you stop all future backup jobs from protecting your Azure Database for PostgreSQL server. The recovery points will be retained as per policy and will be chargeable according to [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/). However, the latest recovery point will be retained forever.

- **Stop Protection and Delete Data**: This option helps you stop all future backup jobs from protecting your Azure Database for PostgreSQL server and delete all the recovery points. You won't be able to restore the database or use the **Resume backup** option.

### Stop Protection and Retain Data

1. Go to **Backup center** and select **Azure Database for PostgreSQL server (Preview)**.

1. From the list of backup instances, select the server backup instance that you want to retain.

1. Select **Stop Backup (Preview)**.

   :::image type="content" source="./media/manage-azure-database-postgresql/select-postgresql-erver-backup-instance-to-delete.png" alt-text="Screenshot showing the selection of the Azure Database for PostgreSQL server backup instance to be stopped.":::

3. Select one of the following data retention options:

   1. Retain forever
   1. Retain as per policy
   
   :::image type="content" source="./media/manage-azure-database-postgresql/data-retention-options.png" alt-text="Screenshot showing the options for data retention to be selected.":::

   You can also select the reason for stopping backups from the drop-down list.

1. Click **Stop Backup**.

### Stop Protection and Delete Data

1. Go to **Backup center** and select **Azure Database for PostgreSQL server (Preview)**.

1.  From the list of backup instances, select the server backup instance that you want to delete.

1. Click **Stop Backup (Preview)**.

1. Select **Delete Backup Data**.

   Provide the name of the backup instance, reason for deletion, and any other comments.

   :::image type="content" source="./media/manage-azure-database-postgresql/delete-backup-data-and-provide-details.png" alt-text="Screenshot showing the option to delete backup data and the detail required to be added.":::

1. Select **Stop Backup**.

1. Select **Confirm** to stop backup.

   :::image type="content" source="./media/manage-azure-database-postgresql/confirmation-to-stop-backup.png" alt-text="Screenshot for the confirmation for stopping backup.":::

## Resume Protection

If you have selected the **Stop Protection and Retain data** option while stopping the data backup, you can resume protection for your Azure Database for PostgreSQL server.

Use the following steps:

1. Go to **Backup center** and select **Azure Database for PostgreSQL server (Preview)**.

1. From the list of backup instances, select the server backup instances that you want resume.

1. Select **Resume Protection (Preview)**.

   :::image type="content" source="./media/manage-azure-database-postgresql/resume-data-protection.png" alt-text="Screenshot showing the option to resume data protection.":::

1. Select **Resume backup**.

   :::image type="content" source="./media/manage-azure-database-postgresql/resume-data-backup.png" alt-text="Screenshot showing the option to resume data backup.":::

## Next steps

[Backup vaults overview](backup-vault-overview.md)
