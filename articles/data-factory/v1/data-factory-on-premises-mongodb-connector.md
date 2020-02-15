---
title: Move data from MongoDB
description: Learn about how to move data from MongoDB database using Azure Data Factory.
services: data-factory
author: linda33wj
ms.author: jingwang
manager: shwang
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 04/13/2018
---

# Move data From MongoDB using Azure Data Factory

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-on-premises-mongodb-connector.md)
> * [Version 2 (current version)](../connector-mongodb.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [MongoDB connector in V2](../connector-mongodb.md).


This article explains how to use the Copy Activity in Azure Data Factory to move data from an on-premises MongoDB database. It builds on the [Data Movement Activities](data-factory-data-movement-activities.md) article, which presents a general overview of data movement with the copy activity.

You can copy data from an on-premises MongoDB data store to any supported sink data store. For a list of data stores supported as sinks by the copy activity, see the [Supported data stores](data-factory-data-movement-activities.md#supported-data-stores-and-formats) table. Data factory currently supports only moving data from a MongoDB data store to other data stores, but not for moving data from other data stores to an MongoDB datastore.

## Prerequisites
For the Azure Data Factory service to be able to connect to your on-premises MongoDB database, you must install the following components:

- Supported MongoDB versions are: 2.4, 2.6, 3.0, 3.2, 3.4 and 3.6.
- Data Management Gateway on the same machine that hosts the database or on a separate machine to avoid competing for resources with the database. Data Management Gateway is a software that connects on-premises data sources to cloud services in a secure and managed way. See [Data Management Gateway](data-factory-data-management-gateway.md) article for details about Data Management Gateway. See [Move data from on-premises to cloud](data-factory-move-data-between-onprem-and-cloud.md) article for step-by-step instructions on setting up the gateway a data pipeline to move data.

    When you install the gateway, it automatically installs a Microsoft MongoDB ODBC driver used to connect to MongoDB.

    > [!NOTE]
    > You need to use the gateway to connect to MongoDB even if it is hosted in Azure IaaS VMs. If you are trying to connect to an instance of MongoDB hosted in cloud, you can also install the gateway instance in the IaaS VM.

## Getting started
You can create a pipeline with a copy activity that moves data from an on-premises MongoDB data store by using different tools/APIs.

The easiest way to create a pipeline is to use the **Copy Wizard**. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard.

You can also use the following tools to create a pipeline: **Visual Studio**, **Azure PowerShell**, **Azure Resource Manager template**, **.NET API**, and **REST API**. See [Copy activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions to create a pipeline with a copy activity.

Whether you use the tools or APIs, you perform the following steps to create a pipeline that moves data from a source data store to a sink data store:

1. Create **linked services** to link input and output data stores to your data factory.
2. Create **datasets** to represent input and output data for the copy operation.
3. Create a **pipeline** with a copy activity that takes a dataset as an input and a dataset as an output.

When you use the wizard, JSON definitions for these Data Factory entities (linked services, datasets, and the pipeline) are automatically created for you. When you use tools/APIs (except .NET API), you define these Data Factory entities by using the JSON format.  For a sample with JSON definitions for Data Factory entities that are used to copy data from an on-premises MongoDB data store, see [JSON example: Copy data from MongoDB to Azure Blob](#json-example-copy-data-from-mongodb-to-azure-blob) section of this article.

The following sections provide details about JSON properties that are used to define Data Factory entities specific to MongoDB source:

## Linked service properties
The following table provides description for JSON elements specific to **OnPremisesMongoDB** linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **OnPremisesMongoDb** |Yes |
| server |IP address or host name of the MongoDB server. |Yes |
| port |TCP port that the MongoDB server uses to listen for client connections. |Optional, default value: 27017 |
| authenticationType |Basic, or Anonymous. |Yes |
| username |User account to access MongoDB. |Yes (if basic authentication is used). |
| password |Password for the user. |Yes (if basic authentication is used). |
| authSource |Name of the MongoDB database that you want to use to check your credentials for authentication. |Optional (if basic authentication is used). default: uses the admin account and the database specified using databaseName property. |
| databaseName |Name of the MongoDB database that you want to access. |Yes |
| gatewayName |Name of the gateway that accesses the data store. |Yes |
| encryptedCredential |Credential encrypted by gateway. |Optional |

## Dataset properties
For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc.).

The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **MongoDbCollection** has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| collectionName |Name of the collection in MongoDB database. |Yes |

## Copy activity properties
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output tables, and policy are available for all types of activities.

Properties available in the **typeProperties** section of the activity on the other hand vary with each activity type. For Copy activity, they vary depending on the types of sources and sinks.

When the source is of type **MongoDbSource** the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL-92 query string. For example: select * from MyTable. |No (if **collectionName** of **dataset** is specified) |



## JSON example: Copy data from MongoDB to Azure Blob
This example provides sample JSON definitions that you can use to create a pipeline by using [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). It shows how to copy data from an on-premises MongoDB to an Azure Blob Storage. However, data can be copied to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores-and-formats) using the Copy Activity in Azure Data Factory.

The sample has the following data factory entities:

1. A linked service of type [OnPremisesMongoDb](#linked-service-properties).
2. A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
3. An input [dataset](data-factory-create-datasets.md) of type [MongoDbCollection](#dataset-properties).
4. An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
5. A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [MongoDbSource](#copy-activity-properties) and [BlobSink](data-factory-azure-blob-connector.md#copy-activity-properties).

The sample copies data from a query result in MongoDB database to a blob every hour. The JSON properties used in these samples are described in sections following the samples.

As a first step, setup the data management gateway as per the instructions in the [Data Management Gateway](data-factory-data-management-gateway.md) article.

**MongoDB linked service:**

```json
{
    "name": "OnPremisesMongoDbLinkedService",
    "properties":
    {
        "type": "OnPremisesMongoDb",
        "typeProperties":
        {
            "authenticationType": "<Basic or Anonymous>",
            "server": "< The IP address or host name of the MongoDB server >",
            "port": "<The number of the TCP port that the MongoDB server uses to listen for client connections.>",
            "username": "<username>",
            "password": "<password>",
            "authSource": "< The database that you want to use to check your credentials for authentication. >",
            "databaseName": "<database name>",
            "gatewayName": "<mygateway>"
        }
    }
}
```

**Azure Storage linked service:**

```json
{
  "name": "AzureStorageLinkedService",
  "properties": {
    "type": "AzureStorage",
    "typeProperties": {
      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
    }
  }
}
```

**MongoDB input dataset:**
Setting “external”: ”true” informs the Data Factory service that the table is external to the data factory and is not produced by an activity in the data factory.

```json
{
    "name": "MongoDbInputDataset",
    "properties": {
        "type": "MongoDbCollection",
        "linkedServiceName": "OnPremisesMongoDbLinkedService",
        "typeProperties": {
            "collectionName": "<Collection name>"
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true
    }
}
```

**Azure Blob output dataset:**

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time.

```json
{
    "name": "AzureBlobOutputDataSet",
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": "AzureStorageLinkedService",
        "typeProperties": {
            "folderPath": "mycontainer/frommongodb/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
            "format": {
                "type": "TextFormat",
                "rowDelimiter": "\n",
                "columnDelimiter": "\t"
            },
            "partitionedBy": [
                {
                    "name": "Year",
                    "value": {
                        "type": "DateTime",
                        "date": "SliceStart",
                        "format": "yyyy"
                    }
                },
                {
                    "name": "Month",
                    "value": {
                        "type": "DateTime",
                        "date": "SliceStart",
                        "format": "MM"
                    }
                },
                {
                    "name": "Day",
                    "value": {
                        "type": "DateTime",
                        "date": "SliceStart",
                        "format": "dd"
                    }
                },
                {
                    "name": "Hour",
                    "value": {
                        "type": "DateTime",
                        "date": "SliceStart",
                        "format": "HH"
                    }
                }
            ]
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        }
    }
}
```

**Copy activity in a pipeline with MongoDB source and Blob sink:**

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **MongoDbSource** and **sink** type is set to **BlobSink**. The SQL query specified for the **query** property selects the data in the past hour to copy.

```json
{
    "name": "CopyMongoDBToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "MongoDbSource",
                        "query": "$$Text.Format('select * from MyTable where LastModifiedDate >= {{ts\'{0:yyyy-MM-dd HH:mm:ss}\'}} AND LastModifiedDate < {{ts\'{1:yyyy-MM-dd HH:mm:ss}\'}}', WindowStart, WindowEnd)"
                    },
                    "sink": {
                        "type": "BlobSink",
                        "writeBatchSize": 0,
                        "writeBatchTimeout": "00:00:00"
                    }
                },
                "inputs": [
                    {
                        "name": "MongoDbInputDataset"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobOutputDataSet"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1
                },
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                },
                "name": "MongoDBToAzureBlob"
            }
        ],
        "start": "2016-06-01T18:00:00Z",
        "end": "2016-06-01T19:00:00Z"
    }
}
```


## Schema by Data Factory
Azure Data Factory service infers schema from a MongoDB collection by using the latest 100 documents in the collection. If these 100 documents do not contain full schema, some columns may be ignored during the copy operation.

## Type mapping for MongoDB
As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article, Copy activity performs automatic type conversions from source types to sink types with the following 2-step approach:

1. Convert from native source types to .NET type
2. Convert from .NET type to native sink type

When moving data to MongoDB the following mappings are used from MongoDB types to .NET types.

| MongoDB type | .NET Framework type |
| --- | --- |
| Binary |Byte[] |
| Boolean |Boolean |
| Date |DateTime |
| NumberDouble |Double |
| NumberInt |Int32 |
| NumberLong |Int64 |
| ObjectID |String |
| String |String |
| UUID |Guid |
| Object |Renormalized into flatten columns with “_” as nested separator |

> [!NOTE]
> To learn about support for arrays using virtual tables, refer to [Support for complex types using virtual tables](#support-for-complex-types-using-virtual-tables) section below.

Currently, the following MongoDB data types are not supported: DBPointer, JavaScript, Max/Min key, Regular Expression, Symbol, Timestamp, Undefined

## Support for complex types using virtual tables
Azure Data Factory uses a built-in ODBC driver to connect to and copy data from your MongoDB database. For complex types such as arrays or objects with different types across the documents, the driver re-normalizes data into corresponding virtual tables. Specifically, if a table contains such columns, the driver generates the following virtual tables:

* A **base table**, which contains the same data as the real table except for the complex type columns. The base table uses the same name as the real table that it represents.
* A **virtual table** for each complex type column, which expands the nested data. The virtual tables are named using the name of the real table, a separator “_” and the name of the array or object.

Virtual tables refer to the data in the real table, enabling the driver to access the denormalized data. See Example section below details. You can access the content of MongoDB arrays by querying and joining the virtual tables.

You can use the [Copy Wizard](data-factory-data-movement-activities.md#create-a-pipeline-with-copy-activity) to intuitively view the list of tables in MongoDB database including the virtual tables, and preview the data inside. You can also construct a query in the Copy Wizard and validate to see the result.

### Example
For example, “ExampleTable” below is a MongoDB table that has one column with an array of Objects in each cell – Invoices, and one column with an array of Scalar types – Ratings.

| _id | Customer Name | Invoices | Service Level | Ratings |
| --- | --- | --- | --- | --- |
| 1111 |ABC |[{invoice_id:”123”, item:”toaster”, price:”456”, discount:”0.2”}, {invoice_id:”124”, item:”oven”, price: ”1235”, discount: ”0.2”}] |Silver |[5,6] |
| 2222 |XYZ |[{invoice_id:”135”, item:”fridge”, price: ”12543”, discount: ”0.0”}] |Gold |[1,2] |

The driver would generate multiple virtual tables to represent this single table. The first virtual table is the base table named “ExampleTable”, shown below. The base table contains all the data of the original table, but the data from the arrays has been omitted and is expanded in the virtual tables.

| _id | Customer Name | Service Level |
| --- | --- | --- |
| 1111 |ABC |Silver |
| 2222 |XYZ |Gold |

The following tables show the virtual tables that represent the original arrays in the example. These tables contain the following:

* A reference back to the original primary key column corresponding to the row of the original array (via the _id column)
* An indication of the position of the data within the original array
* The expanded data for each element within the array

Table “ExampleTable_Invoices”:

| _id | ExampleTable_Invoices_dim1_idx | invoice_id | item | price | Discount |
| --- | --- | --- | --- | --- | --- |
| 1111 |0 |123 |toaster |456 |0.2 |
| 1111 |1 |124 |oven |1235 |0.2 |
| 2222 |0 |135 |fridge |12543 |0.0 |

Table “ExampleTable_Ratings”:

| _id | ExampleTable_Ratings_dim1_idx | ExampleTable_Ratings |
| --- | --- | --- |
| 1111 |0 |5 |
| 1111 |1 |6 |
| 2222 |0 |1 |
| 2222 |1 |2 |

## Map source to sink columns
To learn about mapping columns in source dataset to columns in sink dataset, see [Mapping dataset columns in Azure Data Factory](data-factory-map-columns.md).

## Repeatable read from relational sources
When copying data from relational data stores, keep repeatability in mind to avoid unintended outcomes. In Azure Data Factory, you can rerun a slice manually. You can also configure retry policy for a dataset so that a slice is rerun when a failure occurs. When a slice is rerun in either way, you need to make sure that the same data is read no matter how many times a slice is run. See [Repeatable read from relational sources](data-factory-repeatable-copy.md#repeatable-read-from-relational-sources).

## Performance and Tuning
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.

## Next Steps
See [Move data between on-premises and cloud](data-factory-move-data-between-onprem-and-cloud.md) article for step-by-step instructions for creating a data pipeline that moves data from an on-premises data store to an Azure data store.
