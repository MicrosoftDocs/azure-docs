---
title: Copy data from Azure Data Factory to Azure Data Explorer
description: In this article, you learn how to ingest (load) data into Azure Data Explorer by using the Azure Data Factory copy tool.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: jasonh
ms.service: data-explorer
ms.topic: conceptual
ms.date: 04/15/2019

#Customer intent: I want to use Azure Data Factory to load data into Azure Data Explorer so that I can analyze it later.
---

# Copy data to Azure Data Explorer by using Azure Data Factory 

Azure Data Explorer is a fast, fully managed, data-analytics service. It offers real-time analysis on large volumes of data that stream from many sources, such as applications, websites, and IoT devices. With Azure Data Explorer, you can iteratively explore data and identify patterns and anomalies to improve products, enhance customer experiences, monitor devices, and boost operations. It helps you explore new questions and get answers in minutes. 

Azure Data Factory is a fully managed, cloud-based, data-integration service. You can use it to populate your Azure Data Explorer database with data from your existing system. It can help you save time when you're building analytics solutions.

When you load data into Azure Data Explorer, Data Factory provides the following benefits:

* **Easy setup**: Get an intuitive, five-step wizard with no scripting required.
* **Rich data store support**: Get built-in support for a rich set of on-premises and cloud-based data stores. For a detailed list, see the table of [Supported data stores](/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats).
* **Secure and compliant**: Data is transferred over HTTPS or Azure ExpressRoute. The global service presence ensures that your data never leaves the geographical boundary.
* **High performance**: The data-loading speed is up to 1 gigabyte per second (GBps) into Azure Data Explorer. For more information, see [Copy activity performance](/azure/data-factory/copy-activity-performance).

In this article, you use the Data Factory Copy Data tool to load data from Amazon Simple Storage Service (S3) into Azure Data Explorer. You can follow a similar process to copy data from other data stores, such as:
* [Azure Blob storage](/azure/data-factory/connector-azure-blob-storage)
* [Azure SQL Database](/azure/data-factory/connector-azure-sql-database)
* [Azure SQL Data Warehouse](/azure/data-factory/connector-azure-sql-data-warehouse)
* [Google BigQuery](/azure/data-factory/connector-google-bigquery)
* [Oracle](/azure/data-factory/connector-oracle)
* [File system](/azure/data-factory/connector-file-system)

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* [An Azure Data Explorer cluster and database](create-cluster-database-portal.md).
* A source of data.

## Create a data factory

1. Sign in to the [Azure portal](https://ms.portal.azure.com).

1. In the left pane, select **Create a resource** > **Analytics** > **Data Factory**.

   ![Create a data factory in the Azure portal](media/data-factory-load-data/create-adf.png)

1. In the **New data factory** pane, provide values for the fields in the following table:

   ![The "New data factory" pane](media/data-factory-load-data/my-new-data-factory.png)  

   | Setting  | Value to enter  |
   |---|---|
   | **Name** | In the box, enter a globally unique name for your data factory. If you receive an error, *Data factory name \"LoadADXDemo\" is not available*, enter a different name for the data factory. For rules about naming Data Factory artifacts, see [Data Factory naming rules](/azure/data-factory/naming-rules).|
   | **Subscription** | In the drop-down list, select the Azure subscription in which to create the data factory. |
   | **Resource Group** | Select **Create new**, and then enter the name of a new resource group. If you already have a resource group, select **Use existing**. |
   | **Version** | In the drop-down list, select **V2**. |    
   | **Location** | In the drop-down list, select the location for the data factory. Only supported locations are displayed in the list. The data stores that are used by the data factory can exist in other locations or regions. |

1. Select **Create**.

1. To monitor the creation process, select **Notifications** on the toolbar. After you've created the data factory, select it.
   
   The **Data Factory** pane opens.

   ![The Data Factory pane](media/data-factory-load-data/data-factory-home-page.png)

1. To open the application in a separate pane, select the **Author & Monitor** tile.

## Load data into Azure Data Explorer

You can load data from many types of [data stores](/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats) into Azure Data Explorer. This article discusses how to load data from Amazon S3.

You can load your data in either of the following ways:

* In the Azure Data Factory user interface, in the left pane, select the **Author** icon. This is shown in the "Create a data factory" section of [Create a data factory by using the Azure Data Factory UI](/azure/data-factory/quickstart-create-data-factory-portal#create-a-data-factory).
* In the Azure Data Factory Copy Data tool, as shown in [Use the Copy Data tool to copy data](/azure/data-factory/quickstart-create-data-factory-copy-data-tool).

### Copy data from Amazon S3 (source)

1. In the **Let's get started** pane, open the Copy Data tool by selecting **Copy Data**.

   ![The Copy Data tool button](media/data-factory-load-data/copy-data-tool-tile.png)

1. In the **Properties** pane, in the **Task name** box, enter a name, and then select **Next**.

    ![The Copy Data Properties pane](media/data-factory-load-data/copy-from-source.png)

1. In the **Source data store** pane, select **Create new connection**.

    ![The Copy Data "Source data store" pane](media/data-factory-load-data/source-create-connection.png)

1. Select **Amazon S3**, and then select **Continue**.

    ![The New Linked Service pane](media/data-factory-load-data/amazons3-select-new-linked-service.png)

1. In the **New Linked Service (Amazon S3)** pane, do the following:

    ![Specify Amazon S3 linked service](media/data-factory-load-data/amazons3-new-linked-service-properties.png)

    a. In the **Name** box, enter the name of your new linked service.

    b. In the **Connect via integration runtime** drop-down list, select the value.

    c. In the **Access Key ID** box, enter the value.
    
    > [!NOTE]
    > In Amazon S3, to locate your access key, select your Amazon username on the navigation bar, and then select **My Security Credentials**.
    
    d. In the **Secret Access Key** box, enter a value.

    e. To test the linked service connection you created, select **Test Connection**.

    f. Select **Finish**.
    
      The **Source data store** pane displays your new AmazonS31 connection. 

1. Select **Next**.

   ![Source data store created connection](media/data-factory-load-data/source-data-store-created-connection.png)

1. In the **Choose the input file or folder** pane, do the following steps:

    a. Browse to the file or folder that you want to copy, and then select it.

    b. Select the copy behavior that you want. Make sure that the **Binary copy** check box is cleared.

    c. Select **Next**.

    ![Choose input file or folder](media/data-factory-load-data/source-choose-input-file.png)

1. In the **File format settings** pane, select the relevant settings for your file. and then select **Next**.

   ![The "File format settings" pane](media/data-factory-load-data/source-file-format-settings.png)

### Copy data into Azure Data Explorer (destination)

The new Azure Data Explorer linked service is created to copy the data into the Azure Data Explorer destination table (sink) that's specified in this section.

> [!NOTE]
> Use the [Azure Data Factory command activity to run Azure Data Explorer control commands](data-factory-command-activity.md) and use any of the [ingest from query commands](/azure/kusto/management/data-ingestion/ingest-from-query), such as `.set-or-replace`.

#### Create the Azure Data Explorer linked service

To create the Azure Data Explorer linked service, do the following steps:

1. To use an existing data store connection or specify a new data store, in the **Destination data store** pane, select **Create new connection**.

    ![Destination data store pane](media/data-factory-load-data/destination-create-connection.png)

1. In the **New Linked Service** pane, select **Azure Data Explorer**, and then select **Continue**.

    ![The New linked service pane](media/data-factory-load-data/adx-select-new-linked-service.png)

1. In the **New Linked Service (Azure Data Explorer)** pane, do the following steps:

    ![The Azure Data Explorer New Linked Service pane](media/data-factory-load-data/adx-new-linked-service.png)

   a. In the **Name** box, enter a name for the Azure Data Explorer linked service.

   b. Under **Account selection method**, choose one of the following options: 

    * Select **From Azure subscription** and then, in the drop-down lists, select your **Azure subscription** and your **Cluster**. 

        > [!NOTE]
        > The **Cluster** drop-down control lists only clusters that are associated with your subscription.

    * Select **Enter manually**, and then enter your **Endpoint**.

   c. In the **Tenant** box, enter the tenant name.

   d. In the **Service principal ID** box, enter the service principal ID.

   e. Select **Service principal key** and then, in the **Service principal key** box, enter the value for the key.

   f. In the **Database** drop-down list, select your database name. Alternatively, select the **Edit** check box, and then enter the database name.

   g. To test the linked service connection you created, select **Test Connection**. If you can connect to your linked service, the pane displays a green checkmark and a **Connection successful** message.

   h. Select **Finish** to complete the linked service creation.

    > [!NOTE]
    > The service principal is used by Azure Data Factory to access the Azure Data Explorer service. To create a service principal, go to [create an Azure Active Directory (Azure AD) service principal](/azure-stack/operator/azure-stack-create-service-principals#manage-an-azure-ad-service-principal). Do not use the Azure Key Vault method.

#### Configure the Azure Data Explorer data connection

After you've created the linked service connection, the **Destination data store** pane opens, and the connection you created is available for use. To configure the connection, do the following steps:

1. Select **Next**.

    ![The Azure Data Explorer "Destination data store" pane](media/data-factory-load-data/destination-data-store.png)

1. In the **Table mapping** pane, set the destination table name, and then select **Next**.

    ![The destination dataset "Table mapping" pane](media/data-factory-load-data/destination-dataset-table-mapping.png)

1. In the **Column mapping** pane, the following mappings take place:

    a. The first mapping is performed by Azure Data Factory according to the [Azure Data Factory schema mapping](/azure/data-factory/copy-activity-schema-and-type-mapping). Do the following:

    * Set the **Column mappings** for the Azure Data Factory destination table. The default mapping is displayed from source to the Azure Data Factory destination table.

    * Cancel the selection of the columns that you don't need to define your column mapping.

    b. The second mapping occurs when this tabular data is ingested into Azure Data Explorer. Mapping is performed according to [CSV mapping rules](/azure/kusto/management/mappings#csv-mapping). Even if the source data isn't in CSV format, Azure Data Factory converts the data into a tabular format. Therefore, CSV mapping is the only relevant mapping at this stage. Do the following:

    * (Optional) Under **Azure Data Explorer (Kusto) sink properties**, add the relevant **Ingestion mapping name** so that column mapping can be used.

    * If **Ingestion mapping name** isn't specified, the *by-name* mapping order that's defined in the **Column mappings** section will be used. If *by-name* mapping fails, Azure Data Explorer tries to ingest the data in a *by-column position* order (that is, it maps by  position as the default).

    * Select **Next**.

    ![The destination dataset "Column mapping" pane](media/data-factory-load-data/destination-dataset-column-mapping.png)

1. In the **Settings** pane, do the following steps:

    a. Under **Fault tolerance settings**, enter the relevant settings.

    b. Under **Performance settings**, **Enable staging** doesn't apply, and **Advanced settings** includes cost considerations. If you have no specific requirements, leave these settings as is.

    c. Select **Next**.

    ![The copy data "Settings" pane](media/data-factory-load-data/copy-data-settings.png)

1. In the **Summary** pane, review the settings, and then select **Next**.

    ![The copy data "Summary" pane](media/data-factory-load-data/copy-data-summary.png)

1. In the **Deployment complete** pane, do the following:

    a. To switch to the **Monitor** tab and view the status of the pipeline (that is, progress, errors, and data flow), select **Monitor**.

    b. To edit linked services, datasets, and pipelines, select **Edit Pipeline**.

    c. Select **Finish** to complete the copy data task.

    ![The "Deployment complete" pane](media/data-factory-load-data/deployment.png)

## Next steps

* Learn about the [Azure Data Explorer connector](/azure/data-factory/connector-azure-data-explorer) in Azure Data Factory.
* Learn more about editing linked services, datasets, and pipelines in the [Data Factory UI](/azure/data-factory/quickstart-create-data-factory-portal).
* Learn about [Azure Data Explorer queries](/azure/data-explorer/web-query-data) for data querying.
