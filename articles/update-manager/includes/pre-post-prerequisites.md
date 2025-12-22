---
author: habibaum
ms.author: v-uhabiba
ms.topic: include
ms.date: 09/24/2024
# Customer intent: As a cloud administrator, I want to assign permissions to managed identities by using PowerShell, so that I can ensure secure access for my automation runbooks.
---


## Prerequisites

1. Ensure that you're using a PowerShell *7.4* runbook.

2. Assign permissions to the appropriate [managed identity](../../automation/automation-security-overview.md#managed-identities). The runbook can use the Automation account's system-assigned managed identity or a user-assigned managed identity.

   The following script examples (starting and stopping VMs) require the Virtual Machine Contributor role or a custom role with these specific permissions:

   - Microsoft.Compute/virtualMachines/start/action
   - Microsoft.Compute/virtualMachines/deallocate/action
   - Microsoft.Compute/virtualMachines/restart/action
   - Microsoft.Compute/virtualMachines/powerOff/action

   You can use either the Azure portal or Azure PowerShell cmdlets to assign permissions to each identity:
  
   #### [Azure portal](#tab/portal)

    To assign permissions, follow the steps in [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

   #### [Azure PowerShell](#tab/powershell)

    To assign a role to the system-assigned managed identity, use the [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) cmdlet:

    ```powershell
    New-AzRoleAssignment `
                   -ObjectId $SA_PrincipalId `
                   -ResourceGroupName $resourceGroup `
                   -RoleDefinitionName "Contributor"
    ```

    Assign a role to a user-assigned managed identity:

    ```powershell
    New-AzRoleAssignment `
                   -ObjectId $UAMI.PrincipalId `
                   -ResourceGroupName $resourceGroup `
                   -RoleDefinitionName "Contributor"
    ```

    For the system-assigned managed identity, show `ClientId` and record the value for later use:

    ```powershell
    $UAMI.ClientId
    ```

   ---

3. Import the `Az.ResourceGraph` module. Ensure that the module is updated to ThreadJob with the module version 2.0.3.
