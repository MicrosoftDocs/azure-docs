---
title: VMware Solution by CloudSimple - Azure network connections
description: Learn about connecting your Azure virtual network to your CloudSimple region network 
author: sharaths-cs
ms.author: dikamath
ms.date: 04/10/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---
# Azure network connections overview

When you create a CloudSimple service in a region and create nodes, you can:

* Request an Azure ExpressRoute circuit and attach it to the CloudSimple network in that region.
* Connect your CloudSimple region network to your Azure virtual network or your on-premises network using Azure ExpressRoute.
* Provide access to services running in your Azure subscription or your on-premises network from your Private Cloud environment.

The ExpressRoute connection is high bandwidth with low latency.

## Benefits

Azure network connection allows you to:

* Use Azure as a backup target for virtual machines on your Private Cloud.
* Deploy KMS servers in your Azure subscription to encrypt your Private Cloud vSAN datastore.
* Use hybrid applications where the web tier of the application runs in the public cloud while the application and database tiers run in your Private Cloud.

## Azure virtual network connection

Private Clouds can be connected to your Azure resources using ExpressRoute.  The ExpressRoute connection allows you to access resources running in your Azure subscription from your Private Cloud.  This connection allows you to extend your Private Cloud network to your Azure virtual network.  Routes from CloudSimple network will be exchanged with your Azure virtual network via BGP.  If you have virtual network peering configured, all peered virtual networks will be accessible from your CloudSimple network.

![Azure ExpressRoute Connection to virtual network](media/cloudsimple-azure-network-connection.png)

## ExpressRoute connection to on-premises network

You can connect your existing Azure ExpressRoute circuit to your CloudSimple region. ExpressRoute Global Reach feature is used to connect the two circuits with each other.  A connection is established between the on-premises and CloudSimple ExpressRoute circuits.  This connection allows you to extend your on-premises networks to Private Cloud network. Routes from your CloudSimple network will be exchanged via BGP with your on-premises network.

![On-premises ExpressRoute Connection - Global Reach](media/cloudsimple-global-reach-connection.png)

## Connection to on-premises network and Azure virtual network

Connections to on-premises network and Azure virtual network can coexist from your CloudSimple network.  The connection uses BGP to exchange routes between on-premises network, Azure virtual network, and CloudSimple network.  When you connect your CloudSimple network to your Azure virtual network in presence of Global Reach connection, Azure virtual network routes will be visible on your on-premises network.  Route exchange happens in Azure between the edge routers.

![On-premises ExpressRoute Connection with Azure virtual network connection](media/cloudsimple-global-reach-and-vnet-connection.png)

### Important considerations

Connecting to CloudSimple network from on-premises network and from Azure virtual network allows route exchange between all networks.

* Azure virtual network will be visible from both on-premises network and CloudSimple network.
* If you have connected to your Azure virtual network from on-premises network, connection to CloudSimple network using Global Reach will allow access to virtual networks from CloudSimple network.
* Subnet addresses **must not** overlap between any of the networks connected.
* CloudSimple will **not** advertise default route to the ExpressRoute connections
* If your on-premises router advertises the default route, traffic from CloudSimple network and Azure virtual network will use the advertised default route.  As a result, virtual machines on Azure cannot be accessed using public IP addresses.

## Next steps

* [Connect Azure virtual network to CloudSimple using ExpressRoute](virtual-network-connection.md)
* [Connect from on-premises to CloudSimple using ExpressRoute](on-premises-connection.md)
