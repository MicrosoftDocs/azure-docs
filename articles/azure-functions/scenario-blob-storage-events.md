---
title: Respond to blob storage events using Azure Functions
description: "Learn how to use the Azure Developer CLI (azd) to create resources and deploy a local project to a Flex Consumption plan on Azure Functions. The project features a Blob Storage trigger that runs in response to blob storage events."
ms.date: 12/02/2025
ms.topic: quickstart
zone_pivot_groups: programming-languages-set-functions
#Customer intent: As a developer, I need to know how to use the Azure Developer CLI to create and deploy an event-based Blob trigger function project securely to a new function app in the Flex Consumption plan in Azure Functions by using azd templates and the azd up command.
---

# Quickstart: Respond to blob storage events by using Azure Functions

In this quickstart, you use Visual Studio Code to build an app that responds to events in a Blob Storage container. After testing the code locally by using an emulator, you deploy it to a new serverless function app running in a Flex Consumption plan in Azure Functions.

The project uses the Azure Developer CLI (`azd`) extension with Visual Studio Code to simplify initializing and verifying your project code locally, as well as deploying your code to Azure. This deployment follows current best practices for secure and scalable Azure Functions deployments.

::: zone pivot="programming-language-javascript,programming-language-typescript"
This article supports version 4 of the Node.js programming model for Azure Functions.
::: zone-end
::: zone pivot="programming-language-python"
This article supports version 2 of the Python programming model for Azure Functions.
::: zone-end  
[!INCLUDE [functions-scenario-quickstarts-prerequisites-full](../../includes/functions-scenario-quickstarts-prerequisites-full.md)]
+ [Azure Storage extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage)

+ [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) or an equivalent REST tool you use to securely execute HTTP requests. 

## Initialize the project

Use the `azd init` command from the command palette to create a local Azure Functions code project from a template.
 
1. In Visual Studio Code, open a folder or workspace where you want to create your project.

1. Press <kbd>F1</kbd> to open the command palette, search for and run the command `Azure Developer CLI (azd): Initialize App (init)`, then choose **Select a template**.

    There might be a slight delay while `azd` initializes the current folder or workspace.  

::: zone pivot="programming-language-csharp"
3. When prompted, choose **Select a template**, then search for and select `Azure Functions C# Event Grid Blob Trigger using Azure Developer CLI`. 

4. When prompted in the terminal, enter a unique environment name, such as `blobevents-dotnet`.

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-eventgrid-blob) and initializes the project in the current folder or workspace.
::: zone-end
::: zone pivot="programming-language-python"
3. When prompted, choose **Select a template**, then search for and select `Azure Functions Python Event Grid Blob Trigger using Azure Developer CLI`. 

4. When prompted in the terminal, enter a unique environment name, such as `blobevents-python`.

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-python-azd-eventgrid-blob) and initializes the project in the current folder or workspace.
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
3. When prompted, choose **Select a template**, then search for and select `Azure Functions TypeScript Event Grid Blob Trigger using Azure Developer CLI`. 

4. When prompted, enter a unique environment name, such as `blobevents-typescript`.

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-typescript-azd-eventgrid-blob) and initializes the project in the current folder or workspace.
::: zone-end
::: zone pivot="programming-language-java"
3. When prompted, choose **Select a template**, then search for and select `Azure Functions Java Event Grid Blob Trigger using Azure Developer CLI`. 

4. When prompted, enter a unique environment name, such as `blobevents-java`.

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-java-azd-eventgrid-blob) and initializes the project in the current folder or workspace.
::: zone-end
::: zone pivot="programming-language-powershell"
3. When prompted, choose **Select a template**, then search for and select `Azure Functions PowerShell Event Grid Blob Trigger using Azure Developer CLI`. 

4. When prompted, enter a unique environment name, such as `blobevents-powershell`.

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-powershell-azd-eventgrid-blob) and initializes the project in the current folder or workspace.
::: zone-end

In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. It's also part of the name of the resource group you create in Azure.

## Add the local.settings.json file

Functions needs the local.settings.json file to configure the host when running locally.

1. Run this command to go to the `src` app folder:

    ```console
    cd src
    ```

::: zone pivot="programming-language-csharp"
2. Create a file named _local.settings.json_ in the `src` folder that contains this JSON data:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
            "PDFProcessorSTORAGE": "UseDevelopmentStorage=true"
        }
    }
    ```
::: zone-end
::: zone pivot="programming-language-java"
2. Create a file named _local.settings.json_ in the `src` folder that contains this JSON data:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "FUNCTIONS_WORKER_RUNTIME": "java",
            "PDFProcessorSTORAGE": "UseDevelopmentStorage=true"
        }
    }
    ```
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
2. Create a file named _local.settings.json_ in the `src` folder that contains this JSON data:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "FUNCTIONS_WORKER_RUNTIME": "node",
            "PDFProcessorSTORAGE": "UseDevelopmentStorage=true"
        }
    }
    ```
::: zone-end
::: zone pivot="programming-language-powershell"
2. Create a file named _local.settings.json_ in the `src` folder that contains this JSON data:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "FUNCTIONS_WORKER_RUNTIME": "powershell",
            "FUNCTIONS_WORKER_RUNTIME_VERSION": "7.2",
            "PDFProcessorSTORAGE": "UseDevelopmentStorage=true"
        }
    }
    ```
::: zone-end
::: zone pivot="programming-language-python"
2. Create a file named _local.settings.json_ in the `src` folder that contains this JSON data:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "FUNCTIONS_WORKER_RUNTIME": "python",
            "PDFProcessorSTORAGE": "UseDevelopmentStorage=true"
        }
    }
    ```

## Create and activate a virtual environment

In the `src` folder, run these commands to create and activate a virtual environment named `.venv`:

### [Linux/macOS](#tab/linux)

```bash
python3 -m venv .venv
source .venv/bin/activate
```

If Python doesn't install the venv package on your Linux distribution, run the following command:

```bash
sudo apt-get install python3-venv
```

### [Windows (bash)](#tab/windows-bash)

```bash
py -m venv .venv
source .venv/scripts/activate
```

### [Windows (Cmd)](#tab/windows-cmd)

```shell
py -m venv .venv
.venv\scripts\activate
```

---

::: zone-end

## Set up local storage emulator

Use the Azurite emulator to run your code project locally before creating and using Azure resources.

1. If you haven't already, [install Azurite](/azure/storage/common/storage-use-azurite#install-azurite).

1. Press <kbd>F1</kbd>. In the command palette, search for and run the command `Azurite: Start` to start the local storage emulator.

1. In the **Azure** area, expand **Workspace** > **Attached Storage Accounts** > **Local Emulator**, right-click (Ctrl-click on Mac) **Blob Containers**, select **Create Blob Container...**, and create these two blob storage containers in the local emulator: 

   - `unprocessed-pdf`: container that the trigger monitors for storage events.
   - `processed-pdf`: container where the function sends processed blobs as output.

1. Expand **Blob Containers**, right-click (Ctrl-click on Mac) **unprocessed-pdf**, select **Upload Files...**, press <kbd>Enter</kbd> to accept the root directory, and upload the PDF files from the `data` project folder. 

When running locally, you can use REST to trigger the function by simulating the function receiving a message from an event subscription.   

## Run the function locally  

Visual Studio Code integrates with [Azure Functions Core tools](functions-run-local.md) to let you run this project on your local development computer by using the Azurite emulator. The `PDFProcessorSTORAGE` environment variable defines the storage account connection, which is also set to `"UseDevelopmentStorage=true"` in the local.settings.json file when running locally.

<!--- replace when F5 is working for all langs
1. To start the function locally, press <kbd>F5</kbd> or the **Run and Debug** icon in the left-hand side Activity bar. The **Terminal** panel displays the output from Core Tools. Your app starts in the **Terminal** panel, and you can see the name of the function that's running locally.

    If you have trouble running on Windows, make sure that the default terminal for Visual Studio Code isn't set to **WSL Bash**.
-->
1. Run this command from the `src` project folder in a terminal or command prompt:

    ::: zone pivot="programming-language-csharp, programming-language-powershell,programming-language-python" 
    ```console
    func start
    ``` 
    ::: zone-end  
    ::: zone pivot="programming-language-java"  
    ```console
    mvn clean package
    mvn azure-functions:run
    ```
    ::: zone-end  
    ::: zone pivot="programming-language-javascript"  
    ```console
    npm install
    func start  
    ```
    ::: zone-end  
    ::: zone pivot="programming-language-typescript"  
    ```console
    npm install
    npm start  
    ```
    ::: zone-end  

    When the Functions host starts, it writes the name of the trigger and the trigger type to the terminal output. In Functions, the project root folder contains the host.json file.  

1. With Core Tools still running in **Terminal**, open the `test.http` file in your project and select **Send Request** to trigger the `ProcessBlobUpload` function by sending a test blob event to the blob event webhook. 

    This step simulates receiving an event from an event subscription when running locally, and you should see the request and processed file information written in the logs. If you aren't using _REST Client_, you must use another secure REST tool to call the endpoint with the payload in `test.http`. 

1. In the Workspace area for the blob container, expand **processed-pdf** and verify that the function processed the PDF file and copied it with a `processed-` prefix. 

1. When you're done, press Ctrl+C in the terminal window to stop the `func.exe` host process.

## Review the code (optional)

::: zone pivot="programming-language-csharp"
You can review the code that defines the Event Grid blob trigger in the [ProcessBlobUpload.cs project file](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-eventgrid-blob/blob/main/src/ProcessBlobUpload.cs). The function demonstrates how to:

- Use `BlobTrigger` with `Source = BlobTriggerSource.EventGrid` for near real-time processing
- Bind to `BlobClient` for the source blob and `BlobContainerClient` for the destination
- Process blob content and copy it to another container by using streams
::: zone-end
::: zone pivot="programming-language-python"
You can review the code that defines the Event Grid blob trigger in the [function_app.py project file](https://github.com/Azure-Samples/functions-quickstart-python-azd-eventgrid-blob/blob/main/src/function_app.py). The function demonstrates how to:

- Use `@app.blob_trigger` with `source="EventGrid"` for near real-time processing
- Access blob content using the `InputStream` parameter
- Copy processed files to the destination container using the Azure Storage SDK
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
You can review the code that defines the Event Grid blob trigger in the [processBlobUpload.ts project file](https://github.com/Azure-Samples/functions-quickstart-typescript-azd-eventgrid-blob/blob/main/src/functions/processBlobUpload.ts). The function demonstrates how to:

- Use `app.storageBlob()` with `source: 'EventGrid'` for near real-time processing
- Access blob content using the Node.js Azure Storage SDK
- Process and copy files to the destination container asynchronously
::: zone-end
::: zone pivot="programming-language-java"
You can review the code that defines the Event Grid blob trigger in the [ProcessBlobUpload.java project file](https://github.com/Azure-Samples/functions-quickstart-java-azd-eventgrid-blob/blob/main/src/src/main/java/com/microsoft/azure/samples/ProcessBlobUpload.java). The function demonstrates how to:

- Use `@BlobTrigger` with `source = "EventGrid"` for near real-time processing
- Access blob content using `BlobInputStream` parameter
- Copy processed files to the destination container using Azure Storage SDK for Java
::: zone-end
::: zone pivot="programming-language-powershell"
You can review the code that defines the Event Grid blob trigger in the [ProcessBlobUpload/run.ps1 project file](https://github.com/Azure-Samples/functions-quickstart-powershell-azd-eventgrid-blob/blob/main/src/processBlobUpload/run.ps1) and the corresponding [function.json](https://github.com/Azure-Samples/functions-quickstart-powershell-azd-eventgrid-blob/blob/main/src/processBlobUpload/function.json). The function demonstrates how to:

- Configure blob trigger with `"source": "EventGrid"` in function.json for near real-time processing
- Access blob content using PowerShell Azure Storage cmdlets
- Process and copy files to the destination container using Azure PowerShell modules
::: zone-end

After you review and verify your function code locally, it's time to publish the project to Azure.

## Create Azure resources and deploy

Use the `azd up` command to create the function app in a Flex Consumption plan along with other required Azure resources, including the event subscription. After the infrastructure is ready, `azd` also deploys your project code to the new function app in Azure.

1. In Visual Studio Code, press <kbd>F1</kbd> to open the command palette. Search for and run the command `Azure Developer CLI (azd): Sign In with Azure Developer CLI`, then sign in by using your Azure account.

1. In the project root, press <kbd>F1</kbd> to open the command palette. Search for and run the command `Azure Developer CLI (azd): Provision and Deploy (up)` to create the required Azure resources and deploy your code.

1. When prompted in the Terminal window, provide these required deployment parameters:

    | Prompt | Description |
    | ---- | ---- |
    | Select an Azure Subscription to use | Choose the subscription in which you want to create your resources.|
    | _Environment name_ | An environment that's used to maintain a unique deployment context for your app.|
    | _Azure location_ | Azure region in which to create the resource group that contains the new Azure resources. Only regions that currently support the Flex Consumption plan are shown.|
    
    The `azd up` command uses your responses to these prompts with the Bicep configuration files to create and configure these required Azure resources, following the latest best practices:

    + Flex Consumption plan and function app
    + Azure Storage account with blob containers
    + Application Insights (recommended)
    + Access policies and roles for your account
    + Event Grid subscription for blob events
    + Service-to-service connections by using managed identities (instead of stored connection strings)

    After the command completes successfully, your app runs in Azure with an event subscription configured to trigger your function when blobs are added to the `unprocessed-pdf` container. 

1. Make a note of the `AZURE_STORAGE_ACCOUNT_NAME` and `AZURE_FUNCTION_APP_NAME` in the output. These names are unique for your storage account and function app in Azure, respectively.

## Verify the deployed function

1. In Visual Studio Code, press <kbd>F1</kbd>. In the command palette, search for and run the command `Azure Storage: Upload Files...`. Accept the root directory, and as before, upload one or more PDF files from the `data` project folder. 

1. When prompted, select the name of your new storage account (from `AZURE_STORAGE_ACCOUNT_NAME`). Select **Blob Containers** > **unprocessed-pdf**.
 
1. Press <kbd>F1</kbd>. In the command palette, search for and run the command `Azure Storage: Open in Explorer`. Select the same storage account > **Blob Containers** > **processed-pdf**, then **Open in new window**. 

1. In the Explorer, verify that the PDF files you uploaded were processed by your function. The output is written to the `processed-pdf` container with a `processed-` prefix. 

The Event Grid blob trigger processes files within seconds of upload. This speed demonstrates the near real-time capabilities of this approach compared to traditional polling-based blob triggers.

## Redeploy your code

Run the `azd up` command as many times as you need to both provision your Azure resources and deploy code updates to your function app.

>[!NOTE]
>Deployed code files are always overwritten by the latest deployment package.

Your initial responses to `azd` prompts and any environment variables generated by `azd` are stored locally in your named environment. Use the `azd env get-values` command to review all of the variables in your environment that were used when creating Azure resources. 

## Clean up resources

When you're done working with your function app and related resources, use this command to delete the function app and its related resources from Azure. This action helps you avoid incurring any further costs:

```console
azd down --no-prompt
```

>[!NOTE]  
>The `--no-prompt` option instructs `azd` to delete your resource group without a confirmation from you. 
>
>This command doesn't affect your local code project. 

## Related content

+ [Azure Functions scenarios](functions-scenarios.md)
+ [Flex Consumption plan](flex-consumption-plan.md)
+ [Tutorial: Trigger Azure Functions on blob containers using an event subscription](functions-event-grid-blob-trigger.md)
+ [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/)
+ [azd reference](/azure/developer/azure-developer-cli/reference)
+ [Azure Functions Core Tools reference](functions-core-tools-reference.md)
+ [Code and test Azure Functions locally](functions-develop-local.md)