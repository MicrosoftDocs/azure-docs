---
title: Connect as trusted service
titleSuffix: Azure Cognitive Search
description: Enable data access by an indexer in Azure Cognitive Search to data stored securely in Azure Storage.

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.topic: how-to
ms.date: 03/30/2022
---

# Make indexer connections to Azure Storage as a trusted service

In Azure Cognitive Search, indexers that access Azure blobs can use the [trusted service exception](../storage/common/storage-network-security.md#exceptions) to securely access data. This mechanism offers customers who are unable to grant [indexer access using IP firewall rules](search-indexer-howto-access-ip-restricted.md) a simple, secure, and free alternative for accessing data in storage accounts.

## Prerequisites

+ A search service with a [**system-assigned managed identity**](search-howto-managed-identities-data-sources.md). 

+ A storage account with the **Allow trusted Microsoft services to access this storage account** network option.

+ Content in Azure Blob Storage or Azure Data Lake Storage Gen2 (ADLS Gen2) that you want to index or enrich.

+ Optionally, containers or tables in Azure Storage for AI enrichment write-back operations, such as creating a knowledge store, debug session, or enrichment cache.

+ An Azure role assignment. A system managed identity is an Azure AD login. It needs either a **Storage Blob Data Reader** or **Storage Blob Data Contributor** role assignment, depending on whether write access is needed. 

> [!NOTE]
> In Cognitive Search, a trusted service connection is limited to blobs and ADLS Gen2 on Azure Storage. It's unsupported for indexer connections to Azure Table Storage and Azure File Storage.
>
> A trusted service connection must use a system managed identity. A user-assigned managed identity isn't currently supported for this scenario.

## Check service identity

1. [Sign in to Azure portal](https://portal.azure.com) and [find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/).

1. On the **Identity** page, make sure that a system assigned identity is enabled. Remember that user-assigned managed identities, currently in preview, won't work for a trusted service connection.

   :::image type="content" source="media/search-managed-identities/system-assigned-identity-object-id.png" alt-text="Screenshot of a system identity object identifier." border="true":::

## Check network settings and permissions

1. [Sign in to Azure portal](https://portal.azure.com) and [find your storage account](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/).

1. In the left navigation pane under **Security + networking**, select **Networking**.

1. On the **Firewalls and virtual networks** tab, allow access from **Selected networks**.

1. Scroll down to the **Exceptions** section.

   :::image type="content" source="media\search-indexer-howto-secure-access\exception.png" alt-text="Screenshot of the firewall and networking page for Azure Storage in the portal." border="true":::

1. Make sure the checkbox is selected for **Allow Azure services on the trusted services list to access this storage account**.

   This option will only permit the specific search service instance with appropriate role-based access to the storage account (strong authentication) to access data in the storage account, even if it's secured by IP firewall rules.

1. In the left navigation pane under **Access Control**, view all role assignments and make sure that **Storage Blob Data Reader** is assigned to the search service system identity.

## Set up and test the connection

The easiest way to test the connection is by running the Import data wizard.

1. Start the Import data wizard, selecting the Azure Blob Storage or Azure Data Lake Storage Gen2. 

1. Choose a connection to your storage account, and then select **System-assigned**. Select **Next** to invoke a connection. If the index schema is detected, the connection succeeded.

   :::image type="content" source="media\search-indexer-howto-secure-access\test-system-identity.png" alt-text="Screenshot of the Import data wizard data source connection page." border="true":::

## See also

+ [Connect to other Azure resources using a managed identity](search-howto-managed-identities-data-sources.md)
+ [Azure Blob indexer](search-howto-indexing-azure-blob-storage.md)
+ [Azure Data Lake Storage Gen2 indexer](search-howto-index-azure-data-lake-storage.md)
+ [Authenticate with Azure Active Directory](/azure/architecture/framework/security/design-identity-authentication)
+ [About managed identities (Azure Active Directory)](../active-directory/managed-identities-azure-resources/overview.md)
