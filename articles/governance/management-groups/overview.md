---
title: Organize your resources with management groups - Azure Governance
description: Learn about the management groups, how their permissions work, and how to use them.
ms.date: 04/20/2023
ms.topic: overview
author: tfitzmac
ms.author: tomfitz
---
# What are Azure management groups?

If your organization has many Azure subscriptions, you may need a way to efficiently manage access,
policies, and compliance for those subscriptions. _Management groups_ provide a governance scope
above subscriptions. You organize subscriptions into management groups; the governance conditions you apply
cascade by inheritance to all associated subscriptions.

Management groups give you enterprise-grade management at scale, no matter what type of subscriptions you might have.
However, all subscriptions within a single management group must trust the same Azure Active Directory (Azure AD) tenant.

For example, you can apply policies to a management group that limits the regions available for virtual machine (VM) creation. This policy would be applied to all nested management groups, subscriptions, and resources and allow VM creation only in authorized regions.

## Hierarchy of management groups and subscriptions

You can build a flexible structure of management groups and subscriptions to organize your resources
into a hierarchy for unified policy and access management. The following diagram shows an example of
creating a hierarchy for governance using management groups.

:::image type="complex" source="../media/mg-org.png" alt-text="Diagram of a sample management group hierarchy." border="false":::
   Diagram of a root management group holding both management groups and subscriptions. Some child management groups hold management groups, some hold subscriptions, and some hold both. One of the examples in the sample hierarchy is four levels of management groups, with the child level being all subscriptions.
:::image-end:::

You can create a hierarchy that applies a policy, for example, which limits VM locations to the West US region in the management group called "Corp". This policy will inherit all the Enterprise Agreement (EA) subscriptions that are descendants of that management group and will apply to all VMs under those subscriptions. This security policy cannot be altered by the resource or subscription
owner, allowing for improved governance.

> [!NOTE]
> Management groups aren't currently supported in Cost Management features for Microsoft Customer Agreement (MCA) subscriptions.

Another scenario where you would use management groups is to provide user access to multiple
subscriptions. By moving multiple subscriptions under that management group, you can create one
[Azure role assignment](../../role-based-access-control/overview.md) on the management group, which
will inherit that access to all the subscriptions. One assignment on the management group can enable
users to have access to everything they need instead of scripting Azure RBAC over different
subscriptions.

### Important facts about management groups

- 10,000 management groups can be supported in a single directory.
- A management group tree can support up to six levels of depth.
  - This limit doesn't include the Root level or the subscription level.
- Each management group and subscription can only support one parent.
- Each management group can have many children.
- All subscriptions and management groups are within a single hierarchy in each directory. See
  [Important facts about the Root management group](#important-facts-about-the-root-management-group).

## Root management group for each directory

Each directory is given a single top-level management group called the **root** management group. The
root management group is built into the hierarchy to have all management groups and subscriptions
fold up to it. This root management group allows for global policies and Azure role assignments to
be applied at the directory level. The [Azure AD Global Administrator needs to elevate
themselves](../../role-based-access-control/elevate-access-global-admin.md) to the User Access
Administrator role of this root group initially. After elevating access, the administrator can
assign any Azure role to other directory users or groups to manage the hierarchy. As an administrator,
you can assign your account as the owner of the root management group.

### Important facts about the root management group

- By default, the root management group's display name is **Tenant root group** and operates itself as a management group. The ID is the same value as the Azure Active Directory (Azure AD) tenant ID.
- To change the display name, your account must be assigned the **Owner** or **Contributor** role on the
  root management group. See
  [Change the name of a management group](manage.md#change-the-name-of-a-management-group) to update
  the name of a management group.
- The root management group can't be moved or deleted, unlike other management groups.
- All subscriptions and management groups fold up into one root management group within the
  directory.
  - All resources in the directory fold up to the root management group for global management.
  - New subscriptions are automatically defaulted to the root management group when created.
- All Azure customers can see the root management group, but not all customers have access to manage
  that root management group.
  - Everyone who has access to a subscription can see the context of where that subscription is in
    the hierarchy.
  - No one is given default access to the root management group. Azure AD Global Administrators are
    the only users that can elevate themselves to gain access. Once they have access to the root
    management group, the global administrators can assign any Azure role to other users to manage
    it.

> [!IMPORTANT]
> Any assignment of user access or policy on the root management group **applies to all
> resources within the directory**. Because of this, all customers should evaluate the need to have
> items defined on this scope. User access and policy assignments should be "Must Have" only at this
> scope.

## Initial setup of management groups

When any user starts using management groups, there's an initial setup process that happens. The
first step is the root management group is created in the directory. Once this group is created, all
existing subscriptions that exist in the directory are made children of the root management group.
The reason for this process is to make sure there's only one management group hierarchy within a
directory. The single hierarchy within the directory allows administrative customers to apply global
access and policies that other customers within the directory can't bypass. Anything assigned on the
root will apply to the entire hierarchy, which includes all management groups, subscriptions,
resource groups, and resources within that Azure AD tenant.

## Management group access

Azure management groups support
[Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) for all
resource accesses and role definitions. These permissions are inherited to child resources that
exist in the hierarchy. Any Azure role can be assigned to a management group that will inherit down
the hierarchy to the resources. For example, the Azure role VM contributor can be assigned to a
management group. This role has no action on the management group but will inherit to all VMs under
that management group.

The following chart shows the list of roles and the supported actions on management groups.

| Azure Role Name             | Create | Rename | Move\*\* | Delete | Assign Access | Assign Policy | Read  |
|:-------------------------- |:------:|:------:|:--------:|:------:|:-------------:| :------------:|:-----:|
|Owner                       | X      | X      | X        | X      | X             | X             | X     |
|Contributor                 | X      | X      | X        | X      |               |               | X     |
|MG Contributor\*            | X      | X      | X        | X      |               |               | X     |
|Reader                      |        |        |          |        |               |               | X     |
|MG Reader\*                 |        |        |          |        |               |               | X     |
|Resource Policy Contributor |        |        |          |        |               | X             |       |
|User Access Administrator   |        |        |          |        | X             | X             |       |

\*: The **Management Group Contributor** and **Management Group Reader** roles allow users to perform those actions only on the management group scope.

\*\*: Role assignments on the root management group aren't required to move a subscription or
management group to and from it.

See [Manage your resources with management groups](manage.md) for
details on moving items within the hierarchy.

## Azure custom role definition and assignment

You can define a management group as an assignable scope in an Azure custom role definition.
The Azure custom role will then be available for assignment on that management
group and any management group, subscription, resource group, or resource under it. The custom role
will inherit down the hierarchy like any built-in role. For information about the limitations with custom roles and management groups, see [Limitations](#limitations).

### Example definition

[Defining and creating a custom role](../../role-based-access-control/custom-roles.md) doesn't
change with the inclusion of management groups. Use the full path to define the management group
**/providers/Microsoft.Management/managementgroups/{_groupId_}**.

Use the management group's ID and not the management group's display name. This common error happens
since both are custom-defined fields when creating a management group.

```json
...
{
  "Name": "MG Test Custom Role",
  "Id": "id",
  "IsCustom": true,
  "Description": "This role provides members understand custom roles.",
  "Actions": [
    "Microsoft.Management/managementgroups/delete",
    "Microsoft.Management/managementgroups/read",
    "Microsoft.Management/managementgroup/write",
    "Microsoft.Management/managementgroup/subscriptions/delete",
    "Microsoft.Management/managementgroup/subscriptions/write",
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

Role definitions are assignable scope anywhere within the management group hierarchy. A role
definition can be defined on a parent management group while the actual role assignment exists on
the child subscription. Since there's a relationship between the two items, you'll receive an error
when trying to separate the assignment from its definition.

For example, let's look at a small section of a hierarchy for a visual.

:::image type="complex" source="../media/mg-org-sub.png" alt-text="Diagram of a subset of the sample management group hierarchy." border="false":::
   The diagram focuses on the root management group with child Landing zones and Sandbox management groups. The Landing zones management group has two child management groups named Corp and Online while the Sandbox management group has two child subscriptions.
:::image-end:::

Let's say there's a custom role defined on the Sandbox management group. That custom role is then
assigned on the two Sandbox subscriptions.

If we try to move one of those subscriptions to be a child of the Corp management group, this
move would break the path from subscription role assignment to the Sandbox management group role
definition. In this scenario, you'll receive an error saying the move isn't allowed since it will
break this relationship.

There are a couple different options to fix this scenario:
- Remove the role assignment from the subscription before moving the subscription to a new parent
  MG.
- Add the subscription to the role definition's assignable scope.
- Change the assignable scope within the role definition. In the above example, you can update the
  assignable scopes from Sandbox to the root management group so that the definition can be reached by
  both branches of the hierarchy.
- Create another custom role that is defined in the other branch. This new role requires the role
  assignment to be changed on the subscription also.

### Limitations

There are limitations that exist when using custom roles on management groups.

- You can only define one management group in the assignable scopes of a new role. This limitation
  is in place to reduce the number of situations where role definitions and role assignments are
  disconnected. This situation happens when a subscription or management group with a role
  assignment moves to a different parent that doesn't have the role definition.
- Resource provider data plane actions can't be defined in management group custom roles. This
  restriction is in place as there's a latency issue with updating the data plane resource
  providers. This latency issue is being worked on and these actions will be disabled from the role
  definition to reduce any risks.
- Azure Resource Manager doesn't validate the management group's existence in the role
  definition's assignable scope. If there's a typo or an incorrect management group ID listed, the
  role definition is still created.

## Moving management groups and subscriptions

To move a management group or subscription to be a child of another management group, three rules
need to be evaluated as true.

If you're doing the move action, you need:

- Management group write and role assignment write permissions on the child subscription or
  management group.
  - Built-in role example: **Owner**
- Management group write access on the target parent management group.
  - Built-in role example: **Owner**, **Contributor**, **Management Group Contributor**
- Management group write access on the existing parent management group.
  - Built-in role example: **Owner**, **Contributor**, **Management Group Contributor**

**Exception**: If the target or the existing parent management group is the root management group,
the permissions requirements don't apply. Since the root management group is the default landing
spot for all new management groups and subscriptions, you don't need permissions on it to move an
item.

If the **Owner** role on the subscription is inherited from the current management group, your move
targets are limited. You can only move the subscription to another management group where you have
the **Owner** role. You can't move it to a management group where you're a **Contributor** because you would
lose ownership of the subscription. If you're directly assigned to the **Owner** role for the
subscription (not inherited from the management group), you can move it to any management group
where you're assigned the **Contributor** role.

> [!IMPORTANT]
> Azure Resource Manager caches management group hierarchy details for up to 30 minutes.
> As a result, moving a management group may not immediately be reflected in the Azure portal.

## Audit management groups using activity logs

Management groups are supported within
[Azure Activity log](../../azure-monitor/essentials/platform-logs-overview.md). You can search all
events that happen to a management group in the same central location as other Azure resources. For
example, you can see all role assignments or policy assignment changes made to a particular
management group.

:::image type="content" source="./media/al-mg.png" alt-text="Screenshot of Activity Logs and operations related to the selected management group." border="false":::

When looking to query on management groups outside the Azure portal, the target scope for
management groups looks like **"/providers/Microsoft.Management/managementGroups/{_management-group-id_}"**.

> [!NOTE]
> Using the Azure Resource Manager REST API, you can enable diagnostic settings on a management group to send related Azure Activity log entries to a Log Analytics workspace, Azure Storage, or Azure Event Hub. For more information, see [Management Group Diagnostic Settings - Create Or Update](/rest/api/monitor/management-group-diagnostic-settings/create-or-update).

## Next steps

To learn more about management groups, see:

- [Create management groups to organize Azure resources](./create-management-group-portal.md)
- [How to change, delete, or manage your management groups](./manage.md)
- See options for [How to protect your resource hierarchy](./how-to/protect-resource-hierarchy.md)
