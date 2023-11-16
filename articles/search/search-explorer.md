---
title: "Quickstart: Search explorer query tool"
titleSuffix: Azure AI Search
description: Search explorer is a query tool in the Azure portal that sends query requests to a search index in Azure AI Search. Use it to learn syntax, test query expressions, or inspect a search document.
manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.date: 11/16/2023
ms.custom:
  - mode-ui
  - ignite-2023
---

# Quickstart: Use Search explorer to run queries in the Azure portal

In this quickstart, learn how to use **Search explorer**, a built-in query tool in the Azure portal used for running queries against a search index in Azure AI Search. Use it to test a query or filter expression, or confirm whether content exists in the index.

This quickstart uses an existing index to demonstrate Search explorer. 

## Prerequisites

Before you begin, have the following prerequisites in place:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

+ An Azure AI Search service. [Create a service](search-create-service-portal.md) or [find an existing service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart. 

+ The *realestate-us-sample-index* is used for this quickstart. To create the index, use the [**Import data wizard**](search-import-data-portal.md), choose the built-in sample data, and step through the wizard using all of the default values.

  :::image type="content" source="media/search-explorer/search-explorer-sample-data.png" alt-text="Screenshot of the sample data sets available in the Import data wizard." border="true":::  

## Start Search explorer

1. In the [Azure portal](https://portal.azure.com), open the search overview page from the dashboard or [find your service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices).

1. Open Search explorer from the command bar:

   :::image type="content" source="media/search-explorer/search-explorer-cmd2.png" alt-text="Screenshot of the Search explorer command in portal." border="true":::

    Or use the embedded **Search explorer** tab on an open index:

   :::image type="content" source="media/search-explorer/search-explorer-tab.png" alt-text="Screenshot of the Search explorer tab." border="true":::

1. To specify syntax and choose an API version, select **JSON view**. The examples in this article assume JSON view throughout.

   :::image type="content" source="media/search-explorer/search-explorer-json-view.png" alt-text="Screenshot of the JSON view selector." border="true":::

## Unspecified query

In Search explorer, POST requests are formulated internally using the [Search POST REST API](/rest/api/searchservice/documents/search-post?view=rest-searchservice-2023-10-01-preview&preserve-view=true), with responses returned as verbose JSON documents.

For a first look at content, execute an empty search by clicking **Search** with no terms provided. An empty search is useful as a first query because it returns entire documents so that you can review document composition. On an empty search, there's no search score and documents are returned in arbitrary order (`"@search.score": 1` for all documents). By default, 50 documents are returned in a search request.

Equivalent syntax for an empty search is `*` or `"search": "*"`.

   ```json
   {
      "search": "*"
   }
   ```

   **Results**
   
   :::image type="content" source="media/search-explorer/search-explorer-example-empty.png" alt-text="Unqualified or empty query example" border="true":::

## Free text search

Free-form queries, with or without operators, are useful for simulating user-defined queries sent from a custom app to Azure AI Search. Only those fields attributed as "searchable" in the index definition are scanned for matches. 

Notice that when you provide search criteria, such as query terms or expressions, search rank comes into play. The following example illustrates a free text search. The "@search.score" is a relevance score computed for the match using the [default scoring algorithm](index-ranking-similarity.md#default-scoring-algorithm).

   ```json
   {
       "search": "Seattle townhouse `Lake Washington` miele OR thermador appliance"
   }
   ```

   **Results**

   You can use Ctrl-F to search within results for specific terms of interest.

   :::image type="content" source="media/search-explorer/search-explorer-example-freetext.png" alt-text="Screenshot of a free text query example." border="true":::

## Count of matching documents 

Add `"count": true` to get the number of matches found in an index. On an empty search, count is the total number of documents in the index. On a qualified search, it's the number of documents matching the query input. Recall that the service returns the top 50 matches by default, so the count might indicate more matches in the index than what's returned in the results.

   ```json
   {
       "search": "Seattle townhouse `Lake Washington` miele OR thermador appliance",
       "count": true
   }
   ```

   **Results**

   :::image type="content" source="media/search-explorer/search-explorer-example-count.png" alt-text="Screenshot of a count example." border="true":::

## Limit fields in search results

Add ["select"`](search-query-odata-select.md) to limit results to the explicitly named fields for more readable output in **Search explorer**. Only fields marked as "retrievable" in the search index can show up in results.

   ```json
   {
      "search": "seattle condo",
      "count": true,
      "select": "listingId, beds, baths, description, street, city, price"
   }
   ```

   **Results**

   :::image type="content" source="media/search-explorer/search-explorer-example-selectfield.png" alt-text="Screenshot of restrict fields in search results example." border="true":::

## Return next batch of results

Azure AI Search returns the top 50 matches based on the search rank. To get the next set of matching documents, append `"top": 100` and `"skip": 50` to increase the result set to 100 documents (default is 50, maximum is 1000), skipping the first 50 documents. You can check the document key (listingID) to identify a document. 

Recall that you need to provide search criteria, such as a query term or expression, to get ranked results. Notice that search scores decrease the deeper you reach into search results.

   ```json
   {
      "search": "seattle condo",
      "count": true,
      "select": "listingId, beds, baths, description, street, city, price",
      "top": 100,
      "skip": 50
   }
   ```

   **Results**

   :::image type="content" source="media/search-explorer/search-explorer-example-topskip.png" alt-text="Screenshot of returning next batch of search results example." border="true":::

## Filter expressions (greater than, less than, equal to)

Use the [`filter`](search-query-odata-filter.md) parameter to specify inclusion or exclusion criteria. The field must be attributed as "filterable" in the index. This example searches for bedrooms greater than 3:

   ```json
   {
       "search": "seattle condo",
       "count": true,
       "select": "listingId, beds, baths, description",
       "filter": "beds gt 3"
   }
   ```
   
   **Results**

   :::image type="content" source="media/search-explorer/search-explorer-example-filter.png" alt-text="Screenshot of a filter example." border="true":::

## Sorting results

Add [`orderby`](search-query-odata-orderby.md) to sort results by another field besides search score. The field must be attributed as "sortable" in the index. In situations where the filtered value is identical (for example, same price), the order is arbitrary, but you can add more criteria for deeper sorting. An example expression you can use to test this out is:

   ```json
   {
       "search": "seattle condo",
       "count": true,
       "select": "listingId, price, beds, baths, description",
       "filter": "beds gt 3",
       "orderby": "price asc"
   }
   ```
   
   **Results**

   :::image type="content" source="media/search-explorer/search-explorer-example-orderby.png" alt-text="ScreEnshot of a sorting example." border="true":::

## Takeaways

In this quickstart, you used **Search explorer** to query an index using the REST API.

+ Results are returned as verbose JSON documents so that you can view document construction and content, in entirety. The `select` parameter in a query expression can limit which fields are returned.

+ Search results are composed of all fields marked as "retrievable" in the index. Select the adjacent **Fields** tab to review attributes.

+ Keyword search, similar to what you might enter in a commercial web browser, are useful for testing an end-user experience. For example, assuming the built-in real estate sample index, you could enter "Seattle apartments lake washington", and then you can use Ctrl-F to find terms within the search results. 

+ Query and filter expressions are articulated in a syntax implemented by Azure AI Search. The default is a [simple syntax](/rest/api/searchservice/simple-query-syntax-in-azure-search), but you can optionally use [full Lucene](/rest/api/searchservice/lucene-query-syntax-in-azure-search) for more powerful queries. [Filter expressions](/rest/api/searchservice/odata-expression-syntax-for-azure-search) are articulated in an OData syntax.

## Clean up resources

When you're working in your own subscription, it's a good idea at the end of a project to decide whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

If you're using a free service, remember that you're limited to three indexes, indexers, and data sources. You can delete individual items in the portal to stay under the limit. 

## Next steps

To learn more about query structures and syntax, use Postman or an equivalent tool to create query expressions that use more parts of the API. The [Search POST REST API](/rest/api/searchservice/documents/search-post?view=rest-searchservice-2023-10-01-preview&preserve-view=true) is especially helpful for learning and exploration.

> [!div class="nextstepaction"]
> [Create a basic query in Postman](search-get-started-rest.md)
