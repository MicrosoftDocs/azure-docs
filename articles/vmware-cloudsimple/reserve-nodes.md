---
title: Azure VMware Solution by CloudSimple - reserve nodes 
description: Learn how to reserve nodes on the Azure portal. 
author: sharaths-cs 
ms.author: dikamath 
ms.date: 04/11/2019 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# Reserve nodes for VMware Solution by CloudSimple - Azure

Reserving nodes for a fixed term is a cost-effective alternative to pay-as-you-go node provisioning. You can reserve capacity for your base needs at reduced prices. When you need additional capacity, you can still add more on a pay-as-you-go basis.

## Set up a reserved node in your CloudSimple private cloud

1. In the [Azure portal](https://portal.azure.com) left navigation menu, select **Dedicated VMware Cloud Nodes**.
2. Select **Reservations** > **Purchase**.  TODO any guidance needed on these settings?
3. On the **Create Reserved Dedicated VMware Cloud Nodes** page, select a name for the dedicated node.
4. Select a subscription type.
5. Keep the default setting of a single subscription for Scope.
6. Select the Azure region to host the reserved nodes.
7. Select the location.
8. Select the Private Cloud node size.
9. Select the term of use for the dedicated nodes.

    With reservations, the term is fixed. To set up pay-as-you-go capacity, see [Create nodes](create-nodes.md).
10. Select the number of nodes.

    The costs and estimated savings are presented. If you modify settings, the cost calculations are updated.
11. Select **Create**.

The reservation request is recorded and the details are listed, including a reservation ID.

All the reservations are listed on the **Dedicated VMware Cloud Nodes** > **Reservations** page.

## Next steps

* [Create Private Cloud](https://docs.azure.cloudsimple.com/create-private-cloud/)