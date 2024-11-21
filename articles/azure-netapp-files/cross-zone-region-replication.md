---
title: Understand cross-zone region replication in Azure NetApp Files
description: Learn about cross-zone region replication in Azure NetApp Files for creating an extra layer of data protection.  
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 11/20/2024
ms.author: anfdocs
ms.custom: references_regions
---

# Understand cross-zone region replication in Azure NetApp Files

Azure NetApp Files supports using cross-zone and cross-region replication on the same source volume. With this added layer of protection, read/write functionality can shift to a replication volume in a different region in the event of a zonal outage. 

## Requirements 

* Cross-zone region replication adheres to the same requirements as [cross-zone replication](cross-zone-replication-requirements-considerations.md) and [cross-region replication](cross-region-replication.md).

## Next steps

- [Configure cross-zone region replication](cross-zone-region-replication-configure.md)