---
title: Restore an Azure Database for MySQL Flexible Server with Azure portal.
description: This article describes how to perform restore operations in Azure Database for MySQL Flexible server through the Azure portal
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
author: Bashar-MSFT
ms.author: bahusse
ms.date: 07/26/2022
---

# Point-in-time restore of a Azure Database for MySQL Flexible Server using Azure portal

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article provides step-by-step procedure to perform point-in-time recoveries in flexible server using backups.

## Prerequisites

To complete this how-to guide, you need:

- You must have an Azure Database for MySQL Flexible Server.

## Restore to the latest restore point

Follow these steps to restore your flexible server using an earliest existing backup.

1. In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from.

2. Click **Overview** from the left panel.

3. From the overview page, click **Restore**.

4. Restore page will be shown with an option to choose between **Latest restore point** and Custom restore point.

5. Select **Latest restore point**.

6. Provide a new server name in the **Restore to new server** field.

    :::image type="content" source="./media/how-to-restore-server-portal/point-in-time-restore-latest.png" alt-text="Earliest restore time":::

7. Click **OK**.

8. A notification will be shown that the restore operation has been initiated.


## Restore to a fastest restore point

Follow these steps to restore your flexible server using an existing full backup as the fastest restore point. 

1. In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from. 

2. Click **Overview** from the left panel. 

3. From the overview page, click **Restore**. 

4. Restore page will be shown with an option to choose between Latest restore point, Custom restore point and Fastest Restore Point. 

5. Select option **Select fastest restore point (Restore using full backup)**. 

6. Select the desired full backup from the **Fastest Restore Point (UTC)** drop down list . 
 
    :::image type="content" source="./media/how-to-restore-server-portal/fastest-restore-point.png" alt-text="Fastest Restore Point":::

7. Provide a new server name in the **Restore to new server** field.

8. Click **Review + Create**. 

9. Post clicking **Create**, a notification will be shown that the restore operation has been initiated.  

## Restore from a full backup through the Backup and Restore blade

Follow these steps to restore your flexible server using an existing full backup. 

1. In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from. 

2. Click **Backup and Restore** from the left panel. 

3. View Available Backups page will be shown with the option to restore from available full automated backups and on-demand backups taken for the server within the retention period.  

4. Select the desired full backup from the list by clicking on corresponding **Restore** action. 
 
    :::image type="content" source="./media/how-to-restore-server-portal/view-available-backups.png" alt-text="View Available Backups":::

5. Restore page will be shown with the Fastest Restore Point option selected by default and the desired full backup timestamp selected on the View Available backups page. 

6. Provide a new server name in the **Restore to new server** field.

7. Click **Review + Create**. 

8. Post clicking **Create**, a notification will be shown that the restore operation has been initiated.  


## Geo-restore to latest restore point

1. In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from.

2. Click **Overview** from the left panel.

3. From the overview page, click **Restore**.

4. Restore page will be shown with an option to choose **Geo-redundant restore**. If you have configured your server for geographically redundant backups, the server can be restored to the corresponding Azure paired region and the geo-redundant restore option can be enabled. Geo-redundant restore option restores the server to Latest UTC Now timestamp and hence after selection of Geo-redundant restore, the point-in-time restore options cannot be selected simultaneously.

   :::image type="content" source="./media/how-to-restore-server-portal/georestore-flex.png" alt-text="Geo-restore option":::

   :::image type="content" source="./media/how-to-restore-server-portal/georestore-enabled-flex.png" alt-text="Enabling Geo-Restore":::

5. Provide a new server name in the **Name** field in the Server details section.

6. When primary region is down, one cannot create geo-redundant servers in the respective geo-paired region as storage cannot be provisioned in the primary region. One must wait for the primary region to be up to provision geo-redundant servers in the geo-paired region. With the primary region down one can still geo-restore the source server to the geo-paired region by disabling the geo-redundancy option in the Compute + Storage Configure Server settings in the restore portal experience and restore as a locally redundant server to ensure business continuity.

   :::image type="content" source="./media/how-to-restore-server-portal/georestore-region-down-1.png" alt-text="Compute + Storage window":::

   :::image type="content" source="./media/how-to-restore-server-portal/georestore-region-down-2.png" alt-text="Disabling Geo-Redundancy":::

   :::image type="content" source="./media/how-to-restore-server-portal/georestore-region-down-3.png" alt-text="Restoring as Locally redundant server":::

7. Select **Review + Create** to review your selections.

8. A notification will be shown that the restore operation has been initiated. This operation may take a few minutes.

The new server created by geo-restore has the same server admin login name and password that was valid for the existing server at the time the restore was initiated. The password can be changed from the new server's Overview page. Additionally during a geo-restore, **Networking** settings such as virtual network settings and firewall rules can be configured as described in the below section.

## Using restore to move a server from Public access to Private access

Follow these steps to restore your flexible server using an earliest existing backup.

1. In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from.

2. From the overview page, click **Restore**.

3. Restore page will be shown with an option to choose between Geo-restore or Point-in-time restore options.

4. Choose either **Geo-restore** or a **Point-in-time restore** option.

5. Provide a new server name in the **Restore to new server** field.

    :::image type="content" source="./media/how-to-restore-server-portal/point-in-time-restore-private-dns-zone.png" alt-text="view overview":::

6. Go to the **Networking** tab to configure networking settings.

7. In the **Connectivity method**, select **Private access (VNet Integration)**. Go to **Virtual Network** section, you can either select an already existing *virtual network* and *Subnet* that is delegated to *Microsoft.DBforMySQL/flexibleServers* or create a new one by clicking the *create virtual network* link.
    > [!Note]
    > Only virtual networks and subnets in the same region and subscription will be listed in the drop down. </br>
    > The chosen subnet will be delegated to *Microsoft.DBforMySQL/flexibleServers*. It means that only Azure Database for MySQL Flexible Servers can use that subnet.</br>

    :::image type="content" source="./media/how-to-manage-virtual-network-portal/vnet-creation.png" alt-text="Vnet configuration":::

8. Create a new or Select an existing **Private DNS Zone**.
    > [!NOTE]
    > Private DNS zone names must end with `mysql.database.azure.com`. </br>
    > If you do not see the option to create a new private dns zone, please enter the server name on the **Basics** tab.</br>
    > After the flexible server is deployed to a virtual network and subnet, you cannot move it to Public access (allowed IP addresses).</br>

    :::image type="content" source="./media/how-to-manage-virtual-network-portal/private-dns-zone.png" alt-text="dns configuration":::
9. Select **Review + create** to review your flexible server configuration.
10. Select **Create** to provision the server. Provisioning can take a few minutes.

11. A notification will be shown that the restore operation has been initiated.


## Perform post-restore tasks

After the restore is completed, you should perform the following tasks to get your users and applications back up and running:

- If the new server is meant to replace the original server, redirect clients and client applications to the new server.
- Ensure appropriate VNet rules are in place for users to connect. These rules are not copied over from the original server.
- Ensure appropriate logins and database level permissions are in place.
- Configure alerts as appropriate for the newly restore server.

## Next steps

Learn more about [business continuity](concepts-business-continuity.md)
