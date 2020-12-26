---
title: Provision nodes for VMware Solution by CloudSimple - Azure 
description: Learn how to add nodes to your VMWare with CloudSimple deployment in the Azure portal. You can set up pay-as-you go capacity for your private cloud environment.
author: dikamath
ms.author: dikamath
ms.date: 08/14/2019
ms.topic: article
ms.service: azure-vmware-cloudsimple
ms.reviewer: cynthn
manager: dikamath
---
# Provision nodes for Azure VMware Solution by CloudSimple

Provision nodes in the Azure portal. Then you can set up pay-as-you go capacity for your CloudSimple private cloud environment.

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Add a node to your CloudSimple private cloud

1. Select **All services**.
2. Search for **CloudSimple Nodes**.

   ![Search CloudSimple Nodes](media/create-cloudsimple-node-search.png)

3. Select **CloudSimple Nodes**.
4. Click **Add** to create nodes.

    ![Add CloudSimple Nodes](media/create-cloudsimple-node-add.png)

5. Select the subscription where you want to provision CloudSimple nodes.
6. Select the resource group for the nodes. To add a new resource group, click **Create New**.
7. Enter the prefix to identify the nodes.
8. Select the location for the node resources.
9. Select the dedicated location to host the node resources.
10. Select the [node type](cloudsimple-node.md).
11. Select the number of nodes to provision.
12. Select **Review + Create**.
13. Review the settings. To modify any settings, click **Previous**.
14. Select **Create**.

## Next steps

* [Create Private Cloud](create-private-cloud.md)
