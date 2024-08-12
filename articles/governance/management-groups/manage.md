---
title: Manage your Azure subscriptions at scale with management groups - Azure Governance
description: Learn how to view, maintain, update, and delete your management group hierarchy.
ms.date: 07/18/2024
ms.topic: conceptual
ms.custom: devx-track-azurepowershell
ms.author: davidsmatlak
author: davidsmatlak
---
# Manage your Azure subscriptions at scale with management groups

If your organization has many subscriptions, you might need a way to efficiently manage access,
policies, and compliance for those subscriptions. Azure management groups provide a level of scope
above subscriptions. You organize subscriptions into containers called *management groups* and apply
your governance conditions to the management groups. All subscriptions within a management group
automatically inherit the conditions applied to the management group.

Management groups give you enterprise-grade management at a large scale no matter what type of
subscription you have. To learn more about management groups, see
[Organize your resources with Azure management groups](./overview.md).

[!INCLUDE [GDPR-related guidance](~/reusable-content/ce-skilling/azure/includes/gdpr-intro-sentence.md)]

> [!IMPORTANT]
> Azure Resource Manager user tokens and management group cache last for 30 minutes before they're
> forced to refresh. Any action like moving a management group or subscription might
> take up to 30 minutes to appear. To see the updates sooner, you need to update your token by
> refreshing the browser, signing in and out, or requesting a new token.

For the Azure PowerShell actions in this article, keep in mind that `AzManagementGroup`-related cmdlets mention that `-GroupId` is an alias of the `-GroupName` parameter.
You can use either of them to provide the management group ID as a string value.

## Change the name of a management group

You can change the name of the management group by using the Azure portal, Azure PowerShell, or the Azure CLI.

### Change the name in the portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. Select the management group that you want to rename.

1. Select **details**.

1. Select the **Rename Group** option at the top of the pane.

   :::image type="content" source="./media/detail_action_small.png" alt-text="Screenshot of the action bar and the Rename Group button on the management group page." border="false":::

1. On the **Rename Group** pane, enter the new name that you want to display.

   :::image type="content" source="./media/rename_context.png" alt-text="Screenshot of the options to rename a management group." border="false":::

1. Select **Save**.

### Change the name in Azure PowerShell

To update the display name, use `Update-AzManagementGroup` in Azure PowerShell. For example, to change a management
group's display name from **Contoso IT** to **Contoso Group**, run the following command:

```azurepowershell-interactive
Update-AzManagementGroup -GroupId 'ContosoIt' -DisplayName 'Contoso Group'
```

### Change the name in the Azure CLI

For the Azure CLI, use the `update` command:

```azurecli-interactive
az account management-group update --name 'Contoso' --display-name 'Contoso Group'
```

## Delete a management group

To delete a management group, you must meet the following requirements:

- There are no child management groups or subscriptions under the management group. To move a
   subscription or management group to another management group, see
   [Move management groups and subscriptions](#move-management-groups-and-subscriptions) later in this article.

- You need write permissions on the management group (Owner, Contributor, or Management Group
   Contributor). To see what permissions you have, select the management group and then select
   **IAM**. To learn more on Azure roles, see
   [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md).

### Delete a management group in the portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. Select the management group that you want to delete.

1. Select **details**.

1. Select **Delete**.

   :::image type="content" source="./media/delete.png" alt-text="Screenshot of the management group page with the Delete button." border="false":::

   > [!TIP]
   > If the **Delete** button is unavailable, hovering over the button shows you the reason.

1. A dialog opens and asks you to confirm that you want to delete the management group.

   :::image type="content" source="./media/delete_confirm.png" alt-text="Screenshot of the confirmation dialog for deleting a management group." border="false":::

1. Select **Yes**.

### Delete a management group in Azure PowerShell

To delete a management group, use the `Remove-AzManagementGroup` command in Azure PowerShell:

```azurepowershell-interactive
Remove-AzManagementGroup -GroupId 'Contoso'
```

### Delete a management group in the Azure CLI

With the Azure CLI, use the command `az account management-group delete`:

```azurecli-interactive
az account management-group delete --name 'Contoso'
```

## View management groups

You can view any management group if you have a direct or inherited Azure role on it.

### View management groups in the portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. The page for management group hierarchy appears. On this page, you can explore all the
   management groups and subscriptions that you have access to. Selecting the group name takes you to a
   lower level in the hierarchy. The navigation works the same as a file explorer does.

1. To see the details of the management group, select the **(details)** link next to the title of
   the management group. If this link isn't available, you don't have permissions to view that
   management group.

   :::image type="content" source="./media/main.png" alt-text="Screenshot of the management groups page that shows child management groups and subscriptions." border="false":::

### View management groups in Azure PowerShell

You use the `Get-AzManagementGroup` command to retrieve all groups. For the full list of
`GET` PowerShell commands for management groups, see the
[Az.Resources](/powershell/module/az.resources/Get-AzManagementGroup) modules.

```azurepowershell-interactive
Get-AzManagementGroup
```

For a single management group's information, use the `-GroupId` parameter:

```azurepowershell-interactive
Get-AzManagementGroup -GroupId 'Contoso'
```

To return a specific management group and all the levels of the hierarchy under it, use the `-Expand`
and `-Recurse` parameters:

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

### View management groups in the Azure CLI

You use the `list` command to retrieve all groups:

```azurecli-interactive
az account management-group list
```

For a single management group's information, use the `show` command:

```azurecli-interactive
az account management-group show --name 'Contoso'
```

To return a specific management group and all the levels of the hierarchy under it, use the `-Expand`
and `-Recurse` parameters:

```azurecli-interactive
az account management-group show --name 'Contoso' -e -r
```

## Move management groups and subscriptions

One reason to create a management group is to bundle subscriptions together. Only management groups
and subscriptions can become children of another management group. A subscription that moves to a
management group inherits all user access and policies from the parent management group.

You can move subscriptions between management groups. A subscription can have only one parent management group.

When you move a management group or subscription to be a child of another management group, three
rules need to be evaluated as true.

If you're doing the move action, you need permission at each of the following layers:

- Child subscription or management group
  - `Microsoft.management/managementgroups/write`
  - `Microsoft.management/managementgroups/subscriptions/write` (only for subscriptions)
  - `Microsoft.Authorization/roleAssignments/write`
  - `Microsoft.Authorization/roleAssignments/delete`
  - `Microsoft.Management/register/action`
- Target parent management group
  - `Microsoft.management/managementgroups/write`
- Current parent management group
  - `Microsoft.management/managementgroups/write`

There's an exception: if the target or the existing parent management group is the root management group,
the permission requirements don't apply. Because the root management group is the default landing
spot for all new management groups and subscriptions, you don't need permissions on it to move an
item.

If the Owner role on the subscription is inherited from the current management group, your move
targets are limited. You can move the subscription only to another management group where you have
the Owner role. You can't move the subscription to a management group where you're only a
Contributor because you would lose ownership of the subscription. If you're directly assigned to the
Owner role for the subscription, you can move it to any management group where you have the Contributor role.

To see what permissions you have in the Azure portal, select the management group and then select
**IAM**. To learn more about Azure roles, see
[What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md).

### Add an existing subscription to a management group in the portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. Select the management group that you want to be the parent.

1. At the top of the page, select **Add subscription**.

1. Select the subscription in the list with the correct ID.

   :::image type="content" source="./media/add_context_sub.png" alt-text="Screenshot of the box for selecting an existing subscription to add to a management group." border="false":::

1. Select **Save**.

### Remove a subscription from a management group in the portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. Select the management group that's the current parent.

1. Select the ellipsis (`...`) at the end of the row for the subscription in the list that you want to move.

   :::image type="content" source="./media/move_small.png" alt-text="Screenshot of the menu that includes the move option for a subscription." border="false":::

1. Select **Move**.

1. On **Move** pane, select the value for **New parent management group ID**.

   :::image type="content" source="./media/move_small_context.png" alt-text="Screenshot of the pane for moving a subscription to a different management group." border="false":::

1. Select **Save**.

### Move a subscription in Azure PowerShell

To move a subscription in PowerShell, you use the `New-AzManagementGroupSubscription` command:

```azurepowershell-interactive
New-AzManagementGroupSubscription -GroupId 'Contoso' -SubscriptionId '12345678-1234-1234-1234-123456789012'
```

To remove the link between the subscription and the management group, use the
`Remove-AzManagementGroupSubscription` command:

```azurepowershell-interactive
Remove-AzManagementGroupSubscription -GroupId 'Contoso' -SubscriptionId '12345678-1234-1234-1234-123456789012'
```

### Move a subscription in the Azure CLI

To move a subscription in the Azure CLI, you use the `add` command:

```azurecli-interactive
az account management-group subscription add --name 'Contoso' --subscription '12345678-1234-1234-1234-123456789012'
```

To remove the subscription from the management group, use the `subscription remove` command:

```azurecli-interactive
az account management-group subscription remove --name 'Contoso' --subscription '12345678-1234-1234-1234-123456789012'
```

### Move a subscription in an ARM template

To move a subscription in an Azure Resource Manager template (ARM template), use the following
template and deploy it at the [tenant level](../../azure-resource-manager/templates/deploy-to-tenant.md):

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

Or, use the following Bicep file:

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

### Move a management group in the portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management groups**.

1. Select the management group that you want to be the parent.

1. At the top of the page, select **Add management group**.

1. On the **Add management group** pane, choose whether you want to use a new or existing management group:

   - Selecting **Create new** creates a new management group.
   - Selecting **Use existing** presents you with a dropdown list of all the management groups that you
     can move to this management group.

   :::image type="content" source="./media/add_context_MG.png" alt-text="Screenshot of the pane for adding a management group." border="false":::

1. Select **Save**.

### Move a management group in Azure PowerShell

To move a management group under a different
group, use the `Update-AzManagementGroup` command in Azure PowerShell:

```azurepowershell-interactive
$parentGroup = Get-AzManagementGroup -GroupId ContosoIT
Update-AzManagementGroup -GroupId 'Contoso' -ParentId $parentGroup.id
```

### Move a management group in the Azure CLI

To move a management group in the Azure CLI, use the `update` command:

```azurecli-interactive
az account management-group update --name 'Contoso' --parent ContosoIT
```

## Audit management groups by using activity logs

Management groups are supported in [Azure Monitor activity logs](../../azure-monitor/essentials/platform-logs-overview.md). You can query all
events that happen to a management group in the same central location as other Azure resources. For
example, you can see all role assignments or policy assignment changes made to a particular
management group.

:::image type="content" source="./media/al-mg.png" alt-text="Screenshot of activity logs and operations related to a selected management group." border="false":::

When you want to query on management groups outside the Azure portal, the target scope for
management groups looks like `"/providers/Microsoft.Management/managementGroups/{yourMgID}"`.

## Reference management groups from other resource providers

When you're referencing management groups from another resource provider's actions, use the following path as
the scope. This path applies when you're using Azure PowerShell, the Azure CLI, and REST APIs.

`/providers/Microsoft.Management/managementGroups/{yourMgID}`

An example of using this path is when you're assigning a new role to a management group in
Azure PowerShell:

```azurepowershell-interactive
New-AzRoleAssignment -Scope "/providers/Microsoft.Management/managementGroups/Contoso"
```

You use the same scope path to retrieve a policy definition for a management group:

```http
GET https://management.azure.com/providers/Microsoft.Management/managementgroups/MyManagementGroup/providers/Microsoft.Authorization/policyDefinitions/ResourceNaming?api-version=2019-09-01
```

## Related content

To learn more about management groups, see:

- [Create management groups to organize Azure resources](./create-management-group-portal.md)
- [Review management groups in the Azure PowerShell Az.Resources module](/powershell/module/az.resources#resources)
- [Review management groups in the REST API](/rest/api/managementgroups/managementgroups)
- [Review management groups in the Azure CLI](/cli/azure/account/management-group)
