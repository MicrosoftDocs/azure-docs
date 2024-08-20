---
title: Organize your resources with management groups - Azure Governance
description: Learn about management groups, how their permissions work, and how to use them.
ms.date: 07/18/2024
ms.topic: overview
---

# What are Azure management groups?

If your organization has many Azure subscriptions, you might need a way to efficiently manage access,
policies, and compliance for those subscriptions. _Management groups_ provide a governance scope
above subscriptions. When you organize subscriptions into management groups, the governance conditions that you apply
cascade by inheritance to all associated subscriptions.

Management groups give you enterprise-grade management at scale, no matter what type of subscriptions you might have.
However, all subscriptions within a single management group must trust the same Microsoft Entra tenant.

For example, you can apply a policy to a management group that limits the regions available for virtual machine (VM) creation. This policy would be applied to all nested management groups, subscriptions, and resources to allow VM creation only in authorized regions.

## Hierarchy of management groups and subscriptions

You can build a flexible structure of management groups and subscriptions to organize your resources
into a hierarchy for unified policy and access management. The following diagram shows an example of
creating a hierarchy for governance by using management groups.

:::image type="complex" source="../media/mg-org.png" alt-text="Diagram of a sample management group hierarchy." border="false":::
   Diagram of a root management group that holds both management groups and subscriptions. Some child management groups hold management groups, some hold subscriptions, and some hold both. One of the examples in the sample hierarchy is four levels of management groups, with all subscriptions at the child level.
:::image-end:::

You can create a hierarchy that applies a policy, for example, that limits VM locations to the West US region in the management group called _Corp_. This policy will inherit all the Enterprise Agreement (EA) subscriptions that are descendants of that management group and will apply to all VMs under those subscriptions. The resource or subscription
owner can't alter this security policy, to allow for improved governance.

> [!NOTE]
> Management groups aren't currently supported in cost management features for Microsoft Customer Agreement (MCA) subscriptions.

Another scenario where you would use management groups is to provide user access to multiple
subscriptions. By moving multiple subscriptions under a management group, you can create one
[Azure role assignment](../../role-based-access-control/overview.md) on the management group. The role
will inherit that access to all the subscriptions. One assignment on the management group can enable
users to have access to everything they need, instead of scripting Azure role-based access control (RBAC) over different
subscriptions.

### Important facts about management groups

- A single directory can support 10,000 management groups.
- A management group tree can support up to six levels of depth.

  This limit doesn't include the root level or the subscription level.
- Each management group and subscription can support only one parent.
- Each management group can have many children.
- All subscriptions and management groups are within a single hierarchy in each directory. For more information, see
  [Important facts about the root management group](#important-facts-about-the-root-management-group) later in this article.

## Root management group for each directory

Each directory has a single top-level management group called the _root_ management group. The
root management group is built into the hierarchy to have all management groups and subscriptions
fold up to it.

The root management group allows for the application of global policies and Azure role assignments
at the directory level. Initially, the [Microsoft Entra Global Administrator needs to elevate
themselves](../../role-based-access-control/elevate-access-global-admin.md) to the User Access
Administrator role of this root group. After elevating access, the administrator can
assign any Azure role to other directory users or groups to manage the hierarchy. As an administrator,
you can assign your account as the owner of the root management group.

### Important facts about the root management group

- By default, the root management group's display name is **Tenant root group**, and it operates itself as a management group. The ID is the same value as the Microsoft Entra tenant ID.
- To change the display name, your account must have the Owner or Contributor role on the
  root management group. For more information, see
  [Change the name of a management group](manage.md#change-the-name-of-a-management-group).
- The root management group can't be moved or deleted, unlike other management groups.
- All subscriptions and management groups fold up into one root management group within the
  directory.
  - All resources in the directory fold up to the root management group for global management.
  - New subscriptions automatically default to the root management group when they're created.
- All Azure customers can see the root management group, but not all customers have access to manage
  that root management group.
  - Everyone who has access to a subscription can see the context of where that subscription is in
    the hierarchy.
  - No one has default access to the root management group. Microsoft Entra Global Administrators are
    the only users who can elevate themselves to gain access. After they have access to the root
    management group, they can assign any Azure role to other users to manage the group.

> [!IMPORTANT]
> Any assignment of user access or policy on the root management group applies to all
> resources within the directory. Because of this access level, all customers should evaluate the need to have
> items defined on this scope. User access and policy assignments should be "must have" only at this
> scope.

## Initial setup of management groups

When any user starts using management groups, an initial setup process happens. The
first step is creation of the root management group in the directory. All
existing subscriptions that exist in the directory then become children of the root management group.

The reason for this process is to make sure there's only one management group hierarchy within a
directory. The single hierarchy within the directory allows administrative customers to apply global
access and policies that other customers within the directory can't bypass.

Anything assigned on the
root applies to the entire hierarchy. That is, it applies to all management groups, subscriptions,
resource groups, and resources within that Microsoft Entra tenant.

## Management group access

Azure management groups support
[Azure RBAC](../../role-based-access-control/overview.md) for all
resource access and role definitions. Child resources that
exist in the hierarchy inherit these permissions. Any Azure role can be assigned to a management group that will inherit down
the hierarchy to the resources.

For example, you can assign the Azure role VM Contributor to a
management group. This role has no action on the management group but will inherit to all VMs under
that management group.

The following chart shows the list of roles and the supported actions on management groups.

| Azure role name             | Create | Rename | Move\*\* | Delete | Assign access | Assign policy | Read  |
|:-------------------------- |:------:|:------:|:--------:|:------:|:-------------:| :------------:|:-----:|
|Owner                       | X      | X      | X        | X      | X             | X             | X     |
|Contributor                 | X      | X      | X        | X      |               |               | X     |
|Management Group Contributor\*            | X      | X      | X        | X      |               |               | X     |
|Reader                      |        |        |          |        |               |               | X     |
|Management Group Reader\*                 |        |        |          |        |               |               | X     |
|Resource Policy Contributor |        |        |          |        |               | X             |       |
|User Access Administrator   |        |        |          |        | X             | X             |       |

\*: These roles allow users to perform the specified actions only on the management group scope.

\*\*: Role assignments on the root management group aren't required to move a subscription or a
management group to and from it.

For details on moving items within the hierarchy, see [Manage your resources with management groups](manage.md).

## Azure custom role definition and assignment

You can define a management group as an assignable scope in an Azure custom role definition.
The Azure custom role will then be available for assignment on that management
group and any management group, subscription, resource group, or resource under it. The custom role
will inherit down the hierarchy like any built-in role.

For information about the limitations with custom roles and management groups, see [Limitations](#limitations) later in this article.

### Example definition

[Defining and creating a custom role](../../role-based-access-control/custom-roles.md) doesn't
change with the inclusion of management groups. Use the full path to define the management group:
`/providers/Microsoft.Management/managementgroups/{_groupId_}`.

Use the management group's ID and not the management group's display name. This common error happens
because both are custom-defined fields in creating a management group.

```json
...
{
  "Name": "MG Test Custom Role",
  "Id": "id",
  "IsCustom": true,
  "Description": "This role provides members understand custom roles.",
  "Actions": [
    "Microsoft.Management/managementGroups/delete",
    "Microsoft.Management/managementGroups/read",
    "Microsoft.Management/managementGroups/write",
    "Microsoft.Management/managementGroups/subscriptions/delete",
    "Microsoft.Management/managementGroups/subscriptions/write",
    "Microsoft.resources/subscriptions/read",
    "Microsoft.Authorization/policyAssignments/*",
    "Microsoft.Authorization/policyDefinitions/*",
    "Microsoft.Authorization/policySetDefinitions/*",
    "Microsoft.PolicyInsights/*",
    "Microsoft.Authorization/roleAssignments/*",
    "Microsoft.Authorization/roledefinitions/*"
  ],
  "NotActions": [],
  "DataActions": [],
  "NotDataActions": [],
  "AssignableScopes": [
        "/providers/microsoft.management/managementGroups/ContosoCorporate"
  ]
}
...
```

### Issues with breaking the role definition and assignment hierarchy path

Role definitions are assignable scopes anywhere within the management group hierarchy. A role
definition can be on a parent management group, whereas the actual role assignment exists on
the child subscription. Because there's a relationship between the two items, you'll receive an error
if you try to separate the assignment from its definition.

For example, consider the following example of a small section of a hierarchy.

:::image type="complex" source="../media/mg-org-sub.png" alt-text="Diagram of a subset of the sample management group hierarchy." border="false":::
   The diagram focuses on the root management group with child landing zones and sandbox management groups. The management group for landing zones has two child management groups named Corp and Online, whereas the sandbox management group has two child subscriptions.
:::image-end:::

Assume that a custom role is defined on the sandbox management group. That custom role is then
assigned on the two sandbox subscriptions.

If you try to move one of those subscriptions to be a child of the Corp management group, you'll break the path from subscription role assignment to the role definition for the sandbox management group. In this scenario, you'll receive an error that says the move isn't allowed because it will
break this relationship.

To fix this scenario, you have these options:

- Remove the role assignment from the subscription before moving the subscription to a new parent
  management group.
- Add the subscription to the role definition's assignable scope.
- Change the assignable scope within the role definition. In this example, you can update the
  assignable scopes from the sandbox management group to the root management group so that both branches of the hierarchy can reach the definition.
- Create another custom role that's defined in the other branch. This new role also requires you to change the role
  on the subscription.

### Limitations

There are limitations to using custom roles on management groups:

- You can define only one management group in the assignable scopes of a new role. This limitation
  is in place to reduce the number of situations where role definitions and role assignments are
  disconnected. This kind of situation happens when a subscription or management group with a role
  assignment moves to a different parent that doesn't have the role definition.
- Custom roles with `DataActions` can't be assigned at the management group scope. For more information, see [Custom role limits](../../role-based-access-control/custom-roles.md#custom-role-limits).
- Azure Resource Manager doesn't validate the management group's existence in the role
  definition's assignable scope. If there's a typo or an incorrect management group ID, the
  role definition is still created.

## Moving management groups and subscriptions

To move a management group or subscription to be a child of another management group, you need:

- Management group write permissions and role assignment write permissions on the child subscription or
  management group.
  - Built-in role example: Owner
- Management group write access on the target parent management group.
  - Built-in role example: Owner, Contributor, Management Group Contributor
- Management group write access on the existing parent management group.
  - Built-in role example: Owner, Contributor, Management Group Contributor

There's an exception: if the target or the existing parent management group is the root management group,
the permission requirements don't apply. Because the root management group is the default landing
spot for all new management groups and subscriptions, you don't need permissions on it to move an
item.

If the Owner role on the subscription is inherited from the current management group, your move
targets are limited. You can move the subscription only to another management group where you have
the Owner role. You can't move the subscription to a management group where you're only a
Contributor because you would lose ownership of the subscription. If you're directly assigned to the
Owner role for the subscription, you can move it to any management group where you have the Contributor role.

> [!IMPORTANT]
> Azure Resource Manager caches details of the management group hierarchy for up to 30 minutes.
> As a result, the Azure portal might not immediately show that you moved a management group.

## Auditing management groups by using activity logs

Management groups are supported in [Azure Monitor activity logs](../../azure-monitor/essentials/platform-logs-overview.md). You can query all
events that happen to a management group in the same central location as other Azure resources. For
example, you can see all role assignments or policy assignment changes made to a particular
management group.

:::image type="content" source="./media/al-mg.png" alt-text="Screenshot of activity logs and operations related to a selected management group." border="false":::

When you want to query on management groups outside the Azure portal, the target scope for
management groups looks like `"/providers/Microsoft.Management/managementGroups/{management-group-id}"`.

> [!NOTE]
> By using the Azure Resource Manager REST API, you can enable diagnostic settings on a management group to send related Azure Monitor activity log entries to a Log Analytics workspace, Azure Storage, or Azure Event Hubs. For more information, see [Management group diagnostic settings: Create or update](/rest/api/monitor/management-group-diagnostic-settings/create-or-update).

## Related content

To learn more about management groups, see:

- [Create management groups to organize Azure resources](./create-management-group-portal.md)
- [Change, delete, or manage your management groups](./manage.md)
- [Protect your resource hierarchy](./how-to/protect-resource-hierarchy.md)
