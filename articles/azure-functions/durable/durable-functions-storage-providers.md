---
title: Durable Functions storage providers - Azure
description: Learn about the different storage providers for Durable Functions and how they compare
author: cgillum
ms.topic: conceptual
ms.date: 05/05/2021
ms.author: azfuncdf
#Customer intent: As a developer, I want to understand what storage providers are available Durable Functions and which one I should choose.
---

# Durable Functions storage providers

Durable Functions automatically persists function parameters, return values, and other state to durable storage to guarantee reliable execution. The default configuration for Durable Functions stores this runtime state in an Azure Storage (classic) account. However, it's possible to configure Durable Functions v2.0 and above to use an alternate durable storage provider.

Durable Functions is a set of Azure Functions triggers and bindings that are internally powered by the [Durable Task Framework](https://github.com/Azure/durabletask) (DTFx). DTFx supports various backend storage providers, including the Azure Storage provider used by Durable Functions. Starting in Durable Functions **v2.5.0**, users can configure their function apps to use DTFx storage providers other than the Azure Storage provider.

> [!NOTE]
> The choice to use storage providers other than Azure Storage should be made carefully. Most function apps running in Azure should use the default Azure Storage provider for Durable Functions. However, there are important cost, scalability, and data management tradeoffs that should be considered when deciding whether to use an alternate storage provider. This article describes many of these tradeoffs in detail.
>
> Also note that it's not currently possible to migrate data from one storage provider to another. If you want to use a new storage provider, you should create a new app configured with the new storage provider.

Two alternate DTFx storage providers were developed for use with Durable Functions, the _Netherite_ storage provider and the _Microsoft SQL Server (MSSQL)_ storage provider. This article describes all three supported providers, compares them against each other, and provides basic information about how to get started using them.

## Azure Storage

Azure Storage is the default storage provider for Durable Functions. It uses queues, tables, and blobs to persist orchestration and entity state. It also uses blobs and blob leases to manage partitions. In many cases, the storage account used to store Durable Functions runtime state is the same as the default storage account used by Azure Functions (`AzureWebJobsStorage`). However, it's also possible to configure Durable Functions with a separate storage account. The Azure Storage provider is built-into the Durable Functions extension and doesn't have any other dependencies.

The key benefits of the Azure Storage provider include:

* No setup required - you can use the storage account that was created for you by the function app setup experience.
* Lowest-cost serverless billing model - Azure Storage has a consumption-based pricing model based entirely on usage ([more information](durable-functions-billing.md#azure-storage-transactions)).
* Best tooling support - Azure Storage offers cross-platform local emulation and integrates with Visual Studio, Visual Studio Code, and the Azure Functions Core Tools.
* Most mature - Azure Storage was the original and most battle-tested storage backend for Durable Functions.

The source code for the DTFx components of the Azure Storage storage provider can be found in the [Azure/durabletask](https://github.com/Azure/durabletask/tree/main/src/DurableTask.AzureStorage) GitHub repo.

> [!NOTE]
> Standard general purpose Azure Storage accounts are required when using the Azure Storage provider. All other storage account types are not supported. We highly recommend using legacy v1 general purpose storage accounts because the newer v2 storage accounts can be significantly more expensive for Durable Functions workloads. For more information on Azure Storage account types, see the [Storage account overview](../../storage/common/storage-account-overview.md) documentation.

## <a name="netherite"></a>Netherite (preview)

The Netherite storage backend was designed and developed by [Microsoft Research](https://www.microsoft.com/research). It uses [Azure Event Hubs](../../event-hubs/event-hubs-about.md) and the [FASTER](https://www.microsoft.com/research/project/faster/) database technology on top of [Azure Page Blobs](../../storage/blobs/storage-blob-pageblob-overview.md). The design of Netherite enables significantly higher-throughput processing of orchestrations and entities compared to other providers. In some benchmark scenarios, throughput was shown to increase by more than an order of magnitude when compared to the default Azure Storage provider.

The key benefits of the Netherite storage provider include:

* Significantly higher throughput at lower cost compared to other storage providers.
* Supports price-performance optimization, allowing you to scale-up performance as-needed.
* Supports up to 32 data partitions with Event Hubs Basic and Standard SKUs.
* More cost-effective than other providers for high-throughput workloads.

You can learn more about the technical details of the Netherite storage provider, including how to get started using it, in the [Netherite documentation](https://microsoft.github.io/durabletask-netherite). The source code for the Netherite storage provider can be found in the [microsoft/durabletask-netherite](https://github.com/microsoft/durabletask-netherite) GitHub repo. A more in-depth evaluation of the Netherite storage provider is also available in the following research paper: [Serverless Workflows with Durable Functions and Netherite](https://arxiv.org/abs/2103.00033).

> [!NOTE]
> The _Netherite_ name originates from the world of [Minecraft](https://minecraft.fandom.com/wiki/Netherite).

## <a name="mssql"></a>Microsoft SQL Server (MSSQL) (preview)

The Microsoft SQL Server (MSSQL) storage provider persists all state into a Microsoft SQL Server database. It's compatible with both on-premise and cloud-hosted deployments of SQL Server, including [Azure SQL Database](../../azure-sql/database/sql-database-paas-overview.md).

The key benefits of the MSSQL storage provider include:

* Supports disconnected environments - no Azure connectivity is required when using a SQL Server installation.
* Portable across multiple environments and clouds, including Azure-hosted and on-premises.
* Strong data consistency, enabling backup/restore and failover without data loss.
* Native support for custom data encryption (a feature of SQL Server).
* Integrates with existing database applications via built-in stored procedures.

You can learn more about the technical details of the MSSQL storage provider, including how to get started using it, in the [Microsoft SQL provider documentation](https://microsoft.github.io/durabletask-mssql). The source code for the MSSQL storage provider can be found in the [microsoft/durabletask-mssql](https://github.com/microsoft/durabletask-mssql) GitHub repo.

## Configuring alternate storage providers

Configuring alternate storage providers is generally a two-step process:

1. Add the appropriate NuGet package to your function app (this requirement is temporary for apps using extension bundles).
1. Update the **host.json** file to specify which storage provider you want to use.

If no storage provider is explicitly configured in host.json, the Azure Storage provider will be enabled by default.

### Configuring the Azure storage provider

The Azure Storage provider is the default storage provider and doesn't require any explicit configuration, NuGet package references, or extension bundle references. You can find the full set of **host.json** configuration options [here](durable-functions-bindings.md#hostjson-settings), under the `extensions/durableTask/storageProvider` path.

### Configuring the Netherite storage provider

To use the Netherite storage provider, you must first add a reference to the [Microsoft.Azure.DurableTask.Netherite.AzureFunctions](https://www.nuget.org/packages/Microsoft.Azure.DurableTask.Netherite.AzureFunctions) NuGet package in your **csproj** file (.NET apps) or your **extensions.proj** file (JavaScript, Python, and PowerShell apps).

> [!NOTE]
> The Netherite storage provider is not yet supported in apps that use [extension bundles](../functions-bindings-register.md#extension-bundles).

The following host.json example shows the minimum configuration required to enable the Netherite storage provider.

```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "storageProvider": {
        "type": "Netherite",
        "storageConnectionName": "AzureWebJobsStorage",
        "eventHubsConnectionName": "EventHubsConnection"
      }
    }
  }
}
```

For more detailed setup instructions, see the [Netherite getting started documentation](https://microsoft.github.io/durabletask-netherite/#/?id=getting-started).

### Configuring the MSSQL storage provider

To use the MSSQL storage provider, you must first add a reference to the [Microsoft.DurableTask.SqlServer.AzureFunctions](https://www.nuget.org/packages/Microsoft.DurableTask.SqlServer.AzureFunctions) NuGet package in your **csproj** file (.NET apps) or your **extensions.proj** file (JavaScript, Python, and PowerShell apps).

> [!NOTE]
> The MSSQL storage provider is not yet supported in apps that use [extension bundles](../functions-bindings-register.md#extension-bundles).

The following example shows the minimum configuration required to enable the MSSQL storage provider.

```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "storageProvider": {
        "type": "mssql",
        "connectionStringName": "SQLDB_Connection"
      }
    }
  }
}
```

For more detailed setup instructions, see the [MSSQL provider's getting started documentation](https://microsoft.github.io/durabletask-mssql/#/quickstart).

## Comparing storage providers

There are many significant tradeoffs between the various supported storage providers. The following table can be used to help you understand these tradeoffs and decide which storage provider is best for your needs.

| Storage provider | Azure Storage | Netherite | MSSQL |
|- |-              |-          |-      |
| Official support status | ✅ Generally available (GA) | ⚠ Public preview | ⚠ Public preview |
| External dependencies | Azure Storage account (general purpose v1) | Azure Event Hubs<br/>Azure Storage account (general purpose) | [SQL Server 2019](https://www.microsoft.com/sql-server/sql-server-2019) or Azure SQL Database |
| Local development and emulation options | [Azurite v3.12+](../../storage/common/storage-use-azurite.md) (cross platform)<br/>[Azure Storage Emulator](../../storage/common/storage-use-emulator.md) (Windows only) | In-memory emulation ([more information](https://microsoft.github.io/durabletask-netherite/#/emulation)) | SQL Server Developer Edition (supports [Windows](/sql/database-engine/install-windows/install-sql-server), [Linux](/sql/linux/sql-server-linux-setup), and [Docker containers](/sql/linux/sql-server-linux-docker-container-deployment)) |
| Task hub configuration | Explicit | Explicit | Implicit by default ([more information](https://microsoft.github.io/durabletask-mssql/#/taskhubs)) |
| Maximum throughput | Moderate | Very high | Moderate |
| Maximum orchestration/entity scale-out (nodes) | 16 | 32 | N/A |
| Maximum activity scale-out (nodes) | N/A | 32 | N/A |
| Consumption plan support | ✅ Fully supported | ❌ Not supported | ❌ Not supported |
| Elastic Premium plan support | ✅ Fully supported | ⚠ Requires [runtime scale monitoring](../functions-networking-options.md#premium-plan-with-virtual-network-triggers) | ⚠ Requires [runtime scale monitoring](../functions-networking-options.md#premium-plan-with-virtual-network-triggers) |
| [KEDA 2.0](https://keda.sh/) scaling support<br/>([more information](../functions-kubernetes-keda.md)) | ❌ Not supported | ❌ Not supported | ✅ Supported using the [MSSQL scaler](https://keda.sh/docs/scalers/mssql/) ([more information](https://microsoft.github.io/durabletask-mssql/#/scaling)) |
| Support for [extension bundles](../functions-bindings-register.md#extension-bundles) (recommended for non-.NET apps) | ✅ Fully supported | ❌ Not supported | ❌ Not supported |
| Price-performance configurable? | ❌ No | ✅ Yes (Event Hubs TUs and CUs) | ✅ Yes (SQL vCPUs) |
| Disconnected environment support | ❌ Azure connectivity required | ❌ Azure connectivity required | ✅ Fully supported |

## Next steps

> [!div class="nextstepaction"]
> [Learn about Durable Functions performance and scale](durable-functions-perf-and-scale.md)
