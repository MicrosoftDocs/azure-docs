---
title: "Quickstart: Create a JavaScript Durable Functions app"
description: Create and publish a JavaScript Durable Functions app in Azure Functions by using Visual Studio Code.
author: anthonychu
ms.topic: quickstart
ms.date: 07/24/2024
ms.reviewer: azfuncdf, antchu
ms.devlang: javascript
ms.custom: devx-track-js, mode-api, vscode-azure-extension-update-complete
zone_pivot_groups: functions-nodejs-model
---

# Quickstart: Create a JavaScript Durable Functions app

Use Durable Functions, a feature of [Azure Functions](../functions-overview.md), to write stateful functions in a serverless environment. You install Durable Functions by installing the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) in Visual Studio Code. The extension manages state, checkpoints, and restarts in your application.

In this quickstart, you use the Durable Functions extension in Visual Studio Code to locally create and test a "hello world" Durable Functions app in Azure Functions. The Durable Functions app orchestrates and chains together calls to other functions. Then, you publish the function code to Azure. The tools you use are available via the Visual Studio Code extension.

[!INCLUDE [functions-nodejs-model-pivot-description](../../../includes/functions-nodejs-model-pivot-description.md)]

:::image type="content" source="./media/quickstart-js-vscode/functions-vs-code-complete.png" alt-text="Screenshot that shows a Durable Functions app in Visual Studio Code.":::

## Prerequisites

To complete this quickstart, you need:

* [Visual Studio Code](https://code.visualstudio.com/download) installed.

::: zone pivot="nodejs-model-v3"

* The Visual Studio Code extension [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) installed.

::: zone-end

::: zone pivot="nodejs-model-v4"

* The Visual Studio Code extension [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) version 1.10.4 or later installed.

::: zone-end

::: zone pivot="nodejs-model-v3"

* The latest version of [Azure Functions Core Tools](../functions-run-local.md) installed.

::: zone-end

::: zone pivot="nodejs-model-v4"

* [Azure Functions Core Tools](../functions-run-local.md) version 4.0.5382 or later installed.

::: zone-end

* An Azure subscription. To use Durable Functions, you must have an Azure Storage account.

::: zone pivot="nodejs-model-v3"

* [Node.js](https://nodejs.org/) version 16.x+ installed.

::: zone-end

::: zone pivot="nodejs-model-v4"

* [Node.js](https://nodejs.org/) version 18.x+ installed.

::: zone-end

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project.

1. In Visual Studio Code, select F1 (or select Ctrl/Cmd+Shift+P) to open the command palette. At the prompt (`>`), enter and then select **Azure Functions: Create New Project**.

   :::image type="content" source="media/quickstart-js-vscode/functions-create-project.png" alt-text="Screenshot that shows the Visual Studio Code command palette with the command Azure Functions Create New Project highlighted.":::

2. Select **Browse**. In the **Select Folder** dialog, go to a folder to use for your project, and then choose **Select**.

::: zone pivot="nodejs-model-v3"

3. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a language for your function app project** | Select **JavaScript**. | Creates a local Node.js Functions project. |
    | **Select a JavaScript programming model** | Select **Model V3**. | Sets the v3 programming model. |
    | **Select a version** | Select **Azure Functions v4**. | You see this option only when Core Tools isn't already installed. In this case, Core Tools is installed the first time you run the app. |
    | **Select a template for your project's first function** | Select **Skip for now**. | |
    | **Select how you would like to open your project** | Select **Open in current window**. | Opens Visual Studio Code in the folder you selected. |

::: zone-end

::: zone pivot="nodejs-model-v4"

3. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a language for your function app project** | Select **JavaScript**. | Creates a local Node.js Functions project. |
    | **Select a JavaScript programming model** | Select **Model V4**. | Choose the v4 programming model. |
      | **Select a version** | Select **Azure Functions v4**. | You see this option only when Core Tools isn't already installed. In this case, Core Tools is installed the first time you run the app. |
    | **Select a template for your project's first function** | Select **Skip for now**. | |
    | **Select how you would like to open your project** | Select **Open in current window**. | Opens Visual Studio Code in the folder you selected. |

::: zone-end

Visual Studio Code installs Azure Functions Core Tools if it's required to create a project. It also creates a function app project in a folder. This project contains the [host.json](../functions-host-json.md) and [local.settings.json](../functions-develop-local.md#local-settings-file) configuration files.

A *package.json* file is also created in the root folder.

## Install the Durable Functions npm package

To work with Durable Functions in a Node.js function app, you use a library called *durable-functions*.

::: zone pivot="nodejs-model-v4"

To use the v4 programming model, you install the preview v3.x version of the durable-functions library.

::: zone-end

1. Use the **View** menu or select Ctrl+Shift+` to open a new terminal in Visual Studio Code.

::: zone pivot="nodejs-model-v3"

2. Install the durable-functions npm package by running `npm install durable-functions` in the root directory of the function app.

::: zone-end

::: zone pivot="nodejs-model-v4"

2. Install the durable-functions npm package preview version by running `npm install durable-functions@preview` in the root directory of the function app.

::: zone-end

## Create your functions

The most basic Durable Functions app has three functions:

* **Orchestrator function**: A workflow that orchestrates other functions.
* **Activity function**:  A function that is called by the orchestrator function, performs work, and optionally returns a value.
* **Client function**: A regular function in Azure that starts an orchestrator function. This example uses an HTTP-triggered function.

::: zone pivot="nodejs-model-v3"

### Orchestrator function

You use a template to create the Durable Functions app code in your project.

1. In the command palette, enter and then select **Azure Functions: Create Function**.

2. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a template for your function** | Select **Durable Functions orchestrator**. | Creates a Durable Functions app orchestration. |
    | **Choose a durable storage type** | Select **Azure Storage (Default)**. | Selects the storage back end that's used for your Durable Functions app. |
    | **Provide a function name** | Enter **HelloOrchestrator**. | A name for your durable function. |

You added an orchestrator to coordinate activity functions. Open *HelloOrchestrator/index.js* to see the orchestrator function. Each call to `context.df.callActivity` invokes an activity function named `Hello`.

Next, add the referenced `Hello` activity function.

### Activity function

1. In the command palette, enter and then select **Azure Functions: Create Function**.

2. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a template for your function** | Select **Durable Functions activity**. | Creates an activity function. |
    | **Provide a function name** | Enter **Hello**. | A name for your durable function. |

You added the `Hello` activity function that is invoked by the orchestrator. Open *Hello/index.js* to see that it's taking a name as input and returning a greeting. An activity function is where you perform "the real work" in your workflow, such as making a database call or performing some nondeterministic computation.

Finally, add an HTTP-triggered function that starts the orchestration.

### Client function (HTTP starter)

1. In the command palette, enter and then select **Azure Functions: Create Function**.

2. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a template for your function** | Select **Durable Functions HTTP starter**. | Creates an HTTP starter function. |
    | **Provide a function name** | Enter **DurableFunctionsHttpStart**. | The name of your activity function. |
    | **Authorization level** | Select **Anonymous**. | For demo purposes, this value allows the function to be called without using authentication |

You added an HTTP-triggered function that starts an orchestration. Open *DurableFunctionsHttpStart/index.js* to see that it uses `client.startNew` to start a new orchestration. Then it uses `client.createCheckStatusResponse` to return an HTTP response that contains URLs that you can use to monitor and manage the new orchestration.

You now have a Durable Functions app that you can run locally and deploy to Azure.

::: zone-end

::: zone pivot="nodejs-model-v4"

One of the benefits of the v4 programming model is the flexibility of where you write your functions. In the v4 model, you can use a single template to create all three functions in one file in your project.

1. In the command palette, enter and then select **Azure Functions: Create Function**.

2. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a template for your function** | Select **Durable Functions orchestrator**. | Creates a file that has a Durable Functions app orchestration, an activity function, and a durable client starter function. |
    | **Choose a durable storage type** | Select **Azure Storage (Default)**. | Sets the storage back end to use for your Durable Functions app. |
    | **Provide a function name** | Enter **hello**. | The name of your durable function. |

Open *src/functions/hello.js* to view the functions you created.

You created an orchestrator called `helloOrchestrator` to coordinate activity functions. Each call to `context.df.callActivity` invokes an activity function called `hello`.

You also added the `hello` activity function that is invoked by the orchestrator. In the same file, you can see that it's taking a name as input and returning a greeting. An activity function is where you perform "the real work" in your workflow, such as making a database call or performing some nondeterministic computation.

Finally, also added an HTTP-triggered function that starts an orchestration. In the same file, you can see that it uses `client.startNew` to start a new orchestration. Then it uses `client.createCheckStatusResponse` to return an HTTP response that contains URLs that you can use to monitor and manage the new orchestration.

You now have a Durable Functions app that you can run locally and deploy to Azure.

::: zone-end

## Test the function locally

Azure Functions Core Tools gives you the capability to run an Azure Functions project on your local development computer. You're prompted to install these tools the first time you start a function in Visual Studio Code.

::: zone pivot="nodejs-model-v3"

1. To test your function, set a breakpoint in the `Hello` activity function code (in *Hello/index.js*). Select F5 or select **Debug: Start Debugging** in the command palette to start the function app project. Output from Core Tools appears in the terminal panel.

   > [!NOTE]
   > For more information about debugging, see [Durable Functions diagnostics](durable-functions-diagnostics.md#debugging).

::: zone-end

::: zone pivot="nodejs-model-v4"

1. To test your function, set a breakpoint in the `hello` activity function code (in *src/functions/hello.js*). Select F5 or select **Debug: Start Debugging** in the command palette to start the function app project. Output from Core Tools appears in the terminal panel.

   > [!NOTE]
   > For more information about debugging, see [Durable Functions diagnostics](durable-functions-diagnostics.md#debugging).

::: zone-end

2. Durable Functions requires an Azure Storage account to run. When Visual Studio Code prompts you to select a storage account, choose **Select storage account**.

   ![Screenshot of a Visual Studio Code alert window. Select storage account is highlighted.](media/quickstart-js-vscode/functions-select-storage.png)

3. At the prompts, provide the following information to create a new storage account in Azure:

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | Select subscription | *name of your subscription* | Select your Azure subscription |
    | Select a storage account | Create a new storage account |  |
    | Enter the name of the new storage account | *unique name* | Name of the storage account to create |
    | Select a resource group | *unique name* | Name of the resource group to create |
    | Select a location | *region* | Select a region close to you |

4. In the terminal panel, copy the URL endpoint of your HTTP-triggered function.

    ![Screenshot of the Visual Studio code terminal panel. The terminal shows the output of running an Durable Functions app locally.](media/quickstart-js-vscode/functions-f5.png)

::: zone pivot="nodejs-model-v3"

5. Use your browser or one of these HTTP test tools to send an HTTP POST request to the URL endpoint: 

   [!INCLUDE [api-test-http-request-tools](../../includes/api-test-http-request-tools.md)]

   Replace the last segment with the name of the orchestrator function (`HelloOrchestrator`). The URL should be similar to `http://localhost:7071/api/orchestrators/HelloOrchestrator`.

   The response is the HTTP function's initial result. It lets you know that the durable orchestration started successfully. It doesn't yet display the end result of the orchestration. The response includes a few useful URLs. For now, query the status of the orchestration.

::: zone-end

::: zone pivot="nodejs-model-v4"

5. Use your browser or one of these HTTP test tools to send an HTTP POST request to the URL endpoint: 

   [!INCLUDE [api-test-http-request-tools](../../includes/api-test-http-request-tools.md)]

   Replace the last segment with the name of the orchestrator function (`HelloOrchestrator`). The URL should be similar to `http://localhost:7071/api/orchestrators/HelloOrchestrator`.

   The response is the HTTP function's initial result. It lets you know that the durable orchestration started successfully. It doesn't yet display the end result of the orchestration. The response includes a few useful URLs. For now, query the status of the orchestration.

::: zone-end

::: zone pivot="nodejs-model-v3"

6. Copy the URL value for `statusQueryGetUri`, paste it in your browser's address bar, and execute the request. Alternatively, you can also continue to use your HTTP test tool to issue the GET request.

    The request queries the orchestration instance for the status. You should see that the instance finished and that it includes the outputs or results of the Durable Functions app, like in this example:

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

::: zone-end

::: zone pivot="nodejs-model-v4"

6. Copy the URL value for `statusQueryGetUri`, paste it in your browser's address bar, and execute the request. You can also continue to use your HTTP test tool to issue the GET request.

    The request queries the orchestration instance for the status. You should see that the instance finished and that it includes the outputs or results of the Durable Functions app, like in this example:

    ```json
    {
        "name": "helloOrchestrator",
        "instanceId": "6ba3f77933b1461ea1a3828c013c9d56",
        "runtimeStatus": "Completed",
        "input": "",
        "customStatus": null,
        "output": [
            "Hello, Tokyo",
            "Hello, Seattle",
            "Hello, Cairo"
        ],
        "createdTime": "2023-02-13T23:02:21Z",
        "lastUpdatedTime": "2023-02-13T23:02:25Z"
    }
    ```

    ::: zone-end

7. In Visual Studio Code, select Shift+F5 to stop debugging.

After you verify that the function runs correctly on your local computer, it's time to publish the project to Azure.

[!INCLUDE [functions-create-function-app-vs-code](../../../includes/functions-sign-in-vs-code.md)]

[!INCLUDE [functions-publish-project-vscode](../../../includes/functions-publish-project-vscode.md)]

## Test your function in Azure

::: zone pivot="nodejs-model-v4"

> [!NOTE]
> To use the v4 Node.js programming model, make sure that your app is running on at least version 4.25 of the Azure Functions runtime.
>

::: zone-end

::: zone pivot="nodejs-model-v3"

1. On the output panel, copy the URL of the HTTP trigger. The URL that calls your HTTP-triggered function should be in this format:

   `https://<functionappname>.azurewebsites.net/api/orchestrators/HelloOrchestrator`

::: zone-end

::: zone pivot="nodejs-model-v4"

1. On the output panel, copy the URL of the HTTP trigger. The URL that calls your HTTP-triggered function should be in this format:

   `https://<functionappname>.azurewebsites.net/api/orchestrators/helloOrchestrator`

::: zone-end

2. Paste the new URL for the HTTP request in your browser's address bar. When you use the published app, you can expect to get the same status response that you got when you tested locally.

The JavaScript Durable Functions app that you created and published in Visual Studio Code is ready to use.

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid related costs in your Azure subscription, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group) and all related resources.

## Related content

* Learn about [common Durable Functions app patterns](durable-functions-overview.md#application-patterns).
