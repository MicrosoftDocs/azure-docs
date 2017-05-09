---
title: Introduction to next hop in Azure Network Watcher | Microsoft Docs
description: This page provides an overview of the Network Watcher next hop capability
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: febf7bca-e0b7-41d5-838f-a5a40ebc5aac
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace
---

# Introduction to next hop in Azure Network Watcher

Traffic from a VM is sent to a destination based on the effective routes associated with a NIC. Next hop gets the next hop type and IP address of a packet from a specific virtual machine and NIC. This helps to determine if the packet is being directed to the destination or is the traffic being black holed. An improper configuration of routes by the user, where a traffic is directed to an on-premises location or a virtual appliance, can lead to connectivity issues. Next hop also returns the route table associated with the next hop. When querying a next hop if the route is defined as a user-defined route, that route will be returned. Otherwise Next hop returns "System Route".

![next hop overview][1]

The following is a list of the next hop types that can be returned when querying Next hop.

* Internet
* VirtualAppliance
* VirtualNetworkGateway
* VnetLocal
* HyperNetGateway
* VnetPeering
* None

### Next steps

Learn how to use next hop to find issues with network connectivity by visiting [Check the next hop on a VM](network-watcher-check-next-hop-portal.md)

<!--Image references-->
[1]: ./media/network-watcher-next-hop-overview/figure1.png













