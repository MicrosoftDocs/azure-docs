---
title: Manage virtual networks - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: Create and manage virtual networks for Azure Database for PostgreSQL - Flexible Server using the Azure portal
author: gennadNY 
ms.author: gennadyk
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.date: 10/23/2023
---


# Create and manage virtual networks with Private Link for Azure Database for PostgreSQL - Flexible Server using the Azure portal

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL - Flexible Server supports two types of mutually exclusive network connectivity methods to connect to your flexible server. The two options are:

* Public access (allowed IP addresses). That method can be further secured by using [Private Link](./concepts-networking-private-link.md) based networking with Azure Database for PostgreSQL - Flexible Server in Preview. 
* Private access (VNet Integration)

In this article, we will focus on creation of PostgreSQL server with **Public access (allowed IP addresses)** using Azure portal and securing it adding private networking to the server based on [Private Link](./concepts-networking-private-link.md) technology. [Azure Private Link](../../private-link/private-link-overview.md) enables you to access Azure PaaS Services, such as [Azure Database for PostgreSQL - Flexible Server](./concepts-networking-private-link.md) , and Azure hosted customer-owned/partner services over a Private Endpoint in your virtual network. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. 

## Prerequisites

To add a flexible server to the  virtual network using Private Link, you need:
- A [Virtual Network](../../virtual-network/quick-create-portal.md#create-a-virtual-network)
    > [!Note]
    > -  The virtual network and subnet should be in the same region and subscription as your flexible server.
    > -  The virtual network should not have any resource lock set at the VNET or subnet level, as locks may interfere with operations on the network and DNS.  Make sure to remove any lock (**Delete** or **Read only**) from your VNET and all subnets before creating the server in a virtual network, and you can set it back after server creation.
