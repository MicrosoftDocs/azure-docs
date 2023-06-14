---
title: Trigger On-Demand Backup for Azure Database for MySQL - Flexible Server with Azure portal.
description: This article describes how to trigger On-Demand backup from Azure portal
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
author: VandhanaMehta
ms.author: vamehta
ms.reviewer: maghan
ms.date: 07/26/2022
---

# Trigger On-Demand Backup of an Azure Database for MySQL - Flexible Server using Azure portal

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article provides step-by-step procedure to trigger On-Demand backup from the portal.

## Prerequisites

To complete this how-to guide, you need:

- You must have an Azure Database for MySQL - Flexible Server.

## Trigger On-Demand Backup

Follow these steps to trigger back up on demand:

1. In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to take backup of.

2. Select **Backup** and Restore from the left panel.

3. From the Backup and Restore page, Select **Backup Now**.

4. Take backup page is shown. Provide a custom name for the backup in the Backup name field.

    :::image type="content" source="./media/how-to-trigger-on-demand-backup/trigger-ondemand-backup.png" alt-text="Screenshot showing how to trigger On-demand backup.":::

5. Select **Trigger**

6. A notification shows that a backup has been initiated.

7. Once completed, the on demand backup is seen listed along with the automated backups in the View Available Backups page.

## Restore from an On-Demand full backup

Learn more about [Restore a server](how-to-restore-server-portal.md)

## Next steps

Learn more about [business continuity](concepts-business-continuity.md)