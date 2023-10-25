---
title: Data tool to copy new and updated files incrementally 
description: Create an Azure data factory and then use the Copy Data tool to incrementally load new files based on LastModifiedDate.
author: dearandyxu
ms.author: yexu
ms.service: data-factory
ms.subservice: tutorials
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 08/10/2023
---

# Incrementally copy new and changed files based on LastModifiedDate by using the Copy Data tool

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

In this tutorial, you'll use the Azure portal to create a data factory. You'll then use the Copy Data tool to create a pipeline that incrementally copies new and changed files only, from Azure Blob storage to Azure Blob storage. It uses `LastModifiedDate` to determine which files to copy.

After you complete the steps here, Azure Data Factory will scan all the files in the source store, apply the file filter by `LastModifiedDate`, and copy to the destination store only files that are new or have been updated since last time. Note that if Data Factory scans large numbers of files, you should still expect long durations. File scanning is time consuming, even when the amount of data copied is reduced.

> [!NOTE]
> If you're new to Data Factory, see [Introduction to Azure Data Factory](introduction.md).

In this tutorial, you'll complete these tasks:

> [!div class="checklist"]
> * Create a data factory.
> * Use the Copy Data tool to create a pipeline.
> * Monitor the pipeline and activity runs.

## Prerequisites

* **Azure subscription**: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* **Azure Storage account**: Use Blob storage for the source and sink data stores. If you don't have an Azure Storage account, follow the instructions in [Create a storage account](../storage/common/storage-account-create.md).

## Create two containers in Blob storage

Prepare your Blob storage for the tutorial by completing these steps:

1. Create a container named **source**. You can use various tools to perform this task, like [Azure Storage Explorer](https://storageexplorer.com/).

2. Create a container named **destination**.

## Create a data factory

1. In the left pane, select **Create a resource**. Select **Integration** > **Data Factory**:

   :::image type="content" source="./media/doc-common-process/new-azure-data-factory-menu.png" alt-text="Select Data Factory":::

2. On the **New data factory** page, under **Name**, enter **ADFTutorialDataFactory**.

   The name for your data factory must be globally unique. You might receive this error message:

    :::image type="content" source="./media/doc-common-process/name-not-available-error.png" alt-text="New data factory error message for duplicate name.":::

   If you receive an error message about the name value, enter a different name for the data factory. For example, use the name _**yourname**_**ADFTutorialDataFactory**. For the naming rules for Data Factory artifacts, see [Data Factory naming rules](naming-rules.md).
3. Under **Subscription**, select the Azure subscription in which you'll create the new data factory.
4. Under **Resource Group**, take one of these steps:

    * Select **Use existing** and then select an existing resource group in the list.

    * Select **Create new** and then enter a name for the resource group.
         
    To learn about resource groups, see [Use resource groups to manage your Azure resources](../azure-resource-manager/management/overview.md).

5. Under **Version**, select **V2**.
6. Under **Location**, select the location for the data factory. Only supported locations appear in the list. The data stores (for example, Azure Storage and Azure SQL Database) and computes (for example, Azure HDInsight) that your data factory uses can be in other locations and regions.
8. Select **Create**.
9. After the data factory is created, the data factory home page appears.
10. To open the Azure Data Factory user interface (UI) on a separate tab, select **Open** on the **Open Azure Data Factory Studio** tile:

    :::image type="content" source="./media/doc-common-process/data-factory-home-page.png" alt-text="Home page for the Azure Data Factory, with the Open Azure Data Factory Studio tile.":::

## Use the Copy Data tool to create a pipeline

1. On the Azure Data Factory home page, select the **Ingest** tile to open the Copy Data tool:

   :::image type="content" source="./media/doc-common-process/get-started-page.png" alt-text="Screenshot that shows the ADF home page.":::

2. On the **Properties** page, take the following steps:

    1. Under **Task type**, select **Built-in copy task**.

    1. Under **Task cadence or task schedule**, select **Tumbling window**.

    1. Under **Recurrence**, enter **15 Minute(s)**.

    1. Select **Next**.

    :::image type="content" source="./media/tutorial-incremental-copy-lastmodified-copy-data-tool/copy-data-tool-properties-page.png" alt-text="Copy data properties page":::

3. On the **Source data store** page, complete these steps:

    1. Select  **+ New connection** to add a connection.

    1. Select **Azure Blob Storage** from the gallery, and then select **Continue**:

        :::image type="content" source="./media/tutorial-incremental-copy-lastmodified-copy-data-tool/source-data-store-page-select-blob.png" alt-text="Select Azure Blog Storage":::

    1. On the **New connection (Azure Blob Storage)** page, select your Azure subscription from the **Azure subscription** list and your storage account from the **Storage account name** list. Test the connection and then select **Create**.

    1. Select the newly created connection in the **Connection** block.

    1. In the **File or folder** section, select **Browse** and choose the **source** folder, and then select **OK**.

    1. Under **File loading behavior**, select **Incremental load: LastModifiedDate**, and choose **Binary copy**.
    
    1. Select **Next**.

    :::image type="content" source="./media/tutorial-incremental-copy-lastmodified-copy-data-tool/source-data-store-page.png" alt-text="Screenshot that shows the 'Source data store' page.":::

4. On the **Destination data store** page, complete these steps:
    1. Select the **AzureBlobStorage** connection that you created. This is the same storage account as the source data store.

    1. In the **Folder path** section, browse for and select the **destination** folder, and then select **OK**.

    1. Select **Next**.

    :::image type="content" source="./media/tutorial-incremental-copy-lastmodified-copy-data-tool/destination-data-store-page.png" alt-text="Screenshot that shows the 'Destination data store' page.":::

5. On the **Settings** page, under **Task name**, enter **DeltaCopyFromBlobPipeline**, then select **Next**. Data Factory creates a pipeline with the specified task name.

    :::image type="content" source="./media/tutorial-incremental-copy-lastmodified-copy-data-tool/settings-page.png" alt-text="Screenshot that shows the Settings page.":::

6. On the **Summary** page, review the settings and then select **Next**.

    :::image type="content" source="./media/tutorial-incremental-copy-lastmodified-copy-data-tool/summary-page.png" alt-text="Summary page":::

7. On the **Deployment** page, select **Monitor** to monitor the pipeline (task).

    :::image type="content" source="./media/tutorial-incremental-copy-lastmodified-copy-data-tool/deployment-page.png" alt-text="Deployment page":::

8. Notice that the **Monitor** tab on the left is automatically selected. The application switches to the **Monitor** tab. You see the status of the pipeline. Select **Refresh** to refresh the list. Select the link under **Pipeline name** to view activity run details or to run the pipeline again.

    :::image type="content" source="./media/tutorial-incremental-copy-lastmodified-copy-data-tool/monitor-pipeline-runs-1.png" alt-text="Refresh the list and view activity run details":::

9. There's only one activity (the copy activity) in the pipeline, so you see only one entry. For details about the copy operation, on the **Activity runs** page, select the **Details** link (the eyeglasses icon) in the **Activity name** column. For details about the properties, see [Copy activity overview](copy-activity-overview.md).

    :::image type="content" source="./media/tutorial-incremental-copy-lastmodified-copy-data-tool/monitor-pipeline-runs2.png" alt-text="Copy activity in the pipeline":::

    Because there are no files in the source container in your Blob storage account, you won't see any files copied to the destination container in the account:

    :::image type="content" source="./media/tutorial-incremental-copy-lastmodified-copy-data-tool/monitor-pipeline-runs3.png" alt-text="No files in source container or destination container":::

10. Create an empty text file and name it **file1.txt**. Upload this text file to the source container in your storage account. You can use various tools to perform these tasks, like [Azure Storage Explorer](https://storageexplorer.com/).

    :::image type="content" source="./media/tutorial-incremental-copy-lastmodified-copy-data-tool/monitor-pipeline-runs3-1.png" alt-text="Create file1.txt and upload it to the source container":::

11. To go back to the **Pipeline runs** view, select **All pipeline runs** link in the breadcrumb menu on the **Activity runs** page, and wait for the same pipeline to be automatically triggered again.  

12. When the second pipeline run completes, follow the same steps mentioned previously to review the activity run details.  

    You'll see that one file (file1.txt) has been copied from the source container to the destination container of your Blob storage account:

    :::image type="content" source="./media/tutorial-incremental-copy-lastmodified-copy-data-tool/monitor-pipeline-runs6.png" alt-text="file1.txt has been copied from the source container to the destination container":::

13. Create another empty text file and name it **file2.txt**. Upload this text file to the source container in your Blob storage account.

14. Repeat steps 11 and 12 for the second text file. You'll see that only the new file (file2.txt) was copied from the source container to the destination container of your storage account during this pipeline run.  

    You can also verify that only one file has been copied by using [Azure Storage Explorer](https://storageexplorer.com/) to scan the files:

    :::image type="content" source="./media/tutorial-incremental-copy-lastmodified-copy-data-tool/monitor-pipeline-runs8.png" alt-text="Scan files by using Azure Storage Explorer":::

## Next steps
Go to the following tutorial to learn how to transform data by using an Apache Spark cluster on Azure:

> [!div class="nextstepaction"]
>[Transform data in the cloud by using an Apache Spark cluster](tutorial-transform-data-spark-portal.md)
