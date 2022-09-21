---
title: Using availability zones in Azure NetApp Files for high availability  | Microsoft Docs
description: Azure availability zones are highly available, fault tolerant, and more scalable than traditional single or multiple data center infrastructures.
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 09/21/2022
ms.author: anfdocs
---
# Using availability zones in Azure NetApp Files for high availability 

Azure’s push towards the use of [availability zones](../availability-zones/az-overview.md#availability-zones) (AZs) has increased, and the use of high availability (HA) deployments with availability zones are now a default and best practice recommendation in [Azure’s Well Architected Framework](/azure/architecture/framework/resiliency/design-best-practices#use-zone-aware-services). Azure NetApp Files lets you deploy new volumes in the logical availability zone of your choice. 

Azure availability zones are highly available, fault tolerant, and more scalable than traditional single or multiple data center infrastructures. Azure availability zones let you design and operate applications and databases that automatically transition between zones without interruption.  

Availability zones are referred to as *logical zones*. Each data center is assigned to a *physical zone*. Physical zones are mapped to logical zones in your Azure subscription. Azure subscriptions are automatically assigned this mapping when a subscription is created. Enterprise applications and resources are increasingly deployed into multiple availability zones to achieve this level of high availability (HA) or failure domain (zone) isolation. 

This feature lets you deploy new volumes in the logical availability zone of your choice. However, *it does not constitute (close) proximity towards other Azure resources (like VMs), nor does it guarantee lowest possible latencies.*

The following diagram summarizes availability zone volume placement for Azure NetApp Files:   

[ ![Diagram that summarizes availability zone volume placement for Azure NetApp Files.](../media/azure-netapp-files/availability-zone-volume-placement.png) ](../media/azure-netapp-files/availability-zone-volume-placement.png#lightbox)

## Supported regions

Availability zones are available in the following regions for Azure NetApp Files:

* Australia East
* Brazil South
* Canada Central
* Central India
* Central US
* East Asia
* East US
* East US 2
* Germany West Central
* Japan East
* Korea Central
* North Europe
* Norway East
* South Central US
* Southeast Asia
* UK South
* West Europe
* West US 2
* West US 3

<!-- Geert to provide info -->