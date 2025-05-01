---
title: "Quickstart: Configure Durable Task SDKs in your container app with Azure Functions Durable Task Scheduler (preview)"
description: Learn how to configure an existing container app for the Azure Functions Durable Task Scheduler using the Durable Task SDKs and deploy using Azure Developer CLI.
ms.subservice: durable-task-scheduler
ms.topic: how-to
ms.date: 04/29/2025
zone_pivot_groups: df-languages
---

# Quickstart: Configure Durable Task SDKs in your container app with Azure Functions Durable Task Scheduler (preview)

::: zone pivot="javascript"

[!INCLUDE [preview-sample-limitations](./includes/preview-sample-limitations.md)]

::: zone-end

::: zone pivot="powershell"

[!INCLUDE [preview-sample-limitations](./includes/preview-sample-limitations.md)]

::: zone-end

::: zone pivot="csharp,python,java"

In this quickstart, you learn how to:

> [!div class="checklist"]
>
> - Set up and run the Durable Task Scheduler emulator for local development. 
> - Run the worker and client projects.
> - Check the Azure Container Apps logs.
> - Review orchestration status and history via the Durable Task Scheduler dashboard.

## Prerequisites

Before you begin: 

::: zone-end

::: zone pivot="csharp"

- Make sure you have [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or later.
- Install [Docker](https://www.docker.com/products/docker-desktop/) for running the emulator.
- Install [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)
- Clone the [Durable Task Scheduler GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler) to use the quickstart sample.

::: zone-end


::: zone pivot="python"

- Make sure you have [Python 3.9+](https://www.python.org/downloads/) or later.
- Install [Docker](https://www.docker.com/products/docker-desktop/) for running the emulator.
- Install [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)
- Clone the [Durable Task Scheduler GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler) to use the quickstart sample.

::: zone-end

::: zone pivot="java"

- Make sure you have [Java 8 or 11](https://www.java.com/en/download/).
- Install [Docker](https://www.docker.com/products/docker-desktop/) for running the emulator.
- Install [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)
- Clone the [Durable Task Scheduler GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler) to use the quickstart sample.

::: zone-end

::: zone pivot="csharp,python,java"

## Prepare the project

::: zone-end

In a new terminal window, from the `Azure-Samples/Durable-Task-Scheduler` directory, navigate into the sample directory.

::: zone pivot="csharp"

```bash
cd /samples/portable-sdks/dotnet/FunctionChaining
```

::: zone-end

::: zone pivot="python"

```bash
cd /samples/portable-sdks/python/FunctionChaining
```

::: zone-end

::: zone pivot="java"

```bash
cd /samples/portable-sdks/java/FunctionChaining
```

::: zone-end

::: zone pivot="csharp,python,java"

## Deploy using Azure Developer CLI

1. Run `azd up` to provision the infrastructure and deploy the application to Azure Container Apps in a single command.

   ```azdeveloper
   azd up
   ```

1. When prompted in the terminal, provide the following parameters.

   | Parameter | Description |
   | --------- | ----------- |
   | Environment Name | Prefix for the resource group created to hold all Azure resources. |
   | Azure Location  | The Azure location for your resources. |
   | Azure Subscription | The Azure subscription for your resources. |

   This process may take some time to complete. As the `azd up` command completes, the CLI output displays two Azure portal links to monitor the deployment progress. The output also demonstrates how `azd up`:

   - Creates and configures all necessary Azure resources via the provided Bicep files in the `./infra` directory using `azd provision`. Once provisioned by Azure Developer CLI, you can access these resources via the Azure portal. The files that provision the Azure resources include:
     - `main.parameters.json`
     - `main.bicep`
     - An `app` resources directory organized by functionality
     - A `core` reference library that contains the Bicep modules used by the `azd` template
   - Deploys the code using `azd deploy`

   ### Expected output

   ```azdeveloper
   Packaging services (azd package)

   (✓) Done: Packaging service client
   - Image Hash: {IMAGE_HASH}
   - Target Image: {TARGET_IMAGE}


   (✓) Done: Packaging service worker
   - Image Hash: {IMAGE_HASH}
   - Target Image: {TARGET_IMAGE}


   Provisioning Azure resources (azd provision)
   Provisioning Azure resources can take some time.

   Subscription: SUBSCRIPTION_NAME (SUBSCRIPTION_ID)
   Location: West US 2

    You can view detailed progress in the Azure Portal:
    https://portal.azure.com/#view/HubsExtension/DeploymentDetailsBlade/~/overview/id/%2Fsubscriptions%SUBSCRIPTION_ID%2Fproviders%2FMicrosoft.Resources%2Fdeployments%2FCONTAINER_APP_ENVIRONMENT

    (✓) Done: Resource group: GENERATED_RESOURCE_GROUP (1.385s)
    (✓) Done: Container Apps Environment: GENERATED_CONTAINER_APP_ENVIRONMENT (54.125s)
    (✓) Done: Container Registry: GENERATED_REGISTRY (1m27.747s)
    (✓) Done: Container App: SAMPLE_CLIENT_APP (21.39s)
    (✓) Done: Container App: SAMPLE_WORKER_APP (24.136s)   
   
   Deploying services (azd deploy)

    (✓) Done: Deploying service client
    - Endpoint: https://SAMPLE_CLIENT_APP.westus2.azurecontainerapps.io/

    (✓) Done: Deploying service worker
    - Endpoint: https://SAMPLE_WORKER_APP.westus2.azurecontainerapps.io/


   SUCCESS: Your up workflow to provision and deploy to Azure completed in 10 minutes 34 seconds.   ```

## Confirm successful deployment 

In the Azure portal, verify the client container app is publishing messages to the Azure Service Bus topic. 

1. Copy the resource group name from the terminal output.

1. Sign in to the [Azure portal](https://portal.azure.com) and search for that resource group name.

1. From the resource group overview page, click on the client container app resource.

1. Select **Monitoring** > **Log stream**.

1. Confirm the client container is logging the function chaining tasks.

   :::image type="content" source="media/quickstart-aca-azd-durable-task-sdk/client-app-log-stream.png" alt-text="Screenshot of the client container's log stream in the Azure portal.":::

1. Navigate back to the resource group page to select the `worker` container. 

1. Select **Monitoring** > **Log stream**.

1. Confirm the client container is logging the function chaining tasks.

   :::image type="content" source="media/quickstart-aca-azd-durable-task-sdk/worker-app-log-stream.png" alt-text="Screenshot of the worker container's log stream in the Azure portal.":::

::: zone-end

::: zone pivot="csharp,python,java"

## Understanding the code

::: zone-end

::: zone pivot="csharp"

### Worker Project

The Worker project contains:

- **GreetingOrchestration.cs**: Defines the orchestrator and activity functions in a single file
- **Program.cs**: Sets up the worker host with proper connection string handling

#### Orchestration Implementation

The orchestration directly calls each activity in sequence using the standard `CallActivityAsync` method:

```csharp
public override async Task<string> RunAsync(TaskOrchestrationContext context, string name)
{
    // Step 1: Say hello to the person
    string greeting = await context.CallActivityAsync<string>(nameof(SayHelloActivity), name);
    
    // Step 2: Process the greeting
    string processedGreeting = await context.CallActivityAsync<string>(nameof(ProcessGreetingActivity), greeting);
    
    // Step 3: Finalize the response
    string finalResponse = await context.CallActivityAsync<string>(nameof(FinalizeResponseActivity), processedGreeting);
    
    return finalResponse;
}
```

Each activity is implemented as a separate class decorated with the `[DurableTask]` attribute:

```csharp
[DurableTask]
public class SayHelloActivity : TaskActivity<string, string>
{
    // Implementation details
}
```

The worker uses Microsoft.Extensions.Hosting for proper lifecycle management:
```csharp
var builder = Host.CreateApplicationBuilder();
builder.Services.AddDurableTaskWorker()
    .AddTasks(registry => {
        registry.AddAllGeneratedTasks();
    })
    .UseDurableTaskScheduler(connectionString);
var host = builder.Build();
await host.StartAsync();
```

### Client Project

The Client project:

- Uses the same connection string logic as the worker
- Schedules an orchestration instance with a name input
- Waits for the orchestration to complete and displays the result
- Uses WaitForInstanceCompletionAsync for efficient polling

```csharp
var instance = await client.WaitForInstanceCompletionAsync(
    instanceId,
    getInputsAndOutputs: true,
    cts.Token);
```

::: zone-end

::: zone pivot="python"

### Worker Project

The Worker project contains:

- ****: Defines the orchestrator and activity functions in a single file
- ****: Sets up the worker host with proper connection string handling

#### Orchestration Implementation

The orchestration directly calls each activity in sequence using the standard `CallActivityAsync` method:

```python

```

Each activity is implemented as a separate class decorated with the `[DurableTask]` attribute:

```python

```

The worker uses Microsoft.Extensions.Hosting for proper lifecycle management:

```python

```

### Client Project

The Client project:

- Uses the same connection string logic as the worker
- Schedules an orchestration instance with a name input
- Waits for the orchestration to complete and displays the result
- Uses WaitForInstanceCompletionAsync for efficient polling

```python

```


::: zone-end

::: zone pivot="java"

### Worker Project

The Worker project contains:

- ****: Defines the orchestrator and activity functions in a single file
- ****: Sets up the worker host with proper connection string handling

#### Orchestration Implementation

The orchestration directly calls each activity in sequence using the standard `CallActivityAsync` method:

```java

```

Each activity is implemented as a separate class decorated with the `[DurableTask]` attribute:

```java

```

The worker uses Microsoft.Extensions.Hosting for proper lifecycle management:

```java

```

### Client Project

The Client project:

- Uses the same connection string logic as the worker
- Schedules an orchestration instance with a name input
- Waits for the orchestration to complete and displays the result
- Uses WaitForInstanceCompletionAsync for efficient polling

```java

```

::: zone-end

## Next steps

Need