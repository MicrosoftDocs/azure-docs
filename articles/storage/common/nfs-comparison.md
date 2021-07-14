---
title: Compare NFS access to Azure Files, Blob Storage, and Azure NetApp Files
description: Compare NFS access for Azure Files, Azure Blob Storage, and Azure NetApp Files.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 06/21/2021
ms.author: rogarana
---

# Compare access to Azure Files, Blob Storage, and Azure NetApp Files with NFS

This article provides a comparison between each of these offerings if you access them through the [Network File System (NFS)](https://en.wikipedia.org/wiki/Network_File_System) protocol. This comparison doesn't apply if you access them through any other method.

For more general comparisons, see the [this article](storage-introduction.md) to compare Azure Blob Storage and Azure Files, or [this article](../files/storage-files-netapp-comparison.md) to compare Azure Files and Azure NetApp Files.

## Comparison

|Category  |Azure Blob Storage  |Azure Files  |Azure NetApp Files  |
|---------|---------|---------|---------|
|Use cases     |Blob Storage is best suited for large scale read-heavy sequential access workloads where data is ingested once and minimally modified further.<br></br>Blob Storage offers the lowest total cost of ownership, if there is little or no maintenance.<br></br>Some example scenarios are: Large scale analytical data, throughput sensitive high-performance computing, backup and archive, autonomous driving, media rendering, or genomic sequencing.         |Azure Files is a highly available service best suited for random access workloads.<br></br>For NFS shares, Azure Files provides full POSIX file system support and can easily be used from container platforms like Azure Container Instance (ACI) and Azure Kubernetes Service (AKS) with the built-in CSI driver, in addition to VM-based platforms.<br></br>Some example scenarios are: Shared files, databases, home directories, traditional applications, ERP, CMS, NAS migrations that don't require advanced management, and custom applications requiring scale-out file storage.         |Fully managed file service in the cloud, powered by NetApp, with advanced management capabilities.<br></br>NetApp Files is suited for workloads that require random access and provides broad protocol support and data protection capabilities.<br></br>Some example scenarios are: On-premises enterprise NAS migration that requires rich management capabilities, latency sensitive workloads like SAP HANA, latency-sensitive or IOPS intensive high performance compute, or workloads that require simultaneous multi-protocol access.         |
|Available protocols     |NFS 3.0<br></br>REST<br></br>Data Lake Storage Gen2         |SMB<br><br>NFS 4.1 (preview)<br></br> (No interoperability between either protocol)         |NFS 3.0 and 4.1<br></br>SMB         |
|Key features     | Integrated with HPC cache for low latency workloads. <br> </br> Integrated management, including lifecycle, immutable blobs, data failover, and metadata index.         | Zonally redundant for high availability. <br></br> Consistent single-digit millisecond latency. <br></br>Predictable performance and cost that scales with capacity.         |Extremely low latency (as low as sub-ms).<br></br>Rich NetApp ONTAP management capability such as SnapMirror in cloud.<br></br>Consistent hybrid cloud experience.         |
|Performance (Per volume)     |Up to 20,000 IOPS, up to 100 GiB/s throughput.         |Up to 100,000 IOPS, up to 80 Gib/s throughput.         |Up to 460,000 IOPS, up to 36 Gib/s throughput.         |
|Scale     | Up to 2 PiB for a single volume. <br></br> Up to ~4.75 TiB max for a single file.<br></br>No minimum capacity requirements.         |Up to 100 TiB for a single file share.<br></br>Up to 4 TiB for a single file.<br></br>100 GiB min capacity.         |Up to 100 TiB for a single volume.<br></br>Up to 16 TiB for a single file.<br></br>Consistent hybrid cloud experience.         |
|Pricing     |[Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/)         |[Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/)         |[Azure NetApp Files pricing](https://azure.microsoft.com/pricing/details/netapp/)         |


## Next steps

- To access Blob storage with NFS, see [Network File System (NFS) 3.0 protocol support in Azure Blob Storage (preview)](../blobs/network-file-system-protocol-support.md).
- To access Azure Files with NFS, see [NFS file shares in Azure Files](../files/files-nfs-protocol.md).
- To access Azure NetApp Files with NFS, see [Quickstart: Set up Azure NetApp Files and create an NFS volume](../../azure-netapp-files/azure-netapp-files-quickstart-set-up-account-create-volumes.md).
