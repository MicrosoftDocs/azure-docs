---
title: Troubleshoot errors with Azure Automation shared resources
description: Learn how to troubleshoot issues with Azure Automation shared resources
services: automation
author: bobbytreed
ms.author: robreed
ms.date: 03/12/2019
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

### <a name="update-azure-modules-importing"></a>Scenario: AzureRM modules are stuck importing after trying to update them

#### Issue

A banner with the following message stays in your account after trying to update your AzureRM modules:

```error
Azure modules are being updated
```

#### Cause

There is a known issue with updating the AzureRM modules in an Automation Account that is in a resource group with a numeric name that starts with 0.

#### Resolution

To update your Azure modules in your Automation Account, it must be in a resource group that has an alphanumeric name. Resource groups with numeric names starting with 0 are unable to update AzureRM modules at this time.

### <a name="module-fails-to-import"></a>Scenario: Module fails to import or cmdlets can't be executed after importing

#### Issue

A module fails to import or imports successfully, but no cmdlets are extracted.

#### Cause

Some common reasons that a module might not successfully import to Azure Automation are:

* The structure doesn't match the structure that Automation needs it to be in.
* The module depends on another module that hasn't been deployed to your Automation account.
* The module is missing its dependencies in the folder.
* The `New-AzureRmAutomationModule` cmdlet is being used to upload the module, and you haven't given the full storage path or haven't loaded the module by using a publicly accessible URL.

#### Resolution

Any of the following solutions fix the problem:

* Make sure that the module follows the following format:
  ModuleName.Zip **->** ModuleName or Version Number **->** (ModuleName.psm1, ModuleName.psd1)
* Open the .psd1 file and see if the module has any dependencies. If it does, upload these modules to the Automation account.
* Make sure that any referenced .dlls are present in the module folder.

### <a name="all-modules-suspended"></a>Scenario: Update-AzureModule.ps1 suspends when updating modules

#### Issue

When using the [Update-AzureModule.ps1](https://github.com/azureautomation/runbooks/blob/master/Utility/ARM/Update-AzureModule.ps1) runbook to update your Azure modules the module update the update process gets suspended.

#### Cause

The default setting to determine how many modules get updated simultaneously is 10 when using the `Update-AzureModule.ps1` script. The update process is prone to errors when too many modules are being updated at the same time.

#### Resolution

It's not common that all the AzureRM modules are required in the same Automation account. It's recommended to only import the AzureRM modules that you need.

> [!NOTE]
> Avoid importing the **AzureRM** module. Importing the **AzureRM** modules causes all **AzureRM.\*** modules to be imported, this is not recommened.

If the update process suspends, you need to add the `SimultaneousModuleImportJobCount` parameter to the `Update-AzureModules.ps1` script and provide a lower value than the default that is 10. It's recommended if you implement this logic, to start with a value of 3 or 5. `SimultaneousModuleImportJobCount` is a parameter of the `Update-AutomationAzureModulesForAccount` system runbook that is used to update Azure modules. This change makes the process run longer, but has a better chance of completing. The following example shows the parameter and where to put it in the runbook:

 ```powershell
         $Body = @"
            {
               "properties":{
               "runbook":{
                   "name":"Update-AutomationAzureModulesForAccount"
               },
               "parameters":{
                    ...
                    "SimultaneousModuleImportJobCount":"3",
                    ... 
               }
              }
           }
"@
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

If the issue is because of a lock, verify that the lock is ok to remove it. Then navigate to the resource that is locked, right-click the lock and choose **Delete** to remove the lock.

### <a name="iphelper"></a>Scenario: You receive the error "Unable to find an entry point named 'GetPerAdapterInfo' in DLL 'iplpapi.dll'" when executing a runbook.

#### Issue

When executing a runbook you receive the following exception:

```error
Unable to find an entry point named 'GetPerAdapterInfo' in DLL 'iplpapi.dll'
```

#### Cause

This error is most likely caused by an incorrectly configured [Run As Account](../manage-runas-account.md).

#### Resolution

Make sure your [Run As Account](../manage-runas-account.md) is properly configured. Once it is configured correctly, ensure you have the proper code in your runbook to authenticate with Azure. The following example shows a snippet of code to authenticate to Azure in a runbook using a Run As Account.

```powershell
$connection = Get-AutomationConnection -Name AzureRunAsConnection
Connect-AzureRmAccount -ServicePrincipal -Tenant $connection.TenantID `
-ApplicationID $connection.ApplicationID -CertificateThumbprint $connection.CertificateThumbprint
```

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/)
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
