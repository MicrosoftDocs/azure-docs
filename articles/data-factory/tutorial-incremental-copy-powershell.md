---
title: Incrementally copy data using Azure Data Factory | Microsoft Docs
description: In this tutorial, you create an Azure Data Factory pipeline that copies data incrementally from an Azure SQL Database to an Azure Blob Storage.
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 08/10/2017
ms.author: shlo

---

# Incrementally load data from Azure SQL Database to Azure Blob Storage
Azure Data Factory is a cloud-based data integration service that allows you to create data-driven workflows in the cloud for orchestrating and automating data movement and data transformation. Using Azure Data Factory, you can create and schedule data-driven workflows (called pipelines) that can ingest data from disparate data stores, process/transform the data by using compute services such as Azure HDInsight Hadoop, Spark, Azure Data Lake Analytics, and Azure Machine Learning, and publish output data to data stores such as Azure SQL Data Warehouse for business intelligence (BI) applications to consume. 

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [documentation for Data Factory version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).

During the data integration journey, one of the widely used scenarios is to incrementally load data periodically to refresh updated analysis result after initial data loads and analysis. In this tutorial, you focus on loading only new or updated records from the data sources into data sinks. It runs more efficiently when compared to full loads, particularly for large data sets.    

You can use Data Factory to create high-watermark solutions to achieve incremental data loading by using Lookup, Copy, and Stored Procedure activities in a pipeline.  

You perform the following steps in this tutorial:

> [!div class="checklist"]
> * Prepare the data store to store the watermark value.   
> * Create a data factory.
> * Create linked services. 
> * Create source, sink, watermark datasets.
> * Create a pipeline.
> * Run the pipeline.
> * Monitor the pipeline run. 

## Overview
The high-level solution diagram is: 

![Incrementally load data](media\tutorial-Incrementally-load-data-from-azure-sql-to-blob\incrementally-load.png)

Here are the important steps in creating this solution: 

1. **Select the watermark column**.
	Select one column in the source data store, which can be used to slice the new or updated records for every run. Normally, the data in this selected column (for example, last_modify_time or ID) keeps increasing when rows are created or updated. The maximum value in this column is used as a watermark.
2. **Prepare a data store to store the watermark value**.   
	In this tutorial, you store the watermark value in an Azure SQL database.
3. **Create a pipeline with the following workflow:** 
	
	The pipeline in this solution has the following activities:
  
	1. Create two **lookup** activities. Use the first lookup activity to retrieve the last watermark value. Use the second lookup activity to retrieve the new watermark value. These watermark values are passed to the copy activity. 
	2. Create a **copy activity** that copies rows from the source data store with the value of watermark column greater than the old watermark value and less than the new watermark value. Then, it copies the delta data from the source data store to a blob storage as a new file. 
	3. Create a **stored procedure activity** that updates the watermark value for the pipeline running next time. 


If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Prerequisites
* **Azure SQL Database**. You use the database as the **source** data store. If you don't have an Azure SQL Database, see the [Create an Azure SQL database](../sql-database/sql-database-get-started-portal.md) article for steps to create one.
* **Azure Storage account**. You use the blob storage as the **sink** data store. If you don't have an Azure storage account, see the [Create a storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account) article for steps to create one. Create a container named **adftutorial**. 
* **Azure PowerShell**. Follow the instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps).

### Create a data source table in your Azure SQL database
1. Open **SQL Server Management Studio**, in **Server Explorer**, right-click the database and choose the **New Query**.
2. Run the following SQL command against your Azure SQL database to create a table named `data_source_table` as data source store.  
    
    ```sql
	create table data_source_table
	(
		PersonID int,
		Name varchar(255),
		LastModifytime datetime
	);

	INSERT INTO data_source_table
	(PersonID, Name, LastModifytime)
	VALUES
	(1, 'aaaa','9/1/2017 12:56:00 AM'),
	(2, 'bbbb','9/2/2017 5:23:00 AM'),
	(3, 'cccc','9/3/2017 2:36:00 AM'),
	(4, 'dddd','9/4/2017 3:21:00 AM'),
	(5, 'eeee','9/5/2017 8:06:00 AM');
    ```
	In this tutorial, you use **LastModifytime** as the **watermark** column.  The data in data source store is shown in the following table:

	```
	PersonID | Name | LastModifytime
	-------- | ---- | --------------
	1 | aaaa | 2017-09-01 00:56:00.000
	2 | bbbb | 2017-09-02 05:23:00.000
	3 | cccc | 2017-09-03 02:36:00.000
	4 | dddd | 2017-09-04 03:21:00.000
	5 | eeee | 2017-09-05 08:06:00.000
	```

### Create another table in SQL database to store the high watermark value
1. Run the following SQL command against your Azure SQL database to create a table named `watermarktable` to store the watermark value.  
    
    ```sql
    create table watermarktable
    (
    
    TableName varchar(255),
    WatermarkValue datetime,
    );
    ```
3. Set the default **value** of high watermark with the table name of source data store.  (In this tutorial, the table name is: **data_source_table**)

    ```sql
    INSERT INTO watermarktable
    VALUES ('data_source_table','1/1/2010 12:00:00 AM')    
    ```
4. Review the data in table: `watermarktable`.
    
    ```sql
    Select * from watermarktable
    ```
    Output: 

    ```
    TableName  | WatermarkValue
    ----------  | --------------
    data_source_table | 2010-01-01 00:00:00.000
    ```

### Create a stored procedure in Azure SQL database 

Run the following command to create a stored procedure in your Azure SQL database.

```sql
CREATE PROCEDURE sp_write_watermark @LastModifiedtime datetime, @TableName varchar(50)
AS

BEGIN
    
	UPDATE watermarktable
	SET [WatermarkValue] = @LastModifiedtime 
WHERE [TableName] = @TableName
	
END
```

## Create a data factory

1. Launch **PowerShell**. Keep Azure PowerShell open until the end of this tutorial. If you close and reopen, you need to run the commands again.

    Run the following command, and enter the user name and password that you use to sign in to the Azure portal:
        
    ```powershell
    Login-AzureRmAccount
    ```        
    Run the following command to view all the subscriptions for this account:

    ```powershell
    Get-AzureRmSubscription
    ```
    Run the following command to select the subscription that you want to work with. Replace **SubscriptionId** with the ID of your Azure subscription:

    ```powershell
    Select-AzureRmSubscription -SubscriptionId "<SubscriptionId>"   	
    ```
2. Run the **Set-AzureRmDataFactoryV2** cmdlet to create a data factory. Replace place-holders with your own values before executing the command.

    ```powershell
    Set-AzureRmDataFactoryV2 -ResourceGroupName "<your resource group to create the factory>" -Location "East US" -Name "<specify the name of data factory to create. It must be globally unique.>" 
    ```

    Note the following points:

    * The name of the Azure data factory must be globally unique. If you receive the following error, change the name and try again.

        ```
        The specified Data Factory name '<data factory name>' is already in use. Data Factory names must be globally unique.
        ```

    * To create Data Factory instances, you must be a contributor or administrator of the Azure subscription.
    * Currently, Data Factory V2 allows you to create data factory only in the East US region. The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other regions.


## Create linked services
You create linked services in a data factory to link your data stores and compute services to the data factory. In this section, you create linked services to your Azure Storage account and Azure SQL database. 

### Create Azure Storage linked service.
1. Create a JSON file named **AzureStorageLinkedService.json** in **C:\ADF** folder with the following content: (Create the folder ADF if it does not already exist.). Replace `<accountName>`,  `<accountKey>` with name and key of your Azure storage account before saving the file.

    ```json
    {
        "name": "AzureStorageLinkedService",
        "properties": {
            "type": "AzureStorage",
            "typeProperties": {
                "connectionString": {
                    "value": "DefaultEndpointsProtocol=https;AccountName=<accountName>;AccountKey=<accountKey>",
                    "type": "SecureString"
                }
            }
        }
    }
    ```
2. In **Azure PowerShell**, switch to the **ADF** folder.
3. Run the **Set-AzureRmDataFactoryV2LinkedService** cmdlet to create the linked service: **AzureStorageLinkedService**. In the following example, you pass values for the **ResourceGroupName** and **DataFactoryName** parameters. 

    ```powershell
    Set-AzureRmDataFactoryV2LinkedService -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -Name "AzureStorageLinkedService" -File ".\AzureStorageLinkedService.json"
    ```

    Here is the sample output:

    ```json
    LinkedServiceName : AzureStorageLinkedService
    ResourceGroupName : <resourceGroupName>
    DataFactoryName   : <dataFactoryName>
    Properties        : Microsoft.Azure.Management.DataFactory.Models.AzureStorageLinkedService
    ```

### Create Azure SQL Database linked service.
1. Create a JSON file named **AzureSQLDatabaseLinkedService.json** in **C:\ADF** folder with the following content: (Create the folder ADF if it does not already exist.). Replace **&lt;server&gt; and &lt;user id&gt;, and &lt;password&gt;** name of your Azure SQL server, user ID, and password before saving the file. 

    ```json
    {
    	"name": "AzureSQLDatabaseLinkedService",
    	"properties": {
    		"type": "AzureSqlDatabase",
    		"typeProperties": {
    			"connectionString": {
    				"value": "Server = tcp:<server>.database.windows.net,1433;Initial Catalog=<database name>; Persist Security Info=False; User ID=<user name> ; Password=<password>; MultipleActiveResultSets = False; Encrypt = True; TrustServerCertificate = False; Connection Timeout = 30;",
    				"type": "SecureString"
    			}
    		}
    	}
    }
    ```
2. In **Azure PowerShell**, switch to the **ADF** folder.
3. Run the **Set-AzureRmDataFactoryV2LinkedService** cmdlet to create the linked service: **AzureSQLDatabaseLinkedService**. 

    ```powershell
    Set-AzureRmDataFactoryV2LinkedService -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -Name "AzureSQLDatabaseLinkedService" -File ".\AzureSQLDatabaseLinkedService.json"
    ```

    Here is the sample output:

    ```json
    LinkedServiceName : AzureSQLDatabaseLinkedService
    ResourceGroupName : ADF
    DataFactoryName   : incrementalloadingADF
    Properties        : Microsoft.Azure.Management.DataFactory.Models.AzureSqlDatabaseLinkedService
    ProvisioningState :
    ```

## Create datasets
In this step, you create datasets to represent source and sink data. 

### Create a source dataset

1. Create a JSON file named SourceDataset.json in the same folder with the following content: 

    ```json
    {
    	"name": "SourceDataset",
    	"properties": {
    		"type": "AzureSqlTable",
    		"typeProperties": {
    			"tableName": "data_source_table"
    		},
    		"linkedServiceName": {
    			"referenceName": "AzureSQLDatabaseLinkedService",
    			"type": "LinkedServiceReference"
    		}
    	}
    }
   
    ```
    In this tutorial, we use the table name: **data_source_table**. Replace it if you are using a table with a different name. 
2.  Run the Set-AzureRmDataFactoryV2Dataset cmdlet to create the dataset: SourceDataset
    
    ```powershell
    Set-AzureRmDataFactoryV2Dataset -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -Name "SourceDataset" -File ".\SourceDataset.json"
    ```

    Here is the sample output of the cmdlet:
    
    ```json
    DatasetName       : SourceDataset
    ResourceGroupName : ADF
    DataFactoryName   : incrementalloadingADF
    Structure         :
    Properties        : Microsoft.Azure.Management.DataFactory.Models.AzureSqlTableDataset
    ```

### Create a sink dataset

1. Create a JSON file named SinkDataset.json in the same folder with the following content: 

    ```json
    {
    	"name": "SinkDataset",
    	"properties": {
    		"type": "AzureBlob",
    		"typeProperties": {
    			"folderPath": "adftutorial/incrementalcopy",
    			"fileName": "@CONCAT('Incremental-', pipeline().RunId, '.txt')", 
    			"format": {
    				"type": "TextFormat"
    			}
    		},
    		"linkedServiceName": {
    			"referenceName": "AzureStorageLinkedService",
    			"type": "LinkedServiceReference"
    		}
    	}
    }   
    ```

   	> [!IMPORTANT]
	> This snippet assumes that you have a blob container named **adftutorial** in your Azure Blob Storage. Create the container if it does not exist (or) set it to the name of an existing one. The output folder `incrementalcopy` is automatically created if it does not exist in the container. In this tutorial, the file name is dynamically generated by using the expression: `@CONCAT('Incremental-', pipeline().RunId, '.txt')`.
2.  Run the Set-AzureRmDataFactoryV2Dataset cmdlet to create the dataset: SinkDataset
    
    ```powershell
    Set-AzureRmDataFactoryV2Dataset -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -Name "SinkDataset" -File ".\SinkDataset.json"
    ```

    Here is the sample output of the cmdlet:
    
    ```json
    DatasetName       : SinkDataset
    ResourceGroupName : ADF
    DataFactoryName   : incrementalloadingADF
    Structure         :
    Properties        : Microsoft.Azure.Management.DataFactory.Models.AzureBlobDataset    
    ```

## Create a dataset for watermark
In this step, you create a dataset for storing a high watermark value. 

1. Create a JSON file named WatermarkDataset.json in the same folder with the following content: 

    ```json
    {
        "name": " WatermarkDataset ",
        "properties": {
            "type": "AzureSqlTable",
            "typeProperties": {
                "tableName": "watermarktable"
            },
            "linkedServiceName": {
                "referenceName": "AzureSQLDatabaseLinkedService",
                "type": "LinkedServiceReference"
            }
        }
    }    
    ```
2.  Run the Set-AzureRmDataFactoryV2Dataset cmdlet to create the dataset: WatermarkDataset
    
    ```powershell
    Set-AzureRmDataFactoryV2Dataset -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -Name "WatermarkDataset" -File ".\WatermarkDataset.json"
    ```

    Here is the sample output of the cmdlet:
    
    ```json
    DatasetName       : WatermarkDataset
    ResourceGroupName : ADF
    DataFactoryName   : incrementalloadingADF
    Structure         :
    Properties        : Microsoft.Azure.Management.DataFactory.Models.AzureSqlTableDataset    
    ```

## Create a pipeline
In this tutorial, you create a pipeline with two lookup activities, one copy activities and one stored procedure activity chained in one pipeline. 


1. Create a JSON file: IncrementalCopyPipeline.json in same folder with the following content. 

    ```json
    {
    	"name": "IncrementalCopyPipeline",
        "properties": {
    		"activities": [
    			{
    				"name": "LookupOldWaterMarkActivity",
    				"type": "Lookup",
    				"typeProperties": {
    					"source": {
    					"type": "SqlSource",
    					"sqlReaderQuery": "select * from watermarktable"
    					},
    
    					"dataset": {
    					"referenceName": "WatermarkDataset",
    					"type": "DatasetReference"
    					}
    				}
    			},
    			{
    				"name": "LookupNewWaterMarkActivity",
    				"type": "Lookup",
    				"typeProperties": {
    					"source": {
    						"type": "SqlSource",
    						"sqlReaderQuery": "select MAX(LastModifytime) as NewWatermarkvalue from data_source_table"
    					},
    
    					"dataset": {
    					"referenceName": "SourceDataset",
    					"type": "DatasetReference"
    					}
    				}
    			},
    			
    			{
    				"name": "IncrementalCopyActivity",
    				"type": "Copy",
    				"typeProperties": {
    					"source": {
    						"type": "SqlSource",
    						"sqlReaderQuery": "select * from data_source_table where LastModifytime > '@{activity('LookupOldWaterMarkActivity').output.firstRow.WatermarkValue}' and LastModifytime <= '@{activity('LookupNewWaterMarkActivity').output.firstRow.NewWatermarkvalue}'"
    					},
    					"sink": {
    						"type": "BlobSink"
    					}
    				},
    				"dependsOn": [
    					{
    						"activity": "LookupNewWaterMarkActivity",
    						"dependencyConditions": [
    							"Succeeded"
    						]
    					},
    					{
    						"activity": "LookupOldWaterMarkActivity",
    						"dependencyConditions": [
    							"Succeeded"
    						]
    					}
    				],
    
    				"inputs": [
    					{
    						"referenceName": "SourceDataset",
    						"type": "DatasetReference"
    					}
    				],
    				"outputs": [
    					{
    						"referenceName": "SinkDataset",
    						"type": "DatasetReference"
    					}
    				]
    			},
    
    			{
    				"name": "StoredProceduretoWriteWatermarkActivity",
    				"type": "SqlServerStoredProcedure",
    				"typeProperties": {
    
    					"storedProcedureName": "sp_write_watermark",
    					"storedProcedureParameters": {
    						"LastModifiedtime": {"value": "@{activity('LookupNewWaterMarkActivity').output.firstRow.NewWatermarkvalue}", "type": "datetime" },
    						"TableName":  { "value":"@{activity('LookupOldWaterMarkActivity').output.firstRow.TableName}", "type":"String"}
    					}
    				},
    
    				"linkedServiceName": {
    					"referenceName": "AzureSQLDatabaseLinkedService",
    					"type": "LinkedServiceReference"
    				},
    
    				"dependsOn": [
    					{
    						"activity": "IncrementalCopyActivity",
    						"dependencyConditions": [
    							"Succeeded"
    						]
    					}
    				]
    			}
    		]
    		
    	}
    }
    ```
	

2. Run the Set-AzureRmDataFactoryV2Pipeline cmdlet to create the pipeline: IncrementalCopyPipeline.
    
   ```powershell
   Set-AzureRmDataFactoryV2Pipeline -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -Name "IncrementalCopyPipeline" -File ".\IncrementalCopyPipeline.json"
   ``` 

   Here is the sample output: 

   ```json
    PipelineName      : IncrementalCopyPipeline
    ResourceGroupName : ADF
    DataFactoryName   : incrementalloadingADF
    Activities        : {LookupOldWaterMarkActivity, LookupNewWaterMarkActivity, IncrementalCopyActivity, StoredProceduretoWriteWatermarkActivity}
    Parameters        :
   ```
 
## Run the pipeline

1. Run the pipeline: **IncrementalCopyPipeline** by using **Invoke-AzureRmDataFactoryV2Pipeline** cmdlet. Replace place-holders with your own resource group and data factory name.

	```powershell
	$RunId = Invoke-AzureRmDataFactoryV2Pipeline -PipelineName "IncrementalCopyPipeline" -ResourceGroup "<your resource group>" -dataFactoryName "<your data factory name>"
	``` 
2. Check the status of pipeline by running the Get-AzureRmDataFactoryV2ActivityRun cmdlet until you see all the activities running successfully. Replace place-holders with your own appropriate time for parameter RunStartedAfter and RunStartedBefore.  In this tutorial, we use -RunStartedAfter "2017/09/14" -RunStartedBefore "2017/09/15"

	```powershell
	Get-AzureRmDataFactoryV2ActivityRun -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -PipelineRunId $RunId -RunStartedAfter "<start time>" -RunStartedBefore "<end time>"
	```

	Here is the sample output:
 
	```json
	ResourceGroupName : ADF
	DataFactoryName   : incrementalloadingADF
	ActivityName      : LookupNewWaterMarkActivity
	PipelineRunId     : d4bf3ce2-5d60-43f3-9318-923155f61037
	PipelineName      : IncrementalCopyPipeline
	Input             : {source, dataset}
	Output            : {NewWatermarkvalue}
	LinkedServiceName :
	ActivityRunStart  : 9/14/2017 7:42:42 AM
	ActivityRunEnd    : 9/14/2017 7:42:50 AM
	DurationInMs      : 7777
	Status            : Succeeded
	Error             : {errorCode, message, failureType, target}
	
	ResourceGroupName : ADF
	DataFactoryName   : incrementalloadingADF
	ActivityName      : LookupOldWaterMarkActivity
	PipelineRunId     : d4bf3ce2-5d60-43f3-9318-923155f61037
	PipelineName      : IncrementalCopyPipeline
	Input             : {source, dataset}
	Output            : {TableName, WatermarkValue}
	LinkedServiceName :
	ActivityRunStart  : 9/14/2017 7:42:42 AM
	ActivityRunEnd    : 9/14/2017 7:43:07 AM
	DurationInMs      : 25437
	Status            : Succeeded
	Error             : {errorCode, message, failureType, target}
	
	ResourceGroupName : ADF
	DataFactoryName   : incrementalloadingADF
	ActivityName      : IncrementalCopyActivity
	PipelineRunId     : d4bf3ce2-5d60-43f3-9318-923155f61037
	PipelineName      : IncrementalCopyPipeline
	Input             : {source, sink}
	Output            : {dataRead, dataWritten, rowsCopied, copyDuration...}
	LinkedServiceName :
	ActivityRunStart  : 9/14/2017 7:43:10 AM
	ActivityRunEnd    : 9/14/2017 7:43:29 AM
	DurationInMs      : 19769
	Status            : Succeeded
	Error             : {errorCode, message, failureType, target}
	
	ResourceGroupName : ADF
	DataFactoryName   : incrementalloadingADF
	ActivityName      : StoredProceduretoWriteWatermarkActivity
	PipelineRunId     : d4bf3ce2-5d60-43f3-9318-923155f61037
	PipelineName      : IncrementalCopyPipeline
	Input             : {storedProcedureName, storedProcedureParameters}
	Output            : {}
	LinkedServiceName :
	ActivityRunStart  : 9/14/2017 7:43:32 AM
	ActivityRunEnd    : 9/14/2017 7:43:47 AM
	DurationInMs      : 14467
	Status            : Succeeded
	Error             : {errorCode, message, failureType, target}

	```

## Review the results

1. In the Azure blob storage (sink store), you should see that the data have been copied to the file defined in the SinkDataset.  In the current tutorial, the file name is `Incremental- d4bf3ce2-5d60-43f3-9318-923155f61037.txt`.  Open the file, you can see records in the file that are same as the data in Azure SQL database.

	```
	1,aaaa,2017-09-01 00:56:00.0000000
	2,bbbb,2017-09-02 05:23:00.0000000
	3,cccc,2017-09-03 02:36:00.0000000
	4,dddd,2017-09-04 03:21:00.0000000
	5,eeee,2017-09-05 08:06:00.0000000
	```	
2. Check the latest value from `watermarktable`, you see the watermark value has been updated.

	```sql
	Select * from watermarktable
	```
	
	Here is the sample output:
 
	TableName | WatermarkValue
	--------- | --------------
	data_source_table	2017-09-05	8:06:00.000

### Insert data into data source store to verify delta data loading

1. Insert new data into Azure SQL database (data source store):

	```sql
	INSERT INTO data_source_table
	VALUES (6, 'newdata','9/6/2017 2:23:00 AM')
	
	INSERT INTO data_source_table
	VALUES (7, 'newdata','9/7/2017 9:01:00 AM')
	```	

	The updated data in the Azure SQL database is as following:

    ```
	PersonID | Name | LastModifytime
	-------- | ---- | --------------
	1 | aaaa | 2017-09-01 00:56:00.000
	2 | bbbb | 2017-09-02 05:23:00.000
	3 | cccc | 2017-09-03 02:36:00.000
	4 | dddd | 2017-09-04 03:21:00.000
	5 | eeee | 2017-09-05 08:06:00.000
	6 | newdata | 2017-09-06 02:23:00.000
	7 | newdata | 2017-09-07 09:01:00.000
    ```
2. Run the pipeline: **IncrementalCopyPipeline** again using the **Invoke-AzureRmDataFactoryV2Pipeline** cmdlet. Replace place-holders with your own resource group and data factory name.

	```powershell
	$RunId = Invoke-AzureRmDataFactoryV2Pipeline -PipelineName "IncrementalCopyPipeline" -ResourceGroup "<your resource group>" -dataFactoryName "<your data factory name>"
	```
3. Check the status of pipeline by running **Get-AzureRmDataFactoryV2ActivityRun** cmdlet until you see all the activities running successfully. Replace place-holders with your own appropriate time for parameter RunStartedAfter and RunStartedBefore.  In this tutorial, we use -RunStartedAfter "2017/09/14" -RunStartedBefore "2017/09/15"

	```powershell
	Get-AzureRmDataFactoryV2ActivityRun -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -PipelineRunId $RunId -RunStartedAfter "<start time>" -RunStartedBefore "<end time>"
	```

	Here is the sample output:
 
	```json
	ResourceGroupName : ADF
	DataFactoryName   : incrementalloadingADF
	ActivityName      : LookupNewWaterMarkActivity
	PipelineRunId     : 2fc90ab8-d42c-4583-aa64-755dba9925d7
	PipelineName      : IncrementalCopyPipeline
	Input             : {source, dataset}
	Output            : {NewWatermarkvalue}
	LinkedServiceName :
	ActivityRunStart  : 9/14/2017 8:52:26 AM
	ActivityRunEnd    : 9/14/2017 8:52:58 AM
	DurationInMs      : 31758
	Status            : Succeeded
	Error             : {errorCode, message, failureType, target}
	
	ResourceGroupName : ADF
	DataFactoryName   : incrementalloadingADF
	ActivityName      : LookupOldWaterMarkActivity
	PipelineRunId     : 2fc90ab8-d42c-4583-aa64-755dba9925d7
	PipelineName      : IncrementalCopyPipeline
	Input             : {source, dataset}
	Output            : {TableName, WatermarkValue}
	LinkedServiceName :
	ActivityRunStart  : 9/14/2017 8:52:26 AM
	ActivityRunEnd    : 9/14/2017 8:52:52 AM
	DurationInMs      : 25497
	Status            : Succeeded
	Error             : {errorCode, message, failureType, target}
	
	ResourceGroupName : ADF
	DataFactoryName   : incrementalloadingADF
	ActivityName      : IncrementalCopyActivity
	PipelineRunId     : 2fc90ab8-d42c-4583-aa64-755dba9925d7
	PipelineName      : IncrementalCopyPipeline
	Input             : {source, sink}
	Output            : {dataRead, dataWritten, rowsCopied, copyDuration...}
	LinkedServiceName :
	ActivityRunStart  : 9/14/2017 8:53:00 AM
	ActivityRunEnd    : 9/14/2017 8:53:20 AM
	DurationInMs      : 20194
	Status            : Succeeded
	Error             : {errorCode, message, failureType, target}
	
	ResourceGroupName : ADF
	DataFactoryName   : incrementalloadingADF
	ActivityName      : StoredProceduretoWriteWatermarkActivity
	PipelineRunId     : 2fc90ab8-d42c-4583-aa64-755dba9925d7
	PipelineName      : IncrementalCopyPipeline
	Input             : {storedProcedureName, storedProcedureParameters}
	Output            : {}
	LinkedServiceName :
	ActivityRunStart  : 9/14/2017 8:53:23 AM
	ActivityRunEnd    : 9/14/2017 8:53:41 AM
	DurationInMs      : 18502
	Status            : Succeeded
	Error             : {errorCode, message, failureType, target}

	```
4.  In the Azure blob storage, you should see another file has been created in Azure blob storage. In this tutorial, the new file name is `Incremental-2fc90ab8-d42c-4583-aa64-755dba9925d7.txt`.  Open that file, you see 2 rows records in it:
5.  Check the latest value from `watermarktable`, you see the watermark value has been updated again

	```sql
	Select * from watermarktable
	```
	sample output: 
	
	TableName | WatermarkValue
	--------- | ---------------
	data_source_table | 2017-09-07 09:01:00.000

     
## Next steps
You performed the following steps in this tutorial: 

> [!div class="checklist"]
> * Define a **watermark** column and store it in Azure SQL Database.  
> * Create a data factory.
> * Create linked services for SQL Database and Blob Storage. 
> * Create source and sink datasets.
> * Create a pipeline.
> * Run the pipeline.
> * Monitor the pipeline run. 

Advance to the following tutorial to learn about transforming data by using a Spark cluster on Azure:

> [!div class="nextstepaction"]
>[Transform data using Spark cluster in cloud](tutorial-transform-data-spark-powershell.md)



