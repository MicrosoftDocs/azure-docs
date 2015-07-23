<properties 
	pageTitle="Azure SQL Connector - Move Data To and From Azure SQL" 
	description="Learn about Azure SQL Connector for the Data Factory service that lets you move data to/from Azure SQL Database" 
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
	ms.date="07/23/2015" 
	ms.author="spelluru"/>

# Azure SQL Connector - Move Data To and From Azure SQL

This article outlines how you can use data factory copy activity to move data to Azure SQL from another data store and move data from another data store to Azure SQL. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with copy activity and supported data store combinations.

## Sample: Copy data from Azure SQL to Azure Blob

The sample below shows:

1. The linked service of type AzureSqlDatabase.
2. The linked service of type AzureStorage. 
3. The input and output datasets.
4. The pipeline with Copy Activity.

The sample copies data belonging to a time series from a table in Azure SQL database to a blob every hour. For more information on various properties used in the sample below please refer to documentation on different properties in the sections following the samples. 

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

**Azure SQL input dataset**

The sample assumes you have created a table “MyTable” in Azure SQL and it contains a column called “timestampcolumn” for time series data. 

Setting “external”: ”true” and specifying externalData policy tells data factory that this is a table that is external to the data factory and not produced by an activity in the data factory.

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

**Azure Blob output dataset**

Data is copied to a new blob every hour with the path for the blob reflecting the specific date-time with hour granularity.

	{
	  "name": "AzureBlobOutput",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "MyContainer/MyFolder/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
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
	            "format": "%HH"
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

## Pipeline with Copy activity

Copy activity specifies the input, output dataset and is scheduled for runs every hour. The SQL query specified with SqlReaderQuery property selects the data in the past hour to copy.

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
	            "SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd-HH\\' AND timestampcolumn < \\'{1:yyyy-MM-dd-HH\\'', SliceStart, SliceEnd)"
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

## Sample: Copy data from Azure Blob to Azure SQL

The sample below shows:

1.	The linked service of type AzureSqlDatabase.
2.	The linked service of type AzureStorage.
3.	The input and output datasets.
4.	The pipeline with Copy activity.

The sample copies data belonging to a time series from Azure blob to a table in Azure SQL database every hour. For more information on various properties used in the sample below please refer to documentation on different properties in the sections following the samples.

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

Data is picked up from a new blob every hour with the path & filename for the blob reflecting the specific datetime with hour granularity. “external”: “true” tells data factory that this is a table that is external to the data factory and not produced by an activity in the data factory.

	{
	  "name": "AzureBlobInput",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "MyContainer/MyFolder/yearno={Year}/monthno={Month}/dayno={Day}",
	      "filename": "{Hour}.csv",
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
	            "format": "%HH"
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

## Pipeline with Copy activity

Copy activity specifies the input, output dataset and is scheduled for runs every hour.

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

## Azure SQL Linked Service Properties

The following table provides description for JSON elements specific to Azure SQL linked service.

| Property | Description | Required |
| -------- | ----------- | -------- |
| type | The type property must be set to: AzureSqlDatabase | Yes |
| connectionString | Specify information needed to connect to the Azure SQL Database instance for the connectionString property. | Yes |

Note: You need to configure [Azure SQL Database Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx#ConnectingFromAzure). You need to configure the database server to [allow Windows Azure Services to access the server](https://msdn.microsoft.com/library/azure/ee621782.aspx#ConnectingFromAzure). Additionally, if you are copying data to Azure SQL from outside Azure including from on-premises data sources with data factory gateway you need to configure appropriate IP address range for the machine that is sending data to Azure SQL. 

## Azure SQL - Dataset Type Properties

For a full list of sections & properties available for defining datasets please refer to the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...). 

The typeProperties section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for the dataset of type AzureSqlTable has the following properties.

| Property | Description | Required |
| -------- | ----------- | -------- |
| tableName | Name of the table in the Azure SQL Database instance that linked service refers to. | Yes |

**Azure SQL - Copy Activity Type Properties**

For a full list of sections & properties available for defining activities please refer to the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc are available for all types of activities.

> [AZURE.NOTE] The Copy Activity takes only one input and produces only one output.

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

In case of Copy activity when source is of type **SqlSource** the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| sqlReaderQuery | Use the custom query to read data. | SQL query string.For example: select * from MyTable. If not specified, the SQL statement that is executed: select from MyTable. | No |

**SqlSink** supports the following properties:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| sqlWriterStoredProcedureName | User specified stored procedure name to upsert (update/insert) data into the target table. | Name of the stored procedure. | No |
| sqlWriterTableType | User specified table type name to be used in the above stored procedure. Copy activity makes the data being moved available in a temp table with this table type. Stored procedure code can then merge the data being copied with existing data. | A table type name. | No |
| writeBatchTimeout | Wait time for the batch insert operation to complete before it times out. | (Unit = timespan) Example: “00:30:00” (30 minutes). | No | 
| sqlWriterCleanupScript | User specified query for Copy Activity to execute such that data of a specific slice will be cleaned up. See repeatability section below for more details. | A query statement.  | No |
| sliceIdentifierColumnName | User specified column name for Copy Activity to fill with auto generated slice identifier, which will be used to clean up data of a specific slice when rerun. See repeatability section below for more details. | Column name of a column with data type of binary(32). | No |

## Repeatability during Copy

When copying data to Azure SQL from other data stores one needs to keep repeatability in mind to avoid unintended outcomes. 

When copying data to Azure SQL Database, copy activity will by default APPEND the data set to the sink table by default. For example, when copying data from a CSV (comma separated values data) file source containing two records to Azure SQL Database, this is what the table looks like:
	
	ID	Product		Quantity	ModifiedDate
	...	...			...			...
	6	Flat Washer	3			2015-05-01 00:00:00
	7 	Down Tube	2			2015-05-01 00:00:00

Suppose you found errors in source file and updated the quantity of Down Tube from 2 to 4 in the source file. If you re-run the data slice for that period, you’ll find two new records appended to Azure SQL Database. The below assumes none of the columns in the table have the primary key constraint.
	
	ID	Product		Quantity	ModifiedDate
	...	...			...			...
	6	Flat Washer	3			2015-05-01 00:00:00
	7 	Down Tube	2			2015-05-01 00:00:00
	6	Flat Washer	3			2015-05-01 00:00:00
	7 	Down Tube	4			2015-05-01 00:00:00

To avoid this, you will need to specify UPSERT semantics by leveraging one of the below 2 mechanisms stated below.

> [AZURE.NOTE] A slice can be re-run automatically in Azure Data Factory too as per the retry policy specified.

### Mechanism 1

You can leverage **sqlWriterCleanupScript** property to first perform cleanup action when a slice is run. 

	"sink":  
	{ 
	  "type": "SqlSink", 
	  "sqlWriterCleanupScript": "$$Text.Format('DELETE FROM table WHERE ModifiedDate = \\'{0:yyyy-MM-dd-HH\\'', SliceStart)"
	}

The cleanup script would be executed first during copy for a given slice which would delete the data from the SQL Table corresponding to that slice. The copy activity will subsequently insert the data into the SQL Table. 

If the slice is now re-run, then you will find the quantity is updated as desired.
	
	ID	Product		Quantity	ModifiedDate
	...	...			...			...
	6	Flat Washer	3			2015-05-01 00:00:00
	7 	Down Tube	4			2015-05-01 00:00:00

Suppose the Flat Washer record is removed from the original csv. Then re-running the slice would produce the following result: 
	
	ID	Product		Quantity	ModifiedDate
	...	...			...			...
	8 	Down Tube	4			2015-05-01 00:00:00

Nothing new had to be done. The copy activity ran the cleanup script to delete the corresponding data for that slice. Then it read the input from the csv (which now contained only 1 record) and inserted in into the Table. 

### Mechanism 2

Another mechanism to achieve repeatability is by having a dedicated column in the target Table. This column would be used by Azure Data Factory to ensure the source and destination stay synchronized. This approach works when there is flexibility in changing or defining the destination SQL Table schema. 

This column would be used by Azure Data Factory for repeatability purposes and in the process Azure Data Factory will not make any schema changes to the Table. Way to use this approach:

1.	Define a column of type nvarchar (100) in the destination SQL Table. There should be no constraints on this column. Let name this column as ‘ColumnForADFuseOnly’ for this example
2.	Use it in the copy activity as follows:

		"sink":  
		{ 
		  "type": "SqlSink", 
		  "sliceIdentifierColumnName": "ColumnForADFuseOnly"
		}

Azure Data Factory will populate this column as per its need to ensure the source and destination stay synchronized. The values of this column should not be used outside of this context by the user. 

Similar to mechanism 1, Copy Activity will automatically first clean up the data for the given slice from the destination SQL Table and then run the copy activity normally to insert the data from source to destination for that slice. 

## Invoking Stored Procedure for SQL Sink
When copying data into SQL Server or Azure SQL Database, a user specified stored procedure could be configured and invoked with additional parameters. 

A stored procedure can be leveraged when built-in copy mechanisms do not serve the purpose. This is typically leveraged when extra processing (merging columns, looking up additional values, insertion into multiple tables…) needs to be done before the final insertion of source data in the destination table. 

You may invoke a stored procedure of choice. The following sample shows how to use a stored procedure to do a simple insertion into an Azure SQL Database table. 

**Output dataset**

	{
	    "name": "AzureSQLOutput",
	    "properties": {
	        "type": "AzureSqlTableLocation",
	        "linkedServiceName": "AzureSqlLinkedService",
	        "typeProperties": {
	            "tableName": " Marketing”
	        },
	        "availability": {
	            "frequency": "Hour",
	            "interval": 1,
	        }
	    }
	}

Define the **SqlSink** section in copy activity JSON as follows. To call a stored procedure while insert data, both **SqlWriterStoredProcedureName** and **SqlWriterTableType** properties are needed.
	
	"sink":
	{
	    "type": "SqlSink",
	    "SqlWriterTableType": "MarketingType",
	    "SqlWriterStoredProcedureName": "spOverwriteMarketing", 
	    "storedProcedureParameters":
	            {
	                "stringData": 
	                {
	                    "value": "str1"     
	                }
	            }
	}

In your database, define the stored procedure with the same name as SqlWriterStoredProcedureName. It handles input data from your specified source, and insert into the output table. Notice that the parameter name of the stored procedure should be the same as the tableName defined in Table JSON file.

	CREATE PROCEDURE spOverwriteMarketing @Marketing [dbo].[MarketingType] READONLY, @stringData varchar(256)
	AS
	BEGIN
	    INSERT [dbo].[Marketing](ProfileID, State)
	    SELECT * FROM @Marketing
	    Where ProfileID = @stringData
	END

In your database, define the table type with the same name as SqlWriterTableType. Notice that the schema of the table type should be same as the schema returned by your input data.

	CREATE TYPE [dbo].[MarketingType] AS TABLE(
	    [ProfileID] [varchar](256) NOT NULL,
	    [State] [varchar](256) NOT NULL,
	)

The stored procedure feature takes advantage of [Table-Valued Parameters](https://msdn.microsoft.com/library/bb675163.aspx).

[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]


## Type Mapping for SQL server & Azure SQL

As mentioned in the [data movement activities](data-factory-data-movements.md) article Copy activity performs automatic type conversions from automatic type conversions from source types to sink types with the following 2 step approach:

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


[AZURE.INCLUDE [data-factory-data-stores-with-rectangular-tables](../../includes/data-factory-data-stores-with-rectangular-tables.md)]



	 









