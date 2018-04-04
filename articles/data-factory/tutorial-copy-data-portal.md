---
title: Use the Azure portal to create a data factory pipeline | Microsoft Docs
description: This tutorial provides step-by-step instructions for using the Azure portal to create a data factory with a pipeline. The pipeline uses the copy activity to copy data from Azure Blob storage to a SQL database.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 01/09/2018
ms.author: jingwang
---
# Copy data from Azure Blob storage to a SQL database by using Azure Data Factory
In this tutorial, you create a data factory by using the Azure Data Factory user interface (UI). The pipeline in this data factory copies data from Azure Blob storage to a SQL database. The configuration pattern in this tutorial applies to copying from a file-based data store to a relational data store. For a list of data stores supported as sources and sinks, see the [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

> [!NOTE]
> - If you're new to Data Factory, see [Introduction to Azure Data Factory](introduction.md).
>
> - This article applies to version 2 of Data Factory, which is currently in preview. If you use version 1 of  Data Factory, which is generally available, see [Get started with Data Factory version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).

In this tutorial, you perform the following steps:

> [!div class="checklist"]
> * Create a data factory.
> * Create a pipeline with a copy activity.
> * Test run the pipeline.
> * Trigger the pipeline manually.
> * Trigger the pipeline on a schedule.
> * Monitor the pipeline and activity runs.

## Prerequisites
* **Azure subscription**. If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
* **Azure storage account**. You use Blob storage as a *source* data store. If you don't have a storage account, see [Create an Azure storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account) for steps to create one.
* **Azure SQL Database**. You use the database as a *sink* data store. If you don't have a SQL database, see [Create a SQL database](../sql-database/sql-database-get-started-portal.md) for steps to create one.

### Create a blob and a SQL table

Now, prepare your Blob storage and SQL database for the tutorial by performing the following steps.

#### Create a source blob

1. Launch Notepad. Copy the following text, and save it as an **emp.txt** file on your disk:

	```
    John,Doe
    Jane,Doe
	```

2. Create a container named **adftutorial** in your Blob storage. Create a folder named **input** in this container. Then, upload the **emp.txt** file to the **input** folder. Use the Azure portal or tools such as [Azure Storage Explorer](http://storageexplorer.com/) to do these tasks.

#### Create a sink SQL table

1. Use the following SQL script to create the **dbo.emp** table in your SQL database:

    ```sql
    CREATE TABLE dbo.emp
    (
        ID int IDENTITY(1,1) NOT NULL,
        FirstName varchar(50),
        LastName varchar(50)
    )
    GO

    CREATE CLUSTERED INDEX IX_emp_ID ON dbo.emp (ID);
    ```

2. Allow Azure services to access SQL Server. Ensure that **Allow access to Azure services** is turned **ON** for your SQL Server so that Data Factory can write data to your SQL Server. To verify and turn on this setting, take the following steps:

    a. On the left, select **More services** > **SQL servers**.

    b. Select your server, and under **SETTINGS** select **Firewall**.

    c. On the **Firewall settings** page, select **ON** for **Allow access to Azure services**.

## Create a data factory
In this step, you create a data factory and start the Data Factory UI to create a pipeline in the data factory. 

1. Open the **Microsoft Edge** or **Google Chrome** web browser. Currently, Data Factory UI is supported only in Microsoft Edge and Google Chrome web browsers.
2. On the left menu, select **New** > **Data + Analytics** > **Data Factory**. 
  
   ![New data factory creation](./media/tutorial-copy-data-portal/new-azure-data-factory-menu.png)
3. On the **New data factory** page, under **Name**, enter **ADFTutorialDataFactory**. 
      
     ![New data factory](./media/tutorial-copy-data-portal/new-azure-data-factory.png)
 
   The name of the Azure data factory must be *globally unique*. If you see the following error message for the name field, change the name of the data factory (for example, yournameADFTutorialDataFactory). For naming rules for Data Factory artifacts, see [Data Factory naming rules](naming-rules.md).
  
   ![Error message](./media/tutorial-copy-data-portal/name-not-available-error.png)
4. Select the Azure **subscription** in which you want to create the data factory. 
5. For **Resource Group**, take one of the following steps:
     
    a. Select **Use existing**, and select an existing resource group from the drop-down list.

    b. Select **Create new**, and enter the name of a resource group. 
         
    To learn about resource groups, see [Use resource groups to manage your Azure resources](../azure-resource-manager/resource-group-overview.md). 
6. Under **Version**, select **V2 (Preview)**.
7. Under **Location**, select a location for the data factory. Only locations that are supported are displayed in the drop-down list. The data stores (for example, Azure Storage and SQL Database) and computes (for example, Azure HDInsight) used by the data factory can be in other regions.
8. Select **Pin to dashboard**. 
9. Select **Create**. 
10. On the dashboard, you see the following tile with the status **Deploying Data Factory**: 

	![Deploying data factory tile](media/tutorial-copy-data-portal/deploying-data-factory.png)
11. After the creation is finished, you see the **Data factory** page as shown in the image.
   
    ![Data factory home page](./media/tutorial-copy-data-portal/data-factory-home-page.png)
12. Select **Author & Monitor** to launch the Data Factory UI in a separate tab.

## Create a pipeline
In this step, you create a pipeline with a copy activity in the data factory. The copy activity copies data from Blob storage to SQL Database. In the [Quickstart tutorial](quickstart-create-data-factory-portal.md), you created a pipeline by following these steps:

1. Create the linked service. 
2. Create input and output datasets.
3. Create a pipeline.

In this tutorial, you start with creating the pipeline. Then you create linked services and datasets when you need them to configure the pipeline. 

1. On the **Let's get started** page, select **Create pipeline**. 

   ![Create pipeline](./media/tutorial-copy-data-portal/create-pipeline-tile.png)
2. In the **Properties** window for the pipeline, under **Name**, enter **CopyPipeline** for the name of the pipeline.

    ![Pipeline name](./media/tutorial-copy-data-portal/pipeline-name.png)
3. In the **Activities** tool box, expand the **Data Flow** category, and drag and drop the **Copy** activity from the tool box to the pipeline designer surface. 

    ![Copy activity](./media/tutorial-copy-data-portal/drag-drop-copy-activity.png)
4. On the **General** tab of the **Properties** window, enter **CopyFromBlobToSql** as the name of the activity.

    ![Activity name](./media/tutorial-copy-data-portal/activity-name.png)
5. Go to the **Source** tab. Select **+ New** to create a source dataset. 

    ![Source tab](./media/tutorial-copy-data-portal/new-source-dataset-button.png)
6. In the **New Dataset** window, select **Azure Blob Storage**, and then select **Finish**. The source data is in Blob storage, so you select **Azure Blob Storage** for the source dataset. 

    ![Storage selection](./media/tutorial-copy-data-portal/select-azure-storage.png)
7. You see a new tab opened in the application with the title **AzureBlob1**.

    ![AzureBlob1 tab ](./media/tutorial-copy-data-portal/new-tab-azure-blob1.png)        
8. On the **General** tab at the bottom of the **Properties** window, in **Name**, enter **SourceBlobDataset**.

    ![Dataset name](./media/tutorial-copy-data-portal/dataset-name.png)
9. Go to the **Connection** tab of the **Properties** window. Next to the **Linked service** text box, select **+ New**. 

    A linked service links a data store or a compute to the data factory. In this case, you create a Storage linked service to link your storage account to the data store. The linked service has the connection information that Data Factory uses to connect to Blob storage at runtime. The dataset specifies the container, folder, and the file (optional) that contains the source data. 

    ![New linked service button](./media/tutorial-copy-data-portal/source-dataset-new-linked-service-button.png)
10. In the **New Linked Service** window, take the following steps: 

    a. Under **Name**, enter **AzureStorageLinkedService**. 

    b. Under **Storage account name**, select your storage account.

    c. Select **Test connection** to test the connection to the storage account.

    d. Select **Save** to save the linked service.

    ![New linked service](./media/tutorial-copy-data-portal/new-azure-storage-linked-service.png)
11. Next to **File path**, select **Browse**.

    ![Browse button for file path](./media/tutorial-copy-data-portal/file-browse-button.png)
12. Go to the **adftutorial/input** folder, select the **emp.txt** file, and then select **Finish**. Alternatively, you can double-click **emp.txt**. 

    ![Select input file](./media/tutorial-copy-data-portal/select-input-file.png)
13. Confirm that **File format** is set to **Text format** and that **Column delimiter** is set to **Comma (`,`)**. If the source file uses different row and column delimiters, you can select **Detect Text Format** for **File format**. The Copy Data tool detects the file format and delimiters automatically for you. You can still override these values. To preview data on this page, select **Preview data**.

    ![Detect text format](./media/tutorial-copy-data-portal/detect-text-format.png)
14. Go to the **Schema** tab of the **Properties** window, and select **Import Schema**. Notice that the application detected two columns in the source file. You import the schema here so that you can map columns from the source data store to the sink data store. If you don't need to map columns, you can skip this step. For this tutorial, import the schema.

    ![Detect source schema](./media/tutorial-copy-data-portal/detect-source-schema.png)  
15. Now, go to the tab with the pipeline, or select the pipeline on the left.

    ![Pipeline tab](./media/tutorial-copy-data-portal/pipeline-tab.png)
16. In **Source Dataset** in the **Properties** window, confirm that **SourceBlobDataset** is selected. To preview data on this page, select **Preview data**. 
    
    ![Source dataset](./media/tutorial-copy-data-portal/source-dataset-selected.png)
17. Go to the **Sink** tab, and select **+ New** to create a sink dataset. 

    ![Sink dataset](./media/tutorial-copy-data-portal/new-sink-dataset-button.png)
18. In the **New Dataset** window, select **Azure SQL Database**, and then select **Finish**. In this tutorial, you copy data to a SQL database. 

    ![SQL database selection](./media/tutorial-copy-data-portal/select-azure-sql-database.png)
19. On the **General** tab of the **Properties** window, in **Name**, enter **OutputSqlDataset**. 
    
    ![Output dataset name](./media/tutorial-copy-data-portal/output-dataset-name.png)
20. Go to the **Connection** tab, and next to **Linked service**, select **+ New**. A dataset must be associated with a linked service. The linked service has the connection string that Data Factory uses to connect to the SQL database at runtime. The dataset specifies the container, folder, and the file (optional) to which the data is copied. 
    
    ![Linked service](./media/tutorial-copy-data-portal/new-azure-sql-database-linked-service-button.png)       
21. In the **New Linked Service** window, take the following steps: 

    a. Under **Name**, enter **AzureSqlDatabaseLinkedService**.

    b. Under **Server name**, select your SQL Server instance.

    c. Under **Database name**, select your SQL database.

    d. Under **User name**, enter the name of the user.

    e. Under **Password**, enter the password for the user.

    f. Select **Test connection** to test the connection.

    g. Select **Save** to save the linked service. 
    
    ![Save new linked service](./media/tutorial-copy-data-portal/new-azure-sql-linked-service-window.png)

22. In **Table**, select **[dbo].[emp]**. 

    ![Table](./media/tutorial-copy-data-portal/select-emp-table.png)
23. Go to the **Schema** tab, and select **Import Schema**. 

    ![Select import schema](./media/tutorial-copy-data-portal/import-destination-schema.png)
24. Select the **ID** column, and then select **Delete**. The **ID** column is an identity column in the SQL database, so the copy activity doesn't need to insert data into this column.

    ![Delete ID column](./media/tutorial-copy-data-portal/delete-id-column.png)
25. Go to the tab with the pipeline, and in **Sink Dataset**, confirm that **OutputSqlDataset** is selected.

    ![Pipeline tab](./media/tutorial-copy-data-portal/pipeline-tab-2.png)        
26. Go to the **Mapping** tab at the bottom of the **Properties** window, and select **Import Schemas**. Notice that the first and second columns in the source file are mapped to **FirstName** and **LastName** in the SQL database.

    ![Map schemas](./media/tutorial-copy-data-portal/map-schemas.png)
27. To validate the pipeline, select **Validate**. In the upper-right corner, select the right arrow to close the validation window.

    ![Pipeline validation output](./media/tutorial-copy-data-portal/pipeline-validation-output.png)   
28. In the upper-right corner, select **Code**. You see the JSON code associated with the pipeline. 

    ![Code button](./media/tutorial-copy-data-portal/code-button.png)
29. You see JSON code similar to the following snippet: 

    ```json
    {
        "name": "CopyPipeline",
        "properties": {
            "activities": [
                {
                    "name": "CopyFromBlobToSql",
                    "type": "Copy",
                    "dependsOn": [],
                    "policy": {
                        "timeout": "7.00:00:00",
                        "retry": 0,
                        "retryIntervalInSeconds": 20
                    },
                    "typeProperties": {
                        "source": {
                            "type": "BlobSource",
                            "recursive": true
                        },
                        "sink": {
                            "type": "SqlSink",
                            "writeBatchSize": 10000
                        },
                        "enableStaging": false,
                        "parallelCopies": 0,
                        "cloudDataMovementUnits": 0,
                        "translator": {
                            "type": "TabularTranslator",
                            "columnMappings": "Prop_0: FirstName, Prop_1: LastName"
                        }
                    },
                    "inputs": [
                        {
                            "referenceName": "SourceBlobDataset",
                            "type": "DatasetReference",
                            "parameters": {}
                        }
                    ],
                    "outputs": [
                        {
                            "referenceName": "OutputSqlDataset",
                            "type": "DatasetReference",
                            "parameters": {}
                        }
                    ]
                }
            ]
        }
    }
    ```

## Test run the pipeline
You can test run a pipeline before you publish artifacts (linked services, datasets, and pipeline) to Data Factory or your own Visual Studio Team Services Git repository. 

1. To test run the pipeline, select **Test Run** on the toolbar. You see the status of the pipeline run in the **Output** tab at the bottom of the window. 

    ![Test pipeline](./media/tutorial-copy-data-portal/test-run-output.png)
2. Verify that the data from the source file is inserted into the destination SQL database. 

    ![Verify SQL output](./media/tutorial-copy-data-portal/verify-sql-output.png)
3. In the left pane, select **Publish All**. This action publishes entities (linked services, datasets, and pipelines) you created to Data Factory.

    ![Publish](./media/tutorial-copy-data-portal/publish-button.png)
4. Wait until you see the **Successfully published** message. To see notification messages, on the left sidebar, select the **Show Notifications** tab. To close the notifications window, select **Close**.

    ![Show notifications](./media/tutorial-copy-data-portal/show-notifications.png)

## Configure code repository
You can publish the code associated with your data factory artifacts to a Visual Studio Team Services code repository. In this step, you create the code repository.  To learn more about visual authoring with VSTS integration, see [Author with VSTS Git integration](author-visually.md#author-with-vsts-git-integration).

If you don't want to work with the Visual Studio Team Services code repository, you can skip this step. You can continue publishing to Data Factory as you did in the previous step. 

1. In the upper-left corner, select **Data Factory**, or use the down arrow next to it, and select **Configure Code Repository**. 

    ![Configure code repository](./media/tutorial-copy-data-portal/configure-code-repository-button.png)
2. On the **Repository Settings** page, take the following steps:

    a. Under **Repository Type**, select **Visual Studio Team Services Git**.

    b. Under **Visual Studio Team Services Account**, select your Visual Studio Team Services account.

    c. Under **Project Name**, select a project in your Visual Studio Team Services account.

    d. Under **Git repository name**, enter **Tutorial2** for the Git repository to be associated with your data factory.

    e. Confirm that the **Import existing Data Factory resources to repository** check box is selected.

    f. Select **Save** to save the settings. 

    ![Repository settings](./media/tutorial-copy-data-portal/repository-settings.png)
3. Confirm that **VSTS GIT** is selected for the repository.

    ![Select VSTS GIT](./media/tutorial-copy-data-portal/vsts-git-selected.png)
4. In a separate tab in the web browser, go to the **Tutorial2** repository. You see two branches: **adf_publish** and **master**.

    ![Master and adf_publish branches](./media/tutorial-copy-data-portal/initial-branches-vsts-git.png)
5. Verify that the JSON files for the Data Factory entities are in the **master** branch.

    ![Files in the master branch](./media/tutorial-copy-data-portal/master-branch-files.png)
6. Verify that the JSON files aren't in the **adf_publish** branch yet. 

    ![Files in the adf_publish branch](./media/tutorial-copy-data-portal/adf-publish-files.png)
7. In **Description**, add a description for the pipeline, and select **Save** on the toolbar. 

    ![Pipeline description](./media/tutorial-copy-data-portal/pipeline-description.png)
8. Now, you see a branch with your user name in the **Tutorial2** repository. The change you made is in your own branch, not in the master branch. You can publish entities only from the master branch.

    ![Your branch](./media/tutorial-copy-data-portal/your-branch.png)
9. Move the mouse over the **Sync** button (don't select it yet), select the **Commit Changes** check box, and select **Sync** to sync your changes with the master branch. 

    ![Commit and sync changes](./media/tutorial-copy-data-portal/commit-and-sync.png)
10. In the **Sync your changes** window, take the following actions: 

    a. Confirm that **CopyPipeline** is shown in the updated **Pipelines** list.

    b. Confirm that **Publish changes after sync** is selected. If you clear this check box, you only sync your changes in your branch with the master branch. They aren't published to Data Factory. You can publish them later by using the **Publish** button. If you select this check box, the changes are synced to the master first, and then they're published to Data Factory.

    c. Select **Sync**. 

    ![Sync your changes](./media/tutorial-copy-data-portal/sync-your-changes.png)
11. Now, you can see files in the **adf_publish** branch of the **Tutorial2** repository. You also can find the Azure Resource Manager template for your Data Factory solution in this branch. 

    ![File list in the adf_publish branch](./media/tutorial-copy-data-portal/adf-publish-files-after-publish.png)


## Trigger the pipeline manually
In this step, you manually trigger the pipeline you published in the previous step. 

1. Select **Trigger** on the toolbar, and then select **Trigger Now**. On the **Pipeline Run** page, select **Finish**.  

    ![Trigger pipeline](./media/tutorial-copy-data-portal/trigger-now-menu.png)
2. Go to the **Monitor** tab on the left. You see a pipeline run that is triggered by a manual trigger. You can use links in the **Actions** column to view activity details and to rerun the pipeline.

    ![Monitor pipeline runs](./media/tutorial-copy-data-portal/monitor-pipeline.png)
3. To see activity runs associated with the pipeline run, select the **View Activity Runs** link in the **Actions** column. In this example, there is only one activity, so you see only one entry in the list. For details about the copy operation, select the **Details** link (eyeglasses icon) in the **Actions** column. Select **Pipelines** at the top to go back to the **Pipeline Runs** view. To refresh the view, select **Refresh**.

    ![Monitor activity runs](./media/tutorial-copy-data-portal/view-activity-runs.png)
4. Verify that two more rows are added to the **emp** table in the SQL database. 

## Trigger the pipeline on a schedule
In this schedule, you create a schedule trigger for the pipeline. The trigger runs the pipeline on the specified schedule, such as hourly or daily. In this example, you set the trigger to run every minute until the specified end datetime. 

1. Go to the **Edit** tab on the left. 

    ![Edit tab](./media/tutorial-copy-data-portal/edit-tab.png)
2. Select **Trigger**, and select **New/Edit**. If the pipeline is not active, go to it. 

    ![Trigger option](./media/tutorial-copy-data-portal/trigger-new-edit-menu.png)
3. In the **Add Triggers** window, select **Choose trigger**, and then select **+ New**. 

    ![New button](./media/tutorial-copy-data-portal/add-trigger-new-button.png)
4. In the **New Trigger** window, take the following steps: 

    a. Under **Name**, enter **RunEveryMinute**.

    b. Under **End**, select **On Date**.

    c. Under **End On**, select the drop-down list.

    d. Select the **current day** option. By default, the end day is set to the next day.

    e. Update the **minutes** part to be a few minutes past the current datetime. The trigger is activated only after you publish the changes. If you set it to only a couple of minutes apart and you don't publish it by then, you don't see a trigger run.

    f. Select **Apply**. 

    ![Trigger properties](./media/tutorial-copy-data-portal/set-trigger-properties.png)

    g. Select the **Activated** option. You can deactivate it and activate it later by using this check box.

    h. Select **Next**.

    ![Activated button](./media/tutorial-copy-data-portal/trigger-activiated-next.png)

    > [!IMPORTANT]
    > A cost is associated with each pipeline run, so set the end date appropriately. 
5. On the **Trigger Run Parameters** page, review the warning, and then select **Finish**. The pipeline in this example doesn't take any parameters. 

    ![Trigger run parameters](./media/tutorial-copy-data-portal/trigger-pipeline-parameters.png)
6. Select **Sync** to sync changes in your branch with the master branch. By default, **Publish changes after sync** is selected. When you select **Sync**, it also publishes the updated entities to Data Factory from the master branch. The trigger isn't activated until the publishing succeeds.

    ![Sync your changes](./media/tutorial-copy-data-portal/sync-your-changes-with-trigger.png) 
7. Go to the **Monitor** tab on the left to see the triggered pipeline runs. 

    ![Triggered pipeline runs](./media/tutorial-copy-data-portal/triggered-pipeline-runs.png)    
8. To switch from the **Pipeline Runs** view to the **Trigger Runs** view, select **Pipeline Runs** and then select **Trigger Runs**.
    
    ![Trigger runs](./media/tutorial-copy-data-portal/trigger-runs-menu.png)
9. You see the trigger runs in a list. 

    ![Trigger runs list](./media/tutorial-copy-data-portal/trigger-runs-list.png)
10. Verify that two rows per minute (for each pipeline run) are inserted into the **emp** table until the specified end time. 

## Next steps
The pipeline in this sample copies data from one location to another location in Blob storage. You learned how to: 

> [!div class="checklist"]
> * Create a data factory.
> * Create a pipeline with a copy activity.
> * Test run the pipeline.
> * Trigger the pipeline manually.
> * Trigger the pipeline on a schedule.
> * Monitor the pipeline and activity runs.


Advance to the following tutorial to learn how to copy data from on-premises to the cloud: 

> [!div class="nextstepaction"]
>[Copy data from on-premises to the cloud](tutorial-hybrid-copy-portal.md)
