---
title: "Create your first durable function in Azure using C#"
description: Create and publish an Azure Durable Function using Visual Studio or Visual Studio Code.
author: anthonychu
ms.topic: quickstart
ms.date: 06/15/2022
ms.author: azfuncdf
zone_pivot_groups: code-editors-set-one
ms.devlang: csharp
ms.custom: mode-other, devdivchpfy22, vscode-azure-extension-update-complete
---

# Create your first durable function in C#

Durable Functions is an extension of [Azure Functions](../functions-overview.md) that lets you write stateful functions in a serverless environment. The extension manages state, checkpoints, and restarts for you.

::: zone pivot="code-editor-vscode"

In this article, you learn how to use Visual Studio Code to locally create and test a "hello world" durable function. This function orchestrates and chains together calls to other functions. You can then publish the function code to Azure. These tools are available as part of the Visual Studio Code [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).

:::image type="content" source="./media/durable-functions-create-first-csharp/functions-vscode-complete.png" alt-text="Screenshot of Visual Studio Code window with a durable function.":::

## Prerequisites

To complete this tutorial:

* Install [Visual Studio Code](https://code.visualstudio.com/download).

* Install the following Visual Studio Code extensions:
  * [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
  * [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)

* Make sure that you have the latest version of the [Azure Functions Core Tools](../functions-run-local.md).

* Durable Functions require an Azure storage account. You need an Azure subscription.

* Make sure that you have version 3.1 or a later version of the [.NET Core SDK](https://dotnet.microsoft.com/download) installed.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## <a name="create-an-azure-functions-project"></a>Create your local project 

In this section, you use Visual Studio Code to create a local Azure Functions project.

1. In Visual Studio Code, press <kbd>F1</kbd> (or <kbd>Ctrl/Cmd+Shift+P</kbd>) to open the command palette. In the command palette, search for and select `Azure Functions: Create New Project...`.

    :::image type="content" source="media/durable-functions-create-first-csharp/functions-vscode-create-project.png" alt-text="Screenshot of create a function project window.":::

1. Choose an empty folder location for your project and choose **Select**.

1. Follow the prompts and provide the following information:

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | Select a language for your function app project | C# | Create a local C# Functions project. |
    | Select a version | Azure Functions v4 | You only see this option when the Core Tools aren't already installed. In this case, Core Tools are installed the first time you run the app. |
    | Select a template for your project's first function | Skip for now | |
    | Select how you would like to open your project | Open in current window | Reopens Visual Studio Code in the folder you selected. |

Visual Studio Code installs the Azure Functions Core Tools if needed. It also creates a function app project in a folder. This project contains the [host.json](../functions-host-json.md) and [local.settings.json](../functions-develop-local.md#local-settings-file) configuration files.

## Add functions to the app

The following steps use a template to create the durable function code in your project.

1. In the command palette, search for and select `Azure Functions: Create Function...`.

1. Follow the prompts and provide the following information:

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | Select a template for your function | DurableFunctionsOrchestration | Create a Durable Functions orchestration |
    | Provide a function name | HelloOrchestration | Name of the class in which functions are created |
    | Provide a namespace | Company.Function | Namespace for the generated class |

1. When Visual Studio Code prompts you to select a storage account, choose **Select storage account**. Follow the prompts and provide the following information to create a new storage account in Azure:

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | Select subscription | *name of your subscription* | Select your Azure subscription |
    | Select a storage account | Create a new storage account |  |
    | Enter the name of the new storage account | *unique name* | Name of the storage account to create |
    | Select a resource group | *unique name* | Name of the resource group to create |
    | Select a location | *region* | Select a region close to you |

A class containing the new functions is added to the project. Visual Studio Code also adds the storage account connection string to *local.settings.json* and a reference to the [`Microsoft.Azure.WebJobs.Extensions.DurableTask`](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask) NuGet package to the *.csproj* project file.

Open the new *HelloOrchestration.cs* file to view the contents. This durable function is a simple function chaining example with the following methods:  

| Method | FunctionName | Description |
| -----  | ------------ | ----------- |
| **`RunOrchestrator`** | `HelloOrchestration` | Manages the durable orchestration. In this case, the orchestration starts, creates a list, and adds the result of three functions calls to the list. When the three function calls are complete, it returns the list. |
| **`SayHello`** | `HelloOrchestration_Hello` | The function returns a hello. It's the function that contains the business logic that is being orchestrated. |
| **`HttpStart`** | `HelloOrchestration_HttpStart` | An [HTTP-triggered function](../functions-bindings-http-webhook.md) that starts an instance of the orchestration and returns a check status response. |

Now that you've created your function project and a durable function, you can test it on your local computer.

## Test the function locally

Azure Functions Core Tools lets you run an Azure Functions project on your local development computer. You're prompted to install these tools the first time you start a function from Visual Studio Code.

1. To test your function, set a breakpoint in the `SayHello` activity function code and press <kbd>F5</kbd> to start the function app project. Output from Core Tools is displayed in the **Terminal** panel.

    > [!NOTE]
    > For more information on debugging, see [Durable Functions Diagnostics](durable-functions-diagnostics.md#debugging).

1. In the **Terminal** panel, copy the URL endpoint of your HTTP-triggered function.

    :::image type="content" source="media/durable-functions-create-first-csharp/functions-vscode-f5.png" alt-text="Screenshot of Azure local output window.":::

1. Use a tool like [Postman](https://www.getpostman.com/) or [cURL](https://curl.haxx.se/), and then send an HTTP POST request to the URL endpoint.

   The response is the HTTP function's initial result, letting us know that the durable orchestration has started successfully. It isn't yet the end result of the orchestration. The response includes a few useful URLs. For now, let's query the status of the orchestration.

1. Copy the URL value for `statusQueryGetUri`, paste it into the browser's address bar, and execute the request. Alternatively, you can also continue to use Postman to issue the GET request.

   The request will query the orchestration instance for the status. You must get an eventual response, which shows us that the instance has completed and includes the outputs or results of the durable function. It looks like:

    ```json
    {
        "name": "HelloOrchestration",
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

1. To stop debugging, press <kbd>Shift + F5</kbd> in Visual Studio Code.

After you've verified that the function runs correctly on your local computer, it's time to publish the project to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../../includes/functions-sign-in-vs-code.md)]

[!INCLUDE [functions-publish-project-vscode](../../../includes/functions-publish-project-vscode.md)]

## Test your function in Azure

1. Copy the URL of the HTTP trigger from the **Output** panel. The URL that calls your HTTP-triggered function must be in the following format:

    `https://<functionappname>.azurewebsites.net/api/HelloOrchestration_HttpStart`

1. Paste this new URL for the HTTP request into your browser's address bar. You must get the same status response as before when using the published app.

## Next steps

You have used Visual Studio Code to create and publish a C# durable function app.

> [!div class="nextstepaction"]
> [Learn about common durable function patterns](durable-functions-overview.md#application-patterns)

::: zone-end

::: zone pivot="code-editor-visualstudio"

In this article, you learn how to use Visual Studio 2022 to locally create and test a "hello world" durable function. This function orchestrates and chains-together calls to other functions. You then publish the function code to Azure. These tools are available as part of the Azure development workload in Visual Studio 2022.

:::image type="content" source="./media/durable-functions-create-first-csharp/functions-vs-complete.png" alt-text="Screenshot of Visual Studio 2019 window with a durable function.":::

## Prerequisites

To complete this tutorial:

* Install [Visual Studio 2022](https://visualstudio.microsoft.com/vs/). Make sure that the **Azure development** workload is also installed. Visual Studio 2019 also supports Durable Functions development, but the UI and steps differ.

* Verify that you have the [Azurite Emulator](../../storage/common//storage-use-azurite.md) installed and running.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Create a function app project

The Azure Functions template creates a project that can be published to a function app in Azure. A function app lets you group functions as a logical unit for easier management, deployment, scaling, and sharing of resources.

1. In Visual Studio, select **New** > **Project** from the **File** menu.

1. In the **Create a new project** dialog, search for `functions`, choose the **Azure Functions** template, and then select **Next**.

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-vs-new-project.png" alt-text="Screenshot of new project dialog to create a function in Visual Studio.":::

1. Enter a **Project name** for your project, and select **OK**. The project name must be valid as a C# namespace, so don't use underscores, hyphens, or nonalphanumeric characters.

1. Under **Additional information**, use the settings specified in the table that follows the image.

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-vs-new-function.png" alt-text="Screenshot of create a new Azure Functions Application dialog in Visual Studio.":::

    | Setting      | Suggested value  | Description                      |
    | ------------ |  ------- |----------------------------------------- |
    | **Functions worker** | .NET 6 | Creates a function project that supports .NET 6 and the Azure Functions Runtime 4.0. For more information, see [How to target Azure Functions runtime version](../functions-versions.md).   |
    | **Function** | Empty | Creates an empty function app. |
    | **Storage account**  | Storage Emulator | A storage account is required for durable function state management. |

1. Select **Create** to create an empty function project. This project has the basic configuration files needed to run your functions.

## Add functions to the app

The following steps use a template to create the durable function code in your project.

1. Right-click the project in Visual Studio and select **Add** > **New Azure Function**.

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-vs-add-function.png" alt-text="Screenshot of Add new function.":::

1. Verify **Azure Function** is selected from the add menu, enter a name for your C# file, and then select **Add**.

1. Select the **Durable Functions Orchestration** template and then select **Add**.

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-vs-select-durable-template.png" alt-text="Screenshot of Select durable template.":::

A new durable function is added to the app. Open the new *.cs* file to view the contents. This durable function is a simple function chaining example with the following methods:  

| Method | FunctionName | Description |
| -----  | ------------ | ----------- |
| **`RunOrchestrator`** | `<file-name>` | Manages the durable orchestration. In this case, the orchestration starts, creates a list, and adds the result of three functions calls to the list. When the three function calls are complete, it returns the list. |
| **`SayHello`** | `<file-name>_Hello` | The function returns a hello. It's the function that contains the business logic that is being orchestrated. |
| **`HttpStart`** | `<file-name>_HttpStart` | An [HTTP-triggered function](../functions-bindings-http-webhook.md) that starts an instance of the orchestration and returns a check status response. |

You can test it on your local computer now that you've created your function project and a durable function.

## Test the function locally

Azure Functions Core Tools lets you run an Azure Functions project on your local development computer. You're prompted to install these tools the first time you start a function from Visual Studio.

1. To test your function, press <kbd>F5</kbd>. If prompted, accept the request from Visual Studio to download and install Azure Functions Core (CLI) tools. You may also need to enable a firewall exception so that the tools can handle HTTP requests.

1. Copy the URL of your function from the Azure Functions runtime output.

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-vs-debugging.png" alt-text="Screenshot of Azure local runtime.":::

1. Paste the URL for the HTTP request into your browser's address bar and execute the request. The following shows the response in the browser to the local GET request returned by the function:

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-vs-status.png" alt-text="Screenshot of the browser window with statusQueryGetUri called out.":::

    The response is the HTTP function's initial result, letting us know that the durable orchestration has started successfully. It isn't yet the end result of the orchestration. The response includes a few useful URLs. For now, let's query the status of the orchestration.

1. Copy the URL value for `statusQueryGetUri`, paste it into the browser's address bar, and execute the request.

    The request will query the orchestration instance for the status. You must get an eventual response that looks like the following.  This output shows us the instance has completed and includes the outputs or results of the durable function.

    ```json
    {
        "name": "Durable",
        "instanceId": "d495cb0ac10d4e13b22729c37e335190",
        "runtimeStatus": "Completed",
        "input": null,
        "customStatus": null,
        "output": [
            "Hello Tokyo!",
            "Hello Seattle!",
            "Hello London!"
        ],
        "createdTime": "2019-11-02T07:07:40Z",
        "lastUpdatedTime": "2019-11-02T07:07:52Z"
    }
    ```

1. To stop debugging, press <kbd>Shift + F5</kbd>.

After you've verified that the function runs correctly on your local computer, it's time to publish the project to Azure.

## Publish the project to Azure

You must have a function app in your Azure subscription before publishing your project. You can create a function app right from Visual Studio.

[!INCLUDE [Publish the project to Azure](../../../includes/functions-vstools-publish.md)]

## Test your function in Azure

1. Copy the base URL of the function app from the Publish profile page. Replace the `localhost:port` portion of the URL you used when testing the function locally with the new base URL.

    The URL that calls your durable function HTTP trigger must be in the following format:

    `https://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>_HttpStart`

2. Paste this new URL for the HTTP request into your browser's address bar. You must get the same status response as before when using the published app.

## Next steps

You have used Visual Studio to create and publish a C# durable function app.

> [!div class="nextstepaction"]
> [Learn about common durable function patterns](durable-functions-overview.md#application-patterns)

::: zone-end
