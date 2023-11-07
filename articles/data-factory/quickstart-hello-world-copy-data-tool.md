---
title: Copy data by using the copy data tool
description: Create an Azure Data Factory and then use the copy data tool to copy data from one location in Azure Blob storage to another location.
author: dearandyxu
ms.author: yexu
ms.service: data-factory
ms.subservice: tutorials
ms.topic: quickstart
ms.date: 10/20/2023
ms.custom: mode-other
---

# Quickstart: Use the copy data tool in the Azure Data Factory Studio to copy data

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this quick start, you will use the Copy Data tool to create a pipeline that copies data from the source folder in Azure Blob storage to target folder.

## Prerequisites

### Azure subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

### Prepare source data in Azure Blob Storage
Select the button below to try it out!  

[![Try your first data factory demo](./media/quickstart-get-started/try-it-now.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.datafactory%2Fdata-factory-copy-data-tool%2Fazuredeploy.json)

You will be redirected to the configuration page shown in the image below to deploy the template.  Here, you only need to create a **new resource group**. (You can leave all the other values with their defaults.) Then click **Review + create** and click **Create** to deploy the resources.

> [!NOTE]
> The user deploying the template needs to assign a role to a managed identity.  This requires permissions that can be granted through the Owner, User Access Administrator or Managed Identity Operator roles.

A new blob storage account will be created in the new resource group, and the moviesDB2.csv file will be stored in a folder called **input** in the blob storage.

:::image type="content" source="media/quickstart-hello-world-copy-data-tool/deploy-template.png" alt-text="A screenshot of the deployment template creation dialog.":::

### Create a data factory

You can use your existing data factory or create a new one as described in [Quickstart: Create a data factory by using the Azure portal](quickstart-create-data-factory.md).
    
## Use the copy data tool to copy data

The steps below will walk you through how to easily copy data with the copy data tool in Azure Data Factory.

### Step 1: Start the copy data Tool

1. On the home page of Azure Data Factory, select the **Ingest** tile to start the Copy Data tool.

   :::image type="content" source="./media/doc-common-process/get-started-page.png" alt-text="Screenshot that shows the Azure Data Factory home page.":::

1. On the **Properties** page of the Copy Data tool, choose **Built-in copy task** under **Task type**, then select **Next**.

   :::image type="content" source="./media/quickstart-hello-world-copy-data-tool/copy-data-tool-properties-page.png" alt-text="Screenshot that shows the Properties page.":::

### Step 2: Complete source configuration

1. Click **+ Create new connection** to add a connection.

1. Select the linked service type that you want to create for the source connection. In this tutorial, we use **Azure Blob Storage**. Select it from the gallery, and then select **Continue**.
    
   :::image type="content" source="./media/quickstart-hello-world-copy-data-tool/select-blob-source.png" alt-text="Screenshot that shows the Select Blob dialog.":::

1. On the **New connection (Azure Blob Storage)** page, specify a name for your connection. Select your Azure subscription from the **Azure subscription** list and your storage account from the **Storage account name** list, test connection, and then select **Create**. 

   :::image type="content" source="./media/quickstart-hello-world-copy-data-tool/configure-blob-storage.png" alt-text="Screenshot that shows where to configure the Azure Blob storage account.":::

1. Select the newly created connection in the **Connection** block.
1. In the **File or folder** section, select **Browse** to navigate to the **adftutorial/input** folder, select the **emp.txt** file, and then click **OK**.
1. Select the **Binary copy** checkbox to copy file as-is, and then select **Next**.

   :::image type="content" source="./media/quickstart-hello-world-copy-data-tool/source-data-store.png" alt-text="Screenshot that shows the Source data store page.":::

### Step 3: Complete destination configuration
1. Select the **AzureBlobStorage** connection that you created in the **Connection** block.

1. In the **Folder path** section,  enter **adftutorial/output** for the folder path.

   :::image type="content" source="./media/quickstart-hello-world-copy-data-tool/destination-data-store.png" alt-text="Screenshot that shows the Destination data store page.":::

1. Leave other settings as default and then select **Next**.

### Step 4: Review all settings and deployment

1. On the **Settings** page, specify a name for the pipeline and its description, then select **Next** to use other default configurations. 

   :::image type="content" source="./media/quickstart-hello-world-copy-data-tool/settings.png" alt-text="Screenshot that shows the settings page.":::

1. On the **Summary** page, review all settings, and select **Next**. 

1. On the **Deployment complete** page, select **Monitor** to monitor the pipeline that you created. 

    :::image type="content" source="./media/quickstart-hello-world-copy-data-tool/deployment-page.png" alt-text="Screenshot that shows the Deployment complete page.":::

### Step 5: Monitor the running results
1. The application switches to the **Monitor** tab. You see the status of the pipeline on this tab. Select **Refresh** to refresh the list. Click the link under **Pipeline name** to view activity run details or rerun the pipeline. 
   
   :::image type="content" source="./media/quickstart-hello-world-copy-data-tool/refresh-pipeline.png" alt-text="Screenshot that shows the refresh pipeline button.":::

1. On the Activity runs page, select the **Details** link (eyeglasses icon) under the **Activity name** column for more details about copy operation. For details about the properties, see [Copy Activity overview](copy-activity-overview.md). 

## Next steps
The pipeline in this sample copies data from one location to another location in Azure Blob storage. To learn about using Data Factory in more scenarios, go through the [tutorials](tutorial-copy-data-portal.md). 
