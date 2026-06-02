---
title: "Quickstart: Create a Java Durable Functions app"
description: Run a Java Durable Functions sample app with function chaining and fan-out/fan-in patterns using the Durable Task Scheduler emulator. Get started now.
author: hhunter-ms
ms.author: hannahhunter
ms.topic: quickstart
ms.service: durable-task
ms.subservice: durable-functions
ms.date: 05/20/2026
ms.reviewer: azfuncdf
ms.devlang: java
ms.custom: devx-track-extended-java
---

# Quickstart: Create a Java Durable Functions app

Use Durable Functions, a feature of [Azure Functions](../../azure-functions/functions-overview.md), to write stateful functions in a serverless environment. Durable Functions manages state, checkpoints, and restarts in your application.

In this quickstart, you create and test a Durable Functions app in Java.

A basic Durable Functions app has three functions:

* **Orchestrator function** (`Cities`): A workflow that orchestrates other functions.
* **Activity function** (`Capitalize`): A function that the orchestrator calls to perform work and return a value.
* **Client function** (`StartOrchestration`): An HTTP-triggered function that starts the orchestrator.

This quickstart offers three setup paths. Use the selector at the top of the page to choose your preferred approach:

- **Manual setup**: Create each file by hand for full control over the project structure.
- **Maven command**: Use a Maven archetype to scaffold the project in one command.
- **Visual Studio Code**: Use the VS Code Azure Functions extension to generate the project through a guided UI.

## Prerequisites

To complete this quickstart, you need:

* The [Java Developer Kit](/azure/developer/java/fundamentals/java-support-on-azure) version 8 or later installed.

* [Apache Maven](https://maven.apache.org) version 3.0 or later installed.

* The latest version of [Azure Functions Core Tools](../../azure-functions/functions-run-local.md).

  For Azure Functions _4.x_, Core Tools version 4.0.4915 or later is required.

* An HTTP test tool that keeps your data secure. For more information, see [HTTP test tools](../../azure-functions/functions-develop-local.md#http-test-tools).

* [Visual Studio Code](https://code.visualstudio.com/) with the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) installed (required only for the **Visual Studio Code** setup path).
 
* An Azure subscription. To use Durable Functions, you must have an Azure Storage account.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

::: zone pivot="create-option-manual-setup"

## Add required dependencies and plugins to your project

Add the following code to your _pom.xml_ file. Before you copy it, replace `your-unique-app-name` with a globally unique function app name. Adjust `region`, `javaVersion`, and `resourceGroup` to match your environment.

```xml
<properties>
  <azure.functions.maven.plugin.version>1.18.0</azure.functions.maven.plugin.version>
  <azure.functions.java.library.version>3.0.0</azure.functions.java.library.version>
  <durabletask.azure.functions>1.0.0</durabletask.azure.functions>
  <functionAppName>your-unique-app-name</functionAppName>
</properties>

<dependencies>
  <dependency>
    <groupId>com.microsoft.azure.functions</groupId>
    <artifactId>azure-functions-java-library</artifactId>
    <version>${azure.functions.java.library.version}</version>
  </dependency>
  <dependency>
    <groupId>com.microsoft</groupId>
    <artifactId>durabletask-azure-functions</artifactId>
    <version>${durabletask.azure.functions}</version>
  </dependency>
</dependencies>

<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-compiler-plugin</artifactId>
      <version>3.8.1</version>
    </plugin>
    <plugin>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>azure-functions-maven-plugin</artifactId>
      <version>${azure.functions.maven.plugin.version}</version>
      <configuration>
        <appName>${functionAppName}</appName>
        <resourceGroup>java-functions-group</resourceGroup>
        <appServicePlanName>java-functions-app-service-plan</appServicePlanName>
        <region>westus</region>
        <runtime>
          <os>windows</os>
          <javaVersion>11</javaVersion>
        </runtime>
        <appSettings>
          <property>
            <name>FUNCTIONS_EXTENSION_VERSION</name>
            <value>~4</value>
          </property>
        </appSettings>
      </configuration>
      <executions>
        <execution>
          <id>package-functions</id>
          <goals>
            <goal>package</goal>
          </goals>
        </execution>
      </executions>
    </plugin>
    <plugin>
      <artifactId>maven-clean-plugin</artifactId>
      <version>3.1.0</version>
    </plugin>
  </plugins>
</build>
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

> [!NOTE]
> Durable Functions for Java requires extension bundle v4. Earlier bundles aren't supported. For more information, see the [extension bundles documentation](../../azure-functions/extension-bundles.md).

Durable Functions needs a storage provider to store runtime state. Add a _local.settings.json_ file to your project directory to configure the storage provider. To use Azure Storage as the provider, set the value of `AzureWebJobsStorage` to the connection string of your Azure Storage account:

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

::: zone-end

## Test the function locally

Azure Functions Core Tools gives you the capability to run an Azure Functions project on your local development computer.

1. If you're using Visual Studio Code, open a new terminal window and run the following commands to build the project:

   ```bash
   mvn clean package
   ```

   Then, run the durable function:

   ```bash
   mvn azure-functions:run
   ```

1. In the terminal panel, copy the URL endpoint of your HTTP-triggered function.

   :::image type="content" source="media/quickstart-java/maven-functions-run.png" alt-text="Screenshot of the terminal output showing the HTTP endpoint URL for the local Azure Functions runtime.":::

1. Use your [HTTP test tool](../../azure-functions/functions-develop-local.md#http-test-tools) to send an HTTP POST request to the URL endpoint.

    The response should look similar to the following example:

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
- [Deploy a Durable Functions app to Azure](durable-functions-isolated-create-first-csharp.md).
- Learn about [Durable Functions storage providers](../../durable-task/common/durable-task-storage-providers.md).
