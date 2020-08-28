---
title: Manage virtual networks - Azure portal - Azure Database for MySQL - Flexible Server
description: Create and manage virtual networks for Azure Database for MySQL - Flexible Server using the Azure portal
author: ambhatna
ms.author: ambhatna
ms.service: mysql
ms.topic: how-to
ms.date: 9/21/2020
---

# Create and manage virtual networks for Azure Database for MySQL - Flexible Server using the Azure portal

> [!IMPORTANT]
> Azure Database for MySQL Flexible Server is currently in public preview

Azure Database for MySQL Flexible Server supports two types of mutually exclusive network connectivity methods to connect to your flexible server. The two options are:

1. Public access (allowed IP addresses)
2. Private access (VNet Integration)

In this article, we will focus on creation of MySQL server with **Private access (VNet Integration)** using Azure portal. With Private access (VNet Integration), you can deploy your flexible server into your own [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md). Azure Virtual Networks provide private and secure network communication. With private access, connections to the MySQL server are restricted to your virtual network. To learn more about it, refer to [Private access (VNet Integration)]<!--- FIX ME(./concepts-virtual-network.md).--->

You can deploy your flexible server into a virtual network and subnet during server creation. After the flexible server is deployed, you cannot move it into another virtual network, subnet or to *Public access (allowed IP addresses)*. Also, you cannot move the virtual network into a different resource group or subnet.

## Prerequisites
To create a flexible server in a virtual network, you need:
- A [Virtual Network](../../virtual-network/quick-create-portal.md#create-a-virtual-network)
-  To [delegate a subnet](../../virtual-network/manage-subnet-delegation.md#delegate-a-subnet-to-an-azure-service) to **Microsoft.DBforMySQL/flexibleServers**. This delegation means that only Azure Database for MySQL Flexible Servers can use that subnet. No other Azure resource types can be in the delegated subnet.

## Create Azure Database for MySQL Flexible Server in an already existing virtual network

1. Select **Create a resource** (+) in the upper-left corner of the  portal.
2. Select **Databases** > **Azure Database for MySQL**. You can also enter **MySQL** in the search box to find the service.
3. Select **Flexible server** as the deployment option.
4. Fill out the **Basics** form.
5. Go to the **Networking** tab to configure how you want to connect to your server.
6. In the **Connectivity method**, select **Private access (VNet Integration)**. Go to **Virtual Network** and select the already existing *virtual network* and *Subnet* created as part of prerequisites above.
7. Select **Review + create** to review your flexible server configuration.
8. Select **Create** to provision the server. Provisioning can take a few minutes.

>[!Note]
> After the flexible server is deployed to a virtual network and subnet, you cannot move it to Public access (allowed IP addresses).

## Next steps
- [Create and manage Azure Database for MySQL Flexible Server virtual network using Azure CLI](./how-to-manage-virtual-networks-cli.md).
- Learn more about [networking in Azure Database for MySQL Flexible Server]<!--- FIX ME(./concepts-networking-overview.md)--->
- Understand more about [Azure Database for MySQL Flexible Server virtual network]<!--- FIX ME(./concepts-networking-virtual-network.md).--->
