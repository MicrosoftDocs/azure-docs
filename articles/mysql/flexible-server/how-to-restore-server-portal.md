---
title: Restore an Azure Database for MySQL Flexible Server with Azure portal. 
description: This article describes how to perform restore operations in Azure Database for MySQL Flexible server through the Azure portal
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.topic: how-to
ms.date: 04/01/2021
---

# Point-in-time restore of a Azure Database for MySQL - Flexible Server (Preview) using Azure portal

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

> [!IMPORTANT]
> Azure Database for MySQL - Flexible Server is currently in public preview.

This article provides step-by-step procedure to perform point-in-time recoveries in flexible server using backups.

## Prerequisites

To complete this how-to guide, you need:

-   You must have an Azure Database for MySQL Flexible Server.

## Restore to the latest restore point

Follow these steps to restore your flexible server using an earliest existing backup.

1.  In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from.

2.  Click **Overview** from the left panel.

3.  From the overview page, click **Restore**.

4.  Restore page will be shown with an option to choose between **Latest restore point** and Custom restore point.

5.  Select **Latest restore point**.

6.  Provide a new server name in the **Restore to new server** field.

    :::image type="content" source="./media/concept-backup-restore/restore-blade-latest.png" alt-text="Earliest restore time":::

8.  Click **OK**.

9.  A notification will be shown that the restore operation has been initiated.

## Restoring to a custom restore point

Follow these steps to restore your flexible server using an earliest existing backup.

1.  In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from.

2.  From the overview page, click **Restore**.

3.  Restore page will be shown with an option to choose between Earliest restore point and Custom restore point.

4.  Choose **Custom restore point**.

5.  Select date and time.

6.  Provide a new server name in the **Restore to new server** field.

6.  Provide a new server name in the **Restore to new server** field.

    :::image type="content" source="./media/concept-backup-restore/restore-blade-custom.png" alt-text="view overview":::

7.  Click **OK**.

8.  A notification will be shown that the restore operation has been initiated.


## Perform post-restore tasks
After the restore is completed, you should perform the following tasks to get your users and applications back up and running:

- If the new server is meant to replace the original server, redirect clients and client applications to the new server.
- Ensure appropriate VNet rules are in place for users to connect. These rules are not copied over from the original server.
- Ensure appropriate logins and database level permissions are in place.
- Configure alerts as appropriate for the newly restore server.


## Next steps
Learn more about [business continuity](concepts-business-continuity.md)
