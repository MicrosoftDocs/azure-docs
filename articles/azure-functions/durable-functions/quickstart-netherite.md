---
title: "Quickstart: Configure a storage provider by using Netherite"
description: "Learn how to configure a Durable Functions app to use the Netherite storage provider in Azure Functions. Set up Event Hubs, update host.json, and deploy your app."
author: sebastianburckhardt
ms.author: hannahhunter
ms.topic: quickstart
ms.service: azure-functions
ms.date: 07/24/2024
ms.reviewer: azfuncdf
ms.custom:
  - devx-track-dotnet
  - sfi-image-nochange
---

# Quickstart: Configure a Durable Functions app to use the Netherite storage provider

> [!IMPORTANT]
> Support for the Netherite storage backend ends **March 31, 2028**. Evaluate the [Durable Task Scheduler](../../durable-task/scheduler/durable-task-scheduler.md) as a replacement for your Netherite workloads. See the [end-of-support announcement](https://azure.microsoft.com/updates/?id=489009) and the [Durable Task Scheduler quickstart](../../durable-task/scheduler/quickstart-durable-task-scheduler.md).

Durable Functions offers several [storage providers](../../durable-task/common/durable-task-storage-providers.md), also called *back ends*, for storing orchestration and entity runtime state. In this quickstart, you configure an existing Durable Functions app to use the [Netherite storage provider](../../durable-task/common/durable-task-storage-providers.md#netherite). Netherite was designed by [Microsoft Research](https://www.microsoft.com/research) for [high-throughput scenarios](https://microsoft.github.io/durabletask-netherite/#/scenarios) and can increase throughput by more than an order of magnitude compared to the default Azure Storage provider.

> [!NOTE]
>
> - Migrating [task hub data](../../durable-task/common/durable-task-hubs.md) across storage providers isn't supported. Your app starts with a fresh, empty task hub after switching to Netherite.
>
> - Netherite isn't supported on the [Flex Consumption plan](../flex-consumption-plan.md). 

## Prerequisites

This quickstart assumes you have an existing Durable Functions app with an [orchestrator function](durable-functions-bindings.md#orchestration-trigger) and a [client function](durable-functions-bindings.md#orchestration-client) configured for local debugging. If you need to create one first, see the Durable Functions quickstart for your language: [C#](durable-functions-isolated-create-first-csharp.md) | [JavaScript](quickstart-js-vscode.md) | [Python](quickstart-python-vscode.md) | [PowerShell](quickstart-powershell-vscode.md) | [Java](quickstart-java.md).

## Install the Netherite extension

If your app uses [Extension Bundles](../extension-bundles.md) (the default for non-.NET languages), skip this section. Extension Bundles handles extension management automatically.

For .NET apps, install the latest version of the [Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Netherite](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Netherite) NuGet package. You can add a reference in your *.csproj* file, or install it via the CLI.

You can install the extension by using the following [Azure Functions Core Tools CLI](../functions-run-local.md#install-the-azure-functions-core-tools) command:

```cmd
func extensions install --package <package name depending on your worker model> --version <latest version>
```

For more information about installing Azure Functions extensions via the Core Tools CLI, see [func extensions install](../functions-core-tools-reference.md#func-extensions-install).

## Configure local.settings.json for local development

The Netherite back end requires [Azure Event Hubs](https://azure.microsoft.com/products/event-hubs/) when running on Azure, but for local development you can bypass Event Hubs entirely. Setting `EventHubsConnection` to `"SingleHost"` runs the Netherite engine in-process without Event Hubs.

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

This code snippet is a basic configuration. Common parameters you might add later include `PartitionCount` (controls parallelism; default is 12) and `EventHubsConnection` (if you use a non-default app setting name). For the full list, see [Netherite configuration settings](https://microsoft.github.io/durabletask-netherite/#/settings?id=typical-configuration).

## Test locally

Your app is now ready for local development. You can start the function app to test it. One way to start the app is to run `func host start` on your application's root, and then execute a basic orchestrator function.

While the function app is running, Netherite publishes load information about its active partitions to an Azure Storage table named **DurableTaskPartitions**. You can use [Azure Storage Explorer](../../storage/storage-explorer/vs-azure-tools-storage-manage-with-storage-explorer.md) to verify that it's working as expected. If Netherite is running correctly, the table isn't empty. For an example, see the following screenshot.

:::image type="content" source="media/quickstart-netherite/partition-table.png" alt-text="Screenshot of data in the DurableTaskPartitions table in Azure Storage Explorer.":::

For more information about the contents of the **DurableTaskPartitions** table, see [Partition Table](https://microsoft.github.io/durabletask-netherite/#/ptable).

> [!NOTE]
> If you use local storage emulation on a Windows OS, ensure that you're using the [Azurite](../../storage/common/storage-use-azurite.md) storage emulator and not the earlier *Azure Storage Emulator* component. Local storage emulation with Netherite is supported only via Azurite.

## Configure and deploy to Azure

To run Netherite in Azure, you need an Azure Functions app and an Event Hubs namespace. If you don't have a function app yet, [create one in the Azure portal](../functions-create-function-app-portal.md).

### Step 1: Create an Event Hubs namespace

Netherite uses Event Hubs for partition management and communication between worker instances.

> [!NOTE]
> An Event Hubs namespace incurs an ongoing cost, whether or not it's being used by Durable Functions. Microsoft offers a [12-month free Azure subscription account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) if you're exploring Azure for the first time.

Complete the steps to [create an Event Hubs namespace](../../event-hubs/event-hubs-create.md#create-an-event-hubs-namespace) in the Azure portal. When prompted:

- **Resource group**: Use the same resource group as your function app.
- **Plan and throughput units**: Select the defaults. You can change this setting later.
- **Retention time**: Select the default. This setting has no effect on Netherite.

### Step 2: Add the Event Hubs connection string to your app

1. In your Event Hubs namespace, select **Shared access policies** > **RootManagedSharedAccessKey**. Copy the value from **Connection string-primary key**.

    :::image type="content" source="media/quickstart-netherite/namespace-connection-string.png" alt-text="Screenshot of the connection string primary key in the Event Hubs namespace in the Azure portal.":::

1. In your function app, select **Configuration** > **New application setting**. Set the name to `EventHubsConnection` and paste the connection string as the value.

    :::image type="content" source="media/quickstart-netherite/add-configuration.png" alt-text="Screenshot of the function app Configuration pane with the New application setting option.":::

    :::image type="content" source="media/quickstart-netherite/enter-configuration.png" alt-text="Screenshot of entering EventHubsConnection as the name and the connection string as its value.":::

### Step 3: Verify platform settings

Check the following settings under **Configuration** in the Azure portal. Not all settings apply to every app.

- **64-bit architecture (Windows only):** Netherite requires 64-bit. Under **General Settings**, verify that **Platform** is set to **64 Bit**. This setting is the default starting with Azure Functions V4. Linux apps are always 64-bit and don't show this option.

    :::image type="content" source="media/quickstart-netherite/ensure-64-bit-architecture.png" alt-text="Screenshot of configuring the platform to use 64-bit architecture in the Azure portal.":::

- **Runtime scale monitoring (Elastic Premium only):** If your app is on the Elastic Premium plan, enable runtime scale monitoring for better scaling. Under **Function runtime settings**, set **Runtime Scale Monitoring** to **On**.

    :::image type="content" source="media/quickstart-netherite/runtime-scale-monitoring.png" alt-text="Screenshot of enabling runtime scale monitoring in the Azure portal.":::

### Step 4: Deploy your app

Deploy your project to the function app. You can use the Azure Functions Core Tools CLI:

```cmd
func azure functionapp publish <your-function-app-name>
```

To validate that Netherite is correctly configured after deployment, review the Event Hubs metrics in the Azure portal to ensure there's activity.

For other deployment methods, see the deployment instructions for your language in [Prerequisites](#prerequisites).

## Related content

- [Netherite documentation](https://microsoft.github.io/durabletask-netherite/#/) — architecture, configuration, and performance benchmarks
- [Storage providers overview](../../durable-task/common/durable-task-storage-providers.md) — compare Netherite, Azure Storage, MSSQL, and Durable Task Scheduler
- [Performance and scale in Durable Functions](durable-functions-perf-and-scale.md)
- [Configure Durable Functions with Durable Task Scheduler](../../durable-task/scheduler/quickstart-durable-task-scheduler.md) — the recommended replacement for Netherite
