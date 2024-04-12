---
title: Manage virtual networks - Azure portal
description: Create and manage virtual networks for Azure Database for MySQL - Flexible Server using the Azure portal.
author: SudheeshGH
ms.author: sunaray
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
ms.date: 1/18/2024
---

# Create and manage virtual networks for Azure Database for MySQL - Flexible Server using the Azure portal

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Azure Database for MySQL flexible server supports two types of mutually exclusive network connectivity methods to connect to your Azure Database for MySQL flexible server instance. The two options are:

- Public access (allowed IP addresses)
- Private access (virtual network integration)

This article focuses on creation of MySQL server with **Private access (VNet Integration)** using Azure portal. With Private access (virtual network integration), you can deploy your Azure Database for MySQL flexible server instance into your own [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md). Azure Virtual Networks provide private and secure network communication. With private access, connections to the MySQL server are restricted to your virtual network. To learn more about it, refer to [Private access (virtual network Integration)](./concepts-networking-vnet.md#private-access-virtual-network-integration).

>[!Note]
>You can deploy your Azure Database for MySQL flexible server instance into a virtual network and subnet during server creation. After the Azure Database for MySQL flexible server instance is deployed, you cannot move it into another virtual network, subnet or to *Public access (allowed IP addresses)*.

## Prerequisites

To create an Azure Database for MySQL flexible server instance in a virtual network, you need:

- A [Virtual Network](../../virtual-network/quick-create-portal.md#create-a-virtual-network)
    > [!Note]
    > The virtual network and subnet should be in the same region and subscription as your Azure Database for MySQL flexible server instance.

- To [delegate a subnet](../../virtual-network/manage-subnet-delegation.md#delegate-a-subnet-to-an-azure-service) to **Microsoft.DBforMySQL/flexibleServers**. This delegation means that only Azure Database for MySQL flexible server instances can use that subnet. No other Azure resource types can be in the delegated subnet.

## Create an Azure Database for MySQL flexible server instance in an already existing virtual network

1. Select **Create a resource** (+) in the upper-left corner of the  portal.
2. Select **Databases** > **Azure Database for MySQL**. You can also enter **MySQL** in the search box to find the service.
3. Select **Flexible server** as the deployment option.
4. Fill out the **Basics** form
5. Go to the **Networking** tab.
6. In the **Connectivity method**, select **Private access (VNet Integration)**. Go to **Virtual Network** section, you can either select an already existing *virtual network* and *Subnet* that is delegated to *Microsoft.DBforMySQL/flexibleServers* or create a new one by clicking the *create virtual network* link.
    > [!Note]
    > Only virtual networks and subnets in the same region and subscription will be listed in the drop down. </br>
    > The chosen subnet will be delegated to *Microsoft.DBforMySQL/flexibleServers*. It means that only Azure Database for MySQL flexible server instances can use that subnet.</br>

    :::image type="content" source="./media/how-to-manage-virtual-network-portal/vnet-creation.png" alt-text="Vnet-integration":::

7. Create a new or Select an existing **Private DNS Zone**.
    > [!NOTE]
    > Private DNS zone names must end with `mysql.database.azure.com`. </br>
    > If you do not see the option to create a new private dns zone, please enter the server name on the **Basics** tab.</br>
    > After the Azure Database for MySQL flexible server instance is deployed to a virtual network and subnet, you cannot move it to Public access (allowed IP addresses).</br>

    :::image type="content" source="./media/how-to-manage-virtual-network-portal/private-dns-zone.png" alt-text="dnsconfiguration":::
8. Select **Review + create** to review your Azure Database for MySQL flexible server configuration.
9. Select **Create** to provision the server. Provisioning can take a few minutes.

## Next steps

- [Create and manage Azure Database for MySQL flexible server virtual network using Azure CLI](./how-to-manage-virtual-network-cli.md).
- Learn more about [networking in Azure Database for MySQL flexible server](./concepts-networking.md).
- Understand more about [Azure Database for MySQL flexible server virtual network](./concepts-networking-vnet.md#private-access-virtual-network-integration).
