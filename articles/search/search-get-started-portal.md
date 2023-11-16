---
title: "Quickstart: Create a search index in the Azure portal"
titleSuffix: Azure AI Search
description: Learn how to create, load, and query your first search index by using the Import Data wizard in the Azure portal. This quickstart uses a fictitious hotel dataset for sample data.
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

# Quickstart: Create a search index in the Azure portal

In this Azure AI Search quickstart, create your first _search index_ by using the [**Import data** wizard](search-import-data-portal.md) and a built-in sample data source consisting of fictitious hotel data hosted by Microsoft. The wizard guides you through the creation of a no-code search index to help you write interesting queries within minutes. 

The wizard creates multiple objects on your search service - [searchable index](search-what-is-an-index.md) - but also an [indexer](search-indexer-overview.md) and data source connection for automated data retrieval. At the end of this quickstart, we review each object. 

> [!NOTE]
> The **Import data** wizard includes options for OCR, text translation, and other AI enrichments that aren't covered in this quickstart. For a similar walkthrough that focuses on AI enrichment, see [Quickstart: Create a skillset in the Azure portal](cognitive-search-quickstart-blob.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

- An Azure AI Search service for any tier and any region. [Create a service](search-create-service-portal.md) or [find an existing service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart. 

### Check for space

Many customers start with the free service. The free tier is limited to three indexes, three data sources, and three indexers. Make sure you have room for extra items before you begin. This quickstart creates one of each object.

Check the **Overview > Usage** tab for the service to see how many indexes, indexers, and data sources you already have. 

:::image type="content" source="media/search-get-started-portal/overview-quota-usage.png" alt-text="Screenshot of the Overview page for an Azure AI Search service instance in the Azure portal, showing the number of indexes, indexers, and data sources." lightbox="media/search-get-started-portal/overview-quota-usage.png":::

## Start the wizard

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account, and go to your Azure AI Search service.

1. On the **Overview** page, select **Import data** to start the wizard.

   :::image type="content" source="media/search-import-data-portal/import-data-cmd.png" alt-text="Screenshot that shows how to open the Import data wizard in the Azure portal.":::

## Create and load an index

In this section, create and load an index in four steps.

### Connect to a data source

The wizard creates a data source connection to sample data hosted by Microsoft on Azure Cosmos DB. This sample data is retrieved accessed over an internal connection. You don't need your own Azure Cosmos DB account or source files to run this quickstart.

1. On **Connect to your data**, expand the **Data Source** dropdown list and select **Samples**.

1. In the list of built-in samples, select **hotels-sample**.

   :::image type="content" source="media/search-get-started-portal/import-hotels-sample.png" alt-text="Screenshot that shows how to select the hotels-sample data source in the Import data wizard.":::

1. Select **Next: Add cognitive skills (Optional)** to continue.

### Skip configuration for cognitive skills

The **Import data** wizard supports the creation of a skillset and [AI-enrichment](cognitive-search-concept-intro.md) into indexing.

1. For this quickstart, ignore the AI enrichment configuration options on the **Add cognitive skills** tab.

1. Select **Skip to: Customize target index** to continue.

   :::image type="content" source="media/search-get-started-portal/skip-cognitive-skills.png" alt-text="Screenshot that shows how to Skip to the Customize target index tab in the Import data wizard.":::

> [!TIP]
> Interested in AI enrichment? Try this [Quickstart: Create a skillset in the Azure portal](cognitive-search-quickstart-blob.md)

### Configure the index

The wizard infers a schema for the built-in hotels-sample index. 

:::image type="content" source="media/search-get-started-portal/hotels-sample-generated-index.png" alt-text="Screenshot that shows the generated index definition for the hotels-sample data source in the Import data wizard." border="false":::

At a minimum, the index requires an **Index name** and a collection of **Fields**. One field must be marked as the _document key_ to uniquely identify each document. The value is always a string. The wizard scans for unique string fields and chooses one for the key.

Each field has a name, data type, and _attributes_ that control how to use the field in the search index. Checkboxes enable or disable the following attributes:

- **Retrievable**: Fields returned in a query response.
- **Filterable**: Fields that accept a filter expression.
- **Sortable**: Fields that accept an orderby expression.
- **Facetable**: Fields used in a faceted navigation structure.
- **Searchable**: Fields used in full text search. Strings are searchable. Numeric fields and Boolean fields are often marked as not searchable.

Strings are attributed as **Retrievable** and **Searchable**. Integers are attributed as **Retrievable**, **Filterable**, **Sortable**, and **Facetable**.

Attributes affect storage. **Filterable** fields consume extra storage, but **Retrievable** doesn't. For more information, see [Example demonstrating the storage implications of attributes and suggesters](search-what-is-an-index.md#example-demonstrating-the-storage-implications-of-attributes-and-suggesters).

If you want autocomplete or suggested queries, specify language **Analyzers** or **Suggesters**.

Follow these steps to configure the index:

1. Accept the system-generated values for the **Index name** (_hotels-sample-index_) and **Key** field (_HotelId_).

1. Accept the system-generated values for all field attributes.

   > [!IMPORTANT]
   > If you rerun the wizard and use an existing hotels-sample data source, the index isn't configured with default attributes.
   > You have to manually select attributes on future imports. 

1. Select **Next: Create an indexer** to continue.

### Configure and run the indexer

The last step configures and runs the indexer. This object defines an executable process. The data source, index, and indexer are created in this step.

1. Accept the system-generated value for the **Indexer name** (_hotels-sample-indexer_).

1. For this quickstart, use the default option to run the indexer once, immediately. The hosted data is static so there's no change tracking enabled for it.

1. Select **Submit** to create and simultaneously run the indexer.

   :::image type="content" source="media/search-get-started-portal/hotels-sample-indexer.png" alt-text="Screenshot that shows how to configure the indexer for the hotels-sample data source in the Import data wizard." border="false":::

## Monitor indexer progress

You can monitor creation of the indexer or index in the portal. The service **Overview** page provides links to the resources created in your Azure AI Search service.

1. On the left, select **Indexers**.

   :::image type="content" source="media/search-get-started-portal/indexers-status.png" alt-text="Screenshot that shows the creation of the indexer in progress in the Azure portal.":::

   It can take a few minutes for the page results to update in the Azure portal. You should see the newly created indexer in the list with a status of _In progress_ or _Success_. The list also shows the number of documents indexed.

## Check search index results

1. On the left, select **Indexes**.

1. Select **hotels-sample-index**. 

   Wait for the Azure portal page to refresh. You should see the index with a document count and storage size.

   :::image type="content" source="media/search-get-started-portal/indexes-list.png" alt-text="Screenshot of the Indexes list on the Azure AI Search service dashboard in the Azure portal.":::

1. Select the **Fields** tab to view the index schema.

   Check to see which fields are **Filterable** or **Sortable** so that you know what queries to write.

   :::image type="content" source="media/search-get-started-portal/index-schema-definition.png" alt-text="Screenshot that shows the schema definition for an index in the Azure AI Search service in the Azure portal.":::

## Add or change fields

On the **Fields** tab, you can create a new field using **Add field** with a name, [supported data type](/rest/api/searchservice/supported-data-types), and attributions.

Changing existing fields is harder. Existing fields have a physical representation in the index so they aren't modifiable, not even in code. To fundamentally change an existing field, you need to create a new field that replaces the original. Other constructs, such as scoring profiles and CORS options, can be added to an index at any time.

To clearly understand what you can and can't edit during index design, take a minute to view the index definition options. Grayed options in the field list indicate values that can't be modified or deleted.

## Query with Search explorer

You now have a search index that can be queried with [**Search explorer**](search-explorer.md). **Search explorer** sends REST calls that conform to the [Search POST REST API](/rest/api/searchservice/documents/search-post?view=rest-searchservice-2023-10-01-preview&preserve-view=true). The tool supports [simple query syntax](/rest/api/searchservice/simple-query-syntax-in-azure-search) and [full Lucene query syntax](/rest/api/searchservice/lucene-query-syntax-in-azure-search).

1. On the **Search explorer** tab, enter text to search on.

   :::image type="content" source="media/search-get-started-portal/search-explorer-query-string.png" alt-text="Screenshot that shows how to enter and run a query in the  Search Explorer tool.":::

1. Use the **Mini-map** to jump quickly to nonvisible areas of the output.

   :::image type="content" source="media/search-get-started-portal/search-explorer-query-results.png" alt-text="Screenshot that shows long results for a query in the Search Explorer tool and the mini-map.":::

1. To specify syntax, switch to the JSON view.

   :::image type="content" source="media/search-get-started-portal/search-explorer-change-view.png" alt-text="Screenshot of the JSON view selector.":::

## Example queries for hotels sample index

The following examples assume the JSON view and the 2023-11-01 REST API version.

### Filter examples

Parking, tags, renovation date, rating and location are filterable.

```json
{
    "search": "beach OR spa",
    "select": "HotelId, HotelName, Description, Rating",
    "count": true,
    "top": 10,
    "filter": "Rating gt 4"
}
```

Boolean filters assume "true" by default.

```json
{
    "search": "beach OR spa",
    "select": "HotelId, HotelName, Description, Rating",
    "count": true,
    "top": 10,
    "filter": "ParkingIncluded"
}
```

Geospatial search is filter-based. The `geo.distance` function filters all results for positional data based on the specified `Location` and `geography'POINT` coordinates. The query seeks hotels that are within 5 kilometers of the latitude longitude coordinates `-122.12 47.67`, which is "Redmond, Washington, USA." The query displays the total number of matches `&$count=true` with the hotel names and address locations.

```json
{
    "search": "*",
    "select": "HotelName, Address/City, Address/StateProvince",
    "count": true,
    "top": 10,
    "filter": "geo.distance(Location, geography'POINT(-122.12 47.67)') le 5"
}
```

### Full Lucene syntax examples

The default syntax is [simple syntax](query-simple-syntax.md), but if you want fuzzy search or term boosting or regular expressions, specify the [full syntax](query-lucene-syntax.md).

```json
{
    "queryType": "full",
    "search": "seatle~",
    "select": "HotelId, HotelName,Address/City, Address/StateProvince",
    "count": true
}
```

By default, misspelled query terms like `seatle` for `Seattle` fail to return matches in a typical search. The `queryType=full` parameter invokes the full Lucene query parser, which supports the tilde `~` operand. When these parameters are present, the query performs a fuzzy search for the specified keyword. The query seeks matching results along with results that are similar to but not an exact match to the keyword. 

Take a minute to try a few of these example queries for your index. To learn more about queries, see [Querying in Azure AI Search](search-query-overview.md).

## Clean up resources

When you work in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources for your service in the Azure portal under **All resources** or **Resource groups** in the left pane.

If you use a free service, remember that the limit is three indexes, indexers, and data sources. You can delete individual items in the Azure portal to stay under the limit. 

## Next steps

Try an Azure portal wizard to generate a ready-to-use web app that runs in a browser. Use this wizard on the small index you created in this quickstart, or use one of the built-in sample data sets for a richer search experience.

> [!div class="nextstepaction"]
> [Create a demo app in the portal](search-create-app-portal.md)
