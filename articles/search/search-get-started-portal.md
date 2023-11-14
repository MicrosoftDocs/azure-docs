---
title: "Quickstart: Create a search index in the Azure portal"
titleSuffix: Azure AI Search
description: Learn how to create, load, and query your first search index by using the Import Data wizard in the Azure portal. This quickstart uses a fictitious hotel dataset for sample data.
manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.date: 09/01/2023
ms.custom:
  - mode-ui
  - ignite-2023
---

# Quickstart: Create a search index in the Azure portal

In this Azure AI Search quickstart, you create your first _search index_ by using the [**Import data** wizard](search-import-data-portal.md) and a built-in sample data source consisting of fictitious hotel data. The wizard guides you through the creation of a search index to help you write interesting queries within minutes. 

Search queries iterate over an index that contains searchable data, metadata, and other constructs that optimize certain search behaviors. An indexer is a source-specific crawler that can read metadata and content from supported Azure data sources. Normally, indexers are created programmatically. In the Azure portal, you can create them through the **Import data** wizard. For more information, see [Indexes in Azure AI Search](search-what-is-an-index.md) and [Indexers in Azure AI Search](search-indexer-overview.md) .

> [!NOTE]
> The **Import data** wizard includes options for AI enrichment that aren't reviewed in this quickstart. You can use these options to extract text and structure from image files and unstructured text. For a similar walkthrough that includes AI enrichment, see [Quickstart: Create a skillset in the Azure portal](cognitive-search-quickstart-blob.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

- An Azure AI Search service for any tier and any region. [Create a service](search-create-service-portal.md) or [find an existing service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart. 

### Check for space

Many customers start with the free service. The free tier is limited to three indexes, three data sources, and three indexers. Make sure you have room for extra items before you begin. This quickstart creates one of each object.

Check the **Overview** page for the service to see how many indexes, indexers, and data sources you already have. 

:::image type="content" source="media/search-get-started-portal/overview-quota-usage.png" alt-text="Screenshot of the Overview page for an Azure AI Search service instance in the Azure portal, showing the number of indexes, indexers, and data sources." lightbox="media/search-get-started-portal/overview-quota-usage.png" border="false":::

## Create and load an index

Azure AI Search uses an indexer by using the **Import data** wizard. The hotels-sample data set is hosted on Microsoft on Azure Cosmos DB and accessed over an internal connection. You don't need your own Azure Cosmos DB account or source files to access the data.

### Start the wizard

To get started, browse to your Azure AI Search service in the Azure portal and open the **Import data** wizard.

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account, and go to your Azure AI Search service.

1. On the **Overview** page, select **Import data** to create and populate a search index.

   :::image type="content" source="media/search-import-data-portal/import-data-cmd.png" alt-text="Screenshot that shows how to open the Import data wizard in the Azure portal.":::

   The **Import data** wizard opens.

### Connect to a data source

The next step is to connect to a data source to use for the search index.

1. In the **Import data** wizard on the **Connect to your data** tab, expand the **Data Source** dropdown list and select **Samples**.

1. In the list of built-in samples, select **hotels-sample**.

   :::image type="content" source="media/search-get-started-portal/import-hotels-sample.png" alt-text="Screenshot that shows how to select the hotels-sample data source in the Import data wizard." border="false":::

   In this quickstart, you use a built-in data source. If you want to create your own data source, you need to specify a name, type, and connection information. After you create a data source, it can be reused in other import operations.

1. Select **Next: Add cognitive skills (Optional)** to continue.

### Skip configuration for cognitive skills

The **Import data** wizard supports the creation of an AI-enrichment pipeline for incorporating the Azure AI services algorithms into indexing. For more information, see [AI enrichment in Azure AI Search](cognitive-search-concept-intro.md).

1. For this quickstart, ignore the AI enrichment configuration options on the **Add cognitive skills** tab.

1. Select **Skip to: Customize target index** to continue.

   :::image type="content" source="media/search-get-started-portal/skip-cognitive-skills.png" alt-text="Screenshot that shows how to Skip to the Customize target index tab in the Import data wizard.":::

> [!TIP]
> If you want to try an AI-indexing example, see the following articles:
> - [Quickstart: Create a skillset in the Azure portal](cognitive-search-quickstart-blob.md)
> - [Tutorial: Use REST and AI to generate searchable content from Azure blobs](cognitive-search-tutorial-blob.md)

### Configure the index

The Azure AI Search service generates a schema for the built-in hotels-sample index. Except for a few advanced filter examples, queries in the documentation and samples that target the hotels-sample index run on this index definition. The definition is shown on the **Customize target index** tab in the **Import data** wizard:

:::image type="content" source="media/search-get-started-portal/hotels-sample-generated-index.png" alt-text="Screenshot that shows the generated index definition for the hotels-sample data source in the Import data wizard." border="false":::

Typically, in a code-based exercise, index creation is completed prior to loading data. The **Import data** wizard condenses these steps by generating a basic index for any data source it can crawl.

At a minimum, the index requires an **Index name** and a collection of **Fields**. One field must be marked as the _document key_ to uniquely identify each document. The index **Key** provides the unique document identifier. The value is always a string. If you want autocomplete or suggested queries, you can specify language **Analyzers** or **Suggesters**.

Each field has a name, data type, and _attributes_ that control how to use the field in the search index. The **Customize target index** tab uses checkboxes to enable or disable the following attributes for all fields or specific fields:

- **Retrievable**: Include the field contents in the search index.
- **Filterable**: Allow the field contents to be used as filters for the search index.
- **Sortable**: Make the field contents available for sorting the search index.
- **Facetable**: Use the field contents for faceted navigation structure.
- **Searchable**: Include the field contents in full text search. Strings are searchable. Numeric fields and Boolean fields are often marked as not searchable.

The storage requirements for the index can vary as a result of attribute selection. For example, enabling a field as **Filterable** requires more storage, but enabling a field as **Retrievable** doesn't. For more information, see [Example demonstrating the storage implications of attributes and suggesters](search-what-is-an-index.md#example-demonstrating-the-storage-implications-of-attributes-and-suggesters).

By default, the **Import data** wizard scans the data source for unique identifiers as the basis for the **Key** field. Strings are attributed as **Retrievable** and **Searchable**. Integers are attributed as **Retrievable**, **Filterable**, **Sortable**, and **Facetable**.

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

## Monitor indexer progress

After you complete the **Import data** wizard, you can monitor creation of the indexer or index. The service **Overview** page provides links to the resources created in your Azure AI Search service.

1. Go to the **Overview** page for your Azure AI Search service in the Azure portal.

1. Select **Usage** to see the summary details for the service resources.

1. In the **Indexers** box, select **View indexers**.

   :::image type="content" source="media/search-get-started-portal/view-indexers.png" alt-text="Screenshot that shows how to check the status of the indexer creation process in the Azure portal." lightbox="media/search-get-started-portal/view-indexers.png":::

   It can take a few minutes for the page results to update in the Azure portal. You should see the newly created indexer in the list with a status of _In progress_ or _Success_. The list also shows the number of documents indexed.

   :::image type="content" source="media/search-get-started-portal/indexers-status.png" alt-text="Screenshot that shows the creation of the indexer in progress in the Azure portal.":::

## Check search index results

On the **Overview** page for the service, you can do a similar check for the index creation.

1. In the **Indexes** box, select **View indexes**.

   Wait for the Azure portal page to refresh. You should see the index with a document count and storage size.

   :::image type="content" source="media/search-get-started-portal/indexes-list.png" alt-text="Screenshot of the Indexes list on the Azure AI Search service dashboard in the Azure portal.":::

1. To view the schema for the new index, select the index name, **hotels-sample-index**. 

1. On the **hotels-sample-index** index page, select the **Fields** tab to view the index schema.
   
   If you're writing queries and need to check whether a field is **Filterable** or **Sortable**, use this tab to see the attribute settings.

   :::image type="content" source="media/search-get-started-portal/index-schema-definition.png" alt-text="Screenshot that shows the schema definition for an index in the Azure AI Search service in the Azure portal.":::

## Add or change fields

On the **Fields** tab, you can create a new field for a schema definition with the **Add field** option. Specify the field name, the data type, and attribute settings.
   
While you can always create a new field, in most cases, you can't change existing fields. Existing fields have a physical representation in your search service so they aren't modifiable, not even in code. To fundamentally change an existing field, you need to create a new index, which replaces the original. Other constructs, such as scoring profiles and CORS options, can be added at any time.

To clearly understand what you can and can't edit during index design, take a minute to view the index definition options. Grayed options in the field list indicate values that can't be modified or deleted.

## <a name="query-index"></a> Query with Search explorer

You now have a search index that can be queried with the **Search explorer** tool in Azure AI Search. **Search explorer** sends REST calls that conform to the [Search Documents REST API](/rest/api/searchservice/search-documents). The tool supports [simple query syntax](/rest/api/searchservice/simple-query-syntax-in-azure-search) and [full Lucene query syntax](/rest/api/searchservice/lucene-query-syntax-in-azure-search).

You can access the tool from the **Search explorer** tab on the index page and from the **Overview** page for the service.

1. Go to the **Overview** page for your Azure AI Search service in the Azure portal, and select **Search explorer**.

   :::image type="content" source="media/search-get-started-portal/open-search-explorer.png" alt-text="Screenshot that shows how to open the Search Explorer tool from the Overview page for the Azure AI Search service in the Azure portal.":::

1. In the **Index** dropdown list, select the new index, **hotels-sample-index**.

   :::image type="content" source="media/search-get-started-portal/search-explorer-change-index.png" alt-text="Screenshot that shows how to select an index in the Search Explorer tool in the Azure portal.":::

   The **Request URL** box updates to show the link target with the selected index and API version.

1. In the **Query string** box, enter a query string.

   For this quickstart, you can choose a query string from the examples provided in the [Run more example queries](#run-more-example-queries) section. The following example uses the query `search=beach &$filter=Rating gt 4`.

   :::image type="content" source="media/search-get-started-portal/search-explorer-query-string.png" alt-text="Screenshot that shows how to enter and run a query in the  Search Explorer tool.":::

   To change the presentation of the query syntax, use the **View** dropdown menu to switch between **Query view** and **JSON view**. 

1. Select **Search** to run the query.

   The **Results** box updates to show the query results. For long results, use the **Mini-map** for the **Results** box to jump quickly to nonvisible areas of the output.

   :::image type="content" source="media/search-get-started-portal/search-explorer-query-results.png" alt-text="Screenshot that shows long results for a query in the Search Explorer tool and the mini-map.":::

For more information, see [Quickstart: Use Search explorer to run queries in the Azure portal](search-explorer.md).

## Run more example queries

The queries in the following table are designed for searching the hotels-sample index with **Search Explorer**. The results are returned as verbose JSON documents. All fields marked as **Retrievable** in the index can appear in the results.

| Query syntax | Query type | Description | Results |
| --- | --- | --- | --- |
| `search=spa` | Full text query | The `search=` parameter searches for specific keywords. | The query seeks hotel data that contains the keyword `spa` in any searchable field in the document. |
| `search=beach &$filter=Rating gt 4` | Filtered query | The `filter` parameter filters on the supplied conditions. | The query seeks beach hotels with a rating value greater than four. |
| `search=spa &$select=HotelName,Description,Tags &$count=true &$top=10` | Parameterized query | The ampersand symbol `&` appends search parameters, which can be specified in any order. <br> - The `$select` parameter returns a subset of fields for more concise search results. <br> - The `$count=true` parameter returns the total count of all documents that match the query. <br> - The `$top` parameter returns the specified number of highest ranked documents out of the total. | The query seeks the top 10 spa hotels and displays their names, descriptions, and tags. <br><br> By default, Azure AI Search returns the first 50 best matches. You can increase or decrease the amount by using this parameter. | 
| `search=* &facet=Category &$top=2` | Facet query on a string value | The `facet` parameter returns an aggregated count of documents that match the specified field. <br> - The specified field must be marked as **Facetable** in the index. <br> - On an empty or unqualified search, all documents are represented. | The query seeks the aggregated count for the `Category` field and displays the top 2. |
| `search=spa &facet=Rating`| Facet query on a numeric value | The `facet` parameter returns an aggregated count of documents that match the specified field. <br> - Although the `Rating` field is a numeric value, it can be specified as a facet because it's marked as **Retrievable**, **Filterable**, and **Facetable** in the index. | The query seeks spa hotels for the `Rating` field data. The `Rating` field has numeric values (1 through 5) that are suitable for grouping results by each value. |
| `search=beach &highlight=Description &$select=HotelName, Description, Category, Tags` | Hit highlighting | The `highlight` parameter applies highlighting to matching instances of the specified keyword in the document data. | The query seeks and highlights instances of the keyword `beach` in the `Description` field, and displays the corresponding hotel names, descriptions, category, and tags. |
| Original: `search=seatle` <br><br> Adjusted: `search=seatle~ &queryType=full` | Fuzzy search | By default, misspelled query terms like `seatle` for `Seattle` fail to return matches in a typical search. The `queryType=full` parameter invokes the full Lucene query parser, which supports the tilde `~` operand. When these parameters are present, the query performs a fuzzy search for the specified keyword. The query seeks matching results along with results that are similar to but not an exact match to the keyword. | The original query returns no results because the keyword `seatle` is misspelled. <br><br> The adjusted query invokes the full Lucene query parser to match instances of the term `seatle~`. |
| `$filter=geo.distance(Location, geography'POINT(-122.12 47.67)') le 5 &search=* &$select=HotelName, Address/City, Address/StateProvince &$count=true` | Geospatial search | The `$filter=geo.distance` parameter filters all results for positional data based on the specified `Location` and `geography'POINT` coordinates. | The query seeks hotels that are within 5 kilometers of the latitude longitude coordinates `-122.12 47.67`, which is "Redmond, Washington, USA." The query displays the total number of matches `&$count=true` with the hotel names and address locations. |

Take a minute to try a few of these example queries for your index. For more information about queries, see [Querying in Azure AI Search](search-query-overview.md).

## Clean up resources

When you work in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources for your service in the Azure portal under **All resources** or **Resource groups** in the left pane.

If you use a free service, remember that the limit is three indexes, indexers, and data sources. You can delete individual items in the Azure portal to stay under the limit. 

## Next steps

Try an Azure portal wizard to generate a ready-to-use web app that runs in a browser. Use this wizard on the small index you created in this quickstart, or use one of the built-in sample data sets for a richer search experience.

> [!div class="nextstepaction"]
> [Create a demo app in the portal](search-create-app-portal.md)
