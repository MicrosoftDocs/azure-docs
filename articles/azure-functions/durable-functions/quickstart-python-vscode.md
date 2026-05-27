---
title: "Quickstart: Create a Python Durable Functions app"
description: Run a Python Durable Functions sample app with function chaining and fan-out/fan-in patterns using the Durable Task Scheduler emulator. Get started now.
author: hhunter-ms
ms.author: hannahhunter
ms.topic: quickstart
ms.service: azure-functions
ms.date: 05/26/2026
ms.reviewer: azfuncdf
ms.devlang: python
ms.custom:
  - devx-track-python
---

# Quickstart: Create a Python Durable Functions app

Use Durable Functions, a feature of [Azure Functions](../functions-overview.md), to build stateful serverless workflows in Python. In this quickstart, you clone and run a sample app that demonstrates two common orchestration patterns:

- **Function chaining**: Calls activities sequentially (Tokyo → Seattle → London).
- **Fan-out/fan-in**: Calls activities in parallel across five cities, then aggregates the results.

By the end, you'll have both orchestrations running locally with the [Durable Task Scheduler](../../durable-task/scheduler/durable-task-scheduler.md) emulator and be able to view their status in the dashboard.

> [!NOTE]
> This quickstart uses the decorator-based [v2 programming model for Python](../functions-reference-python.md).

> [!div class="checklist"]
>
> - Clone and prepare the Hello Cities sample project.
> - Set up the Durable Task Scheduler emulator for local development.
> - Run the function app and trigger both orchestrations.
> - Review orchestration status and output in the Durable Task Scheduler dashboard.

## Prerequisites

- [Python 3.9+](https://www.python.org/downloads/) installed.
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
```

The **fan-out/fan-in orchestrator** schedules activities in parallel using `task_all`:

```python
@app.orchestration_trigger(context_name="context")
def fan_out_fan_in_orchestration(context: df.DurableOrchestrationContext):
    """Fan-out/Fan-in orchestration: calls activities in parallel."""
    cities = ["Tokyo", "Seattle", "London", "Paris", "Berlin"]

    parallel_tasks = []
    for city in cities:
        task = context.call_activity("say_hello", city)
        parallel_tasks.append(task)

    results = yield context.task_all(parallel_tasks)
    return results
```

### Client functions

HTTP-triggered client functions start each orchestration:

```python
@app.route(route="StartChaining", methods=["POST"])
@app.durable_client_input(client_name="client")
async def start_chaining(req: func.HttpRequest, client) -> func.HttpResponse:
    instance_id = await client.start_new("chaining_orchestration")
    return client.create_check_status_response(req, instance_id)
```

### Configuration

The sample uses the Durable Task Scheduler emulator as its storage backend. This is configured in `host.json`:

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
    "FUNCTIONS_WORKER_RUNTIME": "python",
    "DURABLE_TASK_SCHEDULER_CONNECTION_STRING": "Endpoint=http://localhost:8080;TaskHub=default;Authentication=None"
  }
}
```

## Clean up resources

Deactivate the Python virtual environment:

```powershell
deactivate
```

Stop the emulator containers when you're done:

```bash
docker stop dtsemulator azurite && docker rm dtsemulator azurite
```

## Next steps

- Learn about [common Durable Functions app patterns](../../durable-task/common/durable-task-sequence.md).
- [Deploy a Durable Functions app to Azure](durable-functions-isolated-create-first-csharp.md).
- Learn about [Durable Functions storage providers](../../durable-task/common/durable-task-storage-providers.md).
