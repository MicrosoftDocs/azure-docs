---
title: Azure VMware Solution by CloudSimple - CloudSimple node quota  
description: Describes the quota limits for CloudSimple nodes and how to request for an increase of quota  
author: sharaths-cs
ms.author: dikamath
ms.date: 04/30/2019
ms.topic: article
ms.service: vmware
ms.reviewer: cynthn
manager: dikamath
---
# CloudSimple node quota limits

Four nodes is the default quantity available for provisioning, when your subscription is enabled for CloudSimple service.  You can provision any [node type](cloudsimple-node.md) from Azure portal.  A minimum of three nodes of the same SKU are required to create a Private Cloud.  If you've provisioned the nodes, you may see an error when you try to provision additional nodes.

## Quota increase

You can increase the node quota by submitting a support request. The service operations team will evaluate the request, and work with you to increase node quota.  Select the following options when you open a new ticket:

* Issue type: **Technical**
* Subscription: **Your subscription ID**
* Service type: **VMware Solution by CloudSimple**
* Problem type: **Dedicated Nodes quota**
* Problem subtype: **Increase quota of dedicated nodes**
* Subject: **Quota increase**

In the details of the support ticket, provide the required number of nodes and node SKU.

You can also contact your Microsoft account representative at [azurevmwaresales@microsoft.com](mailto:azurevmwaresales@microsoft.com) to increase the node quota on your subscription.  You'll need to provide the:

* Subscription ID
* Node SKU
* Number of additional nodes for which you're requesting the quota increase

## Next steps

* [Provision nodes](create-nodes.md)
* [CloudSimple nodes overview](cloudsimple-node.md)