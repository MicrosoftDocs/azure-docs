---
title: Azure VMware Solutions (AVS) - Nodes overview 
description: Learn about AVS nodes and concepts. 
author: sharaths-cs
ms.author: dikamath 
ms.date: 08/20/2019
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---
# AVS nodes overview

Nodes are the building blocks of an AVS Private Cloud. A node is:

* A dedicated bare metal compute host where a VMware ESXi hypervisor is installed  
* A unit of computing you can purchase or reserve to create AVS Private Clouds
* Available to purchase or reserve in a region where the AVS service is available

You create an AVS Private Cloud from the purchased nodes. To create an AVS Private Cloud, you need a minimum of three nodes of the same SKU. To expand an AVS Private Cloud, add additional nodes. You can add nodes to an existing cluster or create a new cluster by purchasing nodes in the Azure portal and associating them with the AVS service. All purchased nodes are visible under the AVS service. 

## Provisioned nodes

Provisioned nodes provide pay-as-you-go capacity. Provisioning nodes helps you quickly scale your VMware cluster on demand. You can add nodes as needed or delete a provisioned node to scale down your VMware cluster. Provisioned nodes are billed on a monthly basis and charged to the subscription where they're provisioned.

* If you pay for your Azure subscription by credit card, the card is billed immediately.
* If you're billed by invoice, the charges appear on your next invoice.

## VMware Solution by AVS nodes SKU

The following types of nodes are available for provisioning or reservation.

| SKU           | CS28 - Node                 | CS36 - Node                 | CS36m - Node                |
|---------------|-----------------------------|-----------------------------|-----------------------------|
| Region        | East US, West US            | East US, West US            | West Europe                 |
| CPU           | 2x2.2 GHz, 28 Cores (56 HT) | 2x2.3 GHz, 36 Cores (72 HT) | 2x2.3 GHz, 36 Cores (72 HT) |
| RAM           | 256 GB                      | 512 GB                      | 576 GB                      |
| Cache Disk    | 1.6-TB NVMe                 | 3.2-TB NVMe                 | 3.2-TB NVMe                 |
| Capacity Disk | 5.625 TB Raw                | 11.25 TB Raw                | 15.36 TB Raw                |
| Storage Type  | All Flash                   | All Flash                   | All Flash                   |

## Limits

The following node limits apply to AVS Private Clouds.

| Resource | Limit |
|----------|-------|
| Minimum number of nodes to create an AVS Private Cloud | 3 |
| Maximum number of nodes in a cluster on an AVS Private Cloud | 16 |
| Maximum number of nodes in an AVS Private Cloud | 64 |
| Minimum number of nodes on a new cluster | 3 |

## Next steps

* Learn how to [provision nodes](create-nodes.md)
* Learn about [AVS Private Clouds](cloudsimple-private-cloud.md)
