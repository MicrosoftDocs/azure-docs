---
title: Create an Azure data factory using the Azure Data Factory UI | Microsoft Docs
description: 'This tutorial shows you how to create a data factory with a pipeline that copies data from one folder to another folder in Azure Blob Storage.'
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.topic: hero-article
ms.date: 01/16/2018
ms.author: jingwang

---
# Create a data factory using the Azure Data Factory UI
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1 - GA](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
> * [Version 2 - Preview](quickstart-create-data-factory-portal.md)

This quickstart describes how to use the Azure Data Factory UI to create and monitor a data factory. The pipeline you create in this data factory **copies** data from one folder to another folder in an Azure blob storage. For a tutorial on how to **transform** data using Azure Data Factory, see [Tutorial: Transform data using Spark](tutorial-transform-data-spark-portal.md). 


> [!NOTE]
> If you are new to Azure Data Factory, see [Introduction to Azure Data Factory](data-factory-introduction.md) before doing this quickstart. 
>
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of Data Factory, which is generally available (GA), see [Data Factory version 1 - tutorial](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).

[!INCLUDE [data-factory-quickstart-prerequisites](../../includes/data-factory-quickstart-prerequisites.md)] 

## Create a data factory

1. Navigate to the [Azure portal](https://portal.azure.com). 
2. Click **New** on the left menu, click **Data + Analytics**, and click **Data Factory**. 
   
   ![New->DataFactory](./media/quickstart-create-data-factory-portal/new-azure-data-factory-menu.png)
2. In the **New data factory** page, enter **ADFTutorialDataFactory** for the **name**. 
      
     ![New data factory page](./media/quickstart-create-data-factory-portal/new-azure-data-factory.png)
 
   The name of the Azure data factory must be **globally unique**. If you see the following error for the name field, change the name of the data factory (for example, yournameADFTutorialDataFactory). See [Data Factory - Naming Rules](naming-rules.md) article for naming rules for Data Factory artifacts.
  
     ![Name not available - error](./media/quickstart-create-data-factory-portal/name-not-available-error.png)
3. Select your Azure **subscription** in which you want to create the data factory. 
4. For the **Resource Group**, do one of the following steps:
     
      - Select **Use existing**, and select an existing resource group from the drop-down list. 
      - Select **Create new**, and enter the name of a resource group.   
         
    To learn about resource groups, see [Using resource groups to manage your Azure resources](../azure-resource-manager/resource-group-overview.md).  
4. Select **V2 (Preview)** for the **version**.
5. Select the **location** for the data factory. Only locations that are supported by Data Factory are shown in the drop-down list. The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other locations.
6. Select **Pin to dashboard**.     
7. Click **Create**.
8. On the dashboard, you see the following tile with status: **Deploying data factory**. 

    ![deploying data factory tile](media//quickstart-create-data-factory-portal/deploying-data-factory.png)
9. After the creation is complete, you see the **Data Factory** page as shown in the image.
   
    ![Data factory home page](./media/quickstart-create-data-factory-portal/data-factory-home-page.png)
10. Click **Author & Monitor** tile to launch the Azure Data Factory user interface (UI) application in a separate tab. 
11. In the get started page, switch to the **Edit** tab in the left panel as shown in the following image: 

    ![Get started page](./media/quickstart-create-data-factory-portal/get-started-page.png)

## Create Azure Storage linked service
In this step, you create a linked service to link your Azure Storage Account to the data factory. The linked service has the connection information that the Data Factory service uses at runtime to connect to it.

2. Click **Connections**, and then click the **New** button on the toolbar. 

    ![New connection](./media/quickstart-create-data-factory-portal/new-connection-button.png)    
3. In the **New Linked Service** page, select **Azure Blob Storage**, and click **Continue**. 

    ![Select Azure Storage](./media/quickstart-create-data-factory-portal/select-azure-storage.png)
4. In the **New Linked Service** page, do the following steps: 

    1. Enter **AzureStorageLinkedService** for the **Name**.
    2. Select the name of your Azure Storage Account for the **storage account name**.
    3. Click **Test connection** to confirm that the Data Factory service can connect to the storage account. 
    4. Click **Save** to save the linked service. 

        ![Azure Storage Linked Service settings](./media/quickstart-create-data-factory-portal/azure-storage-linked-service.png) 
5. Confirm that you see **AzureStorageLinkedService** in the list of linked services. 

    ![Azure Storage linked service in the list](./media/quickstart-create-data-factory-portal/azure-storage-linked-service-in-list.png)

## Create datasets
In this step, you create two datasets: **InputDataset** and **OutputDataset**. These datasets are of type **AzureBlob**. They refer to the **Azure Storage linked service** you created in the previous step. 

The input dataset represents the source data in the input folder. In the input dataset definition, you specify the blob container (**adftutorial**), folder (**input**), and the file (**emp.txt**) that contains the source data. 

The output dataset represents the data that's copied to the destination. In the output dataset definition, you specify the blob container (**adftutorial**), folder (**output**), and the file to which the data is copied. Each run of a pipeline has a unique ID associated with it, which can be accessed by using the system variable **RunId**. The name of the output file is dynamically evaluated based on the run ID of the pipeline.   

In the linked service settings, you specified the Azure storage account that contains the source data. In the source dataset settings, you specify where exactly the source data resides (blob container, folder, and file). In the sink dataset settings, you specify where the data is copied to (blob container, folder, and file). 
 
1. Click the **+ (plus)** button, and select **Dataset**.

    ![New dataset menu](./media/quickstart-create-data-factory-portal/new-dataset-menu.png)
2. In the **New Dataset** page, select **Azure Blob Storage**, and click **Finish**. 

    ![Select Azure Blob Storage](./media/quickstart-create-data-factory-portal/select-azure-blob-storage.png)
3. In the **Properties** window for the dataset, enter **InputDataset** for **Name**. 

    ![Dataset general settings](./media/quickstart-create-data-factory-portal/dataset-general-page.png)
4. Switch to the **Connection** tab and do the following steps: 

    1. Select **AzureStorageLinkedService** for the linked service. 
    2. Click **Browse** button for the **File path**. 
        ![Browse for the input file](./media/quickstart-create-data-factory-portal/file-path-browse-button.png)
    3. In the **Choose a file or folder** window, navigate to the **input** folder in the **adftutorial** container, select **emp.txt** file, and click **Finish**.

        ![Browse for the input file](./media/quickstart-create-data-factory-portal/choose-file-folder.png)
    4. (optional) Click **Preview data** to preview the data in the emp.txt file.     
5. Repeat the steps to create the output dataset.  

    1. Click the **+ (plus)** button in the left pane, and select **Dataset**.
    2. In the **New Dataset** page, select **Azure Blob Storage**, and click **Finish**.
    3. Specify **OutputDataset** for the name.
    4. Enter **adftutorial/output** for the folder. The Copy activity creates the output folder if it doesn't exist. 
    5. Enter `@CONCAT(pipeline().RunId, '.txt')` for the file name. Each time you run a pipeline, the pipeline run has a unique ID associated with it. The expression concatenates the run ID of the pipeline with **.txt** to evaluate the output file name. For the supported list of system variables and expressions, see [System variables](control-flow-system-variables.md) and [Expression language](control-flow-expression-language-functions.md).

        ![Output dataset settings](./media/quickstart-create-data-factory-portal/output-dataset-settings.png)

## Create a pipeline 
In this step, you create and validate a pipeline with a **Copy** activity that uses the input and output datasets. The Copy activity copies data from the file specified in the input dataset settings to the file specified in the output dataset settings. If the input dataset specifies only a folder (not the file name), the Copy activity copies all the files in the source folder to the destination. 

1. Click the **+ (plus)** button, and select **Pipeline**. 

    ![New pipeline menu](./media/quickstart-create-data-factory-portal/new-pipeline-menu.png)
2. Specify **CopyPipeline** for **Name** in the **Properties** window. 

    ![Pipeline general settings](./media/quickstart-create-data-factory-portal/pipeline-general-settings.png)
3. In the **Activities** toolbox, expand **Data Flow**, and drag-and-drop the **Copy** activity from the **Activities** toolbox to the pipeline designer surface. You can also search for activities in the **Activities** toolbox. Specify **CopyFromBlobToBlob** for the **name**.

    ![Copy activity general settings](./media/quickstart-create-data-factory-portal/copy-activity-general-settings.png)
4. Switch to the **Source** tab in the copy activity settings, and select **InputDataset** for the **source dataset**.

    ![Copy activity source settings](./media/quickstart-create-data-factory-portal/copy-activity-source-settings.png)    
5. Switch to the **Sink** tab in the copy activity settings, and select **OutputDataset** for the **sink dataset**.

    ![Copy activity sink settings](./media/quickstart-create-data-factory-portal/copy-activity-sink-settings.png)    
7. Click **Validate** to validate the pipeline settings. Confirm that pipeline has been successfully validated. To close the validation output, click the **right-arrow** (>>) button. 

    ![Validate the pipeline](./media/quickstart-create-data-factory-portal/pipeline-validate-button.png)

## Test run the pipeline
In this step, you test run the pipeline before deploying it to the Data Factory. 

1. On the toolbar for the pipeline, click **Test Run**. 
    
    ![Pipeline test runs](./media/quickstart-create-data-factory-portal/pipeline-test-run.png)
2. Confirm that you see the status of the pipeline run in the **Output** tab of the pipeline settings. 

    ![Test run output](./media/quickstart-create-data-factory-portal/test-run-output.png)    
3. Confirm that you see an output file in the **output** folder of the **adftutorial** container. If the output folder does not exist, the Data Factory service automatically creates it. 
    
    ![Verify output](./media/quickstart-create-data-factory-portal/verify-output.png)


## Trigger the pipeline manually
In this step, you deploy entities (linked services, datasets, pipelines) to Azure Data Factory. Then, you manually trigger a pipeline run. You can also publish entities your own VSTS GIT repository, which is covered in [another tutorial](tutorial-copy-data-portal.md?#configure-code-repository).

1. Before triggering a pipeline, you must publish entities to Data Factory. To publish, click **Publish** in the left pane. 

    ![Publish button](./media/quickstart-create-data-factory-portal/publish-button.png)
2. To trigger the pipeline manually, click **Trigger** on the toolbar, and select **Trigger Now**. 
    
    ![Trigger now](./media/quickstart-create-data-factory-portal/pipeline-trigger-now.png)

## Monitor the pipeline

1. Switch to the **Monitor** tab on the left. Use the **Refresh** button to refresh the list.

    ![Monitor the pipeline](./media/quickstart-create-data-factory-portal/monitor-trigger-now-pipeline.png)
2. Click the **View Activity Runs** link under **Actions**. You see the status of the copy activity run in this page. 

    ![Pipeline activity runs](./media/quickstart-create-data-factory-portal/pipeline-activity-runs.png)
3. To view details about the copy operation, click the **Details** (eye glasses image) link in the **Actions** column. For details about the properties, see [Copy Activity overview](copy-activity-overview.md). 

    ![Copy operation details](./media/quickstart-create-data-factory-portal/copy-operation-details.png)
4. Confirm that you see a new file in the **output** folder. 
5. You can switch back to the **Pipeline Runs** view from the **Activity Runs** view by clicking **Pipelines** link. 

## Trigger the pipeline on a schedule
This step is optional in this tutorial. You can create a **scheduler trigger** to schedule the pipeline to run periodically (hourly, daily, etc.). In this step, you create a trigger to run every minute until the datetime you specify as the end date. 

1. Switch to the **Edit** tab. 

    ![Switch to Edit tab](./media/quickstart-create-data-factory-portal/switch-edit-tab.png)
1. Click **Trigger** on the menu, and click **New/Edit**. 

    ![New trigger menu](./media/quickstart-create-data-factory-portal/new-trigger-menu.png)
2. In the **Add Triggers** page, click **Choose trigger...**, and click **New**. 

    ![Add triggers - new trigger](./media/quickstart-create-data-factory-portal/add-trigger-new-button.png)
3. In the **New Trigger** page, For the **End** field, select **On Date**, specify end time a few minutes after the current time, and click **Apply**. There is a cost associated with each pipeline run, so specify the end time only minutes apart from the start time. Ensure that it's the same day. However, ensure that there is enough time for the pipeline to run between the publish time and the end time. The trigger comes into effect only after you publish the solution to Data Factory, not when you save the trigger in the UI. 

    ![Trigger settings](./media/quickstart-create-data-factory-portal/trigger-settings.png)
4. Check the **Activated** option in the **New Trigger** page, and click **Next** 

    ![Trigger settings - Next button](./media/quickstart-create-data-factory-portal/trigger-settings-next.png)
5. In the **New Trigger** page, review the warning message, and click **Finish**.

    ![Trigger settings - Finish button](./media/quickstart-create-data-factory-portal/new-trigger-finish.png)
6. Click **Publish** to publish changes to Data Factory. 

    ![Publish button](./media/quickstart-create-data-factory-portal/publish-2.png)
8. Switch to the **Monitor** tab on the left. Click **Refresh** to refresh the list. You see the pipeline runs once every minute from the publish time to the end time. Notice the values in the **Triggered By** column. The manual trigger run was from the step (**Trigger Now**) you did earlier. 

    ![Monitor triggered runs](./media/quickstart-create-data-factory-portal/monitor-triggered-runs.png)
9. Click the down-arrow next to **Pipeline Runs** to switch to the **Trigger Runs** view. 

    ![Monitor trigger runs](./media/quickstart-create-data-factory-portal/monitor-trigger-runs.png)    
10. Confirm that an **output file** is created for every pipeline run until the specified end datetime in the **output** folder. 

## Next steps
The pipeline in this sample copies data from one location to another location in an Azure blob storage. Go through the [tutorials](tutorial-copy-data-portal.md) to learn about using Data Factory in more scenarios. 