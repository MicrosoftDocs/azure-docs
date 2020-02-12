---
title: Delete nodes for VMware Solutions (AVS) - Azure 
description: Learn how to delete nodes from your VMWare with AVS deployment
author: sharaths-cs
ms.author: dikamath
ms.date: 08/05/2019
ms.topic: article
ms.service: azure-vmware-cloudsimple
ms.reviewer: cynthn
manager: dikamath
---

# Delete nodes from Azure VMware Solution by AVS

AVS nodes are metered once they are created. Nodes must be deleted to stop metering of the nodes. You delete the nodes that are not used from Azure portal.

## Before you begin

A node can be deleted only under following conditions:

* An AVS Private Cloud created with the nodes is deleted. To delete an AVS Private Cloud, see [Delete an Azure VMware Solution by AVS Private Cloud](delete-private-cloud.md).
* The node has been removed from the AVS Private Cloud by shrinking the AVS Private Cloud. To shrink an AVS Private Cloud, see [Shrink Azure VMware Solution by AVS Private Cloud](shrink-private-cloud.md).

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Delete AVS node

1. Select **All services**.

2. Search for **AVS Nodes**.

   ![Search AVS Nodes](media/create-cloudsimple-node-search.png)

3. Select **AVS Nodes**.

4. Select nodes that don't belong to an AVS Private Cloud to delete. **AVS PRIVATE CLOUD NAME** column shows the AVS Private Cloud name to which a node belongs to. If a node is not used by an AVS Private Cloud, the value will be empty. 

    ![Select AVS Nodes](media/select-delete-cloudsimple-node.png)

> [!NOTE]
> Only nodes which are not a part of the AVS Private Cloud can be deleted.

## Next steps

* Learn about [AVS Private Cloud](cloudsimple-private-cloud.md)
