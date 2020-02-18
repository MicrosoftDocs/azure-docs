---
title: Key concepts for administering Azure VMware Solutions (AVS) 
description: Describes key concepts for administering Azure VMware Solutions (AVS)
titleSuffix: Azure VMware Solutions (AVS)
author: sharaths-cs 
ms.author: b-shsury 
ms.date: 04/24/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---
# Key concepts for administration of Azure VMware Solutions (AVS)

Administering Azure VMware Solutions (AVS) requires an understanding of the following concepts:

* AVS service, which is displayed as Azure VMware Solutions (AVS) - Service
* AVS node, which is displayed as Azure VMware Solutions (AVS) - Node
* AVS private cloud
* Service networking
* AVS virtual machine, which is displayed as Azure VMware Solutions (AVS) - Virtual machine

## AVS service

With the AVS service, you can create and manage all resources associated with VMware Solutions (AVS) from the Azure portal. Create a service resource in every region where you intend to use the service.

Learn more about the [AVS service](cloudsimple-service.md).

## AVS node

An AVS node is a dedicated, bare-metal, hyperconverged compute and storage host into which the VMware ESXi hypervisor is deployed. This node is then incorporated into the VMware vSphere, vCenter, vSAN, and NSX platforms. AVS networking services and edge networking services are also enabled. Each node serves as a unit of compute and storage capacity that you can provision to create [AVS private clouds](cloudsimple-private-cloud.md). You provision or reserve nodes in a region where the AVS service is available.

Learn more about [AVS nodes](cloudsimple-node.md).

## AVS private cloud

An AVS private cloud is an isolated VMware stack environment managed by a vCenter server in its own management domain. The VMware stack includes ESXi hosts, vSphere, vCenter, vSAN, and NSX. The stack runs on dedicated nodes (dedicated and isolated bare-metal hardware) and is consumed by users through native VMware tools that include vCenter and NSX Manager. Dedicated nodes are deployed in Azure locations and are managed by Azure. Each AVS Private Cloud can be segmented and secured by using networking services such as VLANs and subnets and firewall tables. Connections to your on-premises environment and the Azure network are created by using secure, private VPN, and Azure ExpressRoute connections.

Learn more about [AVS private cloud](cloudsimple-private-cloud.md).

## Service networking

The AVS service provides a network per region where your AVS service is deployed. The network is a single TCP Layer 3 address space with routing enabled by default. All AVS Private Clouds and subnets created in this region communicate with each other without any additional configuration. You create distributed port groups on the vCenter by using the VLANs. You can use the following network features to configure and secure your workload resources in your AVS Private Cloud:

* [VLANs and subnets](cloudsimple-vlans-subnets.md)
* [Firewall tables](cloudsimple-firewall-tables.md)
* [VPN gateways](cloudsimple-vpn-gateways.md)
* [Public IP](cloudsimple-public-ip-address.md)
* [Azure network connection](cloudsimple-azure-network-connection.md)

## AVS virtual machine

With the AVS service, you can manage VMware virtual machines from the Azure portal. One or more clusters or resource pools from your vSphere environment can be mapped to the subscription on which the service is created.

Learn more about:

* [AVS virtual machines](cloudsimple-virtual-machines.md)
* [Azure subscription mapping](https://docs.azure.cloudsimple.com/azure-subscription-mapping/)
