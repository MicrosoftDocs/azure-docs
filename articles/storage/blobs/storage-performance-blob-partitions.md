---
title: Optimize blob partitions (Azure Blob Storage)
titleSuffix: Azure Storage
description: Improve Azure Blob Storage performance for small block uploads by using efficient blob naming schemes.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.topic: concept-article
ms.date: 11/19/2025
ms.author: normesta
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
# Customer intent: As a developer, I want to understand how blob naming schemes affect partition performance when uploading small blocks to Azure Blob Storage and implement efficient naming strategies for optimal load distribution.
---

# Optimize blob partitions

If your clients upload data by using _small_ block sizes, you can improve performance by choosing an efficient naming scheme. A _small_ block size is less than 256 KiB. Larger blocks aren't affected by partition naming.

## Partition keys and efficient naming schemes

The partition key for a blob is account name + container name + blob name. The partition key is used to partition data into ranges and these ranges are load-balanced across the system.

To help the system partition data more efficiently, avoid sequential naming schemes such as `log20160101`, `log20160102`, `log20160103`. These schemes concentrate traffic on one server, which can exceed scalability targets and cause latency issues. 

Instead, add a hash character sequence (such as three digits) as early as possible in the partition key of a blob. If you plan to use timestamps in names, consider adding a seconds value to the beginning of that timestamp (for example: `ssyyyymmdd`).

If you use timestamps or numerical identifiers, avoid append-only or prepend-only patterns. These patterns route all traffic to a single partition which prevents load balancing. However, if you plan to use these patterns, consider splitting data into multiple blobs. Apply a hash prefix to each blob that represents a time interval such as seconds (`ss`) or minutes (`mm`). That way traffic isn't repeatedly directed to a single blob on a single partition server which could exceed scalability limits.

## Next steps

- [Performance checklist for Azure Blob Storage](storage-performance-checklist.md)
- [Scalability and performance targets for Blob storage](scalability-targets.md)
- [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md?toc=/azure/storage/blobs/toc.json)

