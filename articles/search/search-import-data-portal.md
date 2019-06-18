---
title: Import data into a search index using Azure portal - Azure Search
description: Learn how to use the Import Data wizard in the Azure portal to crawl Azure data from Cosmos DB, Blob storage, table storage, SQL Database, and SQL Server on Azure VMs.
author: HeidiSteen
manager: cgronlun
services: search
ms.service: search
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: heidist
ms.custom: seodec2018
---
# Import data wizard for Azure Search

The Azure portal provides an **Import data** wizard on the Azure Search dashboard for loading data into an index. Behind the scenes, the wizard configures and invokes a *data source*, *index*, and *indexer* - automating several steps of the indexing process: 

* Connects to an external data source in the same Azure subscription.
* Optionally, integrates optical character recognition or natural language processing for extracting text from unstructured data.
* Generates an index based on data sampling and metadata of the external data source.
* Crawls the data source for searchable content, serializing and loading JSON documents into the index.

The wizard can't connect to a predefined index or run an existing indexer, but within the wizard, you can configure a new index or indexer to support the structure and behaviors you need.

New to Azure Search? Step through the [Quickstart: Import, index, and query using portal tools](search-get-started-portal.md) to test-drive importing and indexing using **Import data** and the built-in real estate sample data set.

## Start importing data

This section explains how to start the wizard and provides a high-level overview of each step.

1. In the [Azure portal](https://portal.azure.com), open the search service page from the dashboard or [find your service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) in the service list.

2. In the service overview page at the top, click **Import data**.

   ![Import data command in portal](./media/search-import-data-portal/import-data-cmd2.png "Start the Import data wizard")

   > [!NOTE]
   > You can launch **Import data** from other Azure services, including Azure Cosmos DB, Azure SQL Database, and Azure Blob storage. Look for **Add Azure Search** in the left-navigation pane on the service overview page.

3. The wizard opens to **Connect to your data**, where you can choose an external data source to use for this import. There are several things to know about this step, so be sure to read the [Data source inputs](#data-source-inputs) section for more details.

   ![Import data wizard in portal](./media/search-import-data-portal/import-data-wizard-startup.png "Import data wizard for Azure Search")

4. Next is **Add cognitive search**, in case you want to include optical character recognition (OCR) of text in image files, or text analysis over unstructured data. AI algorithms from Cognitive Services are pulled in for this task. There are two parts to this step:
  
   First, [attach a Cognitive Services resource](cognitive-search-attach-cognitive-services.md) to an Azure Search skillset.
  
   Second, choose which AI enrichments to include in the skillset. For a walkthrough demonstration, see this [Quickstart](cognitive-search-quickstart-blob.md).

   If you just want to import data, skip this step and go directly to index definition.

5. Next is **Customize target index**, where you can accept or modify the index schema presented in the wizard. The wizard infers the fields and datatypes by sampling data and reading metadata from the external data source.

   For each field, [check the index attributes](#index-definition) to enable specific behaviors. If you don't select any attributes, your index won't be usable. 

6. Next is **Create an indexer**, which is a product of this wizard. An indexer is a crawler that extracts searchable data and metadata from an external Azure data source. By selecting the data source and attaching skillsets (optional) and an index, you've been configuring an indexer as you move through each step of the wizard.

   Give the indexer a name, and click **Submit** to begin the import process. 

You can monitor indexing in the portal by clicking the indexer in the **Indexers** list. As documents are loaded, the document count will grow for the index you have defined. Sometimes it takes a few minutes for the portal page to pick up the most recent updates.

The index is ready to query as soon as the first document is loaded. You can use [Search explorer](search-explorer.md) for this task.

<a name="data-source-inputs"></a>

## Data source inputs

The **Import data** wizard creates a persistent data source object specifying connection information to an external data source. The data source object is used exclusively with [indexers](search-indexer-overview.md) and can be created for the following data sources: 

* [Azure SQL](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
* [Azure Cosmos DB](search-howto-index-cosmosdb.md)
* [Azure Blob Storage](search-howto-indexing-azure-blob-storage.md)
* [Azure Table Storage](search-howto-indexing-azure-tables.md) (not supported for [cognitive search](cognitive-search-concept-intro.md) pipelines)

You can only import from a single table, database view, or equivalent data structure, however the structure can include hierarchical or nested substructures. For more information, see [How to model complex types](search-howto-complex-data-types.md).

You should create this data structure before running the wizard, and it must contain content. Do not run the **Import data** wizard on an empty data source.

|  Selection | Description |
| ---------- | ----------- |
| **Existing data source** |If you already have indexers defined in your search service, you can select an existing data source definition for another import. In Azure Search, data source objects are only used by indexers. You can create a data source object programmatically or through the **Import data** wizard.|
| **Samples**| Azure Search hosts a free global Azure SQL database that you can use to learn about importing and query requests in Azure Search. See [Quickstart: Import, index, and query using portal tools](search-get-started-portal.md) for a walkthrough. |
| **Azure SQL Database** |Service name, credentials for a database user with read permission, and a database name can be specified either on the page or via an ADO.NET connection string. Choose the connection string option to view or customize properties. <br/><br/>The table or view that provides the rowset must be specified on the page. This option appears after the connection succeeds, giving a drop-down list so that you can make a selection. |
| **SQL Server on Azure VM** |Specify a fully qualified service name, user ID and password, and database as a connection string. To use this data source, you must have previously installed a certificate in the local store that encrypts the connection. For instructions, see [SQL VM connection to Azure Search](search-howto-connecting-azure-sql-iaas-to-azure-search-using-indexers.md). <br/><br/>The table or view that provides the rowset must be specified on the page. This option appears after the connection succeeds, giving a drop-down list so that you can make a selection. |
| **Cosmos DB** |Requirements include the account, database, and collection. All documents in the collection will be included in the index. You can define a query to flatten or filter the rowset, or leave the query blank. A query is not required in this wizard.|
| **Azure Blob Storage** |Requirements include the storage account and a container. Optionally, if blob names follow a virtual naming convention for grouping purposes, you can specify the virtual directory portion of the name as a folder under container. See [Indexing Blob Storage](search-howto-indexing-azure-blob-storage.md) for more information. |
| **Azure Table Storage** |Requirements include the storage account and a table name. Optionally, you can specify a query to retrieve a subset of the tables. See [Indexing Table Storage](search-howto-indexing-azure-tables.md) for more information. |


<a name="index-definition"></a>

## Index attributes

The **Import data** wizard generates an index, which will be populated with documents obtained from the input data source. 

For a functional index, make sure you have the following elements defined.

1. One field must be marked as a **Key**, which is used to uniquely identify each document. The **Key** must be *Edm.string*. 

   If field values include spaces or dashes, you must set the **Base-64 Encode Key** option in the **Create an Indexer** step, under **Advanced options**, to suppress the validation check for these characters.

1. Set index attributes for each field. If you select no attributes, your index is essentially empty, except for the required key field. At a minimum, choose one or more of these attributes for each field.
   
   + **Retrievable** returns the field in search results. Every field that provides content to search results must have this attribute. Setting this field does not appreciably effect index size.
   + **Filterable** allows the field to be referenced in filter expressions. Every field used in a **$filter**  expression must have this attribute. Filter expressions are for exact matches. Because text strings remain intact, additional storage is required to accommodate the verbatim content.
   + **Searchable** enables full-text search. Every field used in free form queries or in query expressions must have this attribute. Inverted indexes are created for each field that you mark as **Searchable**.

1. Optionally, set these attribute as needed:

   + **Sortable** allows the field to be used in a sort. Every field used in an **$Orderby** expression must have this attribute.
   + **Facetable** enables the field for faceted navigation. Only fields also marked as **Filterable** can be marked as **Facetable**.

1. Set an **Analyzer** if you want language-enhanced indexing and querying. The default is *Standard Lucene* but you could choose *Microsoft English* if you wanted to use Microsoft's analyzer for advanced lexical processing, such as resolving irregular noun and verb forms.

   + Select **Searchable** to enable the **Analyzer** list.
   + Choose an analyzer provided in the list. 
   
   Only language analyzers can be specified at this time. Using a custom analyzer or a non-language analyzer like Keyword, Pattern, and so forth, will require code. For more information about analyzers, see [Create an index for documents in multiple languages](search-language-support.md).

1. Select the **Suggester** the checkbox to enable type-ahead query suggestions on selected fields.


## Next steps
Review these links to learn more about indexers:

* [Indexing Azure SQL Database](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
* [Indexing Azure Cosmos DB](search-howto-index-cosmosdb.md)
* [Indexing Blob Storage](search-howto-indexing-azure-blob-storage.md)
* [Indexing Table Storage](search-howto-indexing-azure-tables.md)