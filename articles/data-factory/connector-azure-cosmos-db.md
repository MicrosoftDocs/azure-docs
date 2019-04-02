---
title: Copy data to or from Azure Cosmos DB (SQL API) by using Data Factory | Microsoft Docs
description: Learn how to copy data from supported source data stores to or from Azure Cosmos DB (SQL API) to supported sink stores by using Data Factory.
services: data-factory, cosmosdb
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: multiple
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 02/01/2019
ms.author: jingwang

---
# Copy data to or from Azure Cosmos DB (SQL API) by using Azure Data Factory

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-azure-documentdb-connector.md)
> * [Current version](connector-azure-cosmos-db.md)

This article outlines how to use Copy Activity in Azure Data Factory to copy data from and to Azure Cosmos DB (SQL API). The article builds on [Copy Activity in Azure Data Factory](copy-activity-overview.md), which presents a general overview of Copy Activity.

>[!NOTE]
>This connector only support copy data to/from Cosmos DB SQL API. For MongoDB API, refer to [connector for Azure Cosmos DB's API for MongoDB](connector-azure-cosmos-db-mongodb-api.md). Other API types are not supported now.

## Supported capabilities

You can copy data from Azure Cosmos DB (SQL API) to any supported sink data store, or copy data from any supported source data store to Azure Cosmos DB (SQL API). For a list of data stores that Copy Activity supports as sources and sinks, see [Supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).

You can use the Azure Cosmos DB (SQL API) connector to:

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

This section provides a list of properties that the Azure Cosmos DB (SQL API) dataset supports. 

For a full list of sections and properties that are available for defining datasets, see [Datasets and linked services](concepts-datasets-linked-services.md). 

To copy data from or to Azure Cosmos DB (SQL API), set the **type** property of the dataset to **DocumentDbCollection**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the dataset must be set to **DocumentDbCollection**. |Yes |
| collectionName |The name of the Azure Cosmos DB document collection. |Yes |

**Example**

```json
{
    "name": "CosmosDbSQLAPIDataset",
    "properties": {
        "type": "DocumentDbCollection",
        "linkedServiceName":{
            "referenceName": "<Azure Cosmos DB linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "collectionName": "<collection name>"
        }
    }
}
```

### Schema by Data Factory

For schema-free data stores like Azure Cosmos DB, Copy Activity infers the schema in one of the ways described in the following list. Unless you want to [import or export JSON documents as-is](#import-or-export-json-documents), the best practice is to specify the structure of data in the **structure** section.

* If you specify the structure of data by using the **structure** property in the dataset definition, Data Factory honors this structure as the schema. 

    If a row doesn't contain a value for a column, a null value is provided for the column value.
* If you don't specify the structure of data by using the **structure** property in the dataset definition, the Data Factory service infers the schema by using the first row in the data. 

    If the first row doesn't contain the full schema, some columns will be missing in the result of the copy operation.

## Copy Activity properties

This section provides a list of properties that the Azure Cosmos DB (SQL API) source and sink support.

For a full list of sections and properties that are available for defining activities, see [Pipelines](concepts-pipelines-activities.md).

### Azure Cosmos DB (SQL API) as source

To copy data from Azure Cosmos DB (SQL API), set the **source** type in Copy Activity to **DocumentDbCollectionSource**. 

The following properties are supported in the Copy Activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the copy activity source must be set to **DocumentDbCollectionSource**. |Yes |
| query |Specify the Azure Cosmos DB query to read data.<br/><br/>Example:<br /> `SELECT c.BusinessEntityID, c.Name.First AS FirstName, c.Name.Middle AS MiddleName, c.Name.Last AS LastName, c.Suffix, c.EmailPromotion FROM c WHERE c.ModifiedDate > \"2009-01-01T00:00:00\"` |No <br/><br/>If not specified, this SQL statement is executed: `select <columns defined in structure> from mycollection` |
| nestingSeparator |A special character that indicates that the document is nested and how to flatten the result set.<br/><br/>For example, if an Azure Cosmos DB query returns the nested result `"Name": {"First": "John"}`, Copy Activity identifies the column name as `Name.First`, with the value "John", when the **nestedSeparator** value  is **.** (dot). |No<br />(the default is **.** (dot)) |

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
                "type": "DocumentDbCollectionSource",
                "query": "SELECT c.BusinessEntityID, c.Name.First AS FirstName, c.Name.Middle AS MiddleName, c.Name.Last AS LastName, c.Suffix, c.EmailPromotion FROM c WHERE c.ModifiedDate > \"2009-01-01T00:00:00\""
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
| type | The **type** property of the Copy Activity sink must be set to **DocumentDbCollectionSink**. |Yes |
| writeBehavior |Describes how to write data to Azure Cosmos DB. Allowed values: **insert** and **upsert**.<br/><br/>The behavior of **upsert** is to replace the document if a document with the same ID already exists; otherwise, insert the document.<br /><br />**Note**: Data Factory automatically generates an ID for a document if an ID isn't specified either in the original document or by column mapping. This means that you must ensure that, for **upsert** to work as expected, your document has an ID. |No<br />(the default is **insert**) |
| writeBatchSize | Data Factory uses the [Azure Cosmos DB bulk executor library](https://github.com/Azure/azure-cosmosdb-bulkexecutor-dotnet-getting-started) to write data to Azure Cosmos DB. The **writeBatchSize** property controls the size of documents that ADF provide to the library. You can try increasing the value for **writeBatchSize** to improve performance and decreasing the value if your document size being large - see below tips. |No<br />(the default is **10,000**) |
| nestingSeparator |A special character in the **source** column name that indicates that a nested document is needed. <br/><br/>For example, `Name.First` in the output dataset structure generates the following JSON structure in the Azure Cosmos DB document when the **nestedSeparator** is **.** (dot): `"Name": {"First": "[value maps to this column from source]"}`  |No<br />(the default is **.** (dot)) |

>[!TIP]
>Cosmos DB limits single request's size to 2MB. The formula is Request Size = Single Document Size * Write Batch Size. If you hit error saying **"Request size is too large."**, **reduce the `writeBatchSize` value** in copy sink configuration.

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
                "type": "DocumentDbCollectionSink",
                "writeBehavior": "upsert"
            }
        }
    }
]
```

## Import or export JSON documents

You can use this Azure Cosmos DB (SQL API) connector to easily:

* Import JSON documents from various sources to Azure Cosmos DB, including from Azure Blob storage, Azure Data Lake Store, and other file-based stores that Azure Data Factory supports.
* Export JSON documents from an Azure Cosmos DB collection to various file-based stores.
* Copy documents between two Azure Cosmos DB collections as-is.

To achieve schema-agnostic copy:

* When you use the Copy Data tool, select the **Export as-is to JSON files or Cosmos DB collection** option.
* When you use activity authoring, don't specify the **structure** (also called *schema*) section in the Azure Cosmos DB dataset. Also, don't specify the **nestingSeparator** property in the Azure Cosmos DB source or sink in Copy Activity. When you import from or export to JSON files, in the corresponding file store dataset, specify the **format** type as **JsonFormat** and configure the **filePattern** as described in the [JSON format](supported-file-formats-and-compression-codecs.md#json-format) section. Then, don't specify the **structure** section and skip the rest of the format settings.

## Next steps

For a list of data stores that Copy Activity supports as sources and sinks in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).
