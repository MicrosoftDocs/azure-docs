---
title: Copy data from or to MongoDB
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from MongoDB to supported sink data stores, or from supported source data stores to MongoDB, using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
author: simplywilson
ms.author: tinglee
ms.subservice: data-movement
ms.topic: how-to
ms.date: 08/06/2026
ms.custom:
  - synapse
  - sfi-image-nochange
  - sfi-ropc-nochange
---

# Copy data from or to MongoDB by using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE [Migrate to Data Factory in Microsoft Fabric](includes/migrate-to-fabric.md)]

This article outlines how to use the Copy Activity in Azure Data Factory and Synapse Analytics pipelines to copy data from and to a MongoDB database. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!NOTE]
> This connector is also available in [Data Factory in Microsoft Fabric](/fabric/data-factory/data-factory-overview). For Fabric-specific configuration and features, see the [Fabric MongoDB connector documentation](/fabric/data-factory/connector-mongodb-overview).


>[!IMPORTANT]
> The new MongoDB connector provides improved native MongoDB support. If you're using the legacy MongoDB connector in your solution, supported as-is for backward compatibility only, see [MongoDB connector (legacy)](connector-mongodb-legacy.md).
> You can use this connector to copy data from and to an Azure DocumentDB (with MongoDB compatibility).


## Supported capabilities

This MongoDB connector supports the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/sink)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources and sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

Specifically, this MongoDB connector supports **versions up to 4.2**. If your work requires versions newer than 4.2, consider using MongoDB Atlas with the [MongoDB Atlas connector](connector-mongodb-atlas.md), which provides more comprehensive support and features.

## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](includes/data-factory-v2-integration-runtime-requirements.md)]


## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to MongoDB by using the UI

Use the following steps to create a linked service to MongoDB in the Azure portal UI.

1. Browse to the **Manage** tab in your Azure Data Factory or Synapse workspace and select **Linked Services**. Then select **New**:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Create a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Create a new linked service with Azure Synapse UI.":::

2. Search for MongoDB and select the MongoDB connector.

    :::image type="content" source="media/connector-mongodb/mongodb-connector.png" alt-text="Select the MongoDB connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-mongodb/configure-mongodb-linked-service.png" alt-text="Configure a linked service to MongoDB.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to MongoDB connector.


## Linked service properties

The following table lists the supported properties for a MongoDB linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type |Set the type property to: **MongoDbV2** |Yes |
| connectionString |Specify the MongoDB connection string, such as `mongodb://[username:password@]host[:port][/[database][?options]]`. For more details, see [MongoDB manual on connection string](https://docs.mongodb.com/manual/reference/connection-string/).

You can also put a connection string in Azure Key Vault. For more details, see [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |
| database | Name of the database that you want to access. | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to use to connect to the data store. To learn more, see the [Prerequisites](#prerequisites) section. If you don't specify this property, the default Azure Integration Runtime is used. |No |

**Example:**

```json
{
    "name": "MongoDBLinkedService",
    "properties": {
        "type": "MongoDbV2",
        "typeProperties": {
            "connectionString": "mongodb://[username:password@]host[:port][/[database][?options]]",
            "database": "myDatabase"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties that you can use to define datasets, see [Datasets and linked services](concepts-datasets-linked-services.md). The following table lists the supported properties for a MongoDB dataset:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | Set the type property of the dataset to: **MongoDbV2Collection** | Yes |
| collectionName |Name of the collection in MongoDB database. |Yes |

**Example:**

```json
{
    "name": "MongoDbDataset",
    "properties": {
        "type": "MongoDbV2Collection",
        "typeProperties": {
            "collectionName": "<Collection name>"
        },
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<MongoDB linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```


## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by MongoDB source and sink.

### MongoDB as source

The copy activity **source** section supports the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | Set the type property of the copy activity source to: **MongoDbV2Source** | Yes |
| filter | Specifies selection filter using query operators. To return all documents in a collection, omit this parameter or pass an empty document ({}). | No |
| cursorMethods.project | Specifies the fields to return in the documents for projection. To return all fields in the matching documents, omit this parameter. | No |
| cursorMethods.sort | Specifies the order in which the query returns matching documents. Refer to [cursor.sort()](https://docs.mongodb.com/manual/reference/method/cursor.sort/#cursor.sort). | No |
| cursorMethods.limit |	Specifies the maximum number of documents the server returns. Refer to [cursor.limit()](https://docs.mongodb.com/manual/reference/method/cursor.limit/#cursor.limit).  | No |
| cursorMethods.skip | Specifies the number of documents to skip and from where MongoDB begins to return results. Refer to [cursor.skip()](https://docs.mongodb.com/manual/reference/method/cursor.skip/#cursor.skip). | No |
| batchSize | Specifies the number of documents to return in each batch of the response from MongoDB instance. In most cases, modifying the batch size doesn't affect the user or the application. Azure Cosmos DB limits each batch can't exceed 40 MB in size, which is the sum of the batchSize number of documents' size, so decrease this value if your document size is large. | No<br/>(the default is **100**) |

>[!TIP]
> The service supports consuming BSON document in **Strict mode**. Ensure your filter query is in Strict mode instead of Shell mode. For more information, see [MongoDB manual](https://docs.mongodb.com/manual/reference/mongodb-extended-json/index.html).

**Example:**

```json
"activities":[
    {
        "name": "CopyFromMongoDB",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<MongoDB input dataset name>",
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
                "type": "MongoDbV2Source",
                "filter": "{datetimeData: {$gte: ISODate(\"2018-12-11T00:00:00.000Z\"),$lt: ISODate(\"2018-12-12T00:00:00.000Z\")}, _id: ObjectId(\"5acd7c3d0000000000000000\") }",
                "cursorMethods": {
                    "project": "{ _id : 1, name : 1, age: 1, datetimeData: 1 }",
                    "sort": "{ age : 1 }",
                    "skip": 3,
                    "limit": 3
                }
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

### MongoDB as sink

The Copy Activity **sink** section supports the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | Set the **type** property of the copy activity sink to **MongoDbV2Sink**. |Yes |
| writeBehavior |Describes how to write data to MongoDB. Allowed values: **insert** and **upsert**.<br/><br/>The behavior of **upsert** is to replace the document if a document with the same `_id` already exists; otherwise, insert the document.<br /><br />**Note**: The service automatically generates an `_id` for a document if an `_id` isn't specified either in the original document or by column mapping. This means that you must ensure that, for **upsert** to work as expected, your document has an ID. |No<br />(the default is **insert**) |
| writeBatchSize | The **writeBatchSize** property controls the number of documents to write in each batch. To improve performance, try increasing the value. If your document size is large, try decreasing the value. |No<br />(the default is **10,000**) |
| writeBatchTimeout | The wait time for the batch insert operation to finish before it times out. The allowed value is timespan. | No<br/>(the default is **00:30:00** - 30 minutes) |

>[!TIP]
>To import JSON documents as-is, see the [Import or export JSON documents](#import-and-export-json-documents) section. To copy from tabular-shaped data, see [Schema mapping](#data-type-mapping-for-mongodb).

**Example**

```json
"activities":[
    {
        "name": "CopyToMongoDB",
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
                "type": "MongoDbV2Sink",
                "writeBehavior": "upsert"
            }
        }
    }
]
```

## Import and export JSON documents

Use this MongoDB connector to easily:

* Copy documents between two MongoDB collections as-is.
* Import JSON documents from various sources to MongoDB, including from Azure Cosmos DB, Azure Blob storage, Azure Data Lake Store, and other supported file-based stores.
* Export JSON documents from a MongoDB collection to various file-based stores.

To achieve such schema-agnostic copy, skip the "structure" (also called *schema*) section in dataset and schema mapping in copy activity.

## Data type mapping for MongoDB

When you copy data from MongoDB, the service uses the following mappings from MongoDB data types to interim data types. For more information about how copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| MongoDB data Type | Interim Service Data Type |
|:---|:---|
| Date | Int64 |
| ObjectId | String |
| Decimal128 | String |
| TimeStamp | The most significant 32 bits -> Int64<br>The least significant 32 bits -> Int64 | 
| String | String |
| Double | String |
| Int32 | Int64 |
| Int64 | Int64 |
| Boolean | Boolean |
| Null | Null |
| JavaScript | String |
| Regular Expression | String |
| Min key | Int64 |
| Max key | Int64 |
| Binary | String |

## MongoDB connector lifecycle and upgrade

The following table shows the release stage and change logs for different versions of the MongoDB connector:

| Version  | Release stage           | Change log |
| :------- | :---------------------- |:---------- |
| MongoDB (legacy) | Removed | Not applicable. |
| MongoDB | GA version available | • Support the equivalent MongoDB queries only. <br><br>• Double is read as String data type. |

• Reads Double as String data type. |

### Upgrade the MongoDB linked service

Create a new MongoDB linked service and configure it by referring to [Linked service properties](#linked-service-properties).

## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
