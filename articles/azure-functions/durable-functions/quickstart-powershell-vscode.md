---
title: "Quickstart: Create a PowerShell Durable Functions app"
description: Run a PowerShell Durable Functions sample app with function chaining and fan-out/fan-in patterns using the Durable Task Scheduler emulator. Get started now.
author: hhunter-ms
ms.author: hannahhunter
ms.topic: quickstart
ms.service: azure-functions
ms.date: 05/27/2026
ms.reviewer: azfuncdf, antchu
ms.devlang: powershell
---

# Quickstart: Create a PowerShell Durable Functions app

Use Durable Functions, a feature of [Azure Functions](../functions-overview.md), to write stateful serverless workflows in PowerShell. In this quickstart, you clone and run a sample app that demonstrates two common orchestration patterns:

- **Function chaining**: Calls activities sequentially (Tokyo → Seattle → London).
- **Fan-out/fan-in**: Calls activities in parallel across five cities, then aggregates the results.

By the end, you'll have both orchestrations running locally with the [Durable Task Scheduler](../../durable-task/scheduler/durable-task-scheduler-overview.md) emulator and be able to view their status in the dashboard.

> [!div class="checklist"]
>
> - Clone and prepare the Hello Cities sample project.
> - Set up the Durable Task Scheduler emulator and Azurite for local development.
> - Run the function app and trigger both orchestrations.
> - Review orchestration status and output in the Durable Task Scheduler dashboard.

## Prerequisites

- [PowerShell 7.4+](https://learn.microsoft.com/powershell/scripting/install/installing-powershell) installed.
- [Azure Functions Core Tools](../functions-run-local.md) v4 or later.
- [Docker](https://www.docker.com/products/docker-desktop/) for running the emulator and Azurite.
- Clone the [Durable Task Scheduler GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler) to use the quickstart sample.

## Set up the Durable Task Scheduler emulator

The [Durable Task Scheduler emulator](../../durable-task/scheduler/durable-task-scheduler-emulator.md) provides a local development environment so you can test orchestrations without an Azure subscription. The PowerShell Functions host also requires [Azurite](../../storage/common/storage-use-azurite.md) for local storage.

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

   ```bash
   cd samples/durable-functions/powershell/HelloCities
   ```

1. Create a `local.settings.json` file:

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

   ```bash
   curl -X POST http://localhost:7071/api/StartChaining
   ```

1. Trigger the **fan-out/fan-in** orchestration:

   ```bash
   curl -X POST http://localhost:7071/api/StartFanOutFanIn
   ```

## Expected output

The chaining orchestration greets three cities sequentially and returns:

```json
["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
```

The fan-out/fan-in orchestration greets all five cities in parallel and returns the aggregated results:

```json
["Hello Tokyo!", "Hello Seattle!", "Hello London!", "Hello Paris!", "Hello Berlin!"]
```

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

Stop the emulator containers when you're done:

```bash
docker stop dtsemulator azurite && docker rm dtsemulator azurite
```

## Next steps

- Learn about [common Durable Functions app patterns](../../durable-task/common/durable-task-sequence.md).
- Review the [standalone PowerShell SDK guide](./durable-functions-powershell-v2-sdk-migration-guide.md).
- Learn about [Durable Functions storage providers](../../durable-task/common/durable-task-storage-providers.md).
