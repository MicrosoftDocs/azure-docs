---
title: Cross-region replication of Azure NetApp Files volumes | Microsoft Docs
description: Describes what Azure NetApp Files cross-region replication does, supported region pairs, service-level objectives, data durability, and cost model.  
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/10/2020
ms.author: b-juche
---
# Cross-region replication of Azure NetApp Files volumes

The Azure NetApp Files replication functionality provides data protection through cross-region volume replication. You can asynchronously replicate data from an Azure NetApp Files volume (source) in one region to another Azure NetApp Files volume (destination) in another region.  This capability enables you to failover your critical application in case of a region-wide outage or disaster.

> [!IMPORTANT]
> The cross-region replication feature is currently in public preview. You need to submit a waitlist request for accessing the feature through the [Azure NetApp Files cross-region replication waitlist submission page](https://aka.ms/anfcrrpreviewsignup). Wait for an official confirmation email from the Azure NetApp Files team before using the cross-region replication feature.

## Supported region pairs

Azure NetApp Files volume replication is currently available in the following fixed region pairs:  

* US West and US East
* US West 2 and US East 
* US South Central and US Central 
* US South Central and US East
* US South Central and US East 2 
* US East 2 and US Central 
* North Europe and West Europe
* UK South and UK West
* Australia East and Australia Southeast
* Canada Central and Canada East

## Service-level objectives

Recovery Point Objectives (RPO), or the maximum tolerable data loss, is defined as twice the replication schedule.  The actual RPO observed might vary based on factors such as the total dataset size along with the change rate, the percentage of data overwrites, and the replication bandwidth available for transfer.   

* For the replication schedule of 10 minutes, the maximum RPO is 20 minutes.  
* For the hourly replication schedule, the maximum RPO is 2 hours.  
* For the daily replication schedule, the maximum RPO is 2 days.  

Recovery Time Objective (RTO), or the maximum tolerable business application downtime, is determined by factors in bringing up the application and providing access to the data at the second site. The storage portion of the RTO for breaking the peering relationship to activate the destination volume and provide read and write data access in the second site is expected to be complete within a minute.

## Next steps
* [Requirements and considerations for using cross-region replication](cross-region-replication-requirements-considerations.md)
* [Create replication peering](cross-region-replication-create-peering.md)
* [Display health status of replication relationship](cross-region-replication-display-health-status.md)
* [Manage disaster recovery](cross-region-replication-manage-disaster-recovery.md)
* [Volume replication metrics](azure-netapp-files-metrics.md#replication)
* [Troubleshoot cross-region replication](troubleshoot-cross-region-replication.md)


