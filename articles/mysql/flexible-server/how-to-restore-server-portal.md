---
title: Restore MySQL - Flexible Server with Azure portal
titleSuffix: Azure Database for MySQL - Flexible Server
description: This article describes how to perform restore operations in Azure Database for MySQL - Flexible Server through the Azure portal
author: code-sidd
ms.author: sisawant
ms.reviewer: maghan
ms.date: 08/22/2023
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
---

# Point-in-time restore of an Azure Database for MySQL - Flexible Server using Azure portal

[!INCLUDE [applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article provides step-by-step procedure to perform point-in-time recoveries in flexible server using backups.

## Prerequisites

To complete this how-to guide, you need:

- You must have an Azure Database for MySQL - Flexible Server.

## Restore to the latest restore point

Follow these steps to restore your flexible server using an earliest existing backup.

1. In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from.

1. Select **Overview** from the left panel.

1. From the overview page, select **Restore**.

1. Restore page is shown with an option to choose between **Latest restore point** and Custom restore point.

1. Select **Latest restore point**.

1. Provide a new server name in the **Restore to new server** field.

    :::image type="content" source="./media/how-to-restore-server-portal/point-in-time-restore-latest.png" alt-text="Screenshot of  earliest restore time." lightbox="./media/how-to-restore-server-portal/point-in-time-restore-latest.png":::

1. Select **OK**.

1. A notification is shown that the restore operation has been initiated.

## Restore to a fastest restore point

Follow these steps to restore your flexible server using an existing full backup as the fastest restore point.

1. In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from.

1. Select **Overview** from the left panel.

1. From the overview page, select **Restore**.

1. Restore page is shown with an option to choose between Latest restore point, Custom restore point and Fastest Restore Point.

1. Select option **Select fastest restore point (Restore using full backup)**.

1. Select the desired full backup from the **Fastest Restore Point (UTC)** dropdown list.

    :::image type="content" source="./media/how-to-restore-server-portal/fastest-restore-point.png" alt-text="Screenshot of Fastest Restore Point." lightbox="./media/how-to-restore-server-portal/fastest-restore-point.png":::

1. Provide a new server name in the **Restore to new server** field.

1. Select **Review + Create**.

1. Post selecting **Create**, a notification is shown that the restore operation has been initiated.

## Restore from a full backup through the Backup and Restore page

Follow these steps to restore your flexible server using an existing full backup.

1. In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from.

1. Select **Backup and Restore** from the left panel.

1. View Available Backups page is shown with the option to restore from available full automated backups and on-demand backups taken for the server within the retention period.

1. Select the desired full backup from the list by selecting on corresponding **Restore** action.

    :::image type="content" source="./media/how-to-restore-server-portal/view-available-backups.png" alt-text="Screenshot of  view Available Backups." lightbox="./media/how-to-restore-server-portal/view-available-backups.png":::

1. Restore page is shown with the Fastest Restore Point option selected by default and the desired full backup timestamp selected on the View Available backups page.

1. Provide a new server name in the **Restore to new server** field.

1. Select **Review + Create**.

1. Post selecting **Create**, a notification is shown that the restore operation has been initiated.

## Geo restore to latest restore point

1. In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from.

1. Select **Overview** from the left panel.

1. From the overview page, select **Restore**.

1. Restore page is shown with an option to choose **Geo-redundant restore**. If you have configured your server for geographically redundant backups, the server can be restored to the corresponding Azure paired region and the geo-redundant restore option can be enabled. Geo-redundant restore option restores the server to Latest UTC Now timestamp and hence after selection of Geo-redundant restore, the point-in-time restore options can't be selected simultaneously.

   :::image type="content" source="./media/how-to-restore-server-portal/geo-restore-flex.png" alt-text="Screenshot of  Geo-restore option." lightbox="./media/how-to-restore-server-portal/geo-restore-flex.png":::

   :::image type="content" source="./media/how-to-restore-server-portal/geo-restore-enabled-flex.png" alt-text="Screenshot of  enabling Geo-Restore." lightbox="./media/how-to-restore-server-portal/geo-restore-enabled-flex.png":::

    :::image type="content" source="./media/how-to-restore-server-portal/geo-restore-flex-location-dropdown.png" alt-text="Screenshot of location dropdown." lightbox="./media/how-to-restore-server-portal/geo-restore-flex-location-dropdown.png":::

1. Provide a new server name in the **Name** field in the Server details section.

1. When primary region is down, one can't create geo-redundant servers in the respective geo-paired region as storage can't be provisioned in the primary region. One must wait for the primary region to be up to provision geo-redundant servers in the geo-paired region. With the primary region down one can still geo-restore the source server to the geo-paired region by disabling the geo-redundancy option in the Compute + Storage Configure Server settings in the restore portal experience and restore as a locally redundant server to ensure business continuity.
   :::image type="content" source="./media/how-to-restore-server-portal/geo-restore-region-down-1.png" alt-text="Screenshot of Compute + Storage window." lightbox="./media/how-to-restore-server-portal/geo-restore-region-down-1.png":::

   :::image type="content" source="./media/how-to-restore-server-portal/geo-restore-region-down-2.png" alt-text="Screenshot of Disabling Geo-Redundancy." lightbox="./media/how-to-restore-server-portal/geo-restore-region-down-2.png":::

   :::image type="content" source="./media/how-to-restore-server-portal/geo-restore-region-down-3.png" alt-text="Screenshot of Restoring as Locally redundant server." lightbox="./media/how-to-restore-server-portal/geo-restore-region-down-3.png":::

1. Select **Review + Create** to review your selections.

1. A notification is shown that the restore operation has been initiated. This operation may take a few minutes.

The new server created by geo restore has the same server admin sign-in name and password that was valid for the existing server at the time the restore was initiated. The password can be changed from the new server's Overview page. Additionally during a restore, **Networking** settings such as virtual network settings and firewall rules can be configured as described in the below section.

## Use restore to move a server from Public access to Private access

Follow these steps to restore your flexible server using an earliest existing backup.

1. In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from.

1. From the overview page, select **Restore**.

1. Restore page is shown with an option to choose between geo restore or point-in-time restore options.

1. Choose either **Geo restore** or a **Point-in-time restore** option.

1. Provide a new server name in the **Restore to new server** field.

    :::image type="content" source="./media/how-to-restore-server-portal/point-in-time-restore-private-dns-zone.png" alt-text="Screenshot of view overview." lightbox="./media/how-to-restore-server-portal/point-in-time-restore-private-dns-zone.png":::

1. Go to the **Networking** tab to configure networking settings.

1. In the **Connectivity method**, select **Private access (VNet Integration)**. Go to **Virtual Network** section, you can either select an already existing *virtual network* and *Subnet* that is delegated to *Microsoft.DBforMySQL/flexibleServers* or Create a new one by selecting the *create virtual network* link.
    > [!NOTE]  
    > Only virtual networks and subnets in the same region and subscription is listed in the dropdown list. </br>
    > The chosen subnet is delegated to *Microsoft.DBforMySQL/flexibleServers*. It means that only Azure Database for MySQL - Flexible Servers can use that subnet.</br>

    :::image type="content" source="./media/how-to-manage-virtual-network-portal/vnet-creation.png" alt-text="Screenshot of Vnet configuration." lightbox="./media/how-to-manage-virtual-network-portal/vnet-creation.png":::

1. Create a new or Select an existing **Private DNS Zone**.
    > [!NOTE]  
    > Private DNS zone names must end with `mysql.database.azure.com`. </br>
    > If you do not see the option to create a new private dns zone, please enter the server name on the **Basics** tab.</br>
    > After the flexible server is deployed to a virtual network and subnet, you cannot move it to Public access (allowed IP addresses).</br>

    :::image type="content" source="./media/how-to-manage-virtual-network-portal/private-dns-zone.png" alt-text="Screenshot of dns configuration." lightbox="./media/how-to-manage-virtual-network-portal/private-dns-zone.png":::
1. Select **Review + create** to review your flexible server configuration.
1. Select **Create** to provision the server. Provisioning can take a few minutes.

1. A notification is shown that the restore operation has been initiated.

## Perform post-restore tasks

After the restore is completed, you should perform the following tasks to get your users and applications back up and running:

- If the new server is meant to replace the original server, redirect clients and client applications to the new server.
- Ensure appropriate virtual network rules are in place for users to connect. These rules aren't copied over from the original server.
- Ensure appropriate logins and database level permissions are in place.
- Configure alerts as appropriate for the newly restore server.

## Next steps

- Learn more about [business continuity](concepts-business-continuity.md)
