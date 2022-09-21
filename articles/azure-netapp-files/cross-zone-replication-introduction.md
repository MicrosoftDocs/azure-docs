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
ms.date: 09/21/2022
ms.author: anfdocs
ms.custom: references_regions
---

# Understand cross-zone replication of Azure NetApp Files

Cross-zone replication enables you to replicate volumes across availability zones within the same region. It enables you to fail over your critical application if a region-wide outage or disaster happens. 

Cross-zone replication builds on the existing workflows of [cross-region replication (generally available)](cross-region-replication-introduction.md) and the availability zone volume placement feature (in private preview). The existing feature of Azure NetApp Files cross-region replication provides data protection through cross-region volume replication. 

To establish a cross-zone replication relationship, you create the source volume within an availability zone. The destination volume must be created in a different availability zone in the same Azure region. 

Compared to cross-region replication, a cross-zone replication setup provides the following benefits: 
* Data protection within the same region
* Failure domain isolation down to the availability zone level
* With the help of availability zone volume placement feature, bring volumes into the same availability zone as the consuming compute resources
* Cost saving: there are no network transfers costs

## Next steps

* [Cross-region replication of Azure NetApp Files volumes](cross-region-replication-introduction.md)
* [Requirements and considerations for using cross-region replication](cross-zone-replication-requirements-considerations.md)