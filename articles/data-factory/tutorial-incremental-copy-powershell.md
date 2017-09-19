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
During the data integration journey, one of the widely used scenarios is to incrementally load data periodically to refresh updated analysis result after initial data loads and analysis. In this tutorial, you focus on loading only new or updated records from the data sources into data sinks. It runs more efficiently when compared to full loads, particularly for large data sets.    

You can use Data Factory to create high-watermark solutions to achieve incremental data loading by using Lookup, Copy, and Stored Procedure activities in a pipeline.  

You perform the following steps in this tutorial:

> [!div class="checklist"]
> * Define a **watermark** column and store it in Azure SQL Database.  
> * Create a data factory.
> * Create linked services for SQL Database and Blob Storage. 
> * Create source and sink datasets.
> * Create a pipeline.
> * Run the pipeline.
> * Monitor the pipeline run. 

## Overview
The high-level solution diagram is: 

![Incrementally load data](media\tutorial-Incrementally-load-data-from-azure-sql-to-blob\incrementally-load.png)

The concrete working flow:

1. Define a watermark column in the source data store that can be used to slice the new or updated records for every run. For example, LastModifiedDate Column or ID Column.  Normally, the data in this selected column keeps increasing or decreasing when rows created or updated.  
2. Find a place to store the watermark value. In this tutorial, you create a table in an Azure SQL database to store that value.
3. Create a stored procedure.  This stored procedure keeps the value of watermark being updated every time after the delta data loading. 
5. Create two lookup activities to get watermark value that the copy activity can query against. The first Lookup Activity is used to get the last watermark value.The second Lookup Activity is used to get the new watermark value. 
6. Create a copy activity to copy rows in which the data is greater than the old watermark value and less than the new watermark value.
7. Use a stored procedure activity to update the watermark for next run.
8. Create a pipeline with all the activities chained and run periodically. 


## Prerequisites

* **Azure subscription**. If you don't have a subscription, you can create a [free trial](http://azure.microsoft.com/pricing/free-trial/) account.
* **Azure SQL Database**. You use the database as the **source** data store. If you don't have an Azure SQL Database, see the [Create an Azure SQL database](../sql-database/sql-database-get-started-portal.md) article for steps to create one.
* **Azure Storage account**. You use the blob storage as the **sink** data store. If you don't have an Azure storage account, see the [Create a storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account) article for steps to create one. Create a container named **adftutorial**. 
* **Azure PowerShell**. Follow the instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps).

### Define a watermark column
Defining the watermark column in data source store is very critical for incremental data loading. You normally use the LastModifytime, CreationTime, ID, etc. to slice the new or updated records. In this tutorial, you use LastModifytime as the watermark column.  The data in data source store is shown in the following table:

```
PersonID | Name | LastModifytime
-------- | ---- | --------------
1 | aaaa | 2017-09-01 00:56:00.000
2 | bbbb | 2017-09-02 05:23:00.000
3 | cccc | 2017-09-03 02:36:00.000
4 | dddd | 2017-09-04 03:21:00.000
5 | eeee | 2017-09-05 08:06:00.000
```

### Create a table in SQL database to store the high watermark value
1. Open **SQL Server Management Studio**, in **Server Explorer**, right-click the **database** of data source store and choose the **New Query**.
2. Run the following SQL command against your Azure SQL database to create a table named `watermarktable` to store the watermark value.  
    
    ```sql
    create table watermarktable
    (
    
    TableName varchar(255),
    WatermarkValue datetime,
    );
    ```
3. Set the default **value** of high watermark with the table name of source data store.  (In this tutorial, the table name is: **datasource**)

    ```sql
    INSERT INTO watermarktable
    VALUES ('datasource','1/1/2010 12:00:00 AM')    
    ```
4. Review the data in table: `watermarktable`.
    
    ```sql
    Select * from watermarktable
    ```
    Output: 

    ```
    TableName  | WatermarkValue
    ----------  | --------------
    datasource | 2010-01-01 00:00:00.000
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
1. Create a JSON file named **AzureStorageLinkedService.json** in **C:\ADF** folder with the following content: (Create the folder ADF if it does not already exist.)

	> [!IMPORTANT]
	> Replace &lt;accountName&gt; and &lt;accountKey&gt; with name and key of your Azure storage account before saving the file.

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
    			"tableName": "datasource"
    		},
    		"linkedServiceName": {
    			"referenceName": "AzureSQLDatabaseLinkedService",
    			"type": "LinkedServiceReference"
    		}
    	}
    }
   
    ```
    In this tutorial, we use the table name: **datasource**. Replace it if you are using a table with a different name. 
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
    			"fileName": "<your file name>.txt",
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
    				"name": "LookupWaterMarkActivity",
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
    				"name": "LookupMaxValuefromSourceActivity",
    				"type": "Lookup",
    				"typeProperties": {
    					"source": {
    						"type": "SqlSource",
    						"sqlReaderQuery": "select MAX(LastModifytime) as NewWatermarkvalue from datasource"
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
    						"sqlReaderQuery": "select * from datasource where LastModifytime > '@{activity('LookupWaterMarkActivity').output.firstRow.WatermarkValue}' and LastModifytime <= '@{activity('LookupMaxValuefromSourceActivity').output.firstRow.NewWatermarkvalue}'"
    					},
    					"sink": {
    						"type": "BlobSink"
    					}
    				},
    				"dependsOn": [
    					{
    						"activity": "LookupMaxValuefromSourceActivity",
    						"dependencyConditions": [
    							"Succeeded"
    						]
    					},
    					{
    						"activity": "LookupWaterMarkActivity",
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
    						"LastModifiedtime": {"value": "@{activity('LookupMaxValuefromSourceActivity').output.firstRow.NewWatermarkvalue}", "type": "datetime" },
    						"TableName":  { "value":"@{activity('LookupWaterMarkActivity').output.firstRow.TableName}", "type":"String"}
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
    		],
    		
    	}
    }
    ```json

	If you are using a source table with a name different from the one used in the tutorial (**datasoruce**), replace **datasource** in the sqlReaderQuery with the name of your source table. 
	

2. Run the Set-AzureRmDataFactoryV2Pipeline cmdlet to create the pipeline: IncrementalCopyPipeline.
    
   ```powershell
   Set-AzureRmDataFactoryV2Pipeline -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -Name "IncrementalCopyPipeline" -File ".\IncrementalCopyPipeline.json"
   ``` 

   Here is the sample output: 

   ```json
   PipelineName      : IncrementalCopyPipeline
   ResourceGroupName : ADF
   DataFactoryName   : incrementalloadingADF
   Properties        :
   ProvisioningState :
   ```
 
## Run the pipeline

1. Run the pipeline: **IncrementalCopyPipeline** by using **Invoke-AzureRmDataFactoryV2PipelineRun** cmdlet. Replace place-holders with your own resource group and data factory name.

	```powershell
	$RunId = Invoke-AzureRmDataFactoryV2PipelineRun -PipelineName "IncrementalCopyPipeline" -ResourceGroup "<your resource group>" -dataFactoryName "<your data factory name>"
	``` 
2. Check the status of pipeline by running the Get-AzureRmDataFactoryV2ActivityRun cmdlet until you see all the activities running successfully. Replace place-holders with your own appropriate time for parameter RunStartedAfter and RunStartedBefore.  In this tutorial, we use -RunStartedAfter "2017/09/14" -RunStartedBefore "2017/09/15"

	```powershell
	Get-AzureRmDataFactoryV2ActivityRun -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -PipelineName "IncrementalCopyPipeline" -PipelineRunId $RunId -RunStartedAfter "<start time>" -RunStartedBefore "<end time>"
	```

	Here is the sample output:
 
	```json
	ResourceGroupName : ADF
	DataFactoryName   : incrementalloadingADF
	ActivityName      : LookupMaxValuefromSourceActivity
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
	ActivityName      : LookupWaterMarkActivity
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
	datasource	2017-09-05	8:06:00.000

### Insert data into data source store to verify delta data loading

1. Insert new data into Azure SQL database (data source store):

	```sql
	INSERT INTO datasource
	VALUES (6, 'newdata','9/6/2017 2:23:00 AM')
	
	INSERT INTO datasource
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
2. Run the pipeline: **IncrementalCopyPipeline** again using the **Invoke-AzureRmDataFactoryV2PipelineRun** cmdlet. Replace place-holders with your own resource group and data factory name.

	```powershell
	$RunId = Invoke-AzureRmDataFactoryV2PipelineRun -PipelineName "IncrementalCopyPipeline" -ResourceGroup "<your resource group>" -dataFactoryName "<your data factory name>"
	```
3. Check the status of pipeline by running **Get-AzureRmDataFactoryV2ActivityRun** cmdlet until you see all the activities running successfully. Replace place-holders with your own appropriate time for parameter RunStartedAfter and RunStartedBefore.  In this tutorial, we use -RunStartedAfter "2017/09/14" -RunStartedBefore "2017/09/15"

	```powershell
	Get-AzureRmDataFactoryV2ActivityRun -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -PipelineName "IncrementalCopyPipeline" -PipelineRunId $RunId -RunStartedAfter "<start time>" -RunStartedBefore "<end time>"
	```

	Here is the sample output:
 
	```json
	ResourceGroupName : ADF
	DataFactoryName   : incrementalloadingADF
	ActivityName      : LookupMaxValuefromSourceActivity
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
	ActivityName      : LookupWaterMarkActivity
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
	datasource | 2017-09-07 09:01:00.000

     
## Next steps
See list of data stores that are supported by copy activity as sources and sinks in the [Copy activity overview](copy-activity-overview.md) article. 





