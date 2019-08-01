---
title: Push data to Search index by using Data Factory | Microsoft Docs
description: 'Learn about how to push data to Azure Search Index by using Azure Data Factory.'
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg


ms.assetid: f8d46e1e-5c37-4408-80fb-c54be532a4ab
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 01/22/2018
ms.author: jingwang

robots: noindex
---

# Push data to an Azure Search index by using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-azure-search-connector.md)
> * [Version 2 (current version)](../connector-azure-search.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [Azure Search connector in V2](../connector-azure-search.md).

This article describes how to use the Copy Activity to push data from a supported source data store to Azure Search index. Supported source data stores are listed in the Source column of the [supported sources and sinks](data-factory-data-movement-activities.md#supported-data-stores-and-formats) table. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article, which presents a general overview of data movement with Copy Activity and supported data store combinations.

## Enabling connectivity
To allow Data Factory service connect to an on-premises data store, you install Data Management Gateway in your on-premises environment. You can install gateway on the same machine that hosts the source data store or on a separate machine to avoid competing for resources with the data store.

Data Management Gateway connects on-premises data sources to cloud services in a secure and managed way. See [Move data between on-premises and cloud](data-factory-move-data-between-onprem-and-cloud.md) article for details about Data Management Gateway.

## Getting started
You can create a pipeline with a copy activity that pushes data from a source data store to Azure Search index by using different tools/APIs.

The easiest way to create a pipeline is to use the **Copy Wizard**. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard.

You can also use the following tools to create a pipeline: **Visual Studio**, **Azure PowerShell**, **Azure Resource Manager template**, **.NET API**, and **REST API**. See [Copy activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions to create a pipeline with a copy activity.

Whether you use the tools or APIs, you perform the following steps to create a pipeline that moves data from a source data store to a sink data store:

1. Create **linked services** to link input and output data stores to your data factory.
2. Create **datasets** to represent input and output data for the copy operation.
3. Create a **pipeline** with a copy activity that takes a dataset as an input and a dataset as an output.

When you use the wizard, JSON definitions for these Data Factory entities (linked services, datasets, and the pipeline) are automatically created for you. When you use tools/APIs (except .NET API), you define these Data Factory entities by using the JSON format.  For a sample with JSON definitions for Data Factory entities that are used to copy data to Azure Search index, see [JSON example: Copy data from on-premises SQL Server to Azure Search index](#json-example-copy-data-from-on-premises-sql-server-to-azure-search-index) section of this article.

The following sections provide details about JSON properties that are used to define Data Factory entities specific to Azure Search Index:

## Linked service properties

The following table provides descriptions for JSON elements that are specific to the Azure Search linked service.

| Property | Description | Required |
| -------- | ----------- | -------- |
| type | The type property must be set to: **AzureSearch**. | Yes |
| url | URL for the Azure Search service. | Yes |
| key | Admin key for the Azure Search service. | Yes |

## Dataset properties

For a full list of sections and properties that are available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types. The **typeProperties** section is different for each type of dataset. The typeProperties section for a dataset of the type **AzureSearchIndex** has the following properties:

| Property | Description | Required |
| -------- | ----------- | -------- |
| type | The type property must be set to **AzureSearchIndex**.| Yes |
| indexName | Name of the Azure Search index. Data Factory does not create the index. The index must exist in Azure Search. | Yes |


## Copy activity properties
For a full list of sections and properties that are available for defining activities, see the [Creating pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output tables, and various policies are available for all types of activities. Whereas, properties available in the typeProperties section vary with each activity type. For Copy Activity, they vary depending on the types of sources and sinks.

For Copy Activity, when the sink is of the type **AzureSearchIndexSink**, the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| WriteBehavior | Specifies whether to merge or replace when a document already exists in the index. See the [WriteBehavior property](#writebehavior-property).| Merge (default)<br/>Upload| No |
| WriteBatchSize | Uploads data into the Azure Search index when the buffer size reaches writeBatchSize. See the [WriteBatchSize property](#writebatchsize-property) for details. | 1 to 1,000. Default value is 1000. | No |

### WriteBehavior property
AzureSearchSink upserts when writing data. In other words, when writing a document, if the document key already exists in the Azure Search index, Azure Search updates the existing document rather than throwing a conflict exception.

The AzureSearchSink provides the following two upsert behaviors (by using AzureSearch SDK):

- **Merge**: combine all the columns in the new document with the existing one. For columns with null value in the new document, the value in the existing one is preserved.
- **Upload**: The new document replaces the existing one. For columns not specified in the new document, the value is set to null whether there is a non-null value in the existing document or not.

The default behavior is **Merge**.

### WriteBatchSize Property
Azure Search service supports writing documents as a batch. A batch can contain 1 to 1,000 Actions. An action handles one document to perform the upload/merge operation.

### Data type support
The following table specifies whether an Azure Search data type is supported or not.

| Azure Search data type | Supported in Azure Search Sink |
| ---------------------- | ------------------------------ |
| String | Y |
| Int32 | Y |
| Int64 | Y |
| Double | Y |
| Boolean | Y |
| DataTimeOffset | Y |
| String Array | N |
| GeographyPoint | N |

## JSON example: Copy data from on-premises SQL Server to Azure Search index

The following sample shows:

1. A linked service of type [AzureSearch](#linked-service-properties).
2. A linked service of type [OnPremisesSqlServer](data-factory-sqlserver-connector.md#linked-service-properties).
3. An input [dataset](data-factory-create-datasets.md) of type [SqlServerTable](data-factory-sqlserver-connector.md#dataset-properties).
4. An output [dataset](data-factory-create-datasets.md) of type [AzureSearchIndex](#dataset-properties).
4. A [pipeline](data-factory-create-pipelines.md) with a Copy activity that uses [SqlSource](data-factory-sqlserver-connector.md#copy-activity-properties) and [AzureSearchIndexSink](#copy-activity-properties).

The sample copies time-series data from an on-premises SQL Server database to an Azure Search index hourly. The JSON properties used in this sample are described in sections following the samples.

As a first step, setup the data management gateway on your on-premises machine. The instructions are in the [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article.

**Azure Search linked service:**

```JSON
{
    "name": "AzureSearchLinkedService",
    "properties": {
        "type": "AzureSearch",
        "typeProperties": {
            "url": "https://<service>.search.windows.net",
            "key": "<AdminKey>"
        }
    }
}
```

**SQL Server linked service**

```JSON
{
  "Name": "SqlServerLinkedService",
  "properties": {
    "type": "OnPremisesSqlServer",
    "typeProperties": {
      "connectionString": "Data Source=<servername>;Initial Catalog=<databasename>;Integrated Security=False;User ID=<username>;Password=<password>;",
      "gatewayName": "<gatewayname>"
    }
  }
}
```

**SQL Server input dataset**

The sample assumes you have created a table “MyTable” in SQL Server and it contains a column called “timestampcolumn” for time series data. You can query over multiple tables within the same database using a single dataset, but a single table must be used for the dataset's tableName typeProperty.

Setting “external”: ”true” informs Data Factory service that the dataset is external to the data factory and is not produced by an activity in the data factory.

```JSON
{
  "name": "SqlServerDataset",
  "properties": {
    "type": "SqlServerTable",
    "linkedServiceName": "SqlServerLinkedService",
    "typeProperties": {
      "tableName": "MyTable"
    },
    "external": true,
    "availability": {
      "frequency": "Hour",
      "interval": 1
    },
    "policy": {
      "externalData": {
        "retryInterval": "00:01:00",
        "retryTimeout": "00:10:00",
        "maximumRetry": 3
      }
    }
  }
}
```

**Azure Search output dataset:**

The sample copies data to an Azure Search index named **products**. Data Factory does not create the index. To test the sample, create an index with this name. Create the Azure Search index with the same number of columns as in the input dataset. New entries are added to the Azure Search index every hour.

```JSON
{
    "name": "AzureSearchIndexDataset",
    "properties": {
        "type": "AzureSearchIndex",
        "linkedServiceName": "AzureSearchLinkedService",
        "typeProperties" : {
            "indexName": "products",
        },
        "availability": {
            "frequency": "Minute",
            "interval": 15
        }
    }
}
```

**Copy activity in a pipeline with SQL source and Azure Search Index sink:**

The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **SqlSource** and **sink** type is set to **AzureSearchIndexSink**. The SQL query specified for the **SqlReaderQuery** property selects the data in the past hour to copy.

```JSON
{
  "name":"SamplePipeline",
  "properties":{
    "start":"2014-06-01T18:00:00",
    "end":"2014-06-01T19:00:00",
    "description":"pipeline for copy activity",
    "activities":[
      {
        "name": "SqlServertoAzureSearchIndex",
        "description": "copy activity",
        "type": "Copy",
        "inputs": [
          {
            "name": " SqlServerInput"
          }
        ],
        "outputs": [
          {
            "name": "AzureSearchIndexDataset"
          }
        ],
        "typeProperties": {
          "source": {
            "type": "SqlSource",
            "SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
          },
          "sink": {
            "type": "AzureSearchIndexSink"
          }
        },
        "scheduler": {
          "frequency": "Hour",
          "interval": 1
        },
        "policy": {
          "concurrency": 1,
          "executionPriorityOrder": "OldestFirst",
          "retry": 0,
          "timeout": "01:00:00"
        }
      }
    ]
  }
}
```

If you are copying data from a cloud data store into Azure Search, `executionLocation` property is required. The following JSON snippet shows the change needed under Copy Activity `typeProperties` as an example. Check [Copy data between cloud data stores](data-factory-data-movement-activities.md#global) section for supported values and more details.

```JSON
"typeProperties": {
  "source": {
    "type": "BlobSource"
  },
  "sink": {
    "type": "AzureSearchIndexSink"
  },
  "executionLocation": "West US"
}
```


## Copy from a cloud source
If you are copying data from a cloud data store into Azure Search, `executionLocation` property is required. The following JSON snippet shows the change needed under Copy Activity `typeProperties` as an example. Check [Copy data between cloud data stores](data-factory-data-movement-activities.md#global) section for supported values and more details.

```JSON
"typeProperties": {
  "source": {
    "type": "BlobSource"
  },
  "sink": {
    "type": "AzureSearchIndexSink"
  },
  "executionLocation": "West US"
}
```

You can also map columns from source dataset to columns from sink dataset in the copy activity definition. For details, see [Mapping dataset columns in Azure Data Factory](data-factory-map-columns.md).

## Performance and tuning
See the [Copy Activity performance and tuning guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) and various ways to optimize it.

## Next steps
See the following articles:

* [Copy Activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions for creating a pipeline with a Copy Activity.
