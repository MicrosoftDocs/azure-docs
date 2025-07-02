---
title: "High-Performance Computing (HPC) workload best practices and storage options"
description: A comprehensive guide to choosing a storage solution best suited to your HPC workloads.
author: christinechen2
ms.author: padmalathas
ms.reviewer: normesta
ms.date: 06/25/2025
ms.service: azure-virtual-machines
ms.subservice: hpc
ms.topic: concept-article
# Customer intent: "As a Cloud architect, HPC administrator, I want to evaluate and select the most suitable Azure HPC storage solution based on performance, scalability, protocol support, and workload alignment for AI, HPC, and data-intensive applications."
---

# High-performance computing (HPC) workload best practices and storage options guide

<!-- [!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)] -->

This guide provides best practices, guidelines, a detailed comparison and technical specifications of storage solutions that is best suited to your HPC workload on Azure VMs. It includes performance metrics, protocol support, cost tiers, and use case alignment for each storage type. There's typically a trade-off between optimizing for costs and optimizing for performance. If your workload is less demanding, you might not require every recommended optimization. Consider your performance needs, costs, and workload patterns as you evaluate these recommendations.

## Overview

Storage for HPC workloads consists of core storage and in some cases, an accelerator. Core storage acts as the permanent home for your data. It contains rich data management features and is durable, available, scalable, elastic, and secure. An accelerator enhances core storage by providing high-performance data access. An accelerator can be provisioned on demand and gives your computational workload much faster access to data.

## Storage Services Comparison

| Feature        | Standard Blob | Premium Blob | Premium Files | Azure NetApp Files | Azure Managed Lustre |
|----------------|---------------|--------------|----------------|---------------------|-----------------------|
| **Capacity**   | 20+ PiB       | 20+ PiB      | 100 TiB        | 500 TiB             | 1 PiB                 |
| **Bandwidth**  | 15 GB/s       | 15 GB/s      | 10 GB/s        | 10 GiB/s            | Up to 512 GB/s        |
| **IOPS**       | 20,000        | 20,000       | 100,000        | 800,000             | >100,000              |
| **Latency**    | <100 ms       | <10 ms       | 2–4 ms         | <1 ms               | <2 ms                 |
| **Protocols**  | REST, HDFS, NFSv3, SFTP, FUSE, CSI | Same | REST, NFSv4.1, SMB3, CSI | NFSv3/4.1, SMB3, CSI | Lustre, CSI |

## Initial consideration

If you are starting from scratch, see [Understand data store models](/azure/architecture/guide/technology-choices/data-store-overview) to choose a data store and [Choose an Azure storage service](/azure/architecture/guide/technology-choices/storage-options) or [Introduction to Azure Storage](/azure/storage/common/storage-introduction) to get an idea of your storage service options. 

## At a glance

Start with the amount of data that you plan to store. Then, consider the number of CPU cores used by your workload and the size of your files. These factors help you to narrow down which core storage service best suits your workload and whether to use an accelerator to enhance performance.

|Configuration  |CPU cores  |Sizes of files  |Core Storage Recommendation  |Accelerator Recommendation  |
|---------|---------|---------|---------|---------|
|Under 50 TiB     |N/A |N/A        | [Azure Files](/azure/storage/files/) or [Azure NetApp Files](/azure/azure-netapp-files/).        |No accelerator  |
|50 TiB - 5,000 TiB |Less than 500 |N/A|[Azure Files](/azure/storage/files/) or [Azure NetApp Files](/azure/azure-netapp-files/).        |No accelerator  |
|50 TiB - 5,000 TiB |Over 500      |1 MiB and larger| [Azure Standard Blob](/azure/storage/blobs/). It’s supported by all accelerators, supports many protocols, and is cost-effective. | [Azure Managed Lustre](/azure/azure-managed-lustre/).    |
|50 TiB - 5,000 TiB |Over 500      |Smaller than 1 MiB| [Azure Premium Blob](/azure/storage/blobs/storage-blob-block-blob-premium) or [Azure Standard Blob](/azure/storage/blobs/). | [Azure Managed Lustre](/azure/azure-managed-lustre/).     |
|50 TiB - 5,000 TiB |Over 500      |Smaller than 512 KiB| [Azure NetApp Files](/azure/azure-netapp-files/).    |No accelerator  |
|Over 5,000 TiB |N/A      |N/A|    |Talk to your field or account team.   |
<!---|     |[Use ZRS disks when sharing disks between VMs](#use-zrs-disks-when-sharing-disks-between-vms).         |Prevents a shared disk from becoming a single point of failure.         | --->

---

## Solution details

If you are still stuck between options after using the decision trees, here are more details for each solution:

|Solution |Optimal Performance & Scale |Data Access (Access Protocol) |Billing Model |Core Storage or Accelerator |
|---|---|---|---|---|
| [**Azure Standard Blob**](/azure/storage/blobs/) | * Good for large file, bandwidth-intensive workloads.<br> * Designed for unstructured data. <br> * Supports high-throughput workloads. | * Good for traditional (file) and cloud-native (REST) HPC apps. <br>* Easy to access, share, manage datasets.<br> * Works with all accelerators. | Pay for what you use. | Core Storage. |
| [**Azure Premium Blob**](/azure/storage/blobs/storage-blob-block-blob-premium) | * IOPS and latency better than Standard Blob. <br> * Good for datasets with many medium-sized files and mixed file sizes.  | Good for traditional (file) and cloud-native (REST) HPC apps. <br> Easy to access, share, manage datasets. <br> Works with all accelerators.| Pay for what you use. | Core Storage. |
| [**Azure Premium Files**](/azure/storage/files/) | * Capacity and bandwidth suited for smaller scale (<1k cores). <br> * IOPS and latency good for medium sized files (>512 KiB). <br> * Offers premium (low latency, high IOPS) SKUs. <br> * Hybrid access via Azure File Sync. | Easy integration with Linux (NFS) and Windows (SMB), but can't use both NFS+SMB to access the same data. | Pay for what you provision. | Core Storage. |
| [**Azure NetApp Files**](/azure/azure-netapp-files/) | * Capacity and bandwidth good for midrange jobs (1k-10k cores). <br> * IOPS and latency good for small-file datasets (<512 KiB). <br> * Excellent for small, many-file workloads. <br> * Enterprise-grade file storage with ONTAP technology. <br> * Dynamic performance scaling across Standard, Premium, Ultra tiers. | Easy to integrate for Linux and Windows, supports multiprotocol for workflows using both Linux + Windows. | Pay what you provision. | Either. |
| [**Azure Managed Lustre**](/azure/azure-managed-lustre/) | Bandwidth to support all job sizes (1k - >10k cores). <br> * IOPS and latency good for thousands of medium-sized files (>512 KiB). <br> * Best for bandwidth-intensive read and write workloads. <br> * Parallel file system optimized for HPC/AI.<br> * Seamless integration with Azure Blob for tiered storage. | Lustre, CSI. | Pay for what you provision. | Durable enough to run as standalone (core) storage, most cost-effective as an accelerator. |

---

## Specialized Storage Solutions
Azure offers a range of storage services tailored to meet the demanding needs of HPC workloads. Each solution is optimized for different performance characteristics, access patterns, and cost profiles. Following is an overview of the most relevant storage options and what they are best suited for in HPC scenarios.

| Storage Solution | Use Cases   | Performance Benchmarks   | Scalability Options  | Integration with Other Azure Services |
|------|------|-----|-----|-----|
| Azure Blob Storage  |  * Data Analytics <br> * Content Distribution <br>  * Backup and Archival | Throughput up to 30GB/s with BlobFuse2  | * Storage Accounts up to 5 PiB per account <br>  * Unlimited number of containers per account | * Azure AI <br>* AKS <br> * Azure Data Lake |
||||||
| Azure Files  | * DevOps <br> * Backups <br> * Remote Work | Encryption in Transit (TLS 1.3 for NFS shares) | * File Shares up to 100 TiB per share (Standard) <br> * IOPS up to 100,000 (Premium)  | * Azure Backup <br>  * Azure Monitor <br> * Microsoft Entra ID |
||||||
| Azure NetApp Files  | * Databases <br> * VDI <br> * HPC  | IOPS and Throughput measured using FIO | * Capacity Pools up to 100 TiB per pool <br> * Volumes up to 100 TiB per volume | * AKS <br> * Azure Backup <br> * Azure Monitor |
||||||
| Azure Managed Lustre   | * Large-scale simulations <br> * Genomics <br> * Scientific Workloads | Throughput up to 30GB/s with the 250MB/s/TiB performance tier | * File Systems up to 1.5 PB capacity<br> * Throughput up to 375 GB/s | * Azure Blob Storage <br> * AKS <br> * Azure Monitor  |
||||||

---

## AI and RAG Workload Storage Requirements

The storage requirements for AI and RAG workloads vary across different stages. During the training stage, it is essential to have high throughput, checkpointing, local caching, and the ability to load large models. For the inference stage, fast model access, low latency, and concurrent GPU access are required. In the RAG stage, secure unstructured storage, vector database integration, freshness, and low latency are necessary.

---

## Partner Solutions

| Partner           | Protocols           | Scale         | Unique Features                                      |
|-------------------|---------------------|---------------|------------------------------------------------------|
| Qumulo            | NFS, SMB, S3        | 200 PiB       | Azure-native SaaS, global namespace, cost-effective  |
| Dell APEX         | NFS, SMB, S3, HDFS  | 5.6 PiB       | On-prem parity, policy-based tiering                 |
| Nasuni            | NFS, SMB, S3        | —             | File locking, blob as primary tier                   |
| Hammerspace       | NFS, SMB, S3, pNFS  | —             | Global namespace, caching alternative                |
| Weka              | NFS, SMB, S3        | 14 EB         | High IOPS, low latency, linear scale-out             |
| IBM SpectrumScale | GPFS, NFS, SMB      | —             | Full GPFS stack                                      |
| DDN Exascaler     | Lustre, NFS, SMB    | Petabytes     | Full DDN Lustre stack                                |

---

## Performance Optimization Tips
- Size volumes based on performance, not just capacity.
- Use Availability Zones to control latency.
- Use large volume features in ANF for max bandwidth.
- Consider caching and tiering strategies for cost efficiency.

## Core storage price comparison

In order of most to least expensive, the core storage option prices are: 
- Azure NetApp Files
- Azure Premium Blob and Azure Premium Files
- Azure Standard Blob

For more info on the pricing, see [Azure product pricing](https://azure.microsoft.com/pricing/#product-pricing).
