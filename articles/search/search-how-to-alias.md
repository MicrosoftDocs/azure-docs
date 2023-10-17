---
title: Create an index alias
titleSuffix: Azure Cognitive Search
description: Create an alias to define a secondary name that can be used to refer to an index for querying, indexing, and other operations.
author: gmndrg
ms.author: gimondra
ms.service: cognitive-search
ms.topic: how-to
ms.date: 04/04/2023
---

# Create an index alias in Azure Cognitive Search

> [!IMPORTANT]
> Index aliases are currently in public preview and available under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In Azure Cognitive Search, an index alias is a secondary name that can be used to refer to an index for querying, indexing, and other operations. You can create an alias that maps to a search index and substitute the alias name in places where you would otherwise reference an index name. An alias adds flexibility if you need to change which index your application is pointing to. Instead of updating the references in your application, you can just update the mapping for your alias.

The main goal of index aliases is to make it easier to manage your production indexes. For example, if you need to make a change to your index definition, such as editing a field or adding a new analyzer, you'll have to create a new search index because all search indexes are immutable. This means you either need to [drop and rebuild your index](search-howto-reindex.md) or create a new index and then migrate your application over to that index.

Instead of dropping and rebuilding your index, you can use index aliases. A typical workflow would be to: 

1. Create your search index
1. Create an alias that maps to your search index
1. Have your application send querying/indexing requests to the alias rather than the index name
1. When you need to make a change to your index that requires a rebuild, create a new search index 
1. When your new index is ready to go, update the alias to map to the new index and requests will automatically be routed to the new index

## Create an index alias

You can create an alias using the preview REST API, the preview SDKs, or through the [Azure portal](https://portal.azure.com). An alias consists of the `name` of the alias and the name of the search index that the alias is mapped to. Only one index name can be specified in the `indexes` array.

### [**REST API**](#tab/rest)

You can use the [Create or Update Alias (REST preview)](/rest/api/searchservice/preview-api/create-or-update-alias) to create an index alias.

```http
POST /aliases?api-version=2021-04-30-preview
{
    "name": "my-alias",
    "indexes": ["hotel-samples-index"]
}
```

### [**Azure portal**](#tab/portal)

Follow the steps below to create an index alias in the Azure portal.

1. Navigate to your search service in the [Azure portal](https://portal.azure.com).
1. Find and select **Aliases**.
1. Select **+ Add Alias**.
1. Give your index alias a name and select the search index you want to map the alias to. Then, select **Save**.

:::image type="content" source="media/search-howto-alias/create-alias-portal.png" alt-text="Screenshot creating an alias in the Azure portal." border="true":::

### [**.NET SDK**](#tab/sdk)


In the preview [.NET SDK](https://www.nuget.org/packages/Azure.Search.Documents/11.5.0-beta.1) for Azure Cognitive Search, you can use the following syntax to create an index alias. 

```csharp
// Create a SearchIndexClient
SearchIndexClient adminClient = new SearchIndexClient(serviceEndpoint, credential);

// Create an index alias
SearchAlias myAlias = new SearchAlias("my-alias", "hotel-quickstart-index");
adminClient.CreateAlias(myAlias);
```

Index aliases are also supported in the latest preview SDKs for [Java](https://search.maven.org/artifact/com.azure/azure-search-documents/11.6.0-beta.1/jar), [Python](https://pypi.org/project/azure-search-documents/11.4.0b1/), and [JavaScript](https://www.npmjs.com/package/@azure/search-documents/v/11.3.0-beta.8).

---

## Send requests to an index alias

Once you've created your alias, you're ready to start using it. Aliases can be used for all document operations including querying, indexing, suggestions, and autocomplete.

In the query below, instead of sending the request to `hotel-samples-index`, you can instead send the request to `my-alias` and it will be routed accordingly. 

```http
POST /indexes/my-alias/docs/search?api-version=2021-04-30-preview
{
    "search": "pool spa +airport",
    "searchMode": any,
    "queryType": "simple",
    "select": "HotelId, HotelName, Category, Description",
    "count": true
}
```

If you expect to make updates to a production index, specify an alias rather than the index name in your client-side application. Scenarios that require an index rebuild are outlined in [Drop and rebuild an index](search-howto-reindex.md).

> [!NOTE]
> You can only use an alias with document operations or to get and update an index definition. Aliases can't be used to delete an index, can't be used with the Analyze Text API, and can't be used as the `targetIndexName` on an indexer.
> 
> An update to an alias may take up to 10 seconds to propagate through the system so you should wait at least 10 seconds before performing any operation in the index that has been mapped or recently was mapped to the alias.

## Swap indexes

Now, whenever you need to update your application to point to a new index, all you need to do is update the mapping in your alias. PUT is required for updates as described in [Create or Update Alias (REST preview)](/rest/api/searchservice/preview-api/create-or-update-alias).

```http
PUT /aliases/my-alias?api-version=2021-04-30-preview
{
    "name": "my-alias",
    "indexes": ["hotel-samples-index2"]
}
```
After you make the update to the alias, requests will automatically start to be routed to the new index.

> [!NOTE]
> An update to an alias may take up to 10 seconds to propagate through the system so you should wait at least 10 seconds before deleting the index that the alias was previously mapped to.

## See also

+ [Drop and rebuild an index in Azure Cognitive Search](search-howto-reindex.md)
