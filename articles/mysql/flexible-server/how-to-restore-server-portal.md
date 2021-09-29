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

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

> [!IMPORTANT]
> Azure Database for MySQL - Flexible Server is currently in public preview.

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

## Using restore to move a server from Public access to Private access

Follow these steps to restore your flexible server using an earliest existing backup.

1. In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from.

2. From the overview page, click **Restore**.

3. Restore page will be shown with an option to choose between Earliest restore point and Custom restore point.

4. Choose either **Earliest restore point** or a **Custom restore point**.

5. Provide a new server name in the **Restore to new server** field.

6. Provide a new server name in the **Restore to new server** field.

    :::image type="content" source="./media/how-to-restore-server-portal/point-in-time-restore-private-dns-zone.png" alt-text="view overview":::

7. Go to the **Networking** tab to configure networking settings.

8. In the **Connectivity method**, select **Private access (VNet Integration)**. Go to **Virtual Network** section, you can either select an already existing *virtual network* and *Subnet* that is delegated to *Microsoft.DBforMySQL/flexibleServers* or create a new one by clicking the *create virtual network* link.
    > [!Note]
    > Only virtual networks and subnets in the same region and subscription will be listed in the drop down. </br>
    > The chosen subnet will be delegated to *Microsoft.DBforMySQL/flexibleServers*. It means that only Azure Database for MySQL Flexible Servers can use that subnet.</br>

    :::image type="content" source="./media/how-to-manage-virtual-network-portal/vnet-creation.png" alt-text="Vnet configuration":::

9. Create a new or Select an existing **Private DNS Zone**.
    > [!NOTE]
    > Private DNS zone names must end with `mysql.database.azure.com`. </br>
    > If you do not see the option to create a new private dns zone, please enter the server name on the **Basics** tab.</br>
    > After the flexible server is deployed to a virtual network and subnet, you cannot move it to Public access (allowed IP addresses).</br>

    :::image type="content" source="./media/how-to-manage-virtual-network-portal/private-dns-zone.png" alt-text="dns configuration":::
10. Select **Review + create** to review your flexible server configuration.
11. Select **Create** to provision the server. Provisioning can take a few minutes.

12. A notification will be shown that the restore operation has been initiated.

## Perform post-restore tasks

After the restore is completed, you should perform the following tasks to get your users and applications back up and running:

- If the new server is meant to replace the original server, redirect clients and client applications to the new server.
- Ensure appropriate VNet rules are in place for users to connect. These rules are not copied over from the original server.
- Ensure appropriate logins and database level permissions are in place.
- Configure alerts as appropriate for the newly restore server.

## Next steps

Learn more about [business continuity](concepts-business-continuity.md)
