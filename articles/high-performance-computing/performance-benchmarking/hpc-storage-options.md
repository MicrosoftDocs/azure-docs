---
title: "High-Performance Computing (HPC) storage options"
description: Learn about evaluating the most suitable Azure HPC storage solution for HPC.
author: padmalathas
ms.author: padmalathas
ms.date: 06/25//2025
ms.topic: reference-article
ms.service: azure-virtual-machines
ms.subservice: hpc
# Customer intent: "As a Cloud architect, HPC administrator, I want to evaluate and select the most suitable Azure HPC storage solution based on performance, scalability, protocol support, and workload alignment for AI, HPC, and data-intensive applications."
---

# Overview
This reference article provides a detailed comparison and technical specifications of Azure’s High Performance Computing (HPC) storage solutions. It includes performance metrics, protocol support, cost tiers, and use case alignment for each storage type.

---

## Storage Services Comparison

| Feature        | Standard Blob | Premium Blob | Premium Files | Azure NetApp Files | Azure Managed Lustre |
|----------------|---------------|--------------|----------------|---------------------|-----------------------|
| **Capacity**   | 20+ PiB       | 20+ PiB      | 100 TiB        | 500 TiB             | 1 PiB                 |
| **Bandwidth**  | 15 GB/s       | 15 GB/s      | 10 GB/s        | 10 GiB/s            | Up to 512 GB/s        |
| **IOPS**       | 20,000        | 20,000       | 100,000        | 800,000             | >100,000              |
| **Latency**    | <100 ms       | <10 ms       | 2–4 ms         | <1 ms               | <2 ms                 |
| **Protocols**  | REST, HDFS, NFSv3, SFTP, FUSE, CSI | Same | REST, NFSv4.1, SMB3, CSI | NFSv3/4.1, SMB3, CSI | Lustre, CSI |
| **Cost Tier**  | $             | $$           | $$             | $$$                 | $$$$                  |

---

## Specialized Storage Solutions

Azure offers a range of storage services tailored to meet the demanding needs of HPC workloads. Each solution is optimized for different performance characteristics, access patterns, and cost profiles. Following is an overview of the most relevant storage options and what they are best suited for in HPC scenarios.


### Azure Blob Storage

Azure Blob Storage is a massively scalable object storage service designed for unstructured data. It supports high-throughput workloads and is ideal for storing large volumes of data such as logs, images, videos, and checkpoint files. Blob storage meets the demanding, high-throughput requirements of HPC applications while providing the scale necessary to support storage for billions of data points flowing in from IoT endpoints.

- Durable, available
  * Sixteen nines of designed durability. Choice of durability (LRS, ZRS, GRS, RA-GRS).
  * Geo-replication and flexibility to scale as needed.
  * Built-in data integrity protection (for example, bit rot).
- Scalable, performant
  * In 10 seconds:
    - Processes > 820M transactions
    - Read/Write > 250 TB of data
    - Adds > 15M new objects
  * Allows flexible scale up as needed. 
  * Meets demanding, high-throughput requirements.
  * Stores petabytes of data, cost-effectively with multiple storage tiers.
- Secure, compliant
  * Authentication with Microsoft Entra ID.
  * Flexible auth including, role-based access control (RBAC), and ACLs.
  * Encryption at rest.
  * Advanced threat protection.
- Fully managed
  * End-to-end lifecycle management.
  * Policy-based access control.
  * Immutable (WROM) storage.

### Azure Files
- Fully managed file shares with SMB/NFS support.
- Two SKUs: Standard (general purpose) and Premium (low latency, high IOPS).
- Hybrid access via Azure File Sync.
- Use cases: DevOps, backups, remote work, enterprise apps.

### Azure NetApp Files
- Enterprise-grade file storage with ONTAP technology.
- Tiers: Standard, Premium, Ultra.
- Dynamic performance scaling.
- Ideal for databases, VDI, HPC, and containerized apps.

### Azure Managed Lustre
- Parallel file system optimized for HPC and AI.
- Up to 512 GB/s throughput.
- Seamless integration with Azure Blob for tiered storage.
- Best for large-scale simulations, genomics, and scientific workloads.

---

## AI and RAG Workload Storage Requirements

| Stage       | Requirements                                                                 |
|-------------|------------------------------------------------------------------------------|
| Training    | High throughput, checkpointing, local caching, large model loading           |
| Inference   | Fast model access, low latency, concurrent GPU access                        |
| RAG         | Secure unstructured storage, vector DB integration, freshness, low latency   |

---

## Blobfuse2 – Mounting Blob Storage
- Virtual File System driver for mounting Blob storage.
- Supports file caching and streaming with block-cache.
- High throughput, secure, open-source.
- Ideal for AI training and fine-tuning scenarios.

---

## Partner Solutions

| Partner         | Protocols           | Scale         | Unique Features                                      |
|----------------|---------------------|---------------|------------------------------------------------------|
| Qumulo          | NFS, SMB, S3        | 200 PiB       | Azure-native SaaS, global namespace, cost-effective |
| Dell APEX       | NFS, SMB, S3, HDFS  | 5.6 PiB       | On-prem parity, policy-based tiering                |
| Nasuni          | NFS, SMB, S3        | —             | File locking, blob as primary tier                  |
| Hammerspace     | NFS, SMB, S3, pNFS  | —             | Global namespace, caching alternative               |
| Weka            | NFS, SMB, S3        | 14 EB         | High IOPS, low latency, linear scale-out            |
| IBM SpectrumScale | GPFS, NFS, SMB    | —             | Full GPFS stack                                     |
| DDN Exascaler   | Lustre, NFS, SMB    | Petabytes     | Full DDN Lustre stack                               |

---

## Performance Optimization Tips
- Size volumes based on performance, not just capacity.
- Use Availability Zones to control latency.
- Use large volume features in ANF for max bandwidth.
- Consider caching and tiering strategies for cost efficiency.
