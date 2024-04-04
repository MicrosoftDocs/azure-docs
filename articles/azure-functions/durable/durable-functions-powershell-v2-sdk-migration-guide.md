---
title: Guide to the standalone Durable Functions PowerShell SDK
description: Learn about the standalone Durable Functions PowerShell SDK, and how to upgrade to it
author: davidmrdavid
ms.topic: conceptual
ms.date: 04/10/2023
ms.reviewer: azfuncdf
---

# Guide to the standalone Durable Functions PowerShell SDK

The Durable Functions (DF) PowerShell SDK is now available, _in preview_, as a standalone package in the PowerShell Gallery: [`AzureFunctions.PowerShell.Durable.SDK`](https://www.powershellgallery.com/packages/AzureFunctions.PowerShell.Durable.SDK).
Once this SDK package is GA, it will be the recommended means of authoring Durable Functions apps with PowerShell. In this article, we explain the benefits of this change, and what changes you can expect when adopting this new package.

> [!NOTE]
> This package is currently in **preview.**

## Motivation behind the standalone SDK

The previous DF SDK was built into the PowerShell language worker. This approach came with the benefit that Durable Functions apps could be authored out of the box for Azure Functions PowerShell users.
However, it also came with various shortcomings:
- New features, bug fixes, and other changes were dependent on the PowerShell worker's release cadence.
- Due to the auto-upgrading nature of the PowerShell worker, the DF SDK needed to be conservative about fixing bugs as any behavior changes could constitute a breaking change.
- The replay algorithm utilized by the built-in DF SDK was outdated: other DF SDKs already utilized a faster and more reliable implementation.

By creating a standalone DF PowerShell SDK package, we're able to overcome these shortcomings. These are the benefits of utilizing this new standalone SDK package:
- This SDK includes many highly requested improvements such as better exception and null-value handling, and serialization fixes.
- The package is versioned independently of the PowerShell worker. This allows users to incorporate new features and fixes as soon as they're available, while also avoiding breaking changes from automatic upgrades.
- The replay logic is faster, and more reliable: it uses the same replay engine as the DF isolated SDK for C#.

## Deprecation plan for the built-in DF PowerShell SDK

The built-in DF SDK in the PowerShell worker will remain available for PowerShell 7.4, 7.2, and prior releases.

We plan to eventually release a new **major** version of the PowerShell worker without the built-in SDK. At that point, users would need to install the SDK separately using this standalone package; the installation steps are described below.

## Install and enable the SDK

See this section to learn how to install and enable new standalone SDK in your existing app.

### Prerequisites

The standalone PowerShell SDK requires the following minimum versions:

- [Azure Functions Runtime](../functions-versions.md) v4.16+
- [Azure Functions Core Tools](../functions-run-local.md) v4.0.5095+ (if running locally)
- Azure Functions PowerShell app for PowerShell 7.2 or greater


### Opt in to the standalone DF SDK

The following application setting is required to run the standalone PowerShell SDK: 
- Name: `ExternalDurablePowerShellSDK`
- Value: `"true"`

This application setting will disable the built-in Durable SDK for PowerShell versions 7.2 and above, forcing the worker to use the external SDK. 

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

### Install and import the SDK

You have two options for installing the SDK package: it can be installed as a [managed dependency](./../functions-reference-powershell.md#dependency-management), or as a [custom module](./../functions-reference-powershell.md#custom-modules).
In this section, we describe both options, but only one of them is needed.

#### Installation option 1: Use managed dependencies

To install the SDK as a managed dependency, you'll need to follow the [managed dependencies guidance](./../functions-reference-powershell.md#dependency-management). Please review the guidance for details.
In summary, you first need to ensure your `host.json` contains a `managedDependency` section with an `enabled` property set to `true`. Below is an example `host.json` that satisfies this requirement:

```JSON
{
  "version": "2.0",
  "managedDependency": {
    "enabled": true
  },
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[3.*, 4.0.0)"
  },
}
```

Then you simply need to specify an entry for the DF SDK in your `requirements.psd1` file, as in the example below:

```PowerShell
# This file enables modules to be automatically managed by the Functions service.
# See https://aka.ms/functionsmanageddependency for additional information.
#
@{
    # For latest supported version, go to 'https://www.powershellgallery.com/packages/AzureFunctions.PowerShell.Durable.SDK/'.
    'AzureFunctions.PowerShell.Durable.SDK' = '1.*'
}
```

#### Installation option 2: Use custom modules

To install the standalone DF SDK as a custom module, you need to follow the [guidance regarding creating an app-level modules folder](./../functions-reference-powershell.md#function-app-level-modules-folder). Make sure to review the aforementioned docs for details.
In summary, you'll need to place the SDK package inside a `".\Modules"` directory located at the root of your app.

For example, from within your application's root, and after creating a `".\Modules"` directory, you may download the standalone SDK into the modules directory as such:

```powershell
Save-Module -Name AzureFunctions.PowerShell.Durable.SDK -AllowPrerelease -Path ".\Modules"
```

#### Importing the SDK

The final step is importing the SDK into your code's session. To do this, import the PowerShell SDK via `Import-Module AzureFunctions.PowerShell.Durable.SDK -ErrorAction Stop` in your `profile.ps1` file.
For example, if your app was scaffolded through templates, your `profile.ps1` file may end up looking as such:

```powershell
# Azure Functions profile.ps1
#
# This profile.ps1 will get executed every "cold start" of your Function App.
# "cold start" occurs when:
#
# * A Function App starts up for the very first time
# * A Function App starts up after being de-allocated due to inactivity
#
# You can define helper functions, run commands, or specify environment variables
# NOTE: any variables defined that are not environment variables will get reset after the first execution

# Authenticate with Azure PowerShell using MSI.
# Remove this if you are not planning on using MSI or Azure PowerShell.
if ($env:MSI_SECRET) {
    Disable-AzContextAutosave -Scope Process | Out-Null
    Connect-AzAccount -Identity
}

# Uncomment the next line to enable legacy AzureRm alias in Azure PowerShell.
# Enable-AzureRmAlias

# You can also define functions or aliases that can be referenced in any of your PowerShell functions.

# Import standalone PowerShell SDK
Import-Module AzureFunctions.PowerShell.Durable.SDK -ErrorAction Stop
```

These are all the steps needed to utilize the next PowerShell SDK. Run your app as normal, via `func host start` in your terminal to start using the SDK.

### Migration guide

In this section, we describe the interface and behavioral changes you can expect when utilizing the new SDK.

#### New CmdLets

* `Invoke-DurableSubOrchestrator -FunctionName <Name> -Input <Input>` is a new CmdLet that allows users to utilize suborchestrators in their workflows.

#### Modified CmdLets

* The CmdLet `Get-DurableTaskResult -Task <task>` now only accepts a single Task as it's argument, instead of accepting a list of Tasks.

#### Behavioral changes

* Exceptions thrown by activities scheduled with `Wait-DurableTask` (as in the Fan-Out/Fan-In pattern) are no longer silently ignored. Instead, on an exception, the CmdLet propagates that exception to the orchestrator so that it may be handled by user-code.
* Null values are no longer dropped from the result list of a `Wait-DurableTask` (i.e., WhenAll) invocation. This means that a successful invocation of `Wait-DurableTask` without the `-Any` flag should return an array of the same size as the number of tasks it scheduled.

#### Where to get support, provide feedback, and suggest changes

During the preview phase of this release, the standalone SDK may introduce a few more changes. These changes can be influenced by the community so report any feedback and suggestions to the SDK's [_new GitHub repo_](https://github.com/Azure/azure-functions-durable-powershell).