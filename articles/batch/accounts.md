---
title: Batch accounts and Azure Storage accounts
description: Learn about Azure Batch accounts and how they are used from a development standpoint.
ms.topic: conceptual
ms.date: 05/12/2020

---
# Batch accounts and Azure Storage accounts

An Azure Batch account is a uniquely identified entity within the Batch service. Most Batch solutions use [Azure Storage](../storage/index.yml) for storing resource files and output files, so each Batch account is usually associated with a corresponding storage account.

## Batch accounts

All processing and resources are associated with a Batch account. When your application makes a request against the Batch service, it authenticates the request using the Azure Batch account name, the URL of the account, and either an access key or an Azure Active Directory token.

You can run multiple Batch workloads in a single Batch account. You can also distribute your workloads among Batch accounts that are in the same subscription but located in different Azure regions.

[!INCLUDE [batch-account-mode-include](../../includes/batch-account-mode-include.md)]

You can create a Batch account using the [Azure portal](batch-account-create-portal.md) or programmatically, such as with the [Batch Management .NET library](batch-management-dotnet.md). When creating the account, you can associate an Azure storage account for storing job-related input and output data or applications.

## Azure Storage accounts

Most Batch solutions use Azure Storage for storing resource files and output files. For example, your Batch tasks (including standard tasks, start tasks, job preparation tasks, and job release tasks) typically specify resource files that reside in a storage account. Storage accounts also stores that data that is processed and any output data that is generated.

Batch supports the following types of Azure Storage accounts:

- General-purpose v2 (GPv2) accounts
- General-purpose v1 (GPv1) accounts
- Blob storage accounts (currently supported for pools in the Virtual Machine configuration)

For more information about storage accounts, see [Azure storage account overview](../storage/common/storage-account-overview.md).

You can associate a storage account with your Batch account when you create the Batch account, or later. Consider your cost and performance requirements when choosing a storage account. For example, the GPv2 and blob storage account options support greater [capacity and scalability limits](https://azure.microsoft.com/blog/announcing-larger-higher-scale-storage-accounts/) compared with GPv1. (Contact Azure Support to request an increase in a storage limit.) These account options can improve the performance of Batch solutions that contain a large number of parallel tasks that read from or write to the storage account.

## Next steps

- Learn about [Nodes and pools](nodes-and-pools.md).
- Learn how to create a Batch account using the [Azure portal](batch-account-create-portal.md).
