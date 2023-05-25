---
title: Guide to the standalone Durable Functions PowerShell SDK
description: Learn about the standalone Durable Functions PowerShell SDK, and how to upgrade to it
author: davidmrdavid
ms.topic: conceptual
ms.date: 04/10/2023
ms.reviewer: azfuncdf
---

# Guide to the standalone Durable Functions PowerShell SDK

The Durable Functions (DF) PowerShell SDK is now available as a standalone package in the PowerShell Gallery: [`AzureFunctions.PowerShell.Durable.SDK`](https://www.powershellgallery.com/packages/AzureFunctions.PowerShell.Durable.SDK).
Moving forward, this package will be the recommended means of developing Durable Functions SDK. In this article, we explain the benefits of this change, and what changes you can expect when adopting this new package.

## Motivation behind the standalone SDK

The previous DF SDK was built in to the PowerShell language worker. This approach came with the benefit that Durable Functions apps could be authored out of the box from any Azure Functions PowerShell app.
However, it also came with various shortcomings:
1. New features, bug fixes, and other changes were dependent on the PowerShell worker's release cadence.
2. By the auto-upgrading nature of the PowerShell worker, the DF SDK needed to be conservative not to introduce breaking changes, which makes fixing certain bugs difficult.
3. The replay algorithm utilized by the built-in DF SDK was out of date: other DF SDKs already utilized a faster and more reliable implementation.

By creating a standalone DF PowerShell SDK, we're able to overcome these shortcomings at the expense of requiring an extra SDK installation step. See below for the explicit benefits of utilizing new standalone DF SDK:
1. The package is versioned independently of the PowerShell worker. This allows users to incorporate new features and fixes as soon as they're available, while also avoiding breaking changes during an auto-ugprade.
2. This SDK includes many highly requested improvements requested by the community, such as better exception and null-value handling, and serialization improvements.
3. The replay logic is faster, and more reliable: it uses the same replay engine as the DF isolated SDK for C#.

## Deprecation plan for the built-in DF PowerShell SDK

The built-in DF SDK in the PowerShell worker will remain in existing and supported versions of the PowerShell worker. This means that existing apps will be able to continue using the built-in SDK as long as their language workers are supported. 

After the standalone DF PowerShell SDK is GA, new releases of the PowerShell worker supporting _new_ versions of PowerShell won't include the built-in SDK. Users leveraging these future workers will need to incorporate the standalone DF SDK package.

## Install and enable the SDK

See this section to learn how to install and enable new standalone SDK in your existing app.

### Prerequisites

The standalone PowerShell SDK requires the following minimum versions:

- [Azure Functions Runtime](../functions-versions.md) v4.16+
- [Azure Functions Core Tools](../functions-run-local.md) v4.0.5095+ (if running locally)
- Azure Functions PowerShell app for PowerShell 7.2 or greater


### Opt in to the standalone DF SDK

The following application setting is required to run the standalone PowerShell SDK while it is in preview: 
- Name: `ExternalDurablePowerShellSDK`
- Value: `"true"`

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

To install the standalone DF SDK, you'll need to follow the [guidance regarding creating an app-level modules folder](./../functions-reference-powershell.md#function-app-level-modules-folder). Make sure to review the aforementioned docs for details. In summary, you will need to place the SDK package inside a `".\Modules"` directory located at the root of your app.

For example, from within your application's root, and after creating a `".\Modules"` directory, you may download the standalone SDK into the modules directory as such:

```powershell
Save-Module -Name AzureFunctions.PowerShell.Durable.SDK -AllowPrerelease -Path ".\Modules"
```

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

TODO: how to show the entire signature of the suborchestrator CmdLet.

* `Invoke-DurableSubOrchestratorE` is a new CmdLet that allows users to leverage suborchestrators in their workflows.

#### Modified CmdLets

* The CmdLet `Get-DurableTaskResult` now only allows accepts a single Task as it's argument, instead of a list of Tasks. To obtain the results of a successful list of tasks, use `Wait-DurableTask`.

#### Behavioral changes

* Exceptions thrown by activities scheduled through `Wait-DurableTask` (as in the Fan-Out/Fan-In pattern) are no longer ignored. Instead, on an exception, the CmdLet propagates it to the orchestrator so that it may be handled by user-code.
* Null-valued task results in a `Wait-DurableTask` (i.e WhenAll) invocation are no longer dropped. Instead, `Wait-DurableTask`'s result array will include null values in the corresponding to position of the tasks that returned them. This means that a successful invocation of `Wait-DurableTask` without the `-Any` flag should return an array of the same size as the number of tasks it scheduled.

#### Where to get support, providie feedback, and suggest changes

During the preview phase of this release, the standalone SDK may introduce a few more changes. These changes can be influenced by the community so please report any feedback and suggestions to the SDK's [_new GitHub repo_](https://github.com/Azure/azure-functions-durable-powershell).