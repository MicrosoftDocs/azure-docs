---
title: Update Azure PowerShell modules in Azure Automation
description: This article tells how to update common Azure PowerShell modules provided by default in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 07/03/2023
ms.topic: conceptual 
ms.custom: devx-track-azurepowershell
---

# Update Azure PowerShell modules in Automation

The most common PowerShell modules are provided by default in each Automation account. See [Default modules](shared-resources/modules.md#default-modules). As the Azure team updates the Azure modules regularly, changes can occur with the included cmdlets. These changes, for example, renaming a parameter or deprecating a cmdlet entirely, can negatively affect your runbooks. 

> [!NOTE]
> You can't delete global modules, which are modules that Automation provides out of the box.

## Set up an Automation account

To avoid impacting your runbooks and the processes they automate, be sure to test and validate as you make updates. If you don't have a dedicated Automation account intended for this purpose, consider creating one so that you can test many different scenarios during the development of your runbooks. This testing should include iterative changes, such as updating the PowerShell modules.

Ensure your Automation account has added a [system-assigned managed identity or user-assigned managed identity](quickstarts/enable-managed-identity.md).

If you develop your scripts locally, it's recommended to have the same module versions locally that you have in your Automation account when testing to ensure that you receive the same results. After the results are validated and you've applied any changes required, you can move the changes to production.

> [!NOTE]
> A new Automation account might not contain the latest modules.

## Update Az modules

The following sections explains on how you can update Az modules either through the **portal** (recommended) or through the runbook.

### Update Az modules through portal 

Currently, updating AZ modules is only available through the portal. Updates through PowerShell and ARM template will be available in the future. Only default Az modules will be updated when performing the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Automation account.
1. Under **Shared Resources**, select **Modules**.
1. Select **Update Az modules**.
1. Select **Module to Update**. By default, it will show Az module.  
1. From the drop-down list, select **Module Version** and **Runtype version**
1. Select **Update** to update the Az module to the version that you’ve selected.
   On the **Modules** page, you can view the list as shown below:

   :::image type="content" source="./media/automation-update-azure-modules/update-az-modules-portal.png" alt-text="Update AZ modules page with selections.":::

If you select a version lower than the existing Az module version imported in the Automation account, the update operation will perform a rollback to the selected lower version.  

You can verify the update operation by checking the Module version and Status property of the updated modules shown in the list of **modules** under **PowerShell modules**. 

The Azure team will regularly update the module version and provide an option to update the **default** Az modules by selecting the module version from the drop-down list.  

### Update Az modules through runbook  

To update the Azure modules in your Automation account:

1. Use the [Update-AutomationAzureModulesForAccount](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update) runbook, available as open source. 
1. Download from the GitHub repository, to start using this runbook to update your Azure modules.
1. Import it into your Automation account or run it as a script. To learn how to import a runbook in your Automation account, see [Import a runbook](manage-runbooks.md#import-a-runbook). 

>[!NOTE]
> We recommend you to update Az modules through Azure portal. You can also perform this using the `Update-AutomationAzureModulesForAccount` script, available as open-source and provided as a reference. However, in case of any runbook failure, you need to modify parameters in the runbook as required or debug the script as per the scenario.

The **Update-AutomationAzureModulesForAccount** runbook supports updating the Azure, AzureRM, and Az modules by default. Review the [Update Azure modules runbook README](https://github.com/microsoft/AzureAutomation-Account-Modules-Update/blob/master/README.md) for more information on updating Az.Automation modules with this runbook. There are additional important factors that you need to take into account when using the Az modules in your Automation account. To learn more, see [Manage modules in Azure Automation](shared-resources/modules.md).

#### Use the update runbook code as a regular PowerShell script

You can use the runbook code as a regular PowerShell script instead of a runbook. To do this, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet first, then pass `-Login $false` to the script.

#### Use the update runbook on sovereign clouds
To use this runbook on sovereign clouds, use the `AzEnvironment` parameter to pass the correct environment to the runbook. Acceptable values are AzureCloud (Azure public cloud), AzureChinaCloud, AzureGermanCloud, and AzureUSGovernment. These values can be retrieved using `Get-AzEnvironment | select Name`. If you don't pass a value to this cmdlet, the runbook defaults to AzureCloud.

#### Use the update runbook to update a specific module version

If you want to use a specific Azure PowerShell module version instead of the latest module available on the PowerShell Gallery, pass these versions to the optional `ModuleVersionOverrides` parameter of the **Update-AutomationAzureModulesForAccount** runbook. For examples, see the  [Update-AutomationAzureModulesForAccount.ps1](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update/blob/master/Update-AutomationAzureModulesForAccount.ps1) runbook. Azure PowerShell modules that aren't mentioned in the `ModuleVersionOverrides` parameter are updated with the latest module versions on the PowerShell Gallery. If you pass nothing to the `ModuleVersionOverrides` parameter, all modules are updated with the latest module versions on the PowerShell Gallery. This behavior is the same for the **Update Azure Modules** button in the Azure portal.


## Next steps

* For details of using modules, see [Manage modules in Azure Automation](shared-resources/modules.md).
* For information about the update runbook, see [Update Azure modules runbook](https://github.com/Microsoft/AzureAutomation-Account-Modules-Update).
