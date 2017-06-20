---
title: 'Tutorial: Create a pipeline to move data by using Azure PowerShell | Microsoft Docs'
description: In this tutorial, you create an Azure Data Factory pipeline with Copy Activity by using Azure PowerShell.
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: monicar

ms.assetid: 71087349-9365-4e95-9847-170658216ed8
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/11/2017
ms.author: spelluru

---
# Tutorial: Create a Data Factory pipeline that moves data by using Azure PowerShell
> [!div class="op_single_selector"]
> * [Overview and prerequisites](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
> * [Copy Wizard](data-factory-copy-data-wizard-tutorial.md)
> * [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md)
> * [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md)
> * [PowerShell](data-factory-copy-activity-tutorial-using-powershell.md)
> * [Azure Resource Manager template](data-factory-copy-activity-tutorial-using-azure-resource-manager-template.md)
> * [REST API](data-factory-copy-activity-tutorial-using-rest-api.md)
> * [.NET API](data-factory-copy-activity-tutorial-using-dotnet-api.md)
>
>

In this tutorial, you create and monitor an instance of Azure Data Factory by using Azure PowerShell cmdlets. The pipeline in the data factory you create in this tutorial uses a copy activity to copy data from an Azure blob to an Azure SQL database.

The Copy Activity feature performs the data movement in Data Factory. The activity is powered by a globally available service that can copy data between various data stores in a secure, reliable, and scalable way. See [Data Movement Activities](data-factory-data-movement-activities.md) for details about Copy Activity.   

> [!NOTE]
> This article does not cover all the Data Factory cmdlets. See [Data Factory Cmdlet Reference](/powershell/module/azurerm.datafactories) for comprehensive documentation on these cmdlets.
>
> The data pipeline in this tutorial copies data from a source data store to a destination data store. It does not transform input data to produce output data. For a tutorial on how to transform data using Azure Data Factory, see [Tutorial: Build a pipeline to transform data using Hadoop cluster](data-factory-build-your-first-pipeline.md).

## Prerequisites
- Go through [Tutorial Overview and Pre-requisites](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) to get an overview of the tutorial and complete the **prerequisite** steps.
- Install Azure PowerShell. Follow the instructions in [How to install and configure Azure PowerShell](../powershell-install-configure.md).

## In this tutorial
The following table lists the steps you perform as part of the tutorial.

| Step | Description |
| --- | --- |
| [Create an Azure data factory](#create-data-factory) |In this step, you create an Azure data factory named **ADFTutorialDataFactoryPSH**. |
| [Create linked services](#create-linked-services) |In this step, you create two linked services: **StorageLinkedService** and **AzureSqlLinkedService**. The StorageLinkedService links an Azure Storage service and AzureSqlLinkedService links an Azure SQL database to the ADFTutorialDataFactoryPSH. |
| [Create input and output datasets](#create-datasets) |In this step, you define two datasets (EmpTableFromBlob and EmpSQLTable). These datasets are used as input and output tables for **Copy Activity** in the ADFTutorialPipeline that you create in the next step. |
| [Create and run a pipeline](#create-pipeline) |In this step, you create a pipeline named **ADFTutorialPipeline** in the data factory ADFTutorialDataFactoryPSH. The pipeline uses Copy Activity to copy data from an Azure blob to an output Azure database table. |
| [Monitor datasets and pipeline](#monitor-pipeline) |In this step, you monitor the datasets and the pipeline by using Azure PowerShell. |

## Create a data factory
In this step, you use Azure PowerShell to create an Azure data factory named **ADFTutorialDataFactoryPSH**.

1. Launch **PowerShell**. Keep Azure PowerShell open until the end of this tutorial. If you close and reopen, you need to run the commands again.

	Run the following command, and enter the user name and password that you use to sign in to the Azure portal:

	```PowerShell
	Login-AzureRmAccount
	```   
   
	Run the following command to view all the subscriptions for this account:

	```PowerShell
	Get-AzureRmSubscription
	```

	Run the following command to select the subscription that you want to work with. Replace **&lt;NameOfAzureSubscription**&gt; with the name of your Azure subscription:

	```PowerShell
	Get-AzureRmSubscription -SubscriptionName <NameOfAzureSubscription> | Set-AzureRmContext
	```
2. Create an Azure resource group named **ADFTutorialResourceGroup** by running the following command:

	```PowerShell
	New-AzureRmResourceGroup -Name ADFTutorialResourceGroup  -Location "West US"
	```
    
	Some of the steps in this tutorial assume that you use the resource group named **ADFTutorialResourceGroup**. If you use a different resource group, you need to use it in place of ADFTutorialResourceGroup in this tutorial.
3. Run the **New-AzureRmDataFactory** cmdlet to create a data factory named **ADFTutorialDataFactoryPSH**:  

	```PowerShell
	New-AzureRmDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name ADFTutorialDataFactoryPSH –Location "West US"
	```
Note the following points:

* The name of the Azure data factory must be globally unique. If you receive the following error, change the name (for example, yournameADFTutorialDataFactoryPSH). Use this name in place of ADFTutorialFactoryPSH while performing steps in this tutorial. See [Data Factory - Naming Rules](data-factory-naming-rules.md) for Data Factory artifacts.

	```
	Data factory name “ADFTutorialDataFactoryPSH” is not available
	```
* To create Data Factory instances, you need to be a contributor or administrator of the Azure subscription.
* The name of the data factory may be registered as a DNS name in the future, and hence become publicly visible.
* You may receive the following error: "**This subscription is not registered to use namespace Microsoft.DataFactory.**" Do one of the following, and try publishing again:

  * In Azure PowerShell, run the following command to register the Data Factory provider:

	```PowerShell
	Register-AzureRmResourceProvider -ProviderNamespace Microsoft.DataFactory
	```

	Run the following command to confirm that the Data Factory provider is registered:

	```PowerShell
	Get-AzureRmResourceProvider
	```
  * Sign in by using the Azure subscription to the [Azure portal](https://portal.azure.com). Go to a Data Factory blade, or create a data factory in the Azure portal. This action automatically registers the provider for you.

## Create linked services
Linked services link data stores or compute services to an Azure data factory. A data store can be an Azure Storage service, Azure SQL Database, or an on-premises SQL Server database that contains input data or stores output data for a Data Factory pipeline. A compute service is the service that processes input data and produces output data.

In this step, you create two linked services: **StorageLinkedService** and **AzureSqlLinkedService**. StorageLinkedService links an Azure storage account, and AzureSqlLinkedService links an Azure SQL database, to the data factory **ADFTutorialDataFactoryPSH**. You create a pipeline later in this tutorial that copies data from a blob container in StorageLinkedService to a SQL table in AzureSqlLinkedService.

### Create a linked service for an Azure storage account
1. Create a JSON file named **StorageLinkedService.json** in the **C:\ADFGetStartedPSH** folder, with the following content. (Create the folder ADFGetStartedPSH if it does not already exist.)

	```json
	{
		"name": "StorageLinkedService",
		"properties": {
			"type": "AzureStorage",
			"typeProperties": {
				"connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
			}
		}
     }
	```
   Replace **accountname** and **accountkey** with name and key of your Azure storage account.
2. In **Azure PowerShell**, switch to the **ADFGetStartedPSH** folder.
3. You can use the **New-AzureRmDataFactoryLinkedService** cmdlet to create a linked service. This cmdlet, and other Data Factory cmdlets you use in this tutorial, requires you to pass values for the **ResourceGroupName** and **DataFactoryName** parameters. Alternatively, you can use **Get-AzureRmDataFactory** to get a DataFactory object, and pass the object without typing ResourceGroupName and DataFactoryName each time you run a cmdlet. Run the following command to assign the output of the **Get-AzureRmDataFactory** cmdlet to a variable: **$df**:

	```PowerShell   
	$df=Get-AzureRmDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name ADFTutorialDataFactoryPSH
	```

4. Now, run the **New-AzureRmDataFactoryLinkedService** cmdlet to create the linked service: **StorageLinkedService**.

	```PowerShell
	New-AzureRmDataFactoryLinkedService $df -File .\StorageLinkedService.json
	```

	If you hadn't run the **Get-AzureRmDataFactory** cmdlet and assigned the output to **$df** variable, you would have to specify values for the ResourceGroupName and DataFactoryName parameters as follows.   

	```PowerShell
	New-AzureRmDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactoryPSH -File .\StorageLinkedService.json
	```

If you close Azure PowerShell in the middle of the tutorial, you have run the Get-AzureRmDataFactory cmdlet the next time you launch Azure PowerShell to complete the tutorial.

### Create a linked service for an Azure SQL database
1. Create a JSON file named AzureSqlLinkedService.json, with the following content:

	```json
	{
		"name": "AzureSqlLinkedService",
		"properties": {
			"type": "AzureSqlDatabase",
			"typeProperties": {
				"connectionString": "Server=tcp:<server>.database.windows.net,1433;Database=<databasename>;User ID=<user>@<server>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
			}
		}
     }
	```
   Replace **servername**, **databasename**, **username@servername**, and **password** with names of your Azure SQL server, database, user account, and password.
2. Run the following command to create a linked service:

	```PowerShell
	New-AzureRmDataFactoryLinkedService $df -File .\AzureSqlLinkedService.json
	```

   Confirm that the **Allow access to Azure services** setting is turned on for your SQL database server. To verify and turn it on, do the following steps:

   1. Click the **BROWSE** hub on the left, and click **SQL servers**.
   2. Select your server, and click **SETTINGS** on the **SQL SERVER** blade.
   3. In the **SETTINGS** blade, click **Firewall**.
   4. In the **Firewall settings** blade, click **ON** for **Allow access to Azure services**.
   5. Click the **ACTIVE** hub on the left to switch to the **Data Factory** blade you were on.

## Create datasets
In the previous step, you created services to link an Azure storage account and Azure SQL database to the data factory. In this step, you create datasets that represent the input and output data for Copy Activity in the pipeline you create in the next step.

A table is a rectangular dataset. Currently, it is the only type of dataset that is supported. The input table in this tutorial refers to a blob container in Azure Storage. The output table refers to a SQL table in the Azure SQL database.  

### Prepare Azure Blob storage and Azure SQL Database for the tutorial
Skip this step if you have gone through the tutorial from [Copy data from Blob storage to SQL Database](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).

Perform the following steps to prepare the Blob storage and SQL Database for this tutorial.

1. Create a blob container, named **adftutorial**, in Blob storage that **StorageLinkedService** points to.
2. Create and upload a text file, named **emp.txt**, as a blob to the **adftutorial** container.
3. Create a table, named **emp**, in the SQL database that **AzureSqlLinkedService** points to.

4. Launch Notepad. Copy the following text and save it as **emp.txt** to **C:\ADFGetStartedPSH** folder on your hard drive.

	```
    John, Doe
    Jane, Doe
	```
5. Use tools such as [Azure Storage Explorer](https://azurestorageexplorer.codeplex.com/) to create the **adftutorial** container, and to upload the **emp.txt** file to the container.

    ![Azure Storage Explorer](media/data-factory-copy-activity-tutorial-using-powershell/getstarted-storage-explorer.png)
6. Use the following SQL script to create the **emp** table in your SQL database.  

	```sql
    CREATE TABLE dbo.emp
    (
        ID int IDENTITY(1,1) NOT NULL,
        FirstName varchar(50),
        LastName varchar(50),
    )
    GO

    CREATE CLUSTERED INDEX IX_emp_ID ON dbo.emp (ID);
	```

    If you have SQL Server 2014 installed on your computer, follow instructions from [Step 2: Connect to SQL Database of the Managing Azure SQL Database using SQL Server Management Studio](../sql-database/sql-database-manage-azure-ssms.md) to connect to your SQL database server and run the SQL script.

    If your client is not allowed to access the SQL database server, you need to set up the firewall for your SQL database server to allow access from your machine (IP Address). For the steps, see [this article](../sql-database/sql-database-configure-firewall-settings.md).

### Create an input dataset
A table is a rectangular dataset, and has a schema. In this step, you create a table, named **EmpBlobTable**. This table points to a blob container in Azure Storage represented by the **StorageLinkedService** linked service. This blob container (adftutorial) contains the input data in the file **emp.txt**.

1. Create a JSON file named **EmpBlobTable.json** in the **C:\ADFGetStartedPSH** folder, with the following content:

	```json
	{
		"name": "EmpTableFromBlob",
		"properties": {
			"structure": [
				{
					"name": "FirstName",
					"type": "String"
				},
				{
					"name": "LastName",
					"type": "String"
				}
			],
			"type": "AzureBlob",
			"linkedServiceName": "StorageLinkedService",
			"typeProperties": {
				"fileName": "emp.txt",
				"folderPath": "adftutorial/",
				"format": {
					"type": "TextFormat",
					"columnDelimiter": ","
				}
			},
			"external": true,
			"availability": {
				"frequency": "Hour",
				"interval": 1
			}
		}
     }
	```

   Note the following points:

   * Dataset **type** is set to **AzureBlob**.
   * **linkedServiceName** is set to **StorageLinkedService**.
   * **folderPath** is set to the **adftutorial** container.
   * **fileName** is set to **emp.txt**. If you do not specify the name of the blob, data from all blobs in the container is considered as input data.  
   * Format **type** is set to **TextFormat**.
   * There are two fields in the text file, **FirstName** and **LastName**, separated by a comma character (columnDelimiter).    
   * **availability** is set to **hourly** (frequency is set to hour, and interval is set to 1). Therefore, Data Factory looks for input data hourly in the root folder in the blob container (adftutorial).

   If you don't specify a **fileName** for an **input table**, all files and blobs from the input folder (folderPath) are considered as inputs. If you specify a fileName in the JSON, only the specified file or blob is considered as an input.

   If you do not specify a **fileName** for an **output table**, the generated files in the **folderPath** are named in the following format: Data.<Guid\>.txt (example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt.).

   To set **folderPath** and **fileName** dynamically based on the **SliceStart** time, use the **partitionedBy** property. In the following example, folderPath uses Year, Month, and Day from the SliceStart (start time of the slice being processed) and fileName uses Hour from the SliceStart. For example, if a slice is being produced for 2016-10-20T08:00:00, the folderName is set to wikidatagateway/wikisampledataout/2016/10/20 and the fileName is set to 08.csv.

	```json
     "folderPath": "wikidatagateway/wikisampledataout/{Year}/{Month}/{Day}",
     "fileName": "{Hour}.csv",
     "partitionedBy":
     [
         { "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
         { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "MM" } },
         { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "dd" } },
         { "name": "Hour", "value": { "type": "DateTime", "date": "SliceStart", "format": "hh" } }
     ],
	```

   For details about JSON properties, see the [JSON Scripting Reference](data-factory-data-movement-activities.md).
2. Run the following command to create the Data Factory dataset.

	```PowerShell  
	New-AzureRmDataFactoryDataset $df -File .\EmpBlobTable.json
	```

### Create an output dataset
In this step, you create an output dataset named **EmpSQLTable**. This dataset points to a SQL table (emp) in the Azure SQL database represented by **AzureSqlLinkedService**. The pipeline copies data from the input blob to the **emp** table.

1. Create a JSON file named **EmpSQLTable.json** in the **C:\ADFGetStartedPSH** folder with the following content:

	```json
	{
		"name": "EmpSQLTable",
		"properties": {
			"structure": [
				{
					"name": "FirstName",
					"type": "String"
				},
				{
					"name": "LastName",
					"type": "String"
				}
			],
			"type": "AzureSqlTable",
			"linkedServiceName": "AzureSqlLinkedService",
			"typeProperties": {
				"tableName": "emp"
			},
			"availability": {
				"frequency": "Hour",
				"interval": 1
			}
		}
	}
	```

   Note the following points:

   * Dataset **type** is set to **AzureSqlTable**.
   * **linkedServiceName** is set to **AzureSqlLinkedService**.
   * **tablename** is set to **emp**.
   * There are three columns, **ID**, **FirstName**, and **LastName**, in the emp table in the database. ID is an identity column, so you need to specify only **FirstName** and **LastName** here.
   * **availability** is set to **hourly** (frequency set to hour and interval set to 1). The Data Factory service generates an output data slice every hour in the **emp** table in the Azure SQL database.
2. Run the following command to create the data factory dataset.

	```PowerShell   
	New-AzureRmDataFactoryDataset $df -File .\EmpSQLTable.json
	```

## Create a pipeline
In this step, you create a pipeline with **Copy Activity**. The pipeline uses **EmpTableFromBlob** as input, and **EmpSQLTable** as output.

1. Create a JSON file named **ADFTutorialPipeline.json** in the **C:\ADFGetStartedPSH** folder, with the following content:

	```json
	{
		"name": "ADFTutorialPipeline",
		"properties": {
			"description": "Copy data from a blob to Azure SQL table",
			"activities": [
				{
					"name": "CopyFromBlobToSQL",
					"description": "Push Regional Effectiveness Campaign data to Azure SQL database",
					"type": "Copy",
					"inputs": [{ "name": "EmpTableFromBlob" }],
					"outputs": [{ "name": "EmpSQLTable" }],
					"typeProperties": {
						"source": {
							"type": "BlobSource"
						},
						"sink": {
							"type": "SqlSink"
						}
					},
					"Policy": {
						"concurrency": 1,
						"executionPriorityOrder": "NewestFirst",
						"style": "StartOfInterval",
						"retry": 0,
						"timeout": "01:00:00"
					}
				}
			],
			"start": "2016-08-09T00:00:00Z",
			"end": "2016-08-10T00:00:00Z",
			"isPaused": false
		}
     }
	```
   Note the following points:

   * In the activities section, there is only one activity whose **type** is set to **Copy**.
   * Input for the activity is set to **EmpTableFromBlob**, and output for the activity is set to **EmpSQLTable**.
   * In the **transformation** section, **BlobSource** is specified as the source type, and **SqlSink** is specified as the sink type.

   Replace the value of the **start** property with the current day, and that of the **end** property with the next day. Both start and end datetimes must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2016-10-14T16:32:41Z. The **end** time is used in this tutorial, but it is optional.

   If you do not specify value for the **end** property, it is calculated as "**start + 48 hours**". To run the pipeline indefinitely, specify **9/9/9999** as the value for the **end** property.

   In the example, there are 24 data slices, as each data slice is produced hourly.

   For more information about JSON properties, see the [JSON Scripting Reference](data-factory-data-movement-activities.md).
2. Run the following command to create the data factory table.

	```PowerShell   
	New-AzureRmDataFactoryPipeline $df -File .\ADFTutorialPipeline.json
	```

Congratulations! You have successfully created an Azure data factory, linked services, tables, and a pipeline. You have also scheduled the pipeline.

## Monitor the pipeline
In this step, you use Azure PowerShell to monitor what’s going on in an Azure data factory.

1. Run **Get-AzureRmDataFactory**, and assign the output to a variable $df.

	```PowerShell  
	$df=Get-AzureRmDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name ADFTutorialDataFactoryPSH
	```

2. Run **Get-AzureRmDataFactorySlice** to get details about all slices of the **EmpSQLTable**, which is the output table of the pipeline.  

	```PowerShell   
	Get-AzureRmDataFactorySlice $df -DatasetName EmpSQLTable -StartDateTime 2016-08-09T00:00:00
	```

   Replace the year, month, and date part of the **StartDateTime** parameter with the current year, month, and date. This setting should match the **Start** value in the pipeline JSON.

   You should see 24 slices, one for each hour from 12 AM of the current day to 12 AM of the next day.

   **Sample output:**

	``` 
     ResourceGroupName : ADFTutorialResourceGroup
     DataFactoryName   : ADFTutorialDataFactoryPSH
     TableName         : EmpSQLTable
     Start             : 8/9/2016 12:00:00 AM
     End               : 8/9/2016 1:00:00 AM
     RetryCount        : 0
     Status            : Waiting
     LatencyStatus     :
     LongRetryCount    : 0
	```
3. Run **Get-AzureRmDataFactoryRun** to get the details of activity runs for a **specific** slice. Change the value of the **StartDateTime** parameter to match the **Start** time of the slice from the output. The value of the **StartDateTime** must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601).

	```PowerShell  
	Get-AzureRmDataFactoryRun $df -DatasetName EmpSQLTable -StartDateTime 2016-08-09T00:00:00
	```

   You should see output similar to the following sample:

	```  
	Id                  : 3404c187-c889-4f88-933b-2a2f5cd84e90_635614488000000000_635614524000000000_EmpSQLTable
	ResourceGroupName   : ADFTutorialResourceGroup
	DataFactoryName     : ADFTutorialDataFactoryPSH
	TableName           : EmpSQLTable
	ProcessingStartTime : 8/9/2016 11:03:28 PM
	ProcessingEndTime   : 8/9/2016 11:04:36 PM
	PercentComplete     : 100
	DataSliceStart      : 8/9/2016 10:00:00 PM
	DataSliceEnd        : 8/9/2016 11:00:00 PM
	Status              : Succeeded
	Timestamp           : 8/9/2016 11:03:28 PM
	RetryAttempt        : 0
	Properties          : {}
	ErrorMessage        :
	ActivityName        : CopyFromBlobToSQL
	PipelineName        : ADFTutorialPipeline
	Type                : Copy
	```

For comprehensive documentation on Data Factory cmdlets, see the [Data Factory Cmdlet Reference][cmdlet-reference].

## Summary
In this tutorial, you created an Azure data factory to copy data from an Azure blob to an Azure SQL database. You used PowerShell to create the data factory, linked services, datasets, and a pipeline. Here are the high-level steps you performed in this tutorial:  

1. Created an Azure **data factory**.
2. Created **linked services**:

   a. An **Azure Storage** linked service to link your Azure storage account that holds input data.     
   b. An **Azure SQL** linked service to link your SQL database that holds the output data.
3. Created **datasets** that describe input data and output data for pipelines.
4. Created a **pipeline** with **Copy Activity**, with **BlobSource** as the source and **SqlSink** as the sink.

## See also
| Topic | Description |
|:--- |:--- |
| [Data Factory Cmdlet Reference](/powershell/module/azurerm.datafactories) | This section provides information about all the Data Factory cmdlets |
| [Pipelines](data-factory-create-pipelines.md) |This article helps you understand pipelines and activities in Azure Data Factory. |
| [datasets](data-factory-create-datasets.md) |This article helps you understand datasets in Azure Data Factory. |
| [Scheduling and execution](data-factory-scheduling-and-execution.md) |This article explains the scheduling and execution aspects of the Azure Data Factory application model. |

[use-custom-activities]: data-factory-use-custom-activities.md
[troubleshoot]: data-factory-troubleshoot.md
[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908

[cmdlet-reference]: https://msdn.microsoft.com/library/azure/dn820234.aspx
[old-cmdlet-reference]: https://msdn.microsoft.com/library/azure/dn820234(v=azure.98).aspx
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[azure-portal]: http://portal.azure.com
[download-azure-powershell]: ../powershell-install-configure.md
[data-factory-introduction]: data-factory-introduction.md

[image-data-factory-get-started-storage-explorer]: ./media/data-factory-copy-activity-tutorial-using-powershell/getstarted-storage-explorer.png

[sql-management-studio]: ../sql-database/sql-database-manage-azure-ssms.md
