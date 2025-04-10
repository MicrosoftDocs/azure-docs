---
title: Copy Data by Using the Copy Data Tool
description: Create an Azure data factory and then use the Copy Data tool to copy data from one location in Azure Blob Storage to another.
author: whhender
ms.author: whhender
ms.reviewer: yexu
ms.topic: quickstart
ms.date: 10/03/2024
ms.subservice: data-movement
ms.custom: mode-other
---

# Quickstart: Use the Copy Data tool in Azure Data Factory Studio to copy data

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this quickstart, you use the Copy Data tool in Azure Data Factory Studio to create a pipeline that copies data from a source folder in Azure Blob Storage to a target folder.

## Prerequisites

### Azure subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

### Prepare source data in Azure Blob Storage

To prepare source data by using a template:

1. Select the following button.

   [![Try your first data factory demo](./media/quickstart-get-started/try-it-now.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.datafactory%2Fdata-factory-copy-data-tool%2Fazuredeploy.json)

1. You're directed to the configuration page to deploy the template. On this page:

   1. For **Resource group**, select **Create new** to create a resource group. You can leave all the other values with their defaults.

   1. Select **Review + create**, and then select **Create** to deploy the resources.

   :::image type="content" source="media/quickstart-hello-world-copy-data-tool/deploy-template.png" alt-text="Screenshot of the page for deploying a template for the creation of resources.":::

> [!NOTE]
> The user who deploys the template needs to assign a role to a managed identity. This step requires permissions that can be granted through the Owner, User Access Administrator, or Managed Identity Operator role.

A new Blob Storage account is created in the new resource group. The moviesDB2.csv file is stored in a folder called **input** in Blob Storage.

### Create a data factory

You can use your existing data factory, or you can create a new one as described in [Quickstart: Create a data factory](quickstart-create-data-factory.md).

## Use the Copy Data tool to copy data

The Copy Data tool has five pages that walk you through the task of copying data. To start the tool:

1. In [Azure Data Factory Studio](https://adf.azure.com), go to your data factory.

1. Select the **Ingest** tile.

:::image type="content" source="./media/doc-common-process/get-started-page.png" alt-text="Screenshot that shows the page for a data factory and the Ingest tile in Azure Data Factory Studio.":::

### Step 1: Select the task type

1. On the **Properties** page of the Copy Data tool, choose **Built-in copy task** under **Task type**.

1. Select **Next**.

:::image type="content" source="./media/quickstart-hello-world-copy-data-tool/copy-data-tool-properties-page.png" alt-text="Screenshot that shows the Properties page of the Copy Data tool.":::

### Step 2: Complete source configuration

1. On the **Source** page of the Copy Data tool, select **+ Create new connection** to add a connection.

1. Select the linked service type that you want to create for the source connection. (The example in this quickstart uses **Azure Blob Storage**.) Then select **Continue**.

   :::image type="content" source="./media/quickstart-hello-world-copy-data-tool/select-blob-source.png" alt-text="Screenshot that shows the gallery of service types in the dialog for a new connection, with Azure Blob Storage selected.":::

1. In the **New connection (Azure Blob Storage)** dialog:
   1. For **Name**, specify a name for your connection.
   1. Under **Account selection method**, select **From Azure subscription**.
   1. In the **Azure subscription** list, select your Azure subscription.
   1. In the **Storage account name** list, select your storage account.
   1. Select **Test connection** and confirm that the connection is successful.
   1. Select **Create**.

   :::image type="content" source="./media/quickstart-hello-world-copy-data-tool/configure-blob-storage.png" alt-text="Screenshot that shows configuration details for an Azure Blob Storage account.":::

1. Under **Source data store**:

   1. For **Connection**, select the newly created connection.
   1. In the **File or folder** section, select **Browse** to go to the **adftutorial/input** folder. Select the **moviesDB2.csv** file, and then select **OK**.
   1. Select the **Binary copy** checkbox to copy the file as is.
   1. Select **Next**.

   :::image type="content" source="./media/quickstart-hello-world-copy-data-tool/source-data-store.png" alt-text="Screenshot that shows settings for a source data store.":::

### Step 3: Complete destination configuration

1. On the **Target** page of the Copy Data tool, for **Connection**, select the **AzureBlobStorage** connection that you created.

1. In the **Folder path** section, enter **adftutorial/output**.

   :::image type="content" source="./media/quickstart-hello-world-copy-data-tool/destination-data-store.png" alt-text="Screenshot that shows settings for a destination data store.":::

1. Leave other settings as default. Select **Next**.

### Step 4: Enter a name and description for the pipeline

1. On the **Settings** page of the Copy Data tool, specify a name for the pipeline and its description.
1. Select **Next** to use other default configurations.

   :::image type="content" source="./media/quickstart-hello-world-copy-data-tool/settings.png" alt-text="Screenshot that shows the Settings page of the Copy Data tool.":::

### Step 5: Review settings and deploy

1. On the **Review and finish** page, review all settings.

1. Select **Next**.

The **Deployment complete** page shows whether the deployment is successful.

## Monitor the running results

After you finish copying the data, you can monitor the pipeline that you created:

1. On the **Deployment complete** page, select **Monitor**.

   :::image type="content" source="./media/quickstart-hello-world-copy-data-tool/deployment-page.png" alt-text="Screenshot of the page that that shows a completed deployment.":::

1. The application switches to the **Monitor** tab, which shows the status of the pipeline. Select **Refresh** to refresh the list of pipelines. Select the link under **Pipeline name** to view activity run details or to rerun the pipeline.

   :::image type="content" source="./media/quickstart-hello-world-copy-data-tool/refresh-pipeline.png" alt-text="Screenshot that shows the button for refreshing the list of pipelines.":::

1. On the page that shows the details of the activity run, select the **Details** link (eyeglasses icon) in the **Activity name** column for more details about the copy operation. For information about the properties, see the [overview article about the copy activity](copy-activity-overview.md).

## Related content

The pipeline in this sample copies data from one location to another location in Azure Blob Storage. To learn about using Data Factory in more scenarios, see the following tutorial:

- [Copy data from Azure Blob storage to a database in Azure SQL Database by using Azure Data Factory](tutorial-copy-data-portal.md)
