---
title: Point-in-time restore of a flexible server - Azure portal
description: This article describes how to perform restore operations in Azure Database for PostgreSQL Flexible Server through the Azure portal.
ms.author: alkuchar
author: AwdotiaRomanowna
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.date: 11/30/2021
---

# Point-in-time restore of a flexible server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article provides a step-by-step procedure for using the Azure portal to perform point-in-time recoveries in a flexible server through backups. You can perform this procedure to the latest restore point or to a custom restore point within your retention period.

## Prerequisites

To complete this how-to guide, you need Azure Database for PostgreSQL - Flexible Server. The procedure is also applicable for a flexible server that's configured with zone redundancy.

## Restore to the latest restore point

Follow these steps to restore your flexible server to the latest restore point by using an existing backup:

1. In the [Azure portal](https://portal.azure.com/), choose the flexible server that you want to restore the backup from.

2. Select **Overview** from the left pane, and then select **Restore**.
   
   :::image type="content" source="./media/how-to-restore-server-portal/restore-overview.png" alt-text="Screenshot that shows a server overview and the Restore button.":::

3. Under **Source details**, select **Latest restore point (Now)**. 

4. Under **Server details**, for **Name**, provide a server name. For **Availability zone**, you can optionally choose an availability zone to restore to.
   
   :::image type="content" source="./media/how-to-restore-server-portal/restore-latest.png" alt-text="Screenshot that shows selections for restoring to the latest restore point.":::

5. Select **OK**. A notification shows that the restore operation has started.

## Restore to a custom restore point

Follow these steps to restore your flexible server to a custom restore point by using an existing backup:

1. In the [Azure portal](https://portal.azure.com/), choose the flexible server that you want to restore the backup from.

2. Select **Overview** from the left pane, and then select **Restore**.
 
   :::image type="content" source="./media/how-to-restore-server-portal/restore-overview.png" alt-text="Screenshot that shows a server overview and the Restore button.":::
    
4. Under **Source details**, choose **Select a custom restore point**.

5. Under **Server details**, for **Name**, provide a server name. For **Availability zone**, you can optionally choose an availability zone to restore to.
   
   :::image type="content" source="./media/how-to-restore-server-portal/restore-custom-2.png" alt-text="Screenshot that shows selections for restoring to a custom restore point.":::
 
6.  Select  **OK**. A notification shows that the restore operation has started.

## Restore by using fast restore

Follow these steps to restore your flexible server by using a fast restore option:

1. In the [Azure portal](https://portal.azure.com/), choose the flexible server that you want to restore the backup from.

2. Select **Overview** from the left pane, and then select **Restore**.
   
   :::image type="content" source="./media/how-to-restore-server-portal/restore-overview.png" alt-text="Screenshot that shows a server overview and the Restore button.":::
    
4. Under **Source details**, choose **Select Fast restore point (Restore using full backup only)**. For **Fast Restore point (UTC)**, select the full backup of your choice.

5. Under **Server details**, for **Name**, provide a server name. For **Availability zone**, you can optionally choose an availability zone to restore to.
   
   :::image type="content" source="./media/how-to-restore-server-portal/fast-restore.png" alt-text="Screenshot that shows selections for a fast restore point.":::
 
6. Select **OK**. A notification shows that the restore operation has started.

## Perform geo-restore

If your source server is configured with geo-redundant backup, you can restore the servers in a paired region. 

> [!NOTE]
> For the first time that you perform a geo-restore, wait at least one hour after you create the source server.

1. In the [Azure portal](https://portal.azure.com/), choose the flexible server that you want to geo-restore the backup from.

2. Select **Overview** from the left pane, and then select **Restore**.
 
   :::image type="content" source="./media/how-to-restore-server-portal/geo-restore-click.png" alt-text="Screenshot that shows the Restore button.":::

3. Under **Source details**, for **Geo-redundant restore (preview)**, select the **Restore to paired region** checkbox. 
 
   :::image type="content" source="./media/how-to-restore-server-portal/geo-restore-choose-checkbox.png" alt-text="Screenshot that shows the option for restoring to a paired region for geo-redundant restore.":::
 
4. Under **Server details**, the region and the database version are pre-selected. The server will be restored to the last available data at the paired region. For **Availability zone**, you can optionally choose an availability zone to restore to.

5. Select **OK**. A notification shows that the restore operation has started.

By default, the backups for the restored server are configured with geo-redundant backup. If you don't want geo-redundant backup, you can select **Configure Server** and then clear the **Restore to paired region** checkbox.

If the source server is configured with *private access*, you can restore only to another virtual network in the remote region. You can either choose an existing virtual network or create a new virtual network and restore your server into that network.  

## Next steps

- Learn about [business continuity](./concepts-business-continuity.md).
- Learn about [zone-redundant high availability](./concepts-high-availability.md).
- Learn about [backup and recovery](./concepts-backup-restore.md).
