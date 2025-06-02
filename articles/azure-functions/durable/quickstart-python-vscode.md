---
title: "Quickstart: Create a Python Durable Functions app"
description: Create and publish a Python Durable Functions app in Azure Functions by using Visual Studio Code.
author: lilyjma
ms.topic: quickstart
ms.date: 05/31/2025
ms.reviewer: azfuncdf, lilyjma
ms.devlang: python
ms.custom: mode-api, devdivchpfy22, vscode-azure-extension-update-complete, devx-track-python
---

# Quickstart: Create a Python Durable Functions app

Use Durable Functions, a feature of [Azure Functions](../functions-overview.md), to write stateful functions in a serverless environment. You install Durable Functions by installing the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) in Visual Studio Code. The extension manages state, checkpoints, and restarts in your application.

In this quickstart, you use the Durable Functions extension in Visual Studio Code to locally create and test a "hello world" Durable Functions app in Azure Functions. The Durable Functions app orchestrates and chains together calls to other functions. Then, you publish the function code to Azure. The tools you use are available via the Visual Studio Code extension.

:::image type="content" source="./media/quickstart-python-vscode/functions-vs-code-complete.png" alt-text="Screenshot of the running Durable Functions app in Azure.":::

> [!NOTE]
> This quickstart uses the decorator-based [v2 programming model for Python](../functions-reference-python.md). This model gives a simpler file structure and is more code-centric compared to v1.

## Prerequisites

To complete this quickstart, you need:

* [Visual Studio Code](https://code.visualstudio.com/download) installed.

* The Visual Studio Code extension [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) installed.

* The latest version of [Azure Functions Core Tools](../functions-run-local.md) installed.

* An HTTP test tool that keeps your data secure. For more information, see [HTTP test tools](../functions-develop-local.md#http-test-tools).

* An Azure subscription for deploying app to Azure. 

* [Python](https://www.python.org/) version 3.7, 3.8, 3.9, or 3.10 installed.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project.

1. In Visual Studio Code, select F1 (or select Ctrl/Cmd+Shift+P) to open the command palette. At the prompt (`>`), enter and then select **Azure Functions: Create New Project**.

    :::image type="content" source="media/quickstart-python-vscode/functions-create-project.png" alt-text="Screenshot of Create function window.":::

2. Select **Browse**. In the **Select Folder** dialog, go to a folder to use for your project, and then choose **Select**.

3. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a language for your function app project** | Select **Python**. | Creates a local Python Functions project. |
    | **Select a version** | Select **Azure Functions v4**. | You see this option only when Core Tools isn't already installed. In this case, Core Tools is installed the first time you run the app. |
    | **Python version** | Select **Python 3.7**, **Python 3.8**, **Python 3.9**, or **Python 3.10**. | Visual Studio Code creates a virtual environment by using the version you select. |
    | **Select a template for your project's first function** | Select **Skip for now**. | |
    | **Select how you would like to open your project** | Select **Open in current window**. | Opens Visual Studio Code in the folder you selected. |

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

> [!NOTE]
> You must install [azure-functions-durable](https://pypi.org/project/azure-functions-durable/) v1.2.4 or above.

## Create your functions

The most basic Durable Functions app has three functions:

* **Orchestrator function**: A workflow that orchestrates other functions.
* **Activity function**:  A function that is called by the orchestrator function, performs work, and optionally returns a value.
* **Client function**: A regular function in Azure that starts an orchestrator function. This example uses an HTTP-triggered function.

## Sample code 

To create a basic Durable Functions app by using these three function types, replace the contents of *function_app.py* with the following Python code:

```python
import azure.functions as func
import azure.durable_functions as df

myApp = df.DFApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# An HTTP-triggered function with a Durable Functions client binding
@myApp.route(route="orchestrators/hello_orchestrator")
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
> Durable Functions also supports Python v2 programming model [blueprints](../functions-reference-python.md#blueprints). To use blueprints, register your blueprint functions by using the [azure-functions-durable](https://pypi.org/project/azure-functions-durable) `Blueprint` [class](https://github.com/Azure/azure-functions-durable-python/blob/dev/samples-v2/blueprint/durable_blueprints.py). You can register the resulting blueprint as usual. You can use our [sample](https://github.com/Azure/azure-functions-durable-python/tree/dev/samples-v2/blueprint) as an example.

## Configure storage emulator

You can use [Azurite](../../storage/common/storage-use-azurite.md?tabs=visual-studio-code), an emulator for Azure Storage, to test the function locally. In *local.settings.json*, set the value for `AzureWebJobsStorage` to `UseDevelopmentStorage=true` like in this example:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "python"
  }
}
```

To install and start running the Azurite extension in Visual Studio Code, in the command palette, enter **Azurite: Start** and select Enter.

You can use other storage options for your Durable Functions app. For more information about storage options and benefits, see [Durable Functions storage providers](durable-functions-storage-providers.md).

## Test the function locally

Azure Functions Core Tools gives you the capability to run an Azure Functions project on your local development computer. If it isn't installed, you're prompted to install these tools the first time you start a function in Visual Studio Code.

1. To test your function, set a breakpoint in the `hello` activity function code. Select F5 or select **Debug: Start Debugging** in the command palette to start the function app project. Output from Core Tools appears in the terminal panel.

   > [!NOTE]
   > For more information about debugging, see [Durable Functions diagnostics](durable-functions-diagnostics.md#debugging).

2. In the terminal panel, copy the URL endpoint of your HTTP-triggered function.

    :::image type="content" source="media/quickstart-python-vscode/functions-f5.png" alt-text="Screenshot of Azure local output.":::

3. Use your browser or an HTTP test tool to send an HTTP POST request to the URL endpoint.

   Replace the last segment with the name of the orchestrator function (`hello_orchestrator`). The URL should be similar to `http://localhost:7071/api/orchestrators/hello_orchestrator`.

   The response is the HTTP function's initial result. It lets you know that the durable orchestration has started successfully. It doesn't yet display the end result of the orchestration. The response includes a few useful URLs. For now, query the status of the orchestration.

4. Copy the URL value for `statusQueryGetUri`, paste it in your browser's address bar, and execute the request. You can also continue to use your HTTP test tool to issue the GET request.

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

5. To stop debugging, in Visual Studio Code, select Shift+F5.

After you verify that the function runs correctly on your local computer, it's time to publish the project to Azure.

[!INCLUDE [functions-create-function-app-vs-code](../../../includes/functions-sign-in-vs-code.md)]

[!INCLUDE [functions-publish-project-vscode](../../../includes/functions-publish-project-vscode.md)]

## Test your function in Azure

1. Copy the URL of the HTTP trigger from the output panel. The URL that calls your HTTP-triggered function must be in this format:

   `https://<functionappname>.azurewebsites.net/api/orchestrators/hello_orchestrator`

2. Paste the new URL for the HTTP request in your browser's address bar. When you use the published app, you can expect to get the same status response that you got when you tested locally.

The Python Durable Functions app that you created and published by using Visual Studio Code is ready to use.

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid related costs in your Azure subscription, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group) and all related resources.

## Related content

* Learn about [common Durable Functions app patterns](durable-functions-overview.md#application-patterns).
