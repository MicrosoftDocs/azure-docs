<properties
   pageTitle="Load data from Azure blob storage into Azure SQL Data Warehouse (Azure Data Factory) | Microsoft Azure"
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
   ms.date="04/29/2016"
   ms.author="lodipalm;barbkess;sonyama"/>

# Load data from Azure blob storage into Azure SQL Data Warehouse (Azure Data Factory)

> [AZURE.SELECTOR]
- [Data Factory](sql-data-warehouse-load-from-azure-blob-storage-with-data-factory.md)
- [PolyBase](sql-data-warehouse-load-from-azure-blob-storage-with-polybase.md)

 This tutorial shows you how to create a pipeline in Azure Data Factory to move data from Azure Storage Blob to SQL Data Warehouse. With the following steps you will:

+ Set-up sample data in an Azure Storage Blob.
+ Connect resources to Azure Data Factory.
+ Create a pipeline to move data from Storage Blobs to SQL Data Warehouse.

>[AZURE.VIDEO loading-azure-sql-data-warehouse-with-azure-data-factory]


## Before you begin

To familiarize yourself with Azure Data Factory, see [Introduction to Azure Data Factory][].

### Create or identify resources

Before starting this tutorial, you need to have the following resources.

   + **Azure Storage Blob**: This tutorial uses Azure Storage Blob as the data source for the Azure Data Factory pipeline, and so you need to have one available to store the sample data. If you don't have one already, learn how to [Create a storage account][].

   + **SQL Data Warehouse**: This tutorial moves the data from Azure Storage Blob to  SQL Data Warehouse and so need to have a data warehouse online that is loaded with the AdventureWorksDW sample data. If you do not already have a data warehouse, learn how to [provision one][Create a SQL Data Warehouse]. If you have a data warehouse but didn't provision it with the sample data, you can [load it manually][Load sample data into SQL Data Warehouse].

   + **Azure Data Factory**: Azure Data Factory will complete the actual load and so you need to have one that you can use to build the data movement pipeline.If you don't have one already, learn how to create one in Step 1 of [Get started with Azure Data Factory (Data Factory Editor)][].

   + **AZCopy**: You need AZCopy to copy the sample data from your local client to your Azure Storage Blob. For install instructions, see the [AZCopy documentation][].

## Step 1: Copy sample data to Azure Storage Blob

Once you have all of the pieces ready, you are ready to copy sample data to your Azure Storage Blob.

1. [Download sample data][]. This data will add another three years of sales data to your AdventureWorksDW sample data.

2. Use this AZCopy command to copy the three years of data to your Azure Storage Blob.

````
AzCopy /Source:<Sample Data Location>  /Dest:https://<storage account>.blob.core.windows.net/<container name> /DestKey:<storage key> /Pattern:FactInternetSales.csv
````


## Step 2: Connect resources to Azure Data Factory

Now that the data is in place we can create the Azure Data Factory pipeline to move the data from Azure blob storage into SQL Data Warehouse.

To get started, open the [Azure portal][] and select your data factory from the left-hand menu.

### Step 2.1: Create Linked Service

Link your Azure storage account and SQL Data Warehouse to your data factory.  

1. First, begin the registration process by clicking the 'Linked Services' section of your data factory and then click 'New data store.' Choose a name to register your azure storage under, select Azure Storage as your type, and then enter your Account Name and Account Key.

2. To register SQL Data Warehouse navigate to the 'Author and Deploy' section, select 'New Data Store', and then 'Azure SQL Data Warehouse'. Copy and paste in this template, and then fill in your specific information.

```JSON
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
```

### Step 2.2: Define the dataset

After creating the linked services, we will have to define the data sets.  Here this means defining the structure of the data that is being moved from your storage to your data warehouse.  You can read more about creating

1. Start this process by navigating to the 'Author and Deploy' section of your data factory.

2. Click 'New dataset' and then 'Azure Blob storage' to link your storage to your data factory.  You can use the below script to define your data in Azure Blob storage:

```JSON
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
```


3. Now we will also define our dataset for SQL Data Warehouse.  We start in the same way, by clicking 'New dataset' and then 'Azure SQL Data Warehouse'.

```JSON
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
```

## Step 3: Create and run your pipeline

Finally, we will set-up and run the pipeline in Azure Data Factory.  This is the operation that will complete the actual data movement.  You can find a full view of the operations that you can complete with SQL Data Warehouse and Azure Data Factory [here][Move data to and from Azure SQL Data Warehouse using Azure Data Factory].

In the 'Author and Deploy' section now click 'More Commands' and then 'New Pipeline'.  After you create the pipeline, you can use the below code to transfer the data to your data warehouse:

```JSON
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
	    		"name": "<Storage Dataset>"
	    	  }
	    	],
	    	"outputs": [
	    	  {
	    	    "name": "<Data Warehouse Dataset>"
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
```

## Next steps

To learn more, start by viewing:

- [Azure Data Factory learning path][].
- [Azure SQL Data Warehouse Connector][]. This is the core reference topic for using Azure Data Factory with Azure SQL Data Warehouse.


These topics provide detailed information about Azure Data Factory. They discuss Azure SQL Database or HDinsight, but the information also applies to Azure SQL Data Warehouse.

- [Tutorial: Get started with Azure Data Factory][] This is the core tutorial for processing data with Azure Data Factory. In this tutorial you will build your first pipeline that uses HDInsight to transform and analyze web logs on a monthly basis. Note, there is no copy activity in this tutorial.
- [Tutorial: Copy data from Azure Storage Blob to Azure SQL Database][]. In this tutorial, you will create a pipeline in Azure Data Factory to copy data from Azure Storage Blob to Azure SQL Database.
- [Real-world scenario tutorial][]. This is an in-depth tutorial for using Azure Data Factory.

<!--Image references-->

<!--Article references-->
[AZCopy documentation]: ../storage/storage-use-azcopy.md
[Azure SQL Data Warehouse Connector]: ../data-factory/data-factory-azure-sql-data-warehouse-connector.md
[BCP]: sql-data-warehouse-load-with-bcp.md
[Create a SQL Data Warehouse]: sql-data-warehouse-get-started-provision.md
[Create a storage account]: ../storage/storage-create-storage-account.md#create-a-storage-account
[Data Factory]: sql-data-warehouse-get-started-load-with-azure-data-factory.md
[Get started with Azure Data Factory (Data Factory Editor)]: ../data-factory/data-factory-build-your-first-pipeline-using-editor.md
[Introduction to Azure Data Factory]: ../data-factory/data-factory-introduction.md
[Load sample data into SQL Data Warehouse]: sql-data-warehouse-load-sample-databases.md
[Move data to and from Azure SQL Data Warehouse using Azure Data Factory]: ../data-factory/data-factory-azure-sql-data-warehouse-connector.md
[PolyBase]: sql-data-warehouse-get-started-load-with-polybase.md
[Real-world scenario tutorial]: ../data-factory/data-factory-tutorial.md
[Tutorial: Copy data from Azure Storage Blob to Azure SQL Database]: ../data-factory/data-factory-get-started
[Tutorial: Get started with Azure Data Factory]: ../data-factory/data-factory-build-your-first-pipeline.md

<!--MSDN references-->

<!--Other Web references-->
[Azure Data Factory learning path]: https://azure.microsoft.com/documentation/learning-paths/data-factory
[Azure portal]: https://portal.azure.com
[Download sample data]: https://migrhoststorage.blob.core.windows.net/adfsample/FactInternetSales.csv
