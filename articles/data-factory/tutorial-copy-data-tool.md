---
title: Copy data by using the Azure Copy Data tool | Microsoft Docs
description: Create an Azure data factory and then use the Copy Data tool to copy data from Azure Blob storage to a SQL database.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.topic: hero-article
ms.date: 01/09/2018
ms.author: jingwang

---
# Copy data from Azure Blob storage to a SQL database by using the Copy Data tool
> [!div class="op_single_selector" title1="Select the version of the Data Factory service that you're using:"]
> * [Version 1 - Generally available](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
> * [Version 2 - Preview](tutorial-copy-data-tool.md)

In this tutorial, you use the Azure portal to create a data factory. Then, you use the Copy Data tool to create a pipeline that copies data from Azure Blob storage to a SQL database. 

> [!NOTE]
> If you're new to Azure Data Factory, see [Introduction to Azure Data Factory](introduction.md).
>
> This article applies to version 2 of Data Factory, which is currently in preview. If you use version 1 of Data Factory, which is generally available, see [Get started with Data Factory version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).


In this tutorial, you perform the following steps:

> [!div class="checklist"]
> * Create a data factory.
> * Use the Copy Data tool to create a pipeline.
> * Monitor the pipeline and activity runs.

## Prerequisites

* **Azure subscription**: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* **Azure storage account**: Use Blob storage as the _source_ data store. If you don't have an Azure storage account, see the instructions in [Create a storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account).
* **Azure SQL Database**: Use a SQL database as the _sink_ data store. If you don't have a SQL database, see the instructions in [Create a SQL database](../sql-database/sql-database-get-started-portal.md).

### Create a blob and a SQL table

Prepare your Blob storage and your SQL database for the tutorial by performing these steps.

#### Create a source blob

1. Launch **Notepad**. Copy the following text and save it in a file named **inputEmp.txt** on your disk:

	```
    John|Doe
    Jane|Doe
	```

2. Create a container named **adfv2tutorial** and upload the inputEmp.txt file to the container. You can use various tools to perform these tasks, such as [Azure Storage Explorer](http://storageexplorer.com/).

#### Create a sink SQL table

1. Use the following SQL script to create a table named **dbo.emp** in your SQL database:

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

2. Allow Azure services to access SQL Server. Verify that the setting **Allow access to Azure services** is enabled for your server that's running SQL Server. This setting lets Data Factory write data to your SQL server instance. To verify and turn on this setting, take the following steps:

    a. On the left, select **More services**, and then select **SQL servers**.

    b. Select your server, and then select **SETTINGS** > **Firewall**.

    c. On the **Firewall settings** page, set the **Allow access to Azure services** option to **ON**.

## Create a data factory

1. On the left menu, select **+ New** > **Data + Analytics** > **Data Factory**: 
   
   ![New data factory creation](./media/tutorial-copy-data-tool/new-azure-data-factory-menu.png)
2. On the **New data factory** page, under **Name**, enter **ADFTutorialDataFactory**. 
      
     ![New data factory](./media/tutorial-copy-data-tool/new-azure-data-factory.png)
 
   The name for your data factory must be _globally unique_. You might receive the following error message:
   
   ![New data factory error message](./media/tutorial-copy-data-tool/name-not-available-error.png)

   If you receive an error message about the name value, enter a different name for the data factory. For example, use the name _**yourname**_**ADFTutorialDataFactory**. For the naming rules for Data Factory artifacts, see [Data Factory naming rules](naming-rules.md).
3. Select the Azure **subscription** in which to create the new data factory. 
4. For **Resource Group**, take one of the following steps:
     
    a. Select **Use existing**, and select an existing resource group from the drop-down list.

    b. Select **Create new**, and enter the name of a resource group. 
         
    To learn about resource groups, see [Use resource groups to manage your Azure resources](../azure-resource-manager/resource-group-overview.md).

5. Under **version**, select **V2 (Preview)** for the version.
6. Under **location**, select the location for the data factory. Only supported locations are displayed in the drop-down list. The data stores (for example, Azure Storage and SQL Database) and computes (for example, Azure HDInsight) that are used by your data factory can be in other locations and regions.
7. Select **Pin to dashboard**. 
8. Select **Create**.
9. On the dashboard, the **Deploying Data Factory** tile shows the process status.

	![Deploying data factory tile](media/tutorial-copy-data-tool/deploying-data-factory.png)
10. After creation is finished, the **Data Factory** home page is displayed.
   
    ![Data factory home page](./media/tutorial-copy-data-tool/data-factory-home-page.png)
11. To launch the Azure Data Factory user interface (UI) in a separate tab, select the **Author & Monitor** tile. 

## Use the Copy Data tool to create a pipeline

1. On the **Let's get started** page, select the **Copy Data** tile to launch the Copy Data tool. 

   ![Copy Data tool tile](./media/tutorial-copy-data-tool/copy-data-tool-tile.png)
2. On the **Properties** page, under **Task name**, enter **CopyFromBlobToSqlPipeline**. Then select **Next**. The Data Factory UI creates a pipeline with the specified task name. 

    ![Properties page](./media/tutorial-copy-data-tool/copy-data-tool-properties-page.png)
3. On the **Source data store** page, select **Azure Blob Storage**, and then select **Next**. The source data is in Blob storage. 

    ![Source data store page](./media/tutorial-copy-data-tool/source-data-store-page.png)
4. On the **Specify the Azure Blob storage account** page, take the following steps:

    a. Under **Connection name**, enter **AzureStorageLinkedService**.

    b. Select your storage account name from the **Storage account name** drop-down list.

    c. Select **Next**. 

    ![Specify the storage account](./media/tutorial-copy-data-tool/specify-blob-storage-account.png)

    A linked service links a data store or a compute to the data factory. In this case, you create a storage linked service to link your storage account to the data store. The linked service has the connection information that Data Factory uses to connect to Blob storage at runtime. The dataset specifies the container, folder, and the file (optional) that contains the source data. 

5. On the **Choose the input file or folder** page, do the following steps:
    
    a. Browse to the **adfv2tutorial/input** folder.

    b. Select the **inputEmp.txt** file.

    c. Select **Choose**. Alternatively, you can double-click the **inputEmp.txt** file.

    d. Select **Next**. 

    ![Choose the input file or folder](./media/tutorial-copy-data-tool/choose-input-file-folder.png)

6. On the **File format settings** page, notice that the tool automatically detects the column and row delimiters. Select **Next**. You also can preview data and view the schema of the input data on this page. 

    ![File format settings](./media/tutorial-copy-data-tool/file-format-settings-page.png)
7. On the **Destination data store** page, select **Azure SQL Database**, and then select **Next**.

    ![Destination data store](./media/tutorial-copy-data-tool/destination-data-storage-page.png)
8. On the **Specify the Azure SQL database** page, take the following steps: 

    a. Under **Connection name**, enter **AzureSqlDatabaseLinkedService**.

    b. Under **Server name**, select your SQL Server instance.

    c. Under **Database name**, select your SQL database.

    d. Under **User name**, enter the name of the user.

    e. Under **Password**, enter the password for the user.

    f. Select **Next**. 

    ![Specify the SQL database](./media/tutorial-copy-data-tool/specify-azure-sql-database.png)

    A dataset must be associated with a linked service. The linked service has the connection string that Data Factory uses to connect to the SQL database at runtime. The dataset specifies the container, folder, and the file (optional) to which the data is copied.

9. On the **Table mapping** page, select the **[dbo].[emp]** table, and then select **Next**. 

    ![Table mapping](./media/tutorial-copy-data-tool/table-mapping-page.png)
10. On the **Schema mapping** page, notice that the first and second columns in the input file are mapped to the **FirstName** and **LastName** columns of the **emp** table.

    ![Schema mapping page](./media/tutorial-copy-data-tool/schema-mapping-page.png)
11. On the **Settings** page, select **Next**. 

    ![Settings page](./media/tutorial-copy-data-tool/settings-page.png)
12. On the **Summary** page, review the settings, and then select **Next**.

    ![Summary page](./media/tutorial-copy-data-tool/summary-page.png)
13. On the **Deployment page**, select **Monitor** to monitor the pipeline (task).

    ![Deployment page](./media/tutorial-copy-data-tool/deployment-page.png)
14. Notice that the **Monitor** tab on the left is automatically selected. The **Actions** column includes links to view activity run details and to rerun the pipeline. Select **Refresh** to refresh the list. 

    ![Monitor pipeline runs](./media/tutorial-copy-data-tool/monitor-pipeline-runs.png)
15. To view the activity runs that are associated with the pipeline run, select the **View Activity Runs** link in the **Actions** column. There's only one activity (copy activity) in the pipeline, so you see only one entry. For details about the copy operation, select the **Details** link (eyeglasses icon) in the **Actions** column. To go back to the **Pipeline Runs** view, select the **Pipelines** link at the top. To refresh the view, select **Refresh**. 

    ![Monitor activity runs](./media/tutorial-copy-data-tool/monitor-activity-runs.png)
16. Select the **Edit** tab on the left to switch to the editor mode. You can update the linked services, datasets, and pipelines that were created via the tool by using the editor. Select **Code** to view the JSON code for the entity that's currently opened in the editor. For details on editing these entities in the Data Factory UI, see [the Azure portal version of this tutorial](tutorial-copy-data-portal.md).

    ![Editor tab](./media/tutorial-copy-data-tool/edit-tab.png)
17. Verify that the data is inserted into the **emp** table in your SQL database.

    ![Verify SQL output](./media/tutorial-copy-data-tool/verify-sql-output.png)

## Next steps
The pipeline in this sample copies data from Blob storage to a SQL database. You learned how to: 

> [!div class="checklist"]
> * Create a data factory.
> * Use the Copy Data tool to create a pipeline.
> * Monitor the pipeline and activity runs.

Advance to the following tutorial to learn how to copy data from on-premises to the cloud: 

> [!div class="nextstepaction"]
>[Copy data from on-premises to the cloud](tutorial-hybrid-copy-data-tool.md)
