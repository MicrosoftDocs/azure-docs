---
title: Create function app resources in Azure using PowerShell
description: Azure PowerShell scripts that show you how to create the Azure resources required to host your functions code in Azure.
ms.topic: sample
ms.custom: devx-track-azurepowershell, devx-track-python
ms.date: 05/02/2023
---
# Create function app resources in Azure using PowerShell

The Azure PowerShell example scripts in this article create function apps and other resources required to host your functions in Azure. A function app provides an execution context in which your functions are executed. All functions running in a function app share the same resources and connections, and they're all scaled together. 

After the resources are created, you can deploy your project files to the new function app. To learn more, see [Deployment methods](functions-deployment-technologies.md#deployment-methods).

Every function app requires your PowerShell scripts to create the following resources:

| Resource | cmdlet | Description |
| --- | --- | --- |
| Resource group | [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a [resource group](../azure-resource-manager/management/overview.md) in which you'll create your function app. |
| Storage account |  [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) |  Creates a [storage account](../storage/common/storage-account-create.md) used by your function app. Storage account names must be between 3 and 24 characters in length and can contain numbers and lowercase letters only. You can also use an existing account, which must meet the [storage account requirements](storage-considerations.md#storage-account-requirements). | 
| App Service plan | [New-AzFunctionAppPlan](/powershell/module/az.functions/new-azfunctionappplan) | Explicitly creates a hosting plan, which defines how resources are allocated to your function app. Used only when hosting in a Premium or Dedicated plan. You won't use this cmdlet when hosting in a serverless [Consumption plan](consumption-plan.md), since Consumption plans are created when you run `New-AzFunctionApp`. For more information, see [Azure Functions hosting options](functions-scale.md). |
| Function app | [New-AzFunctionApp](/powershell/module/az.functions/new-azfunctionapp) | Creates the function app using the required resources. The `-Name` parameter must be a globally unique name across all of Azure App Service. Valid characters in `-Name` are `a-z` (case insensitive), `0-9`, and `-`.  Most examples create a function app that supports C# functions. You can change the language by using the `-Runtime` parameter, with supported values of `DotNet`, `Java`, `Node`, `PowerShell`, and `Python`. Use the `-RuntimeVersion` to choose a [specific language version](supported-languages.md#languages-by-runtime-version). | 

This article contains the following examples:

* [Create a serverless function app for C#](#create-a-serverless-function-app-for-c)
* [Create a serverless function app for Python](#create-a-serverless-function-app-for-python)
* [Create a scalable function app in a Premium plan](#create-a-scalable-function-app-in-a-premium-plan)
* [Create a function app in a Dedicated plan](#create-a-function-app-in-a-dedicated-plan)
* [Create a function app with a named Storage connection](#create-a-function-app-with-a-named-storage-connection)
* [Create a function app with an Azure Cosmos DB connection](#create-a-function-app-with-an-azure-cosmos-db-connection)
* [Create a function app with continuous deployment](#create-a-function-app-with-continuous-deployment)
* [Create a serverless Python function app and mount file share](#create-a-serverless-python-function-app-and-mount-file-share)

[!INCLUDE [azure-powershell-requirements](../../includes/azure-powershell-requirements.md)]

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create a serverless function app for C# 

The following script creates a serverless C# function app in the default Consumption plan:

:::code language="azurepowershell-interactive" source="~/functions-docs-powershell/azure-functions/create-function-app-consumption/create-function-app-consumption.ps1" id="FullScript":::

## Create a serverless function app for Python

The following script creates a serverless Python function app in a Consumption plan:

:::code language="azurepowershell-interactive" source="~/functions-docs-powershell/azure-functions/create-function-app-consumption-python/create-function-app-consumption-python.ps1" id="FullScript":::

## Create a scalable function app in a Premium plan

The following script creates a C# function app in an Elastic Premium plan that supports [dynamic scale](event-driven-scaling.md):

:::code language="azurepowershell-interactive" source="~/functions-docs-powershell/azure-functions/create-function-app-premium-plan/create-function-app-premium-plan.ps1" id="FullScript":::

## Create a function app in a Dedicated plan

The following script creates a function app hosted in a Dedicated plan, which isn't scaled dynamically by Functions: 

:::code language="azurepowershell-interactive" source="~/functions-docs-powershell/azure-functions/create-function-app-app-service-plan/create-function-app-app-service-plan.ps1" id="FullScript":::

## Create a function app with a named Storage connection

The following script creates a function app with a named Storage connection in application settings:

:::code language="azurepowershell-interactive" source="~/functions-docs-powershell/azure-functions/create-function-app-connect-to-storage/create-function-app-connect-to-storage-account.ps1" id="FullScript":::

## Create a function app with an Azure Cosmos DB connection

The following script creates a function app and a connected Azure Cosmos DB account:

:::code language="azurepowershell-interactive" source="~/functions-docs-powershell/azure-functions/create-function-app-connect-to-cosmos-db/create-function-app-connect-to-cosmos-db.ps1" id="FullScript":::

## Create a function app with continuous deployment

The following script creates a function app that has continuous deployment configured to publish from a public GitHub repository:

:::code language="azurepowershell-interactive" source="~/functions-docs-powershell/azure-functions/deploy-function-app-with-function-github-continuous/deploy-function-app-with-function-github-continuous.ps1" id="FullScript":::

## Create a serverless Python function app and mount file share

The following script creates a Python function app on Linux and creates and mounts an external Azure Files share:

:::code language="azurepowershell-interactive" source="~/functions-docs-powershell/azure-functions/functions-cli-mount-files-storage-linux/functions-cli-mount-files-storage-linux.ps1" id="FullScript":::

Mounted file shares are only supported on Linux. For more information, see [Mount file shares](storage-considerations.md#mount-file-shares).

[!INCLUDE [powershell-samples-clean-up](../../includes/powershell-samples-clean-up.md)]

## Next steps

For more information on Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure).
