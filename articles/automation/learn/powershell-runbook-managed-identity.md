---
title: Use managed identity with PowerShell runbook in Azure Automation
description: This article teaches you how to use managed identities with a PowerShell runbook.
services: automation
ms.subservice: process-automation
ms.date: 08/03/2021
ms.topic: conceptual 
#Customer intent: As a developer, I want PowerShell runbooks to execute code using a manged identity.
---

# Use managed identity with PowerShell runbook in Azure Automation

This guide walks you through the creation of a [PowerShell runbook](../automation-runbook-types.md#powershell-runbooks) in Azure Automation that uses [managed identities](../automation-security-overview.md#managed-identities-preview), rather than the Run As account to interact with resources. PowerShell runbooks are based on Windows PowerShell. A managed identity from Azure Active Directory (Azure AD) allows your runbook to easily access other Azure AD-protected resources.

> [!div class="checklist"]
> * Create user-assigned managed identities
> * Create automation account
> * Import PowerShell modules
> * Create a PowerShell runbook
> * Assign permissions to managed identities
> * Edit runbook to use managed identities

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* The [Azure Az PowerShell module](/powershell/azure/new-azureps-module-az) installed on your machine. To install or upgrade, see [How to install the Azure Az PowerShell module](/powershell/azure/install-az-ps).
* An Azure virtual machine. Since you stop and start this machine, it shouldn't be a production VM.
* A general familiarity with [Automation runbooks](../manage-runbooks.md).
* A general familiarity with [Automation accounts](../automation-security-overview.md).

## Sign in to Azure

Sign in to Azure interactively using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet and follow the instructions.

```powershell
# Sign in to your Azure subscription
$sub = Get-AzSubscription -ErrorAction SilentlyContinue
if(-not($sub))
{
    Connect-AzAccount -Subscription
}

# If you have multiple subscriptions, set the one to use
# Select-AzSubscription -SubscriptionId <SUBSCRIPTIONID>
```

Provide an appropriate value for the variables below and then execute the script.

```powershell
$subscriptionID = "subscriptionID"
$resourceGroup = "resourceGroupName"

# These values are used in this guide
$automationAccount = "xAutomationAccount"
$userAssignedOne = "xUAMI1"
$userAssignedTwo = "xUAMI2"
$userAssignedThree = "xUAMI3"
```

## Create user-assigned managed identities

Only one user-assigned managed identity is needed; however, for testing purposes, this guide will use three. Use PowerShell cmdlet [New-AzUserAssignedIdentity](/powershell/module/az.managedserviceidentity/new-azuserassignedidentity) to create the identities.

```powershell
New-AzUserAssignedIdentity `
    -ResourceGroupName $resourceGroup `
    -Location "westus" `
    -Name $userAssignedOne

New-AzUserAssignedIdentity `
    -ResourceGroupName $resourceGroup `
    -Location "westus" `
    -Name $userAssignedTwo

New-AzUserAssignedIdentity `
    -ResourceGroupName $resourceGroup `
    -Location "westus" `
    -Name $userAssignedThree
```

## Create Automation account

Use PowerShell cmdlet [New-AzAutomationAccount](/powershell/module/az.automation/new-azautomationaccount) to create the Automation account. A Run As account will **not** be created. The command below will also generate and assign a new system-assigned managed identity to the Automation account. Two of the user-assigned managed identities will be associated with the account as well.

```powershell
New-AzAutomationAccount `
    -ResourceGroupName $resourceGroup `
    -Name $automationAccount `
    -Location "westus" `
    -AssignSystemIdentity `
    -AssignUserIdentity "/subscriptions/$subscriptionID/resourcegroups/$resourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$userAssignedOne", `
        "/subscriptions/$subscriptionID/resourcegroups/$resourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$userAssignedTwo"
```

## Import Az modules

Az modules: `Az.Accounts`, `Az.Automation`, `Az.ManagedServiceIdentity`, and `Az.Compute` need to be imported into the Automation account. Use PowerShell cmdlet [New-AzAutomationModule](/powershell/module/az.automation/new-azautomationmodule) to perform the import.

```powershell
# Az.Accounts must be fully installed first
$moduleName = "Az.Accounts"
$moduleVersion = "2.5.2"

New-AzAutomationModule `
    -ResourceGroupName $resourceGroup `
    -AutomationAccountName $automationAccount `
    -Name $moduleName `
    -ContentLinkUri "https://www.powershellgallery.com/api/v2/package/$moduleName/$moduleVersion"


while ((Get-AzAutomationModule `
    -ResourceGroupName $resourceGroup `
    -AutomationAccountName $automationAccount `
    -Name $moduleName).ProvisioningState -ne "Succeeded") 
{
   Write-Output "Wait"
   Start-Sleep -Seconds 5
}
##################################################

$moduleName = "Az.Automation"
$moduleVersion = "1.7.0"

New-AzAutomationModule `
    -ResourceGroupName $resourceGroup `
    -AutomationAccountName $automationAccount `
    -Name $moduleName `
    -ContentLinkUri "https://www.powershellgallery.com/api/v2/package/$moduleName/$moduleVersion"
##################################################

$moduleName = "Az.ManagedServiceIdentity"
$moduleVersion = "0.7.3"

New-AzAutomationModule `
    -ResourceGroupName $resourceGroup `
    -AutomationAccountName $automationAccount `
    -Name $moduleName `
    -ContentLinkUri "https://www.powershellgallery.com/api/v2/package/$moduleName/$moduleVersion"
##################################################

$moduleName = "Az.Compute"
$moduleVersion = "4.16.0"

New-AzAutomationModule `
    -ResourceGroupName $resourceGroup `
    -AutomationAccountName $automationAccount `
    -Name $moduleName `
    -ContentLinkUri "https://www.powershellgallery.com/api/v2/package/$moduleName/$moduleVersion"
```

## Create PowerShell runbook

Initially, the runbook will only work for the system-assigned managed identity. Later, the runbook will be revised to allow for user-assigned managed identities.

1. Sign in to the [Azure portal](https://portal.azure.com/), and navigate to your Automation account.

1. Under **Process Automation**, select **Runbooks**.

1. Select **Create a runbook**.
    1. Name the runbook `miTesting`.
    1. From the **Runbook type** drop-down menu, select **PowerShell**.
    1. Select **Create**.

1. In the runbook editor, paste the following code:

    ```powershell
    Param(
        [string]$resourceGroup,
        [string]$VMName
    )
    
    # Ensures you do not inherit an AzContext in your runbook
    Disable-AzContextAutosave -Scope Process | Out-Null
    
    # Connect using a Managed Service Identity
    Connect-AzAccount -Identity
    
    # Get current state of VM
    $status = (Get-AzVM -ResourceGroupName $ResourceGroup -Name $VMName -Status).Statuses[1].Code
    
    Write-Output "`r`n Beginning VM status: $status `r`n"
    
    # Start or stop VM based on current state
    if($status -eq "Powerstate/deallocated")
        {
            Start-AzVM -Name $VMName -ResourceGroupName $ResourceGroup
        }
    elseif ($status -eq "Powerstate/running")
        {
            Stop-AzVM -Name $VMName -ResourceGroupName $ResourceGroup -Force
        }
    
    # Get new state of VM
    $status = (Get-AzVM -ResourceGroupName $ResourceGroup -Name $VMName -Status).Statuses[1].Code  
    
    Write-Output "`r`n Ending VM status: $status `r`n `r`n"
    
    Write-Output "Account ID of current context: " (Get-AzContext).Account.Id
    ```

    The script will connect with the system-assigned managed identity, identify the power state of the VM, and then change the current power state of the VM.

1. Select **Save** and then **Test pane**.

1. Populate the parameters `RESOURCEGROUP` and `VMNAME` with appropriate values and then select **Start**. The runbook will start and eventually produce an error message that doesn't clearly identify the issue. The runbook fails because the system-assigned managed identity currently doesn't have the necessary permissions. The output should look similar to the following:

    ```output
    'this.Client.SubscriptionId' cannot be null.
    System.Management.Automation.RuntimeException: Cannot index into a null array.
       at CallSite.Target(Closure , CallSite , Object , Int32 )
       at System.Dynamic.UpdateDelegates.UpdateAndExecute2[T0,T1,TRet](CallSite site, T0 arg0, T1 arg1)
       at System.Management.Automation.Interpreter.DynamicInstruction`3.Run(InterpretedFrame frame)
       at System.Management.Automation.Interpreter.EnterTryCatchFinallyInstruction.Run(InterpretedFrame frame)
    ```

## Assign permissions

Assign permissions to the system-assigned managed identity to allow it to stop and start a virtual machine.

1. Use PowerShell cmdlet [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) to assign a role to the system-assigned managed identity.

    ```powershell
    $role1 = "DevTest Labs User"
    
    $SAMI = (Get-AzAutomationAccount -ResourceGroupName $ResourceGroup -Name $automationAccount).Identity.PrincipalId
    New-AzRoleAssignment `
        -ObjectId $SAMI `
        -ResourceGroupName $resourceGroup `
        -RoleDefinitionName $role1
    ```

1. Return to the runbook and select **Start**. The runbook should now succeed and the output should look similar to the following:

    ```output
     Beginning VM status: PowerState/running 
    
    OperationId : 5b707401-f415-4268-9b43-be1f73ddc54b
    Status      : Succeeded
    StartTime   : 8/3/2021 10:52:09 PM
    EndTime     : 8/3/2021 10:52:50 PM
    Error       : 
    Name        : 
    
     Ending VM status: PowerState/deallocated 
     
    Account ID of current context: 
    MSI@50342
    ```

1. The same role assignment is needed for the user-assigned managed identity

    ```powershell
    $UAMI = (Get-AzUserAssignedIdentity -ResourceGroupName $resourceGroup -Name $userAssignedOne).PrincipalId
    New-AzRoleAssignment `
        -ObjectId $UAMI `
        -ResourceGroupName $resourceGroup `
        -RoleDefinitionName $role1
    ```

1. Additional permissions for the system-assigned managed identity are needed to execute `Get-AzUserAssignedIdentity` and `Get-AzAutomationAccount` in the revised script.

    ```powershell
    $role2 = "Reader"
    New-AzRoleAssignment `
        -ObjectId $SAMI `
        -ResourceGroupName $resourceGroup `
        -RoleDefinitionName $role2
    ```

## Edit runbook

This revised script will allow you to choose a system-assigned managed identity or a user-assigned managed identity.

1. Return to the runbook and close the test pane. From the editor, replace the contents with the following:

    ```powershell
    Param(
     [string]$VMName,
     [string]$method,
     [string]$UAMI 
    )
    
    $resourceGroup = "resourceGroupName"
    $automationAccount = "xAutomationAccount"
    
    # Ensures you do not inherit an AzContext in your runbook
    Disable-AzContextAutosave -Scope Process | Out-Null
    
    # Connect using a Managed Service Identity
    try {
            Connect-AzAccount -Identity -ErrorAction stop -WarningAction SilentlyContinue | Out-Null
        }
    catch{
            Write-Output "There is no system-assigned user identity. Aborting."; 
            exit
        }
    
    if ($method -eq "SA")
        {
            Write-Output "Using system-assigned managed identity"
        }
    elseif ($method -eq "UA")
        {
            Write-Output "Using user-assigned managed identity"
    
            # Connects using the Managed Service Identity of the named user-assigned managed identity
            $identity = Get-AzUserAssignedIdentity -ResourceGroupName $ResourceGroup -Name $UAMI
    
            # validates assignment only, not perms
            if ((Get-AzAutomationAccount -ResourceGroupName $ResourceGroup -Name $automationAccount).Identity.UserAssignedIdentities.Values.PrincipalId.Contains($identity.PrincipalId))
                {
                    Connect-AzAccount -Identity -AccountId $identity.ClientId | Out-Null
                }
            else {
                    Write-Output "Invalid or unassigned user-assigned managed identity"
                    exit
                }
        }
    else {
            Write-Output "Invalid method. Choose UA or SA."
            exit
         }
    
    # Get current state of VM
    $status = (Get-AzVM -ResourceGroupName $ResourceGroup -Name $VMName -Status).Statuses[1].Code
    
    Write-Output "`r`n Beginning VM status: $status `r`n"
    
    # Start or stop VM based on current state
    if($status -eq "Powerstate/deallocated")
        {
            Start-AzVM -Name $VMName -ResourceGroupName $ResourceGroup
        }
    elseif ($status -eq "Powerstate/running")
        {
            Stop-AzVM -Name $VMName -ResourceGroupName $ResourceGroup -Force
        }
    
    # Get new state of VM
    $status = (Get-AzVM -ResourceGroupName $ResourceGroup -Name $VMName -Status).Statuses[1].Code  
    
    Write-Output "`r`n Ending VM status: $status `r`n `r`n"
    
    Write-Output "Account ID of current context: " (Get-AzContext).Account.Id
    ```

1. In the editor, on line 7, assign an appropriate value for the `$resourceGroup` variable.

1. Select **Save** and then **Test pane**.

1. Populate the parameter `VMNAME` with the name of your virtual machine. Enter `SA` for the `METHOD` parameter and `xUAMI1` for the `UAMI` parameter. The runbook will attempt to change the power state of your VM using the system-assigned managed identity.

1. Select **Start**. The output should be similar to the output from the first execution.

1. Change the value for the `METHOD` parameter to `UA`.

1. Select **Start**. The runbook will attempt to change the power state of your VM using the named user-assigned managed identity. The output should look similar to the following:

    ```output
    Using user-assigned managed identity
    
     Beginning VM status: PowerState/running 
    
    OperationId : 679fcadf-d0b9-406a-9282-66bc211a9fbf
    Status      : Succeeded
    StartTime   : 8/3/2021 11:06:03 PM
    EndTime     : 8/3/2021 11:06:49 PM
    Error       : 
    Name        : 
    
     Ending VM status: PowerState/deallocated 
     
    Account ID of current context: 
    9034f5d3-c46d-44d4-afd6-c78aeab837ea
    ```

1. Change the value for the `UAMI` parameter to `xUAMI2`. Recall that no permissions were assigned to `xUAMI2`.

1. Select **Start**. The runbook will attempt to change the power state of your VM using the named user-assigned managed identity.  The output should look similar to the following:

    ```.output
    Using user-assigned managed identity
    'this.Client.SubscriptionId' cannot be null.
    System.Management.Automation.RuntimeException: Cannot index into a null array.
       at CallSite.Target(Closure , CallSite , Object , Int32 )
       at System.Dynamic.UpdateDelegates.UpdateAndExecute2[T0,T1,TRet](CallSite site, T0 arg0, T1 arg1)
       at System.Management.Automation.Interpreter.DynamicInstruction`3.Run(InterpretedFrame frame)
       at System.Management.Automation.Interpreter.EnterTryCatchFinallyInstruction.Run(InterpretedFrame frame)
    
     Beginning VM status:  
    'this.Client.SubscriptionId' cannot be null.
    System.Management.Automation.RuntimeException: Cannot index into a null array.
       at CallSite.Target(Closure , CallSite , Object , Int32 )
       at System.Dynamic.UpdateDelegates.UpdateAndExecute2[T0,T1,TRet](CallSite site, T0 arg0, T1 arg1)
       at System.Management.Automation.Interpreter.DynamicInstruction`3.Run(InterpretedFrame frame)
       at System.Management.Automation.Interpreter.EnterTryCatchFinallyInstruction.Run(InterpretedFrame frame)
    
     Ending VM status:  
     
    Account ID of current context: 
    75cf07a2-2e6e-41cf-8d3d-d49028ef9a72
    ```

1. Change the value for the `UAMI` parameter to `xUAMI3`. Recall that `xUAMI3` wasn't assigned to Automation account.

1. Select **Start**. The runbook will attempt to change the power state of your VM using the named user-assigned managed identity.  The output should look similar to the following:

    ```output
    Using user-assigned managed identity
    Invalid or unassigned user-assigned managed identity
    ```

1. Change the value for the `UAMI` parameter to `xUAMI4`. Recall that we didn't create an identity named `xUAMI4`.

1. Select **Start**. The runbook will attempt to change the power state of your VM using the named user-assigned managed identity.  The output should look similar to the following:

    ```output
    Using user-assigned managed identity
    The Resource 'Microsoft.ManagedIdentity/userAssignedIdentities/xUAMI4' under resource group 'ContosoLab' was not found. For more details please go to https://aka.ms/ARMResourceNotFoundFix
    Invalid or unassigned user-assigned managed identity
    ```

## Clean up Resources

Remove any resources no longer needed.

```powershell
#Remove runbook
Remove-AzAutomationRunbook `
    -ResourceGroupName $resourceGroupName `
    -AutomationAccountName $automationAccount `
    -Name "miTesting" `
    -Force

# Remove role assignments
Remove-AzRoleAssignment `
    -ObjectId $UAMI `
    -ResourceGroupName $resourceGroup `
    -RoleDefinitionName $role1

Remove-AzRoleAssignment `
    -ObjectId $SAMI `
    -ResourceGroupName $resourceGroup `
    -RoleDefinitionName $role2

Remove-AzRoleAssignment `
    -ObjectId $SAMI `
    -ResourceGroupName $resourceGroup `
    -RoleDefinitionName $role1

# Remove modules
$moduleName = "Az.Compute"
$moduleVersion = "4.16.0"

Remove-AzAutomationModule `
    -ResourceGroupName $resourceGroupName `
    -AutomationAccountName $automationAccount `
    -Name $moduleName `
    -Force

$moduleName = "Az.ManagedServiceIdentity"
$moduleVersion = "0.7.3"

Remove-AzAutomationModule `
    -ResourceGroupName $resourceGroupName `
    -AutomationAccountName $automationAccount `
    -Name $moduleName `
    -Force

$moduleName = "Az.Automation"
$moduleVersion = "1.7.0"

Remove-AzAutomationModule `
    -ResourceGroupName $resourceGroupName `
    -AutomationAccountName $automationAccount `
    -Name $moduleName `
    -Force


$moduleName = "Az.Accounts"
$moduleVersion = "2.5.2"

Remove-AzAutomationModule `
    -ResourceGroupName $resourceGroupName `
    -AutomationAccountName $automationAccount `
    -Name $moduleName `
    -Force

# Remove Automation account
Remove-AzAutomationAccount `
    -ResourceGroupName $resourceGroup `
    -Name $automationAccount `
    -Force

# Remove managed identities
Remove-AzUserAssignedIdentity `
    -ResourceGroupName $resourceGroup `
    -Name $userAssignedOne `
    -Force

Remove-AzUserAssignedIdentity `
    -ResourceGroupName $resourceGroup `
    -Name $userAssignedTwo `
    -Force

Remove-AzUserAssignedIdentity `
    -ResourceGroupName $resourceGroup `
    -Name $userAssignedThree `
    -Force
```

## Next steps

In this guide, you learned how to create a [PowerShell runbook](../automation-runbook-types.md#powershell-runbooks) in Azure Automation that uses [managed identities](../automation-security-overview.md#managed-identities-preview), rather than the Run As account to interact with resources. Here are some other you may find helpful:

- [Using a user-assigned managed identity for an Azure Automation account](../add-user-assigned-identity.md)
- [Manage an Azure Automation Run As account](../manage-runas-account.md)