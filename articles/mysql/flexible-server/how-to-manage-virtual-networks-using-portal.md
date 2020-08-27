---
title: Manage Virtual Networks - Azure portal - Azure Database for MySQL - Flexible Server
description: Create and manage Virtual Networks for Azure Database for MySQL - Flexible Server using the Azure portal
author: ambhatna
ms.author: ambhatna
ms.service: mysql
ms.topic: how-to
ms.date: 9/21/2020
---

# Create and manage Virtual Networks for Azure Database for MySQL - Flexible Server using the Azure portal

Azure Database for MySQL Flexible Server supports two type of mutually exclusive network connectivity methods to connect to your flexible server. The two options are:

1. Public access (allowed IP addresses)
2. Private access (VNet Integration)

With *Private access (VNet Integration)*, you can deploy your flexible server into your own [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md). Azure virtual networks provide private and secure network communication. In Private access, the connections to the MySQL server is restricted to within your virtual network only. To learn more about it, refer to [Private access (VNet Integration)](./concepts-virtual-network.md)

In Azure database for MySQL Flexible server, you can only deploy the server to a virtual network and subnet during creation of the server. After the flexible server is deployed to a virtual network and subnet, you cannot move it to another virtual network or subnet. You cannot move that virtual network into another resource group or subscription also.

> [!IMPORTANT]
> Azure Database for MySQL Flexible Server is currently in public preview

## Prerequisites
To create a flexible server in Virtual Network, you need:
- A [Virtual Network](../../virtual-network/quick-create-portal#create-a-virtual-network.md)
- [Delegate a subnet](../../virtual-network/manage-subnet-delegation#delegate-a-subnet-to-an-azure-service.md) to **Microsoft.DBforMySQL/flexibleServers**.This delegation means that only Azure Database for MySQL Flexible Servers can use that subnet. No other Azure resource types can be in the delegated subnet.

## Create Azure Database for MySQL -Flexible Server in already existing Virtual Network

1. Follow [use the Azure Portal to create an Azure Database for MySQL Flexible Server](./quickstart-create-server-portal.md) to create the server.
2. Go to the **Networking** tab to configure how you want to connect to your server.

   On the Networking tab, you can choose how your server will be reachable. Choose *Private access (VNet Integration)* to have a private and secure network communication.
3. In the **Connectivity-method**, select *Private access (VNet Integration)*. Go to **Virtual Network** and select the already existing *Virtual Network* and *Subnet* created as part of prerequisites above.
4. Select Review + create to review your flexible server configuration.
5. Select Create to provision the server. Provisioning can take a few minutes.

>[!Note]
> After the flexible server is deployed to a virtual network and subnet, you cannot move it to Public access (allowed IP addresses).



## Next steps
- Similarly, you can script to [Create and manage Azure Database for MySQL Flexible Server Virtual Network using Azure CLI](howto-manage-virtual-network-using-cli.md).
- Learn more about [networking in Azure Database for MySQL Flexible Server](./concepts-networking-overview.md)
- Understand more about [Azure Database for MySQL Flexible Server Virtual Network](./concepts-virtual-network.md).
