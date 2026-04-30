---
title: "Upgrade the Durable Functions Extension Version"
description: "Learn why upgrading to the latest Durable Functions extension version improves performance and fixes bugs. Follow step-by-step instructions to upgrade your extension today."
author: lilyjma
ms.topic: how-to
ms.service: azure-functions
ms.custom: devx-track-dotnet
ms.date: 02/15/2023
ms.author: azfuncdf
---

# Upgrade the Durable Functions extension version

If you're experiencing orchestration failures, slow replay, or unexpected behavior, upgrading the Durable Functions extension is the recommended first step. New releases often contain critical bug fixes and performance improvements. To get notified of new releases, [watch releases](https://github.com/Azure/azure-functions-durable-extension) on GitHub.

Choose the upgrade method that matches your app type:

| App type | Upgrade method |
| --- | --- |
| .NET (in-process or isolated) | [Reference the latest NuGet packages](#reference-the-latest-nuget-packages-for-net-apps) |
| Non-.NET (JavaScript, Python, Java, PowerShell) | [Upgrade the extension bundle](#upgrade-the-extension-bundle) |
| Advanced / time-sensitive fix needed | [Manually upgrade the extension](#manually-upgrade-the-durable-functions-extension-version) |

## Reference the latest NuGet packages for .NET apps

Update the Durable Functions NuGet package reference in your project. The correct package depends on your hosting model and [storage provider](../../durable-task/common/durable-task-storage-providers.md):

| Storage provider | In-process worker | Isolated worker |
| --- | --- | --- |
| Azure Storage (default) | [Microsoft.Azure.WebJobs.Extensions.DurableTask](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask) | [Microsoft.Azure.Functions.Worker.Extensions.DurableTask](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask) |
| Netherite | [Microsoft.Azure.DurableTask.Netherite.AzureFunctions](https://www.nuget.org/packages/Microsoft.Azure.DurableTask.Netherite.AzureFunctions) | [Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Netherite](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.Netherite) |
| MSSQL | [Microsoft.DurableTask.SqlServer.AzureFunctions](https://www.nuget.org/packages/Microsoft.DurableTask.SqlServer.AzureFunctions) | [Microsoft.Azure.Functions.Worker.Extensions.DurableTask.SqlServer](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.SqlServer) |

For example, to upgrade the default Azure Storage extension in an isolated worker app:

```console
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.DurableTask
```

## Upgrade the extension bundle

Non-.NET apps (JavaScript, Python, Java, PowerShell) use [extension bundles](../extension-bundles.md) to access triggers and bindings, including the Durable Functions extension. Verify that the `extensionBundle` version range in your `host.json` includes the [latest bundle release](https://github.com/Azure/azure-functions-extension-bundles/releases):

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  }
}
```

Update the version range if needed, then redeploy your app.

## Manually upgrade the Durable Functions extension version

If upgrading the extension bundle didn't resolve your issue and a newer Durable Functions extension release contains a fix you need, you can manually install a specific extension version.

> [!CAUTION]
> Manually managing extensions means you lose automatic updates from extension bundles and may encounter compatibility issues between extensions. Use this approach only for time-sensitive fixes.

1. Remove the `extensionBundle` section from your `host.json` file.

1. Install the [.NET CLI](https://dotnet.microsoft.com/download) if you don't already have it.

1. Install extensions. To install all extensions supported by extension bundles, run:

   ```console
   func extensions install
   ```

   To install only the Durable Functions extension at a specific version, run:

   ```console
   func extensions install -p Microsoft.Azure.WebJobs.Extensions.DurableTask -v <version>
   ```

   Replace `<version>` with the target version from the [releases page](https://github.com/Azure/azure-functions-durable-extension/releases).

## Next steps

- [Durable Functions extension release history](https://github.com/Azure/azure-functions-durable-extension/releases)
- [Diagnostics and monitoring](durable-functions-diagnostics.md)
- [Troubleshooting guide](../../durable-task/sdks/durable-task-sdk-troubleshooting.md)
