---
title: Create a function in Azure triggered by Blob storage 
description: Use Azure Functions to create a serverless function that is invoked by items added to a Blob storage container.

ms.assetid: d6bff41c-a624-40c1-bbc7-80590df29ded
ms.topic: quickstart
ms.date: 10/01/2018
ms.custom: mvc, cc996988-fb4f-47
---
# Create a function in Azure that's triggered by Blob storage

Learn how to create a function triggered when files are uploaded to or updated in a Blob storage container.

## Prerequisites

+ An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an Azure Function app

[!INCLUDE [Create function app Azure portal](../../includes/functions-create-function-app-portal.md)]

You've successfully created your new function app.

![Function app successfully created.](./media/functions-create-first-azure-function/function-app-create-success.png)

Next, you create a function in the new function app.

<a name="create-function"></a>

## Create an Azure Blob storage triggered function

1. Select **Functions**, and then select **+ Add** to add a new function.

   ![Choose a Function template in the Azure portal.](./media/functions-create-storage-blob-triggered-function/function-app-quickstart-choose-template.png)

1. Choose the **Azure Blob Storage trigger** template.

1. Use the settings as specified in the table below the image.

    ![Create the Blob storage triggered function.](./media/functions-create-storage-blob-triggered-function/functions-create-blob-storage-trigger-portal-2.png)

    | Setting | Suggested value | Description |
    |---|---|---|
    | **New Function** | Unique in your function app | Name of this blob triggered function. |
    | **Path**   | samples-workitems/{name}    | Location in Blob storage being monitored. The file name of the blob is passed in the binding as the _name_ parameter.  |
    | **Storage account connection** | AzureWebJobsStorage | You can use the storage account connection already being used by your function app, or create a new one.  |

1. Select **Create Function** to create your function.

Next, create the **samples-workitems** container.

## Create the container

1. In your function, on the **Overview** page, select your resource group.

    ![Select your Azure portal resource group.](./media/functions-create-storage-blob-triggered-function/functions-storage-resource-group.png)

1. Find and select your resource group's storage account.

    ![Run the Storage Account Explorer tool.](./media/functions-create-storage-blob-triggered-function/functions-storage-account-access.png)

1. Choose **Containers**, and then choose **+ Containers**. 

    ![Add container to your storage account in the Azure portal.](./media/functions-create-storage-blob-triggered-function/functions-storage-add-container.png)

1. In the **Name** field, type `samples-workitems`, and then select **Create**.

    ![Name the storage queue.](./media/functions-create-storage-blob-triggered-function/functions-storage-name-blob-container.png)

Now that you have a blob container, you can test the function by uploading a file to the container.

## Test the function

1. Back in the Azure portal, browse to your function expand the **Logs** at the bottom of the page and make sure that log streaming isn't paused.

    ![Expand the log in the Azure portal.](./media/functions-create-storage-blob-triggered-function/functions-storage-log-expander.png)
    :::image type="content" source="./media/functions-create-storage-blob-triggered-function/functions-storage-log-expander.png" alt-text="Expand the log in the Azure portal." border="false":::

1. In a separate browser window, go to your resource group in the Azure portal, and select the storage account.

1. Select **Containers**, and then select the **samples-workitems** container.

    ![Go to your samples-workitems container in the Azure portal.](./media/functions-create-storage-blob-triggered-function/functions-storage-container.png)

1. Select **Upload**, and then select the folder icon to choose a file to upload.

    ![Upload a file to the blob container.](./media/functions-create-storage-blob-triggered-function/functions-storage-manager-upload-file-blob.png)

1. Browse to a file on your local computer, such as an image file, choose the file. Select **Open** and then **Upload**.

1. Go back to your function logs and verify that the blob has been read.

   ![View message in the logs.](./media/functions-create-storage-blob-triggered-function/function-app-in-portal-editor.png)

    >[!NOTE]
    > When your function app runs in the default Consumption plan, there may be a delay of up to several minutes between the blob being added or updated and the function being triggered. If you need low latency in your blob triggered functions, consider running your function app in an App Service plan.

## Clean up resources

[!INCLUDE [Next steps note](../../includes/functions-quickstart-cleanup.md)]

## Next steps

You have created a function that runs when a blob is added to or updated in Blob storage. For more information about Blob storage triggers, see [Azure Functions Blob storage bindings](functions-bindings-storage-blob.md).

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps.md)]
