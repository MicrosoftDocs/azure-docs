---
title: Load terabytes of data into SQL Data Warehouse
description: Demonstrates how 1 TB of data can be loaded into Azure SQL Data Warehouse under 15 minutes with Azure Data Factory
services: data-factory
documentationcenter: ''
author: linda33wj
manager: shwang


ms.assetid: a6c133c0-ced2-463c-86f0-a07b00c9e37f
ms.service: data-factory
ms.workload: data-services


ms.topic: conceptual
ms.date: 01/10/2018
ms.author: jingwang

robots: noindex
---
# Load 1 TB into Azure SQL Data Warehouse under 15 minutes with Data Factory
> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [Copy data to or from Azure SQL Data Warehouse by using Data Factory](../connector-azure-sql-data-warehouse.md).


[Azure SQL Data Warehouse](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) is a cloud-based, scale-out database capable of processing massive volumes of data, both relational and non-relational.  Built on massively parallel processing (MPP) architecture, SQL Data Warehouse is optimized for enterprise data warehouse workloads.  It offers cloud elasticity with the flexibility to scale storage and compute independently.

Getting started with Azure SQL Data Warehouse is now easier than ever using **Azure Data Factory**.  Azure Data Factory is a fully managed cloud-based data integration service, which can be used to populate a SQL Data Warehouse with the data from your existing system, and saving you valuable time while evaluating SQL Data Warehouse and building your analytics solutions. Here are the key benefits of loading data into Azure SQL Data Warehouse using Azure Data Factory:

* **Easy to set up**: 5-step intuitive wizard with no scripting required.
* **Rich data store support**: built-in support for a rich set of on-premises and cloud-based data stores.
* **Secure and compliant**: data is transferred over HTTPS or ExpressRoute, and global service presence ensures your data never leaves the geographical boundary
* **Unparalleled performance by using PolyBase** – Using Polybase is the most efficient way to move data into Azure SQL Data Warehouse. Using the staging blob feature, you can achieve high load speeds from all types of data stores besides Azure Blob storage, which the Polybase supports by default.

This article shows you how to use Data Factory Copy Wizard to load 1-TB data from Azure Blob Storage into Azure SQL Data Warehouse in under 15 minutes, at over 1.2 GBps throughput.

This article provides step-by-step instructions for moving data into Azure SQL Data Warehouse by using the Copy Wizard.

> [!NOTE]
>  For general information about capabilities of Data Factory in moving data to/from Azure SQL Data Warehouse, see [Move data to and from Azure SQL Data Warehouse using Azure Data Factory](data-factory-azure-sql-data-warehouse-connector.md) article.
>
> You can also build pipelines using Visual Studio, PowerShell, etc. See [Tutorial: Copy data from Azure Blob to Azure SQL Database](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for a quick walkthrough with step-by-step instructions for using the Copy Activity in Azure Data Factory.  
>
>

## Prerequisites
* Azure Blob Storage: this experiment uses Azure Blob Storage (GRS) for storing TPC-H testing dataset.  If you do not have an Azure storage account, learn [how to create a storage account](../../storage/common/storage-account-create.md).
* [TPC-H](http://www.tpc.org/tpch/) data: we are going to use TPC-H as the testing dataset.  To do that, you need to use `dbgen` from TPC-H toolkit, which helps you generate the dataset.  You can either download source code for `dbgen` from [TPC Tools](http://www.tpc.org/tpc_documents_current_versions/current_specifications.asp) and compile it yourself, or download the compiled binary from [GitHub](https://github.com/Azure/Azure-DataFactory/tree/master/SamplesV1/TPCHTools).  Run dbgen.exe with the following commands to generate 1 TB flat file for `lineitem` table spread across 10 files:

  * `Dbgen -s 1000 -S **1** -C 10 -T L -v`
  * `Dbgen -s 1000 -S **2** -C 10 -T L -v`
  * …
  * `Dbgen -s 1000 -S **10** -C 10 -T L -v`

    Now copy the generated files to Azure Blob.  Refer to [Move data to and from an on-premises file system by using Azure Data Factory](data-factory-onprem-file-system-connector.md) for how to do that using ADF Copy.    
* Azure SQL Data Warehouse: this experiment loads data into Azure SQL Data Warehouse created with 6,000 DWUs

    Refer to [Create an Azure SQL Data Warehouse](../../sql-data-warehouse/sql-data-warehouse-get-started-provision.md) for detailed instructions on how to create a SQL Data Warehouse database.  To get the best possible load performance into SQL Data Warehouse using Polybase, we choose maximum number of Data Warehouse Units (DWUs) allowed in the Performance setting, which is 6,000 DWUs.

  > [!NOTE]
  > When loading from Azure Blob, the data loading performance is directly proportional to the number of DWUs you configure on the SQL Data Warehouse:
  >
  > Loading 1 TB into 1,000 DWU SQL Data Warehouse takes 87 minutes (~200 MBps throughput)
  > Loading 1 TB into 2,000 DWU SQL Data Warehouse takes 46 minutes (~380 MBps throughput)
  > Loading 1 TB into 6,000 DWU SQL Data Warehouse takes 14 minutes (~1.2 GBps throughput)
  >
  >

    To create a SQL Data Warehouse with 6,000 DWUs, move the Performance slider all the way to the right:

    ![Performance slider](media/data-factory-load-sql-data-warehouse/performance-slider.png)

    For an existing database that is not configured with 6,000 DWUs, you can scale it up using Azure portal.  Navigate to the database in Azure portal, and there is a **Scale** button in the **Overview** panel shown in the following image:

    ![Scale button](media/data-factory-load-sql-data-warehouse/scale-button.png)    

    Click the **Scale** button to open the following panel, move the slider to the maximum value, and click **Save** button.

    ![Scale dialog](media/data-factory-load-sql-data-warehouse/scale-dialog.png)

    This experiment loads data into Azure SQL Data Warehouse using `xlargerc` resource class.

    To achieve best possible throughput, copy needs to be performed using a SQL Data Warehouse user belonging to `xlargerc` resource class.  Learn how to do that by following [Change a user resource class example](../../sql-data-warehouse/sql-data-warehouse-develop-concurrency.md).  
* Create destination table schema in Azure SQL Data Warehouse database, by running the following DDL statement:

    ```SQL  
    CREATE TABLE [dbo].[lineitem]
    (
        [L_ORDERKEY] [bigint] NOT NULL,
        [L_PARTKEY] [bigint] NOT NULL,
        [L_SUPPKEY] [bigint] NOT NULL,
        [L_LINENUMBER] [int] NOT NULL,
        [L_QUANTITY] [decimal](15, 2) NULL,
        [L_EXTENDEDPRICE] [decimal](15, 2) NULL,
        [L_DISCOUNT] [decimal](15, 2) NULL,
        [L_TAX] [decimal](15, 2) NULL,
        [L_RETURNFLAG] [char](1) NULL,
        [L_LINESTATUS] [char](1) NULL,
        [L_SHIPDATE] [date] NULL,
        [L_COMMITDATE] [date] NULL,
        [L_RECEIPTDATE] [date] NULL,
        [L_SHIPINSTRUCT] [char](25) NULL,
        [L_SHIPMODE] [char](10) NULL,
        [L_COMMENT] [varchar](44) NULL
    )
    WITH
    (
        DISTRIBUTION = ROUND_ROBIN,
        CLUSTERED COLUMNSTORE INDEX
    )
    ```
  With the prerequisite steps completed, we are now ready to configure the copy activity using the Copy Wizard.

## Launch Copy Wizard
1. Log in to the [Azure portal](https://portal.azure.com).
2. Click **Create a resource** from the top-left corner, click **Intelligence + analytics**, and click **Data Factory**.
3. In the **New data factory** pane:

   1. Enter **LoadIntoSQLDWDataFactory** for the **name**.
       The name of the Azure data factory must be globally unique. If you receive the error: **Data factory name "LoadIntoSQLDWDataFactory" is not available**, change the name of the data factory (for example, yournameLoadIntoSQLDWDataFactory) and try creating again. See [Data Factory - Naming Rules](data-factory-naming-rules.md) topic for naming rules for Data Factory artifacts.  
   2. Select your Azure **subscription**.
   3. For Resource Group, do one of the following steps:
      1. Select **Use existing** to select an existing resource group.
      2. Select **Create new** to enter a name for a resource group.
   4. Select a **location** for the data factory.
   5. Select **Pin to dashboard** check box at the bottom of the blade.  
   6. Click **Create**.
4. After the creation is complete, you see the **Data Factory** blade as shown in the following image:

   ![Data factory home page](media/data-factory-load-sql-data-warehouse/data-factory-home-page-copy-data.png)
5. On the Data Factory home page, click the **Copy data** tile to launch **Copy Wizard**.

   > [!NOTE]
   > If you see that the web browser is stuck at "Authorizing...", disable/uncheck **Block third party cookies and site data** setting (or) keep it enabled and create an exception for **login.microsoftonline.com** and then try launching the wizard again.
   >
   >

## Step 1: Configure data loading schedule
The first step is to configure the data loading schedule.  

In the **Properties** page:

1. Enter **CopyFromBlobToAzureSqlDataWarehouse** for **Task name**
2. Select **Run once now** option.   
3. Click **Next**.  

    ![Copy Wizard - Properties page](media/data-factory-load-sql-data-warehouse/copy-wizard-properties-page.png)

## Step 2: Configure source
This section shows you the steps to configure the source: Azure Blob containing the 1-TB TPC-H line item files.

1. Select the **Azure Blob Storage** as the data store and click **Next**.

    ![Copy Wizard - Select source page](media/data-factory-load-sql-data-warehouse/select-source-connection.png)

2. Fill in the connection information for the Azure Blob storage account, and click **Next**.

    ![Copy Wizard - Source connection information](media/data-factory-load-sql-data-warehouse/source-connection-info.png)

3. Choose the **folder** containing the TPC-H line item files and click **Next**.

    ![Copy Wizard - select input folder](media/data-factory-load-sql-data-warehouse/select-input-folder.png)

4. Upon clicking **Next**, the file format settings are detected automatically.  Check to make sure that column delimiter is '|' instead of the default comma ','.  Click **Next** after you have previewed the data.

    ![Copy Wizard - file format settings](media/data-factory-load-sql-data-warehouse/file-format-settings.png)

## Step 3: Configure destination
This section shows you how to configure the destination: `lineitem` table in the Azure SQL Data Warehouse database.

1. Choose **Azure SQL Data Warehouse** as the destination store and click **Next**.

    ![Copy Wizard - select destination data store](media/data-factory-load-sql-data-warehouse/select-destination-data-store.png)

2. Fill in the connection information for Azure SQL Data Warehouse.  Make sure you specify the user that is a member of the role `xlargerc` (see the **prerequisites** section for detailed instructions), and click **Next**.

    ![Copy Wizard - destination connection info](media/data-factory-load-sql-data-warehouse/destination-connection-info.png)

3. Choose the destination table and click **Next**.

    ![Copy Wizard - table mapping page](media/data-factory-load-sql-data-warehouse/table-mapping-page.png)

4. In Schema mapping page, leave "Apply column mapping" option unchecked and click **Next**.

## Step 4: Performance settings

**Allow polybase** is checked by default.  Click **Next**.

![Copy Wizard - schema mapping page](media/data-factory-load-sql-data-warehouse/performance-settings-page.png)

## Step 5: Deploy and monitor load results
1. Click **Finish** button to deploy.

    ![Copy Wizard - summary page](media/data-factory-load-sql-data-warehouse/summary-page.png)

2. After the deployment is complete, click `Click here to monitor copy pipeline` to monitor the copy run progress. Select the copy pipeline you created in the **Activity Windows** list.

    ![Copy Wizard - summary page](media/data-factory-load-sql-data-warehouse/select-pipeline-monitor-manage-app.png)

    You can view the copy run details in the **Activity Window Explorer** in the right panel, including the data volume read from source and written into destination, duration, and the average throughput for the run.

    As you can see from the following screenshot, copying 1 TB from Azure Blob Storage into SQL Data Warehouse took 14 minutes, effectively achieving 1.22 GBps throughput!

    ![Copy Wizard - succeeded dialog](media/data-factory-load-sql-data-warehouse/succeeded-info.png)

## Best practices
Here are a few best practices for running your Azure SQL Data Warehouse database:

* Use a larger resource class when loading into a CLUSTERED COLUMNSTORE INDEX.
* For more efficient joins, consider using hash distribution by a select column instead of default round robin distribution.
* For faster load speeds, consider using heap for transient data.
* Create statistics after you finish loading Azure SQL Data Warehouse.

See [Best practices for Azure SQL Data Warehouse](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-best-practices.md) for details.

## Next steps
* [Data Factory Copy Wizard](data-factory-copy-wizard.md) - This article provides details about the Copy Wizard.
* [Copy Activity performance and tuning guide](data-factory-copy-activity-performance.md) - This article contains the reference performance measurements and tuning guide.
