---
title: Copy data from SQL Server to Blob storage by using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from an on-premises data store to the Azure cloud by using a self-hosted integration runtime in Azure Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 01/11/2018
ms.author: jingwang
---
# Tutorial: Copy data from an on-premises SQL Server database to Azure Blob storage
In this tutorial, you use Azure portal to create a data-factory pipeline that copies data from an on-premises SQL Server database to Azure Blob storage. You create and use a self-hosted integration runtime, which moves data between on-premises and cloud data stores. 

> [!NOTE]
> This article applies to version 2 of Azure Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [documentation for Data Factory version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).
> 
> This article does not provide a detailed introduction to the Data Factory service. For more information, see [Introduction to Azure Data Factory](introduction.md). 

In this tutorial, you perform the following steps:

> [!div class="checklist"]
> * Create a data factory.
> * Create a self-hosted integration runtime.
> * Create SQL Server and Azure Storage linked services. 
> * Create SQL Server and Azure Blob datasets.
> * Create a pipeline with a copy activity to move the data.
> * Start a pipeline run.
> * Monitor the pipeline run.

## Prerequisites
### Azure subscription
Before you begin, if you don't already have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).

### Azure roles
To create data factory instances, the user account you use to log in to Azure must be assigned a *contributor* or *owner* role or must be an *administrator* of the Azure subscription. 

To view the permissions you have in the subscription, go to the Azure portal, select your username at the top-right corner, and then select **Permissions**. If you have access to multiple subscriptions, select the appropriate subscription. For sample instructions on adding a user to a role, see the [Add roles](../billing/billing-add-change-azure-subscription-administrator.md) article.

### SQL Server 2014, 2016, and 2017
In this tutorial, you use an on-premises SQL Server database as a *source* data store. The pipeline in the data factory you create in this tutorial copies data from this on-premises SQL Server database (source) to Azure Blob storage (sink). You then create a table named **emp** in your SQL Server database, and insert a couple of sample entries into the table. 

1. Start SQL Server Management Studio. If it is not already installed on your machine, go to [Download SQL Server Management Studio](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms). 

2. Connect to your SQL Server instance by using your credentials. 

3. Create a sample database. In the tree view, right-click **Databases**, and then select **New Database**. 
 
4. In the **New Database** window, enter a name for the database, and then select **OK**. 

5. To create the **emp** table and insert some sample data into it, run the following query script against the database:

   ```
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

6. In the tree view, right-click the database that you created, and then select **New Query**.

### Azure Storage account
In this tutorial, you use a general-purpose Azure storage account (specifically, Azure Blob storage) as a destination/sink data store. If you don't have a general-purpose Azure storage account, see [Create a storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account). The pipeline in the data factory you that create in this tutorial copies data from the on-premises SQL Server database (source) to this Azure Blob storage (sink). 

#### Get storage account name and account key
You use the name and key of your Azure storage account in this tutorial. Get the name and key of your storage account by doing the following: 

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure username and password. 

2. In the left pane, select **More services**, filter by using the **Storage** keyword, and then select **Storage accounts**.

    ![Search for storage account](media/tutorial-hybrid-copy-powershell/search-storage-account.png)

3. In the list of storage accounts, filter for your storage account (if needed), and then select your storage account. 

4. In the **Storage account** window, select **Access keys**.

    ![Get storage account name and key](media/tutorial-hybrid-copy-powershell/storage-account-name-key.png)

5. In the **Storage account name** and **key1** boxes, copy the values, and then paste them into Notepad or another editor for later use in the tutorial. 

#### Create the adftutorial container 
In this section, you create a blob container named **adftutorial** in your Azure Blob storage. 

1. In the **Storage account** window, switch to **Overview**, and then select **Blobs**. 

    ![Select Blobs option](media/tutorial-hybrid-copy-powershell/select-blobs.png)

2. In the **Blob service** window, select **Container**. 

    ![Add container button](media/tutorial-hybrid-copy-powershell/add-container-button.png)

3. In the **New container** window, in the **Name** box, enter **adftutorial**, and then select **OK**. 

    ![Enter container name](media/tutorial-hybrid-copy-powershell/new-container-dialog.png)

4. In the list of containers, select **adftutorial**.  

    ![Select the container](media/tutorial-hybrid-copy-powershell/seelct-adftutorial-container.png)

5. Keep the **container** window for **adftutorial** open. You use it verify the output at the end of the tutorial. Data Factory automatically creates the output folder in this container, so you don't need to create one.

    ![Container window](media/tutorial-hybrid-copy-powershell/container-page.png)


## Create a data factory
In this step, you create a data factory, and launch the Azure Data Factory UI to create a pipeline in the data factory. 

1. Click **New** on the left menu, click **Data + Analytics**, and click **Data Factory**. 
   
   ![New->DataFactory](./media/tutorial-copy-data-portal/new-azure-data-factory-menu.png)
2. In the **New data factory** page, enter **ADFTutorialDataFactory** for the **name**. 
      
     ![New data factory page](./media/tutorial-copy-data-portal/new-azure-data-factory.png)
 
   The name of the Azure data factory must be **globally unique**. If you see the following error for the name field, change the name of the data factory (for example, yournameADFTutorialDataFactory). See [Data Factory - Naming Rules](naming-rules.md) article for naming rules for Data Factory artifacts.
  
     ![New data factory page](./media/tutorial-copy-data-portal/name-not-available-error.png)
3. Select your Azure **subscription** in which you want to create the data factory. 
4. For the **Resource Group**, do one of the following steps:
     
      - Select **Use existing**, and select an existing resource group from the drop-down list. 
      - Select **Create new**, and enter the name of a resource group.   
         
        To learn about resource groups, see [Using resource groups to manage your Azure resources](../azure-resource-manager/resource-group-overview.md).  
4. Select **V2 (Preview)** for the **version**.
5. Select the **location** for the data factory. Only locations that are supported are displayed in the drop-down list. The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other regions.
6. Select **Pin to dashboard**.     
7. Click **Create**.      
8. On the dashboard, you see the following tile with status: **Deploying data factory**. 

	![deploying data factory tile](media/tutorial-copy-data-portal/deploying-data-factory.png)
9. After the creation is complete, you see the **Data Factory** page as shown in the image.
   
   ![Data factory home page](./media/tutorial-copy-data-portal/data-factory-home-page.png)
10. Click **Author & Monitor** tile to launch the Azure Data Factory UI in a separate tab. 

## Create a self-hosted integration runtime
In this section, you create a self-hosted integration runtime and associate it with an on-premises machine with the SQL Server database. The self-hosted integration runtime is the component that copies data from the SQL Server database on your machine to Azure Blob storage. 


    
## Create linked services
To link your data stores and compute services to the data factory, create linked services in the data factory. In this tutorial, you link your Azure storage account and on-premises SQL Server instance to the data store. The linked services have the connection information that the Data Factory service uses at runtime to connect to them. 

### Create an Azure Storage linked service (destination/sink)
In this step, you link your Azure storage account to the data factory.



### Create and encrypt a SQL Server linked service (source)
In this step, you link your on-premises SQL Server instance to the data factory.

> [!IMPORTANT]
> - Select the section that's based on the authentication you use to connect to your SQL Server instance.
> - Replace  **\<integration runtime name>** with the name of your integration runtime.
> - Before you save the file, replace **\<servername>**, **\<databasename>**, **\<username>**, and **\<password>** with the values of your SQL Server instance.
> - If you need to use a backslash (\\) in your user account or server name, precede it with the escape character (\\). For example, use *mydomain\\\\myuser*. 


## Create datasets
In this step, you create input and output datasets. They represent input and output data for the copy operation, which copies data from the on-premises SQL Server database to Azure Blob storage.

### Create a dataset for the source SQL Server database
In this step, you define a dataset that represents data in the SQL Server database instance. The dataset is of type SqlServerTable. It refers to the SQL Server linked service that you created in the preceding step. The linked service has the connection information that the Data Factory service uses to connect to your SQL Server instance at runtime. This dataset specifies the SQL table in the database that contains the data. In this tutorial, the **emp** table contains the source data. 

### Create a dataset for Azure Blob storage (sink)
In this step, you define a dataset that represents data that will be copied to Azure Blob storage. The dataset is of the type AzureBlob. It refers to the Azure Storage linked service that you created earlier in this tutorial. 

The linked service has the connection information that the data factory uses at runtime to connect to your Azure storage account. This dataset specifies the folder in the Azure storage to which the data is copied from the SQL Server database. In this tutorial, the folder is *adftutorial/fromonprem*, where `adftutorial` is the blob container and `fromonprem` is the folder. 



## Create a pipeline
In this tutorial, you create a pipeline with a copy activity. The copy activity uses SqlServerDataset as the input dataset and AzureBlobDataset as the output dataset. The source type is set to *SqlSource* and the sink type is set to *BlobSink*.

## Test run the pipeline 

## Verify the output
The pipeline automatically creates the output folder named *fromonprem* in the `adftutorial` blob container. Confirm that you see the *dbo.emp.txt* file in the output folder. 

1. In the Azure portal, in the **adftutorial** container window, select **Refresh** to see the output folder.

    ![Output folder created](media/tutorial-hybrid-copy-portal/fromonprem-folder.png)
2. Select `fromonprem` in the list of folders. 
3. Confirm that you see a file named `dbo.emp.txt`.

    ![Output file](media/tutorial-hybrid-copy-portal/fromonprem-file.png)


## Next steps
The pipeline in this sample copies data from one location to another in Azure Blob storage. You learned how to:

> [!div class="checklist"]
> * Create a data factory.
> * Create a self-hosted integration runtime.
> * Create SQL Server and Azure Storage linked services. 
> * Create SQL Server and Azure Blob datasets.
> * Create a pipeline with a copy activity to move the data.
> * Start a pipeline run.
> * Monitor the pipeline run.

For a list of data stores that are supported by Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).

To learn about copying data in bulk from a source to a destination, advance to the following tutorial:

> [!div class="nextstepaction"]
>[Copy data in bulk](tutorial-bulk-copy-portal.md)
