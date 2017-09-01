---
title: "Tutorial: Create your first Azure Search index in the portal | Microsoft Docs"
description: In the Azure portal, use predefined sample data to generate an index. Explore full text search, filters, facets, fuzzy search, geosearch, and more.
services: search
documentationcenter: ''
author: HeidiSteen
manager: jhubbard
editor: ''
tags: azure-portal

ms.assetid: 21adc351-69bb-4a39-bc59-598c60c8f958
ms.service: search
ms.devlang: na
ms.workload: search
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.date: 06/26/2017
ms.author: heidist

---
# Tutorial: Create your first Azure Search index in the portal

In the Azure portal, start with a predefined sample dataset to quickly generate an index using the **Import data** wizard. Explore full text search, filters, facets, fuzzy search, and geosearch with **Search explorer**.  

This code-free introduction gets you started with predefined data so that you can write interesting queries right away. While portal tools are not a substitute for code, tools are useful for these tasks:

+ Hands on learning with minimal ramp-up
+ Prototype an index before you write code in **Import data**
+ Test queries and parser syntax in **Search explorer**
+ View an existing index published to your service and look up its attributes

**Time Estimate:** About 15 minutes, but longer if account or service sign-up is also required. 

Alternatively, ramp up using a [code-based introduction to programming Azure Search in .NET](search-howto-dotnet-sdk.md).

## Prerequisites

This tutorial assumes an [Azure subscription](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F) and [Azure Search service](search-create-service-portal.md). 

If you don't want to provision a service immediately, you can watch a 6-minute demonstration of the steps in this tutorial, starting at about three minutes into this [Azure Search Overview video](https://channel9.msdn.com/Events/Connect/2016/138).

## Find your service
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Open the service dashboard of your Azure Search service. If you didn't pin the service tile to your dashboard, you can find your service this way: 
   
   * In the Jumpbar, click **More services** at the bottom of the left navigation pane.
   * In the search box, type *search* to get a list of search services for your subscription. Your service should appear in the list. 

## Check for space
Many customers start with the free service. This version is limited to three indexes, three data sources, and three indexers. Make sure you have room for extra items before you begin. This tutorial creates one of each object. 

> [!TIP] 
> Tiles on the service dashboard show how many indexes, indexers, and data sources you already have. The Indexer tile shows success and failure indicators. Click the tile to view the indexer count. 
>
> ![Tiles for indexers and datasources][1]
>

## <a name="create-index"></a> Create an index and load data
Search queries iterate over an *index* containing searchable data, metadata, and constructs used for optimizing certain search behaviors.

To keep this task portal-based, we use a built-in sample dataset that can be crawled using an indexer via the **Import data** wizard. 

#### Step 1: Start the Import data wizard
1. On your Azure Search service dashboard, click **Import data** in the command bar to start a wizard that both creates and populates an index.
   
    ![Import data command][2]

2. In the wizard, click **Data Source** > **Samples** > **realestate-us-sample**. This data source is preconfigured with a name, type, and connection information. Once created, it becomes an "existing data source" that can be reused in other import operations.

    ![Select sample dataset][9]

3. Click **OK** to use it.

#### Step 2: Define the index
Creating an index is typically manual and code-based, but the wizard can generate an index for any data source it can crawl. Minimally, an index requires a name, and a fields collection, with one field marked as the document key to uniquely identify each document.

Fields have data types and attributes. The check boxes across the top are *index attributes* controlling how the field is used. 

* **Retrievable** means that it shows up in search results list. You can mark individual fields as off limits for search results by clearing this checkbox, for example when fields used only in filter expressions. 
* **Filterable**, **Sortable**, and **Facetable** determine whether a field can be used in a filter, a sort, or a facet navigation structure. 
* **Searchable** means that a field is included in full text search. Strings are searchable. Numeric fields and Boolean fields are often marked as not searchable. 

By default, the wizard scans the data source for unique identifiers as the basis for the key field. Strings are attributed as retrievable and searchable. Integers are attributed as retrievable, filterable, sortable, and facetable.

  ![Generated realestate index][3]

Click **OK** to create the index.

#### Step 3: Define the indexer
Still in the **Import data** wizard, click **Indexer** > **Name**, and type a name for the indexer. 

This object defines an executable process. You could put it on recurring schedule, but for now use the default option to run the indexer once, immediately, when you click **OK**.  

  ![realestate indexer][8]

## Check progress
To monitor data import, go back to the service dashboard, scroll down, and double-click the **Indexers** tile to open the indexers list. You should see the newly created indexer in the list, with status indicating "in progress" or success, along with the number of documents indexed.

   ![Indexer progress message][4]

## <a name="query-index"></a> Query the index
You now have a search index that's ready to query. **Search explorer** is a query tool built into the portal. It provides a search box so that you can verify whether search results are what you expect. 

> [!TIP]
> In the [Azure Search Overview video](https://channel9.msdn.com/Events/Connect/2016/138), the following steps are demonstrated at 6m08s into the video.
>

1. Click **Search explorer** on the command bar.

   ![Search explorer command][5]

2. Click **Change index** on the command bar to switch to *realestate-us-sample*.

   ![Index and API commands][6]

3. Click **Set API version** on the command bar to see which REST APIs are available. Preview APIs give you access to new features not yet generally released. For the queries below, use the generally available version (2016-09-01) unless directed. 

    > [!NOTE]
    > [Azure Search REST API](https://docs.microsoft.com/rest/api/searchservice/search-documents) and the [.NET library](search-howto-dotnet-sdk.md#core-scenarios) are fully equivalent, but **Search explorer** is only equipped to handle REST calls. It accepts syntax for both [simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search) and [full Lucene query parser](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search), plus all the search parameters available in [Search Document](https://docs.microsoft.com/rest/api/searchservice/search-documents) operations.
    > 

4. In the search bar, enter the query strings below and click **Search**.

  ![Search query example][7]

**`search=seattle`**

+ The `search` parameter is used to input a keyword search for full text search, in this case, returning listings in King County, Washington state, containing *Seattle* in any searchable field in the document. 

+ **Search explorer** returns results in JSON, which is verbose and hard to read if documents have a dense structure. Depending on your documents, you might need to write code that handles search results to extract important elements. 

+ Documents are composed of all fields marked as retrievable in the index. To view index attributes in the portal, click *realestate-us-sample* in the **Indexes** tile.

**`search=seattle&$count=true&$top=100`**

+ The `&` symbol is used to append search parameters, which can be specified in any order. 

+  The `$count=true` parameter returns a count for the sum of all documents returned. You can verify filter queries by monitoring changes reported by `$count=true`. 

+ The `$top=100` returns the highest ranked 100 documents out of the total. By default, Azure Search returns the first 50 best matches. You can increase or decrease the amount via `$top`.

**`search=*&facet=city&$top=2`**

+ `search=*` is an empty search. Empty searches search over everything. One reason for submitting an empty query is to  filter or facet over the complete set of documents. For example, you want a faceting navigation structure to consist of all cities in the index.

+  `facet` returns a navigation structure that you can pass to a UI control. It returns categories and a count. In this case, categories are based on the number of cities. There is no aggregation in Azure Search, but you can approximate aggregation via `facet`, which gives a count of documents in each category.

+ `$top=2` brings back two documents, illustrating that you can use `top` to both reduce or increase results.

**`search=seattle&facet=beds`**

+ This query is facet for beds, on a text search for *Seattle*. `"beds"` can be specified as a facet because the field is marked as retrievable, filterable, and facetable in the index, and the values it contains (numeric, 1 through 5), are suitable for categorizing listings into groups (listings with 3 bedrooms, 4 bedrooms). 

+ Only filterable fields can be faceted. Only retrievable fields can be returned in the results.

**`search=seattle&$filter=beds gt 3`**

+ The `filter` parameter returns results matching the criteria you provided. In this case, bedrooms greater than 3. 

+ Filter syntax is an OData construction. For more information, see [Filter OData syntax](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search).

**`search=granite countertops&highlight=description`**

+ Hit highlighting refers to formatting on text matching the keyword, given matches are found in a specific field. If your search term is deeply buried in a description, you can add hit highlighting to make it easier to spot. In this case, the formatted phrase `"granite countertops"` is easier to see in the description field.

**`search=mice&highlight=description`**

+ Full text search finds word forms with similar semantics. In this case, search results contain highlighted text for "mouse", for homes that have mouse infestation, in response to a keyword search on "mice". Different forms of the same word can appear in results because of linguistic analysis. 

+ Azure Search supports 56 analyzers from both Lucene and Microsoft. The default used by Azure Search is the standard Lucene analyzer. 

**`search=samamish`**

+ Misspelled words, like 'samamish' for the Samammish plateau in the Seattle area, fail to return matches in typical search. To handle misspellings, you can use fuzzy search, described in the next example.

**`search=samamish~&queryType=full`**

+ Fuzzy search is enabled when you specify the `~` symbol and use the full query parser, which interprets and correctly parses the `~` syntax. 

+ Fuzzy search is available when you opt in for the full query parser, which occurs when you set `queryType=full`. For more information about query scenarios enabled by the full query parser, see [Lucene query syntax in Azure Search](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search).

+ When `queryType` is unspecified, the default simple query parser is used. The simple query parser is faster, but if you require fuzzy search, regular expressions, proximity search, or other advanced query types, you will need the full syntax. 

**`search=*&$count=true&$filter=geo.distance(location,geography'POINT(-122.121513 47.673988)') le 5`**

+ Geospatial search is supported through the [edm.GeographyPoint data type](https://docs.microsoft.com/rest/api/searchservice/supported-data-types) on a field containing coordinates. Geosearch is a type of filter, specified in [Filter OData syntax](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search). 

+ The example query filters all results for positional data, where results are less than 5 kilometers from a given point (specified as latitude and longitude coordinates). By adding `$count`, you can see how many results are returned when you change either the distance or the coordinates. 

+ Geospatial search is useful if your search application has a 'find near me' feature or uses map navigation. It is not full text search, however. If you have user requirements for searching on a city or country by name, add fields containing city or country names, in addition to coordinates.

## Next steps

+ Modify any of the objects you just created. After you run the wizard once, you can go back and view or modify individual components: index, indexer, or data source. Some edits, such as the changing the field data type, are not allowed on the index, but most properties and settings are modifiable.

  To view individual components, click the **Index**, **Indexer**, or **Data Sources** tiles on your dashboard to display a list of existing objects. To learn more about index edits that do not require a rebuild, see [Update Index (Azure Search REST API)](https://docs.microsoft.com/rest/api/searchservice/update-index).

+ Try the tools and steps with other data sources. The sample dataset, `realestate-us-sample`, is from an Azure SQL Database that Azure Search can crawl. Besides Azure SQL Database, Azure Search can crawl and infer an index from flat data structures in Azure Table storage, Blob storage, SQL Server on an Azure VM, and Azure Cosmos DB. All of these data sources are supported in the wizard. In code, you can populate an index easily using an *indexer*.

+ All other non-indexer data sources are supported via a push model, where your code pushes new and changed rowsets in JSON to your index. For more information, see [Add, update, or delete documents in Azure Search](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents).

Learn more about other features mentioned in this article by visiting these links:

* [Indexers overview](search-indexer-overview.md)
* [Create Index (includes a detailed explanation of the index attributes)](https://docs.microsoft.com/rest/api/searchservice/create-index)
* [Search Explorer](search-explorer.md)
* [Search Documents (includes examples of query syntax)](https://docs.microsoft.com/rest/api/searchservice/search-documents)


<!--Image references-->
[1]: ./media/search-get-started-portal/tiles-indexers-datasources2.png
[2]: ./media/search-get-started-portal/import-data-cmd2.png
[3]: ./media/search-get-started-portal/realestateindex2.png
[4]: ./media/search-get-started-portal/indexers-inprogress2.png
[5]: ./media/search-get-started-portal/search-explorer-cmd2.png
[6]: ./media/search-get-started-portal/search-explorer-changeindex-se2.png
[7]: ./media/search-get-started-portal/search-explorer-query2.png
[8]: ./media/search-get-started-portal/realestate-indexer2.png
[9]: ./media/search-get-started-portal/import-datasource-sample2.png