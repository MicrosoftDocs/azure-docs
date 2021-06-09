---
title: Assign Azure AD roles to users - Azure Active Directory
description: Learn how to grant access to users in Azure Active Directory by assigning Azure AD roles.
services: active-directory
author: rolyon
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: how-to
ms.date: 06/09/2021
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---
# Assign Azure AD roles to users

To grant access to users in Azure Active Directory (Azure AD), you assign Azure AD roles. A role is a collection of permissions. This article describes how to assign Azure AD roles using the Azure portal and PowerShell.

## Prerequisites

- Privileged Role Administrator or Global Administrator
- Azure AD Premium P2 license when using Privileged Identity Management (PIM)
- AzureADPreview module when using PowerShell

For more information, see [Prerequisites to use PowerShell or Graph Explorer](prerequisites.md).

## Azure portal

Follow these steps to assign Azure AD roles using the Azure portal. Your experience will be different depending on whether you have [Azure AD Privileged Identity Management (PIM)](../privileged-identity-management/pim-configure.md) enabled.

### Assign a role

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory** > **Roles and administrators** to see the list of all available roles.

    ![Roles and administrators page in Azure Active Directory.](./media/manage-roles-portal/roles-and-administrators.png)

1. Select a role to see its assignments.

    To help you find the role you need, use **Add filters** to filter the roles.

1. Select **Add assignments** and then select the users you want to assign to this role.

    If you see something different from the following picture, you might have PIM enabled. See the next section.

    ![Add assignments pane for selected role.](./media/manage-roles-portal/add-assignments.png)

1. Select **Add** to assign the role.

### Assign a role with PIM enabled

If you have [Azure AD Privileged Identity Management (PIM)](../privileged-identity-management/pim-configure.md) enabled, you have additional role assignment capabilities. For example, you can make a user eligible for a role or set the duration. When PIM is enabled, there are two ways that you can assign roles using the Azure portal. You can use the Roles and administrators page or the PIM experience. Either way uses the same PIM service.

Follow these steps to assign roles using the Roles and administrators page. If you want to assign roles using the PIM experience, see [Assign Azure AD roles in Privileged Identity Management](../privileged-identity-management/pim-how-to-add-role-to-user.md).

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory** > **Roles and administrators** to see the list of all available roles.

    ![Roles and administrators page in Azure Active Directory when PIM enabled.](./media/manage-roles-portal/roles-and-administrators.png)

1. Select a role to see its eligible, active, and expired assignments.

    To help you find the role you need, use **Add filters** to filter the roles.

1. Select **No member selected** and then select the users you want to assign to this role.

    ![Add assignments page and Select a member pane with PIM enabled.](./media/manage-roles-portal/add-assignments-pim.png)

1. Select **Next**.

1. On the **Setting** tab, select whether you wan to make this assignment **Eligible** or **Active**.

    If a user is made eligible for a role, that means they must perform one or more actions to use the role. For more information about these settings, see [PIM Terminology](../privileged-identity-management/pim-configure.md#terminology).

    ![Add assignments page and Setting tab with PIM enabled.](./media/manage-roles-portal/add-assignments-pim-setting.png)

1. Use the remaining options to set the duration for the assignment.

1. Select **Assign** to assign the role.

## PowerShell

Follow these steps to assign Azure AD roles using PowerShell.

1. Open a PowerShell window and use [Import-Module](/powershell/module/microsoft.powershell.core/import-module) to import the AzureADPreview module. For more information, see [Prerequisites to use PowerShell or Graph Explorer](prerequisites.md).

    ```powershell
    Import-Module -Name AzureADPreview -Force
    ```

1. In a PowerShell window, use [Connect-AzureAD](/powershell/module/azuread/connect-azuread) to sign in to your tenant.

    ```powershell
    Connect-AzureAD
    ```

1. Use [Get-AzureADUser](/powershell/module/azuread/get-azureaduser) to get the user you want to assign a role to.

    ```powershell
    $user = Get-AzureADUser -Filter "userPrincipalName eq 'user@contoso.com'"
    ```

1. Use [Get-AzureADMSRoleDefinition](/powershell/module/azuread/get-azureadmsroledefinition) to get the role you want to assign.

    ```powershell
    $roleDefinition = Get-AzureADMSRoleDefinition -Filter "displayName eq 'Billing Administrator'"
    ```

1. Use [New-AzureADMSRoleAssignment](/powershell/module/azuread/new-azureadmsroleassignment) to assign the role.

    ```powershell
    $roleAssignment = New-AzureADMSRoleAssignment -ResourceScope '/' -DirectoryScopeId '/' -RoleDefinitionId $roleDefinition.Id -PrincipalId $user.objectId
    ```

## Next steps

* Feel free to share with us on the [Azure AD administrative roles forum](https://feedback.azure.com/forums/169401-azure-active-directory?category_id=166032).
* For more about roles, see [Azure AD built-in roles](permissions-reference.md).
* For default user permissions, see a [comparison of default guest and member user permissions](../fundamentals/users-default-permissions.md).
