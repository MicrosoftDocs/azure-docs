---
title: "Quickstart: Host a Durable Task SDK app on Azure Container Apps (preview)"
description: Learn how to configure an existing container app for the Durable Task Scheduler using the Durable Task SDKs and deploy using Azure Developer CLI.
ms.subservice: durable-task-scheduler
ms.topic: quickstart
ms.date: 05/06/2025
zone_pivot_groups: df-languages
---

# Quickstart: Host a Durable Task SDK app on Azure Container Apps (preview)

::: zone pivot="javascript"

[!INCLUDE [preview-sample-limitations](./includes/preview-sample-limitations.md)]

::: zone-end

::: zone pivot="powershell"

[!INCLUDE [preview-sample-limitations](./includes/preview-sample-limitations.md)]

::: zone-end

::: zone pivot="java"

> [!IMPORTANT]
> Currently, this quickstart sample isn't available for Java.

::: zone-end

::: zone pivot="csharp,python"

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

::: zone pivot="csharp,python"

## Prepare the project

In a new terminal window, from the `Azure-Samples/Durable-Task-Scheduler` directory, navigate into the sample directory.

::: zone-end

::: zone pivot="csharp"

```bash
cd /samples/durable-task-sdks/dotnet/FunctionChaining
```

::: zone-end

::: zone pivot="python"

```bash
cd /samples/durable-task-sdks/python/function-chaining
```

::: zone-end

::: zone pivot="csharp,python"

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


   SUCCESS: Your up workflow to provision and deploy to Azure completed in 10 minutes 34 seconds.   
   ```

## Confirm successful deployment 

In the Azure portal, verify the orchestrations are running successfully. 

1. Copy the resource group name from the terminal output.

1. Sign in to the [Azure portal](https://portal.azure.com) and search for that resource group name.

1. From the resource group overview page, click on the client container app resource.

1. Select **Monitoring** > **Log stream**.

1. Confirm the client container is logging the function chaining tasks.

   :::image type="content" source="media/quickstart-container-apps-durable-task-sdk/client-app-log-stream.png" alt-text="Screenshot of the client container's log stream in the Azure portal.":::

1. Navigate back to the resource group page to select the `worker` container. 

1. Select **Monitoring** > **Log stream**.

1. Confirm the worker container is logging the function chaining tasks.

   :::image type="content" source="media/quickstart-container-apps-durable-task-sdk/worker-app-log-stream.png" alt-text="Screenshot of the worker container's log stream in the Azure portal.":::

::: zone-end

::: zone pivot="csharp,python"

## Understanding the code

::: zone-end

::: zone pivot="csharp"

### Client project

The Client project:

- Uses the same connection string logic as the worker
- Implements a sequential orchestration scheduler that:
  - Schedules 20 orchestration instances, one at a time
  - Waits 5 seconds between scheduling each orchestration
  - Tracks all orchestration instances in a list
  - Waits for all orchestrations to complete before exiting
- Uses standard logging to show progress and results

```csharp
// Schedule 20 orchestrations sequentially
for (int i = 0; i < TotalOrchestrations; i++)
{
    // Create a unique instance ID
    string instanceName = $"{name}_{i+1}";
    
    // Schedule the orchestration
    string instanceId = await client.ScheduleNewOrchestrationInstanceAsync(
        "GreetingOrchestration", 
        instanceName);
    
    // Wait 5 seconds before scheduling the next one
    await Task.Delay(TimeSpan.FromSeconds(IntervalSeconds));
}

// Wait for all orchestrations to complete
foreach (string id in allInstanceIds)
{
    OrchestrationMetadata instance = await client.WaitForInstanceCompletionAsync(
        id, getInputsAndOutputs: false, CancellationToken.None);
}
```

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

The worker uses `Microsoft.Extensions.Hosting` for proper lifecycle management:

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

::: zone-end

::: zone pivot="python"

### Client

The Client project:

- Uses the same connection string logic as the worker
- Implements a sequential orchestration scheduler that:
  - Schedules 20 orchestration instances, one at a time
  - Waits 5 seconds between scheduling each orchestration
  - Tracks all orchestration instances in a list
  - Waits for all orchestrations to complete before exiting
- Uses standard logging to show progress and results

```python
# Schedule all orchestrations first
instance_ids = []
for i in range(TOTAL_ORCHESTRATIONS):
    try:
        # Create a unique instance name
        instance_name = f"{name}_{i+1}"
        logger.info(f"Scheduling orchestration #{i+1} ({instance_name})")

        # Schedule the orchestration
        instance_id = client.schedule_new_orchestration(
            "function_chaining_orchestrator",
            input=instance_name
        )

        instance_ids.append(instance_id)
        logger.info(f"Orchestration #{i+1} scheduled with ID: {instance_id}")

        # Wait before scheduling next orchestration (except for the last one)
        if i < TOTAL_ORCHESTRATIONS - 1:
            logger.info(f"Waiting {INTERVAL_SECONDS} seconds before scheduling next orchestration...")
        await asyncio.sleep(INTERVAL_SECONDS)
# ...
# Wait for all orchestrations to complete
for idx, instance_id in enumerate(instance_ids):
    try:
        logger.info(f"Waiting for orchestration {idx+1}/{len(instance_ids)} (ID: {instance_id})...")
        result = client.wait_for_orchestration_completion(
            instance_id,
            timeout=120
        )
```

### Worker

#### Orchestration Implementation

The orchestration directly calls each activity in sequence using the standard `call_activity` function:

```python
# Orchestrator function
def function_chaining_orchestrator(ctx, name: str) -> str:
    """Orchestrator that demonstrates function chaining pattern."""
    logger.info(f"Starting function chaining orchestration for {name}")
    
    # Call first activity - passing input directly without named parameter
    greeting = yield ctx.call_activity('say_hello', input=name)
    
    # Call second activity with the result from first activity
    processed_greeting = yield ctx.call_activity('process_greeting', input=greeting)
    
    # Call third activity with the result from second activity
    final_response = yield ctx.call_activity('finalize_response', input=processed_greeting)
    
    return final_response
```

Each activity is implemented as a separate function:

```python
# Activity functions
def say_hello(ctx, name: str) -> str:
    """First activity that greets the user."""
    logger.info(f"Activity say_hello called with name: {name}")
    return f"Hello {name}!"

def process_greeting(ctx, greeting: str) -> str:
    """Second activity that processes the greeting."""
    logger.info(f"Activity process_greeting called with greeting: {greeting}")
    return f"{greeting} How are you today?"

def finalize_response(ctx, response: str) -> str:
    """Third activity that finalizes the response."""
    logger.info(f"Activity finalize_response called with response: {response}")
    return f"{response} I hope you're doing well!"
```

The worker uses `DurableTaskSchedulerWorker` for proper lifecycle management:

```python
with DurableTaskSchedulerWorker(
    host_address=host_address, 
    secure_channel=endpoint != "http://localhost:8080",
    taskhub=taskhub_name, 
    token_credential=credential
) as worker:
        
    # Register activities and orchestrators
    worker.add_activity(say_hello)
    worker.add_activity(process_greeting)
    worker.add_activity(finalize_response)
    worker.add_orchestrator(function_chaining_orchestrator)
        
    # Start the worker (without awaiting)
    worker.start()
```


::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Configure autoscaling](./durable-task-scheduler-auto-scaling.md)