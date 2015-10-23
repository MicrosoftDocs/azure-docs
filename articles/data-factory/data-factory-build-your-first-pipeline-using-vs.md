<properties
	pageTitle="Build your first Azure Data Factory pipeline using Visual Studio"
	description="In this tutorial, you will create a sample Azure Data Factory pipeline using Visual Studio."
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

# Build your first Azure Data Factory pipeline using Visual Studio
> [AZURE.SELECTOR]
- [Tutorial Overview](data-factory-build-your-first-pipeline.md)
- [Using Data Factory Editor](data-factory-build-your-first-pipeline-using-editor.md)
- [Using PowerShell](data-factory-build-your-first-pipeline-using-powershell.md)
- [Using Visual Studio](data-factory-build-your-first-pipeline-using-vs.md)


In this article, you will learn how to use the Visual Studio to create your first pipeline. This tutorial consists of the following steps:

2.	Creating linked services (data stores, computes).
3.	Creating a dataset.
3.	Creating a pipeline.
4.	Create a data factory, and deploy linked services, dataset, and the pipeline. 

This article does not provide a conceptual overview of the Azure Data Factory service. For a detailed overview of the service, see the [Introduction to Azure Data Factory](data-factory-introduction.md) article.

> [AZURE.IMPORTANT] Please go through the [Tutorial Overview](data-factory-build-your-first-pipeline.md) article and complete the pre-requisite steps before performing this tutorial.  

## Walkthrough: Create and deploy Data Factory entities using Visual Studio 

### Pre-requisites

You must have the following installed on your computer: 

- Visual Studio 2013 or Visual Studio 2015
- Download Azure SDK for Visual Studio 2013 or Visual Studio 2015. Navigate to [Azure Download Page](http://azure.microsoft.com/downloads/) and click **VS 2013** or **VS 2015** in the **.NET** section.
- Download the latest Azuer Data Factory plugin for Visual Studio : [VS 2013](https://visualstudiogallery.msdn.microsoft.com/754d998c-8f92-4aa7-835b-e89c8c954aa5) or [VS 2015](https://visualstudiogallery.msdn.microsoft.com/371a4cf9-0093-40fa-b7dd-be3c74f49005). If you are using Visual Studio 2013, you can also update the plugin by doing the following: On the menu, click **Tools** -> **Extensions and Updates** -> **Online** -> **Visual Studio Gallery** -> **Microsoft Azure Data Factory Tools for Visual Studio** -> **Update**. 
	
	

### Create the Visual Studio project 
1. Launch **Visual Studio 2013** or **Visual Studio 2015**. Click **File**, point to **New**, and click **Project**. You should see the **New Project** dialog box.  
2. In the **New Project** dialog, select the **DataFactory** template, and click **Empty Data Factory Project**.   

	![New project dialog box](./media/data-factory-build-your-first-pipeline-using-vs/new-project-dialog.png)

3. Enter a **name** for the project, **location**, and a name for the **solution**, and click **OK**.

	![Solution Explorer](./media/data-factory-build-your-first-pipeline-using-vs/solution-explorer.png)

### Create linked services
In this step, you will link your Azure Storage account and an on-demand Azure HDInsight cluster to your data factory and then crate a dataset to represent the output data from Hive processing.


#### Create Azure Storage linked service


4. Right-click **Linked Services** in the solution explorer, point to **Add**, and click **New Item**.      
5. In the **Add New Item** dialog box, select **Azure Storage Linked Service** from the list, and click **Add**. 

	![New Linked Service](./media/data-factory-build-your-first-pipeline-using-vs/new-linked-service-dialog.png)
 
3. Replace **accountname** and **accountkey** with the name of your Azure storage account and its key. 

	![Azure Storage Linked Service](./media/data-factory-build-your-first-pipeline-using-vs/azure-storage-linked-service.png)

4. Save the **AzureStorageLinkedService1.json** file.

#### Create Azure HDInsight linked service
Now, you will create a linked service for an on-demand HDInsight cluster that will be used to run the Hive script. 

1. In the **Solution Explorer**, right-click **Linked Services**, point to **Add**, and click **New Item**.
2. Select **HDInsight On Demand Linked Service**, and click **Add**. 
3. Replace the **JSON** with the following:

		{
		  "name": "HDInsightOnDemandLinkedService",
		  "properties": {
		    "type": "HDInsightOnDemand",
		    "typeProperties": {
		      "version": "3.1",
		      "clusterSize": 1,
		      "timeToLive": "00:30:00",
		      "linkedServiceName": "AzureStorageLinkedService1"
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

4. Save the **HDInsightOnDemandLinkedService1.json** file.
 
### Create the output dataset
Now, you will create the output dataset to represent the data stored in the Azure Blob storage. 

1. In the **Solution Explorer**, right-click point to **Add**, and click **New Item**. 
2. Select **Azure Blob** from the list, and click **Add**. 
3. Replace the **JSON** in the editor with the following: In the JSON snippet, you are creating a dataset called **AzureBlobOutput**, and specifying the structure of the data that will be produced by the Hive script. In addition, you specify that the results are stored in the blob container called **data** and the folder called **partitioneddata**. The **availability** section specifies that the output dataset is produced on a monthly basis.
	
		{
		  "name": "AzureBlobOutput",
		  "properties": {
		    "type": "AzureBlob",
		    "linkedServiceName": "AzureStorageLinkedService1",
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

4. Save the **AzureBlobLocation1.json** file.


### Creating your first pipeline
In this step, you will create your first pipeline.

1. In the **Solution Explorer**, right-click **Pipelines**, point to **Add**, and click **New Item.** 
2. Select **Hive Transformation Pipeline** from the list, and click **Add**. 
3. Replace the **JSON** with the following snippet.

	> [AZURE.IMPORTANT] replace **storageaccountname** with the name of your storage account.

		{
		  "name": "MyFirstPipeline",
		  "properties": {
		    "description": "My first Azure Data Factory pipeline",
		    "activities": [
		      {
		        "type": "HDInsightHive",
		        "typeProperties": {
		          "scriptPath": "script/partitionweblogs.hql",
		          "scriptLinkedService": "AzureStorageLinkedService1",
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

 	In the JSON snippet, you are creating a pipeline that consists of a single activity that uses Hive to process Data on an HDInsight cluster.
	
	The Hive script file, **partitionweblogs.hql**, is stored in the Azure storage account (specified by the scriptLinkedService, called **AzureStorageLinkedService1**), and in a container called **script**.

	The **extendedProperties** section is used to specify the runtime settings that will be passed to the hive script as Hive configuration values (e.g ${hiveconf:PartitionedData}).

	The **start** and **end** properties of the pipeline specifies the active period of the pipeline.

	In the activity JSON, you specify that the Hive script runs on the compute specified by the linked service – **HDInsightOnDemandLinkedService**.
3. Save the **HiveActivity1.json** file.

### Add partitionweblogs.hql as a dependency 

1. Right-click **Dependencies** in the **Solution Explorer** window, point to **Add**, and click **Existing Item**.  
2. Navigate to the **C:\ADFGettingStarted** and select **partitionweblogs.hql** file, and click **Add**. 

When you publish the solution in the next step, the HQL file is uploaded to the scripts container in your blob storage.  

### Publish/deploy Data Factory entities

18. Right-click project in the Solution Explorer, and click **Publish**. 
19. If you see **Sign in to your Microsoft account** dialog box, enter your credentials for the account that has Azure subscription, and click **sign in**.
20. You should see the following dialog box:

	![Publish dialog box](./media/data-factory-build-your-first-pipeline-using-vs/publish.png)

21. In the Configure data factory page, do the following: 
	1. select **Create New Data Factory** option.
	2. Enter **FirstPipelineUsingVS** for **Name**. 
	
		> [AZURE.IMPORTANT] The name of the Azure Data Factory must be globally unique. If you receive the error **Data factory name “FirstPipelineUsingVS” is not available** when publishing, change the name (for example, yournameFirstPipelineUsingVS). See [Data Factory - Naming Rules](data-factory-naming-rules.md) topic for naming rules for Data Factory artifacts. 
		> 
		> The name of the data factory may be registered as a DNS name in the future and hence become publically visible.
	3. Select the right subscription for the **Subscription** field. 
	4. Select the **resource group** for the data factory to be created. 
	5. Select the **region** for the data factory. 
	6. Click **Next** to switch to the **Publish Items** page. (Press **TAB** to move out of the Name field to if the **Next** button is disabled.) 
23. In the **Publish Items** page, ensure that all the Data Factories entities are selected, and click **Next** to switch to the **Summary** page.     
24. Review the summary and click **Next** to start the deployment process and view the **Deployment Status**.
25. In the **Deployment Status** page, you should see the status of the deployment process. Click Finish after the deployment is done. 
 

## Use Server Explorer to review Data Factory entities

1. In **Visual Studio**, click **View** on the menu, and click **Server Explorer**.
2. In the Server Explorer window, expand **Azure** and expand **Data Factory**. If you see **Sign in to Visual Studio**, enter the **account** associated with your Azure subscription and click **Continue**. Enter **password**, and click **Sign in**. Visual Studio tries to get information about all Azure data factories in your subscription. You will see the status of this operation in the **Data Factory Task List** window.

	![Server Explorer](./media/data-factory-build-your-first-pipeline-using-vs/server-explorer.png)
3. You can right-click on a data factory, and select **Export Data Factory to New Project** to create a Visual Studio project based on an existing data factory.

	![Export data factory](./media/data-factory-build-your-first-pipeline-using-vs/export-data-factory-menu.png)

## Update Data Factory tools for Visual Studio

To update Azure Data Factory tools for Visual Studio, do the following:

1. Click **Tools** on the menu and select **Extensions and Updates**.
2. Select **Updates** in the left pane and then select **Visual Studio Gallery**.
3. Select **Azure Data Factory tools for Visual Studio** and click **Update**. If you do not see this entry, you already have the latest version of the tools. 

See [Monitor datasets and pipeline](data-factory-monitor-manage-pipelines.md) for instructions on how to use the Azure Preview Portal to monitor the pipeline and datasets you have created in this tutorial.
 

## Next Steps
In this article, you have created a pipeline with a transformation activity (HDInsight Activity) that runs a Hive script on an on-demand HDInsight cluster. To see how to use a Copy Activity to copy data from an Azure Blob to Azure SQL, see [Tutorial: Copy data from an Azure blob to Azure SQL](data-factory-get-started.md).
  
## Send Feedback
We would really appreciate your feedback on this article. Please take a few minutes to submit your feedback via [email](mailto:adfdocfeedback@microsoft.com?subject=data-factory-build-your-first-pipeline-using-vs.md). 
