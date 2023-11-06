---
title: Restore Azure Database for PostgreSQL -Flexible server backups
description: Learn about how to restore Azure Database for PostgreSQL -Flexible backups.
ms.topic: how-to
ms.date: 11/06/2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure Database for PostgreSQL Flexible backups

This article explains how to restore a database to an Azure PostgreSQL -flex server backed up by Azure Backup.

You can restore a database to any Azure PostgreSQL server of a different/same subscription but within the same region of the vault, if the service has the appropriate [set of permissions](backup-azure-database-postgresql-overview.md#azure-backup-authentication-with-the-postgresql-server) on the target server.

## Restore Azure PostgreSQL-Flexible database

1. Go to **Backup vault** -> **Backup Instances**. Select the PostgreSQL-Flex server to be restored and select **Restore**.

   :::image type="content" source="./media/restore-azure-database-postgresql/select-database-for-restore-inline.png" alt-text="Screenshot showing the process to select and restore a database." lightbox="./media/restore-azure-database-postgresql/select-database-for-restore-expanded.png":::

   Alternatively, you can navigate to this page from the [Backup center](./backup-center-overview.md).	  
  
1. Select the point in time your would like to restore by using **Select restore point**. You can change the date range by selecting **Time period**.

   :::image type="content" source="./media/restore-azure-database-postgresql/select-restore-point-inline.png" alt-text="Screenshot showing the process to select a recovery point." lightbox="./media/restore-azure-database-postgresql/select-restore-point-expanded.png":::

   :::image type="content" source="./media/restore-azure-database-postgresql/select-restore-point-inline.png" alt-text="Screenshot showing the process to select a recovery point." lightbox="./media/restore-azure-database-postgresql/select-restore-point-expanded.png":::

1. Choose the target storage account and container in **Restore parameters** tab. Select **Validate** to check the restore parameters permissions before the final review and restore.

1. Once the validation is successful, select **Review + restore**.
   :::image type="content" source="./media/restore-azure-database-postgresql/select-restore-point-inline.png" alt-text="Screenshot showing the process to select a recovery point." lightbox="./media/restore-azure-database-postgresql/select-restore-point-expanded.png":::

1. After final review of parameters select **Restore** to restore the selected PostgreSQL-Flex server backup in target storage account.
   :::image type="content" source="./media/restore-azure-database-postgresql/select-restore-point-inline.png" alt-text="Screenshot showing the process to select a recovery point." lightbox="./media/restore-azure-database-postgresql/select-restore-point-expanded.png"::: 
   
1. Submit the Restore operation and track the triggered job under **Backup jobs**.

 
## Next steps

[Troubleshoot PostgreSQL database backup by using Azure Backup](backup-azure-database-postgresql-troubleshoot.md)