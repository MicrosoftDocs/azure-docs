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

The purpose of Availability Zones is to enable instant failover should one Availability Zone fail. 

![conceptual view of one zone going down in a region](./media/az-overview/three-zones-per-region.png)

Where as Availability Sets protect against hardware failures within a datacenter. Availability Zones protect against failure of hardware, network, cooling, and power failures that can compromise the entire datacenter.

Conceptual information including the customer value proposition and benefits.

Physical.

Logical.

## Supported Regions

## Supported Services

The Azure services that support Availability Zones are:
- Virtual Machines (Linux and Windows)
- Public IP
- Virtual Machine Scale Sets
- Managed Disks
- Software Load Balancer

## Supported virtual machines

## Next steps
- Quickstart templates
- Enroll in the preview
- [Information on Azure Resiliency](https://azure.microsoft.com/features/resiliency)
- FAQ
