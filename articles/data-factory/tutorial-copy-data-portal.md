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
ms.topic: tutorial
ms.date: 06/21/2018
ms.author: jingwang
---
# Copy data from Azure Blob storage to a SQL database by using Azure Data Factory
In this tutorial, you create a data factory by using the Azure Data Factory user interface (UI). The pipeline in this data factory copies data from Azure Blob storage to a SQL database. The configuration pattern in this tutorial applies to copying from a file-based data store to a relational data store. For a list of data stores supported as sources and sinks, see the [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

> [!NOTE]
> - If you're new to Data Factory, see [Introduction to Azure Data Factory](introduction.md).

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
* **Azure storage account**. You use Blob storage as a *source* data store. If you don't have a storage account, see [Create an Azure storage account](../storage/common/storage-quickstart-create-account.md) for steps to create one.
* **Azure SQL Database**. You use the database as a *sink* data store. If you don't have a SQL database, see [Create a SQL database](../sql-database/sql-database-get-started-portal.md) for steps to create one.

### Create a blob and a SQL table

Now, prepare your Blob storage and SQL database for the tutorial by performing the following steps.

#### Create a source blob

1. Launch Notepad. Copy the following text, and save it as an **emp.txt** file on your disk:

	```
    John,Doe
    Jane,Doe
	```

1. Create a container named **adftutorial** in your Blob storage. Create a folder named **input** in this container. Then, upload the **emp.txt** file to the **input** folder. Use the Azure portal or tools such as [Azure Storage Explorer](http://storageexplorer.com/) to do these tasks.

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

1. Allow Azure services to access SQL Server. Ensure that **Allow access to Azure services** is turned **ON** for your SQL Server so that Data Factory can write data to your SQL Server. To verify and turn on this setting, take the following steps:

    a. On the left, select **More services** > **SQL servers**.

    b. Select your server, and under **SETTINGS** select **Firewall**.

    c. On the **Firewall settings** page, select **ON** for **Allow access to Azure services**.

## Create a data factory
In this step, you create a data factory and start the Data Factory UI to create a pipeline in the data factory. 

1. Open the **Microsoft Edge** or **Google Chrome** web browser. Currently, Data Factory UI is supported only in Microsoft Edge and Google Chrome web browsers.
1. On the left menu, select **New** > **Data + Analytics** > **Data Factory**. 
  
   ![New data factory creation](./media/tutorial-copy-data-portal/new-azure-data-factory-menu.png)
1. On the **New data factory** page, under **Name**, enter **ADFTutorialDataFactory**. 
      
     ![New data factory](./media/tutorial-copy-data-portal/new-azure-data-factory.png)
 
   The name of the Azure data factory must be *globally unique*. If you see the following error message for the name field, change the name of the data factory (for example, yournameADFTutorialDataFactory). For naming rules for Data Factory artifacts, see [Data Factory naming rules](naming-rules.md).
  
   ![Error message](./media/tutorial-copy-data-portal/name-not-available-error.png)
1. Select the Azure **subscription** in which you want to create the data factory. 
1. For **Resource Group**, take one of the following steps:
     
    a. Select **Use existing**, and select an existing resource group from the drop-down list.

    b. Select **Create new**, and enter the name of a resource group. 
         
    To learn about resource groups, see [Use resource groups to manage your Azure resources](../azure-resource-manager/resource-group-overview.md). 
1. Under **Version**, select **V2**.
1. Under **Location**, select a location for the data factory. Only locations that are supported are displayed in the drop-down list. The data stores (for example, Azure Storage and SQL Database) and computes (for example, Azure HDInsight) used by the data factory can be in other regions.
1. Select **Pin to dashboard**. 
1. Select **Create**. 
1. On the dashboard, you see the following tile with the status **Deploying Data Factory**: 

	![Deploying data factory tile](media/tutorial-copy-data-portal/deploying-data-factory.png)
1. After the creation is finished, you see the **Data factory** page as shown in the image.
   
    ![Data factory home page](./media/tutorial-copy-data-portal/data-factory-home-page.png)
1. Select **Author & Monitor** to launch the Data Factory UI in a separate tab.

## Create a pipeline
In this step, you create a pipeline with a copy activity in the data factory. The copy activity copies data from Blob storage to SQL Database. In the [Quickstart tutorial](quickstart-create-data-factory-portal.md), you created a pipeline by following these steps:

1. Create the linked service. 
1. Create input and output datasets.
1. Create a pipeline.

In this tutorial, you start with creating the pipeline. Then you create linked services and datasets when you need them to configure the pipeline. 

1. On the **Let's get started** page, select **Create pipeline**. 

   ![Create pipeline](./media/tutorial-copy-data-portal/create-pipeline-tile.png)
1. In the **General** tab for the pipeline, enter **CopyPipeline** for **Name** of the pipeline.

1. In the **Activities** tool box, expand the **Data Flow** category, and drag and drop the **Copy** activity from the tool box to the pipeline designer surface. Specify **CopyFromBlobToSql** for **Name**.

    ![Copy activity](./media/tutorial-copy-data-portal/drag-drop-copy-activity.png)

### Configure source

1. Go to the **Source** tab. Select **+ New** to create a source dataset. 

1. In the **New Dataset** window, select **Azure Blob Storage**, and then select **Finish**. The source data is in Blob storage, so you select **Azure Blob Storage** for the source dataset. 

    ![Storage selection](./media/tutorial-copy-data-portal/select-azure-blob-dataset.png)

1. You see a new tab opened for blob dataset. On the **General** tab at the bottom of the **Properties** window, enter **SourceBlobDataset** for **Name**.

    ![Dataset name](./media/tutorial-copy-data-portal/dataset-name.png)

1. Go to the **Connection** tab of the **Properties** window. Next to the **Linked service** text box, select **+ New**. 

    ![New linked service button](./media/tutorial-copy-data-portal/source-dataset-new-linked-service-button.png)

1. In the **New Linked Service** window, enter **AzureStorageLinkedService** as name, select your storage account from the **Storage account name** list, then select **Save** to deploy the linked service.

    ![New linked service](./media/tutorial-copy-data-portal/new-azure-storage-linked-service.png)

1. After the linked service is created, you are back in the dataset settings. Next to **File path**, select **Browse**.

    ![Browse button for file path](./media/tutorial-copy-data-portal/file-browse-button.png)

1. Navigate to the **adftutorial/input** folder, select the **emp.txt** file, and then select **Finish**. 

    ![Select input file](./media/tutorial-copy-data-portal/select-input-file.png)

1. Confirm that **File format** is set to **Text format** and that **Column delimiter** is set to **Comma (`,`)**. If the source file uses different row and column delimiters, you can select **Detect Text Format** for **File format**. The Copy Data tool detects the file format and delimiters automatically for you. You can still override these values. To preview data on this page, select **Preview data**.

    ![Detect text format](./media/tutorial-copy-data-portal/detect-text-format.png)

1. Go to the **Schema** tab of the **Properties** window, and select **Import Schema**. Notice that the application detected two columns in the source file. You import the schema here so that you can map columns from the source data store to the sink data store. If you don't need to map columns, you can skip this step. For this tutorial, import the schema.

    ![Detect source schema](./media/tutorial-copy-data-portal/detect-source-schema.png)  

1. Now, go back to the pipeline -> **Source** tab, confirm that **SourceBlobDataset** is selected. To preview data on this page, select **Preview data**. 
    
    ![Source dataset](./media/tutorial-copy-data-portal/source-dataset-selected.png)

### Configure sink

1. Go to the **Sink** tab, and select **+ New** to create a sink dataset. 

    ![Sink dataset](./media/tutorial-copy-data-portal/new-sink-dataset-button.png)
1. In the **New Dataset** window, input "SQL" in the searchbox to filter the connectors, then select **Azure SQL Database**, and then select **Finish**. In this tutorial, you copy data to a SQL database. 

    ![SQL database selection](./media/tutorial-copy-data-portal/select-azure-sql-dataset.png)
1. On the **General** tab of the **Properties** window, in **Name**, enter **OutputSqlDataset**. 
    
    ![Output dataset name](./media/tutorial-copy-data-portal/output-dataset-name.png)
1. Go to the **Connection** tab, and next to **Linked service**, select **+ New**. A dataset must be associated with a linked service. The linked service has the connection string that Data Factory uses to connect to the SQL database at runtime. The dataset specifies the container, folder, and the file (optional) to which the data is copied. 
    
    ![Linked service](./media/tutorial-copy-data-portal/new-azure-sql-database-linked-service-button.png)       
1. In the **New Linked Service** window, take the following steps: 

    a. Under **Name**, enter **AzureSqlDatabaseLinkedService**.

    b. Under **Server name**, select your SQL Server instance.

    c. Under **Database name**, select your SQL database.

    d. Under **User name**, enter the name of the user.

    e. Under **Password**, enter the password for the user.

    f. Select **Test connection** to test the connection.

    g. Select **Save** to save the linked service. 
    
    ![Save new linked service](./media/tutorial-copy-data-portal/new-azure-sql-linked-service-window.png)

1. In **Table**, select **[dbo].[emp]**. 

    ![Table](./media/tutorial-copy-data-portal/select-emp-table.png)
1. Go to the **Schema** tab, and select **Import Schema**. 

    ![Select import schema](./media/tutorial-copy-data-portal/import-destination-schema.png)
1. Select the **ID** column, and then select **Delete**. The **ID** column is an identity column in the SQL database, so the copy activity doesn't need to insert data into this column.

    ![Delete ID column](./media/tutorial-copy-data-portal/delete-id-column.png)
1. Go to the tab with the pipeline, and in **Sink Dataset**, confirm that **OutputSqlDataset** is selected.

    ![Pipeline tab](./media/tutorial-copy-data-portal/pipeline-tab-2.png)        

### Confugure mapping

Go to the **Mapping** tab at the bottom of the **Properties** window, and select **Import Schemas**. Notice that the first and second columns in the source file are mapped to **FirstName** and **LastName** in the SQL database.

![Map schemas](./media/tutorial-copy-data-portal/map-schemas.png)

## Validate the pipeline
To validate the pipeline, select **Validate** from the tool bar.
 
You can see the JSON code associated with the pipeline by clicking **Code** on the upper-right.

## Debug and publish the pipeline
You can debug a pipeline before you publish artifacts (linked services, datasets, and pipeline) to Data Factory or your own Azure Repos Git repository. 

1. To debug the pipeline, select **Debug** on the toolbar. You see the status of the pipeline run in the **Output** tab at the bottom of the window. 

1. Once the pipeline can run successfually, in the top toolbar, select **Publish All**. This action publishes entities (datasets, and pipelines) you created to Data Factory.

    ![Publish](./media/tutorial-copy-data-portal/publish-button.png)

1. Wait until you see the **Successfully published** message. To see notification messages, click the **Show Notifications**  on the top-right (bell button). 

## Trigger the pipeline manually
In this step, you manually trigger the pipeline you published in the previous step. 

1. Select **Trigger** on the toolbar, and then select **Trigger Now**. On the **Pipeline Run** page, select **Finish**.  

1. Go to the **Monitor** tab on the left. You see a pipeline run that is triggered by a manual trigger. You can use links in the **Actions** column to view activity details and to rerun the pipeline.

    ![Monitor pipeline runs](./media/tutorial-copy-data-portal/monitor-pipeline.png)
1. To see activity runs associated with the pipeline run, select the **View Activity Runs** link in the **Actions** column. In this example, there is only one activity, so you see only one entry in the list. For details about the copy operation, select the **Details** link (eyeglasses icon) in the **Actions** column. Select **Pipelines** at the top to go back to the **Pipeline Runs** view. To refresh the view, select **Refresh**.

    ![Monitor activity runs](./media/tutorial-copy-data-portal/view-activity-runs.png)
1. Verify that two more rows are added to the **emp** table in the SQL database. 

## Trigger the pipeline on a schedule
In this schedule, you create a schedule trigger for the pipeline. The trigger runs the pipeline on the specified schedule, such as hourly or daily. In this example, you set the trigger to run every minute until the specified end datetime. 

1. Go to the **Author** tab on the left above the monitor tab. 

1. Go to your pipeline, click **Trigger** on the tool bar, and select **New/Edit**. 

1. In the **Add Triggers** window, select **Choose trigger**, and then select **+ New**. 

    ![New button](./media/tutorial-copy-data-portal/add-trigger-new-button.png)
1. In the **New Trigger** window, take the following steps: 

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
1. On the **Trigger Run Parameters** page, review the warning, and then select **Finish**. The pipeline in this example doesn't take any parameters. 

    ![Trigger run parameters](./media/tutorial-copy-data-portal/trigger-pipeline-parameters.png)

1. Click **Publish All** to publish the change. 

1. Go to the **Monitor** tab on the left to see the triggered pipeline runs. 

    ![Triggered pipeline runs](./media/tutorial-copy-data-portal/triggered-pipeline-runs.png)    
1. To switch from the **Pipeline Runs** view to the **Trigger Runs** view, select **Pipeline Runs** and then select **Trigger Runs**.
    
    ![Trigger runs](./media/tutorial-copy-data-portal/trigger-runs-menu.png)
1. You see the trigger runs in a list. 

    ![Trigger runs list](./media/tutorial-copy-data-portal/trigger-runs-list.png)
1. Verify that two rows per minute (for each pipeline run) are inserted into the **emp** table until the specified end time. 

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
