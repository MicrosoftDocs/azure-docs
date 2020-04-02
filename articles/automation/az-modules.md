---
title: Az module support in Azure Automation
description: This article provides information about using Az modules in Azure Automation.
services: automation
ms.subservice: shared-capabilities
ms.date: 02/08/2019
ms.topic: conceptual
---

# Az module support in Azure Automation

Azure Automation supports the use of [Azure PowerShell Az module](/powershell/azure/new-azureps-module-az?view=azps-1.1.0) in your runbooks. The Az module is not imported automatically in any new or existing Automation accounts. 

## Considerations

There are many things to take into consideration when using the Az module in Azure Automation. Runbooks and modules can be used by higher-level solutions in your Automation account. Editing runbooks or upgrading modules can potentially cause issues with your runbooks. You should test all runbooks and solutions carefully in a separate Automation account before importing the new `Az` modules. Any modifications to modules can negatively affect the [Start/Stop](automation-solution-vm-management.md) solution. We don't recommend altering modules and runbooks in Automation accounts that contain any solutions. This behavior isn't specific to the Az modules. This behavior should be taken into consideration when introducing any changes to your Automation account.

Importing an `Az` module in your Automation account doesn't automatically import the module in the PowerShell session that the runbooks use. Modules are imported into the PowerShell session in the following situations:

* When a cmdlet from a module is invoked from a runbook
* When a runbook imports it explicitly with the `Import-Module` cmdlet
* When another module depending on the module is imported into a PowerShell session

> [!IMPORTANT]
> It is important to make sure that runbooks in an Automation account either only import `Az` or `AzureRM` modules into the PowerShell sessions used by runbooks and not both. If `Az` is imported before `AzureRM` in a runbook, the runbook completes, but an error referencing the [Get_SerializationSettings](troubleshoot/runbooks.md#get-serializationsettings) cmdlet shows up in the job streams and cmdlets might not be properly executed. If you import `AzureRM` and then `Az`, your runbook still completes, but you receive an error in the job streams stating that both `Az` and `AzureRM` can't be imported in the same session or used in the same runbook.

## Migrating to Az modules

It's recommended that you test the migration to Az modules in a test Automation account. Once that Automation account has been created, you can use the instructions in this section to work with the modules.

### Stop and unschedule all runbooks that use AzureRM cmdlets

To ensure that you do not run any existing runbooks that use `AzureRM` cmdlets, you should stop and unschedule all runbooks that use `AzureRM` modules. You can see what schedules exist and which schedules must be removed by running code similar to this example.

  ```powershell-interactive
  Get-AzureRmAutomationSchedule -AutomationAccountName "<AutomationAccountName>" -ResourceGroupName "<ResourceGroupName>" | Remove-AzureRmAutomationSchedule -WhatIf
  ```

It's important to review each schedule separately to ensure that you can reschedule it in the future for your runbooks if necessary.

### Import the Az modules

Only import the Az modules that are required for your runbooks. Don't import the rollup `Az` module, as it includes all `Az.*` modules. This guidance is the same for all modules.

The [Az.Accounts](https://www.powershellgallery.com/packages/Az.Accounts/1.1.0) module is a dependency for the other `Az.*` modules. For this reason, this module needs to be imported into your Automation account before you import any other modules.

From your Automation account, select **Modules** under **Shared Resources**. Click **Browse Gallery** to open the **Browse Gallery** page.  In the search bar, enter the module name (such as `Az.Accounts`). On the PowerShell Module page, click **Import** to import the module into your Automation account.

![Import modules from Automation account](media/az-modules/import-module.png)

This import process can also be done through the [PowerShell Gallery](https://www.powershellgallery.com) by searching for the module for import. Once you find the module, select it and under the **Azure Automation** tab, click **Deploy to Azure Automation**.

![Import modules directly from gallery](media/az-modules/import-gallery.png)

## Testing your runbooks

Once the `Az` modules are imported into your Automation account, you can start editing your runbooks to use the Az modules. The majority of the cmdlets have the same names except that `AzureRM` has been changed to `Az`. For a list of modules that do not follow this naming convention, see [list of exceptions](/powershell/azure/migrate-from-azurerm-to-az#update-cmdlets-modules-and-parameters).

One way to test the modification of a runbook to use the new cmdlets is by using `Enable-AzureRMAlias -Scope Process` at the beginning of the runbook. By adding this command to your runbook, the script can run without changes.

## After-migration details

After the migration is complete, don't try to start runbooks using `AzureRM` modules on the Automation account any longer. It's also recommended to not import or update `AzureRM` modules on the account. Consider the account migrated to `Az`, and operate with `Az` modules only. 

When a new Automation account is created, the existing `AzureRM` modules are still installed. You can still update the tutorial runbooks with `AzureRM` cmdlets. You should not run these runbooks.

## Next steps

To learn more about using Az modules, see [Getting started with Az module](/powershell/azure/get-started-azureps?view=azps-1.1.0).
