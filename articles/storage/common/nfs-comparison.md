---
title: SMB file shares in Azure Files
description: Learn about file shares hosted in Azure Files using the Server Message Block (SMB) protocol.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 06/06/2021
ms.author: rogarana
ms.subservice: files
---

# Access Azure resources with NFS


|Category  |Azure Blobs  |Azure Files  |Azure NetApp Files  |
|---------|---------|---------|---------|
|Use cases     |Blob Storage is best suited for large scale read-heavy sequential access workloads where data is ingested once and minimally modified further. It offers the lowest total cost of ownership, if there is little or no maintenance. Some example scenarios are: Large scale analytical data, throughput sensitive high-performance computing, backup and archive, autonomous driving, media rendering, or genomic sequencing.         |Azure Files is a highly available service best suited for random access workloads. It provides full POSIX file system support and can easily be used from container platforms like Azure Container Instance (ACI) and Azure Kubernetes Service (AKS) with the built-in CSI driver, in addition to VM-based platforms. Some example scenarios are: Shared files, databases, home directories, traditional applications, ERP, CMS, NAS migrations that don't require advanced management, and custom applications requiring scale-out file storage.         |Fully managed file service in the cloud, powered by NetApp, with advanced management capabilities. It's well suited for workloads that require random access and provides broad protocol support and data protection capabilities. Some examples are: On-premises enterprise NAS migration that require rich management capabilities, latency sensitive workloads like SAP HANA, latency-sensitive or IOPS intensive high performance compute, or workloads that require simultaneous multi-protocol access.         |
|Protocol interoperability     |Supports NFS 3.0, REST, and ADLS Gen2         |Supports SMB or NFS 4.1 (no interoperability between either protocol)         |Supports NFS 3.0, 4.1, and SMB         |
|Key features     | Intergated with HPC cace for low latency workloads. <br> </br> Integrated management, including lifecycle, immutable blobs, data failover, and metadata index.         | Zonally redundant for high availability. <br></br> Consistent single-digit millisecond latency. <br></br>Predictable performance and cost that scales with capacity.         |Extremely low latency (as low as sub-ms).<br></br>Rich NetApp ONTAP management capability (FlexClones*, SnapMirror*) in cloud.<br></br>Consistent hybrid cloud experience.         |
|Performance (Per volume)     |Up to 20,000 IOPS, up to 100 GiB/s throughput.         |Up to 100,000 IOPS, up to 80 Gib/s throughput.         |Up to 460,000 IOPS, up to 36 Gib/s throughput.         |
|Scale     | Up to 2 PB for a single volume. <br></br> Up to ~4.75 TiB max for a single file.<br></br>No minimum capacity requirements.         |Up to 100 TiB for a single file share.<br></br>Up to 4 TiB for a single file.<br></br>100 GiB min capacity.         |Up to 100 TB for a single volume.<br></br>Up to 16 TiB for a single file.<br></br>Consistent hybrid cloud experience.         |
|Row6     |         |         |         |


