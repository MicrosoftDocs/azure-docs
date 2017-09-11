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

Availability Zones are a component of Azure's High Availability and Disaster Recovery solution. An Availability Zone is a physically separate zone within an Azure region. There are three Availability Zones within an Azure region. Each Availability Zone has a distinct power source, network, cooling, and is logically separate from other Availability Zones within the Azure region.

What is the customer intent of this article. Why are we building AZ's. Should include information about regions. 

Customers understand we operate in regions. Start in regions and then go into three zones, that are fault tolerant.

I am an ITPro and application developer, and I want to protect (use Availability Zones) my applications and data against data center failure (to build Highly Available applications). 


The purpose of Availability Zones is to enable instant failover should one Availability Zone fail. 

![conceptual view of one zone going down in a region](./media/az-overview/three-zones-per-region.png) remove this artwork. AZ's don't have an icon. Need to build a graphic similar to what AWS. John to provide.
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

## Participate in the Availability Zones preview

To participate in the Availability Zones preview, click here and choose the subscriptions you want to enable for the preview.

## Next steps
- Quickstart templates
- Enroll in the preview
- [Information on Azure Resiliency](https://azure.microsoft.com/features/resiliency)
- FAQ
