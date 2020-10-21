---
title: Azure VMware Solution by CloudSimple - Nodes overview 
description: Learn about CloudSimple concepts, including nodes, provisioned nodes, a Private Cloud, and VMware Solution by CloudSimple nodes SKUs.
author: sharaths-cs
ms.author: dikamath 
ms.date: 08/20/2019
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---
# CloudSimple nodes overview

Nodes are the building blocks of a Private Cloud. A node is:

* A dedicated bare metal compute host where a VMware ESXi hypervisor is installed  
* A unit of computing you can provision or reserve to create Private Clouds
* Available to provision or reserve in a region where the CloudSimple service is available

You create a Private Cloud from the provisioned nodes. To create a Private Cloud, you need a minimum of three nodes of the same SKU. To expand a Private Cloud, add additional nodes.  You can add nodes to an existing cluster or create a new cluster by provisioning nodes in the Azure portal and associating them with the CloudSimple service.  All provisioned nodes are visible under the CloudSimple service.  

## Provisioned nodes

Provisioned nodes provide pay-as-you-go capacity. Provisioning nodes helps you quickly scale your VMware cluster on demand. You can add nodes as needed or delete a provisioned node to scale down your VMware cluster. Provisioned nodes are billed on a monthly basis and charged to the subscription where they're provisioned.

* If you pay for your Azure subscription by credit card, the card is billed immediately.
* If you're billed by invoice, the charges appear on your next invoice.

## VMware Solution by CloudSimple nodes SKU

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

The following node limits apply to Private Clouds.

| Resource | Limit |
|----------|-------|
| Minimum number of nodes to create a Private Cloud | 3 |
| Maximum number of nodes in a cluster on a Private Cloud | 16 |
| Maximum number of nodes in a Private Cloud | 64 |
| Minimum number of nodes on a new cluster | 3 |

## Next steps

* Learn how to [provision nodes](create-nodes.md)
* Learn about [Private Clouds](cloudsimple-private-cloud.md)
