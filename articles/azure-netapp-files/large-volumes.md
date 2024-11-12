---
title: Understand large volumes in Azure NetApp Files 
description: Learn about the benefits, use cases, and requirements for using large volumes in Azure NetApp Files. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.custom: references_regions
ms.topic: conceptual
ms.date: 10/29/2024
ms.author: anfdocs
---
# Understand large volumes in Azure NetApp Files 

Volumes in Azure NetApp Files are the way you present high performance, cost-effective storage to your network attached storage (NAS) clients in the Azure cloud. Volumes act as independent file systems with their own capacity, file counts, ACLs, snapshots, and file system IDs. These qualities provide a way to separate datasets into individual secure tenants.

:::image type="content" source="./media/large-volumes/large-volumes-diagram.png" alt-text="Diagram of large and regular volume size." lightbox="./media/large-volumes/large-volumes-diagram.png":::

All resources in Azure NetApp files have [limits](azure-netapp-files-resource-limits.md). _Regular_ volumes have the following limits: 

| Limit type | Limits | 
| - | - | 
| Capacity | <ul><li>50 GiB minimum</li><li>100 TiB maximum</li></ul> |
| File count | 2,147,483,632 |
| Performance | <ul><li>Standard: 1,600</li><li>Premium: 1,600</li><li>Ultra: 4,500</li></ul> |

Large volumes have the following limits: 

| Limit type | Values | 
| - | - | 
| Capacity | <ul><li>50 TiB minimum</li><li>1 PiB maximum (or [2 PiB by special request](azure-netapp-files-resource-limits.md#request-limit-increase))</li></ul> |
| File count | 15,938,355,048 |
| Performance | <ul><li>Standard: 1,600</li><li>Premium: 6,400</li><li>Ultra: 12,800</li></ul> |


## Large volumes effect on performance 

In many cases, a regular volume can handle the performance needs for a production workload, particularly when dealing with database workloads, general file shares, and Azure VMware Service or virtual desktop infrastructure (VDI) workloads. When workloads are metadata heavy or require scale beyond what a regular volume can handle, a large volume can increase performance needs with minimal cost impact.

For instance, the following graphs show that a large volume can deliver two to three times the performance at scale of a regular volume.

For more information about performance tests, see [Large volume performance benchmarks for Linux](performance-large-volumes-linux.md) and [Regular volume performance benchmarks for Linux](performance-benchmarks-linux.md).

For example, in benchmark tests using Flexible I/O Tester (FIO), a large volume achieved higher I/OPS and throughput than a regular volume.

:::image type="content" source="./media/large-volumes/large-regular-volume-comparison.png" alt-text="Diagram comparing large and regular volumes with random I/O." lightbox="./media/large-volumes/large-regular-volume-comparison.png":::

:::image type="content" source="./media/large-volumes/large-volume-throughput.png" alt-text="Diagram comparing large and regular volumes with sequential I/O." lightbox="./media/large-volumes/large-volume-throughput.png":::

## Work load types and use cases

Regular volumes can handle most workloads. Once capacity, file count, performance, or scale limits are reached, new volumes must be created. This condition adds unnecessary complexity to a solution.

Large volumes allow workloads to extend beyond the current limitations of regular volumes. The following table shows some examples of use cases for each volume type.

| Volume type | Primary use cases | 
| - | -- |
| Regular volumes | <ul><li>General file shares</li><li>SAP HANA and databases (Oracle, SQL Server, Db2, and others)</li><li>VDI/Azure VMware Service</li><li>Capacities less than 50 TiB</li></ul> |
| Large volumes | <ul><li>General file shares</li><li>High file count or high metadata workloads (such as electronic design automation, software development, financial services)</li><li>High capacity workloads (such as AI/ML/LLP, oil & gas, media, healthcare images, backup, and archives)</li><li>Large-scale workloads (many client connections such as FSLogix profiles)</li><li>High performance workloads</li><li>Capacity quotas between 50 TiB and 1 PiB</li></ul> |

## More information

* [Requirements and considerations for large volumes](large-volumes-requirements-considerations.md)
* [Storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Understand workload types in Azure NetApp Files](workload-types.md)