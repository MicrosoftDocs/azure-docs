--- 
title: Connect Azure virtual network to CloudSimple using ExpressRoute - Azure VMware Solution by CloudSimple
description: Describes how to obtain peering information for a connection between the Azure virtual network and your CloudSimple environment
author: sharaths-cs
ms.author: b-shsury 
ms.date: 08/14/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# Connect Azure virtual network to CloudSimple using ExpressRoute

You can extend your Private Cloud network to your Azure virtual network and Azure resources. An ExpressRoute connection allows you to access resources running in your Azure subscription from your Private Cloud.

## Request authorization key

An authorization key is required for the ExpressRoute connection between your Private Cloud and the Azure virtual network. To obtain a key, file a ticket with <a href="https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest" target="_blank">Support</a>.  Use the following information in the request:

* Issue type: **Technical**
* Subscription: **Select the subscription where CloudSimple service is deployed**
* Service: **VMware Solution by CloudSimple**
* Problem type: **Service request**
* Problem subtype: **Authorization key for Azure VNET connection**
* Subject: **Request for authorization key for Azure VNET connection**

## Get peering information from CloudSimple portal

To set up the connection, you must establish a connection between Azure virtual network and your CloudSimple environment.  As part of the procedure, you must supply the peer circuit URI and authorization key. Obtain the URI and authorization key from [CloudSimple portal](access-cloudsimple-portal.md).  Select **Network** on the side menu, and then select **Azure Network Connection**. Or select **Account** on the side menu and then select **Azure network connection**.

Copy peer circuit URI and for the authorization key for each of the regions using *copy* icon. For each CloudSimple region you want to connect:

1. Click **Copy** to copy the URI. Paste it into a file where it can be available to add to the Azure portal.  
2. Click **Copy** to copy the authorization key and paste it into the file as well.

Copy the authorization key and peer circuit URI that is in **Available** state.  **Used** status indicates that the key has already been used to create a virtual network connection.

![Virtual Network Connection page](media/virtual-network-connection.png)

For details on setting up the Azure virtual network to CloudSimple link, see [Connect your CloudSimple Private Cloud environment to the Azure virtual network using ExpressRoute](azure-expressroute-connection.md).

## Next steps

* [Azure virtual network connection to Private Cloud](azure-expressroute-connection.md)
* [Connect to on-premises network using Azure ExpressRoute](on-premises-connection.md)
