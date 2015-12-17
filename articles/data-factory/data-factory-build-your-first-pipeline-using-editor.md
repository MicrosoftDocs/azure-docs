<properties
	pageTitle="Get started with Azure Data Factory (Azure Portal)"
	description="In this tutorial, you will create a sample Azure Data Factory pipeline using Data Factory Editor in the Azure Portal."
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
	ms.topic="hero-article" 
	ms.date="12/14/2015"
	ms.author="spelluru"/>

# Get started with Azure Data Factory (Data Factory Editor)
> [AZURE.SELECTOR]
- [Tutorial Overview](data-factory-build-your-first-pipeline.md)
- [Using Data Factory Editor](data-factory-build-your-first-pipeline-using-editor.md)
- [Using PowerShell](data-factory-build-your-first-pipeline-using-powershell.md)
- [Using Visual Studio](data-factory-build-your-first-pipeline-using-vs.md)
- [Using Resource Manager Template](data-factory-build-your-first-pipeline-using-arm.md)


In this article, you will learn how to use the [Azure Portal](https://portal.azure.com/) to create your first Azure data factory. This tutorial consists of the following steps:

1.	Creating the **data factory**. A data factory can contain one or more pipelines that move and process data. In this tutorial, you will create only one pipeline. 
2.	Creating the **linked services**. You create a linked service to link a data store or a compute service to the data factory. A data store such as Azure Storage holds input/output data of activities in the pipeline. A compute service such as Azure HDInsight processes/transforms data.    
3.	Create input and output **datasets**. An input dataset represents the input for an activity in the pipeline and an output dataset represents the output for the activity.
3.	Creating the **pipeline**. A pipeline can have one or more activities such as Copy Activity to copy data from a source to a destination (or) HDInsight Hive Activity to transform input data using Hive script to produce output data. 


> [AZURE.IMPORTANT] 
> Please go through the [Tutorial Overview](data-factory-build-your-first-pipeline.md) article and complete the prerequisite steps before proceeding further.
>  
> This article does not provide a conceptual overview of the Azure Data Factory service. For a detailed overview of the service, see the [Introduction to Azure Data Factory](data-factory-introduction.md) article.
  

## Step 1: Create the data factory

1.	After logging into the [Azure Portal](http://portal.azure.com/), do the following:
	1.	Click **NEW** on the left menu. 
	2.	Click **Data analytics** in the **Create** blade.
	3.	Click **Data Factory** on the **Data analytics** blade.

		![Create blade](./media/data-factory-build-your-first-pipeline-using-editor/create-blade.png)

2.	In the **New data factory** blade, enter **GetStartedDF** for the Name.

	![New data factory blade](./media/data-factory-build-your-first-pipeline-using-editor/new-data-factory-blade.png)

	> [AZURE.IMPORTANT] The name of the Azure data factory must be globally unique. If you receive the error: **Data factory name “GetStartedDF” is not available**, change the name of the data factory (for example, yournameGetStartedDF) and try creating again. See [Data Factory - Naming Rules](data-factory-naming-rules.md) topic for naming rules for Data Factory artifacts.
	>  
	> The name of the data factory may be registered as a DNS name in the future and hence become publically visible.

3.	Select the **Azure subscription** where you want the data factory to be created. 
4.	Select existing **resource group** or create a new resource group. For the purpose of the tutorial, create a resource group named: **ADFGetStartedRG**.    
5.	Click **Create** on the **New data factory** blade.
6.	You will see the data factory being created in the **Startboard** of the Azure Portal as follows:   

	![Creating data factory status](./media/data-factory-build-your-first-pipeline-using-editor/creating-data-factory-image.png)
7. Congratulations! You have successfully created your first data factory. After the data factory has been created successfully, you will see the data factory page, which shows you the contents of the data factory. 	

	![Data Factory blade](./media/data-factory-build-your-first-pipeline-using-editor/data-factory-blade.png)

In the subsequent steps, you will learn how to create the linked services, datasets and pipeline that you will use in this tutorial. 

## Step 2: Create linked services 
In this step, you will link your Azure Storage account and an on-demand Azure HDInsight cluster to your data factory.

### Create Azure Storage linked service
1.	Click **Author and deploy** on the **DATA FACTORY** blade for **GetStartedDF**. This launches the Data Factory Editor. 
	 
	![Author and deploy tile](./media/data-factory-build-your-first-pipeline-using-editor/data-factory-author-deploy.png)
2.	Click **New data store** and choose **Azure storage**
	
	![Azure Storage linked service](./media/data-factory-build-your-first-pipeline-using-editor/azure-storage-linked-service.png)

	You should see the JSON script for creating an Azure Storage linked service in the editor. 
4. Replace **account name** with the name of your Azure storage account and **account key** with the access key of the Azure storage account. To learn how to get your storage access key, see [View, copy and regenerate storage access keys](../storage/storage-create-storage-account.md#view-copy-and-regenerate-storage-access-keys)
5. Click **Deploy** on the command bar to deploy the linked service.

	![Deploy button](./media/data-factory-build-your-first-pipeline-using-editor/deploy-button.png)

   After the linked service is deployed successfully, the **Draft-1** window should disappear and you will see **StorageLinkedService** in the tree view on the left. 
	![Storage Linked Service in menu](./media/data-factory-build-your-first-pipeline-using-editor/StorageLinkedServiceInTree.png)	

 
### Create Azure HDInsight linked service
Now, you will create a linked service for an on-demand HDInsight cluster that will be used to run the Hive script. 

1. In the **Data Factory Editor**, click **New compute** on the command bar and select **On-demand HDInsight cluster**.

	![New compute](./media/data-factory-build-your-first-pipeline-using-editor/new-compute-menu.png)
2. Copy and paste the snippet below to the **Draft-1** window. The JSON snippet describes the properties that will be used to create the HDInsight cluster on-demand. 

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
	
	Property | Description
	-------- | -----------
	Version | This specifies that the version of the HDInsight created to be 3.2. 
	ClusterSize | This creates a one node HDInsight cluster. 
	TimeToLive | This specifies that the idle time for the HDInsight cluster, before it is deleted.
	linkedServiceName | This specifies the storage account that will be used to store the logs that are generated by HDInsight
3. Click **Deploy** on the command bar to deploy the linked service. 
4. Confirm that you see both **StorageLinkedService** and **HDInsightOnDemandLinkedService** in the tree view on the left.

	![Tree view with linked services](./media/data-factory-build-your-first-pipeline-using-editor/tree-view-linked-services.png)

## Step 3: Create datasets
In this step, you will create datasets to represent the input and output data for Hive processing.

### Create the input dataset
Now, you will create the input dataset to represent the data stored in the Azure Blob storage. 

1. In the **Data Factory Editor**, click **New dataset** on the command bar and select **Azure Blob storage**.

	![New dataset](./media/data-factory-build-your-first-pipeline-using-editor/new-data-set.png)
2. Copy and paste the snippet below to the Draft-1 window. In the JSON snippet, you are creating a dataset called **AzureBlobInput** that represents input data for an activity in the pipeline. In addition, you specify that the input data is located in the blob container called **adfgetstarted** and the folder called **inputdata**.
		
		{
			"name": "AzureBlobInput",
		    "properties": {
		        "published": false,
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
3. Click **Deploy** on the command bar to deploy the newly created dataset. You should see the dataset in the tree view on the left. 


### Create the output dataset
Now, you will create the output dataset to represent the output data stored in the Azure Blob storage. 

1. In the **Data Factory Editor**, click **New dataset** on the command bar and select **Azure Blob storage**.  
2. Copy and paste the snippet below to the Draft-1 window. In the JSON snippet, you are creating a dataset called **AzureBlobOutput**, and specifying the structure of the data that will be produced by the Hive script. In addition, you specify that the results are stored in the blob container called **adfgetstarted** and the folder called **partitioneddata**. The **availability** section specifies that the output dataset is produced on a monthly basis.
	
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

3. Click **Deploy** on the command bar to deploy the newly created dataset.
4. Verify that the dataset is created successfully.

	![Tree view with linked services](./media/data-factory-build-your-first-pipeline-using-editor/tree-view-data-set.png)

## Step 4: Create your first pipeline
In this step, you will create your first pipeline with a **HDInsightHive** activity.

1. In the **Data Factory Editor**, click **Elipsis (…)** and then click **New pipeline**.
	
	![new pipeline button](./media/data-factory-build-your-first-pipeline-using-editor/new-pipeline-button.png)
2. Copy and paste the snippet below to the Draft-1 window.

	> [AZURE.IMPORTANT] Replace **storageaccountname** with the name of your storage account in the  JSON.
		
		{
		    "name": "MyFirstPipeline",
		    "properties": {
		        "description": "My first Azure Data Factory pipeline using ARM",
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
		        "start": "2014-02-01T00:00:00Z",
		        "end": "2014-02-02T00:00:00Z",
		        "isPaused": false
		    }
		}
 
	In the JSON snippet, you are creating a pipeline that consists of a single activity that uses Hive to process Data on an HDInsight cluster.
	
	The Hive script file, **partitionweblogs.hql**, is stored in the Azure storage account (specified by the scriptLinkedService, called **StorageLinkedService**), and in **script** folder in the container **adfgetstarted**.

	The **defines** section is used to specify the runtime settings that will be passed to the hive script as Hive configuration values (e.g ${hiveconf:PartitionedData}).

	The **start** and **end** properties of the pipeline specifies the active period of the pipeline.

	In the activity JSON, you specify that the Hive script runs on the compute specified by the linked service – **HDInsightOnDemandLinkedService**.


3. Click **Deploy** on the command bar to deploy the pipeline.
4. Confirm that you see the pipeline in the tree view.

	![Tree view with pipeline](./media/data-factory-build-your-first-pipeline-using-editor/tree-view-pipeline.png)
5. Congratulations, you have successfully created your first pipeline!

## Step 4: Monitor the pipeline

6. Click **X** to close Data Factory Editor blades and to navigate back to the Data Factory blade, and click on **Diagram**.
  
	![Diagram tile](./media/data-factory-build-your-first-pipeline-using-editor/diagram-tile.png)
7. In the Diagram View, you will see an overview of the pipelines, and datasets used in this tutorial.
	
	![Diagram View](./media/data-factory-build-your-first-pipeline-using-editor/diagram-view-2.png) 
8. To view all activities in the pipeline, right-click on pipeline in the diagram and click Open Pipeline. 

	![Open pipeline menu](./media/data-factory-build-your-first-pipeline-using-editor/open-pipeline-menu.png)
9. Confirm that you see the HDInsightHive activity in the pipeline. 
  
	![Open pipeline view](./media/data-factory-build-your-first-pipeline-using-editor/open-pipeline-view.png)

	To navigate back to the previous view, click **Data factory** in the breadcrump menu at the top. 
10. In the **Diagram View**, double-click on the dataset **AzureBlobInput**. Confirm that the slice is in **Ready** state. 

	![Input slice in ready state](./media/data-factory-build-your-first-pipeline-using-editor/input-slice-ready.png)
11. In the **Diagram View**, double-click on the dataset **AzureBlobOutput**. You will see that the slice that is currently being processed.

	![Dataset](./media/data-factory-build-your-first-pipeline-using-editor/dataset-blade.png)
9. When processing is done, you will see the slice in **Ready** state. 

	![Dataset](./media/data-factory-build-your-first-pipeline-using-editor/dataset-slice-ready.png)	

	>[AZURE.IMPORTANT] Creation of an on-demand HDInsight cluster usually takes sometime (approximately 20 minutes). 
10. When the slice is in **Ready** state, check the **partitioneddata** folder in the **adfgetstarted** container in your blob storage for the output data.  
 

 

## Next Steps
In this article, you have created a pipeline with a transformation activity (HDInsight Activity) that runs a Hive script on an on-demand HDInsight cluster. To see how to use a Copy Activity to copy data from an Azure Blob to Azure SQL, see [Tutorial: Copy data from an Azure blob to Azure SQL](./data-factory-get-started.md).
  

