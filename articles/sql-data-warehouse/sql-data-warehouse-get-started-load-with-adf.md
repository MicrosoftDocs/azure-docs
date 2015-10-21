<properties
	pageTitle="Load data with Azure Data Factory | Microsoft Azure"
	description="Learn to load data with Azure Data Factory"
	services="sql-data-warehouse"
	documentationCenter="NA"
	authors="lodipalm"
	manager="barbkess"
	editor=""
	tags="azure-sql-data-warehouse"/>
<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="10/20/2015"
   ms.author="lodipalm"/>

# Load Data with Azure Data Factory

 Following this tutorial will show you how to create a pipeline in Azure Data Factory that will move data from Azure Storage Blobs to a SQL Data Warehouse. With the following steps you will:

+ Set-up sample data in an Azure Storage Blob.
+ Connect resources to Azure Data Factory.
+ Create a pipeline to move data from Storage Blobs to SQL Data Warehouse.

## Resources
For this tutorial, you will need the following resources:

   + **Azure Storage Blob**:  Your Azure Storage Blob will be the source of data for the pipeline.  You can use an existing blob or [provision a new one](https://azure.microsoft.com/en-us/documentation/articles/storage-create-storage-account/).

   + **SQL Data Warehouse**: In this tutorial you will be moving data to SQL Data Warehouse.  If you do not already have an instance set-up, you can learn how  [here](https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-get-started-provision/).  In addition, your instance will need to be set-up with our AdventureWorks DW dataset.  If you didn't provision your data warehouse with the sample data, you can [load it manually](https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-get-started-manually-load-samples/).

   + **Azure Data Factory**: Azure Data Factory will complete the actual load and if you need more information on setting Azure Data Factory or creating pipelines then you can see that [here](https://azure.microsoft.com/en-us/documentation/articles/data-factory-build-your-first-pipeline-using-editor/).

Once you have all of the pieces ready you can move on to preparing your data and creating your Azure Data Factory pipeline.

## Sample Data
In addition to the different pieces of the pipeline, we will also need some sample data that can use to practice loading data in Azure Data Factory.  

1. First, [download the sample data](https://migrhoststorage.blob.core.windows.net/adfsample/FactInternetSales.csv).  This data works in conjunction with the sample data that is already in your sample data, providing another three years of sales data.

2. Once the data is downloaded, you can move it to your blob storage by running the below script in AZCopy:

        AzCopy /Source:<Sample Data Location>  /Dest:https://<storage account>.blob.core.windows.net/<container name> /DestKey:<storage key> /Pattern:FactInternetSales.csv

	See the [AZCopy documentation](https://azure.microsoft.com/en-us/documentation/articles/storage-use-azcopy/) for additional information on how to install and work with AZCopy.

Now that we have our data in place we can move to your data factory to create the pipeline that will move data from your storage account to your SQL Data Warehouse.  

## Using Azure Data Factory
Now that we've set up all the pieces, we can start to set-up the pipeline by navigating to your Azure Data Factory instance in the Azure Preview Portal.  This can be done by going to the [Azure Portal](portal.azure.com) and selecting your data factory from the left-hand menu.

![Finding ADF][1]

From here there will be three steps to setting up a Azure Data Factory pipeline to transfer data to your data warehouse: linking your services, defining your datasets, and creating your pipeline.

### Creating linked services
The first step is to link your Azure storage account and SQL Data Warehouse to your data factory.  

1. First, begin the registration process by clicking the 'Linked Services' section of your data factory and then clicking 'New data store.' Then choose a name to register your azure storage under, select Azure Storage as your type, and enter your Account Name and Account Key.

![Find new store][2]

2. To register SQL Data Warehouse you will need to navigate to the 'Author and Deploy' section, then select 'New Data Store' and then 'Azure SQL Data Warehouse'. You will then need to fill in the below template:

![author and deploy][3]

		{
		    "name": "<Linked Service Name>",
		    "properties": {
		        "description": "",
		        "type": "AzureSqlDW",
		        "typeProperties": {
		            "connectionString": "Data Source=tcp:<server name>.database.windows.net,1433;Initial Catalog=<server name>;Integrated Security=False;User ID=<user>@<servername>;Password=<password>;Connect Timeout=30;Encrypt=True"
		        }
		    }
		}

### Registering datasets
After creating the linked services, we will have to define the data sets.  Here this means defining the structure of the data that is being moved from your storage to your data warehouse.  You can read more about creating

1. Start this process by navigating to the 'Author and Deploy' section of your data factory.

2. Click 'New dataset' and then 'Azure Blob storage' to link your storage to your data factory.  You can use the below script to define your data in Azure Blob storage:

		{
			"name": "<Dataset Name>",
			"properties": {
				"type": "AzureBlob",
				"linkedServiceName": "<linked storage name>",
				"typeProperties": {
					"folderPath": "<containter name>",
					"fileName": "FactInternetSales.csv",
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



3. Now we will also define our dataset for SQL Data Warehouse.  We start in the same way, by clicking 'New dataset' and then 'Azure SQL Data Warehouse'.

		{
		  "name": "<dataset name>",
		  "properties": {
		    "type": "AzureSqlDWTable",
		    "linkedServiceName": "<linked data warehouse name>",
		    "typeProperties": {
		      "tableName": "FactInternetSales"
		    },
		    "availability": {
		      "frequency": "Hour",
		      "interval": 1
		    }
		  }
		}

		{
		  "name": "DWDataset",
		  "properties": {
			"type": "AzureSqlDWTable",
			"linkedServiceName": "AzureSqlDWLinkedService",
			"typeProperties": {
			  "tableName": "FactInternetSales"
			},
			"availability": {
			  "frequency": "Hour",
			  "interval": 1
			}
		  }
		}

### Setting up your pipeline
Finally, we will set-up and run the pipeline in Azure Data Factory.  This is the operation that will complete the actual data movement.  You can find a full view of the operations that you can complete with SQL Data Warehouse and Azure Data Factory [here](https://azure.microsoft.com/en-us/documentation/articles/data-factory-azure-sql-data-warehouse-connector/).

In the 'Author and Deploy' section now click 'More Commands' and then 'New Pipeline'.  After you create the pipeline, you can use the below code to transfer the data to your data warehouse:

![new pipeline][4]

	{
	"name": "<Pipeline Name>",
	"properties": {
		"description": "<Description>",
		"activities": [
			{
				"type": "Copy",
				"typeProperties": {
					"source": {
						"type": "BlobSource",
						"skipHeaderLineCount": 1
					},
					"sink": {
						"type": "SqlDWSink",
						"writeBatchSize": 0,
						"writeBatchTimeout": "00:00:10"
					}
				},
				"inputs": [
					{
						"name": "StorageDataset"
					}
				],
				"outputs": [
					{
						"name": "DWDataset"
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
				"name": "Sample Copy",
				"description": "Copy Activity"
			}
		],
		"start": "<Date YYYY-MM-DD>",
		"end": "<Date YYYY-MM-DD>",
		"isPaused": false
	}
	}
	
<!--Image references-->
[1]:./media/sql-data-warehouse-get-started-analyze-data-with-power-bi/finding_adf.png
[2]:./media/sql-data-warehouse-get-started-analyze-data-with-power-bi/finding_new_store.png
[3]:./media/sql-data-warehouse-get-started-analyze-data-with-power-bi/author_deploy.png
[4]:./media/sql-data-warehouse-get-started-analyze-data-with-power-bi/create_pipeline.png
