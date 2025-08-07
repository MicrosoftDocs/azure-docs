---
title: Durable Functions storage providers - Azure
description: Learn about the different storage providers for Durable Functions and how they compare
author: cgillum
ms.topic: conceptual
ms.date: 04/10/2025
ms.author: azfuncdf
#Customer intent: As a developer, I want to understand what storage providers are available Durable Functions and which one I should choose.
---

# Durable Functions storage providers

Durable Functions is a set of Azure Functions triggers and bindings that are internally powered by the [Durable Task Framework](https://github.com/Azure/durabletask) (DTFx). DTFx supports various backend storage providers, including the Azure Storage provider used by Durable Functions. As of Durable Functions **v2.5.0**, users can configure their function apps to use DTFx storage providers other than the Azure Storage provider.

> [!NOTE]
> The default Azure Storage provider for Durable Functions is the easiest to use since it requires no extra configuration. However, there are cost, scalability, and data management tradeoffs that may favor the use of an alternate backend provider.

Durable Functions supports two types of backend providers: "Bring your own (BYO)" and Azure managed. The BYO options include *Azure Storage, Netherite, and Microsoft SQL Server (MSSQL)*. The Azure managed option is the new *durable task scheduler* currently in preview. This article describes all supported backend providers, compares them against each other, and provides basic information about how to get started using them.

> [!NOTE]
> It's not currently possible to migrate data from one storage backend provider to another. If you want to use a new provider, you should create a new app configured with the new provider.

## <a name="dts"></a>Durable task scheduler (preview)

The durable task scheduler is a fully managed, high performance backend provider for Durable Functions. It was designed and built from scratch with help from Microsoft Research. This new provider aims to provide the best user experience in aspects such as management, observability, performance, and security.  

The key benefits of the durable task scheduler include:

* Lower management and operation overhead compared to BYO backend providers
* First-class observability and management [dashboard](./durable-task-scheduler/durable-task-scheduler-dashboard.md) provided out-of-the-box. 
* Supports the highest throughput of all backends today.
* Support for authentication using managed identity.

Existing Durable Functions users can leverage the scheduler with no code changes. Learn more about the [durable task scheduler](./durable-task-scheduler/durable-task-scheduler.md), and [how to get started](./durable-task-scheduler/quickstart-durable-task-scheduler.md). 

Samples for durable task scheduler can be found on [GitHub](https://github.com/Azure-Samples/Durable-Task-Scheduler/).

## Azure Storage

Azure Storage is the default storage provider for Durable Functions. It uses queues, tables, and blobs to persist orchestration and entity state. It also uses blobs and blob leases to manage partitions. In many cases, the storage account used to store Durable Functions runtime state is the same as the default storage account used by Azure Functions (`AzureWebJobsStorage`). However, it's also possible to configure Durable Functions with a separate storage account. The Azure Storage provider is built-into the Durable Functions extension and doesn't have any other dependencies.

The key benefits of the Azure Storage provider include:

* No setup required - you can use the storage account that was created for you by the function app setup experience.
* Lowest-cost serverless billing model - Azure Storage has a consumption-based pricing model based entirely on usage ([more information](durable-functions-billing.md#azure-storage-transactions)).
* Best tooling support - Azure Storage offers cross-platform local emulation and integrates with Visual Studio, Visual Studio Code, and the Azure Functions Core Tools.
* Most mature - Azure Storage was the original and most battle-tested storage backend for Durable Functions.
* Support for using identity instead of secrets for connecting to the storage provider.

The source code for the DTFx components of the Azure Storage storage provider can be found in the [Azure/durabletask](https://github.com/Azure/durabletask/tree/main/src/DurableTask.AzureStorage) GitHub repo.

> [!NOTE]
> Standard general purpose Azure Storage accounts are required when using the Azure Storage provider. All other storage account types are not supported. We highly recommend using legacy v1 general purpose storage accounts because the newer v2 storage accounts can be more expensive for Durable Functions workloads. For more information on Azure Storage account types, see the [Storage account overview](../../storage/common/storage-account-overview.md) documentation.

## <a name="netherite"></a>Netherite 
> [!NOTE]
> Support for using the Netherite storage backend with Durable Functions will end 31 March 2028. It is recommended that you start evaluating the Durable Task Scheduler for workloads that you're currently using Netherite for. See [end-of-support announcement](https://azure.microsoft.com/updates/?id=489009). 

The Netherite storage backend was designed and developed by [Microsoft Research](https://www.microsoft.com/research). It uses [Azure Event Hubs](../../event-hubs/event-hubs-about.md) and the [FASTER](https://www.microsoft.com/research/project/faster/) database technology on top of [Azure Page Blobs](../../storage/blobs/storage-blob-pageblob-overview.md). The design of Netherite enables higher-throughput processing of orchestrations and entities compared to other providers. In some benchmark scenarios, throughput was shown to increase by more than an order of magnitude when compared to the default Azure Storage provider.

The key benefits of the Netherite storage provider include:

* Higher throughput at lower cost compared to other storage providers.
* Supports price-performance optimization, allowing you to scale-up performance as-needed.
* Supports up to 32 data partitions with Event Hubs Basic and Standard SKUs.
* More cost-effective than other providers for high-throughput workloads.

You can learn more about the technical details of the Netherite storage provider, including how to get started using it, in the [Netherite documentation](https://microsoft.github.io/durabletask-netherite). The source code for the Netherite storage provider can be found in the [microsoft/durabletask-netherite](https://github.com/microsoft/durabletask-netherite) GitHub repo. A more in-depth evaluation of the Netherite storage provider is also available in the following research paper: [Serverless Workflows with Durable Functions and Netherite](https://arxiv.org/abs/2103.00033).

> [!NOTE]
> The _Netherite_ name originates from the world of [Minecraft](https://minecraft.fandom.com/wiki/Netherite).

## <a name="mssql"></a>Microsoft SQL Server (MSSQL)

The Microsoft SQL Server (MSSQL) storage provider persists all state into a Microsoft SQL Server database. It's compatible with both on-premises and cloud-hosted deployments of SQL Server, including [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview).

The key benefits of the MSSQL storage provider include:

* Supports disconnected environments - no Azure connectivity is required when using a SQL Server installation.
* Portable across multiple environments and clouds, including Azure-hosted and on-premises.
* Strong data consistency, enabling backup/restore and failover without data loss.
* Native support for custom data encryption (a feature of SQL Server).
* Integrates with existing database applications via built-in stored procedures.

You can learn more about the technical details of the MSSQL storage provider, including how to get started using it, in the [Microsoft SQL provider documentation](https://microsoft.github.io/durabletask-mssql). The source code for the MSSQL storage provider can be found in the [microsoft/durabletask-mssql](https://github.com/microsoft/durabletask-mssql) GitHub repo.

## Configuring the Azure storage provider

The Azure Storage provider is the default storage provider and doesn't require any explicit configuration, NuGet package references, or extension bundle references. You can find the full set of **host.json** configuration options [here](durable-functions-bindings.md#hostjson-settings), under the `extensions/durableTask/storageProvider` path.

### Connections

The `connectionName` property in host.json is a reference to environment configuration which specifies how the app should connect to Azure Storage. It may specify:

- The name of a shared prefix for multiple application settings, together defining an [identity-based connection](#identity-based-connections). Managed identities use Microsoft Entra authentication to provide the most secure connection to your storage account. 
- The name of an application setting containing a connection string. To obtain a connection string, follow the steps shown at [Manage storage account access keys](../../storage/common/storage-account-keys-manage.md). 

If the configured value is both an exact match for a single setting and a prefix match for other settings, the exact match is used. If no value is specified in host.json, the default value is `AzureWebJobsStorage`.

### Identity-based connections 

If you are using [version 2.7.0 or higher of the extension](https://github.com/Azure/azure-functions-durable-extension/releases/tag/v2.7.0) and the Azure storage provider, instead of using a connection string with a secret, you can have the app use an [Microsoft Entra identity](../../active-directory/fundamentals/active-directory-whatis.md). To do this, you would define settings under a common prefix which maps to the `connectionName` property in the trigger and binding configuration.

To use an identity-based connection for Durable Functions, configure the following app settings:

|Property | Environment variable template                       | Description                                | Example value                                        |
|-|-----------------------------------------------------|--------------------------------------------|------------------------------------------------|
| Blob service URI | `<CONNECTION_NAME_PREFIX>__blobServiceUri`| The data plane URI of the blob service of the storage account, using the HTTPS scheme. | https://<storage_account_name>.blob.core.windows.net |
| Queue service URI | `<CONNECTION_NAME_PREFIX>__queueServiceUri` | The data plane URI of the queue service of the storage account, using the HTTPS scheme. | https://<storage_account_name>.queue.core.windows.net |
| Table service URI | `<CONNECTION_NAME_PREFIX>__tableServiceUri` | The data plane URI of a table service of the storage account, using the HTTPS scheme. | https://<storage_account_name>.table.core.windows.net |

Additional properties may be set to customize the connection. See [Common properties for identity-based connections](../functions-reference.md#common-properties-for-identity-based-connections).

[!INCLUDE [functions-identity-based-connections-configuration](../../../includes/functions-identity-based-connections-configuration.md)]

[!INCLUDE [functions-durable-permissions](../../../includes/functions-durable-permissions.md)]

## Configuring alternate storage providers

Configuring alternate storage providers is generally a two-step process:

1. Add the appropriate NuGet package to your function app (this requirement is temporary for apps using extension bundles).
1. Update the **host.json** file to specify which storage provider you want to use.

If no storage provider is explicitly configured in host.json, the Azure Storage provider will be enabled by default.

### Configuring durable task scheduler (preview)
See the [durable task scheduler getting started documentation](./durable-task-scheduler/quickstart-durable-task-scheduler.md).

### Configuring the MSSQL storage provider
Enabling the MSSQL storage provider requires a configuration change in your `host.json`. For C# users, it also requires an additional installation step.

#### `host.json` Configuration

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

For more detailed setup instructions, see the [MSSQL provider's getting started documentation](./quickstart-mssql.md) and [documentation on github.io](https://microsoft.github.io/durabletask-mssql/#/quickstart).

#### Install the Durable Task MSSQL extension (.NET only)

> [!NOTE]
> If your app uses [Extension Bundles](../extension-bundles.md), you should ignore this section as Extension Bundles removes the need for manual Extension management.

You'll need to install the latest version of the MSSQL storage provider Extension on NuGet: [`Microsoft.Azure.Functions.Worker.Extensions.DurableTask.SqlServer`](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.SqlServer). This usually means including a reference to it in your `.csproj` file and building the project.

## Comparing storage providers

There are many significant tradeoffs between the various supported storage providers. The following table can be used to help you understand these tradeoffs and decide which storage provider is best for your needs.

> [!NOTE]
> Support for using the Netherite storage backend with Durable Functions will end 31 March 2028. It is recommended that you start evaluating the Durable Task Scheduler for workloads that you're currently using Netherite for. See [end-of-support announcement](https://azure.microsoft.com/updates/?id=489009). 

| Storage provider | Azure Storage | Netherite | MSSQL | DTS| 
|- |-              |-          |-      |- |
| Official support status | ✅ Generally available (GA) | ✅ Generally available (GA) | ✅ Generally available (GA) | Public preview|
| External dependencies | Azure Storage account (general purpose v1) | Azure Event Hubs<br/>Azure Storage account (general purpose) | [SQL Server 2019](https://www.microsoft.com/sql-server/sql-server-2019) or Azure SQL Database | N/A | 
| Local development and emulation options | [Azurite v3.12+](../../storage/common/storage-use-azurite.md) (cross platform) | Supports in-memory emulation of task hubs ([more information](https://microsoft.github.io/durabletask-netherite/#/emulation)) | SQL Server Developer Edition (supports [Windows](/sql/database-engine/install-windows/install-sql-server), [Linux](/sql/linux/sql-server-linux-setup), and [Docker containers](/sql/linux/sql-server-linux-docker-container-deployment)) | [Durable task scheduler emulator](./durable-task-scheduler/durable-task-scheduler.md#emulator-for-local-development) | 
| Task hub configuration | Explicit | Explicit | Implicit by default ([more information](https://microsoft.github.io/durabletask-mssql/#/taskhubs)) | Explicit | 
| Maximum throughput | Moderate | Very high | Moderate | Very high | 
| Maximum orchestration/entity scale-out (nodes) | 16 | 32 | N/A | N/A | 
| Maximum activity scale-out (nodes) | N/A | 32 | N/A | N/A | 
| Durable Entities support | ✅ Fully supported | ✅ Fully supported | ⚠️ Supported except when using .NET Isolated | ✅ Fully supported |
| [KEDA 2.0](https://keda.sh/) scaling support<br/>([more information](../functions-kubernetes-keda.md)) | ❌ Not supported | ❌ Not supported | ✅ Supported using the [MSSQL scaler](https://keda.sh/docs/scalers/mssql/) ([more information](https://microsoft.github.io/durabletask-mssql/#/scaling)) | Coming soon! | 
| Support for [extension bundles](../extension-bundles.md) (recommended for non-.NET apps) | ✅ Fully supported | ✅ Fully supported | ✅ Fully supported |  Coming soon! | 
| Price-performance configurable? | ❌ No | ✅ Yes (Event Hubs TUs and CUs) | ✅ Yes (SQL vCPUs) | Coming soon! | 
| Disconnected environment support | ❌ Azure connectivity required | ❌ Azure connectivity required | ✅ Fully supported | ❌ Azure connectivity required |
| Identity-based connections | ✅ Fully supported |❌ Not supported | ⚠️ Requires runtime-driven scaling |  ✅ Fully supported |
| [Flex Consumption plan](../flex-consumption-plan.md) | ✅ Fully supported ([see notes](./durable-functions-azure-storage-provider.md#flex-consumption-plan)) |❌ Not supported | ✅ Fully supported | ❌ Not supported |

## Next steps

> [!div class="nextstepaction"]
> [Learn about Durable Functions performance and scale](durable-functions-perf-and-scale.md)
