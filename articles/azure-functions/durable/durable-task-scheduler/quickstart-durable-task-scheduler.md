---
title: "Quickstart: Set a Durable Functions app to use the Durable Task Scheduler storage provider (preview)"
description: Learn how to configure an existing Durable Functions app to use Durable Task Scheduler.
ms.topic: how-to
ms.date: 01/27/2025
zone_pivot_groups: dts-lanugages
---

# Quickstart: Set a Durable Functions app to use the Durable Task Scheduler storage provider (preview)

Use Durable Functions, a feature of [Azure Functions](../../functions-overview.md), to write stateful functions in a serverless environment. Durable Functions manages state, checkpoints, and restarts in your application.

Durable Functions supports several [storage providers](../durable-functions-storage-providers.md), also known as _back ends_, for storing orchestration and entity runtime state. By default, new projects are configured to use the [Azure Storage provider](../durable-functions-storage-providers.md#azure-storage). In this quickstart, you configure a Durable Functions app to use the [Durable Task Scheduler storage provider](../durable-functions-storage-providers.md#dts).

> [!NOTE]
>
> - The Durable Task Scheduler backend was designed to  To learn more about when to use the Durable Task Scheduler storage provider, see the [storage providers overview](../durable-functions-storage-providers.md).
>
> - Migrating [task hub data](../durable-functions-task-hubs.md) across storage providers currently isn't supported. Function apps that have existing runtime data start with a fresh, empty task hub after they switch to the Durable Task Scheduler back end. Similarly, the task hub contents that are created by using Durable Task Scheduler can't be preserved if you switch to a different storage provider.
>
> - The Durable Task Scheduler backend currently isn't supported by Durable Functions when running on the [Flex Consumption plan](../flex-consumption-plan.md). 

## Prerequisites

Before continuing with the tutorial, make sure you have:

The following steps assume that you have an existing Durable Functions app and that you're familiar with how to operate it.

Specifically, this quickstart assumes that you have already:

- Created an Azure Functions project on your local computer.
- Added Durable Functions to your project with an [orchestrator function](../durable-functions-bindings.md#orchestration-trigger) and a [client function](../durable-functions-bindings.md#orchestration-client) that triggers the Durable Functions app.

If you don't meet these prerequisites, we recommend that you begin with one of the following quickstarts:

- [Create a Durable Functions app - C#](../durable-functions-isolated-create-first-csharp.md)
- [Create a Durable Functions app - JavaScript](../quickstart-js-vscode.md)
- [Create a Durable Functions app - Python](../quickstart-python-vscode.md)
- [Create a Durable Functions app - PowerShell](../quickstart-powershell-vscode.md)
- [Create a Durable Functions app - Java](../quickstart-java.md)

## Add the Durable Task Scheduler extension (.NET only)

> [!NOTE]
> If your app uses [Extension Bundles](../../functions-bindings-register.md#extension-bundles), skip this section. Extension Bundles removes the need for manual extension management.

First, install the latest version of the [Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged) Durable Task Scheduler storage provider extension from NuGet. For .NET, you add a reference to the extension in your _.csproj_ file and then build the project. You can also use the [dotnet add package](/dotnet/core/tools/dotnet-add-package) command to add extension packages.

You can install the extension by using the following [Azure Functions Core Tools CLI](../../functions-run-local.md#install-the-azure-functions-core-tools) command:

```cmd
func extensions install --package <package name depending on your worker model> --version <latest version>
```

For more information about installing Azure Functions extensions via the Core Tools CLI, see [func extensions install](../../functions-core-tools-reference.md#func-extensions-install).

## Configure local.settings.json for local development

The Durable Task Scheduler backend TODO

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "<DEPENDENT ON YOUR PROGRAMMING LANGUAGE>",
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "DURABLE_TASK_SCHEDULER_CONNECTION_STRING": "Endpoint={DTS URL};Authentication=DefaultAzure",
    "TASKHUB_NAME": "<TASKHUB NAME>"
  }
}
```

> [!NOTE]
> The value of `FUNCTIONS_WORKER_RUNTIME` depends on the programming language you use. For more information, see the [runtime reference](../../functions-app-settings.md#functions_worker_runtime).

## Update host.json

Change the `storageProvider` type to `azureManaged`:

```json
{
  "version": "2.0",
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

## Test locally 

Start [Azurite](../../../storage/common/storage-use-azurite.md#run-azurite). 

Once you've started Azurite, go to the root directory of your app and run the application:

```sh
func start
```

Running into issues? [See the troubleshooting guide.](./troubleshoot-durable-task-scheduler.md)

> [!NOTE] 
> If you have a Python app, remember to create a virtual environment and install packages in `requirements.txt` before running `func start`. The packages you need are `azure-functions` and `azure-functions-durable`.  

## Run the app on Azure

To deploy your app on Azure, start by creating a Function app hosted on App Service.

### Create a Function app

Navigate to the Function app creation blade and select **App Service** as a hosting option.

:::image type="content" source="media/create-durable-task-scheduler/function-app-hosted-app-service.png" alt-text="Screenshot of hosting options for Function apps and selecting App Service.":::

In the **Create Function App (App Service)** blade, [create the function app settings as specified in the Azure Functions documentation](../../functions-create-function-app-portal.md)

:::image type="content" source="media/create-durable-task-scheduler/function-app-basic-tab.png" alt-text="Screenshot of the Basic tab for creating an App Service plan Function app.":::

### Set Durable Task Scheduler as storage backend

After filling out the appropriate fields in the **Basic** and other necessary tabs, select the **Durable Functions** tab. Choose **Durable Task Scheduler** as your storage backend. 

:::image type="content" source="media/create-durable-task-scheduler/durable-func-tab.png" alt-text="Screenshot of creating an App Service plan Function app.":::

> [!NOTE]
> It is recommended that the region chosen for your Durable Task Scheduler matches the region chosen for your Function App. 

### Verify user-managed identity

Durable Task Scheduler supports only identity-based authentication. Once your function app is deployed, a user-managed identity resource with the necessary RBAC permission is automatically created. 

On the **Review + create** tab, you can find information related to the managed identity resource, such as:
- The RBAC assigned to it (*Durable Task Data Contributor*) 
- The scope of the assignment (on the scheduler level):

   :::image type="content" source="media/create-durable-task-scheduler/func-review-create-tab.png" alt-text="Screenshot of fields and properties chosen and in review on the Review + create tab.":::

Click **Create** to deploy the app.

## Clean up resources

Remove the task hub you created. 

```azurecli
az durabletask taskhub delete --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER --name YOUR_TASKHUB
```

Successful deletion doesn't return any output. 

Next, delete the scheduler that housed that task hub.

```azurecli
az durabletask scheduler delete --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER 
```

## Next steps

- Learn more about the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md).
- [Troubleshoot any errors you may encounter](./troubleshoot-durable-task-scheduler.md) while using Durable Task Scheduler.