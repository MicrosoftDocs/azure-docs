---
title: Manage orchestration data using storage providers
titleSuffix: Durable Task
description: Learn about and compare the different storage providers for Durable Functions and the Durable Task SDKs
author: cgillum
ms.topic: conceptual
ms.date: 02/05/2026
ms.author: azfuncdf
zone_pivot_groups: azure-durable-approach
#Customer intent: As a developer, I want to understand what storage providers are available in Durable Functions and the Durable Task SDKs and which one I should choose.
---

# Manage orchestration data using storage providers

When you build workflows with Durable Functions or the Durable Task SDKs, your orchestrations need somewhere to store their state. Storage providers handle this by persisting orchestration history, entity state, and internal messages to a backend of your choice. This durable storage is what makes your workflows reliable—they can pause, scale, restart, and recover without losing progress.

::: zone pivot="durable-functions"

Durable Functions support various backend storage providers. You can configure your apps to use the two types of storage providers available to Durable Task:

- Azure managed:
  - Durable Task Scheduler (recommended)
- "Bring your own" (BYO) storage:
  - Azure Storage
  - Netherite
  - Microsoft SQL Server (MSSQL)

> [!NOTE]
> Currently, you aren't able to migrate data from one storage backend provider to another. If you want to use a new provider, create a new app configured with the new provider.

::: zone-end

::: zone pivot="durable-task-sdks"

The Durable Task SDKs support the Azure managed [Durable Task Scheduler](./durable-task-scheduler/durable-task-scheduler.md) as a storage provider. 

::: zone-end

## <a name="dts"></a>Durable Task Scheduler

The Durable Task Scheduler is a fully managed, high performance backend provider designed and developed in collaboration with [Microsoft Research](https://www.microsoft.com/research). It aims to provide the best user experience in aspects such as management, observability, performance, and security. 

The key benefits of the Durable Task Scheduler include:

- Lower management and operation overhead compared to BYO backend providers
- Observability and management [dashboard](./durable-task-scheduler/durable-task-scheduler-dashboard.md). 
- Supports the highest throughput of all backends today.
- Support for authentication using managed identity.

Existing Durable Functions and Durable Task SDK users can leverage the scheduler with no code changes. Learn more about the [Durable Task Scheduler](./durable-task-scheduler/durable-task-scheduler.md), and [how to get started](./durable-task-scheduler/quickstart-durable-task-scheduler.md). 

Samples for Durable Task Scheduler can be found on [GitHub](https://github.com/Azure-Samples/Durable-Task-Scheduler/).

::: zone pivot="durable-functions"

## Azure Storage

Azure Storage is one of the "bring your own" storage providers for Durable Functions. It uses queues, tables, and blobs to persist orchestration and entity state, and blob leases to manage partitions. The Azure Storage provider is built into the Durable Functions extension and doesn't have any other dependencies.

The key benefits of the Azure Storage provider include:

- No setup required - you can use the storage account that was created for you by the function app setup experience.
- Lowest-cost serverless billing model - Azure Storage has a consumption-based pricing model based entirely on usage ([more information](durable-functions-billing.md#azure-storage-transactions)).
- Best tooling support - Azure Storage offers cross-platform local emulation and integrates with Visual Studio, Visual Studio Code, and the Azure Functions Core Tools.
- Most mature - Azure Storage was the original and most battle-tested storage backend for Durable Functions.
- Support for using identity instead of secrets for connecting to the storage provider.

The Azure Storage provider doesn't require any explicit configuration, NuGet package references, or extension bundle references. For detailed configuration options, including connections, identity-based authentication, and host.json settings, see [Azure Storage provider for Durable Functions](durable-functions-azure-storage-provider.md).

## <a name="mssql"></a>Microsoft SQL Server (MSSQL)

The MSSQL storage provider persists all state into an MSSQL database. It's compatible with both on-premises and cloud-hosted deployments of SQL Server, including [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview).

The key benefits of the MSSQL storage provider include:

- Disconnected environments are supported; no Azure connectivity is required when using a SQL Server installation.
- Portable across multiple environments and clouds, including Azure-hosted and on-premises.
- Strong data consistency, enabling backup/restore and failover without data loss.
- Native support for custom data encryption (a feature of SQL Server).
- Integrates with existing database applications via built-in stored procedures.

Learn more about the MSSQL storage provider:
- The [MSSQL provider documentation](https://microsoft.github.io/durabletask-mssql). 
- The [source code for the MSSQL storage provider](https://github.com/microsoft/durabletask-mssql).

## Netherite 

> [!NOTE]
> [Support for using the Netherite storage backend with Durable Functions ends March 31, 2028.](https://azure.microsoft.com/updates/?id=489009) We recommend evaluating the [Durable Task Scheduler](./durable-task-scheduler/durable-task-scheduler.md) for workloads currently using Netherite. 

The Netherite storage backend was designed and developed by [Microsoft Research](https://www.microsoft.com/research). It uses [Azure Event Hubs](../../event-hubs/event-hubs-about.md) and the [FASTER](https://www.microsoft.com/research/project/faster/) database technology on top of [Azure Page Blobs](../../storage/blobs/storage-blob-pageblob-overview.md). 

The key benefits of the Netherite storage provider include:

- Higher throughput at lower cost compared to other storage providers.
- Supports price-performance optimization, allowing you to scale-up performance as-needed.
- Supports up to 32 data partitions with Event Hubs Basic and Standard SKUs.
- More cost-effective than other providers for high-throughput workloads.

Learn more about the Netherite storage provider:
- The [Netherite documentation](https://microsoft.github.io/durabletask-netherite). 
- The [source code for the Netherite storage provider](https://github.com/microsoft/durabletask-netherite). 
- A more in-depth evaluation of the Netherite storage provider: [Serverless Workflows with Durable Functions and Netherite](https://arxiv.org/abs/2103.00033).

## Comparing storage providers

You can use the following table to understand the significant tradeoffs between the various supported storage providers and decide which storage provider is best for your needs.

| Feature | Durable Task Scheduler | Azure Storage | MSSQL | Netherite | 
| ------- | ---------------------- | ------------- | ----- | --------- |
| Official support status | ✅ Generally available (GA) | ✅ Generally available (GA) | ✅ Generally available (GA) | ✅ Generally available (GA) |
| External dependencies | N/A | Azure Storage account (general purpose v1) | [SQL Server 2019](https://www.microsoft.com/sql-server/sql-server-2019) or Azure SQL Database | Azure Event Hubs<br/>Azure Storage account (general purpose) | 
| Local development and emulation options | [Durable Task Scheduler emulator](./durable-task-scheduler/durable-task-scheduler.md#emulator-for-local-development) | [Azurite v3.12+](../../storage/common/storage-use-azurite.md) (cross platform) | SQL Server Developer Edition (supports [Windows](/sql/database-engine/install-windows/install-sql-server), [Linux](/sql/linux/sql-server-linux-setup), and [Docker containers](/sql/linux/sql-server-linux-docker-container-deployment)) | Supports in-memory emulation of task hubs ([more information](https://microsoft.github.io/durabletask-netherite/#/emulation)) | 
| Task hub configuration | Explicit | Explicit | Implicit by default ([more information](https://microsoft.github.io/durabletask-mssql/#/taskhubs)) | Explicit | 
| Maximum throughput | Very high | Moderate | Moderate | Very high | 
| Maximum orchestration/entity scale-out (nodes) | N/A | 16 | N/A | 32 | 
| Maximum activity scale-out (nodes) | N/A | N/A | N/A | 32 | 
| Durable Entities support | ✅ Fully supported | ✅ Fully supported | ⚠️ Supported except when using .NET Isolated | ✅ Fully supported |
| [KEDA 2.0](https://keda.sh/) scaling support<br/>([more information](../functions-kubernetes-keda.md)) | Coming soon! | ❌ Not supported | ✅ Supported using the [MSSQL scaler](https://keda.sh/docs/scalers/mssql/) ([more information](https://microsoft.github.io/durabletask-mssql/#/scaling)) | ❌ Not supported | 
| Support for [extension bundles](../extension-bundles.md) (recommended for non-.NET apps) | Coming soon! | ✅ Fully supported | ✅ Fully supported | ✅ Fully supported | 
| Price-performance configurable? | Coming soon! | ❌ No | ✅ Yes (SQL vCPUs) | ✅ Yes (Event Hubs TUs and CUs) | 
| Disconnected environment support | ❌ Azure connectivity required | ❌ Azure connectivity required | ✅ Fully supported | ❌ Azure connectivity required |
| Identity-based connections | ✅ Fully supported | ✅ Fully supported | ⚠️ Requires runtime-driven scaling | ❌ Not supported |
| [Flex Consumption plan](../flex-consumption-plan.md) | ❌ Not supported | ✅ Fully supported ([see notes](./durable-functions-azure-storage-provider.md#flex-consumption-plan)) | ✅ Fully supported | ❌ Not supported |

::: zone-end

## Next steps

::: zone pivot="durable-functions"

> [!div class="nextstepaction"]
> [Durable Functions performance and scale](durable-functions-perf-and-scale.md)

::: zone-end

::: zone pivot="durable-task-sdks"

> [!div class="nextstepaction"]
> [Durable Task Scheduler throughput benchmarks](./durable-task-scheduler/durable-task-scheduler-work-item-throughput.md)

::: zone-end