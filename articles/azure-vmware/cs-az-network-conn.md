---
title: Azure network connection from CloudSimple region 
description: Learn about connecting to Azure network from CloudSimple regions 
author: sharaths-cs
ms.author: dikamath
ms.date: 4/2/19 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# Azure network connection overview

CloudSimple provides an Azure ExpressRoute connection to your CloudSimple region network.  Your CloudSimple region network can be connected to your Azure virtual network or your on-premises network using Azure ExpressRoute. This high bandwidth, low latency connection allows you to access services running in your Azure subscription or your on-premises network from your Private Cloud environment.  When you create a CloudSimple service in a region, an ExpressRoute circuit is created and attached to the service in that region.

## Benefits

Azure network connection allows you to:

* Use Azure as a backup target for virtual machines on your Private Cloud.
* Deploy KMS servers in your Azure subscription to encrypt your Private Cloud vSAN datastore.
* Use hybrid applications where the web tier of the application runs in the public cloud while the application and database tiers run in your Private Cloud.

## ExpressRoute connection to on-premises network

If you have an Azure ExpressRoute connection from an external location (such as on-premises) to Azure, you can connect it to your CloudSimple region. The Azure feature that allows two ExpressRoute circuits to connect with each other is used for this connection. This method establishes a secure, private, high bandwidth, low latency connection between the two environments.

To create an ExpressRoute connection to on-premises network, [contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).
