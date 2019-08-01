---
title: 'Tutorial: Create a pipeline to move data by using Azure PowerShell | Microsoft Docs'
description: In this tutorial, you create an Azure Data Factory pipeline with Copy Activity by using Azure PowerShell.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: 
editor: 

ms.assetid: 71087349-9365-4e95-9847-170658216ed8
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: tutorial
ms.date: 01/22/2018
ms.author: jingwang

robots: noindex
---
# Tutorial: Create a Data Factory pipeline that moves data by using Azure PowerShell
> [!div class="op_single_selector"]
> * [Overview and prerequisites](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
> * [Copy Wizard](data-factory-copy-data-wizard-tutorial.md)
> * [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md)
> * [PowerShell](data-factory-copy-activity-tutorial-using-powershell.md)
> * [Azure Resource Manager template](data-factory-copy-activity-tutorial-using-azure-resource-manager-template.md)
> * [REST API](data-factory-copy-activity-tutorial-using-rest-api.md)
> * [.NET API](data-factory-copy-activity-tutorial-using-dotnet-api.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [copy activity tutorial](../quickstart-create-data-factory-powershell.md). 

In this article, you learn how to use PowerShell to create a data factory with a pipeline that copies data from an Azure blob storage to an Azure SQL database. If you are new to Azure Data Factory, read through the [Introduction to Azure Data Factory](data-factory-introduction.md) article before doing this tutorial.   

In this tutorial, you create a pipeline with one activity in it: Copy Activity. The copy activity copies data from a supported data store to a supported sink data store. For a list of data stores supported as sources and sinks, see [supported data stores](data-factory-data-movement-activities.md#supported-data-stores-and-formats). The activity is powered by a globally available service that can copy data between various data stores in a secure, reliable, and scalable way. For more information about the Copy Activity, see [Data Movement Activities](data-factory-data-movement-activities.md).

A pipeline can have more than one activity. And, you can chain two activities (run one activity after another) by setting the output dataset of one activity as the input dataset of the other activity. For more information, see [multiple activities in a pipeline](data-factory-scheduling-and-execution.md#multiple-activities-in-a-pipeline).

> [!NOTE]
> This article does not cover all the Data Factory cmdlets. See [Data Factory Cmdlet Reference](/powershell/module/az.datafactory) for comprehensive documentation on these cmdlets.
> 
> The data pipeline in this tutorial copies data from a source data store to a destination data store. For a tutorial on how to transform data using Azure Data Factory, see [Tutorial: Build a pipeline to transform data using Hadoop cluster](data-factory-build-your-first-pipeline.md).

## Prerequisites

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

- Complete prerequisites listed in the [tutorial prerequisites](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) article.
- Install **Azure PowerShell**. Follow the instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-Az-ps).

## Steps
Here are the steps you perform as part of this tutorial:

1. Create an Azure **data factory**. In this step, you create a data factory named ADFTutorialDataFactoryPSH. 
1. Create **linked services** in the data factory. In this step, you create two linked services of types: Azure Storage and Azure SQL Database. 
	
	The AzureStorageLinkedService links your Azure storage account to the data factory. You created a container and uploaded data to this storage account as part of [prerequisites](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).   

	AzureSqlLinkedService links your Azure SQL database to the data factory. The data that is copied from the blob storage is stored in this database. You created a SQL table in this database as part of [prerequisites](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).   
1. Create input and output **datasets** in the data factory.  
	
	The Azure storage linked service specifies the connection string that Data Factory service uses at run time to connect to your Azure storage account. And, the input blob dataset specifies the container and the folder that contains the input data.  

	Similarly, the Azure SQL Database linked service specifies the connection string that Data Factory service uses at run time to connect to your Azure SQL database. And, the output SQL table dataset specifies the table in the database to which the data from the blob storage is copied.
1. Create a **pipeline** in the data factory. In this step, you create a pipeline with a copy activity.   
	
	The copy activity copies data from a blob in the Azure blob storage to a table in the Azure SQL database. You can use a copy activity in a pipeline to copy data from any supported source to any supported destination. For a list of supported data stores, see [data movement activities](data-factory-data-movement-activities.md#supported-data-stores-and-formats) article. 
1. Monitor the pipeline. In this step, you **monitor** the slices of input and output datasets by using PowerShell.

## Create a data factory
> [!IMPORTANT]
> Complete [prerequisites for the tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) if you haven't already done so.   

A data factory can have one or more pipelines. A pipeline can have one or more activities in it. For example, a Copy Activity to copy data from a source to a destination data store and a HDInsight Hive activity to run a Hive script to transform input data to product output data. Let's start with creating the data factory in this step.

1. Launch **PowerShell**. Keep Azure PowerShell open until the end of this tutorial. If you close and reopen, you need to run the commands again.

	Run the following command, and enter the user name and password that you use to sign in to the Azure portal:

	```powershell
	Connect-AzAccount
    ```   
   
	Run the following command to view all the subscriptions for this account:

	```powershell
	Get-AzSubscription
    ```

	Run the following command to select the subscription that you want to work with. Replace **&lt;NameOfAzureSubscription**&gt; with the name of your Azure subscription:

	```powershell
	Get-AzSubscription -SubscriptionName <NameOfAzureSubscription> | Set-AzContext
    ```
1. Create an Azure resource group named **ADFTutorialResourceGroup** by running the following command:

	```powershell
	New-AzResourceGroup -Name ADFTutorialResourceGroup  -Location "West US"
    ```
    
	Some of the steps in this tutorial assume that you use the resource group named **ADFTutorialResourceGroup**. If you use a different resource group, you need to use it in place of ADFTutorialResourceGroup in this tutorial.
1. Run the **New-AzDataFactory** cmdlet to create a data factory named **ADFTutorialDataFactoryPSH**:  

	```powershell
	$df=New-AzDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name ADFTutorialDataFactoryPSH –Location "West US"
    ```
	This name may already have been taken. Therefore, make the name of the data factory unique by adding a prefix or suffix (for example: ADFTutorialDataFactoryPSH05152017) and run the command again.  

Note the following points:

* The name of the Azure data factory must be globally unique. If you receive the following error, change the name (for example, yournameADFTutorialDataFactoryPSH). Use this name in place of ADFTutorialFactoryPSH while performing steps in this tutorial. See [Data Factory - Naming Rules](data-factory-naming-rules.md) for Data Factory artifacts.

    ```
	Data factory name “ADFTutorialDataFactoryPSH” is not available
    ```
* To create Data Factory instances, you must be a contributor or administrator of the Azure subscription.
* The name of the data factory may be registered as a DNS name in the future, and hence become publicly visible.
* You may receive the following error: "**This subscription is not registered to use namespace Microsoft.DataFactory.**" Do one of the following, and try publishing again:

  * In Azure PowerShell, run the following command to register the Data Factory provider:

	```powershell
	Register-AzResourceProvider -ProviderNamespace Microsoft.DataFactory
    ```

	Run the following command to confirm that the Data Factory provider is registered:

	```powershell
	Get-AzResourceProvider
    ```
  * Sign in by using the Azure subscription to the [Azure portal](https://portal.azure.com). Go to a Data Factory blade, or create a data factory in the Azure portal. This action automatically registers the provider for you.

## Create linked services
You create linked services in a data factory to link your data stores and compute services to the data factory. In this tutorial, you don't use any compute service such as Azure HDInsight or Azure Data Lake Analytics. You use two data stores of type Azure Storage (source) and Azure SQL Database (destination). 

Therefore, you create two linked services named AzureStorageLinkedService and AzureSqlLinkedService of types: AzureStorage and AzureSqlDatabase.  

The AzureStorageLinkedService links your Azure storage account to the data factory. This storage account is the one in which you created a container and uploaded the data as part of [prerequisites](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).   

AzureSqlLinkedService links your Azure SQL database to the data factory. The data that is copied from the blob storage is stored in this database. You created the emp table in this database as part of [prerequisites](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md). 

### Create a linked service for an Azure storage account
In this step, you link your Azure storage account to your data factory.

1. Create a JSON file named **AzureStorageLinkedService.json** in **C:\ADFGetStartedPSH** folder with the following content: (Create the folder ADFGetStartedPSH if it does not already exist.)

	> [!IMPORTANT]
	> Replace &lt;accountname&gt; and &lt;accountkey&gt; with name and key of your Azure storage account before saving the file. 

	```json
	{
		"name": "AzureStorageLinkedService",
		"properties": {
			"type": "AzureStorage",
			"typeProperties": {
				"connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
			}
		}
     }
    ``` 
1. In **Azure PowerShell**, switch to the **ADFGetStartedPSH** folder.
1. Run the **New-AzDataFactoryLinkedService** cmdlet to create the linked service: **AzureStorageLinkedService**. This cmdlet, and other Data Factory cmdlets you use in this tutorial requires you to pass values for the **ResourceGroupName** and **DataFactoryName** parameters. Alternatively, you can pass the DataFactory object returned by the New-AzDataFactory cmdlet without typing ResourceGroupName and DataFactoryName each time you run a cmdlet. 

	```powershell
	New-AzDataFactoryLinkedService $df -File .\AzureStorageLinkedService.json
    ```
	Here is the sample output:

    ```
	LinkedServiceName : AzureStorageLinkedService
	ResourceGroupName : ADFTutorialResourceGroup
	DataFactoryName   : ADFTutorialDataFactoryPSH0516
	Properties        : Microsoft.Azure.Management.DataFactories.Models.LinkedServiceProperties
	ProvisioningState : Succeeded
    ``` 

	Other way of creating this linked service is to specify resource group name and data factory name instead of specifying the DataFactory object.  

	```powershell
	New-AzDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName <Name of your data factory> -File .\AzureStorageLinkedService.json
    ```

### Create a linked service for an Azure SQL database
In this step, you link your Azure SQL database to your data factory.

1. Create a JSON file named AzureSqlLinkedService.json in C:\ADFGetStartedPSH folder with the following content:

	> [!IMPORTANT]
	> Replace &lt;servername&gt;, &lt;databasename&gt;, &lt;username@servername&gt;, and &lt;password&gt; with names of your Azure SQL server, database, user account, and password.
	
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
1. Run the following command to create a linked service:

	```powershell
	New-AzDataFactoryLinkedService $df -File .\AzureSqlLinkedService.json
    ```
	
	Here is the sample output:

    ```
	LinkedServiceName : AzureSqlLinkedService
	ResourceGroupName : ADFTutorialResourceGroup
	DataFactoryName   : ADFTutorialDataFactoryPSH0516
	Properties        : Microsoft.Azure.Management.DataFactories.Models.LinkedServiceProperties
	ProvisioningState : Succeeded
    ```

   Confirm that **Allow access to Azure services** setting is turned on for your SQL database server. To verify and turn it on, do the following steps:

	1. Log in to the [Azure portal](https://portal.azure.com)
	1. Click **More services >** on the left, and click **SQL servers** in the **DATABASES** category.
	1. Select your server in the list of SQL servers.
	1. On the SQL server blade, click **Show firewall settings** link.
	1. In the **Firewall settings** blade, click **ON** for **Allow access to Azure services**.
	1. Click **Save** on the toolbar. 

## Create datasets
In the previous step, you created linked services to link your Azure Storage account and Azure SQL database to your data factory. In this step, you define two datasets named InputDataset and OutputDataset that represent input and output data that is stored in the data stores referred by AzureStorageLinkedService and AzureSqlLinkedService respectively.

The Azure storage linked service specifies the connection string that Data Factory service uses at run time to connect to your Azure storage account. And, the input blob dataset (InputDataset) specifies the container and the folder that contains the input data.  

Similarly, the Azure SQL Database linked service specifies the connection string that Data Factory service uses at run time to connect to your Azure SQL database. And, the output SQL table dataset (OututDataset) specifies the table in the database to which the data from the blob storage is copied. 

### Create an input dataset
In this step, you create a dataset named InputDataset that points to a blob file (emp.txt) in the root folder of a blob container (adftutorial) in the Azure Storage represented by the AzureStorageLinkedService linked service. If you don't specify a value for the fileName (or skip it), data from all blobs in the input folder are copied to the destination. In this tutorial, you specify a value for the fileName.  

1. Create a JSON file named **InputDataset.json** in the **C:\ADFGetStartedPSH** folder, with the following content:

	```json
	{
		"name": "InputDataset",
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
			"linkedServiceName": "AzureStorageLinkedService",
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

    The following table provides descriptions for the JSON properties used in the snippet:

	| Property | Description |
	|:--- |:--- |
	| type | The type property is set to **AzureBlob** because data resides in an Azure blob storage. |
	| linkedServiceName | Refers to the **AzureStorageLinkedService** that you created earlier. |
	| folderPath | Specifies the blob **container** and the **folder** that contains input blobs. In this tutorial, adftutorial is the blob container and folder is the root folder. | 
	| fileName | This property is optional. If you omit this property, all files from the folderPath are picked. In this tutorial, **emp.txt** is specified for the fileName, so only that file is picked up for processing. |
	| format -> type |The input file is in the text format, so we use **TextFormat**. |
	| columnDelimiter | The columns in the input file are delimited by **comma character (`,`)**. |
	| frequency/interval | The frequency is set to **Hour** and interval is  set to **1**, which means that the input slices are available **hourly**. In other words, the Data Factory service looks for input data every hour in the root folder of blob container (**adftutorial**) you specified. It looks for the data within the pipeline start and end times, not before or after these times.  |
	| external | This property is set to **true** if the data is not generated by this pipeline. The input data in this tutorial is in the emp.txt file, which is not generated by this pipeline, so we set this property to true. |

    For more information about these JSON properties, see [Azure Blob connector article](data-factory-azure-blob-connector.md#dataset-properties).
1. Run the following command to create the Data Factory dataset.

	```powershell  
	New-AzDataFactoryDataset $df -File .\InputDataset.json
    ```
	Here is the sample output:

    ```
	DatasetName       : InputDataset
	ResourceGroupName : ADFTutorialResourceGroup
	DataFactoryName   : ADFTutorialDataFactoryPSH0516
	Availability      : Microsoft.Azure.Management.DataFactories.Common.Models.Availability
	Location          : Microsoft.Azure.Management.DataFactories.Models.AzureBlobDataset
	Policy            : Microsoft.Azure.Management.DataFactories.Common.Models.Policy
	Structure         : {FirstName, LastName}
	Properties        : Microsoft.Azure.Management.DataFactories.Models.DatasetProperties
	ProvisioningState : Succeeded
    ```

### Create an output dataset
In this part of the step, you create an output dataset named **OutputDataset**. This dataset points to a SQL table in the Azure SQL database represented by **AzureSqlLinkedService**. 

1. Create a JSON file named **OutputDataset.json** in the **C:\ADFGetStartedPSH** folder with the following content:

	```json
	{
		"name": "OutputDataset",
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

    The following table provides descriptions for the JSON properties used in the snippet:

	| Property | Description |
	|:--- |:--- |
	| type | The type property is set to **AzureSqlTable** because data is copied to a table in an Azure SQL database. |
	| linkedServiceName | Refers to the **AzureSqlLinkedService** that you created earlier. |
	| tableName | Specified the **table** to which the data is copied. | 
	| frequency/interval | The frequency is set to **Hour** and interval is **1**, which means that the output slices are produced **hourly** between the pipeline start and end times, not before or after these times.  |

	There are three columns – **ID**, **FirstName**, and **LastName** – in the emp table in the database. ID is an identity column, so you need to specify only **FirstName** and **LastName** here.

	For more information about these JSON properties, see [Azure SQL connector article](data-factory-azure-sql-connector.md#dataset-properties).
1. Run the following command to create the data factory dataset.

	```powershell   
	New-AzDataFactoryDataset $df -File .\OutputDataset.json
    ```

	Here is the sample output:

    ```
	DatasetName       : OutputDataset
	ResourceGroupName : ADFTutorialResourceGroup
	DataFactoryName   : ADFTutorialDataFactoryPSH0516
	Availability      : Microsoft.Azure.Management.DataFactories.Common.Models.Availability
	Location          : Microsoft.Azure.Management.DataFactories.Models.AzureSqlTableDataset
	Policy            :
	Structure         : {FirstName, LastName}
	Properties        : Microsoft.Azure.Management.DataFactories.Models.DatasetProperties
	ProvisioningState : Succeeded
    ```

## Create a pipeline
In this step, you create a pipeline with a **copy activity** that uses **InputDataset** as an input and **OutputDataset** as an output.

Currently, output dataset is what drives the schedule. In this tutorial, output dataset is configured to produce a slice once an hour. The pipeline has a start time and end time that are one day apart, which is 24 hours. Therefore, 24 slices of output dataset are produced by the pipeline. 


1. Create a JSON file named **ADFTutorialPipeline.json** in the **C:\ADFGetStartedPSH** folder, with the following content:

	```json   
	{
	  "name": "ADFTutorialPipeline",
	  "properties": {
	    "description": "Copy data from a blob to Azure SQL table",
	    "activities": [
	      {
	        "name": "CopyFromBlobToSQL",
	        "type": "Copy",
	        "inputs": [
	          {
	            "name": "InputDataset"
	          }
	        ],
	        "outputs": [
	          {
	            "name": "OutputDataset"
	          }
	        ],
	        "typeProperties": {
	          "source": {
	            "type": "BlobSource"
	          },
	          "sink": {
	            "type": "SqlSink",
	            "writeBatchSize": 10000,
	            "writeBatchTimeout": "60:00:00"
	          }
	        },
	        "Policy": {
	          "concurrency": 1,
	          "executionPriorityOrder": "NewestFirst",
	          "retry": 0,
	          "timeout": "01:00:00"
	        }
	      }
	    ],
	    "start": "2017-05-11T00:00:00Z",
	    "end": "2017-05-12T00:00:00Z"
	  }
	} 
    ```
	Note the following points:
   
   - In the activities section, there is only one activity whose **type** is set to **Copy**. For more information about the copy activity, see [data movement activities](data-factory-data-movement-activities.md). In Data Factory solutions, you can also use [data transformation activities](data-factory-data-transformation-activities.md).
   - Input for the activity is set to **InputDataset** and output for the activity is set to **OutputDataset**. 
   - In the **typeProperties** section, **BlobSource** is specified as the source type and **SqlSink** is specified as the sink type. For a complete list of data stores supported by the copy activity as sources and sinks, see [supported data stores](data-factory-data-movement-activities.md#supported-data-stores-and-formats). To learn how to use a specific supported data store as a source/sink, click the link in the table.  
     
     Replace the value of the **start** property with the current day and **end** value with the next day. You can specify only the date part and skip the time part of the date time. For example, "2016-02-03", which is equivalent to "2016-02-03T00:00:00Z"
     
     Both start and end datetimes must be in [ISO format](https://en.wikipedia.org/wiki/ISO_8601). For example: 2016-10-14T16:32:41Z. The **end** time is optional, but we use it in this tutorial. 
     
     If you do not specify value for the **end** property, it is calculated as "**start + 48 hours**". To run the pipeline indefinitely, specify **9999-09-09** as the value for the **end** property.
     
     In the preceding example, there are 24 data slices as each data slice is produced hourly.

     For descriptions of JSON properties in a pipeline definition, see [create pipelines](data-factory-create-pipelines.md) article. For descriptions of JSON properties in a copy activity definition, see [data movement activities](data-factory-data-movement-activities.md). For descriptions of JSON properties supported by BlobSource, see [Azure Blob connector article](data-factory-azure-blob-connector.md). For descriptions of JSON properties supported by SqlSink, see [Azure SQL Database connector article](data-factory-azure-sql-connector.md).
1. Run the following command to create the data factory table.

	```powershell   
	New-AzDataFactoryPipeline $df -File .\ADFTutorialPipeline.json
    ```

	Here is the sample output: 

    ```
	PipelineName      : ADFTutorialPipeline
	ResourceGroupName : ADFTutorialResourceGroup
	DataFactoryName   : ADFTutorialDataFactoryPSH0516
	Properties        : Microsoft.Azure.Management.DataFactories.Models.PipelinePropertie
	ProvisioningState : Succeeded
    ```

**Congratulations!** You have successfully created an Azure data factory with a pipeline to copy data from an Azure blob storage to an Azure SQL database. 

## Monitor the pipeline
In this step, you use Azure PowerShell to monitor what’s going on in an Azure data factory.

1. Replace &lt;DataFactoryName&gt; with the name of your data factory and run **Get-AzDataFactory**, and assign the output to a variable $df.

	```powershell  
	$df=Get-AzDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name <DataFactoryName>
    ```

	For example:
	```powershell
	$df=Get-AzDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name ADFTutorialDataFactoryPSH0516
    ```
	
	Then, run print the contents of $df to see the following output: 
	
    ```
	PS C:\ADFGetStartedPSH> $df
	
	DataFactoryName   : ADFTutorialDataFactoryPSH0516
	DataFactoryId     : 6f194b34-03b3-49ab-8f03-9f8a7b9d3e30
	ResourceGroupName : ADFTutorialResourceGroup
	Location          : West US
	Tags              : {}
	Properties        : Microsoft.Azure.Management.DataFactories.Models.DataFactoryProperties
	ProvisioningState : Succeeded
    ```
1. Run **Get-AzDataFactorySlice** to get details about all slices of the **OutputDataset**, which is the output dataset of the pipeline.  

	```powershell   
	Get-AzDataFactorySlice $df -DatasetName OutputDataset -StartDateTime 2017-05-11T00:00:00Z
    ```

   This setting should match the **Start** value in the pipeline JSON. You should see 24 slices, one for each hour from 12 AM of the current day to 12 AM of the next day.

   Here are three sample slices from the output: 

    ``` 
	ResourceGroupName : ADFTutorialResourceGroup
	DataFactoryName   : ADFTutorialDataFactoryPSH0516
	DatasetName       : OutputDataset
	Start             : 5/11/2017 11:00:00 PM
	End               : 5/12/2017 12:00:00 AM
	RetryCount        : 0
	State             : Ready
	SubState          :
	LatencyStatus     :
	LongRetryCount    : 0

	ResourceGroupName : ADFTutorialResourceGroup
	DataFactoryName   : ADFTutorialDataFactoryPSH0516
	DatasetName       : OutputDataset
	Start             : 5/11/2017 9:00:00 PM
	End               : 5/11/2017 10:00:00 PM
	RetryCount        : 0
	State             : InProgress
	SubState          :
	LatencyStatus     :
	LongRetryCount    : 0	

	ResourceGroupName : ADFTutorialResourceGroup
	DataFactoryName   : ADFTutorialDataFactoryPSH0516
	DatasetName       : OutputDataset
	Start             : 5/11/2017 8:00:00 PM
	End               : 5/11/2017 9:00:00 PM
	RetryCount        : 0
	State             : Waiting
	SubState          : ConcurrencyLimit
	LatencyStatus     :
	LongRetryCount    : 0
    ```
1. Run **Get-AzDataFactoryRun** to get the details of activity runs for a **specific** slice. Copy the date-time value from the output of the previous command to specify the value for the StartDateTime parameter. 

	```powershell  
	Get-AzDataFactoryRun $df -DatasetName OutputDataset -StartDateTime "5/11/2017 09:00:00 PM"
    ```

   Here is the sample output: 

    ```
	Id                  : c0ddbd75-d0c7-4816-a775-704bbd7c7eab_636301332000000000_636301368000000000_OutputDataset
	ResourceGroupName   : ADFTutorialResourceGroup
	DataFactoryName     : ADFTutorialDataFactoryPSH0516
	DatasetName         : OutputDataset
	ProcessingStartTime : 5/16/2017 8:00:33 PM
	ProcessingEndTime   : 5/16/2017 8:01:36 PM
	PercentComplete     : 100
	DataSliceStart      : 5/11/2017 9:00:00 PM
	DataSliceEnd        : 5/11/2017 10:00:00 PM
	Status              : Succeeded
	Timestamp           : 5/16/2017 8:00:33 PM
	RetryAttempt        : 0
	Properties          : {}
	ErrorMessage        :
	ActivityName        : CopyFromBlobToSQL
	PipelineName        : ADFTutorialPipeline
	Type                : Copy  
    ```

For comprehensive documentation on Data Factory cmdlets, see [Data Factory Cmdlet Reference](/powershell/module/az.datafactory).

## Summary
In this tutorial, you created an Azure data factory to copy data from an Azure blob to an Azure SQL database. You used PowerShell to create the data factory, linked services, datasets, and a pipeline. Here are the high-level steps you performed in this tutorial:  

1. Created an Azure **data factory**.
1. Created **linked services**:

   a. An **Azure Storage** linked service to link your Azure storage account that holds input data.     
   b. An **Azure SQL** linked service to link your SQL database that holds the output data.
1. Created **datasets** that describe input data and output data for pipelines.
1. Created a **pipeline** with **Copy Activity**, with **BlobSource** as the source and **SqlSink** as the sink.

## Next steps
In this tutorial, you used Azure blob storage as a source data store and an Azure SQL database as a destination data store in a copy operation. The following table provides a list of data stores supported as sources and destinations by the copy activity: 

[!INCLUDE [data-factory-supported-data-stores](../../../includes/data-factory-supported-data-stores.md)]

To learn about how to copy data to/from a data store, click the link for the data store in the table. 

