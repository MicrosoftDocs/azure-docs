---
title: Manage your Azure subscriptions at scale with management groups - Azure Governance
description: Learn how to view, maintain, update, and delete your management group hierarchy.
ms.date: 12/01/2022
ms.topic: conceptual
ms.custom: devx-track-azurepowershell
ms.author: tomfitz
author: tfitzmac
---
# Manage your Azure subscriptions at scale with management groups

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

> [!IMPORTANT]
> AzManagementGroup related Az PowerShell cmdlets mention that the **-GroupId** is alias of **-GroupName** parameter
> so we can use either of it to provide Management Group Id as a string value.

## Change the name of a management group

You can change the name of the management group by using the portal, PowerShell, or Azure CLI.

### Change the name in the portal

1. Log into the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. Select the management group you would like to rename.

1. Select **details**.

1. Select the **Rename group** option at the top of the page.

   :::image type="content" source="./media/detail_action_small.png" alt-text="Screenshot of the action bar and the 'Rename Group' button on the management group page." border="false":::

1. When the menu opens, enter the new name you would like to have displayed.

   :::image type="content" source="./media/rename_context.png" alt-text="Screenshot of the Rename Group window and options to rename a management group." border="false":::

1. Select **Save**.

### Change the name in PowerShell

To update the display name use **Update-AzManagementGroup**. For example, to change a management
groups display name from "Contoso IT" to "Contoso Group", you run the following command:

```azurepowershell-interactive
Update-AzManagementGroup -GroupId 'ContosoIt' -DisplayName 'Contoso Group'
```

### Change the name in Azure CLI

For Azure CLI, use the update command.

```azurecli-interactive
az account management-group update --name 'Contoso' --display-name 'Contoso Group'
```

## Delete a management group

To delete a management group, the following requirements must be met:

1. There are no child management groups or subscriptions under the management group. To move a
   subscription or management group to another management group, see
   [Moving management groups and subscriptions in the hierarchy](#moving-management-groups-and-subscriptions).

1. You need write permissions on the management group ("Owner", "Contributor", or "Management Group
   Contributor"). To see what permissions you have, select the management group and then select
   **IAM**. To learn more on Azure roles, see
   [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md).

### Delete in the portal

1. Log into the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. Select the management group you would like to delete.

1. Select **details**.

1. Select **Delete**

   :::image type="content" source="./media/delete.png" alt-text="Screenshot of the Management group page with the 'Delete' button highlighted." border="false":::

   > [!TIP]
   > If the icon is disabled, hovering your mouse selector over the icon shows you the reason.

1. There's a window that opens confirming you want to delete the management group.

   :::image type="content" source="./media/delete_confirm.png" alt-text="Screenshot of the 'Delete group' confirmation dialog for deleting a management group." border="false":::

1. Select **Yes**.

### Delete in PowerShell

Use the **Remove-AzManagementGroup** command within PowerShell to delete management groups.

```azurepowershell-interactive
Remove-AzManagementGroup -GroupId 'Contoso'
```

### Delete in Azure CLI

With Azure CLI, use the command az account management-group delete.

```azurecli-interactive
az account management-group delete --name 'Contoso'
```

## View management groups

You can view any management group you have a direct or inherited Azure role on.

### View in the portal

1. Log into the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. The management group hierarchy page will load. This page is where you can explore all the
   management groups and subscriptions you have access to. Selecting the group name takes you to a
   lower level in the hierarchy. The navigation works the same as a file explorer does.

1. To see the details of the management group, select the **(details)** link next to the title of
   the management group. If this link isn't available, you don't have permissions to view that
   management group.

   :::image type="content" source="./media/main.png" alt-text="Screenshot of the Management groups page showing child management groups and subscriptions." border="false":::

### View in PowerShell

You use the Get-AzManagementGroup command to retrieve all groups. See
[Az.Resources](/powershell/module/az.resources/Get-AzManagementGroup) modules for the full list of
management group GET PowerShell commands.

```azurepowershell-interactive
Get-AzManagementGroup
```

For a single management group's information, use the -GroupId parameter

```azurepowershell-interactive
Get-AzManagementGroup -GroupId 'Contoso'
```

To return a specific management group and all the levels of the hierarchy under it, use **-Expand**
and **-Recurse** parameters.

```azurepowershell-interactive
PS C:\> $response = Get-AzManagementGroup -GroupId TestGroupParent -Expand -Recurse
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

When moving a management group or subscription to be a child of another management group, three
rules need to be evaluated as true.

If you're doing the move action, you need permission at each of the following layers:

- Child subscription / management group
  - `Microsoft.management/managementgroups/write`
  - `Microsoft.management/managementgroups/subscriptions/write` (only for Subscriptions)
  - `Microsoft.Authorization/roleAssignments/write`
  - `Microsoft.Authorization/roleAssignments/delete`
  - `Microsoft.Management/register/action`
- Target parent management group
  - `Microsoft.management/managementgroups/write`
- Current parent management group
  - `Microsoft.management/managementgroups/write`

**Exception**: If the target or the existing parent management group is the Root management group,
the permissions requirements don't apply. Since the Root management group is the default landing
spot for all new management groups and subscriptions, you don't need permissions on it to move an
item.

If the Owner role on the subscription is inherited from the current management group, your move
targets are limited. You can only move the subscription to another management group where you have
the Owner role. You can't move the subscription to a management group where you're only a
contributor because you would lose ownership of the subscription. If you're directly assigned to the
Owner role for the subscription, you can move it to any management group where you're a contributor.

To see what permissions you have in the Azure portal, select the management group and then select
**IAM**. To learn more on Azure roles, see
[Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md).

## Move subscriptions

### Add an existing Subscription to a management group in the portal

1. Log into the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. Select the management group you're planning to be the parent.

1. At the top of the page, select **Add subscription**.

1. Select the subscription in the list with the correct ID.

   :::image type="content" source="./media/add_context_sub.png" alt-text="Screenshot of the 'Add subscription' options for selecting an existing subscription to add to a management group." border="false":::

1. Select "Save".

### Remove a subscription from a management group in the portal

1. Log into the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. Select the management group you're planning that is the current parent.

1. Select the ellipse at the end of the row for the subscription in the list you want to move.

   :::image type="content" source="./media/move_small.png" alt-text="Screenshot of the alternative menu for a subscription to select the 'Move' option." border="false":::

1. Select **Move**.

1. On the menu that opens, select the **Parent management group**.

   :::image type="content" source="./media/move_small_context.png" alt-text="Screenshot of the 'Move' window and options for moving a subscription to a different management group." border="false":::

1. Select **Save**.

### Move subscriptions in PowerShell

To move a subscription in PowerShell, you use the New-AzManagementGroupSubscription command.

```azurepowershell-interactive
New-AzManagementGroupSubscription -GroupId 'Contoso' -SubscriptionId '12345678-1234-1234-1234-123456789012'
```

To remove the link between the subscription and the management group use the
Remove-AzManagementGroupSubscription command.

```azurepowershell-interactive
Remove-AzManagementGroupSubscription -GroupId 'Contoso' -SubscriptionId '12345678-1234-1234-1234-123456789012'
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

### Move subscriptions in ARM template

To move a subscription in an Azure Resource Manager template (ARM template), use the following
template and deploy it at [tenant level](../../azure-resource-manager/templates/deploy-to-tenant.md).

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "targetMgId": {
            "type": "string",
            "metadata": {
                "description": "Provide the ID of the management group that you want to move the subscription to."
            }
        },
        "subscriptionId": {
            "type": "string",
            "metadata": {
                "description": "Provide the ID of the existing subscription to move."
            }
        }
    },
    "resources": [
        {
            "scope": "/",
            "type": "Microsoft.Management/managementGroups/subscriptions",
            "apiVersion": "2020-05-01",
            "name": "[concat(parameters('targetMgId'), '/', parameters('subscriptionId'))]",
            "properties": {
            }
        }
    ],
    "outputs": {}
}
```

Or, the following Bicep file.

```bicep
targetScope = 'managementGroup'

@description('Provide the ID of the management group that you want to move the subscription to.')
param targetMgId string

@description('Provide the ID of the existing subscription to move.')
param subscriptionId string

resource subToMG 'Microsoft.Management/managementGroups/subscriptions@2020-05-01' = {
  scope: tenant()
  name: '${targetMgId}/${subscriptionId}'
}
```

## Move management groups

### Move management groups in the portal

1. Log into the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. Select the management group you're planning to be the parent.

1. At the top of the page, select **Add management group**.

1. In the menu that opens, select if you want a new or use an existing management group.

   - Selecting new will create a new management group.
   - Selecting an existing will present you with a dropdown list of all the management groups you
     can move to this management group.

   :::image type="content" source="./media/add_context_MG.png" alt-text="Screenshot of the 'Add management group' options for creating a new management group." border="false":::

1. Select **Save**.

### Move management groups in PowerShell

Use the Update-AzManagementGroup command in PowerShell to move a management group under a different
group.

```azurepowershell-interactive
$parentGroup = Get-AzManagementGroup -GroupId ContosoIT
Update-AzManagementGroup -GroupId 'Contoso' -ParentId $parentGroup.id
```

### Move management groups in Azure CLI

Use the update command to move a management group with Azure CLI.

```azurecli-interactive
az account management-group update --name 'Contoso' --parent ContosoIT
```

## Audit management groups using activity logs

Management groups are supported within
[Azure Activity Log](../../azure-monitor/essentials/platform-logs-overview.md). You can query all
events that happen to a management group in the same central location as other Azure resources. For
example, you can see all Role Assignments or Policy Assignment changes made to a particular
management group.

:::image type="content" source="./media/al-mg.png" alt-text="Screenshot of Activity Logs and operations related to the selected management group." border="false":::

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

- [Create management groups to organize Azure resources](./create-management-group-portal.md)
- [How to change, delete, or manage your management groups](./manage.md)
- [Review management groups in Azure PowerShell Resources Module](/powershell/module/az.resources#resources)
- [Review management groups in REST API](/rest/api/managementgroups/managementgroups)
- [Review management groups in Azure CLI](/cli/azure/account/management-group)
