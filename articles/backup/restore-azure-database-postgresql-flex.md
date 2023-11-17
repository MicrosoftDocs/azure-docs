---
title: Restore Azure Database for PostgreSQL -Flexible server backups (preview)
description: Learn about how to restore Azure Database for PostgreSQL -Flexible backups.
ms.topic: how-to
ms.date: 11/06/2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure Database for PostgreSQL Flexible backups (preview)

This article explains how to restore an Azure PostgreSQL -flex server backed up by Azure Backup.

## Restore Azure PostgreSQL-Flexible database

Follow these steps:

1. Go to **Backup vault** > **Backup Instances**. Select the PostgreSQL-Flex server to be restored and select **Restore**.

   :::image type="content" source="./media/restore-azure-database-postgresql-flex/restore.png" alt-text="Screenshot showing how to restore a database.":::

   Alternatively, go to [Backup center](./backup-center-overview.md) and select **Restore**.	  
  
1. Select the point in time you would like to restore by using **Select restore point**. Change the date range by selecting **Time period**.

   :::image type="content" source="./media/restore-azure-database-postgresql/select-restore-point-inline.png" alt-text="Screenshot showing the process to select a recovery point.":::

1. Choose the target storage account and container in **Restore parameters** tab. Select **Validate** to check the restore parameters permissions before the final review and restore.

1. Once the validation is successful, select **Review + restore**.
   :::image type="content" source="./media/restore-azure-database-postgresql-flex/review-restore.png" alt-text="Screenshot showing the restore parameter process.":::

1. After final review of the parameters, select **Restore** to restore the selected PostgreSQL-Flex server backup in target storage account.
   :::image type="content" source="./media/restore-azure-database-postgresql-flex/review.png" alt-text="Screenshot showing the review process page."::: 
   
1. Submit the Restore operation and track the triggered job under **Backup jobs**.
   :::image type="content" source="./media/restore-azure-database-postgresql-flex/validate.png" alt-text="Screenshot showing the validate process page.":::
 
## Next steps

[Support matrix for PostgreSQL-Flex database backup by using Azure Backup](backup-azure-database-postgresql-flex-support-matrix.md).