---
title: Copy data using the Azure Copy Data tool | Microsoft Docs
description: 'Create an Azure data factory and then use the Copy Data tool to copy data from Azure Blob Storage to Azure SQL Database.'
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
# Copy data from Azure Blob to Azure SQL Database using Copy Data tool
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1 - GA](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
> * [Version 2 - Preview](tutorial-copy-data-tool.md)

In this tutorial, you use Azure portal to create a data factory. Then, you use the Copy Data tool to create a pipeline that copies data from an Azure blob storage to an Azure SQL database. 

> [!NOTE]
> > If you are new to Azure Data Factory, see [Introduction to Azure Data Factory](introduction.md).
>
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [get started with Data Factory version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).


You perform the following steps in this tutorial:

> [!div class="checklist"]
> * Create a data factory.
> * Use Copy Data tool to create a pipeline
> * Monitor the pipeline and activity runs.

## Prerequisites

* **Azure subscription**. If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
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

2. Use tools such as [Azure Storage Explorer](http://storageexplorer.com/) to create the **adfv2tutorial** container, and to upload the **inputEmp.txt** file to the container.

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

2. Allow Azure services to access SQL server. Ensure that **Allow access to Azure services** setting is enabled for your Azure SQL server so that the Data Factory service can write data to your Azure SQL server. To verify and turn on this setting, do the following steps:

    1. Click **More services** hub on the left and click **SQL servers**.
    2. Select your server, and click **Firewall** under **SETTINGS**.
    3. In the **Firewall settings** page, click **ON** for **Allow access to Azure services**.

## Create a data factory

1. Click **New** on the left menu, click **Data + Analytics**, and click **Data Factory**. 
   
   ![New->DataFactory](./media/tutorial-copy-data-tool/new-azure-data-factory-menu.png)
2. In the **New data factory** page, enter **ADFTutorialDataFactory** for the **name**. 
      
     ![New data factory page](./media/tutorial-copy-data-tool/new-azure-data-factory.png)
 
   The name of the Azure data factory must be **globally unique**. If you see the following error for the name field, change the name of the data factory (for example, yournameADFTutorialDataFactory). See [Data Factory - Naming Rules](naming-rules.md) article for naming rules for Data Factory artifacts.
  
     ![New data factory page](./media/tutorial-copy-data-tool/name-not-available-error.png)
3. Select your Azure **subscription** in which you want to create the data factory. 
4. For the **Resource Group**, do one of the following steps:
     
      - Select **Use existing**, and select an existing resource group from the drop-down list. 
      - Select **Create new**, and enter the name of a resource group.   
         
      To learn about resource groups, see [Using resource groups to manage your Azure resources](../azure-resource-manager/resource-group-overview.md).  
4. Select **V2 (Preview)** for the **version**.
5. Select the **location** for the data factory. Only supported locations are displayed in the drop-down list. The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other locations/regions.
6. Select **Pin to dashboard**.     
7. Click **Create**.
8. On the dashboard, you see the following tile with status: **Deploying data factory**. 

	![deploying data factory tile](media/tutorial-copy-data-tool/deploying-data-factory.png)
9. After the creation is complete, you see the **Data Factory** page as shown in the image.
   
   ![Data factory home page](./media/tutorial-copy-data-tool/data-factory-home-page.png)
10. Click **Author & Monitor** tile to launch the Data Integration Application in a separate tab. 

## Use Copy Data tool to create a pipeline

1. In the get started page, click **Copy Data** tile to launch the Copy Data tool. 

   ![Copy Data tool tile](./media/tutorial-copy-data-tool/copy-data-tool-tile.png)
2. In the **Properties** page of the Copy Data tool, specify **CopyFromBlobToSqlPipeline** for the **Task name**, and click **Next**. The Data Factory UI creates a pipeline with the name you specify for the task name. 

    ![Copy Data tool- Properties page](./media/tutorial-copy-data-tool/copy-data-tool-properties-page.png)
3. In the **Source data store** page, select **Azure Blob Storage**, and click **Next**. The source data is in an Azure blob storage. 

    ![Source data store page](./media/tutorial-copy-data-tool/source-data-store-page.png)
4. In the **Specify the Azure Blob storage account** page, do the following steps: 
    1. Enter **AzureStorageLinkedService** for the **connection name**.
    2. Select your **storage account name** from the drop-down list.
    3. Click **Next**. 

        ![Specify blob storage account](./media/tutorial-copy-data-tool/specify-blob-storage-account.png)

        A linked service links a data store or a compute to the data factory. In this case, you create an Azure Storage linked service to link your Azure Storage account to the data store. The linked service has the connection information that the Data Factory services uses to connect to the blob storage at runtime. The dataset specifies the container, folder, and the file (optional) that contains the source data. 
5. In the **Choose the input file or folder** page, do the following steps:
    
    1. Navigate to the **adfv2tutorial/input** folder.
    2. Select **inputEmp.txt**
    3. Click **Choose**. Alternatively, you can double-click **inputEmp.txt**. 
    4. Click **Next**. 

    ![Choose input file or folder](./media/tutorial-copy-data-tool/choose-input-file-folder.png)
6. In the **File format settings** page, notice that the tool automatically detects the column and row delimiters, and click **Next**. You can also preview data and view schema of the input data on this page. 

    ![File format settings page](./media/tutorial-copy-data-tool/file-format-settings-page.png)
7. In the **Destination data store** page, select **Azure SQL Database**, and click **Next**. 

    ![Destination data store page](./media/tutorial-copy-data-tool/destination-data-storage-page.png)
8. In the **Specify the Azure SQL database** page, do the following steps: 

    1. Specify **AzureSqlDatabaseLinkedService** for the **Connection name**. 
    2. Select your Azure SQL server for the **Server name**.
    3. Select your Azure SQL database for the **Database name**.
    4. Specify the name of the user for **User name**.
    5. Specify the password of the user for **Password**.
    6. Click **Next**. 

        ![Specify Azure SQL database](./media/tutorial-copy-data-tool/specify-azure-sql-database.png)

        A dataset must be associated with a linked service. The linked service has the connection string that the Data Factory service uses to connect to the Azure SQL database at runtime. The dataset specifies the container, folder, and the file (optional) to which the data is copied.
9.  In the **Table mapping** page, select **[dbo].[emp]**, and click **Next**. 

    ![Table mapping page](./media/tutorial-copy-data-tool/table-mapping-page.png)
10. In the **Schema mapping** page, notice that the first and second columns in the input file are mapped to **FirstName** and **LastName** columns of the **emp** table. 

    ![Schema mapping page](./media/tutorial-copy-data-tool/schema-mapping-page.png)
11. In the **Settings** page, click **Next**. 

    ![Settings page](./media/tutorial-copy-data-tool/settings-page.png)
12. In the **Summary** page, review the settings, and click **Next**.

    ![Summary page](./media/tutorial-copy-data-tool/summary-page.png)
13. In the **Deployment page**, click **Monitor** to monitor the pipeline (task).

    ![Deployment page](./media/tutorial-copy-data-tool/deployment-page.png)
14. Notice that the **Monitor** tab on the left is automatically selected. You see the links to view activity run details and to rerun the pipeline in the **Actions** column. Click **Refresh** to refresh the list. 

    ![Monitor pipeline runs](./media/tutorial-copy-data-tool/monitor-pipeline-runs.png)
15. To view activity runs associated with the pipeline run, click **View Activity Runs** link in the **Actions** column. There is only one activity (copy activity) in the pipeline, so you see only one entry. To switch back to the pipeline runs view, click **Pipelines** link at the top. Click **Refresh** to refresh the list. 

    ![Monitor activity runs](./media/tutorial-copy-data-tool/monitor-activity-runs.png)
16. Click the **Edit** tab on the left to switch to the editor mode. You can update the linked services, datasets, and pipelines created by the tool using the editor. Click **Code** to view the JSON code associated with the entity opened in the editor. For details on editing these entities in the Data Factory UI, see [the Azure portal version of this tutorial](tutorial-copy-data-portal.md).

    ![Editor tab](./media/tutorial-copy-data-tool/edit-tab.png)
17. Verify that the data is inserted into the **emp** table in your Azure SQL database. 

    ![Verify SQL output](./media/tutorial-copy-data-tool/verify-sql-output.png)

## Next steps
The pipeline in this sample copies data from an Azure blob storage to an Azure SQL database. You learned how to: 

> [!div class="checklist"]
> * Create a data factory.
> * Use Copy Data tool to create a pipeline
> * Monitor the pipeline and activity runs.

Advance to the following tutorial to learn about copying data from on-premises to cloud: 

> [!div class="nextstepaction"]
>[Copy data from on-premises to cloud](tutorial-hybrid-copy-data-tool.md)