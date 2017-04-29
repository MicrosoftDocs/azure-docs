---
title: 'Tutorial: Create a pipeline with Copy Activity using Visual Studio | Microsoft Docs'
description: In this tutorial, you create an Azure Data Factory pipeline with a Copy Activity by using Visual Studio.
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: monicar

ms.assetid: 1751185b-ce0a-4ab2-a9c3-e37b4d149ca3
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/11/2017
ms.author: spelluru

---
# Tutorial: Create a pipeline with Copy Activity using Visual Studio
> [!div class="op_single_selector"]
> * [Overview and prerequisites](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
> * [Copy Wizard](data-factory-copy-data-wizard-tutorial.md)
> * [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md)
> * [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md)
> * [PowerShell](data-factory-copy-activity-tutorial-using-powershell.md)
> * [Azure Resource Manager template](data-factory-copy-activity-tutorial-using-azure-resource-manager-template.md)
> * [REST API](data-factory-copy-activity-tutorial-using-rest-api.md)
> * [.NET API](data-factory-copy-activity-tutorial-using-dotnet-api.md)
> 
> 

This tutorial shows you how to create and monitor an Azure data factory using the Visual Studio. The pipeline in the data factory uses a Copy Activity to copy data from Azure Blob Storage to Azure SQL Database.

> [!NOTE]
> The data pipeline in this tutorial copies data from a source data store to a destination data store. It does not transform input data to produce output data. For a tutorial on how to transform data using Azure Data Factory, see [Tutorial: Build your first pipeline to transform data using Hadoop cluster](data-factory-build-your-first-pipeline.md).
> 
> You can chain two activities (run one activity after another) by setting the output dataset of one activity as the input dataset of the other activity. See [Scheduling and execution in Data Factory](data-factory-scheduling-and-execution.md) for detailed information.

Here are the steps you perform as part of this tutorial:

1. Create two linked services: **AzureStorageLinkedService1** and **AzureSqlinkedService1**. 
   
    The AzureStorageLinkedService1 links an Azure storage and AzureSqlLinkedService1 links an Azure SQL database to the data factory: **ADFTutorialDataFactoryVS**. The input data for the pipeline resides in a blob container in the Azure blob storage and output data is stored in a table in the Azure SQL database. Therefore, you add these two data stores as linked services to the data factory.
2. Create two datasets: **InputDataset** and **OutputDataset**, which represent the input/output data that is stored in the data stores. 
   
    For the InputDataset, you specify the blob container that contains a blob with the source data. For the OutputDataset, you specify the SQL table that stores the output data. You also specify other properties such as structure, availability, and policy.
3. Create a pipeline named **ADFTutorialPipeline** in the ADFTutorialDataFactoryVS. 
   
    The pipeline has a **Copy Activity** that copies input data from the Azure blob to the output Azure SQL table. The Copy Activity performs the data movement in Azure Data Factory. The activity is powered by a globally available service that can copy data between various data stores in a secure, reliable, and scalable way. See [Data Movement Activities](data-factory-data-movement-activities.md) article for details about the Copy Activity. 
4. Create a data factory named **VSTutorialFactory**. Deploy the data factory and all Data Factory entities (linked services, tables, and the pipeline).    

## Prerequisites
1. Read through [Tutorial Overview](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) article and complete the **prerequisite** steps. 
2. You must be an **administrator of the Azure subscription** to be able to publish Data Factory entities to Azure Data Factory.  
3. You must have the following installed on your computer: 
   * Visual Studio 2013 or Visual Studio 2015
   * Download Azure SDK for Visual Studio 2013 or Visual Studio 2015. Navigate to [Azure Download Page](https://azure.microsoft.com/downloads/) and click **VS 2013** or **VS 2015** in the **.NET** section.
   * Download the latest Azure Data Factory plugin for Visual Studio: [VS 2013](https://visualstudiogallery.msdn.microsoft.com/754d998c-8f92-4aa7-835b-e89c8c954aa5) or [VS 2015](https://visualstudiogallery.msdn.microsoft.com/371a4cf9-0093-40fa-b7dd-be3c74f49005). You can also update the plugin by doing the following steps: On the menu, click **Tools** -> **Extensions and Updates** -> **Online** -> **Visual Studio Gallery** -> **Microsoft Azure Data Factory Tools for Visual Studio** -> **Update**.

## Create Visual Studio project
1. Launch **Visual Studio 2013**. Click **File**, point to **New**, and click **Project**. You should see the **New Project** dialog box.  
2. In the **New Project** dialog, select the **DataFactory** template, and click **Empty Data Factory Project**. If you don't see the DataFactory template, close Visual Studio, install Azure SDK for Visual Studio 2013, and reopen Visual Studio.  
   
    ![New project dialog box](./media/data-factory-copy-activity-tutorial-using-visual-studio/new-project-dialog.png)
3. Enter a **name** for the project, **location**, and a name for the **solution**, and click **OK**.
   
    ![Solution Explorer](./media/data-factory-copy-activity-tutorial-using-visual-studio/solution-explorer.png)    

## Create linked services
Linked services link data stores or compute services to an Azure data factory. See [supported data stores](data-factory-data-movement-activities.md#supported-data-stores-and-formats) for all the sources and sinks supported by the Copy Activity. See [compute linked services](data-factory-compute-linked-services.md) for the list of compute services supported by Data Factory. In this tutorial, you do not use any compute service. 

In this step, you create two linked services: **AzureStorageLinkedService1** and **AzureSqlLinkedService1**. AzureStorageLinkedService1 linked service links an Azure Storage Account and AzureSqlLinkedService links an Azure SQL database to the data factory: **ADFTutorialDataFactory**. 

### Create the Azure Storage linked service
1. Right-click **Linked Services** in the solution explorer, point to **Add**, and click **New Item**.      
2. In the **Add New Item** dialog box, select **Azure Storage Linked Service** from the list, and click **Add**. 
   
    ![New Linked Service](./media/data-factory-copy-activity-tutorial-using-visual-studio/new-linked-service-dialog.png)
3. Replace `<accountname>` and `<accountkey>`* with the name of your Azure storage account and its key. 
   
    ![Azure Storage Linked Service](./media/data-factory-copy-activity-tutorial-using-visual-studio/azure-storage-linked-service.png)
4. Save the **AzureStorageLinkedService1.json** file.

> See [Move data from/to Azure Blob](data-factory-azure-blob-connector.md#azure-storage-linked-service) for details about JSON properties.
> 
> 

### Create the Azure SQL linked service
1. Right-click on **Linked Services** node in the **Solution Explorer** again, point to **Add**, and click **New Item**. 
2. This time, select **Azure SQL Linked Service**, and click **Add**. 
3. In the **AzureSqlLinkedService1.json file**, replace `<servername>`, `<databasename>`, `<username@servername>`, and `<password>` with names of your Azure SQL server, database, user account, and password.    
4. Save the **AzureSqlLinkedService1.json** file. 

> [!NOTE]
> See [Move data from/to Azure SQL Database](data-factory-azure-sql-connector.md#linked-service-properties) for details about JSON properties.
> 
> 

## Create datasets
In the previous step, you created linked services **AzureStorageLinkedService1** and **AzureSqlLinkedService1** to link an Azure Storage account and Azure SQL database to the data factory: **ADFTutorialDataFactory**. In this step, you define two datasets -- **InputDataset** and **OutputDataset** -- that represent the input/output data that is stored in the data stores referred by AzureStorageLinkedService1 and AzureSqlLinkedService1 respectively. For InputDataset, you specify the blob container that contains a blob with the source data. For OutputDataset, you specify the SQL table that stores the output data.

### Create input dataset
In this step, you create a dataset named **InputDataset** that points to a blob container in the Azure Storage represented by the **AzureStorageLinkedService1** linked service. A table is a rectangular dataset and is the only type of dataset supported right now. 

1. Right-click **Tables** in the **Solution Explorer**, point to **Add**, and click **New Item**.
2. In the **Add New Item** dialog box, select **Azure Blob**, and click **Add**.   
3. Replace the JSON text with the following text and save the **AzureBlobLocation1.json** file. 

  ```json   
  {
    "name": "InputDataset",
    "properties": {
      "structure": [
        {
          "name": "FirstName",
          "type": "String"
        },
        {
          "name": "LastName",
          "type": "String"
        }
      ],
      "type": "AzureBlob",
      "linkedServiceName": "AzureStorageLinkedService1",
      "typeProperties": {
        "folderPath": "adftutorial/",
        "format": {
          "type": "TextFormat",
          "columnDelimiter": ","
        }
      },
      "external": true,
      "availability": {
        "frequency": "Hour",
        "interval": 1
      }
    }
  }
  ``` 
    Note the following points: 
   
   * dataset **type** is set to **AzureBlob**.
   * **linkedServiceName** is set to **AzureStorageLinkedService**. You created this linked service in Step 2.
   * **folderPath** is set to the **adftutorial** container. You can also specify the name of a blob within the folder using the **fileName** property. Since you are not specifying the name of the blob, data from all blobs in the container is considered as an input data.  
   * format **type** is set to **TextFormat**
   * There are two fields in the text file – **FirstName** and **LastName** – separated by a comma character (columnDelimiter)    
   * The **availability** is set to **hourly** (frequency is set to hour and interval is set to 1). Therefore, Data Factory looks for input data every hour in the root folder of blob container (adftutorial) you specified. 
   
   if you don't specify a **fileName** for an **input** dataset, all files/blobs from the input folder (folderPath) are considered as inputs. If you specify a fileName in the JSON, only the specified file/blob is considered asn input.
   
   If you do not specify a **fileName** for an **output table**, the generated files in the **folderPath** are named in the following format: Data.&lt;Guid&gt;.txt (example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt.).
   
   To set **folderPath** and **fileName** dynamically based on the **SliceStart** time, use the **partitionedBy** property. In the following example, folderPath uses Year, Month, and Day from the SliceStart (start time of the slice being processed) and fileName uses Hour from the SliceStart. For example, if a slice is being produced for 2016-09-20T08:00:00, the folderName is set to wikidatagateway/wikisampledataout/2016/09/20 and the fileName is set to 08.csv. 
  
    ```json   
    "folderPath": "wikidatagateway/wikisampledataout/{Year}/{Month}/{Day}",
    "fileName": "{Hour}.csv",
    "partitionedBy": 
    [
        { "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
        { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "MM" } }, 
        { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "dd" } }, 
        { "name": "Hour", "value": { "type": "DateTime", "date": "SliceStart", "format": "hh" } } 
    ```
            
> [!NOTE]
> See [Move data from/to Azure Blob](data-factory-azure-blob-connector.md#dataset-properties) for details about JSON properties.
> 
> 

### Create output dataset
In this step, you create an output dataset named **OutputDataset**. This dataset points to a SQL table in the Azure SQL database represented by **AzureSqlLinkedService1**. 

1. Right-click **Tables** in the **Solution Explorer** again, point to **Add**, and click **New Item**.
2. In the **Add New Item** dialog box, select **Azure SQL**, and click **Add**. 
3. Replace the JSON text with the following JSON and save the **AzureSqlTableLocation1.json** file.

  ```json
	{
	 "name": "OutputDataset",
	 "properties": {
	   "structure": [
	     {
	       "name": "FirstName",
	       "type": "String"
	     },
	     {
	       "name": "LastName",
	       "type": "String"
	     }
	   ],
	   "type": "AzureSqlTable",
	   "linkedServiceName": "AzureSqlLinkedService1",
	   "typeProperties": {
	     "tableName": "emp"
	   },
	   "availability": {
	     "frequency": "Hour",
	     "interval": 1
	   }
	 }
	}
	```
   
    Note the following points: 
   
   * dataset **type** is set to **AzureSQLTable**.
   * **linkedServiceName** is set to **AzureSqlLinkedService** (you created this linked service in Step 2).
   * **tablename** is set to **emp**.
   * There are three columns – **ID**, **FirstName**, and **LastName** – in the emp table in the database. ID is an identity column, so you need to specify only **FirstName** and **LastName** here.
   * The **availability** is set to **hourly** (frequency set to hour and interval set to 1).  The Data Factory service generates an output data slice every hour in the **emp** table in the Azure SQL database.

> [!NOTE]
> See [Move data from/to Azure SQL Database](data-factory-azure-sql-connector.md#linked-service-properties) for details about JSON properties.
> 
> 

## Create pipeline
You have created input/output linked services and tables so far. Now, you create a pipeline with a **Copy Activity** to copy data from the Azure blob to Azure SQL database. 

1. Right-click **Pipelines** in the **Solution Explorer**, point to **Add**, and click **New Item**.  
2. Select **Copy Data Pipeline** in the **Add New Item** dialog box and click **Add**. 
3. Replace the JSON with the following JSON and save the **CopyActivity1.json** file.

  ```json   
	{
	 "name": "ADFTutorialPipeline",
	 "properties": {
	   "description": "Copy data from a blob to Azure SQL table",
	   "activities": [
	     {
	       "name": "CopyFromBlobToSQL",
	       "type": "Copy",
	       "inputs": [
	         {
	           "name": "InputDataset"
	         }
	       ],
	       "outputs": [
	         {
	           "name": "OutputDataset"
	         }
	       ],
	       "typeProperties": {
	         "source": {
	           "type": "BlobSource"
	         },
	         "sink": {
	           "type": "SqlSink",
	           "writeBatchSize": 10000,
	           "writeBatchTimeout": "60:00:00"
	         }
	       },
	       "Policy": {
	         "concurrency": 1,
	         "executionPriorityOrder": "NewestFirst",
	         "style": "StartOfInterval",
	         "retry": 0,
	         "timeout": "01:00:00"
	       }
	     }
	   ],
	   "start": "2015-07-12T00:00:00Z",
	   "end": "2015-07-13T00:00:00Z",
	   "isPaused": false
	 }
	}
	```   
   Note the following points:
   
   * In the activities section, there is only one activity whose **type** is set to **Copy**.
   * Input for the activity is set to **InputDataset** and output for the activity is set to **OutputDataset**.
   * In the **typeProperties** section, **BlobSource** is specified as the source type and **SqlSink** is specified as the sink type.
   
   Replace the value of the **start** property with the current day and **end** value with the next day. You can specify only the date part and skip the time part of the date time. For example, "2016-02-03", which is equivalent to "2016-02-03T00:00:00Z"
   
   Both start and end datetimes must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2016-10-14T16:32:41Z. The **end** time is optional, but we use it in this tutorial. 
   
   If you do not specify value for the **end** property, it is calculated as **start + 48 hours**. To run the pipeline indefinitely, specify **9999-09-09** as the value for the **end** property.
   
   In the preceding example, there are 24 data slices as each data slice is produced hourly.

## Publish/deploy Data Factory entities
In this step, you publish Data Factory entities (linked services, datasets, and pipeline) you created earlier. You also specify the name of the new data factory to be created to hold these entities.  

1. Right-click project in the Solution Explorer, and click **Publish**. 
2. If you see **Sign in to your Microsoft account** dialog box, enter your credentials for the account that has Azure subscription, and click **sign in**.
3. You should see the following dialog box:
   
   ![Publish dialog box](./media/data-factory-copy-activity-tutorial-using-visual-studio/publish.png)
4. In the Configure data factory page, do the following steps: 
   
   1. select **Create New Data Factory** option.
   2. Enter **VSTutorialFactory** for **Name**.  
      
      > [!IMPORTANT]
      > The name of the Azure data factory must be globally unique. If you receive an error about the name of data factory when publishing, change the name of the data factory (for example, yournameVSTutorialFactory) and try publishing again. See [Data Factory - Naming Rules](data-factory-naming-rules.md) topic for naming rules for Data Factory artifacts.        
      > 
      > 
   3. Select your Azure subscription for the **Subscription** field.
      
      > [!IMPORTANT]
      > If you do not see any subscription, ensure that you logged in using an account that is an admin or co-admin of the subscription.  
      > 
      > 
   4. Select the **resource group** for the data factory to be created. 
   5. Select the **region** for the data factory. Only regions supported by the Data Factory service are shown in the drop-down list.
   6. Click **Next** to switch to the **Publish Items** page.
      
       ![Configure data factory page](media/data-factory-copy-activity-tutorial-using-visual-studio/configure-data-factory-page.png)   
5. In the **Publish Items** page, ensure that all the Data Factories entities are selected, and click **Next** to switch to the **Summary** page.
   
   ![Publish items page](media/data-factory-copy-activity-tutorial-using-visual-studio/publish-items-page.png)     
6. Review the summary and click **Next** to start the deployment process and view the **Deployment Status**.
   
   ![Publish summary page](media/data-factory-copy-activity-tutorial-using-visual-studio/publish-summary-page.png)
7. In the **Deployment Status** page, you should see the status of the deployment process. Click Finish after the deployment is done.
 
   ![Deployment status page](media/data-factory-copy-activity-tutorial-using-visual-studio/deployment-status.png)

Note the following points: 

* If you receive the error: "This subscription is not registered to use namespace Microsoft.DataFactory", do one of the following and try publishing again: 
  
  * In Azure PowerShell, run the following command to register the Data Factory provider. 

	```PowerShell    
	Register-AzureRmResourceProvider -ProviderNamespace Microsoft.DataFactory
    ```
	You can run the following command to confirm that the Data Factory provider is registered. 
    
	```PowerShell
	Get-AzureRmResourceProvider
	```
  * Login using the Azure subscription into the [Azure portal](https://portal.azure.com) and navigate to a Data Factory blade (or) create a data factory in the Azure portal. This action automatically registers the provider for you.
* The name of the data factory may be registered as a DNS name in the future and hence become publically visible.

> [!IMPORTANT]
> To create Data Factory instances, you need to be a admin/co-admin of the Azure subscription
> 
> 

## Summary
In this tutorial, you created an Azure data factory to copy data from an Azure blob to an Azure SQL database. You used Visual Studio to create the data factory, linked services, datasets, and a pipeline. Here are the high-level steps you performed in this tutorial:  

1. Created an Azure **data factory**.
2. Created **linked services**:
   1. An **Azure Storage** linked service to link your Azure Storage account that holds input data.     
   2. An **Azure SQL** linked service to link your Azure SQL database that holds the output data. 
3. Created **datasets**, which describe input data and output data for pipelines.
4. Created a **pipeline** with a **Copy Activity** with **BlobSource** as source and **SqlSink** as sink. 

## Use Server Explorer to view data factories
1. In **Visual Studio**, click **View** on the menu, and click **Server Explorer**.
2. In the Server Explorer window, expand **Azure** and expand **Data Factory**. If you see **Sign in to Visual Studio**, enter the **account** associated with your Azure subscription and click **Continue**. Enter **password**, and click **Sign in**. Visual Studio tries to get information about all Azure data factories in your subscription. You see the status of this operation in the **Data Factory Task List** window.

    ![Server Explorer](./media/data-factory-copy-activity-tutorial-using-visual-studio/server-explorer.png)
3. You can right-click on a data factory, and select Export Data Factory to New Project to create a Visual Studio project based on an existing data factory.

    ![Export data factory to a VS project](./media/data-factory-copy-activity-tutorial-using-visual-studio/export-data-factory-menu.png)  

## Update Data Factory tools for Visual Studio
To update Azure Data Factory tools for Visual Studio, do the following steps:

1. Click **Tools** on the menu and select **Extensions and Updates**. 
2. Select **Updates** in the left pane and then select **Visual Studio Gallery**.
3. Select **Azure Data Factory tools for Visual Studio** and click **Update**. If you do not see this entry, you already have the latest version of the tools. 

See [Monitor datasets and pipeline](data-factory-copy-activity-tutorial-using-azure-portal.md#monitor-pipeline) for instructions on how to use the Azure portal to monitor the pipeline and datasets you have created in this tutorial.

## See Also
| Topic | Description |
|:--- |:--- |
| [Pipelines](data-factory-create-pipelines.md) |This article helps you understand pipelines and activities in Azure Data Factory |
| [Datasets](data-factory-create-datasets.md) |This article helps you understand datasets in Azure Data Factory. |
| [Scheduling and execution](data-factory-scheduling-and-execution.md) |This article explains the scheduling and execution aspects of Azure Data Factory application model. |
| [Monitor and manage pipelines using Monitoring App](data-factory-monitor-manage-app.md) |This article describes how to monitor, manage, and debug pipelines using the Monitoring & Management App. |

