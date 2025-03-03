---
title: "Quickstart: Set a Durable Functions app to use Durable Task Scheduler (preview)"
description: Learn how to configure an existing Durable Functions app to use Durable Task Scheduler.
author: lilyjma
ms.topic: how-to
ms.date: 02/24/2025
ms.author: jiayma
ms.reviewer: azfuncdf
---

# Quickstart: Set a Durable Functions app to use Durable Task Scheduler (preview)

Use Durable Functions, a feature of [Azure Functions](../../functions-overview.md), to write stateful functions in a serverless environment. Scenarios where Durable Functions is useful include orchestrating microservices and workflows, stateful patterns like fan-out/fan-in, and long-running tasks.  

Durable Functions supports several [storage providers](../durable-functions-storage-providers.md), also known as _backends_, for storing orchestration and entity runtime state. 

In this quickstart, you configure a Durable Functions app to use the [Durable Task Scheduler (DTS)](../durable-functions-storage-providers.md#dts) as the backend and deploy the app to Azure using **Visual Studio Code**. 

> [!NOTE]
>
> - To learn more about the benefit of using DTS, see [Durable Functions backend providers overview](../durable-functions-storage-providers.md).
>
> - Migrating [task hub data](../durable-functions-task-hubs.md) across backend providers currently isn't supported. Function apps that have existing runtime data need to start with a fresh, empty task hub after they switch to the DTS. Similarly, the task hub contents that are created by using DTS can't be preserved if you switch to a different backend provider.
>
> - DTS currently only supports Durable Functions running on **Functions Premium** and **App Service** plans. 

## Prerequisites

The following steps assume that you have an existing Durable Functions app and that you're familiar with how to operate it.

Specifically, this quickstart assumes that you have already:

- Created an Azure Functions project on your local computer.
- Added Durable Functions to your project with an [orchestrator function](../durable-functions-bindings.md#orchestration-trigger) and a [client function](../durable-functions-bindings.md#orchestration-client) that triggers the Durable Functions app.
- Configured the project for local debugging.

If you don't meet these prerequisites, we recommend that you begin with one of the following quickstarts to set up a local Functions project:

- [Create a Durable Functions app - C#](../durable-functions-isolated-create-first-csharp.md)
- [Create a Durable Functions app - JavaScript](../quickstart-js-vscode.md)
- [Create a Durable Functions app - Python](../quickstart-python-vscode.md)
- [Create a Durable Functions app - PowerShell](../quickstart-powershell-vscode.md)
- [Create a Durable Functions app - Java](../quickstart-java.md)

You'll also need to have [Docker](https://docs.docker.com/engine/install/) installed to run the DTS emulator. 

## Add the Durable Task Scheduler extension (.NET only)

First, install the latest version of the [Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged) extension from NuGet. There are several ways of doing this: 

1. Add a reference to the extension in your _.csproj_ file and then build the project. 

1. Use the [dotnet add package](/dotnet/core/tools/dotnet-add-package) command to add extension packages.

1. Install the extension by using the following [Azure Functions Core Tools CLI](../../functions-run-local.md#install-the-azure-functions-core-tools) command:

   ```cmd
   func extensions install --package Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged 
   ```

## Specify the required extension bundles (non .NET languages)

[TODO - check when preview bundles go out]
Update the `extensionBundle` property to use the preview version that contains the DTS package: 

```json
{
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
    "version": "[4.*, 5.0.0)"
  }
}
```

## Update host.json

Update the host.json as follows to use Durable Task Scheduler as the backend. 

```json
{
  "extensions": {
    "durableTask": {
      "hubName": "%TASKHUB_NAME%",
      "storageProvider": {
        "type": "azureManaged",
        "connectionStringName": "DURABLE_TASK_SCHEDULER_CONNECTION_STRING"
      }
    }
  }
}
```

## Configure local.settings.json 

Add connection information for local development:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "<DEPENDENT ON YOUR PROGRAMMING LANGUAGE>",
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "DURABLE_TASK_SCHEDULER_CONNECTION_STRING": "Endpoint=http://localhost:<port number>;Authentication=None",
    "TASKHUB_NAME": "default"
  }
}
```
The next step shows how to get port number for the DTS emulator. 

> [!NOTE]
> For local development, it's easiest to use the `default` task hub. Setting up other task hubs require extra configuration. 

## Set up DTS emulator 

1. Pull the docker image containing the emulator. 

   ```bash
   docker pull mcr.microsoft.com/dts/dts-emulator:v0.0.4
   ```

1. Run the emulator.

   ```bash
   docker run -itP <tag>
   ```

   You'll notice three ports exposed on Docker desktop: `8080`, `8081`, and `8082`. These static ports are exposed by the container and mapped dynamically by default. DTS exposes multiple ports for different purposes:
   - `8080`: gRPC endpoint that allows an app to connect to DTS
   - `8081`: Endpiont for metrics gathering
   - `8082`: Endpoint for DTS dashboard

   :::image type="content" source="media/quickstart-durable-task-scheduler/docker-ports.png" alt-text="Screenshot of ports on Docker.":::

1. Update the connection string in *local.settings.json*. In the example above, port `55000` is mapped to the gRPC `8080` endpoint, so the connection string should be `Endpoint=http://localhost:55000;Authentication=None`.

## Test locally 

1. Start [Azurite](../../../storage/common/storage-use-azurite.md#run-azurite).

1. Go to the root directory of your app and run the application.

   ```sh
   func start
   ```

   You should see a list of the functions in your app. If you created your app following one of the Durable Functions quickstarts, you should see something similar to the following:

   :::image type="content" source="media/quickstart-durable-task-scheduler/function-list.png" alt-text="Screenshot of functions listed when running app locally.":::

1. Start an orchestration instance by sending an HTTP `POST` request to the URL endpoint using an HTTP test tool. 

1. Copy the URL value for `statusQueryGetUri` and paste it in your browser's address bar. You should see the status on the orchestration instance:

   ```json
     {
       "name": "DurableFunctionsOrchestrationCSharp1",
       "instanceId": "b50f8b723f2f44149ab9fd2e3790a0e8",
       "runtimeStatus": "Completed",
       "input": null,
       "customStatus": null,
       "output": [
         "Hello Tokyo!",
         "Hello Seattle!",
         "Hello London!"
       ],
       "createdTime": "2025-02-21T21:09:59Z",
       "lastUpdatedTime": "2025-02-21T21:10:00Z"
     }
   ```

1. To view more details about the orchestration instance, go to the Docker desktop app and click the `8082` link to access the [DTS dashboard](./durable-task-scheduler-dashboard.md). 

   :::image type="content" source="media/quickstart-durable-task-scheduler/docker-ports.png" alt-text="Screenshot of ports on Docker.":::

1. Click on the *default* task hub to see its dashboard. 

> [!NOTE] 
> The DTS emulator stores orchestration data in memory, which means all data is lost when it shuts down. 
>
> Running into issues testing? [See the troubleshooting guide.](./troubleshoot-durable-task-scheduler.md)

## Run your app in Azure 

### Create required resources

Create a DTS instance and Azure Functions app on Azure following the *Function app integrated creation flow*. 

[!INCLUDE [function-app-integrated-creation](./includes/function-app-integrated-creation.md)]

### Deploy your function app to Azure

[!INCLUDE [functions-publish-project-vscode](../../../../includes/functions-deploy-project-vs-code.md)]

> [!NOTE] 
> If your app is running on the Functions Premium plan, follow instructions to [turn on Runtime Scale Monitoring](./develop-with-durable-task-scheduler.md#scaling-in-functions-premium-plan) after deployment. This will ensure your app autoscales based on load. 

### Test your function app in Azure

If you created your app by following one of the Durable Functions quickstarts, test by sending an HTTP request to the client function to start an orchestration instance.

Run the following command to get your function's URL: 
  
```bash
az functionapp function list --resource-group <RESOURCE_GROUP_NAME> --name <FUNCTION_APP_NAME>  --query '[].{Function:name, URL:invokeUrlTemplate}' --output table
```

Check the status of the orchestration instance and activity details on the [DTS dashboard](./durable-task-scheduler-dashboard.md). You'll need to [grant your developer identity access](./develop-with-durable-task-scheduler.md#accessing-dts-dashboard) before logging into the dashboard. 

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid related costs in your Azure subscription, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group) and all related resources.

## Next steps

- Learn more about the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md).
- [Troubleshoot any errors you may encounter](./troubleshoot-durable-task-scheduler.md) while using Durable Task Scheduler.