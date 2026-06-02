---
title: "Quickstart: Create a TypeScript Durable Functions app"
description: Run a TypeScript Durable Functions sample app with function chaining and fan-out/fan-in patterns using the Durable Task Scheduler emulator. Get started now.
author: hhunter-ms
ms.author: hannahhunter
ms.topic: quickstart
ms.service: durable-task
ms.subservice: durable-functions
ms.date: 05/20/2026
ms.reviewer: azfuncdf
ms.devlang: typescript
ms.custom: devx-track-ts
---

# Quickstart: Create a TypeScript Durable Functions app

Use Durable Functions, a feature of [Azure Functions](../../azure-functions/functions-overview.md), to write stateful functions in a serverless environment. Durable Functions manages state, checkpoints, and restarts in your application automatically.

In this quickstart, you use the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code to create and test a Durable Functions app locally, then publish it to Azure. The app orchestrates and chains together calls to activity functions that return greetings for a set of city names.

[!INCLUDE [functions-nodejs-model-pivot-description](../../../includes/functions-nodejs-model-pivot-description.md)]

> [!TIP]
> The **v4 programming model** is the current default for Node.js Azure Functions and is recommended for new projects. The v3 model is available for existing apps that haven't migrated yet.

:::image type="content" source="./media/quickstart-js-vscode/functions-vs-code-complete.png" alt-text="Screenshot of an Edge window. The window shows the output of invoking a simple Durable Functions app in Azure.":::

## Prerequisites

- [Node.js 20+](https://nodejs.org/) installed.
- [Azure Functions Core Tools](../functions-run-local.md) v4 or later.
- [Docker](https://www.docker.com/products/docker-desktop/) for running the emulator and Azurite.
- Clone the [Durable Task Scheduler GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler) to use the quickstart sample.

## Set up the Durable Task Scheduler emulator

The [Durable Task Scheduler emulator](../../durable-task/scheduler/develop-with-durable-task-scheduler.md#durable-task-scheduler-emulator) provides a local development environment so you can test orchestrations without an Azure subscription. The Functions host also requires [Azurite](../../storage/common/storage-use-azurite.md) for local storage.

Start both containers:

```bash
docker run -d --name dtsemulator -p 8080:8080 -p 8082:8082 \
  mcr.microsoft.com/dts/dts-emulator:latest

docker run -d --name azurite -p 10000:10000 -p 10001:10001 -p 10002:10002 \
  mcr.microsoft.com/azure-storage/azurite
```

> [!TIP]
> Once the emulator is running, you can access the Durable Task Scheduler dashboard at `http://localhost:8082` to monitor orchestrations.

## Run the quickstart sample

1. Navigate to the Hello Cities sample directory:

* The latest version of [Azure Functions Core Tools](../../azure-functions/functions-run-local.md) installed.

1. Install dependencies and build the project:

::: zone pivot="nodejs-model-v4"

* [Azure Functions Core Tools](../../azure-functions/functions-run-local.md) version 4.0.5382 or later installed.

::: zone-end
* An HTTP test tool that keeps your data secure. For more information, see [HTTP test tools](../../azure-functions/functions-develop-local.md#http-test-tools).
 
* An Azure subscription. To use Durable Functions, you must have an Azure Storage account.

::: zone pivot="nodejs-model-v3"

* [Node.js](https://nodejs.org/) version 16.x+ installed.

::: zone-end

::: zone pivot="nodejs-model-v4"

* [Node.js](https://nodejs.org/) version 18.x+ installed.

::: zone-end

* [TypeScript](https://www.typescriptlang.org/) version 4.x+ installed.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project.

1. In Visual Studio Code, select F1 (or select Ctrl/Cmd+Shift+P) to open the command palette. At the prompt (`>`), enter and then select  **Azure Functions: Create New Project**.

   :::image type="content" source="media/quickstart-js-vscode/functions-create-project.png" alt-text="Screenshot that shows the Visual Studio Code command palette, with Azure Functions Create New Project highlighted.":::

2. Select **Browse**. In the **Select Folder** dialog, go to a folder to use for your project, and then choose **Select**.

::: zone pivot="nodejs-model-v3"

3. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a language for your function app project** | Select **TypeScript**. | Creates a local Node.js Functions project by using TypeScript. |
    | **Select a JavaScript programming model** | Select **Model V3**. | Sets the v3 programming model. |
    | **Select a version** | Select **Azure Functions v4**. | You see this option only when Core Tools isn't already installed. In this case, Core Tools is installed the first time you run the app. |
    | **Select a template for your project's first function** | Select **Skip for now**. | |
    | **Select how you would like to open your project** | Select **Open in current window**. | Opens Visual Studio Code in the folder you selected. |

::: zone-end

::: zone pivot="nodejs-model-v4"

3. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a language for your function app project** | Select **TypeScript**. | Creates a local Node.js Functions project by using TypeScript. |
    | **Select a JavaScript programming model** | Select **Model V4**. | Sets the v4 programming model. |
    | **Select a version** | Select **Azure Functions v4**. | You see this option only when Core Tools isn't already installed. In this case, Core Tools is installed the first time you run the app. |
    | **Select a template for your project's first function** | Select **Skip for now**. | |
    | **Select how you would like to open your project** | Select **Open in current window**. | Opens Visual Studio Code in the folder you selected. |

::: zone-end

Visual Studio Code installs Azure Functions Core Tools if it's required to create a project. It also creates a function app project in a folder. This project contains the [host.json](../../azure-functions/functions-host-json.md) and [local.settings.json](../../azure-functions/functions-develop-local.md#local-settings-file) configuration files.

A *package.json* file and a *tsconfig.json* file are also created in the root folder.

## Install the durable-functions npm package

To work with Durable Functions in a Node.js function app, you use the `durable-functions` npm package.

1. Use the **View** menu or select Ctrl+Shift+` to open a new terminal in Visual Studio Code.

2. Install the package by running `npm install durable-functions` in the root directory of the function app.

::: zone pivot="nodejs-model-v4"

> [!NOTE]
> This installs the `durable-functions` package version 3.x, which is the version that supports the v4 programming model. The npm package major version doesn't correspond to the Node.js programming model version.

::: zone-end

## Create your functions

The most basic Durable Functions app has three functions:

* **Orchestrator function**: A workflow that orchestrates other functions.
* **Activity function**:  A function that is called by the orchestrator function, performs work, and optionally returns a value.
* **Client function**: A regular function in Azure that starts an orchestrator function. This example uses an HTTP-triggered function.

::: zone pivot="nodejs-model-v3"

### Orchestrator function

You use a template to create the Durable Functions code in your project.

1. In the command palette, enter and then select **Azure Functions: Create Function**.

2. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a template for your function** | Select **Durable Functions orchestrator**. | Creates a Durable Functions orchestration. |
    | **Choose a durable storage type** | Select **Azure Storage (Default)**. | Sets the storage back end to use for your Durable Functions app. |
    | **Provide a function name** | Enter **HelloOrchestrator**. | The name of your function. |

You added an orchestrator to coordinate activity functions. Open *HelloOrchestrator/index.ts* to see the orchestrator function. Each call to `context.df.callActivity` invokes an activity function named `Hello`.

Next, you add the referenced `Hello` activity function.

### Activity function

1. In the command palette, enter and then select **Azure Functions: Create Function**.

2. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a template for your function** | Select **Durable Functions activity**. | Creates an activity function. |
    | **Provide a function name** | Enter **Hello**. | A name for your activity function. |

You added the `Hello` activity function that is invoked by the orchestrator. Open *Hello/index.ts* to see that it takes a name as input and returns a greeting. An activity function is where you perform "the real work" in your workflow, such as making a database call or performing some nondeterministic computation.

Finally, you add an HTTP-triggered function that starts the orchestration.

### Client function (HTTP starter)

1. In the command palette, enter and then select `Azure Functions: Create Function`.

2. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a template for your function** | Select **Durable Functions HTTP starter**. | Creates an HTTP starter function. |
    | **Provide a function name** | Select **DurableFunctionsHttpStart**. | The name of your activity function. |
    | **Authorization level** | Select **Anonymous**. | For demo purposes, this value allows the function to be called without using authentication. |

You added an HTTP-triggered function that starts an orchestration. Open *DurableFunctionsHttpStart/index.ts* to see that it uses `client.startNew` to start a new orchestration. Then it uses `client.createCheckStatusResponse` to return an HTTP response containing URLs that can be used to monitor and manage the new orchestration.

You now have a Durable Functions app that you can run locally and deploy to Azure.

::: zone-end

::: zone pivot="nodejs-model-v4"

One of the benefits of the v4 programming model is the flexibility of where you write your functions. In the v4 model, you can use a single template to create all three functions in one file in your project.

1. In the command palette, enter and then select **Azure Functions: Create Function**.

2. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a template for your function** | Select **Durable Functions orchestrator**. | Creates a file that has a Durable Functions app orchestration, an activity function, and a durable client starter function. |
    | **Choose a durable storage type** | Select **Azure Storage (Default)**. | Sets the storage back end to use for your Durable Function. |
    | **Provide a function name** | Enter **Hello**. | A name for your durable function. |

Open *src/functions/hello.ts* to view the functions you created.

You created an orchestrator called `helloOrchestrator` to coordinate activity functions. Each call to `context.df.callActivity` invokes an activity function called `hello`.

You also added the `hello` activity function that is invoked by the orchestrator. In the same file, you can see that it takes a name as input and returns a greeting. An activity function is where you perform "the real work" in your workflow, such as making a database call or performing some nondeterministic computation.

Finally, you added an HTTP-triggered function that starts an orchestration. In the same file, you can see that it uses `client.startNew` to start a new orchestration. Then it uses `client.createCheckStatusResponse` to return an HTTP response containing URLs that can be used to monitor and manage the new orchestration.

You now have a Durable Functions app that you can run locally and deploy to Azure.

::: zone-end

## Test the function locally

Azure Functions Core Tools gives you the capability to run an Azure Functions project on your local development computer. You're prompted to install these tools the first time you start a function in Visual Studio Code.

> [!NOTE]
> The first time you run the app locally, Visual Studio Code prompts you to select or create an Azure Storage account. Durable Functions requires a storage account to persist orchestration state.

::: zone pivot="nodejs-model-v3"

1. To test your function, set a breakpoint in the `Hello` activity function code (in *Hello/index.ts*). Select F5 or select **Debug: Start Debugging** in the command palette to start the function app project. Output from Core Tools appears in the terminal panel.

   > [!NOTE]
   > For more information about debugging, see [Durable Functions diagnostics](durable-functions-diagnostics.md#debugging).

::: zone-end

::: zone pivot="nodejs-model-v4"

1. To test your function, set a breakpoint in the `hello` activity function code (in *src/functions/hello.ts*). Select F5 or select **Debug: Start Debugging** in the command palette to start the function app project. Output from Core Tools appears in the terminal panel.

   > [!NOTE]
   > For more information about debugging, see [Durable Functions diagnostics](durable-functions-diagnostics.md#debugging).

::: zone-end

2. Durable Functions requires an Azure Storage account to run. When Visual Studio Code prompts you to select a storage account, select **Select storage account**.

    :::image type="content" source="media/quickstart-js-vscode/functions-select-storage.png" alt-text="Screenshot of a Visual Studio Code alert window. Select storage account is highlighted.":::

3. At the prompts, provide the following information to create a new storage account in Azure.

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select subscription** | Select the name of your subscription. | Your Azure subscription. |
    | **Select a storage account** | Select **Create a new storage account**. |  |
    | **Enter the name of the new storage account** | Enter a unique name. | The name of the storage account to create. |
    | **Select a resource group** | Enter a unique name. | The name of the resource group to create. |
    | **Select a location** | Select an Azure region. | Select a region that is close to you. |

4. In the terminal panel, copy the URL endpoint of your HTTP-triggered function.

   :::image type="content" source="media/quickstart-js-vscode/functions-f5.png" alt-text="Screenshot that shows the Visual Studio Code terminal panel. The URL of the HTTP starter function is highlighted." lightbox="media/quickstart-js-vscode/functions-f5.png":::

::: zone pivot="nodejs-model-v3"

5. Use your browser or an [HTTP test tool](../../azure-functions/functions-develop-local.md#http-test-tools) to send an HTTP POST request to the URL endpoint.

   Replace the last segment with the name of the orchestrator function (`HelloOrchestrator`). The URL should be similar to `http://localhost:7071/api/orchestrators/HelloOrchestrator`.

   The response is the HTTP function's initial result. It lets you know that the durable orchestration started successfully. It doesn't yet display the end result of the orchestration. The response includes a few useful URLs. For now, query the status of the orchestration.

::: zone-end

::: zone pivot="nodejs-model-v4"

5. Use your browser or an [HTTP test tool](../../azure-functions/functions-develop-local.md#http-test-tools) to send an HTTP POST request to the URL endpoint.

   Replace the last segment with the name of the orchestrator function (`helloOrchestrator`). The URL should be similar to `http://localhost:7071/api/orchestrators/helloOrchestrator`.

   The response is the HTTP function's initial result. It lets you know that the durable orchestration started successfully. It doesn't yet display the end result of the orchestration. The response includes a few useful URLs. For now, query the status of the orchestration.

::: zone-end

::: zone pivot="nodejs-model-v3"

6. Copy the URL value for `statusQueryGetUri`, paste it in your browser's address bar, and execute the request. You can also continue to use your HTTP test tool to issue the GET request.

   The request queries the orchestration instance for the status. You should see that the instance finished and that it includes the outputs or results of the durable function. It looks similar to this example:

```json
{
  "extensions": {
    "durableTask": {
      "hubName": "default",
      "storageProvider": {
        "type": "azureManaged",
        "connectionStringName": "DURABLE_TASK_SCHEDULER_CONNECTION_STRING"
      }
    }
  }
}
```

The emulator connection string is set in `local.settings.json`:

```json
{
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "DURABLE_TASK_SCHEDULER_CONNECTION_STRING": "Endpoint=http://localhost:8080;TaskHub=default;Authentication=None"
  }
}
```

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid related costs in your Azure subscription, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group) and all related resources.

## Related content

* Learn about [common Durable Functions app patterns](../common/durable-task-sequence.md).
* Learn how to [monitor and diagnose Durable Functions](durable-functions-diagnostics.md).
* Explore [Durable Functions versioning](durable-functions-versioning.md) for managing code changes.
