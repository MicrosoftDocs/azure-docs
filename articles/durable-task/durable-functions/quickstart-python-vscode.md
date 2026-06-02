---
title: "Quickstart: Create a Python Durable Functions app"
description: Run a Python Durable Functions sample app with function chaining and fan-out/fan-in patterns using the Durable Task Scheduler emulator. Get started now.
author: hhunter-ms
ms.author: hannahhunter
ms.topic: quickstart
ms.service: durable-task
ms.subservice: durable-functions
ms.date: 05/20/2026
ms.reviewer: azfuncdf, lilyjma
ms.devlang: python
ms.custom:
  - devx-track-python
---

# Quickstart: Create a Python Durable Functions app

Use Durable Functions, a feature of [Azure Functions](../../azure-functions/functions-overview.md), to build stateful serverless functions in Python. Durable Functions automatically manages state persistence, checkpoints, and restarts, so you can focus on your orchestration logic.

- **Function chaining**: Calls activities sequentially (Tokyo → Seattle → London).
- **Fan-out/fan-in**: Calls activities in parallel across five cities, then aggregates the results.

By the end, you'll have both orchestrations running locally with the [Durable Task Scheduler](../../durable-task/scheduler/durable-task-scheduler.md) emulator and be able to view their status in the dashboard.

> [!NOTE]
> This quickstart uses the decorator-based [v2 programming model for Python](../../azure-functions/functions-reference-python.md). This model gives a simpler file structure and is more code-centric compared to v1.

## Prerequisites

To complete this quickstart, you need:

* [Visual Studio Code](https://code.visualstudio.com/download) installed.

* The Visual Studio Code extension [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) installed.

* The latest version of [Azure Functions Core Tools](../../azure-functions/functions-run-local.md) installed.

* An HTTP test tool that keeps your data secure. For more information, see [HTTP test tools](../../azure-functions/functions-develop-local.md#http-test-tools).

* An Azure subscription for deploying app to Azure. 

* [Python](https://www.python.org/) version 3.7, 3.8, 3.9, or 3.10 installed.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project.

1. In Visual Studio Code, select F1 (or select Ctrl/Cmd+Shift+P) to open the command palette. At the prompt (`>`), enter and then select **Azure Functions: Create New Project**.

    :::image type="content" source="media/quickstart-python-vscode/functions-create-project.png" alt-text="Screenshot of the Create New Project window in Visual Studio Code for Azure Functions.":::

2. Select **Browse**. In the **Select Folder** dialog, go to a folder to use for your project, and then choose **Select**.

3. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a language for your function app project** | Select **Python**. | Creates a local Python Functions project. |
    | **Select a version** | Select **Azure Functions v4**. | You see this option only when Core Tools isn't already installed. In this case, Core Tools is installed the first time you run the app. |
    | **Python version** | Select **Python 3.7**, **Python 3.8**, **Python 3.9**, or **Python 3.10**. | Visual Studio Code creates a virtual environment by using the version you select. |
    | **Select a template for your project's first function** | Select **Skip for now**. | |
    | **Select how you would like to open your project** | Select **Open in current window**. | Opens Visual Studio Code in the folder you selected. |

Visual Studio Code installs Azure Functions Core Tools if it's required to create a project. It also creates a function app project in a folder. This project contains the [host.json](../../azure-functions/functions-host-json.md) and [local.settings.json](../../azure-functions/functions-develop-local.md#local-settings-file) configuration files.

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
   cd samples/durable-functions/python/hello-cities
   ```

1. Create a virtual environment and install dependencies:

   ```powershell
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```

1. Start the function app:

   ```bash
   func start
   ```

1. In a separate terminal, trigger the **function chaining** orchestration:

   ```powershell
   $response = Invoke-RestMethod -Method POST -Uri http://localhost:7071/api/StartChaining
   $response
   ```

   The response contains status URLs for the orchestration instance. Copy the `statusQueryGetUri` value and run it to check the result:

   ```powershell
   Invoke-RestMethod -Uri $response.statusQueryGetUri
   ```

1. Trigger the **fan-out/fan-in** orchestration:

   ```powershell
   $response = Invoke-RestMethod -Method POST -Uri http://localhost:7071/api/StartFanOutFanIn
   Invoke-RestMethod -Uri $response.statusQueryGetUri
   ```

## Expected output

The POST request returns a JSON response with status URLs. For example:

```json
{
  "id": "<instanceId>",
  "statusQueryGetUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/<instanceId>?code=...",
  "sendEventPostUri": "...",
  "terminatePostUri": "...",
  "purgeHistoryDeleteUri": "..."
}
```

When you query `statusQueryGetUri` and the orchestration's `runtimeStatus` is `Completed`, you can find the greeting results in the `output` field. The chaining orchestration returns:

```json
{
  "name": "ChainingOrchestration",
  "runtimeStatus": "Completed",
  "output": ["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
}
```

The fan-out/fan-in orchestration returns:

```json
{
  "name": "FanOutFanInOrchestration",
  "runtimeStatus": "Completed",
  "output": ["Hello Tokyo!", "Hello Seattle!", "Hello London!", "Hello Paris!", "Hello Berlin!"]
}
```

> [!TIP]
> If `runtimeStatus` shows `Running` or `Pending`, wait a moment and query the `statusQueryGetUri` again.

Open the Durable Task Scheduler dashboard at `http://localhost:8082` to view the orchestration status and execution history.

## Understand the code

The sample project in `function_app.py` contains all three function types needed for a Durable Functions app.

### Activity function

The `say_hello` activity performs the unit of work. It takes a city name and returns a greeting:

```python
@app.activity_trigger(input_name="city")
def say_hello(city: str) -> str:
    """Activity function that returns a greeting for a city."""
    logging.info(f"Saying hello to {city}.")
    return f"Hello {city}!"
```

### Orchestrator functions

The **chaining orchestrator** calls `say_hello` sequentially for three cities:

```python
@app.orchestration_trigger(context_name="context")
def chaining_orchestration(context: df.DurableOrchestrationContext):
    """Function chaining orchestration: calls activities sequentially."""
    result1 = yield context.call_activity("say_hello", "Tokyo")
    result2 = yield context.call_activity("say_hello", "Seattle")
    result3 = yield context.call_activity("say_hello", "London")
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
| `http_start` | An [HTTP-triggered function](../../azure-functions/functions-bindings-http-webhook.md) that starts an instance of the orchestration and returns a `check status` response. |

> [!NOTE]
> Durable Functions also supports Python v2 programming model [blueprints](../../azure-functions/functions-reference-python.md#organizing-with-blueprints). To use blueprints, register your blueprint functions by using the [azure-functions-durable](https://pypi.org/project/azure-functions-durable) `Blueprint` [class](https://github.com/Azure/azure-functions-durable-python/blob/dev/samples-v2/blueprint/durable_blueprints.py). You can register the resulting blueprint as usual. You can use our [sample](https://github.com/Azure/azure-functions-durable-python/tree/dev/samples-v2/blueprint) as an example.

## Configure the Azurite storage emulator

You can use [Azurite](../../storage/common/storage-use-azurite.md?tabs=visual-studio-code), an emulator for Azure Storage, to test the function locally. In *local.settings.json*, set the value for `AzureWebJobsStorage` to `UseDevelopmentStorage=true` like in this example:

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

To install and start running the Azurite extension in Visual Studio Code, in the command palette, enter **Azurite: Start** and select Enter.

You can use other storage options for your Durable Functions app. For more information about storage options and benefits, see [Durable Functions storage providers](../common/durable-task-storage-providers.md).

## Test the function locally

Azure Functions Core Tools gives you the capability to run an Azure Functions project on your local development computer. If it isn't installed, you're prompted to install these tools the first time you start a function in Visual Studio Code.

1. To test your function, set a breakpoint in the `hello` activity function code. Select F5 or select **Debug: Start Debugging** in the command palette to start the function app project. Output from Core Tools appears in the terminal panel.

   > [!NOTE]
   > For more information about debugging, see [Durable Functions diagnostics](durable-functions-diagnostics.md#debugging).

2. In the terminal panel, copy the URL endpoint of your HTTP-triggered function.

    :::image type="content" source="media/quickstart-python-vscode/functions-f5.png" alt-text="Screenshot of the Azure Functions local output in the terminal showing the HTTP endpoint URL.":::

3. Use your browser or an HTTP test tool to send an HTTP POST request to the URL endpoint.

   Replace the last segment with the name of the orchestrator function (`hello_orchestrator`). The URL should be similar to `http://localhost:7071/api/orchestrators/hello_orchestrator`.

   The response is the HTTP function's initial result. It lets you know that the durable orchestration has started successfully. It doesn't yet display the end result of the orchestration. The response includes a few useful URLs. For now, query the status of the orchestration.

4. Copy the URL value for `statusQueryGetUri`, paste it in your browser's address bar, and execute the request. You can also continue to use your HTTP test tool to issue the GET request.

    The request queries the orchestration instance for the status. You should see that the instance finished and that it includes the outputs or results of the durable function. It looks similar to this example:

```json
{
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "python",
    "DURABLE_TASK_SCHEDULER_CONNECTION_STRING": "Endpoint=http://localhost:8080;TaskHub=default;Authentication=None"
  }
}
```

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid related costs in your Azure subscription, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group) and all related resources.

## Related content

* Learn about [common Durable Functions app patterns](../common/durable-task-sequence.md).
* Learn about [Unit testing](durable-functions-unit-testing.md)
