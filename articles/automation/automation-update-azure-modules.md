---
title: Update Azure PowerShell modules in Azure Automation
description: This article describes how you can now update common Azure PowerShell modules provided by default in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 06/14/2019
ms.topic: conceptual
---

# Update Azure PowerShell modules in Azure Automation

To update the Azure modules in your Automation account you need to use the [Update Azure modules runbook](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update), which is available as open source. To start using the **Update-AutomationAzureModulesForAccount** runbook to update your Azure modules, download it from the [Update Azure modules runbook repository](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update) on GitHub. You can then import it into your Automation account or run it as a script. To learn how to import a runbook in your Automation account, see [Import a runbook](manage-runbooks.md#import-a-runbook).

The most common PowerShell modules are provided by default in each Automation account. The Azure team updates the Azure modules regularly. Therefore, to keep the modules in your Automation accounts up to date, you should use the [Update-AutomationAzureModulesForAccount](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update) runbook.

Because modules are updated regularly by the product group, changes can occur with the included cmdlets. These changes, for example, renaming a parameter or deprecating a cmdlet entirely, can negatively affect your runbooks.

To avoid impacting your runbooks and the processes they automate, test and validate before proceeding. If you don't have a dedicated Automation account intended for this purpose, consider creating one so that you can test many different scenarios during the development of your runbooks. This testing should include iterative changes, such as updating the PowerShell modules.

If you develop your scripts locally, it's recommended to have the same module versions locally that you have in your Automation account when testing to ensure you'll receive the same results. After the results are validated and you've applied any changes required, you can move the changes to production.

> [!NOTE]
> A new Automation account might not contain the latest modules.

> [!NOTE]
> You will not be able to delete global modules, which are modules that Automation provides out of the box.

>[!NOTE]
>This article has been updated to use the new Azure PowerShell Az module. You can still use the AzureRM module, which will continue to receive bug fixes until at least December 2020. To learn more about the new Az module and AzureRM compatibility, see [Introducing the new Azure PowerShell Az module](https://docs.microsoft.com/powershell/azure/new-azureps-module-az?view=azps-3.5.0). For Az module installation instructions on your Hybrid Runbook Worker, see [Install the Azure PowerShell Module](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-3.5.0). 

## Considerations

The following are some considerations to take into account when using this article to update your Azure Modules:

* The runbook described in this article supports updating the Azure, AzureRM, and Az modules by default. Review the [Update Azure modules runbook README](https://github.com/microsoft/AzureAutomation-Account-Modules-Update/blob/master/README.md) for more information on updating Az.Automation modules with this runbook. There are additional important factors that you need to take into account when using the Az modules in your Automation account. To learn more, see [Manage modules in Azure Automation](shared-resources/modules.md).

* Before starting this runbook, make sure your Automation account has an [Azure Run As account credential](manage-runas-account.md) created.

* You can use this code as a regular PowerShell script instead of a runbook: just sign in to Azure using the [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount?view=azps-3.7.0) cmdlet first, then pass `-Login $false` to the script.

* To use this runbook on the sovereign clouds, use the `AzEnvironment` parameter to pass the correct environment to the runbook.  Acceptable values are AzureCloud (Azure public cloud), AzureChinaCloud, AzureGermanCloud, and AzureUSGovernment. These values can be retrieved using `Get-AzEnvironment | select Name`. If you don't pass a value to this cmdlet, the runbook defaults to AzureCloud.

* If you want to use a specific Azure PowerShell module version instead of the latest module available on the PowerShell Gallery, pass these versions to the optional `ModuleVersionOverrides` parameter of the **Update-AutomationAzureModulesForAccount** runbook. For examples, see the  [Update-AutomationAzureModulesForAccount.ps1](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update/blob/master/Update-AutomationAzureModulesForAccount.ps1
) runbook. Azure PowerShell modules that aren't mentioned in the `ModuleVersionOverrides` parameter are updated with the latest module versions on the PowerShell Gallery. If you pass nothing to the `ModuleVersionOverrides` parameter, all modules are updated with the latest module versions on the PowerShell Gallery. This behavior is the same as the **Update Azure Modules** button.

## Next steps

Visit the open source [Update Azure modules runbook](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update) to learn more about it.
