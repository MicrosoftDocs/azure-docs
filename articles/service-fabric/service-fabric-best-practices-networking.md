---
title: Azure Service Fabric Networking Best Practices | Microsoft Docs
description: Best practices for managing Service Fabric networking.
services: service-fabric
documentationcenter: .net
author: peterpogorski
manager: timlt
editor: ''

ms.assetid: 19ca51e8-69b9-4952-b4b5-4bf04cded217
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: 
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/11/2019
ms.author: pepogors

---
# Networking
For more information about networking

## Network Security Group (NSG)
-- ARM template with port rules, link to the portal
-- Each scale set has its own subnet
-- Show a snippet of a subnet and IP configuration - Network profile of VMSS 

## Azure Traffic Manager and Azure Load Balancer
-- You should provision a Traffic Manager, to ensure that you have a naming service to any backend
-- 1 TM to Multiple LBs, TM Profile
-- Link to DNS aliasing for TM and for LB

## Capacity Planning and Scaling
Before creating any Azure Service Fabric cluster it is important to [plan for capacity](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity) by considering many items during the process.
* The number of node types your cluster needs to start out with
* The properties of each of node type (size, primary, internet facing, number of VMs, etc.)
* The reliability and durability characteristics of the cluster

## Next steps

* Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)
* Create a cluster on VMs or computers running Linux: [Create a Linux cluster](service-fabric-cluster-creation-via-portal.md)
* Learn about [Service Fabric support options](service-fabric-support.md)

[Image1]: ./media/service-fabric-best-practices/generate-common-name-cert-portal.png