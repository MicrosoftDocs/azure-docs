---
title: "Quickstart: Set a Durable Functions app to use the Durable Task Scheduler storage provider (preview)"
description: Learn how to configure an existing Durable Functions app to use Durable Task Scheduler.
author: lilyjma
ms.topic: how-to
ms.date: 01/27/2025
ms.author: jiayma
ms.reviewer: azfuncdf
---

# Quickstart: Set a Durable Functions app to use Durable Task Scheduler (preview)

Use Durable Functions, a feature of [Azure Functions](../../functions-overview.md), to write stateful functions in a serverless environment. Scenarios where Durable Functions is useful include orchestrating microservices and workflows, stateful patterns like fan-out/fan-in, and long-running tasks.  

Durable Functions supports several [storage providers](../durable-functions-storage-providers.md), also known as _backends_, for storing orchestration and entity runtime state. In this quickstart, you configure a Durable Functions app to use the [Durable Task Scheduler (DTS)](../durable-functions-storage-providers.md#dts) as the backend.

> [!NOTE]
>
> - To learn more about the benefit of using DTS, see [Durable Functions backend providers overview](../durable-functions-storage-providers.md).
>
> - Migrating [task hub data](../durable-functions-task-hubs.md) across backend providers currently isn't supported. Function apps that have existing runtime data need to start with a fresh, empty task hub after they switch to the DTS. Similarly, the task hub contents that are created by using DTS can't be preserved if you switch to a different backend provider.
>
> - DTS currently only supports Durable Functions running on Functions Premium and App Service plans. 

## Prerequisites

The following steps assume that you have an existing Durable Functions app and that you're familiar with how to operate it.

Specifically, this quickstart assumes that you have already:

- Created an Azure Functions project on your local computer.
- Added Durable Functions to your project with an [orchestrator function](../durable-functions-bindings.md#orchestration-trigger) and a [client function](../durable-functions-bindings.md#orchestration-client) that triggers the Durable Functions app.

If you don't meet these prerequisites, we recommend that you begin with one of the following quickstarts to set up a local Functions project:

- [Create a Durable Functions app - C#](../durable-functions-isolated-create-first-csharp.md)
- [Create a Durable Functions app - JavaScript](../quickstart-js-vscode.md)
- [Create a Durable Functions app - Python](../quickstart-python-vscode.md)
- [Create a Durable Functions app - PowerShell](../quickstart-powershell-vscode.md)
- [Create a Durable Functions app - Java](../quickstart-java.md)

You'll also need to have the following installed:
- [Docker](https://docs.docker.com/engine/install/) to run the DTS emulator
- [Azurite](../../../storage/common/storage-use-azurite.md), which is the Azure Storage emulator needed by the function app

## Add the Durable Task Scheduler extension (.NET only)
First, install the latest version of the [Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged) extension from NuGet. There are several ways of doing this: 
1. Add a reference to the extension in your _.csproj_ file and then build the project. 
2. Use the [dotnet add package](/dotnet/core/tools/dotnet-add-package) command to add extension packages.
3. Install the extension by using the following [Azure Functions Core Tools CLI](../../functions-run-local.md#install-the-azure-functions-core-tools) command:

```cmd
func extensions install --package Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged 
```

## Specify the required extension bundles (non .NET languages)
[TODO]
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
>[!NOTE]
> For local development, it's easiest to use `default` task hub. It is possible to set up other task hubs but that needs extra configuration. 

## Set up DTS emulator 
1. Pull the docker image containing the emulator 

```bash
  docker pull <tag>
```
- For M-series macs, use tag: [TODO]
- For Windows and other AMD 64 machines, use tag: [TODO]

2. Run the emulator

```bash
  docker run -itP <tag>
```

You'll noticed three ports exposed: `8080`, `8081`, and `8082`. These are the static ports that the container exposes, which are mapped dynamically by default. There are multiple ports because DTS exposes multiple ports for different purposes:
  - `8080`: gRPC endpoint that allows an app to connect to DTS
  - `8081`: Endpiont for metrics gathering
  - `8082`: Endpoint for DTS dashboard

:::image type="content" source="media/quickstart-durable-task-scheduler/docker-ports.png" alt-text="Screenshot of ports on Docker.":::

3. Update connection string in *local.settings.json*. In the example above, port `55000` is mapped to `8080` which is the gRPC, so the connection string should be `Endpoint=http://localhost:55000;Authentication=None`

## Test locally 

1. Start [Azurite](../../../storage/common/storage-use-azurite.md#run-azurite).

1. Go to the root directory of your app and run the application:

```sh
func start
```

You should see the functions in your app listed. If your app is the created following Durable Functions quickstarts, you should see something similar to the following:

:::image type="content" source="media/quickstart-durable-task-scheduler/function-list.png" alt-text="Screenshot of functions listed when running app locally.":::

1. Use an HTTP test tool to send an HTTP POST request to the URL endpoint. This will start an orchestration instance. 

1. Copy the URL value for `statusQueryGetUri`, paste it in your browser's address bar. You should see the status on the orchestration instance:

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

1. The DTS dashboard has more details about the orchestration instance. To get to the dashboard, go to the Docker desktop app and click on the `8082` link. 

:::image type="content" source="media/quickstart-durable-task-scheduler/docker-ports.png" alt-text="Screenshot of ports on Docker.":::

1. Click on the *default* task hub to see dashboard. 

> [!NOTE] 
> The DTS emulator stores orchestration data in memory, which means all data will be lost when it's shuts down. 
>
> Running into issues testing? [See the troubleshooting guide.](./troubleshoot-durable-task-scheduler.md)

## Run your app in Azure 

### Create required resources
Create a DTS instance and Azure Functions app on Azure following the "[Function app integrated creation](./develop-with-durable-task-scheduler.md#function-app-integrated-creation)" flow. When DTS is created as part of function app creation, a managed identity with the RBAC (role-based access control) permission required to access DTS is automatically created and assigned to the app. This sets up the identity-based authentication required by DTS so no extra configuration is needed. 

[!INCLUDE [functions-publish-project-vscode](../../../../includes/functions-deploy-project-vs-code.md)]

### Test your function app in Azure

If your app is created following Durable Functions quickstarts, you can test following instructions in the [previous section](#test-locally). To get your functions' URL, run the following:  
  
  ```bash
    az functionapp function list --resource-group <RESOURCE_GROUP_NAME> --name <FUNCTION_APP_NAME>  --query '[].{Function:name, URL:invokeUrlTemplate}' --output table
  ```

### Use DTS dashboard to check orchestration details 

1. To access the dashboard, you developer identity needs have the required RBAC role **Durable Task Data Contributor** [assigned to it](./develop-with-durable-task-scheduler.md#accessing-dts-dashboard). Assignment on the task hub scope is sufficient. 

1. Go to https://dashboard.durabletask.dev/ and click on "Add Endpoint". Fill in the required information (all found on Azure portal) to connect to the task hub used by the app. 

1. Drill into the specifics of an orchestration instance by clicking on the *OrchestrationID*. 

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid related costs in your Azure subscription, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group) and all related resources.

## Next steps

- Learn more about the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md).
- [Troubleshoot any errors you may encounter](./troubleshoot-durable-task-scheduler.md) while using Durable Task Scheduler.