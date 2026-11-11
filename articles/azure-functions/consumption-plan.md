---
title: Azure Functions Consumption plan hosting (legacy)
description: Learn about Azure Functions Consumption plan hosting, a legacy serverless hosting option. We recommend the Flex Consumption plan for new serverless function apps.
ms.date: 11/10/2026
ms.topic: concept-article
ms.custom:
  - build-2024
# Customer intent: As a developer, I want to understand the Consumption plan and how to migrate to the Flex Consumption plan.
---

# Azure Functions Consumption plan hosting (legacy)

[!INCLUDE [functions-linux-consumption-retirement](../../includes/functions-linux-consumption-retirement.md)]

When you use the Consumption plan, the Azure Functions host dynamically adds and removes instances based on the number of incoming events. 

The Consumption plan automatically scales, even during periods of high load. When you run functions in a Consumption plan, you pay for compute resources only when your functions are running. On a Consumption plan, a function execution times out after a configurable period of time. The Consumption plan is currently the only serverless hosting option that supports Windows.

## Read-only application directory on Linux Consumption

On the Linux Consumption plan, the `/home/site/wwwroot` directory and its subdirectories are read-only.

- Apps can continue to **read** deployed files from this directory and its subdirectories.
- Apps **can't create, modify, or delete files, or change file permissions**, in these locations.
- Apps that attempt these operations might experience startup or execution errors. This condition includes application code and libraries that write generated output, caches, logs, or downloaded dependencies to these locations.

> [!NOTE]
> Temporary storage is instance-local. Don't rely on temporary files persisting across app restarts or being shared between instances. Use [Azure Storage](../storage/common/storage-introduction.md) for persistent or shared data.

### Required action

If your app performs file operations, follow these steps to ensure it doesn't write to `/home/site/wwwroot` or its subdirectories.

1. **Review file operations.** Check your application code, libraries, and configuration for operations that create, modify, or delete files, or change file permissions, under `/home/site/wwwroot`. Check relative paths because they might resolve to the application directory.
1. **Redirect temporary writes.** Configure your application and its libraries to use a writable temporary directory, such as `/tmp`, for temporary files, generated output, caches, and temporary logs. Use the configuration options supported by each library; there isn't a single setting that redirects every file operation.
1. **Update application settings where applicable.** In the Azure portal, open your function app, then select **Settings** > **Environment variables** > **App settings**. Update any application-specific settings that control writable paths. See [Manage your function app](functions-how-to-use-azure-function-app-settings.md#settings). Changing app settings restarts the app, so plan accordingly.
1. **Move persistent or shared files to durable storage.** Use Azure Storage for files that must persist across restarts or be shared between instances.
1. **Deploy and validate your changes.** Test application startup and representative function executions in Azure, including file operations in the configured writable locations. Review startup and execution errors by using [Application Insights monitoring](functions-monitoring.md). Successful local testing alone doesn't verify the deployed file system behavior.

> [!IMPORTANT]
> The Linux Consumption plan retires on September 30, 2028. Migrate to the Flex Consumption plan to continue receiving new features. See [Migrate Consumption plan apps to Flex Consumption in Azure Functions](migration/migrate-plan-consumption-to-flex.md).
>
> Flex Consumption apps also [run from a read-only deployment package](deployment-zip-push.md?pivots=flex-consumption-plan#run-functions-from-the-deployment-package). Migration doesn't make `/home/site/wwwroot` writable, so these file operation changes also apply when preparing your app for migration.

## Billing

Billing is based on the number of executions, execution time, and memory used. The system aggregates usage across all functions within a function app. For more information, see [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/).

To learn more about how to estimate costs when running in a Consumption plan, see [Understanding Consumption plan costs](functions-consumption-costs.md).

## Multiple apps in the same plan

The general recommendation is for each function app to have its own Consumption plan. However, if needed, you can assign function apps in the same region to the same Consumption plan. Keep in mind that there's a [limit to the number of function apps that can run in a Consumption plan](functions-scale.md#service-limits). Function apps in the same plan still scale independently of each other.

## Migrate to Flex Consumption

If you have existing function apps running on the Consumption plan, migrate them to the Flex Consumption plan. The Flex Consumption plan provides faster scaling, reduced cold starts, virtual network integration, and configurable instance sizes. Because the Flex Consumption plan is Linux-only, Windows Consumption plan apps must also migrate to Linux as part of this process. For step-by-step instructions, including Windows-specific guidance, see [Migrate Consumption plan apps to the Flex Consumption plan](migration/migrate-plan-consumption-to-flex.md).

## Next steps

- [Migrate Consumption plan apps to the Flex Consumption plan](migration/migrate-plan-consumption-to-flex.md)
- [Azure Functions hosting options](functions-scale.md)
- [Event-driven scaling in Azure Functions](event-driven-scaling.md)
