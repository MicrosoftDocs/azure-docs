---
title: List Azure deny assignments - Azure RBAC
description: Learn how to list Azure deny assignments in Azure role-based access control (Azure RBAC).
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.topic: conceptual
ms.date: 03/12/2024
ms.author: rolyon
ms.reviewer: bagovind
---

# List Azure deny assignments

Similar to a role assignment, a *deny assignment* attaches a set of deny actions to a user, group, or service principal at a particular scope for the purpose of denying access. Deny assignments block users from performing specific Azure resource actions even if a role assignment grants them access.

This article describes how to list deny assignments.

> [!IMPORTANT]
> You can't directly create your own deny assignments. Deny assignments are created and managed by Azure.

## How deny assignments are created

Deny assignments are created and managed by Azure to protect resources. You can't directly create your own deny assignments. However, you can specify deny settings when creating a deployment stack, which creates a deny assignment that is owned by the deployment stack resources. Deployment stacks is currently in preview. For more information, see [Protect managed resources against deletion](../azure-resource-manager/bicep/deployment-stacks.md#protect-managed-resources-against-deletion).

## Compare role assignments and deny assignments

Deny assignments follow a similar pattern as role assignments, but also have some differences.

| Capability | Role assignment | Deny assignment |
| --- | :---: | :---: |
| Grant access | :white_check_mark: |  |
| Deny access |  | :white_check_mark: |
| Can be directly created | :white_check_mark: |  |
| Apply at a scope | :white_check_mark: | :white_check_mark: |
| Exclude principals |  | :white_check_mark: |
| Prevent inheritance to child scopes |  | :white_check_mark: |
| Apply to [classic subscription administrator](rbac-and-directory-admin-roles.md) assignments |  | :white_check_mark: |

## Deny assignment properties

 A deny assignment has the following properties:

> [!div class="mx-tableFixed"]
> | Property | Required | Type | Description |
> | --- | --- | --- | --- |
> | `DenyAssignmentName` | Yes | String | The display name of the deny assignment. Names must be unique for a given scope. |
> | `Description` | No | String | The description of the deny assignment. |
> | `Permissions.Actions` | At least one Actions or one DataActions | String[] | An array of strings that specify the control plane actions to which the deny assignment blocks access. |
> | `Permissions.NotActions` | No | String[] | An array of strings that specify the control plane action to exclude from the deny assignment. |
> | `Permissions.DataActions` | At least one Actions or one DataActions | String[] | An array of strings that specify the data plane actions to which the deny assignment blocks access. |
> | `Permissions.NotDataActions` | No | String[] | An array of strings that specify the data plane actions to exclude from the deny assignment. |
> | `Scope` | No | String | A string that specifies the scope that the deny assignment applies to. |
> | `DoNotApplyToChildScopes` | No | Boolean | Specifies whether the deny assignment applies to child scopes. Default value is false. |
> | `Principals[i].Id` | Yes | String[] | An array of Microsoft Entra principal object IDs (user, group, service principal, or managed identity) to which the deny assignment applies. Set to an empty GUID `00000000-0000-0000-0000-000000000000` to represent all principals. |
> | `Principals[i].Type` | No | String[] | An array of object types represented by Principals[i].Id. Set to `SystemDefined` to represent all principals. |
> | `ExcludePrincipals[i].Id` | No | String[] | An array of Microsoft Entra principal object IDs (user, group, service principal, or managed identity) to which the deny assignment does not apply. |
> | `ExcludePrincipals[i].Type` | No | String[] | An array of object types represented by ExcludePrincipals[i].Id. |
> | `IsSystemProtected` | No | Boolean | Specifies whether this deny assignment was created by Azure and cannot be edited or deleted. Currently, all deny assignments are system protected. |

## The All Principals principal

To support deny assignments, a system-defined principal named *All Principals* has been introduced. This principal represents all users, groups, service principals, and managed identities in a Microsoft Entra directory. If the principal ID is a zero GUID `00000000-0000-0000-0000-000000000000` and the principal type is `SystemDefined`, the principal represents all principals. In Azure PowerShell output, All Principals looks like the following:

```azurepowershell
Principals              : {
                          DisplayName:  All Principals
                          ObjectType:   SystemDefined
                          ObjectId:     00000000-0000-0000-0000-000000000000
                          }
```

All Principals can be combined with `ExcludePrincipals` to deny all principals except some users. All Principals has the following constraints:

- Can be used only in `Principals` and cannot be used in `ExcludePrincipals`.
- `Principals[i].Type` must be set to `SystemDefined`.

## List deny assignments

Follow these steps to list deny assignments.

> [!IMPORTANT]
> You can't directly create your own deny assignments. Deny assignments are created and managed by Azure. For more information, see [Protect managed resources against deletion](../azure-resource-manager/bicep/deployment-stacks.md#protect-managed-resources-against-deletion).
# [Azure portal](#tab/azure-portal)

### Prerequisites

To get information about a deny assignment, you must have:

- `Microsoft.Authorization/denyAssignments/read` permission, which is included in most [Azure built-in roles](built-in-roles.md).

### List deny assignments in the Azure portal

Follow these steps to list deny assignments at the subscription or management group scope.

1. In the Azure portal, open the selected scope, such as resource group or subscription.

1. Select **Access control (IAM)**.

1. Select the **Deny assignments** tab (or select the **View** button on the View deny assignments tile).

    If there are any deny assignments at this scope or inherited to this scope, they'll be listed.

    :::image type="content" source="./media/deny-assignments/access-control-deny-assignments.png" alt-text="Screenshot of Access control (IAM) page and Deny assignments tab that lists deny assignments at the selected scope." lightbox="./media/deny-assignments/access-control-deny-assignments.png":::

1. To display additional columns, select **Edit Columns**.

    :::image type="content" source="./media/deny-assignments/deny-assignments-columns.png" alt-text="Screenshot of deny assignments columns pane that shows how to add columns to list of deny assignments." lightbox="./media/deny-assignments/deny-assignments-columns.png":::

    | Column | Description  |
    | --- | --- |
    | **Name** | Name of the deny assignment. |
    | **Principal type** | User, group, system-defined group, or service principal. |
    | **Denied**  | Name of the security principal that is included in the deny assignment. |
    | **Id** | Unique identifier for the deny assignment. |
    | **Excluded principals** | Whether there are security principals that are excluded from the deny assignment. |
    | **Does not apply to children** | Whether the deny assignment is inherited to subscopes. |
    | **System protected** | Whether the deny assignment is managed by Azure. Currently, always Yes. |
    | **Scope** | Management group, subscription, resource group, or resource. |

1. Add a checkmark to any of the enabled items and then select **OK** to display the selected columns.

### List details about a deny assignment

Follow these steps to list additional details about a deny assignment.

1. Open the **Deny assignments** pane as described in the previous section.

1. Select the deny assignment name to open the **Users** page.

    :::image type="content" source="./media/deny-assignments/deny-assignment-users.png" alt-text="Screenshot of Users page for a deny assignment that lists the applies to and excludes." lightbox="./media/deny-assignments/deny-assignment-users.png":::

    The **Users** page includes the following two sections.

    | Deny setting  | Description |
    | --- | --- |
    | **Deny assignment applies to**  | Security principals that the deny assignment applies to. |
    | **Deny assignment excludes** | Security principals that are excluded from the deny assignment. |

    **System-Defined Principal** represents all users, groups, service principals, and managed identities in an Azure AD directory.

1. To see a list of the permissions that are denied, select **Denied Permissions**.

    :::image type="content" source="./media/deny-assignments/deny-assignment-denied-permissions.png" alt-text="Screenshot of Denied Permissions page for a deny assignment that lists the permissions that are denied." lightbox="./media/deny-assignments/deny-assignment-denied-permissions.png":::

    | Action type | Description |
    | --- | --- |
    | **Actions**  | Denied control plane actions. |
    | **NotActions** | Control plane actions excluded from denied control plane actions. |
    | **DataActions**  | Denied data plane actions. |
    | **NotDataActions** | Data plane actions excluded from denied data plane actions. |

    For the example shown in the previous screenshot, the following are the effective permissions:

    - All storage actions on the data plane are denied except for compute actions.

1. To see the properties for a deny assignment, select **Properties**.

    :::image type="content" source="./media/deny-assignments/deny-assignment-properties.png" alt-text="Screenshot of Properties page for a deny assignment that lists the properties." lightbox="./media/deny-assignments/deny-assignment-properties.png":::

    On the **Properties** page, you can see the deny assignment name, ID, description, and scope. The **Does not apply to children** switch indicates whether the deny assignment is inherited to subscopes. The **System protected** switch indicates whether this deny assignment is managed by Azure. Currently, this is **Yes** in all cases.

# [Azure PowerShell](#tab/azure-powershell)

### Prerequisites

To get information about a deny assignment, you must have:

- `Microsoft.Authorization/denyAssignments/read` permission, which is included in most [Azure built-in roles](built-in-roles.md)
- [PowerShell in Azure Cloud Shell](../cloud-shell/overview.md) or [Azure PowerShell](/powershell/azure/install-azure-powershell)

### List all deny assignments

To list all deny assignments for the current subscription, use [Get-AzDenyAssignment](/powershell/module/az.resources/get-azdenyassignment).

```azurepowershell
Get-AzDenyAssignment
```

```Example
PS C:\> Get-AzDenyAssignment
Id                      : /subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/demoRg/providers/Microsoft.Storage/storageAccounts/storef2dfaqv5dzzfy/providers/Microsoft.Authorization/denyAssignments/6d266d71-a890-53b7-b0d8-2af6769ac019
DenyAssignmentName      : Deny assignment '6d266d71-a890-53b7-b0d8-2af6769ac019' created by Deployment Stack '/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/demoRg/providers/Microsoft.Resources/deploymentStacks/demoStack'.
Description             : Created by Deployment Stack '/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/demoRg/providers/Microsoft.Resources/deploymentStacks/demoStack'.
Actions                 : {*/delete}
NotActions              : {Microsoft.Authorization/locks/delete, Microsoft.Storage/storageAccounts/delete}
DataActions             : {}
NotDataActions          : {}
Scope                   : /subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/demoRg/providers/Microsoft.Storage/storageAccounts/storef2dfaqv5dzzfy
DoNotApplyToChildScopes : True
Principals              : {
                          DisplayName:  All Principals
                          ObjectType:   SystemDefined
                          ObjectId:     00000000-0000-0000-0000-000000000000
                          }
ExcludePrincipals       : {
                          DisplayName:  User1
                          ObjectType:   User
                          ObjectId:     675986ff-5b6a-448c-9a22-fd2a65100221
                          }
IsSystemProtected       : True

Id                      : /subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/demoRg/providers/Microsoft.Network/virtualNetworks/vnetf2dfaqv5dzzfy/providers/Microsoft.Authorization/denyAssignments/36a162b5-ddcc-529a-9deb-673250f90ba7
DenyAssignmentName      : Deny assignment '36a162b5-ddcc-529a-9deb-673250f90ba7' created by Deployment Stack '/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/demoRg/providers/Microsoft.Resources/deploymentStacks/demoStack'.
Description             : Created by Deployment Stack '/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/demoRg/providers/Microsoft.Resources/deploymentStacks/demoStack'.
Actions                 : {*/delete}
NotActions              : {Microsoft.Authorization/locks/delete, Microsoft.Storage/storageAccounts/delete}
DataActions             : {}
NotDataActions          : {}
Scope                   : /subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/demoRg/providers/Microsoft.Network/virtualNetworks/vnetf2dfaqv5dzzfy
DoNotApplyToChildScopes : True
Principals              : {
                          DisplayName:  All Principals
                          ObjectType:   SystemDefined
                          ObjectId:     00000000-0000-0000-0000-000000000000
                          }
ExcludePrincipals       : {
                          DisplayName:  User1
                          ObjectType:   User
                          ObjectId:     675986ff-5b6a-448c-9a22-fd2a65100221
                          }
IsSystemProtected       : True
```

### List deny assignments at a resource group scope

To list all deny assignments at a resource group scope, use [Get-AzDenyAssignment](/powershell/module/az.resources/get-azdenyassignment).

```azurepowershell
Get-AzDenyAssignment -ResourceGroupName <resource_group_name>
```

### List deny assignments at a subscription scope

To list all deny assignments at a subscription scope, use [Get-AzDenyAssignment](/powershell/module/az.resources/get-azdenyassignment). To get the subscription ID, you can find it on the **Subscriptions** page in the Azure portal or you can use [Get-AzSubscription](/powershell/module/Az.Accounts/Get-AzSubscription).

```azurepowershell
Get-AzDenyAssignment -Scope /subscriptions/<subscription_id>
```

# [REST API](#tab/rest)

### Prerequisites

To get information about a deny assignment, you must have:

- `Microsoft.Authorization/denyAssignments/read` permission, which is included in most [Azure built-in roles](built-in-roles.md).

You must use the following version:

- `2018-07-01-preview` or later
- `2022-04-01` is the first stable version

### List a single deny assignment

To list a single deny assignment, use the [Deny Assignments - Get](/rest/api/authorization/deny-assignments/get) REST API.

1. Start with the following request:

    ```http
    GET https://management.azure.com/{scope}/providers/Microsoft.Authorization/denyAssignments/{deny-assignment-id}?api-version=2022-04-01
    ```

1. Within the URI, replace *{scope}* with the scope for which you want to list the deny assignments.

    > [!div class="mx-tableFixed"]
    > | Scope | Type |
    > | --- | --- |
    > | `subscriptions/{subscriptionId}` | Subscription |
    > | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1` | Resource group |
    > | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1/providers/Microsoft.Web/sites/mysite1` | Resource |
1. Replace *{deny-assignment-id}* with the deny assignment identifier you want to retrieve.

### List multiple deny assignments

To list multiple deny assignments, use the [Deny Assignments - List](/rest/api/authorization/deny-assignments/list) REST API.

1. Start with one of the following requests:

    ```http
    GET https://management.azure.com/{scope}/providers/Microsoft.Authorization/denyAssignments?api-version=2022-04-01
    ```

    With optional parameters:

    ```http
    GET https://management.azure.com/{scope}/providers/Microsoft.Authorization/denyAssignments?api-version=2022-04-01&$filter={filter}
    ```

1. Within the URI, replace *{scope}* with the scope for which you want to list the deny assignments.

    > [!div class="mx-tableFixed"]
    > | Scope | Type |
    > | --- | --- |
    > | `subscriptions/{subscriptionId}` | Subscription |
    > | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1` | Resource group |
    > | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1/providers/Microsoft.Web/sites/mysite1` | Resource |
1. Replace *{filter}* with the condition that you want to apply to filter the deny assignment list.

    > [!div class="mx-tableFixed"]
    > | Filter | Description |
    > | --- | --- |
    > | (no filter) | Lists all deny assignments at, above, and below the specified scope. |
    > | `$filter=atScope()` | Lists deny assignments for only the specified scope and above. Does not include the deny assignments at subscopes. |
    > | `$filter=assignedTo('{objectId}')` | Lists deny assignments for the specified user or service principal.<br/>If the user is a member of a group that has a deny assignment, that deny assignment is also listed. This filter is transitive for groups which means that if the user is a member of a group and that group is a member of another group that has a deny assignment, that deny assignment is also listed.<br/>This filter only accepts an object ID for a user or a service principal. You cannot pass an object ID for a group. |
    > | `$filter=atScope()+and+assignedTo('{objectId}')` | Lists deny assignments for the specified user or service principal and at the specified scope. |
    > | `$filter=denyAssignmentName+eq+'{deny-assignment-name}'` | Lists deny assignments with the specified name. |
    > | `$filter=principalId+eq+'{objectId}'` | Lists deny assignments for the specified user, group, or service principal. |
### List deny assignments at the root scope (/)

1. Elevate your access as described in [Elevate access to manage all Azure subscriptions and management groups](elevate-access-global-admin.md).

1. Use the following request:

    ```http
    GET https://management.azure.com/providers/Microsoft.Authorization/denyAssignments?api-version=2022-04-01&$filter={filter}
    ```

1. Replace *{filter}* with the condition that you want to apply to filter the deny assignment list. A filter is required.

    > [!div class="mx-tableFixed"]
    > | Filter | Description |
    > | --- | --- |
    > | `$filter=atScope()` | List deny assignments for only the root scope. Does not include the deny assignments at subscopes. |
    > | `$filter=denyAssignmentName+eq+'{deny-assignment-name}'` | List deny assignments with the specified name. |
1. Remove elevated access.

---

## Next steps

- [Deployment stacks](../azure-resource-manager/bicep/deployment-stacks.md)
