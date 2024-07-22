---
title: "Quickstart: Create a C# durable function"
description: Create and publish a C# durable function in Azure Functions by using Visual Studio or Visual Studio Code.
author: anthonychu
ms.topic: quickstart
ms.date: 06/15/2022
ms.author: azfuncdf
zone_pivot_groups: code-editors-set-one
ms.devlang: csharp
ms.custom: mode-other, devdivchpfy22, vscode-azure-extension-update-complete
---

# Quickstart: Create a C# durable function

Durable Functions is a feature of [Azure Functions](../functions-overview.md) that you can use to write stateful functions in a serverless environment. Durable Functions manages state, checkpoints, and restarts for you.

::: zone pivot="code-editor-vscode"

To use Durable Functions in Visual Studio Code, install the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) in Visual Studio Code.

In this quickstart, you use the Durable Functions extension in Visual Studio Code to locally create and test a "hello world" durable function in Azure Functions. The durable function orchestrates and chains together calls to other functions. Then, you publish the function code to Azure. The tools you use are available as part of the Visual Studio Code extension.

:::image type="content" source="./media/durable-functions-create-first-csharp/functions-vscode-complete.png" alt-text="Screenshot that shows a Visual Studio Code window with a durable function.":::

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

## <a name="create-an-azure-functions-project"></a>Create your local project

Use Visual Studio Code to create a local Azure Functions project.

1. On the **View** menu, select **Command Palette** (or select Ctrl+Shift+P).

1. At the prompt (`>`), enter and then select **Azure Functions: Create New Project**.

    :::image type="content" source="media/durable-functions-create-first-csharp/functions-vscode-create-project.png" alt-text="Screenshot that shows the option to create a Functions project.":::

1. Select **Browse**. In the **Select Folder** dialog, go to a folder to use for your project, and then choose **Select**.

1. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a language for your function app project** | Select **C#**. | Creates a local C# Azure Functions project. |
    | **Select a version** | Select **Azure Functions v4**. | You see this option only when Core Tools isn't already installed. Core Tools is installed the first time you run the app. |
     | **Select a template for your project's first function** | Select **Skip for now**. | |
     | **Select how you would like to open your project** | Select **Open in current window**. | Opens Visual Studio Code in the folder you selected. |

Visual Studio Code installs Azure Functions Core Tools if it's required to create the project. It also creates a function app project in a folder. This project contains the [host.json](../functions-host-json.md) and [local.settings.json](../functions-develop-local.md#local-settings-file) configuration files.

## Add a function to the app

Use a template to create durable function code in your project:

1. In the command palette, enter and then select **Azure Functions: Create Function**.

1. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a template for your function** | Select **DurableFunctionsOrchestration**. | Creates a durable function orchestration. |
    | **Provide a function name** | Enter **HelloOrchestration**. | A name for the class in which functions are created. |
    | **Provide a namespace** | Enter **Company.Function**. | A namespace for the generated class. |

1. When Visual Studio Code prompts you to select a storage account, choose **Select storage account**. At the prompts, provide the following information to create a new storage account in Azure:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select subscription** | Select the name of your subscription. | The Azure subscription to use for this resource. |
    | **Select a storage account** | Select **Create a new storage account.** | Opens a dialog to create a new storage account.  |
    | **Enter the name of the new storage account** | Enter a unique storage account name. | The name of the storage account to create. |
    | **Select a resource group** | Enter a unique resource group name. | The name of the resource group to create. |
    | **Select a location** | Select the Azure region to use. | Select a region that's physically close to you. |

A class that contains the new function is added to the project. Visual Studio Code also adds the storage account connection string to *local.settings.json*, and it adds a reference to the [Microsoft.Azure.WebJobs.Extensions.DurableTask](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask) NuGet package to the *.csproj* project file.

Open the new *HelloOrchestration.cs* file to view the contents. This durable function is a basic function chaining example that has the following methods:  

| Method | Function | Description |
| -----  | ------------ | ----------- |
| `RunOrchestrator` | `HelloOrchestration` | Manages the durable orchestration. The orchestration starts, creates a list, and then adds the result of three functions calls to the list. When the three function calls finish, it returns the list. |
| `SayHello` | `HelloOrchestration_Hello` | A function that returns *hello*. This function contains the business logic that is orchestrated. |
| `HttpStart` | `HelloOrchestration_HttpStart` | An [HTTP-triggered function](../functions-bindings-http-webhook.md) that starts an instance of the orchestration and returns a *check status* response. |

Now that you've created your Functions project and a durable function, you can test the function on your local computer.

## Test the function locally

Azure Functions Core Tools gives you the capability to run an Azure Functions project on your local development computer. You're prompted to install these tools the first time you start a function in Visual Studio Code.

1. In Visual Studio Code, set a breakpoint in the `SayHello` activity function code, and then select F5 to start the function app project. The terminal panel displays output from Core Tools.

   > [!NOTE]
   > For more information about debugging, see [Durable Functions diagnostics](durable-functions-diagnostics.md#debugging).

1. In the terminal panel, copy the URL endpoint of your HTTP-triggered function.

    :::image type="content" source="media/durable-functions-create-first-csharp/functions-vscode-f5.png" alt-text="Screenshot of Azure local output window.":::

1. Use a tool like [Postman](https://www.getpostman.com/) or [cURL](https://curl.haxx.se/) to send an HTTP POST request to the URL endpoint.

   The response is the HTTP function's initial result. It lets you know that the durable orchestration started successfully. It doesn't yet display the end result of the orchestration. The response includes a few useful URLs. For now, query the status of the orchestration.

1. Copy the URL value for `statusQueryGetUri`, paste it in your browser's address bar, and execute the request. Alternatively, you can also continue to use Postman to issue the GET request.

    The request queries the orchestration instance for the status. You should see that the instance finished and that it includes the outputs or results of the durable function like in this example:

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

1. To stop debugging, in Visual Studio Code, select Shift+F5.

After you verify that the function runs correctly on your local computer, it's time to publish the project to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../../includes/functions-sign-in-vs-code.md)]

[!INCLUDE [functions-publish-project-vscode](../../../includes/functions-publish-project-vscode.md)]

## Test your function in Azure

1. In the Visual Studio Code output panel, copy the URL of the HTTP trigger. The URL that calls your HTTP-triggered function must be in the following format:

   `https://<function-app-name>.azurewebsites.net/api/HelloOrchestration_HttpStart`

1. Paste the new URL for the HTTP request in your browser's address bar. When you use the published app, you can expect to get the same status response that you got when you tested locally.

The C# durable function app that you created and published by using Visual Studio Code is ready to use.

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid related costs in your Azure subscription, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group) and all related resources.

## Related content

* Learn about [common durable function patterns](durable-functions-overview.md#application-patterns).

::: zone-end

::: zone pivot="code-editor-visualstudio"

In this article, you learn how to use Visual Studio 2022 to locally create and test a "hello world" durable function that runs in the isolated worker process. The function orchestrates and chains together calls to other functions. Then, you publish the function code to Azure. The tools you use are available via the *Azure development workload* in Visual Studio 2022.

:::image type="content" source="./media/durable-functions-create-first-csharp/functions-vs-complete.png" alt-text="Screenshot of a Visual Studio 2019 terminal that contains code for a durable function.":::

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

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-vs-new-project.png" alt-text="Screenshot of new project dialog to create a function in Visual Studio.":::

1. For **Project name**, enter a name for your project, and then select **OK**. The project name must be valid as a C# namespace, so don't use underscores, hyphens, or nonalphanumeric characters.

1. On **Additional information**, use the settings that are described in the table after the image.

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-vs-new-function.png" alt-text="Screenshot of create a new Azure Functions Application dialog in Visual Studio.":::

    | Setting      | Action  | Description                      |
    | ------------ |  ------- |----------------------------------------- |
    | **Functions worker** | Select **.NET 6**. | Creates a function project that supports .NET 6 and the Azure Functions Runtime 4.0. For more information, see [How to target Azure Functions runtime version](../functions-versions.md).   |
    | **Function** | Select **Empty**. | Creates an empty function app. |
    | **Storage account**  | Select **Storage Emulator**. | A storage account is required for durable function state management. |

1. Select **Create** to create an empty function project. This project has the basic configuration files that are needed to run your functions.

## Add functions to the app

The following steps use a template to create the durable function code in your project.

1. In Visual Studio, right-click the project and select **Add** > **New Azure Function**.

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-vs-add-function.png" alt-text="Screenshot of Add new function.":::

1. Verify that **Azure Function** is selected on the **Add** menu. Enter a name for your C# file, and then select **Add**.

1. Select the **Durable Functions Orchestration** template, and then select **Add**.

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-vs-select-durable-template.png" alt-text="Screenshot of Select durable template.":::

A new durable function is added to the app. Open the new .cs file to view the contents. This durable function is a simple function chaining example that has the following methods:  

| Method | Function name | Description |
| -----  | ------------ | ----------- |
| **`RunOrchestrator`** | `<file-name>` | Manages the durable orchestration. In this case, the orchestration starts, creates a list, and adds the result of three functions calls to the list. When the three function calls are finished, it returns the list. |
| **`SayHello`** | `<file-name>_Hello` | The function returns a *hello*. It's the function that contains the business logic that is orchestrated. |
| **`HttpStart`** | `<file-name>_HttpStart` | An [HTTP-triggered function](../functions-bindings-http-webhook.md) that starts an instance of the orchestration and returns a *check status* response. |

You can test it on your local computer now that you've created your Functions project and a durable function.

## Test the function locally

Azure Functions Core Tools gives you the capability to run an Azure Functions project on your local development computer. You're prompted to install these tools the first time you start a function in Visual Studio.

1. To test your function, select F5. If prompted, accept the request from Visual Studio to download and install the Azure Functions Core command-line tools. You might also need to enable a firewall exception so that the tools can handle HTTP requests.

1. In the Azure Functions runtime output, copy the URL of your function.

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-vs-debugging.png" alt-text="Screenshot of the Azure local runtime." lightbox="media/durable-functions-create-first-csharp/functions-vs-debugging.png":::

1. Paste the URL for the HTTP request in your browser's address bar and execute the request. The following screenshot shows the response to the local GET request that the function returns in the browser:

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-vs-status.png" alt-text="Screenshot of the browser window with statusQueryGetUri called out." lightbox="media/durable-functions-create-first-csharp/functions-vs-status.png":::

    The response is the HTTP function's initial result. It lets you know that the durable orchestration started successfully. It doesn't yet display the end result of the orchestration. The response includes a few useful URLs.

1. Copy the URL value for `statusQueryGetUri`, paste it in the browser's address bar, and execute the request.

    The request queries the orchestration instance for the status. You should see that the instance finished and that it includes the outputs or results of the durable function like in this example:

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

The C# durable function app that you created and published by using Visual Studio is ready to use.

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid related costs in your Azure subscription, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group) and all related resources.

## Related content

* Learn about [common durable function patterns](durable-functions-overview.md#application-patterns).

::: zone-end
