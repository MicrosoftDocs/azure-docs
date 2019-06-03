--- 
title: Key concepts for administering Azure VMware Solution by CloudSimple 
description: Describes key concepts for administering Azure VMware Solution by CloudSimple
author: sharaths-cs 
ms.author: b-shsury 
ms.date: 4/24/19 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# Key concepts for administration of Azure VMware Solution by CloudSimple

Administering Azure VMware Solution by CloudSimple requires understanding the following concepts.

* CloudSimple Service (displayed as Azure VMware Solution by CloudSimple - Service)
* CloudSimple Node (displayed as Azure VMware Solution by CloudSimple - Node)
* CloudSimple Private Cloud
* Service Network
* CloudSimple Virtual Machine (displayed as Azure VMware Solution by CloudSimple - Virtual Machine)

## CloudSimple service

The CloudSimple service allows you to create and manage all resources associated with VMware Solutions by CloudSimple from the Azure portal. Create a service resource in every region where you intend to use the Service. 

Learn more about the [CloudSimple Service](cloudsimple-service.md)

## CloudSimple node

A CloudSimple node is a dedicated, bare metal, hyperconverged compute and storage host into which the VMware ESXi hypervisor is deployed. This node is then incorporated into the VMware vSphere, vCenter, vSAN, and NSX platforms. CloudSimple networking services and edge networking services are also enabled. Each node serves as a unit of compute and storage capacity that you can purchase to create [CloudSimple Private Clouds](cloudsimple-private-cloud.md). You purchase or reserve nodes in a region where the CloudSimple service is available.


Learn more about [CloudSimple nodes](cloudsimple-node.md)

## CloudSimple Private Cloud

A CloudSimple Private Cloud is an isolated VMware stack environment managed by a vCenter server in its own management domain. VMware stack includes ESXi hosts, vSphere, vCenter, vSAN, and NSX.  The stack runs on dedicated nodes (dedicated and isolated bare metal hardware) and is consumed by users through native VMware tools that include vCenter and NSX Manager. Dedicated nodes are deployed in Azure locations and are managed by Azure. Each Private Cloud can be segmented and secured using networking services such as VLANs/subnets and firewall tables.  Connections to your on-premises environment and the Azure network are created using secure, private VPN, and Azure ExpressRoute connections.

Learn more about [CloudSimple Private Cloud](cloudsimple-private-cloud.md)

## Service networking

The CloudSimple service provides a network per region where your CloudSimple service is deployed. The network is a single TCP Layer 3 address space with routing enabled by default. All Private Clouds and subnets created in this region communicate with each other without any additional configuration. You create distributed port groups on the vCenter using the VLANs.  You can use the following network features to configure and secure your workload resources in your Private Cloud.

* [VLANs/subnets](cloudsimple-vlans-subnets.md)
* [Firewall tables](cloudsimple-firewall-tables.md)
* [VPN gateways](cloudsimple-vpn-gateways.md)
* [Public IP](cloudsimple-public-ip-address.md)
* [Azure network connection](cloudsimple-azure-network-connection.md)

## CloudSimple virtual machine

The CloudSimple service allows you to manage VMware virtual machines from the Azure portal. One or more clusters or resource pools from your vSphere environment can be mapped to the subscription on which the service is created.

Learn more about:

* [CloudSimple virtual machines](cloudsimple-virtual-machines.md)
* [Azure Subscription Mapping](https://docs.azure.cloudsimple.com/azure-subscription-mapping/)
