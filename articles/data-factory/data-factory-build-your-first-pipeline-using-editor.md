---
title: Build your first data factory (Azure portal) | Microsoft Docs
description: In this tutorial, you create a sample Azure Data Factory pipeline using Data Factory Editor in the Azure portal.
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: monicar

ms.assetid: d5b14e9e-e358-45be-943c-5297435d402d
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 04/17/2017
ms.author: spelluru

---
# Tutorial: Build your first Azure data factory using Azure portal
> [!div class="op_single_selector"]
> * [Overview and prerequisites](data-factory-build-your-first-pipeline.md)
> * [Azure portal](data-factory-build-your-first-pipeline-using-editor.md)
> * [Visual Studio](data-factory-build-your-first-pipeline-using-vs.md)
> * [PowerShell](data-factory-build-your-first-pipeline-using-powershell.md)
> * [Resource Manager Template](data-factory-build-your-first-pipeline-using-arm.md)
> * [REST API](data-factory-build-your-first-pipeline-using-rest-api.md)


In this article, you learn how to use the [Azure portal](https://portal.azure.com/) to create your first Azure data factory. To do the tutorial using other tools/SDKs, select one of the options from the drop-down list. 

> [!NOTE]
> The data pipeline in this tutorial transforms input data to produce output data. It does not copy data from a source data store to a destination data store. For a tutorial on how to copy data using Azure Data Factory, see [Tutorial: Copy data from Blob Storage to SQL Database](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).
> 
> You can chain two activities (run one activity after another) by setting the output dataset of one activity as the input dataset of the other activity. See [Scheduling and execution in Data Factory](data-factory-scheduling-and-execution.md) for detailed information. 

## Prerequisites
1. Read through [Tutorial Overview](data-factory-build-your-first-pipeline.md) article and complete the **prerequisite** steps.
2. This article does not provide a conceptual overview of the Azure Data Factory service. We recommend that you go through [Introduction to Azure Data Factory](data-factory-introduction.md) article for a detailed overview of the service.  

## Create data factory
A data factory can have one or more pipelines. A pipeline can have one or more activities in it. For example, a Copy Activity to copy data from a source to a destination data store and a HDInsight Hive activity to run Hive script to transform input data to product output data. Let's start with creating the data factory in this step.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. Click **NEW** on the left menu, click **Data + Analytics**, and click **Data Factory**.

   ![Create blade](./media/data-factory-build-your-first-pipeline-using-editor/create-blade.png)
3. In the **New data factory** blade, enter **GetStartedDF** for the Name.

   ![New data factory blade](./media/data-factory-build-your-first-pipeline-using-editor/new-data-factory-blade.png)

   > [!IMPORTANT]
   > The name of the Azure data factory must be **globally unique**. If you receive the error: **Data factory name “GetStartedDF” is not available**. Change the name of the data factory (for example, yournameGetStartedDF) and try creating again. See [Data Factory - Naming Rules](data-factory-naming-rules.md) topic for naming rules for Data Factory artifacts.
   >
   > The name of the data factory may be registered as a **DNS** name in the future and hence become publically visible.
   >
   >
4. Select the **Azure subscription** where you want the data factory to be created.
5. Select existing **resource group** or create a resource group. For the tutorial, create a resource group named: **ADFGetStartedRG**.
6. Click **Create** on the **New data factory** blade.

   > [!IMPORTANT]
   > To create Data Factory instances, you must be a member of the [Data Factory Contributor](../active-directory/role-based-access-built-in-roles.md#data-factory-contributor) role at the subscription/resource group level.
   >
   >
7. You see the data factory being created in the **Startboard** of the Azure portal as follows:   

   ![Creating data factory status](./media/data-factory-build-your-first-pipeline-using-editor/creating-data-factory-image.png)
8. Congratulations! You have successfully created your first data factory. After the data factory has been created successfully, you see the data factory page, which shows you the contents of the data factory.     

    ![Data Factory blade](./media/data-factory-build-your-first-pipeline-using-editor/data-factory-blade.png)

Before creating a pipeline in the data factory, you need to create a few Data Factory entities first. You first create linked services to link data stores/computes to your data store, define input and output datasets to represent input/output data in linked data stores, and then create the pipeline with an activity that uses these datasets.

## Create linked services
In this step, you link your Azure Storage account and an on-demand Azure HDInsight cluster to your data factory. The Azure Storage account holds the input and output data for the pipeline in this sample. The HDInsight linked service is used to run Hive script specified in the activity of the pipeline in this sample. Identify what [data store](data-factory-data-movement-activities.md)/[compute services](data-factory-compute-linked-services.md) are used in your scenario and link those services to the data factory by creating linked services.  

### Create Azure Storage linked service
In this step, you link your Azure Storage account to your data factory. In this tutorial, you use the same Azure Storage account to store input/output data and the HQL script file.

1. Click **Author and deploy** on the **DATA FACTORY** blade for **GetStartedDF**. You should see the Data Factory Editor.

   ![Author and deploy tile](./media/data-factory-build-your-first-pipeline-using-editor/data-factory-author-deploy.png)
2. Click **New data store** and choose **Azure storage**.

   ![New data store - Azure Storage - menu](./media/data-factory-build-your-first-pipeline-using-editor/new-data-store-azure-storage-menu.png)
3. You should see the JSON script for creating an Azure Storage linked service in the editor.

   ![Azure Storage linked service](./media/data-factory-build-your-first-pipeline-using-editor/azure-storage-linked-service.png)
4. Replace **account name** with the name of your Azure storage account and **account key** with the access key of the Azure storage account. To learn how to get your storage access key, see the information about how to view, copy, and regenerate storage access keys in [Manage your storage account](../storage/storage-create-storage-account.md#manage-your-storage-account).
5. Click **Deploy** on the command bar to deploy the linked service.

    ![Deploy button](./media/data-factory-build-your-first-pipeline-using-editor/deploy-button.png)

   After the linked service is deployed successfully, the **Draft-1** window should disappear and you see **AzureStorageLinkedService** in the tree view on the left.

    ![Storage Linked Service in menu](./media/data-factory-build-your-first-pipeline-using-editor/StorageLinkedServiceInTree.png)    

### Create Azure HDInsight linked service
In this step, you link an on-demand HDInsight cluster to your data factory. The HDInsight cluster is automatically created at runtime and deleted after it is done processing and idle for the specified amount of time.

1. In the **Data Factory Editor**, click **... More**, click **New compute**, and select **On-demand HDInsight cluster**.

    ![New compute](./media/data-factory-build-your-first-pipeline-using-editor/new-compute-menu.png)
2. Copy and paste the following snippet to the **Draft-1** window. The JSON snippet describes the properties that are used to create the HDInsight cluster on-demand.

	```JSON
    {
      "name": "HDInsightOnDemandLinkedService",
      "properties": {
        "type": "HDInsightOnDemand",
        "typeProperties": {
          "version": "3.2",
          "clusterSize": 1,
          "timeToLive": "00:30:00",
          "linkedServiceName": "AzureStorageLinkedService"
        }
      }
    }
	```

    The following table provides descriptions for the JSON properties used in the snippet:

   | Property | Description |
   |:--- |:--- |
   | Version |Specifies that the version of the HDInsight created to be 3.2. |
   | ClusterSize |Specifies the size of the HDInsight cluster. |
   | TimeToLive |Specifies that the idle time for the HDInsight cluster, before it is deleted. |
   | linkedServiceName |Specifies the storage account that is used to store the logs that are generated by HDInsight. |

    Note the following points:

   * The Data Factory creates a **Windows-based** HDInsight cluster for you with the JSON. You could also have it create a **Linux-based** HDInsight cluster. See [On-demand HDInsight Linked Service](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service) for details.
   * You could use **your own HDInsight cluster** instead of using an on-demand HDInsight cluster. See [HDInsight Linked Service](data-factory-compute-linked-services.md#azure-hdinsight-linked-service) for details.
   * The HDInsight cluster creates a **default container** in the blob storage you specified in the JSON (**linkedServiceName**). HDInsight does not delete this container when the cluster is deleted. This behavior is by design. With on-demand HDInsight linked service, a HDInsight cluster is created every time a slice is processed unless there is an existing live cluster (**timeToLive**). The cluster is automatically deleted when the processing is done.

       As more slices are processed, you see many containers in your Azure blob storage. If you do not need them for troubleshooting of the jobs, you may want to delete them to reduce the storage cost. The names of these containers follow a pattern: "adf**yourdatafactoryname**-**linkedservicename**-datetimestamp". Use tools such as [Microsoft Storage Explorer](http://storageexplorer.com/) to delete containers in your Azure blob storage.

     See [On-demand HDInsight Linked Service](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service) for details.
3. Click **Deploy** on the command bar to deploy the linked service.

    ![Deploy on-demand HDInsight linked service](./media/data-factory-build-your-first-pipeline-using-editor/ondemand-hdinsight-deploy.png)
4. Confirm that you see both **AzureStorageLinkedService** and **HDInsightOnDemandLinkedService** in the tree view on the left.

    ![Tree view with linked services](./media/data-factory-build-your-first-pipeline-using-editor/tree-view-linked-services.png)

## Create datasets
In this step, you create datasets to represent the input and output data for Hive processing. These datasets refer to the **AzureStorageLinkedService** you have created earlier in this tutorial. The linked service points to an Azure Storage account and datasets specify container, folder, file name in the storage that holds input and output data.   

### Create input dataset
1. In the **Data Factory Editor**, click **... More** on the command bar, click **New dataset**, and select **Azure Blob storage**.

    ![New dataset](./media/data-factory-build-your-first-pipeline-using-editor/new-data-set.png)
2. Copy and paste the following snippet to the Draft-1 window. In the JSON snippet, you are creating a dataset called **AzureBlobInput** that represents input data for an activity in the pipeline. In addition, you specify that the input data is located in the blob container called **adfgetstarted** and the folder called **inputdata**.

	```JSON
    {
        "name": "AzureBlobInput",
        "properties": {
            "type": "AzureBlob",
            "linkedServiceName": "AzureStorageLinkedService",
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
	```
    The following table provides descriptions for the JSON properties used in the snippet:

   | Property | Description |
   |:--- |:--- |
   | type |The type property is set to AzureBlob because data resides in Azure blob storage. |
   | linkedServiceName |refers to the AzureStorageLinkedService you created earlier. |
   | fileName |This property is optional. If you omit this property, all the files from the folderPath are picked. In this case, only the input.log is processed. |
   | type |The log files are in text format, so we use TextFormat. |
   | columnDelimiter |columns in the log files are delimited by comma character (,) |
   | frequency/interval |frequency set to Month and interval is 1, which means that the input slices are available monthly. |
   | external |this property is set to true if the input data is not generated by the Data Factory service. |
3. Click **Deploy** on the command bar to deploy the newly created dataset. You should see the dataset in the tree view on the left.

### Create output dataset
Now, you create the output dataset to represent the output data stored in the Azure Blob storage.

1. In the **Data Factory Editor**, click **... More** on the command bar, click **New dataset**, and select **Azure Blob storage**.  
2. Copy and paste the following snippet to the Draft-1 window. In the JSON snippet, you are creating a dataset called **AzureBlobOutput**, and specifying the structure of the data that is produced by the Hive script. In addition, you specify that the results are stored in the blob container called **adfgetstarted** and the folder called **partitioneddata**. The **availability** section specifies that the output dataset is produced on a monthly basis.

	```JSON
    {
      "name": "AzureBlobOutput",
      "properties": {
        "type": "AzureBlob",
        "linkedServiceName": "AzureStorageLinkedService",
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
	```
    See **Create the input dataset** section for descriptions of these properties. You do not set the external property on an output dataset as the dataset is produced by the Data Factory service.
3. Click **Deploy** on the command bar to deploy the newly created dataset.
4. Verify that the dataset is created successfully.

    ![Tree view with linked services](./media/data-factory-build-your-first-pipeline-using-editor/tree-view-data-set.png)

## Create pipeline
In this step, you create your first pipeline with a **HDInsightHive** activity. Input slice is available monthly (frequency: Month, interval: 1), output slice is produced monthly, and the scheduler property for the activity is also set to monthly. The settings for the output dataset and the activity scheduler must match. Currently, output dataset is what drives the schedule, so you must create an output dataset even if the activity does not produce any output. If the activity doesn't take any input, you can skip creating the input dataset. The properties used in the following JSON are explained at the end of this section.

1. In the **Data Factory Editor**, click **Ellipsis (…) More commands** and then click **New pipeline**.

    ![new pipeline button](./media/data-factory-build-your-first-pipeline-using-editor/new-pipeline-button.png)
2. Copy and paste the following snippet to the Draft-1 window.

   > [!IMPORTANT]
   > Replace **storageaccountname** with the name of your storage account in the JSON.
   >
   >

	```JSON
	{
	    "name": "MyFirstPipeline",
	    "properties": {
	        "description": "My first Azure Data Factory pipeline",
	        "activities": [
	            {
	                "type": "HDInsightHive",
	                "typeProperties": {
	                    "scriptPath": "adfgetstarted/script/partitionweblogs.hql",
	                    "scriptLinkedService": "AzureStorageLinkedService",
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
	```

    In the JSON snippet, you are creating a pipeline that consists of a single activity that uses Hive to process Data on an HDInsight cluster.

    The Hive script file, **partitionweblogs.hql**, is stored in the Azure storage account (specified by the scriptLinkedService, called **AzureStorageLinkedService**), and in **script** folder in the container **adfgetstarted**.

    The **defines** section is used to specify the runtime settings that are passed to the hive script as Hive configuration values (e.g ${hiveconf:inputtable}, ${hiveconf:partitionedtable}).

    The **start** and **end** properties of the pipeline specifies the active period of the pipeline.

    In the activity JSON, you specify that the Hive script runs on the compute specified by the **linkedServiceName** – **HDInsightOnDemandLinkedService**.

   > [!NOTE]
   > See "Pipeline JSON" in [Pipelines and activities in Azure Data Factory](data-factory-create-pipelines.md) for details about JSON properties used in the example.
   >
   >
3. Confirm the following:

   1. **input.log** file exists in the **inputdata** folder of the **adfgetstarted** container in the Azure blob storage
   2. **partitionweblogs.hql** file exists in the **script** folder of the **adfgetstarted** container in the Azure blob storage. Complete the prerequisite steps in the [Tutorial Overview](data-factory-build-your-first-pipeline.md) if you don't see these files.
   3. Confirm that you replaced **storageaccountname** with the name of your storage account in the pipeline JSON.
4. Click **Deploy** on the command bar to deploy the pipeline. Since the **start** and **end** times are set in the past and **isPaused** is set to false, the pipeline (activity in the pipeline) runs immediately after you deploy.
5. Confirm that you see the pipeline in the tree view.

    ![Tree view with pipeline](./media/data-factory-build-your-first-pipeline-using-editor/tree-view-pipeline.png)
6. Congratulations, you have successfully created your first pipeline!

## Monitor pipeline
### Monitor pipeline using Diagram View
1. Click **X** to close Data Factory Editor blades and to navigate back to the Data Factory blade, and click **Diagram**.

    ![Diagram tile](./media/data-factory-build-your-first-pipeline-using-editor/diagram-tile.png)
2. In the Diagram View, you see an overview of the pipelines, and datasets used in this tutorial.

    ![Diagram View](./media/data-factory-build-your-first-pipeline-using-editor/diagram-view-2.png)
3. To view all activities in the pipeline, right-click pipeline in the diagram and click Open Pipeline.

    ![Open pipeline menu](./media/data-factory-build-your-first-pipeline-using-editor/open-pipeline-menu.png)
4. Confirm that you see the HDInsightHive activity in the pipeline.

    ![Open pipeline view](./media/data-factory-build-your-first-pipeline-using-editor/open-pipeline-view.png)

    To navigate back to the previous view, click **Data factory** in the breadcrumb menu at the top.
5. In the **Diagram View**, double-click the dataset **AzureBlobInput**. Confirm that the slice is in **Ready** state. It may take a couple of minutes for the slice to show up in Ready state. If it does not happen after you wait for sometime, see if you have the input file (input.log) placed in the right container (adfgetstarted) and folder (inputdata).

   ![Input slice in ready state](./media/data-factory-build-your-first-pipeline-using-editor/input-slice-ready.png)
6. Click **X** to close **AzureBlobInput** blade.
7. In the **Diagram View**, double-click the dataset **AzureBlobOutput**. You see that the slice that is currently being processed.

   ![Dataset](./media/data-factory-build-your-first-pipeline-using-editor/dataset-blade.png)
8. When processing is done, you see the slice in **Ready** state.

   ![Dataset](./media/data-factory-build-your-first-pipeline-using-editor/dataset-slice-ready.png)  

   > [!IMPORTANT]
   > Creation of an on-demand HDInsight cluster usually takes sometime (approximately 20 minutes). Therefore, expect the pipeline to       take **approximately 30 minutes** to process the slice.
   >
   >

9. When the slice is in **Ready** state, check the **partitioneddata** folder in the **adfgetstarted** container in your blob storage for the output data.  

   ![output data](./media/data-factory-build-your-first-pipeline-using-editor/three-ouptut-files.png)
10. Click the slice to see details about it in a **Data slice** blade.

   ![Data slice details](./media/data-factory-build-your-first-pipeline-using-editor/data-slice-details.png)  
11. Click an activity run in the **Activity runs list** to see details about an activity run (Hive activity in our scenario) in an **Activity run details** window.   

   ![Activity run details](./media/data-factory-build-your-first-pipeline-using-editor/activity-window-blade.png)    

   From the log files, you can see the Hive query that was executed and status information. These logs are useful for troubleshooting any issues.
   See [Monitor and manage pipelines using Azure portal blades](data-factory-monitor-manage-pipelines.md) article for more details.

> [!IMPORTANT]
> The input file gets deleted when the slice is processed successfully. Therefore, if you want to rerun the slice or do the tutorial again, upload the input file (input.log) to the inputdata folder of the adfgetstarted container.
>
>

### Monitor pipeline using Monitor & Manage App
You can also use Monitor & Manage application to monitor your pipelines. For detailed information about using this application, see [Monitor and manage Azure Data Factory pipelines using Monitoring and Management App](data-factory-monitor-manage-app.md).

1. Click **Monitor & Manage** tile on the home page for your data factory.

    ![Monitor & Manage tile](./media/data-factory-build-your-first-pipeline-using-editor/monitor-and-manage-tile.png)
2. You should see **Monitor & Manage application**. Change the **Start time** and **End time** to match start (04-01-2016 12:00 AM) and end times (04-02-2016 12:00 AM) of your pipeline, and click **Apply**.

    ![Monitor & Manage App](./media/data-factory-build-your-first-pipeline-using-editor/monitor-and-manage-app.png)
3. Select an activity window in the **Activity Windows** list to see details about it.

    ![Activity window details](./media/data-factory-build-your-first-pipeline-using-editor/activity-window-details.png)

## Summary
In this tutorial, you created an Azure data factory to process data by running Hive script on a HDInsight hadoop cluster. You used the Data Factory Editor in the Azure portal to do the following steps:  

1. Created an Azure **data factory**.
2. Created two **linked services**:
   1. **Azure Storage** linked service to link your Azure blob storage that holds input/output files to the data factory.
   2. **Azure HDInsight** on-demand linked service to link an on-demand HDInsight Hadoop cluster to the data factory. Azure Data Factory creates a HDInsight Hadoop cluster just-in-time to process input data and produce output data.
3. Created two **datasets**, which describe input and output data for HDInsight Hive activity in the pipeline.
4. Created a **pipeline** with a **HDInsight Hive** activity.

## Next Steps
In this article, you have created a pipeline with a transformation activity (HDInsight Activity) that runs a Hive script on an on-demand HDInsight cluster. To see how to use a Copy Activity to copy data from an Azure Blob to Azure SQL, see [Tutorial: Copy data from an Azure blob to Azure SQL](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).

## See Also
| Topic | Description |
|:--- |:--- |
| [Pipelines](data-factory-create-pipelines.md) |This article helps you understand pipelines and activities in Azure Data Factory and how to use them to construct end-to-end data-driven workflows for your scenario or business. |
| [Datasets](data-factory-create-datasets.md) |This article helps you understand datasets in Azure Data Factory. |
| [Scheduling and execution](data-factory-scheduling-and-execution.md) |This article explains the scheduling and execution aspects of Azure Data Factory application model. |
| [Monitor and manage pipelines using Monitoring App](data-factory-monitor-manage-app.md) |This article describes how to monitor, manage, and debug pipelines using the Monitoring & Management App. |
