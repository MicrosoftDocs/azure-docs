<properties
	pageTitle="Build your first Azure Data Factory pipeline using Azure PowerShell"
	description="In this tutorial, you will create a sample Azure Data Factory pipeline using Azure PowerShell."
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
	ms.date="10/15/2015"
	ms.author="spelluru"/>

# Build your first Azure Data Factory pipeline using Azure PowerShell
> [AZURE.SELECTOR]
- [Tutorial Overview](data-factory-build-your-first-pipeline.md)
- [Using Data Factory Editor](data-factory-build-your-first-pipeline-using-editor.md)
- [Using PowerShell](data-factory-build-your-first-pipeline-using-powershell.md)
- [Using Visual Studio](data-factory-build-your-first-pipeline-using-vs.md)


In this article, you will learn how to use Azure PowerShell to create your first pipeline. This tutorial consists of the following steps:

1.	Creating the data factory.
2.	Creating the linked services (data stores, computes) and datasets.
3.	Creating the pipeline.

This article does not provide a conceptual overview of the Azure Data Factory service. For a detailed overview of the service, see the [Introduction to Azure Data Factory](data-factory-introduction.md) article.

> [AZURE.IMPORTANT] Please go through the [Tutorial Overview](data-factory-build-your-first-pipeline.md) article and complete the pre-requisite steps before performing this tutorial.   

## Step 1: Creating the data factory

In this step, you use Azure PowerShell to create an Azure Data Factory named ADFTutorialDataFactoryPSH.

1. Start Azure PowerShell and run the following commands. Keep Azure PowerShell open until the end of this tutorial. If you close and reopen, you need to run these commands again.
	- Run **Add-AzureAccount** and enter the  user name and password that you use to sign in to the Azure preview portal.  
	- Run **Get-AzureSubscription** to view all the subscriptions for this account.
	- Run **Select-AzureSubscription** to select the subscription that you want to work with. This subscription should be the same as the one you used in the preview portal.
2. Switch to AzureResourceManager mode as the Azure Data Factory cmdlets are available in this mode.

		Switch-AzureMode AzureResourceManager
3. Create an Azure resource group named *ADFTutorialResourceGroup* by running the following command.

		New-AzureResourceGroup -Name ADFTutorialResourceGroup  -Location "West US"

	Some of the steps in this tutorial assume that you use the resource group named ADFTutorialResourceGroup. If you use a different resource group, you will need to use it in place of ADFTutorialResourceGroup in this tutorial.
4. Run the **New-AzureDataFactory** cmdlet to create a data factory named DataFactoryMyFirstPipelinePSH.  

		New-AzureDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name DataFactoryMyFirstPipelinePSH –Location "West US"

	> [AZURE.IMPORTANT] The name of the Azure Data Factory must be globally unique. If you receive the error **Data factory name “DataFactoryMyFirstPipelinePSH” is not available**, change the name (for example, yournameADFTutorialDataFactoryPSH). Use this name in place of ADFTutorialFactoryPSH while performing steps in this tutorial. See [Data Factory - Naming Rules](data-factory-naming-rules.md) topic for naming rules for Data Factory artifacts.
	> 
	> The name of the data factory may be registered as a DNS name in the future and hence become publically visible.

In the subsequent steps, you will learn how to create the linked services, datasets and pipeline that you will use in this tutorial.

## Step 2: Create linked services and datasets
In this step, you will link your Azure Storage account and an on-demand Azure HDInsight cluster to your data factory and then create a dataset to represent the output data from Hive processing.

### Create Azure Storage linked service
1.	Create a JSON file named StorageLinkedService.json in the C:\ADFGetStartedPSH folder with the following content. Create the folder ADFGetStartedPSH if it does not already exist.

		{
		    "name": "StorageLinkedService",
		    "properties": {
		        "type": "AzureStorage",
		        "description": "",
		        "typeProperties": {
		            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
		        }
		    }
		}

	Replace **account name** with the name of your Azure storage account and **account key** with the access key of the Azure storage account. To learn how to get your storage access key, see [View, copy and regenerate storage access keys](http://azure.microsoft.com/documentation/articles/storage-create-storage-account/#view-copy-and-regenerate-storage-access-keys).

2.	In Azure PowerShell, switch to the ADFGetStartedPSH folder.
3.	You can use the **New-AzureDataFactoryLinkedService** cmdlet to create a linked service. This cmdlet and other Data Factory cmdlets you use in this tutorial require you to pass values for the *ResourceGroupName* and *DataFactoryName* parameters. Alternatively, you can use **Get-AzureDataFactory** to get a **DataFactory** object and pass the object without typing *ResourceGroupName* and *DataFactoryName* each time you run a cmdlet. Run the following command to assign the output of the **Get-AzureDataFactory** cmdlet to a **$df** variable.

		$df=Get-AzureDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name DataFactoryMyFirstPipelinePSH

4.	Now, run the **New-AzureDataFactoryLinkedService** cmdlet to create the linked **StorageLinkedService** service.

		New-AzureDataFactoryLinkedService $df -File .\StorageLinkedService.json

	If you hadn't run the **Get-AzureDataFactory** cmdlet and assigned the output to the **$df** variable, you would have to specify values for the *ResourceGroupName* and *DataFactoryName* parameters as follows.

		New-AzureDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactoryPSH -File .\StorageLinkedService.json

	If you close Azure PowerShell in the middle of the tutorial, you will have run the **Get-AzureDataFactory** cmdlet next time you start Azure PowerShell to complete the tutorial.

### Create Azure HDInsight linked service
Now, you will create a linked service for an on-demand Azure HDInsight cluster that will be used to run the Hive script.

1.	Create a JSON file named HDInsightOnDemandLinkedService.json in the C:\ADFGetStartedPSH folder with the following content.


		{
		  "name": "HDInsightOnDemandLinkedService",
		  "properties": {
		    "type": "HDInsightOnDemand",
		    "typeProperties": {
		      "version": "3.1",
		      "clusterSize": 1,
		      "timeToLive": "00:30:00",
		      "jobsContainer": "adfjobs",
		      "linkedServiceName": "StorageLinkedService"
		    }
		  }
		}

	The following table provides descriptions for the JSON properties used in the snippet:

	Property | Description
	-------- | -----------
	Version | This specifies that the version of the HDInsight created to be 3.1.
	ClusterSize | This creates a one node HDInsight cluster.
	TimeToLive | This specifies that the idle time for the HDInsight cluster, before it is deleted.
	JobsContainer | This specifies the name of the job container that will be created to store the logs that are generated by HDInsight
	linkedServiceName | This specifies the storage account that will be used to store the logs that are generated by HDInsight
2. Run the **New-AzureDataFactoryLinkedService** cmdlet to create the linked service called HDInsightOnDemandLinkedService.

		New-AzureDataFactoryLinkedService $df -File .\HDInsightOnDemandLinkedService.json


### Create the output dataset
Now, you will create the output dataset to represent the data stored in the Azure Blob storage.

1.	Create a JSON file named OutputTable.json in the C:\ADFGetStartedPSH folder with the following content:

		{
		  "name": "AzureBlobOutput",
		  "properties": {
		    "type": "AzureBlob",
		    "linkedServiceName": "StorageLinkedService",
		    "typeProperties": {
		      "folderPath": "data/partitioneddata",
		      "format": {
		        "type": "TextFormat",
		        "columnDelimiter": ","
		      }
		    },
		    "availability": {
		      "frequency": "Month",
		      "interval": 1
		    }
		  }
		}

	In the previous example, you are creating a dataset called **AzureBlobOutput**, and specifying the structure of the data that will be produced by the Hive script. In addition, you specify that the results are stored in the blob container called **data** and the folder called **partitioneddata**. The **availability** section specifies that the output dataset is produced on a monthly basis.

2. Run the following command in Azure PowerShell to create the Data Factory dataset.

		New-AzureDataFactoryDataset $df -File .\OutputTable.json

## Step 3: Creating your first pipeline
In this step, you will create your first pipeline.

1.	Create a JSON file named MyFirstPipelinePSH.json in the C:\ADFGetStartedPSH folder with the following content:

	> [AZURE.IMPORTANT] Replace **storageaccountname** with the name of your storage account in the  JSON.

		{
		  "name": "MyFirstPipeline",
		  "properties": {
		    "description": "My first Azure Data Factory pipeline",
		    "activities": [
		      {
		        "type": "HDInsightHive",
		        "typeProperties": {
		          "scriptPath": "script/partitionweblogs.hql",
		          "scriptLinkedService": "StorageLinkedService",
		          "defines": {
		            "partitionedtable": "wasb://data@<storageaccountname>.blob.core.windows.net/partitioneddata"
		          }
		        },
		        "outputs": [
		          {
		            "name": "AzureBlobOutput"
		          }
		        ],
		        "policy": {
		          "concurrency": 1,
		          "retry": 3
		        },
		        "name": "RunSampleHiveActivity",
		        "linkedServiceName": "HDInsightOnDemandLinkedService"
		      }
		    ],
		    "start": "2014-01-01",
		    "end": "2014-01-02"
		  }
		}

	In the previous example, you are creating a pipeline that consists of a single activity that uses Hive to process data on an HDInsight cluster.

	The Hive script file, partitionweblogs.hql, is stored in the Azure storage account (specified by the scriptLinkedService, called StorageLinkedService), and in a container called **script**.

	The **extendedProperties** section is used to specify the runtime settings that will be passed to the hive script as Hive configuration values (for example, ${hiveconf:PartitionedData}).

	The **start** and **end** properties of the pipeline specifies the active period of the pipeline.

	In the activity JSON, you specify that the Hive script runs on the computer specified by the linked service – **HDInsightOnDemandLinkedService**.
2. Run the following command to create the Data Factory table.

		New-AzureDataFactoryPipeline $df -File .\MyFirstPipelinePSH.json
5. Congratulations, you have successfully created your first pipeline using Azure PowerShell!

### <a name="MonitorDataSetsAndPipeline"></a> Monitor the datasets and pipeline
In this step, you will use Azure PowerShell to monitor what’s going on in an Azure data factory.

1.	Run **Get-AzureDataFactory** and assign the output to a **$df** variable.

		$df=Get-AzureDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name DataFactoryMyFirstPipelinePSH

2.	Run **Get-AzureDataFactorySlice** to get details about all slices of the **EmpSQLTable**, which is the output table of the pipeline.  

		Get-AzureDataFactorySlice $df -TableName AzureBlobOutput -StartDateTime 2014-01-01

	Notice that the StartDateTime you specify here is the same start time specified in the pipeline JSON. You should see output similar to the following.

		ResourceGroupName : ADFTutorialResourceGroup
		DataFactoryName   : DataFactoryMyFirstPipelinePSH
		TableName         : AzureBlobOutput
		Start             : 1/1/2014 12:00:00 AM
		End               : 2/1/2014 12:00:00 AM
		RetryCount        : 0
		Status            : InProgress
		LatencyStatus     :
		LongRetryCount    : 0

3.	Run **Get-AzureDataFactoryRun** to get the details of activity runs for a specific slice.

		Get-AzureDataFactoryRun $df -TableName AzureBlobOutput -StartDateTime 2014-01-01

	You should see output similar to the following.

		Id                  : 4dbc6a07-537d-4005-a53e-6b9a4b844089_635241312000000000_635268096000000000_AzureBlobOutput
		ResourceGroupName   : ADFTutorialResourceGroup
		DataFactoryName     : DataFactoryMyFirstPipelinePSH
		TableName           : AzureBlobOutput
		ProcessingStartTime : 7/7/2015 1:14:18 AM
		ProcessingEndTime   : 12/31/9999 11:59:59 PM
		PercentComplete     : 0
		DataSliceStart      : 1/1/2014 12:00:00 AM
		DataSliceEnd        : 2/1/2014 12:00:00 AM
		Status              : AllocatingResources
		Timestamp           : 7/7/2015 1:14:18 AM
		RetryAttempt        : 0
		Properties          : {}
		ErrorMessage        :
		ActivityName        : RunSampleHiveActivity
		PipelineName        : MyFirstPipeline
		Type                : Script

	You can keep running this cmdlet until you see the slice in Ready state or Failed state. When the slice is in Ready state, check the partitioneddata folder in the data container in your blob storage for the output data.  Note that the creation of an on-demand HDInsight cluster usually takes some time.

See [Data Factory Cmdlet Reference](https://msdn.microsoft.com/library/azure/dn820234.aspx) for comprehensive documentation on Data Factory cmdlets.



## Next steps
In this article, you have created a pipeline with a transformation activity (HDInsight Activity) that runs a Hive script on an on-demand Azure HDInsight cluster. To see how to use a Copy Activity to copy data from an Azure Blob to Azure SQL, see [Tutorial: Copy data from an Azure Blob to Azure SQL](./data-factory-get-started.md).

## Send Feedback
We would really appreciate your feedback on this article. Please take a few minutes to submit your feedback via [email](mailto:adfdocfeedback@microsoft.com?subject=data-factory-build-your-first-pipeline-using-powershell.md). 
