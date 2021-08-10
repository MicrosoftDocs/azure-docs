---
title: Use managed identities with a PowerShell runbook in Azure Automation
description: In this tutorial, you learn how to use managed identities with a PowerShell runbook in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 08/10/2021
ms.topic: tutorial 
#Customer intent: As a developer, I want PowerShell runbooks to execute code using a manged identity.
---

# Tutorial: Use managed identities with a PowerShell runbook in Azure Automation

In this tutorial, you will create a [PowerShell runbook](../automation-runbook-types.md#powershell-runbooks) in Azure Automation that uses [managed identities](../automation-security-overview.md#managed-identities-preview), rather than the Run As account to interact with resources. PowerShell runbooks are based on Windows PowerShell. A managed identity from Azure Active Directory (Azure AD) allows your runbook to easily access other Azure AD-protected resources.

> [!div class="checklist"]
> * Assign permissions to managed identities
> * Create a PowerShell runbook

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* An Azure Automation account with at least one user-assigned managed identity. For more information, see [Using a user-assigned managed identity for an Azure Automation account](../add-user-assigned-identity.md).
* Az modules: `Az.Accounts`, `Az.Automation`, `Az.ManagedServiceIdentity`, and `Az.Compute` imported into the Automation account. For more information, see [Import Az modules](../shared-resources/modules.md#import-az-modules).
* The [Azure Az PowerShell module](/powershell/azure/new-azureps-module-az) installed on your machine. To install or upgrade, see [How to install the Azure Az PowerShell module](/powershell/azure/install-az-ps).
* An [Azure virtual machine](../../virtual-machines/windows/quick-create-powershell.md). Since you stop and start this machine, it shouldn't be a production VM.
* A general familiarity with [Automation runbooks](../manage-runbooks.md).

## Assign permissions to managed identities

Assign permissions to the managed identities to allow them to stop and start a virtual machine.

1. Sign in to Azure interactively using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet and follow the instructions.

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

1. Provide an appropriate value for the variables below and then execute the script.

    ```powershell
    $resourceGroup = "resourceGroupName"
    
    # These values are used in this tutorial
    $automationAccount = "xAutomationAccount"
    $userAssignedOne = "xUAMI"
    ```

1. Use PowerShell cmdlet [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) to assign a role to the system-assigned managed identity.

    ```powershell
    $role1 = "DevTest Labs User"
    
    $SAMI = (Get-AzAutomationAccount -ResourceGroupName $resourceGroup -Name $automationAccount).Identity.PrincipalId
    New-AzRoleAssignment `
        -ObjectId $SAMI `
        -ResourceGroupName $resourceGroup `
        -RoleDefinitionName $role1
    ```

1. The same role assignment is needed for the user-assigned managed identity

    ```powershell
    $UAMI = (Get-AzUserAssignedIdentity -ResourceGroupName $resourceGroup -Name $userAssignedOne).PrincipalId
    New-AzRoleAssignment `
        -ObjectId $UAMI `
        -ResourceGroupName $resourceGroup `
        -RoleDefinitionName $role1
    ```

1. Additional permissions for the system-assigned managed identity are needed to execute cmdlets `Get-AzUserAssignedIdentity` and `Get-AzAutomationAccount` as used in this tutorial.

    ```powershell
    $role2 = "Reader"
    New-AzRoleAssignment `
        -ObjectId $SAMI `
        -ResourceGroupName $resourceGroup `
        -RoleDefinitionName $role2
    ```

## Create PowerShell runbook

Create a runbook that will allow execution by either managed identity. The runbook will start a stopped VM, or stop a running VM.

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
     [string]$VMName,
     [string]$method,
     [string]$UAMI 
    )
    
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
            $identity = Get-AzUserAssignedIdentity -ResourceGroupName $resourceGroup -Name $UAMI
    
            # validates assignment only, not perms
            if ((Get-AzAutomationAccount -ResourceGroupName $resourceGroup -Name $automationAccount).Identity.UserAssignedIdentities.Values.PrincipalId.Contains($identity.PrincipalId))
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
    $status = (Get-AzVM -ResourceGroupName $resourceGroup -Name $VMName -Status).Statuses[1].Code
    
    Write-Output "`r`n Beginning VM status: $status `r`n"
    
    # Start or stop VM based on current state
    if($status -eq "Powerstate/deallocated")
        {
            Start-AzVM -Name $VMName -ResourceGroupName $resourceGroup
        }
    elseif ($status -eq "Powerstate/running")
        {
            Stop-AzVM -Name $VMName -ResourceGroupName $resourceGroup -Force
        }
    
    # Get new state of VM
    $status = (Get-AzVM -ResourceGroupName $resourceGroup -Name $VMName -Status).Statuses[1].Code  
    
    Write-Output "`r`n Ending VM status: $status `r`n `r`n"
    
    Write-Output "Account ID of current context: " (Get-AzContext).Account.Id
    ```

1. In the editor, on line 8, revise the value for the `$automationAccount` variable as needed.

1. Select **Save** and then **Test pane**.

1. Populate the parameters `RESOURCEGROUP` and `VMNAME` with the appropriate values. Enter `SA` for the `METHOD` parameter and `xUAMI` for the `UAMI` parameter. The runbook will attempt to change the power state of your VM using the system-assigned managed identity.

1. Select **Start**. Once the runbook completes, the output should look similar to the following:

    ```output
     Beginning VM status: PowerState/deallocated
    
    OperationId : 5b707401-f415-4268-9b43-be1f73ddc54b
    Status      : Succeeded
    StartTime   : 8/3/2021 10:52:09 PM
    EndTime     : 8/3/2021 10:52:50 PM
    Error       : 
    Name        : 
    
     Ending VM status: PowerState/running 
     
    Account ID of current context: 
    MSI@50342
    ```

1. Change the value for the `METHOD` parameter to `UA`.

1. Select **Start**. The runbook will attempt to change the power state of your VM using the named user-assigned managed identity. Once the runbook completes, the output should look similar to the following:

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

## Clean up Resources

Remove any resources no longer needed.

```powershell
#Remove runbook
Remove-AzAutomationRunbook `
    -ResourceGroupName $resourceGroup `
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
```

## Next steps

In this tutorial, you created a [PowerShell runbook](../automation-runbook-types.md#powershell-runbooks) in Azure Automation that used [managed identities](../automation-security-overview.md#managed-identities-preview), rather than the Run As account to interact with resources. For more information about managed identities, see:

> [!div class="nextstepaction"]
> [Using a user-assigned managed identity for an Azure Automation account](../add-user-assigned-identity.md)