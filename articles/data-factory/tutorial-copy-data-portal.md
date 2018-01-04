---
title: 'Use Azure portal to create a Data Factory pipeline | Microsoft Docs'
description: 'This tutorial provides step-by-step instructions for using an Azure portal to create a data factory with a pipeline. The pipeline uses the copy activity to copy data from an Azure blob storage to an Azure SQL database. '
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 01/03/2017
ms.author: jingwang
---
# Copy data from Azure Blob to Azure SQL Database using Azure Data Factory (Azure portal)
In this tutorial, you create a data factory by using the Azure portal. The pipeline in this data factory copies data from Azure Blob Storage to Azure SQL Database. The configuration pattern in this tutorial applies to copying from a file-based data store to a relational data store. For a list of data stores supported as sources and sinks, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [documentation for Data Factory version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).


You perform the following steps in this tutorial:

> [!div class="checklist"]
> * Create a data factory.
> * Create a pipeline with a Copy activity.
> * Test run the pipeline
> * Trigger the pipeline manually
> * Trigger the pipeline on a schedule
> * Monitor the pipeline and activity runs.

## Prerequisites
* **Azure Subscription**. If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
* **Azure Storage account**. You use the blob storage as **source** data store. If you don't have an Azure storage account, see the [Create a storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account) article for steps to create one.
* **Azure SQL Database**. You use the database as **sink** data store. If you don't have an Azure SQL Database, see the [Create an Azure SQL database](../sql-database/sql-database-get-started-portal.md) article for steps to create one.

### Create a blob and a SQL table

Now, prepare your Azure Blob and Azure SQL Database for the tutorial by performing the following steps:

#### Create a source blob

1. Launch Notepad. Copy the following text and save it as **inputEmp.txt** file on your disk.

	```
    John|Doe
    Jane|Doe
	```

2. Create a container named **adfv2tutorial** in your Azure blob storage. Create a folder named **input** in this container. Then, upload the **inputEmp.txt** file to the **input** folder. Use the Azure portal or tools such as [Azure Storage Explorer](http://storageexplorer.com/) to do these tasks.

#### Create a sink SQL table

1. Use the following SQL script to create the **dbo.emp** table in your Azure SQL Database.

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

2. Allow Azure services to access SQL server. Ensure that **Allow access to Azure services** setting is turned **ON** for your Azure SQL server so that the Data Factory service can write data to your Azure SQL server. To verify and turn on this setting, do the following steps:

    1. Click **More services** hub on the left and click **SQL servers**.
    2. Select your server, and click **Firewall** under **SETTINGS**.
    3. In the **Firewall settings** page, click **ON** for **Allow access to Azure services**.

## Create a data factory

1. Click **New** on the left menu, click **Data + Analytics**, and click **Data Factory**. 
   
   ![New->DataFactory](./media/tutorial-copy-data-portal/new-azure-data-factory-menu.png)
2. In the **New data factory** page, enter **ADFTutorialDataFactory** for the **name**. 
      
     ![New data factory page](./media/tutorial-copy-data-portal/new-azure-data-factory.png)
 
   The name of the Azure data factory must be **globally unique**. If you receive the following error, change the name of the data factory (for example, yournameADFTutorialDataFactory) and try creating again. See [Data Factory - Naming Rules](naming-rules.md) article for naming rules for Data Factory artifacts.
  
       `Data factory name “ADFTutorialDataFactory” is not available`
3. Select your Azure **subscription** in which you want to create the data factory. 
4. For the **Resource Group**, do one of the following steps:
     
      - Select **Use existing**, and select an existing resource group from the drop-down list. 
      - Select **Create new**, and enter the name of a resource group.   
         
        To learn about resource groups, see [Using resource groups to manage your Azure resources](../azure-resource-manager/resource-group-overview.md).  
4. Select **V2 (Preview)** for the **version**.
5. Select the **location** for the data factory. Only locations that are supported are displayed in the drop-down list. The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other regions.
6. Select **Pin to dashboard**.     
7. Click **Create**.      
8. On the dashboard, you see the following tile with status: **Deploying data factory**. 

	![deploying data factory tile](media/tutorial-copy-data-portal/deploying-data-factory.png)
9. After the creation is complete, you see the **Data Factory** page as shown in the image.
   
   ![Data factory home page](./media/tutorial-copy-data-portal/data-factory-home-page.png)
10. Click **Author & Monitor** tile to launch the Data Integration Application in a separate tab.

## Create a pipeline

1. In the get started page, click **Create Pipeline** tile (or) click **Edit** tab on the left. 

   ![Create pipeline tile](./media/tutorial-copy-data-portal/create-pipeline-tile.png)
2. Click + (plus), and click Pipeline. 

   ![New pipeline menu](./media/tutorial-copy-data-portal/new-pipeline-menu.png)
3. Set the **name** of the pipeline to **CopyPipeline**.

    ![Pipeline name](./media/tutorial-copy-data-portal/pipeline-name.png)
4. Drag-drop the **Copy** activity from the tool box to the pipeline designer surface. 

    ![Drag-drop copy activity](./media/tutorial-copy-data-portal/drag-drop-copy-activity.png)
5. In the **General** tab, specify **CopyFromBlobToSql** as the name of the activity.

    ![Activity name](./media/tutorial-copy-data-portal/activity-name.png)
6. Switch to the **Source** tab. Click **+ New** to create a source dataset. 

    ![New source dataset menu](./media/tutorial-copy-data-portal/new-source-dataset-button.png)
7. In the **New Dataset** window, select **Azure Blob Storage**, and click **Finish**.

    ![Select Azure Blob Storage](./media/tutorial-copy-data-portal/select-azure-storage.png)
8. You see a new **tab** opened in the application with the title **AzureBlob1**.

    ![Azure Blob1 tab ](./media/tutorial-copy-data-portal/new-tab-azure-blob1.png)        
9. In the **General** tab in the properties window at the bottom, specify **SourceBlobDataset** for the **name**.

    ![Dataset name](./media/tutorial-copy-data-portal/dataset-name.png)
10. Switch to the **Connection** tab in the properties window.   

    ![Connection tab](./media/tutorial-copy-data-portal/source-dataset-connection-tab.png)
11. Click **+ New** next to the **Linked service** text box. 

    ![New linked service button](./media/tutorial-copy-data-portal/source-dataset-new-linked-service-button.png)
12. In the **New Linked Service** window, do the following steps: 

    1. specify **AzureStorageLinkedService** for the **Name** field. 
    2. Select your Azure storage account for the **Storage account name** field.
    3. Click **Test connection** to test the connection to the Azure Storage account.  
    4. Click **Save** to save the linked service.

        ![New Azure Storage Linked Service](./media/tutorial-copy-data-portal/new-azure-storage-linked-service.png)
1. Click **Browse** for the **File path** field.  

    ![Browse button for file](./media/tutorial-copy-data-portal/file-browse-button.png)
14. Navigate to the **adfv2tutorial/input** folder, and select **inputEmp.txt** file.

    ![Select input file](./media/tutorial-copy-data-portal/select-input-file.png)
15. Click **Detect Text Format** for the **File format** field. Confirm that you see **Pipe** character as the **column delimiter**.

    ![Detect text format](./media/tutorial-copy-data-portal/detect-text-format.png)
16. Click **Preview data** button to preview data in the source file (inputEmp.txt).Close the **Data Preview** window by clicking the **X** button. 
    
    ![Preview data](./media/tutorial-copy-data-portal/preview-data.png)
17. Switch to the **Schema** tab in the properties window, and click **Import Schema**. Notice that the application detected two columns in the source file. 

    ![Detect source schema](./media/tutorial-copy-data-portal/detect-source-schema.png)  
19. Now, switch to the **tab with the pipeline**. 

    ![Pipeline tab](./media/tutorial-copy-data-portal/pipeline-tab.png)
20. Confirm that the **SourceBlobDataset** is selected for the Source Dataset field in the properties window. You can preview data in this window too by clicking **Preview data**. 
    
    ![Source dataset](./media/tutorial-copy-data-portal/source-dataset-selected.png)
21. Switch to the **Sink** tab, and click **New** to create a sink dataset. 

    ![New sink dataset menu](./media/tutorial-copy-data-portal/new-sink-dataset-button.png)
22. In the **New Dataset** window, select **Azure SQL Database**, and click **Finish**. 

    ![Select Azure SQL Database](./media/tutorial-copy-data-portal/select-azure-sql-database.png)
23. In the **General** tab of the properties window, set the name to **OutputSqlDataset**. 
    
    ![Output dataset name](./media/tutorial-copy-data-portal/output-dataset-name.png)
24. Switch to the **Connection** tab, and click **New** for the **Linked service**. 
    
    ![New linked service button](./media/tutorial-copy-data-portal/new-azure-sql-database-linked-service-button.png)       
25. In the **New Linked Service** window, do the following steps: 

    1. Enter **AzureSqlDatabaseLinkedService** for the **Name** field. 
    2. Select your Azure SQL server for the **Server name** field.
    4. Select your Azure SQL database for the **Database name** field. 
    5. Enter name of the user for the **User name** field. 
    6. Enter password for the user for the **Password** field. 
    7. Click **Test connection** to test the connection.
    8. Click **Save** to save the linked service. 
    
        ![New Azure SQL Database linked service](./media/tutorial-copy-data-portal/new-azure-sql-linked-service-window.png)

1. Select **[dbo].[emp]** for **Table**. 

    ![Select emp table](./media/tutorial-copy-data-portal/select-emp-table.png)
27. Switch to **Schema** tab, and click Import Schema. 

    ![Import destination schema](./media/tutorial-copy-data-portal/import-destination-schema.png)
28. Select **ID** column, and click **Delete**. The ID column is an identity column in the SQL database, so copy activity does not need to insert data into this column.

    ![Delete ID column](./media/tutorial-copy-data-portal/delete-id-column.png)
30. Switch to the tab with the **pipeline**, and confirm that **OutputSqlDataset** is selected for **Sink Dataset**.

    ![Pipeline tab](./media/tutorial-copy-data-portal/pipeline-tab-2.png)        
31. Switch to the **Mapping** tab in the properties window at the bottom, and click **Import Schemas**. Notice that the first and second columns in the source file are mapped to the **FirstName** and **LastName** fields in the SQL database.

    ![Map schemas](./media/tutorial-copy-data-portal/map-schemas.png)
33. Validate the pipeline by clicking the **Validate** button. Click the **right-arrow** to close the validation window.

    ![Pipeline validation output](./media/tutorial-copy-data-portal/pipeline-validation-output.png)   
34. Click **Code** button in the right corner to see the JSON code associated with the pipeline. 

    ![Code button](./media/tutorial-copy-data-portal/code-button.png)
35. You see the JSON code similar to the following snippet:  

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
## Configure code repository
You can publish the code associated with your data factory artifacts to a Visual Studio Team System (VSTS) code repository. In this step, you create the code repository. 

1. Click **Data Factory** in the left corner (or) the down arrow next to it, and click **Configure Code Repository**. 

    ![Code button](./media/tutorial-copy-data-portal/configure-code-repository-button.png)
2. In the **Repository Settings** page, do the following steps: 
    1. Select **Visual Studio Team Services Git** for the **Repository Type** field.
    2. Select your VSTS account for the **Visual Studio Team Services Account** field.
    3. Select a project in your VSTS account for the **Project Name** field.
    4. Enter a **name for the Git repository** to be associated with your data factory. 
    5. Click **Save** to save the settings. 

        ![Repository settings](./media/tutorial-copy-data-portal/repository-settings.png)
3. 

## Test run the pipeline

1. To test run the pipeline, click **Test Run** on the toolbar. You see the status of the pipeline run in the **Output** tab of the window at the bottom. 

    ![Test Run button](./media/tutorial-copy-data-portal/test-run-output.png)
2. Verify that the data from the source file is inserted into the destination SQL database. 

    ![Verify SQL output](./media/tutorial-copy-data-portal/verify-sql-output.png)

## Trigger the pipeline manually

1. Click **Trigger** on the toolbar, and click **Trigger Now**. 

    ![Trigger now menu](./media/tutorial-copy-data-portal/trigger-now-menu.png)
2. Switch to the **Monitor** tab on the left. You see a pipeline run that is triggered by a manual trigger. You can use links in the Actions column to view activity details and to rerun the pipeline.

    ![Monitor pipeline run](./media/tutorial-copy-data-portal/monitor-pipeline.png)
3. Click **View Activity Runs** link in the **Actions** column to see the details about activity runs associated with the pipeline. In this example, there is only one activity, so you see only one entry in the list. You can click **Pipelines** at the top to switch back to the **Pipeline Runs** view.

    ![View activity runs](./media/tutorial-copy-data-portal/view-activity-runs.png)
4. Verify that two more rows are added to the **emp** table in the Azure SQL database. 

## Trigger the pipeline on a schedule

1. Switch to the **Edit** tab on the left. 

    ![Edit tab](./media/tutorial-copy-data-portal/edit-tab.png)
2. Click **Trigger**, and select **New/Edit**. If the pipeline is not in the active, switch to it. 

    ![Trigger new/edit menu](./media/tutorial-copy-data-portal/trigger-new-edit-menu.png)
3. In the **Add Triggers** window, click **Choose trigger...**, and click **+ New**. 

    ![Add Triggers - new trigger](./media/tutorial-copy-data-portal/add-trigger-new-button.png)
4. In the New Trigger window, do the following steps: 

    1. Set the **name** to **RunEveryMinute**.
    2. Select **On Date** for **End**. 
    3. Click the drop-down list for **End On**, and update the minutes part so that the trigger runs for a few times, and then click **Apply**.
    4. Check the **Activated** option. 

    ![Set trigger properties](./media/tutorial-copy-data-portal/set-trigger-properties.png)

1. Click **Next**. Notice that the trigger is activated by default. You can deactivate it and activate it later by using this check box. 

    ![Activated trigger](./media/tutorial-copy-data-portal/trigger-activiated-next.png)
6. In the **Trigger Run Parameters** page, review the warning, and click **Finish**. The pipeline in this example does not take any parameters. 

    ![Pipeline parameters](./media/tutorial-copy-data-portal/trigger-pipeline-parameters.png)
7. Click **Publish** to publish the changes to the repository. 

    ![Publish trigger](./media/tutorial-copy-data-portal/publish-trigger.png) 
8. Switch to the **Monitor** tab on the left to see the triggered pipeline runs. 

    ![Triggered pipeline runs](./media/tutorial-copy-data-portal/triggered-pipeline-runs.png)    
9. To switch from the pipeline runs view to the trigger runs view, click Pipeline Runs and select Trigger Runs.
    
    ![Trigger runs menu](./media/tutorial-copy-data-portal/trigger-runs-menu.png)
10. You see the trigger runs in a list. 

    ![Trigger runs list](./media/tutorial-copy-data-portal/trigger-runs-list.png)
11. Verify that two rows per minute (for each pipeline run) are inserted into the **emp** table until the specified end time. 

## Next steps
The pipeline in this sample copies data from one location to another location in an Azure blob storage. You learned how to: 

> [!div class="checklist"]
> * Create a data factory.
> * Create a pipeline with a Copy activity.
> * Test run the pipeline
> * Trigger the pipeline manually
> * Trigger the pipeline on a schedule
> * Monitor the pipeline and activity runs.


Advance to the following tutorial to learn about copying data from on-premises to cloud: 

> [!div class="nextstepaction"]
>[Copy data from on-premises to cloud](tutorial-hybrid-copy-powershell.md)
