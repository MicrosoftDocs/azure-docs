---
title: Compare NFS access to Azure Files, Blob Storage, and Azure NetApp Files
description: Compare NFS access for Azure Files, Azure Blob Storage, and Azure NetApp Files.
author: khdownie
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: conceptual
ms.date: 03/20/2023
ms.author: kendownie
---

# Compare access to Azure Files, Blob Storage, and Azure NetApp Files with NFS

This article provides a comparison between each of these offerings if you access them through the [Network File System (NFS)](https://en.wikipedia.org/wiki/Network_File_System) protocol. This comparison doesn't apply if you access them through any other method.

For more general comparisons, see [this article](storage-introduction.md) to compare Azure Blob Storage and Azure Files, or [this article](../files/storage-files-netapp-comparison.md) to compare Azure Files and Azure NetApp Files.

## Comparison

|Category  |Azure Blob Storage  |Azure Files  |Azure NetApp Files  |
|---------|---------|---------|---------|
|Use cases     |Blob Storage is best suited for large scale read-heavy sequential access workloads where data is ingested once and minimally modified further.<br></br>Blob Storage offers the lowest total cost of ownership, if there is little or no maintenance.<br></br>Some example scenarios are: Large scale analytical data, throughput sensitive high-performance computing, backup and archive, autonomous driving, media rendering, or genomic sequencing.         |Azure Files is a highly available service best suited for random access workloads.<br></br>For NFS shares, Azure Files provides full POSIX file system support and can easily be used from container platforms like Azure Container Instance (ACI) and Azure Kubernetes Service (AKS) with the built-in CSI driver, in addition to VM-based platforms.<br></br>Some example scenarios are: Shared files, databases, home directories, traditional applications, ERP, CMS, NAS migrations that don't require advanced management, and custom applications requiring scale-out file storage.         |Fully managed file service in the cloud, powered by NetApp, with advanced management capabilities.<br></br>Azure NetApp Files is suited for workloads that require random access and provides broad protocol support and data protection capabilities.<br></br>Some example scenarios are: On-premises enterprise NAS migration that requires rich management capabilities, latency sensitive workloads like SAP HANA, latency-sensitive or IOPS intensive high performance compute, or workloads that require simultaneous multi-protocol access.         |
|Available protocols     |NFSv3<br></br>REST<br></br>Data Lake Storage Gen2         |SMB<br><br>NFSv4.1<br></br> (No interoperability between either protocol)         |NFSv3 and NFSv4.1<br></br>SMB<br></br>Dual protocol (SMB and NFSv3, SMB and NFSv4.1)         |
|Key features     | Integrated with HPC cache for low latency workloads. <br> </br> Integrated management, including lifecycle, immutable blobs, data failover, and metadata index.         | Zonally redundant for high availability. <br></br> Consistent single-digit millisecond latency. <br></br>Predictable performance and cost that scales with capacity.         |Extremely low latency (as low as sub-ms).<br></br>Rich ONTAP management capabilities such as snapshots, backup, cross-region replication, and cross-zone replication.<br></br>Consistent hybrid cloud experience.         |
|Performance (Per volume)     |Up to 20,000 IOPS, up to 15 GiB/s throughput.         |Up to 100,000 IOPS, up to 10 GiB/s throughput.         |Up to 460,000 IOPS, up to 4.5 GiB/s throughput per regular volume, up to 10 GiB/s throughput per large volume.         |
|Scale     | Up to 5 PiB for a single volume. <br></br> Up to 190.7 TiB for a single blob.<br></br>No minimum capacity requirements.         |Up to 100 TiB for a single file share.<br></br>Up to 4 TiB for a single file.<br></br>100 GiB min capacity.         |Up to 100 TiB for a single regular volume, up to 500 TiB for a large volume.<br></br>Up to 16 TiB for a single file.<br></br>Consistent hybrid cloud experience.         |
|Pricing     |[Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/)         |[Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/)         |[Azure NetApp Files pricing](https://azure.microsoft.com/pricing/details/netapp/)         |

## Next steps

- To access Blob storage with NFS, see [Network File System (NFS) 3.0 protocol support in Azure Blob Storage](../blobs/network-file-system-protocol-support.md).
- To access Azure Files with NFS, see [NFS file shares in Azure Files](../files/files-nfs-protocol.md).
- To access Azure NetApp Files with NFS, see [Quickstart: Set up Azure NetApp Files and create an NFS volume](../../azure-netapp-files/azure-netapp-files-quickstart-set-up-account-create-volumes.md).
