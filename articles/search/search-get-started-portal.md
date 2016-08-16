<properties 
	pageTitle="Get started with Azure Search | Microsoft Azure | Get started Azure Search | DocumentDB | Cloud search service" 
	description="Create your first Azure Search solution using this tutorial walkthrough. Learn how to create an Azure Search index using DocumentDB data. This is a portal-based, code-free exercise using the Import Data wizard." 
	services="search" 
	documentationCenter="" 
	authors="HeidiSteen" 
	manager="paulettm" 
	editor=""
    tags="azure-portal"/>

<tags 
	ms.service="search" 
	ms.devlang="na" 
	ms.workload="search" 
	ms.topic="hero-article" 
	ms.tgt_pltfrm="na" 
	ms.date="05/17/2016" 
	ms.author="heidist"/>

# Get started with Azure Search in the portal

This code-free introduction gets you started with Microsoft Azure Search using capabilities built right into the portal. 

The tutorial assumes a [sample Azure DocumentDB database](#apdx-sampledata) that's simple to create using our data and instructions, but you can also adapt these steps to your existing data in either DocumentDB or SQL Database.

> [AZURE.NOTE] This Get Started tutorial requires an [Azure subscription](../../includes/free-trial-note.md) and an [Azure Search service](search-create-service-portal.md). 
 
## Find your service

1. Sign in to the [Azure Portal](https://portal.azure.com).

2. Open the service dashboard of your Azure Search service. Here are a few ways to find the dashboard.
	- In the Jumpbar, click **Search services**. The Jumpbar lists every service provisioned in your subscription. If a search service has been defined, you'll see **Search services** in the list.
	- In the Jumpbar, click **Browse** and then type "search" in the search box to produce a list of all search services created in your subscriptions.

## Check for space

Many customers start with the free service. This version is limited to three indexes, three data sources, and three indexers. Make sure you have room for extra items before you begin. This walkthrough will create one of each object.

## Create an index and load data

Search queries iterate over an *index* containing searchable data, metadata, and constructs used for optimizing certain search behaviors. As a first step, you'll define and populate an index.

There are several ways to create an index. If your data is in a store that Azure Search can crawl - such as Azure SQL Database, SQL Server on an Azure VM, or DocumentDB - you can create and populate an index very easily using an *indexer*.

To keep this task portal-based, we'll assume data from DocumentDB that can be crawled using an indexer via the **Import data** wizard. 

Before you continue, create a [sample DocumentDB database](#apdx-sampledata) to use with this tutorial, and then return to this section to complete the steps below.

<a id="defineDS"></a>
#### Step 1: Define the data source

1. On your Azure Search service dashboard, click **Import data** in the command bar to start a wizard that both creates and populates an index.

  ![][7]

2. In the wizard, click **Data Source** > **DocumentDB** > **Name**, type a name for the data source. A data source is a connection object in Azure Search that can be used with other indexers. Once you create it, it becomes available as an "existing data source" in your service.

3. Choose your existing DocumentDB account, and the database and collection. If you're using the sample data we provide, your data source definition will look like this:

  ![][2]

Notice that we are skipping the query. This is because we're not implementing change tracking in our dataset this time around. If your dataset includes a field that keeps track of when a record is updated, you can configure an Azure Search indexer to use change tracking for selective updates to your index.

Click **OK** to complete this step of the wizard.

#### Step 2: Define the index

Still in the wizard, click **Index** and take a look at the design surface used to create an Azure Search index. Minimally, an index requires a name, and a fields collection, with one field marked as the document key. Because we're using a DocumentDB data set, fields are detected by the wizard automatically and the index is preloaded with fields and data type assignments. 

  ![][3]

Although the fields and data types are configured, you still need to assign attributes. The check boxes across the top of the field list are *index attributes* that control how the field is used. 

- **Retrievable** means that it shows up in search results list. You can mark individual fields as off limits for search results by clearing this checkbox, for example when fields used only in filter expressions. 
- **Filterable**, **Sortable**, and **Facetable** determine whether a field can be used in a filter, a sort, or a facet navigation structure. 
- **Searchable** means that a field is included in full text search. Strings are usually searchable. Numeric fields and Boolean fields are often marked as not searchable. 

Before you leave this page, mark the fields in your index to use the following options (Retrievable, Searchable, and so on). Most fields are Retrievable. Most string fields are Searchable (you don't need to make the Key searchable). A few fields like genre, orderableOnline, rating, and tags are also Filterable, Sortable, and Facetable. 
	
Field | Type | Options |
------|------|---------|
id | Edm.String | |
albumTitle | Edm.String | Retrievable, Searchable |
albumUrl | Edm.String | Retrievable, Searchable |
genre | Edm.String | Retrievable, Searchable, Filterable, Sortable, Facetable |
genreDescription | Edm.String | Retrievable, Searchable |
artistName | Edm.String | Retrievable, Searchable |
orderableOnline | Edm.Boolean | Retrievable, Filterable, Sortable, Facetable |
tags | Collection(Edm.String) | Retrievable, Filterable, Facetable |
price | Edm.Double | Retrievable, Filterable, Facetable |
margin | Edm.Int32 | |
rating | Edm.Int32 | Retrievable, Filterable, Sortable, Facetable |
inventory | Edm.Int32 | Retrievable |
lastUpdated | Edm.DateTimeOffset | |

As a point of comparison, the following screenshot is an illustration of an index built to the specification in the previous table.

 ![][4]

Click **OK** to complete this step of the wizard.

#### Step 3: Define the indexer

Still in the **Import data** wizard, click **Indexer** > **Name**, type a name for the indexer, and use defaults for all the other values. This object defines an executable process. Once you create it, you could put it on recurring schedule, but for now use the default option to run the indexer once, immediately, when you click **OK**. 

Your import data entries should be all filled in and ready to go.

  ![][5]

To run the wizard, click **OK** to start the import and close the wizard.

## Check progress

To check progress, go back to the service dashboard, scroll down, and double-click the **Indexers** tile to open the indexers list. You should see the indexer you just created in the list, and you should see status indicating "in progress" or success, along with the number of documents indexed into Azure Search.

  ![][6]

## Query the index

You now have a search index that's ready to query. 

**Search explorer** is a query tool built into the portal. It provides a search box so that you can verify a search input returns the data you expect. 

1. Click **Search explorer** on the command bar.
2. Notice which index is active. If it's not the one you just created, click **Change index** on the command bar to select the one you want.
2. Leave the search box empty and then click the **Search** button to execute a wildcard search that returns all documents.
3. Enter a few full-text search queries. You can review the results from your wildcard search to get familiar with artists, albums, and genres to query.
4. Try other query syntax using the [examples provided at the end of this article](https://msdn.microsoft.com/library/azure/dn798927.aspx) for ideas, modifying your query to use search strings that are likely to be found in your index.

## Next steps

After you run the wizard once, you can go back and view or modify individual components: index, indexer, or data source. Some edits, such as the changing the field data type, are not allowed on the index, but most properties and settings are modifiable. To view individual components, click the **Index**, **Indexer**, or **Data Sources** tiles on your dashboard to display a list of existing objects.

To learn more about other features mentioned in this article, visit these links:

- [Indexers](search-indexer-overview.md)
- [Create Index (includes a detailed explanation of the index attributes)](https://msdn.microsoft.com/library/azure/dn798941.aspx)
- [Search Explorer](search-explorer.md)
- [Search Documents (includes examples of query syntax)](https://msdn.microsoft.com/library/azure/dn798927.aspx)

You can try this same workflow, using the Import data wizard for other data sources like Azure SQL Database or SQL Server on Azure virtual machines.

> [AZURE.NOTE] Newly announced is indexer support for crawling Azure Blob Storage, but that feature is in preview and not yet a portal option. To try that indexer, you'll need to write code. See [Indexing Azure Blob storage in Azure Search](search-howto-indexing-azure-blob-storage.md) for more information.
<a id="apdx-sampledata"></a>


## Appendix: Create sample data in DocumentDB

This section creates a small database in DocumentDB that can be used to complete the tasks in this tutorial.

The following instructions give you general guidance, but are not exhaustive. If you need more help with DocumentDB portal navigation or tasks, you can refer to DocumentDB documentation, but most of the commands you'll need are either in the service command bar at the top of the dashboard or in the database blade. 

  ![][1]

### Create musicstoredb for this tutorial

1. [Click here](https://github.com/HeidiSteen/azure-search-get-started-sample-data) to download a ZIP file containing the music store JSON data files. We provide 246 JSON documents for this dataset.
2. Add DocumentDB to your subscription and then open the service dashboard.
2. Click **Add Database** to create a new database with an id of `musicstoredb`. It will show up in the database tile further down the page after it's created.
2. Click on the database name to open the database blade.
3. Click **Add Collection** to create a collection with an id of `musicstorecoll`.
3. Click **Document Explorer**.
4. Click **Upload**.
5. In **Upload Document**, navigate to the local folder that contains the JSON files you downloaded previously. Select JSON files in batches of 100 or fewer.
	- 386.json
	- 387.json
	- . . .
	- 486.json
6. Repeat to get the next batch of files until you've uploaded the last one, 669.json.
7. Click **Query Explorer** to verify the data is uploaded to meet the upload requirements of Document Explorer.

An easy way to do this is to use the default query, but you can alos modify the default query so that it selects the top 300 (there are fewer than 300 items in this dataset).

You should get back JSON output, starting with document number 386, and ending with document 669. Once the data is loaded, you can [return to the steps in this walkthrough](#defineDS) to build an index using the  **Import data wizard**.


<!--Image references-->
[1]: ./media/search-get-started-portal/AzureSearch-GetStart-Docdbmenu1.png
[2]: ./media/search-get-started-portal/AzureSearch-GetStart-DataSource.png
[3]: ./media/search-get-started-portal/AzureSearch-GetStart-DefaultIndex.png
[4]: ./media/search-get-started-portal/AzureSearch-GetStart-FinishedIndex.png
[5]: ./media/search-get-started-portal/AzureSearch-GetStart-ImportReady.png
[6]: ./media/search-get-started-portal/AzureSearch-GetStart-IndexerList.png
[7]: ./media/search-get-started-portal/search-data-import-wiz-btn.png
