---
title: Update Azure PowerShell modules in Azure Automation
description: This article tells how to update common Azure PowerShell modules provided by default in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 06/14/2019
ms.topic: conceptual 
ms.custom: devx-track-azurepowershell
---

# Update Azure PowerShell modules

The most common PowerShell modules are provided by default in each Automation account. See [Default modules](shared-resources/modules.md#default-modules). As the Azure team updates the Azure modules regularly, changes can occur with the included cmdlets. These changes, for example, renaming a parameter or deprecating a cmdlet entirely, can negatively affect your runbooks. 

> [!NOTE]
> You can't delete global modules, which are modules that Automation provides out of the box.

## Set up an Automation account

To avoid impacting your runbooks and the processes they automate, be sure to test and validate as you make updates. If you don't have a dedicated Automation account intended for this purpose, consider creating one so that you can test many different scenarios during the development of your runbooks. This testing should include iterative changes, such as updating the PowerShell modules.

Make sure that your Automation account has an [Azure Run As account](automation-security-overview.md#run-as-accounts) created.

If you develop your scripts locally, it's recommended to have the same module versions locally that you have in your Automation account when testing to ensure that you receive the same results. After the results are validated and you've applied any changes required, you can move the changes to production.

> [!NOTE]
> A new Automation account might not contain the latest modules.

## Obtain a runbook to use for updates

To update the Azure modules in your Automation account, you must use the [Update-AutomationAzureModulesForAccount](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update) runbook, which is available as open source. To start using this runbook to update your Azure modules, download it from the GitHub repository. You can then import it into your Automation account or run it as a script. To learn how to import a runbook in your Automation account, see [Import a runbook](manage-runbooks.md#import-a-runbook).

The **Update-AutomationAzureModulesForAccount** runbook supports updating the Azure, AzureRM, and Az modules by default. Review the [Update Azure modules runbook README](https://github.com/microsoft/AzureAutomation-Account-Modules-Update/blob/master/README.md) for more information on updating Az.Automation modules with this runbook. There are additional important factors that you need to take into account when using the Az modules in your Automation account. To learn more, see [Manage modules in Azure Automation](shared-resources/modules.md).

## Use update runbook code as a regular PowerShell script

You can use the runbook code as a regular PowerShell script instead of a runbook. To do this, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet first, then pass `-Login $false` to the script.

## Use the update runbook on sovereign clouds

To use this runbook on sovereign clouds, use the `AzEnvironment` parameter to pass the correct environment to the runbook. Acceptable values are AzureCloud (Azure public cloud), AzureChinaCloud, AzureGermanCloud, and AzureUSGovernment. These values can be retrieved using `Get-AzEnvironment | select Name`. If you don't pass a value to this cmdlet, the runbook defaults to AzureCloud.

## Use the update runbook to update a specific module version

If you want to use a specific Azure PowerShell module version instead of the latest module available on the PowerShell Gallery, pass these versions to the optional `ModuleVersionOverrides` parameter of the **Update-AutomationAzureModulesForAccount** runbook. For examples, see the  [Update-AutomationAzureModulesForAccount.ps1](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update/blob/master/Update-AutomationAzureModulesForAccount.ps1) runbook. Azure PowerShell modules that aren't mentioned in the `ModuleVersionOverrides` parameter are updated with the latest module versions on the PowerShell Gallery. If you pass nothing to the `ModuleVersionOverrides` parameter, all modules are updated with the latest module versions on the PowerShell Gallery. This behavior is the same for the **Update Azure Modules** button in the Azure portal.

## Next steps

* For details of using modules, see [Manage modules in Azure Automation](shared-resources/modules.md).
* For information about the update runbook, see [Update Azure modules runbook](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update).
