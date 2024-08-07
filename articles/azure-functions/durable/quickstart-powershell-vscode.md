---
title: "Quickstart: Create a PowerShell Durable Functions app"
description: Create and publish a PowerShell Durable Functions app in Azure Functions by using Visual Studio Code.
author: anthonychu
ms.topic: quickstart
ms.date: 07/24/2024
ms.reviewer: azfuncdf, antchu
ms.devlang: powershell
ms.custom: mode-api, vscode-azure-extension-update-complete
---

# Quickstart: Create a PowerShell Durable Functions app

Use Durable Functions, a feature of [Azure Functions](../functions-overview.md), to write stateful functions in a serverless environment. You install Durable Functions by installing the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) in Visual Studio Code. The extension manages state, checkpoints, and restarts in your application.

In this quickstart, you use the Durable Functions extension in Visual Studio Code to locally create and test a "hello world" Durable Functions app in Azure Functions. The Durable Functions app orchestrates and chains together calls to other functions. Then, you publish the function code to Azure. The tools you use are available via the Visual Studio Code extension.

![Running a Durable Functions app in Azure.](./media/quickstart-js-vscode/functions-vs-code-complete.png)

## Prerequisites

To complete this quickstart, you need:

* [Visual Studio Code](https://code.visualstudio.com/download) installed.

* The Visual Studio Code extension [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) installed.

* The latest version of [Azure Functions Core Tools](../functions-run-local.md) installed.

* An Azure subscription. To use Durable Functions, you must have an Azure Storage account.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project.

1. In Visual Studio Code, select F1 (or select Ctrl/Cmd+Shift+P) to open the command palette. At the prompt (`>`), enter and then select **Azure Functions: Create New Project**.

   :::image type="content" source="media/quickstart-js-vscode/functions-create-project.png" alt-text="Screenshot that shows the Create a function command.":::

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

### Configure the function app to use PowerShell 7

Open the *local.settings.json* file and confirm that a setting named `FUNCTIONS_WORKER_RUNTIME_VERSION` is set to `~7`. If it's missing or if it's set to another value, update the contents of the file.

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "powershell",
    "FUNCTIONS_WORKER_RUNTIME_VERSION" : "~7"
  }
}
```

## Create your functions

The most basic Durable Functions app has three functions:

* **Orchestrator function**: A workflow that orchestrates other functions.
* **Activity function**:  A function that is called by the orchestrator function, performs work, and optionally returns a value.
* **Client function**: A regular function in Azure that starts an orchestrator function. This example uses an HTTP-triggered function.

### Orchestrator function

Use a template to create the Durable Functions app code in your project.

1. In the command palette, enter and then select **Azure Functions: Create Function**.

1. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a template for your function** | Enter **Durable Functions orchestrator**. | Creates a Durable Functions app orchestration. |
    | **Provide a function name** | Enter **HelloOrchestrator**. | A name for your durable function. |

You added an orchestrator to coordinate activity functions. Open *HelloOrchestrator/run.ps1* to see the orchestrator function. Each call to the Invoke-ActivityFunction cmdlet invokes an activity function named `Hello`.

Next, you add the referenced `Hello` activity function.

### Activity function

1. In the command palette, enter and then select **Azure Functions: Create Function**.

1. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a template for your function** | Select **Durable Functions activity**. | Creates an activity function. |
    | **Provide a function name** | Enter **Hello**. | The name of your activity function. |

You added the `Hello` activity function that is invoked by the orchestrator. Open *Hello/run.ps1* to see that it's taking a name as input and returning a greeting. An activity function is where you perform actions such as making a database call or performing a computation.

Finally, you add an HTTP-triggered function that starts the orchestration.

### Client function (HTTP starter)

1. In the command palette, enter and then select **Azure Functions: Create Function**.

1. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a template for your function** | Select **Durable Functions HTTP starter**. | Creates an HTTP starter function. |
    | **Provide a function name** | Enter **HttpStart**. | The name of your activity function. |
    | **Authorization level** | Select **Anonymous**. | For demo purposes, this value allows the function to be called without using authentication. |

You added an HTTP-triggered function that starts an orchestration. Open *HttpStart/run.ps1* to check that it uses the Start-NewOrchestration cmdlet to start a new orchestration. Then it uses the New-OrchestrationCheckStatusResponse cmdlet to return an HTTP response that contains URLs that can be used to monitor and manage the new orchestration.

You now have a Durable Functions app that you can run locally and deploy to Azure.

> [!NOTE]
> The next version of the Durable Functions PowerShell application is now in preview. You can download it from the PowerShell Gallery. Learn more about it and learn how to try it out in the [guide to the standalone PowerShell SDK](./durable-functions-powershell-v2-sdk-migration-guide.md). You can follow the guide's [installation section](./durable-functions-powershell-v2-sdk-migration-guide.md#install-and-enable-the-sdk) for instructions that are compatible with this quickstart to enable it.

## Test the function locally

Azure Functions Core Tools gives you the capability to run an Azure Functions project on your local development computer. You're prompted to install these tools the first time you start a function in Visual Studio.

1. To test your function, set a breakpoint in the `Hello` activity function code (in *Hello/run.ps1*). Select F5 or select **Debug: Start Debugging** in the command palette to start the function app project. Output from Core Tools appears in the terminal panel.

   > [!NOTE]
   > For more information about debugging, see [Durable Functions diagnostics](durable-functions-diagnostics.md#debugging).

1. Durable Functions requires an Azure storage account to run. When Visual Studio Code prompts you to select a storage account, choose **Select storage account**.

   :::image type="content" source="media/quickstart-js-vscode/functions-select-storage.png" alt-text="Screenshot that shows the Create storage account command.":::

1. At the prompts, provide the following information to create a new storage account in Azure.

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select subscription** | Select the name of your subscription. | Your Azure subscription. |
    | **Select a storage account** | Select **Create a new storage account**. |  |
    | **Enter the name of the new storage account** | Enter a unique name. | The name of the storage account to create. |
    | **Select a resource group** | Enter a unique name. | The name of the resource group to create. |
    | **Select a location** | Select an Azure region. | Select a region that is close to you. |

1. In the terminal panel, copy the URL endpoint of your HTTP-triggered function.

   :::image type="content" source="media/quickstart-js-vscode/functions-f5.png" alt-text="Screenshot of Azure local output.":::

1. Use your browser or one of these HTTP test tools to send an HTTP POST request to the URL endpoint: 

   [!INCLUDE [api-test-http-request-tools](../../../includes/api-test-http-request-tools.md)]

   Replace the last segment with the name of the orchestrator function (`HelloOrchestrator`). The URL should be similar to `http://localhost:7071/api/orchestrators/HelloOrchestrator`.

   The response is the HTTP function's initial result. It lets you know that the durable orchestration started successfully. It doesn't yet display the end result of the orchestration. The response includes a few useful URLs. For now, query the status of the orchestration.

1. Copy the URL value for `statusQueryGetUri`, paste it in the browser's address bar, and execute the request. You can also continue to use your HTTP test tool to issue the GET request.

   The request queries the orchestration instance for the status. You must get an eventual response, which shows the instance completed and includes the outputs or results of the durable function. It looks like this example:

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

1. Copy the URL of the HTTP trigger from the output panel. The URL that calls your HTTP-triggered function should be in this format:

   `https://<functionappname>.azurewebsites.net/api/orchestrators/HelloOrchestrator`

1. Paste the new URL for the HTTP request in your browser's address bar. When you use the published app, you can expect to get the same status response that you got when you tested locally.

The PowerShell Durable Functions app that you created and published by using Visual Studio Code is ready to use.

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid related costs in your Azure subscription, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group) and all related resources.

## Related content

* Learn about [common Durable Functions app patterns](durable-functions-overview.md#application-patterns).
