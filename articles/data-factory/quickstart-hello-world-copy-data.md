---
title: Hello World - How to copy data using the Copy Data tool
description: Create a data factory with a pipeline that copies data from one location in Azure Blob storage to another location using the Copy Data tool.
author: pennyzhou-msft
ms.service: data-factory
ms.subservice: tutorials
ms.topic: quickstart
ms.date: 08/19/2022
ms.author: xupzhou
ms.custom: mode-other
---

# Quickstart: Hello World - How to copy data in Azure Data Factory using the Copy Data tool

In this quick start, you will use the Copy Data tool to create a pipeline that copies data from the source folder in Azure Blob storage to target folder.

## Prerequisites

### Azure subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

### Prepare source data in Azure Blob Storage

Select the button below to prepare the data source of Copy with one-click button. Create a new resource group to put this Azure Blob storage and select **Review + Create**, then **Create**. 

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.datafactory%2Fdata-factory-v2-blob-to-blob-copy%2Fazuredeploy.json)

:::image type="content" source="media/quickstart-hello-world-copy-data/deploy-source-data.png" alt-text="Screenshot of the deployment page for the Azure Resource Manager template that creates the necessary resources for this quickstart.":::

Then Azure Blob storage will be created and [moviesDB2.csv](https://github.com/kromerm/adfdataflowdocs/blob/master/sampledata/moviesDB2.csv) will be uploaded into the input folder of the created Azure Blob storage.

:::image type="content" source="media/quickstart-hello-world-copy-data/storage-account.png" alt-text="Screenshot of the storage account created by the Azure Resource Manager template above.":::

### Create a data factory

Visit [adf.azure.com](https://adf.azure.com) to create your Azure Data Factory within seconds. After creation,  you will be redirected to Data Factory Studio page of newly created one.

## Use the Copy Data tool to copy data

### Step 1: Start the Copy Data tool

1. On the home page of the Azure Data Factory, select the Ingest tile to start the Copy Data tool.

   :::image type="content" source="media/quickstart-hello-world-copy-data/ingest-data.png" alt-text="Screenshot of the Azure Data Factory Studio home page with the Ingest button highlighted.":::

1. On the **Properties** page of the Copy Data tool, choose **Built-in copy task** under **Task type**, then select **Next**. 

   :::image type="content" source="media/quickstart-hello-world-copy-data/built-in-copy-task.png" alt-text="Screenshot of the Copy Data tool with the Built-in copy task selected.":::

### Step 2: Complete source configurations

1. Select **+ Create new connection** to add a connection.
1. Select the linked service type that you want to create for the source connection. In this tutorial, we use **Azure Blob Storage**. Select it from the gallery, and then select **Continue**.

   :::image type="content" source="media/quickstart-hello-world-copy-data/select-source-data-store.png" alt-text="Screenshot of the Source data store section of the Copy Data tool new connection page.":::

   :::image type="content" source="media/quickstart-hello-world-copy-data/new-connection.png" alt-text="Screenshot of the new connection dialog.":::

1. On the **New connection (Azure Blob Storage)** page, specify a name for your connection. Select your Azure subscription from the **Azure subscription** list and your storage account from the **Storage account name** list, test the connection, and then select **Create**.

   :::image type="content" source="media/quickstart-hello-world-copy-data/new-linked-service.png" alt-text="Screenshot of the new linked service page for Azure Blob Storage.":::

1. Select the newly created connection in the **Connection** block.
1. In the **File or folder** section, select **Browse** to navigate to the **adfhello/input** folder, select the **moviesDB2.csv** file, and then select **OK**.
1. Select the **Binary copy** checkbox to copy file as-is, and then select **Next**.

   :::image type="content" source="media/quickstart-hello-world-copy-data/source-data-store.png" alt-text="Screenshot of the source data store dialog.":::

### Step 3: Complete destination configurations

1. Select the **AzureBlobStorage** connection that you created in the **Connection** block.
1. In the **Folder path** section, enter **adfhello/output** for the folder path, in this sample it is blobfeiv6l4dck2hc/output.
1. Leave other settings as default and then select **Next**.
  
   :::image type="content" source="media/quickstart-hello-world-copy-data/destination-data-store.png" alt-text="Screenshot of the destination data store dialog highlighting necessary changes for configuration.":::

### Step 4: Review all the settings and deployment

1. On the **Settings** page, specify a name for the pipeline and its description, then select **Next** to use other default configurations.

   :::image type="content" source="media/quickstart-hello-world-copy-data/settings.png" alt-text="Screenshot of the settings dialog.":::

1. On the **Summary** page, review all settings, and select **Next**.
1. On the **Deployment complete** page, select **Monitor** to monitor the pipeline that you created.

   :::image type="content" source="media/quickstart-hello-world-copy-data/deployment-complete.png" alt-text="Screenshot of the deployment complete page.":::

### Step 5: Monitor the running results

1. The application switches to the **Monitor** tab. You see the status of the pipeline on this tab. Select **Refresh** to refresh the list. Click the link under **Pipeline name** to view activity run details or rerun the pipeline.

   :::image type="content" source="media/quickstart-hello-world-copy-data/monitor-button.png" alt-text="Screenshot of the monitor button.":::

   :::image type="content" source="media/quickstart-hello-world-copy-data/monitor-pipeline-runs.png" alt-text="Screenshot of the monitor pipeline runs window.":::

1. On the Activity runs page, select the **Details** link (eyeglasses icon) under the **Activity name** column for more details about copy operation. For details about the properties, see [Copy Activity overview](copy-activity-overview.md).

   :::image type="content" source="media/quickstart-hello-world-copy-data/copy-activity-overview.png" alt-text="Screenshot of the copy activity overview.":::

   From the data read and data written size, and files read and written, we can know the CSV file is already copied to the destination.

   :::image type="content" source="media/quickstart-hello-world-copy-data/copy-activity-details.png" alt-text="Screenshot of the monitoring page for the copy activity's details.":::

## Next Steps

The pipeline in this sample copies data from one location to another location in Azure Blob storage. To learn about using Data Factory in more scenarios, check out the more in-depth [tutorials](tutorial-copy-data-portal.md).