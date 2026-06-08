---
title: "Quickstart: Create a PowerShell Durable Functions app"
description: "Learn how to create, test, and publish a PowerShell Durable Functions app in Azure Functions using Visual Studio Code. Follow this step-by-step quickstart to get started."
author: anthonychu
ms.author: hannahhunter
ms.topic: quickstart
ms.service: azure-functions
ms.date: 07/24/2024
ms.reviewer: azfuncdf, antchu
ms.devlang: powershell
ms.custom: mode-api, vscode-azure-extension-update-complete
---

# Quickstart: Create a PowerShell Durable Functions app

In this quickstart, you use Visual Studio Code to create and test a PowerShell [Durable Functions](../functions-overview.md) app that orchestrates and chains together calls to other functions. You then publish it to Azure.

Durable Functions manages state, checkpoints, and restarts in your application, letting you write stateful workflows in a serverless environment.

## Prerequisites

To complete this quickstart, you need:

* [Visual Studio Code](https://code.visualstudio.com/download) installed.

* The Visual Studio Code extension [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) installed.

* The latest version of [Azure Functions Core Tools](../functions-run-local.md) installed.

* An HTTP test tool that keeps your data secure. For more information, see [HTTP test tools](../functions-develop-local.md#http-test-tools).

* An Azure subscription. To use Durable Functions, you must have an Azure Storage account.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project.

1. In Visual Studio Code, select F1 (or select Ctrl/Cmd+Shift+P) to open the command palette. At the prompt (`>`), enter and then select **Azure Functions: Create New Project**.

   :::image type="content" source="media/quickstart-js-vscode/functions-create-project.png" alt-text="Screenshot of the Create New Project command in Visual Studio Code for Azure Functions.":::

1. Select **Browse**. In the **Select Folder** dialog, go to a folder to use for your project, and then choose **Select**.

1. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a language for your function app project** | Select **PowerShell**. | Creates a local PowerShell Functions project. |
    | **Select a version** | Select **Azure Functions v4**. | You see this option only when Core Tools isn't already installed. In this case, Core Tools is installed the first time you run the app. |
    | **Select a template for your project's first function** | Select **Skip for now**. | |
    | **Select how you would like to open your project** | Select **Open in current window**. | Opens Visual Studio Code in the folder you selected. |

Visual Studio Code installs Azure Functions Core Tools if it's required to create a project. It also creates a function app project in a folder. This project contains the [host.json](../functions-host-json.md) and [local.settings.json](../functions-develop-local.md#local-settings-file) configuration files.

A *package.json* file is also created in the root folder.

### Configure the standalone Durable Functions SDK

The standalone SDK provides the best performance and latest features for PowerShell Durable Functions. Configure it in three steps:

**Step 1:** Open `local.settings.json` and verify the following settings are present. Add or update them if needed:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "powershell",
    "FUNCTIONS_WORKER_RUNTIME_VERSION" : "7.4",
    "ExternalDurablePowerShellSDK": "true"
  }
}
```

**Step 2:** Open `requirements.psd1` and add the SDK dependency:

```PowerShell
@{
    'AzureFunctions.PowerShell.Durable.SDK' = '2.*'
}
```

The `2.*` specifier ensures you get the latest stable 2.x version from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureFunctions.PowerShell.Durable.SDK).

**Step 3:** Add the following line to the end of your `profile.ps1` file:

```PowerShell
Import-Module AzureFunctions.PowerShell.Durable.SDK -ErrorAction Stop
```

## Create your functions

A basic Durable Functions app has three functions:

| Function type | Purpose |
| --- | --- |
| **Orchestrator** | A workflow that orchestrates other functions. |
| **Activity** | Called by the orchestrator to perform work and return a value. |
| **Client (HTTP starter)** | An HTTP-triggered function that starts an orchestrator. |

For each function, open the command palette and select **Azure Functions: Create Function**, then provide the prompted values:

### 1. Orchestrator function

| Prompt | Value |
| --- | --- |
| **Select a template** | **Durable Functions orchestrator** |
| **Function name** | **HelloOrchestrator** |

Open *HelloOrchestrator/run.ps1* to see the orchestrator. Each call to `Invoke-ActivityFunction` invokes the `Hello` activity function.

### 2. Activity function

| Prompt | Value |
| --- | --- |
| **Select a template** | **Durable Functions activity** |
| **Function name** | **Hello** |

Open *Hello/run.ps1* to see that it takes a name as input and returns a greeting. Activity functions are where you perform actions such as database calls or computations.

### 3. Client function (HTTP starter)

| Prompt | Value |
| --- | --- |
| **Select a template** | **Durable Functions HTTP starter** |
| **Function name** | **HttpStart** |
| **Authorization level** | **Anonymous** (for demo purposes) |

Open *HttpStart/run.ps1* to verify it uses `Start-NewOrchestration` to start a new orchestration and `New-OrchestrationCheckStatusResponse` to return an HTTP response with monitoring URLs.

You now have a Durable Functions app that you can run locally and deploy to Azure.

> [!TIP]
> This quickstart uses the standalone Durable Functions PowerShell SDK. For more information about the SDK and migration from the legacy built-in version, see the [standalone PowerShell SDK guide](./durable-functions-powershell-v2-sdk-migration-guide.md).

## Test the function locally

Azure Functions Core Tools gives you the capability to run an Azure Functions project on your local development computer. You're prompted to install these tools the first time you start a function in Visual Studio.

1. To test your function, set a breakpoint in the `Hello` activity function code (in *Hello/run.ps1*). Select F5 or select **Debug: Start Debugging** in the command palette to start the function app project. Output from Core Tools appears in the terminal panel.

   > [!NOTE]
   > For more information about debugging, see [Durable Functions diagnostics](durable-functions-diagnostics.md#debugging).

1. Durable Functions requires a storage account to run. You can use the [Azurite storage emulator](../../storage/common/storage-use-azurite.md) for local development, or create an Azure storage account when prompted. If Visual Studio Code prompts you to select a storage account, choose **Select storage account**.

1. At the prompts, provide the following information to create a new storage account in Azure.

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select subscription** | Select the name of your subscription. | Your Azure subscription. |
    | **Select a storage account** | Select **Create a new storage account**. |  |
    | **Enter the name of the new storage account** | Enter a unique name. | The name of the storage account to create. |
    | **Select a resource group** | Enter a unique name. | The name of the resource group to create. |
    | **Select a location** | Select an Azure region. | Select a region that is close to you. |

1. In the terminal panel, copy the URL endpoint of your HTTP-triggered function.

1. Use your browser or an HTTP test tool to send an HTTP POST request to the URL endpoint.

   Replace the last segment with the name of the orchestrator function (`HelloOrchestrator`). The URL should be similar to `http://localhost:7071/api/orchestrators/HelloOrchestrator`.

   The response is the HTTP function's initial result. It lets you know that the durable orchestration started successfully. It doesn't yet display the end result of the orchestration. The response includes a few useful URLs. For now, query the status of the orchestration.

1. Copy the URL value for `statusQueryGetUri`, paste it in the browser's address bar, and execute the request. You can also continue to use your HTTP test tool to issue the GET request.

   The request queries the orchestration instance for the status. You should see a response showing the instance completed, with the outputs of the durable function:

    ```json
    {
        "name": "HelloOrchestrator",
        "instanceId": "9a528a9e926f4b46b7d3deaa134b7e8a",
        "runtimeStatus": "Completed",
        "input": null,
        "customStatus": null,
        "output": [
            "Hello Tokyo!",
            "Hello Seattle!",
            "Hello London!"
        ],
        "createdTime": "2020-03-18T21:54:49Z",
        "lastUpdatedTime": "2020-03-18T21:54:54Z"
    }
    ```

1. To stop debugging, in Visual Studio Code, select Shift+F5.

After you verify that the function runs correctly on your local computer, it's time to publish the project to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../../includes/functions-sign-in-vs-code.md)]

[!INCLUDE [functions-publish-project-vscode](../../../includes/functions-publish-project-vscode.md)]

## Test your function in Azure

1. In the Azure portal (or using the Azure CLI), verify the app setting `ExternalDurablePowerShellSDK` is set to `true`. If it's missing, add it under **Settings** > **Environment variables** and restart the function app.

1. Copy the URL of the HTTP trigger from the output panel. The URL should be in this format:

   `https://<functionappname>.azurewebsites.net/api/orchestrators/HelloOrchestrator`

1. Send an HTTP POST request to the URL. You should get the same status response that you got when you tested locally.

If the orchestration doesn't start, check the function app logs in the Azure portal under **Monitor** > **Log stream** for errors related to the SDK import or storage connectivity.

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid related costs in your Azure subscription, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group) and all related resources.

## Related content

* [Common Durable Functions app patterns](../../durable-task/common/durable-task-sequence.md)
* [Standalone PowerShell SDK guide](./durable-functions-powershell-v2-sdk-migration-guide.md)
* [Durable Functions diagnostics and monitoring](durable-functions-diagnostics.md)
* [PowerShell developer reference for Azure Functions](../functions-reference-powershell.md)
