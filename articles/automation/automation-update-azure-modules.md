---
title: Update Azure modules in Azure Automation
description: This article describes how you can now update common Azure PowerShell modules provided by default in Azure Automation.
services: automation
ms.service: automation
ms.subservice: process-automation
author: georgewallace
ms.author: gwallace
ms.date: 03/11/2019
ms.topic: conceptual
manager: carmonm
---

# How to update Azure PowerShell modules in Azure Automation

To update the Azure modules in your Automation Account it's recommended you now use the [Update Azure modules runbook](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update), which is now open source. Additionally, you can still use the **Update Azure Modules** button in the portal to update your Azure modules. To learn more about using the open-source runbook, see [Update Azure Modules with open source runbook](#open-source).

The most common Azure PowerShell modules are provided by default in each Automation account. The Azure team updates the Azure modules regularly. In your Automation account, you're provided a way to update the modules in the account when new versions are available from the portal.

Because modules are updated regularly by the product group, changes can occur with the included cmdlets. This action may negatively impact your runbooks depending on the type of change, such as renaming a parameter or deprecating a cmdlet entirely.

To avoid impacting your runbooks and the processes they automate, test and validate before proceeding. If you don't have a dedicated Automation account intended for this purpose, consider creating one so that you can test many different scenarios during the development of your runbooks. This testing should include iterative changes such as updating the PowerShell modules. 

If you develop your scripts locally, it's recommended to have the same module versions locally that you have in your Automation Account when testing to ensure you'll receive the same results. After the results are validated and you've applied any changes required, you can move the changes to production.

> [!NOTE]
> A new Automation account might not contain the latest modules.

## <a name="open-source"></a>Update Azure Modules with open-source runbook

To start using the **Update-AutomationAzureModulesForAccount** runbook to update your Azure modules, download it from the [Update Azure modules runbook repository](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update) on GitHub. You can then import it into your Automation Account or run it as a script. The instructions on how to do this can be found in the [Update Azure modules runbook repository](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update).

### Considerations

The following are some considerations to take into account when using this process to update your Azure Modules:

* If you import this runbook with the original name `Update-AutomationAzureModulesForAccount`, it will override the internal runbook with this name. As a result, the imported runbook will run when the **Update Azure Modules** button is pushed or when this runbook is invoked directly via Azure Resource Manager API for this Automation account.

* This runbook supports updating only the **Azure** and **AzureRm** modules currently. [Azure PowerShell Az modules](/powershell/azure/new-azureps-module-az) are supported in Automation accounts, but cannot be updated with this runbook.

* Avoid starting this runbook on Automation accounts that contain Az modules.

* Before starting this runbook, make sure your Automation account has an [Azure Run As account credential](manage-runas-account.md) created.

* You can use this code as a regular PowerShell script instead of a runbook: just log in to Azure using the [Connect-AzureRmAccount](/powershell/module/azurerm.profile/connect-azurermaccount) command first, then pass `-Login $false` to the script.

* To use this runbook on the sovereign clouds, use the `AzureRmEnvironment` parameter to pass the correct environment to the runbook.  Acceptable values are **AzureCloud**, **AzureChinaCloud**, **AzureGermanCloud**, and **AzureUSGovernment**. These values can be retrieved from using `Get-AzureRmEnvironment | select Name`. If you don't pass a value to this parameter, the runbook will default to the Azure public cloud **AzureCloud**

* If you want to use a specific Azure PowerShell module version instead of the latest available on the PowerShell Gallery, pass these versions to the optional `ModuleVersionOverrides` parameter of the **Update-AutomationAzureModulesForAccount** runbook. For examples, see the  [Update-AutomationAzureModulesForAccount.ps1](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update/blob/master/Update-AutomationAzureModulesForAccount.ps1
) runbook. Azure PowerShell modules that aren't mentioned in the `ModuleVersionOverrides` parameter are updated with the latest module versions on the PowerShell Gallery. If you pass nothing to the `ModuleVersionOverrides` parameter, all modules are updated with the latest module versions on the PowerShell Gallery. This behavior is the same as the **Update Azure Modules** button.

## Update Azure Modules in the Azure portal

1. In the Modules page of your Automation account, there's an option called **Update Azure Modules**. It's always enabled.<br><br> ![Update Azure Modules option in Modules page](media/automation-update-azure-modules/automation-update-azure-modules-option.png)

   > [!NOTE]
   > Before updating your Azure modules it's recommended that you update them in a test Automation Account to ensure that your existing scripts work as expected before updating your Azure modules.
   >
   > The **Update Azure Modules** button is only available in the public cloud. It's not available in the [sovereign regions](https://azure.microsoft.com/global-infrastructure/). Please use the  **Update-AutomationAzureModulesForAccount** runbook to update your Azure modules. You can download it from the [Update Azure modules runbook repository](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update). To learn more about using the open source runbook, see [Update Azure Modules with open source runbook](#open-source).

2. Click **Update Azure Modules**, a confirmation notification is shown that asks if you want to continue.<br><br> ![Update Azure Modules notification](media/automation-update-azure-modules/automation-update-azure-modules-popup.png)

3. Click **Yes** and the module update process begins. The update process takes about 15-20 minutes to update the following modules:

   * Azure
   * Azure.Storage
   * AzureRm.Automation
   * AzureRm.Compute
   * AzureRm.Profile
   * AzureRm.Resources
   * AzureRm.Sql
   * AzureRm.Storage

     If the modules are already up-to-date, then the process completes in a few seconds. When the update process completes, you're notified.<br><br> ![Update Azure Modules update status](media/automation-update-azure-modules/automation-update-azure-modules-updatestatus.png)

     The .NET core AzureRm modules (AzureRm.*.Core) aren't supported in Azure Automation and can't be imported.

> [!NOTE]
> Azure Automation uses the latest modules in your Automation account when a new scheduled job is run.  

If you use cmdlets from these Azure PowerShell modules in your runbooks, you want to run this update process every month or so to make sure that you have the latest modules. Azure Automation uses the `AzureRunAsConnection` connection to authenticate when updating the modules. If the service principal is expired or no longer exists on the subscription level, the module update will fail.

## Known issues

There is a known issue with updating the AzureRM modules in an Automation Account that is in a resource group with a numeric name that starts with 0. To update your Azure modules in your Automation Account, it must be in a resource group that has an alphanumeric name. Resource groups with numeric names starting with 0 are unable to update AzureRM modules at this time.

## Next steps

Visit the open source [Update Azure modules runbook](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update) to learn more about it.
