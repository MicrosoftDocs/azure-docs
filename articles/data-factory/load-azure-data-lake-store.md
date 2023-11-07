---
title: Load data into Azure Data Lake Storage Gen1
description: 'Use Azure Data Factory to copy data into Azure Data Lake Storage Gen1'
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 07/20/2023
---

# Load data into Azure Data Lake Storage Gen1 by using Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-overview.md) (previously known as Azure Data Lake Store) is an enterprise-wide hyper-scale repository for big data analytic workloads. Data Lake Storage Gen1 lets you capture data of any size, type, and ingestion speed. The data is captured in a single place for operational and exploratory analytics.

Azure Data Factory is a fully managed cloud-based data integration service. You can use the service to populate the lake with data from your existing system and save time when building your analytics solutions.

Azure Data Factory offers the following benefits for loading data into Data Lake Storage Gen1:

* **Easy to set up**: An intuitive 5-step wizard with no scripting required.
* **Rich data store support**: Built-in support for a rich set of on-premises and cloud-based data stores. For a detailed list, see the table of [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
* **Secure and compliant**: Data is transferred over HTTPS or ExpressRoute. The global service presence ensures that your data never leaves the geographical boundary.
* **High performance**: Up to 1-GB/s data loading speed into Data Lake Storage Gen1. For details, see [Copy activity performance](copy-activity-performance.md).

This article shows you how to use the Data Factory Copy Data tool to _load data from Amazon S3 into Data Lake Storage Gen1_. You can follow similar steps to copy data from other types of data stores.

> [!NOTE]
> For more information, see [Copy data to or from Data Lake Storage Gen1 by using Azure Data Factory](connector-azure-data-lake-store.md).

## Prerequisites

* Azure subscription: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* Data Lake Storage Gen1 account: If you don't have a Data Lake Storage Gen1 account, see the instructions in [Create a Data Lake Storage Gen1 account](../data-lake-store/data-lake-store-get-started-portal.md#create-a-data-lake-storage-gen1-account).
* Amazon S3: This article shows how to copy data from Amazon S3. You can use other data stores by following similar steps.

## Create a data factory

1. If you have not created your data factory yet, follow the steps in [Quickstart: Create a data factory by using the Azure portal and Azure Data Factory Studio](quickstart-create-data-factory-portal.md) to create one.  After creating it, browse to the data factory in the Azure portal.

   :::image type="content" source="./media/doc-common-process/data-factory-home-page.png" alt-text="Home page for the Azure Data Factory, with the Open Azure Data Factory Studio tile.":::

1. Select **Open** on the **Open Azure Data Factory Studio** tile to launch the Data Integration application in a separate tab.

## Load data into Data Lake Storage Gen1

1. In the home page, select the **Ingest** tile to launch the Copy Data tool: 

   :::image type="content" source="./media/doc-common-process/get-started-page.png" alt-text="Screenshot that shows the ADF home page.":::
2. In the **Properties** page, specify **CopyFromAmazonS3ToADLS** for the **Task name** field, and select **Next**:

    :::image type="content" source="./media/load-data-into-azure-data-lake-store/copy-data-tool-properties-page.png" alt-text="Properties page":::
3. In the **Source data store** page, select **+ Create new connection**:

    :::image type="content" source="./media/load-data-into-azure-data-lake-store/source-data-store-page.png" alt-text="Source data store page":::
	
	Select **Amazon S3**, and select **Continue**
	
	:::image type="content" source="./media/load-data-into-azure-data-lake-store/source-data-store-page-s3.png" alt-text="Source data store s3 page":::
	
4. In the **Specify Amazon S3 connection** page, do the following steps: 
   1. Specify the **Access Key ID** value.
   2. Specify the **Secret Access Key** value.
   3. Select **Finish**.
   
      :::image type="content" source="./media/load-data-into-azure-data-lake-store/specify-amazon-s3-account.png" alt-text="Screenshot shows the New Linked Service pane where you can enter values.":::
   
   4. You will see a new connection. Select **Next**.
   
   :::image type="content" source="./media/load-data-into-azure-data-lake-store/specify-amazon-s3-account-created.png" alt-text="Screenshot shows your new connection.":::
   
5. In the **Choose the input file or folder** page, browse to the folder and file that you want to copy over. Select the folder/file, select **Choose**, and then select **Next**:

    :::image type="content" source="./media/load-data-into-azure-data-lake-store/choose-input-folder.png" alt-text="Choose input file or folder":::

6. Choose the copy behavior by selecting the **Copy files recursively** and **Binary copy** (copy files as-is) options. Select **Next**:

    :::image type="content" source="./media/load-data-into-azure-data-lake-store/specify-binary-copy.png" alt-text="Screenshot shows the Choose the input file or folder where you can select Copy file recursively and Binary Copy.":::
	
7. In the **Destination data store** page, select **+ Create new connection**, and then select **Azure Data Lake Storage Gen1**, and select **Continue**:

    :::image type="content" source="./media/load-data-into-azure-data-lake-store/destination-data-storage-page.png" alt-text="Destination data store page":::

8. In the **New Linked Service (Azure Data Lake Storage Gen1)** page, do the following steps: 

   1. Select your Data Lake Storage Gen1 account for the **Data Lake Store account name**.
   2. Specify the **Tenant**, and select Finish.
   3. Select **Next**.
   
   > [!IMPORTANT]
   > In this walkthrough, you use a managed identity for Azure resources to authenticate your Data Lake Storage Gen1 account. Be sure to grant the MSI the proper permissions in Data Lake Storage Gen1 by following [these instructions](connector-azure-data-lake-store.md#managed-identity).
   
   :::image type="content" source="./media/load-data-into-azure-data-lake-store/specify-adls.png" alt-text="Specify Data Lake Storage Gen1 account":::
9. In the **Choose the output file or folder** page, enter **copyfroms3** as the output folder name, and select **Next**: 

    :::image type="content" source="./media/load-data-into-azure-data-lake-store/specify-adls-path.png" alt-text="Screenshot shows the folder path you enter.":::

10. In the **Settings** page, select **Next**:

    :::image type="content" source="./media/load-data-into-azure-data-lake-store/copy-settings.png" alt-text="Settings page":::
11. In the **Summary** page, review the settings, and select **Next**:

    :::image type="content" source="./media/load-data-into-azure-data-lake-store/copy-summary.png" alt-text="Summary page":::
12. In the **Deployment page**, select **Monitor** to monitor the pipeline (task):

    :::image type="content" source="./media/load-data-into-azure-data-lake-store/deployment-page.png" alt-text="Deployment page":::
13. Notice that the **Monitor** tab on the left is automatically selected. The **Actions** column includes links to view activity run details and to rerun the pipeline:

    :::image type="content" source="./media/load-data-into-azure-data-lake-store/monitor-pipeline-runs.png" alt-text="Monitor pipeline runs":::
14. To view activity runs that are associated with the pipeline run, select the **View Activity Runs** link in the **Actions** column. There's only one activity (copy activity) in the pipeline, so you see only one entry. To switch back to the pipeline runs view, select the **Pipelines** link at the top. Select **Refresh** to refresh the list. 

    :::image type="content" source="./media/load-data-into-azure-data-lake-store/monitor-activity-runs.png" alt-text="Monitor activity runs":::

15. To monitor the execution details for each copy activity, select the **Details** link under **Actions** in the activity monitoring view. You can monitor details like the volume of data copied from the source to the sink, data throughput, execution steps with corresponding duration, and used configurations:

    :::image type="content" source="./media/load-data-into-azure-data-lake-store/monitor-activity-run-details.png" alt-text="Monitor activity run details":::

16. Verify that the data is copied into your Data Lake Storage Gen1 account: 

    :::image type="content" source="./media/load-data-into-azure-data-lake-store/adls-copy-result.png" alt-text="Verify Data Lake Storage Gen1 output":::

## Next steps

Advance to the following article to learn about Data Lake Storage Gen1 support: 

> [!div class="nextstepaction"]
>[Azure Data Lake Storage Gen1 connector](connector-azure-data-lake-store.md)
