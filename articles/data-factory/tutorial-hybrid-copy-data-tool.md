---
title: Copy on-premises data using the Azure Copy Data tool
description: Create an Azure Data Factory and then use the Copy Data tool to copy data from a SQL Server database to Azure Blob storage.
ms.author: abnarain
author: nabhishek
ms.service: data-factory
ms.subservice: tutorials
ms.topic: tutorial
ms.custom: seo-lt-2019
ms.date: 08/10/2023
---

# Copy data from a SQL Server database to Azure Blob storage by using the Copy Data tool

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

In this tutorial, you use the Azure portal to create a data factory. Then, you use the Copy Data tool to create a pipeline that copies data from a SQL Server database to Azure Blob storage.

> [!NOTE]
> - If you're new to Azure Data Factory, see [Introduction to Data Factory](introduction.md).

In this tutorial, you perform the following steps:

> [!div class="checklist"]
> * Create a data factory.
> * Use the Copy Data tool to create a pipeline.
> * Monitor the pipeline and activity runs.

## Prerequisites
### Azure subscription
Before you begin, if you don't already have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).

### Azure roles
To create data factory instances, the user account you use to log in to Azure must be assigned a *Contributor* or *Owner* role or must be an *administrator* of the Azure subscription.

To view the permissions you have in the subscription, go to the Azure portal. Select your user name in the upper-right corner, and then select **Permissions**. If you have access to multiple subscriptions, select the appropriate subscription. For sample instructions on how to add a user to a role, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

### SQL Server 2014, 2016, and 2017
In this tutorial, you use a SQL Server database as a *source* data store. The pipeline in the data factory you create in this tutorial copies data from this SQL Server database (source) to Blob storage (sink). You then create a table named **emp** in your SQL Server database and insert a couple of sample entries into the table.

1. Start SQL Server Management Studio. If it's not already installed on your machine, go to [Download SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms).

1. Connect to your SQL Server instance by using your credentials.

1. Create a sample database. In the tree view, right-click **Databases**, and then select **New Database**.

1. In the **New Database** window, enter a name for the database, and then select **OK**.

1. To create the **emp** table and insert some sample data into it, run the following query script against the database. In the tree view, right-click the database that you created, and then select **New Query**.

    ```sql
    CREATE TABLE dbo.emp
    (
        ID int IDENTITY(1,1) NOT NULL,
        FirstName varchar(50),
        LastName varchar(50)
    )
    GO

    INSERT INTO emp (FirstName, LastName) VALUES ('John', 'Doe')
    INSERT INTO emp (FirstName, LastName) VALUES ('Jane', 'Doe')
    GO
    ```

### Azure storage account
In this tutorial, you use a general-purpose Azure storage account (specifically, Blob storage) as a destination/sink data store. If you don't have a general-purpose storage account, see [Create a storage account](../storage/common/storage-account-create.md) for instructions to create one. The pipeline in the data factory you that create in this tutorial copies data from the SQL Server database (source) to this Blob storage (sink). 

#### Get the storage account name and account key
You use the name and key of your storage account in this tutorial. To get the name and key of your storage account, take the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure user name and password.

1. In the left pane, select **All services**. Filter by using the **Storage** keyword, and then select **Storage accounts**.

    :::image type="content" source="media/doc-common-process/search-storage-account.png" alt-text="Storage account search":::

1. In the list of storage accounts, filter for your storage account, if needed. Then select your storage account.

1. In the **Storage account** window, select **Access keys**.


1. In the **Storage account name** and **key1** boxes, copy the values, and then paste them into Notepad or another editor for later use in the tutorial.

## Create a data factory

1. On the menu on the left, select **Create a resource** > **Integration** > **Data Factory**.

   :::image type="content" source="./media/doc-common-process/new-azure-data-factory-menu.png" alt-text="New data factory creation":::

1. On the **New data factory** page, under **Name**, enter **ADFTutorialDataFactory**.

   The name of the data factory must be *globally unique*. If you see the following error message for the name field, change the name of the data factory (for example, yournameADFTutorialDataFactory). For naming rules for Data Factory artifacts, see [Data Factory naming rules](naming-rules.md).

    :::image type="content" source="./media/doc-common-process/name-not-available-error.png" alt-text="New data factory error message for duplicate name.":::
1. Select the Azure **subscription** in which you want to create the data factory.
1. For **Resource Group**, take one of the following steps:

   - Select **Use existing**, and select an existing resource group from the drop-down list.

   - Select **Create new**, and enter the name of a resource group. 
        
     To learn about resource groups, see [Use resource groups to manage your Azure resources](../azure-resource-manager/management/overview.md).
1. Under **Version**, select **V2**.
1. Under **Location**, select the location for the data factory. Only locations that are supported are displayed in the drop-down list. The data stores (for example, Azure Storage and SQL Database) and computes (for example, Azure HDInsight) used by Data Factory can be in other locations/regions.
1. Select **Create**.

1. After the creation is finished, you see the **Data Factory** page as shown in the image.

    :::image type="content" source="./media/doc-common-process/data-factory-home-page.png" alt-text="Home page for the Azure Data Factory, with the Open Azure Data Factory Studio tile.":::

1. Select **Open** on the **Open Azure Data Factory Studio** tile to launch the Data Factory user interface in a separate tab.

## Use the Copy Data tool to create a pipeline

1. On the Azure Data Factory home page, select **Ingest** to launch the Copy Data tool.

   :::image type="content" source="./media/doc-common-process/get-started-page.png" alt-text="Screenshot that shows the Azure Data Factory home page.":::

1. On the **Properties** page of the Copy Data tool, choose **Built-in copy task** under **Task type**, and choose **Run once now** under **Task cadence or task schedule**, then select **Next**.

1. On the **Source data store** page, select on **+ Create new connection**.

1. Under **New connection**, search for **SQL Server**, and then select **Continue**.

1. In the **New connection (SQL server)** dialog box, under **Name**, enter **SqlServerLinkedService**. Select **+New** under **Connect via integration runtime**. You must create a self-hosted integration runtime, download it to your machine, and register it with Data Factory. The self-hosted integration runtime copies data between your on-premises environment and the cloud.

1. In the **Integration runtime setup** dialog box, select **Self-Hosted**. Then select **Continue**.

   :::image type="content" source="./media/tutorial-hybrid-copy-data-tool/create-self-hosted-integration-runtime.png" alt-text="Create integration runtime":::

1. In the **Integration runtime setup** dialog box, under **Name**, enter **TutorialIntegrationRuntime**. Then select **Create**.

1. In the **Integration runtime setup** dialog box, select **Click here to launch the express setup for this computer**. This action installs the integration runtime on your machine and registers it with Data Factory. Alternatively, you can use the manual setup option to download the installation file, run it, and use the key to register the integration runtime.

1. Run the downloaded application. You see the status of the express setup in the window.

    :::image type="content" source="./media/tutorial-hybrid-copy-data-tool/express-setup-status.png" alt-text="Express setup status":::

1. In the **New Connection (SQL Server)** dialog box, confirm that **TutorialIntegrationRuntime** is selected under **Connect via integration runtime**. Then, take the following steps:

    a. Under **Name**, enter **SqlServerLinkedService**.

    b. Under **Server name**, enter the name of your SQL Server instance.

    c. Under **Database name**, enter the name of your on-premises database.

    d. Under **Authentication type**, select appropriate authentication.

    e. Under **User name**, enter the name of user with access to SQL Server.

    f. Enter the **Password** for the user.

    g. Test connection and select **Create**.

      :::image type="content" source="./media/tutorial-hybrid-copy-data-tool/integration-runtime-selected.png" alt-text="Integration runtime selected":::

1. On the **Source data store** page, ensure that the newly created **SQL Server** connection is selected in the **Connection** block. Then in the **Source tables** section, choose **EXISTING TABLES** and select the **dbo.emp** table in the list, and select **Next**. You can select any other table based on your database.

1. On the **Apply filter** page, you can preview data and view the schema of the input data by selecting the **Preview data** button. Then select **Next**.

1. On the **Destination data store** page, select **+ Create new connection**

1. In **New connection**, search and select **Azure Blob Storage**, and then select **Continue**.

   :::image type="content" source="./media/tutorial-hybrid-copy-data-tool/select-destination-data-store.png" alt-text="Blob storage selection":::

1. On the **New connection (Azure Blob Storage)** dialog, take the following steps:

   a. Under **Name**, enter **AzureStorageLinkedService**.

   b. Under **Connect via integration runtime**, select **TutorialIntegrationRuntime**, and select **Account key** under **Authentication method**.
   
   c. Under **Azure subscription**, select your Azure subscription from the drop-down list.

   d. Under **Storage account name**, select your storage account from the drop-down list.

   e. Test connection and select **Create**.

1. In the **Destination data store** dialog, make sure that the newly created **Azure Blob Storage** connection is selected in the **Connection** block. Then under **Folder path**, enter **adftutorial/fromonprem**. You created the **adftutorial** container as part of the prerequisites. If the output folder doesn't exist (in this case **fromonprem**), Data Factory automatically creates it. You can also use the **Browse** button to browse the blob storage and its containers/folders. If you do not specify any value under **File name**, by default the name from the source would be used (in this case **dbo.emp**).

   :::image type="content" source="./media/tutorial-hybrid-copy-data-tool/destination-data-store.png" alt-text="Screenshot that shows the configuration of the 'Destination data store' page.":::

1. On the **File format settings** dialog, select **Next**.

1. On the **Settings** dialog, under **Task name**, enter **CopyFromOnPremSqlToAzureBlobPipeline**, and then select **Next**. The Copy Data tool creates a pipeline with the name you specify for this field.

1. On the **Summary** dialog, review values for all the settings, and select **Next**.

1. On the **Deployment** page, select **Monitor** to monitor the pipeline (task). 

1. When the pipeline run completes, you can view the status of the pipeline you created. 

1. On the "Pipeline runs" page, select **Refresh** to refresh the list. Select the link under **Pipeline name** to view activity run details or rerun the pipeline. 

    :::image type="content" source="./media/tutorial-hybrid-copy-data-tool/pipeline-runs.png" alt-text="Screenshot that shows the 'Pipeline runs' page.":::

1. On the "Activity runs" page, select the **Details** link (eyeglasses icon) under the **Activity name** column for more details about copy operation. To go back to the "Pipeline runs" page, select the **All pipeline runs** link in the breadcrumb menu. To refresh the view, select **Refresh**.

    :::image type="content" source="./media/tutorial-hybrid-copy-data-tool/activity-details.png" alt-text="Screenshot that shows the activity details.":::

1. Confirm that you see the output file in the **fromonprem** folder of the **adftutorial** container.

1. Select the **Author** tab on the left to switch to the editor mode. You can update the linked services, datasets, and pipelines created by the tool by using the editor. Select **Code** to view the JSON code associated with the entity opened in the editor. For details on how to edit these entities in the Data Factory UI, see [the Azure portal version of this tutorial](tutorial-copy-data-portal.md).

    :::image type="content" source="./media/tutorial-hybrid-copy-data-tool/author-tab.png" alt-text="Screenshot that shows the Author tab.":::

## Next steps
The pipeline in this sample copies data from a SQL Server database to Blob storage. You learned how to:

> [!div class="checklist"]
> * Create a data factory.
> * Use the Copy Data tool to create a pipeline.
> * Monitor the pipeline and activity runs.

For a list of data stores that are supported by Data Factory, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).

To learn about how to copy data in bulk from a source to a destination, advance to the following tutorial:

> [!div class="nextstepaction"]
>[Copy data in bulk](tutorial-bulk-copy-portal.md)
