---
title: Import data into a search index using Azure portal - Azure Search
description: Learn how to use the Import Data wizard in the Azure portal to crawl Azure data from Cosmos DB, Blob storage, table storage, SQL Database, and SQL Server on Azure VMs.
author: HeidiSteen
manager: nitinme
services: search
ms.service: search
ms.topic: conceptual
ms.date: 10/02/2019
ms.author: heidist
ms.custom: seodec2018
---
# Import data wizard for Azure Search

The Azure portal provides an **Import data** wizard on the Azure Search dashboard for prototyping and loading an index. This article covers advantages and limitations of using the wizard, inputs and outputs, and some usage information. For hands-on guidance in stepping through the wizard using buily-in sample data, see the [Create an Azure Search index using the Azure portal](search-get-started-portal.md) quickstart.

Steps performed by the wizard include:

1 - Connect to a supported Azure data source.

2 - Create an index schema, inferred by sampling source data.

3 - Optionally, add AI enrichments to extract or generate content and structure.

4 - Run the wizard to create objects, import data, set a schedule and other configuration options.

The wizard outputs a number of objects that are saved to your search service, which you can use programatically or in other tools.

## Advantages and limitations

Before you write any code, you can use the wizard for prototyping and proof-of-concept testing. The wizard connects to external data sources, samples the data to create an initial index, and then imports the data as JSON documents into an index on Azure Search. 

Sampling is the process by which an index schema is inferred and it has some limitations. When the data source is created, the wizard picks a sample of documents to decide what columns are part of the data source. Not all files are read, as this could potentially take hours for very large data sources. Given a selection of documents, source metadata, such as field name or type, is used to create a fields collection in an index schema. Depending on the complexity of source data, you might need to edit the initial schema for accuracy, or extend it for completeness. You can make your changes inline on the index definition page.

Overall, the advantages of using the wizard are clear: as long as requirements are met, you can prototype a queryable index within minutes. Some of the complexities of indexing, such as providing data as JSON documents, are handled by the wizard.

Known limitations are summarized as follows:

+ The wizard does not support iteration or reuse. Each pass through the wizard creates a new index, skillset, and indexer configuration. Only data sources can be persisted and reused within the wizard. To edit or refine other objects, you have to use the REST APIs or .NET SDK to retrieve and modify the structures.

+ Source content must reside in a supported Azure data source, in a service under the same subscription.

+ Sampling is over a subset of source data. For large data sources, it's possible for the wizard to miss fields. You might need to extend the schema, or correct the inferred data types, if sampling is insufficient.

+ AI enrichment, as exposed in the portal, is limited to a few built-in skills. 

+ A knowledge store as created by the wizard is limited to a few default projections. If you want to save enriched documents created by the wizard, the blob container and tables come with default names and structure.

<a name="data-source-inputs"></a>

## Data source input

The **Import data** wizard connects to an external data source using the internal logic provided by Azure Search indexers, which are equipped to sample the source, read metadata, and selectively crack open documents to read content and structure.

You can only import from a single table, database view, or equivalent data structure, however the structure can include hierarchical or nested substructures. For more information, see [How to model complex types](search-howto-complex-data-types.md).

You should create the single table or view before running the wizard, and it must contain content. For obvious reasons, it doesn't make sense to run the **Import data** wizard on an empty data source.

|  Selection | Description |
| ---------- | ----------- |
| **Existing data source** |If you already have indexers defined in your search service, you can select an existing data source definition for another import. In Azure Search, data source objects are only used by indexers. You can create a data source object programmatically or through the **Import data** wizard.|
| **Samples**| Azure Search provides two hosted built-in samples. A real estate SQL database and a Hotels database on Cosmos DB. For a walk through based on the Hotels sample, see the [Create an index in the Azure portal](search-get-started-portal.md) quickstart. |
| [**Azure SQL Database**](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md) |Service name, credentials for a database user with read permission, and a database name can be specified either on the page or via an ADO.NET connection string. Choose the connection string option to view or customize properties. <br/><br/>The table or view that provides the rowset must be specified on the page. This option appears after the connection succeeds, giving a drop-down list so that you can make a selection. |
| **SQL Server on Azure VM** |Specify a fully qualified service name, user ID and password, and database as a connection string. To use this data source, you must have previously installed a certificate in the local store that encrypts the connection. For instructions, see [SQL VM connection to Azure Search](search-howto-connecting-azure-sql-iaas-to-azure-search-using-indexers.md). <br/><br/>The table or view that provides the rowset must be specified on the page. This option appears after the connection succeeds, giving a drop-down list so that you can make a selection. |
| [**Azure Cosmos DB**](search-howto-index-cosmosdb.md)|Requirements include the account, database, and collection. All documents in the collection will be included in the index. You can define a query to flatten or filter the rowset, or leave the query blank. A query is not required in this wizard.|
| [**Azure Blob Storage**](search-howto-indexing-azure-blob-storage.md) |Requirements include the storage account and a container. Optionally, if blob names follow a virtual naming convention for grouping purposes, you can specify the virtual directory portion of the name as a folder under container. See [Indexing Blob Storage](search-howto-indexing-azure-blob-storage.md) for more information. |
| [**Azure Table Storage**](search-howto-indexing-azure-tables.md) |Requirements include the storage account and a table name. Optionally, you can specify a query to retrieve a subset of the tables. See [Indexing Table Storage](search-howto-indexing-azure-tables.md) for more information. |

## Wizard output

Behind the scenes, the wizard creates, configures, and invokes the following objects. Links to the REST API provide comprehensive and definitive descriptions of each object. After the wizard runs, you can find all of the objects it creates in portal pages. The Overview page of your service has lists of indexes, indexers, data sources, and skillsets.

| Object | Description | Reference |
|--------|-------------|-----------|
| data source | Persists connection information to source data, including credentials. A data source object is used exclusively with indexers. | [Data Source](https://docs.microsoft.com/rest/api/searchservice/create-data-source) |
| index | Physical data structure used for full text search and other queries. | [Index](https://docs.microsoft.com/rest/api/searchservice/create-index)  |
| skillset | A complete set of instructions for manipulating, transforming, and shaping content, including analyzing and extracting information from image files. Except for very simple and limited structures, it includes a reference to a Cognitive Services resource that provides enrichment. Optionally, it might also contain a knowledge store definition.  | [Skillset](https://docs.microsoft.com/rest/api/searchservice/create-skillset)  |
| indexer | A configuration object specifying a data source, target index, an optional skillset, optional schedule, and optional configuration settings for error handing and base-64 encoding. | [Indexer](https://docs.microsoft.com/rest/api/searchservice/create-indexer)  |


## How to start the wizard

The Import data wizard is started from the command bar on the service Overview page.

1. In the [Azure portal](https://portal.azure.com), open the search service page from the dashboard or [find your service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) in the service list.

2. In the service overview page at the top, click **Import data**.

   ![Import data command in portal](./media/search-import-data-portal/import-data-cmd2.png "Start the Import data wizard")

You can also launch **Import data** from other Azure services, including Azure Cosmos DB, Azure SQL Database, and Azure Blob storage. Look for **Add Azure Search** in the left-navigation pane on the service overview page.

<a name="index-definition"></a>

## How to edit or finish an index schema in the wizard

The **Import data** wizard generates an incomplete index, which will be populated with documents obtained from the input data source. 

For a functional index, make sure you have the following elements defined.

1. Review the fields, adding new fields that sampling missed, removing any fields you don't want in your index.

1. Verify the data type on fields in the index. Azure Search supports the entity data model (EDM).

1. Set attributes on the index to determine how that field is used in an index. Take your time with this step Attributes impact the physical expression of fields in the index. If you want to change them later, even through the API, you will need to drop and rebuild the index.

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

The best way to understand the benefits and limits of the wizard is to step through it. The following quickstart provides an explanation of each step.

> [!div class="nextstepaction"]
> [Create an Azure Search index using the Azure portal](search-get-started-portal.md)