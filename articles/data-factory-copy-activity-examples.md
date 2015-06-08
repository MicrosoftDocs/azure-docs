<properties 
	pageTitle="Examples for using Copy Activity in Azure Data Factory " 
	description="Provides examples for usin a Copy Activity in an Azure data factory." 
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
	ms.date="04/14/2015" 
	ms.author="spelluru"/>

# Examples for using Copy Activity in Azure Data Factory
You can use the **Copy Activity** in a pipeline to copy data from a source to a sink (destination) in a batch. This topic provides a few examples for using the Copy Activity in a Data Factory pipeline. For a detailed overview of the Copy Activity and core scenarios that it supports, see [Copy data with Azure Data Factory][adf-copyactivity].

## Copy data from an on-premises SQL Server database to an Azure blob
In this example, an input table and an output table are defined and the tables are used in a Copy Activity within a pipeline that copies data from an on-premises SQL Server database to an Azure blob.

### Assumptions
This example assumes that you already have the following Azure Data Factory artifacts:

* Resource group named **ADF**.
* An Azure data factory named **CopyFactory**.
* A data management gateway named **mygateway** is created and is online.  

### Create a linked service for the source on-premises SQL Server database
In this step, you create a linked service named **MyOnPremisesSQLDB** that points to an on-premises SQL Server database.

	{
	    "name": "MyOnPremisesSQLDB",
	    "properties":
	    {
	        "type": "OnPremisesSqlLinkedService",
	        "connectionString": "Data Source=<servername>;Initial Catalog=<database>;Integrated Security=False;User ID=<username>;Password=<password>;",
	        "gatewayName": "mygateway"
	    }
	}

Note the following:

- **type** is set to **OnPremisesSqlLinkedService**.
- **connectionString** is set to connection string for a SQL Server database. 
- **gatewayName** is set to the name of the Data Management Gateway you have installed on your on-premises computer and registered with the Azure Data Factory service portal. 

See [On-Premises SQL Linked Service](https://msdn.microsoft.com/library/dn893523.aspx) for details about JSON elements for defining an on-premises SQL linked service.
 
### Create a linked service for the destination Azure blob
In this step, you create a linked service named **MyAzureStorage** that points an Azure blob storage.

	{
	    "name": "MyAzureStorage",
	    "properties":
	    {
	        "type": "AzureStorageLinkedService",
	        "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>" "
	    }
	}

Note the following:

- **type** is set to **AzureStorageLinkedService**.
- **connectionString** - specify account name and account key for the Azure storage.

See [Azure Storage Linked Service](https://msdn.microsoft.com/library/dn893522.aspx) for details about JSON elements to define an Azure Storage linked service. 

### Input table JSON
The following JSON script defines an input table that refers to a SQL table: **MyTable** in an on-premises SQL Server database that the **MyOnPremisesSQLDB** linked service defines. Note that **name** is the name of the Azure Data Factory table and **tableName** is the name of the SQL table in a SQL Server database.

         
	{
		"name": "MyOnPremTable",
    	"properties":
   		{
			"location":
    		{
    			"type": "OnPremisesSqlServerTableLocation",
    			"tableName": "MyTable",
    			"linkedServiceName": "MyOnPremisesSQLDB"
    		},
    		"availability":
   			{
    			"frequency": "Hour",
    			"interval": 1
   			}
 		}
	}

Note the following:

- **type** is set to **OnPremisesSqlServerTableLocation**.
- **tableName** is set to **MyTable**, which contains the source data. 
- **linkedServiceName** is set to **MyOnPremisesSQLDB**, the linked service you created for the on-premises SQL database.

See [On-premises SQL location properties](https://msdn.microsoft.com/library/dn894089.aspx#OnPremSQL) for details about JSON elements to define a Data Factory table that refers to an SQL Server table. 

### Output table JSON
The following JSON script defines an output table: **MyAzureBlob**, which refers to an Azure blob: **MyBlob** in the blob folder: **MySubFolder** in the blob container: **MyContainer**.
         
	{
   		"name": "MyAzureBlob",
	    "properties":
    	{
    		"location":
    		{
        		"type": "AzureBlobLocation",
        		"folderPath": "MyContainer/MySubFolder",
        		"fileName": "MyBlob",
        		"linkedServiceName": "MyAzureStorage",
        		"format":
        		{
            		"type": "TextFormat",
            		"columnDelimiter": ",",
            		"rowDelimiter": ";",
             		"EscapeChar": "$",
             		"NullValue": "NaN"
        		}
    		},
        	"availability":
      		{
       			"frequency": "Hour",
       			"interval": 1
      		}
   		}
	}

Note the following:
 
- **type** is set to **AzureBlobLocation**.
- **folderPath** is set to **MyContainer/MySubFolder**, which contains the blob that holds the copied data. 
- **fileName** is set to **MyBlob**, the blob that will hold the output data.
- **linkedServiceName** is set to **MyAzureStorge**, the linked service you created for the Azure storage.    

See [Azure blob location properties](https://msdn.microsoft.com/library/dn894089.aspx#AzureBlob) for details about JSON elements to define a Data Factory table that refers to an Azure blob. 

### Pipeline (with Copy Activity) JSON
In this example, a pipeline: **CopyActivityPipeline** is defined with the following properties: 

- The **type** property is set to **CopyActivity**.
- **MyOnPremTable** is specified as the input (**inputs** tag).
- **MyAzureBlob** is specified as the output (**outputs** tag)
- **Transformation** section contains two sub sections: **source** and **sink**. The type for source is set to **SqlSource** and the type for sink is set to **BlobSink**. The **sqlReaderQuery** defines the transformation (projection) to be performed on the source. For details about all the properties, see [JSON Scripting Reference][json-script-reference].

         
		{
		    "name": "CopyActivityPipeline",
    		"properties":
    		{
				"description" : "This is a sample pipeline to copy data from SQL Server to Azure Blob",
        		"activities":
        		[
      				{
						"name": "CopyActivity",
						"description": "description", 
						"type": "CopyActivity",
						"inputs":  [ { "name": "MyOnPremTable"  } ],
						"outputs":  [ { "name": "MyAzureBlob" } ],
						"transformation":
	    				{
							"source":
							{
								"type": "SqlSource",
                    			"sqlReaderQuery": "select * from MyTable"
							},
							"sink":
							{
                        		"type": "BlobSink"
							}
	    				}
      				}
        		]
    		}
		}

See [Pipeline JSON reference](https://msdn.microsoft.com/library/dn834988.aspx) for details about JSON elements to define a Data Factory pipeline and [Supported Sources and Sinks](https://msdn.microsoft.com/library/dn894007.aspx) for properties of SqlSource (for example: **sqlReaderQuery **in the example) and BlobSink. 


## Copy data from an on-premises file system to an Azure blob
You can use Copy Activity to copy files from an on-premises file system (Windows/Linux network shares or Windows local host) to an Azure Blob. The host can be either Windows or Linux with Samba configured. Data Management Gateway should be installed on a Windows machine that can connect to the host.

### Assumptions
This example assumes the following:  

- **Host** - Name of the server that hosts the file system is: **\\contoso**.
- **Folder** - Name of the folder that contains the input files is: **marketingcampaign\\regionaldata\\{slice}, where files are partitioned in a folder named {slice}, such as 2014121112 (year of 2014, month of 12, day of 11, hour of 12).

### Create an on-premises file system linked service
The following sample JSON can be used to create a linked service named **FolderDataStore** of type **OnPremisesFileSystemLinkedService**.  

	{
	    "name": "FolderDataStore",
	    "properties": {
	        "type": "OnPremisesFileSystemLinkedService",
	        "host": "\\\\contoso",
	        "userId": "username",
	        "password": "password",
	        "gatewayName": "ContosoGateway"
	    }
	}

> [AZURE.NOTE] Remember to use the escape character '\' for names of the host and folders in JSON files. For **\\Contoso**, use **\\\\Contoso**.

See [On-premises File System Linked Service](https://msdn.microsoft.com/library/dn930836.aspx) for details about JSON elements to define an on-premises file system linked service. 

### Create a linked service for the destination Azure blob
The following sample JSON can be used to create a linked service named **MyAzureStorage** of type **AzureStorageLinkedSerivce**.

	{
	    "name": "MyAzureStorage",
	    "properties":
	    {
	        "type": "AzureStorageLinkedService",
	        "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>" "
	    }
	}

See [Azure Storage Linked Service](https://msdn.microsoft.com/library/dn893522.aspx) for details about JSON elements to define an Azure Storage linked service. 

### Create the input table
The following JSON script defines an input table that refers to an on-premises file system linked service you created earlier.

	{
	    "name": "OnPremFileSource",
	    "properties": {
	        "location": {
	            "type": "OnPremisesFileSystemLocation",
	            "folderPath": "marketingcampaign\\regionaldata\\{Slice}",
	            "partitionedBy": [
	                { "name": "Slice", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyyMMddHH" } }
	            ],
	            "linkedServiceName": "FolderDataStore"
	        },
	        "availability": {
	            "waitOnExternal": { },
	            "frequency": "Hour",
	            "interval": 24
	        }
	    }
	}

See [On-premises File System location properties](https://msdn.microsoft.com/library/dn894089.aspx#OnPremFileSystem) for details about JSON elements to define a Data Factory table that refers to an on-premises file system. 

### Create the output able
The following JSON script defines an output table: **AzureBlobDest**, which refers to an Azure blob: **MyBlob** in the blob folder: **MySubFolder** in the blob container: **MyContainer**.
         
	{
   		"name": "AzureBlobDest",
	    "properties":
    	{
    		"location":
    		{
        		"type": "AzureBlobLocation",
        		"folderPath": "MyContainer/MySubFolder",
        		"fileName": "MyBlob",
        		"linkedServiceName": "MyAzureStorage",
        		"format":
        		{
            		"type": "TextFormat",
            		"columnDelimiter": ",",
            		"rowDelimiter": ";",
             		"EscapeChar": "$",
             		"NullValue": "NaN"
        		}
    		},
        	"availability":
      		{
       			"frequency": "Hour",
       			"interval": 1
      		}
   		}
	}

See [Azure blob location properties](https://msdn.microsoft.com/library/dn894089.aspx#AzureBlob) for details about JSON elements to define a Data Factory table that refers to an Azure blob. 

### Create the pipeline
The following pipeline JSON defines a pipeline with a Copy Activity that copies data from the on-premises file system to the destination Azure blob.
 
	{
	    "name": "CopyFileToBlobPipeline",
	    "properties": {
	        "activities": [
	            {
	                "name": "Ingress",
	                "type": "CopyActivity",
	                "inputs": [ { "name": "OnPremFileSource" } ],
	                "outputs": [ { "name": "AzureBlobDest" } ],
	                "transformation": {
	                    "source": {
	                        "type": "FileSystemSource"
	                    },
	                    "sink": {
	                        "type": "BlobSink"
	                    }
	                },
	                "policy": {
	                    "concurrency": 4,
	                    "timeout": "00:05:00"
	                }
	            }
	        ]
	    }
	}

The pipeline in this example copies the content as binary, without any parsing or performing any transformations. Notice that you can leverage **concurrency** to copy slices of files in parallel. This is useful when you want to move the slices already happened in the past.

> [AZURE.NOTE] Concurrent copy activities with the same host via UNC path with different user accounts may lead to errors such as "multiple connections to a server or shared resource by the same user, using more than one user name, are not allowed”. This is the restriction of the operating system for security reasons. Either schedule the copy activities with different gateways, or install the gateway within the host and use “localhost” or “local” instead of UNC path.

See [Pipeline JSON reference](https://msdn.microsoft.com/library/dn834988.aspx) for details about JSON elements to define a Data Factory pipeline and [Supported Sources and Sinks](https://msdn.microsoft.com/library/dn894007.aspx) for properties of FileSystemSource and BlobSink.

### Additional scenarios for using file system tables

#### Copy all files under a specific folder
Note that only **folderPath** is specified in the sample JSON. 

	{
	    "name": "OnPremFileSource",
	    "properties": {
	        "location": {
	            "type": "OnPremisesFileSystemLocation",
	            "folderPath": "marketingcampaign\\regionaldata\\na",
	            "linkedServiceName": "FolderDataStore"
	        },
	        ...
	    }
	}
 
#### Copy all CSV files under the specific folder
Note that the **fileFilter** is set to ***.csv**.

	{
	    "name": "OnPremFileSource",
	    "properties": {
	        "location": {
	            "type": "OnPremisesFileSystemLocation",
	            "folderPath": "marketingcampaign\\regionaldata\\na",
	            "fileFilter": "*.csv",
	            "linkedServiceName": "FolderDataStore"
	        },
	        ...
	    }
	}

#### Copy a specific file
Note that the **fileFiter** is set to a specific file: **201501.csv**.

	{
	    "name": "OnPremFileSource",
	    "properties": {
	        "location": {
	            "type": "OnPremisesFileSystemLocation",
	            "folderPath": "marketingcampaign\\regionaldata\\na",
	            "fileFilter": "201501.csv",
	            "linkedServiceName": "FolderDataStore"
	        },
	        ...
	    }
	}

## Copy data from an on-premises Oracle database to an Azure blob
You can use Copy Activity to copy files from an on-premises on-premises Oracle database to an Azure Blob. 

### create a linked service for an on-premises Oracle database
The following JSON can be used to create a linked service that points to an on-premises Oracle database. Note that the **type** is set to **OnPremisesOracleLinkedService**. 

	{
	    "name": "OnPremOracleSource",
	    "properties": {
	        "type": "OnPremisesOracleLinkedService",
	        "ConnectionString": "data source=ds;User Id=uid;Password=pwd;",
	        "gatewayName": "SomeGateway"
	    }
	}

See [On-Premises Oracle Linked Service](https://msdn.microsoft.com/library/dn948537.aspx) for  details about JSON elements to define an on-premises Oracle linked service.

### Create a linked service for the destination Azure blob
The following sample JSON can be used to create a linked service named **MyAzureStorage** of type **AzureStorageLinkedSerivce**.

	{
	    "name": "AzureBlobDest",
	    "properties":
	    {
	        "type": "AzureStorageLinkedService",
	        "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>" "
	    }
	}

See [Azure Storage Linked Service](https://msdn.microsoft.com/library/dn893522.aspx) for details about JSON elements to define an Azure Storage linked service.

### Create the input table
The following sample JSON can be used to create an Azure Data Factory table that refers to a table in an on-premises Oracle database. Note that the **location type** is set to **OnPremisesOracleTableLocation**.

	{
	    "name": "TableOracle",
	    "properties": {
	        "location": {
	            "type": "OnPremisesOracleTableLocation",
	            "tableName": "LOG",
	            "linkedServiceName": "OnPremOracleSource"
	        },
	        "availability": {
	            "frequency": "Day",
	            "interval": "1",
	            "waitOnExternal": {}
	        },
	        "policy": {}
	    }
	} 

See [On-premises Oracle location properties](https://msdn.microsoft.com/library/dn894089.aspx#Oracle) for details about JSON elements to define a Data Factory table that refers to a table in an on-premises Oracle database. 

### Create the output table
The following JSON script defines an output table: **MyAzureBlob**, which refers to an Azure blob: **MyBlob** in the blob folder: **MySubFolder** in the blob container: **MyContainer**.
         
	{
   		"name": "MyAzureBlob",
	    "properties":
    	{
    		"location":
    		{
        		"type": "AzureBlobLocation",
        		"folderPath": "MyContainer/MySubFolder",
        		"fileName": "MyBlob",
        		"linkedServiceName": "AzureBlobDest",
        		"format":
        		{
            		"type": "TextFormat",
            		"columnDelimiter": ",",
            		"rowDelimiter": ";",
             		"EscapeChar": "$",
             		"NullValue": "NaN"
        		}
    		},
        	"availability":
      		{
       			"frequency": "Hour",
       			"interval": 1
      		}
   		}
	}

See [Azure blob location properties](https://msdn.microsoft.com/library/dn894089.aspx#AzureBlob) for details about JSON elements to define a Data Factory table that refers to an Azure blob.

### Create the pipeline
The following sample pipeline has a Copy activity that copies data from an Oracle database table to an Azure Storage blob. 

	{
	    "name": "PipelineCopyOracleToBlob",
	    "properties": {
	        "activities": [
	            {
	                "name": "CopyActivity",
	                "description": "copy slices of oracle records to azure blob",
	                "type": "CopyActivity",
	                "inputs": [ { "name": "TableOracle" } ],
	                "outputs": [ { "name": "TableAzureBlob" } ],
	                "transformation": {
	                    "source": {
	                        "type": "OracleSource",
	                        "oracleReaderQuery": "$$Text.Format('select * from LOG where \"Timestamp\" >= to_date(\\'{0:yyyy-MM-dd}\\', \\'YYYY-MM-DD\\') AND \"Timestamp\" < to_date(\\'{1:yyyy-MM-dd}\\', \\'YYYY-MM-DD\\')', SliceStart, SliceEnd)"
	                    },
	                    "sink": {
	                        "type": "BlobSink"
	                    }
	                },
	                "policy": {
	                    "concurrency": 3,
	                    "timeout": "00:05:00"
	                }
	            }
	        ],
	        "start": "2015-03-01T00:00:00Z",
	        "end": "2015-03-15T00:00:00Z",
	        "isPaused": false
	    }
	}

See [Pipeline JSON reference](https://msdn.microsoft.com/library/dn834988.aspx) for details about JSON elements to define a Data Factory pipeline and [Supported Sources and Sinks](https://msdn.microsoft.com/library/dn894007.aspx) for properties of OracleSource and BlobSink.

## See Also

- [Copy data with Azure Data Factory][adf-copyactivity]
- [Copy Activity - JSON Scripting Reference](https://msdn.microsoft.com/library/dn835035.aspx)
- [Video: Introducing Azure Data Factory Copy Activity][copy-activity-video]


[adf-copyactivity]: data-factory-copy-activity.md
[copy-activity-video]: http://azure.microsoft.com/documentation/videos/introducing-azure-data-factory-copy-activity/