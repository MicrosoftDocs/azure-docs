---
title: Copy and transform data in Azure Cosmos DB (SQL API) by using Data Factory 
description: Learn how to copy data to and from Azure Cosmos DB (SQL API), and and transform data in Azure Cosmos DB (SQL API) by using Data Factory.
services: data-factory, cosmosdb
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: multiple
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 11/13/2019
ms.author: jingwang

---
# Copy and transform data in Azure Cosmos DB (SQL API) by using Azure Data Factory

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-azure-documentdb-connector.md)
> * [Current version](connector-azure-cosmos-db.md)

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
- Import and export JSON documents as-is, or copy data from or to a tabular dataset. Examples include a SQL database and a CSV file. To copy documents as-is to or from JSON files or to or from another Azure Cosmos DB collection, see Import or export JSON documents.

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
| connectionString |Specify information that's required to connect to the Azure Cosmos DB database.<br />**Note**: You must specify database information in the connection string as shown in the examples that follow. <br/>Mark this field as a SecureString to store it securely in Data Factory. You can also put account key in Azure Key Vault and pull the `accountKey` configuration out of the connection string. Refer to the following samples and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article with more details. |Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to use to connect to the data store. You can use the Azure Integration Runtime or a self-hosted integration runtime (if your data store is located in a private network). If this property isn't specified, the default Azure Integration Runtime is used. |No |

**Example**

```json
{
    "name": "CosmosDbSQLAPILinkedService",
    "properties": {
        "type": "CosmosDb",
        "typeProperties": {
            "connectionString": {
                "type": "SecureString",
                "value": "AccountEndpoint=<EndpointUrl>;AccountKey=<AccessKey>;Database=<Database>"
            }
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
            "connectionString": {
                "type": "SecureString",
                "value": "AccountEndpoint=<EndpointUrl>;Database=<Database>"
            },
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

### Schema by Data Factory

For schema-free data stores like Azure Cosmos DB, Copy Activity infers the schema in one of the ways described in the following list. Unless you want to [import or export JSON documents as-is](#import-or-export-json-documents), the best practice is to specify the structure of data in the **structure** section.

Data Factory honors the mapping you specified on the activity. If a row doesn't contain a value for a column, a null value is provided for the column value.

If you don't specify a mapping, the Data Factory service infers the schema by using the first row in the data. If the first row doesn't contain the full schema, some columns will be missing in the result of the activity operation.

## Copy Activity properties

This section provides a list of properties that the Azure Cosmos DB (SQL API) source and sink support.

For a full list of sections and properties that are available for defining activities, see [Pipelines](concepts-pipelines-activities.md).

### Azure Cosmos DB (SQL API) as source

To copy data from Azure Cosmos DB (SQL API), set the **source** type in Copy Activity to **DocumentDbCollectionSource**. 

The following properties are supported in the Copy Activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the copy activity source must be set to **CosmosDbSqlApiSource**. |Yes |
| query |Specify the Azure Cosmos DB query to read data.<br/><br/>Example:<br /> `SELECT c.BusinessEntityID, c.Name.First AS FirstName, c.Name.Middle AS MiddleName, c.Name.Last AS LastName, c.Suffix, c.EmailPromotion FROM c WHERE c.ModifiedDate > \"2009-01-01T00:00:00\"` |No <br/><br/>If not specified, this SQL statement is executed: `select <columns defined in structure> from mycollection` |
| preferredRegions | The preferred list of regions to connect to when retriving data from Cosmos DB. | No |
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

### Azure Cosmos DB (SQL API) as sink

To copy data to Azure Cosmos DB (SQL API), set the **sink** type in Copy Activity to **DocumentDbCollectionSink**. 

The following properties are supported in the Copy Activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the Copy Activity sink must be set to **CosmosDbSqlApiSink**. |Yes |
| writeBehavior |Describes how to write data to Azure Cosmos DB. Allowed values: **insert** and **upsert**.<br/><br/>The behavior of **upsert** is to replace the document if a document with the same ID already exists; otherwise, insert the document.<br /><br />**Note**: Data Factory automatically generates an ID for a document if an ID isn't specified either in the original document or by column mapping. This means that you must ensure that, for **upsert** to work as expected, your document has an ID. |No<br />(the default is **insert**) |
| writeBatchSize | Data Factory uses the [Azure Cosmos DB bulk executor library](https://github.com/Azure/azure-cosmosdb-bulkexecutor-dotnet-getting-started) to write data to Azure Cosmos DB. The **writeBatchSize** property controls the size of documents that ADF provide to the library. You can try increasing the value for **writeBatchSize** to improve performance and decreasing the value if your document size being large - see below tips. |No<br />(the default is **10,000**) |
| disableMetricsCollection | Data Factory collects metrics such as Cosmos DB RUs for copy performance optimization and recommendations. If you are concerned with this behavior, specify `true` to turn it off. | No (default is `false`) |

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

## Mapping data flow properties

Learn details from [source transformation](data-flow-source.md) and [sink transformation](data-flow-sink.md) in mapping data flow.

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Import or export JSON documents

You can use this Azure Cosmos DB (SQL API) connector to easily:

* Import JSON documents from various sources to Azure Cosmos DB, including from Azure Blob storage, Azure Data Lake Store, and other file-based stores that Azure Data Factory supports.
* Export JSON documents from an Azure Cosmos DB collection to various file-based stores.
* Copy documents between two Azure Cosmos DB collections as-is.

To achieve schema-agnostic copy:

* When you use the Copy Data tool, select the **Export as-is to JSON files or Cosmos DB collection** option.
* When you use activity authoring, choose JSON format with the corresponding file store for source or sink.

## Next steps

For a list of data stores that Copy Activity supports as sources and sinks in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).
