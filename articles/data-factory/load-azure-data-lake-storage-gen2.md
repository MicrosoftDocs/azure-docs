---
title: Load data into Azure Data Lake Storage Gen2
description: 'Use Azure Data Factory to copy data into Azure Data Lake Storage Gen2'
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 07/20/2023
---

# Load data into Azure Data Lake Storage Gen2 with Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Azure Data Lake Storage Gen2 is a set of capabilities dedicated to big data analytics, built into [Azure Blob storage](../storage/blobs/storage-blobs-introduction.md). It allows you to interface with your data using both file system and object storage paradigms.

Azure Data Factory (ADF) is a fully managed cloud-based data integration service. You can use the service to populate the lake with data from a rich set of on-premises and cloud-based data stores and save time when building your analytics solutions. For a detailed list of supported connectors, see the table of [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).

Azure Data Factory offers a scale-out, managed data movement solution. Due to the scale-out architecture of ADF, it can ingest data at a high throughput. For details, see [Copy activity performance](copy-activity-performance.md).

This article shows you how to use the Data Factory Copy Data tool to load data from _Amazon Web Services S3 service_ into _Azure Data Lake Storage Gen2_. You can follow similar steps to copy data from other types of data stores.

>[!TIP]
>For copying data from Azure Data Lake Storage Gen1 into Gen2, refer to [this specific walkthrough](load-azure-data-lake-storage-gen2-from-gen1.md).

## Prerequisites

* Azure subscription: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* Azure Storage account with Data Lake Storage Gen2 enabled: If you don't have a Storage account, [create an account](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM).
* AWS account with an S3 bucket that contains data: This article shows how to copy data from Amazon S3. You can use other data stores by following similar steps.

## Create a data factory

1. If you have not created your data factory yet, follow the steps in [Quickstart: Create a data factory by using the Azure portal and Azure Data Factory Studio](quickstart-create-data-factory-portal.md) to create one.  After creating it, browse to the data factory in the Azure portal.

   :::image type="content" source="./media/doc-common-process/data-factory-home-page.png" alt-text="Home page for the Azure Data Factory, with the Open Azure Data Factory Studio tile.":::

1. Select **Open** on the **Open Azure Data Factory Studio** tile to launch the Data Integration application in a separate tab.

## Load data into Azure Data Lake Storage Gen2

1. In the home page of Azure Data Factory, select the **Ingest** tile to launch the Copy Data tool.

2. In the **Properties** page, choose **Built-in copy task** under **Task type**, and choose **Run once now** under **Task cadence or task schedule**, then select **Next**.

    :::image type="content" source="./media/load-azure-data-lake-storage-gen2/copy-data-tool-properties-page.png" alt-text="Properties page":::
3. In the **Source data store** page, complete the following steps:
    1. Select **+ New connection**. Select **Amazon S3** from the connector gallery, and select **Continue**.
	
    	:::image type="content" source="./media/load-azure-data-lake-storage-gen2/source-data-store-page-s3.png" alt-text="Source data store s3 page":::
	
    1. In the **New connection (Amazon S3)** page, do the following steps:

        1. Specify the **Access Key ID** value.
        1. Specify the **Secret Access Key** value.
        1. Select **Test connection** to validate the settings, then select **Create**.
    
          :::image type="content" source="./media/load-azure-data-lake-storage-gen2/specify-amazon-s3-account.png" alt-text="Specify Amazon S3 account":::

    1. In the **Source data store** page, ensure that the newly created Amazon S3 connection is selected in the **Connection** block. 
    1. In the **File or folder** section, browse to the folder and file that you want to copy over. Select the folder/file, and then select **OK**.
    1. Specify the copy behavior by checking the **Recursively** and **Binary copy** options. Select **Next**.

    :::image type="content" source="./media/load-azure-data-lake-storage-gen2/source-data-store.png" alt-text="Screenshot that shows the source data store page.":::
	
4. In the **Destination data store** page, complete the following steps.
    1. Select **+ New connection**, and then select **Azure Data Lake Storage Gen2**, and select **Continue**.

        :::image type="content" source="./media/load-azure-data-lake-storage-gen2/destination-data-storage-page.png" alt-text="Destination data store page":::
    
    1. In the **New connection (Azure Data Lake Storage Gen2)** page, select your Data Lake Storage Gen2 capable account from the "Storage account name" drop-down list, and select **Create** to create the connection. 

        :::image type="content" source="./media/load-azure-data-lake-storage-gen2/specify-azure-data-lake-storage.png" alt-text="Specify Azure Data Lake Storage Gen2 account":::

    1. In the **Destination data store** page, select the newly created connection in the **Connection** block. Then under **Folder path**, enter **copyfroms3** as the output folder name, and select **Next**. ADF will create the corresponding ADLS Gen2 file system and subfolders during copy if it doesn't exist.

        :::image type="content" source="./media/load-azure-data-lake-storage-gen2/destiantion-data-store.png" alt-text="Screenshot that shows the destination data store page.":::   
    
5. In the **Settings** page, specify **CopyFromAmazonS3ToADLS** for the **Task name** field, and select **Next** to use the default settings.

    :::image type="content" source="./media/load-azure-data-lake-storage-gen2/copy-settings.png" alt-text="Settings page":::

6. In the **Summary** page, review the settings, and select **Next**.

    :::image type="content" source="./media/load-azure-data-lake-storage-gen2/copy-summary.png" alt-text="Summary page":::

7. On the **Deployment page**, select **Monitor** to monitor the pipeline (task). 
 
8. When the pipeline run completes successfully, you see a pipeline run that is triggered by a manual trigger. You can use links under the **Pipeline name** column to view activity details and to rerun the pipeline.

    :::image type="content" source="./media/load-azure-data-lake-storage-gen2/monitor-pipeline-runs.png" alt-text="Monitor pipeline runs":::

9. To see activity runs associated with the pipeline run, select the **CopyFromAmazonS3ToADLS** link under the **Pipeline name** column. For details about the copy operation, select the **Details** link (eyeglasses icon) under the **Activity name** column. You can monitor details like the volume of data copied from the source to the sink, data throughput, execution steps with corresponding duration, and used configuration.
 
    :::image type="content" source="./media/load-azure-data-lake-storage-gen2/monitor-activity-runs.png" alt-text="Monitor activity runs":::
    
    :::image type="content" source="./media/load-azure-data-lake-storage-gen2/monitor-activity-run-details.png" alt-text="Monitor activity run details":::

10. To refresh the view, select **Refresh**. Select **All pipeline runs** at the top to go back to the "Pipeline runs" view.

11. Verify that the data is copied into your Data Lake Storage Gen2 account.

## Next steps

* [Copy activity overview](copy-activity-overview.md)
* [Azure Data Lake Storage Gen2 connector](connector-azure-data-lake-storage.md)
