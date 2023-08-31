---
title: "Quickstart: Create a search index in the Azure portal"
titleSuffix: Azure Cognitive Search
description: Learn how to create, load, and query your first search index by using the Import Data wizard in the Azure portal. This quickstart uses a fictitious hotel dataset for sample data.
manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.date: 08/31/2023
ms.custom: mode-ui
---

# Quickstart: Create a search index in the Azure portal

In this Azure Cognitive Search quickstart, you create your first _search index_ by using the [**Import data** wizard](search-import-data-portal.md) and a built-in sample data source consisting of fictitious hotel data. The wizard guides you through the creation of a search index (hotels-sample-index) to help you write interesting queries within minutes. 

Search queries iterate over an index that contains searchable data, metadata, and other constructs that optimize certain search behaviors. An indexer is a source-specific crawler that can read metadata and content from supported Azure data sources. Normally, indexers are created programmatically. In the Azure portal, you can create them through the **Import data** wizard. For more information, see [Indexes in Azure Cognitive Search](search-what-is-an-index.md) and [Indexers in Azure Cognitive Search](search-indexer-overview.md) .

> [!NOTE]
> The **Import data** wizard includes options for AI enrichment that aren't reviewed in this quickstart. You can use these options to extract text and structure from image files and unstructured text. For a similar walkthrough that includes AI enrichment, see [Quickstart: Create a skillset in the Azure portal](cognitive-search-quickstart-blob.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

- An Azure Cognitive Search service (any tier, any region). [Create a service](search-create-service-portal.md) or [find an existing service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart. 

### Check for space

Many customers start with the free service. The free tier is limited to three indexes, three data sources, and three indexers. Make sure you have room for extra items before you begin. This quickstart creates one of each object.

Check the **Overview** page for the service to see how many indexes, indexers, and data sources you already have. 

:::image type="content" source="media/search-get-started-portal/overview-quota-usage.png" alt-text="Screenshot of the Overview page for an Azure Cognitive Search service instance in the Azure portal, showing the number of indexes, indexers, and data sources." lightbox="media/search-get-started-portal/overview-quota-usage-expanded.png" border="false":::

## Create and load an index

Azure Cognitive Search uses an indexer via the **Import data** wizard. The hotels-sample data set is hosted on Microsoft on Azure Cosmos DB and accessed over an internal connection. You don't need your own Azure Cosmos DB account or source files to access the data.

### Start the wizard

To get started, browse to your Azure Cognitive Search service in the Azure portal and open the **Import data** wizard.

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account.

1. [Go to your Azure Cognitive Search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/).

1. On the **Overview** page, select **Import data** to create and populate a search index.

   :::image type="content" source="media/search-import-data-portal/import-data-cmd.png" alt-text="Screenshot that shows how to open the Import data wizard in the Azure portal.":::

   The **Import data** wizard opens.

### Connect to a data source

The next step is to connect to a data source to use for the search index.

1. In the **Import data** wizard on the **Connect to your data** tab, expand the **Data Source** dropdown list and select **Samples**.

1. In the list of built-in samples, select **hotels-sample**.

   In this quickstart, you use the built-in hotels-sample data source.

   :::image type="content" source="media/search-get-started-portal/import-hotels-sample.png" alt-text="Screenshot that shows how to select the hotels-sample data source in the Import data wizard." border="false":::

   If you want to create your own data source, you need to specify a name, type, and connection information. After you create a data source, it becomes an "existing data source" that can be reused in other import operations.

1. Select **Next: Add cognitive skills (Optional)** to continue.

### Skip configuration for cognitive skills

The **Import data** wizard supports the creation of an AI-enrichment pipeline for incorporating the Azure AI services algorithms into indexing. For more information, see [AI enrichment in Azure Cognitive Search](cognitive-search-concept-intro.md).

1. For this quickstart, ignore the AI enrichment configuration options on the **Add cognitive skills** tab.

1. Select **Skip to: Customize target index** to continue.

   :::image type="content" source="media/search-get-started-portal/skip-cognitive-skills.png" alt-text="Screenshot that shows how to Skip to the Customize target index tab in the Import data wizard.":::

> [!TIP]
> If you want to try an AI-indexing example, see the following articles:
> - [Quickstart: Create a skillset in the Azure portal](cognitive-search-quickstart-blob.md)
> - [Tutorial: Use REST and AI to generate searchable content from Azure blobs](cognitive-search-tutorial-blob.md)

### Configure the index

The Azure Cognitive Search service generates a schema for the built-in hotels-sample index. Except for a few advanced filter examples, queries in the documentation and samples that target the hotels-sample index run on this index definition. The definition is shown on the **Customize target index** tab in the **Import data** wizard:

:::image type="content" source="media/search-get-started-portal/hotels-sample-generated-index.png" alt-text="Screenshot that shows the generated index definition for the hotels-sample data source in the Import data wizard." border="false":::

Typically, in a code-based exercise, index creation is completed prior to loading data. The **Import data** wizard condenses these steps by generating a basic index for any data source it can crawl.

Each index is configured with the following settings:

- At a minimum, the index requires an **Index name** and a collection of **Fields** with at least one field.
- One field must be marked as the _document key_ to uniquely identify each document. Only one field can be the document key.
- The index **Key** provides the unique document identifier. The value is always a string.
- If you want autocomplete or suggested queries, you can specify language **Analyzers** or **Suggesters**.

Each field has a name, data type, and _attributes_ that control how to use the field in the search index. The **Customize target index** tab uses checkboxes to enable or disable the attribute for all fields or specific fields.

The following table summarizes the attributes.

| Attribute | Description |
| --- | --- |
| **Retrievable** | Indicates whether to include the field contents in the search index. |
| **Filterable** | Indicates whether to make the field contents available as filters for the search index. |
| **Sortable** | Indicates whether to make field contents available for sorting the search index. |
| **Facetable** | Indicates whether to use the field contents for faceted navigation structure. |
| **Searchable** | Indicates whether to use the field contents in full text search. Strings are searchable. Numeric fields and Boolean fields are often marked as not searchable. |

The storage requirements for the index can vary as a result of attribute selection. For example, enabling a field as **Filterable** requires more storage, but enabling a field as **Retrievable** doesn't. For more information, see [Example demonstrating the storage implications of attributes and suggesters](search-what-is-an-index.md#example-demonstrating-the-storage-implications-of-attributes-and-suggesters).

By default, the **Import data** wizard scans the data source for unique identifiers as the basis for the **Key** field. _Strings_ are attributed as **Retrievable** and **Searchable**. _Integers_ are attributed as **Retrievable**, **Filterable**, **Sortable**, and **Facetable**.

Follow these steps to configure the index:

1. Accept the system-generated values for the **Index name** (_hotels-sample-index_) and **Key** field (_HotelId_).

1. Accept the system-generated values for all field attributes.

   > [!IMPORTANT]
   > If you rerun the wizard and use an existing hotels-sample data source, the index isn't configured with default attributes.
   > You have to manually select attributes on future imports. 

1. Select **Next: Create an indexer** to continue.

### Configure the indexer

The last step is to configure the indexer for the search index. This object defines an executable process. You can configure the indexer to run on a recurring schedule.

1. Accept the system-generated value for the **Indexer name** (_hotels-sample-indexer_).

1. For this quickstart, use the default option to run the indexer once, immediately.

1. Select **Submit** to create and simultaneously run the indexer.

   :::image type="content" source="media/search-get-started-portal/hotels-sample-indexer.png" alt-text="Screenshot that shows how to configure the indexer for the hotels-sample data source in the Import data wizard." border="false":::



## Monitor progress

After you complete the **Import data** wizard, the **Indexers** list opens in the Azure portal, where you can monitor the index creation. If you don't see the list, go to the **Overview** page for your service and select the **Indexers** tab.

It can take a few minutes for the portal to update the page. You should see the newly created indexer in the list with a status of _in progress_ or _success_. The list also shows the number of documents indexed.

:::image type="content" source="media/search-get-started-portal/indexers-inprogress.png" alt-text="Screenshot of the indexer progress message in the Import data wizard." border="true":::



## Check results

The service **Overview** page provides links to the resources created in your Azure Cognitive Search service. To view the new index, select **Indexes** from the list of links. 

Wait for the portal page to refresh. After a few minutes, you should see the index with a document count and storage size.

:::image type="content" source="media/search-get-started-portal/indexes-list.png" alt-text="Screenshot of the Indexes list on the service dashboard." border="true":::

In this list, you can select the *hotels-sample* index that you created, view the index schema, and optionally add new fields. 

The **Fields** tab shows the index schema. If you're writing queries and need to check whether a field is filterable or sortable, this tab shows you the attributes.

Scroll to the bottom of the list to enter a new field. While you can always create a new field, in most cases, you can't change existing fields. Existing fields have a physical representation in your search service so they aren't -modifiable, not even in code. To fundamentally change an existing field, create a new index, which drops the original.

:::image type="content" source="media/search-get-started-portal/sample-index-def.png" alt-text="Screenshot of the sample index definition in Azure portal." border="true":::

Other constructs, such as scoring profiles and CORS options, can be added at any time.

To clearly understand what you can and can't edit during index design, take a minute to view index definition options. Grayed options indicate values that can't be modified or deleted. 


## <a name="query-index"></a> Query with Search explorer

You now have a search index that can be queried with [**Search explorer**](search-explorer.md). 

**Search explorer** sends REST calls that conform to the [Search Documents REST API](/rest/api/searchservice/search-documents). The tool supports [simple query syntax](/rest/api/searchservice/simple-query-syntax-in-azure-search) and [full Lucene query syntax](/rest/api/searchservice/lucene-query-syntax-in-azure-search).

1. Select **Search explorer**.

   :::image type="content" source="media/search-get-started-portal/search-explorer-cmd.png" alt-text="Screenshot of the Search Explorer command on the command bar." border="true":::

1. Under **Index**, select **hotels-sample-index**.

   :::image type="content" source="media/search-get-started-portal/search-explorer-changeindex.png" alt-text="Screenshot of the Index and API selection lists in Search Explorer." border="true":::

1. In the search bar, paste in a query string from the one of the examples in the following table, and select **Search**.

   :::image type="content" source="media/search-get-started-portal/search-explorer-query-string-example.png" alt-text="Screenshot of the query string text field and search button in Search Explorer." border="true":::


## Run more example queries

All of the queries in this section are designed for **Search Explorer** and the hotels-sample index. Results are returned as verbose JSON documents. All fields marked as "retrievable" in the index can appear in results. For more information about queries, see [Querying in Azure Cognitive Search](search-query-overview.md).

| Query | Description |
| --- | --- |
| `search=spa` | Simple full text query with top N results. The **`search=`** parameter is used for keyword search. In this quickstart, the query seeks hotel data that contains *spa* in any searchable field in the document. |
| `search=beach &$filter=Rating gt 4` | Filtered query. In this quickstart, the query seeks ratings greater than `4`. |
| `search=spa &$select=HotelName,Description,Tags &$count=true &$top=10` | Parameterized query. The **`&`** symbol is used to append search parameters, which can be specified in any order. </br>**`$select`** parameter returns a subset of fields for more concise search results. </br>**`$count=true`** parameter returns the total count of all documents that match the query. </br>**`$top=10`** returns the highest ranked 10 documents out of the total. By default, Azure Cognitive Search returns the first 50 best matches. You can increase or decrease the amount using this parameter. |
| `search=* &facet=Category &$top=2` | Facet query used to return an aggregated count of documents that match a facet value you provide. On an empty or unqualified search, all documents are represented. In the hotels-sample index, the Category field is marked as "facetable." |
| `search=spa &facet=Rating`| Facet on numeric values. This query is facet for rating, on a text search for "spa." The term "Rating" can be specified as a facet because the field is marked as retrievable, filterable, and facetable in the index. Its numeric values (1 through 5) are suitable for grouping results by each value. |
| `search=beach &highlight=Description &$select=HotelName, Description, Category, Tags` | Hit highlighting. In this quickstart, the term "beach" is highlighted when it appears in the "Description" field. |
| `search=seatle` followed by </br>`search=seatle~ &queryType=full` | Fuzzy search. By default, misspelled query terms like `seatle` for "Seattle" fail to return matches in typical search. The first example returns no results. Adding **`queryType=full`** invokes the full Lucene query parser, which supports the `~` operand for fuzzy search. |
| `$filter=geo.distance(Location, geography'POINT(-122.12 47.67)') le 5 &search=* &$select=HotelName, Address/City, Address/StateProvince &$count=true` | Geospatial search. The example query filters all results for positional data, where the results are less than 5 kilometers from a given point, as specified by latitude and longitude coordinates. In this quickstart, "Redmond, Washington" is the point of origin. |

## Clean up resources

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal under **All resources** or **Resource groups** link in the left pane.

If you're using a free service, remember that the limit is three indexes, indexers, and data sources. You can delete individual items in the Azure portal to stay under the limit. 

## Next steps

Try an Azure portal wizard to generate a ready-to-use web app that runs in a browser. Use this wizard on the small index you created in this quickstart, or use one of the built-in sample data sets for a richer search experience.

> [!div class="nextstepaction"]
> [Create a demo app in the portal](search-create-app-portal.md)
