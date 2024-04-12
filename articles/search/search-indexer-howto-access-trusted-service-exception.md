---
title: Connect as trusted service
titleSuffix: Azure AI Search
description: Enable secure data access to Azure Storage from an indexer in Azure AI Search 

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 01/18/2024
---

# Make indexer connections to Azure Storage as a trusted service

In Azure AI Search, indexers that access Azure blobs can use the [trusted service exception](../storage/common/storage-network-security.md#exceptions) to securely access blobs. This mechanism offers customers who are unable to grant [indexer access using IP firewall rules](search-indexer-howto-access-ip-restricted.md) a simple, secure, and free alternative for accessing data in storage accounts.

> [!NOTE]
> If Azure Storage is behind a firewall and in the same region as Azure AI Search, you won't be able to create an inbound rule that admits requests from your search service. The solution for this scenario is for search to connect as a trusted service, as described in this article.

## Prerequisites

+ A search service with a system-assigned managed identity ([see check service identity](#check-service-identity)).

+ A storage account with the **Allow trusted Microsoft services to access this storage account** network option ([see check network settings](#check-network-settings)).

+ An Azure role assignment in Azure Storage that grants permissions to the search service system-assigned managed identity ([see check permissions](#check-permissions)).

> [!NOTE]
> In Azure AI Search, a trusted service connection is limited to blobs and ADLS Gen2 on Azure Storage. It's unsupported for indexer connections to Azure Table Storage and Azure File Storage.
>
> A trusted service connection must use a system managed identity. A user-assigned managed identity isn't currently supported for this scenario.

## Check service identity

1. Sign in to the [Azure portal](https://portal.azure.com) and [find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/).

1. On the **Identity** page, make sure that a [system assigned identity is enabled](search-howto-managed-identities-data-sources.md). Remember that user-assigned managed identities, currently in preview, won't work for a trusted service connection.

   :::image type="content" source="media/search-managed-identities/system-assigned-identity-object-id.png" alt-text="Screenshot of a system identity object identifier." border="true":::

## Check network settings

1. Sign in to the [Azure portal](https://portal.azure.com) and [find your storage account](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/).

1. In the left navigation pane under **Security + networking**, select **Networking**.

1. On the **Firewalls and virtual networks** tab, allow access from **Selected networks**.

1. Scroll down to the **Exceptions** section.

   :::image type="content" source="media\search-indexer-howto-secure-access\exception.png" alt-text="Screenshot of the firewall and networking page for Azure Storage in the portal." border="true":::

1. Make sure the checkbox is selected for **Allow Azure services on the trusted services list to access this storage account**.

   Assuming your search service has role-based access to the storage account, it can access data even when connections to Azure Storage are secured by IP firewall rules.

## Check permissions

A system managed identity is a Microsoft Entra service principal. The assignment needs **Storage Blob Data Reader** at a minimum.

1. In the left navigation pane under **Access Control**, view all role assignments and make sure that **Storage Blob Data Reader** is assigned to the search service system identity.

1. Add **Storage Blob Data Contributor** if write access is required.

   Features that require write access include [enrichment caching](cognitive-search-incremental-indexing-conceptual.md), [debug sessions](cognitive-search-debug-session.md), and [knowledge store](knowledge-store-concept-intro.md).

## Set up and test the connection

The easiest way to test the connection is by running the Import data wizard.

1. Start the Import data wizard, selecting the Azure Blob Storage or Azure Data Lake Storage Gen2. 

1. Choose a connection to your storage account, and then select **System-assigned**. Select **Next** to invoke a connection. If the index schema is detected, the connection succeeded.

   :::image type="content" source="media\search-indexer-howto-secure-access\test-system-identity.png" alt-text="Screenshot of the Import data wizard data source connection page." border="true":::

## See also

+ [Connect to other Azure resources using a managed identity](search-howto-managed-identities-data-sources.md)
+ [Azure Blob indexer](search-howto-indexing-azure-blob-storage.md)
+ [Azure Data Lake Storage Gen2 indexer](search-howto-index-azure-data-lake-storage.md)
+ [Authenticate with Microsoft Entra ID](/azure/architecture/framework/security/design-identity-authentication)
+ [About managed identities (Microsoft Entra ID)](../active-directory/managed-identities-azure-resources/overview.md)
