---
title: Organize your resources with Azure management groups
description: Learn about the management groups and how to use them. 
author: rthorn17
manager: rithorn
ms.assetid: 482191ac-147e-4eb6-9655-c40c13846672
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 9/28/2018
ms.author: rithorn
---
# Organize your resources with Azure management groups

If your organization has many subscriptions, you may need a way to efficiently manage access,
policies, and compliance for those subscriptions. Azure management groups provide a level of scope
above subscriptions. You organize subscriptions into containers called "management groups" and
apply your governance conditions to the management groups. All subscriptions within a management
group automatically inherit the conditions applied to the management group. Management groups give
you enterprise-grade management at a large scale no matter what type of subscriptions you might
have.

For example, you can apply policies to a management group that limits the regions available for
virtual machine (VM) creation. This policy would be applied to all management groups,
subscriptions, and resources under that management group by only allowing VMs to be created in that
region.

## Hierarchy of management groups and subscriptions

You can build a flexible structure of management groups and subscriptions to organize your
resources into a hierarchy for unified policy and access management. The following diagram shows an
example of creating a hierarchy for governance using management groups.

![tree](./media/MG_overview.png)

By creating a hierarchy like this example you can apply a policy, for example, VM locations limited
to US West Region on the group "Infrastructure Team management group" to enable internal compliance
and security policies. This policy will inherit onto both EA subscriptions under that management
group and will apply to all VMs under those subscriptions. As this policy inherits from the
management group to the subscriptions, this security policy cannot be altered by the resource or
subscription owner allowing for improved governance.

Another scenario where you would use management groups is to provide user access to multiple
subscriptions. By moving multiple subscriptions under that management group, you have the ability
create one [role-based access control](../../role-based-access-control/overview.md) (RBAC)
assignment on the management group, which will inherit that access to all the subscriptions.
Without the need to script RBAC assignments over multiple subscriptions, one assignment on the
management group can enable users to have access to everything they need.

### Important facts about management groups

- 10,000 management groups can be supported in a single directory.
- A management group tree can support up to six levels of depth.
  - This limit doesn't include the Root level or the subscription level.
- Each management group and subscription can only support one parent.
- Each management group can have multiple children.
- All subscriptions and management groups are contained within a single hierarchy in each directory. See [Important facts about the Root management group](#important-facts-about-the-root-management-group) for exceptions during the Preview.

## Root management group for each directory

Each directory is given a single top-level management group called the "Root" management group.
This root management group is built into the hierarchy to have all management groups and
subscriptions fold up to it. This Root management group allows for global policies and RBAC
assignments to be applied at the directory level. The [Directory Administrator needs to elevate
themselves](../../role-based-access-control/elevate-access-global-admin.md) to be the owner of this
root group initially. Once the administrator is the owner of the group, they can assign any RBAC
role to other directory users or groups to manage the hierarchy.

### Important facts about the Root management group

- The root management group's name and ID are given by default. The display name can be updated at any time to show different within the Azure portal.
  - The name will be "Tenant root group".
  - The ID will be the Azure Active Directory ID.
- The root management group can't be moved or deleted, unlike other management groups.  
- All subscriptions and management groups fold up to the one root management group within the directory.
  - All resources in the directory fold up to the root management group for global management.
  - New subscriptions are automatically defaulted to the root management group when created.
- All Azure customers can see the root management group, but not all customers have access to manage that root management group.
  - Everyone who has access to a subscription can see the context of where that subscription is in the hierarchy.  
  - No one is given default access to the root management group. Directory Global Administrators are the only users that can elevate themselves to gain access.  Once they have access, the directory administrators can assign any RBAC role to other users to manage.  

> [!IMPORTANT]
> Any assignment of user access or policy assignment on the root management group **applies to all resources within the directory**.
> Because of this, all customers should evaluate the need to have items defined on this scope.
> User access and policy assignments should be "Must Have" only at this scope.  

## Initial setup of management groups

When any user starts using management groups, there's an initial setup process that happens. The
first step is the root management group is created in the directory. Once this group is created,
all existing subscriptions that exist in the directory are made children of the root management
group. The reason for this process is to make sure there's only one management group hierarchy
within a directory. The single hierarchy within the directory allows administrative customers to
apply global access and policies that other customers within the directory can't bypass. Anything
assigned on the root will apply across all management groups, subscriptions, resource groups, and
resources within the directory by having one hierarchy within the directory.

## Trouble seeing all subscriptions

A few directories that starting using management groups early in the preview before (June 25 2018) could see an issue where all the subscriptions are not enforced into the hierarchy.  This reason is because the processes to enforce subscriptions into the hierarchy was implemented after a role or policy assignment was done on the root management group in the directory.

### How to resolve the issue

There are two self serve options to resolve this.

1. Remove all Role and Policy assignments from the root management group
    1. By removing any policy and role assignments from the root management group, the service will backfill all subscriptions into the hierarchy the next overnight cycle.  The reason for this check is to ensure there is no accidental access given or policy assignment to all of the tenants subscriptions.
    1. The best way to do this process without impacting your services is to apply the role or policy assignments one level below the Root management group. Then you can remove all assignments from the root scope.
1. Call the API directly to start the backfill process
    1. Any authorized customer in the directory can call the *TenantBackfillStatusRequest* or *StartTenantBackfillRequest* APIs. When the StartTenantBackfillRequest API is called, it kicks off the initial setup process of moving all the subscriptions into the hierarchy. This process also starts the enforcement of all new subscription to be a child of the root management group. This process can be done without changing any assignments on the root level as you are saying it is okay that any policy or access assignment on the root can be applied to all subscriptions.

If you have questions on this backfill process, please contact: managementgroups@microsoft.com  
  
## Management group access

Azure management groups support [Azure Role-Based Access Control
(RBAC)](../../role-based-access-control/overview.md) for all resource accesses and role definitions.
These permissions are inherited to child resources that exist in the hierarchy. Any built-in RBAC
role can be assigned to a management group that will inherit down the hierarchy to the resources.
For example, the RBAC role VM contributor can be assigned to a management group. This role has no
action on the management group, but will inherit to all VMs under that management group.

The following chart shows the list of roles and the supported actions on management groups.

| RBAC Role Name             | Create | Rename | Move | Delete | Assign Access | Assign Policy | Read  |
|:-------------------------- |:------:|:------:|:----:|:------:|:-------------:| :------------:|:-----:|
|Owner                       | X      | X      | X    | X      | X             | X             | X     |
|Contributor                 | X      | X      | X    | X      |               |               | X     |
|MG Contributor*             | X      | X      | X    | X      |               |               | X     |
|Reader                      |        |        |      |        |               |               | X     |
|MG Reader*                  |        |        |      |        |               |               | X     |
|Resource Policy Contributor |        |        |      |        |               | X             |       |
|User Access Administrator   |        |        |      |        | X             |               |       |

*: MG Contributor and MG Reader only allow users to perform those actions on the management group scope.  

### Custom RBAC Role Definition and Assignment

Custom RBAC roles aren't supported on management groups at this time. See the [management group
feedback forum](https://aka.ms/mgfeedback) to view the status of this item.

## Next steps

To learn more about management groups, see:

- [Create management groups to organize Azure resources](create.md)
- [How to change, delete, or manage your management groups](manage.md)
- [Install the Azure PowerShell module](https://www.powershellgallery.com/packages/AzureRM.ManagementGroups)
- [Review the REST API Spec](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/managementgroups/resource-manager/Microsoft.Management/preview)
- [Install the Azure CLI extension](/cli/azure/extension?view=azure-cli-latest#az-extension-list-available)