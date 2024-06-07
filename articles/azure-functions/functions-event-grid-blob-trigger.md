---
title: 'Tutorial: Trigger Azure Functions on blob containers using an event subscription'
description: This tutorial shows how to create a low-latency, event-driven trigger on an Azure Blob Storage container using an Event Grid event subscription. 
ms.topic: tutorial
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 05/20/2024
zone_pivot_groups: programming-languages-set-functions
#Customer intent: As an Azure Functions developer, I want learn how to create an event-based trigger on a Blob Storage container so that I can get a more rapid response to changes in the container.
---

# Tutorial: Trigger Azure Functions on blob containers using an event subscription

Previous versions of the Azure Functions Blob Storage trigger poll your storage container for changes. More recent version of the Blob Storage extension (5.x+) instead use an Event Grid event subscription on the container. This event subscription reduces latency by triggering your function instantly as changes occur in the subscribed container. 

This article shows how to create a function that runs based on events raised when a blob is added to a container. You use Visual Studio Code for local development and to validate your code before deploying your project to Azure.

> [!div class="checklist"]
> * Create an event-based Blob Storage triggered function in a new project.
> * Validate locally within Visual Studio Code using the Azurite emulator.
> * Create a blob storage container in a new storage account in Azure.
> * Create a function app in the Flex Consumption plan (preview).
> * Create an event subscription to the new blob container.
> * Deploy and validate your function code in Azure.

::: zone pivot="programming-language-javascript,programming-language-typescript"
This article supports version 4 of the Node.js programming model for Azure Functions.
::: zone-end
::: zone pivot="programming-language-python"
This article supports version 2 of the Python programming model for Azure Functions.
::: zone-end
::: zone pivot="programming-language-csharp"
This article creates a C# app that runs in isolated worker mode, which supports .NET 8.0.
::: zone-end

> [!IMPORTANT]  
> This tutorial has you use the [Flex Consumption plan](flex-consumption-plan.md), which is currently in preview. The Flex Consumption plan only supports the event-based version of the Blob Storage trigger.
> You can complete this tutorial using any other [hosting plan](functions-scale.md) for your function app. 

## Prerequisites

::: zone pivot="programming-language-csharp"
[!INCLUDE [functions-requirements-visual-studio-code-csharp](../../includes/functions-requirements-visual-studio-code-csharp.md)]
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  
[!INCLUDE [functions-requirements-visual-studio-code-node](../../includes/functions-requirements-visual-studio-code-node.md)]
::: zone-end
::: zone pivot="programming-language-powershell"
[!INCLUDE [functions-requirements-visual-studio-code-powershell](../../includes/functions-requirements-visual-studio-code-powershell.md)]
::: zone-end
::: zone pivot="programming-language-python"
[!INCLUDE [functions-requirements-visual-studio-code-python](../../includes/functions-requirements-visual-studio-code-python.md)]
::: zone-end
::: zone pivot="programming-language-java"
[!INCLUDE [functions-requirements-visual-studio-code-java](../../includes/functions-requirements-visual-studio-code-java.md)]
::: zone-end  

+ [Azure Storage extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) for Visual Studio Code.

> [!NOTE]
> The Azure Storage extension for Visual Studio Code is currently in preview.

## Create a Blob triggered function

When you create a Blob Storage trigger function using Visual Studio Code, you also create a new project. You need to edit the function to consume an event subscription as the source, rather than use the regular polled container.

1. In Visual Studio Code, open your function app.

1. Press F1 to open the command palette, enter `Azure Functions: Create Function...`, and select **Create new project**.  

1. For your project workspace, select the directory location. Make sure that you either create a new folder or choose an empty folder for the project workspace.

   Don't choose a project folder that's already part of a workspace. 

1. At the prompts, provide the following information:

    ::: zone pivot="programming-language-csharp"
    |Prompt|Action|
    |--|--|
    |**Select a language**| Select `C#`. |
    |**Select a .NET runtime**| Select `.NET 8.0 Isolated LTS`. |
    |**Select a template for your project's first function**| Select `Azure Blob Storage trigger (using Event Grid)`. |
    |**Provide a function name**| Enter `BlobTriggerEventGrid`. |
    |**Provide a namespace** | Enter `My.Functions`. |
    |**Select setting from "local.settings.json"**| Select `Create new local app setting`. |
    |**Select subscription**| Select your subscription.|
    |**Select a storage account**| Use Azurite emulator for local storage. |
    |**This is the path within your storage account that the trigger will monitor**| Accept the default value `samples-workitems`. |
    |**Select how you would like to open your project**| Select `Open in current window`. |
    ::: zone-end
    ::: zone pivot="programming-language-python"
    |Prompt|Action|
    |--|--| 
    |**Select a language**| Select `Python`. |
    |**Select a Python interpreter to create a virtual environment**| Select your preferred Python interpreter. If an option isn't shown, enter the full path to your Python binary. |
    |**Select a template for your project's first function**| Select `Azure Blob Storage trigger (using Event Grid)`. |
    |**Provide a function name**| Enter `BlobTriggerEventGrid`. |
    |**Select setting from "local.settings.json"**| Select `Create new local app setting`. |
    |**Select subscription**| Select your subscription.|
    |**Select a storage account**| Use Azurite emulator for local storage. |
    |**This is the path within your storage account that the trigger will monitor**| Accept the default value `samples-workitems`. |
    |**Select how you would like to open your project**| Select `Open in current window`. |
    ::: zone-end
    ::: zone pivot="programming-language-java"
    |Prompt|Action|
    |--|--|
    |**Select a language**| Select `Java`. |
    |**Select a version of Java**| Select `Java 11` or `Java 8`, the Java version on which your functions run in Azure and that you've locally verified. |
    | **Provide a group ID** | Select `com.function`. |
    | **Provide an artifact ID** | Select `BlobTriggerEventGrid`. |
    | **Provide a version** | Select `1.0-SNAPSHOT`. |
    | **Provide a package name** | Select `com.function`. |
    | **Provide an app name** | Accept the generated name starting with `BlobTriggerEventGrid`. |
    | **Select the build tool for Java project** | Select `Maven`. |
    |**Select how you would like to open your project**| Select `Open in current window`. |
    ::: zone-end
    ::: zone pivot="programming-language-typescript"
    |Prompt|Action|
    |--|--|
    |**Select a language for your function project**| Select `TypeScript`. |
    |**Select a TypeScript programming model**| Select `Model V4`. |
    |**Select a template for your project's first function**| Select `Azure Blob Storage trigger (using Event Grid)`. |
    |**Provide a function name**| Enter `BlobTriggerEventGrid`. |
    |**Select setting from "local.settings.json"**| Select `Create new local app setting`. |
    |**Select subscription**| Select your subscription.|
    |**Select a storage account**| Use Azurite emulator for local storage. |
    |**This is the path within your storage account that the trigger will monitor**| Accept the default value `samples-workitems`. |
    |**Select how you would like to open your project**| Select `Open in current window`. |
    ::: zone-end
    ::: zone pivot="programming-language-javascript"
    |Prompt|Action|
    |--|--|
    |**Select a language for your function project**| Select `JavaScript`. |
    |**Select a JavaScript programming model**| Select `Model V4`. |
    |**Select a template for your project's first function**| Select `Azure Blob Storage trigger (using Event Grid)`. |
    |**Provide a function name**| Enter `BlobTriggerEventGrid`. |
    |**Select setting from "local.settings.json"**| Select `Create new local app setting`. |
    |**Select subscription**| Select your subscription.|
    |**Select a storage account**| Use Azurite emulator for local storage. |
    |**This is the path within your storage account that the trigger will monitor**| Accept the default value `samples-workitems`. |
    |**Select how you would like to open your project**| Select `Open in current window`. |
    ::: zone-end
    ::: zone pivot="programming-language-powershell"
    |Prompt|Action|
    |--|--|
    |**Select a language for your function project**| Select `PowerShell`. |
    |**Select a template for your project's first function**| Select `Azure Blob Storage trigger (using Event Grid)`. |
    |**Provide a function name**| Enter `BlobTriggerEventGrid`. |
    |**Select setting from "local.settings.json"**| Select `Create new local app setting`. |
    |**Select subscription**| Select your subscription.|
    |**Select a storage account**| Use Azurite emulator for local storage. |
    |**This is the path within your storage account that the trigger will monitor**| Accept the default value `samples-workitems`. |
    |**Select how you would like to open your project**| Select `Open in current window`. |
    ::: zone-end


## Upgrade the Storage extension

To use the Event Grid-based Blob Storage trigger, you must have at least version 5.x of the Azure Functions Storage extension.

::: zone pivot="programming-language-csharp"
To upgrade your project with the required extension version, in the Terminal window, run this [`dotnet add package`](/dotnet/core/tools/dotnet-add-package) command:

```bash
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs 
```

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-java"  

1. Open the host.json project file, and review the `extensionBundle` element. 

1. If `extensionBundle.version` isn't at least `3.3.0 `, replace the `extensionBundle` element with this version:

   ```json
   "extensionBundle": {
       "id": "Microsoft.Azure.Functions.ExtensionBundle",
       "version": "[4.0.0, 5.0.0)"
   }
   ```

::: zone-end

## Prepare local storage emulation

Visual Studio Code uses Azurite to emulate Azure Storage services when running locally. You use Azurite to emulate the Azure Blob Storage service during local development and testing. 

1. If haven't already done so, install the [Azurite v3 extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=Azurite.azurite). 

1. Verify that the *local.settings.json* file has `"UseDevelopmentStorage=true"` set for `AzureWebJobsStorage`, which tells Core Tools to use Azurite instead of a real storage account connection when running locally. 

1. Press F1 to open the command palette, type `Azurite: Start Blob Service`, and press enter, which starts the Azurite Blob Storage service emulator.

1. Select the Azure icon in the Activity bar, expand **Workspace** > **Attached Storage Accounts** > **Local Emulator**, right-click **Blob Containers**, select **Create Blob Container...**, enter the name `samples-workitems`, and press Enter.
 
    :::image type="content" source="media/functions-event-grid-blob-trigger/create-blob-container.png" alt-text="Screenshot showing how to select Create Blob Container in the local emulation in Visual Studio Code.":::
 
1. Expand **Blob Containers** > **samples-workitems** and select **Upload files...**.
 
    :::image type="content" source="media/functions-event-grid-blob-trigger/upload-file-blob-container.png" alt-text="Screenshot showing how to select Upload Files in the samples-workitems container in local emulation in Visual Studio Code.":::

1. Choose a file to upload to the locally emulated container. This file gets processed later by your function to verify and debug your function code. A text file might work best with the Blob trigger template code.

## Run the function locally

With a file in emulated storage, you can run your function to simulate an event raised by an Event Grid subscription. The event info passed to your trigger depends on the file you added to the local container.

1. Set any breakpoints and press F5 to start your project for local debugging. Azure Functions Core Tools should be running in your Terminal window. 

1. Back in the Azure area, expand **Workspace** > **Local Project** > **Functions**, right-click the function, and select **Execute Function Now...**.

    :::image type="content" source="media/functions-event-grid-blob-trigger/execute-function-now.png" alt-text="Screenshot showing how to select the Execute Function Now button from the function in the local project workspace in Visual Studio Code.":::

1. In the request body dialog, type `samples-workitems/<TEST_FILE_NAME>`, replacing `<TEST_FILE_NAME>` with the name of the file you uploaded in the local storage emulator. 

1. Press Enter to run the function. The value you provided is the path to your blob in the local emulator. This string gets passed to your trigger in the request payload, which simulates the payload when an event subscription calls your function to report a blob being added to the container.  

1. Review the output of this function execution. You should see in the output the name of the file and its contents logged. If you set any breakpoints, you might need to continue the execution.

Now that you've successfully validated your function code locally, it's time to publish the project to a new function app in Azure. 

## Prepare the Azure Storage account

Event subscriptions to Azure Storage require a general-purpose v2 storage account. You can use the Azure Storage extension for Visual Studio Code to create this storage account.

1. In Visual Studio Code, press F1 again to open the command palette and enter `Azure Storage: Create Storage Account...`. Provide this information when prompted:

   |Prompt|Action|
   |--|--|
   |**Enter the name of the new storage account**| Provide a globally unique name. Storage account names must have 3 to 24 characters in length with only lowercase letters and numbers. For easier identification, we use the same name for the resource group and the function app name. |
   |**Select a location for new resources**| For better performance, choose a [region near you](https://azure.microsoft.com/regions/). |

   The extension creates a general-purpose v2 storage account with the name you provided. The same name is also used for the resource group that contains the storage account. The Event Grid-based Blob Storage trigger requires a general-purpose v2 storage account.

1. Press F1 again and in the command palette enter `Azure Storage: Create Blob Container...`. Provide this information when prompted:

   |Prompt|Action|
   |--|--|
   |**Select a resource**| Select the general-purpose v2 storage account that you created. |
   |**Enter a name for the new blob container**| Enter `samples-workitems`, which is the container name referenced in your code project. |

Your function app also needs a storage account to run. For simplicity, this tutorial uses the same storage account for your blob trigger and your function app. However, in production, you might want to use a separate storage account with your function app. For more information, see [Storage considerations for Azure Functions](storage-considerations.md).

## Create the function app

Use these steps to create a function app in the Flex Consumption plan. When your app is hosted in a Flex Consumption plan, Blob Storage triggers must use event subscriptions.   

1. In the command pallet, enter **Azure Functions: Create function app in Azure...(Advanced)**.

1. Following the prompts, provide this information:

    | Prompt |  Selection |
    | ------ |  ----------- |
    | **Enter a globally unique name for the new function app.** | Type a globally unique name that identifies your new function app and then select Enter. Valid characters for a function app name are `a-z`, `0-9`, and `-`. |
    | **Select a hosting plan.** | Choose **Flex Consumption (Preview)**. |
    | **Select a runtime stack.** | Choose the language stack and version on which you've been running locally. |
    | **Select a resource group for new resources.** | Choose the existing resource group in which you created the storage account. |
    | **Select a location for new resources.** | Select a location in a supported [region](https://azure.microsoft.com/regions/) near you or near other services that your functions access. Unsupported regions aren't displayed. For more information, see [View currently supported regions](flex-consumption-how-to.md#view-currently-supported-regions).|
    | **Select a storage account.** | Choose the name of the storage account you created. |
    | **Select an Application Insights** resource for your app. | Choose **Create new Application Insights resource** and at the prompt provide the name for the instance used to store runtime data from your functions.| 

    A notification appears after your function app is created. Select **View Output** in this notification to view the creation results, including the Azure resources that you created.

## Deploy your function code

[!INCLUDE [functions-deploy-project-vs-code](../../includes/functions-deploy-project-vs-code.md)]

## Update application settings

Because required application settings from the `local.settings.json` file aren't automatically published, you must upload them to your function app so that your function runs correctly in Azure. 

1. In the command pallet, enter `Azure Functions: Download Remote Settings...`, and in the **Select a resource** prompt choose the name of your function app.

1. When prompted that the `AzureWebJobsStorage` setting already exists, select **Yes** to overwrite the local emulator setting with the actual storage account connection string from Azure.

1. In the `local.settings.json` file, replace the local emulator setting with same connection string used for`AzureWebJobsStorage`.

1. Remove the `FUNCTIONS_WORKER_RUNTIME` entry, which isn't supported in a Flex Consumption plan.   

1. In the command pallet, enter `Azure Functions: Upload Local Settings...`, and in the **Select a resource** prompt choose the name of your function app.

Now both the Functions host and the trigger are sharing the same storage account.

## Build the endpoint URL

To create an event subscription, you need to provide Event Grid with the URL of the specific endpoint to report Blob Storage events. This _blob extension_ URL is composed of these parts:

| Part | Example |
| --- | --- |
| Base function app URL | `https://<FUNCTION_APP_NAME>.azurewebsites.net` | 
| Blob-specific path | `/runtime/webhooks/blobs` |
| Function query string | `?functionName=Host.Functions.BlobTriggerEventGrid` |
| Blob extension access key | `&code=<BLOB_EXTENSION_KEY>` | 

The blob extension access key is designed to make it more difficult for others to access your blob extension endpoint. To determine your blob extension access key: 
    
1. In Visual Studio Code, choose the Azure icon in the Activity bar. In **Resources**, expand your subscription, expand **Function App**, right-click the function app you created, and select **Open in portal**.

1. Under **Functions** in the left menu, select **App keys**. 
 
1. Under **System keys** select the key named **blobs_extension**, and copy the key **Value**. 

    You include this value in the query string of new endpoint URL.  

1. Create a new endpoint URL for the Blob Storage trigger based on the following example: 

    ```http
    https://<FUNCTION_APP_NAME>.azurewebsites.net/runtime/webhooks/blobs?functionName=Host.Functions.BlobTriggerEventGrid&code=<BLOB_EXTENSION_KEY>
    ```

    In this example, replace `<FUNCTION_APP_NAME>` with the name of your function app and replace `<BLOB_EXTENSION_KEY>` with the value you got from the portal. If you used a different name for your function, you'll also need to change the `functionName` query string value to your function name.

You can now use this endpoint URL to create an event subscription.

## Create the event subscription 

An event subscription, powered by Azure Event Grid, raises events based on changes in the subscribed blob container. This event is then sent to the blob extension endpoint for your function. After you create an event subscription, you can't update the endpoint URL. 

1. In Visual Studio Code, choose the Azure icon in the Activity bar. In **Resources**, expand your subscription, expand **Storage accounts**, right-click the storage account you created earlier, and select **Open in portal**.

1. Sign in to the [Azure portal](https://portal.azure.com) and make a note of the **Resource group** for your storage account. You create your other resources in the same group to make it easier to clean up resources when you're done. 

1. select the **Events** option from the left menu.

    ![Add storage account event](./media/functions-event-grid-blob-trigger/functions-event-grid-local-dev-add-event.png)

1. In the **Events** window, select the **+ Event Subscription** button, and provide values from the following table into the **Basic** tab:  

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Name** | *myBlobEventSub* | Name that identifies the event subscription. You can use the name to quickly find the event subscription. |
    | **Event Schema** | **Event Grid Schema** | Use the default schema for events. |
    | **System Topic Name** | *samples-workitems-blobs* | Name for the topic, which represents the container. The topic is created with the first subscription, and you'll use it for future event subscriptions. |
    | **Filter to Event Types** | *Blob Created*| 
    | **Endpoint Type** |  **Web Hook** | The blob storage trigger uses a web hook endpoint. |
    | **Endpoint** | Your Azure-based URL endpoint | Use the URL endpoint that you built, which includes the key value. |

1. Select **Confirm selection** to validate the endpoint URL. 

1. Select **Create** to create the event subscription.

## Upload a file to the container

You can upload a file from your computer to your blob storage container using Visual Studio Code. 

1. In Visual Studio Code, press F1 to open the command palette and type `Azure Storage: Upload Files...`. 

1. In the **Open** dialog box, choose a file, preferably a text file, and select **Upload** .

1. Provide the following information at the prompts:  

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Enter the destination directory of this upload** | default | Just accept the default value of `/`, which is the container root. |
    | **Select a resource** | Storage account name | Choose the name of the storage account you created in a previous step. |
    | **Select a resource type** | **Blob Containers** | You're uploading to a blob container. |
    | **Select Blob Container** | **samples-workitems** | This value is the name of the container you created in a previous step. |
   
Browse your local file system to find a file to upload and then select the **Upload** button to upload the file.

## Verify the function in Azure

Now that you uploaded a file to the **samples-workitems** container, the function should be triggered. You can verify by checking the following on the Azure portal: 

1. In your storage account, go to the **Events** page, select **Event Subscriptions**, and you should see that an event was delivered. There might be up a five-minute delay for the event to show up on the chart. 
  
1. Back in your function app page in the portal, under **Functions** find your function and select **Invocations and more**. You should see traces written from your successful function execution. 

[!INCLUDE [functions-cleanup-resources-vs-code.md](../../includes/functions-cleanup-resources-vs-code.md)]

## Next steps

+ [Working with blobs](storage-considerations.md#working-with-blobs)
- [Automate resizing uploaded images using Event Grid](../event-grid/resize-images-on-storage-blob-upload-event.md)
- [Event Grid trigger for Azure Functions](./functions-bindings-event-grid.md)
