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
ms.service:
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/11/2017
ms.author: markgal
ms.custom: mvc
---

# Overview of Availability Zones

Though the cloud feels like it's everywhere, in reality, your data and applications are running in specific physical locations. Unforeseen events can have catastrophic impacts on those physical locations. And for this reason, it makes sense to distribute your data and applications to ensure their availability. Region pairs helps with availability by pairing one Azure region with another region within the same geography (such as US, Europe, or Asia). Availability Zones expands the level of control you have to maintain the availability of your applications and data. An Availability Zone is a physically separate zone within an Azure region. Each Availability Zone has a distinct power source, network, cooling, and is logically separate from the other Availability Zones within the Azure region. When Availability Zones are deployed, an Azure region contains three Availability Zones.  

If one Availability Zone is compromised, then the 

What is the customer intent of this article. Why are we building AZ's. Should include information about regions. 

Customers understand we operate in regions. Start in regions and then go into three zones, that are fault tolerant.

I am an ITPro and application developer, and I want to protect (use Availability Zones) my applications and data against data center failure (to build Highly Available applications). 


The purpose of Availability Zones is to enable instant failover should one Availability Zone fail. 

! conceptual view of one zone going down in a region (./media/az-overview/three-zones-per-region.png) John to provide artwork that shows Availability Zones.
Data residency - 3+1.



Availability Zones protect against failure of hardware, network, cooling, and power failures that can compromise the entire datacenter.

Conceptual information including the customer value proposition and benefits.



Physical. discussed above.

Logical. how the services are updated on a zone by zone fashion. Applications won't go down. 



## Supported Regions

East US 2
West Europe


## Supported Services

The Azure services that support Availability Zones are:
|Service | API version |
|------- | ------------ |
| Linux Virtual Machines |   |
| Windows Virtual Machines |  |
Public IP
- Zonal Virtual Machine Scale Sets
- Managed Disks
- Software Load Balancer

## Supported virtual machines SKUs
- A2_v2
- D2_v2
- DS2_v2

## Get Started with the Availability Zones preview

The Availability Zone preview is available in the East US 2 and West Europe regions for specific Azure services. 

1. Follow the instructions to sign up for the Availablity Zones (link to signup) preview in your subscription. 
2. Choose the Azure subscription to use.
3. Use one of the following links to start using Availabilty Zones with your service. 
    a. Create a virtual machine.
    b. Create a public IP.
    c. Creat a zonal virtual machine scale set.
    d. Create a Managed Disk.
    e. Create a Software Load Balancer.

## Next steps
- Quickstart templates - this link comes from Raj.
- [Information on Azure Resiliency](https://azure.microsoft.com/features/resiliency)
- FAQ
