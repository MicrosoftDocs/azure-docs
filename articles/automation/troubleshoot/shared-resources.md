---
title: Troubleshoot Azure Automation shared resource issues
description: This article tells how to troubleshoot and resolve issues with Azure Automation shared resources.
services: automation
ms.subservice:
ms.date: 01/27/2021
ms.topic: troubleshooting 
ms.custom: devx-track-azurepowershell
---

# Troubleshoot shared resource issues

This article discusses issues that might arise when you're using [shared resources](../automation-intro.md#shared-resources) in Azure Automation.

## Modules

### <a name="module-stuck-importing"></a>Scenario: A module is stuck during import

#### Issue

A module is stuck in the *Importing* state when you're importing or updating your Azure Automation modules.

#### Cause

Because importing PowerShell modules is a complex, multistep process, a module might not import correctly, and can be stuck in a transient state. To learn more about the import process, see [Importing a PowerShell module](/powershell/scripting/developer/module/importing-a-powershell-module#the-importing-process).

#### Resolution

To resolve this issue, you must remove the module that is stuck by using the [Remove-AzAutomationModule](/powershell/module/Az.Automation/Remove-AzAutomationModule) cmdlet. You can then retry importing the module.

```azurepowershell-interactive
Remove-AzAutomationModule -Name ModuleName -ResourceGroupName ExampleResourceGroup -AutomationAccountName ExampleAutomationAccount -Force
```

### <a name="update-azure-modules-importing"></a>Scenario: AzureRM modules are stuck during import after an update attempt

#### Issue

A banner with the following message stays in your account after trying to update your AzureRM modules:

```error
Azure modules are being updated
```

#### Cause

There is a known issue with updating the AzureRM modules in an Automation account. Specifically, the problem occurs if the modules are in a resource group with a numeric name starting with 0.

#### Resolution

To update your AzureRM modules in your Automation account, the account must be in a resource group with an alphanumeric name. Resource groups with numeric names starting with 0 are unable to update AzureRM modules at this time.

### <a name="module-fails-to-import"></a>Scenario: Module fails to import or cmdlets can't be executed after importing

#### Issue

A module fails to import, or it imports successfully, but no cmdlets are extracted.

#### Cause

Some common reasons that a module might not successfully import to Azure Automation are:

* The structure doesn't match the structure that Automation needs.
* The module depends on another module that hasn't been deployed to your Automation account.
* The module is missing its dependencies in the folder.
* The [New-AzAutomationModule](/powershell/module/Az.Automation/New-AzAutomationModule) cmdlet is being used to upload the module, and you haven't provided the full storage path or haven't loaded the module by using a publicly accessible URL.

#### Resolution

Use any of these solutions to fix the issue:

* Make sure that the module follows the format: ModuleName.zip -> ModuleName or Version Number -> (ModuleName.psm1, ModuleName.psd1).
* Open the **.psd1** file and see if the module has any dependencies. If it does, upload these modules to the Automation account.
* Make sure that any referenced **.dll** files are present in the module folder.

### <a name="all-modules-suspended"></a>Scenario: Update-AzureModule.ps1 suspends when updating modules

#### Issue

When you're using the [Update-AzureModule.ps1](https://github.com/azureautomation/runbooks/blob/master/Utility/ARM/Update-AzureModule.ps1) runbook to update your Azure modules, the module update process is suspended.

#### Cause

For this runbook, the default setting to determine how many modules are updated simultaneously is 10. The update process is prone to errors when too many modules are being updated at the same time.

#### Resolution

It's not common that all the AzureRM or Az modules are required in the same Automation account. You should only import the specific modules that you need.

> [!NOTE]
> Avoid importing the entire `Az.Automation` or `AzureRM.Automation` module, which imports all contained modules.

If the update process suspends, add the `SimultaneousModuleImportJobCount` parameter to the **Update-AzureModules.ps1** script, and provide a lower value than the default of 10. If you implement this logic, try starting with a value of 3 or 5. `SimultaneousModuleImportJobCount` is a parameter of the **Update-AutomationAzureModulesForAccount** system runbook that is used to update Azure modules. If you make this adjustment, the update process runs longer, but has a better chance of completing. The following example shows the parameter and where to put it in the runbook:

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

When you try to create or update a Run As account, you receive an error similar to the following:

```error
You do not have permissions to create…
```

#### Cause

You don't have the permissions that you need to create or update the Run As account, or the resource is locked at a resource group level.

#### Resolution

To create or update a Run As account, you must have appropriate [permissions](../automation-security-overview.md#permissions) to the various resources used by the Run As account.

If the problem is because of a lock, verify that the lock can be removed. Then go to the resource that is locked in Azure portal, right-click the lock, and select **Delete**.

### <a name="iphelper"></a>Scenario: You receive the error "Unable to find an entry point named 'GetPerAdapterInfo' in DLL 'iplpapi.dll'" when executing a runbook

#### Issue

When you're executing a runbook, you receive the following exception:

```error
Unable to find an entry point named 'GetPerAdapterInfo' in DLL 'iplpapi.dll'
```

#### Cause

This error is most likely caused by an incorrectly configured [Run As account](../automation-security-overview.md).

#### Resolution

Make sure that your Run As account is properly configured. Then verify that you have the proper code in your runbook to authenticate with Azure. The following example shows a snippet of code to authenticate to Azure in a runbook by using a Run As account.

```powershell
$connection = Get-AutomationConnection -Name AzureRunAsConnection
Connect-AzAccount -ServicePrincipal -Tenant $connection.TenantID `
-ApplicationID $connection.ApplicationID -CertificateThumbprint $connection.CertificateThumbprint
```

## Next steps

If this article doesn't resolve your issue, try one of the following channels for additional support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport). This is the official Microsoft Azure account for connecting the Azure community to the right resources: answers, support, and experts.
* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get Support**.
