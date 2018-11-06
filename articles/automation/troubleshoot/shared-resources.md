---
title: Troubleshoot errors with Azure Automation shared resources
description: Learn how to troubleshoot issues with Azure Automation shared resources
services: automation
author: georgewallace
ms.author: gwallace
ms.date: 11/05/2018
ms.topic: conceptual
ms.service: automation
manager: carmonm
---
# Troubleshoot errors with shared resources

This article discusses solutions to resolve issues that you may run across when using the shared resources in Azure Automation.

## Modules

### <a name="module-stuck-importing"></a>Scenario: A Module is stuck importing

#### Issue

When you import or update your modules in Azure automation, you find a module that is stuck in the **Importing** state.

#### Error

Importing PowerShell modules is a complex multi-step process. This process introduces the possibility of a module not importing correctly. If this occurs, the module you're importing can be stuck in a transient state. To learn more about this process, see [Importing a PowerShell Module]( /powershell/developer/module/importing-a-powershell-module#the-importing-process).

#### Resolution

To resolve this issue, you must remove the module that is stuck in the **Importing** state by using the [Remove-AzureRmAutomationModule](/powershell/module/azurerm.automation/remove-azurermautomationmodule) cmdlet. You can then retry importing the module.

```azurepowershell-interactive
Remove-AzureRmAutomationModule -Name ModuleName -ResourceGroupName ExampleResourceGroup -AutomationAccountName ExampleAutomationAccount -Force
```

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/)
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.