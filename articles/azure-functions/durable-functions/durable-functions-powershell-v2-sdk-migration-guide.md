---
title: "Standalone Durable Functions PowerShell SDK: Setup and Migration Guide"
description: "Learn how to install and migrate to the standalone Durable Functions PowerShell SDK for faster, more reliable orchestrations. Get started with this step-by-step guide."
author: davidmrdavid
ms.author: hannahhunter
ms.topic: feature-guide
ms.service: azure-functions
ms.date: 04/10/2023
ms.reviewer: azfuncdf
---

# Guide to the standalone Durable Functions PowerShell SDK

The standalone Durable Functions PowerShell SDK ([`AzureFunctions.PowerShell.Durable.SDK`](https://www.powershellgallery.com/packages/AzureFunctions.PowerShell.Durable.SDK)) is the recommended approach for authoring Durable Functions apps with PowerShell. It replaces the built-in SDK with faster replay logic (the same engine as the C# isolated SDK), independent versioning, and improved exception handling, null-value handling, and serialization. The built-in SDK remains available for PowerShell 7.4 and earlier but will be removed in a future major release of the PowerShell worker.

## Migration checklist

Use the following checklist to track your progress through each migration step:

| Step | Section |
| --- | --- |
| 1. Verify prerequisites | [Prerequisites](#verify-prerequisites) |
| 2. Enable the standalone SDK | [Enable the standalone SDK](#enable-the-standalone-sdk) |
| 3. Install the SDK package | [Install the SDK package](#install-the-sdk-package) |
| 4. Import the SDK | [Import the SDK](#import-the-sdk) |
| 5. Run your app | [Run your app](#run-your-app) |
| 6. Review interface and behavioral changes | [Migrate from the built-in SDK](#migrate-from-the-built-in-sdk) |

## Install the standalone SDK

Follow these steps to install and enable the standalone SDK in your existing app.

### Verify prerequisites

The standalone PowerShell SDK requires the following minimum versions:

- [Azure Functions Runtime](../functions-versions.md) v4.16+
- [Azure Functions Core Tools](../functions-run-local.md) v4.0.5095+ (if running locally)
- Azure Functions PowerShell app for PowerShell 7.4 or greater

### Enable the standalone SDK

The following application setting is required to run the standalone PowerShell SDK: 
- Name: `ExternalDurablePowerShellSDK`
- Value: `"true"`

This application setting disables the built-in Durable SDK for PowerShell versions 7.4 and above, forcing the worker to use the external SDK.

If you're running locally using [Azure Functions Core Tools](../functions-run-local.md), you should add this setting to your `local.settings.json` file. If you're running in Azure, follow these steps with the tool of your choice:

# [Azure CLI](#tab/azure-cli-set-indexing-flag)

Replace `<FUNCTION_APP_NAME>` and `<RESOURCE_GROUP_NAME>` with the name of your function app and resource group, respectively.

```azurecli 
az functionapp config appsettings set --name <FUNCTION_APP_NAME> --resource-group <RESOURCE_GROUP_NAME> --settings ExternalDurablePowerShellSDK="true"
```

# [Azure PowerShell](#tab/azure-powershell-set-indexing-flag)

Replace `<FUNCTION_APP_NAME>` and `<RESOURCE_GROUP_NAME>` with the name of your function app and resource group, respectively.

```azurepowershell
Update-AzFunctionAppSetting -Name <FUNCTION_APP_NAME> -ResourceGroupName <RESOURCE_GROUP_NAME> -AppSetting @{"ExternalDurablePowerShellSDK" = "'true'"}
```

# [VS Code](#tab/vs-code-set-indexing-flag)

1. Make sure you have the [Azure Functions extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) installed
1. Press <kbd>F1</kbd> to open the command palette. In the command palette, search for and select `Azure Functions: Add New Setting...`.
1. Choose your subscription and function app when prompted
2. For the name, type `ExternalDurablePowerShellSDK` and press <kbd>Enter</kbd>. 
3. For the value, type `"true"` and press <kbd>Enter</kbd>.
---

### Install the SDK package

You have two options for installing the SDK package. Use [managed dependencies](./../functions-reference-powershell.md#managed-dependencies-feature) (recommended for most apps) or [bundle the module with your app content](./../functions-reference-powershell.md#including-modules-in-app-content) if you need to pin a specific version or your deployment doesn't support managed dependencies. Only one option is needed.

#### Option 1: Use managed dependencies (recommended)

To install the SDK as a managed dependency, follow the [managed dependencies guidance](./../functions-reference-powershell.md#dependency-management).
First, ensure your `host.json` contains a `managedDependency` section with `enabled` set to `true`:

```JSON
{
  "version": "2.0",
  "managedDependency": {
    "enabled": true
  },
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[3.*, 4.0.0)"
  }
}
```

Then specify an entry for the SDK in your `requirements.psd1` file:

```PowerShell
# This file enables modules to be automatically managed by the Functions service.
# See https://aka.ms/functionsmanageddependency for additional information.
#
@{
    # For latest supported version, go to 'https://www.powershellgallery.com/packages/AzureFunctions.PowerShell.Durable.SDK/'.
    'AzureFunctions.PowerShell.Durable.SDK' = '2.*'
}
```

#### Option 2: Include the SDK module in your app content

To bundle the SDK with your app, place the SDK package inside a `".\Modules"` directory at the root of your app. For more information, see [Including modules in app content](./../functions-reference-powershell.md#including-modules-in-app-content).

From your application root, create the directory and download the SDK:

```powershell
Save-Module -Name AzureFunctions.PowerShell.Durable.SDK -AllowPrerelease -Path ".\Modules"
```

### Import the SDK

Add the following line to your `profile.ps1` file to import the SDK on every cold start:

```powershell
Import-Module AzureFunctions.PowerShell.Durable.SDK -ErrorAction Stop
```

### Run your app

Start your app with `func host start`. The standalone SDK is now active.

## Migrate from the built-in SDK

If you're migrating an existing app from the built-in SDK, review the following interface and behavioral changes.

### New cmdlets

| Cmdlet | Description |
| --- | --- |
| `Invoke-DurableSubOrchestrator` | Call sub-orchestrators from within an orchestrator workflow. |
| `Suspend-DurableOrchestration` | Suspend a running orchestration instance. |
| `Resume-DurableOrchestration` | Resume a previously suspended orchestration instance. |

### Modified cmdlets

| Change | Details |
| --- | --- |
| `Get-DurableTaskResult` | Now accepts a single `Task` as its argument instead of a list of tasks. |
| `New-DurableRetryOptions` → `New-DurableRetryPolicy` | Renamed. An alias for the old name is provided for backward compatibility. |

### Behavioral changes

#### Exception handling in `Wait-DurableTask`

Exceptions thrown by activities scheduled with `Wait-DurableTask` (fan-out/fan-in pattern) are no longer silently ignored. The cmdlet now propagates the exception to the orchestrator so you can handle it in your code.

**Built-in SDK** — exceptions were silently swallowed:

```powershell
# Exceptions from failed activities were lost
$tasks = @()
$tasks += Invoke-DurableActivity -FunctionName "RiskyActivity" -Input "item1" -NoWait
$tasks += Invoke-DurableActivity -FunctionName "RiskyActivity" -Input "item2" -NoWait
$results = Wait-DurableTask -Task $tasks
# No error even if an activity failed
```

**Standalone SDK** — exceptions propagate to the orchestrator:

```powershell
try {
    $tasks = @()
    $tasks += Invoke-DurableActivity -FunctionName "RiskyActivity" -Input "item1" -NoWait
    $tasks += Invoke-DurableActivity -FunctionName "RiskyActivity" -Input "item2" -NoWait
    $results = Wait-DurableTask -Task $tasks
} catch {
    # Handle the activity failure
    Write-Host "An activity failed: $_"
}
```

#### Null values preserved in `Wait-DurableTask` results

Null values are no longer dropped from the result list of a `Wait-DurableTask` (WhenAll) invocation. A successful call without the `-Any` flag now returns an array of the same size as the number of tasks scheduled, including `$null` entries for activities that returned null.

**Built-in SDK** — null results were dropped:

```powershell
# 3 tasks scheduled, but if one returned $null, results had only 2 items
$results = Wait-DurableTask -Task $tasks
$results.Count  # Could be 2 instead of 3
```

**Standalone SDK** — null results are preserved:

```powershell
# 3 tasks scheduled, results always has 3 items
$results = Wait-DurableTask -Task $tasks
$results.Count  # Always 3, with $null for activities that returned null
```

## SDK reference

For the complete cmdlet reference, see [AzureFunctions.PowerShell.Durable.SDK Module](https://github.com/Azure/azure-functions-durable-powershell/blob/main/src/Help/AzureFunctions.PowerShell.Durable.SDK.md). After importing the module, you can also run `Get-Help *-Durable*` to list all available cmdlets, or `Get-Help <cmdlet-name> -Full` for detailed usage.

## Get support

Report bugs and feature requests in the SDK's [GitHub repo](https://github.com/Azure/azure-functions-durable-powershell).

## Next steps

- [Create a Durable Functions app with PowerShell](quickstart-powershell-vscode.md)
- [Durable Functions patterns and concepts](durable-functions-overview.md)
- [PowerShell developer reference for Azure Functions](../functions-reference-powershell.md)