---
title: Manage virtual networks with Private Link - Azure portal
description: Create an Azure Database for PostgreSQL - Flexible Server instance with public access by using the Azure portal, and add private networking to the server based on Azure Private Link.
author: gennadNY
ms.author: gennadyk
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 01/16/2024
---


# Create and manage virtual networks with Private Link for Azure Database for PostgreSQL - Flexible Server by using the Azure portal

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL flexible server supports two types of mutually exclusive network connectivity methods to connect to your Azure Database for PostgreSQL flexible server instance. The two options are:

* Public access through allowed IP addresses. You can further secure that method by using [Azure Private Link](./concepts-networking-private-link.md)-based networking with Azure Database for PostgreSQL flexible server. The feature is in preview.
* Private access through virtual network integration.

This article focuses on creating an Azure Database for PostgreSQL flexible server instance with public access (allowed IP addresses) by using the Azure portal. You can then help secure the server by adding private networking based on Private Link technology.

You can use [Private Link](../../private-link/private-link-overview.md) to access the following services over a private endpoint in your virtual network:

* Azure platform as a service (PaaS) services, such as Azure Database for PostgreSQL flexible server
* Customer-owned or partner services that are hosted in Azure

Traffic between your virtual network and a service traverses the Microsoft backbone network, which eliminates exposure to the public internet.



## Prerequisites

To add an Azure Database for PostgreSQL flexible server instance to a virtual network by using Private Link, you need:

* A [virtual network](../../virtual-network/quick-create-portal.md#create-a-virtual-network). The virtual network and subnet should be in the same region and subscription as your Azure Database for PostgreSQL flexible server instance.

  Be sure to remove any locks (**Delete** or **Read only**) from your virtual network and all subnets before you add a server to the virtual network, because locks might interfere with operations on the network and DNS. You can reset the locks after server creation.


## Create an Azure Database for PostgreSQL flexible server instance with a private endpoint

To create an Azure Database for PostgreSQL flexible server instance, take the following steps:

1. In the upper-left corner of the Azure portal, select **Create a resource** (the plus sign).

2. Select **Databases** > **Azure Database for PostgreSQL**.

3. Fill out the **Basics** form with the following information:

   |Setting |Value|
   |---------|------|
   |**Subscription**| Select your Azure subscription.|
   |**Resource group**| Select your Azure resource group.|
   |**Server name**| Enter a unique server name.|
   |**Admin username** |Enter an administrator name of your choosing.|
   |**Password**|Enter a password of your choosing. The password must have at least eight characters and meet the defined requirements.|
   |**Location**|Select an Azure region where you want to want your Azure Database for PostgreSQL flexible server instance to reside.|
   |**Version**|Select the required database version of the Azure Database for PostgreSQL flexible server instance.|
   |**Compute + Storage**|Select the pricing tier that you need for the server, based on the workload.|

5. Select **Next: Networking**.

6. For **Connectivity method**, select the **Public access (allowed IP addresses) and private endpoint** checkbox.

7. In the **Private Endpoint (preview)** section, select **Add private endpoint**.

    :::image type="content" source="./media/how-to-manage-virtual-network-private-endpoint-portal/private-endpoint-selection.png" alt-text="Screenshot of the button for adding a private endpoint button on the Networking pane in the Azure portal." :::
8. On the **Create Private Endpoint** pane, enter the following values:

   |Setting|Value|
   |---------|------|
   |**Subscription**| Select your subscription.|
   |**Resource group**| Select the resource group that you chose previously.|
   |**Location**|Select an Azure region where you created your virtual network.|
   |**Name**|Enter a name for the private endpoint.|
   |**Target subresource**|Select **postgresqlServer**.|
   |**NETWORKING**|
   |**Virtual Network**| Enter a name for the Azure virtual network that you created previously. |
   |**Subnet**|Enter the name of the Azure subnet that you created previously.|
   |**PRIVATE DNS INTEGRATION**|
   |**Integrate with Private DNS Zone**| Select **Yes**.|
   |**Private DNS Zone**| Select **(New)privatelink.postgresql.database.azure.com**. This setting creates a new private DNS zone.|

9. Select **OK**.

10. Select **Review + create**.

11. On the **Review + create** tab, Azure validates your configuration. The **Networking** section lists information about your private endpoint.

    When you see the message that your configuration passed validation, select **Create**.

### Approval process for a private endpoint

A separation of duties is common in many enterprises today:

* A network administrator creates the cloud networking infrastructure, such as Azure Private Link services.
* A database administrator (DBA) creates and manages database servers.

After a network administrator creates a private endpoint, the PostgreSQL DBA can manage the private endpoint connection to Azure Database for PostgreSQL flexible server. The DBA uses the following approval process for a private endpoint connection:

1. In the Azure portal, go to the Azure Database for PostgreSQL flexible server resource.

1. On the left pane, select **Networking**.

1. A list of all private endpoint connections appears, along with corresponding private endpoints. Select a private endpoint connection from the list.

1. Select **Approve** or **Reject**, and optionally add a short text response.

   After approval or rejection, the list reflects the appropriate state, along with the response text.

## Next steps

* Learn more about [networking in Azure Database for PostgreSQL flexible server with Private Link](./concepts-networking-private-link.md).
* Understand more about [virtual network integration in Azure Database for PostgreSQL flexible server](./concepts-networking-private.md).
