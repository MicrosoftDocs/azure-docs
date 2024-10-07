---
title: Create a function in Azure triggered by Blob storage 
description: Use Azure Functions to create a serverless function that is invoked by items added to a Blob storage container.
ms.assetid: d6bff41c-a624-40c1-bbc7-80590df29ded
ms.topic: how-to
ms.date: 09/18/2024
ms.custom: mvc, cc996988-fb4f-47
---
# Create a function in Azure that's triggered by Blob storage

Learn how to create a function triggered when files are uploaded to or updated in a Blob storage container.

[!INCLUDE [functions-in-portal-editing-note](../../includes/functions-in-portal-editing-note.md)]

## Prerequisites

+ An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an Azure Function app

[!INCLUDE [Create function app Azure portal](../../includes/functions-create-function-app-portal.md)]

You've successfully created your new function app. Next, you create a function in the new function app.

<a name="create-function"></a>

## Create an Azure Blob storage triggered function

1. In your function app, select **Overview**, and then select **+ Create** under **Functions**.

1. Under **Select a template**, choose the **Blob trigger** template and select **Next**.

1. In **Template details**, configure the new trigger with the settings as specified in this table, then select **Create**:

    | Setting | Suggested value | Description |
    |---|---|---|
    | **Job type** | Append to app | You only see this setting for a Python v2 app. | 
    | **New Function** | Unique in your function app | Name of this blob triggered function. |
    | **Path**   | samples-workitems/{name}    | Location in Blob storage being monitored. The file name of the blob is passed in the binding as the _name_ parameter.  |
    | **Storage account connection** | AzureWebJobsStorage | You can use the storage account connection already being used by your function app, or create a new one.  |

    Azure creates the Blob Storage triggered function based on the provided values. Next, create the **samples-workitems** container.

## Create the container

1. Return to the **Overview** page for your function app, select your **Resource group**, then find and select the storage account in your resource group.

1. In the storage account page, select **Data storage** > **Containers** > **+ Container**. 

1. In the **Name** field, type `samples-workitems`, and then select **Create** to create a container.

1. Select the new `samples-workitems` container, which you use to test the function by uploading a file to the container.

## Test the function

1. In a new browser window, return to your function app page and select **Log stream**, which displays real-time logging for your app.

1. From the `samples-workitems` container page, select **Upload** > **Browse for files**, browse to a file on your local computer (such as an image file), and choose the file. 

1. Select **Open** and then **Upload**.

1. Go back to your function app logs and verify that the blob has been read.

    >[!NOTE]
    > When your function app runs in the default Consumption plan, there may be a delay of up to several minutes between the blob being added or updated and the function being triggered. If you need low latency in your blob triggered functions, consider one of these [other blob trigger options](./storage-considerations.md#trigger-on-a-blob-container).

## Clean up resources

[!INCLUDE [Next steps note](../../includes/functions-quickstart-cleanup.md)]

## Next steps

You have created a function that runs when a blob is added to or updated in Blob storage. For more information about Blob storage triggers, see [Azure Functions Blob storage bindings](functions-bindings-storage-blob.md).

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps.md)]
