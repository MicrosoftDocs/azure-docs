---
title: Cross Subscription and Cross Resource Group Restore in Azure Database for  PostgreSQL - Flexible Server
description: This article describes how to restore to a different Subscription or resource group server in Azure Database for  PostgreSQL - Flexible Server using the Azure portal.
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
author: kabharati
ms.author: kabharati
ms.reviewer: maghan
ms.date: 09/30/2023
---

# Cross Subscription and Cross Resource Group Restore in Azure Database for PostgreSQL Flexible Server

[!INCLUDE [applies-to-postgresql-Flexible-server](../includes/applies-to-postgresql-Flexible-server.md)]

This article provides a step-by-step procedure for using the Azure portal to perform a restore to a different subscription or resource group in a flexible server through automated backups. You can perform this procedure to the latest restore point or to a custom restore point within your retention period.

## Prerequisites

To complete this how-to guide, you need Azure Database for PostgreSQL - Flexible Server. The procedure is also applicable for a flexible server that's configured with zone redundancy.

## Restore to a different Subscription or Resource group


1. In the [Azure portal](https://portal.azure.com/), choose the flexible server that you want to restore.

2. Select **Overview** from the left pane, and then select **Restore**.
   
   :::image type="content" source="./media/how-to-restore-server-portal/cross-restore-overview.png" alt-text="Screenshot that shows a server overview and the Restore button.":::

3. Under **Subscription** drop down, select different subscription. If you want to change the **Resource group** go to next step else
 you can go to Step 5.

4.  Select **Resource Group** drop down, choose different Resource group 

5. Under **Server details**, for **Name**, provide a server name. For **Availability zone**, you can optionally choose an availability zone to restore to.
   
   :::image type="content" source="./media/how-to-restore-server-portal/choose-different-subscription-or-resource-group.png" alt-text="Screenshot that shows selections for restoring to different subscription or resource group.":::

6. Select **Review + create** and click **create**, a notification shows that the restore operation has started.

## Geo Restore to a different Subscription or Resource group

If your source server is configured with geo-redundant backup, you can restore the servers in a paired region to a different resource group or subscription using below steps

> [!NOTE]
> For the first time that you perform a geo-restore, wait at least one hour after you create the source server

1. In the [Azure portal](https://portal.azure.com/), choose the flexible server that you want to restore the backup from.

2. Select **Overview** from the left pane, and then select **Restore**.
   
   :::image type="content" source="./media/how-to-restore-server-portal/cross-restore-overview.png" alt-text="Screenshot that shows a server overview.":::

3. Under **Subscription** drop down, select different subscription. If you want to change the **Resource group** go to next step else
 you can go to Step 5.

4.  Select **Resource Group** drop down, choose different Resource group 

5. Check the **Restore to paired region** option

6. Under **Server details**, for **Name**, provide a server name. For **Availability zone**, you can optionally choose an availability zone to restore to.
   
   :::image type="content" source="./media/how-to-restore-server-portal/geo-restore-different-subscription-or-resource-group.png" alt-text="Screenshot that shows selections for restoring to the latest point.":::

6. Select **Review + create** and click **create**, a notification shows that the restore operation has started.




## Next steps

- Learn about [business continuity](./concepts-business-continuity.md).
- Learn about [zone-redundant high availability](./concepts-high-availability.md).
- Learn about [backup and recovery](./concepts-backup-restore.md).

