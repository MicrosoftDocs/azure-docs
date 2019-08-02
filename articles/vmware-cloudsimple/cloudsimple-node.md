---
title: Nodes Overview for VMware Solution by CloudSimple - Azure 
description: Learn about CloudSimple nodes and concepts. 
author: sharaths-cs
ms.author: dikamath 
ms.date: 04/10/2019
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# CloudSimple nodes overview

A node is:

* A dedicated bare metal compute host where VMware ESXi hypervisor is installed  
* A unit of computing you can provision or reserve to create private clouds  
* Available to provision or reserve in a region where the CloudSimple service is available

Nodes are building blocks of a private cloud.  To create a private cloud, you need a minimum of three nodes of the same SKU.  To expand a private cloud, add additional nodes.  You can add nodes to an existing cluster. Or, you can create a new cluster by provisioning nodes in the Azure portal, and associating them with the CloudSimple service.  All nodes provisioned are visible under the CloudSimple service.  You create a private cloud from the provisioned nodes on CloudSimple Portal.

## Provisioned nodes

Provisioned nodes provide pay-as-you-go capacity. Provisioning nodes helps you quickly scale your VMware cluster on demand. You can add nodes as needed, or delete a provisioned node to scale down your VMware cluster. provisioned nodes are billed on a monthly basis, and charged to the subscription where they're provisioned:

* If you pay for your Azure subscription by credit card, the card is billed immediately.
* If you're billed by invoice, the charges appear on your next invoice.

## VMware Solution by CloudSimple nodes SKU

The following types nodes are available for provisioning or reservation.

| SKU | CS28 - Node | CS36 - Node |
|-----|-------------|-------------|
| CPU | 2x2.2 GHz, 28 Cores (56 HT) | 2x2.3 GHz, 36 Cores (72 HT) |
| RAM | 256 GB | 512 GB |
| Cache Disk |  1.6-TB NVMe | 3.2-TB NVMe |
| Capacity Disk | 5.625 TB Raw | 11.25 TB Raw |
| Storage Type | All Flash | All Flash |

## Limits

The following node limits apply to private clouds.

| Resource | Limit |
|----------|-------|
| Minimum number of nodes to create a private cloud | 3 |
| Maximum number of nodes in a Cluster on a private cloud | 16 |
| Maximum number of nodes in a private cloud | 64 |
| Minimum number of nodes on a new Cluster | 3 |

## Next steps

* Learn how to [provision nodes](create-nodes.md)
* Learn about [Private Cloud](cloudsimple-private-cloud.md)