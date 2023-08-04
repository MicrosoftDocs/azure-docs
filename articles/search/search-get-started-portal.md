---
title: "Quickstart: Create a search index in the Azure portal"
titleSuffix: Azure Cognitive Search
description: Create, load, and query your first search index using the Import Data wizard in Azure portal. This quickstart uses a fictitious hotel dataset for sample data.
manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.date: 11/16/2022
ms.custom: mode-ui
---
# Quickstart: Create a search index in the Azure portal

In this Azure Cognitive Search quickstart, you'll create your first search index using the **Import data** wizard and a built-in sample data source consisting of fictitious hotel data. The wizard guides you through the creation of a search index (hotels-sample-index) so that you can write interesting queries within minutes. 

Although you won't use the options in this quickstart, the wizard includes a page for AI enrichment so that you can extract text and structure from image files and unstructured text. For a similar walkthrough that includes AI enrichment, see [Quickstart: Create a skillset](cognitive-search-quickstart-blob.md).

## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

+ An Azure Cognitive Search service (any tier, any region). [Create a service](search-create-service-portal.md) or [find an existing service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart. 

### Check for space

Many customers start with the free service. The free tier is limited to three indexes, three data sources, and three indexers. Make sure you have room for extra items before you begin. This quickstart creates one of each object.

Check the service overview page to find out how many indexes, indexers, and data sources you already have. 

:::image type="content" source="media/search-get-started-portal/tiles-indexers-datasources.png" alt-text="Screenshot of lists of indexes, indexers, and data sources in the service dashboard." border="true":::

## Create and load an index

Search queries iterate over an [*index*](search-what-is-an-index.md) that contains searchable data, metadata, and other constructs that optimize certain search behaviors.

For this quickstart, we'll create and load the index using a built-in sample dataset that can be crawled using an [*indexer*](search-indexer-overview.md) via the [**Import data wizard**](search-import-data-portal.md). The hotels-sample data set is hosted on Microsoft on Azure Cosmos DB and accessed over an internal connection. You don't need your own Cosmos DB account or source files to access the data.

An indexer is a source-specific crawler that can read metadata and content from supported Azure data sources. Normally, indexers are created programmatically, but in the portal, you can create them through the **Import data wizard**. 

### Step 1 - Start the Import data wizard and create a data source

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account.

1. [Find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/) and on the Overview page, select **Import data** on the command bar to create and populate a search index.

   :::image type="content" source="media/search-import-data-portal/import-data-cmd.png" alt-text="Screenshot of the Import data command in the command bar." border="true":::

1. In the wizard, select **Connect to your data** > **Samples** > **hotels-sample**. This data source is built in. If you were creating your own data source, you would need to specify a name, type, and connection information. Once created, it becomes an "existing data source" that can be reused in other import operations.

   :::image type="content" source="media/search-get-started-portal/import-datasource-sample.png" alt-text="Screenshot of the select sample dataset page in the wizard." border="true":::

1. Continue to the next page.

### Step 2 - Skip the "Enrich content" page

The wizard supports the creation of an [AI enrichment pipeline](cognitive-search-concept-intro.md) for incorporating the Azure AI services algorithms into indexing. 

We'll skip this step for now, and move directly on to **Customize target index**.

   :::image type="content" source="media/search-get-started-portal/skip-cog-skill-step.png" alt-text="Screenshot of the Skip cognitive skill button in the wizard." border="true":::

> [!TIP]
> You can step through an AI-indexing example in a [quickstart](cognitive-search-quickstart-blob.md) or [tutorial](cognitive-search-tutorial-blob.md).

### Step 3 - Configure index

For the built-in hotels sample index, a default index schema is defined for you. Except for a few advanced filter examples, queries in the documentation and samples that target the hotel-samples index will run on this index definition:

:::image type="content" source="media/search-get-started-portal/hotelsindex.png" alt-text="Screenshot of the generated hotels index definition in the wizard." border="true":::

Typically, in a code-based exercise, index creation is completed prior to loading data. The Import data wizard condenses these steps by generating a basic index for any data source it can crawl. Minimally, an index requires a name and a fields collection. One of the fields should be marked as the document key to uniquely identify each document. Additionally, you can specify language analyzers or suggesters if you want autocomplete or suggested queries.

Fields have a data type and attributes. The check boxes across the top are *attributes* controlling how the field is used.

+ **Key** is the unique document identifier. It's always a string, and it's required. Only one field can be the key.
+ **Retrievable** means that field contents show up in search results list. You can mark individual fields as off limits for search results by clearing this checkbox, for example for fields used only in filter expressions.
+ **Filterable**, **Sortable**, and **Facetable** determine whether fields are used in a filter, sort, or faceted navigation structure.
+ **Searchable** means that a field is included in full text search. Strings are searchable. Numeric fields and Boolean fields are often marked as not searchable.

[Storage requirements](search-what-is-an-index.md#example-demonstrating-the-storage-implications-of-attributes-and-suggesters) can vary as a result of attribute selection. For example, **Filterable** requires more storage, but **Retrievable** doesn't.

By default, the wizard scans the data source for unique identifiers as the basis for the key field. *Strings* are attributed as **Retrievable** and **Searchable**. *Integers* are attributed as **Retrievable**, **Filterable**, **Sortable**, and **Facetable**.

1. Accept the defaults.

   If you rerun the wizard a second time using an existing hotels data source, the index won't be configured with default attributes. You'll have to manually select attributes on future imports. 

1. Continue to the next page.

### Step 4 - Configure indexer

Still in the **Import data** wizard, select **Indexer** > **Name**, and type a name for the indexer.

This object defines an executable process. You could put it on recurring schedule, but for now use the default option to run the indexer once, immediately.

Select **Submit** to create and simultaneously run the indexer.

  :::image type="content" source="media/search-get-started-portal/hotels-indexer.png" alt-text="Screenshot of the hotels indexer definition in the wizard." border="true":::

## Monitor progress

The wizard should take you to the Indexers list where you can monitor progress. For self-navigation, go to the Overview page and select the **Indexers** tab.

It can take a few minutes for the portal to update the page, but you should see the newly created indexer in the list, with status indicating "in progress" or success, along with the number of documents indexed.

   :::image type="content" source="media/search-get-started-portal/indexers-inprogress.png" alt-text="Screenshot of the indexer progress message in the wizard." border="true":::

## Check results

The service overview page provides links to the resources created in your Azure Cognitive Search service.  To view the index you just created, select **Indexes** from the list of links. 

Wait for the portal page to refresh. After a few minutes, you should see the index with a document count and storage size.

   :::image type="content" source="media/search-get-started-portal/indexes-list.png" alt-text="Screenshot of the Indexes list on the service dashboard." border="true":::

From this list, you can select on the *hotels-sample* index that you just created, view the index schema. and optionally add new fields. 

The **Fields** tab shows the index schema. If you're writing queries and need to check whether a field is filterable or sortable, this tab shows you the attributes.

Scroll to the bottom of the list to enter a new field. While you can always create a new field, in most cases, you can't change existing fields. Existing fields have a physical representation in your search service and are thus non-modifiable, not even in code. To fundamentally change an existing field, create a new index, dropping the original.

   :::image type="content" source="media/search-get-started-portal/sample-index-def.png" alt-text="Screenshot of the sample index definition in Azure portal." border="true":::

Other constructs, such as scoring profiles and CORS options, can be added at any time.

To clearly understand what you can and can't edit during index design, take a minute to view index definition options. Grayed-out options are an indicator that a value can't be modified or deleted. 

## <a name="query-index"></a> Query using Search explorer

You now have a search index that can be queried using [**Search explorer**](search-explorer.md).

**Search explorer** sends REST calls that conform to the [Search Documents API](/rest/api/searchservice/search-documents). The tool supports [simple query syntax](/rest/api/searchservice/simple-query-syntax-in-azure-search) and [full Lucene query parser](/rest/api/searchservice/lucene-query-syntax-in-azure-search).

1. Select **Search explorer** on the command bar.

   :::image type="content" source="media/search-get-started-portal/search-explorer-cmd.png" alt-text="Screenshot of the Search Explorer command on the command bar." border="true":::

1. From **Index**, choose  "hotels-sample-index".

   :::image type="content" source="media/search-get-started-portal/search-explorer-changeindex.png" alt-text="Screenshot of the Index and API selection lists in Search Explorer." border="true":::

1. In the search bar, paste in a query string from the examples below and select **Search**.

   :::image type="content" source="media/search-get-started-portal/search-explorer-query-string-example.png" alt-text="Screenshot of the query string text field and search button in Search Explorer." border="true":::

## Run more example queries

All of the queries in this section are designed for **Search Explorer** and the Hotels sample index. Results are returned as verbose JSON documents. All fields marked as "retrievable" in the index can appear in results. For more information about queries, see [Querying in Azure Cognitive Search](search-query-overview.md).

| Query | Description |
|-------|-------------|
| `search=spa` | Simple full text query with top N results. The **`search=`** parameter is used for keyword search, in this case, returning hotel data for those containing *spa* in any searchable field in the document. |
| `search=beach &$filter=Rating gt 4` | Filtered query. In this case, ratings greater than 4. |
| `search=spa &$select=HotelName,Description,Tags &$count=true &$top=10` | Parameterized query. The **`&`** symbol is used to append search parameters, which can be specified in any order. </br>**`$select`** parameter returns a subset of fields for more concise search results. </br>**`$count=true`** parameter returns the total count of all documents that match the query. </br>**`$top=10`** returns the highest ranked 10 documents out of the total. By default, Azure Cognitive Search returns the first 50 best matches. You can increase or decrease the amount using this parameter. |
| `search=* &facet=Category &$top=2` | Facet query, used to return an aggregated count of documents that match a facet value you provide. On an empty or unqualified search, all documents are represented. In the hotels index, the Category field is marked as "facetable". |
| `search=spa &facet=Rating`| Facet on numeric values. This query is facet for rating, on a text search for "spa". The term "Rating" can be specified as a facet because the field is marked as retrievable, filterable, and facetable in the index, and its numeric values (1 through 5) are suitable for grouping results by each value.|
| `search=beach &highlight=Description &$select=HotelName, Description, Category, Tags` | Hit highlighting. The term "beach" will be highlighted when it appears in the "Description" field. |
| `search=seatle` followed by </br>`search=seatle~ &queryType=full` | Fuzzy search. By default, misspelled query terms, like *seatle* for "Seattle", fail to return matches in typical search. The first example returns no results. Adding **`queryType=full`** invokes the full Lucene query parser, which supports the `~` operand for fuzzy search. |
| `$filter=geo.distance(Location, geography'POINT(-122.12 47.67)') le 5 &search=* &$select=HotelName, Address/City, Address/StateProvince &$count=true` | Geospatial search. The example query filters all results for positional data, where results are less than 5 kilometers from a given point, as specified by latitude and longitude coordinates (this example uses Redmond, Washington as the point of origin). |

## Takeaways

This quickstart provided a quick introduction to Azure Cognitive Search using the Azure portal.

You learned how to create a search index using the **Import data** wizard. You created your first [indexer](search-indexer-overview.md) and learned the basic workflow for index design. See [Import data wizard in Azure Cognitive Search](search-import-data-portal.md) for more information about the wizard's benefits and limitations.

Using the **Search explorer** in the Azure portal, you learned some basic query syntax through hands-on examples that demonstrated key capabilities such as filters, hit highlighting, fuzzy search, and geospatial search.

## Clean up resources

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

If you're using a free service, remember that the limit is three indexes, indexers, and data sources. You can delete individual items in the portal to stay under the limit. 

## Next steps

Use a portal wizard to generate a ready-to-use web app that runs in a browser. You can try out this wizard on the small index you just created, or use one of the built-in sample data sets for a richer search experience.

> [!div class="nextstepaction"]
> [Create a demo app in the portal](search-create-app-portal.md)
