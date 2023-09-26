---
title: Cross-zone replication of Azure NetApp Files volumes | Microsoft Docs
description: Describes what Azure NetApp Files cross-zone replication does.
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 02/17/2023
ms.author: anfdocs
ms.custom: references_regions
---

# Understand cross-zone replication of Azure NetApp Files (preview)

In many cases resiliency across availability zones is achieved by HA architectures using application-based replication and HA, as explained in [Use availability zones for high availability](use-availability-zones.md). However, simpler, more cost-effective approaches are often considered by using storage-based data replication instead.  

Similar to the Azure NetApp Files [cross-region replication feature](cross-region-replication-introduction.md), the cross-zone replication (CZR) capability provides data protection between volumes in different availability zones. You can asynchronously replicate data from an Azure NetApp Files volume (source) in one availability zone to another Azure NetApp Files volume (destination) in another availability. This capability enables you to fail over your critical application if a zone-wide outage or disaster happens. 

## Supported regions

The preview of cross-zone replication is available in the following regions: 

* Australia East
* Brazil South 
* Canada Central 
* Central India
* Central US 
* East Asia
* East US 
* East US 2
* France Central 
* Germany West Central 
* Japan East
* Korea Central
* North Europe
* Norway East 
* Qatar Central
* South Africa North
* Southeast Asia
* South Central US 
* Sweden Central
* Switzerland North
* UAE North
* UK South
* US Gov Virginia
* West Europe
* West US 2 
* West US 3 

In the future, cross-zone replication is planned for all [AZ-enabled regions](../availability-zones/az-overview.md#azure-regions-with-availability-zones) with [Azure NetApp Files presence](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=netapp&regions=all&rar=true).

## Service-level objectives 

Recovery Point Objective (RPO) indicates the point in time to which data can be recovered. The RPO target is typically less than twice the replication schedule, but it can vary. In some cases, it can go beyond the target RPO based on factors such as the total dataset size, the change rate, the percentage of data overwrites, and the replication bandwidth available for transfer. 

* For the replication schedule of 10 minutes, the typical RPO is less than 20 minutes. 

* For the hourly replication schedule, the typical RPO is less than two hours. 

* For the daily replication schedule, the typical RPO is less than two days. 

Recovery Time Objective (RTO), or the maximum tolerable business application downtime, is determined by factors in bringing up the application and providing access to the data at the second site. The storage portion of the RTO for breaking the peering relationship to activate the destination volume and provide read and write data access in the second site is expected to be complete within a minute. 

## Cost model for cross-zone replication 

Replicated volumes are hosted on a [capacity pool](azure-netapp-files-understand-storage-hierarchy.md#capacity_pools). As such, the cost for cross-zone replication is based on the provisioned capacity pool size and tier as normal. There is no additional cost for data replication.

## Next steps

* [Requirements and considerations for using cross-zone replication](cross-zone-replication-requirements-considerations.md)
* [Create cross-zone replication](create-cross-zone-replication.md)

