---
title: VLANs and subnets in VMware Solution by CloudSimple - Azure 
description: Learn about VLANs and subnets in a CloudSimple private cloud 
author: sharaths-cs 
ms.author: dikamath 
ms.date: 04/10/2019 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# VLANs and subnets overview

CloudSimple provides a network per region where your CloudSimple service is deployed.  The network is a single TCP Layer 3 address space with routing enabled by default.  All private clouds and subnets created in this region can communicate with each other without any additional configuration.  You can create distributed port groups on the vCenter using the VLANs.

## VLANs

A VLAN (Layer 2 network) is created per private cloud.  The Layer 2 traffic stays within the boundary of a private cloud, allowing you to isolate the local traffic within the private cloud.  A VLAN created on the private cloud can be used to create distributed port groups only in that private cloud.  A VLAN created on a private cloud is automatically configured on all the switches connected to the hosts of a private cloud.

## Subnets

You can create a subnet when you create a VLAN, by defining the address space of the subnet. An IP address from the address space is assigned as a subnet gateway. A single private Layer 3 address space is assigned per customer and region. You can configure any RFC 1918 non-overlapping address space, with your on-premises network or Azure virtual network, in your network region.

All subnets can communicate with each other by default, reducing the configuration overhead for routing between private clouds. East-west data across PCs in the same region stays in the same Layer 3 network and transfers over the local network infrastructure within the region. No egress is required for communication between private clouds in a region. This approach eliminates any WAN/egress performance penalty in deploying different workloads in different private clouds.

## Next steps

* [Create and manage VLANs and Subnets](https://docs.azure.cloudsimple.com/vlansubnet/)