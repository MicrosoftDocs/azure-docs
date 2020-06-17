---
title: Incrementally copy data using Change Tracking using Azure portal
description: In this tutorial, you create an Azure Data Factory pipeline that copies delta data incrementally from multiple tables in a SQL Server database to an Azure SQL database.
services: data-factory
ms.author: yexu
author: dearandyxu
manager: shwang
ms.reviewer: douglasl
ms.service: data-factory
ms.workload: data-services
ms.topic: tutorial
ms.custom: seo-lt-2019; seo-dt-2019
ms.date: 01/12/2018
---

# Incrementally load data from Azure SQL Database to Azure Blob Storage using change tracking information using the Azure portal

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this tutorial, you create an Azure data factory with a pipeline that loads delta data based on **change tracking** information in the source Azure SQL database to an Azure blob storage.  

You perform the following steps in this tutorial:

> [!div class="checklist"]
> * Prepare the source data store
> * Create a data factory.
> * Create linked services.
> * Create source, sink, and change tracking datasets.
> * Create, run, and monitor the full copy pipeline
> * Add or update data in the source table
> * Create, run, and monitor the incremental copy pipeline

## Overview
In a data integration solution, incrementally loading data after initial data loads is a widely used scenario. In some cases, the changed data within a period in your source data store can be easily to sliced up (for example, LastModifyTime, CreationTime). In some cases, there is no explicit way to identify the delta data from last time you processed the data. The Change Tracking technology supported by data stores such as Azure SQL Database and SQL Server can be used to identify the delta data.  This tutorial describes how to use Azure Data Factory with SQL Change Tracking technology to incrementally load delta data from Azure SQL Database into Azure Blob Storage.  For more concrete information about SQL Change Tracking technology, see [Change tracking in SQL Server](/sql/relational-databases/track-changes/about-change-tracking-sql-server).

## End-to-end workflow
Here are the typical end-to-end workflow steps to incrementally load data using the Change Tracking technology.

> [!NOTE]
> Both Azure SQL Database and SQL Server support the Change Tracking technology. This tutorial uses Azure SQL Database as the source data store. You can also use a SQL Server instance.

1. **Initial loading of historical data** (run once):
    1. Enable Change Tracking technology in the source Azure SQL database.
    2. Get the initial value of SYS_CHANGE_VERSION in the Azure SQL database as the baseline to capture changed data.
    3. Load full data from the Azure SQL database into an Azure blob storage.
2. **Incremental loading of delta data on a schedule** (run periodically after the initial loading of data):
    1. Get the old and new SYS_CHANGE_VERSION values.
    3. Load the delta data by joining the primary keys of changed rows (between two SYS_CHANGE_VERSION values) from **sys.change_tracking_tables** with data in the **source table**, and then move the delta data to destination.
    4. Update the SYS_CHANGE_VERSION for the delta loading next time.

## High-level solution
In this tutorial, you create two pipelines that perform the following two operations:  

1. **Initial load:** you create a pipeline with a copy activity that copies the entire data from the source data store (Azure SQL Database) to the destination data store (Azure Blob Storage).

    ![Full loading of data](media/tutorial-incremental-copy-change-tracking-feature-portal/full-load-flow-diagram.png)
1.  **Incremental load:** you create a pipeline with the following activities, and run it periodically.
    1. Create **two lookup activities** to get the old and new SYS_CHANGE_VERSION from Azure SQL Database and pass it to copy activity.
    2. Create **one copy activity** to copy the inserted/updated/deleted data between the two SYS_CHANGE_VERSION values from Azure SQL Database to Azure Blob Storage.
    3. Create **one stored procedure activity** to update the value of SYS_CHANGE_VERSION for the next pipeline run.

    ![Increment load flow diagram](media/tutorial-incremental-copy-change-tracking-feature-portal/incremental-load-flow-diagram.png)


If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Prerequisites
* **Azure SQL Database**. You use the database as the **source** data store. If you don't have an Azure SQL Database, see the [Create an Azure SQL database](../azure-sql/database/single-database-create-quickstart.md) article for steps to create one.
* **Azure Storage account**. You use the blob storage as the **sink** data store. If you don't have an Azure storage account, see the [Create a storage account](../storage/common/storage-account-create.md) article for steps to create one. Create a container named **adftutorial**. 

### Create a data source table in your Azure SQL database
1. Launch **SQL Server Management Studio**, and connect to SQL Database.
2. In **Server Explorer**, right-click your **database** and choose the **New Query**.
3. Run the following SQL command against your Azure SQL database to create a table named `data_source_table` as data source store.  

    ```sql
    create table data_source_table
    (
        PersonID int NOT NULL,
        Name varchar(255),
        Age int
        PRIMARY KEY (PersonID)
    );

    INSERT INTO data_source_table
        (PersonID, Name, Age)
    VALUES
        (1, 'aaaa', 21),
        (2, 'bbbb', 24),
        (3, 'cccc', 20),
        (4, 'dddd', 26),
        (5, 'eeee', 22);

    ```
4. Enable **Change Tracking** mechanism on your database and the source table (data_source_table) by running the following SQL query:

    > [!NOTE]
    > - Replace &lt;your database name&gt; with the name of your Azure SQL database that has the data_source_table.
    > - The changed data is kept for two days in the current example. If you load the changed data for every three days or more, some changed data is not included.  You need to either change the value of CHANGE_RETENTION to a bigger number. Alternatively, ensure that your period to load the changed data is within two days. For more information, see [Enable change tracking for a database](/sql/relational-databases/track-changes/enable-and-disable-change-tracking-sql-server#enable-change-tracking-for-a-database)

    ```sql
    ALTER DATABASE <your database name>
    SET CHANGE_TRACKING = ON  
    (CHANGE_RETENTION = 2 DAYS, AUTO_CLEANUP = ON)  

    ALTER TABLE data_source_table
    ENABLE CHANGE_TRACKING  
    WITH (TRACK_COLUMNS_UPDATED = ON)
    ```
5. Create a new table and store the ChangeTracking_version with a default value by running the following query:

    ```sql
    create table table_store_ChangeTracking_version
    (
        TableName varchar(255),
        SYS_CHANGE_VERSION BIGINT,
    );

    DECLARE @ChangeTracking_version BIGINT
    SET @ChangeTracking_version = CHANGE_TRACKING_CURRENT_VERSION();  

    INSERT INTO table_store_ChangeTracking_version
    VALUES ('data_source_table', @ChangeTracking_version)
    ```

    > [!NOTE]
    > If the data is not changed after you enabled the change tracking for SQL Database, the value of the change tracking version is 0.
6. Run the following query to create a stored procedure in your Azure SQL database. The pipeline invokes this stored procedure to update the change tracking version in the table you created in the previous step.

    ```sql
    CREATE PROCEDURE Update_ChangeTracking_Version @CurrentTrackingVersion BIGINT, @TableName varchar(50)
    AS

    BEGIN

        UPDATE table_store_ChangeTracking_version
        SET [SYS_CHANGE_VERSION] = @CurrentTrackingVersion
    WHERE [TableName] = @TableName

    END    
    ```

### Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Install the latest Azure PowerShell modules by following  instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-Az-ps).

## Create a data factory

1. Launch **Microsoft Edge** or **Google Chrome** web browser. Currently, Data Factory UI is supported only in Microsoft Edge and Google Chrome web browsers.
1. On the left menu, select **Create a resource** > **Data + Analytics** > **Data Factory**:

   ![Data Factory selection in the "New" pane](./media/quickstart-create-data-factory-portal/new-azure-data-factory-menu.png)

2. In the **New data factory** page, enter **ADFTutorialDataFactory** for the **name**.

     ![New data factory page](./media/tutorial-incremental-copy-change-tracking-feature-portal/new-azure-data-factory.png)

   The name of the Azure data factory must be **globally unique**. If you receive the following error, change the name of the data factory (for example, yournameADFTutorialDataFactory) and try creating again. See [Data Factory - Naming Rules](naming-rules.md) article for naming rules for Data Factory artifacts.

       `Data factory name “ADFTutorialDataFactory” is not available`
3. Select your Azure **subscription** in which you want to create the data factory.
4. For the **Resource Group**, do one of the following steps:

      - Select **Use existing**, and select an existing resource group from the drop-down list.
      - Select **Create new**, and enter the name of a resource group.   
         
        To learn about resource groups, see [Using resource groups to manage your Azure resources](../azure-resource-manager/management/overview.md).  
4. Select **V2 (Preview)** for the **version**.
5. Select the **location** for the data factory. Only locations that are supported are displayed in the drop-down list. The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other regions.
6. Select **Pin to dashboard**.     
7. Click **Create**.      
8. On the dashboard, you see the following tile with status: **Deploying data factory**.

	![deploying data factory tile](media/tutorial-incremental-copy-change-tracking-feature-portal/deploying-data-factory.png)
9. After the creation is complete, you see the **Data Factory** page as shown in the image.

   ![Data factory home page](./media/tutorial-incremental-copy-change-tracking-feature-portal/data-factory-home-page.png)
10. Click **Author & Monitor** tile to launch the Azure Data Factory user interface (UI) in a separate tab.
11. In the **get started** page, switch to the **Edit** tab in the left panel as shown in the following image:

    ![Create pipeline button](./media/tutorial-incremental-copy-change-tracking-feature-portal/get-started-page.png)

## Create linked services
You create linked services in a data factory to link your data stores and compute services to the data factory. In this section, you create linked services to your Azure Storage account and Azure SQL database.

### Create Azure Storage linked service.
In this step, you link your Azure Storage Account to the data factory.

1. Click **Connections**, and click **+ New**.

   ![New connection button](./media/tutorial-incremental-copy-change-tracking-feature-portal/new-connection-button-storage.png)
2. In the **New Linked Service** window, select **Azure Blob Storage**, and click **Continue**.

   ![Select Azure Blob Storage](./media/tutorial-incremental-copy-change-tracking-feature-portal/select-azure-storage.png)
3. In the **New Linked Service** window, do the following steps:

    1. Enter **AzureStorageLinkedService** for **Name**.
    2. Select your Azure Storage account for **Storage account name**.
    3. Click **Save**.

   ![Azure Storage Account settings](./media/tutorial-incremental-copy-change-tracking-feature-portal/azure-storage-linked-service-settings.png)


### Create Azure SQL Database linked service.
In this step, you link your Azure SQL database to the data factory.

1. Click **Connections**, and click **+ New**.
2. In the **New Linked Service** window, select **Azure SQL Database**, and click **Continue**.
3. In the **New Linked Service** window, do the following steps:

    1. Enter **AzureSqlDatabaseLinkedService** for the **Name** field.
    2. Select your server for the **Server name** field.
    4. Select your database for the **Database name** field.
    5. Enter name of the user for the **User name** field.
    6. Enter password for the user for the **Password** field.
    7. Click **Test connection** to test the connection.
    8. Click **Save** to save the linked service.

       ![Azure SQL Database linked service settings](./media/tutorial-incremental-copy-change-tracking-feature-portal/azure-sql-database-linked-service-settings.png)

## Create datasets
In this step, you create datasets to represent data source, data destination. and the place to store the SYS_CHANGE_VERSION.

### Create a dataset to represent source data
In this step, you create a dataset to represent the source data.

1. In the treeview, click **+ (plus)**, and click **Dataset**.

   ![New Dataset menu](./media/tutorial-incremental-copy-change-tracking-feature-portal/new-dataset-menu.png)
2. Select **Azure SQL Database**, and click **Finish**.

   ![Source dataset type - Azure SQL Database](./media/tutorial-incremental-copy-change-tracking-feature-portal/select-azure-sql-database.png)
3. You see a new tab for configuring the dataset. You also see the dataset in the treeview. In the **Properties** window, change the name of the dataset to **SourceDataset**.

   ![Source dataset name](./media/tutorial-incremental-copy-change-tracking-feature-portal/source-dataset-name.png)    
4. Switch to the **Connection** tab, and do the following steps:

    1. Select **AzureSqlDatabaseLinkedService** for **Linked service**.
    2. Select **[dbo].[data_source_table]** for **Table**.

   ![Source connection](./media/tutorial-incremental-copy-change-tracking-feature-portal/source-dataset-connection.png)

### Create a dataset to represent data copied to sink data store.
In this step, you create a dataset to represent the data that is copied from the source data store. You created the adftutorial container in your Azure Blob Storage as part of the prerequisites. Create the container if it does not exist (or) set it to the name of an existing one. In this tutorial, the output file name is dynamically generated by using the expression: `@CONCAT('Incremental-', pipeline().RunId, '.txt')`.

1. In the treeview, click **+ (plus)**, and click **Dataset**.

   ![New Dataset menu](./media/tutorial-incremental-copy-change-tracking-feature-portal/new-dataset-menu.png)
2. Select **Azure Blob Storage**, and click **Finish**.

   ![Sink dataset type - Azure Blob Storage](./media/tutorial-incremental-copy-change-tracking-feature-portal/source-dataset-type.png)
3. You see a new tab for configuring the dataset. You also see the dataset in the treeview. In the **Properties** window, change the name of the dataset to **SinkDataset**.

   ![Sink dataset - name](./media/tutorial-incremental-copy-change-tracking-feature-portal/sink-dataset-name.png)
4. Switch to the **Connection** tab in the Properties window, and do the following steps:

    1. Select **AzureStorageLinkedService** for **Linked service**.
    2. Enter **adftutorial/incchgtracking** for **folder** part of the **filePath**.
    3. Enter **\@CONCAT('Incremental-', pipeline().RunId, '.txt')** for **file** part of the **filePath**.  

       ![Sink dataset - connection](./media/tutorial-incremental-copy-change-tracking-feature-portal/sink-dataset-connection.png)

### Create a dataset to represent change tracking data
In this step, you create a dataset for storing the change tracking version.  You created the table table_store_ChangeTracking_version as part of the prerequisites.

1. In the treeview, click **+ (plus)**, and click **Dataset**.
2. Select **Azure SQL Database**, and click **Finish**.
3. You see a new tab for configuring the dataset. You also see the dataset in the treeview. In the **Properties** window, change the name of the dataset to **ChangeTrackingDataset**.
4. Switch to the **Connection** tab, and do the following steps:

    1. Select **AzureSqlDatabaseLinkedService** for **Linked service**.
    2. Select **[dbo].[table_store_ChangeTracking_version]** for **Table**.

## Create a pipeline for the full copy
In this step, you create a pipeline with a copy activity that copies the entire data from the source data store (Azure SQL Database) to the destination data store (Azure Blob Storage).

1. Click **+ (plus)** in the left pane, and click **Pipeline**.

    ![New pipeline menu](./media/tutorial-incremental-copy-change-tracking-feature-portal/new-pipeline-menu.png)
2. You see a new tab for configuring the pipeline. You also see the pipeline in the treeview. In the **Properties** window, change the name of the pipeline to **FullCopyPipeline**.

    ![New pipeline menu](./media/tutorial-incremental-copy-change-tracking-feature-portal/full-copy-pipeline-name.png)
3. In the **Activities** toolbox, expand **Data Flow**, and drag-drop the **Copy** activity to the pipeline designer surface, and set the name **FullCopyActivity**.

    ![Full copy activity-name](./media/tutorial-incremental-copy-change-tracking-feature-portal/full-copy-activity-name.png)
4. Switch to the **Source** tab, and select **SourceDataset** for the **Source Dataset** field.

    ![Copy activity - source](./media/tutorial-incremental-copy-change-tracking-feature-portal/copy-activity-source.png)
5. Switch to the **Sink** tab, and select **SinkDataset** for the **Sink Dataset** field.

    ![Copy activity - sink](./media/tutorial-incremental-copy-change-tracking-feature-portal/copy-activity-sink.png)
6. To validate the pipeline definition, click **Validate** on the toolbar. Confirm that there is no validation error. Close the **Pipeline Validation Report** by clicking **>>**.

    ![Validate the pipeline](./media/tutorial-incremental-copy-change-tracking-feature-portal/full-copy-pipeline-validate.png)
7. To publish entities (linked services, datasets, and pipelines), click **Publish**. Wait until the publishing succeeds.

    ![Publish button](./media/tutorial-incremental-copy-change-tracking-feature-portal/publish-button.png)
8. Wait until you see the **Successfully published** message.

    ![Publishing succeeded](./media/tutorial-incremental-copy-change-tracking-feature-portal/publishing-succeeded.png)
9. You can also see notifications by clicking the **Show Notifications** button on the left. To close the notifications window, click **X**.

    ![Show notifications](./media/tutorial-incremental-copy-change-tracking-feature-portal/show-notifications.png)


### Run the full copy pipeline
Click **Trigger** on the toolbar for the pipeline, and click **Trigger Now**.

![Trigger Now menu](./media/tutorial-incremental-copy-change-tracking-feature-portal/trigger-now-menu.png)

### Monitor the full copy pipeline

1. Click the **Monitor** tab on the left. You see the pipeline run in the list and its status. To refresh the list, click **Refresh**. The links in the Actions column let you view activity runs associated with the pipeline run and to rerun the pipeline.

    ![Pipeline runs](./media/tutorial-incremental-copy-change-tracking-feature-portal/monitor-full-copy-pipeline-run.png)
2. To view activity runs associated with the pipeline run, click the **View Activity Runs** link in the **Actions** column. There is only one activity in the pipeline, so you see only one entry in the list. To switch back to the pipeline runs view, click **Pipelines** link at the top.

    ![Activity runs](./media/tutorial-incremental-copy-change-tracking-feature-portal/activity-runs-full-copy.png)

### Review the results
You see a file named `incremental-<GUID>.txt` in the `incchgtracking` folder of the `adftutorial` container.

![Output file from full copy](media/tutorial-incremental-copy-change-tracking-feature-portal/full-copy-output-file.png)

The file should have the data from the Azure SQL database:

```
1,aaaa,21
2,bbbb,24
3,cccc,20
4,dddd,26
5,eeee,22
```

## Add more data to the source table

Run the following query against the Azure SQL database to add a row and update a row.

```sql
INSERT INTO data_source_table
(PersonID, Name, Age)
VALUES
(6, 'new','50');


UPDATE data_source_table
SET [Age] = '10', [name]='update' where [PersonID] = 1

```

## Create a pipeline for the delta copy
In this step, you create a pipeline with the following activities, and run it periodically. The **lookup activities** get the old and new SYS_CHANGE_VERSION from Azure SQL Database and pass it to copy activity. The **copy activity** copies the inserted/updated/deleted data between the two SYS_CHANGE_VERSION values from Azure SQL Database to Azure Blob Storage. The **stored procedure activity** updates the value of SYS_CHANGE_VERSION for the next pipeline run.

1. In the Data Factory UI, switch to the **Edit** tab. Click **+ (plus)** in the left pane, and click **Pipeline**.

    ![New pipeline menu](./media/tutorial-incremental-copy-change-tracking-feature-portal/new-pipeline-menu-2.png)
2. You see a new tab for configuring the pipeline. You also see the pipeline in the treeview. In the **Properties** window, change the name of the pipeline to **IncrementalCopyPipeline**.

    ![Pipeline name](./media/tutorial-incremental-copy-change-tracking-feature-portal/incremental-copy-pipeline-name.png)
3. Expand **General** in the **Activities** toolbox, and drag-drop the **Lookup** activity to the pipeline designer surface. Set the name of the activity to **LookupLastChangeTrackingVersionActivity**. This activity gets the change tracking version used in the last copy operation that is stored in the table **table_store_ChangeTracking_version**.

    ![Lookup Activity - name](./media/tutorial-incremental-copy-change-tracking-feature-portal/first-lookup-activity-name.png)
4. Switch to the **Settings** in the **Properties** window, and select **ChangeTrackingDataset** for the **Source Dataset** field.

    ![Lookup Activity - settings](./media/tutorial-incremental-copy-change-tracking-feature-portal/first-lookup-activity-settings.png)
5. Drag-and-drop the **Lookup** activity from the **Activities** toolbox to the pipeline designer surface. Set the name of the activity to **LookupCurrentChangeTrackingVersionActivity**. This activity gets the current change tracking version.

    ![Lookup Activity - name](./media/tutorial-incremental-copy-change-tracking-feature-portal/second-lookup-activity-name.png)
6. Switch to the **Settings** in the **Properties** window, and do the following steps:

   1. Select **SourceDataset** for the **Source Dataset** field.
   2. Select **Query** for **Use Query**.
   3. Enter the following SQL query for **Query**.

       ```sql
       SELECT CHANGE_TRACKING_CURRENT_VERSION() as CurrentChangeTrackingVersion
       ```

      ![Lookup Activity - settings](./media/tutorial-incremental-copy-change-tracking-feature-portal/second-lookup-activity-settings.png)
7. In the **Activities** toolbox, expand **Data Flow**, and drag-drop the **Copy** activity to the pipeline designer surface. Set the name of the activity to **IncrementalCopyActivity**. This activity copies the data between last change tracking version and the current change tracking version to the destination data store.

    ![Copy Activity - name](./media/tutorial-incremental-copy-change-tracking-feature-portal/incremental-copy-activity-name.png)
8. Switch to the **Source** tab in the **Properties** window, and do the following steps:

   1. Select **SourceDataset** for **Source Dataset**.
   2. Select **Query** for **Use Query**.
   3. Enter the following SQL query for **Query**.

       ```sql
       select data_source_table.PersonID,data_source_table.Name,data_source_table.Age, CT.SYS_CHANGE_VERSION, SYS_CHANGE_OPERATION from data_source_table RIGHT OUTER JOIN CHANGETABLE(CHANGES data_source_table, @{activity('LookupLastChangeTrackingVersionActivity').output.firstRow.SYS_CHANGE_VERSION}) as CT on data_source_table.PersonID = CT.PersonID where CT.SYS_CHANGE_VERSION <= @{activity('LookupCurrentChangeTrackingVersionActivity').output.firstRow.CurrentChangeTrackingVersion}
       ```

      ![Copy Activity - source settings](./media/tutorial-incremental-copy-change-tracking-feature-portal/inc-copy-source-settings.png)
9. Switch to the **Sink** tab, and select **SinkDataset** for the **Sink Dataset** field.

    ![Copy Activity - sink settings](./media/tutorial-incremental-copy-change-tracking-feature-portal/inc-copy-sink-settings.png)
10. **Connect both Lookup activities to the Copy activity** one by one. Drag the **green** button attached to the **Lookup** activity to the **Copy** activity.

    ![Connect Lookup and Copy activities](./media/tutorial-incremental-copy-change-tracking-feature-portal/connect-lookup-and-copy.png)
11. Drag-and-drop the **Stored Procedure** activity from the **Activities** toolbox to the pipeline designer surface. Set the name of the activity to **StoredProceduretoUpdateChangeTrackingActivity**. This activity updates the change tracking version in the **table_store_ChangeTracking_version** table.

    ![Stored Procedure Activity - name](./media/tutorial-incremental-copy-change-tracking-feature-portal/stored-procedure-activity-name.png)
12. Switch to the *SQL Account** tab, and select **AzureSqlDatabaseLinkedService** for **Linked service**.

    ![Stored Procedure Activity - SQL Account](./media/tutorial-incremental-copy-change-tracking-feature-portal/sql-account-tab.png)
13. Switch to the **Stored Procedure** tab, and do the following steps:

    1. For **Stored procedure name**, select **Update_ChangeTracking_Version**.  
    2. Select **Import parameter**.
    3. In the **Stored procedure parameters** section, specify following values for the parameters:

        | Name | Type | Value |
        | ---- | ---- | ----- |
        | CurrentTrackingVersion | Int64 | @{activity('LookupCurrentChangeTrackingVersionActivity').output.firstRow.CurrentChangeTrackingVersion} |
        | TableName | String | @{activity('LookupLastChangeTrackingVersionActivity').output.firstRow.TableName} |

        ![Stored Procedure Activity - Parameters](./media/tutorial-incremental-copy-change-tracking-feature-portal/stored-procedure-parameters.png)
14. **Connect the Copy activity to the Stored Procedure Activity**. Drag-and-drop the **green** button attached to the Copy activity to the Stored Procedure activity.

    ![Connect Copy and Stored Procedure activities](./media/tutorial-incremental-copy-change-tracking-feature-portal/connect-copy-stored-procedure.png)
15. Click **Validate** on the toolbar. Confirm that there are no validation errors. Close the **Pipeline Validation Report** window by clicking **>>**.

    ![Validate button](./media/tutorial-incremental-copy-change-tracking-feature-portal/validate-button.png)
16. Publish entities (linked services, datasets, and pipelines) to the Data Factory service by clicking the **Publish All** button. Wait until you see the **Publishing succeeded** message.

       ![Publish button](./media/tutorial-incremental-copy-change-tracking-feature-portal/publish-button-2.png)    

### Run the incremental copy pipeline
1. Click **Trigger** on the toolbar for the pipeline, and click **Trigger Now**.

    ![Trigger Now menu](./media/tutorial-incremental-copy-change-tracking-feature-portal/trigger-now-menu-2.png)
2. In the **Pipeline Run** window, select **Finish**.

### Monitor the incremental copy pipeline
1. Click the **Monitor** tab on the left. You see the pipeline run in the list and its status. To refresh the list, click **Refresh**. The links in the **Actions** column let you view activity runs associated with the pipeline run and to rerun the pipeline.

    ![Pipeline runs](./media/tutorial-incremental-copy-change-tracking-feature-portal/inc-copy-pipeline-runs.png)
2. To view activity runs associated with the pipeline run, click the **View Activity Runs** link in the **Actions** column. There is only one activity in the pipeline, so you see only one entry in the list. To switch back to the pipeline runs view, click **Pipelines** link at the top.

    ![Activity runs](./media/tutorial-incremental-copy-change-tracking-feature-portal/inc-copy-activity-runs.png)


### Review the results
You see the second file in the `incchgtracking` folder of the `adftutorial` container.

![Output file from incremental copy](media/tutorial-incremental-copy-change-tracking-feature-portal/incremental-copy-output-file.png)

The file should have only the delta data from the Azure SQL database. The record with `U` is the updated row in the database and `I` is the one added row.

```
1,update,10,2,U
6,new,50,1,I
```
The first three columns are changed data from data_source_table. The last two columns are the metadata from change tracking system table. The fourth column is the SYS_CHANGE_VERSION for each changed row. The fifth column is the operation:  U = update, I = insert.  For details about the change tracking information, see [CHANGETABLE](/sql/relational-databases/system-functions/changetable-transact-sql).

```
==================================================================
PersonID Name    Age    SYS_CHANGE_VERSION    SYS_CHANGE_OPERATION
==================================================================
1        update  10		2			          U
6        new     50		1			          I
```


## Next steps
Advance to the following tutorial to learn about copying new and changed files only based on their LastModifiedDate:

> [!div class="nextstepaction"]
>[Copy new files by lastmodifieddate](tutorial-incremental-copy-lastmodified-copy-data-tool.md)
