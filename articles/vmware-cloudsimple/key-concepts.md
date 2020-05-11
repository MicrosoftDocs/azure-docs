---
title: Key concepts for administering Azure VMware Solution by CloudSimple
titleSuffix: Azure VMware Solution by CloudSimple 
description: Describes key concepts for administering Azure VMware Solutions by CloudSimple
author: sharaths-cs 
ms.author: b-shsury 
ms.date: 04/24/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---
# Key concepts for administration of Azure VMware Solutions by CloudSimple

Administering Azure VMware Solutions by CloudSimple requires an understanding of the following concepts:

* CloudSimple service, which is displayed as Azure VMware Solutions by CloudSimple - Service
* CloudSimple node, which is displayed as Azure VMware Solutions by CloudSimple - Node
* CloudSimple private cloud
* Service networking
* CloudSimple virtual machine, which is displayed as Azure VMware Solutions by CloudSimple - Virtual machine

## CloudSimple service

With the CloudSimple service, you can create and manage all resources associated with VMware Solutions by CloudSimple from the Azure portal. Create a service resource in every region where you intend to use the service.

Learn more about the [CloudSimple service](cloudsimple-service.md).

## CloudSimple node

A CloudSimple node is a dedicated, bare-metal, hyperconverged compute and storage host into which the VMware ESXi hypervisor is deployed. This node is then incorporated into the VMware vSphere, vCenter, vSAN, and NSX platforms. CloudSimple networking services and edge networking services are also enabled. Each node serves as a unit of compute and storage capacity that you can provision to create [CloudSimple private clouds](cloudsimple-private-cloud.md). You provision or reserve nodes in a region where the CloudSimple service is available.

Learn more about [CloudSimple nodes](cloudsimple-node.md).

## CloudSimple private cloud

A CloudSimple private cloud is an isolated VMware stack environment managed by a vCenter server in its own management domain. The VMware stack includes ESXi hosts, vSphere, vCenter, vSAN, and NSX. The stack runs on dedicated nodes (dedicated and isolated bare-metal hardware) and is consumed by users through native VMware tools that include vCenter and NSX Manager. Dedicated nodes are deployed in Azure locations and are managed by Azure. Each private cloud can be segmented and secured by using networking services such as VLANs and subnets and firewall tables. Connections to your on-premises environment and the Azure network are created by using secure, private VPN, and Azure ExpressRoute connections.

Learn more about [CloudSimple private cloud](cloudsimple-private-cloud.md).

## Service networking

The CloudSimple service provides a network per region where your CloudSimple service is deployed. The network is a single TCP Layer 3 address space with routing enabled by default. All private clouds and subnets created in this region communicate with each other without any additional configuration. You create distributed port groups on the vCenter by using the VLANs. You can use the following network features to configure and secure your workload resources in your private cloud:

* [VLANs and subnets](cloudsimple-vlans-subnets.md)
* [Firewall tables](cloudsimple-firewall-tables.md)
* [VPN gateways](cloudsimple-vpn-gateways.md)
* [Public IP](cloudsimple-public-ip-address.md)
* [Azure network connection](cloudsimple-azure-network-connection.md)

## CloudSimple virtual machine

With the CloudSimple service, you can manage VMware virtual machines from the Azure portal. One or more clusters or resource pools from your vSphere environment can be mapped to the subscription on which the service is created.

Learn more about:

* [CloudSimple virtual machines](cloudsimple-virtual-machines.md)
* [Azure subscription mapping](https://docs.microsoft.com/azure/vmware-cloudsimple/azure-subscription-mapping/)
