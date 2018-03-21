---
title: Availability Zones Overview | Microsoft Docs
description: This article provides an overview of Availability Zones in Azure.
services: 
documentationcenter:
author: markgalioto
manager: carmonm
editor:
tags:
ms.assetid:
ms.service: azure
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/16/2017
ms.author: markgal
ms.custom: mvc I am an ITPro and application developer, and I want to protect (use Availability Zones) my applications and data against data center failure (to build Highly Available applications). 
---

# Overview of Availability Zones in Azure (Preview)

Availability Zones help to protect you from datacenter-level failures. They are located inside an Azure region, and each one has its own independent power source, network, and cooling. To ensure resiliency, there's a minimum of three separate zones in all enabled regions. The physical and logical separation of Availability Zones within a region protects applications and data from zone-level failures. 

![conceptual view of one zone going down in a region](./media/az-overview/az-graphic-two.png)

## Regions that support Availability Zones

- East US 2
- US Central
- West Europe
- France Central

## Services that support Availability Zones

The Azure services that support Availability Zones are:

- Linux Virtual Machines
- Windows Virtual Machines
- Virtual Machine Scale Sets
- Managed Disks
- Load Balancer
- Public IP address
- Zone-Redundant Storage

## Get started with the Availability Zones preview

The Availability Zones preview is available in the East US 2, US Central, West Europe, and France Central regions for specific Azure services. 

1. [Sign up for the Availability Zones preview](http://aka.ms/azenroll). 
2. Sign in to your Azure subscription.
3. Choose a region that supports Availability Zones.
4. Use one of the following links to start using Availability Zones with your service. 
    - [Create a virtual machine](../virtual-machines/windows/create-portal-availability-zone.md)
    - [Create a virtual machine scale set](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md)
    - [Add a Managed Disk using PowerShell](../virtual-machines/windows/attach-disk-ps.md#add-an-empty-data-disk-to-a-virtual-machine)
    - [Load balancer](../load-balancer/load-balancer-standard-overview.md)

## Next steps
- [Quickstart templates](http://aka.ms/azqs)
