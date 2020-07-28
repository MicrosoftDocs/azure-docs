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

Indexers whose data sources use the search service's identity to access storage account data, can utilize the ["trusted service exception"](https://docs.microsoft.com/azure/storage/common/storage-network-security#exceptions) capability offered by Azure storage to bypass IP firewall rules. This mechanism enables customers who are unable to grant [indexer access via IP firewall rules](search-indexer-howto-access-ip-restricted.md) a simple, free alternative to access data in network secured storage accounts.

> [!NOTE]
> Accessing storage account via the system assigned identity of a search service is still in preview. This preview feature is provided without a service level agreement, and is not recommended for production workloads.

## Step 1: Configure connection to the storage account via identity

Follow the details outlined in [this how-to guide](search-howto-managed-identities-storage.md) to set up the indexers to access storage accounts via the search service's identity.

## Step 2: Allow trusted Microsoft services to access the storage account

In the Azure portal, via the "Firewalls and Virtual Networks" tab of the storage account management blade, ensure that the option "Allow trusted Microsoft services to access this storage account" is checked. This will only permit the specific search service instance with appropriate role based access to the storage account to bypass the firewall rules.

![Exception](media\search-indexer-howto-secure-access\exception.png "Exception")

## Next steps

Learn more about Azure Storage indexers:

- [Azure Blob indexer](search-howto-indexing-azure-blob-storage.md)
- [Azure Data Lake Storage Gen2 indexer](search-howto-index-azure-data-lake-storage.md)
- [Azure Table indexer](search-howto-indexing-azure-tables.md)