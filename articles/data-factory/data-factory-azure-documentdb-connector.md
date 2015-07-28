<properties 
	pageTitle="DocumentDB Connector - Move data to and from DocumentDB" 
	description="Learn about Azure DocumentDB Connector for the Data Factory service that lets you move data to/from Azure DocumentDB collection" 
	services="data-factory" 
	documentationCenter="" 
	authors="spelluru" 
	manager="jhubbard" 
	editor="monicar"/>

<tags 
	ms.service="data-factory" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/27/2015" 
	ms.author="spelluru"/>

# DocumentDB Connector - Move data to and from DocumentDB

This article outlines how you can use the Copy Activity in an Azure data factory to move data to Azure DocumentDB from another data store and move data from another data store to DocumentDB. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with copy activity and supported data store combinations.

## Sample: Copy data from DocumentDB to Azure Blob

The sample below shows:

1. A linked service of type DocumentDb.
2. A linked service of type AzureStorage. 
3. An input dataset of type DocumentDbCollection. 
4. An output dataset of type AzureBlob.
4. A pipeline with Copy Activity that uses DocumentDbCollectionSource and BlobSink.

**Sample JSON document in the Person collection in a DocumentDB database:**

	
	{
	  "PersonId": 2,
	  "Name": {
	    "First": "Jane",
	    "Middle": "",
	    "Last": "Doe"
	  }
	}

DocumentDB supports querying documents using a SQL like syntax over hierarchical JSON documents. Example:

	SELECT Person.PersonId, Person.Name.First AS FirstName, Person.Name.Middle as MiddleName, Person.Name.Last AS LastName FROM Person

This is the query we will use when defining a pipeline later. 

**DocumentDb linked service**

	{
	  "name": "DocumentDbLinkedService",
	  "properties": {
	    "type": "DocumentDb",
	    "typeProperties": {
	      "connectionString": "AccountEndpoint=<EndpointUrl>;AccountKey=<AccessKey>;Database=<Database>"
	    }
	  }
	}

**Azure Blob storage linked service**

	{
	  "name": "StorageLinkedService",
	  "properties": {
	    "type": "AzureStorage",
	    "typeProperties": {
	      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
	    }
	  }
	}

**DocumentDB input dataset**

The sample assumes you have created a collection “Person” in DocumentDb that contains the input data.

Setting “external”: ”true” and specifying externalData policy informs the Azure Data Factory service that this is a table that is external to the data factory and not produced by an activity in the data factory.

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

**Azure Blob output dataset**

Data is written to a new blob every day (frequency: day, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, and day parts of the start time. Therefore, a folder is created for each day the slice is processed. 

	{
	  "name": "PersonBlobTableOut",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "MyContainer/MyFolder/yearno={Year}/monthno={Month}/dayno={Day}",
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
	            "format": "%M"
	          }
	        },
	        {
	          "name": "Day",
	          "value": {
	            "type": "DateTime",
	            "date": "SliceStart",
	            "format": "%d"
	          }
	        }
	      ],
	      "format": {
	        "type": "TextFormat",
	        "columnDelimiter": "\t",
	        "rowDelimiter": "\n"
	      }
	    },
	    "availability": {
	      "frequency": "Day",
	      "interval": 1
	    }
	  }
	}

**Pipeline with Copy activity**

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **DocumentDbCollectionSource** and **sink** type is set to **BlobSink**. 

The following pipeline copies data from the Person collection in the DocumentDB database to an Azure blob in the docdb container. 

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


## Sample: Copy data from Azure Blob to DocumentDB

The sample below shows:

1.	A linked service of type DocumentDb.
2.	A linked service of type AzureStorage.
3.	An input dataset of type AzureBlob.
4.	An output dataset of type DocumentDbCollection.
4.	A pipeline with Copy activity that uses BlobSource and DocumentDbCollectionSink.


**Sample blob input:**

1,John,,Doe
2, Jane,,Doe

**DocumentDb linked service**

	{
	  "name": "DocumentDbLinkedService",
	  "properties": {
	    "type": "DocumentDb",
	    "typeProperties": {
	      "connectionString": "AccountEndpoint=<EndpointUrl>;AccountKey=<AccessKey>;Database=<Database>"
	    }
	  }
	}

**Azure Blob storage linked service**

	{
	  "name": "StorageLinkedService",
	  "properties": {
	    "type": "AzureStorage",
	    "typeProperties": {
	      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
	    }
	  }
	}

**Azure Blob input dataset**

Data is picked up from a new blob every day (frequency: day, interval: 1). 

“external”: “true” setting informs the Data Factory service that this table is external to the data factory and not produced by an activity in the data factory.

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


**DocumentDB output dataset**

Output Azure DocumentDB table is defined as follows:

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


**Pipeline with Copy activity**

Pipeline is defined as follows: 

In the pipeline JSON definition, the **source** type is set to **BlobSource** and **sink** type is set to **DocumentCollectionSink**.

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

**Ouput JSON in the DocumentDB will look like:**

	{
	  "Id": 1,
	  "Name": {
	    "First": "John",
	    "Middle": null,
	    "Last": "Doe"
	  },
	  "id": "a5e8595c-62ec-4554-a118-3940f4ff70b6"
	}

## DocumentDB Linked Service Properties

The following table provides description for JSON elements specific to DocumentDB linked service.

| Property | Description | Required |
| -------- | ----------- | -------- |
| type | The type property must be set to: **DocumentDb** | Yes |
| connectionString | Specify information needed to connect to Azure DocumentDB database. | Yes |

## DocumentDB Dataset type properties

For a full list of sections & properties available for defining datasets, please refer to the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...). 

The typeProperties section is different for each type of dataset and provides information about the location of the data in the data store. The **typeProperties** section for the dataset of type **DocumentDbCollection** has the following properties.

| Property | Description | Required |
| -------- | ----------- | -------- |
| collectionName | Name of the DocumentDB document collection. | Yes |

## DocumentDB Copy Activity type properties

For a full list of sections & properties available for defining activities, please refer to the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc are available for all types of activities.

> [AZURE.NOTE] The Copy Activity takes only one input and produces only one output.

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

In case of Copy activity when source is of type **DocumentDbCollectionSource** the following properties are available in **typeProperties** section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| query | Specify the query to read data. | Query string supported by DocumentDB. <p>Example: SELECT c.BusinessEntityID, c.PersonType, c.NameStyle, c.Title, c.Name.First AS FirstName, c.Name.Last AS LastName, c.Suffix, c.EmailPromotion FROM c WHERE c.ModifiedDate > \"2009-01-01T00:00:00\".</p> | No. <p>If not specified, the SQL statement that is executed: select <columns defined in structure> from mycollection.</p> |
| nestingSeparator | Special character to indicate that the document is nested. | Any character. | No |

**DocumentDbCollectionSink** supports the following properties:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| nestingSeparator | A special character in the source column name to indicate that nested document is needed. | Character that is used to separate nesting levels. Default value is . (dot). | No |
| writeBatchSize | Number of parallel requests to DocumentDB service to create documents. <p>You can fine tune the performance when copying data to/from DocumentDB by using this property. You can expect a better performance when you increase writeBatchSize because more parallel requests to DocumentDB are sent. However you’ll need to avoid throttling that can throw the error message: "Request rate is large".</p><p>Throttling is decided by a number of factors, including size of documents, number of terms in documents, indexing policy of target collection, etc. For copy operations, you can use a better (e.g. S3) collection to have the most throughput available (2,500 request units/second), or reduce writeBatchSize to have a more robust although slower copy activity.</p> | Integer value. | No

**Example for using nesting separator**
Name.First in the output table produces the following JSON structure in the DocumentDB document: 

	
	"Name": {
	    "First": "John"
	  },
