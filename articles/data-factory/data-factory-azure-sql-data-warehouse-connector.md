<properties 
	pageTitle="Move data to/from Azure SQL Data Warehouse | Microsoft Azure" 
	description="Learn how to move data to/from Azure SQL Data Warehouse using Azure Data Factory" 
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

# Move data to and from Azure SQL Data Warehouse using Azure Data Factory

This article outlines how you can use Copy Activity in Azure Data Factory to move data from Azure SQL Data Warehouse to another data store and from another data store to Azure SQL Data Warehouse. 

You can specify whether you want to use PolyBase while loading data into Azure SQL Data Warehouse. We suggest that you use PolyBase to achieve best performance when loading data into Azure SQL Data Warehouse. The [Use PolyBase to load data into Azure SQL Data Warehouse](data-factory-azure-sql-data-warehouse-connector.md#use-polybase-to-load-data-into-azure-sql-data-warehouse) section has  details. 

The following sample(s) show how to copy data to and from Azure SQL Data Warehouse and Azure Blob Storage. However, data can be copied **directly** from any of sources to any of the sinks stated in the [Data Movement Activities](data-factory-data-movement-activities.md#supported-data-stores) article using the Copy Activity in Azure Data Factory.  



> [AZURE.NOTE] 
> For an overview of the Azure Data Factory service, see [Introduction to Azure Data Factory](data-factory-introduction.md). 
> 
> This article provides JSON examples but does not provide step-by-step instructions for creating a data factory. See [Tutorial: Copy data from Azure Blob to Azure SQL Database](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for a quick walkthrough with step-by-step instructions for using the Copy Activity in Azure Data Factory. 


## Sample: Copy data from Azure SQL Data Warehouse to Azure Blob

The sample below shows:

1. A linked service of type [AzureSqlDW](#azure-sql-data-warehouse-linked-service-properties).
2. A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties). 
3. An input [dataset](data-factory-create-datasets.md) of type [AzureSqlDWTable](#azure-sql-data-warehouse-dataset-type-properties). 
4. An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
4. A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [SqlDWSource](#azure-sql-data-warehouse-copy-activity-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties).

The sample copies data belonging to a time series from a table in Azure SQL Data Warehouse database to a blob every hour. The JSON properties used in these samples are described in sections following the samples.

**Azure SQL Data Warehouse linked service:**

	{
	  "name": "AzureSqlDWLinkedService",
	  "properties": {
	    "type": "AzureSqlDW",
	    "typeProperties": {
	      "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;User ID=<username>@<servername>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
	    }
	  }
	}

**Azure Blob storage linked service:**

	{
	  "name": "StorageLinkedService",
	  "properties": {
	    "type": "AzureStorage",
	    "typeProperties": {
	      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
	    }
	  }
	}

**Azure SQL Data Warehouse input dataset:**

The sample assumes you have created a table “MyTable” in Azure SQL Data Warehouse and it contains a column called “timestampcolumn” for time series data.
 
Setting “external”: ”true” and specifying externalData policy informs the Data Factory service that the table is external to the data factory and not produced by an activity in the data factory.

	{
	  "name": "AzureSqlDWInput",
	  "properties": {
	    "type": "AzureSqlDWTable",
	    "linkedServiceName": "AzureSqlDWLinkedService",
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

**Azure Blob output dataset:**

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time.

	{
	  "name": "AzureBlobOutput",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "mycontainer/myfolder/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
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


**Pipeline with Copy activity:**

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **SqlDWSource** and **sink** type is set to **BlobSink**. The SQL query specified for the **SqlReaderQuery** property selects the data in the past hour to copy.

	{  
	    "name":"SamplePipeline",
	    "properties":{  
	    "start":"2014-06-01T18:00:00",
	    "end":"2014-06-01T19:00:00",
	    "description":"pipeline for copy activity",
	    "activities":[  
	      {
	        "name": "AzureSQLDWtoBlob",
	        "description": "copy activity",
	        "type": "Copy",
	        "inputs": [
	          {
	            "name": "AzureSqlDWInput"
	          }
	        ],
	        "outputs": [
	          {
	            "name": "AzureBlobOutput"
	          }
	        ],
	        "typeProperties": {
	          "source": {
	            "type": "SqlDWSource",
	            "sqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
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

> [AZURE.NOTE] In the above example, **sqlReaderQuery** is specified for the SqlDWSource. The Copy Activity runs this query against the Azure SQL Data Warehouse source to get the data.
>  
> Alternatively, you can specify a stored procedure by specifying the **sqlReaderStoredProcedureName** and **storedProcedureParameters** (if the stored procedure takes parameters).
>  
> If you do not specify either sqlReaderQuery or sqlReaderStoredProcedureName, the columns defined in the structure section of the dataset JSON are used to build a query (select column1, column2 from mytable) to run against the Azure SQL Data Warehouse. If the dataset definition does not have the structure, all columns are selected from the table.

## Sample: Copy data from Azure Blob to Azure SQL Data Warehouse

The sample below shows:

1.	A linked service of type [AzureSqlDW](#azure-sql-data-warehouse-linked-service-properties).
2.	A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties).
3.	An [dataset](data-factory-create-datasets.md) dataset of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
4.	An [dataset](data-factory-create-datasets.md) dataset of type [AzureSqlDWTable](#azure-sql-data-warehouse-dataset-type-properties).
4.	A [pipeline](data-factory-create-pipelines.md) with Copy activity that uses [BlobSource](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties) and [SqlDWSink](#azure-sql-data-warehouse-copy-activity-type-properties).


The sample copies data belonging to a time series from Azure blob to a table in Azure SQL Data Warehouse database every hour. The JSON properties used in these samples are described in sections following the samples. 

**Azure SQL Data Warehouse linked service:**

	{
	  "name": "AzureSqlDWLinkedService",
	  "properties": {
	    "type": "AzureSqlDW",
	    "typeProperties": {
	      "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;User ID=<username>@<servername>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
	    }
	  }
	}

**Azure Blob storage linked service:**

	{
	  "name": "StorageLinkedService",
	  "properties": {
	    "type": "AzureStorage",
	    "typeProperties": {
	      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
	    }
	  }
	}

**Azure Blob input dataset:**

Data is picked up from a new blob every hour (frequency: hour, interval: 1). The folder path and file name for the blob are dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, and day part of the start time and file name uses the hour part of the start time. “external”: “true” setting informs the Data Factory service that this table is external to the data factory and not produced by an activity in the data factory.

	{
	  "name": "AzureBlobInput",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "mycontainer/myfolder/yearno={Year}/monthno={Month}/dayno={Day}",
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

**Azure SQL Data Warehouse output dataset:**

The sample copies data to a table named “MyTable” in Azure SQL Data Warehouse. You should create the table in Azure SQL Data Warehouse with the same number of columns as you expect the Blob CSV file to contain. New rows are added to the table every hour. 

	{
	  "name": "AzureSqlDWOutput",
	  "properties": {
	    "type": "AzureSqlDWTable",
	    "linkedServiceName": "AzureSqlDWLinkedService",
	    "typeProperties": {
	      "tableName": "MyOutputTable"
	    },
	    "availability": {
	      "frequency": "Hour",
	      "interval": 1
	    }
	  }
	}

**Pipeline with Copy Activity**

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **BlobSource** and **sink** type is set to **SqlDWSink**.

	{  
	    "name":"SamplePipeline",
	    "properties":{  
	    "start":"2014-06-01T18:00:00",
	    "end":"2014-06-01T19:00:00",
	    "description":"pipeline with copy activity",
	    "activities":[  
	      {
	        "name": "AzureBlobtoSQLDW",
	        "description": "Copy Activity",
	        "type": "Copy",
	        "inputs": [
	          {
	            "name": "AzureBlobInput"
	          }
	        ],
	        "outputs": [
	          {
	            "name": "AzureSqlDWOutput"
	          }
	        ],
	        "typeProperties": {
	          "source": {
	            "type": "BlobSource",
	            "blobColumnSeparators": ","
	          },
	          "sink": {
	            "type": "SqlDWSink"
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

See the [Load data with Azure Data Factory](../sql-data-warehouse/sql-data-warehouse-get-started-load-with-azure-data-factory.md) article in the Azure SQL Data Warehouse documentation for a walkthrough. 

## Azure SQL Data Warehouse linked service properties

The following table provides description for JSON elements specific to Azure SQL Data Warehouse linked service. 

Property | Description | Required
-------- | ----------- | --------
type | The type property must be set to: **AzureSqlDW** | Yes
**connectionString** | Specify information needed to connect to the Azure SQL Data Warehouse instance for the connectionString property. | Yes

Note: You need to configure [Azure SQL Database Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx#ConnectingFromAzure). You need to configure the database server to [allow Azure Services to access the server](https://msdn.microsoft.com/library/azure/ee621782.aspx#ConnectingFromAzure). Additionally, if you are copying data to Azure SQL Data Warehouse from outside Azure including from on-premises data sources with data factory gateway you need to configure appropriate IP address range for the machine that is sending data to Azure SQL Data Warehouse. 

## Azure SQL Data Warehouse dataset type properties

For a full list of sections & properties available for defining datasets, please refer to the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...). 

The typeProperties section is different for each type of dataset and provides information about the location of the data in the data store. The **typeProperties** section for the dataset of type **AzureSqlDWTable** has the following properties.

| Property | Description | Required |
| -------- | ----------- | -------- |
| tableName | Name of the table in the Azure SQL Data Warehouse database that the linked service refers to. | Yes |

## Azure SQL Data Warehouse copy activity type properties

For a full list of sections & properties available for defining activities, please refer to the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc are available for all types of activities.

**Note:** The Copy Activity takes only one input and produces only one output.

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

### SqlDWSource

In case of Copy activity when source is of type **SqlDWSource** the following properties are available in **typeProperties** section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| sqlReaderQuery | Use the custom query to read data. | SQL query string. For example: select * from MyTable. | No |
| sqlReaderStoredProcedureName | Name of the stored procedure that reads data from the source table. | Name of the stored procedure. | No |
| storedProcedureParameters | Parameters for the stored procedure. | Name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. | No |

If the **sqlReaderQuery** is specified for the SqlDWSource, the Copy Activity runs this query against the Azure SQL Data Warehouse source to get the data. 

Alternatively, you can specify a stored procedure by specifying the **sqlReaderStoredProcedureName** and **storedProcedureParameters** (if the stored procedure takes parameters). 

If you do not specify either sqlReaderQuery or sqlReaderStoredProcedureName, the columns defined in the structure section of the dataset JSON are used to build a query (select column1, column2 from mytable) to run against the Azure SQL Data Warehouse. If the dataset definition does not have the structure, all columns are selected from the table.

#### SqlDWSource example

    "source": {
        "type": "SqlDWSource",
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
 

### SqlDWSink
**SqlDWSink** supports the following properties:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| writeBatchSize | Inserts data into the SQL table when the buffer size reaches writeBatchSize | Integer (number of rows) | No (default: 10000) |
| writeBatchTimeout | Wait time for the batch insert operation to complete before it times out. | timespan<br/><br/> Example: “00:30:00” (30 minutes). | No | 
| sqlWriterCleanupScript | User specified query for Copy Activity to execute such that data of a specific slice will be cleaned up. See repeatability section below for more details. | A query statement.  | No |
| allowPolyBase | Indicates whether to use PolyBase (when applicable) instead of BULKINSERT mechanism to load data into Azure SQL Data Warehouse. <br/><br/>Note that only **Azure blob** dataset with **format** set to **TextFormat** as a source dataset is supported at this time and support for other source types will come shortly. <br/><br/>See [Use PolyBase to load data into Azure SQL Data Warehouse](#use-polybase-to-load-data-into-azure-sql-data-warehouse) section for constraints and details. | True <br/>False (default) | No |  
| polyBaseSettings | A group of properties that can be specified when the **allowPolybase** property is set to **true**. | &nbsp; | No |  
| rejectValue | Specifies the number or percentage of rows that can be rejected before the query fails. <br/><br/>Learn more about the PolyBase’s reject options in the **Arguments** section of [CREATE EXTERNAL TABLE (Transact-SQL)](https://msdn.microsoft.com/library/dn935021.aspx) topic. | 0 (default), 1, 2, … | No |  
| rejectType | Specifies whether the rejectValue option is specified as a literal value or a percentage. | Value (default), Percentage | No |   
| rejectSampleValue | Determines the number of rows to retrieve before the PolyBase recalculates the percentage of rejected rows. | 1, 2, … | Yes, if **rejectType** is **percentage** |  
| useTypeDefault | Specifies how to handle missing values in delimited text files when PolyBase retrieves data from the text file.<br/><br/>Learn more about this property from the Arguments section in [CREATE EXTERNAL FILE FORMAT (Transact-SQL)](https://msdn.microsoft.com/library/dn935026.aspx). | True, False (default) | No | 


#### SqlDWSink example


    "sink": {
        "type": "SqlDWSink",
        "writeBatchSize": 1000000,
        "writeBatchTimeout": "00:05:00"
    }

## Use PolyBase to load data into Azure SQL Data Warehouse
Using **PolyBase** is an efficient way of loading large amount of data into Azure SQL Data Warehouse with high throughput.  You can see a large gain in the throughput by using PolyBase instead of the default BULKINSERT mechanism.

Set the **allowPolyBase** property to **true** as shown in the following example for Azure Data Factory to use PolyBase to copy data into Azure SQL Data Warehouse. When you set allowPolyBase to true, you can specify PolyBase specific properties using the **polyBaseSettings** property group. see the [SqlDWSink](#SqlDWSink) section above for details about properties that you can use with polyBaseSettings.   


    "sink": {
        "type": "SqlDWSink",
		"allowPolyBase": true,
		"polyBaseSettings":
		{
			"rejectType": "percentage",
			"rejectValue": 10.0,
			"rejectSampleValue": 100,
			"useTypeDefault": true 
		}

    }

### Direct copy using PolyBase
If your source data meets the criteria below, you can directly copy from source data store to Azure SQL Data Warehouse using PolyBase referring to above sample configuration. Otherwise, you can leverage [Staged Copy using PolyBase](#staged-copy-using-polybase).

Note that Azure Data Factory checks the settings and automatically fall back to the BULKINSERT mechanism for the data movement if the requirements are not met.

1.	**Source linked service** is of type: **Azure Storage** and it is not configured to use SAS (Shared Access Signature) authentication. See [Azure Storage linked service](data-factory-azure-blob-connector.md#azure-storage-linked-service) for details.  
2. The **input dataset** is of type: **Azure Blob** and the format type under type properties is **OrcFormat** or **TextFormat** with below configurations:
	1. **rowDelimiter** must be **\n**. 
	2. **nullValue** is set to **empty string** (""). 
	3. **encodingName** is set to **utf-8**, which is **default** value, so do not set it to a different value. 
	4. **escapeChar** and **quoteChar** are not specified. 
	5. **Compression** is not **BZIP2**.
	 
			"typeProperties": {
				"folderPath": "<blobpath>",
				"format": {
					"type": "TextFormat",     
					"columnDelimiter": "<any delimiter>", 
					"rowDelimiter": "\n",       
					"nullValue": "",           
					"encodingName": "utf-8"    
				},
            	"compression": {  
                	"type": "GZip",  
	                "level": "Optimal"  
    	        }  
			},
3.	There is no **skipHeaderLineCount** setting under **BlobSource** for the Copy activity in the pipeline. 
4.	There is no **sliceIdentifierColumnName** setting under **SqlDWSink** for the Copy activity in the piepline. (PolyBase guarantees that all data is updated or nothing is updated in a single run. To achieve **repeatability**, you could use **sqlWriterCleanupScript**.
5.	There is no **columnMapping** being used in the associated in Copy activity. 

### Staged Copy using PolyBase
When your source data doesn’t meet the criteria introduced in the section above, you can enable copying data via an interim staging Azure blob storage, in which case Azure Data Factory performs transformations on the data to meet data format requirements of PolyBase, and then use PolyBase to load data into SQL Data Warehouse. See [Staged Copy](data-factory-copy-activity-performance.md#staged-copy) for details on how copying data via a staging Azure Blob works in general.

> [AZURE.IMPORTANT] If you are copying data from an on-prem data store into Azure SQL Data Warehouse using PolyBase and staging, you need to install the JRE 8 (Java Runtime Environment) on your gateway machine which will be used to transform your source data into proper format. Note that a 64-bit gateway requires 64-bit JRE and a 32-bit gateway requires 32-bit JRE. Download the appropriate version from  [Java Downloads location](http://go.microsoft.com/fwlink/?LinkId=808605).

To use this feature, create an [Azure Storage linked service](data-factory-azure-blob-connector.md#azure-storage-linked-service) that refers to the Azure Storage Account that has the interim blob storage, then specify the **enableStaging** and **stagingSettings** properties for the Copy Activity as shown below:

	"activities":[  
	{
		"name": "Sample copy activity from SQL Server to SQL Data Warehouse via PolyBase",
		"type": "Copy",
		"inputs": [{ "name": "OnpremisesSQLServerInput" }],
		"outputs": [{ "name": "AzureSQLDWOutput" }],
		"typeProperties": {
			"source": {
				"type": "SqlSource",
			},
			"sink": {
				"type": "SqlDwSink",
				"allowPolyBase": true
			},
    		"enableStaging": true,
			"stagingSettings": {
				"linkedServiceName": "MyStagingBlob"
			}
		}
	}
	]


### Best practices when using PolyBase

#### Row size limitation
Polybase does not support rows of size greater than 32 KB. Attempting to load a table with rows larger than 32 KB would result in the following error: 

	Type=System.Data.SqlClient.SqlException,Message=107093;Row size exceeds the defined Maximum DMS row size: [35328 bytes] is larger than the limit of [32768 bytes],Source=.Net SqlClient

If you have source data with rows of size greater than 32 KB, you may want to split the source tables vertically into several small ones where the largest row size of each of them does not exceed the limit. The smaller tables can then be loaded using PolyBase and merged together in Azure SQL Data Warehouse.

#### tableName in Azure SQL Data Warehouse
The following table provides examples on how to specify the **tableName** property in dataset JSON for various combinations of schema and table name.

| DB Schema | Table name | tableName JSON property |
| --------- | -----------| ----------------------- | 
| dbo | MyTable	| MyTable  or  dbo.MyTable  or  [dbo].[MyTable] |
| dbo1 | MyTable | dbo1.MyTable  or  [dbo1].[MyTable] |
| dbo | My.Table | [My.Table] or [dbo].[My.Table] |
| dbo1 | My.Table | [dbo1].[My.Table] |

If you see an error as shown below, it could be an issue with the value you specified for the tableName property. See the table above for the correct way to specify values for the tableName JSON property.  

	Type=System.Data.SqlClient.SqlException,Message=Invalid object name 'stg.Account_test'.,Source=.Net SqlClient Data Provider

#### Columns with default values
Currently, PolyBase feature in Data Factory only accepts the same number of columns as in the target table. Say, you have a table with 4 columns and one of them is defined with a default value, the input data should still contain 4 columns. Providing a 3-column input dataset would yield an error as shown below:

	All columns of the table must be specified in the INSERT BULK statement.

NULL value is a special form of default value. If the column is nullable, the input data (in blob) for that column could be empty (cannot be missing from the input dataset). PolyBase will insert NULL for them in the Azure SQL Data Warehouse.  


[AZURE.INCLUDE [data-factory-type-repeatability-for-sql-sources](../../includes/data-factory-type-repeatability-for-sql-sources.md)] 

[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

### Type mapping for Azure SQL Data Warehouse

As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article Copy activity performs automatic type conversions from automatic type conversions from source types to sink types with the following 2 step approach:

1. Convert from native source types to .NET type
2. Convert from .NET type to native sink type

When moving data to & from Azure SQL, SQL server, Sybase the following mappings will be used from SQL type to .NET type and vice versa.

The mapping is same as the [SQL Server Data Type Mapping for ADO.NET](https://msdn.microsoft.com/library/cc716729.aspx).

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
