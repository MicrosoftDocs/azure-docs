---
title: "Quickstart: Create a C# Durable Functions app"
description: Create and publish a C# Durable Functions app in Azure Functions by using Visual Studio or Visual Studio Code.
author: lilyjma
ms.topic: quickstart
ms.date: 07/24/2024
ms.author: azfuncdf
zone_pivot_groups: code-editors-set-one
ms.devlang: csharp
ms.custom: mode-other, devdivchpfy22, vscode-azure-extension-update-complete, devx-track-dotnet
---

# Quickstart: Create a C# Durable Functions app

Use Durable Functions, a feature of [Azure Functions](../functions-overview.md), to write stateful functions in a serverless environment. Durable Functions manages state, checkpoints, and restarts in your application.

Like Azure Functions, Durable Functions supports two process models for .NET class library functions. To learn more about the two processes, see [Differences between in-process and isolated worker process .NET Azure Functions](../dotnet-isolated-in-process-differences.md).

::: zone pivot="code-editor-vscode"

In this quickstart, you use Visual Studio Code to locally create and test a "hello world" Durable Functions app. The function app orchestrates and chains together calls to other functions. Then, you publish the function code in Azure. The tools you use are available via the Visual Studio Code [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).

:::image type="content" source="./media/durable-functions-create-first-csharp/functions-vscode-complete.png" alt-text="Screenshot that shows Durable Functions app code in Visual Studio Code.":::

## Prerequisites

To complete this quickstart, you need:

* [Visual Studio Code](https://code.visualstudio.com/download) installed.

* The following Visual Studio Code extensions installed:

  * [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
  * [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)

* The latest version of [Azure Functions Core Tools](../functions-run-local.md) installed.

* An Azure subscription. To use Durable Functions, you must have an Azure Storage account.

* [.NET Core SDK](https://dotnet.microsoft.com/download) version 3.1 or later installed.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## <a name="create-an-azure-functions-project"></a>Create an Azure Functions project

In Visual Studio Code, create a local Azure Functions project.

1. On the **View** menu, select **Command Palette** (or select Ctrl+Shift+P).

1. At the prompt (`>`), enter and then select **Azure Functions: Create New Project**.

    :::image type="content" source="media/durable-functions-create-first-csharp/functions-vscode-create-project.png" alt-text="Screenshot that shows the command to create a Functions project.":::

1. Select **Browse**. In the **Select Folder** dialog, go to a folder to use for your project, and then choose **Select**.

1. At the prompts, select or enter the following values:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a language for your function app project** | Select **C#**. | Creates a local C# Functions project. |
    | **Select a version** | Select **Azure Functions v4**. | You see this option only when Core Tools isn't already installed. Core Tools is installed the first time you run the app. |
    | **Select a .NET runtime** | Select **.NET 8.0 isolated**. | Creates a Functions project that supports .NET 8 running in an isolated worker process and the Azure Functions Runtime 4.0. For more information, see [How to target Azure Functions runtime version](../functions-versions.md).  |
    | **Select a template for your project's first function** | Select **Durable Functions Orchestration**. | Creates a Durable Functions orchestration. |
    | **Choose a durable storage type** | Select **Azure Storage**. | The default storage provider for Durable Functions. For more information, see [Durable Functions storage providers](./durable-functions-storage-providers.md). |
    | **Provide a function name** | Enter **HelloOrchestration**. | A name for the orchestration function. |
    | **Provide a namespace** | Enter **Company.Function**. | A namespace for the generated class. |
    | **Select how you would like to open your project** | Select **Open in current window**. | Opens Visual Studio Code in the folder you selected. |

Visual Studio Code installs Azure Functions Core Tools if it's required to create the project. It also creates a function app project in a folder. This project contains the [host.json](../functions-host-json.md) and [local.settings.json](../functions-develop-local.md#local-settings-file) configuration files.

Another file, *HelloOrchestration.cs*, contains the basic building blocks of a Durable Functions app:

| Method | Description |
| -----  | ----------- |
| `HelloOrchestration` | Defines the Durable Functions app orchestration. In this case, the orchestration starts, creates a list, and then adds the result of three functions calls to the list. When the three function calls finish, it returns the list. |
| `SayHello` | A simple function app that returns *hello*. This function contains the business logic that is orchestrated. |
| `HelloOrchestration_HttpStart` | An [HTTP-triggered function](../functions-bindings-http-webhook.md) that starts an instance of the orchestration and returns a *check status* response. |

For more information about these functions, see [Durable Functions types and features](./durable-functions-types-features-overview.md).

## Configure storage

You can use [Azurite](../../storage/common/storage-use-azurite.md?tabs=visual-studio-code), an emulator for Azure Storage, to test the function locally. In *local.settings.json*, set the value for `AzureWebJobsStorage` to `UseDevelopmentStorage=true` like in this example:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated"
  }
}
```

To install and start running the Azurite extension in Visual Studio Code, in the command palette, enter **Azurite: Start** and select Enter.

You can use other storage options for your Durable Functions app. For more information about storage options and benefits, see [Durable Functions storage providers](durable-functions-storage-providers.md).

## Test the function locally

Azure Functions Core Tools gives you the capability to run an Azure Functions project on your local development computer. You're prompted to install these tools the first time you start a function in Visual Studio Code.

1. In Visual Studio Code, set a breakpoint in the `SayHello` activity function code, and then select F5 to start the function app project. The terminal panel displays output from Core Tools.

   > [!NOTE]
   > For more information about debugging, see [Durable Functions diagnostics](durable-functions-diagnostics.md#debugging).
   >
   > If the message *No job functions found* appears, [update your Azure Functions Core Tools installation to the latest version](./../functions-core-tools-reference.md).

1. In the terminal panel, copy the URL endpoint of your HTTP-triggered function.

    :::image type="content" source="media/durable-functions-create-first-csharp/isolated-functions-vscode-debugging.png" alt-text="Screenshot of the Azure local output window." lightbox="media/durable-functions-create-first-csharp/isolated-functions-vscode-debugging.png":::

1. Use a tool like [Postman](https://www.getpostman.com/) or [cURL](https://curl.haxx.se/) to send an HTTP POST request to the URL endpoint.

   The response is the HTTP function's initial result. It lets you know that the Durable Functions app orchestration started successfully. It doesn't yet display the end result of the orchestration. The response includes a few useful URLs.

   At this point, your breakpoint in the activity function should be hit because the orchestration has started. Step through it to get a response for the status of the orchestration.

1. Copy the URL value for `statusQueryGetUri`, paste it in your browser's address bar, and execute the request. Alternatively, you can also continue to use Postman to issue the GET request.

    The request queries the orchestration instance for the status. You should see that the instance finished and that it includes the outputs or results of the Durable Functions app like in this example:

    ```json
    {
        "name":"HelloCities",
        "instanceId":"7f99f9474a6641438e5c7169b7ecb3f2",
        "runtimeStatus":"Completed",
        "input":null,
        "customStatus":null,
        "output":"Hello, Tokyo! Hello, London! Hello, Seattle!",
        "createdTime":"2023-01-31T18:48:49Z",
        "lastUpdatedTime":"2023-01-31T18:48:56Z"
    }
    ```

   > [!TIP]
   > Learn how you can observe the [replay behavior](./durable-functions-orchestrations.md#reliability) of a Durable Functions app through breakpoints.

1. To stop debugging, in Visual Studio Code, select Shift+F5.

After you verify that the function runs correctly on your local computer, it's time to publish the project to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../../includes/functions-sign-in-vs-code.md)]

[!INCLUDE [functions-publish-project-vscode](../../../includes/functions-publish-project-vscode.md)]

## Test your function in Azure

1. In the Visual Studio Code output panel, copy the URL of the HTTP trigger. The URL that calls your HTTP-triggered function must be in the following format:

   `https://<function-app-name>.azurewebsites.net/api/HelloOrchestration_HttpStart`

1. Paste the new URL for the HTTP request in your browser's address bar. You must get the same status response that you got when you tested locally when you use the published app.

The C# Durable Functions app that you created and published by using Visual Studio Code is ready to use.

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid related costs in your Azure subscription, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group) and all related resources.

## Related content

* Learn about [common Durable Functions app patterns](durable-functions-overview.md#application-patterns).

::: zone-end

::: zone pivot="code-editor-visualstudio"

In this quickstart, you use Visual Studio 2022 to locally create and test a "hello world" Durable Functions app. The function orchestrates and chains together calls to other functions. Then, you publish the function code in Azure. The tools you use are available via the *Azure development workload* in Visual Studio 2022.

:::image type="content" source="./media/durable-functions-create-first-csharp/functions-vs-complete.png" alt-text="Screenshot of Durable Functions app code in Visual Studio 2019.":::

## Prerequisites

To complete this quickstart, you need:

* [Visual Studio 2022](https://visualstudio.microsoft.com/vs/) installed.

   Make sure that the **Azure development** workload is also installed. Visual Studio 2019 also supports Durable Functions development, but the UI and steps are different.

* The [Azurite emulator](../../storage/common/storage-use-azurite.md) installed and running.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Create a function app project

The Azure Functions template creates a project that you can publish to a function app in Azure. You can use a function app to group functions as a logical unit to more easily manage, deploy, scale, and share resources.

1. In Visual Studio, on the **File** menu, select **New** > **Project**.

1. On **Create a new project**, search for **functions**, select the **Azure Functions** template, and then select **Next**.

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-isolated-vs-new-project.png" alt-text="Screenshot of the New project dialog in Visual Studio.":::

1. For **Project name**, enter a name for your project, and then select **OK**. The project name must be valid as a C# namespace, so don't use underscores, hyphens, or nonalphanumeric characters.

1. On **Additional information**, use the settings that are described in the next table.

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-isolated-vs-new-function.png" alt-text="Screenshot of the Create a new Azure Functions Application dialog in Visual Studio.":::

    | Setting      | Action  | Description                      |
    | ------------ |  ------- |----------------------------------------- |
    | **Functions worker** | Select **.NET 8 Isolated (Long Term Support)**. | Creates an Azure Functions project that supports .NET 8 running in an isolated worker process and the Azure Functions Runtime 4.0. For more information, see [How to target the Azure Functions runtime version](../functions-versions.md).   |
    | **Function** | Enter **Durable Functions Orchestration**. | Creates a Durable Functions orchestration. |

   > [!NOTE]
   > If **.NET 8 Isolated (Long Term Support)** doesn't appear in the **Functions worker** menu, you might not have the latest Azure Functions tool sets and templates. Go to **Tools** > **Options** > **Projects and Solutions** > **Azure Functions** > **Check for updates to download the latest**.

1. To use the Azurite emulator, make sure that the **Use Azurite for runtime storage account (AzureWebJobStorage)** checkbox is selected. To create a Functions project by using a Durable Functions orchestration template, select **Create**. The project has the basic configuration files that you need to run your functions.

   > [!NOTE]
   > You can choose other storage options for your Durable Functions app. For more information, see [Durable Functions storage providers](durable-functions-storage-providers.md).

In your app folder, a file named *Function1.cs* contains three functions. The three functions are the basic building blocks of a Durable Functions app:

| Method | Description |
| -----  | ----------- |
| `RunOrchestrator` | Defines the Durable Functions app orchestration. In this case, the orchestration starts, creates a list, and then adds the result of three functions calls to the list. When the three function calls finish, it returns the list. |
| `SayHello` | A simple function app that returns *hello*. This function contains the business logic that is orchestrated. |
| `HttpStart` | An [HTTP-triggered function](../functions-bindings-http-webhook.md) that starts an instance of the orchestration and returns a *check status* response. |

For more information about these functions, see [Durable Functions types and features](./durable-functions-types-features-overview.md).

## Test the function locally

Azure Functions Core Tools gives you the capability to run an Azure Functions project on your local development computer. You're prompted to install these tools the first time you start a function in Visual Studio Code.

1. In Visual Studio Code, set a breakpoint in the `SayHello` activity function code, and then select F5. If you're prompted, accept the request from Visual Studio to download and install Azure Functions Core (command-line) tools. You might also need to enable a firewall exception so that the tools can handle HTTP requests.

   > [!NOTE]
   > For more information about debugging, see [Durable Functions diagnostics](durable-functions-diagnostics.md#debugging).

1. Copy the URL of your function from the Azure Functions runtime output.

    :::image type="content" source="./media/durable-functions-create-first-csharp/isolated-functions-vs-debugging.png" alt-text="Screenshot of the Azure local runtime." lightbox="media/durable-functions-create-first-csharp/isolated-functions-vs-debugging.png":::

1. Paste the URL for the HTTP request in your browser's address bar and execute the request. The following screenshot shows the response to the local GET request that the function returns in the browser:

    :::image type="content" source="./media/durable-functions-create-first-csharp/isolated-functions-vs-status.png" alt-text="Screenshot of the browser window with statusQueryGetUri called out." lightbox="media/durable-functions-create-first-csharp/isolated-functions-vs-status.png":::

   The response is the HTTP function's initial result. It lets you know that the durable orchestration started successfully. It doesn't yet display the end result of the orchestration. The response includes a few useful URLs.

   At this point, your breakpoint in the activity function should be hit because the orchestration started. Step through it to get a response for the status of the orchestration.

1. Copy the URL value for `statusQueryGetUri`, paste it in your browser's address bar, and execute the request.

    The request queries the orchestration instance for the status. You should see that the instance finished and that it includes the outputs or results of the durable function, like in this example:

    ```json
    {
        "name":"HelloCities",
        "instanceId":"668814ac6ce84a43a9e6757f81dbc0bc",
        "runtimeStatus":"Completed",
        "input":null,
        "customStatus":null,
        "output":"Hello, Tokyo! Hello, London! Hello Seattle!",
        "createdTime":"2023-01-31T16:44:34Z",
        "lastUpdatedTime":"2023-01-31T16:44:37Z"
    }
    ```

   > [!TIP]
   > Learn how you can observe the [replay behavior](./durable-functions-orchestrations.md#reliability) of a Durable Functions app through breakpoints.

1. To stop debugging, select Shift+F5.

After you verify that the function runs correctly on your local computer, it's time to publish the project to Azure.

## Publish the project to Azure

You must have a function app in your Azure subscription before you publish your project. You can create a function app in Visual Studio.

[!INCLUDE [Publish the project to Azure](../../../includes/functions-vstools-publish.md)]

## Test your function in Azure

1. On the **Publish profile** page, copy the base URL of the function app. Replace the `localhost:port` portion of the URL that you used when you tested the function locally with the new base URL.

    The URL that calls your durable function HTTP trigger must be in the following format:

    `https://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>_HttpStart`

1. Paste the new URL for the HTTP request in your browser's address bar. When you test the published app, you must get the same status response that you got when you tested locally.

The C# Durable Functions app that you created and published by using Visual Studio is ready to use.

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid related costs in your Azure subscription, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group) and all related resources.

## Related content

* Learn about [common Durable Functions app patterns](durable-functions-overview.md#application-patterns).

::: zone-end
