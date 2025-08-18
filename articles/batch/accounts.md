---
title: Batch accounts and Azure Storage accounts
description: Learn about Azure Batch accounts and how they're used from a development standpoint.
ms.topic: concept-article
ms.date: 04/02/2025

# Customer intent: As a cloud developer, I want to understand how to create and associate Batch accounts with Azure Storage accounts, so that I can efficiently manage and store resource files for my parallel processing workloads.
---
# Batch accounts and Azure Storage accounts

An Azure Batch account is a uniquely identified entity within the Batch service. Many Batch solutions use [Azure Storage](../storage/index.yml) for storing resource files and output files, so each Batch account can be optionally associated with a corresponding storage account.

## Batch accounts

All processing and resources such as tasks, job and batch pool are associated with a Batch account. When your application makes a request against the Batch service, it authenticates the request using the Azure Batch account name and the account URL. Additionally, it can use either an access key or a Microsoft Entra token.

You can run multiple Batch workloads in a single Batch account. You can also distribute your workloads among Batch accounts that are in the same subscription but located in different Azure regions.

You can create a Batch account using the [Azure portal](batch-account-create-portal.md) or programmatically, such as with the [Batch Management .NET library](batch-management-dotnet.md). When creating the account, you can associate an Azure storage account for storing job-related input and output data or applications.

[!INCLUDE [batch-account-mode-include](../../includes/batch-account-mode-include.md)]


## Azure Storage accounts

Most Batch solutions use Azure Storage for storing [resource files](resource-files.md) and output files. For example, your Batch tasks (including standard tasks, start tasks, job preparation tasks, and job release tasks) typically specify resource files that reside in a storage account. Storage accounts also stores that data that is processed and any output data that is generated.

Batch supports the following types of Azure Storage accounts:

- General-purpose v2 (GPv2) accounts
- General-purpose v1 (GPv1) accounts
- Blob storage accounts (currently supported for pools in the Virtual Machine configuration)

> [!IMPORTANT]
> You can't use the [Application Packages](batch-application-packages.md) or [Azure storage-based virtual file system mount](virtual-file-mount.md) features with Azure Storage accounts configured with [firewall rules](../storage/common/storage-network-security.md), or with **Hierarchical namespace** set to **Enabled**.

For more information about storage accounts, see [Azure storage account overview](../storage/common/storage-account-overview.md).

You can associate a storage account with your Batch account when you create the Batch account, or later. Consider your cost and performance requirements when choosing a storage account. For example, the GPv2 and blob storage account options support greater [capacity and scalability limits](https://azure.microsoft.com/blog/announcing-larger-higher-scale-storage-accounts/) compared with GPv1. (Contact Azure Support to request an increase in a storage limit.) These account options can improve the performance of Batch solutions that contain a large number of parallel tasks that read from or write to the storage account.

When a storage account is linked to a Batch account, it becomes the *autostorage account*. An autostorage account is necessary if you intend to use the [application packages](batch-application-packages.md) capability, as it stores the application package .zip files. It can also be used for [task resource files](resource-files.md#storage-container-name-autostorage). Linking Batch accounts to autostorage can avoid the need for shared access signature (SAS) URLs to access the resource files.

> [!NOTE]
> Batch nodes automatically unzip application package .zip files when they are pulled down from a linked storage account. This can cause the compute node local storage to fill up. For more information, see [Manage Batch application package](/cli/azure/batch/application/package).

## Next steps

- Learn about [Nodes and pools](nodes-and-pools.md).
- Learn how to create and manage Batch accounts using the [Azure portal](batch-account-create-portal.md) or [Batch Management .NET](batch-management-dotnet.md).
- Learn how to use [private endpoints](private-connectivity.md) with Azure Batch accounts.
