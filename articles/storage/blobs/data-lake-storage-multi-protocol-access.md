---
title: Multi-protocol access on Azure Data Lake Storage
titleSuffix: Azure Storage
description: Use Blob APIs and applications that use Blob APIs with Azure Data Lake Storage.
author: normesta

ms.service: azure-data-lake-storage
ms.topic: concept-article
ms.date: 07/09/2026
ms.author: normesta
# Customer intent: As a data engineer, I want to utilize Blob APIs with Azure Data Lake Storage, so that I can streamline data management and leverage existing tools without the need for modifications.
---

# Multi-protocol access on Azure Data Lake Storage

Blob APIs work with accounts that have a hierarchical namespace (a file system structure that organizes blob data into directories and files). This support unlocks the ecosystem of tools, applications, and services, as well as several Blob storage features for accounts that have a hierarchical namespace.

Multi-protocol access on Data Lake Storage lets you use the full ecosystem of tools and applications, including third-party ones. You can point these tools and applications to accounts that have a hierarchical namespace without modifying them. These applications work *as is* even if they call Blob APIs, because Blob APIs operate on data in accounts that have a hierarchical namespace.

Blob storage features such as [diagnostic logging](../common/storage-analytics-logging.md), [access tiers](access-tiers-overview.md), and [Blob storage lifecycle management policies](./lifecycle-management-overview.md) work with accounts that have a hierarchical namespace. Therefore, you can enable hierarchical namespaces on your Blob storage accounts without losing access to these important features.

> [!NOTE]
> These articles summarize the current support for Blob storage features and Azure service integrations.
>
> [Blob Storage feature support in Azure Storage accounts](storage-feature-support-in-storage-accounts.md)
>
> [Azure services that support Azure Data Lake Storage](data-lake-storage-supported-azure-services.md)

## How multi-protocol access on Data Lake Storage works

Blob APIs and Data Lake Storage APIs can operate on the same data in storage accounts that have a hierarchical namespace. Data Lake Storage routes Blob APIs through the hierarchical namespace, giving you first-class directory operations and POSIX-compliant access control lists (ACLs).

:::image type="content" source="./media/data-lake-storage-interop/interop-concept.png" alt-text="Diagram showing how Blob APIs and Data Lake Storage APIs route through the hierarchical namespace to access the same data in a storage account.":::

Existing tools and applications that use Blob APIs automatically gain these benefits. Developers don't need to modify them. Data Lake Storage consistently applies directory and file-level ACLs regardless of the protocol that tools and applications use to access the data.

## See also

- [Blob Storage feature support in Azure Storage accounts](storage-feature-support-in-storage-accounts.md)
- [Azure services that support Azure Data Lake Storage](data-lake-storage-supported-azure-services.md)
- [Open source platforms that support Azure Data Lake Storage](data-lake-storage-supported-open-source-platforms.md)
- [Known issues with Azure Data Lake Storage](data-lake-storage-known-issues.md)
