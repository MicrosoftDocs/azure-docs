---
title: Introduction to topology in Azure Network Watcher | Microsoft Docs
description: This page provides an overview of the Network Watcher topology capabilities
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: ad27ab85-9d84-4759-b2b9-e861ef8ea8d8
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace
---

# Introduction to topology in Azure Network Watcher

Topology returns a graph of network resources in a virtual network. The graph depicts the interconnection between the resources to represent the end to end network connectivity. Select a virtual network from the drop-down to view the topology.

A resource group is targeted when using topology. Topology returns resources on a per virtual network basic in a resource group that are in the same region as Network Watcher. Resources outside of that region, even if in the resource group will not be displayed.

The following image is an example of a topology of a virtual network that is displayed in the portal:

![topology overview][1]

### Next steps

Learn how to use PowerShell to retrieve the Topology view by visiting [Network Watcher topology with PowerShell](network-watcher-topology-powershell.md)

<!--Image references-->

[1]: ./media/network-watcher-topology-overview/topology.png
