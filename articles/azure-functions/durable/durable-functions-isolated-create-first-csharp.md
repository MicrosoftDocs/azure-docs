---
title: "Quickstart: Create your first C# durable function running in the isolated worker"
description: Create and publish a C# Azure durable function that runs in the isolated worker by using Visual Studio or Visual Studio Code.
author: lilyjma
ms.topic: quickstart
ms.date: 06/05/2024
ms.author: azfuncdf
zone_pivot_groups: code-editors-set-one
ms.devlang: csharp
ms.custom: mode-other, devdivchpfy22, vscode-azure-extension-update-complete, devx-track-dotnet
---

# Quickstart: Create your first durable function in C#

Durable Functions is a feature of [Azure Functions](../functions-overview.md) that you can use to write stateful functions in a serverless environment. Durable Functions manages state, checkpoints, and restarts for you.

Like Azure Functions, Durable Functions supports two process models for .NET class library functions:

[!INCLUDE [functions-dotnet-execution-model](../../../includes/functions-dotnet-execution-model.md)]

To learn more about the two processes, refer to [Differences between in-process and isolated worker process .NET Azure Functions](../dotnet-isolated-in-process-differences.md).

::: zone pivot="code-editor-vscode"

In this article, you learn how to use Visual Studio Code to locally create and test a "hello world" durable function. This function orchestrates and chains together calls to other functions. You can then publish the function code to Azure. These tools are available as part of the Visual Studio Code [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).

:::image type="content" source="./media/durable-functions-create-first-csharp/functions-vscode-complete.png" alt-text="Screenshot of Visual Studio Code window with a durable function.":::

## Prerequisites

To complete this quickstart, you first need to:

* [Visual Studio Code](https://code.visualstudio.com/download) installed.

* The following Visual Studio Code extensions installed:

  * [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
  * [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)

* The latest version of [Azure Functions Core Tools](../functions-run-local.md) installed.

* An Azure subscription. To use Durable Functions, you must have an Azure Storage account.

* [.NET Core SDK](https://dotnet.microsoft.com/download) version 3.1 or later installed.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## <a name="create-an-azure-functions-project"></a>Create your local project

Use Visual Studio Code to create a local Azure Functions project.

1. On the **View** menu, select **Command Palette** (or select Ctrl+Shift+P).

1. In the search box at the prompt (`>`), enter and then select **Azure Functions: Create New Project**.

    :::image type="content" source="media/durable-functions-create-first-csharp/functions-vscode-create-project.png" alt-text="Screenshot that shows the option to create a Functions project.":::

1. Select an empty folder for your project, and then choose **Select**.

1. At the prompts, select or enter the following values:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a language for your function app project** | Select **C#**. | Creates a local C# Functions project. |
    | **Select a version** | Select **Azure Functions v4**. | You see this option only when Core Tools isn't already installed. Core Tools is installed the first time you run the app. |
    | **Select a .NET runtime** | Select **.NET 8.0 isolated**. | Creates a function project that supports .NET 8 running in an isolated worker process and the Azure Functions Runtime 4.0. For more information, see [How to target Azure Functions runtime version](../functions-versions.md).  |
    | **Select a template for your project's first function** | Select **Durable Functions Orchestration**. | Creates a Durable Functions orchestration |
    | **Choose a durable storage type** | Select **Azure Storage**. | The default storage provider for Durable Functions. For more information, see [Durable Functions storage providers](./durable-functions-storage-providers.md). |
    | **Provide a function name** | Enter **HelloOrchestration**. | A name for the orchestration function. |
    | **Provide a namespace** | Enter **Company.Function**. | A namespace for the generated class. |
    | **Select how you would like to open your project** | Select **Open in current window**. | Reopens Visual Studio Code in the folder you selected. |

Visual Studio Code installs Azure Functions Core Tools if it's needed to create your project. It also creates a function app project in a folder. This project contains the [host.json](../functions-host-json.md) and [local.settings.json](../functions-develop-local.md#local-settings-file) configuration files.

Another file, called *HelloOrchestration.cs*, contains the basic building blocks of a Durable Functions app:

| Method | Description |
| -----  | ----------- |
| `HelloOrchestration` | Defines the durable function orchestration. In this case, the orchestration starts, creates a list, and adds the result of three functions calls to the list. When the three function calls finish, it returns the list. |
| `SayHello` | A simple function app that returns *hello*. It's the function that contains the business logic that is orchestrated. |
| `HelloOrchestration_HttpStart` | An [HTTP-triggered function](../functions-bindings-http-webhook.md) that starts an instance of the orchestration and returns a *check status* response. |

For more information about these functions, see [Durable Functions types and features](./durable-functions-types-features-overview.md).

## Configure storage

You can use [Azurite](../../storage/common/storage-use-azurite.md?tabs=visual-studio-code), an emulator for Azure Storage, to test the function locally. In *local.settings.json*, set the value for `AzureWebJobsStorage` to `UseDevelopmentStorage=true`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated"
  }
}
```

To install and start running the Azurite extension in Visual Studio Code, in the command palette, enter **Azurite: Start**.

You can use other storage options for your durable function app. For more information about storage options and benefits, see [Durable Functions storage providers](durable-functions-storage-providers.md).

## Test the function locally

Azure Functions Core Tools gives you the capability to run an Azure Functions project on your local development computer. You're prompted to install these tools the first time you start a function by using Visual Studio Code.

1. In Visual Studio Code, set a breakpoint in the `SayHello` activity function code, and then select F5 to start the function app project. The terminal panel displays output from Core Tools.

   > [!NOTE]
   > For more information about debugging, see [Durable Functions diagnostics](durable-functions-diagnostics.md#debugging).
   >
   > If a *No job functions found* error message appears, [update your Azure Functions Core Tools installation to the latest version](./../functions-core-tools-reference.md). Earlier versions of Core Tools don't support .NET isolated.

1. In the terminal panel, copy the URL endpoint of your HTTP-triggered function.

    :::image type="content" source="media/durable-functions-create-first-csharp/isolated-functions-vscode-debugging.png" alt-text="Screenshot of Azure local output window.":::

1. In a tool like [Postman](https://www.getpostman.com/) or [cURL](https://curl.haxx.se/), send an HTTP POST request to the URL endpoint.

   The response is the HTTP function's initial result. It lets you know that the durable orchestration started successfully. It doesn't yet display the end result of the orchestration. The response includes a few useful URLs.

   At this point, your breakpoint in the activity function should be hit because the orchestration has started. Step through it to get a response for the status of the orchestration.

1. Copy the URL value for `statusQueryGetUri`, paste it in your browser's address bar, and execute the request. Alternatively, you can also continue to use Postman to issue the GET request.

    The request queries the orchestration instance for the status. You should see that the instance finished and that it includes the outputs or results of the durable function. It looks similar to this example:

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

   > [!NOTE]
   > You can observe the [replay behavior](./durable-functions-orchestrations.md#reliability) of Durable Functions through breakpoints. Because this is an important concept to understand, it's highly recommended that you read the linked article.

1. To stop debugging, in Visual Studio Code, select Shift+F5.

After you verify that the function runs correctly on your local computer, it's time to publish the project to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../../includes/functions-sign-in-vs-code.md)]

[!INCLUDE [functions-publish-project-vscode](../../../includes/functions-publish-project-vscode.md)]

1. In the Visual Studio Code output panel, copy the URL of the HTTP trigger. The URL that calls your HTTP-triggered function must be in the following format:

   `https://<function-app-name>.azurewebsites.net/api/HelloOrchestration_HttpStart`

1. Paste the new URL for the HTTP request in your browser's address bar. You must get the same status response that you got when you tested locally when you use the published app.

The C# durable function app that you created and published by using Visual Studio Code is ready to use.

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid subscription costs for the resources, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group).

## Next step

> [!div class="nextstepaction"]
> [Learn about common durable function patterns](durable-functions-overview.md#application-patterns)

::: zone-end

::: zone pivot="code-editor-visualstudio"

In this article, you learn how to use Visual Studio 2022 to locally create and test a "hello world" durable function that runs in the isolated worker process. The function orchestrates and chains together calls to other functions. You then publish the function code to Azure. These tools are available as part of the Azure development workload in Visual Studio 2022.

:::image type="content" source="./media/durable-functions-create-first-csharp/functions-vs-complete.png" alt-text="Screenshot of Visual Studio 2019 window with a durable function.":::

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

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-isolated-vs-new-project.png" alt-text="Screenshot of new project dialog in Visual Studio.":::

1. For **Project name**, enter a name for your project, and then select **OK**. The project name must be valid as a C# namespace, so don't use underscores, hyphens, or nonalphanumeric characters.

1. On **Additional information**, use the settings that are described in the table after the image.

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-isolated-vs-new-function.png" alt-text="Screenshot of create a new Azure Functions Application dialog in Visual Studio.":::

    | Setting      | Action  | Description                      |
    | ------------ |  ------- |----------------------------------------- |
    | **Functions worker** | Select **.NET 8 Isolated (Long Term Support)**. | Creates a function project that supports .NET 8 running in an isolated worker process and the Azure Functions Runtime 4.0. For more information, see [How to target the Azure Functions runtime version](../functions-versions.md).   |
    | **Function** | Enter **Durable Functions Orchestration**. | Creates a Durable Functions orchestration. |

   > [!NOTE]
   > If you don't see **.NET 8 Isolated (Long Term Support)** in the **Functions worker** menu, you might not have the latest Azure Functions toolsets and templates. Go to **Tools** > **Options** > **Projects and Solutions** > **Azure Functions** > **Check for updates to download the latest**.

1. To use the Azurite emulator, make sure that the **Use Azurite for runtime storage account (AzureWebJobStorage)** checkbox is selected. To create a function project by using a Durable Functions orchestration template, select **Create**. This project has the basic configuration files that you need to run your functions.

   > [!NOTE]
   > There are other storage options you can use for your Durable Functions app. See [Durable Functions storage providers](durable-functions-storage-providers.md) to learn more about different storage options and what benefits they provide.

In your function app, you see a file called *Function1.cs* that contain three functions, which are the basic building blocks of a Durable Functions:

| Method | Description |
| -----  | ----------- |
| `RunOrchestrator` | Defines the durable orchestration. In this case, the orchestration starts, creates a list, and adds the result of three functions calls to the list. When the three function calls are complete, it returns the list. |
| `SayHello` | The function returns a hello. It's the function that contains the business logic that is being orchestrated. |
| `HttpStart` | An [HTTP-triggered function](../functions-bindings-http-webhook.md) that starts an instance of the orchestration and returns a check status response. |

For more information about these functions, see [Durable Functions types and features](./durable-functions-types-features-overview.md).

## Test the function locally

Azure Functions Core Tools gives you the capability to run an Azure Functions project on your local development computer. You're prompted to install these tools the first time you start a function in Visual Studio.

1. To test your function, set a breakpoint in the `SayHello` activity function code, and then select F5. If prompted, accept the request from Visual Studio to download and install Azure Functions Core (command-line) tools. You might also need to enable a firewall exception so that the tools can handle HTTP requests.

   > [!NOTE]
   > For more information about debugging, see [Durable Functions diagnostics](durable-functions-diagnostics.md#debugging).

1. Copy the URL of your function from the Azure Functions runtime output.

    :::image type="content" source="./media/durable-functions-create-first-csharp/isolated-functions-vs-debugging.png" alt-text="Screenshot of the Azure local runtime.":::

1. Paste the URL for the HTTP request in your browser's address bar and execute the request. The following screenshot shows the response to the local GET request that the function returns in the browser:

    :::image type="content" source="./media/durable-functions-create-first-csharp/isolated-functions-vs-status.png" alt-text="Screenshot of the browser window with statusQueryGetUri called out.":::

   The response is the HTTP function's initial result. It lets you know that the durable orchestration started successfully. It doesn't yet display the end result of the orchestration. The response includes a few useful URLs.

   At this point, your breakpoint in the activity function should be hit because the orchestration has started. Step through it to get a response for the status of the orchestration.

1. Copy the URL value for `statusQueryGetUri`, paste it in your browser's address bar, and execute the request.

    The request queries the orchestration instance for the status. You should see that the instance finished and that it includes the outputs or results of the durable function like in this example:

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
   > You can observe the [replay behavior](./durable-functions-orchestrations.md#reliability) of Durable Functions through breakpoints.

1. To stop debugging, select Shift+F5.

After you verify that the function runs correctly on your local computer, it's time to publish the project to Azure.

## Publish the project to Azure

You must have a function app in your Azure subscription before you publish your project. You can create a function app right in Visual Studio.

[!INCLUDE [Publish the project to Azure](../../../includes/functions-vstools-publish.md)]

## Test your function in Azure

1. On the **Publish profile** page, copy the base URL of the function app. Replace the `localhost:port` portion of the URL that you used when you tested the function locally with the new base URL.

    The URL that calls your durable function HTTP trigger must be in the following format:

    `https://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>_HttpStart`

1. Paste the new URL for the HTTP request in your browser's address bar. When you test the published app, you must get the same status response that you got when you tested locally.

The C# durable function app that you created and published by using Visual Studio is ready to use.

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid subscription costs for the resources, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group).

## Next step

> [!div class="nextstepaction"]
> [Learn about common durable function patterns](durable-functions-overview.md#application-patterns)

::: zone-end
