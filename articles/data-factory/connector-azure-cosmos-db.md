---
title: Copy and transform data in Azure Cosmos DB (SQL API)
description: Learn how to copy data to and from Azure Cosmos DB (SQL API), and transform data in Azure Cosmos DB (SQL API) by using Data Factory.
services: data-factory, cosmosdb
ms.author: jingwang
author: linda33wj
manager: shwang
ms.reviewer: douglasl
ms.service: multiple
ms.workload: data-services
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 12/11/2019
---

# Copy and transform data in Azure Cosmos DB (SQL API) by using Azure Data Factory

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-azure-documentdb-connector.md)
> * [Current version](connector-azure-cosmos-db.md)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory to copy data from and to Azure Cosmos DB (SQL API), and use Data Flow to transform data in Azure Cosmos DB (SQL API). To learn about Azure Data Factory, read the [introductory article](introduction.md).



>[!NOTE]
>This connector only support Cosmos DB SQL API. For MongoDB API, refer to [connector for Azure Cosmos DB's API for MongoDB](connector-azure-cosmos-db-mongodb-api.md). Other API types are not supported now.

## Supported capabilities

This Azure Cosmos DB (SQL API) connector is supported for the following activities:

- [Copy activity](copy-activity-overview.md) with [supported source/sink matrix](copy-activity-overview.md)
- [Mapping data flow](concepts-data-flow-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)

For Copy activity, this Azure Cosmos DB (SQL API) connector supports:

- Copy data from and to the Azure Cosmos DB [SQL API](https://docs.microsoft.com/azure/cosmos-db/documentdb-introduction).
- Write to Azure Cosmos DB as **insert** or **upsert**.
- Import and export JSON documents as-is, or copy data from or to a tabular dataset. Examples include a SQL database and a CSV file. To copy documents as-is to or from JSON files or to or from another Azure Cosmos DB collection, see [Import and export JSON documents](#import-and-export-json-documents).

Data Factory integrates with the [Azure Cosmos DB bulk executor library](https://github.com/Azure/azure-cosmosdb-bulkexecutor-dotnet-getting-started) to provide the best performance when you write to Azure Cosmos DB.

> [!TIP]
> The [Data Migration video](https://youtu.be/5-SRNiC_qOU) walks you through the steps of copying data from Azure Blob storage to Azure Cosmos DB. The video also describes performance-tuning considerations for ingesting data to Azure Cosmos DB in general.

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties you can use to define Data Factory entities that are specific to Azure Cosmos DB (SQL API).

## Linked service properties

The following properties are supported for the Azure Cosmos DB (SQL API) linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property must be set to **CosmosDb**. | Yes |
| connectionString |Specify information that's required to connect to the Azure Cosmos DB database.<br />**Note**: You must specify database information in the connection string as shown in the examples that follow. <br/> You can also put account key in Azure Key Vault and pull the `accountKey` configuration out of the connection string. Refer to the following samples and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article with more details. |Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to use to connect to the data store. You can use the Azure Integration Runtime or a self-hosted integration runtime (if your data store is located in a private network). If this property isn't specified, the default Azure Integration Runtime is used. |No |

**Example**

```json
{
    "name": "CosmosDbSQLAPILinkedService",
    "properties": {
        "type": "CosmosDb",
        "typeProperties": {
            "connectionString": "AccountEndpoint=<EndpointUrl>;AccountKey=<AccessKey>;Database=<Database>"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example: store account key in Azure Key Vault**

```json
{
    "name": "CosmosDbSQLAPILinkedService",
    "properties": {
        "type": "CosmosDb",
        "typeProperties": {
            "connectionString": "AccountEndpoint=<EndpointUrl>;Database=<Database>",
            "accountKey": { 
                "type": "AzureKeyVaultSecret", 
                "store": { 
                    "referenceName": "<Azure Key Vault linked service name>", 
                    "type": "LinkedServiceReference" 
                }, 
                "secretName": "<secretName>" 
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties that are available for defining datasets, see [Datasets and linked services](concepts-datasets-linked-services.md).

The following properties are supported for Azure Cosmos DB (SQL API) dataset: 

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the dataset must be set to **CosmosDbSqlApiCollection**. |Yes |
| collectionName |The name of the Azure Cosmos DB document collection. |Yes |

If you use "DocumentDbCollection" type dataset, it is still supported as-is for backward compatibility for Copy and Lookup activity, it's not supported for Data Flow. You are suggested to use the new model going forward.

**Example**

```json
{
    "name": "CosmosDbSQLAPIDataset",
    "properties": {
        "type": "CosmosDbSqlApiCollection",
        "linkedServiceName":{
            "referenceName": "<Azure Cosmos DB linked service name>",
            "type": "LinkedServiceReference"
        },
        "schema": [],
        "typeProperties": {
            "collectionName": "<collection name>"
        }
    }
}
```

## Copy Activity properties

This section provides a list of properties that the Azure Cosmos DB (SQL API) source and sink support. For a full list of sections and properties that are available for defining activities, see [Pipelines](concepts-pipelines-activities.md).

### Azure Cosmos DB (SQL API) as source

To copy data from Azure Cosmos DB (SQL API), set the **source** type in Copy Activity to **DocumentDbCollectionSource**. 

The following properties are supported in the Copy Activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the copy activity source must be set to **CosmosDbSqlApiSource**. |Yes |
| query |Specify the Azure Cosmos DB query to read data.<br/><br/>Example:<br /> `SELECT c.BusinessEntityID, c.Name.First AS FirstName, c.Name.Middle AS MiddleName, c.Name.Last AS LastName, c.Suffix, c.EmailPromotion FROM c WHERE c.ModifiedDate > \"2009-01-01T00:00:00\"` |No <br/><br/>If not specified, this SQL statement is executed: `select <columns defined in structure> from mycollection` |
| preferredRegions | The preferred list of regions to connect to when retrieving data from Cosmos DB. | No |
| pageSize | The number of documents per page of the query result. Default is "-1" which means uses the service side dynamic page size up to 1000. | No |

If you use "DocumentDbCollectionSource" type source, it is still supported as-is for backward compatibility. You are suggested to use the new model going forward which provide richer capabilities to copy data from Cosmos DB.

**Example**

```json
"activities":[
    {
        "name": "CopyFromCosmosDBSQLAPI",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Cosmos DB SQL API input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "CosmosDbSqlApiSource",
                "query": "SELECT c.BusinessEntityID, c.Name.First AS FirstName, c.Name.Middle AS MiddleName, c.Name.Last AS LastName, c.Suffix, c.EmailPromotion FROM c WHERE c.ModifiedDate > \"2009-01-01T00:00:00\"",
                "preferredRegions": [
                    "East US"
                ]
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

When copy data from Cosmos DB, unless you want to [export JSON documents as-is](#import-and-export-json-documents), the best practice is to specify the mapping in copy activity. Data Factory honors the mapping you specified on the activity - if a row doesn't contain a value for a column, a null value is provided for the column value. If you don't specify a mapping, Data Factory infers the schema by using the first row in the data. If the first row doesn't contain the full schema, some columns will be missing in the result of the activity operation.

### Azure Cosmos DB (SQL API) as sink

To copy data to Azure Cosmos DB (SQL API), set the **sink** type in Copy Activity to **DocumentDbCollectionSink**. 

The following properties are supported in the Copy Activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the Copy Activity sink must be set to **CosmosDbSqlApiSink**. |Yes |
| writeBehavior |Describes how to write data to Azure Cosmos DB. Allowed values: **insert** and **upsert**.<br/><br/>The behavior of **upsert** is to replace the document if a document with the same ID already exists; otherwise, insert the document.<br /><br />**Note**: Data Factory automatically generates an ID for a document if an ID isn't specified either in the original document or by column mapping. This means that you must ensure that, for **upsert** to work as expected, your document has an ID. |No<br />(the default is **insert**) |
| writeBatchSize | Data Factory uses the [Azure Cosmos DB bulk executor library](https://github.com/Azure/azure-cosmosdb-bulkexecutor-dotnet-getting-started) to write data to Azure Cosmos DB. The **writeBatchSize** property controls the size of documents that ADF provides to the library. You can try increasing the value for **writeBatchSize** to improve performance and decreasing the value if your document size being large - see below tips. |No<br />(the default is **10,000**) |
| disableMetricsCollection | Data Factory collects metrics such as Cosmos DB RUs for copy performance optimization and recommendations. If you are concerned with this behavior, specify `true` to turn it off. | No (default is `false`) |

>[!TIP]
>To import JSON documents as-is, refer to [Import or export JSON documents](#import-and-export-json-documents) section; to copy from tabular-shaped data, refer to [Migrate from relational database to Cosmos DB](#migrate-from-relational-database-to-cosmos-db).

>[!TIP]
>Cosmos DB limits single request's size to 2MB. The formula is Request Size = Single Document Size * Write Batch Size. If you hit error saying **"Request size is too large."**, **reduce the `writeBatchSize` value** in copy sink configuration.

If you use "DocumentDbCollectionSink" type source, it is still supported as-is for backward compatibility. You are suggested to use the new model going forward which provide richer capabilities to copy data from Cosmos DB.

**Example**

```json
"activities":[
    {
        "name": "CopyToCosmosDBSQLAPI",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Document DB output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "CosmosDbSqlApiSink",
                "writeBehavior": "upsert"
            }
        }
    }
]
```

### Schema mapping

To copy data from Azure Cosmos DB to tabular sink or reversed, refer to [schema mapping](copy-activity-schema-and-type-mapping.md#schema-mapping).

## Mapping data flow properties

When transforming data in mapping data flow, you can read and write to collections in Cosmos DB. For more information, see the [source transformation](data-flow-source.md) and [sink transformation](data-flow-sink.md) in mapping data flows.

### Source transformation

Settings specific to Azure Cosmos DB are available in the **Source Options** tab of the source transformation. 

**Include system columns:** If true, ```id```, ```_ts```, and other system columns will be included in your data flow metadata from CosmosDB. When updating collections, it is important to include this so that you can grab the existing row id.

**Page size:** The number of documents per page of the query result. Default is "-1" which uses the service dynamic page up to 1000.

**Throughput:** Set an optional value for the number of RUs you'd like to apply to your CosmosDB collection for each execution of this data flow during the read operation. Minimum is 400.

**Preferred regions:** Choose the preferred read regions for this process.

#### JSON Settings

**Single document:** Select this option if ADF is to treat the entire file as a single JSON doc.

**Unquoted column names:** Select this option if column names in the JSON as not quoted.

**Has comments:** Use this selection if your JSON documents have comments in the data.

**Single quoted:** This should be selected if the columns and values in your document are quoted with single quotes.

**Backslash escaped:** If using backslashes to escape characters in your JSON, choose this option.

### Sink transformation

Settings specific to Azure Cosmos DB are available in the **Settings** tab of the sink transformation.

**Update method:** Determines what operations are allowed on your database destination. The default is to only allow inserts. To update, upsert, or delete rows, an alter-row transformation is required to tag rows for those actions. For updates, upserts and deletes, a key column or columns must be set to determine which row to alter.

**Collection action:** Determines whether to recreate the destination collection prior to writing.
* None: No action will be done to the collection.
* Recreate: The collection will get dropped and recreated

**Batch size**: Controls how many rows are being written in each bucket. Larger batch sizes improve compression and memory optimization, but risk out of memory exceptions when caching data.

**Partition Key:** Enter a string that represents the partition key for your collection. Example: ```/movies/title```

**Throughput:** Set an optional value for the number of RUs you'd like to apply to your CosmosDB collection for each execution of this data flow. Minimum is 400.

**Write throughput budget:** An integer that represents the number of RUs you want to allocate to the bulk ingestion Spark job. This number is out of the total throughput allocated to the collection.

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Import and export JSON documents

You can use this Azure Cosmos DB (SQL API) connector to easily:

* Copy documents between two Azure Cosmos DB collections as-is.
* Import JSON documents from various sources to Azure Cosmos DB, including from Azure Blob storage, Azure Data Lake Store, and other file-based stores that Azure Data Factory supports.
* Export JSON documents from an Azure Cosmos DB collection to various file-based stores.

To achieve schema-agnostic copy:

* When you use the Copy Data tool, select the **Export as-is to JSON files or Cosmos DB collection** option.
* When you use activity authoring, choose JSON format with the corresponding file store for source or sink.

## Migrate from relational database to Cosmos DB

When migrating from a relational database e.g. SQL Server to Azure Cosmos DB, copy activity can easily map tabular data from source to flatten JSON documents in Cosmos DB. In some cases, you may want to redesign the data model to optimize it for the NoSQL use-cases according to [Data modeling in Azure Cosmos DB](../cosmos-db/modeling-data.md), for example, to denormalize the data by embedding all of the related sub-items within one JSON document. For such case, refer to [this article](../cosmos-db/migrate-relational-to-cosmos-db-sql-api.md) with a walkthrough on how to achieve it using Azure Data Factory copy activity.

## Next steps

For a list of data stores that Copy Activity supports as sources and sinks in Azure Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
