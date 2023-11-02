---
title: "Create your first C# durable function running in the isolated worker"
description: Create and publish a C# Azure Durable Function running in the isolated worker using Visual Studio or Visual Studio Code.
author: lilyjma
ms.topic: quickstart
ms.date: 01/31/2023
ms.author: azfuncdf
zone_pivot_groups: code-editors-set-one
ms.devlang: csharp
ms.custom: mode-other, devdivchpfy22, vscode-azure-extension-update-complete, devx-track-dotnet
---

# Create your first Durable Function in C#

Durable Functions is an extension of [Azure Functions](../functions-overview.md) that lets you write stateful functions in a serverless environment. The extension manages state, checkpoints, and restarts for you.

Like Azure Functions, Durable Functions supports two process models for .NET class library functions:

[!INCLUDE [functions-dotnet-execution-model](../../../includes/functions-dotnet-execution-model.md)] 

To learn more about the two processes, refer to [Differences between in-process and isolated worker process .NET Azure Functions](../dotnet-isolated-in-process-differences.md).

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
     | Select a .NET runtime | .NET 7.0 isolated | Creates a function project that supports .NET 7 running in isolated worker process and the Azure Functions Runtime 4.0. For more information, see [How to target Azure Functions runtime version](../functions-versions.md).  |
    | Select a template for your project's first function | Skip for now | |
    | Select how you would like to open your project | Open in current window | Reopens Visual Studio Code in the folder you selected. |

Visual Studio Code installs the Azure Functions Core Tools if needed. It also creates a function app project in a folder. This project contains the [host.json](../functions-host-json.md) and [local.settings.json](../functions-develop-local.md#local-settings-file) configuration files.

## Add NuGet package references

Add the following to your app project: 

```xml
<ItemGroup>
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.10.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.DurableTask" Version="1.0.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http" Version="3.0.13" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.7.0" OutputItemType="Analyzer" />
</ItemGroup>
```
## Add functions to the app

The most basic Durable Functions app contains the following three functions. Add them to a new class in the app:

```csharp
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.DurableTask;
using Microsoft.DurableTask.Client;
using Microsoft.Extensions.Logging;

static class HelloSequence
{
    [Function(nameof(HelloCities))]
    public static async Task<string> HelloCities([OrchestrationTrigger] TaskOrchestrationContext context)
    {
        string result = "";
        result += await context.CallActivityAsync<string>(nameof(SayHello), "Tokyo") + " ";
        result += await context.CallActivityAsync<string>(nameof(SayHello), "London") + " ";
        result += await context.CallActivityAsync<string>(nameof(SayHello), "Seattle");
        return result;
    }

    [Function(nameof(SayHello))]
    public static string SayHello([ActivityTrigger] string cityName, FunctionContext executionContext)
    {
        ILogger logger = executionContext.GetLogger(nameof(SayHello));
        logger.LogInformation("Saying hello to {name}", cityName);
        return $"Hello, {cityName}!";
    }
    
    [Function(nameof(StartHelloCities))]
    public static async Task<HttpResponseData> StartHelloCities(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req,
        [DurableClient] DurableTaskClient client,
        FunctionContext executionContext)
    {
        ILogger logger = executionContext.GetLogger(nameof(StartHelloCities));

        string instanceId = await client.ScheduleNewOrchestrationInstanceAsync(nameof(HelloCities));
        logger.LogInformation("Created new orchestration with instance ID = {instanceId}", instanceId);

        return client.CreateCheckStatusResponse(req, instanceId);
    }
}
```
| Method | Description |
| -----  | ----------- |
| **`HelloCities`** | Manages the durable orchestration. In this case, the orchestration starts, creates a list, and adds the result of three functions calls to the list. When the three function calls are complete, it returns the list. |
| **`SayHello`** | The function returns a hello. It's the function that contains the business logic that is being orchestrated. |
| **`StartHelloCities`** | An [HTTP-triggered function](../functions-bindings-http-webhook.md) that starts an instance of the orchestration and returns a check status response. |

## Configure storage

Your app needs a storage for runtime information. To use [Azurite](../../storage/common/storage-use-azurite.md?tabs=visual-studio-code), which is an emulator for Azure Storage, set `AzureWebJobStorage` in _local.settings.json_ to `UseDevelopmentStorage=true`: 

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated"
  }
}
```
You can install the Azurite extension on Visual Studio Code and start it by running `Azurite: Start` in the command palette. 

There are other storage options you can use for your Durable Functions app. See [Durable Functions storage providers](durable-functions-storage-providers.md) to learn more about different storage options and what benefits they provide. 


## Test the function locally

Azure Functions Core Tools lets you run an Azure Functions project locally. You're prompted to install these tools the first time you start a function from Visual Studio Code.

1. To test your function, set a breakpoint in the `SayHello` activity function code and press <kbd>F5</kbd> to start the function app project. Output from Core Tools is displayed in the **Terminal** panel.

    > [!NOTE]
    > For more information on debugging, see [Durable Functions Diagnostics](durable-functions-diagnostics.md#debugging).

1. In the **Terminal** panel, copy the URL endpoint of your HTTP-triggered function.

    :::image type="content" source="media/durable-functions-create-first-csharp/isolated-functions-vscode-debugging.png" alt-text="Screenshot of Azure local output window.":::

1. Use a tool like [Postman](https://www.getpostman.com/) or [cURL](https://curl.haxx.se/), and then send an HTTP POST request to the URL endpoint.

   The response is the HTTP function's initial result, letting us know that the durable orchestration has started successfully. It isn't yet the end result of the orchestration. The response includes a few useful URLs. For now, let's query the status of the orchestration.

1. Copy the URL value for `statusQueryGetUri`, paste it into the browser's address bar, and execute the request. Alternatively, you can also continue to use Postman to issue the GET request.

   The request will query the orchestration instance for the status. You must get an eventual response, which shows us that the instance has completed and includes the outputs or results of the durable function. It looks like:

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

In this article, you will learn how to use Visual Studio 2022 to locally create and test a "hello world" durable function that run in the isolated worker process. This function orchestrates and chains-together calls to other functions. You then publish the function code to Azure. These tools are available as part of the Azure development workload in Visual Studio 2022.

:::image type="content" source="./media/durable-functions-create-first-csharp/functions-vs-complete.png" alt-text="Screenshot of Visual Studio 2019 window with a durable function.":::

## Prerequisites

To complete this tutorial:

* Install [Visual Studio 2022](https://visualstudio.microsoft.com/vs/). Make sure that the **Azure development** workload is also installed. Visual Studio 2019 also supports Durable Functions development, but the UI and steps differ.

* Verify that you have the [Azurite Emulator](../../storage/common/storage-use-azurite.md) installed and running.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Create a function app project

The Azure Functions template creates a project that can be published to a function app in Azure. A function app lets you group functions as a logical unit for easier management, deployment, scaling, and sharing of resources.

1. In Visual Studio, select **New** > **Project** from the **File** menu.

2. In the **Create a new project** dialog, search for `functions`, choose the **Azure Functions** template, and then select **Next**.

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-isolated-vs-new-project.png" alt-text="Screenshot of new project dialog in Visual Studio.":::

3. Enter a **Project name** for your project, and select **OK**. The project name must be valid as a C# namespace, so don't use underscores, hyphens, or nonalphanumeric characters.

4. Under **Additional information**, use the settings specified in the table that follows the image.

    :::image type="content" source="./media/durable-functions-create-first-csharp/functions-isolated-vs-new-function.png" alt-text="Screenshot of create a new Azure Functions Application dialog in Visual Studio.":::

    | Setting      | Suggested value  | Description                      |
    | ------------ |  ------- |----------------------------------------- |
    | **Functions worker** | .NET 7 Isolated | Creates a function project that supports .NET 7 running in isolated worker process and the Azure Functions Runtime 4.0. For more information, see [How to target Azure Functions runtime version](../functions-versions.md).   |
    | **Function** | Empty | Creates an empty function app. |
    | **Storage account**  | Storage Emulator | A storage account is required for durable function state management. |

5. Select **Create** to create an empty function project. This project has the basic configuration files needed to run your functions. Make sure the box for _"Use Azurite for runtime storage account (AzureWebJobStorage)"_ is checked. This will use Azurite emulator.

Note that there are other storage options you can use for your Durable Functions app. See [Durable Functions storage providers](durable-functions-storage-providers.md) to learn more about different storage options and what benefits they provide. 

## Add NuGet package references

Add the following to your app project: 

```xml
<ItemGroup>
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.10.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.DurableTask" Version="1.0.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http" Version="3.0.13" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.7.0" OutputItemType="Analyzer" />
</ItemGroup>
```
## Add functions to the app

The most basic Durable Functions app contains the following three functions. Add them to a new class in the app:

```csharp
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.DurableTask;
using Microsoft.DurableTask.Client;
using Microsoft.Extensions.Logging;

static class HelloSequence
{
    [Function(nameof(HelloCities))]
    public static async Task<string> HelloCities([OrchestrationTrigger] TaskOrchestrationContext context)
    {
        string result = "";
        result += await context.CallActivityAsync<string>(nameof(SayHello), "Tokyo") + " ";
        result += await context.CallActivityAsync<string>(nameof(SayHello), "London") + " ";
        result += await context.CallActivityAsync<string>(nameof(SayHello), "Seattle");
        return result;
    }

    [Function(nameof(SayHello))]
    public static string SayHello([ActivityTrigger] string cityName, FunctionContext executionContext)
    {
        ILogger logger = executionContext.GetLogger(nameof(SayHello));
        logger.LogInformation("Saying hello to {name}", cityName);
        return $"Hello, {cityName}!";
    }
    
    [Function(nameof(StartHelloCities))]
    public static async Task<HttpResponseData> StartHelloCities(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req,
        [DurableClient] DurableTaskClient client,
        FunctionContext executionContext)
    {
        ILogger logger = executionContext.GetLogger(nameof(StartHelloCities));

        string instanceId = await client.ScheduleNewOrchestrationInstanceAsync(nameof(HelloCities));
        logger.LogInformation("Created new orchestration with instance ID = {instanceId}", instanceId);

        return client.CreateCheckStatusResponse(req, instanceId);
    }
}

```
| Method | Description |
| -----  | ----------- |
| **`HelloCities`** | Manages the durable orchestration. In this case, the orchestration starts, creates a list, and adds the result of three functions calls to the list. When the three function calls are complete, it returns the list. |
| **`SayHello`** | The function returns a hello. It's the function that contains the business logic that is being orchestrated. |
| **`StartHelloCities`** | An [HTTP-triggered function](../functions-bindings-http-webhook.md) that starts an instance of the orchestration and returns a check status response. |


## Test the function locally

Azure Functions Core Tools lets you run an Azure Functions project on your local development computer. You're prompted to install these tools the first time you start a function from Visual Studio.

1. To test your function, press <kbd>F5</kbd>. If prompted, accept the request from Visual Studio to download and install Azure Functions Core (CLI) tools. You may also need to enable a firewall exception so that the tools can handle HTTP requests.

2. Copy the URL of your function from the Azure Functions runtime output.

    :::image type="content" source="./media/durable-functions-create-first-csharp/isolated-functions-vs-debugging.png" alt-text="Screenshot of Azure local runtime.":::

3. Paste the URL for the HTTP request into your browser's address bar and execute the request. The following shows the response in the browser to the local GET request returned by the function:

    :::image type="content" source="./media/durable-functions-create-first-csharp/isolated-functions-vs-status.png" alt-text="Screenshot of the browser window with statusQueryGetUri called out.":::

    The response is the HTTP function's initial result, letting us know that the durable orchestration has started successfully. It isn't yet the end result of the orchestration. The response includes a few useful URLs. For now, let's query the status of the orchestration.

4. Copy the URL value for `statusQueryGetUri`, paste it into the browser's address bar, and execute the request.

    The request will query the orchestration instance for the status. You must get an eventual response that looks like the following.  This output shows us the instance has completed and includes the outputs or results of the durable function.

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

5. To stop debugging, press <kbd>Shift + F5</kbd>.

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

You have used Visual Studio to create and publish a C# Durable Functions app.

> [!div class="nextstepaction"]
> [Learn about common durable function patterns](durable-functions-overview.md#application-patterns)

::: zone-end
