---
title: Understand large volumes in Azure NetApp Files 
description: Learn about the benefits, use cases, and requirements for using large volumes in Azure NetApp Files. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.custom: references_regions
ms.topic: concept-article
ms.date: 11/11/2025
ms.author: anfdocs
# Customer intent: "As a cloud architect, I want to evaluate the capabilities and requirements of large volumes in Azure NetApp Files, so that I can choose the appropriate storage solution for scalable and high-performance workloads."
---
# Understand large volumes in Azure NetApp Files 

Volumes in Azure NetApp Files are the way you present high performance, cost-effective storage to your network attached storage (NAS) clients in the Azure cloud. Volumes act as independent file systems with their own capacity, file counts, ACLs, snapshots, and file system IDs. These qualities provide a way to separate datasets into individual secure tenants.

:::image type="content" source="./media/large-volumes/large-volumes-diagram.png" alt-text="Diagram of large and regular volume size." lightbox="./media/large-volumes/large-volumes-diagram.png":::

All resources in Azure NetApp files have [limits](azure-netapp-files-resource-limits.md). _Regular_ volumes have the following limits: 

| Limit type | Limits | 
| - | - | 
| Capacity | <ul><li>50 GiB minimum</li><li>100 TiB maximum</li></ul> |
| File count | 2,147,483,632 |
| Performance | <ul><li>Standard: 1,600 MiB/s</li><li>Flexible: 4,500 MiB/s</li><li>Premium: 4,500 MiB/s</li><li>Ultra: 4,500 MiB/s</li></ul> |

Large volumes have the following limits. With cool-access enabled, you can create volumes up to 7.2 PiB.

| Limit type | Values | 
| - | - | 
| Capacity | Large volumes <br><ul><li>50 TiB minimum</li><li>1 PiB maximum (or [2 PiB by special request](azure-netapp-files-resource-limits.md#request-limit-increase))</li></ul> <br>Large volumes with breakthrough mode<br> <ul><li>2,400 GiB minimum</li><li>2,400 TiB maximum</li></ul><br>Extra-large volumes up to 7.2 PiB<br> <ul><li>2,400 GiB minimum</li><li>7.2 PiB maximum</li></ul>|
| File count | 15,938,355,048 |
| Performance | The large volume performance limit is 12,800 MiB/s on all service levels. With breakthrough mode enabled, large volume performance is no longer constrained by a predefined limit. Depending on workload characteristics, throughput of up to 50 GiB/s on a single volume is achievable. |

>[!NOTE]
>When creating **Extra-large volumes (up to 7.2 PiB)**, you must enable cool access at the time of volume creation.


>[!IMPORTANT]
>Azure NetApp Files supports large volumes up to 1 PiB (or higher by special request), however large volume size increases are subject to regional and storage capacity availability. Actual capacity may vary by region. Customers planning volumes larger than 100 TiB are encouraged to work with their Microsoft account teams early to confirm availability and expected timeline. (This applies only to large volumes and is independent of service level. This does not apply to large volume breakthrough mode and extra-large volume with cool access)


## Large volumes effect on performance 

In many cases, a regular volume can handle the performance needs for a production workload, particularly when dealing with database workloads, general file shares, and Azure VMware Service or virtual desktop infrastructure (VDI) workloads. When workloads are metadata heavy or require scale beyond what a regular volume can handle, a large volume can increase performance needs with minimal cost impact. 

Azure NetApp Files large volume breakthrough mode takes performance a step further by leveraging six storage endpoints on dedicated capacity to deliver high-performance, low-latency access with high concurrency data paths for large-scale workloads, like HPC/EDA, while simplifying network management and eliminating performance degradation. For example, the following graphs demonstrate that a large volume can deliver two to three times higher performance at scale than a regular volume, while breakthrough mode achieves up to eight times the performance of a regular volume.

For more information about performance tests, see [Large volume performance benchmarks for Linux](performance-large-volumes-linux.md), [Large volume breakthrough mode performance benchmarks for Linux](performance-large-volume-breakthrough-mode-linux.md), and [Regular volume performance benchmarks for Linux](performance-benchmarks-linux.md).

For example, in benchmark tests using Flexible I/O Tester (FIO), a large volume achieved higher IOPS and throughput than a regular volume. A large volume with breakthrough mode had a much higher throughput.

:::image type="content" source="./media/large-volumes/large-regular-volume-comparison.png" alt-text="Diagram comparing large and regular volumes with random I/O." lightbox="./media/large-volumes/large-regular-volume-comparison.png":::

This table summarizes the relative IOPS performance improvements across volume types, highlighting the step-function gains achieved with large volumes and large volumes with breakthrough mode.

**Baseline = Regular Volume**

| Metrics | Large volume vs regular volume |  Large volume breakthrough mode vs regular volume  | Large volume breakthrough mode vs large volume  | 
| - | - | - | - | 
| Write IOPS | 3.9x | 8.2x | 2.1x | 
| Read IOPS | 1.8x | 4.8x | 2.6x | 


:::image type="content" source="./media/large-volumes/large-volume-throughput.png" alt-text="Diagram comparing large and regular volumes with sequential I/O." lightbox="./media/large-volumes/large-volume-throughput.png":::

This table summarizes the relative throughput improvements across volume types, highlighting the step-function gains achieved with large volumes and large volumes with breakthrough mode.

**Baseline = Regular Volume**

| Metrics | Large volume vs regular volume |  Large volume breakthrough mode vs regular volume  | Large volume breakthrough mode vs large volume  | 
| - | - | - | - | 
| Max Write Throughput | 3.4x | 8.4x | 2.5x | 
| Max Read Throughput | 2.7x | 14.4x | 3.9x | 


## Work load types and use cases

Regular volumes can handle most workloads. Once capacity, file count, performance, or scale limits are reached, new volumes must be created. This condition adds unnecessary complexity to a solution.

Large volumes allow workloads to extend beyond the current limitations of regular volumes. The following table shows some examples of use cases for each volume type.

| Volume type | Primary use cases | 
| - | --- |
| Regular volumes | <ul><li>General file shares</li><li>SAP HANA and databases (Oracle, SQL Server, Db2, and others)</li><li>VDI/Azure VMware Solution</li><li>Capacities less than 50 TiB</li></ul> |
| Large volumes | <ul><li>General file shares</li><li>High file count or high metadata workloads (such as electronic design automation, software development, financial services)</li><li>High capacity workloads (such as AI/ML/LLP, oil & gas, media, healthcare images, backup, and archives)</li><li>Large-scale workloads (many client connections such as FSLogix profiles)</li><li>High performance workloads</li><li>Capacity quotas between 50 TiB and 1-2 PiB, or with cool access enabled 2,400 GiB and 7.2 PiB</li></ul> |
| Large volumes breakthrough mode | All use cases involving large volumes, as well as those demanding throughput and concurrency beyond the capabilities of large volumes, such as HPC and EDA workloads. |

## More information

* [Requirements and considerations for large volumes](large-volumes-requirements-considerations.md)
* [Storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Understand workload types in Azure NetApp Files](workload-types.md)