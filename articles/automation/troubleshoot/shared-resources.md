---
title: Troubleshoot errors with Azure Automation shared resources
description: Learn how to troubleshoot issues with Azure Automation shared resources
services: automation
author: georgewallace
ms.author: gwallace
ms.date: 12/3/2018
ms.topic: conceptual
ms.service: automation
manager: carmonm
---
# Troubleshoot errors with shared resources

This article discusses solutions to resolve issues that you may run across when using the shared resources in Azure Automation.

## Modules

### <a name="module-stuck-importing"></a>Scenario: A Module is stuck importing

#### Issue

A module is stuck in the **Importing** state when you import or update your modules in Azure automation.

#### Cause

Importing PowerShell modules is a complex multi-step process. This process introduces the possibility of a module not importing correctly. If this issue occurs, the module you're importing can be stuck in a transient state. To learn more about this process, see [Importing a PowerShell Module]( /powershell/developer/module/importing-a-powershell-module#the-importing-process).

#### Resolution

To resolve this issue, you must remove the module that is stuck in the **Importing** state by using the [Remove-AzureRmAutomationModule](/powershell/module/azurerm.automation/remove-azurermautomationmodule) cmdlet. You can then retry importing the module.

```azurepowershell-interactive
Remove-AzureRmAutomationModule -Name ModuleName -ResourceGroupName ExampleResourceGroup -AutomationAccountName ExampleAutomationAccount -Force
```

## Run As accounts

### <a name="unable-create-update"></a>Scenario: You're unable to create or update a Run As account

#### Issue

When you try to create or update a Run As account, you receive an error similar to the following error message:

```error
You do not have permissions to create…
```

#### Cause

You don't have the permissions that you need to create or update the Run As account or the resource is locked at a resource group level.

#### Resolution

To create or update a Run As account, you must have appropriate permissions to the various resources used by the Run As account. To learn about the permissions needed to create or update a Run As account, see [Run As account permissions](../manage-runas-account.md#permissions).

If the issue is due to a lock, verify that the lock is ok to remove and navigate to the resource that is locked, right-click the lock and choose **Delete** to remove the lock.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/)
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.