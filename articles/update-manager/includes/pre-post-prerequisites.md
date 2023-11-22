---
author: SnehaSudhir
ms.author: sudhirsneha
ms.topic: include
ms.date: 08/02/2023
---


## Prerequisites

1. Ensure that you are using PowerShell **5.1** runbook.
2. Assign permission to managed identities - You can assign permissions to the appropriate [managed identity](../../automation/automation-security-overview.md#managed-identities). The runbook can use either the Automation account system-assigned managed identity or a user-assigned managed identity. 

   You can use either portal or PowerShell cmdlets to assign permissions to each identity:
  
   #### [Using Azure portal](#tab/portal)
    
    Follow the steps in [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md) to assign permissions

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
            -ObjectId $UAMI.PrincipalId`
            -ResourceGroupName $resourceGroup `
            -RoleDefinitionName "Contributor"
    ```
    For the system-assigned managed identity, show `ClientId` and record the value for later use.
        
    ```powershell
             $UAMI.ClientId
    ```
  ---
3. Import the `Az.ResourceGraph` module, ensure the module is updated to ThreadJob with the module version 2.0.3.
