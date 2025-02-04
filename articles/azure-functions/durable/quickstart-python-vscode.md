---
title: "Quickstart: Create a Python Durable Functions app"
description: Create and publish a Python Durable Functions app in Azure Functions by using Visual Studio Code.
author: davidmrdavid
ms.topic: quickstart
ms.date: 07/24/2024
ms.reviewer: azfuncdf, davidmrdavid
ms.devlang: python
ms.custom: mode-api, devdivchpfy22, vscode-azure-extension-update-complete, devx-track-python
zone_pivot_groups: python-mode-functions
---

# Quickstart: Create a Python Durable Functions app

Use Durable Functions, a feature of [Azure Functions](../functions-overview.md), to write stateful functions in a serverless environment. You install Durable Functions by installing the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) in Visual Studio Code. The extension manages state, checkpoints, and restarts in your application.

In this quickstart, you use the Durable Functions extension in Visual Studio Code to locally create and test a "hello world" Durable Functions app in Azure Functions. The Durable Functions app orchestrates and chains together calls to other functions. Then, you publish the function code to Azure. The tools you use are available via the Visual Studio Code extension.

:::image type="content" source="./media/quickstart-python-vscode/functions-vs-code-complete.png" alt-text="Screenshot of the running Durable Functions app in Azure.":::

## Prerequisites

To complete this quickstart, you need:

* [Visual Studio Code](https://code.visualstudio.com/download) installed.

* The Visual Studio Code extension [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) installed.

* The latest version of [Azure Functions Core Tools](../functions-run-local.md) installed.

* An HTTP test tool that keeps your data secure. For more information, see [HTTP test tools](../functions-develop-local.md#http-test-tools).

* An Azure subscription. To use Durable Functions, you must have an Azure Storage account.

* [Python](https://www.python.org/) version 3.7, 3.8, 3.9, or 3.10 installed.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project.

1. In Visual Studio Code, select F1 (or select Ctrl/Cmd+Shift+P) to open the command palette. At the prompt (`>`), enter and then select **Azure Functions: Create New Project**.

    :::image type="content" source="media/quickstart-python-vscode/functions-create-project.png" alt-text="Screenshot of Create function window.":::

2. Select **Browse**. In the **Select Folder** dialog, go to a folder to use for your project, and then choose **Select**.

::: zone pivot="python-mode-configuration"

3. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a language for your function app project** | Select **Python**. | Creates a local Python Functions project. |
    | **Select a version** | Select **Azure Functions v4**. | You see this option only when Core Tools isn't already installed. In this case, Core Tools is installed the first time you run the app. |
    | **Python version** | Select **Python 3.7**, **Python 3.8**, **Python 3.9**, or **Python 3.10**. | Visual Studio Code creates a virtual environment by using the version you select. |
    | **Select a template for your project's first function** | Select **Skip for now**. | |
    | **Select how you would like to open your project** | Select **Open in current window**. | Opens Visual Studio Code in the folder you selected. |

::: zone-end

::: zone pivot="python-mode-decorators"

3. At the prompts, provide the following information:

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | **Select a language** | Select **Python (Programming Model V2)**. | Creates a local Python Functions project by using the V2 programming model. |
    | **Select a version** | Select **Azure Functions v4**. | You see this option only when Core Tools isn't already installed. In this case, Core Tools is installed the first time you run the app. |
    | **Python version** | Select **Python 3.7**, **Python 3.8**, **Python 3.9**, or **Python 3.10**. | Visual Studio Code creates a virtual environment by using the version you select. |
    | **Select how you would like to open your project** | Select **Open in current window**. | Opens Visual Studio Code in the folder you selected. |

::: zone-end

Visual Studio Code installs Azure Functions Core Tools if it's required to create a project. It also creates a function app project in a folder. This project contains the [host.json](../functions-host-json.md) and [local.settings.json](../functions-develop-local.md#local-settings-file) configuration files.

A *requirements.txt* file is also created in the root folder. It specifies the Python packages required to run your function app.

## Install azure-functions-durable from PyPI

When you create the project, the Azure Functions Visual Studio Code extension automatically creates a virtual environment with your selected Python version. You then need to activate the virtual environment in a terminal and install some dependencies required by Azure Functions and Durable Functions.

1. Open the *requirements.txt* in the editor and change its content to the following code:

    ```txt
    azure-functions
    azure-functions-durable
    ```

2. In the current folder, open the editor's integrated terminal (Ctrl+Shift+`).

3. In the integrated terminal, activate the virtual environment in the current folder, depending on your operating system.

   # [Linux](#tab/linux)

   ```bash
   source .venv/bin/activate
   ```

   # [macOS](#tab/macos)

   ```bash
   source .venv/bin/activate
   ```

   # [Windows](#tab/windows)

   ```powershell
   .venv\scripts\activate
   ```

---

Then, in the integrated terminal where the virtual environment is activated, use pip to install the packages you defined.

```bash
python -m pip install -r requirements.txt
```

## Create your functions

The most basic Durable Functions app has three functions:

* **Orchestrator function**: A workflow that orchestrates other functions.
* **Activity function**:  A function that is called by the orchestrator function, performs work, and optionally returns a value.
* **Client function**: A regular function in Azure that starts an orchestrator function. This example uses an HTTP-triggered function.

::: zone pivot="python-mode-configuration"

### Orchestrator function

You use a template to create the Durable Functions app code in your project.

1. In the command palette, enter and then select **Azure Functions: Create Function**.

2. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a template for your function** | Select **Durable Functions orchestrator**. | Creates a Durable Functions app orchestration. |
    | **Provide a function name** | Select **HelloOrchestrator**. | A name for your durable function. |

You added an orchestrator to coordinate activity functions. Open *HelloOrchestrator/\_\_init__.py* to see the orchestrator function. Each call to `context.call_activity` invokes an activity function named `Hello`.

Next, you add the referenced `Hello` activity function.

### Activity function

1. In the command palette, enter and then select **Azure Functions: Create Function**.

2. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a template for your function** | Select **Durable Functions activity**. | Creates an activity function. |
    | **Provide a function name** | Enter **Hello**. | The name of your activity function. |

You added the `Hello` activity function that is invoked by the orchestrator. Open *Hello/\_\_init__.py* to see that it takes a name as input and returns a greeting. An activity function is where you perform actions such as making a database call or performing a computation.

Finally, you add an HTTP-triggered function that starts the orchestration.

### Client function (HTTP starter)

1. In the command palette, enter and then select **Azure Functions: Create Function**.

2. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a template for your function** | Select **Durable Functions HTTP starter**. | Creates an HTTP starter function. |
    | **Provide a function name** | Enter **DurableFunctionsHttpStart**. | The name of your client function |
    | **Authorization level** | Select **Anonymous**. | For demo purposes, this value allows the function to be called without using authentication. |

You added an HTTP-triggered function that starts an orchestration. Open *DurableFunctionsHttpStart/\_\_init__.py* to see that it uses `client.start_new` to start a new orchestration. Then it uses `client.create_check_status_response` to return an HTTP response containing URLs that can be used to monitor and manage the new orchestration.

You now have a Durable Functions app that can be run locally and deployed to Azure.

::: zone-end

::: zone pivot="python-mode-decorators"

## Requirements

Version 2 of the Python programming model requires the following minimum versions:

* [Azure Functions Runtime](../functions-versions.md) v4.16+
* [Azure Functions Core Tools](../functions-run-local.md) v4.0.5095+ (if running locally)
* [azure-functions-durable](https://pypi.org/project/azure-functions-durable/) v1.2.4+

## Enable the v2 programming model

The following application setting is required to run the v2 programming model:

* **Name**: `AzureWebJobsFeatureFlags`
* **Value**: `EnableWorkerIndexing`

If you're running locally by using [Azure Functions Core Tools](../functions-run-local.md), add this setting to your *local.settings.json* file. If you're running in Azure, complete these steps by using a relevant tool:

# [Azure CLI](#tab/azure-cli-set-indexing-flag)

Replace `<FUNCTION_APP_NAME>` and `<RESOURCE_GROUP_NAME>` with the name of your function app and resource group, respectively.

```azurecli
az functionapp config appsettings set --name <FUNCTION_APP_NAME> --resource-group <RESOURCE_GROUP_NAME> --settings AzureWebJobsFeatureFlags=EnableWorkerIndexing
```

# [Azure PowerShell](#tab/azure-powershell-set-indexing-flag)

Replace `<FUNCTION_APP_NAME>` and `<RESOURCE_GROUP_NAME>` with the name of your function app and resource group, respectively.

```azurepowershell
Update-AzFunctionAppSetting -Name <FUNCTION_APP_NAME> -ResourceGroupName <RESOURCE_GROUP_NAME> -AppSetting @{"AzureWebJobsFeatureFlags" = "EnableWorkerIndexing"}
```

# [Visual Studio Code](#tab/vs-code-set-indexing-flag)

1. Make sure that you have the [Azure Functions extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) installed.
2. Select F1 to open the command palette. At the prompt (`>`), enter and then select **Azure Functions: Add New Setting**.
3. Select your subscription and function app when you are prompted.
4. For the name, enter **AzureWebJobsFeatureFlags**, and then select Enter.
5. For the value, enter **EnableWorkerIndexing**, and then select Enter.

---

To create a basic Durable Functions app by using these three function types, replace the contents of *function_app.py* with the following Python code:

```python
import azure.functions as func
import azure.durable_functions as df

myApp = df.DFApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# An HTTP-triggered function with a Durable Functions client binding
@myApp.route(route="orchestrators/{functionName}")
@myApp.durable_client_input(client_name="client")
async def http_start(req: func.HttpRequest, client):
    function_name = req.route_params.get('functionName')
    instance_id = await client.start_new(function_name)
    response = client.create_check_status_response(req, instance_id)
    return response

# Orchestrator
@myApp.orchestration_trigger(context_name="context")
def hello_orchestrator(context):
    result1 = yield context.call_activity("hello", "Seattle")
    result2 = yield context.call_activity("hello", "Tokyo")
    result3 = yield context.call_activity("hello", "London")

    return [result1, result2, result3]

# Activity
@myApp.activity_trigger(input_name="city")
def hello(city: str):
    return f"Hello {city}"
```

Review the following table for an explanation of each function and its purpose in the sample:

| Method | Description |
| -----  | ----------- |
| `hello_orchestrator` | The orchestrator function, which describes the workflow. In this case, the orchestration starts, invokes three functions in a sequence, and then returns the ordered results of all three functions in a list.  |
| `hello` | The activity function, which performs the work that is orchestrated. The function returns a simple greeting to the city passed as an argument. |
| `http_start` | An [HTTP-triggered function](../functions-bindings-http-webhook.md) that starts an instance of the orchestration and returns a `check status` response. |

> [!NOTE]
> Durable Functions also supports Python v2 [blueprints](../functions-reference-python.md#blueprints). To use blueprints, register your blueprint functions by using the [azure-functions-durable](https://pypi.org/project/azure-functions-durable) `Blueprint` [class](https://github.com/Azure/azure-functions-durable-python/blob/dev/samples-v2/blueprint/durable_blueprints.py). You can register the resulting blueprint as usual. You can use our [sample](https://github.com/Azure/azure-functions-durable-python/tree/dev/samples-v2/blueprint) as an example.

::: zone-end

## Test the function locally

Azure Functions Core Tools gives you the capability to run an Azure Functions project on your local development computer. If it isn't installed, you're prompted to install these tools the first time you start a function in Visual Studio Code.

::: zone pivot="python-mode-configuration"

1. To test your function, set a breakpoint in the `Hello` activity function code (in *Hello/\_\_init__.py*). Select F5 or select **Debug: Start Debugging** in the command palette to start the function app project. Output from Core Tools appears in the terminal panel.

   > [!NOTE]
   > For more information about debugging, see [Durable Functions diagnostics](durable-functions-diagnostics.md#debugging).

::: zone-end

::: zone pivot="python-mode-decorators"

1. To test your function, set a breakpoint in the `hello` activity function code. Select F5 or select **Debug: Start Debugging** in the command palette to start the function app project. Output from Core Tools appears in the terminal panel.

   > [!NOTE]
   > For more information about debugging, see [Durable Functions diagnostics](durable-functions-diagnostics.md#debugging).

::: zone-end

2. Durable Functions requires an Azure storage account to run. When Visual Studio Code prompts you to select a storage account, select **Select storage account**.

    :::image type="content" source="media/quickstart-python-vscode/functions-select-storage.png" alt-text="Screenshot of how to create a storage account.":::

3. At the prompts, provide the following information to create a new storage account in Azure.

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select subscription** | Select the name of your subscription. | Your Azure subscription. |
    | **Select a storage account** | Select **Create a new storage account**. |  |
    | **Enter the name of the new storage account** | Enter a unique name. | The name of the storage account to create. |
    | **Select a resource group** | Enter a unique name. | The name of the resource group to create. |
    | **Select a location** | Select an Azure region. | Select a region that is close to you. |

4. In the terminal panel, copy the URL endpoint of your HTTP-triggered function.

    :::image type="content" source="media/quickstart-python-vscode/functions-f5.png" alt-text="Screenshot of Azure local output.":::

::: zone pivot="python-mode-configuration"

5. Use your browser or an HTTP test tool to send an HTTP POST request to the URL endpoint.

   Replace the last segment with the name of the orchestrator function (`HelloOrchestrator`). The URL should be similar to `http://localhost:7071/api/orchestrators/HelloOrchestrator`.

   The response is the HTTP function's initial result. It lets you know that the durable orchestration has started successfully. It doesn't yet display the end result of the orchestration. The response includes a few useful URLs. For now, query the status of the orchestration.

6. Copy the URL value for `statusQueryGetUri`, paste it in your browser's address bar, and execute the request. You can also continue to use your HTTP test tool to issue the GET request.

    The request queries the orchestration instance for the status. You should see that the instance finished and that it includes the outputs or results of the durable function. It looks similar to this example:

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

::: zone pivot="python-mode-decorators"

5. Use your browser or an HTTP test tool to send an HTTP POST request to the URL endpoint.

   Replace the last segment with the name of the orchestrator function (`hello_orchestrator`). The URL should be similar to `http://localhost:7071/api/orchestrators/hello_orchestrator`.

   The response is the HTTP function's initial result. It lets you know that the durable orchestration has started successfully. It doesn't yet display the end result of the orchestration. The response includes a few useful URLs. For now, query the status of the orchestration.

6. Copy the URL value for `statusQueryGetUri`, paste it in your browser's address bar, and execute the request. You can also continue to use your HTTP test tool to issue the GET request.

    The request queries the orchestration instance for the status. You should see that the instance finished and that it includes the outputs or results of the durable function. It looks similar to this example:

    ```json
    {
        "name": "hello_orchestrator",
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


7. To stop debugging, in Visual Studio Code, select Shift+F5.

After you verify that the function runs correctly on your local computer, it's time to publish the project to Azure.

[!INCLUDE [functions-create-function-app-vs-code](../../../includes/functions-sign-in-vs-code.md)]

[!INCLUDE [functions-publish-project-vscode](../../../includes/functions-publish-project-vscode.md)]

## Test your function in Azure

::: zone pivot="python-mode-configuration"

1. Copy the URL of the HTTP trigger from the output panel. The URL that calls your HTTP-triggered function must be in this format:

   `https://<functionappname>.azurewebsites.net/api/orchestrators/HelloOrchestrator`

::: zone-end

::: zone pivot="python-mode-decorators"

1. Copy the URL of the HTTP trigger from the output panel. The URL that calls your HTTP-triggered function must be in this format:

   `https://<functionappname>.azurewebsites.net/api/orchestrators/hello_orchestrator`

::: zone-end

2. Paste the new URL for the HTTP request in your browser's address bar. When you use the published app, you can expect to get the same status response that you got when you tested locally.

The Python Durable Functions app that you created and published by using Visual Studio Code is ready to use.

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid related costs in your Azure subscription, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group) and all related resources.

## Related content

* Learn about [common Durable Functions app patterns](durable-functions-overview.md#application-patterns).
