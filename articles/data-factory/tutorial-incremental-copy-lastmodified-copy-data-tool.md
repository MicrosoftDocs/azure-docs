---
title: Using Azure Data Factory to incrementally copy new and changed files only based on LastModifiedDate | Microsoft Docs
description: Create an Azure data factory and then use the Copy Data tool to incrementally load new files only based on LastModifiedDate.
services: data-factory
documentationcenter: ''
author: dearandyxu
ms.author: yexu
ms.reviewer: 
manager: 
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 1/24/2019

---
# Incrementally copy new and changed files based on LastModifiedDate by using the Copy Data tool

In this tutorial, you use the Azure portal to create a data factory. Then, you use the Copy Data tool to create a pipeline that incrementally copies new and changed files only based on their "LastModifiedDate" from Azure Blob storage to Azure Blob storage. 

> [!NOTE]
> If you're new to Azure Data Factory, see [Introduction to Azure Data Factory](introduction.md).

In this tutorial, you perform the following steps:

> [!div class="checklist"]
> * Create a data factory.
> * Use the Copy Data tool to create a pipeline.
> * Monitor the pipeline and activity runs.

## Prerequisites

* **Azure subscription**: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* **Azure storage account**: Use Blob storage as the _source_  and _sink_ data store. If you don't have an Azure storage account, see the instructions in [Create a storage account](../storage/common/storage-quickstart-create-account.md).

### Create two containers in Blob storage

Prepare your Blob storage for the tutorial by performing these steps.

1. Create a container named **source**. You can use various tools to perform these tasks, such as [Azure Storage Explorer](https://storageexplorer.com/).

2. Create a container named **destination**. You can use various tools to perform these tasks, such as [Azure Storage Explorer](https://storageexplorer.com/).

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

5. Under **version**, select **V2** for the version.
6. Under **location**, select the location for the data factory. Only supported locations are displayed in the drop-down list. The data stores (for example, Azure Storage and SQL Database) and computes (for example, Azure HDInsight) that are used by your data factory can be in other locations and regions.
7. Select **Pin to dashboard**. 
8. Select **Create**.
9. On the dashboard, the **Deploying Data Factory** tile shows the process status.

	![Deploying data factory tile](media/tutorial-copy-data-tool/deploying-data-factory.png)
10. After creation is finished, the **Data Factory** home page is displayed.
   
    ![Data factory home page](./media/tutorial-copy-data-tool/data-factory-home-page.png)
11. To launch the Azure Data Factory user interface (UI) in a separate tab, select the **Author & Monitor** tile. 

## Use the Copy Data tool to create a pipeline

1. On the **Let's get started** page, select the **Copy Data** title to launch the Copy Data tool. 

   ![Copy Data tool tile](./media/tutorial-copy-data-tool/copy-data-tool-tile.png)
   
2. On the **Properties** page, take the following steps:

	a. Under **Task name**, enter **DeltaCopyFromBlobPipeline**.

	b. Under **Task cadence or Task schedule**, select **Run regularly on schedule**.

	c. Under **Trigger type**, select **Tumbling Window**.
	
	d. Under **Recurrence**, enter **15 Minute(s)**. 
	
	e. Select **Next**. 
	
	The Data Factory UI creates a pipeline with the specified task name. 

    ![Properties page](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/copy-data-tool-properties-page.png)
	
3. On the **Source data store** page, complete the following steps:

	a. Click  **+ Create new connection**, to add a connection.
	
	![Source data store page](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/source-data-store-page.png)

    b. Select **Azure Blob Storage** from the gallery, and then click **Continue**.
	
	![Source data store page](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/source-data-store-page-select-blob.png)

	c. On the **New Linked Service** page, select your storage account from the **Storage account name** list, and then click **Finish**.
	
	![Source data store page](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/source-data-store-page-linkedservice.png)
	
    d. Select the newly created linked service, then click **Next**. 
	
   ![Source data store page](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/source-data-store-page-select-linkedservice.png)

4. On the **Choose the input file or folder** page, do the following steps:
    
    a. Browse and select the **source** folder, then click **Choose**.
	
    ![Choose the input file or folder](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/choose-input-file-folder.png)
	
	b. Under **File loading behavior**, select **Incremental load: LastModifiedDate**.
	
    ![Choose the input file or folder](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/choose-loading-behavior.png)
	
	c. Check **Binary copy** and click **Next**.
	
	 ![Choose the input file or folder](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/check-binary-copy.png)
	 
5. On the **Destination data store** page, select the **AzureBlobStorage** which is the same storage account as data source store, and then click **Next**.

	![Destination data store page](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/destination-data-store-page-select-linkedservice.png)
	
6. On the **Choose the output file or folder** page, do the following steps:
    
    a. Browse and select the **destination** folder, then click **Choose**.
	
    ![Choose the output file or folder](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/choose-output-file-folder.png)
	
	b. Click **Next**.
	
	 ![Choose the output file or folder](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/click-next-after-output-folder.png)
	
7. On the **Settings** page, select **Next**. 

    ![Settings page](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/settings-page.png)
	
8. On the **Summary** page, review the settings, and then select **Next**.

    ![Summary page](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/summary-page.png)
	
9. On the **Deployment page**, select **Monitor** to monitor the pipeline (task).

    ![Deployment page](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/deployment-page.png)
	
10. Notice that the **Monitor** tab on the left is automatically selected. The **Actions** column includes links to view activity run details and to rerun the pipeline. Select **Refresh** to refresh the list, and select the **View Activity Runs** link in the **Actions** column. 

	![Monitor pipeline runs](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/monitor-pipeline-runs1.png)

11. There's only one activity (copy activity) in the pipeline, so you see only one entry. For details about the copy operation, select the **Details** link (eyeglasses icon) in the **Actions** column. 

	![Monitor pipeline runs](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/monitor-pipeline-runs2.png)
	
	Given that there is no file in **source** container in your blob storage account,  so you will not see any file which has been copied to **destination** container in your blob storage account.
	
	![Monitor pipeline runs](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/monitor-pipeline-runs3.png)
	
12. Create an empty text file, and name it as file1.txt. Upload the file1.txt file to the **source** container in your storage account. You can use various tools to perform these tasks, such as [Azure Storage Explorer](https://storageexplorer.com/).	

	![Monitor pipeline runs](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/monitor-pipeline-runs3-1.png)
	
13. To go back to the **Pipeline Runs** view, select **All Pipelines Runs**, and wait for the same pipeline being triggered again automatically.  

	![Monitor pipeline runs](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/monitor-pipeline-runs4.png)

14. Select **View Activity Run** for the second pipeline run if you see it comes, and do the same to review details.  

	![Monitor pipeline runs](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/monitor-pipeline-runs5.png)

	You will see one file (file1.txt) has been copied from the **source** container to the **destination** container of your storage account.
	
	![Monitor pipeline runs](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/monitor-pipeline-runs6.png)
	
15. Create another empty text file, and name it as file2.txt. Upload the file2.txt file to the **source** container in your storage account. You can use various tools to perform these tasks, such as [Azure Storage Explorer](https://storageexplorer.com/).	
	
16. Do the same as step 13 and 14, and you will see only the new file (file2.txt) has been copied from the **source** container to the **destination** container of your storage account in the next pipeline run.  
	
	![Monitor pipeline runs](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/monitor-pipeline-runs7.png)

	You can also verify the same by using Azure Storage Explorer (https://storageexplorer.com/) to scan the files.
	
	![Monitor pipeline runs](./media/tutorial-incremental-copy-lastmodified-copy-data-tool/monitor-pipeline-runs8.png)

	
## Next steps
Advance to the following tutorial to learn about transforming data by using a Spark cluster on Azure:

> [!div class="nextstepaction"]
>[Transform data using Spark cluster in cloud](tutorial-transform-data-spark-portal.md)