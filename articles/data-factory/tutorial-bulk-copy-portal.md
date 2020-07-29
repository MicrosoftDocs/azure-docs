---
title: Copy data in bulk using Azure portal
description: Learn how to use Azure Data Factory and Copy Activity to copy data from a source data store to a destination data store in bulk.
services: data-factory
ms.author: jingwang
author: linda33wj
manager: shwang
ms.reviewer: douglasl
ms.service: data-factory
ms.workload: data-services 
ms.topic: tutorial
ms.custom: seo-lt-2019; seo-dt-2019
ms.date: 06/08/2020
---

# Copy multiple tables in bulk by using Azure Data Factory in the Azure portal

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This tutorial demonstrates **copying a number of tables from Azure SQL Database to Azure Synapse Analytics (formerly SQL DW)**. You can apply the same pattern in other copy scenarios as well. For example, copying tables from SQL Server/Oracle to Azure SQL Database/Azure Synapse Analytics (formerly SQL DW)/Azure Blob, copying different paths from Blob to Azure SQL Database tables.

> [!NOTE]
> - If you are new to Azure Data Factory, see [Introduction to Azure Data Factory](introduction.md).

At a high level, this tutorial involves following steps:

> [!div class="checklist"]
> * Create a data factory.
> * Create Azure SQL Database, Azure Synapse Analytics (formerly SQL DW), and Azure Storage linked services.
> * Create Azure SQL Database and Azure Synapse Analytics (formerly SQL DW) datasets.
> * Create a pipeline to look up the tables to be copied and another pipeline to perform the actual copy operation. 
> * Start a pipeline run.
> * Monitor the pipeline and activity runs.

This tutorial uses Azure portal. To learn about using other tools/SDKs to create a data factory, see [Quickstarts](quickstart-create-data-factory-dot-net.md). 

## End-to-end workflow
In this scenario, you have a number of tables in Azure SQL Database that you want to copy to Azure Synapse Analytics (formerly SQL DW). Here is the logical sequence of steps in the workflow that happens in pipelines:

![Workflow](media/tutorial-bulk-copy-portal/tutorial-copy-multiple-tables.png)

* The first pipeline looks up the list of tables that needs to be copied over to the sink data stores.  Alternatively you can maintain a metadata table that lists all the tables to be copied to the sink data store. Then, the pipeline triggers another pipeline, which iterates over each table in the database and performs the data copy operation.
* The second pipeline performs the actual copy. It takes the list of tables as a parameter. For each table in the list, copy the specific table in Azure SQL Database to the corresponding table in Azure Synapse Analytics (formerly SQL DW) using [staged copy via Blob storage and PolyBase](connector-azure-sql-data-warehouse.md#use-polybase-to-load-data-into-azure-sql-data-warehouse) for best performance. In this example, the first pipeline passes the list of tables as a value for the parameter. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites
* **Azure Storage account**. The Azure Storage account is used as staging blob storage in the bulk copy operation. 
* **Azure SQL Database**. This database contains the source data. 
* **Azure Synapse Analytics (formerly SQL DW)**. This data warehouse holds the data copied over from the SQL Database. 

### Prepare SQL Database and Azure Synapse Analytics (formerly SQL DW)

**Prepare the source Azure SQL Database**:

Create an Azure SQL Database with Adventure Works LT sample data following [Create an Azure SQL database](../azure-sql/database/single-database-create-quickstart.md) article. This tutorial copies all the tables from this sample database to an Azure Synapse Analytics (formerly SQL DW).

**Prepare the sink Azure Synapse Analytics (formerly SQL DW)**:

1. If you don't have an Azure Synapse Analytics (formerly SQL DW), see the [Create a SQL Data Warehouse](../sql-data-warehouse/sql-data-warehouse-get-started-tutorial.md) article for steps to create one.

1. Create corresponding table schemas in Azure Synapse Analytics (formerly SQL DW). You use Azure Data Factory to migrate/copy data in a later step.

## Azure services to access SQL server

For both SQL Database and Azure Synapse Analytics (formerly SQL DW), allow Azure services to access SQL server. Ensure that **Allow Azure services and resources to access this server** setting is turned **ON** for your server. This setting allows the Data Factory service to read data from your Azure SQL Database and write data to your Azure Synapse Analytics (formerly SQL DW). 

To verify and turn on this setting, go to your server > Security > Firewalls and virtual networks > set the **Allow Azure services and resources to access this server** to **ON**.

## Create a data factory

1. Launch **Microsoft Edge** or **Google Chrome** web browser. Currently, Data Factory UI is supported only in Microsoft Edge and Google Chrome web browsers.
1. Go to the [Azure portal](https://portal.azure.com). 
1. On the left of the Azure portal menu, select **Create a resource** > **Analytics** > **Data Factory**. 
   ![Data Factory selection in the "New" pane](./media/doc-common-process/new-azure-data-factory-menu.png)
1. On the **New data factory** page, enter **ADFTutorialBulkCopyDF** for **name**. 
 
   The name of the Azure data factory must be **globally unique**. If you see the following error for the name field, change the name of the data factory (for example, yournameADFTutorialBulkCopyDF). See [Data Factory - Naming Rules](naming-rules.md) article for naming rules for Data Factory artifacts.
  
       `Data factory name "ADFTutorialBulkCopyDF" is not available`
1. Select your Azure **subscription** in which you want to create the data factory. 
1. For the **Resource Group**, do one of the following steps:
     
   - Select **Use existing**, and select an existing resource group from the drop-down list. 
   - Select **Create new**, and enter the name of a resource group.   
         
     To learn about resource groups, see [Using resource groups to manage your Azure resources](../azure-resource-manager/management/overview.md).  
1. Select **V2** for the **version**.
1. Select the **location** for the data factory. For a list of Azure regions in which Data Factory is currently available, select the regions that interest you on the following page, and then expand **Analytics** to locate **Data Factory**: [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other regions.
1. Click **Create**.
1. After the creation is complete, select **Go to resource** to navigate to the **Data Factory** page. 
   
1. Click **Author & Monitor** tile to launch the Data Factory UI application in a separate tab.
1. On the **Let's get started** page, switch to the **Author** tab in the left panel as shown in the following image:

     ![Get started page](./media/doc-common-process/get-started-page-author-button.png)

## Create linked services
You create linked services to link your data stores and computes to a data factory. A linked service has the connection information that the Data Factory service uses to connect to the data store at runtime. 

In this tutorial, you link your Azure SQL Database, Azure Synapse Analytics (formerly SQL DW), and Azure Blob Storage data stores to your data factory. The Azure SQL Database is the source data store. The Azure Synapse Analytics (formerly SQL DW) is the sink/destination data store. The Azure Blob Storage is to stage the data before the data is loaded into Azure Synapse Analytics (formerly SQL DW) by using PolyBase. 

### Create the source Azure SQL Database linked service
In this step, you create a linked service to link your Azure SQL database to the data factory. 

1. Open [Manage tab](https://docs.microsoft.com/azure/data-factory/author-management-hub) from the left pane.

1. On the Linked services page, select **+New** to create a new linked service.

   ![New linked service](./media/doc-common-process/new-linked-service.png)
1. In the **New Linked Service** window, select **Azure SQL Database**, and click **Continue**. 
1. In the **New Linked Service (Azure SQL Database)** window, do the following steps: 

    a. Enter **AzureSqlDatabaseLinkedService** for **Name**.

    b. Select your server for **Server name**
    
    c. Select your Azure SQL database for **Database name**. 
    
    d. Enter **name of the user** to connect to Azure SQL database. 
    
    e. Enter **password** for the user. 

    f. To test the connection to Azure SQL database using the specified information, click **Test connection**.
  
    g. Click **Create** to save the linked service.


### Create the sink Azure Synapse Analytics (formerly SQL DW) linked service

1. In the **Connections** tab, click **+ New** on the toolbar again. 
1. In the **New Linked Service** window, select **Azure Synapse Analytics (formerly SQL DW)**, and click **Continue**. 
1. In the **New Linked Service (Azure Synapse Analytics (formerly SQL DW))** window, do the following steps: 
   
    a. Enter **AzureSqlDWLinkedService** for **Name**.
     
    b. Select your server for **Server name**
     
    c. Select your Azure SQL database for **Database name**. 
     
    d. Enter **User name** to connect to Azure SQL database. 
     
    e. Enter **Password** for the user. 
     
    f. To test the connection to Azure SQL database using the specified information, click **Test connection**.
     
    g. Click **Create**.

### Create the staging Azure Storage linked service
In this tutorial, you use Azure Blob storage as an interim staging area to enable PolyBase for a better copy performance.

1. In the **Connections** tab, click **+ New** on the toolbar again. 
1. In the **New Linked Service** window, select **Azure Blob Storage**, and click **Continue**. 
1. In the **New Linked Service (Azure Blob Storage)** window, do the following steps: 

    a. Enter **AzureStorageLinkedService** for **Name**.                                                 
    b. Select your **Azure Storage account** for **Storage account name**.
    
    c. Click **Create**.

## Create datasets
In this tutorial, you create source and sink datasets, which specify the location where the data is stored. 

The input dataset **AzureSqlDatabaseDataset** refers to the **AzureSqlDatabaseLinkedService**. The linked service specifies the connection string to connect to the database. The dataset specifies the name of the database and the table that contains the source data. 

The output dataset **AzureSqlDWDataset** refers to the **AzureSqlDWLinkedService**. The linked service specifies the connection string to connect to the Azure Synapse Analytics (formerly SQL DW). The dataset specifies the database and the table to which the data is copied. 

In this tutorial, the source and destination SQL tables are not hard-coded in the dataset definitions. Instead, the ForEach activity passes the name of the table at runtime to the Copy activity. 

### Create a dataset for source SQL Database

1. Click **+ (plus)** in the left pane, and then click **Dataset**. 

    ![New dataset menu](./media/tutorial-bulk-copy-portal/new-dataset-menu.png)
1. In the **New Dataset** window, select **Azure SQL Database**, and then click **Continue**. 
    
1. In the **Set properties** window, under **Name**, enter **AzureSqlDatabaseDataset**. Under **Linked service**, select **AzureSqlDatabaseLinkedService**. Then click **OK**.

1. Switch to the **Connection** tab, select any table for **Table**. This table is a dummy table. You specify a query on the source dataset when creating a pipeline. The query is used to extract data from the Azure SQL database. Alternatively, you can click **Edit** check box, and enter **dbo.dummyName** as the table name. 
 

### Create a dataset for sink Azure Synapse Analytics (formerly SQL DW)

1. Click **+ (plus)** in the left pane, and click **Dataset**. 
1. In the **New Dataset** window, select **Azure Synapse Analytics (formerly SQL DW)**, and then click **Continue**.
1. In the **Set properties** window, under **Name**, enter **AzureSqlDWDataset**. Under **Linked service**, select **AzureSqlDWLinkedService**. Then click **OK**.
1. Switch to the **Parameters** tab, click **+ New**, and enter **DWTableName** for the parameter name. If you copy/paste this name from the page, ensure that there's no **trailing space character** at the end of **DWTableName**.
1. Switch to the **Connection** tab, 

    a. For **Table**, check the **Edit** option. Enter **dbo** in the first table name input box. And then select into the second input box and click the **Add dynamic content** link below. 

    ![Dataset connection tablename](./media/tutorial-bulk-copy-portal/dataset-connection-tablename.png)

    b. In the **Add Dynamic Content** page, click the **DWTAbleName** under **Parameters**, which will automatically populate the top expression text box `@dataset().DWTableName`, then click **Finish**. The **tableName** property of the dataset is set to the value that's passed as an argument for the **DWTableName** parameter. The ForEach activity iterates through a list of tables, and passes one by one to the Copy activity. 

    ![Dataset parameter builder](./media/tutorial-bulk-copy-portal/dataset-parameter-builder.png)
 
## Create pipelines
In this tutorial, you create two pipelines: **IterateAndCopySQLTables** and **GetTableListAndTriggerCopyData**. 

The **GetTableListAndTriggerCopyData** pipeline performs two actions:

* Looks up the Azure SQL Database system table to get the list of tables to be copied.
* Triggers the pipeline **IterateAndCopySQLTables** to do the actual data copy.

The  **IterateAndCopySQLTables** pipeline takes a list of tables as a parameter. For each table in the list, it copies data from the table in Azure SQL Database to Azure Synapse Analytics (formerly SQL DW) using staged copy and PolyBase.

### Create the pipeline IterateAndCopySQLTables

1. In the left pane, click **+ (plus)**, and click **Pipeline**.

    ![New pipeline menu](./media/tutorial-bulk-copy-portal/new-pipeline-menu.png)
 
1. In the General panel under **Properties**, specify **IterateAndCopySQLTables** for **Name**. Then collapse the panel by clicking the Properties icon in the top-right corner.

1. Switch to the **Parameters** tab, and do the following actions: 

    a. Click **+ New**. 
    
    b. Enter **tableList** for the parameter **Name**.
    
    c. Select **Array** for **Type**.

1. In the **Activities** toolbox, expand **Iteration & Conditions**, and drag-drop the **ForEach** activity to the pipeline design surface. You can also search for activities in the **Activities** toolbox. 

    a. In the **General** tab at the bottom, enter **IterateSQLTables** for **Name**. 

    b. Switch to the **Settings** tab, click the input box for **Items**, then click the **Add dynamic content** link below. 

    c. In the **Add Dynamic Content** page, collapse the **System Variables** and **Functions** sections, click the **tableList** under **Parameters**, which will automatically populate the top expression text box as `@pipeline().parameter.tableList`. Then click **Finish**. 

    ![Foreach parameter builder](./media/tutorial-bulk-copy-portal/for-each-parameter-builder.png)
    
    d. Switch to **Activities** tab, click the **pencil icon** to add a child activity to the **ForEach** activity.
    ![Foreach activity builder](./media/tutorial-bulk-copy-portal/for-each-activity-builder.png)

1. In the **Activities** toolbox, expand **Move & Transfer**, and drag-drop **Copy data** activity into the pipeline designer surface. Notice the breadcrumb menu at the top. The **IterateAndCopySQLTable** is the pipeline name and **IterateSQLTables** is the ForEach activity name. The designer is in the activity scope. To switch back to the pipeline editor from the ForEach editor, you can click the link in the breadcrumb menu. 

    ![Copy in ForEach](./media/tutorial-bulk-copy-portal/copy-in-for-each.png)

1. Switch to the **Source** tab, and do the following steps:

    1. Select **AzureSqlDatabaseDataset** for **Source Dataset**. 
    1. Select **Query** option for **Use query**. 
    1. Click the **Query** input box -> select the **Add dynamic content** below -> enter the following expression for **Query** -> select **Finish**.

        ```sql
        SELECT * FROM [@{item().TABLE_SCHEMA}].[@{item().TABLE_NAME}]
        ``` 


1. Switch to the **Sink** tab, and do the following steps: 

    1. Select **AzureSqlDWDataset** for **Sink Dataset**.
    1. Click the input box for the VALUE of DWTableName parameter -> select the **Add dynamic content** below, enter `[@{item().TABLE_SCHEMA}].[@{item().TABLE_NAME}]` expression as script, -> select **Finish**.
    1. For Copy method, select **PolyBase**. 
    1. Clear the **Use type default** option. 
    1. Click the **Pre-copy Script** input box -> select the **Add dynamic content** below -> enter the following expression as script -> select **Finish**. 

        ```sql
        TRUNCATE TABLE [@{item().TABLE_SCHEMA}].[@{item().TABLE_NAME}]
        ```

        ![Copy sink settings](./media/tutorial-bulk-copy-portal/copy-sink-settings.png)
1. Switch to the **Settings** tab, and do the following steps: 

    1. Select the checkbox for **Enable Staging**.
    1. Select **AzureStorageLinkedService** for **Store Account Linked Service**.

1. To validate the pipeline settings, click **Validate** on the top pipeline tool bar. Make sure that there's no validation error. To close the **Pipeline Validation Report**, click **>>**.

### Create the pipeline GetTableListAndTriggerCopyData

This pipeline does two actions:

* Looks up the Azure SQL Database system table to get the list of tables to be copied.
* Triggers the pipeline "IterateAndCopySQLTables" to do the actual data copy.

1. In the left pane, click **+ (plus)**, and click **Pipeline**.
1. In the **General** tab, change the name of the pipeline to **GetTableListAndTriggerCopyData**. 

1. In the **Activities** toolbox, expand **General**, and drag-drop **Lookup** activity to the pipeline designer surface, and do the following steps:

    1. Enter **LookupTableList** for **Name**. 
    1. Enter **Retrieve the table list from Azure SQL database** for **Description**.

1. Switch to the **Settings** tab, and do the following steps:

    1. Select **AzureSqlDatabaseDataset** for **Source Dataset**. 
    1. Select **Query** for **Use query**. 
    1. Enter the following SQL query for **Query**.

        ```sql
        SELECT TABLE_SCHEMA, TABLE_NAME FROM information_schema.TABLES WHERE TABLE_TYPE = 'BASE TABLE' and TABLE_SCHEMA = 'SalesLT' and TABLE_NAME <> 'ProductModel'
        ```
    1. Clear the checkbox for the **First row only** field.

        ![Lookup activity - settings page](./media/tutorial-bulk-copy-portal/lookup-settings-page.png)
1. Drag-drop **Execute Pipeline** activity from the Activities toolbox to the pipeline designer surface, and set the name to **TriggerCopy**.

1. To **Connect** the **Lookup** activity to the **Execute Pipeline** activity, drag the **green box** attached to the Lookup activity to the left of Execute Pipeline activity.

    ![Connect Lookup and Execute Pipeline activities](./media/tutorial-bulk-copy-portal/connect-lookup-execute-pipeline.png)

1. Switch to the **Settings** tab of **Execute Pipeline** activity, and do the following steps: 

    1. Select **IterateAndCopySQLTables** for **Invoked pipeline**. 
    1. Expand the **Advanced** section, and clear the checkbox for **Wait on completion**.
    1. Click **+ New** in the **Parameters** section. 
    1. Enter **tableList** for parameter **Name**.
    1. Click VALUE input box -> select the **Add dynamic content** below -> enter `@activity('LookupTableList').output.value` as table name value -> select **Finish**. You're setting the result list from the Lookup activity as an input to the second pipeline. The result list contains the list of tables whose data needs to be copied to the destination. 

        ![Execute pipeline activity - settings page](./media/tutorial-bulk-copy-portal/execute-pipeline-settings-page.png)

1. To validate the pipeline, click **Validate** on the toolbar. Confirm that there are no validation errors. To close the **Pipeline Validation Report**, click **>>**.

1. To publish entities (datasets, pipelines, etc.) to the Data Factory service, click **Publish all** on top of the window. Wait until the publishing succeeds. 

## Trigger a pipeline run

1. Go to pipeline **GetTableListAndTriggerCopyData**, click **Add Trigger** on the top pipeline tool bar, and then click **Trigger now**. 

1. Confirm the run on the **Pipeline run** page, and then select **Finish**.

## Monitor the pipeline run

1. Switch to the **Monitor** tab. Click **Refresh** until you see runs for both the pipelines in your solution. Continue refreshing the list until you see the **Succeeded** status. 

1. To view activity runs associated with the **GetTableListAndTriggerCopyData** pipeline, click the pipeline name link for the pipeline. You should see two activity runs for this pipeline run. 
    ![Monitor Pipeline run](./media/tutorial-bulk-copy-portal/monitor-pipeline.png)
1. To view the output of the **Lookup** activity, click the **Output** link next to the activity under the **ACTIVITY NAME** column. You can maximize and restore the **Output** window. After reviewing, click **X** to close the **Output** window.

    ```json
    {
        "count": 9,
        "value": [
            {
                "TABLE_SCHEMA": "SalesLT",
                "TABLE_NAME": "Customer"
            },
            {
                "TABLE_SCHEMA": "SalesLT",
                "TABLE_NAME": "ProductDescription"
            },
            {
                "TABLE_SCHEMA": "SalesLT",
                "TABLE_NAME": "Product"
            },
            {
                "TABLE_SCHEMA": "SalesLT",
                "TABLE_NAME": "ProductModelProductDescription"
            },
            {
                "TABLE_SCHEMA": "SalesLT",
                "TABLE_NAME": "ProductCategory"
            },
            {
                "TABLE_SCHEMA": "SalesLT",
                "TABLE_NAME": "Address"
            },
            {
                "TABLE_SCHEMA": "SalesLT",
                "TABLE_NAME": "CustomerAddress"
            },
            {
                "TABLE_SCHEMA": "SalesLT",
                "TABLE_NAME": "SalesOrderDetail"
            },
            {
                "TABLE_SCHEMA": "SalesLT",
                "TABLE_NAME": "SalesOrderHeader"
            }
        ],
        "effectiveIntegrationRuntime": "DefaultIntegrationRuntime (East US)",
        "effectiveIntegrationRuntimes": [
            {
                "name": "DefaultIntegrationRuntime",
                "type": "Managed",
                "location": "East US",
                "billedDuration": 0,
                "nodes": null
            }
        ]
    }
    ```    
1. To switch back to the **Pipeline Runs** view, click **All Pipeline runs** link at the top of the breadcrumb menu. Click **IterateAndCopySQLTables** link (under **PIPELINE NAME** column) to view activity runs of the pipeline. Notice that there's one **Copy** activity run for each table in the **Lookup** activity output. 

1. Confirm that the data was copied to the target Azure Synapse Analytics (formerly SQL DW) you used in this tutorial. 

## Next steps
You performed the following steps in this tutorial: 

> [!div class="checklist"]
> * Create a data factory.
> * Create Azure SQL Database, Azure Synapse Analytics (formerly SQL DW), and Azure Storage linked services.
> * Create Azure SQL Database and Azure Synapse Analytics (formerly SQL DW) datasets.
> * Create a  pipeline to look up the tables to be copied and another pipeline to perform the actual copy operation. 
> * Start a pipeline run.
> * Monitor the pipeline and activity runs.

Advance to the following tutorial to learn about copy data incrementally from a source to a destination:
> [!div class="nextstepaction"]
>[Copy data incrementally](tutorial-incremental-copy-portal.md)
