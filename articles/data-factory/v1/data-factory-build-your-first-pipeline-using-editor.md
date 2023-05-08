---
title: Build your first data factory (Azure portal) 
description: In this tutorial, you create a sample Azure Data Factory pipeline by using the Data Factory Editor in the Azure portal.
author: dcstwh
ms.author: weetok
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: v1
ms.topic: tutorial
ms.date: 04/12/2023
---

# Tutorial: Build your first data factory by using the Azure portal
> [!div class="op_single_selector"]
> * [Overview and prerequisites](data-factory-build-your-first-pipeline.md)
> * [Visual Studio](data-factory-build-your-first-pipeline-using-vs.md)
> * [PowerShell](data-factory-build-your-first-pipeline-using-powershell.md)
> * [Azure Resource Manager template](data-factory-build-your-first-pipeline-using-arm.md)
> * [REST API](data-factory-build-your-first-pipeline-using-rest-api.md)


> [!NOTE]
> This article applies to version 1 of Azure Data Factory, which is generally available. If you use the current version of the Data Factory service, see [Quickstart: Create a data factory by using Data Factory](../quickstart-create-data-factory-dot-net.md).

> [!WARNING]
> The JSON editor in Azure Portal for authoring & deploying ADF v1 pipelines will be turned OFF on 31st July 2019. After 31st July 2019, you can continue to use [ADF v1 PowerShell cmdlets](/powershell/module/az.datafactory/), [ADF v1 .NET SDK](/dotnet/api/microsoft.azure.management.datafactories.models), [ADF v1 REST APIs](/rest/api/datafactory/) to author & deploy your ADF v1 pipelines.

In this article, you learn how to use the [Azure portal](https://portal.azure.com/) to create your first data factory. To do the tutorial by using other tools/SDKs, select one of the options from the drop-down list. 

The pipeline in this tutorial has one activity: an Azure HDInsight Hive activity. This activity runs a Hive script on an HDInsight cluster that transforms input data to produce output data. The pipeline is scheduled to run once a month between the specified start and end times. 

> [!NOTE]
> The data pipeline in this tutorial transforms input data to produce output data. For a tutorial on how to copy data by using Data Factory, see [Tutorial: Copy data from Azure Blob storage to Azure SQL Database](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).
> 
> A pipeline can have more than one activity. And, you can chain two activities (run one activity after another) by setting the output dataset of one activity as the input dataset of the other activity. For more information, see [Scheduling and execution in Data Factory](data-factory-scheduling-and-execution.md#multiple-activities-in-a-pipeline).

## Prerequisites
Read [Tutorial overview](data-factory-build-your-first-pipeline.md), and follow the steps in the "Prerequisites" section.

This article doesn't provide a conceptual overview of the Data Factory service. For more information about the service, read [Introduction to Azure Data Factory](data-factory-introduction.md).  

## Create a data factory
A data factory can have one or more pipelines. A pipeline can have one or more activities in it. An example is a Copy activity that copies data from a source to a destination data store. Another example is an HDInsight Hive activity that runs a Hive script to transform input data to produce output data. 

To create a data factory, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **New** > **Data + Analytics** > **Data Factory**.

   :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/create-blade.png" alt-text="Create blade":::

1. On the **New data factory** blade, under **Name**, enter **GetStartedDF**.

   :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/new-data-factory-blade.png" alt-text="New data factory blade":::

   > [!IMPORTANT]
   > The name of the data factory must be globally unique. If you receive the error "Data factory name GetStartedDF is not available," change the name of the data factory. For example, use  yournameGetStartedDF, and create the data factory again. For more information on naming rules, see [Data Factory: Naming rules](data-factory-naming-rules.md).
   >
   > The name of the data factory might be registered as a DNS name in the future, and it might become publicly visible.
   >
   >
1. Under **Subscription**, select the Azure subscription where you want the data factory to be created.

1. Select an existing resource group, or create a resource group. For the tutorial, create a resource group named **ADFGetStartedRG**.

1. Under **Location**, select a location for the data factory. Only regions supported by the Data Factory service are shown in the drop-down list.

1. Select the **Pin to dashboard** check box.

1. Select **Create**.

   > [!IMPORTANT]
   > To create Data Factory instances, you must be a member of the [Data Factory contributor](../../role-based-access-control/built-in-roles.md#data-factory-contributor) role at the subscription/resource group level.
   >
   >
1. On the dashboard, you see the following tile with the status **Deploying Data Factory**:    

   :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/creating-data-factory-image.png" alt-text="Deploying Data Factory status":::

1. After the data factory is created, you see the **Data factory** page, which shows you the contents of the data factory.     

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/data-factory-blade.png" alt-text="Data factory blade":::

Before you create a pipeline in the data factory, you need to create a few data factory entities first. You first create linked services to link data stores/computes to your data store. Then you define input and output datasets to represent input/output data in linked data stores. Finally, you create the pipeline with an activity that uses these datasets.

## Create linked services
In this step, you link your Azure Storage account and an on-demand HDInsight cluster to your data factory. The storage account holds the input and output data for the pipeline in this sample. The HDInsight linked service is used to run a Hive script specified in the activity of the pipeline in this sample. Identify what [data store](data-factory-data-movement-activities.md)/[compute services](data-factory-compute-linked-services.md) are used in your scenario. Then link those services to the data factory by creating linked services.  

### Create a Storage linked service
In this step, you link your storage account to your data factory. In this tutorial, you use the same storage account to store input/output data and the HQL script file.

1. On the **Data factory** blade for **GetStartedDF**, select **Author and deploy**. You see the Data Factory Editor.

   :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/data-factory-author-deploy.png" alt-text="Author and deploy tile":::

1. Select **New data store**, and choose **Azure Storage**.

   :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/new-data-store-azure-storage-menu.png" alt-text="New data store blade":::

1. You see the JSON script for creating a Storage linked service in the editor.

   :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/azure-storage-linked-service.png" alt-text="Storage linked service":::

1. Replace **account name** with the name of your storage account. Replace **account key** with the access key of the storage account. To learn how to get your storage access key, see [Manage storage account access keys](../../storage/common/storage-account-keys-manage.md).

1. Select **Deploy** on the command bar to deploy the linked service.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/deploy-button.png" alt-text="Deploy button":::

   After the linked service is deployed successfully, the Draft-1 window disappears. You see **AzureStorageLinkedService** in the tree view on the left.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/StorageLinkedServiceInTree.png" alt-text="AzureStorageLinkedService":::    

### Create an HDInsight linked service
In this step, you link an on-demand HDInsight cluster to your data factory. The HDInsight cluster is automatically created at runtime. After it's done processing and idle for the specified amount of time, it's deleted.

1. In the Data Factory Editor, select **More** > **New compute** > **On-demand HDInsight cluster**.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/new-compute-menu.png" alt-text="New compute":::

1. Copy and paste the following snippet to the Draft-1 window. The JSON snippet describes the properties that are used to create the HDInsight cluster on demand.

    ```JSON
    {
        "name": "HDInsightOnDemandLinkedService",
        "properties": {
            "type": "HDInsightOnDemand",
            "typeProperties": {
                "version": "3.5",
                "clusterSize": 1,
                "timeToLive": "00:05:00",
                "osType": "Linux",
                "linkedServiceName": "AzureStorageLinkedService"
            }
        }
    }
    ```

    The following table provides descriptions for the JSON properties used in the snippet.

   | Property | Description |
   |:--- |:--- |
   | clusterSize |Specifies the size of the HDInsight cluster. |
   | timeToLive | Specifies the idle time for the HDInsight cluster before it's deleted. |
   | linkedServiceName | Specifies the storage account that is used to store the logs that are generated by HDInsight. |

    Note the following points:

     a. The data factory creates a Linux-based HDInsight cluster for you with the JSON properties. For more information, see [On-demand HDInsight linked service](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service).

     b. You can use your own HDInsight cluster instead of using an on-demand HDInsight cluster. For more information, see [HDInsight linked service](data-factory-compute-linked-services.md#azure-hdinsight-linked-service).

     c. The HDInsight cluster creates a default container in the blob storage you specified in the JSON property (**linkedServiceName**). HDInsight doesn't delete this container when the cluster is deleted. This behavior is by design. With on-demand HDInsight linked service, an HDInsight cluster is created every time a slice is processed unless there is an existing live cluster (**timeToLive**). The cluster is automatically deleted when the processing is finished.

     As more slices are processed, you see many containers in your blob storage. If you don't need them for troubleshooting of the jobs, you might want to delete them to reduce the storage cost. The names of these containers follow a pattern: "adf**yourdatafactoryname**-**linkedservicename**-datetimestamp." Use tools such as [Azure Storage Explorer](https://storageexplorer.com/) to delete containers in your blob storage.

     For more information, see [On-demand HDInsight linked service](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service).

1. Select **Deploy** on the command bar to deploy the linked service.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/ondemand-hdinsight-deploy.png" alt-text="Deploy option":::

1. Confirm that you see both **AzureStorageLinkedService** and **HDInsightOnDemandLinkedService** in the tree view on the left.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/tree-view-linked-services.png" alt-text="Screenshot that shows that AzureStorageLinkedService and HDInsightOnDemandLinkedService are linked together.":::

## Create datasets
In this step, you create datasets to represent the input and output data for Hive processing. These datasets refer to AzureStorageLinkedService that you created previously in this tutorial. The linked service points to a storage account. Datasets specify the container, folder, and file name in the storage that holds input and output data.   

### Create the input dataset
1. In the Data Factory Editor, select **More** > **New dataset** > **Azure Blob storage**.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/new-data-set.png" alt-text="New dataset":::

1. Copy and paste the following snippet to the Draft-1 window. In the JSON snippet, you create a dataset called **AzureBlobInput** that represents input data for an activity in the pipeline. In addition, you specify that the input data is in the blob container called **adfgetstarted** and the folder called **inputdata**.

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
    The following table provides descriptions for the JSON properties used in the snippet.

   | Property | Nested under | Description |
   |:--- |:--- |:--- |
   | type | properties |The type property is set to **AzureBlob** because data resides in blob storage. |
   | linkedServiceName | format |Refers to AzureStorageLinkedService that you created previously. |
   | folderPath | typeProperties | Specifies the blob container and the folder that contains input blobs. | 
   | fileName | typeProperties |This property is optional. If you omit this property, all the files from folderPath are picked. In this tutorial, only the input.log file is processed. |
   | type | format |The log files are in text format, so use **TextFormat**. |
   | columnDelimiter | format |Columns in the log files are delimited by the comma character (`,`). |
   | frequency/interval | availability |Frequency is set to **Month** and the interval is **1**, which means that the input slices are available monthly. |
   | external | properties | This property is set to **true** if the input data isn't generated by this pipeline. In this tutorial, the input.log file isn't generated by this pipeline, so the property is set to **true**. |

    For more information about these JSON properties, see [Azure Blob connector](data-factory-azure-blob-connector.md#dataset-properties).

1. Select **Deploy** on the command bar to deploy the newly created dataset. You see the dataset in the tree view on the left.

### Create the output dataset
Now, you create the output dataset to represent the output data stored in the blob storage.

1. In the Data Factory Editor, select **More** > **New dataset** > **Azure Blob storage**.

1. Copy and paste the following snippet to the Draft-1 window. In the JSON snippet, you create a dataset called **AzureBlobOutput** to specify the structure of the data that is produced by the Hive script. You also specify that the results are stored in the blob container called **adfgetstarted** and the folder called **partitioneddata**. The **availability** section specifies that the output dataset is produced monthly.

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
    For descriptions of these properties, see the section "Create the input dataset." You do not set the external property on an output dataset because the dataset is produced by the Data Factory service.

1. Select **Deploy** on the command bar to deploy the newly created dataset.

1. Verify that the dataset is created successfully.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/tree-view-data-set.png" alt-text="Tree view with linked services":::

## Create a pipeline
In this step, you create your first pipeline with an HDInsight Hive activity. The input slice is available monthly (frequency is Month, interval is 1). The output slice is produced monthly. The scheduler property for the activity is also set to monthly. The settings for the output dataset and the activity scheduler must match. Currently, the output dataset is what drives the schedule, so you must create an output dataset even if the activity doesn't produce any output. If the activity doesn't take any input, you can skip creating the input dataset. The properties used in the following JSON snippet are explained at the end of this section.

1. In the Data Factory Editor, select **More** > **New pipeline**.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/new-pipeline-button.png" alt-text="New pipeline option":::

1. Copy and paste the following snippet to the Draft-1 window.

   > [!IMPORTANT]
   > Replace **storageaccountname** with the name of your storage account in the JSON snippet.
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
            "start": "2017-07-01T00:00:00Z",
            "end": "2017-07-02T00:00:00Z",
            "isPaused": false
        }
    }
    ```

    In the JSON snippet, you create a pipeline that consists of a single activity that uses Hive to process data on an HDInsight cluster.

    The Hive script file, **partitionweblogs.hql**, is stored in the storage account, which is specified by scriptLinkedService that is called **AzureStorageLinkedService**. You can find it in the **script** folder in the container **adfgetstarted**.

    The **defines** section is used to specify the runtime settings that are passed to the Hive script as Hive configuration values. Examples are ${hiveconf:inputtable} and ${hiveconf:partitionedtable}.

    The **start** and **end** properties of the pipeline specify the active period of the pipeline.

    In the activity JSON, you specify that the Hive script runs on the compute specified by **linkedServiceName**: **HDInsightOnDemandLinkedService**.

   > [!NOTE]
   > For more information about the JSON properties used in the example, see the "Pipeline JSON" section in [Pipelines and activities in Data Factory](data-factory-create-pipelines.md).
   >
   >
1. Confirm the following:

   a. The **input.log** file exists in the **inputdata** folder of the **adfgetstarted** container in the blob storage.

   b. The **partitionweblogs.hql** file exists in the **script** folder of the **adfgetstarted** container in the blob storage. If you don't see these files, follow the steps in the "Prerequisites" section in [Tutorial overview](data-factory-build-your-first-pipeline.md).

   c. You replaced **storageaccountname** with the name of your storage account in the pipeline JSON.

1. Select **Deploy** on the command bar to deploy the pipeline. Because the **start** and **end** times are set in the past and **isPaused** is set to **false**, the pipeline (activity in the pipeline) runs immediately after you deploy it.

1. Confirm that you see the pipeline in the tree view.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/tree-view-pipeline.png" alt-text="Tree view with pipeline":::



## Monitor a pipeline
### Monitor a pipeline by using the Diagram view
1. On the **Data factory** blade, select **Diagram**.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/diagram-tile.png" alt-text="Diagram tile":::

1. In the **Diagram** view, you see an overview of the pipelines and datasets used in this tutorial.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/diagram-view-2.png" alt-text="Diagram view":::

1. To view all activities in the pipeline, right-click the pipeline in the diagram, and select **Open pipeline**.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/open-pipeline-menu.png" alt-text="Open pipeline menu":::

1. Confirm that you see **Hive Activity** in the pipeline.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/open-pipeline-view.png" alt-text="Open pipeline view":::

    To go back to the previous view, select **Data factory** in the menu at the top.

1. In the **Diagram** view, double-click the dataset **AzureBlobInput**. Confirm that the slice is in the **Ready** state. It might take a couple of minutes for the slice to show up as **Ready**. If it doesn't appear after you wait for some time, see if you have the input file (**input.log**) placed in the right container (**adfgetstarted**) and folder (**inputdata**).

   :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/input-slice-ready.png" alt-text="Input slice in Ready state":::

1. Close the **AzureBlobInput** blade.

1. In the **Diagram** view, double-click the dataset **AzureBlobOutput**. You see the slice that is currently being processed.

   :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/dataset-blade.png" alt-text="Dataset processing in progress":::

1. After the processing is finished, you see the slice in the **Ready** state.

   :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/dataset-slice-ready.png" alt-text="Dataset in Ready state":::  

   > [!IMPORTANT]
   > Creation of an on-demand HDInsight cluster usually takes approximately 20 minutes. Expect the pipeline to take approximately 30 minutes to process the slice.
   >
   >

1. When the slice is in the **Ready** state, check the **partitioneddata** folder in the **adfgetstarted** container in your blob storage for the output data.  

   :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/three-ouptut-files.png" alt-text="Output data":::

1. Select the slice to see more information about it in a **Data slice** blade.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/data-slice-details.png" alt-text="Data slice information":::

1. In the **Activity runs** list, select an activity run to see more information about it. (In this scenario, it's a Hive activity.) The information appears in an **Activity run details** blade.   

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/activity-window-blade.png" alt-text="Activity run details window":::    

   From the log files, you can see the Hive query that was executed and the status information. These logs are useful for troubleshooting any issues.
   For more information, see [Monitor and manage pipelines by using Azure portal blades](data-factory-monitor-manage-pipelines.md).

> [!IMPORTANT]
> The input file gets deleted when the slice is processed successfully. Therefore, if you want to rerun the slice or do the tutorial again, upload the input file (**input.log**) to the **inputdata** folder of the **adfgetstarted** container.
>
>

### Monitor a pipeline by using the Monitor & Manage app
You also can use the Monitor & Manage application to monitor your pipelines. For more information about how to use this application, see [Monitor and manage Data Factory pipelines by using the Monitor & Manage app](data-factory-monitor-manage-app.md).

1. Select the **Monitor & Manage** tile on the home page for your data factory.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/monitor-and-manage-tile.png" alt-text="Monitor & Manage tile":::

1. In the Monitor & Manage application, change the **Start time** and **End time** to match the start and end times of your pipeline. Select **Apply**.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/monitor-and-manage-app.png" alt-text="Monitor & Manage app":::

1. Select an activity window in the **Activity Windows** list to see information about it.

    :::image type="content" source="./media/data-factory-build-your-first-pipeline-using-editor/activity-window-details.png" alt-text="Activity Windows list":::

## Summary
In this tutorial, you created a data factory to process data by running a Hive script on an HDInsight Hadoop cluster. You used the Data Factory Editor in the Azure portal to do the following:  

* Create a data factory.
* Create two linked services:
   * A Storage linked service to link your blob storage that holds input/output files to the data factory.
   * An HDInsight on-demand linked service to link an on-demand HDInsight Hadoop cluster to the data factory. Data Factory creates an HDInsight Hadoop cluster just in time to process input data and produce output data.
* Create two datasets, which describe input and output data for an HDInsight Hive activity in the pipeline.
* Create a pipeline with an HDInsight Hive activity.

## Next steps
In this article, you created a pipeline with a transformation activity (HDInsight activity) that runs a Hive script on an on-demand HDInsight cluster. To see how to use a Copy activity to copy data from blob storage to Azure SQL Database, see [Tutorial: Copy data from Blob storage to SQL Database](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).

## See also
| Topic | Description |
|:--- |:--- |
| [Pipelines](data-factory-create-pipelines.md) |This article helps you understand pipelines and activities in Data Factory and how to use them to construct end-to-end data-driven workflows for your scenario or business. |
| [Datasets](data-factory-create-datasets.md) |This article helps you understand datasets in Data Factory. |
| [Scheduling and execution](data-factory-scheduling-and-execution.md) |This article explains the scheduling and execution aspects of the Data Factory application model. |
| [Monitor and manage pipelines by using the Monitor & Manage app](data-factory-monitor-manage-app.md) |This article describes how to monitor, manage, and debug pipelines by using the Monitor & Manage app. |