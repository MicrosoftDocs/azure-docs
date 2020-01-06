---
title: 'Tutorial: Create a pipeline using Copy Wizard '
description: In this tutorial, you create an Azure Data Factory pipeline with a Copy Activity by using the Copy Wizard supported by Data Factory
services: data-factory
documentationcenter: ''
author: linda33wj
manager: shwang


ms.assetid: b87afb8e-53b7-4e1b-905b-0343dd096198
ms.service: data-factory
ms.workload: data-services
ms.topic: tutorial
ms.date: 01/22/2018
ms.author: jingwang

robots: noindex
---
# Tutorial: Create a pipeline with Copy Activity using Data Factory Copy Wizard
> [!div class="op_single_selector"]
> * [Overview and prerequisites](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
> * [Copy Wizard](data-factory-copy-data-wizard-tutorial.md)
> * [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md)
> * [PowerShell](data-factory-copy-activity-tutorial-using-powershell.md)
> * [Azure Resource Manager template](data-factory-copy-activity-tutorial-using-azure-resource-manager-template.md)
> * [REST API](data-factory-copy-activity-tutorial-using-rest-api.md)
> * [.NET API](data-factory-copy-activity-tutorial-using-dotnet-api.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [copy activity tutorial](../quickstart-create-data-factory-dot-net.md). 


This tutorial shows you how to use the **Copy Wizard** to copy data from an Azure blob storage to an Azure SQL database. 

The Azure Data Factory **Copy Wizard** allows you to quickly create a data pipeline that copies data from a supported source data store to a supported destination data store. Therefore, we recommend that you use the wizard as a first step to create a sample pipeline for your data movement scenario. For a list of data stores supported as sources and as destinations, see [supported data stores](data-factory-data-movement-activities.md#supported-data-stores-and-formats).  

This tutorial shows you how to create an Azure data factory, launch the Copy Wizard, go through a series of steps to provide details about your data ingestion/movement scenario. When you finish steps in the wizard, the wizard automatically creates a pipeline with a Copy Activity to copy data from an Azure blob storage to an Azure SQL database. For more information about Copy Activity, see [data movement activities](data-factory-data-movement-activities.md).

## Prerequisites
Complete prerequisites listed in the [Tutorial Overview](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) article before performing this tutorial.

## Create data factory
In this step, you use the Azure portal to create an Azure data factory named **ADFTutorialDataFactory**.

1. Log in to [Azure portal](https://portal.azure.com).
2. Click **Create a resource** from the top-left corner, click **Data + analytics**, and click **Data Factory**. 
   
   ![New->DataFactory](./media/data-factory-copy-data-wizard-tutorial/new-data-factory-menu.png)
2. In the **New data factory** blade:
   
   1. Enter **ADFTutorialDataFactory** for the **name**.
       The name of the Azure data factory must be globally unique. If you receive the error: `Data factory name “ADFTutorialDataFactory” is not available`, change the name of the data factory (for example, yournameADFTutorialDataFactoryYYYYMMDD) and try creating again. See [Data Factory - Naming Rules](data-factory-naming-rules.md) topic for naming rules for Data Factory artifacts.  
      
       ![Data Factory name not available](./media/data-factory-copy-data-wizard-tutorial/getstarted-data-factory-not-available.png)    
   2. Select your Azure **subscription**.
   3. For Resource Group, do one of the following steps: 
      
      - Select **Use existing** to select an existing resource group.
      - Select **Create new** to enter a name for a resource group.
          
		Some of the steps in this tutorial assume that you use the name: **ADFTutorialResourceGroup** for the resource group. To learn about resource groups, see [Using resource groups to manage your Azure resources](../../azure-resource-manager/management/overview.md).
   4. Select a **location** for the data factory.
   5. Select **Pin to dashboard** check box at the bottom of the blade.  
   6. Click **Create**.
      
       ![New data factory blade](media/data-factory-copy-data-wizard-tutorial/new-data-factory-blade.png)            
3. After the creation is complete, you see the **Data Factory** blade as shown in the following image:
   
   ![Data factory home page](./media/data-factory-copy-data-wizard-tutorial/getstarted-data-factory-home-page.png)

## Launch Copy Wizard
1. On the Data Factory blade, click **Copy data** to launch the **Copy Wizard**. 
   
   > [!NOTE]
   > If you see that the web browser is stuck at "Authorizing...", disable/uncheck **Block third-party cookies and site data** setting in the browser settings (or) keep it enabled and create an exception for **login.microsoftonline.com** and then try launching the wizard again.
2. In the **Properties** page:
   
   1. Enter **CopyFromBlobToAzureSql** for **Task name**
   2. Enter **description** (optional).
   3. Change the **Start date time** and the **End date time** so that the end date is set to today and start date to five days earlier.  
   4. Click **Next**.  
      
      ![Copy Tool - Properties page](./media/data-factory-copy-data-wizard-tutorial/copy-tool-properties-page.png) 
3. On the **Source data store** page, click **Azure Blob Storage** tile. You use this page to specify the source data store for the copy task. 
   
    ![Copy Tool - Source data store page](./media/data-factory-copy-data-wizard-tutorial/copy-tool-source-data-store-page.png)
4. On the **Specify the Azure Blob storage account** page:
   
   1. Enter **AzureStorageLinkedService** for **Linked service name**.
   2. Confirm that **From Azure subscriptions** option is selected for **Account selection method**.
   3. Select your Azure **subscription**.  
   4. Select an **Azure storage account** from the list of Azure storage accounts available in the selected subscription. You can also choose to enter storage account settings manually by selecting **Enter manually** option for the **Account selection method**, and then click **Next**. 
      
      ![Copy Tool - Specify the Azure Blob storage account](./media/data-factory-copy-data-wizard-tutorial/copy-tool-specify-azure-blob-storage-account.png)
5. On **Choose the input file or folder** page:
   
   1. Double-click **adftutorial** (folder).
   2. Select **emp.txt**, and click **Choose**
      
      ![Copy Tool - Choose the input file or folder](./media/data-factory-copy-data-wizard-tutorial/copy-tool-choose-input-file-or-folder.png)
6. On the **Choose the input file or folder** page, click **Next**. Do not select **Binary copy**. 
   
    ![Copy Tool - Choose the input file or folder](./media/data-factory-copy-data-wizard-tutorial/chose-input-file-folder.png) 
7. On the **File format settings** page, you see the delimiters and the schema that is auto-detected by the wizard by parsing the file. You can also enter the delimiters manually for the copy wizard to stop auto-detecting or to override. Click **Next** after you review the delimiters and preview data. 
   
    ![Copy Tool - File format settings](./media/data-factory-copy-data-wizard-tutorial/copy-tool-file-format-settings.png)  
8. On the Destination data store page, select **Azure SQL Database**, and click **Next**.
   
    ![Copy Tool - Choose destination store](./media/data-factory-copy-data-wizard-tutorial/choose-destination-store.png)
9. On **Specify the Azure SQL database** page:
   
   1. Enter **AzureSqlLinkedService** for the **Connection name** field.
   2. Confirm that **From Azure subscriptions** option is selected for **Server / database selection method**.
   3. Select your Azure **subscription**.  
   4. Select **Server name** and **Database**.
   5. Enter **User name** and **Password**.
   6. Click **Next**.  
      
      ![Copy Tool - specify Azure SQL database](./media/data-factory-copy-data-wizard-tutorial/specify-azure-sql-database.png)
10. On the **Table mapping** page, select **emp** for the **Destination** field from the drop-down list, click **down arrow** (optional) to see the schema and to preview the data.
    
     ![Copy Tool - Table mapping](./media/data-factory-copy-data-wizard-tutorial/copy-tool-table-mapping-page.png) 
11. On the **Schema mapping** page, click **Next**.
    
    ![Copy Tool - schema mapping](./media/data-factory-copy-data-wizard-tutorial/schema-mapping-page.png)
12. On the **Performance settings** page, click **Next**. 
    
    ![Copy Tool - performance settings](./media/data-factory-copy-data-wizard-tutorial/performance-settings.png)
13. Review information in the **Summary** page, and click **Finish**. The wizard creates two linked services, two datasets (input and output), and one pipeline in the data factory (from where you launched the Copy Wizard). 
    
    ![Copy Tool - performance settings](./media/data-factory-copy-data-wizard-tutorial/summary-page.png)

## Launch Monitor and Manage application
1. On the **Deployment** page, click the link: `Click here to monitor copy pipeline`.
   
   ![Copy Tool - Deployment succeeded](./media/data-factory-copy-data-wizard-tutorial/copy-tool-deployment-succeeded.png)  
2. The monitoring application is launched in a separate tab in your web browser.   
   
   ![Monitoring App](./media/data-factory-copy-data-wizard-tutorial/monitoring-app.png)   
3. To see the latest status of hourly slices, click **Refresh** button in the **ACTIVITY WINDOWS** list at the bottom. You see five activity windows for five days between start and end times for the pipeline. The list is not automatically refreshed, so you may need to click Refresh a couple of times before you see all the activity windows in the Ready state. 
4. Select an activity window in the list. See the details about it in the **Activity Window Explorer** on the right.

	![Activity window details](media/data-factory-copy-data-wizard-tutorial/activity-window-details.png)	

	Notice that the dates 11, 12, 13, 14, and 15 are in green color, which means that the daily output slices for these dates have already been produced. You also see this color coding on the pipeline and the output dataset in the diagram view. In the previous step, notice that two slices have already been produced, one slice is currently being processed, and the other two are waiting to be processed (based on the color coding). 

	For more information on using this application, see [Monitor and manage pipeline using Monitoring App](data-factory-monitor-manage-app.md) article.

## Next steps
In this tutorial, you used Azure blob storage as a source data store and an Azure SQL database as a destination data store in a copy operation. The following table provides a list of data stores supported as sources and destinations by the copy activity: 

[!INCLUDE [data-factory-supported-data-stores](../../../includes/data-factory-supported-data-stores.md)]

For details about fields/properties that you see in the copy wizard for a data store, click the link for the data store in the table. 