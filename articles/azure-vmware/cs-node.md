---
title: VMware Solutions by CloudSimple - Node 
description: Learn about CloudSimple nodes and concepts. 
author: sharaths-cs
ms.author: dikamath 
ms.date: 4/2/19 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# CloudSimple nodes overview

A node is a dedicated bare metal compute host on which VMware ESXi hypervisor is installed.  Each node serves as a unit of computing that you can purchase or reserve to create Private Clouds.  You  purchase or reserve nodes in a region where the CloudSimple service is available.

Nodes are building blocks of a Private Cloud.  To create a Private Cloud, you need a minimum of three nodes of the same SKU.  To expand a Private Cloud, add additional nodes.  You can add nodes to an existing cluster or create a new cluster by purchasing nodes in the Azure portal and associating them with the CloudSimple service.  All nodes purchased are visible under the CloudSimple service.  You create a Private Cloud from the purchased nodes on CloudSimple Portal.

## Purchased nodes

Purchased nodes allow you to pay as you go for capacity. Purchased nodes costs are billed on a monthly basis and charged to the subscription where they are purchased.  Purchasing nodes help you quickly scale your VMware cluster on demand.  You can add nodes as needed or delete a purchased node to scale down your VMware cluster.  If you pay for your Azure subscription by credit card, the card is billed immediately. If you're billed by invoice, the charges appear on your next invoice.

## Reserved nodes

You can reserve nodes by prepaying for one year or three years.  Reservations can reduce the cost of nodes up to 50% relative to the cost of purchased nodes.

The reservation is charged to the payment method tied to the Azure subscription. If you have an Enterprise subscription, the reservation cost is deducted from your monetary commitment balance. If your monetary commitment balance doesn't cover the cost of the reservation, you're billed the overage.

At the end of the reservation term, the billing discount expires and your nodes are billed at the pay-as-you-go price. Reservations don't auto-renew. To continue getting the billing discount, you must buy a new reservation for eligible nodes.

## VMware Solution by CloudSimple Nodes SKU

The following types nodes are available for purchase or reservation.

| SKU | CS28 - Node | CS36 - Node |
|-----|-------------|-------------|
| CPU | 2x2.2 GHz, 28 Cores (56 HT) | 2x2.3 GHz, 36 Cores (72 HT) |
| RAM | 256 GB | 512 GB |
| Cache Disk |  1.6-TB NVMe | 3.2-TB NVMe |
| Capacity Disk | 5.625 TB Raw | 11.25 TB Raw |
| Storage Type | All Flash | All Flash |

## Limits

The following node limits apply to Private Clouds.

| Resource | Limit |
|----------|-------|
| Minimum number of nodes to create a Private Cloud | 3 |
| Maximum number of nodes in a Cluster on a Private Cloud | 16 |
| Maximum number of nodes in a Private Cloud | 64 |
| Minimum number of nodes on a new Cluster | 3 |

## Next steps

* Learn how to [Purchase nodes](create-nodes.md)
* Learn how to [Reserve nodes](reserve-nodes.md)