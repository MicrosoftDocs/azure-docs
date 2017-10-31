---
title: "PowerShell script: Incrementally load data by using Azure Data Factory | Microsoft Docs"
description: This PowerShell script shows how to use Azure Data Factory to copy data incrementally from an Azure SQL Database to an Azure Blob Storage.. 
services: data-factory
author: spelluru
manager: jhubbard
editor: ''

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/31/2017
ms.author: spelluru
---

# PowerShell script - Incrementally load data by using Azure Data Factory
This sample PowerShell script loads only new or updated records from a source data store to a sink data store after the initial full copy of data from the source to the sink.  

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

## Overview
Here are the important steps in this sample: 

1. **Select the watermark column**.
	Select one column in the source data store, which can be used to slice the new or updated records for every run. Normally, the data in this selected column (for example, last_modify_time or ID) keeps increasing when rows are created or updated. The maximum value in this column is used as a watermark.
2. **Prepare a data store to store the watermark value**.   
	In this sample, you store the watermark value in an Azure SQL database.
3. **Create a pipeline with the following workflow:** 
	
	The pipeline in this solution has the following activities:
  
	1. Two **lookup** activities. The first lookup activity retrieves the last watermark value. Use the second lookup activity to retrieve the new watermark value. These watermark values are passed to the copy activity. 
	2. A **copy activity** that copies rows from the source data store with the value of watermark column greater than the old watermark value and less than the new watermark value. Then, it copies the delta data from the source data store to a blob storage as a new file. 
	3. A **stored procedure activity** that updates the watermark value for the pipeline running next time. 

## Prerequisites
* **Azure SQL Database**. You use the database as the **source** data store. If you don't have an Azure SQL Database, see the [Create an Azure SQL database](../../sql-database/sql-database-get-started-portal.md) article for steps to create one.
* **Azure Storage account**. You use the blob storage as the **sink** data store. If you don't have an Azure storage account, see the [Create a storage account](../../storage/common/storage-create-storage-account.md#create-a-storage-account) article for steps to create one. Create a container named **adftutorial**. 

### Create a data source table in your Azure SQL database
1. Launch **SQL Server Management Studio**. In **Server Explorer**, right-click the database and choose the **New Query**.
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
	In this sample, you use **LastModifytime** as the **watermark** column.  The data in data source store is shown in the following table:

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
3. Set the default **value** of high watermark with the table name of source data store.  (In this sample, the table name is: **data_source_table**)

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

## Sample script

> [!IMPORTANT]
> This script creates JSON files that define Data Factory entities (linked service, dataset, and pipeline) on your hard drive in the c:\ folder.

[!code-powershell[main](../../../powershell_scripts/data-factory/incremental-copy-from-azure-sql-to-blob/incremental-copy-from-azure-sql-to-blob.ps1 "Incremental copy from Azure SQL Database to Azure Blob Storage")]

## Review the results
1. In the Azure blob storage (sink store), you should see that the data have been copied to the file defined in the SinkDataset.  In the current sample, the file name is `Incremental- d4bf3ce2-5d60-43f3-9318-923155f61037.txt`.  Open the file, you can see records in the file that are same as the data in Azure SQL database.

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
3. Check the status of pipeline by running **Get-AzureRmDataFactoryV2ActivityRun** cmdlet until you see all the activities running successfully. Replace place-holders with your own appropriate time for parameter RunStartedAfter and RunStartedBefore.  In this sample, we use -RunStartedAfter "2017/09/14" -RunStartedBefore "2017/09/15"

	```powershell
	Get-AzureRmDataFactoryV2ActivityRun -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -PipelineRunId $RunId -RunStartedAfter "<start time>" -RunStartedBefore "<end time>"
	```	
4.  In the Azure blob storage, you should see another file has been created in Azure blob storage. In this sample, the new file name is `Incremental-2fc90ab8-d42c-4583-aa64-755dba9925d7.txt`.  Open that file, you see 2 rows records in it:
5.  Check the latest value from `watermarktable`, you see the watermark value has been updated again

	```sql
	Select * from watermarktable
	```
	sample output: 
	
	TableName | WatermarkValue
	--------- | ---------------
	data_source_table | 2017-09-07 09:01:00.000

## Clean up deployment

After you run the sample script, you can use the following command to remove the resource group and all resources associated with it:

```powershell
Remove-AzureRmResourceGroup -ResourceGroupName $resourceGroupName
```
To remove the data factory from the resource group, run the following command: 

```powershell
Remove-AzureRmDataFactoryV2 -Name $dataFactoryName -ResourceGroupName $resourceGroupName
```

## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) | Creates a resource group in which all resources are stored. |
| [Set-AzureRmDataFactoryV2](/powershell/module/azurerm.datafactoryv2/set-azurermdatafactoryv2) | Create a data factory. |
| [Set-AzureRmDataFactoryV2LinkedService](/powershell/module/azurerm.datafactoryv2/Set-azurermdatafactoryv2linkedservice) | Creates a linked service in the data factory. A linked service links a data store or compute to a data factory. |
| [Set-AzureRmDataFactoryV2Dataset](/powershell/module/azurerm.datafactoryv2/Set-azurermdatafactoryv2dataset) | Creates a dataset in the data factory. A dataset represents input/output for an activity in a pipeline. | 
| [Set-AzureRmDataFactoryV2Pipeline](/powershell/module/azurerm.datafactoryv2/Set-azurermdatafactorv2ypipeline) | Creates a pipeline in the data factory. A pipeline contains one or more activities that performs a certain operation. In this pipeline, a copy activity copies data from one location to another location in an Azure Blob Storage. |
| [Invoke-AzureRmDataFactoryV2Pipeline](/powershell/module/azurerm.datafactoryv2/Invoke-azurermdatafactoryv2pipelinerun) | Creates a run for the pipeline. In other words, runs the pipeline. |
| [Get-AzureRmDataFactoryV2ActivityRun](/powershell/module/azurerm.datafactoryv2/get-azurermdatafactoryv2activityrun) | Gets details about the run of the activity (activity run) in the pipeline. 
| [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Data Factory PowerShell script samples can be found in the [Azure Data Factory PowerShell scripts](../samples-powershell.md).