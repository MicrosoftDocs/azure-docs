---
title: Manage virtual networks - Azure portal
description: Create and manage virtual networks for Azure Database for PostgreSQL - Flexible Server using the Azure portal.
author: GennadNY
ms.author: gennadyk
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.custom:
  - ignite-2023
---

# Create and manage virtual networks (VNET Integration) for Azure Database for PostgreSQL - Flexible Server using the Azure portal

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL flexible server supports two types of mutually exclusive network connectivity methods to connect to your Azure Database for PostgreSQL flexible server instance. The two options are:

* Public access (allowed IP addresses). That method can be further secured by using [Private Link](./concepts-networking-private-link.md) based networking with Azure Database for PostgreSQL flexible server in Preview. 
* Private access (VNet Integration)

In this article, we focus on creation of an Azure Database for PostgreSQL flexible server instance with **Private access (VNet integration)** using Azure portal. With Private access (VNet Integration), you can deploy your Azure Database for PostgreSQL flexible server instance integrated into your own [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md). Azure Virtual Networks provide private and secure network communication. With private access, connections to the Azure Database for PostgreSQL flexible server instance are restricted to your virtual network. To learn more about it, refer to [Private access (VNet Integration)](./concepts-networking.md#private-access-vnet-integration).

You can deploy your Azure Database for PostgreSQL flexible server instance into a virtual network and subnet during server creation. After the Azure Database for PostgreSQL flexible server instance is deployed, you can't move it into another virtual network, subnet or to *Public access (allowed IP addresses)*.

## Prerequisites
To create an Azure Database for PostgreSQL flexible server instance in a virtual network, you need:
- A [Virtual Network](../../virtual-network/quick-create-portal.md#create-a-virtual-network)
    > [!Note]
    > -  The virtual network and subnet should be in the same region and subscription as your Azure Database for PostgreSQL flexible server instance.
    > -  The virtual network shouldn't have any resource lock set at the VNET or subnet level, as locks may interfere with operations on the network and DNS.  Make sure to remove any lock (**Delete** or **Read only**) from your VNET and all subnets before creating the server in a virtual network, and you can set it back after server creation.

-  To [delegate a subnet](../../virtual-network/manage-subnet-delegation.md#delegate-a-subnet-to-an-azure-service) to **Microsoft.DBforPostgreSQL/flexibleServers**. This delegation means that only Azure Database for PostgreSQL flexible server instances can use that subnet. No other Azure resource types can be in the delegated subnet.
-  Add `Microsoft.Storage` to the service endpoint for the subnet delegated to Azure Database for PostgreSQL flexible server. This is done by performing following steps:
     1. Go to your virtual network page.
     2. Select the VNET in which you're planning to deploy your Azure Database for PostgreSQL flexible server instance.
     3. Choose the subnet that's delegated for Azure Database for PostgreSQL flexible server.
     4. On the pull-out screen, under **Service endpoint**, choose `Microsoft.storage` from the drop-down.
     5. Save the changes.

- If you want to set up your own private DNS zone to use with the Azure Database for PostgreSQL flexible server instance, see [private DNS overview](../../dns/private-dns-overview.md) documentation for more details. 
  
## Create an Azure Database for PostgreSQL flexible server instance in an already existing virtual network

1. Select **Create a resource** (+) in the upper-left corner of the  portal.
2. Select **Databases** > **Azure Database for PostgreSQL**. You can also enter **PostgreSQL** in the search box to find the service.
<!-- no longer happens 3. Select **Flexible server** as the deployment option.-->
4. Fill out the **Basics** form.
5. Go to the **Networking** tab to configure how you want to connect to your server.
6. In the **Connectivity method**, select **Private access (VNet Integration)**. Go to **Virtual Network** and select the already existing *virtual network* and *Subnet* created as part of prerequisites.
7. Under **Private DNS Integration**,  by default, a new private DNS zone will be created using the server name. Optionally, you can choose the *subscription* and the *Private DNS zone* from the drop-down list.
8. Select **Review + create** to review your Azure Database for PostgreSQL flexible server configuration.
9. Select **Create** to provision the server. Provisioning can take a few minutes.
:::image type="content" source="./media/how-to-manage-virtual-network-portal/how-to-inject-flexible-server-vnet.png" alt-text="Injecting Azure Database for PostgreSQL flexible server into a VNET.":::

>[!Note]
> After the Azure Database for PostgreSQL flexible server instance is deployed to a virtual network and subnet, you can't move it to Public access (allowed IP addresses).

>[!Note]
> If you want to connect to the Azure Database for PostgreSQL flexible server instance from a client that's provisioned in another VNET, you have to link the private DNS zone with the VNET. See this [linking the virtual network](../../dns/private-dns-getstarted-portal.md#link-the-virtual-network) documentation on how to do it.

## Next steps
- [Create and manage Azure Database for PostgreSQL - Flexible Server virtual network using Azure CLI](./how-to-manage-virtual-network-cli.md).
- Learn more about [private networking in Azure Database for PostgreSQL - Flexible Server](./concepts-networking-private.md)
