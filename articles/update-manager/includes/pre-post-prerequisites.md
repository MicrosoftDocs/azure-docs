---
author: habibaum
ms.author: v-uhabiba
ms.topic: include
ms.date: 09/24/2024
# Customer intent: As a cloud administrator, I want to assign permissions to managed identities using PowerShell, so that I can ensure secure access for my automation runbooks.
---


## Prerequisites

1. Ensure that you're using PowerShell **7.4** runbook.
2. Assign permission to managed identities. You can assign permissions to the appropriate [managed identity](../../automation/automation-security-overview.md#managed-identities). The runbook can use either the Automation account system-assigned managed identity or a user-assigned managed identity.

   For the script examples below (Start VMs and Stop VMs), the Virtual Machine Contributor role is required or a Custom Role with these specific permissions:

   - Microsoft.Compute/virtualMachines/start/action
   - Microsoft.Compute/virtualMachines/deallocate/action
   - Microsoft.Compute/virtualMachines/restart/action
   - Microsoft.Compute/virtualMachines/powerOff/action

   You can use either portal or PowerShell cmdlets to assign permissions to each identity:
  
   #### [Using Azure portal](#tab/portal)
    
    Follow the steps in [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.yml) to assign permissions

   #### [Using Azure PowerShell](#tab/powershell)

    Use PowerShell cmdlet [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) to assign a role to the system-assigned managed identity.

    ```powershell
   New-AzRoleAssignment `
                   -ObjectId $SA_PrincipalId `
                   -ResourceGroupName $resourceGroup `
                   -RoleDefinitionName "Contributor"
    ```        

    Assign a role to a user-assigned managed identity.

    ```powershell
   New-AzRoleAssignment `
                   -ObjectId $UAMI.PrincipalId `
                   -ResourceGroupName $resourceGroup `
                   -RoleDefinitionName "Contributor"
    ```
    For the system-assigned managed identity, show `ClientId` and record the value for later use.

    ```powershell
    $UAMI.ClientId
    ```
  ---

3. Import the `Az.ResourceGraph` module, ensure the module is updated to ThreadJob with the module version 2.0.3.
