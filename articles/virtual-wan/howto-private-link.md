---
title: 'Share a private link service across Virtual WAN'
titleSuffix: Azure Virtual WAN
description: Steps to configure Private Link in Virtual WAN
services: virtual-wan
author: erjosito

ms.service: virtual-wan
ms.topic: how-to
ms.date: 03/30/2023
ms.author: jomore
ms.custom: fasttrack-new, devx-track-linux
---
# Use Private Link in Virtual WAN

[Azure Private Link](../private-link/private-link-overview.md) is a technology that allows you to connect Azure Platform-as-a-Service offerings using private IP address connectivity by exposing [Private Endpoints](../private-link/private-endpoint-overview.md). With Azure Virtual WAN, you can deploy a Private Endpoint in one of the virtual networks connected to any virtual hub. This private link provides connectivity to any other virtual network or branch connected to the same Virtual WAN.

## Before you begin

The steps in this article assume that you've already deployed a virtual WAN with one or more hubs and at least two virtual networks connected to Virtual WAN.

To create a new virtual WAN and a new hub, use the steps in the following articles:

* [Create a virtual WAN](virtual-wan-site-to-site-portal.md#openvwan)
* [Create a hub](virtual-wan-site-to-site-portal.md#hub)
* [Connect a VNet to a hub](virtual-wan-site-to-site-portal.md#hub)

## <a name="endpoint"></a>Create a private link endpoint

You can create a private link endpoint for many different services. In this example, we're using Azure SQL Database. You can find more information about how to create a private endpoint for an Azure SQL Database in [Quickstart: Create a Private Endpoint using the Azure portal](../private-link/create-private-endpoint-portal.md). The following image shows the network configuration of the Azure SQL Database:

:::image type="content" source="./media/howto-private-link/create-private-link.png" alt-text="create private link" lightbox="./media/howto-private-link/create-private-link.png":::

After creating the Azure SQL Database, you can verify the private endpoint IP address browsing your private endpoints:

:::image type="content" source="./media/howto-private-link/endpoints.png" alt-text="private endpoints" lightbox="./media/howto-private-link/endpoints.png":::

Clicking on the private endpoint we've created, you should see its private IP address and its Fully Qualified Domain Name (FQDN). The private endpoint should have an IP address in the range of the VNet where it has been deployed (10.1.3.0/24):

:::image type="content" source="./media/howto-private-link/sql-endpoint.png" alt-text="SQL endpoint" lightbox="./media/howto-private-link/sql-endpoint.png":::

## <a name="connectivity"></a>Verify connectivity from the same VNet

In this example, we verify connectivity to the Azure SQL Database from a Linux virtual machine with the MS SQL tools installed. The first step is verifying that DNS resolution works and the Azure SQL Database Fully Qualified Domain Name is resolved to a private IP address, in the same VNet where the Private Endpoint has been deployed (10.1.3.0/24):

```bash
nslookup wantest.database.windows.net
```

```output
Server:         127.0.0.53
Address:        127.0.0.53#53

Non-authoritative answer:
wantest.database.windows.net    canonical name = wantest.privatelink.database.windows.net.
Name:   wantest.privatelink.database.windows.net
Address: 10.1.3.228
```

As you can see in the previous output, the FQDN `wantest.database.windows.net` is mapped to `wantest.privatelink.database.windows.net`, that the private DNS zone created along the private endpoint will resolve to the private IP address `10.1.3.228`. Looking into the private DNS zone will confirm that there's an A record for the private endpoint mapped to the private IP address:

:::image type="content" source="./media/howto-private-link/dns-zone.png" alt-text="DNS zone" lightbox="./media/howto-private-link/dns-zone.png":::

After verifying the correct DNS resolution, we can attempt to connect to the database:

```bash
query="SELECT CONVERT(char(15), CONNECTIONPROPERTY('client_net_address'));"
sqlcmd -S wantest.database.windows.net -U $username -P $password -Q "$query"
```

```output
10.1.3.75
```

As you can see, we're using a special SQL query that gives us the source IP address that the SQL server sees from the client. In this case the server sees the client with its private IP (`10.1.3.75`), which means that the traffic goes from the VNet straight into the private endpoint.

Set the variables `username` and `password` to match the credentials defined in the Azure SQL Database to make the examples in this guide work.

## <a name="vnet"></a>Connect from a different VNet

Now that one VNet in Azure Virtual WAN has connectivity to the private endpoint, all of the other VNets and branches connected to Virtual WAN can have access to it as well. You need to provide connectivity through any of the models supported by Azure Virtual WAN, such as the [Any-to-any scenario](scenario-any-to-any.md) or the [Shared Services VNet scenario](scenario-shared-services-vnet.md), to name two examples.

Once you have connectivity between the VNet or the branch to the VNet where the private endpoint has been deployed, you need to configure DNS resolution:

* If connecting to the private endpoint from a VNet, you can use the same private zone that was created with the Azure SQL Database.
* If connecting to the private endpoint from a branch (Site-to-site VPN, Point-to-site VPN or ExpressRoute), you need to use on-premises DNS resolution.

In this example we're connecting from a different VNet. First attach the private DNS zone to the new VNet so that its workloads can resolve the Azure SQL Database Fully Qualified Domain Name to the private IP address. This is done through linking the private DNS zone to the new VNet:

:::image type="content" source="./media/howto-private-link/dns-link.png" alt-text="DNS link" lightbox="./media/howto-private-link/dns-link.png":::

Now any virtual machine in the attached VNet should correctly resolve the Azure SQL Database FQDN to the private link's private IP address:

```bash
nslookup wantest.database.windows.net
```

```output
Server:         127.0.0.53
Address:        127.0.0.53#53

Non-authoritative answer:
wantest.database.windows.net    canonical name = wantest.privatelink.database.windows.net.
Name:   wantest.privatelink.database.windows.net
Address: 10.1.3.228
```

In order to double-check that this VNet (10.1.1.0/24) has connectivity to the original VNet where the private endpoint was configured (10.1.3.0/24), you can verify the effective route table in any virtual machine in the VNet:

:::image type="content" source="./media/howto-private-link/effective-routes.png" alt-text="effective routes" lightbox="./media/howto-private-link/effective-routes.png":::

As you can see, there's a route pointing to the VNet 10.1.3.0/24 injected by the Virtual Network Gateways in Azure Virtual WAN. Now we can finally test connectivity to the database:

```bash
query="SELECT CONVERT(char(15), CONNECTIONPROPERTY('client_net_address'));"
sqlcmd -S wantest.database.windows.net -U $username -P $password -Q "$query"
```

```output
10.1.1.75
```

With this example, we've seen how creating a private endpoint in one of the VNets attached to a Virtual WAN provides connectivity to the rest of VNets and branches in the Virtual WAN.

## Next steps

For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
