---
title: VLANs and Subnets - Concepts 
description: Learn about VLANs and Subnets in a CloudSimple Private Cloud 
author: sharaths-cs 
ms.author: dikamath 
ms.date: 4/2/19 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# VLANs/Subnets overview

CloudSimple provides a network per region where your CloudSimple service is deployed.  The network is a single TCP Layer 3 address space with routing enabled by default.  All Private Clouds and subnets created in this region can communicate with each other without any additional configuration.  You can create distributed port groups on the vCenter using the VLANs.

## VLANs

A VLAN (Layer 2 network) is created per Private Cloud.  The Layer 2 traffic stays within the boundary of a Private Cloud, allowing you to isolate the local traffic within the Private Cloud.  A VLAN created on the Private Cloud can be used to create distributed port groups only in that Private Cloud.  A VLAN created on a Private Cloud is automatically configured on all the switches connected to the hosts of a Private Cloud.

## Subnets

You can create a subnet when creating a VLAN by defining the address space of the subnet.  An IP address from the address space is assigned as a subnet gateway.  A single private Layer 3 address space is assigned per customer and region.  You can configure any RFC 1918 non-overlapping address space (with your on-premises network or Azure virtual network) in your network region.  All subnets can communicate with each other by default, reducing the configuration overhead for routing between Private Clouds. East-west data across PCs in the same region stays in the same Layer 3 network and transfers over the local network infrastructure within the region.  No egress is required for communication between Private Clouds in a region. This approach eliminates any WAN/egress performance penalty in deploying different workloads in different Private Clouds.
