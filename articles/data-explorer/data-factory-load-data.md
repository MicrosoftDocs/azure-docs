---
title: 'Load data into Azure Data Explorer by using Azure Data Factory'
description: 'In this topic, you learn to ingest (load) data into Azure Data Explorer by using Azure Data Factory'
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: jasonh
ms.service: data-explorer
ms.topic: conceptual
ms.date: 03/31/2019

#Customer intent: I want to use Azure Data Factory to load data into Azure Data Explorer so that I can analyze it later.
---

# Load data into Azure Data Explorer by using Azure Data Factory

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from many sources such as applications, websites, and IoT devices. Iteratively explore data and identify patterns and anomalies to improve products, enhance customer experiences, monitor devices, and boost operations. Explore new questions and get answers in minutes. Azure Data Factory is a fully managed cloud-based data integration service. You can use the service to populate your Azure Data Explorer database with data from your existing system and save time when building your analytics solutions.

Azure Data Factory offers the following benefits for loading data into Azure Data Explorer:

* **Easy to set up**: An intuitive 5-step wizard with no scripting required.
* **Rich data store support**: Built-in support for a rich set of on-premises and cloud-based data stores. For a detailed list, see the table of [Supported data stores](/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats).
* **Secure and compliant**: Data is transferred over HTTPS or ExpressRoute. The global service presence ensures that your data never leaves the geographical boundary.
* **High performance**: Up to 1-GB/s data loading speed into Azure Data Explorer. For details, see [Copy activity performance](/azure/data-factory/copy-activity-performance).

This article shows you how to use the Data Factory Copy Data tool to load data from Amazon S3 into Azure Data Explorer. You can follow similar steps to copy data from other types of data stores.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* [An Azure Data Explorer cluster and database](create-cluster-database-portal.md)
* Amazon S3.

## Create a data factory

1. Select the **Create a resource** button (+) in the upper-left corner of the portal > **Analytics** > **Data Factory**.

   ![Create a new data factory](media/data-factory-load-data/select-adf.png)

1. In the **New data factory** pane, provide values for the following fields and then Select **Create**.

    ![New data factory page](media/data-factory-load-data/new-data-factory.png)

    **Setting**  | **Field description**
    |---|---|
    | **Name** | Enter a globally unique name for your data factory. If you receive the error *"Data factory name \"LoadADXDemo\" is not available"*, enter a different name for the data factory. For naming rules of Data Factory artifacts, see [Data Factory naming rules](/azure/data-factory/naming-rules).|
    | **Subscription** | Select your Azure subscription in which to create the data factory. |
    | **Resource Group** | Select **Create new** and enter the name of a new resource group. Select **Use existing**, if you have an existing resource group. |
    | **Version** | Select **V2** |
    | **Location** | Select the location for the data factory. Only supported locations are displayed in the drop-down list. The data stores that are used by data factory can be in other locations or regions. |
    | | |

1. Select Notifications on the toolbar to monitor the creation process. After creation is complete, go to the data factory you created. The **Data Factory** home page opens.

   ![Data factory home page](media/data-factory-load-data/data-factory-home-page.png)

1. Select the **Author & Monitor** tile to launch the application in a separate tab.

## Load data into Azure Data Explorer

There are two ways to load data into Azure Data Explorer using Azure Data Factory:

* Azure Data Factory user interface - [**Author** tab](/azure/data-factory/quickstart-create-data-factory-portal#create-a-data-factory)
* Azure Data Factory **Copy Data** tool used in this article.

### Copy data from Amazon S3 (Source)

1. In the **Let's get started** page, select the **Copy Data** tile to launch the Copy Data tool.

   ![Copy data tool tile](media/data-factory-load-data/copy-data-tool-tile.png)

1. In the **Properties** page, specify **Task name** and select **Next**.

    ![Copy from source properties](media/data-factory-load-data/copy-from-source.png)

1. In the **Source data store** page, click **+ Create new connection**.

    ![Source data create connection](media/data-factory-load-data/source-create-connection.png)

1. Select **Amazon S3**, and then select **Continue**

    ![New linked service](media/data-factory-load-data/as3-select-new-linked-service.png)

1. In the **New Linked Service (Amazon S3)** pane, do the following steps:

    ![Specify Amazon S3 linked service](media/data-factory-load-data/as3-new-linked-service-properties.png)

    * Specify **Name** of your new linked service.
    * Select **Connect via integration runtime** value from the dropdown.
    * Specify the **Access Key ID** value.
    * Specify the **Secret Access Key** value.
    * Select **Test Connection** to test the linked service connection you created.
    * Select **Finish**.

1. In the **Source data store** page, you will see your new AmazonS31 connection. Select **Next**.

   ![Source data store created connection](media/data-factory-load-data/source-data-store-created-connection.png)

1. In the **Choose the input file or folder** page:

    1. Browse to the folder/file that you want to copy. Select the folder/file.
    1. Select the copy behavior as required. Keep   **Binary copy** unchecked.
    1. Select **Next**.

    ![Choose input file or folder](media/data-factory-load-data/source-choose-input-file.png)

1. In the **file formats settings** window select the relevant settings for your file and click **Next**.

 ![Choose input file or folder](media/data-factory-load-data/source-file-format-settings.png)

### Copy data into Azure Data Explorer (Destination)

Azure Data Explorer new linked service is created to copy the data into the Azure Data Explorer destination table (sink) specified below.

1. In the **Destination data store** page, you can use an existing data store or specify a new data store by clicking **+ Create new connection**.

    ![Need: Destination data store page](media/data-factory-load-data/destination-create-connection.png)

1. In the **New Linked Service** window, select **Azure Data Explorer**, and then select **Continue**

    ![Select Azure Data Explorer - new linked service](media/data-factory-load-data/adx-select-new-linked-service.png)

1. In the **New Linked Service (Azure Data Explorer)** window, do the following:

    ![ADX new linked service](media/data-factory-load-data/adx-new-linked-service.png)

   * Select **Name** for Azure Data Explorer linked service.
   * In **Account selection method**: 
        * Select the **From Azure subscription** radio button and select your **Azure subscription** account. Then, select your **Cluster**.
        Or:
        * Select **Enter manually** radio button and enter your **Endpoint**.
    * Specify the **Tenant**.
    * Enter **Service principal ID**.
    * Select **Service principal key** button and enter **Service Principal Key**.
    * Select your **Database** from the dropdown menu. Alternatively, select **Edit** checkbox and enter your database name.
    * Select **Test Connection** to test the linked service connection you created. A green checkmark **Connection successful** will appear.
    * Select **Finish** to complete linked service creation.

    > [!NOTE]
    > The service principal is used by Azure Data Factory to access the Azure Data Explorer service. For service principal, [create a Azure Active Directory (Azure AD) service principal](/azure/azure-stack/azure-stack-create-service-principals#manage-service-principal-for-azure-ad).

1. The **Destination data store** opens. The Azure Data Explorer data connection you created is available for use. Select **Next** to configure the connection.

    ![ADX destination data store](media/data-factory-load-data/destination-data-store.png)

1. In the **Choose the output file or folder** page, enter the output folder name, determine settings, and select **Next**.

    ![Specify output folder](media/data-factory-load-data/specify-path.png)

1. In the **Table mapping** window, set the destination table name and select **Next**.

    ![Destination dataset table mapping](media/data-factory-load-data/destination-dataset-table-mapping.png)

1. In the **Column mapping** set the column mapping for the destination table and select **Next**.

    ![Destination dataset column mapping](media/data-factory-load-data/destination-dataset-column-mapping.png)

1. In the **Settings** page, set the relevant settings and select **Next**.

    ![Copy data settings](media/data-factory-load-data/copy-data-settings.png)

1. In the **Summary** page, review the settings, and select **Next**.

    ![Copy data summary](media/data-factory-load-data/copy-data-summary.png)

1. In the **Deployment page**, select **Monitor** to monitor the pipeline (task):

    ![Need: Deployment page]()

1. The **Monitor** tab on the left is automatically selected. The **Actions** column includes links to view activity run details and to rerun the pipeline:

    ![Need: Monitor pipeline runs]()

1. To view activity runs that are associated with the pipeline run, select the **View Activity Runs** link in the **Actions** column. There's only one activity (copy activity) in the pipeline, so you see only one entry.
1. To switch back to the pipeline runs view, select the **Pipelines** link at the top. Select **Refresh** to refresh the list.

    ![Need: Monitor activity runs]()

1. To monitor the execution details for each copy activity, select the **Details** link under **Actions** in the activity monitoring view. You can monitor details like:

    * volume of data copied from the source to the sink
    * data throughput
    * execution steps with corresponding duration
    * used configurations

    ![Need: Monitor activity run details]()

1. Verify that the data is copied into your Azure Data Explorer database:

    ![Need: Verify output]()

## Next steps

Learn about Azure Data Explorer queries:

> [!div class="nextstepaction"]
>[Next step]()
