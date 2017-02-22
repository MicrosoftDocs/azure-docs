---
title: Introduction to topology in Azure Network Watcher | Microsoft Docs
description: This page provides an overview of the Network Watcher topology capabilities
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: e753a435-38e0-482b-846b-121cb547555c
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace
---

# Introduction to topology in Azure Network Watcher

Topology returns a graph of network resources in a virtual network. The graph depicts the interconnection between the resources to represent the end to end network connectivity.

![topology overview][1]

In the portal, Topology returns the resource objects on a per virtual network basis. The relationships are depicted by lines between the resources Resources outside of the Network Watcher region, even if in the resource group will not be displayed. The resources returned in the portal view are a subset of the networking components that are graphed. To see the full list of networking resources you can use [PowerShell](network-watcher-topology-powershell.md) or [REST](network-watcher-topology-rest.md)

> [!NOTE]
> An instance of Network Watcher is required in each region that you want to run Topology on.

As resources are returned the connection between them are modeled under two relationships.

- **Containment** - Example: Virtual Network contains a Subnet which contains a NIC
- **Associated** - Example: A NIC is associated with a VM

### Next steps

Learn how to use PowerShell to retrieve the Topology view by visiting [Network Watcher topology with PowerShell](network-watcher-topology-powershell.md)

<!--Image references-->

[1]: ./media/network-watcher-topology-overview/topology.png
