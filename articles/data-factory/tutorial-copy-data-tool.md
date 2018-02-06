---
title: Copy data by using the Azure Copy Data tool | Microsoft Docs
description: 'Create an Azure data factory and then use the Copy Data tool to copy data from Azure Blob storage to an Azure SQL database.'
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.topic: hero-article
ms.date: 01/09/2018
ms.author: jingwang

---
# Copy data from Azure Blob storage to an Azure SQL database by using the Copy Data tool
> [!div class="op_single_selector" title1="Select the version of the Data Factory service that you're using:"]
> * [Version 1 - GA](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
> * [Version 2 - Preview](tutorial-copy-data-tool.md)

In this tutorial, you use the Azure portal to create a data factory. Then, you use the Copy Data tool to create a pipeline that copies data from Azure Blob storage to an Azure SQL database. 

> [!NOTE]
> If you're new to Azure Data Factory, see [Introduction to Azure Data Factory](introduction.md).
>
> This article applies to version 2 of Data Factory, which is currently in preview. If you're using version 1 of the Data Factory service, which is generally available (GA), see [Get started with Data Factory version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).


You perform the following steps in this tutorial:

> [!div class="checklist"]
> * Create a data factory.
> * Use the Copy Data tool to create a pipeline.
> * Monitor the pipeline and activity runs.

## Prerequisites

* Azure subscription: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* Azure storage account: Use Azure Blob storage as the _source_ data store. If you don't have an Azure storage account, see the instructions in [Create a storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account).
* Azure SQL Database: Use an Azure SQL database as the _sink_ data store. If you don't have an Azure SQL database, see the instructions in [Create an Azure SQL database](../sql-database/sql-database-get-started-portal.md).

### Create a blob and a SQL table

Prepare your Blob storage and your Azure SQL database for the tutorial by performing these steps.

#### Create a source blob

1. Launch **Notepad**. Copy the following text and save it in a file named **inputEmp.txt** on your disk:

	```
    John|Doe
    Jane|Doe
	```

2. Create a container named **adfv2tutorial** and upload the inputEmp.txt file to the container. You can use various tools to perform these tasks, such as [Azure Storage Explorer](http://storageexplorer.com/).

#### Create a sink SQL table

1. Use the following SQL script to create a table named **dbo.emp** in your Azure SQL database:

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

2. Allow Azure services to access SQL Server. Verify that the setting **Allow access to Azure services** is enabled for your Azure SQL server. This setting lets the Data Factory service write data to your Azure SQL server. To verify and turn on this setting, do the following steps:

    1. Select the **More services** hub on the left and select **SQL servers**.
    2. Select your server, and then select **SETTINGS** > **Firewall**.
    3. In the **Firewall settings** page, set the **Allow access to Azure services** option to **ON**.

## Create a data factory

1. On the left menu, select **New** > **Data + Analytics** > **Data Factory**: 
   
   ![Create a new data factory](./media/tutorial-copy-data-tool/new-azure-data-factory-menu.png)
2. In the **New data factory** page, enter **ADFTutorialDataFactory** for the **name** field: 
      
     ![New data factory page](./media/tutorial-copy-data-tool/new-azure-data-factory.png)
 
   The name for your Azure data factory must be _globally unique_. You might receive the following error:
   
   ![New data factory page](./media/tutorial-copy-data-tool/name-not-available-error.png)

   If you receive an error about the name value, enter a different name for the data factory. For example, you could use the name _**yourname**_**ADFTutorialDataFactory**. For the naming rules for Data Factory artifacts, see [Data Factory naming rules](naming-rules.md).
3. Select your Azure **subscription** in which to create the new data factory. 
4. For the **Resource Group**, do one of the following steps:
     
    - Select **Use existing** and select an existing resource group from the drop-down list. 
    - Select **Create new** and enter the name of a resource group.   
         
    To learn about resource groups, see [Using resource groups to manage your Azure resources](../azure-resource-manager/resource-group-overview.md).  

4. Select **V2 (Preview)** for the **version**.
5. Select the **location** for the data factory. Only supported locations are displayed in the drop-down list. The data stores (Azure Storage, Azure SQL Database, and so on) and computes (HDInsight, and so on) that are used by your data factory can be in other locations and regions.
6. Select **Pin to dashboard**.     
7. Select **Create**.
8. On the dashboard, the **Deploying data factory** tile shows the process status:

	![Deploying data factory tile](media/tutorial-copy-data-tool/deploying-data-factory.png)
9. After creation is complete, the **Data Factory** home page is displayed:
   
   ![Data factory home page](./media/tutorial-copy-data-tool/data-factory-home-page.png)
10. To launch the Azure Data Factory user interface (UI) in a separate tab, select the **Author & Monitor** tile. 

## Use the Copy Data tool to create a pipeline

1. In the **Get started** page, select the **Copy Data** tile to launch the Copy Data tool: 

   ![Copy Data tool tile](./media/tutorial-copy-data-tool/copy-data-tool-tile.png)
2. In the **Properties** page, specify **CopyFromBlobToSqlPipeline** for the **Task name** field, and select **Next**. The Data Factory UI creates a pipeline with the specified task name. 

    ![Properties page](./media/tutorial-copy-data-tool/copy-data-tool-properties-page.png)
3. In the **Source data store** page, select **Azure Blob Storage**, and select **Next**. The source data is in Azure Blob storage. 

    ![Source data store page](./media/tutorial-copy-data-tool/source-data-store-page.png)
4. In the **Specify the Azure Blob storage account** page, do the following steps: 
    1. Enter **AzureStorageLinkedService** for the **connection name**.
    2. Select your **storage account name** from the drop-down list.
    3. Select **Next**. 

    ![Specify blob storage account](./media/tutorial-copy-data-tool/specify-blob-storage-account.png)

    A linked service links a data store or a compute to the data factory. In this case, you create an Azure Storage linked service to link your Azure storage account to the data store. The linked service has the connection information that the Data Factory service uses to connect to the Blob storage at runtime. The dataset specifies the container, folder, and the file (optional) that contains the source data. 

5. In the **Choose the input file or folder** page, do the following steps:
    
    1. Browse to the **adfv2tutorial/input** folder.
    2. Select the **inputEmp.txt** file.
    3. Select **Choose**. Alternatively, you can double-click on the **inputEmp.txt** file. 
    4. Select **Next**. 

    ![Choose input file or folder](./media/tutorial-copy-data-tool/choose-input-file-folder.png)

6. In the **File format settings** page, notice that the tool automatically detects the column and row delimiters. Select **Next**. You can also preview data and view the schema of the input data on this page. 

    ![File format settings page](./media/tutorial-copy-data-tool/file-format-settings-page.png)
7. In the **Destination data store** page, select **Azure SQL Database**, and select **Next**:

    ![Destination data store page](./media/tutorial-copy-data-tool/destination-data-storage-page.png)
8. In the **Specify the Azure SQL database** page, do the following steps: 

    1. Specify **AzureSqlDatabaseLinkedService** for the **Connection name**. 
    2. Select your Azure SQL server for the **Server name**.
    3. Select your Azure SQL database for the **Database name**.
    4. Specify the name of the user for **User name**.
    5. Specify the password of the user for **Password**.
    6. Select **Next**. 

    ![Specify Azure SQL database](./media/tutorial-copy-data-tool/specify-azure-sql-database.png)

    A dataset must be associated with a linked service. The linked service has the connection string that the Data Factory service uses to connect to the Azure SQL database at runtime. The dataset specifies the container, folder, and the file (optional) to which the data is copied.

9.  In the **Table mapping** page, select the **[dbo].[emp]** table, and select **Next**: 

    ![Table mapping page](./media/tutorial-copy-data-tool/table-mapping-page.png)
10. In the **Schema mapping** page, notice that the first and second columns in the input file are mapped to the **FirstName** and **LastName** columns of the **emp** table:

    ![Schema mapping page](./media/tutorial-copy-data-tool/schema-mapping-page.png)
11. In the **Settings** page, select **Next**: 

    ![Settings page](./media/tutorial-copy-data-tool/settings-page.png)
12. In the **Summary** page, review the settings, and select **Next**:

    ![Summary page](./media/tutorial-copy-data-tool/summary-page.png)
13. In the **Deployment page**, select **Monitor** to monitor the pipeline (task):

    ![Deployment page](./media/tutorial-copy-data-tool/deployment-page.png)
14. Notice that the **Monitor** tab on the left is automatically selected. The **Actions** column includes links to view activity run details and to rerun the pipeline. Select **Refresh** to refresh the list. 

    ![Monitor pipeline runs](./media/tutorial-copy-data-tool/monitor-pipeline-runs.png)
15. To view the activity runs that are associated with the pipeline run, select the **View Activity Runs** link in the **Actions** column. There's only one activity (copy activity) in the pipeline, so you see only one entry. For details about the copy operation, select the **Details** link (eye glasses icon) in the **Actions** column. To switch back to the pipeline runs view, select the **Pipelines** link at the top. To refresh the view, select **Refresh**. 

    ![Monitor activity runs](./media/tutorial-copy-data-tool/monitor-activity-runs.png)
16. Select the **Edit** tab on the left to switch to the editor mode. You can update the linked services, datasets, and pipelines that were created via the tool by using the editor. Select **Code** to view the JSON code for the entity that's currently opened in the editor. For details on editing these entities in the Data Factory UI, see [the Azure portal version of this tutorial](tutorial-copy-data-portal.md).

    ![Editor tab](./media/tutorial-copy-data-tool/edit-tab.png)
17. Verify that the data is inserted into the **emp** table in your Azure SQL database:

    ![Verify SQL output](./media/tutorial-copy-data-tool/verify-sql-output.png)

## Next steps
The pipeline in this sample copies data from Azure Blob storage to an Azure SQL database. You learned how to: 

> [!div class="checklist"]
> * Create a data factory.
> * Use the Copy Data tool to create a pipeline.
> * Monitor the pipeline and activity runs.

Advance to the following tutorial to learn how to copy data from on-premises to the cloud: 

> [!div class="nextstepaction"]
>[Copy data from on-premises to the cloud](tutorial-hybrid-copy-data-tool.md)