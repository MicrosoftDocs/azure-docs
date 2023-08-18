---
title: Quickstart - Create and manage workflows with Azure PowerShell
description: Using PowerShell, create and manage logic app workflows with Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: quickstart
ms.tool: azure-powershell
ms.custom: mvc, contperf-fy21q2, mode-api, devx-track-azurepowershell
ms.date: 08/20/2022
---

# Quickstart: Create and manage workflows with Azure PowerShell in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption](../../includes/logic-apps-sku-consumption.md)]

This quickstart shows how to create and manage automated workflows that run in Azure Logic Apps by using [Azure PowerShell](/powershell/azure/install-azure-powershell). From PowerShell, you can create a [Consumption logic app](logic-apps-overview.md#resource-environment-differences) in multi-tenant Azure Logic Apps by using the JSON file for a logic app workflow definition. You can then manage your logic app by running the cmdlets in the [Az.LogicApp](/powershell/module/az.logicapp/) PowerShell module.

> [!NOTE]
>
> This quickstart currently applies only to Consumption logic app workflows that run in multi-tenant 
> Azure Logic Apps. Azure PowerShell is currently unavailable for Standard logic app workflows that 
> run in single-tenant Azure Logic Apps. For more information, review [Resource type and host differences in Azure Logic Apps](logic-apps-overview.md#resource-environment-differences).

If you're new to Azure Logic Apps, learn how to create your first Consumption logic app workflow [through the Azure portal](quickstart-create-example-consumption-workflow.md), [in Visual Studio](quickstart-create-logic-apps-with-visual-studio.md), or [in Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The [Az PowerShell](/powershell/azure/install-azure-powershell) module installed on your local computer.

* An [Azure resource group](#example---create-resource-group) in which to create your logic app.

## Prerequisites check

Before you start, validate your environment:

* Sign in to the Azure portal and check that your subscription is active by running [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount).

* Check your version of Azure PowerShell by running `Get-InstalledModule -Name Az`. For the latest version, see the [latest release notes](/powershell/azure/migrate-az-6.0.0).

  If you don't have the latest version, update your installation by following the steps for [Update the Azure PowerShell module](/powershell/azure/install-az-ps#update-the-azure-powershell-module).

### Example - Create resource group

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

Before you [create a new logic app](#create-logic-apps-from-powershell) or [update an existing logic app](#update-logic-apps-from-powershell) by using Azure PowerShell, you need a workflow definition for your logic app. To see an example workflow definition, in the Azure portal, open any existing logic app workflow in the designer. On the **Designer** toolbar, select **Code view**, which shows the workflow's underlying definition in JSON format.

When you run the commands to create or update your logic app, your workflow definition is uploaded as a required parameter (`Definition`) or (`DefinitionFilePath`) depending on the parameter set. You must create your workflow definition as a JSON file that follows the [Workflow Definition Language schema](./logic-apps-workflow-definition-language.md).

## Create logic apps from PowerShell

To create a logic app workflow from Azure PowerShell, use the cmdlet [`New-AzLogicApp`](/powershell/module/az.logicapp/new-azlogicapp) with a JSON file for the definition.

### Example - Create logic app

This example creates a workflow named `testLogicApp` in the resource group `testResourceGroup` with the location `westus`. The JSON file `testDefinition.json` contains the workflow definition.

```azurepowershell-interactive
New-AzLogicApp -ResourceGroupName testResourceGroup -Location westus -Name testLogicApp -DefinitionFilePath .\testDefinition.json
```

When your workflow is successfully created, PowerShell shows your new workflow definition.

## Update logic apps from PowerShell

To update a logic app's workflow from Azure PowerShell, use the cmdlet [`Set-AzLogicApp`](/powershell/module/az.logicapp/set-azlogicapp).

### Example - Update logic app

This example shows how to update the [sample workflow created in the previous section](#example---create-logic-app) using a different JSON definition file, `newTestDefinition.json`.

```azurepowershell-interactive
Set-AzLogicApp -ResourceGroupName testResourceGroup -Name testLogicApp -DefinitionFilePath .\newTestDefinition.json
```

When your workflow is successfully updated, PowerShell shows your logic app's updated workflow definition.

## Delete logic apps from PowerShell

To delete a logic app's workflow from Azure PowerShell, use the cmdlet [`Remove-AzLogicApp`](/powershell/module/az.logicapp/remove-azlogicapp).

### Example - Delete logic app

This example deletes the [sample workflow created in a previous section](#example---create-logic-app).

```azurepowershell-interactive
Remove-AzLogicApp -ResourceGroupName testResourceGroup -Name testLogicApp
```

After you respond to the confirmation prompt with `y`, the logic app is deleted.

### Considerations - Delete logic app

Deleting a logic app affects workflow instances in the following ways:

* Azure Logic Apps makes a best effort to cancel any in-progress and pending runs.

  Even with a large volume or backlog, most runs are canceled before they finish or start. However, the cancellation process might take time to complete. Meanwhile, some runs might get picked up for execution while the runtime works through the cancellation process.

* Azure Logic Apps doesn't create or run new workflow instances.

* If you delete a workflow and then recreate the same workflow, the recreated workflow won't have the same metadata as the deleted workflow. You have to resave any workflow that called the deleted workflow. That way, the caller gets the correct information for the recreated workflow. Otherwise, calls to the recreated workflow fail with an `Unauthorized` error. This behavior also applies to workflows that use artifacts in integration accounts and workflows that call Azure functions.

## Show logic apps in PowerShell

To get a specific logic app workflow, use the command [`Get-AzLogicApp`](/powershell/module/az.logicapp/get-azlogicapp).

### Example - Get logic app

This example returns the logic app `testLogicApp` in the resource group `testResourceGroup`.

```azurepowershell-interactive
Get-AzLogicApp -ResourceGroupName testResourceGroup -Name testLogicApp
```

## Next steps

For more information on Azure PowerShell, see the [Azure PowerShell documentation](/powershell/azure/).

You can find additional Logic Apps script samples in [Microsoft's code samples browser](/samples/browse/?products=azure-logic-apps).
