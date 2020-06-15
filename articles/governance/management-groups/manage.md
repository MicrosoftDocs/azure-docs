---
title: How to work with your management groups - Azure Governance
description: Learn how to view, maintain, update, and delete your management group hierarchy.
ms.date: 04/15/2020
ms.topic: conceptual
---
# Manage your resources with management groups

If your organization has many subscriptions, you may need a way to efficiently manage access,
policies, and compliance for those subscriptions. Azure management groups provide a level of scope
above subscriptions. You organize subscriptions into containers called "management groups" and apply
your governance conditions to the management groups. All subscriptions within a management group
automatically inherit the conditions applied to the management group.

Management groups give you enterprise-grade management at a large scale no matter what type of
subscriptions you might have. To learn more about management groups, see
[Organize your resources with Azure management groups](./overview.md).

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-intro-sentence.md)]

> [!IMPORTANT]
> Azure Resource Manager user tokens and management group cache lasts for 30 minutes before they are
> forced to refresh. After doing any action like moving a management group or subscription, it might
> take up to 30 minutes to show. To see the updates sooner you need to update your token by
> refreshing the browser, signing in and out, or requesting a new token.  

## Change the name of a management group

You can change the name of the management group by using the portal, PowerShell, or Azure CLI.

### Change the name in the portal

1. Log into the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. Select the management group you would like to rename.

1. Select **details**.

1. Select the **Rename group** option at the top of the page.

   :::image type="content" source="./media/detail_action_small.png" alt-text="Rename Group option on management group page" border="false":::

1. When the menu opens, enter the new name you would like to have displayed.

   :::image type="content" source="./media/rename_context.png" alt-text="Rename Group pane to rename management group" border="false":::

1. Select **Save**.

### Change the name in PowerShell

To update the display name use **Update-AzManagementGroup**. For example, to change a management
groups display name from "Contoso IT" to "Contoso Group", you run the following command:

```azurepowershell-interactive
Update-AzManagementGroup -GroupName 'ContosoIt' -DisplayName 'Contoso Group'
```

### Change the name in Azure CLI

For Azure CLI, use the update command.

```azurecli-interactive
az account management-group update --name 'Contoso' --display-name 'Contoso Group'
```

## Delete a management group

To delete a management group, the following requirements must be met:

1. There are no child management groups or subscriptions under the management group.

   - To move a subscription or management group to another management group see
     [Moving management groups and subscriptions in the hierarchy](#moving-management-groups-and-subscriptions).

1. You need write permissions on the management group ("Owner", "Contributor", or "Management Group
   Contributor"). To see what permissions you have, select the management group and then select
   **IAM**. To learn more on RBAC Roles, see  
   [Manage access and permissions with RBAC](../../role-based-access-control/overview.md).

### Delete in the portal

1. Log into the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. Select the management group you would like to delete.

1. Select **details**.

1. Select **Delete**

   :::image type="content" source="./media/delete.png" alt-text="Delete group option" border="false":::

   > [!TIP]
   > If the icon is disabled, hovering your mouse selector over the icon shows you the reason.

1. There's a window that opens confirming you want to delete the management group.

   :::image type="content" source="./media/delete_confirm.png" alt-text="Delete group confirmation window" border="false":::

1. Select **Yes**.

### Delete in PowerShell

Use the **Remove-AzManagementGroup** command within PowerShell to delete management groups.

```azurepowershell-interactive
Remove-AzManagementGroup -GroupName 'Contoso'
```

### Delete in Azure CLI

With Azure CLI, use the command az account management-group delete.

```azurecli-interactive
az account management-group delete --name 'Contoso'
```

## View management groups

You can view any management group you have a direct or inherited RBAC role on.  

### View in the portal

1. Log into the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. The management group hierarchy page will load. This page is where you can explore all the
   management groups and subscriptions you have access to. Selecting the group name takes you down a
   level in the hierarchy. The navigation works the same as a file explorer does.

1. To see the details of the management group, select the **(details)** link next to the title of
   the management group. If this link isn't available, you don't have permissions to view that
   management group.

   :::image type="content" source="./media/main.png" alt-text="Main" border="false":::

### View in PowerShell

You use the Get-AzManagementGroup command to retrieve all groups. See
[Az.Resources](/powershell/module/az.resources/Get-AzManagementGroup) modules for the full list of
management group GET PowerShell commands.  

```azurepowershell-interactive
Get-AzManagementGroup
```

For a single management group's information, use the -GroupName parameter

```azurepowershell-interactive
Get-AzManagementGroup -GroupName 'Contoso'
```

To return a specific management group and all the levels of the hierarchy under it, use **-Expand**
and **-Recurse** parameters.  

```azurepowershell-interactive
PS C:\> $response = Get-AzManagementGroup -GroupName TestGroupParent -Expand -Recurse
PS C:\> $response

Id                : /providers/Microsoft.Management/managementGroups/TestGroupParent
Type              : /providers/Microsoft.Management/managementGroups
Name              : TestGroupParent
TenantId          : 00000000-0000-0000-0000-000000000000
DisplayName       : TestGroupParent
UpdatedTime       : 2/1/2018 11:15:46 AM
UpdatedBy         : 00000000-0000-0000-0000-000000000000
ParentId          : /providers/Microsoft.Management/managementGroups/00000000-0000-0000-0000-000000000000
ParentName        : 00000000-0000-0000-0000-000000000000
ParentDisplayName : 00000000-0000-0000-0000-000000000000
Children          : {TestGroup1DisplayName, TestGroup2DisplayName}

PS C:\> $response.Children[0]

Type        : /managementGroup
Id          : /providers/Microsoft.Management/managementGroups/TestGroup1
Name        : TestGroup1
DisplayName : TestGroup1DisplayName
Children    : {TestRecurseChild}

PS C:\> $response.Children[0].Children[0]

Type        : /managementGroup
Id          : /providers/Microsoft.Management/managementGroups/TestRecurseChild
Name        : TestRecurseChild
DisplayName : TestRecurseChild
Children    :
```

### View in Azure CLI

You use the list command to retrieve all groups.  

```azurecli-interactive
az account management-group list
```

For a single management group's information, use the show command

```azurecli-interactive
az account management-group show --name 'Contoso'
```

To return a specific management group and all the levels of the hierarchy under it, use **-Expand**
and **-Recurse** parameters.

```azurecli-interactive
az account management-group show --name 'Contoso' -e -r
```

## Moving management groups and subscriptions   

One reason to create a management group is to bundle subscriptions together. Only management groups
and subscriptions can be made children of another management group. A subscription that moves to a
management group inherits all user access and policies from the parent management group

When moving a management group or subscription to be a child of another management group three rules
need to be evaluated as true.

If you're doing the move action, you need: 

- Management group write and Role Assignment write permissions on the child subscription or
  management group.
  - Built-in role example **Owner**
- Management group write access on the target parent management group.
  - Built-in role example: **Owner**, **Contributor**, **Management Group Contributor**
- Management group write access on the existing parent management group.
  - Built-in role example: **Owner**, **Contributor**, **Management Group Contributor**

**Exception**: If the target or the existing parent management group is the Root management group,
the permissions requirements don't apply. Since the Root management group is the default landing
spot for all new management groups and subscriptions, you don't need permissions on it to move an
item.

If the Owner role on the subscription is inherited from the current management group, your move
targets are limited. You can only move the subscription to another management group where you have
the Owner role. You can't move it to a management group where you're a contributor because you would
lose ownership of the subscription. If you're directly assigned to the Owner role for the
subscription (not inherited from the management group), you're able to move it to any management
group where you're a contributor.

To see what permissions you have in the Azure portal, select the management group and then select
**IAM**. To learn more on RBAC Roles, see
[Manage access and permissions with RBAC](../../role-based-access-control/overview.md).

## Move subscriptions 

### Add an existing Subscription to a management group in the portal

1. Log into the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. Select the management group you're planning to be the parent.

1. At the top of the page, select **Add subscription**.

1. Select the subscription in the list with the correct ID.

   :::image type="content" source="./media/add_context_sub.png" alt-text="Available subscriptions to add to a management group" border="false":::

1. Select "Save".

### Remove a subscription from a management group in the portal

1. Log into the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. Select the management group you're planning that is the current parent.  

1. Select the ellipse at the end of the row for the subscription in the list you want to move.

   :::image type="content" source="./media/move_small.png" alt-text="Move option on a management group" border="false":::

1. Select **Move**.

1. On the menu that opens, select the **Parent management group**.

   :::image type="content" source="./media/move_small_context.png" alt-text="Move pane to change parent group" border="false":::

1. Select **Save**.

### Move subscriptions in PowerShell

To move a subscription in PowerShell, you use the New-AzManagementGroupSubscription command.  

```azurepowershell-interactive
New-AzManagementGroupSubscription -GroupName 'Contoso' -SubscriptionId '12345678-1234-1234-1234-123456789012'
```

To remove the link between and subscription and the management group use the
Remove-AzManagementGroupSubscription command.

```azurepowershell-interactive
Remove-AzManagementGroupSubscription -GroupName 'Contoso' -SubscriptionId '12345678-1234-1234-1234-123456789012'
```

### Move subscriptions in Azure CLI

To move a subscription in CLI, you use the add command.

```azurecli-interactive
az account management-group subscription add --name 'Contoso' --subscription '12345678-1234-1234-1234-123456789012'
```

To remove the subscription from the management group, use the subscription remove command.  

```azurecli-interactive
az account management-group subscription remove --name 'Contoso' --subscription '12345678-1234-1234-1234-123456789012'
```

## Move management groups 

### Move management groups in the portal

1. Log into the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. Select the management group you're planning to be the parent.

1. At the top of the page, select **Add management group**.

1. In the menu that opens, select if you want a new or use an existing management group.

   - Selecting new will create a new management group.
   - Selecting an existing will present you with a drop-down of all the management groups you can
     move to this management group.  

   :::image type="content" source="./media/add_context_MG.png" alt-text="Move a management group to new or existing group" border="false":::

1. Select **Save**.

### Move management groups in PowerShell

Use the Update-AzManagementGroup command in PowerShell to move a management group under a different
group.

```azurepowershell-interactive
$parentGroup = Get-AzManagementGroup -GroupName ContosoIT
Update-AzManagementGroup -GroupName 'Contoso' -ParentId $parentGroup.id
```  

### Move management groups in Azure CLI

Use the update command to move a management group with Azure CLI.

```azurecli-interactive
az account management-group update --name 'Contoso' --parent ContosoIT
```

## Audit management groups using activity logs

Management groups are supported within
[Azure Activity Log](../../azure-monitor/platform/platform-logs-overview.md). You can query all
events that happen to a management group in the same central location as other Azure resources. For
example, you can see all Role Assignments or Policy Assignment changes made to a particular
management group.

:::image type="content" source="./media/al-mg.png" alt-text="Activity Logs with management groups" border="false":::

When looking to query on Management Groups outside of the Azure portal, the target scope for
management groups looks like **"/providers/Microsoft.Management/managementGroups/{yourMgID}"**.

## Referencing management groups from other Resource Providers

When referencing management groups from other Resource Provider's actions, use the following path as
the scope. This path is used when using PowerShell, Azure CLI, and REST APIs.  

`/providers/Microsoft.Management/managementGroups/{yourMgID}`

An example of using this path is when assigning a new role assignment to a management group in
PowerShell:

```azurepowershell-interactive
New-AzRoleAssignment -Scope "/providers/Microsoft.Management/managementGroups/Contoso"
```

The same scope path is used when retrieving a policy definition at a management group.

```http
GET https://management.azure.com/providers/Microsoft.Management/managementgroups/MyManagementGroup/providers/Microsoft.Authorization/policyDefinitions/ResourceNaming?api-version=2019-09-01
```

## Next steps

To learn more about management groups, see:

- [Create management groups to organize Azure resources](./create.md)
- [How to change, delete, or manage your management groups](./manage.md)
- [Review management groups in Azure PowerShell Resources Module](/powershell/module/az.resources#resources)
- [Review management groups in REST API](/rest/api/resources/managementgroups)
- [Review management groups in Azure CLI](/cli/azure/account/management-group)
