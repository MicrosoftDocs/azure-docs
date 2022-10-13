---
title: Restore - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: This article describes how to perform restore operations in Azure Database for PostgreSQL Flexible Server through the Azure portal.
ms.author: srranga
author: sr-msft
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.date: 11/30/2021
---

# Point-in-time restore of a Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

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
    
3.  Restore page will be shown with an option to choose between the latest restore point, custom restore point and fast restore point.

4.  Choose **Custom restore point**.

5.  Select date and time and provide a new server name in the **Restore to new server** field. Provide a new server name and you can optionally choose the **Availability zone** to restore to.
   
:::image type="content" source="./media/how-to-restore-server-portal/restore-custom-2.png" alt-text="Custom restore time":::
 
6.  Click **OK**.

7.  A notification will be shown that the restore operation has been initiated.

 ## Restoring using fast restore

Follow these steps to restore your flexible server using a fast restore option.

1.  In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from.

2.  Click **Overview** from the left panel and click **Restore**
   
   :::image type="content" source="./media/how-to-restore-server-portal/restore-overview.png" alt-text="Restore overview":::
    
3.  Restore page will be shown with an option to choose between the latest restore point, custom restore point and fast restore point.

4.  Choose **Fast restore point (Restore using full backup only)**.

5.  Select full backup of your choice from the Fast Restore Point drop-down. Provide a **new server name** and you can optionally choose the **Availability zone** to restore to.
   
:::image type="content" source="./media/how-to-restore-server-portal/fast-restore.png" alt-text="Fast restore time":::
 
6.  Click **OK**.

7.  A notification will be shown that the restore operation has been initiated.

## Performing Geo-Restore

If your source server is configured with geo-redundant backup, you can restore the servers in a paired region. Note that, for the first time restore, please wait at least 1 hour after the source server is created.

1.  In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to geo-restore the backup from.

2.  From the overview page, click **Restore**.
 :::image type="content" source="./media/how-to-restore-server-portal/geo-restore-click.png" alt-text="Restore click":::

3. From the restore page, choose Geo-Redundant restore to restore to a paired region. 
 :::image type="content" source="./media/how-to-restore-server-portal/geo-restore-choose-checkbox.png" alt-text="Geo-restore select":::
 
4. The region and the database versions are pre-selected. It will be restored to the last available data at the paired region. You can choose the **Availability zone** in the region to restore to.

5. By default, the backups for the restored server are configured with Geo-redundant backup. If you do not want geo-redundant backup, you can click **Configure Server** and uncheck the Geo-redundant backup.

6. If the source server is configured with **private access**, you can only restore to another VNET in the remote region. You can either choose an existing VNET or create a new VNET and restore your server into that VNET.  

## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [zone redundant high availability](./concepts-high-availability.md)
-   Learn about [backup and recovery](./concepts-backup-restore.md)
