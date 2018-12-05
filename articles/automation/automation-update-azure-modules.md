---
title: Update Azure modules in Azure Automation
description: This article describes how you can now update common Azure PowerShell modules provided by default in Azure Automation.
services: automation
ms.service: automation
ms.component: process-automation
author: georgewallace
ms.author: gwallace
ms.date: 12/04/2018
ms.topic: conceptual
manager: carmonm
---

# How to update Azure PowerShell modules in Azure Automation

The most common Azure PowerShell modules are provided by default in each Automation account. The Azure team updates the Azure modules regularly. In your Automation account, you're provided a way to update the modules in the account when new versions are available from the portal.

Because modules are updated regularly by the product group, changes can occur with the included cmdlets. This action may negatively impact your runbooks depending on the type of change, such as renaming a parameter or deprecating a cmdlet entirely. To avoid impacting your runbooks and the processes they automate, test and validate before proceeding. If you don't have a dedicated Automation account intended for this purpose, consider creating one so that you can test many different scenarios during the development of your runbooks. This testing should include iterative changes such as updating the PowerShell modules. If you develop your scripts locally it is recommended to have the same module versions locally that you have in your Automation Account when testing to ensure you'll receive the same results. After the results are validated and you've applied any changes required, you can move the changes to production.

> [!NOTE]
> A new Automation account might not contain the latest modules.

## Updating Azure Modules

1. In the Modules page of your Automation account, there's an option called **Update Azure Modules**. It's always enabled.<br><br> ![Update Azure Modules option in Modules page](media/automation-update-azure-modules/automation-update-azure-modules-option.png)

  > [!NOTE]
  > Before updating your Azure modules it's recommended that you update them in a test Automation Account to ensure that your existing scripts work as expected before updating your Azure modules.
  >
  > The **Update Azure Modules** button is only available in the public cloud. It's not available in the [sovereign regions](https://azure.microsoft.com/global-infrastructure/). Please see [alternative ways to update your modules](#alternative-ways-to-update-your-modules) section to learn more.

2. Click **Update Azure Modules**, a confirmation notification is shown that asks if you want to continue.<br><br> ![Update Azure Modules notification](media/automation-update-azure-modules/automation-update-azure-modules-popup.png)

3. Click **Yes** and the module update process begins. The update process takes about 15-20 minutes to update the following modules:

  * Azure
  *	Azure.Storage
  *	AzureRm.Automation
  *	AzureRm.Compute
  *	AzureRm.Profile
  *	AzureRm.Resources
  *	AzureRm.Sql
  * AzureRm.Storage

    If the modules are already up-to-date, then the process completes in a few seconds. When the update process completes, you're notified.<br><br> ![Update Azure Modules update status](media/automation-update-azure-modules/automation-update-azure-modules-updatestatus.png)

    The .NET core AzureRm modules (AzureRm.*.Core) aren't supported in Azure Automation and can't be imported.

> [!NOTE]
> Azure Automation uses the latest modules in your Automation account when a new scheduled job is run.  

If you use cmdlets from these Azure PowerShell modules in your runbooks, you want to run this update process every month or so to make sure that you have the latest modules. Azure Automation uses the `AzureRunAsConnection` connection to authenticate when updating the modules. If the service principal is expired or no longer exists on the subscription level, the module update will fail.

## Alternative ways to update your modules

As mentioned, the **Update Azure Modules** button isn't available in the sovereign clouds, it's only available in the global Azure cloud. This is due to the fact that the latest version of the Azure PowerShell modules from the PowerShell Gallery may not work with the Resource Manager resources currently deployed in these clouds.

You can import and run the [Update-AzureModule.ps1](https://github.com/azureautomation/runbooks/blob/master/Utility/ARM/Update-AzureModule.ps1) runbook to attempt to update the Azure modules in your Automation Account. It is generally a good idea to update all Azure modules at the same time. But, this process may fail if the versions you are trying to import from the gallery are not be compatible with the Azure services currently deployed to the target Azure Environment. This may require you to ensure the compatible versions of modules are specified in the runbook parameters.

Use the `AzureRmEnvironment` parameter to pass the correct environment to the runbook.  Acceptable values are **AzureCloud**, **AzureChinaCloud**, **AzureGermanCloud**, and **AzureUSGovernment**. These values can be obtained from using `Get-AzureRmEnvironment | select Name`. If you don't pass a value to this parameter, the runbook will default to the Azure public cloud **AzureCloud**

If you want to use a specific Azure PowerShell module version instead of the latest available on the PowerShell Gallery, pass these versions to the optional `ModuleVersionOverrides` parameter of the **Update-AzureModule** runbook. For examples, see the  [Update-AzureModule.ps1](https://github.com/azureautomation/runbooks/blob/master/Utility/ARM/Update-AzureModule.ps1) runbook. Azure PowerShell modules that aren't mentioned in the `ModuleVersionOverrides` parameter are updated with the latest module versions on the PowerShell Gallery. If you pass nothing to the `ModuleVersionOverrides` parameter, all modules are updated with the latest module versions on the PowerShell Gallery. This behavior is the same as the **Update Azure Modules** button.

## Next steps

* To learn more about Integration Modules and how to create custom modules to further integrate Automation with other systems, services, or solutions, see [Integration Modules](automation-integration-modules.md).

