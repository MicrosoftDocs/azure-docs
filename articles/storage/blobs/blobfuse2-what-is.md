---
title: What is BlobFuse? - BlobFuse
titleSuffix: Azure Storage
description: An overview of how to use BlobFuse to mount an Azure Blob Storage container through the Linux file system.
author: normesta
ms.author: normesta

ms.service: azure-blob-storage
ms.topic: feature-guide
ms.date: 1/29/2026
ms.custom: linux-related-content
# Customer intent: "As a developer or system administrator working with Linux, I want to understand what BlobFuse is and how it works, so that I can evaluate whether it meets my needs for accessing Azure Blob Storage through familiar file system operations for workloads like AI/ML training, HPC simulations, or cloud-native applications."
---

# What is BlobFuse?

BlobFuse is an open-source virtual file system driver that enables seamless integration of Azure Blob Storage with Linux environments. By using BlobFuse, you can mount Azure Storage account containers as a file system, making blob data accessible through standard Linux file operations. BlobFuse translates these operations into Azure Blob REST API calls, so your applications can leverage the scalability and durability of Azure Blob Storage.

BlobFuse provides several caching mechanisms, including file, metadata, and attribute caching, to enhance performance and minimize network traffic charges. You can configure the cache location, size, and retention policies for optimal performance.

The BlobFuse project is [licensed under the MIT license](https://github.com/Azure/azure-storage-fuse/blob/main/LICENSE).

> [!NOTE]
> BlobFuse v2 is the latest version of BlobFuse and has many significant improvements over BlobFuse v1. [BlobFuse v1](storage-how-to-mount-container-linux.md) support ends in September 2026. Migrate to BlobFuse v2 by using the provided [instructions](https://github.com/Azure/azure-storage-fuse/blob/main/MIGRATION.md).

## Key use cases

By translating file system calls into Azure Blob REST API calls, BlobFuse provides a practical bridge between your file-based workloads and the massive scale and cost-efficiency of Azure Blob Storage. Example use cases include:

- **Model training and checkpointing for AI and machine learning (ML)**. BlobFuse boosts AI/ML workflows by providing fast access to multi-petabyte datasets in Azure Blob Storage through intelligent caching. It enables compute nodes (virtual machines), containers, and Azure Kubernetes Service (AKS) pods to efficiently load training data and save model checkpoints. Preloading data with BlobFuse ensures quick access before training starts, helping to optimize GPU usage. BlobFuse is validated with distributed ML frameworks such as **PyTorch and Ray**, providing greater workflow portability.

- **High-Performance Computing (HPC)**. BlobFuse enables rapid, scalable access to Azure Blob Storage in HPC settings, efficiently processing data across domains such as:

  - Autonomous driving workloads (ADAS) that use AKS. These workloads leverage BlobFuse for large-scale simulation and model training data.

  - Hydrofoil simulations. BlobFuse manages computational files and results for streamlined engineering analysis.

  - Genomics sequencing. BlobFuse handles large datasets and accelerates data sharing.

  - Gaming simulations that rely on quick data access. BlobFuse boosts parallel processing and scales to support complex scenarios.

- **Cloud-Native Workload Integration**. You can use BlobFuse as a persistent storage layer for containers and stateful workloads in Kubernetes through the CSI driver. It allows applications to share large files, model weights, or logs using Azure Blob Storage's scalable capacity. BlobFuse is well-suited for read-write or read-only access modes in shared cluster scenarios.

- **Big Data Analytics and AI training data preprocessing**. BlobFuse enhances analytics workloads by integrating with tools like Hadoop and Spark for efficient data storage and retrieval. BlobFuse is also useful for preprocessing blob data for AI tasks such as data cleaning, validation, and transformation.

- **Data backup and archiving**. BlobFuse streamlines the backup and archiving of large datasets by enabling direct storage in Azure Blob Storage. It supports major backup tasks, such as Oracle Recovery Manager (RMAN) database backups and enterprise system backups. It provides secure, scalable storage for surveillance video data, reducing manual data management overhead.

## Key capabilities

Here are some of the key tasks.

- Mount an Azure Blob Storage container or Azure Data Lake Storage file system on Linux.

  BlobFuse supports storage accounts with either flat namespaces or hierarchical namespaces configured.

- Use basic file system operations such as `mkdir`, `opendir`, `readdir`, `rmdir`, `open`, `read`, `create`, `write`, `close`, `unlink`, `truncate`, `stat`, and `rename`.

- Use local file caching to improve subsequent access times.

- Gain insights into mount activities and resource usage by using the [health monitor](blobfuse2-health-monitor.md).

- Restrict which blobs a mount can see or operate on by using a [blob filter](https://github.com/Azure/azure-storage-fuse/wiki/Blobfuse2%E2%80%90Blob-Filter).

- Download entire containers or subdirectories to the local cache when you mount BlobFuse. See [Optimize performance by preloading data](blobfuse2-configure-caching.md#optimize-performance-by-preloading-data).

## How BlobFuse works

BlobFuse uses the libfuse (fuse3) library to connect with the Linux FUSE kernel module. It performs file system operations by using Azure Storage REST APIs. Through path conventions, it converts Azure Blob Storage object names into a directory-like structure. You can access files as if they reside locally. BlobFuse supports standard operations such as `mkdir`, `opendir`, `readdir`, `rmdir`, `open`, `read`, `create`, `write`, `close`, `unlink`, `truncate`, `stat`, and `rename`. It also supports `chmod` for hierarchical namespace (HNS) accounts.

> [!NOTE]
> BlobFuse doesn't guarantee full POSIX compliance because it translates requests into [Blob REST APIs](/rest/api/storageservices/blob-service-rest-api). For example, rename operations are atomic in POSIX but not in BlobFuse. See [BlobFuse and Linux file systems compared](blobfuse2-compare-linux-file-system.md).

BlobFuse has two operating modes: _caching_ (file cache) and _streaming_ (block cache).

In _caching_ mode, BlobFuse downloads the entire file from Azure Blob Storage into a local cache directory before making it available to the application. All subsequent reads and writes operate on this local cache until the file is evicted or invalidated. When you create or modify a file, closing the file handle triggers the upload of the file to the storage container. This mode works well for workloads that repeatedly access files or work with datasets that fit on the local disk.

In _streaming_ mode, BlobFuse streams data in chunks (blocks) and serves it as it downloads. This mode is designed for workloads that involve large files, such as AI/ML training datasets, genomic sequencing, and HPC simulations.

## Next steps

- [Install BlobFuse](blobfuse2-install.md)
- [Mount an Azure Blob Storage container on Linux with BlobFuse](blobfuse2-mount-container.md)

## See also

- [BlobFuse performance page](https://azure.github.io/azure-storage-fuse/)
- [Limitations and known issues with BlobFuse](blobfuse2-known-issues.md)
- [Troubleshoot issues in BlobFuse](blobfuse2-troubleshooting.md)
- [BlobFuse frequently asked questions](blobfuse2-faq.yml)
