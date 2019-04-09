---
title: Manage indexing policies in Azure Cosmos DB
description: Learn how to manage indexing policies in Azure Cosmos DB
author: markjbrown
ms.service: cosmos-db
ms.topic: sample
ms.date: 04/08/2019
ms.author: mjbrown
---

# Manage indexing policies in Azure Cosmos DB

In Azure Cosmos DB, data is indexed following [indexing policies](index-policy.md) that are defined for each container. The default indexing policy for newly created containers enforces range indexes for any string or number, and spatial indexes for any GeoJSON object of type Point. This policy can be overridden from the Azure portal or by one of the SDKs.

## Use the Azure portal

Azure Cosmos containers store their indexing policy as a JSON document that the Azure portal lets you directly edit.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Create a new Azure Cosmos account or select an existing account.

1. Open the **Data Explorer** pane and select the container that you want to work on.

1. Click on **Scale & Settings**.

1. Modify the indexing policy JSON document.

1. Click **Save** when you are done.

![Manage Indexing using Azure portal](./media/how-to-manage-indexing-policy/indexing-policy-portal.png)

## Use the .NET SDK V2

The `DocumentCollection` object from the [.NET SDK v2](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/) (see [this quickstart](create-sql-api-dotnet.md) regarding its usage) exposes an `IndexingPolicy` property that lets you change the `IndexingMode` and add or remove `IncludedPaths` and `ExcludedPaths`.

```csharp
ResourceResponse<DocumentCollection> containerResponse = await client.ReadDocumentCollectionAsync(UriFactory.CreateDocumentCollectionUri("database", "container"));
containerResponse.Resource.IndexingPolicy.IndexingMode = IndexingMode.Consistent;
containerResponse.Resource.IndexingPolicy.ExcludedPaths.Add(new ExcludedPath { Path = "/headquarters/employees/?" });
await client.ReplaceDocumentCollectionAsync(containerResponse.Resource);
```

## Use the Node.js SDK

The `ContainerDefinition` interface from [Node.js SDK](https://www.npmjs.com/package/@azure/cosmos) (see [this quickstart](create-sql-api-nodejs.md) regarding its usage) exposes an `indexingPolicy` property that lets you change the `indexingMode` and add or remove `includedPaths` and `excludedPaths`.

```javascript
const containerResponse = await client.database('database').container('container').read();
containerResponse.body.indexingPolicy.indexingMode = "consistent";
containerResponse.body.indexingPolicy.excludedPaths.push({ path: '/headquarters/employees/?' });
await client.database('database').container('container').replace(containerResponse.body);
```

## Next steps

Read more about the indexing in the following articles:

* [Indexing Overview](index-overview.md)
* [Indexing policy](index-policy.md)
