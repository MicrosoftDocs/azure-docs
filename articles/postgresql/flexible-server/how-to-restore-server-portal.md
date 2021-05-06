---
title: Restore - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: This article describes how to perform restore operations in Azure Database for PostgreSQL through the Azure portal.
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: how-to
ms.date: 04/22/2021
---

# Point-in-time restore of a Flexible Server

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is in preview

This article provides step-by-step procedure to perform point-in-time recoveries in flexible server using backups. You can perform either to a latest restore point or a custom restore point within your retention period.

## Pre-requisites

To complete this how-to guide, you need:

-   You must have an Azure Database for PostgreSQL - Flexible Server. The same procedure is also applicable for flexible server configured with zone redundancy.

## Restoring to the latest restore point

Follow these steps to restore your flexible server using an existing backup.

1.  In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from.

2.  Click **Overview** from the left panel and click **Restore**
   
   :::image type="content" source="./media/how-to-restore-server-portal/restore-overview.png" alt-text="Restore overview":::

3.  Restore page will be shown with an option to choose between the latest restore point and Custom restore point.

4.  Select **Latest restore point** and provide a new server name in the **Restore to new server** field. You can optionally choose the Availability zone to restore to.
   
   :::image type="content" source="./media/how-to-restore-server-portal/restore-latest.png" alt-text="Latest restore time":::

5.  Click **OK**.

6.  A notification will be shown that the restore operation has been initiated.

## Restoring to a custom restore point

Follow these steps to restore your flexible server using an existing backup.

1.  In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from.

2.  From the overview page, click **Restore**.
 :::image type="content" source="./media/how-to-restore-server-portal/restore-overview.png" alt-text="Restore overview":::
    
3.  Restore page will be shown with an option to choose between the latest restore point and Custom restore point.

4.  Choose **Custom restore point**.

5.  Select date and time and provide a new server name in the **Restore to new server** field. Provide a new server name and you can optionally choose the **Availability zone** to restore to.
   
:::image type="content" source="./media/how-to-restore-server-portal/restore-custom-2.png" alt-text="Custom restore time":::
 
6.  Click **OK**.

7.  A notification will be shown that the restore operation has been initiated.

## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [zone redundant high availability](./concepts-high-availability.md)
-   Learn about [backup and recovery](./concepts-backup-restore.md)
