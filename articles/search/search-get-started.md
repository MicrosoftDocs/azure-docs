<properties 
	pageTitle="Get started with Azure Search | Microsoft Azure | Cloud search service" 
	description="Get started with Azure Search, a cloud hosted search service on Microsoft Azure." 
	services="search" 
	documentationCenter="" 
	authors="HeidiSteen" 
	manager="mblythe" 
	editor=""
    tags="azure-portal"/>

<tags 
	ms.service="search" 
	ms.devlang="na" 
	ms.workload="search" 
	ms.topic="hero-article" 
	ms.tgt_pltfrm="na" 
	ms.date="02/08/2016" 
	ms.author="heidist"/>

# Get started with Azure Search in the Azure Portal

Microsoft Azure Search is a hosted cloud search service that you can use to add search functionality to custom applications. It provides the search engine and storage for your data, which you access and manage using the Azure Portal, a .NET SDK, or a REST API. This article is a code-free introduction to Azure Search, using capabilities built right into the portal.  

> [AZURE.NOTE] Completing this tutorial requires an [Azure subscription](../includes/free-trial-note.md) and an [Azure Search service](search-create-service-portal.md). If you aren't ready to sign up for a trial subscription, you can skip this tutorial and opt for [Try Azure App Service](search-tryappservice.md) instead. This alternative option gives you Azure Search with an ASP.NET Web app for free - one hour per session - no subscription required.
 
## Find your service dashboard

1. Sign in to the [Azure Portal](https://portal.azure.com).

2. Open the service dashboard of your Azure Search service. Here are a few ways to find the dashboard.
	- In the Jumpbar, click **Search services**. The Jumpbar lists every service provisioned in your subscription. If a search service has been defined, you'll see **Search services** in the list.
	- In the Jumpbar, click **Browse** and then type "search" in the search box to produce a list of all search services created in your subscriptions.

## Verify you have room for a new index and data source

Many customers start with the free edition. This edition is limited to three indexes, three data sources, and three indexers. Make sure you have room for extra items before starting this walkthrough.

## Create an index and load data

Search queries iterate over an *index* containing searchable data, metadata, and constructs used for optimizing certain search behaviors. As a first step, you will need to define and populate an index.

There are several ways to create an index. Approaches vary in how much automation or integration is offered. If you have usable data in a data store that Azure Search can crawl - such as Azure SQL Database, SQL Server on an Azure VM, or DocumentDB - you can create and populate an index very easily.

To keep this task simple, we'll assume a data source that Azure Search can crawl using one of its *indexers*. If you don't already have a SQL table or view or a DocumentDB database, you can create [a sample DocumentDB database](#apdx-sampledata) useful for completing this walkthrough.

> [AZURE.NOTE] Newly announced is indexer support for crawling Azure Blob Storage, but that feature is in preview and not yet a portal option. To try that indexer, you'll need to write code. See [Indexing Azure Blob storage in Azure Search](search-howto-indexing-azure-blob-storage.md) for more information.

#### Step 1: Define the data source

1. On your Azure Search service dashboard, click **Import data** to start a wizard that both creates and populates an index.

2. Click **Data Source** > **DocumentDB** > **Name**, type a name for the data source. This is a connection object in Azure Search that can be used with other indexers. Once you create it, it becomes available as an "existing data source" in your service.
3. Select your existing DocumentDB account, and the database and collection. If you're using the sample data we provide, your data source definition will look like this:

  	![][2]

Notice that we skipped the query. This is because we didn't create a change track field in our dataset this time around. If your dataset includes a field that keeps track of when a record is updated, you can configure an Azure Search indexer to use change tracking for selective updates to your index.

#### Step 2: Define the index

1. Click **Index** and take a look at the design surface for creating an Azure Search index. In our sample dataset, the Value array and ID field were detected automatically and added to the definition. Depending on how your data is structured, you might get better field detection.

  	![][3]

Checkboxes across the top of the field list are *index attributes* that control how the field is used. **Retrievable** means that it shows up in search results list. You can mark individual fields as off limits for search results, for example when fields only used in filter expressions. **Filterable**, **Sortable**, and **Facetable** determine whether a field can be used in a filter, a sort, or a facet navigation structure. **Searchable** means that a field is included in full text search. Numeric fields and Boolean fields are often marked as not searchable. 

2. Add the fields collection to your index. 
	
Field | Type | Options |
------|------|---------|
albumTitle | Edm.String | Retrievable, Searchable |
albumUrl | Edm.String | Retrievable, Searchable |
genre | Edm.String | Retrievable, Searchable, Filterable, Sortable, Facetable |
genreDescription | Edm.String | Retrievable, Searchable |
artistName | Edm.String | Retrievable, Searchable, Filterable, Sortable |
orderableOnline | Edm.Boolean | Retrievable, Filterable, Sortable, Facetable |
rating | Edm.Int32 | Retrievable, Filterable, Sortable, Facetable |
tags | Collection(Edm.String) | Retrievable, Filterable, Facetable |
price | Edm.Double | Retrievable, Filterable, Facetable |
margin | Edm.Int32 | |
inventory | Edm.Int32 | Retrievable |
lastUpdated | Edm.DateTimeOffset | |

As a point of comparison, the following screenshot is an illustration of an index built to the specification in the previous table.

  	![][4]

#### Step 3: Define the indexer

1. Still in the **Import data** wizard, click **Indexer** > **Name**, type a name for the indexer. This object defines an executable process. Once you create it, you can put it on recurring schedule, or invoke it from the Indexers list in your dashboard. Your import data entries should be all filled in and ready to go.

   ![][5]

2. To run the wizard, click **OK** to start the import.


## Query the index

Search Explorer is a built-in query tool that connects directly to your index. It provides a search box so that you can verify a search input returns the data you expect. Click Search Explorer on the command bar to see what search results come back.


## Next steps

After you run the wizard once, you can go back and modify individual components: index, indexer, or data source. Some edits, such as the changing the field data type, are not allowed on the index, but most properties and settings are modifiable.

To view individual components, click the **Index**, **Indexer**, or **Data Sources** tiles to display a list of existing objects.


<a id="apdx-sampledata"></a>
### Appendix: Get sample data into DocumentDB

This section creates a small database in DocumentDB that can be used to complete the tasks in this tutorial.

The following instructions are general guidance, but not exhaustive. Fortunately, most of the commands you'll use are in the service command bar at the top of the dashboard or in the database blade. If you need more help with DocumentDB portal navigation or tasks, please see DocumentDB documentation. 

   ![][1]

We provide three JSON data files for this dataset. Data is divided into three files to meet the upload requirements in Document Explorer. 

[Click here]() to get the files.

1. Add DocumentDB to your subscription and then open the service dashboard.
2. Click **Add Database** to create a new database with an id of `musicstoredb`. It will show up in a database list further down the page.
2. Click on the database name.
3. Click **Add Collection** to create a collection with an id of `musicstorecoll`.
3. Click **Document Explorer**.
4. Click **Add Documents**.
5. In **Add Document**, upload each of the following files:
	- musicstore-data1.json
	- musicstore-data2.json
	- musicstore-data3.json
6. Click **Query Explorer** to verify the data upload.
7. Modify the query to select the top 300 (there are less than 300 items in total), and then click **Run Query**.

You should get back JSON output, starting with document number 386 and ending with document 669.


<!--Image references-->
[1]: ./media/search-get-started/AzureSearch-GetStart-Docdbmenu1.png
[2]: ./media/search-get-started/AzureSearch-GetStart-DataSource.png
[3]: ./media/search-get-started/AzureSearch-GetStart-DefaultIndex.png
[4]: ./media/search-get-started/AzureSearch-GetStart-FinishedIndex.png
[5]: ./media/search-get-started/AzureSearch-GetStart-ImportReady.png
