---
title: Azure Cosmos DB attachments
description: This article presents an overview of Azure Cosmos DB attachments. 
author: aliuy
ms.author: andrl
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 08/07/2020
ms.reviewer: sngun
---

# Attachments

Azure Cosmos DB attachments are special items that contain references to an associated metadata with an external blob or media file.

There are two types of attachments:

1. **Unmanaged Attachments** are a wrapper around an URI reference to a blob stored in an external service (for example, Azure Storage, OneDrive, etc.). This approach is similar to storing a URI property in a standard Azure Cosmos DB item.
2. **Managed Attachments** are blobs managed and stored internally by Azure Cosmos DB and exposed via a system-generated mediaLink.


> [!NOTE]
> Attachments are a legacy feature, in which support is scoped to continued functionality for customers already using this feature. 
> 
> Instead of Attachments - we highly recommend customers to use Azure Blob Storage, as a purpose-built blob storage service, for storing blob data. Users can continue to store structured metadata along with reference URI links in Azure Cosmos DB as properties within standard items to enhance queryability and indexing for blobs stored in Azure Blob Storage.
> 
> Microsoft is committed to provide a minimum 36-month notice prior to fully deprecating attachments – which will be announced at a further date.

## Known Limitations

Azure Cosmos DB’s managed attachments are distinct from its support for standard items – for which it offers unlimited scalability, global distribution, and integration with other Azure services.

- Attachments aren't supported in all versions of Azure Cosmos DB’s SDKs.
- Managed attachments are limited to 2 GB of storage per database account.
- Managed attachments aren't compatible with Azure Cosmos DB’s global distribution feature set.

## Next Steps

- Get started with [Azure Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-dotnet)
- Get references for using attachments via [Azure Cosmos DB’s .NET v2 SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.attachment?view=azure-dotnet)
- Get references for using attachments via [Azure Cosmos DB’s REST API](https://docs.microsoft.com/rest/api/cosmos-db/attachments)
