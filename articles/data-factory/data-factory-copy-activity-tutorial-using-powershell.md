<properties 
	pageTitle="Tutorial: Create a pipeline with Copy Activity using Azure PowerShell" 
	description="In this tutorial, you will create an Azure Data Factory pipeline with a Copy Activity by using Azure PowerShell." 
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
	ms.topic="get-started-article" 
	ms.date="05/16/2016" 
	ms.author="spelluru"/>

# Tutorial: Create a pipeline with Copy Activity using Azure PowerShell
> [AZURE.SELECTOR]
- [Tutorial Overview](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
- [Using Data Factory Editor](data-factory-copy-activity-tutorial-using-azure-portal.md)
- [Using PowerShell](data-factory-copy-activity-tutorial-using-powershell.md)
- [Using Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md)
- [Using Copy Wizard](data-factory-copy-data-wizard-tutorial.md)

The [Copy data from Blob Storage to SQL Database](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) tutorial shows you how to create and monitor an Azure data factory using the [Azure Portal][azure-portal]. 
In this tutorial, you will create and monitor an Azure data factory by using Azure PowerShell cmdlets. The pipeline in the data factory you create in this tutorial uses a Copy Activity to copy data from an Azure blob to an Azure SQL database.

The Copy Activity performs the data movement in Azure Data Factory and the activity is powered by a globally available service that can copy data between various data stores in a secure, reliable, and scalable way. See [Data Movement Activities](data-factory-data-movement-activities.md) article for details about the Copy Activity.   

> [AZURE.IMPORTANT] 
> Please go through the [Tutorial Overview](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) article and complete the pre-requisite steps before performing this tutorial.
>   
> This article does not cover all the Data Factory cmdlets. See [Data Factory Cmdlet Reference](https://msdn.microsoft.com/library/dn820234.aspx) for comprehensive documentation on Data Factory cmdlets.
  

##Prerequisites
Apart from prerequisites listed in the Tutorial Overview topic, you need to install the following:

- **Azure PowerShell**. Follow instructions in [How to install and configure Azure PowerShell](../powershell-install-configure.md) article to install Azure PowerShell on your computer.

If you are using Azure PowerShell of **version < 1.0**, You will need to use cmdlets that are documented [here][old-cmdlet-reference]. You also will need to run the following commands before using the Data Factory cmdlets: 

1. Start Azure PowerShell and run the following commands. Keep Azure PowerShell open until the end of this tutorial. If you close and reopen, you need to run these commands again.
	1. Run **Add-AzureAccount** and enter the  user name and password that you use to sign in to the Azure Portal.
	2. Run **Get-AzureSubscription** to view all the subscriptions for this account.
	3. Run **Select-AzureSubscription** to select the subscription that you want to work with. This subscription should be the same as the one you used in the Azure portal.
4. Switch to AzureResourceManager mode as the Azure Data Factory cmdlets are available in this mode: **Switch-AzureMode AzureResourceManager**.
  

##In this tutorial
The following table lists the steps you will perform as part of the tutorial and their descriptions. 

Step | Description
-----| -----------
[Create an Azure Data Factory](#create-data-factory) | In this step, you will create an Azure data factory named **ADFTutorialDataFactoryPSH**. 
[Create linked services](#create-linked-services) | In this step, you will create two linked services: **StorageLinkedService** and **AzureSqlLinkedService**. The StorageLinkedService links an Azure storage and AzureSqlLinkedService links an Azure SQL database to the ADFTutorialDataFactoryPSH.
[Create input and output datasets](#create-datasets) | In this step, you will define two data sets (**EmpTableFromBlob** and **EmpSQLTable**) that are used as input and output tables for the **Copy Activity** in the ADFTutorialPipeline that you will create in the next step.
[Create and run a pipeline](#create-pipeline) | In this step, you will create a pipeline named **ADFTutorialPipeline** in the data factory: **ADFTutorialDataFactoryPSH**. . The pipeline will have a **Copy Activity** that copies data from an Azure blob to an output Azure database table.
[Monitor data sets and pipeline](#monitor-pipeline) | In this step, you will monitor the datasets and the pipeline using Azure PowerShell in this step.

## Create data factory
In this step, you use the Azure PowerShell to create an Azure data factory named **ADFTutorialDataFactoryPSH**.

1. Start Azure PowerShell and run the following command. Keep Azure PowerShell open until the end of this tutorial. If you close and reopen, you need to run these commands again.
	- Run **Login-AzureRmAccount** and enter the  user name and password that you use to sign in to the Azure Portal.  
	- Run **Get-AzureSubscription** to view all the subscriptions for this account.
	- Run **Select-AzureSubscription <Name of the subscription>** to select the subscription that you want to work with. This subscription should be the same as the one you used in the Azure portal.
3. Create an Azure resource group named: **ADFTutorialResourceGroup** by running the following command.
   
		New-AzureRmResourceGroup -Name ADFTutorialResourceGroup  -Location "West US"

	Some of the steps in this tutorial assume that you use the resource group named **ADFTutorialResourceGroup**. If you use a different resource group, you will need to use it in place of ADFTutorialResourceGroup in this tutorial. 
4. Run the **New-AzureRmDataFactory** cmdlet to create a data factory named: **ADFTutorialDataFactoryPSH**.  

		New-AzureRmDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name ADFTutorialDataFactoryPSH –Location "West US"

	
Please note the following:
 
- The name of the Azure data factory must be globally unique. If you receive the error: **Data factory name “ADFTutorialDataFactoryPSH” is not available**, change the name (for example, yournameADFTutorialDataFactoryPSH). Use this name in place of ADFTutorialFactoryPSH while performing steps in this tutorial. See [Data Factory - Naming Rules](data-factory-naming-rules.md) topic for naming rules for Data Factory artifacts.
- To create Data Factory instances, you need to be a contributor/administrator of the Azure subscription
- The name of the data factory may be registered as a DNS name in the future and hence become publically visible.
- If you receive the error: "**This subscription is not registered to use namespace Microsoft.DataFactory**", do one of the following and try publishing again: 

	- In Azure PowerShell, run the following command to register the Data Factory provider. 
		
			Register-AzureRmResourceProvider -ProviderNamespace Microsoft.DataFactory
	
		You can run the following command to confirm that the Data Factory provider is registerd. 
	
			Get-AzureRmResourceProvider
	- Login using the Azure subscription into the [Azure portal](https://portal.azure.com) and navigate to a Data Factory blade (or) create a data factory in the Azure portal. This automatically registers the provider for you.

## Create linked services
Linked services link data stores or compute services to an Azure data factory. A data store can be an Azure Storage, Azure SQL Database or an on-premises SQL Server database that contains input data or stores output data for a Data Factory pipeline. A compute service is the service that processes  input data and produces output data. 

In this step, you will create two linked services: **StorageLinkedService** and **AzureSqlLinkedService**. StorageLinkedService linked service links an Azure Storage Account and AzureSqlLinkedService links an Azure SQL database to the data factory: **ADFTutorialDataFactoryPSH**. You will create a pipeline later in this tutorial that copies data from a blob container in StorageLinkedService to a SQL table in AzureSqlLinkedService.

### Create a linked service for an Azure storage account
1.	Create a JSON file named **StorageLinkedService.json** in the **C:\ADFGetStartedPSH** with the following content. Create the folder ADFGetStartedPSH if it does not already exist.

			{
		  		"name": "StorageLinkedService",
		  		"properties": {
	    			"type": "AzureStorage",
		    		"typeProperties": {
		      			"connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
		    		}
		  		}
			}

	Replace **accountname** with the name of your storage account and **accountkey** with the key for your Azure storage account.
2.	In the **Azure PowerShell**, switch to the **ADFGetStartedPSH** folder. 
3.	You can use the **New-AzureRmDataFactoryLinkedService** cmdlet to create a linked service. This cmdlet and other Data Factory cmdlets you use in this tutorial require you to pass values for the **ResourceGroupName** and **DataFactoryName** parameters. Alternatively, you can use **Get-AzureRmDataFactory** to get a DataFactory object and pass the object without typing ResourceGroupName and DataFactoryName each time you run a cmdlet. Run the following command to assign the output of the **Get-AzureRmDataFactory** cmdlet to a variable: **$df**. 

		$df=Get-AzureRmDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name ADFTutorialDataFactoryPSH

4.	Now, run the **New-AzureRmDataFactoryLinkedService** cmdlet to create the linked service: **StorageLinkedService**. 

		New-AzureRmDataFactoryLinkedService $df -File .\StorageLinkedService.json

	If you hadn't run the **Get-AzureRmDataFactory** cmdlet and assigned the output to **$df** variable, you would have to specify values for the ResourceGroupName and DataFactoryName parameters as follows.   
		
		New-AzureRmDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactoryPSH -File .\StorageLinkedService.json

	If you close the Azure PowerShell in the middle of the tutorial, you will have run the Get-AzureRmDataFactory cmdlet next time you launch Azure PowerShell to complete the tutorial.

### Create a linked service for an Azure SQL Database
1.	Create a JSON file named AzureSqlLinkedService.json with the following content.

			{
				"name": "AzureSqlLinkedService",
				"properties": {
					"type": "AzureSqlDatabase",
					"typeProperties": {
				      	"connectionString": "Server=tcp:<server>.database.windows.net,1433;Database=<databasename>;User ID=user@server;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
					}
		  		}
			}

	Replace **servername**, **databasename**, **username@servername**, and **password** with names of your Azure SQL server, database, user account, and  password.

2.	Run the following command to create a linked service. 
	
		New-AzureRmDataFactoryLinkedService $df -File .\AzureSqlLinkedService.json

	Confirm that the **Allow access to Azure services** setting is turned ON for your Azure SQL server. To verify and turn it on, do the following:

	1. Click **BROWSE** hub on the left and click **SQL servers**.
	2. Select your server, and click **SETTINGS** on the SQL SERVER blade.
	3. In the **SETTINGS** blade, click **Firewall**.
	4. In the **Firewalll settings** blade, click **ON** for **Allow access to Azure services**.
	5. Click **ACTIVE** hub on the left to switch to the **Data Factory** blade you were on.
	

## Create datasets

In the previous step, you created linked services **StorageLinkedService** and **AzureSqlLinkedService** to link an Azure Storage account and Azure SQL database to the data factory: **ADFTutorialDataFactoryPSH**. In this step, you will create datasets that represent the input and output data for the Copy Activity in the pipeline you will be creating in the next step. 

A table is a rectangular dataset and it is the only type of dataset that is supported at this time. The input table in this tutorial refers to a blob container in the Azure Storage that StorageLinkedService points to and the output table refers to a SQL table in the Azure SQL database that AzureSqlLinkedService points to.  

### Prepare Azure Blob Storage and Azure SQL Database for the tutorial
Skip this step if you have gone through the tutorial from [Copy data from Blob Storage to SQL Database](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) article. 

You need to perform the following steps to prepare the Azure blob storage and Azure SQL database for this tutorial. 
 
* Create a blob container named **adftutorial** in the Azure blob storage that **StorageLinkedService** points to. 
* Create and upload a text file, **emp.txt**, as a blob to the **adftutorial** container. 
* Create a table named **emp** in the Azure SQL Database in the Azure SQL database that **AzureSqlLinkedService** points to.


1. Launch Notepad, paste the following text, and save it as **emp.txt** to **C:\ADFGetStartedPSH** folder on your hard drive. 

        John, Doe
		Jane, Doe
				
2. Use tools such as [Azure Storage Explorer](https://azurestorageexplorer.codeplex.com/) to create the **adftutorial** container and to upload the **emp.txt** file to the container.

    ![Azure Storage Explorer](media/data-factory-copy-activity-tutorial-using-powershell/getstarted-storage-explorer.png)
3. Use the following SQL script to create the **emp** table in your Azure SQL Database.  


        CREATE TABLE dbo.emp 
		(
			ID int IDENTITY(1,1) NOT NULL,
			FirstName varchar(50),
			LastName varchar(50),
		)
		GO

		CREATE CLUSTERED INDEX IX_emp_ID ON dbo.emp (ID); 

	If you have SQL Server 2014 installed on your computer: follow instructions from [Step 2: Connect to SQL Database of the Managing Azure SQL Database using SQL Server Management Studio][sql-management-studio] article to connect to your Azure SQL server and run the SQL script.

	If you have Visual Studio 2013 installed on your computer: in the Azure Portal ([http://portal.azure.com](http://portal.sazure.com)), click **BROWSE** hub on the left, click **SQL servers**, select your database, and click **Open in Visual Studio** button on toolbar to connect to your Azure SQL server and run the script. If your client is not allowed to access the Azure SQL server, you will need to configure firewall for your Azure SQL server to allow access from your machine (IP Address). See the article above for steps to configure the firewall for your Azure SQL server.
		
### Create input dataset 
A table is a rectangular dataset and has a schema. In this step, you will create a table named **EmpBlobTable** that points to a blob container in the Azure Storage represented by the **StorageLinkedService** linked service. This blob container (**adftutorial**) contains the input data in the file: **emp.txt**. 

1.	Create a JSON file named **EmpBlobTable.json** in the **C:\ADFGetStartedPSH** folder with the following content:

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
	
	Note the following: 
	
	- dataset **type** is set to **AzureBlob**.
	- **linkedServiceName** is set to **StorageLinkedService**. 
	- **folderPath** is set to the **adftutorial** container. 
	- **fileName** is set to **emp.txt**. If you do not specify the name of the blob, data from all blobs in the container is considered as an input data.  
	- format **type** is set to **TextFormat**
	- There are two fields in the text file – **FirstName** and **LastName** – separated by a comma character (**columnDelimiter**)	
	- The **availability** is set to **hourly** (**frequency** is set to **hour** and **interval** is set to **1** ), so the Data Factory service will look for input data every hour in the root folder in the blob container (**adftutorial**) you specified.

	if you don't specify a **fileName** for an **input** **table**, all files/blobs from the input folder (**folderPath**) are considered as inputs. If you specify a fileName in the JSON, only the specified file/blob is considered asn input. 
 
	If you do not specify a **fileName** for an **output table**, the generated files in the **folderPath** are named in the following format: Data.<Guid\>.txt (example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt.).

	To set **folderPath** and **fileName** dynamically based on the **SliceStart** time, use the **partitionedBy** property. In the following example, folderPath uses Year, Month, and Day from from the SliceStart (start time of the slice being processed) and fileName uses Hour from the SliceStart. For example, if a slice is being produced for 2014-10-20T08:00:00, the folderName is set to wikidatagateway/wikisampledataout/2014/10/20 and the fileName is set to 08.csv. 

			"folderPath": "wikidatagateway/wikisampledataout/{Year}/{Month}/{Day}",
	        "fileName": "{Hour}.csv",
	        "partitionedBy": 
	        [
	        	{ "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
	            { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "MM" } }, 
	            { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "dd" } }, 
	            { "name": "Hour", "value": { "type": "DateTime", "date": "SliceStart", "format": "hh" } } 
	        ],

	See [JSON Scripting Reference](http://go.microsoft.com/fwlink/?LinkId=516971) for details about JSON properties.

2.	Run the following command to create the Data Factory dataset.

		New-AzureRmDataFactoryDataset $df -File .\EmpBlobTable.json

### Create output dataset
In this part of the step, you will create an output table named **EmpSQLTable** that points to a SQL table (**emp**) in the Azure SQL database that is represented by the **AzureSqlLinkedService** linked service. The pipeline copies data from the input blob to the **emp** table. 

1.	Create a JSON file named **EmpSQLTable.json** in the **C:\ADFGetStartedPSH** folder with the following content.
		
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

     Note the following: 
	
	* dataset **type** is set to **AzureSqlTable**.
	* **linkedServiceName** is set to **AzureSqlLinkedService**.
	* **tablename** is set to **emp**.
	* There are three columns – **ID**, **FirstName**, and **LastName** – in the emp table in the database, but ID is an identity column, so you need to specify only **FirstName** and **LastName** here.
	* The **availability** is set to **hourly** (**frequency** set to **hour** and **interval** set to **1**).  The Data Factory service will generate an output data slice every hour in the **emp** table in the Azure SQL database.

2.	Run the following command to create the Data Factory dataset. 
	
		New-AzureRmDataFactoryDataset $df -File .\EmpSQLTable.json


## Create pipeline
In this step, you create a pipeline with a **Copy Activity** that uses **EmpTableFromBlob** as input and **EmpSQLTable** as output.

1.	Create a JSON file named **ADFTutorialPipeline.json** in the **C:\ADFGetStartedPSH** folder with the following content: 
	
			 {
			  "name": "ADFTutorialPipeline",
			  "properties": {
			    "description": "Copy data from a blob to Azure SQL table",
			    "activities": [
			      {
			        "name": "CopyFromBlobToSQL",
			        "description": "Push Regional Effectiveness Campaign data to Azure SQL database",
			        "type": "Copy",
			        "inputs": [
			          {
			            "name": "EmpTableFromBlob"
			          }
			        ],
			        "outputs": [
			          {
			            "name": "EmpSQLTable"
			          }
			        ],
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
			    "start": "2015-12-09T00:00:00Z",
			    "end": "2015-12-10T00:00:00Z",
			    "isPaused": false
			  }
			}

	Note the following:

	- In the activities section, there is only one activity whose **type** is set to **Copy**.
	- Input for the activity is set to **EmpTableFromBlob** and output for the activity is set to **EmpSQLTable**.
	- In the **transformation** section, **BlobSource** is specified as the source type and **SqlSink** is specified as the sink type.

	Replace the value of the **start** property with the current day and **end** value with the next day. Both start and end datetimes must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-10-14T16:32:41Z. The **end** time is optional, but we will use it in this tutorial. 
	
	If you do not specify value for the **end** property, it is calculated as "**start + 48 hours**". To run the pipeline indefinitely, specify **9/9/9999** as the value for the **end** property.
	
	In the example above, there will be 24 data slices as each data slice is produced hourly.
	
	See [JSON Scripting Reference](http://go.microsoft.com/fwlink/?LinkId=516971) for details about JSON properties.
2.	Run the following command to create the Data Factory table. 
		
		New-AzureRmDataFactoryPipeline $df -File .\ADFTutorialPipeline.json

**Congratulations!** You have successfully created an Azure data factory, linked services, tables, and a pipeline and scheduled the pipeline.

## Monitor pipeline
In this step, you will use the Azure PowerShell to monitor what’s going on in an Azure data factory.

1.	Run **Get-AzureRmDataFactory** and assign the output to a variable $df.

		$df=Get-AzureRmDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name ADFTutorialDataFactoryPSH
 
2.	Run **Get-AzureRmDataFactorySlice** to get details about all slices of the **EmpSQLTable**, which is the output table of the pipeline.  

		Get-AzureRmDataFactorySlice $df -DatasetName EmpSQLTable -StartDateTime 2015-03-03T00:00:00

	Replace year, month, and date part of the **StartDateTime** parameter with the current year, month, and date. This should match the **Start** value in the pipeline JSON. 

	You should see 24 slices, one for each hour from 12 AM of the current day to 12 AM of the next day. 
	
	**First slice:**

		ResourceGroupName : ADFTutorialResourceGroup
		DataFactoryName   : ADFTutorialDataFactoryPSH
		TableName         : EmpSQLTable
		Start             : 3/3/2015 12:00:00 AM
		End               : 3/3/2015 1:00:00 AM
		RetryCount        : 0
		Status            : Waiting
		LatencyStatus     :
		LongRetryCount    : 0

	**Last slice:**

		ResourceGroupName : ADFTutorialResourceGroup
		DataFactoryName   : ADFTutorialDataFactoryPSH
		TableName         : EmpSQLTable
		Start             : 3/4/2015 11:00:00 PM
		End               : 3/4/2015 12:00:00 AM
		RetryCount        : 0
		Status            : Waiting
		LatencyStatus     : 
		LongRetryCount    : 0

3.	Run **Get-AzureRmDataFactoryRun** to get the details of activity runs for a **specific** slice. Change the value of the **StartDateTime** parameter to match the **Start** time of the slice from the output above. The value of the **StartDateTime** must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-03-03T22:00:00Z.

		Get-AzureRmDataFactoryRun $df -DatasetName EmpSQLTable -StartDateTime 2015-03-03T22:00:00

	You should see output similar to the following:

		Id                  : 3404c187-c889-4f88-933b-2a2f5cd84e90_635614488000000000_635614524000000000_EmpSQLTable
		ResourceGroupName   : ADFTutorialResourceGroup
		DataFactoryName     : ADFTutorialDataFactoryPSH
		TableName           : EmpSQLTable
		ProcessingStartTime : 3/3/2015 11:03:28 PM
		ProcessingEndTime   : 3/3/2015 11:04:36 PM
		PercentComplete     : 100
		DataSliceStart      : 3/8/2015 10:00:00 PM
		DataSliceEnd        : 3/8/2015 11:00:00 PM
		Status              : Succeeded
		Timestamp           : 3/8/2015 11:03:28 PM
		RetryAttempt        : 0
		Properties          : {}
		ErrorMessage        :
		ActivityName        : CopyFromBlobToSQL
		PipelineName        : ADFTutorialPipeline
		Type                : Copy

See [Data Factory Cmdlet Reference][cmdlet-reference] for comprehensive documentation on Data Factory cmdlets. 

## Summary
In this tutorial, you created an Azure data factory to copy data from an Azure blob to an Azure SQL database. You used PowerShell to create the data factory, linked services, datasets, and a pipeline. Here are the high level steps you performed in this tutorial:  

1.	Created an Azure **data factory**.
2.	Created **linked services**:
	1. An **Azure Storage** linked service to link your Azure Storage account that holds input data. 	
	2. An **Azure SQL** linked service to link your Azure SQL database that holds the output data. 
3.	Created **datasets** which describe input data and output data for pipelines.
4.	Created a **pipeline** with a **Copy Activity** with **BlobSource** as source and **SqlSink** as sink. 

## See Also
| Topic | Description |
| :---- | :---- |
| [Data Movement Activities](data-factory-data-movement-activities.md) | This article provides detailed information about the Copy Activity you used in the tutorial. |
| [Scheduling and execution](data-factory-scheduling-and-execution.md) | This article explains the scheduling and execution aspects of Azure Data Factory application model. |
| [Pipelines](data-factory-create-pipelines.md) | This article will help you understand pipelines and activities in Azure Data Factory and how to leverage them to construct end-to-end data-driven workflows for your scenario or business. |
| [Datasets](data-factory-create-datasets.md) | This article will help you understand datasets in Azure Data Factory.
| [Monitor and manage pipelines using Monitoring App](data-factory-monitor-manage-app.md) | This article describes how to monitor, manage, and debug pipelines using the Monitoring & Management App. 



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
 