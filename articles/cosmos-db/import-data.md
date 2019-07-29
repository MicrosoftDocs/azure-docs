---
title: Database migration tool for Azure Cosmos DB
description: Learn how to use the open-source Azure Cosmos DB data migration tools to import data to Azure Cosmos DB from various sources including MongoDB, SQL Server, Table storage, Amazon DynamoDB, CSV, and JSON files. CSV to JSON conversion.
author: deborahc
ms.service: cosmos-db
ms.topic: tutorial
ms.date: 05/20/2019
ms.author: dech

---
# Use Data migration tool to migrate your data to Azure Cosmos DB

This tutorial provides instructions on using the Azure Cosmos DB Data Migration tool, which can import data from various sources into Azure Cosmos DB collections and tables. You can import from JSON files, CSV files, SQL, MongoDB, Azure Table storage, Amazon DynamoDB, and even Azure Cosmos DB SQL API collections. You migrate that data to collections and tables for use with Azure Cosmos DB. The Data Migration tool can also be used when migrating from a single partition collection to a multi-partition collection for the SQL API.

Which API are you going to use with Azure Cosmos DB?

* **[SQL API](documentdb-introduction.md)** - You can use any of the source options provided in the Data Migration tool to import data.
* **[Table API](table-introduction.md)** - You can use the Data Migration tool or AzCopy to import data. For more information, see [Import data for use with the Azure Cosmos DB Table API](table-import.md).
* **[Azure Cosmos DB's API for MongoDB](mongodb-introduction.md)** - The Data Migration tool doesn't currently support Azure Cosmos DB's API for MongoDB either as a source or as a target. If you want to migrate the data in or out of collections in Azure Cosmos DB, refer to [How to migrate MongoDB data a Cosmos database with Azure Cosmos DB's API for MongoDB](mongodb-migrate.md) for instructions. You can still use the Data Migration tool to export data from MongoDB to Azure Cosmos DB SQL API collections for use with the SQL API.
* **[Gremlin API](graph-introduction.md)** - The Data Migration tool isn't a supported import tool for Gremlin API accounts at this time.

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Installing the Data Migration tool
> * Importing data from different data sources
> * Exporting from Azure Cosmos DB to JSON

## <a id="Prerequisites"></a>Prerequisites

Before following the instructions in this article, ensure that you do the following steps:

* **Install** [Microsoft .NET Framework 4.51](https://www.microsoft.com/download/developer-tools.aspx) or higher.

* **Increase throughput:** The duration of your data migration depends on the amount of throughput you set up for an individual collection or a set of collections. Be sure to increase the throughput for larger data migrations. After you've completed the migration, decrease the throughput to save costs. For more information about increasing throughput in the Azure portal, see [performance levels](performance-levels.md) and [pricing tiers](https://azure.microsoft.com/pricing/details/cosmos-db/) in Azure Cosmos DB.

* **Create Azure Cosmos DB resources:** Before you start the migrating data, pre-create all your collections from the Azure portal. To migrate to an Azure Cosmos DB account that has database level throughput, provide a partition key when you create the Azure Cosmos DB collections.

## <a id="Overviewl"></a>Overview

The Data Migration tool is an open-source solution that imports data to Azure Cosmos DB from a variety of sources, including:

* JSON files
* MongoDB
* SQL Server
* CSV files
* Azure Table storage
* Amazon DynamoDB
* HBase
* Azure Cosmos DB collections

While the import tool includes a graphical user interface (dtui.exe), it can also be driven from the command-line (dt.exe). In fact, there's an option to output the associated command after setting up an import through the UI. You can transform tabular source data, such as SQL Server or CSV files, to create hierarchical relationships (subdocuments) during import. Keep reading to learn more about source options, sample commands to import from each source, target options, and viewing import results.

## <a id="Install"></a>Installation

The migration tool source code is available on GitHub in [this repository](https://github.com/azure/azure-documentdb-datamigrationtool). You can download and compile the solution locally, or [download a pre-compiled binary](https://aka.ms/csdmtool), then run either:

* **Dtui.exe**: Graphical interface version of the tool
* **Dt.exe**: Command-line version of the tool

## Select data source

Once you've installed the tool, it's time to import your data. What kind of data do you want to import?

* [JSON files](#JSON)
* [MongoDB](#MongoDB)
* [MongoDB Export files](#MongoDBExport)
* [SQL Server](#SQL)
* [CSV files](#CSV)
* [Azure Table storage](#AzureTableSource)
* [Amazon DynamoDB](#DynamoDBSource)
* [Blob](#BlobImport)
* [Azure Cosmos DB collections](#SQLSource)
* [HBase](#HBaseSource)
* [Azure Cosmos DB bulk import](#SQLBulkTarget)
* [Azure Cosmos DB sequential record import](#SQLSeqTarget)

## <a id="JSON"></a>Import JSON files

The JSON file source importer option allows you to import one or more single document JSON files or JSON files that each have an array of JSON documents. When adding folders that have JSON files to import, you have the option of recursively searching for files in subfolders.

![Screenshot of JSON file source options - Database migration tools](./media/import-data/jsonsource.png)

The connection string is in the following format:

`AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>`

* The `<CosmosDB Endpoint>` is the endpoint URI. You can get this value from the Azure portal. Navigate to your Azure Cosmos account. Open the **Overview** pane and copy the **URI** value.
* The `<AccountKey>` is the "Password" or **PRIMARY KEY**. You can get this value from the Azure portal. Navigate to your Azure Cosmos account. Open the **Connection Strings** or **Keys** pane, and copy the "Password" or **PRIMARY KEY** value.
* The `<CosmosDB Database>` is the CosmosDB database name.

Example: 
`AccountEndpoint=https://myCosmosDBName.documents.azure.com:443/;AccountKey=wJmFRYna6ttQ79ATmrTMKql8vPri84QBiHTt6oinFkZRvoe7Vv81x9sn6zlVlBY10bEPMgGM982wfYXpWXWB9w==;Database=myDatabaseName`

> [!NOTE]
> Use the Verify command to ensure that the Cosmos DB account specified in the connection string field can be accessed.

Here are some command-line samples to import JSON files:

```console
#Import a single JSON file
dt.exe /s:JsonFile /s.Files:.\Sessions.json /t:DocumentDBBulk /t.ConnectionString:"AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /t.Collection:Sessions /t.CollectionThroughput:2500

#Import a directory of JSON files
dt.exe /s:JsonFile /s.Files:C:\TESessions\*.json /t:DocumentDBBulk /t.ConnectionString:" AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /t.Collection:Sessions /t.CollectionThroughput:2500

#Import a directory (including sub-directories) of JSON files
dt.exe /s:JsonFile /s.Files:C:\LastFMMusic\**\*.json /t:DocumentDBBulk /t.ConnectionString:" AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /t.Collection:Music /t.CollectionThroughput:2500

#Import a directory (single), directory (recursive), and individual JSON files
dt.exe /s:JsonFile /s.Files:C:\Tweets\*.*;C:\LargeDocs\**\*.*;C:\TESessions\Session48172.json;C:\TESessions\Session48173.json;C:\TESessions\Session48174.json;C:\TESessions\Session48175.json;C:\TESessions\Session48177.json /t:DocumentDBBulk /t.ConnectionString:"AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /t.Collection:subs /t.CollectionThroughput:2500

#Import a single JSON file and partition the data across 4 collections
dt.exe /s:JsonFile /s.Files:D:\\CompanyData\\Companies.json /t:DocumentDBBulk /t.ConnectionString:"AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /t.Collection:comp[1-4] /t.PartitionKey:name /t.CollectionThroughput:2500
```

## <a id="MongoDB"></a>Import from MongoDB

> [!IMPORTANT]
> If you're importing to a Cosmos account configured with Azure Cosmos DB's API for MongoDB, follow these [instructions](mongodb-migrate.md).

With the MongoDB source importer option, you can import from a single MongoDB collection, optionally filter documents using a query, and modify the document structure by using a projection.  

![Screenshot of MongoDB source options](./media/import-data/mongodbsource.png)

The connection string is in the standard MongoDB format:

`mongodb://<dbuser>:<dbpassword>@<host>:<port>/<database>`

> [!NOTE]
> Use the Verify command to ensure that the MongoDB instance specified in the connection string field can be accessed.

Enter the name of the collection from which data will be imported. You may optionally specify or provide a file for a query, such as `{pop: {$gt:5000}}`, or a projection, such as `{loc:0}`, to both filter and shape the data that you're importing.

Here are some command-line samples to import from MongoDB:

```console
#Import all documents from a MongoDB collection
dt.exe /s:MongoDB /s.ConnectionString:mongodb://<dbuser>:<dbpassword>@<host>:<port>/<database> /s.Collection:zips /t:DocumentDBBulk /t.ConnectionString:"AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /t.Collection:BulkZips /t.IdField:_id /t.CollectionThroughput:2500

#Import documents from a MongoDB collection which match the query and exclude the loc field
dt.exe /s:MongoDB /s.ConnectionString:mongodb://<dbuser>:<dbpassword>@<host>:<port>/<database> /s.Collection:zips /s.Query:{pop:{$gt:50000}} /s.Projection:{loc:0} /t:DocumentDBBulk /t.ConnectionString:"AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /t.Collection:BulkZipsTransform /t.IdField:_id/t.CollectionThroughput:2500
```

## <a id="MongoDBExport"></a>Import MongoDB export files

> [!IMPORTANT]
> If you're importing to an Azure Cosmos DB account with support for MongoDB, follow these [instructions](mongodb-migrate.md).

The MongoDB export JSON file source importer option allows you to import one or more JSON files produced from the mongoexport utility.  

![Screenshot of MongoDB export source options](./media/import-data/mongodbexportsource.png)

When adding folders that have MongoDB export JSON files for import, you have the option of recursively searching for files in subfolders.

Here is a command-line sample to import from MongoDB export JSON files:

```console
dt.exe /s:MongoDBExport /s.Files:D:\mongoemployees.json /t:DocumentDBBulk /t.ConnectionString:"AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /t.Collection:employees /t.IdField:_id /t.Dates:Epoch /t.CollectionThroughput:2500
```

## <a id="SQL"></a>Import from SQL Server

The SQL source importer option allows you to import from an individual SQL Server database and optionally filter the records to be imported using a query. In addition, you can modify the document structure by specifying a nesting separator (more on that in a moment).  

![Screenshot of SQL source options - database migration tools](./media/import-data/sqlexportsource.png)

The format of the connection string is the standard SQL connection string format.

> [!NOTE]
> Use the Verify command to ensure that the SQL Server instance specified in the connection string field can be accessed.

The nesting separator property is used to create hierarchical relationships (sub-documents) during import. Consider the following SQL query:

`select CAST(BusinessEntityID AS varchar) as Id, Name, AddressType as [Address.AddressType], AddressLine1 as [Address.AddressLine1], City as [Address.Location.City], StateProvinceName as [Address.Location.StateProvinceName], PostalCode as [Address.PostalCode], CountryRegionName as [Address.CountryRegionName] from Sales.vStoreWithAddresses WHERE AddressType='Main Office'`

Which returns the following (partial) results:

![Screenshot of SQL query results](./media/import-data/sqlqueryresults.png)

Note the aliases such as Address.AddressType and Address.Location.StateProvinceName. By specifying a nesting separator of '.', the import tool creates Address and Address.Location subdocuments during the import. Here is an example of a resulting document in Azure Cosmos DB:

*{
  "id": "956",
  "Name": "Finer Sales and Service",
  "Address": {
    "AddressType": "Main Office",
    "AddressLine1": "#500-75 O'Connor Street",
    "Location": {
      "City": "Ottawa",
      "StateProvinceName": "Ontario"
    },
    "PostalCode": "K4B 1S2",
    "CountryRegionName": "Canada"
  }
}*

Here are some command-line samples to import from SQL Server:

```console
#Import records from SQL which match a query
dt.exe /s:SQL /s.ConnectionString:"Data Source=<server>;Initial Catalog=AdventureWorks;User Id=advworks;Password=<password>;" /s.Query:"select CAST(BusinessEntityID AS varchar) as Id, * from Sales.vStoreWithAddresses WHERE AddressType='Main Office'" /t:DocumentDBBulk /t.ConnectionString:" AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /t.Collection:Stores /t.IdField:Id /t.CollectionThroughput:2500

#Import records from sql which match a query and create hierarchical relationships
dt.exe /s:SQL /s.ConnectionString:"Data Source=<server>;Initial Catalog=AdventureWorks;User Id=advworks;Password=<password>;" /s.Query:"select CAST(BusinessEntityID AS varchar) as Id, Name, AddressType as [Address.AddressType], AddressLine1 as [Address.AddressLine1], City as [Address.Location.City], StateProvinceName as [Address.Location.StateProvinceName], PostalCode as [Address.PostalCode], CountryRegionName as [Address.CountryRegionName] from Sales.vStoreWithAddresses WHERE AddressType='Main Office'" /s.NestingSeparator:. /t:DocumentDBBulk /t.ConnectionString:" AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /t.Collection:StoresSub /t.IdField:Id /t.CollectionThroughput:2500
```

## <a id="CSV"></a>Import CSV files and convert CSV to JSON

The CSV file source importer option enables you to import one or more CSV files. When adding folders that have CSV files for import, you have the option of recursively searching for files in subfolders.

![Screenshot of CSV source options - CSV to JSON](media/import-data/csvsource.png)

Similar to the SQL source, the nesting separator property may be used to create hierarchical relationships (sub-documents) during import. Consider the following CSV header row and data rows:

![Screenshot of CSV sample records - CSV to JSON](./media/import-data/csvsample.png)

Note the aliases such as DomainInfo.Domain_Name and RedirectInfo.Redirecting. By specifying a nesting separator of '.', the import tool will create DomainInfo and RedirectInfo subdocuments during the import. Here is an example of a resulting document in Azure Cosmos DB:

*{
  "DomainInfo": {
    "Domain_Name": "ACUS.GOV",
    "Domain_Name_Address": "https:\//www.ACUS.GOV"
  },
  "Federal Agency": "Administrative Conference of the United States",
  "RedirectInfo": {
    "Redirecting": "0",
    "Redirect_Destination": ""
  },
  "id": "9cc565c5-ebcd-1c03-ebd3-cc3e2ecd814d"
}*

The import tool tries to infer type information for unquoted values in CSV files (quoted values are always treated as strings).  Types are identified in the following order: number, datetime, boolean.  

There are two other things to note about CSV import:

1. By default, unquoted values are always trimmed for tabs and spaces, while quoted values are preserved as-is. This behavior can be overridden with the Trim quoted values checkbox or the /s.TrimQuoted command-line option.
2. By default, an unquoted null is treated as a null value. This behavior can be overridden (that is, treat an unquoted null as a "null" string) with the Treat unquoted NULL as string checkbox or the /s.NoUnquotedNulls command-line option.

Here is a command-line sample for CSV import:

```console
dt.exe /s:CsvFile /s.Files:.\Employees.csv /t:DocumentDBBulk /t.ConnectionString:"AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /t.Collection:Employees /t.IdField:EntityID /t.CollectionThroughput:2500
```

## <a id="AzureTableSource"></a>Import from Azure Table storage

The Azure Table storage source importer option allows you to import from an individual Azure Table storage table. Optionally, you can filter the table entities to be imported.

You may output data that was imported from Azure Table Storage to Azure Cosmos DB tables and entities for use with the Table API. Imported data can also be output to collections and documents for use with the SQL API. However, Table API is only available as a target in the command-line utility. You can't export to Table API by using the Data Migration tool user interface. For more information, see [Import data for use with the Azure Cosmos DB Table API](table-import.md).

![Screenshot of Azure Table storage source options](./media/import-data/azuretablesource.png)

The format of the Azure Table storage connection string is:

`DefaultEndpointsProtocol=<protocol>;AccountName=<Account Name>;AccountKey=<Account Key>;`

> [!NOTE]
> Use the Verify command to ensure that the Azure Table storage instance specified in the connection string field can be accessed.

Enter the name of the Azure table from to import from. You may optionally specify a [filter](../vs-azure-tools-table-designer-construct-filter-strings.md).

The Azure Table storage source importer option has the following additional options:

1. Include Internal Fields
   1. All - Include all internal fields (PartitionKey, RowKey, and Timestamp)
   2. None - Exclude all internal fields
   3. RowKey - Only include the RowKey field
2. Select Columns
   1. Azure Table storage filters don't support projections. If you want to only import specific Azure Table entity properties, add them to the Select Columns list. All other entity properties are ignored.

Here is a command-line sample to import from Azure Table storage:

```console
dt.exe /s:AzureTable /s.ConnectionString:"DefaultEndpointsProtocol=https;AccountName=<Account Name>;AccountKey=<Account Key>" /s.Table:metrics /s.InternalFields:All /s.Filter:"PartitionKey eq 'Partition1' and RowKey gt '00001'" /s.Projection:ObjectCount;ObjectSize  /t:DocumentDBBulk /t.ConnectionString:" AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /t.Collection:metrics /t.CollectionThroughput:2500
```

## <a id="DynamoDBSource"></a>Import from Amazon DynamoDB

The Amazon DynamoDB source importer option allows you to import from a single Amazon DynamoDB table. It can optionally filter the entities to be imported. Several templates are provided so that setting up an import is as easy as possible.

![Screenshot of Amazon DynamoDB source options - database migration tools](./media/import-data/dynamodbsource1.png)

![Screenshot of Amazon DynamoDB source options - database migration tools](./media/import-data/dynamodbsource2.png)

The format of the Amazon DynamoDB connection string is:

`ServiceURL=<Service Address>;AccessKey=<Access Key>;SecretKey=<Secret Key>;`

> [!NOTE]
> Use the Verify command to ensure that the Amazon DynamoDB instance specified in the connection string field can be accessed.

Here is a command-line sample to import from Amazon DynamoDB:

```console
dt.exe /s:DynamoDB /s.ConnectionString:ServiceURL=https://dynamodb.us-east-1.amazonaws.com;AccessKey=<accessKey>;SecretKey=<secretKey> /s.Request:"{   """TableName""": """ProductCatalog""" }" /t:DocumentDBBulk /t.ConnectionString:"AccountEndpoint=<Azure Cosmos DB Endpoint>;AccountKey=<Azure Cosmos DB Key>;Database=<Azure Cosmos DB Database>;" /t.Collection:catalogCollection /t.CollectionThroughput:2500
```

## <a id="BlobImport"></a>Import from Azure Blob storage

The JSON file, MongoDB export file, and CSV file source importer options allow you to import one or more files from Azure Blob storage. After specifying a Blob container URL and Account Key, provide a regular expression to select the file(s) to import.

![Screenshot of Blob file source options](./media/import-data/blobsource.png)

Here is command-line sample to import JSON files from Azure Blob storage:

```console
dt.exe /s:JsonFile /s.Files:"blobs://<account key>@account.blob.core.windows.net:443/importcontainer/.*" /t:DocumentDBBulk /t.ConnectionString:"AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /t.Collection:doctest
```

## <a id="SQLSource"></a>Import from a SQL API collection

The Azure Cosmos DB source importer option allows you to import data from one or more Azure Cosmos DB collections and optionally filter documents using a query.  

![Screenshot of Azure Cosmos DB source options](./media/import-data/documentdbsource.png)

The format of the Azure Cosmos DB connection string is:

`AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;`

You can retrieve the Azure Cosmos DB account connection string from the Keys page of the Azure portal, as described in [How to manage an Azure Cosmos DB account](manage-account.md). However, the name of the database needs to be appended to the connection string in the following format:

`Database=<CosmosDB Database>;`

> [!NOTE]
> Use the Verify command to ensure that the Azure Cosmos DB instance specified in the connection string field can be accessed.

To import from a single Azure Cosmos DB collection, enter the name of the collection to import data from. To import from more than one Azure Cosmos DB collection, provide a regular expression to match one or more collection names (for example, collection01 | collection02 | collection03). You may optionally specify, or provide a file for, a query to both filter and shape the data that you're importing.

> [!NOTE]
> Since the collection field accepts regular expressions, if you're importing from a single collection whose name has regular expression characters, then those characters must be escaped accordingly.

The Azure Cosmos DB source importer option has the following advanced options:

1. Include Internal Fields: Specifies whether or not to include Azure Cosmos DB document system properties in the export (for example, _rid, _ts).
2. Number of Retries on Failure: Specifies the number of times to retry the connection to Azure Cosmos DB in case of transient failures (for example, network connectivity interruption).
3. Retry Interval: Specifies how long to wait between retrying the connection to Azure Cosmos DB in case of transient failures (for example, network connectivity interruption).
4. Connection Mode: Specifies the connection mode to use with Azure Cosmos DB. The available choices are DirectTcp, DirectHttps, and Gateway. The direct connection modes are faster, while the gateway mode is more firewall friendly as it only uses port 443.

![Screenshot of Azure Cosmos DB source advanced options](./media/import-data/documentdbsourceoptions.png)

> [!TIP]
> The import tool defaults to connection mode DirectTcp. If you experience firewall issues, switch to connection mode Gateway, as it only requires port 443.

Here are some command-line samples to import from Azure Cosmos DB:

```console
#Migrate data from one Azure Cosmos DB collection to another Azure Cosmos DB collections
dt.exe /s:DocumentDB /s.ConnectionString:"AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /s.Collection:TEColl /t:DocumentDBBulk /t.ConnectionString:" AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /t.Collection:TESessions /t.CollectionThroughput:2500

#Migrate data from more than one Azure Cosmos DB collection to a single Azure Cosmos DB collection
dt.exe /s:DocumentDB /s.ConnectionString:"AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /s.Collection:comp1|comp2|comp3|comp4 /t:DocumentDBBulk /t.ConnectionString:"AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /t.Collection:singleCollection /t.CollectionThroughput:2500

#Export an Azure Cosmos DB collection to a JSON file
dt.exe /s:DocumentDB /s.ConnectionString:"AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /s.Collection:StoresSub /t:JsonFile /t.File:StoresExport.json /t.Overwrite /t.CollectionThroughput:2500
```

> [!TIP]
> The Azure Cosmos DB Data Import Tool also supports import of data from the [Azure Cosmos DB Emulator](local-emulator.md). When importing data from a local emulator, set the endpoint to `https://localhost:<port>`.

## <a id="HBaseSource"></a>Import from HBase

The HBase source importer option allows you to import data from an HBase table and optionally filter the data. Several templates are provided so that setting up an import is as easy as possible.

![Screenshot of HBase source options](./media/import-data/hbasesource1.png)

![Screenshot of HBase source options](./media/import-data/hbasesource2.png)

The format of the HBase Stargate connection string is:

`ServiceURL=<server-address>;Username=<username>;Password=<password>`

> [!NOTE]
> Use the Verify command to ensure that the HBase instance specified in the connection string field can be accessed.

Here is a command-line sample to import from HBase:

```console
dt.exe /s:HBase /s.ConnectionString:ServiceURL=<server-address>;Username=<username>;Password=<password> /s.Table:Contacts /t:DocumentDBBulk /t.ConnectionString:"AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;" /t.Collection:hbaseimport
```

## <a id="SQLBulkTarget"></a>Import to the SQL API (Bulk Import)

The Azure Cosmos DB Bulk importer allows you to import from any of the available source options, using an Azure Cosmos DB stored procedure for efficiency. The tool supports import to one single-partitioned Azure Cosmos DB collection. It also supports sharded import whereby data is partitioned across more than one single-partitioned Azure Cosmos DB collection. For more information about partitioning data, see [Partitioning and scaling in Azure Cosmos DB](partition-data.md). The tool creates, executes, and then deletes the stored procedure from the target collection(s).  

![Screenshot of Azure Cosmos DB bulk options](./media/import-data/documentdbbulk.png)

The format of the Azure Cosmos DB connection string is:

`AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;`

The Azure Cosmos DB account connection string can be retrieved from the Keys page of the Azure portal, as described in [How to manage an Azure Cosmos DB account](manage-account.md), however the name of the database needs to be appended to the connection string in the following format:

`Database=<CosmosDB Database>;`

> [!NOTE]
> Use the Verify command to ensure that the Azure Cosmos DB instance specified in the connection string field can be accessed.

To import to a single collection, enter the name of the collection to import data from and click the Add button. To import to more than one collection, either enter each collection name individually or use the following syntax to specify more than one collection: *collection_prefix*[start index - end index]. When specifying more than one collection using the aforementioned syntax, keep the following guidelines in mind:

1. Only integer range name patterns are supported. For example, specifying collection[0-3] creates the following collections: collection0, collection1, collection2, collection3.
2. You can use an abbreviated syntax: collection[3] creates the same set of collections mentioned in step 1.
3. More than one substitution can be provided. For example, collection[0-1] [0-9] generates 20 collection names with leading zeros (collection01, ..02, ..03).

Once the collection name(s) have been specified, choose the desired throughput of the collection(s) (400 RUs to 10,000 RUs). For best import performance, choose a higher throughput. For more information about performance levels, see [Performance levels in Azure Cosmos DB](performance-levels.md).

> [!NOTE]
> The performance throughput setting only applies to collection creation. If the specified collection already exists, its throughput won't be modified.

When you import to more than one collection, the import tool supports hash-based sharding. In this scenario, specify the document property you wish to use as the Partition Key. (If Partition Key is left blank, documents are sharded randomly across the target collections.)

You may optionally specify which field in the import source should be used as the Azure Cosmos DB document ID property during the import. If documents don't have this property, then the import tool generates a GUID as the ID property value.

There are a number of advanced options available during import. First, while the tool includes a default bulk import stored procedure (BulkInsert.js), you may choose to specify your own import stored procedure:

 ![Screenshot of Azure Cosmos DB bulk insert sproc option](./media/import-data/bulkinsertsp.png)

Additionally, when importing date types (for example, from SQL Server or MongoDB), you can choose between three import options:

 ![Screenshot of Azure Cosmos DB date time import options](./media/import-data/datetimeoptions.png)

* String: Persist as a string value
* Epoch: Persist as an Epoch number value
* Both: Persist both string and Epoch number values. This option creates a subdocument, for example:
  "date_joined": {
  "Value": "2013-10-21T21:17:25.2410000Z",
  "Epoch": 1382390245
  }

The Azure Cosmos DB Bulk importer has the following additional advanced options:

1. Batch Size: The tool defaults to a batch size of 50.  If the documents to be imported are large, consider lowering the batch size. Conversely, if the documents to be imported are small, consider raising the batch size.
2. Max Script Size (bytes): The tool defaults to a max script size of 512 KB.
3. Disable Automatic Id Generation: If every document to be imported has an ID field, then selecting this option can increase performance. Documents missing a unique ID field aren't imported.
4. Update Existing Documents: The tool defaults to not replacing existing documents with ID conflicts. Selecting this option allows overwriting existing documents with matching IDs. This feature is useful for scheduled data migrations that update existing documents.
5. Number of Retries on Failure: Specifies how often to retry the connection to Azure Cosmos DB during transient failures (for example, network connectivity interruption).
6. Retry Interval: Specifies how long to wait between retrying the connection to Azure Cosmos DB in case of transient failures (for example, network connectivity interruption).
7. Connection Mode: Specifies the connection mode to use with Azure Cosmos DB. The available choices are DirectTcp, DirectHttps, and Gateway. The direct connection modes are faster, while the gateway mode is more firewall friendly as it only uses port 443.

![Screenshot of Azure Cosmos DB bulk import advanced options](./media/import-data/docdbbulkoptions.png)

> [!TIP]
> The import tool defaults to connection mode DirectTcp. If you experience firewall issues, switch to connection mode Gateway, as it only requires port 443.

## <a id="SQLSeqTarget"></a>Import to the SQL API (Sequential Record Import)

The Azure Cosmos DB sequential record importer allows you to import from an available source option on a record-by-record basis. You might choose this option if you’re importing to an existing collection that has reached its quota of stored procedures. The tool supports import to a single (both single-partition and multi-partition) Azure Cosmos DB collection. It also supports sharded import whereby data is partitioned across more than one single-partition or multi-partition Azure Cosmos DB collection. For more information about partitioning data, see [Partitioning and scaling in Azure Cosmos DB](partition-data.md).

![Screenshot of Azure Cosmos DB sequential record import options](./media/import-data/documentdbsequential.png)

The format of the Azure Cosmos DB connection string is:

`AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB Database>;`

You can retrieve the connection string for the Azure Cosmos DB account from the Keys page of the Azure portal, as described in [How to manage an Azure Cosmos DB account](manage-account.md). However, the name of the database needs to be appended to the connection string in the following format:

`Database=<Azure Cosmos DB Database>;`

> [!NOTE]
> Use the Verify command to ensure that the Azure Cosmos DB instance specified in the connection string field can be accessed.

To import to a single collection, enter the name of the collection to import data into, and then click the Add button. To import to more than one collection, enter each collection name individually. You may also use the following syntax to specify more than one collection: *collection_prefix*[start index - end index]. When specifying more than one collection via the aforementioned syntax, keep the following guidelines in mind:

1. Only integer range name patterns are supported. For example, specifying collection[0-3] creates the following collections: collection0, collection1, collection2, collection3.
2. You can use an abbreviated syntax: collection[3] creates the same set of collections mentioned in step 1.
3. More than one substitution can be provided. For example, collection[0-1] [0-9] creates 20 collection names with leading zeros (collection01, ..02, ..03).

Once the collection name(s) have been specified, choose the desired throughput of the collection(s) (400 RUs to 250,000 RUs). For best import performance, choose a higher throughput. For more information about performance levels, see [Performance levels in Azure Cosmos DB](performance-levels.md). Any import to collections with throughput >10,000 RUs require a partition key. If you choose to have more than 250,000 RUs, you need to file a request in the portal to have your account increased.

> [!NOTE]
> The throughput setting only applies to collection or database creation. If the specified collection already exists, its throughput won't be modified.

When importing to more than one collection, the import tool supports hash-based sharding. In this scenario, specify the document property you wish to use as the Partition Key. (If Partition Key is left blank, documents are sharded randomly across the target collections.)

You may optionally specify which field in the import source should be used as the Azure Cosmos DB document ID property during the import. (If documents don't have this property, then the import tool generates a GUID as the ID property value.)

There are a number of advanced options available during import. First, when importing date types (for example, from SQL Server or MongoDB), you can choose between three import options:

 ![Screenshot of Azure Cosmos DB date time import options](./media/import-data/datetimeoptions.png)

* String: Persist as a string value
* Epoch: Persist as an Epoch number value
* Both: Persist both string and Epoch number values. This option creates a subdocument, for example:
  "date_joined": {
  "Value": "2013-10-21T21:17:25.2410000Z",
  "Epoch": 1382390245
  }

The Azure Cosmos DB - Sequential record importer has the following additional advanced options:

1. Number of Parallel Requests: The tool defaults to two parallel requests. If the documents to be imported are small, consider raising the number of parallel requests. If this number is raised too much, the import may experience rate limiting.
2. Disable Automatic Id Generation: If every document to be imported has an ID field, then selecting this option can increase performance. Documents missing a unique ID field aren't imported.
3. Update Existing Documents: The tool defaults to not replacing existing documents with ID conflicts. Selecting this option allows overwriting existing documents with matching IDs. This feature is useful for scheduled data migrations that update existing documents.
4. Number of Retries on Failure: Specifies how often to retry the connection to Azure Cosmos DB during transient failures (for example, network connectivity interruption).
5. Retry Interval: Specifies how long to wait between retrying the connection to Azure Cosmos DB during transient failures (for example, network connectivity interruption).
6. Connection Mode: Specifies the connection mode to use with Azure Cosmos DB. The available choices are DirectTcp, DirectHttps, and Gateway. The direct connection modes are faster, while the gateway mode is more firewall friendly as it only uses port 443.

![Screenshot of Azure Cosmos DB sequential record import advanced options](./media/import-data/documentdbsequentialoptions.png)

> [!TIP]
> The import tool defaults to connection mode DirectTcp. If you experience firewall issues, switch to connection mode Gateway, as it only requires port 443.

## <a id="IndexingPolicy"></a>Specify an indexing policy

When you allow the migration tool to create Azure Cosmos DB SQL API collections during import, you can specify the indexing policy of the collections. In the advanced options section of the Azure Cosmos DB Bulk import and Azure Cosmos DB Sequential record options, navigate to the Indexing Policy section.

![Screenshot of Azure Cosmos DB Indexing Policy advanced options](./media/import-data/indexingpolicy1.png)

Using the Indexing Policy advanced option, you can select an indexing policy file, manually enter an indexing policy, or select from a set of default templates (by right-clicking in the indexing policy textbox).

The policy templates the tool provides are:

* Default. This policy is best when you perform equality queries against strings. It also works if you use ORDER BY, range, and equality queries for numbers. This policy has a lower index storage overhead than Range.
* Range. This policy is best when you use ORDER BY, range, and equality queries on both numbers and strings. This policy has a higher index storage overhead than Default or Hash.

![Screenshot of Azure Cosmos DB Indexing Policy advanced options](./media/import-data/indexingpolicy2.png)

> [!NOTE]
> If you don't specify an indexing policy, then the default policy is applied. For more information about indexing policies, see [Azure Cosmos DB indexing policies](index-policy.md).

## Export to JSON file

The Azure Cosmos DB JSON exporter allows you to export any of the available source options to a JSON file that has an array of JSON documents. The tool handles the export for you. Alternatively, you can choose to view the resulting migration command and run the command yourself. The resulting JSON file may be stored locally or in Azure Blob storage.

![Screenshot of Azure Cosmos DB JSON local file export option](./media/import-data/jsontarget.png)

![Screenshot of Azure Cosmos DB JSON Azure Blob storage export option](./media/import-data/jsontarget2.png)

You may optionally choose to prettify the resulting JSON. This action will increase the size of the resulting document while making the contents more human readable.

* Standard JSON export

  ```JSON
  [{"id":"Sample","Title":"About Paris","Language":{"Name":"English"},"Author":{"Name":"Don","Location":{"City":"Paris","Country":"France"}},"Content":"Don's document in Azure Cosmos DB is a valid JSON document as defined by the JSON spec.","PageViews":10000,"Topics":[{"Title":"History of Paris"},{"Title":"Places to see in Paris"}]}]
  ```

* Prettified JSON export

  ```JSON
    [
     {
    "id": "Sample",
    "Title": "About Paris",
    "Language": {
      "Name": "English"
    },
    "Author": {
      "Name": "Don",
      "Location": {
        "City": "Paris",
        "Country": "France"
      }
    },
    "Content": "Don's document in Azure Cosmos DB is a valid JSON document as defined by the JSON spec.",
    "PageViews": 10000,
    "Topics": [
      {
        "Title": "History of Paris"
      },
      {
        "Title": "Places to see in Paris"
      }
    ]
    }]
  ```

Here is a command-line sample to export the JSON file to Azure Blob storage:

```console
dt.exe /ErrorDetails:All /s:DocumentDB /s.ConnectionString:"AccountEndpoint=<CosmosDB Endpoint>;AccountKey=<CosmosDB Key>;Database=<CosmosDB database_name>" /s.Collection:<CosmosDB collection_name>
/t:JsonFile /t.File:"blobs://<Storage account key>@<Storage account name>.blob.core.windows.net:443/<Container_name>/<Blob_name>"
/t.Overwrite
```

## Advanced configuration

In the Advanced configuration screen, specify the location of the log file to which you would like any errors written. The following rules apply to this page:

1. If a file name isn't provided, then all errors are returned on the Results page.
2. If a file name is provided without a directory, then the file is created (or overwritten) in the current environment directory.
3. If you select an existing file, then the file is overwritten, there's no append option.
4. Then, choose whether to log all, critical, or no error messages. Finally, decide how frequently the on-screen transfer message is updated with its progress.

   ![Screenshot of Advanced configuration screen](./media/import-data/AdvancedConfiguration.png)

## Confirm import settings and view command line

1. After you specify the source information, target information, and advanced configuration, review the migration summary and view or copy the resulting migration command if you want. (Copying the command is useful to automate import operations.)

    ![Screenshot of summary screen](./media/import-data/summary.png)

    ![Screenshot of summary screen](./media/import-data/summarycommand.png)

2. Once you’re satisfied with your source and target options, click **Import**. The elapsed time, transferred count, and failure information (if you didn't provide a file name in the Advanced configuration) update as the import is in process. Once complete, you can export the results (for example, to deal with any import failures).

    ![Screenshot of Azure Cosmos DB JSON export option](./media/import-data/viewresults.png)

3. You may also start a new import by either resetting all values or keeping the existing settings. (For example, you may choose to keep connection string information, source and target choice, and more.)

    ![Screenshot of Azure Cosmos DB JSON export option](./media/import-data/newimport.png)

## Next steps

In this tutorial, you've done the following tasks:

> [!div class="checklist"]
> * Installed the Data Migration tool
> * Imported data from different data sources
> * Exported from Azure Cosmos DB to JSON

You can now proceed to the next tutorial and learn how to query data using Azure Cosmos DB.

> [!div class="nextstepaction"]
>[How to query data?](../cosmos-db/tutorial-query-sql-api.md)
