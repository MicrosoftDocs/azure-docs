---
title: Manage virtual networks - Azure portal with Private Link- Azure Database for PostgreSQL - Flexible Server
description: Create and manage virtual networks for Azure Database with Private Link for PostgreSQL - Flexible Server using the Azure portal
author: gennadNY
ms.author: gennadyk
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 10/23/2023
---


# Create and manage virtual networks with Private Link for Azure Database for PostgreSQL - Flexible Server using the Azure portal

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL - Flexible Server supports two types of mutually exclusive network connectivity methods to connect to your flexible server. The two options are:

* Public access (allowed IP addresses). That method can be further secured by using [Private Link](./concepts-networking-private-link.md) based networking with Azure Database for PostgreSQL - Flexible Server in Preview. 
* Private access (VNet Integration)

In this article, we'll focus on creation of PostgreSQL server with **Public access (allowed IP addresses)** using Azure portal and securing it **adding private networking to the server based on [Private Link](./concepts-networking-private-link.md) technology**. **[Azure Private Link](../../private-link/private-link-overview.md)** enables you to access Azure PaaS Services, such as [Azure Database for PostgreSQL - Flexible Server](./concepts-networking-private-link.md) , and Azure hosted customer-owned/partner services over a **Private Endpoint** in your virtual network. **Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet**. 

> [!NOTE]
> Azure Database for PostgreSQL - Flexible Server supports Private Link based networking in Preview.

## Prerequisites

To add a flexible server to the  virtual network using Private Link, you need:
- A [Virtual Network](../../virtual-network/quick-create-portal.md#create-a-virtual-network). The virtual network and subnet should be in the same region and subscription as your flexible server. The virtual network shouldn't have any resource lock set at the virtual network or subnet level, as locks might interfere with operations on the network and DNS.  Make sure to remove any lock (**Delete** or **Read only**) from your virtual network and all subnets before adding  server to a virtual network, and you can set it back after server creation.
- Register [**PostgreSQL Private Endpoint capability** preview feature in your subscription](../../azure-resource-manager/management/preview-features.md). 

## Create an Azure Database for PostgreSQL - Flexible Server with Private Endpoint

To create an Azure Database for PostgreSQL server, take the following steps:

1. Select Create a resource **(+)** in the upper-left corner of the portal.

2. Select **Databases > Azure Database for PostgreSQL**.

3. Select the **Flexible server** deployment option.

4. Fill out the Basics form with the pertinent information. tHis includes Azure subscription, resource group, Azure region location, server name, server administrative credentials. 

| **Setting** | **Value**|
|---------|------|
|Subscription| Select your **Azure subscription**|
|Resource group| Select your **Azure resource group**|
|Server name| Enter **unique server name**|
|Admin username |Enter an **administrator name** of your choosing|
|Password|Enter a **password** of your choosing. The password must be at least eight characters long and meet the defined requirements|
|Location|Select an **Azure region** where you want to want your PostgreSQL Server to reside, example  West Europe|
|Version|Select the **database version** of the PostgreSQL server that is required|
|Compute + Storage|Select the **pricing tier** that is needed for the server based on the workload|

5. Select **Next:Networking**
6. Choose **"Public access (allowed IP addresses) and Private endpoint"** checkbox checked as Connectivity method.
7. Select **"Add Private Endpoint"** in Private Endpoint section
8. In Create Private Endpoint Screen enter following:

| **Setting** | **Value**|
|---------|------|
|Subscription| Select your **subscription**|
|Resource group| Select **resource group** you picked previously|
|Location|Select an **Azure region where you created your VNET**, example  West Europe|
|Name|Name of Private Endpoint|
|Target subresource|**postgresqlServer**|
|NETWORKING|
|Virtual Network|  Enter **VNET name** for Azure virtual network created previously |
|Subnet|Enter **Subnet name** for Azure Subnet you created previously|
|PRIVATE DNS INTEGRATION]
|Integrate with Private DNS Zone| **Yes**|
|Private DNS Zone| Pick **(New)privatelink.postgresql.database.azure.com**. This creates new private DNS zone.|

9. Select **OK**.
10. Select **Review + create**. You're taken to the **Review + create** page where Azure validates your configuration.
11. Networking section of the **Review + Create** page will list your Private Endpoint information.
12. When you see the Validation passed message, select **Create**.

### Approval Process for Private Endpoint

With separation of duties, common in many enterprises today, creation of cloud networking infrastructure, such as Azure Private Link services, are done by network administrator, whereas database servers are commonly created and managed by database administrator (DBA).
Once the network administrator creates the private endpoint (PE), the PostgreSQL database administrator (DBA) can manage the **Private Endpoint Connection (PEC)** to Azure Database for PostgreSQL. 
1. Navigate to the Azure Database for PostgreSQL - Flexible Server resource in the Azure portal.
    - Select **Networking** in the left pane.
    - Shows a list of all **Private Endpoint Connections (PECs)**.
    - Corresponding **Private Endpoint (PE)** created.
    - Select an individual **PEC** from the list by selecting it.
    - The PostgreSQL server admin can choose to **approve** or **reject a PEC** and optionally add a short text response.
    - After approval or rejection, the list will reflect the appropriate state along with the response text.

## Next steps
- Learn more about [networking in Azure Database for PostgreSQL - Flexible Server using Private Link](./concepts-networking-private-link.md).
- Understand more about [Azure Database for PostgreSQL - Flexible Server virtual network using VNET Integration](./concepts-networking-private.md).
