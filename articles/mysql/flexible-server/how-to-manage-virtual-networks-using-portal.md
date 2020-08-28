---
title: Manage Virtual Networks - Azure portal - Azure Database for MySQL - Flexible Server
description: Create and manage Virtual Networks for Azure Database for MySQL - Flexible Server using the Azure Portal
author: ambhatna
ms.author: ambhatna
ms.service: mysql
ms.topic: how-to
ms.date: 9/21/2020
---

# Create and manage Virtual Networks for Azure Database for MySQL - Flexible Server using the Azure Portal

> [!IMPORTANT]
> Azure Database for MySQL Flexible Server is currently in public preview

Azure Database for MySQL Flexible Server supports two types of mutually exclusive network connectivity methods to connect to your flexible server. The two options are:

1. Public access (allowed IP addresses)
2. Private access (VNet Integration)

In this article, we will focus on creation of MySQL server with **Private access (VNet Integration)** using Azure Portal. With *Private access (VNet Integration)*, you can deploy your flexible server into your own [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md). Azure Virtual Networks provide private and secure network communication. In Private access, the connections to the MySQL server are restricted to only within your virtual network only. To learn more about it, refer to [Private access (VNet Integration)](./concepts-virtual-network.md)

In Azure Database for MySQL Flexible Server, you can only deploy the server to a virtual network and subnet during creation of the server. After the flexible server is deployed to a virtual network and subnet, you cannot move it to another virtual network or subnet. You cannot move that virtual network into another resource group or subscription also.

## Prerequisites
To create a flexible server in Virtual Network, you need:
- A [Virtual Network](../../virtual-network/quick-create-portal#create-a-virtual-network.md)
- [Delegate a subnet](../../virtual-network/manage-subnet-delegation#delegate-a-subnet-to-an-azure-service.md) to **Microsoft.DBforMySQL/flexibleServers**.This delegation means that only Azure Database for MySQL Flexible Servers can use that subnet. No other Azure resource types can be in the delegated subnet.

## Create Azure Database for MySQL Flexible Server in an already existing Virtual Network

1. Follow the [Azure Portal quickstart](./quickstart-create-server-portal.md) to create an Azure Database for MySQL Flexible Server.
2. Go to the **Networking** tab to configure how you want to connect to your server.

   On the Networking tab, you can choose how your server will be reachable. Choose *Private access (VNet Integration)* to have a private and secure network communication.
3. In the **Connectivity-method**, select *Private access (VNet Integration)*. Go to **Virtual Network** and select the already existing *Virtual Network* and *Subnet* created as part of prerequisites above.
4. Select **Review + create** to review your flexible server configuration.
5. Select **Create** to provision the server. Provisioning can take a few minutes.

>[!Note]
> After the flexible server is deployed to a virtual network and subnet, you cannot move it to Public access (allowed IP addresses).

## Next steps
- [Create and manage Azure Database for MySQL Flexible Server Virtual Network using Azure CLI](how-to-manage-virtual-network-using-cli.md).
- Learn more about [networking in Azure Database for MySQL Flexible Server](./concepts-networking-overview.md)
- Understand more about [Azure Database for MySQL Flexible Server Virtual Network](./concepts-virtual-network.md).
