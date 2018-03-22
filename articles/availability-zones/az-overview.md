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
ms.date: 03/19/2018
ms.author: markgal
ms.custom: mvc I am an ITPro and application developer, and I want to protect (use Availability Zones) my applications and data against data center failure (to build Highly Available applications). 
---

# Overview of Availability Zones in Azure

Availability Zones help to protect you from datacenter-level failures. They are located inside an Azure region, and each one has its own independent power source, network, and cooling. To ensure resiliency, there's a minimum of three separate zones in all enabled regions. The physical and logical separation of Availability Zones within a region protects applications and data from zone-level failures. 

![conceptual view of one zone going down in a region](./media/az-overview/az-graphic-two.png)

## Regions that support Availability Zones

- East US 2 (Preview)
- US Central
- West Europe (Preview)
- France Central
- Southeast Asia

## Services that support Availability Zones

The Azure services that support Availability Zones are:

- Linux Virtual Machines
- Windows Virtual Machines
- Virtual Machine Scale Sets
- Managed Disks
- Load Balancer
- Public IP address
- Zone-Redundant Storage
- SQL Database
- Zone Redundant Storage

## Get started with Availability Zones

Availability Zones are available in the East US 2, US Central, West Europe, France Central, and South East Asia regions for specific Azure services. 

1. Sign in to your Azure subscription.
2. Choose a region that supports Availability Zones.
3. Use one of the following links to start using Availability Zones with your service. 
    - [Create a virtual machine](../virtual-machines/windows/create-portal-availability-zone.md)
    - [Create a virtual machine scale set](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md)
    - [Add a Managed Disk using PowerShell](../virtual-machines/windows/attach-disk-ps.md#add-an-empty-data-disk-to-a-virtual-machine)
    - [Load balancer](../load-balancer/load-balancer-standard-overview.md)

## Next steps
- [Quickstart templates](http://aka.ms/azqs)
