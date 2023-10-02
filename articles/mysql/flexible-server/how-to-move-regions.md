---
title: Move Azure regions - Azure portal - Azure Database for MySQL - Flexible Server
description: Move an Azure Database for MySQL - Flexible Server from one Azure region to another using the Azure portal.
author: VandhanaMehta
ms.author: vamehta
ms.reviewer: maghan
ms.date: 08/23/2023
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
ms.custom: subject-moving-resources
---

# Move an Azure Database for MySQL - Flexible Server to another region by using the Azure portal

There are various scenarios for moving an existing Azure Database for MySQL - Flexible Server from one region to another. For example, you might want to move a production server to another region as part of your disaster recovery planning.

You can use Azure Database for MySQL - Flexible Server's [geo restore](concepts-backup-restore.md#geo-restore) feature to complete the move to another region. To do so, first ensure geo-redundancy is enabled for your flexible server. Next, trigger geo-restore for your geo-redundant server and move your server to the geo-paired region.

> [!NOTE]  
> This article focuses on moving your server to a different region. If you want to move your server to a different resource group or subscription, refer to the [move](../../azure-resource-manager/management/move-resource-group-and-subscription.md) article.

## Prerequisites

- Ensure the source server has geo-redundancy enabled. You can enable geo-redundancy post server-create for locally redundant or same-zone redundant servers. Currently, for a Zone-redundant High Availability server geo-redundancy can only be enabled/disabled at server create time.

- Make sure that your Azure Database for MySQL source flexible server is deployed in the Azure region that you want to move from.

## Move

To move the Azure Database for MySQL - Flexible Server to the geo-paired region using the Azure portal, use the following steps:

1. In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from.

1. Select **Overview** from the left panel.

1. From the overview page, select **Restore**.

1. Restore page is shown with an option to choose **Geo-redundant restore**. If you have configured your server for geographically redundant backups, the server can be restored to the corresponding Azure paired region and the geo-redundant restore option can be enabled. Geo-redundant restore option restores the server to Latest UTC Now timestamp and hence after selection of Geo-redundant restore, the point-in-time restore options can't be selected simultaneously.

   :::image type="content" source="./media/how-to-move-regions/geo-restore-flex.png" alt-text="Screenshot of Geo-restore option" lightbox="./media/how-to-move-regions/geo-restore-flex.png":::

   :::image type="content" source="./media/how-to-move-regions/geo-restore-enabled-flex.png" alt-text="Screenshot of Enabling Geo-Restore" lightbox="./media/how-to-move-regions/geo-restore-enabled-flex.png":::

1. Provide a new server name in the **Name** field in the Server details section.

1. When primary region is down, one can't create geo-redundant servers in the respective geo-paired region as storage can't be provisioned in the primary region. One must wait for the primary region to be up to provision geo-redundant servers in the geo-paired region. With the primary region down one can still geo-restore the source server to the geo-paired region by disabling the geo-redundancy option in the Compute + Storage Configure Server settings in the restore portal experience and restore as a locally redundant server to ensure business continuity.

   :::image type="content" source="./media/how-to-move-regions/geo-restore-region-down-1.png" alt-text="Screenshot of Compute + Storage window" lightbox="./media/how-to-move-regions/geo-restore-region-down-1.png":::

   :::image type="content" source="./media/how-to-move-regions/geo-restore-region-down-2.png" alt-text="Screenshot of Disabling Geo-Redundancy" lightbox="./media/how-to-move-regions/geo-restore-region-down-2.png":::

   :::image type="content" source="./media/how-to-move-regions/geo-restore-region-down-3.png" alt-text="Screenshot of Restoring as Locally redundant server" lightbox="./media/how-to-move-regions/geo-restore-region-down-3.png":::

1. Select **Review + Create** to review your selections.

1. A notification is shown that the restore operation has been initiated. This operation may take a few minutes.

The new server created by geo-restore has the same server admin sign-in name and password that was valid for the existing server at the time the restore was initiated. The password can be changed from the new server's Overview page. Additionally during a geo-restore, **Networking** settings such as virtual network settings and firewall rules can be configured as described in the below section.

## Clean up source server

You may want to delete the source Azure Database for MySQL - Flexible Server. To do so, use the following steps:

1. Once the replica has been created, locate and select your Azure Database for MySQL source flexible server.
1. In the **Overview** window, select **Delete**.
1. Type in the name of the source server to confirm you want to delete.
1. Select **Delete**.

## Next steps

In this tutorial, you moved an Azure Database for MySQL - Flexible Server from one region to another by using the Azure portal and then cleaned up the unneeded source resources.

- Learn more about [geo-restore](concepts-backup-restore.md#geo-restore)
- Learn more about [Azure paired regions](overview.md#azure-regions) supported for Azure Database for MySQL - Flexible Server
- Learn more about [business continuity](concepts-business-continuity.md) options
