---
title: Understand large volumes in Azure NetApp Files 
description: Learn about the benefits, use cases, and requirements for using large volumes in Azure NetApp Files. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.custom: references_regions
ms.topic: conceptual
ms.date: 10/18/2024
ms.author: anfdocs
---
# Understand large volumes in Azure NetApp Files 



Volumes in Azure NetApp Files are the way you present high performance, cost-effective storage to your network attached storage (NAS) clients in the Azure cloud. Volumes act as independent file systems with their own capacity, file counts, ACLs, snapshots and file system IDs, which provides a way to separate datasets into individual secure tenants.



## Large volumes effect on performance 

In many cases, a regular volume can handle the performance needs for a production workload, particularly when dealing with database workloads, general file shares, and Azure VMware Service or virtual desktop infrastructure (VDI) workloads. When workloads are metadata heavy or require scale beyond what a regular volume can handle, a large volume can increase performance needs with minimal cost impact.

For instance, the following graphs show that a large volume can deliver 2-3x the performance at scale of a regular volume.

For more information about performance tests, see [Large volume performance benchmarks for Linux](performance-large-volumes-linux.md) and [Regular volume performance benchmarks for Linux](performance-benchmarks-linux.md).

For example, benchmarks using FIO, a large volume was capable of higher IOPS and throughput than a regular volume.