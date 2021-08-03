---
title: Quickstart - Create and manage workflows with Azure PowerShell in multi-tenant Azure Logic Apps
description: Using PowerShell, create and manage logic app workflows in multi-tenant Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: quickstart
ms.custom: mvc, devx-track-azurepowershell, contperf-fy21q2
ms.date: 07/26/2021
---

# Quickstart: Create and manage workflows using Azure PowerShell in multi-tenant Azure Logic Apps

This quickstart shows you how to create and manage logic apps by using [Azure PowerShell](/powershell/azure/install-az-ps). From PowerShell, you can create a logic app by using the JSON file for a logic app workflow definition. You can then manage your logic app by running the cmdlets in the [Az.LogicApp](/powershell/module/az.logicapp/) PowerShell module.

If you're new to Azure Logic Apps, you can also learn how to create your first logic apps [through the Azure portal](quickstart-create-first-logic-app-workflow.md), [in Visual Studio](quickstart-create-logic-apps-with-visual-studio.md), and [in Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* The [Az PowerShell](/powershell/azure/install-az-ps) module installed on your local computer.
* An [Azure resource group](#example---create-resource-group) in which to create your logic app.

### Prerequisite check

Validate your environment before you begin:

* Sign in to the Azure portal and check that your subscription is active by running [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount).
* Check your version of Azure PowerShell by running `Get-InstalledModule -Name Az`. For the latest version, see the [latest release notes](https://aka.ms/azps-migration-latest).
  * If you don't have the latest version, update your installation by following [Update the Azure PowerShell module](/powershell/azure/install-az-ps#update-the-azure-powershell-module).

### Example - create resource group

If you don't already have a resource group for your logic app, create the group with the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet. For example, the following command creates a resource group named `testResourceGroup` in the location `westus`.

```azurepowershell-interactive
New-AzResourceGroup -Name testResourceGroup -Location westus
```

The output shows the `ProvisioningState` as `Succeeded` when your resource group is successfully created:

```Output
ResourceGroupName : testResourceGroup
Location          : westus
ProvisioningState : Succeeded
Tags              :
ResourceId        : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testResourceGroup
```

## Workflow definition

Before you [create a new logic app](#create-logic-apps-from-powershell) or [update an existing logic app](#update-logic-apps-from-powershell) by using Azure PowerShell, you need a workflow definition for your logic app. In the Azure portal, you can view your logic app's underlying workflow definition in JSON format by switching from **Designer** view to **Code view**.

When you run the commands to create or update your logic app, your workflow definition is uploaded as a required parameter (`Definition`) or (`DefinitionFilePath`) depending on the parameter set. You must create your workflow definition as a JSON file that follows the [Workflow Definition Language schema](./logic-apps-workflow-definition-language.md).

## Create logic apps from PowerShell

You can create a logic app workflow from Azure PowerShell using the cmdlet [`New-AzLogicApp`](/powershell/module/az.logicapp/new-azlogicapp) with a JSON file for the definition.

### Example - create logic app

This example creates a workflow named `testLogicApp` in the resource group `testResourceGroup` with the location `westus`. The JSON file `testDefinition.json` contains the workflow definition.

```azurepowershell-interactive
New-AzLogicApp -ResourceGroupName testResourceGroup -Location westus -Name testLogicApp -DefinitionFilePath .\testDefinition.json
```

When your workflow is successfully created, PowerShell shows your new workflow definition.

## Update logic apps from PowerShell

You can also update a logic app's workflow from Azure PowerShell using the cmdlet [`Set-AzLogicApp`](/powershell/module/az.logicapp/set-azlogicapp).

### Example - update logic app

This example shows how to update the [sample workflow created in the previous section](#example---create-logic-app) using a different JSON definition file, `newTestDefinition.json`.

```azurepowershell-interactive
Set-AzLogicApp -ResourceGroupName testResourceGroup -Name testLogicApp -DefinitionFilePath .\newTestDefinition.json
```

When your workflow is successfully updated, PowerShell shows your logic app's updated workflow definition.

## Delete logic apps from PowerShell

You can delete a logic app's workflow from Azure PowerShell using the cmdlet [`Remove-AzLogicApp`](/powershell/module/az.logicapp/remove-azlogicapp).

### Example - delete logic app

This example deletes the [sample workflow created in a previous section](#example---create-logic-app).

```azurepowershell-interactive
Remove-AzLogicApp -ResourceGroupName testResourceGroup -Name testLogicApp
```

After you respond to the confirmation prompt with `y`, the logic app is deleted.

### Considerations - delete logic app

Deleting a logic app affects workflow instances in the following ways:

* The Logic Apps service makes a best effort to cancel any in-progress and pending runs.

  Even with a large volume or backlog, most runs are canceled before they finish or start. However, the cancellation process might take time to complete. Meanwhile, some runs might get picked up for execution while the runtime works through the cancellation process.

* The Logic Apps service doesn't create or run new workflow instances.

* If you delete a workflow and then recreate the same workflow, the recreated workflow won't have the same metadata as the deleted workflow. You have to resave any workflow that called the deleted workflow. That way, the caller gets the correct information for the recreated workflow. Otherwise, calls to the recreated workflow fail with an `Unauthorized` error. This behavior also applies to workflows that use artifacts in integration accounts and workflows that call Azure functions.

## Show logic apps in PowerShell

You can get a specific logic app workflow using the command [`Get-AzLogicApp`](/powershell/module/az.logicapp/get-azlogicapp).

### Example - get logic app

This example returns the logic app `testLogicApp` in the resource group `testResourceGroup`.

```azurepowershell-interactive
Get-AzLogicApp -ResourceGroupName testResourceGroup -Name testLogicApp
```

## Next steps

For more information on Azure PowerShell, see the [Azure PowerShell documentation](/powershell/azure/).

You can find additional Logic Apps script samples in [Microsoft's code samples browser](/samples/browse/?products=azure-logic-apps).
