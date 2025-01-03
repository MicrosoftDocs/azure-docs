---
title: Restore an Azure Database for MySQL Flexible Server by Using Azure Backup
description: Learn how to restore an Azure Database for MySQL flexible server.
ms.topic: how-to
ms.date: 11/21/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore an Azure Database for MySQL flexible server by using Azure Backup (preview)

[!INCLUDE [Azure Database for MySQL - Flexible Server backup advisory](../../includes/backup-mysql-flexible-server-advisory.md)]

This article describes how to restore your Azure Database for MySQL flexible server by using Azure Backup.

Learn more about the [supported scenarios, considerations, and limitations](backup-azure-mysql-flexible-server-support-matrix.md).

## Prerequisites

Backup data is stored in the Backup vault as a blob within the Microsoft tenant. During a restore operation, the backup data is copied from one storage account to another across tenants. Ensure that the target storage account for the restore has the `AllowCrossTenantReplication` property set to `true`.

## Restore an Azure Database for MySQL - Flexible Server database

To restore the database, follow these steps:

1. Go to the Backup vault, and then select **Backup instances**.

2. Select **Azure Database for MySQL - Flexible Server (preview)** > **Restore**.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server-restore/restore-parameters.png" alt-text="Screenshot that shows how to go to a backup instance." lightbox="./media/backup-azure-mysql-flexible-server-restore/restore-parameters.png":::

3. Choose **Select restore point**, and then select the point in time that you want to restore.

   To change the date range, select **Time period**.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server-restore/restore-point.png" alt-text="Screenshot that shows the selection of a point-in-time recovery point." lightbox="./media/backup-azure-mysql-flexible-server-restore/restore-point.png":::

4. On the **Restore parameters** tab, select the **Target Storage account** and **Target Container** values, and then select **Validate**.

   The validation process checks if the restore parameters and permissions are assigned for the restore operation.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server-restore/restore.png" alt-text="Screenshot that shows the selection of restore parameters." lightbox="./media/backup-azure-mysql-flexible-server-restore/restore.png":::

5. When the validation is successful, select **Restore**.

   This action restores the selected database backups in the target storage account.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server-restore/review-restore.png" alt-text="Screenshot that shows how to trigger restore operation." lightbox="./media/backup-azure-mysql-flexible-server-restore/review-restore.png":::

## Next step

> [!div class="nextstepaction"]
> [Back up an Azure Database for MySQL flexible server (preview)](backup-azure-mysql-flexible-server.md)
