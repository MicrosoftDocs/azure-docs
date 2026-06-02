---
title: Azure Data Lake Storage Hierarchical Namespace
titleSuffix: Azure Storage
description: Learn how Azure Data Lake Storage hierarchical namespace improves directory operations, speeds analytics workloads, and lowers TCO. Find out when to enable it.
author: normesta

ms.service: azure-data-lake-storage
ms.topic: concept-article
ms.date: 05/26/2026
ms.author: normesta
ms.reviewer: jamesbak
# Customer intent: As a data engineer, I want to enable a hierarchical namespace in Azure Data Lake Storage, so that I can optimize directory manipulation and improve the efficiency of my analytics workloads while reducing overall total cost of ownership (TCO).
---

# Azure Data Lake Storage hierarchical namespace

A key mechanism that allows Azure Data Lake Storage to provide file system performance at object storage scale and prices is the addition of a **hierarchical namespace**. This feature organizes the collection of objects and files within an account into a hierarchy of directories and nested subdirectories, similar to the file system on your computer. When you enable a hierarchical namespace, a storage account can offer the scalability and cost-effectiveness of object storage, along with file system semantics that analytics engines and frameworks find familiar.

## The benefits of a hierarchical namespace

File systems that implement a hierarchical namespace over blob data offer the following benefits:

- **Atomic directory manipulation:** Object stores approximate a directory hierarchy by adopting a convention of embedding slashes (/) in the object name to denote path segments. While this convention works for organizing objects, it provides no assistance for actions like moving, renaming, or deleting directories. Without real directories, applications must process potentially millions of individual blobs to achieve directory-level tasks. By contrast, a hierarchical namespace processes these tasks by updating a single entry (the parent directory).

    This optimization is especially significant for many big data analytics frameworks. Tools like Hive and Spark often write output to temporary locations and then rename the location at the conclusion of the job. Without a hierarchical namespace, this rename operation can often take longer than the analytics process itself. Lower job latency equals lower total cost of ownership (TCO) for analytics workloads.

- **Familiar interface style:** Developers and users alike understand file systems. When you move to the cloud, you don't need to learn a new storage paradigm because Data Lake Storage exposes the same file system interface that's used by computers, large and small.

One of the reasons that object stores historically didn't support a hierarchical namespace is that a hierarchical namespace limits scale. However, the Data Lake Storage hierarchical namespace scales linearly and doesn't degrade either the data capacity or performance.

## Decide whether to enable a hierarchical namespace

After you enable a hierarchical namespace on your account, you can't revert it back to a flat namespace. Therefore, consider whether it makes sense to enable a hierarchical namespace based on the nature of your object store workloads. To evaluate the impact of enabling a hierarchical namespace on workloads, applications, costs, service integrations, tools, features, and documentation, see [Upgrading Azure Blob Storage with Azure Data Lake Storage capabilities](upgrade-to-data-lake-storage-gen2.md).

Some workloads might not gain any benefit by enabling a hierarchical namespace. Examples include backups, image storage, and other applications where object organization is stored separately from the objects themselves (for example: in a separate database).

Also, while support for Blob storage features and the Azure service ecosystem continues to grow, some features and Azure services aren't yet supported in accounts that have a hierarchical namespace. See [Known Issues](data-lake-storage-known-issues.md).

In general, turn on a hierarchical namespace for storage workloads that are designed for file systems that manipulate directories. This recommendation includes all workloads that are primarily for analytics processing. Datasets that require a high degree of organization also benefit from enabling a hierarchical namespace.

The reasons for enabling a hierarchical namespace are determined by a TCO analysis. Generally speaking, improvements in workload latency due to storage acceleration require compute resources for less time. Latency for many workloads might improve due to atomic directory manipulation that a hierarchical namespace enables. In many workloads, the compute resource represents more than 85% of the total cost, so even a modest reduction in workload latency equates to a significant amount of TCO savings. Even in cases where enabling a hierarchical namespace increases storage costs, the TCO is still lowered due to reduced compute costs.

To analyze differences in data storage prices, transaction prices, and storage capacity reservation pricing between accounts that have a flat hierarchical namespace versus a hierarchical namespace, see [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/).

## Next steps

- Enable a hierarchical namespace when you create a new storage account. See [Create a storage account to use with Azure Data Lake Storage](create-data-lake-storage-account.md).
- Enable a hierarchical namespace on an existing storage account. See [Upgrade Azure Blob Storage with Azure Data Lake Storage capabilities](upgrade-to-data-lake-storage-gen2-how-to.md).
