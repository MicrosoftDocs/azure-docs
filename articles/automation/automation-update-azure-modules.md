---
title: Update Azure modules in Azure Automation
description: This article describes how you can now update common Azure PowerShell modules provided by default in Azure Automation.
services: automation
ms.service: automation
ms.subservice: process-automation
author: bobbytreed
ms.author: robreed
ms.date: 06/14/2019
ms.topic: conceptual
manager: carmonm
---

# How to update Azure PowerShell modules in Azure Automation

To update the Azure modules in your Automation Account you need to use the [Update Azure modules runbook](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update), which is available as open source. To start using the **Update-AutomationAzureModulesForAccount** runbook to update your Azure modules, download it from the [Update Azure modules runbook repository](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update) on GitHub. You can then import it into your Automation Account or run it as a script. To learn how to import a runbook in your Automation Account, see [Import a runbook](manage-runbooks.md#import-a-runbook).

The most common AzureRM PowerShell modules are provided by default in each Automation account. The Azure team updates the Azure modules regularly, therefore to keep up to date you will want to use the [Update-AutomationAzureModulesForAccount](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update) runbook to update the modules in your Automation accounts.

Because modules are updated regularly by the product group, changes can occur with the included cmdlets. This action may negatively impact your runbooks depending on the type of change, such as renaming a parameter or deprecating a cmdlet entirely.

To avoid impacting your runbooks and the processes they automate, test and validate before proceeding. If you don't have a dedicated Automation account intended for this purpose, consider creating one so that you can test many different scenarios during the development of your runbooks. This testing should include iterative changes such as updating the PowerShell modules.

If you develop your scripts locally, it's recommended to have the same module versions locally that you have in your Automation Account when testing to ensure you'll receive the same results. After the results are validated and you've applied any changes required, you can move the changes to production.

> [!NOTE]
> A new Automation account might not contain the latest modules.

## Considerations

The following are some considerations to take into account when using this process to update your Azure Modules:

* This runbook supports updating the **Azure** and **AzureRm** modules by default. This runbook supports updating the **Az** modules as well. Review the [Update Azure modules runbook README](https://github.com/microsoft/AzureAutomation-Account-Modules-Update/blob/master/README.md) for more information on updating `Az` modules with this runbook. There are additional important factors that you need to take into account when using the `Az` modules in your Automation Account, to learn more, see [Using Az modules in your Automation Account](az-modules.md).

* Before starting this runbook, make sure your Automation account has an [Azure Run As account credential](manage-runas-account.md) created.

* You can use this code as a regular PowerShell script instead of a runbook: just sign in to Azure using the [Connect-AzureRmAccount](/powershell/module/azurerm.profile/connect-azurermaccount) command first, then pass `-Login $false` to the script.

* To use this runbook on the sovereign clouds, use the `AzureRmEnvironment` parameter to pass the correct environment to the runbook.  Acceptable values are **AzureCloud**, **AzureChinaCloud**, **AzureGermanCloud**, and **AzureUSGovernment**. These values can be retrieved from using `Get-AzureRmEnvironment | select Name`. If you don't pass a value to this parameter, the runbook will default to the Azure public cloud **AzureCloud**

* If you want to use a specific Azure PowerShell module version instead of the latest available on the PowerShell Gallery, pass these versions to the optional `ModuleVersionOverrides` parameter of the **Update-AutomationAzureModulesForAccount** runbook. For examples, see the  [Update-AutomationAzureModulesForAccount.ps1](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update/blob/master/Update-AutomationAzureModulesForAccount.ps1
) runbook. Azure PowerShell modules that aren't mentioned in the `ModuleVersionOverrides` parameter are updated with the latest module versions on the PowerShell Gallery. If you pass nothing to the `ModuleVersionOverrides` parameter, all modules are updated with the latest module versions on the PowerShell Gallery. This behavior is the same as the **Update Azure Modules** button.

## Known issues

There is a known issue with updating the AzureRM modules in an Automation Account that is in a resource group with a numeric name that starts with 0. To update your Azure modules in your Automation Account, it must be in a resource group that has an alphanumeric name. Resource groups with numeric names starting with 0 are unable to update AzureRM modules at this time.

## Next steps

Visit the open source [Update Azure modules runbook](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update) to learn more about it.
