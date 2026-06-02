---
title: "Quickstart: Create a PowerShell Durable Functions app"
description: Run a PowerShell Durable Functions sample app with function chaining and fan-out/fan-in patterns using the Durable Task Scheduler emulator. Get started now.
author: hhunter-ms
ms.author: hannahhunter
ms.topic: quickstart
ms.service: durable-task
ms.subservice: durable-functions
ms.date: 05/20/2026
ms.reviewer: azfuncdf, antchu
ms.devlang: powershell
---

# Quickstart: Create a PowerShell Durable Functions app

In this quickstart, you use Visual Studio Code to create and test a PowerShell [Durable Functions](../../azure-functions/functions-overview.md) app that orchestrates and chains together calls to other functions. You then publish it to Azure.

Durable Functions manages state, checkpoints, and restarts in your application, letting you write stateful workflows in a serverless environment.

## Prerequisites

To complete this quickstart, you need:

* [Visual Studio Code](https://code.visualstudio.com/download) installed.

* The Visual Studio Code extension [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) installed.

* The latest version of [Azure Functions Core Tools](../../azure-functions/functions-run-local.md) installed.

* An HTTP test tool that keeps your data secure. For more information, see [HTTP test tools](../../azure-functions/functions-develop-local.md#http-test-tools).

* An Azure subscription. To use Durable Functions, you must have an Azure Storage account.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project.

1. In Visual Studio Code, select F1 (or select Ctrl/Cmd+Shift+P) to open the command palette. At the prompt (`>`), enter and then select **Azure Functions: Create New Project**.

   :::image type="content" source="media/quickstart-js-vscode/functions-create-project.png" alt-text="Screenshot of the Create New Project command in Visual Studio Code for Azure Functions.":::

1. Select **Browse**. In the **Select Folder** dialog, go to a folder to use for your project, and then choose **Select**.

1. At the prompts, provide the following information:

    | Prompt | Action | Description |
    | ------ | ----- | ----------- |
    | **Select a language for your function app project** | Select **PowerShell**. | Creates a local PowerShell Functions project. |
    | **Select a version** | Select **Azure Functions v4**. | You see this option only when Core Tools isn't already installed. In this case, Core Tools is installed the first time you run the app. |
    | **Select a template for your project's first function** | Select **Skip for now**. | |
    | **Select how you would like to open your project** | Select **Open in current window**. | Opens Visual Studio Code in the folder you selected. |

Visual Studio Code installs Azure Functions Core Tools if it's required to create a project. It also creates a function app project in a folder. This project contains the [host.json](../../azure-functions/functions-host-json.md) and [local.settings.json](../../azure-functions/functions-develop-local.md#local-settings-file) configuration files.

A *package.json* file is also created in the root folder.

### Configure the standalone Durable Functions SDK

The standalone SDK provides the best performance and latest features for PowerShell Durable Functions. Configure it in three steps:

**Step 1:** Open `local.settings.json` and verify the following settings are present. Add or update them if needed:

   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "AzureWebJobsStorage": "UseDevelopmentStorage=true",
       "FUNCTIONS_WORKER_RUNTIME": "powershell",
       "DURABLE_TASK_SCHEDULER_CONNECTION_STRING": "Endpoint=http://localhost:8080;TaskHub=default;Authentication=None"
     }
   }
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

The sample project uses the PowerShell function model where each function lives in its own subdirectory with a `function.json` binding file and a `run.ps1` script.

### Activity function

The `SayHello` activity (`SayHello/run.ps1`) takes a city name and returns a greeting:

```powershell
param($city)

Write-Host "Saying hello to $city."
"Hello $city!"
```

### Orchestrator functions

The **chaining orchestrator** (`ChainingOrchestration/run.ps1`) calls `SayHello` sequentially for three cities:

```powershell
param($Context)

$output = @()
$output += Invoke-DurableActivity -FunctionName 'SayHello' -Input 'Tokyo'
$output += Invoke-DurableActivity -FunctionName 'SayHello' -Input 'Seattle'
$output += Invoke-DurableActivity -FunctionName 'SayHello' -Input 'London'

$output
```

The **fan-out/fan-in orchestrator** (`FanOutFanInOrchestration/run.ps1`) schedules activities in parallel:

```powershell
param($Context)

$cities = @('Tokyo', 'Seattle', 'London', 'Paris', 'Berlin')

# Fan-out: schedule all activities in parallel
$parallelTasks = @()
foreach ($city in $cities) {
    $parallelTasks += Invoke-DurableActivity -FunctionName 'SayHello' -Input $city -NoWait
}

# Fan-in: wait for all to complete
$output = Wait-ActivityFunction -Task $parallelTasks

$output
```

### Client functions

HTTP-triggered client functions start each orchestration. For example, `StartChaining/run.ps1`:

```powershell
param($Request, $TriggerMetadata)

$instanceId = Start-DurableOrchestration -FunctionName 'ChainingOrchestration'
Write-Host "Started chaining orchestration with ID = '$instanceId'."

$response = New-DurableOrchestrationCheckStatusResponse -Request $Request -InstanceId $instanceId
Push-OutputBinding -Name Response -Value $response
```

### Configuration

The sample uses the Durable Task Scheduler emulator as its storage backend. This is configured in `host.json`:

```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "hubName": "default",
      "storageProvider": {
        "type": "azureManaged",
        "connectionStringName": "DURABLE_TASK_SCHEDULER_CONNECTION_STRING"
      }
    }
  },
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  },
  "managedDependency": {
    "enabled": true
  }
}
```

The `managedDependency` setting automatically installs the required PowerShell modules defined in `requirements.psd1`, including the Durable Functions SDK.

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid related costs in your Azure subscription, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group) and all related resources.

## Related content

* [Common Durable Functions app patterns](../common/durable-task-sequence.md)
* [Standalone PowerShell SDK guide](./durable-functions-powershell-v2-sdk-migration-guide.md)
* [Durable Functions diagnostics and monitoring](durable-functions-diagnostics.md)
* [PowerShell developer reference for Azure Functions](../../azure-functions/functions-reference-powershell.md)
