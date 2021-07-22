---
title: Set up a connection to a data source using a managed identity
titleSuffix: Azure Cognitive Search
description: Learn how to set up an indexer connection to a data source using a managed identity

manager: luisca
author: markheff
ms.author: maheff
ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/02/2021
---

# Set up an indexer connection to a data source using a managed identity

> [!IMPORTANT] 
> Setting up a connection to a data source using a managed identity is not supported with the Free Azure Cognitive Search tier.

An [indexer](search-indexer-overview.md) in Azure Cognitive Search is a crawler that provides a way to pull data from your data source into Azure Cognitive Search. An indexer obtains a data source connection from the data source object that you create. The data source object usually includes credentials for the target data source. For example, the data source object could include an Azure Storage account key if you want to index data from a blob storage container.

In many cases providing credentials directly in the data source object is not a problem, but there are some challenges that can come up:
* How do I keep the credentials secure in my code that creates the data source object?
* If my account key or password is compromised and I need to change it, I now need to update my data source objects with the new account key or password so that my indexer can connect to the data source again.

These concerns can be resolved by setting up your connection using a managed identity.

## Using managed identities

[Managed identities](../active-directory/managed-identities-azure-resources/overview.md) is a feature that provides applications with an automatically managed identity in Azure Active Directory (Azure AD). You can use this feature in Azure Cognitive Search to create a data source object with a connection string that does not include any credentials. Instead, your search service will be granted access to the data source through Azure role-based access control (Azure RBAC).

When setting up a data source using a managed identity, you can change your data source credentials and your indexers will still be able to connect to the data source. You can also create data source objects in your code without having to include an account key or use Key Vault to retrieve an account key.

There are two types of managed identities. Azure Cognitive Search supports system-assigned managed identities and user-assigned managed identities.

### System-assigned managed identity

A [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) can be assigned to a single Azure service. You can assign a system-assigned managed identity to a single Azure Cognitive Search service and it is tied to the lifecycle of that search service.

### User-assigned managed identity (preview)

> [!IMPORTANT]
>This feature is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The REST API version 2021-04-30-Preview and [Management REST API 2021-04-01-Preview](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update) provide this feature.

A [user-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) is a standalone Azure resource that can be assigned to one or more Azure services. A single Azure Cognitive Search service can have one or more user-assigned managed identities assigned to it. A single user-assigned managed identity can be assigned to multiple search services.

## Limitations

The following data sources support setting up an indexer connection using managed identities. 

* [Azure Blob Storage,  Azure Data Lake Storage Gen2 (preview), Azure Table Storage](search-howto-managed-identities-storage.md)
* [Azure Cosmos DB](search-howto-managed-identities-cosmos-db.md)
* [Azure SQL Database](search-howto-managed-identities-sql.md)

The following features do not currently support using managed identities to set up the connection:
* Knowledge Store
* Custom skills
 
## Next steps

Learn more about how to set up an indexer connection using managed identities:

* [Azure Blob storage,  Azure Data Lake Storage Gen2 (preview), Azure Table Storage](search-howto-managed-identities-storage.md)
* [Azure Cosmos DB](search-howto-managed-identities-cosmos-db.md)
* [Azure SQL Database](search-howto-managed-identities-sql.md)