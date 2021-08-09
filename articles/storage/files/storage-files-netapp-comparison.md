---
title: Azure Files and Azure NetApp Files Comparison | Microsoft Docs
description: Comparison of Azure Files and Azure NetApp Files.
author: jeffpatt24
services: storage
ms.service: storage
ms.subservice: files
ms.topic: conceptual
ms.date: 5/25/2021
ms.author: jeffpatt
---

# Azure Files and Azure NetApp Files comparison

This article provides a comparison of Azure Files and Azure NetApp Files. 

Most workloads that require cloud file storage work well on either Azure Files or Azure NetApp Files. To help determine the best fit for your workload, review the information provided in this article. For more information, see the [Azure Files](./index.yml) and [Azure NetApp Files](../../azure-netapp-files/index.yml) documentation.

## Features

| Category | Azure Files | Azure NetApp Files |
|---------|-------------------------|---------|
| Description | [Azure Files](https://azure.microsoft.com/services/storage/files/) is a fully managed, highly available, enterprise-grade service that is optimized for random access workloads with in-place data updates.<br><br> Azure Files is built on the same Azure storage platform as other services like Azure Blobs. | [Azure NetApp Files](https://azure.microsoft.com/services/netapp/) is a fully managed, highly available, enterprise-grade NAS service that can handle the most demanding, high-performance, low-latency workloads requiring advanced data management capabilities. It enables the migration of workloads, which are deemed “un-migratable” without.<br><br>  ANF is built on NetApp’s bare metal with ONTAP storage OS running inside the Azure datacenter for a consistent Azure experience and an on-premises like performance. |
| Protocols | Premium<br><ul><li>SMB 2.1, 3.0, 3.1.1</li><li>NFS 4.1 (preview)</li><li>REST</li></ul><br>Standard<br><ul><li>SMB 2.1, 3.0, 3.1.1</li><li>REST</li></ul><br> To learn more, see [available file share protocols](./storage-files-planning.md#available-protocols). | All tiers<br><ul><li>SMB 2.x, 3.x</li><li>NFS 3.0, 4.1</li><li>Dual protocol access (NFSv3/SMB)</li></ul><br> To learn more, see how to create [NFS](../../azure-netapp-files/azure-netapp-files-create-volumes.md), [SMB](../../azure-netapp-files/azure-netapp-files-create-volumes-smb.md), or [dual-protocol](../../azure-netapp-files/create-volumes-dual-protocol.md) volumes. |
| Region Availability | Premium<br><ul><li>30+ Regions</li></ul><br>Standard<br><ul><li>All regions</li></ul><br> To learn more, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=storage). | All tiers<br><ul><li>25+ Regions</li></ul><br> To learn more, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=storage). |
| Redundancy | Premium<br><ul><li>LRS</li><li>ZRS</li></ul><br>Standard<br><ul><li>LRS</li><li>ZRS</li><li>GRS</li><li>GZRS</li></ul><br> To learn more, see [redundancy](./storage-files-planning.md#redundancy). | All tiers<br><ul><li>Built-in local HA</li><li>[Cross-region replication](../../azure-netapp-files/cross-region-replication-introduction.md)</li></ul> |
| Service-Level Agreement (SLA)<br><br> Note that SLAs for Azure Files and Azure NetApp Files are calculated differently. | [SLA for Azure Files](https://azure.microsoft.com/support/legal/sla/storage/) | [SLA for Azure NetApp Files](https://azure.microsoft.com/support/legal/sla/netapp) |  
| Identity-Based Authentication and Authorization | SMB<br><ul><li>Active Directory Domain Services (AD DS)</li><li>Azure Active Directory Domain Services (Azure AD DS)</li></ul><br> Note that identify-based authentication is only supported when using SMB protocol. To learn more, see [FAQ](./storage-files-faq.md#security-authentication-and-access-control). | SMB<br><ul><li>Active Directory Domain Services (AD DS)</li><li>Azure Active Directory Domain Services (Azure AD DS)</li></ul><br> NFS/SMB dual protocol<ul><li>ADDS/LDAP integration</li></ul><br>NFSv3/NFSv4.1<ul><li>ADDS/LDAP integration (coming)</li><li>NFS extended groups (coming)</li></ul><br> To learn more, see [FAQ](../../azure-netapp-files/azure-netapp-files-faqs.md). |
| Encryption | All protocols<br><ul><li>Encryption at rest (AES 256) with customer or Microsoft-managed keys</li></ul><br>SMB<br><ul><li>Kerberos encryption using AES 256 or RC4-HMAC</li><li>Encryption in transit</li></ul><br>REST<br><ul><li>Encryption in transit</li></ul><br> To learn more, see [Security and networking](files-nfs-protocol.md#security-and-networking). | All protocols<br><ul><li>Encryption at rest (AES 256) with Microsoft-managed keys </li></ul><br>NFS 4.1<ul><li>Encryption in transit using Kerberos with AES 256</li></ul><br> To learn more, see [security FAQ](../../azure-netapp-files/azure-netapp-files-faqs.md#security-faqs). |
| Access Options | <ul><li>Internet</li><li>Secure VNet access</li><li>VPN Gateway</li><li>ExpressRoute</li><li>Azure File Sync</li></ul><br> To learn more, see [network considerations](./storage-files-networking-overview.md). | <ul><li>Secure VNet access</li><li>VPN Gateway</li><li>ExpressRoute</li><li>[Global File Cache](https://cloud.netapp.com/global-file-cache/azure)</li><li>[HPC Cache](../../hpc-cache/hpc-cache-overview.md)</li></ul><br> To learn more, see [network considerations](../../azure-netapp-files/azure-netapp-files-network-topologies.md). |
| Data Protection  | <ul><li>Incremental snapshots</li><li>File/directory user self-restore</li><li>Restore to new location</li><li>In-place revert</li><li>Share-level soft delete</li><li>Azure Backup integration</li></ul><br> To learn more, see [Azure Files enhances data protection capabilities](https://azure.microsoft.com/blog/azure-files-enhances-data-protection-capabilities/). | <ul><li>Snapshots (255/volume)</li><li>File/directory user self-restore</li><li>Restore to new volume</li><li>In-place revert</li><li>[Cross-Region Replication](../../azure-netapp-files/cross-region-replication-introduction.md) (public preview)</li></ul><br> To learn more, see [How Azure NetApp Files snapshots work](../../azure-netapp-files/snapshots-introduction.md). |
| Migration Tools  | <ul><li>Azure Data Box</li><li>Azure File Sync</li><li>Storage Migration Service</li><li>AzCopy</li><li>Robocopy</li></ul><br> To learn more, see [Migrate to Azure file shares](./storage-files-migration-overview.md). | <ul><li>[Global File Cache](https://cloud.netapp.com/global-file-cache/azure)</li><li>[CloudSync](https://cloud.netapp.com/cloud-sync-service), [XCP](https://xcp.netapp.com/)</li><li>Storage Migration Service</li><li>AzCopy</li><li>Robocopy</li><li>Application-based (for example, HSR, Data Guard, AOAG)</li></ul> |
| Tiers | <ul><li>Premium</li><li>Transaction Optimized</li><li>Hot</li><li>Cool</li></ul><br> To learn more, see [storage tiers](./storage-files-planning.md#storage-tiers). | <ul><li>Ultra</li><li>Premium</li><li>Standard</li></ul><br> All tiers provide sub-ms minimum latency.<br><br> To learn more, see [Service Levels](../../azure-netapp-files/azure-netapp-files-service-levels.md) and [Performance Considerations](../../azure-netapp-files/azure-netapp-files-performance-considerations.md). |
| Pricing | [Azure Files Pricing](https://azure.microsoft.com/pricing/details/storage/files/) | [Azure NetApp Files Pricing](https://azure.microsoft.com/pricing/details/netapp/) |

## Scalability and performance

| Category | Azure Files | Azure NetApp Files |
|---------|---------|---------|
| Minimum Share/Volume Size | Premium<br><ul><li>100 GiB</li></ul><br>Standard<br><ul><li>No minimum.</li></ul> | All tiers<br><ul><li>100 GiB (Minimum capacity pool size: 4 TiB)</li></ul> |
| Maximum Share/Volume Size | 100 TiB | All tiers<br><ul><li>100 TiB (500 TiB capacity pool limit)</li></ul><br>Up to 12.5 PiB per Azure NetApp account. |
| Maximum Share/Volume IOPS | Premium<br><ul><li>Up to 100k</li></ul><br>Standard<br><ul><li>Up to 10k</li></ul> | Ultra and Premium<br><ul><li>Up to 450k </li></ul><br>Standard<br><ul><li>Up to 320k</li></ul> |
| Maximum Share/Volume Throughput | Premium<br><ul><li>Up to 10 GiB/s</li></ul><br>Standard<br><ul><li>Up to 300 MiB/s</li></ul> | Ultra and Premium<br><ul><li>Up to 4.5 GiB/s</li></ul><br>Standard<br><ul><li>Up to 3.2GiB/s</li></ul> |
| Maximum File Size | 4 TiB | 16 TiB |
| Maximum IOPS Per File | Premium<br><ul><li>Up to 8,000</li></ul><br>Standard<br><ul><li>1,000</li></ul> | All tiers<br><ul><li>Up to volume limit</li></ul> |
| Maximum Throughput Per File | Premium<br><ul><li>300 MiB/s (Up to 1 GiB/s with SMB multichannel)</li></ul><br>Standard<br><ul><li>60 MiB/s</li></ul> | All tiers<br><ul><li>Up to volume limit</li></ul> |
| SMB Multichannel | Yes ([Preview](./storage-files-smb-multichannel-performance.md)) | Yes |
| Latency | Single-millisecond minimum latency (2ms to 3ms for small IO) | Sub-millisecond minimum latency (<1ms for random IO)<br><br>To learn more, see [performance benchmarks](../../azure-netapp-files/performance-benchmarks-linux.md). |

For more information on scalability and performance targets, see [Azure Files](./storage-files-scale-targets.md#azure-files-scale-targets) and [Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-resource-limits.md).

## Next Steps
* [Azure Files documentation](./index.yml)
* [Azure NetApp Files documentation](../../azure-netapp-files/index.yml)
