<properties
	pageTitle="Build your first data factory (PowerShell) | Microsoft Azure"
	description="In this tutorial, you will create a sample Azure Data Factory pipeline using Azure PowerShell."
	services="data-factory"
	documentationCenter=""
	authors="spelluru"
	manager="jhubbard"
	editor="monicar"
/>

<tags
	ms.service="data-factory"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="08/01/2016"
	ms.author="spelluru"/>

# Build your first Azure data factory using Azure PowerShell
> [AZURE.SELECTOR]
- [Tutorial Overview](data-factory-build-your-first-pipeline.md)
- [Using Data Factory Editor](data-factory-build-your-first-pipeline-using-editor.md)
- [Using PowerShell](data-factory-build-your-first-pipeline-using-powershell.md)
- [Using Visual Studio](data-factory-build-your-first-pipeline-using-vs.md)
- [Using Resource Manager Template](data-factory-build-your-first-pipeline-using-arm.md)


In this article, you will learn how to use the Azure PowerShell to create your first Azure data factory. 


## Prerequisites
Apart from prerequisites listed in the Tutorial Overview topic, you need to install the following:

- You **must** read through [Tutorial Overview](data-factory-build-your-first-pipeline.md) article and complete the prerequisite steps before proceeding further.
- **Azure PowerShell**. Follow instructions in [How to install and configure Azure PowerShell](../powershell-install-configure.md) article to install latest version of Azure PowerShell on your computer.
- (optional) This article does not cover all the Data Factory cmdlets. See [Data Factory Cmdlet Reference](https://msdn.microsoft.com/library/dn820234.aspx) for comprehensive documentation on Data Factory cmdlets. 

If you are using Azure PowerShell of **version < 1.0**, You will need to use cmdlets that are documented [here](https://msdn.microsoft.com/library/azure/dn820234.aspx). You also will need to run the following commands before using the Data Factory cmdlets: 
 
1. Start Azure PowerShell and run the following commands. Keep Azure PowerShell open until the end of this tutorial. If you close and reopen, you need to run these commands again.
	1. Run **Add-AzureAccount** and enter the  user name and password that you use to sign in to the Azure Portal.
	2. Run **Get-AzureSubscription** to view all the subscriptions for this account.
	3. Run **Select-AzureSubscription** to select the subscription that you want to work with. This subscription should be the same as the one you used in the Azure portal.
4. Switch to AzureResourceManager mode as the Azure Data Factory cmdlets are available in this mode: **Switch-AzureMode AzureResourceManager**.

Please see [Deprecation of Switch AzureMode in Azure PowerShell](https://github.com/Azure/azure-powershell/wiki/Deprecation-of-Switch-AzureMode-in-Azure-PowerShell) for details. 


## Create data factory

In this step, you use Azure PowerShell to create an Azure Data Factory named **FirstDataFactoryPSH**. A data factory can have one or more pipelines. A pipeline can have one or more activities in it. For example, a Copy Activity to copy data from a source to a destination data store and a HDInsight Hive activity to run Hive script to transform input data to product output data. Let's start with creating the data factory in this step. 

1. Start Azure PowerShell and run the following command. Keep Azure PowerShell open until the end of this tutorial. If you close and reopen, you need to run these commands again.
	- Run **Login-AzureRmAccount** and enter the  user name and password that you use to sign in to the Azure Portal.  
	- Run **Get-AzureRmSubscription** to view all the subscriptions for this account.
	- Run **Select-AzureRmSubscription <Name of the subscription>** to select the subscription that you want to work with. This subscription should be the same as the one you used in the Azure portal.
3. Create an Azure resource group named **ADFTutorialResourceGroup** by running the following command.

		New-AzureRmResourceGroup -Name ADFTutorialResourceGroup  -Location "West US"

	Some of the steps in this tutorial assume that you use the resource group named ADFTutorialResourceGroup. If you use a different resource group, you will need to use it in place of ADFTutorialResourceGroup in this tutorial.
4. Run the **New-AzureRmDataFactory** cmdlet to create a data factory named **FirstDataFactoryPSH**.  

		New-AzureRmDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name FirstDataFactoryPSH –Location "West US"


Please note the following:
 
- The name of the Azure Data Factory must be globally unique. If you receive the error **Data factory name “FirstDataFactoryPSH” is not available**, change the name (for example, yournameFirstDataFactoryPSH). Use this name in place of ADFTutorialFactoryPSH while performing steps in this tutorial. See [Data Factory - Naming Rules](data-factory-naming-rules.md) topic for naming rules for Data Factory artifacts.
- To create Data Factory instances, you need to be a contributor/administrator of the Azure subscription
- The name of the data factory may be registered as a DNS name in the future and hence become publically visible.
- If you receive the error: "**This subscription is not registered to use namespace Microsoft.DataFactory**", do one of the following and try publishing again: 

	- In Azure PowerShell, run the following command to register the Data Factory provider. 
		
			Register-AzureRmResourceProvider -ProviderNamespace Microsoft.DataFactory
	
		You can run the following command to confirm that the Data Factory provider is registerd. 
	
			Get-AzureRmResourceProvider
	- Login using the Azure subscription into the [Azure portal](https://portal.azure.com) and navigate to a Data Factory blade (or) create a data factory in the Azure portal. This automatically registers the provider for you.

Before creating a pipeline, you need to create a few Data Factory entities first. You first create linked services to link data stores/computes to your data store, define input and output datasets to represent data in linked data stores, and then create the pipeline with a activity that use these datasets. 

## Create linked services 
In this step, you will link your Azure Storage account and an on-demand Azure HDInsight cluster to your data factory. The Azure Storage account will hold the input and output data for the pipeline in this sample. The HDInsight linked service is used to run Hive script specified in the activity of the pipeline in this sample. You need to identify what data store/compute services are used in your scenario and link those services to the data factory by creating linked services.

### Create Azure Storage linked service
In this step, you will link your Azure Storage account to your data factory. For the purpose of this tutorial, you use the same Azure Storage account to store input/output data and the HQL script file.

1. Create a JSON file named StorageLinkedService.json in the C:\ADFGetStarted folder with the following content. Create the folder ADFGetStarted if it does not already exist.

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

	Replace **account name** with the name of your Azure storage account and **account key** with the access key of the Azure storage account. To learn how to get your storage access key, see [View, copy and regenerate storage access keys](https://azure.microsoft.com/documentation/articles/storage-create-storage-account/#view-copy-and-regenerate-storage-access-keys).

2. In Azure PowerShell, switch to the ADFGetStarted folder.
3. You can use the **New-AzureRmDataFactoryLinkedService** cmdlet to create a linked service. This cmdlet and other Data Factory cmdlets you use in this tutorial require you to pass values for the *ResourceGroupName* and *DataFactoryName* parameters. Alternatively, you can use **Get-AzureRmDataFactory** to get a **DataFactory** object and pass the object without typing *ResourceGroupName* and *DataFactoryName* each time you run a cmdlet. Run the following command to assign the output of the **Get-AzureRmDataFactory** cmdlet to a **$df** variable.

		$df=Get-AzureRmDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name FirstDataFactoryPSH

4. Now, run the **New-AzureRmDataFactoryLinkedService** cmdlet to create the linked **StorageLinkedService** service.

		New-AzureRmDataFactoryLinkedService $df -File .\StorageLinkedService.json

	If you hadn't run the **Get-AzureRmDataFactory** cmdlet and assigned the output to the **$df** variable, you would have to specify values for the *ResourceGroupName* and *DataFactoryName* parameters as follows.

		New-AzureRmDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName FirstDataFactoryPSH -File .\StorageLinkedService.json

	If you close Azure PowerShell in the middle of the tutorial, you will have run the **Get-AzureRmDataFactory** cmdlet next time you start Azure PowerShell to complete the tutorial.

### Create Azure HDInsight linked service
In this step, you will link an on-demand HDInsight cluster to your data factory. The HDInsight cluster is automatically created at runtime and deleted after it is done processing and idle for the specified amount of time. You could use your own HDInsight cluster instead of using an on-demand HDInsight cluster. See [Compute Linked Services](data-factory-compute-linked-services.md) for details.  

1. Create a JSON file named **HDInsightOnDemandLinkedService**.json in the **C:\ADFGetStarted** folder with the following content.

		{
		  "name": "HDInsightOnDemandLinkedService",
		  "properties": {
		    "type": "HDInsightOnDemand",
		    "typeProperties": {
		      "version": "3.2",
		      "clusterSize": 1,
		      "timeToLive": "00:30:00",
		      "linkedServiceName": "StorageLinkedService"
		    }
		  }
		}

	The following table provides descriptions for the JSON properties used in the snippet:

	| Property | Description |
	| :------- | :---------- |
	| Version | This specifies that the version of the HDInsight created to be 3.2. | 
	| ClusterSize | This creates a one node HDInsight cluster. | 
	| TimeToLive | This specifies that the idle time for the HDInsight cluster, before it is deleted. |
	| linkedServiceName | This specifies the storage account that will be used to store the logs that are generated by HDInsight |

	Note the following: 
	
	- The Data Factory creates a **Windows-based** HDInsight cluster for you with the above JSON. You could also have it create a **Linux-based** HDInsight cluster. See [On-demand HDInsight Linked Service](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service) for details. 
	- You could use **your own HDInsight cluster** instead of using an on-demand HDInsight cluster. See [HDInsight Linked Service](data-factory-compute-linked-services.md#azure-hdinsight-linked-service) for details.
	- The HDInsight cluster creates a **default container** in the blob storage you specified in the JSON (**linkedServiceName**). HDInsight does not delete this container when the cluster is deleted. This is by design. With on-demand HDInsight linked service, a HDInsight cluster is created every time a slice needs to be processed unless there is an existing live cluster (**timeToLive**) and is deleted when the processing is done.
	
		As more and more slices are processed, you will see a lot of containers in your Azure blob storage. If you do not need them for troubleshooting of the jobs, you may want to delete them to reduce the storage cost. The name of these containers follow a pattern: "adf**yourdatafactoryname**-**linkedservicename**-datetimestamp". Use tools such as [Microsoft Storage Explorer](http://storageexplorer.com/) to delete containers in your Azure blob storage.

	See [On-demand HDInsight Linked Service](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service) for details. 
2. Run the **New-AzureRmDataFactoryLinkedService** cmdlet to create the linked service called HDInsightOnDemandLinkedService.

		New-AzureRmDataFactoryLinkedService $df -File .\HDInsightOnDemandLinkedService.json


## Create datasets
In this step, you will create datasets to represent the input and output data for Hive processing. These datasets refer to the **StorageLinkedService** you have created earlier in this tutorial. The linked service points to an Azure Storage account and datasets specify container, folder, file name in the storage that holds input and output data.   

### Create input dataset
1. Create a JSON file named **InputTable.json** in the **C:\ADFGetStarted** folder with the following content:

		{
			"name": "AzureBlobInput",
		    "properties": {
		        "type": "AzureBlob",
		        "linkedServiceName": "StorageLinkedService",
		        "typeProperties": {
		            "fileName": "input.log",
		            "folderPath": "adfgetstarted/inputdata",
		            "format": {
		                "type": "TextFormat",
		                "columnDelimiter": ","
		            }
		        },
		        "availability": {
		            "frequency": "Month",
		            "interval": 1
		        },
		        "external": true,
		        "policy": {}
		    }
		} 

	The above JSON defines a dataset named **AzureBlobInput**, which represents input data for an activity in the pipeline. In addition, it specifies that the input data is located in the blob container called **adfgetstarted** and the folder called **inputdata**.

	The following table provides descriptions for the JSON properties used in the snippet:

	| Property | Description |
	| :------- | :---------- |
	| type | The type property is set to AzureBlob because data resides in Azure blob storage. |  
	| linkedServiceName | refers to the StorageLinkedService you created earlier. |
	| fileName | This property is optional. If you omit this property, all the files from the folderPath are picked. In this case, only the input.log is processed. |
	| type | The log files are in text format, so we will use TextFormat. | 
	| columnDelimiter | columns in the log files are delimited by , (comma) |
	| frequency/interval | frequency set to Month and interval is 1, which means that the input slices are available monthly. | 
	| external | this property is set to true if the input data is not generated by the Data Factory service. | 

2. Run the following command in Azure PowerShell to create the Data Factory dataset.

		New-AzureRmDataFactoryDataset $df -File .\InputTable.json

### Create output dataset
Now, you will create the output dataset to represent the output data stored in the Azure Blob storage.

1. Create a JSON file named **OutputTable.json** in the **C:\ADFGetStarted** folder with the following content:

		{
		  "name": "AzureBlobOutput",
		  "properties": {
		    "type": "AzureBlob",
		    "linkedServiceName": "StorageLinkedService",
		    "typeProperties": {
		      "folderPath": "adfgetstarted/partitioneddata",
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

	The above JSON defines a dataset named **AzureBlobOutput**, which represents output data for an activity in the pipeline. In addition, it specifies that the results are stored in the blob container called **adfgetstarted** and the folder called **partitioneddata**. The **availability** section specifies that the output dataset is produced on a monthly basis.

2. Run the following command in Azure PowerShell to create the Data Factory dataset.

		New-AzureRmDataFactoryDataset $df -File .\OutputTable.json

## Create pipeline
In this step, you will create your first pipeline with a **HDInsightHive** activity. Note that input slice is available monthly (frequency: Month, interval: 1), output slice is produced monthly, and the scheduler property for the activity is also set to monthly (see below). The settings for the output dataset and the activity scheduler must match. At this time, output dataset is what drives the schedule, so you must create an output dataset even if the activity does not produce any output. If the activity doesn't take any input, you can skip creating the input dataset. The properties used in the following JSON are explained at the end of this section. 


1. Create a JSON file named MyFirstPipelinePSH.json in the C:\ADFGetStarted folder with the following content:

	> [AZURE.IMPORTANT] Replace **storageaccountname** with the name of your storage account in the  JSON.
		
		{
		    "name": "MyFirstPipeline",
		    "properties": {
		        "description": "My first Azure Data Factory pipeline",
		        "activities": [
		            {
		                "type": "HDInsightHive",
		                "typeProperties": {
		                    "scriptPath": "adfgetstarted/script/partitionweblogs.hql",
		                    "scriptLinkedService": "StorageLinkedService",
		                    "defines": {
		                        "inputtable": "wasb://adfgetstarted@<storageaccountname>.blob.core.windows.net/inputdata",
		                        "partitionedtable": "wasb://adfgetstarted@<storageaccountname>.blob.core.windows.net/partitioneddata"
		                    }
		                },
		                "inputs": [
		                    {
		                        "name": "AzureBlobInput"
		                    }
		                ],
		                "outputs": [
		                    {
		                        "name": "AzureBlobOutput"
		                    }
		                ],
		                "policy": {
		                    "concurrency": 1,
		                    "retry": 3
		                },
		                "scheduler": {
		                    "frequency": "Month",
		                    "interval": 1
		                },
		                "name": "RunSampleHiveActivity",
		                "linkedServiceName": "HDInsightOnDemandLinkedService"
		            }
		        ],
		        "start": "2016-04-01T00:00:00Z",
		        "end": "2016-04-02T00:00:00Z",
		        "isPaused": false
		    }
		}

	In the JSON snippet, you are creating a pipeline that consists of a single activity that uses Hive to process Data on an HDInsight cluster.
	
	The Hive script file, **partitionweblogs.hql**, is stored in the Azure storage account (specified by the scriptLinkedService, called **StorageLinkedService**), and in **script** folder in the container **adfgetstarted**.

	The **defines** section is used to specify the runtime settings that will be passed to the hive script as Hive configuration values (e.g ${hiveconf:inputtable}, ${hiveconf:partitionedtable}).

	The **start** and **end** properties of the pipeline specifies the active period of the pipeline.

	In the activity JSON, you specify that the Hive script runs on the compute specified by the **linkedServiceName** – **HDInsightOnDemandLinkedService**.

	> [ACOM.NOTE] See [Anatomy of a Pipeline](data-factory-create-pipelines.md#anatomy-of-a-pipeline) for details about JSON properties used in the above example. 
2.  Confirm that you see the **input.log** file in the **adfgetstarted/inputdata** folder in the Azure blob storage, and run the following command to deploy the pipeline. Since the **start** and **end** times are set in the past and **isPaused** is set to false, the pipeline (activity in the pipeline) runs immediately after you deploy. 

		New-AzureRmDataFactoryPipeline $df -File .\MyFirstPipelinePSH.json
5. Congratulations, you have successfully created your first pipeline using Azure PowerShell!

## Monitor pipeline
In this step, you will use Azure PowerShell to monitor what’s going on in an Azure data factory.

1. Run **Get-AzureRmDataFactory** and assign the output to a **$df** variable.

		$df=Get-AzureRmDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name FirstDataFactoryPSH

2. Run **Get-AzureRmDataFactorySlice** to get details about all slices of the **EmpSQLTable**, which is the output table of the pipeline.  

		Get-AzureRmDataFactorySlice $df -DatasetName AzureBlobOutput -StartDateTime 2014-02-01

	Notice that the StartDateTime you specify here is the same start time specified in the pipeline JSON. You should see output similar to the following.

		ResourceGroupName : ADFTutorialResourceGroup
		DataFactoryName   : FirstDataFactoryPSH
		DatasetName       : AzureBlobOutput
		Start             : 2/1/2014 12:00:00 AM
		End               : 3/1/2014 12:00:00 AM
		RetryCount        : 0
		State             : InProgress
		SubState          :
		LatencyStatus     :
		LongRetryCount    : 0


3. Run **Get-AzureRmDataFactoryRun** to get the details of activity runs for a specific slice.

		Get-AzureRmDataFactoryRun $df -DatasetName AzureBlobOutput -StartDateTime 2014-02-01

	You should see output similar to the following.
		
		Id                  : 0f6334f2-d56c-4d48-b427-d4f0fb4ef883_635268096000000000_635292288000000000_AzureBlobOutput
		ResourceGroupName   : ADFTutorialResourceGroup
		DataFactoryName     : FirstDataFactoryPSH
		DatasetName         : AzureBlobOutput
		ProcessingStartTime : 12/18/2015 4:50:33 AM
		ProcessingEndTime   : 12/31/9999 11:59:59 PM
		PercentComplete     : 0
		DataSliceStart      : 2/1/2014 12:00:00 AM
		DataSliceEnd        : 3/1/2014 12:00:00 AM
		Status              : AllocatingResources
		Timestamp           : 12/18/2015 4:50:33 AM
		RetryAttempt        : 0
		Properties          : {}
		ErrorMessage        :
		ActivityName        : RunSampleHiveActivity
		PipelineName        : MyFirstPipeline
		Type                : Script

	You can keep running this cmdlet until you see the slice in **Ready** state or **Failed** state. When the slice is in Ready state, check the **partitioneddata** folder in the **adfgetstarted** container in your blob storage for the output data.  Note that the creation of an on-demand HDInsight cluster usually takes some time.

	![output data](./media/data-factory-build-your-first-pipeline-using-powershell/three-ouptut-files.png)


> [AZURE.IMPORTANT] The input file gets deleted when the slice is processed successfully. Therefore, if you want to rerun the slice or do the tutorial again, upload the input file (input.log) to the inputdata folder of the adfgetstarted container.

## Summary 
In this tutorial, you created an Azure data factory to process data by running Hive script on a HDInsight hadoop cluster. You used the Data Factory Editor in the Azure Portal to do the following steps:  

1.	Created an Azure **data factory**.
2.	Created two **linked services**:
	1.	**Azure Storage** linked service to link your Azure blob storage that holds input/output files to the data factory.
	2.	**Azure HDInsight** on-demand linked service to link an on-demand HDInsight Hadoop cluster to the data factory. Azure Data Factory creates a HDInsight Hadoop cluster just-in-time to process input data and produce output data. 
3.	Created two **datasets** which describe input and output data for HDInsight Hive activity in the pipeline. 
4.	Created a **pipeline** with a **HDInsight Hive** activity. 

## Next steps
In this article, you have created a pipeline with a transformation activity (HDInsight Activity) that runs a Hive script on an on-demand Azure HDInsight cluster. To see how to use a Copy Activity to copy data from an Azure Blob to Azure SQL, see [Tutorial: Copy data from an Azure Blob to Azure SQL](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).

## See Also
| Topic | Description |
| :---- | :---- |
| [Data Factory Cmdlet Reference](https://msdn.microsoft.com/library/azure/dn820234.aspx) |  See comprehensive documentation on Data Factory cmdlets |
| [Data Transformation Activities](data-factory-data-transformation-activities.md) | This article provides a list of data transformation activities (such as HDInsight Hive transformation you used in this tutorial) supported by Azure Data Factory. |
| [Scheduling and Execution](data-factory-scheduling-and-execution.md) | This article explains the scheduling and execution aspects of Azure Data Factory application model. |
| [Pipelines](data-factory-create-pipelines.md) | This article will help you understand pipelines and activities in Azure Data Factory and how to leverage them to construct end-to-end data-driven workflows for your scenario or business. |
| [Datasets](data-factory-create-datasets.md) | his article will help you understand datasets in Azure Data Factory.
| [Monitor and Manage Pipelines using Azure portal blades](data-factory-monitor-manage-pipelines.md) | This article describes how to monitor, manage and debug your pipelines using Azure portal blades. |
| [Monitor and manage pipelines using Monitoring App](data-factory-monitor-manage-app.md) | This article describes how to monitor, manage, and debug pipelines using the Monitoring & Management App. 

