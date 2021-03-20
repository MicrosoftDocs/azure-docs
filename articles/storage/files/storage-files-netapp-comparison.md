---
title: Azure Files and Azure NetApp Files Comparison | Microsoft Docs
description: Comparison of Azure Files and Azure NetApp Files to help you decide the appropriate Azure file storage solution for your workload.
author: jeffpatt24
services: storage
ms.service: storage
ms.subservice: files
ms.topic: conceptual
ms.date: 3/19/2021
ms.author: jeffpatt
---

# Azure Files and Azure NetApp Files Comparison

This article provides a comparison of Azure Files and Azure NetApp Files. 

Most workloads that require cloud file storage work well on either Azure Files or Azure NetApp Files. To help determine the best fit for your workload, review the information provided in this article. In addition to this article, please see the [Azure Files](https://docs.microsoft.com/azure/storage/files/) and [Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/) documentation for more information.

### Features

| Category | Azure Files | Azure NetApp Files |
|---------|---------|---------|
| Description | [Azure Files](https://azure.microsoft.com/services/storage/files/) is a fully managed, highly available service and is optimized for random access workloads with in-place data updates.<br><br> Azure Files is built on the same Azure storage platform as other services like Azure Blobs. | [Azure NetApp Files](https://azure.microsoft.com/services/netapp/) is a fully managed, highly available, enterprise-grade NAS service that can handle the most demanding, high-performance, low-latency workloads requiring advanced data management capabilities. It enables the migration of workloads which are deemed “un-migratable” without.<br><br>  ANF is built on NetApp’s bare metal with ONTAP storage OS running inside the Azure datacenter for a consistent Azure experience and an on-prem-like performance. |
| Protocols | Premium<br><ul><li>SMB 2.1, 3.0</li><li>NFS 4.1 (preview)</li></ul><br>Standard<br><ul><li>SMB 2.1, 3.0</li><li>REST</li></ul><br> To learn more, see [available file share protocols](https://docs.microsoft.com/azure/storage/files/storage-files-compare-protocols). | All tiers<br><ul><li>SMB 1, 2.x, 3.x</li><li>NFS 3.0, 4.1</li><li>Dual protocol access (NFSv3/SMB)</li></ul><br> To learn more, see how to create [NFS](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-create-volumes), [SMB](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-create-volumes-smb) or [dual-protocol](https://docs.microsoft.com/azure/azure-netapp-files/create-volumes-dual-protocol) volumes. |
| Region Availability | Premium<br><ul><li>30+ Regions</li></ul><br>Standard<br><ul><li>All regions</li></ul><br> To learn more, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=storage). | All tiers<br><ul><li>25+ Regions</li></ul><br> To learn more, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=storage). |
| Redundancy | Premium<br><ul><li>LRS</li><li>ZRS</li></ul><br>Standard<br><ul><li>LRS</li><li>ZRS</li><li>GRS</li><li>GZRS</li></ul><br> To learn more, see [redundancy](https://docs.microsoft.com/azure/storage/files/storage-files-planning#redundancy). | All tiers<br><ul><li>Built-in local HA</li><li>[Cross-region replication](https://docs.microsoft.com/azure/azure-netapp-files/cross-region-replication-introduction)</li></ul> |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |


