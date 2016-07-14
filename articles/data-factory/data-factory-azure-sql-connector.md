<properties 
	pageTitle="Move data to/from Azure SQL Database | Microsoft Azure" 
	description="Learn how to move data to/from Azure SQL Database using Azure Data Factory." 
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
	ms.date="07/05/2016" 
	ms.author="spelluru"/>

# Move data to and from Azure SQL Database using Azure Data Factory

This article outlines how you can use the Copy Activity in an Azure data factory to move data to Azure SQL from another data store and move data from another data store to Azure SQL. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with copy activity and supported data store combinations.

The following sample(s) show how to copy data to and from Azure SQL Database and Azure Blob Storage. However, data can be copied **directly** from any of sources to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores) using the Copy Activity in Azure Data Factory.  


## Sample: Copy data from Azure SQL Database to Azure Blob

The sample below shows:

1. A linked service of type [AzureSqlDatabase](#azure-sql-linked-service-properties).
2. A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties). 
3. An input [dataset](data-factory-create-datasets.md) of type [AzureSqlTable](#azure-sql-dataset-type-properties). 
4. An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
4. A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [SqlSource](#azure-sql-copy-activity-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties).

The sample copies data belonging to a time series from a table in Azure SQL database to a blob every hour. The JSON properties used in these samples are described in sections following the samples.  

**Azure SQL linked service**

	{
	  "name": "AzureSqlLinkedService",
	  "properties": {
	    "type": "AzureSqlDatabase",
	    "typeProperties": {
	      "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;User ID=<username>@<servername>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
	    }
	  }
	}

See the [Azure SQL Linked Service](#azure-sql-linked-service-properties) section for the list of properties supported by this linked service. 

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

See the [Azure Blob](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties) article for the list of properties supported by this linked service. 

**Azure SQL input dataset**

The sample assumes you have created a table “MyTable” in Azure SQL and it contains a column called “timestampcolumn” for time series data. 

Setting “external”: ”true” and specifying externalData policy informs the Azure Data Factory service that this is a table that is external to the data factory and not produced by an activity in the data factory.

	{
	  "name": "AzureSqlInput",
	  "properties": {
	    "type": "AzureSqlTable",
	    "linkedServiceName": "AzureSqlLinkedService",
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

See the [Azure SQL dataset type properties](#azure-sql-dataset-type-properties) section for the list of properties supported by this dataset type.  

**Azure Blob output dataset**

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time. 

	{
	  "name": "AzureBlobOutput",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "mycontainer/myfolder/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}/",
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
	        },
	        {
	          "name": "Hour",
	          "value": {
	            "type": "DateTime",
	            "date": "SliceStart",
	            "format": "%H"
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
	      "frequency": "Hour",
	      "interval": 1
	    }
	  }
	}

See the [Azure Blob dataset type properties](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties) section for the list of properties supported by this dataset type.  

**Pipeline with Copy activity**

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **SqlSource** and **sink** type is set to **BlobSink**. The SQL query specified for the **SqlReaderQuery** property selects the data in the past hour to copy.

	{  
	    "name":"SamplePipeline",
	    "properties":{  
	    "start":"2014-06-01T18:00:00",
	    "end":"2014-06-01T19:00:00",
	    "description":"pipeline for copy activity",
	    "activities":[  
	      {
	        "name": "AzureSQLtoBlob",
	        "description": "copy activity",
	        "type": "Copy",
	        "inputs": [
	          {
	            "name": "AzureSQLInput"
	          }
	        ],
	        "outputs": [
	          {
	            "name": "AzureBlobOutput"
	          }
	        ],
	        "typeProperties": {
	          "source": {
	            "type": "SqlSource",
	            "SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
	          },
	          "sink": {
	            "type": "BlobSink"
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

In the above example, **sqlReaderQuery** is specified for the SqlSource. The Copy Activity runs this query against the Azure SQL Database source to get the data. Alternatively, you can specify a stored procedure by specifying the **sqlReaderStoredProcedureName** and **storedProcedureParameters** (if the stored procedure takes parameters).

If you do not specify either sqlReaderQuery or sqlReaderStoredProcedureName, the columns defined in the structure section of the dataset JSON are used to build a query (select column1, column2 from mytable) to run against the Azure SQL Database. If the dataset definition does not have the structure, all columns are selected from the table. 


See the [Sql Source](#sqlsource) section and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties) for the list of properties supported by SqlSource and BlobSink. 


## Sample: Copy data from Azure Blob to Azure SQL Database

The sample below shows:

1.	A linked service of type [AzureSqlDatabase](data-factory-azure-sql-connector.md#azure-sql-linked-service-properties).
2.	A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties).
3.	An input [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
4.	An output [dataset](data-factory-create-datasets.md) of type [AzureSqlTable](data-factory-azure-sql-connector.md#azure-sql-dataset-type-properties).
4.	A [pipeline](data-factory-create-pipelines.md) with Copy activity that uses [BlobSource](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties) and [SqlSink](data-factory-azure-sql-connector.md#azure-sql-copy-activity-type-properties).

The sample copies data belonging to a time series from Azure blob to a table in Azure SQL database every hour. The JSON properties used in these samples are described in sections following the samples. 


**Azure SQL linked service**
	
	{
	  "name": "AzureSqlLinkedService",
	  "properties": {
	    "type": "AzureSqlDatabase",
	    "typeProperties": {
	      "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;User ID=<username>@<servername>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
	    }
	  }
	}

See the [Azure SQL Linked Service](#azure-sql-linked-service-properties) section for the list of properties supported by this linked service. 

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

See the [Azure Blob](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties) article for the list of properties supported by this linked service.

**Azure Blob input dataset**

Data is picked up from a new blob every hour (frequency: hour, interval: 1). The folder path and file name for the blob are dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, and day part of the start time and file name uses the hour part of the start time. “external”: “true” setting informs the Data Factory service that this table is external to the data factory and not produced by an activity in the data factory.

	{
	  "name": "AzureBlobInput",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "mycontainer/myfolder/yearno={Year}/monthno={Month}/dayno={Day}/",
	      "fileName": "{Hour}.csv",
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
	        },
	        {
	          "name": "Hour",
	          "value": {
	            "type": "DateTime",
	            "date": "SliceStart",
	            "format": "%H"
	          }
	        }
	      ],
	      "format": {
	        "type": "TextFormat",
	        "columnDelimiter": ",",
	        "rowDelimiter": "\n"
	      }
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

See the [Azure Blob dataset type properties](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties) section for the list of properties supported by this dataset type.

**Azure SQL output dataset**

The sample copies data to a table named “MyTable” in Azure SQL. You should create the table in Azure SQL with the same number of columns as you expect the Blob CSV file to contain. New rows are added to the table every hour. 

	{
	  "name": "AzureSqlOutput",
	  "properties": {
	    "type": "AzureSqlTable",
	    "linkedServiceName": "AzureSqlLinkedService",
	    "typeProperties": {
	      "tableName": "MyOutputTable"
	    },
	    "availability": {
	      "frequency": "Hour",
	      "interval": 1
	    }
	  }
	}

See the [Azure SQL dataset type properties](#azure-sql-dataset-type-properties) section for the list of properties supported by this dataset type.

**Pipeline with Copy activity**

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **BlobSource** and **sink** type is set to **SqlSink**.

	{  
	    "name":"SamplePipeline",
	    "properties":{  
	    "start":"2014-06-01T18:00:00",
	    "end":"2014-06-01T19:00:00",
	    "description":"pipeline with copy activity",
	    "activities":[  
	      {
	        "name": "AzureBlobtoSQL",
	        "description": "Copy Activity",
	        "type": "Copy",
	        "inputs": [
	          {
	            "name": "AzureBlobInput"
	          }
	        ],
	        "outputs": [
	          {
	            "name": "AzureSqlOutput"
	          }
	        ],
	        "typeProperties": {
	          "source": {
	            "type": "BlobSource",
	            "blobColumnSeparators": ","
	          },
	          "sink": {
	            "type": "SqlSink"
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

See the [Sql Sink](#sqlsink) section and [BlobSource](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties) for the list of properties supported by SqlSink and BlobSource. 


## Azure SQL linked service properties

The following table provides description for JSON elements specific to Azure SQL linked service.

| Property | Description | Required |
| -------- | ----------- | -------- |
| type | The type property must be set to: AzureSqlDatabase | Yes |
| connectionString | Specify information needed to connect to the Azure SQL Database instance for the connectionString property. | Yes |

**Note:** You need to configure [Azure SQL Database Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx#ConnectingFromAzure). You need to configure the database server to [allow Azure Services to access the server](https://msdn.microsoft.com/library/azure/ee621782.aspx#ConnectingFromAzure). Additionally, if you are copying data to Azure SQL from outside Azure including from on-premises data sources with data factory gateway you need to configure appropriate IP address range for the machine that is sending data to Azure SQL. 

## Azure SQL dataset type properties

For a full list of sections & properties available for defining datasets, please refer to the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...). 

The typeProperties section is different for each type of dataset and provides information about the location of the data in the data store. The **typeProperties** section for the dataset of type **AzureSqlTable** has the following properties.

| Property | Description | Required |
| -------- | ----------- | -------- |
| tableName | Name of the table in the Azure SQL Database instance that linked service refers to. | Yes |

## Azure SQL copy activity type properties

For a full list of sections & properties available for defining activities, please refer to the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc are available for all types of activities.

> [AZURE.NOTE] The Copy Activity takes only one input and produces only one output.

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

### SqlSource

In case of Copy activity when source is of type **SqlSource** the following properties are available in **typeProperties** section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| sqlReaderQuery | Use the custom query to read data. | SQL query string.For example: select * from MyTable. If not specified, the SQL statement that is executed: select from MyTable. | No |
| sqlReaderStoredProcedureName | Name of the stored procedure that reads data from the source table. | Name of the stored procedure. | No |
| storedProcedureParameters | Parameters for the stored procedure. | Name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. | No |

If the **sqlReaderQuery** is specified for the SqlSource, the Copy Activity runs this query against the Azure SQL Database source to get the data. Alternatively, you can specify a stored procedure by specifying the **sqlReaderStoredProcedureName** and **storedProcedureParameters** (if the stored procedure takes parameters). 

If you do not specify either sqlReaderQuery or sqlReaderStoredProcedureName, the columns defined in the structure section of the dataset JSON are used to build a query (select column1, column2 from mytable) to run against the Azure SQL Database. If the dataset definition does not have the structure, all columns are selected from the table. 

> [AZURE.NOTE] When you use **sqlReaderStoredProcedureName**, you still need to specify a value for the **tableName** property in the dataset JSON. This is a limitation with the product at this time. There are no validations performed against this table though. 

### SqlSource example

    "source": {
        "type": "SqlSource",
        "sqlReaderStoredProcedureName": "CopyTestSrcStoredProcedureWithParameters",
        "storedProcedureParameters": {
            "stringData": { "value": "str3" },
            "id": { "value": "$$Text.Format('{0:yyyy}', SliceStart)", "type": "Int"}
        }
    }

**The stored procedure definition:** 

	CREATE PROCEDURE CopyTestSrcStoredProcedureWithParameters
	(
		@stringData varchar(20),
		@id int
	)
	AS
	SET NOCOUNT ON;
	BEGIN
	     select *
	     from dbo.UnitTestSrcTable
	     where dbo.UnitTestSrcTable.stringData != stringData
	    and dbo.UnitTestSrcTable.id != id
	END
	GO


### SqlSink 

**SqlSink** supports the following properties:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| writeBatchTimeout | Wait time for the batch insert operation to complete before it times out. | timespan<br/><br/> Example: “00:30:00” (30 minutes). | No | 
| writeBatchSize | Inserts data into the SQL table when the buffer size reaches writeBatchSize. | Integer (number of rows)| No (default: 10000)
| sqlWriterCleanupScript | User specified query for Copy Activity to execute such that data of a specific slice will be cleaned up. See repeatability section below for more details. | A query statement.  | No |
| sliceIdentifierColumnName | User specified column name for Copy Activity to fill with auto generated slice identifier, which will be used to clean up data of a specific slice when rerun. See repeatability section below for more details. | Column name of a column with data type of binary(32). | No |
| sqlWriterStoredProcedureName | Name of the stored procedure that upserts (updates/inserts) data into the target table. | Name of the stored procedure. | No |
| storedProcedureParameters | Parameters for the stored procedure. | Name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. | No | 
| sqlWriterTableType | User specified table type name to be used in the above stored procedure. Copy activity makes the data being moved available in a temp table with this table type. Stored procedure code can then merge the data being copied with existing data. | A table type name. | No |

#### SqlSink example

    "sink": {
        "type": "SqlSink",
        "writeBatchSize": 1000000,
        "writeBatchTimeout": "00:05:00",
        "sqlWriterStoredProcedureName": "CopyTestStoredProcedureWithParameters",
        "sqlWriterTableType": "CopyTestTableType",
        "storedProcedureParameters": {
            "id": { "value": "1", "type": "Int" },
            "stringData": { "value": "str1" },
            "decimalData": { "value": "1", "type": "Decimal" }
        }
    }

## Identity columns in the target database
This section provides an example for copying data from a source table without an identity column to a destination table with an identity column. 

**Source table:** 

	create table dbo.SourceTbl
	(
	       name varchar(100),
	       age int
	)

**Destination table:**

	create table dbo.TargetTbl
	(
	       id int identity(1,1),
	       name varchar(100),
	       age int
	)


Notice that the target table has an identity column. 

**Source dataset JSON definition**

	{
	    "name": "SampleSource",
	    "properties": {
	        "published": false,
	        "type": " SqlServerTable",
	        "linkedServiceName": "TestIdentitySQL",
	        "typeProperties": {
	            "tableName": "SourceTbl"
	        },
	        "availability": {
	            "frequency": "Hour",
	            "interval": 1
	        },
	        "external": true,
	        "policy": {}
	    }
	}

**Destination dataset JSON definition**

	{
	    "name": "SampleTarget",
	    "properties": {
	        "structure": [
	            { "name": "name" },
	            { "name": "age" }
	        ],
	        "published": false,
	        "type": "AzureSqlTable",
	        "linkedServiceName": "TestIdentitySQLSource",
	        "typeProperties": {
	            "tableName": "TargetTbl"
	        },
	        "availability": {
	            "frequency": "Hour",
	            "interval": 1
	        },
	        "external": false,
	        "policy": {}
	    }	
	}


Notice that as your source and target table have different schema (target has an additional column with identity). In this scenario, you need to specify **structure** property in  the target dataset definition, which doesn’t include the identity column.

[AZURE.INCLUDE [data-factory-type-repeatability-for-sql-sources](../../includes/data-factory-type-repeatability-for-sql-sources.md)] 

[AZURE.INCLUDE [data-factory-sql-invoke-stored-procedure](../../includes/data-factory-sql-invoke-stored-procedure.md)]
 

[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

### Type mapping for SQL Server & Azure SQL Database

As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article Copy activity performs automatic type conversions from automatic type conversions from source types to sink types with the following 2 step approach:

1. Convert from native source types to .NET type
2. Convert from .NET type to native sink type

When moving data to & from Azure SQL, SQL server, Sybase the following mappings will be used from SQL type to .NET type and vice versa.

The mapping is same as the SQL Server Data Type Mapping for ADO.NET.

| SQL Server Database Engine type | .NET Framework type |
| ------------------------------- | ------------------- |
| bigint | Int64 |
| binary | Byte[] |
| bit | Boolean |
| char | String, Char[] |
| date | DateTime |
| Datetime | DateTime |
| datetime2 | DateTime |
| Datetimeoffset | DateTimeOffset |
| Decimal | Decimal |
| FILESTREAM attribute (varbinary(max)) | Byte[] |
| Float | Double |
| image | Byte[] | 
| int | Int32 | 
| money | Decimal |
| nchar | String, Char[] |
| ntext | String, Char[] |
| numeric | Decimal |
| nvarchar | String, Char[] |
| real | Single |
| rowversion | Byte[] |
| smalldatetime | DateTime |
| smallint | Int16 |
| smallmoney | Decimal | 
| sql_variant | Object * |
| text | String, Char[] |
| time | TimeSpan |
| timestamp | Byte[] |
| tinyint | Byte |
| uniqueidentifier | Guid |
| varbinary |  Byte[] |
| varchar | String, Char[] |
| xml | Xml |


[AZURE.INCLUDE [data-factory-type-conversion-sample](../../includes/data-factory-type-conversion-sample.md)]

[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]

## Performance and Tuning  
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.