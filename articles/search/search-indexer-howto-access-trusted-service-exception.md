---
title: Indexer access to Azure Storage using trusted service exception
titleSuffix: Azure Cognitive Search
description: Enable data access by an indexer in Azure Cognitive Search to data stored securely in Azure Storage.

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/14/2020
---

# Indexer access to Azure Storage using the trusted service exception (Azure Cognitive Search)

Indexers in an Azure Cognitive Search service that access data in Azure Storage accounts can make use of the [trusted service exception](../storage/common/storage-network-security.md#exceptions) capability to securely access data. This mechanism offers customers who are unable to grant [indexer access using IP firewall rules](search-indexer-howto-access-ip-restricted.md) a simple, secure, and free alternative for accessing data in storage accounts.

> [!NOTE]
> Support for accessing data in storage accounts through a trusted service exception is limited to Azure Blob storage and Azure Data Lake Gen2 storage. Azure Table storage is not supported.

## Step 1: Configure a connection using a managed identity

Follow the instructions in [Set up a connection to an Azure Storage account using a managed identity](search-howto-managed-identities-storage.md). When you are finished, you will have registered your search service with Azure Active Directory as a trusted service, and you will have granted permissions in Azure Storage that gives the search identity specific rights to access data or information.

## Step 2: Allow trusted Microsoft services to access the storage account

In the Azure portal, navigate to the **Firewalls and Virtual Networks** tab of the storage account. Ensure that the option **Allow trusted Microsoft services to access this storage account** is checked. This option will only permit the specific search service instance with appropriate role-based access to the storage account (strong authentication) to access data in the storage account, even if it's secured by IP firewall rules.

![Trusted service exception](media\search-indexer-howto-secure-access\exception.png "Trusted service exception")

Indexers will now be able to access data in the storage account, even if the account is secured via IP firewall rules.

## Next steps

Learn more about Azure Storage indexers:

- [Azure Blob indexer](search-howto-indexing-azure-blob-storage.md)
- [Azure Data Lake Storage Gen2 indexer](search-howto-index-azure-data-lake-storage.md)
- [Azure Table indexer](search-howto-indexing-azure-tables.md)