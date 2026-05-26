---
title: "Quickstart: Create a Java Durable Functions app"
description: Run a Java Durable Functions sample app with function chaining and fan-out/fan-in patterns using the Durable Task Scheduler emulator. Get started now.
author: hhunter-ms
ms.author: hannahhunter
ms.topic: quickstart
ms.service: azure-functions
ms.date: 05/26/2026
ms.reviewer: azfuncdf
ms.devlang: java
ms.custom: devx-track-extended-java
---

# Quickstart: Create a Java Durable Functions app

Use Durable Functions, a feature of [Azure Functions](../functions-overview.md), to write stateful serverless workflows in Java. In this quickstart, you clone and run a sample app that demonstrates two common orchestration patterns:

- **Function chaining**: Calls activities sequentially (Tokyo → Seattle → London).
- **Fan-out/fan-in**: Calls activities in parallel across five cities, then aggregates the results.

By the end, you'll have both orchestrations running locally with the [Durable Task Scheduler](../../durable-task/scheduler/durable-task-scheduler-overview.md) emulator and be able to view their status in the dashboard.

> [!div class="checklist"]
>
> - Clone and prepare the Hello Cities sample project.
> - Set up the Durable Task Scheduler emulator and Azurite for local development.
> - Build and run the function app and trigger both orchestrations.
> - Review orchestration status and output in the Durable Task Scheduler dashboard.

## Prerequisites

- [Java 11+](https://adoptium.net/) (JDK) installed.
- [Apache Maven](https://maven.apache.org/download.cgi) 3.0 or later.
- [Azure Functions Core Tools](../functions-run-local.md) v4 or later.
- [Docker](https://www.docker.com/products/docker-desktop/) for running the emulator and Azurite.
- Clone the [Durable Task Scheduler GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler) to use the quickstart sample.

## Set up the Durable Task Scheduler emulator

The [Durable Task Scheduler emulator](../../durable-task/scheduler/durable-task-scheduler-emulator.md) provides a local development environment so you can test orchestrations without an Azure subscription. The Java Functions host also requires [Azurite](../../storage/common/storage-use-azurite.md) for local storage.

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
   cd samples/durable-functions/java/HelloCities
   ```

1. Build the project:

   ```bash
   mvn clean package
   ```

1. Start the function app:

   ```bash
   mvn azure-functions:run
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

```
Hello Tokyo! Hello Seattle! Hello London!
```

The fan-out/fan-in orchestration greets all five cities in parallel and returns the aggregated results.

Open the Durable Task Scheduler dashboard at `http://localhost:8082` to view the orchestration status and execution history.

## Understand the code

The sample project in `src/main/java/com/example/Functions.java` contains all three function types needed for a Durable Functions app.

### Activity function

The `SayHello` activity takes a city name and returns a greeting:

```java
@FunctionName("SayHello")
public String sayHello(
        @DurableActivityTrigger(name = "city") String city) {
    return "Hello " + city + "!";
}
```

### Orchestrator functions

The **chaining orchestrator** calls `SayHello` sequentially for three cities:

```java
@FunctionName("ChainingOrchestration")
public String chainingOrchestration(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {

    String result = "";
    result += ctx.callActivity("SayHello", "Tokyo", String.class).await();
    result += " " + ctx.callActivity("SayHello", "Seattle", String.class).await();
    result += " " + ctx.callActivity("SayHello", "London", String.class).await();
    return result;
}
```

The **fan-out/fan-in orchestrator** schedules activities in parallel:

```java
@FunctionName("FanOutFanInOrchestration")
public List<String> fanOutFanInOrchestration(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {

    String[] cities = {"Tokyo", "Seattle", "London", "Paris", "Berlin"};
    List<Task<String>> parallelTasks = new ArrayList<>();

    for (String city : cities) {
        parallelTasks.add(ctx.callActivity("SayHello", city, String.class));
    }

    List<String> results = new ArrayList<>();
    for (Task<String> task : parallelTasks) {
        results.add(task.await());
    }

    return results;
}
```

### Client functions

HTTP-triggered client functions start each orchestration:

```java
@FunctionName("StartChaining")
public HttpResponseMessage startChaining(
        @HttpTrigger(name = "req", methods = {HttpMethod.POST},
            authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Void> request,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext) {

    DurableTaskClient client = durableContext.getClient();
    String instanceId = client.scheduleNewOrchestrationInstance("ChainingOrchestration");
    return durableContext.createCheckStatusResponse(request, instanceId);
}
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
    "FUNCTIONS_WORKER_RUNTIME": "java",
    "DURABLE_TASK_SCHEDULER_CONNECTION_STRING": "Endpoint=http://localhost:8080;TaskHub=default;Authentication=None"
  }
}
```

## Clean up resources

Stop the emulator containers when you're done:

```bash
docker stop dtsemulator azurite && docker rm dtsemulator azurite
```

## Next steps

- Learn about [common Durable Functions app patterns](../../durable-task/common/durable-task-sequence.md).
- [Deploy a Durable Functions app to Azure](durable-functions-create-first-csharp.md).
- Learn about [Durable Functions storage providers](../../durable-task/common/durable-task-storage-providers.md).
