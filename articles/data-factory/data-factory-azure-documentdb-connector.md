---
title: Move data to/from DocumentDB | Microsoft Docs
description: Learn how move data to/from Azure DocumentDB collection using Azure Data Factory
services: data-factory, documentdb
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: monicar

ms.assetid: c9297b71-1bb4-4b29-ba3c-4cf1f5575fac
ms.service: multiple
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/19/2017
ms.author: jingwang

---
# Move data to and from DocumentDB using Azure Data Factory
This article explains how to use the Copy Activity in Azure Data Factory to move data to/from Azure DocumentDB. It builds on the [Data Movement Activities](data-factory-data-movement-activities.md) article, which presents a general overview of data movement with the copy activity. 

You can copy data from any supported source data store to Azure DocumentDB or from Azure DocumentDB to any supported sink data store. For a list of data stores supported as sources or sinks by the copy activity, see the [Supported data stores](data-factory-data-movement-activities.md#supported-data-stores-and-formats) table. 

> [!NOTE]
> Copying data from on-premises/Azure IaaS data stores to Azure DocumentDB and vice versa are supported with Data Management Gateway version 2.1 and above.

## Supported versions
This DocumentDB connector supports copying data from/to DocumentDB single partition collection and partitioned collection. [DocDB for MongoDB](../documentdb/documentdb-protocol-mongodb.md) is not supported. To copy data as-is to/from JSON files or another DocumentDB collection, see [Import/Export JSON documents](#importexport-json-documents).

## Getting started
You can create a pipeline with a copy activity that moves data to/from Azure DocumentDB by using different tools/APIs.

The easiest way to create a pipeline is to use the **Copy Wizard**. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard.

You can also use the following tools to create a pipeline: **Azure portal**, **Visual Studio**, **Azure PowerShell**, **Azure Resource Manager template**, **.NET API**, and **REST API**. See [Copy activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions to create a pipeline with a copy activity. 

Whether you use the tools or APIs, you perform the following steps to create a pipeline that moves data from a source data store to a sink data store: 

1. Create **linked services** to link input and output data stores to your data factory.
2. Create **datasets** to represent input and output data for the copy operation. 
3. Create a **pipeline** with a copy activity that takes a dataset as an input and a dataset as an output. 

When you use the wizard, JSON definitions for these Data Factory entities (linked services, datasets, and the pipeline) are automatically created for you. When you use tools/APIs (except .NET API), you define these Data Factory entities by using the JSON format.  For samples with JSON definitions for Data Factory entities that are used to copy data to/from DocumentDB, see [JSON examples](#json-examples) section of this article. 

The following sections provide details about JSON properties that are used to define Data Factory entities specific to DocumentDB: 

## Linked service properties
The following table provides description for JSON elements specific to Azure DocumentDB linked service.

| **Property** | **Description** | **Required** |
| --- | --- | --- |
| type |The type property must be set to: **DocumentDb** |Yes |
| connectionString |Specify information needed to connect to Azure DocumentDB database. |Yes |

## Dataset properties
For a full list of sections & properties available for defining datasets please refer to the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc.).

The typeProperties section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for the dataset of type **DocumentDbCollection** has the following properties.

| **Property** | **Description** | **Required** |
| --- | --- | --- |
| collectionName |Name of the DocumentDB document collection. |Yes |

Example:

```JSON
{
  "name": "PersonDocumentDbTable",
  "properties": {
    "type": "DocumentDbCollection",
    "linkedServiceName": "DocumentDbLinkedService",
    "typeProperties": {
      "collectionName": "Person"
    },
    "external": true,
    "availability": {
      "frequency": "Day",
      "interval": 1
    }
  }
}
```
### Schema by Data Factory
For schema-free data stores such as DocumentDB, the Data Factory service infers the schema in one of the following ways:  

1. If you specify the structure of data by using the **structure** property in the dataset definition, the Data Factory service honors this structure as the schema. In this case, if a row does not contain a value for a column, a null value will be provided for it.
2. If you do not specify the structure of data by using the **structure** property in the dataset definition, the Data Factory service infers the schema by using the first row in the data. In this case, if the first row does not contain the full schema, some columns will be missing in the result of copy operation.

Therefore, for schema-free data sources, the best practice is to specify the structure of data using the **structure** property.

## Copy activity properties
For a full list of sections & properties available for defining activities please refer to the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output tables, and policy are available for all types of activities.

> [!NOTE]
> The Copy Activity takes only one input and produces only one output.

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

In case of Copy activity when source is of type **DocumentDbCollectionSource**
the following properties are available in **typeProperties** section:

| **Property** | **Description** | **Allowed values** | **Required** |
| --- | --- | --- | --- |
| query |Specify the query to read data. |Query string supported by DocumentDB. <br/><br/>Example: `SELECT c.BusinessEntityID, c.PersonType, c.NameStyle, c.Title, c.Name.First AS FirstName, c.Name.Last AS LastName, c.Suffix, c.EmailPromotion FROM c WHERE c.ModifiedDate > \"2009-01-01T00:00:00\"` |No <br/><br/>If not specified, the SQL statement that is executed: `select <columns defined in structure> from mycollection` |
| nestingSeparator |Special character to indicate that the document is nested |Any character. <br/><br/>DocumentDB is a NoSQL store for JSON documents, where nested structures are allowed. Azure Data Factory enables user to denote hierarchy via nestingSeparator, which is “.” in the above examples. With the separator, the copy activity will generate the “Name” object with three children elements First, Middle and Last, according to “Name.First”, “Name.Middle” and “Name.Last” in the table definition. |No |

**DocumentDbCollectionSink** supports the following properties:

| **Property** | **Description** | **Allowed values** | **Required** |
| --- | --- | --- | --- |
| nestingSeparator |A special character in the source column name to indicate that nested document is needed. <br/><br/>For example above: `Name.First` in the output table produces the following JSON structure in the DocumentDB document:<br/><br/>"Name": {<br/>    "First": "John"<br/>}, |Character that is used to separate nesting levels.<br/><br/>Default value is `.` (dot). |Character that is used to separate nesting levels. <br/><br/>Default value is `.` (dot). |
| writeBatchSize |Number of parallel requests to DocumentDB service to create documents.<br/><br/>You can fine-tune the performance when copying data to/from DocumentDB by using this property. You can expect a better performance when you increase writeBatchSize because more parallel requests to DocumentDB are sent. However you’ll need to avoid throttling that can throw the error message: "Request rate is large".<br/><br/>Throttling is decided by a number of factors, including size of documents, number of terms in documents, indexing policy of target collection, etc. For copy operations, you can use a better collection (e.g. S3) to have the most throughput available (2,500 request units/second). |Integer |No (default: 5) |
| writeBatchTimeout |Wait time for the operation to complete before it times out. |timespan<br/><br/> Example: “00:30:00” (30 minutes). |No |

## Import/Export JSON documents
Using this DocumentDB connector, you can easily

* Import JSON documents from various sources into DocumentDB, including Azure Blob, Azure Data Lake, on-premises File System or other file-based stores supported by Azure Data Factory.
* Export JSON documents from DocumentDB collecton into various file-based stores.
* Migrate data between two DocumentDB collections as-is.

To achieve such schema-agnostic copy, 
* When using copy wizard, check the **"Export as-is to JSON files or DocumentDB collection"** option.
* When using JSON editing, do not specify the "structure" section in DocumentDB dataset(s) nor "nestingSeparator" property on DocumentDB source/sink in copy activity. To import from/export to JSON files, in the file store dataset specify format type as "JsonFormat", config "filePattern" and skip the rest format settings, see [JSON format](data-factory-supported-file-and-compression-formats.md#json-format) section on details.

## JSON examples
The following examples provide sample JSON definitions that you can use to create a pipeline by using [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md) or [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). They show how to copy data to and from Azure DocumentDB and Azure Blob Storage. However, data can be copied **directly** from any of the sources to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores-and-formats) using the Copy Activity in Azure Data Factory.

## Example: Copy data from DocumentDB to Azure Blob
The sample below shows:

1. A linked service of type [DocumentDb](#linked-service-properties).
2. A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
3. An input [dataset](data-factory-create-datasets.md) of type [DocumentDbCollection](#dataset-properties).
4. An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
5. A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [DocumentDbCollectionSource](#copy-activity-properties) and [BlobSink](data-factory-azure-blob-connector.md#copy-activity-properties).

The sample copies data in Azure DocumentDB to Azure Blob. The JSON properties used in these samples are described in sections following the samples.

**Azure DocumentDB linked service:**

```JSON
{
  "name": "DocumentDbLinkedService",
  "properties": {
    "type": "DocumentDb",
    "typeProperties": {
      "connectionString": "AccountEndpoint=<EndpointUrl>;AccountKey=<AccessKey>;Database=<Database>"
    }
  }
}
```
**Azure Blob storage linked service:**

```JSON
{
  "name": "StorageLinkedService",
  "properties": {
    "type": "AzureStorage",
    "typeProperties": {
      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
    }
  }
}
```
**Azure Document DB input dataset:**

The sample assumes you have a collection named **Person** in an Azure DocumentDB database.

Setting “external”: ”true” and specifying externalData policy information the Azure Data Factory service that the table is external to the data factory and not produced by an activity in the data factory.

```JSON
{
  "name": "PersonDocumentDbTable",
  "properties": {
    "type": "DocumentDbCollection",
    "linkedServiceName": "DocumentDbLinkedService",
    "typeProperties": {
      "collectionName": "Person"
    },
    "external": true,
    "availability": {
      "frequency": "Day",
      "interval": 1
    }
  }
}
```

**Azure Blob output dataset:**

Data is copied to a new blob every hour with the path for the blob reflecting the specific datetime with hour granularity.

```JSON
{
  "name": "PersonBlobTableOut",
  "properties": {
    "type": "AzureBlob",
    "linkedServiceName": "StorageLinkedService",
    "typeProperties": {
      "folderPath": "docdb",
      "format": {
        "type": "TextFormat",
        "columnDelimiter": ",",
        "nullValue": "NULL"
      }
    },
    "availability": {
      "frequency": "Day",
      "interval": 1
    }
  }
}
```
Sample JSON document in the Person collection in a DocumentDB database:

```JSON
{
  "PersonId": 2,
  "Name": {
    "First": "Jane",
    "Middle": "",
    "Last": "Doe"
  }
}
```
DocumentDB supports querying documents using a SQL like syntax over hierarchical JSON documents.

Example: 

```sql
SELECT Person.PersonId, Person.Name.First AS FirstName, Person.Name.Middle as MiddleName, Person.Name.Last AS LastName FROM Person
```

The following pipeline copies data from the Person collection in the DocumentDB database to an Azure blob. As part of the copy activity the input and output datasets have been specified.  

```JSON
{
  "name": "DocDbToBlobPipeline",
  "properties": {
    "activities": [
      {
        "type": "Copy",
        "typeProperties": {
          "source": {
            "type": "DocumentDbCollectionSource",
            "query": "SELECT Person.Id, Person.Name.First AS FirstName, Person.Name.Middle as MiddleName, Person.Name.Last AS LastName FROM Person",
            "nestingSeparator": "."
          },
          "sink": {
            "type": "BlobSink",
            "blobWriterAddHeader": true,
            "writeBatchSize": 1000,
            "writeBatchTimeout": "00:00:59"
          }
        },
        "inputs": [
          {
            "name": "PersonDocumentDbTable"
          }
        ],
        "outputs": [
          {
            "name": "PersonBlobTableOut"
          }
        ],
        "policy": {
          "concurrency": 1
        },
        "name": "CopyFromDocDbToBlob"
      }
    ],
    "start": "2015-04-01T00:00:00Z",
    "end": "2015-04-02T00:00:00Z"
  }
}
```
## Example: Copy data from Azure Blob to Azure DocumentDB
The sample below shows:

1. A linked service of type [DocumentDb](#azure-documentdb-linked-service-properties).
2. A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
3. An input [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
4. An output [dataset](data-factory-create-datasets.md) of type [DocumentDbCollection](#azure-documentdb-dataset-type-properties).
5. A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [BlobSource](data-factory-azure-blob-connector.md#copy-activity-properties) and [DocumentDbCollectionSink](#azure-documentdb-copy-activity-type-properties).

The sample copies data from Azure blob to Azure DocumentDB. The JSON properties used in these samples are described in sections following the samples.

**Azure Blob storage linked service:**

```JSON
{
  "name": "StorageLinkedService",
  "properties": {
    "type": "AzureStorage",
    "typeProperties": {
      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
    }
  }
}
```
**Azure DocumentDB linked service:**

```JSON
{
  "name": "DocumentDbLinkedService",
  "properties": {
    "type": "DocumentDb",
    "typeProperties": {
      "connectionString": "AccountEndpoint=<EndpointUrl>;AccountKey=<AccessKey>;Database=<Database>"
    }
  }
}
```
**Azure Blob input dataset:**

```JSON
{
  "name": "PersonBlobTableIn",
  "properties": {
    "structure": [
      {
        "name": "Id",
        "type": "Int"
      },
      {
        "name": "FirstName",
        "type": "String"
      },
      {
        "name": "MiddleName",
        "type": "String"
      },
      {
        "name": "LastName",
        "type": "String"
      }
    ],
    "type": "AzureBlob",
    "linkedServiceName": "StorageLinkedService",
    "typeProperties": {
      "fileName": "input.csv",
      "folderPath": "docdb",
      "format": {
        "type": "TextFormat",
        "columnDelimiter": ",",
        "nullValue": "NULL"
      }
    },
    "external": true,
    "availability": {
      "frequency": "Day",
      "interval": 1
    }
  }
}
```
**Azure DocumentDB output dataset:**

The sample copies data to a collection named “Person”.

```JSON
{
  "name": "PersonDocumentDbTableOut",
  "properties": {
    "structure": [
      {
        "name": "Id",
        "type": "Int"
      },
      {
        "name": "Name.First",
        "type": "String"
      },
      {
        "name": "Name.Middle",
        "type": "String"
      },
      {
        "name": "Name.Last",
        "type": "String"
      }
    ],
    "type": "DocumentDbCollection",
    "linkedServiceName": "DocumentDbLinkedService",
    "typeProperties": {
      "collectionName": "Person"
    },
    "availability": {
      "frequency": "Day",
      "interval": 1
    }
  }
}
```
The following pipeline copies data from Azure Blob to the Person collection in the DocumentDB. As part of the copy activity the input and output datasets have been specified.

```JSON
{
  "name": "BlobToDocDbPipeline",
  "properties": {
    "activities": [
      {
        "type": "Copy",
        "typeProperties": {
          "source": {
            "type": "BlobSource"
          },
          "sink": {
            "type": "DocumentDbCollectionSink",
            "nestingSeparator": ".",
            "writeBatchSize": 2,
            "writeBatchTimeout": "00:00:00"
          }
          "translator": {
              "type": "TabularTranslator",
              "ColumnMappings": "FirstName: Name.First, MiddleName: Name.Middle, LastName: Name.Last, BusinessEntityID: BusinessEntityID, PersonType: PersonType, NameStyle: NameStyle, Title: Title, Suffix: Suffix, EmailPromotion: EmailPromotion, rowguid: rowguid, ModifiedDate: ModifiedDate"
          }
        },
        "inputs": [
          {
            "name": "PersonBlobTableIn"
          }
        ],
        "outputs": [
          {
            "name": "PersonDocumentDbTableOut"
          }
        ],
        "policy": {
          "concurrency": 1
        },
        "name": "CopyFromBlobToDocDb"
      }
    ],
    "start": "2015-04-14T00:00:00Z",
    "end": "2015-04-15T00:00:00Z"
  }
}
```
If the sample blob input is as

```
1,John,,Doe
```
Then the output JSON in DocumentDB will be as:

```JSON
{
  "Id": 1,
  "Name": {
    "First": "John",
    "Middle": null,
    "Last": "Doe"
  },
  "id": "a5e8595c-62ec-4554-a118-3940f4ff70b6"
}
```
DocumentDB is a NoSQL store for JSON documents, where nested structures are allowed. Azure Data Factory enables user to denote hierarchy via **nestingSeparator**, which is “.” in this example. With the separator, the copy activity will generate the “Name” object with three children elements First, Middle and Last, according to “Name.First”, “Name.Middle” and “Name.Last” in the table definition.

## Appendix
1. **Question:**
    Does the Copy Activity support update of existing records?

    **Answer:**
    No.
2. **Question:**
    How does a retry of a copy to DocumentDB deal with already copied records?

    **Answer:**
    If records have an "ID" field and the copy operation tries to insert a record with the same ID, the copy operation throws an error.  
3. **Question:**
    Does Data Factory support [range or hash-based data partitioning](https://azure.microsoft.com/documentation/articles/documentdb-partition-data/)?

    **Answer:**
    No.
4. **Question:**
    Can I specify more than one DocumentDB collection for a table?

    **Answer:**
    No. Only one collection can be specified at this time.

## Performance and Tuning
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.
