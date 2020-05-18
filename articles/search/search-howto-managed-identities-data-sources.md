---
title: Connect to data sources using managed identities (preview)
titleSuffix: Azure Cognitive Search
description: Learn how to connect to data sources using managed identities (preview)

manager: luisca
author: markheff
ms.author: maheff
ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 05/18/2020
---

# Connect to data sources using managed identities (preview)

> [!IMPORTANT] 
> Support for using managed identities to connect to data sources is currently in a gated public preview. Preview functionality is provided without a service level agreement, and is not recommended for production workloads.
> You can request access to the preview by filling out [this form](https://aka.ms/azure-cognitive-search/mi-preview-request).

An [indexer](search-indexer-overview.md) in Azure Cognitive Search is a crawler that provides a way to pull data from your data source into Azure Cognitive Search. An indexer obtains a data source connection from the data source object that you create. The data source object usually includes an account key or password for the target data source. For example, the data source object could include an Azure Storage account key if you want to index data from a blob storage container.

In many cases providing credentials directly in the data source object is not a problem, but there are some challenges that can come up:
1. How do I keep the credentials secure in my code that creates the data source object?
1. If my account key or password is compromised and I need to change it, I now need to update my data source objects with the new account key or password so that my indexer can connect to the data source again.

These concerns can be resolved by using a managed identity to connect to your data source.

## Using managed identities

[Managed identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) is a feature that provides Azure services with an automatically managed identity in Azure AD. Azure Cognitive Search can use this managed identity to allow you to create a data source object with a connection string that does not include an account key or a password. Instead, your Azure Cognitive Search service will connect to the data source using the permissions that you give to its system assigned managed identity.

When connecting to a data source using a managed identity, you can change your data source account key or password and your indexers will still be able to connect. You can also create data source objects in your code without having to include an account key or use Key Vault to retrieve an account key.

## Next steps

The following data sources support connections using managed identities. Select each link to learn more about how to use managed identities with each data source.

* [Azure Blob Storage](search-howto-managed-identities-storage.md)
* [Azure Data Lake Storage Gen2](search-howto-managed-identities-storage.md) (preview)
* [Azure Table Storage](search-howto-managed-identities-storage.md)
* [Azure Cosmos DB](search-howto-managed-identities-cosmos-db.md)
* [Azure SQL Database](search-howto-managed-identities-sql.md)