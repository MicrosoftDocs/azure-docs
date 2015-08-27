<properties 
	pageTitle="Move data to and from SQL Server | Azure Data Factory" 
	description="Learn about how to move data to/from SQL Server database that is on-premises or in an Azure VM using Azure Data Factory." 
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
	ms.date="08/26/2015" 
	ms.author="spelluru"/>

# Move data to and from SQL Server on-premises or on IaaS (Azure VM) using Azure Data Factory

This article outlines how you can use the Copy Activity in an Azure data factory to move data to SQL Server from another data store and move data from another data store to SQL Server. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with copy activity and supported data store combinations.

## Enabling connectivity

The concepts and steps needed for connecting with SQL Server hosted on-premises or in Azure IaaS (Infrastructure-as-a-Service) VMs are the same. In both cases, you need to leverage Data Management Gateway for connectivity. 

See [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article to learn about Data Management Gateway and step-by-step instructions on setting up the gateway. Setting up a gateway instance is a pre-requisite for connecting with SQL Server.

While you can install the gateway on the same on-premises machine or cloud VM instance as the SQL Server for better performance it is recommended to install them on separate machines or cloud VM to avoid resource contention. 

## Sample: Copy data from SQL Server to Azure Blob

The sample below shows:

1.	A linked service of type [OnPremisesSqlServer](data-factory-sqlserver-connector.md#sql-server-linked-service-properties).
2.	A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties).
3.	An input [dataset](data-factory-create-datasets.md) of type [SqlServerTable](data-factory-sqlserver-connector.md#sql-server-dataset-type-properties). 
4.	An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
4.	The [pipeline](data-factory-create-pipelines.md) with Copy activity that uses [SqlSource](data-factory-sqlserver-connector.md#sql-server-copy-activity-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties).

The sample copies data belonging to a time series from a table in SQL Server database to a blob every hour. The JSON properties used in these samples are described in sections following the samples.

As a first step, please setup the data management gateway as per the instructions in the [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article.

**SQL Server linked service**

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

**SQL Server input dataset**

The sample assumes you have created a table “MyTable” in SQL Server and it contains a column called “timestampcolumn” for time series data. 

Setting “external”: ”true” and specifying externalData policy information the Azure Data Factory service that this is a table that is external to the data factory and not produced by an activity in the data factory.

	{
	  "name": "SqlServerInput",
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

**Azure Blob output dataset**

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
	        "name": "SqlServertoBlob",
	        "description": "copy activity",
	        "type": "Copy",
	        "inputs": [
	          {
	            "name": " SqlServerInput"
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

## Sample: Copy data from Azure Blob to SQL Server

The sample below shows:

1.	The linked service of type [OnPremisesSqlServer](data-factory-sqlserver-connector.md#sql-server-linked-service-properties).
2.	The linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties).
3.	An input [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
4.	An output [dataset](data-factory-create-datasets.md) of type [SqlServerTable](data-factory-sqlserver-connector.md#sql-server-dataset-type-properties).
4.	The [pipeline](data-factory-create-pipelines.md) with Copy activity that uses [BlobSource](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties) and [SqlSink](data-factory-sqlserver-connector.md#sql-server-copy-activity-type-properties).

The sample copies data belonging to a time series from Azure blob to a table in SQL Server database every hour. The JSON properties used in these samples are described in sections following the samples.

**SQL Server linked service**
	
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
	
**SQL Server output dataset**

The sample copies data to a table named “MyTable” in SQL Server. You should create the table in SQL Server with the same number of columns as you expect the Blob CSV file to contain. New rows are added to the table every hour.
	
	{
	  "name": "SqlServerOutput",
	  "properties": {
	    "type": "SqlServerTable",
	    "linkedServiceName": "SqlServerLinkedService",
	    "typeProperties": {
	      "tableName": "MyOutputTable"
	    },
	    "availability": {
	      "frequency": "Hour",
	      "interval": 1
	    }
	  }
	}

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
	            "name": " SqlServerOutput "
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

## SQL Server Linked Service properties

The following table provides description for JSON elements specific to SQL Server linked service.

| Property | Description | Required |
| -------- | ----------- | -------- |
| type | The type property should be set to: **OnPremisesSqlServer**. | Yes |
| connectionString | Specify connectionString information needed to connect to the on-premises SQL Server database using either SQL authentication or Windows authentication. | Yes |
| gatewayName | Name of the gateway that the Data Factory service should use to connect to the on-premises SQL Server database. | Yes |
| username | Specify user name if you are using Windows Authentication. | No |
| password | Specify password for the user account you specified for the username. | No |

You can encrypt credentials using the **New-AzureDataFactoryEncryptValue** cmdlet and use them in the connection string as shown in the following example (**EncryptedCredential** property):  

	"connectionString": "Data Source=<servername>;Initial Catalog=<databasename>;Integrated Security=True;EncryptedCredential=<encrypted credential>",

### Samples

**JSON for using SQL Authentication**
	
	{
	    "name": "MyOnPremisesSQLDB",
	    "properties":
	    {
	        "type": "OnPremisesSqlLinkedService",
	        "connectionString": "Data Source=<servername>;Initial Catalog=MarketingCampaigns;Integrated Security=False;User ID=<username>;Password=<password>;",
	        "gatewayName": "<gateway name>"
	    }
	}

**JSON for using Windows Authentication**

If username and password are specified, gateway will use them to impersonate the specified user account to connect to the on-premises SQL Server database. Otherwise, gateway will connect to the SQL Server directly with the security context of Gateway (its startup account).

	{ 
	     "Name": " MyOnPremisesSQLDB", 
	     "Properties": 
	     { 
	         "type": "OnPremisesSqlLinkedService", 
	         "ConnectionString": "Data Source=<servername>;Initial Catalog=MarketingCampaigns;Integrated Security=True;", 
	         "username": "<username>", 
	         "password": "<password>", 
	         "gatewayName": "<gateway name>" 
	     } 
	}

See [Setting Credentials and Security](data-factory-move-data-between-onprem-and-cloud.md#setting-credentials-and-security) for details about setting credentials for an SQL Server data source.

## SQL Server Dataset type properties

For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (SQL Server, Azure blob, Azure table, etc...). 

The typeProperties section is different for each type of dataset and provides information about the location of the data in the data store. The **typeProperties** section for the dataset of type **SqlServerTable** has the following properties.

| Property | Description | Required |
| -------- | ----------- | -------- |
| tableName | Name of the table in the SQL Server Database instance that linked service refers to. | Yes |

## SQL Server Copy Activity type properties

For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc are available for all types of activities. 

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

In case of Copy activity when source is of type **SqlSource** the following properties are available in **typeProperties** section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| sqlReaderQuery | Use the custom query to read data. | SQL query string.For example: select * from MyTable. If not specified, the SQL statement that is executed: select from MyTable. | No |

**SqlSink** supports the following properties:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| sqlWriterStoredProcedureName | User specified stored procedure name to upsert (update/insert) data into the target table. | Name of the stored procedure. | No |
| sqlWriterTableType | User specified table type name to be used in the above stored procedure. Copy activity makes the data being moved available in a temp table with this table type. Stored procedure code can then merge the data being copied with existing data. | A table type name. | No |
| writeBatchSize | Inserts data into the SQL table when the buffer size reaches writeBatchSize | Integer. (unit = Row Count) | No (Default = 10000) |
| writeBatchTimeout | Wait time for the batch insert operation to complete before it times out. | (Unit = timespan) Example: “00:30:00” (30 minutes). | No | 
| sqlWriterCleanupScript | User specified query for Copy Activity to execute to make sure  that data of a specific slice will be cleaned up.  | A query statement.  | No | 
| sliceIdentifierColumnName | User specified column name for Copy Activity to fill with auto generated slice identifier, which will be used to clean up data of a specific slice when rerun. | Column name of a column with data type of binary(32). | No |

[AZURE.INCLUDE [data-factory-type-repeatability-for-sql-sources](../../includes/data-factory-type-repeatability-for-sql-sources.md)] 


[AZURE.INCLUDE [data-factory-sql-invoke-stored-procedure](../../includes/data-factory-sql-invoke-stored-procedure.md)] 


[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]


### Type Mapping for SQL server & Azure SQL

As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article, the  Copy activity performs automatic type conversions from automatic type conversions from source types to sink types with the following 2 step approach:

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