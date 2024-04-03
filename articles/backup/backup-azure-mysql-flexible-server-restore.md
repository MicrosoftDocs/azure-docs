---
title: Restore the Azure Database for MySQL - Flexible Server by using Azure Backup
description: Learn how to restore the Azure Database for MySQL - Flexible Server.
ms.topic: how-to
ms.date: 03/08/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore the Azure Database for MySQL - Flexible Server by using Azure Backup (preview)

This article describes how to restore the Azure Database for MySQL - Flexible Server by using Azure Backup.

Learn more about the [supported scenarios. considerations, and limitations](backup-azure-mysql-flexible-server-support-matrix.md).

## Restore MySQL - Flexible Server database

To restore the database, follow these steps:

1. Go to the *Backup vault* > **Backup instances**.

2. Select the **Azure Database for MySQL - Flexible Server** > **Restore**.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server-restore/restore-parameters.png" alt-text="Screenshot shows how to go to the backup instance." lightbox="./media/backup-azure-mysql-flexible-server-restore/restore-parameters.png":::

3. Click **Select restore point** > **Point-in-time** you want to restore.

   To change the date range, select **Time period**.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server-restore/restore-point.png" alt-text="Screenshot shows the selection of point-in-time recovery point." lightbox="./media/backup-azure-mysql-flexible-server-restore/restore-point.png":::

4. On the **Restore parameters** tab, choose the **Target Storage account**, and then select **Validate**.

   The validation process checks if the restore parameters and permissions are assigned for the restore operation.


   :::image type="content" source="./media/backup-azure-mysql-flexible-server-restore/restore.png" alt-text="Screenshot shows the selection of restore parameters." lightbox="./media/backup-azure-mysql-flexible-server-restore/restore.png":::

5. When the validation is successful, select **Restore**.

   It restores the selected database backups in the target storage account.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server-restore/review-restore.png" alt-text="Screenshot shows how to trigger restore operation." lightbox="./media/backup-azure-mysql-flexible-server-restore/review-restore.png":::

## Next steps

- [Back up the Azure Database for MySQL - Flexible Server (preview)](backup-azure-mysql-flexible-server.md)