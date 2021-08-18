---
title: Best practice recommendations for managed system identities
description: Recommendations on when to use user-assigned versus system-assigned managed identities
services: active-directory
documentationcenter: 
author: barclayn
manager: daveba
editor: 
ms.service: active-directory
ms.subservice: msi
ms.devlang: 
ms.topic: conceptual
ms.tgt_pltfrm: 
ms.workload: identity
ms.date: 05/21/2021
ms.author: barclayn
---

# Managed identity best practice recommendations

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

## Choosing system or user-assigned managed identities

User-assigned managed identities are more efficient in a broader range of scenarios than system-assigned managed identities. See the table below for some scenarios and the recommendations for user-assigned or system-assigned.

User-assigned identities can be used by multiple resources, and their life cycles are decoupled from the resources’ life cycles with which they’re associated. [Read which resources support managed identities](./services-support-managed-identities.md).

This life cycle allows you to separate your resource creation and identity administration responsibilities. User-assigned identities and their role assignments can be configured in advance of the resources that require them. Users who create the resources only require the access to assign a user-assigned identity, without the need to create new identities or role assignments. 	

As system-assigned identities are created and deleted along with the resource, role assignments can't be created in advance. This sequence can cause failures while deploying infrastructure if the user creating the resource doesn't also have access to create role assignments.

If your infrastructure requires that multiple resources require access to the same resources, a single user-assigned identity can be assigned to them. Administration overhead will be reduced, as there are fewer distinct identities and role assignments to manage.

If you require that each resource has its own identity, or have resources that require a unique set of permissions and want the identity to be deleted as the resource is deleted, then you should use a system-assigned identity.


| Scenario| Recommendation|Notes|
|---|---|---|
| Rapid creation of resources (for example, ephemeral computing) with managed identities |  User-assigned identity | If you attempt to create multiple managed identities in a short space of time – for example, deploying multiple virtual machines each with their own system-assigned identity - you may exceed the rate limit for Azure Active Directory object creations, and the request will fail with a HTTP 429 error. <br/><br/>If resources are being created or deleted rapidly, you may also exceed the limit on the number of resources in Azure Active Directory if using system-assigned identities. While a deleted  system-assigned identity is no longer accessible by any resource, it will count towards your limit until fully purged after 30 days.<br/><br/>Deploying the resources associated with a single user-assigned identity will require the creation of only one Service Principal in Azure Active Directory, avoiding the rate limit. Using a single identity that is created in advance will also reduce the risk of replication delays that could occur if multiple resources are created each with their own identity.<br/><br/>Read more about the [Azure subscription service limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#managed-identity-limits). |
| Replicated resources/applications | User-assigned identity  |  Resources that carry out the same task – for example, duplicated web servers or identical functionality running in an app service and in an application on a virtual machine – typically require the same permissions. <br/><br/>By using the same user-assigned identity, fewer role assignments are required which reduces the management overhead. The resources don't have to be of the same type. 
|Compliance| User-assigned identity  | If your organization requires that all identity creation must go through an approval process, using a single user-assigned identity across multiple resources will require fewer approvals than system-assigned Identities, which are created as new resources are created. |
Access required before a resource is deployed |User-assigned identity| Some resources may require access to certain Azure resources as part of their deployment.<br/><br/>In this case, a system-assigned identity may not be created in time so a pre-existing user-assigned identity should be used.|
Audit Logging|System-assigned identity|If you need to log which specific resource carried out an action, rather than which identity, use a system-assigned identity.|
Permissions Lifecycle Management|System-assigned identity|If you require that the permissions for a resource be removed along with the resource, use a system-assigned identity.

### Using user-assigned identities to reduce administration

The diagrams demonstrate the difference between system-assigned and user-assigned identities, when used to allow several virtual machines to access two storage accounts. 

The diagram shows four virtual machines with system-assigned identities. Each virtual machine has the same role assignments that grants them access to two storage accounts.

:::image type="content" source="media/managed-identity-best-practice-recommendations/system-assigned-identities.png" alt-text="Four virtual machines using system-assigned identities to access a storage account and key vault.":::

When a user-assigned identity is associated with the four virtual machines, only two role assignments are required, compared to eight with system-assigned identities. If the virtual machines' identity requires more role assignments, they'll be granted to all the resources associated with this identity.

:::image type="content" source="media/managed-identity-best-practice-recommendations/user-assigned-identities.png" alt-text="Four virtual machines using a user-assigned identity to access a storage account and key vault.":::

Security groups can also be used to reduce the number of role assignments that are required. This diagram shows four virtual machines with system-assigned identities, which have been added to a security group, with the role assignments added to the group instead of the system-assigned identities. While the result is similar, this configuration doesn't offer the same Resource Manager template capabilities as user-assigned identities.

:::image type="content" source="media/managed-identity-best-practice-recommendations/system-assigned-identities-in-a-group.png" alt-text="Four virtual machines with their system-assigned identities added to a security group that has role assignments.":::

### Multiple managed identities

Resources that support managed identities can have both a system-assigned identity and one or more user-assigned identities. 

This model provides the flexibility to both use a shared user-assigned identity and apply granular permissions when needed.

In the example below, “Virtual Machine 3” and “Virtual Machine 4” can access both storage accounts and key vaults, depending on which user-assigned identity they use while authenticating.

:::image type="content" source="media/managed-identity-best-practice-recommendations/multiple-user-assigned-identities.png" alt-text="Four virtual machines, two with multiple user-assigned identities.":::

In the example below, “Virtual Machine 4” has both a user-assigned identity, giving it access to both storage accounts and key vaults, depending on which identity is used while authenticating. The role assignments for the system-assigned identity are specific to that virtual machine.

:::image type="content" source="media/managed-identity-best-practice-recommendations/system-and-user-assigned-identities.png" alt-text="Four virtual machines, one with both system-assigned and user-assigned identities.":::

## Limits 

View the limits for [managed identities](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-rbac-limits)
and for [custom roles and role assignments](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-rbac-limits).

## Maintenance

System-assigned identities are automatically deleted when the resource is deleted, while the lifecycle of a user-assigned identity is independent of any resources with which it's associated.

You'll need to manually delete a user-assigned identity when it's no longer required, even if no resources are associated with it.

Role assignments aren't automatically deleted when either system-assigned or user-assigned managed identities are deleted. These role assignments should be manually deleted so the limit of role assignments per subscription isn't exceeded. 

Role assignments that are associated with deleted managed identities
will be displayed with “Identity not found” when viewed in the portal. [Read more](../../role-based-access-control/troubleshooting.md#role-assignments-with-identity-not-found).

:::image type="content" source="media/managed-identity-best-practice-recommendations/identity-not-found.png" alt-text="Identity not found for role assignment.":::