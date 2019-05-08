---
title: VMware Solution by CloudSimple - Azure network connections
description: Learn about connecting your Azure virtual network to your CloudSimple region network 
author: sharaths-cs
ms.author: dikamath
ms.date: 04/10/2019 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# Azure network connection overview

When you create a CloudSimple service in a region, it:

* Creates Azure ExpressRoute circuit and attaches it to the service in that region
* Connects your CloudSimple region network to your Azure virtual network or your on-premises network using Azure ExpressRoute
* Provides access services running in your Azure subscription, or your on-premises network, from your private cloud environment

This connection is high bandwidth with low latency.

## Benefits

Azure network connection allows you to:

* Use Azure as a backup target for virtual machines on your Private Cloud.
* Deploy KMS servers in your Azure subscription to encrypt your Private Cloud vSAN datastore.
* Use hybrid applications where the web tier of the application runs in the public cloud while the application and database tiers run in your Private Cloud.

## ExpressRoute connection to on-premises network

You can connect your existing Azure ExpressRoute circuit to your CloudSimple region. ExpressRoute Global Reach feature is used to connect the two circuits with each other.  A connection is established between on-premises and CloudSimple ExpressRoute circuits.

This method establishes a connection between the two environments that is:

* Secure
* Private
* High bandwidth
* Low latency

To create an ExpressRoute connection to an on-premises network, [contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

* [Set up virtual network connection](https://docs.azure.cloudsimple.com/virtual-network-connection)