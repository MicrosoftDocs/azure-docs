---
title: "Quickstart: Configure a storage provider by using Netherite"
description: Configure a Durable Functions app to use the Netherite storage provider in Azure Functions.
author: sebastianburckhardt
ms.topic: quickstart
ms.custom: devx-track-dotnet
ms.date: 07/24/2024
ms.reviewer: azfuncdf
---

# Quickstart: Set a Durable Functions app to use the Netherite storage provider

Use Durable Functions, a feature of [Azure Functions](../functions-overview.md), to write stateful functions in a serverless environment. Durable Functions manages state, checkpoints, and restarts in your application.

Durable Functions offers several [storage providers](durable-functions-storage-providers.md), also called *back ends*, for storing orchestration and entity runtime state. By default, new projects are configured to use the [Azure Storage provider](durable-functions-storage-providers.md#azure-storage). In this quickstart, you configure a Durable Functions app to use the [Netherite storage provider](durable-functions-storage-providers.md#netherite).

> [!NOTE]
>
> - Netherite was designed and developed by [Microsoft Research](https://www.microsoft.com/research) for [high throughput](https://microsoft.github.io/durabletask-netherite/#/scenarios) scenarios. In some [benchmarks](https://microsoft.github.io/durabletask-netherite/#/throughput?id=multi-node-throughput), throughput increased by more than an order of magnitude compared to the default Azure Storage provider. To learn more about when to use the Netherite storage provider, see the [storage providers](durable-functions-storage-providers.md) documentation.
>
> - Migrating [task hub data](durable-functions-task-hubs.md) across storage providers currently isn't supported. Function apps that have existing runtime data start with a fresh, empty task hub after they switch to the Netherite back end. Similarly, the task hub contents that are created by using MSSQL can't be preserved if you switch to a different storage provider.

## Prerequisites

The following steps assume that you're starting with an existing Durable Functions app and are familiar with how to operate it.

Specifically, this quickstart assumes that you have already:

- Created an Azure Functions project on your local computer.
- Added Durable Functions to your project with an [orchestrator function](durable-functions-bindings.md#orchestration-trigger) and a [client function](durable-functions-bindings.md#orchestration-client) that triggers it.
- Configured the project for local debugging.
- Learned how to deploy an Azure Functions project to Azure.

If you don't meet these prerequisites, we recommend that you start with one of the following quickstarts:

- [Create a Durable Functions app - C#](durable-functions-isolated-create-first-csharp.md)
- [Create a Durable Functions app - JavaScript](quickstart-js-vscode.md)
- [Create a Durable Functions app - Python](quickstart-python-vscode.md)
- [Create a Durable Functions app - PowerShell](quickstart-powershell-vscode.md)
- [Create a Durable Functions app - Java](quickstart-java.md)

## Add the Netherite extension (.NET only)

> [!NOTE]
> If your app uses [Extension Bundles](../functions-bindings-register.md#extension-bundles), skip this section. Extension Bundles removes the need for manual extension management.

First, install the latest version of the [Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Netherite](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Netherite) storage provider extension from NuGet. For .NET, you usually include a reference to it in your *.csproj* file and building the project.

You can install the extension by using the following [Azure Functions Core Tools CLI](../functions-run-local.md#install-the-azure-functions-core-tools) command:

```cmd
func extensions install --package <package name depending on your worker model> --version <latest version>
```

For more information about installing Azure Functions extensions via the Core Tools CLI, see [func extensions install](../functions-core-tools-reference.md#func-extensions-install).

## Configure local.settings.json for local development

The Netherite back end requires a connection string to [Azure Event Hubs](https://azure.microsoft.com/products/event-hubs/) to run on Azure. However, for local development, providing the string `"SingleHost"` bypasses the need to use Event Hubs.

In *local.settings.json*, set the value of `EventHubsConnection` to `SingleHost`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "EventHubsConnection": "SingleHost",
    "FUNCTIONS_WORKER_RUNTIME": "<dependent on your programming language>"
  }
}
```

> [!NOTE]
> The value of `FUNCTIONS_WORKER_RUNTIME` depends on the programming language you use. For more information, see the [runtime reference](../functions-app-settings.md#functions_worker_runtime).

## Update host.json

Edit the storage provider section of the *host.json* file to set `type` to `Netherite`:

```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "storageProvider": {
        "type": "Netherite"
        }
    }
  }
}
```

This code snippet is a basic configuration. Later, you might want to [add parameters](https://microsoft.github.io/durabletask-netherite/#/settings?id=typical-configuration).

## Test locally

Your app is now ready for local development. You can start the function app to test it. One way to start the app is to run `func host start` on your application's root, and then execute a basic orchestrator function.

While the function app is running, Netherite publishes load information about its active partitions to an Azure Storage table named **DurableTaskPartitions**. You can use [Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md) to verify that it's working as expected. If Netherite is running correctly, the table isn't empty. For an example, see the following screenshot.

:::image type="content" source="media/quickstart-netherite/partition-table.png" alt-text="Screenshot that shows data in the DurableTaskPartitions table in Azure Storage Explorer.":::

For more information about the contents of the **DurableTaskPartitions** table, see [Partition Table](https://microsoft.github.io/durabletask-netherite/#/ptable).

> [!NOTE]
> If you use local storage emulation on a Windows OS, ensure that you're using the [Azurite](../../storage/common/storage-use-azurite.md) storage emulator and not the earlier *Azure Storage Emulator* component. Local storage emulation with Netherite is supported only via Azurite.

## Run your app in Azure

To run your app in Azure, [create an Azure Functions app](../functions-create-function-app-portal.md).

### Set up Event Hubs

You need to set up an Event Hubs namespace to run Netherite in Azure. You can also set it up if you prefer to use Event Hubs during local development.

> [!NOTE]
> An Event Hubs namespace incurs an ongoing cost, whether or not it is being used by Durable Functions. Microsoft offers a [12-month free Azure subscription account](https://azure.microsoft.com/free/) if you’re exploring Azure for the first time.

#### Create an Event Hubs namespace

Complete the steps to [create an Event Hubs namespace](../../event-hubs/event-hubs-create.md#create-an-event-hubs-namespace)  in the Azure portal. When you create the namespace, you might be prompted to:

- Select a *resource group*. Use the same resource group that the function app uses.
- Select a *plan* and provision *throughput units*. Select the defaults. You can change this setting later.
- Select a *retention* time. Select the default. This setting has no effect on Netherite.

#### Get the Event Hubs connection string

To get the connection string for your Event Hubs namespace, go to your Event Hubs namespace in the Azure portal. Select **Shared access policies**, and then select **RootManagedSharedAccessKey**. A field named **Connection string-primary key** appears, and the field's value is the connection string.

:::image type="content" source="media/quickstart-netherite/namespace-connection-string.png" alt-text="Screenshot that shows finding the connection string primary key in the Azure portal.":::

### Add the connection string as an application setting

Next, add your connection string as an application setting in your function app. To add it in the Azure portal, go to your function app view, select **Configuration**, and then select **New application setting**. You can assign `EventHubsConnection` to map to your connection string. The following screenshots show some examples.

:::image type="content" source="media/quickstart-netherite/add-configuration.png" alt-text="Screenshot that shows the function app view, Configuration, and select New application setting.":::

:::image type="content" source="media/quickstart-netherite/enter-configuration.png" alt-text="Screenshot that shows entering EventHubsConnection as the name, and the connection string as its value.":::

### Enable runtime scaling (Elastic Premium only)

> [!NOTE]
> Skip this section if your app is not in the Elastic Premium plan.

If your app is running on the Elastic Premium plan, we recommend that you enable runtime scale monitoring for better scaling. Go to **Configuration**, select **Function runtime settings**, and set **Runtime Scale Monitoring** to **On**.

:::image type="content" source="media/quickstart-netherite/runtime-scale-monitoring.png" alt-text="Screenshot that shows how to enable runtime scale monitoring in the portal.":::

### Ensure that your app is using a 64-bit architecture (Windows only)

> [!NOTE]
> Skip this section if your app runs on Linux.

Netherite requires a 64-bit architecture. Beginning with Azure Functions V4, 64-bit should be the default. You can usually validate this setting in the Azure portal. Under **Configuration**, select **General Settings**, and then ensure that **Platform** is set to **64 Bit**. If you don't see this option in the portal, then you might already run on a 64-bit platform. For example, Linux apps don't show this setting because they support only 64-bit architecture.

:::image type="content" source="media/quickstart-netherite/ensure-64-bit-architecture.png" alt-text="Screenshot that shows how to configure a runtime to use 64-bit in the portal.":::

## Deploy

You can now deploy your code to the cloud and run your tests or workload on it. To validate that Netherite is correctly configured, you can review the metrics for Event Hubs in the portal to ensure that there's activity.

> [!NOTE]
> For information about how to deploy your project to Azure, review the deployment instructions for your programming language in [Prerequisites](#prerequisites).

## Related content

- For more information about the Netherite architecture, configuration, and workload behavior, including performance benchmarks, we recommend that you take a look at the [Netherite documentation](https://microsoft.github.io/durabletask-netherite/#/).
