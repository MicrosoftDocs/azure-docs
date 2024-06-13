---
title: Trigger on-demand backup by using the Azure portal
description: This article provides a step-by-step guide on triggering an on-demand backup of an Azure Database for MySQL - Flexible Server instance.
author: VandhanaMehta
ms.author: vamehta
ms.reviewer: maghan
ms.date: 04/17/2024
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
# customer intent: As a user, I want to learn how to trigger an on-demand backup from the Azure portal so that I can have more control over my database backups.
---

# Trigger on-demand backup of an Azure Database for MySQL - Flexible Server instance by using the Azure portal

[!INCLUDE [applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article provides a step-by-step procedure to trigger an on-demand backup from the Azure portal.

## Prerequisites

You need an Azure Database for MySQL flexible server instance to complete this how-to guide.

- Create a MySQL flexible server instance by following the steps in the article [Quickstart: Create an instance of Azure Database for MySQL - Flexible Server by using the Azure portal](quickstart-create-server-portal.md).

## Trigger on-demand backup

Follow these steps to trigger backup on demand:

1. In the [Azure portal](https://portal.azure.com/), choose your Azure Database for the MySQL flexible server instance you want to back up.

1. Under **Settings** select **Backup and restore** from the left panel.

1. From the **Backup and restore** page, select **Backup Now**.

1. Now on the **Take backup** page, in the **Backup name** field, provide a custom name for the backup.

1. Select **Trigger**

    :::image type="content" source="media/how-to-trigger-on-demand-backup/trigger-on-demand-backup.png" alt-text="Screenshot showing how to trigger an on-demand backup." lightbox="media/how-to-trigger-on-demand-backup/trigger-on-demand-backup.png":::

1. Once completed, the on-demand and automated backups are listed.

## Trigger an On-Demand Backup and Export (preview)

Follow these steps to trigger an on-demand backup and export:

1. In the [Azure portal](https://portal.azure.com/), choose your Azure Database for MySQL flexible server instance to take a backup of and export.

1. Under **Settings** select **Backup and restore** from the left panel.

1. From the **Backup and restore** page, select **Export now**.

    :::image type="content" source="media/how-to-trigger-on-demand-backup/export-backup.jpg" alt-text="Screenshot of the export now option is selected." lightbox="media/how-to-trigger-on-demand-backup/export-backup.jpg":::

1. When the **Export backup** page is shown, provide a custom name for the backup in the **Backup name** field or use the default populated name.

    :::image type="content" source="media/how-to-trigger-on-demand-backup/select-backup-name.jpg" alt-text="Screenshot of providing a custom name for the backup in the backup name field." lightbox="media/how-to-trigger-on-demand-backup/select-backup-name.jpg":::

1. Select **Select storage**, then select the storage account, which is the target for the on-demand backup to be exported to.

    :::image type="content" source="media/how-to-trigger-on-demand-backup/select-storage-account.jpg" alt-text="Screenshot of selecting the storage account." lightbox="media/how-to-trigger-on-demand-backup/select-storage-account.jpg":::

1. Select the container from the list displayed, then **Select**.

    :::image type="content" source="media/how-to-trigger-on-demand-backup/click-select.jpg" alt-text="Screenshot of listing the containers to use." lightbox="media/how-to-trigger-on-demand-backup/click-select.jpg":::

1. Then select **Export**.

    :::image type="content" source="media/how-to-trigger-on-demand-backup/click-export.jpg" alt-text="Screenshot of the Export button to choose what to export." lightbox="media/how-to-trigger-on-demand-backup/click-export.jpg":::

1. You should see the exported on-demand backup in the target storage account once exported.

1. If you don't have a precreated storage account to select from, select "+Storage Account," and the portal initiates a storage account creation workflow to help you create a storage account to export the backup.

## Restore from an exported on-demand full backup

1. Download the backup file from the Azure storage account using Azure Storage Explorer.

1. Install the MySQL community version from MySQL. Download MySQL Community Server. The downloaded version must be the same or compatible with the version of the exported
backups.

1. Open the command prompt and navigate to the bin directory of the downloaded MySQL community version folder.

1. Now specify the data directory using `--datadir` by running the following command at the command prompt:
    
    ```bash
    mysqld --datadir=<path to the data folder of the files downloaded>
    ```

1. Connect to the database using any supported client.

## Related content

- [Point-in-time restore in Azure Database for MySQL - Flexible Server with the Azure portal](how-to-restore-server-portal.md)
- [Overview of business continuity with Azure Database for MySQL - Flexible Server](concepts-business-continuity.md)
