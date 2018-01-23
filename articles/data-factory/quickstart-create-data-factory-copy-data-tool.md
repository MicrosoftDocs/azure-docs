---
title: Copy data using the Azure Copy Data tool | Microsoft Docs
description: 'Create an Azure data factory and then use the Copy Data tool to copy data from one folder in an Azure blob storage to another folder.'
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.topic: hero-article
ms.date: 01/16/2018
ms.author: jingwang

---
# Use Copy Data tool to copy data 
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1 - GA](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
> * [Version 2 - Preview](quickstart-create-data-factory-copy-data-tool.md)

In this quickstart, you use Azure portal to create a data factory. Then, you use the Copy Data tool to create a pipeline that copies data from a folder in Azure Blob storage to another folder. 

> [!NOTE]
> If you are new to Azure Data Factory, see [Introduction to Azure Data Factory](data-factory-introduction.md) before doing this quickstart. 
>
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Get started with Data Factory version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).


[!INCLUDE [data-factory-quickstart-prerequisites](../../includes/data-factory-quickstart-prerequisites.md)] 

## Create a data factory

1. Select **New** on the left menu, select **Data + Analytics**, and select **Data Factory**. 
   
   ![New > DataFactory](./media/quickstart-create-data-factory-copy-data-tool/new-azure-data-factory-menu.png)
2. On the **New data factory** page, enter **ADFTutorialDataFactory** for the **name**. 
      
   ![New data factory page](./media/quickstart-create-data-factory-copy-data-tool/new-azure-data-factory.png)
 
   The name of the Azure data factory must be *globally unique*. If you see the following error for the name field, change the name of the data factory (for example, yournameADFTutorialDataFactory) and try creating again. For naming rules for Data Factory artifacts, see the [Data Factory - Naming Rules](naming-rules.md) article.
  
   ![Name not available - error](./media/quickstart-create-data-factory-portal/name-not-available-error.png)
3. Select your Azure **subscription** in which you want to create the data factory. 
4. For the **Resource Group**, do one of the following steps:
     
   - Select **Use existing**, and select an existing resource group from the list. 
   - Select **Create new**, and enter the name of a resource group.   
         
   To learn about resource groups, see [Using resource groups to manage your Azure resources](../azure-resource-manager/resource-group-overview.md).  
4. Select **V2 (Preview)** for the **version**.
5. Select the **location** for the data factory. Only supported locations are displayed in the list. The data stores (like Azure Storage and Azure SQL Database) and computes (like Azure HDInsight) used by data factory can be in other locations/regions.
6. Select **Pin to dashboard**.     
7. Select **Create**.
8. On the dashboard, you see the following tile with status: **Deploying data factory**. 

	![deploying data factory tile](media/quickstart-create-data-factory-copy-data-tool/deploying-data-factory.png)
9. After the creation is complete, you see the **Data Factory** page as shown in the image.
   
   ![Data factory home page](./media/quickstart-create-data-factory-copy-data-tool/data-factory-home-page.png)
10. Select **Author & Monitor** tile to launch the Azure Data Factory user interface (UI) in a separate tab. 

## Launch Copy Data tool

1. On the get started page, select **Copy Data** tile to launch the Copy Data tool. 

   ![Copy Data tool tile](./media/quickstart-create-data-factory-copy-data-tool/copy-data-tool-tile.png)
2. On the **Properties** page of the Copy Data tool, select **Next**. You can specify a name for the pipeline and its description on this page. 

   ![Copy Data tool- Properties page](./media/quickstart-create-data-factory-copy-data-tool/copy-data-tool-properties-page.png)
3. On the **Source data store** page, select **Azure Blob Storage**, and select **Next**.

   ![Source data store page](./media/quickstart-create-data-factory-copy-data-tool/source-data-store-page.png)
4. On the **Specify the Azure Blob storage account** page, select your **storage account name** from the drop-down list, and select **Next**. 

   ![Specify Blob storage account](./media/quickstart-create-data-factory-copy-data-tool/specify-blob-storage-account.png)
5. On the **Choose the input file or folder** page, do the following steps:

   a. Browse to the **adftutorial/input** folder.

   b. Select **emp.txt** file.

   c. Select **Choose**. You can double-click **emp.txt** to skip this step.

   d. Select **Next**. 

   ![Choose input file or folder](./media/quickstart-create-data-factory-copy-data-tool/choose-input-file-folder.png)
6. On the **File format settings** page, notice that the tool automatically detects the column and row delimiters, and select **Next**. You can also preview data and view schema of the input data on this page. 

   ![File format settings page](./media/quickstart-create-data-factory-copy-data-tool/file-format-settings-page.png)
7. On the **Destination data store** page, select **Azure Blob Storage**, and select **Next**. 

   ![Destination data store page](./media/quickstart-create-data-factory-copy-data-tool/destination-data-store-page.png)    
8. On the **Specify the Azure Blob storage account** page, select your Azure Blob storage account, and select **Next**. 

   ![Specify sink data store page](./media/quickstart-create-data-factory-copy-data-tool/specify-sink-blob-storage-account.png)
9. On the **Choose the output file or folder** page, complete the following steps: 

   a. Enter **adftutorial/output** for the **folder path**.

   b. Enter **emp.txt** for the **file name**.

   c. Select **Next**. 

   ![Choose output file or folder](./media/quickstart-create-data-factory-copy-data-tool/choose-output-file-folder.png) 
10. On the **File format settings** page, select **Next**. 

    ![File format settings page](./media/quickstart-create-data-factory-copy-data-tool/file-format-settings-output-page.png)
11. Select **Next** on the **Settings** page. 

    ![Advanced settings page](./media/quickstart-create-data-factory-copy-data-tool/advanced-settings-page.png)
12. Review all settings on the **Summary** page, and select **Next**. 

    ![Summary page](./media/quickstart-create-data-factory-copy-data-tool/summary-page.png)
13. On the **Deployment complete** page, select **Monitor** to monitor the pipeline that you created. 

    ![Deployment page](./media/quickstart-create-data-factory-copy-data-tool/deployment-page.png)
14. The application switches to the **Monitor** tab. You see the status of the pipeline on this page. Select **Refresh** to refresh the list. 
    
    ![Monitor pipeline runs page](./media/quickstart-create-data-factory-copy-data-tool/monitor-pipeline-runs-page.png)
15. Select the **View Activity Runs** link in the **Actions** column. The pipeline has only one activity of type **Copy**. 

    ![Activity Runs page](./media/quickstart-create-data-factory-copy-data-tool/activity-runs.png)
16. To view details about the copy operation, select the **Details** (eye glasses image) link in the **Actions** column. For details about the properties, see [Copy Activity overview](copy-activity-overview.md). 

    ![Copy operation details](./media/quickstart-create-data-factory-copy-data-tool/copy-operation-details.png)
17. Verify that the **emp.txt** file is created in the **output** folder of the **adftutorial** container. If the output folder does not exist, the Data Factory service automatically creates it. 
18. Switch to the **Edit** tab to be able to edit linked services, datasets, and pipelines. To learn about editing them in the Data Factory UI, see [Create a data factory using the Azure portal](quickstart-create-data-factory-portal.md).

    ![Edit tab](./media/quickstart-create-data-factory-copy-data-tool/edit-tab.png)

## Next steps
The pipeline in this sample copies data from one location to another location in Azure Blob storage. Go through the [tutorials](tutorial-copy-data-portal.md) to learn about using Data Factory in more scenarios. 