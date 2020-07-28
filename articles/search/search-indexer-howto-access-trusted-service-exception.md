---
title: Allow access to storage via trusted service exception
titleSuffix: Azure Cognitive Search
description: How to guide that describes how to setup trusted service exception to access data from storage accounts securely.

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/13/2020
---

# Accessing data in storage accounts securely via trusted service exception

Indexers that access data in storage accounts can make use of the [trusted service exception](https://docs.microsoft.com/azure/storage/common/storage-network-security#exceptions) capability to bypass IP firewall rules. This mechanism offers customers who are unable to grant [indexer access via IP firewall rules](search-indexer-howto-access-ip-restricted.md) a simple, secure and free alternative to access data in storage accounts.

To utilize this capability the indexer's data source must access storage via the search service's system identity.

> [!NOTE]
> Accessing storage account via the system assigned identity of a search service is still in preview. This preview feature is provided without a service level agreement, and is not recommended for production workloads.

## Step 1: Configure connection to the storage account via identity

Follow the details outlined in [the managed identity access guide](search-howto-managed-identities-storage.md) to configure indexers to access storage accounts via the search service's managed identity.

## Step 2: Allow trusted Microsoft services to access the storage account

In the Azure portal, navigate to the "Firewalls and Virtual Networks" tab of the storage account. Ensure that the option "Allow trusted Microsoft services to access this storage account" is checked. This will only permit the specific search service instance with appropriate role based access to the storage account to bypass IP firewall rules.

![Exception](media\search-indexer-howto-secure-access\exception.png "Exception")

Indexers will now be able to access data in the storage account, even if the account is secured via IP firewall rules.

## Next steps

Learn more about Azure Storage indexers:

- [Azure Blob indexer](search-howto-indexing-azure-blob-storage.md)
- [Azure Data Lake Storage Gen2 indexer](search-howto-index-azure-data-lake-storage.md)
- [Azure Table indexer](search-howto-indexing-azure-tables.md)
