---
title: Best practice recommendations for managed system identities
description: Recommendations on when to use user-assigned versus system-assigned managed identities
services: active-directory
documentationcenter: 
author: barclayn
manager: amycolannino
editor: 
ms.service: active-directory
ms.subservice: msi
ms.devlang: 
ms.topic: conceptual
ms.tgt_pltfrm: 
ms.workload: identity
ms.date: 11/09/2021
ms.author: barclayn
---

# Managed identity best practice recommendations

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

## Choosing system or user-assigned managed identities

User-assigned managed identities are more efficient in a broader range of scenarios than system-assigned managed identities. See the table below for some scenarios and the recommendations for user-assigned or system-assigned.

User-assigned identities can be used by multiple resources, and their life cycles are decoupled from the resources’ life cycles with which they’re associated. [Read which resources support managed identities](./managed-identities-status.md).

This life cycle allows you to separate your resource creation and identity administration responsibilities. User-assigned identities and their role assignments can be configured in advance of the resources that require them. Users who create the resources only require the access to assign a user-assigned identity, without the need to create new identities or role assignments. 	

As system-assigned identities are created and deleted along with the resource, role assignments can't be created in advance. This sequence can cause failures while deploying infrastructure if the user creating the resource doesn't also have access to create role assignments.

If your infrastructure requires that multiple resources require access to the same resources, a single user-assigned identity can be assigned to them. Administration overhead will be reduced, as there are fewer distinct identities and role assignments to manage.

If you require that each resource has its own identity, or have resources that require a unique set of permissions and want the identity to be deleted as the resource is deleted, then you should use a system-assigned identity.

| Scenario| Recommendation|Notes|
|---|---|---|
| Rapid creation of resources (for example, ephemeral computing) with managed identities |  User-assigned identity | If you attempt to create multiple managed identities in a short space of time – for example, deploying multiple virtual machines each with their own system-assigned identity - you may exceed the rate limit for Microsoft Entra object creations, and the request will fail with an HTTP 429 error. <br/><br/>If resources are being created or deleted rapidly, you may also exceed the limit on the number of resources in Microsoft Entra ID if using system-assigned identities. While a deleted  system-assigned identity is no longer accessible by any resource, it will count towards your limit until fully purged after 30 days.<br/><br/>Deploying the resources associated with a single user-assigned identity will require the creation of only one Service Principal in Microsoft Entra ID, avoiding the rate limit. Using a single identity that is created in advance will also reduce the risk of replication delays that could occur if multiple resources are created each with their own identity.<br/><br/>Read more about the [Azure subscription service limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#managed-identity-limits). |
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

View the limits for [managed identities](/azure/azure-resource-manager/management/azure-subscription-service-limits#managed-identity-limits)
and for [custom roles and role assignments](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-rbac-limits).

## Follow the principle of least privilege when granting access

When granting any identity, including a managed identity, permissions to access services, always grant the least permissions needed to perform the desired actions. For example, if a managed identity is used to read data from a storage account, there is no need to allow that identity permissions to also write data to the storage account. Granting extra permissions, for example, making the managed identity a contributor on an Azure subscription when it’s not needed, increases the security blast radius associated with the identity. One must always minimize the security blast radius so that compromising that identity causes minimum damage.

### Consider the effect of assigning managed identities to Azure resources and/or granting assign permissions to a user

It is important to note that when an Azure resource, such as an Azure Logic App, an Azure function, or a Virtual Machine, etc. is assigned a managed identity, all the permissions granted to the managed identity are now available to the Azure resource. This is important because if a user has access to install or execute code on this resource, then the user has access to all the identities assigned/associated to the Azure resource. The purpose of managed identity is to give code running on an Azure resource access to other resources, without developers needing to handle or put credentials directly into code to get that access.

For example, if a managed Identity (ClientId = 1234) has been granted read/write access to ***StorageAccount7755*** and has been assigned to ***LogicApp3388***, then Alice, who does not have direct access to the storage account but has permission to execute code within ***LogicApp3388*** can also read/write data to/from ***StorageAccount7755*** by executing the code that uses the managed identity.

Similarly, if Alice has permissions to assign the managed identity herself, she can assign it to a different Azure resource and have access to all the permissions available to the managed identity. 

:::image type="content" source="media/managed-identity-best-practice-recommendations/security-considerations.png" alt-text="security scenario":::

In general, when granting a user administrative access to a resource that can execute code (such as a Logic App) and has a managed identity, consider if the role being assigned to the user can install or run code on the resource, and if yes only assign that role if the user really needs it.

## Maintenance

System-assigned identities are automatically deleted when the resource is deleted, while the lifecycle of a user-assigned identity is independent of any resources with which it's associated.

You'll need to manually delete a user-assigned identity when it's no longer required, even if no resources are associated with it.

Role assignments aren't automatically deleted when either system-assigned or user-assigned managed identities are deleted. These role assignments should be manually deleted so the limit of role assignments per subscription isn't exceeded. 

Role assignments that are associated with deleted managed identities
will be displayed with “Identity not found” when viewed in the portal. [Read more](/azure/role-based-access-control/troubleshooting#symptom---role-assignments-with-identity-not-found).

:::image type="content" source="media/managed-identity-best-practice-recommendations/identity-not-found.png" alt-text="Identity not found for role assignment.":::

Role assignments which are no longer associated with a user or service principal will appear with an `ObjectType` value of `Unknown`. In order to remove them, you can pipe several Azure PowerShell commands together to first get all the role assignments, filter to only those with an `ObjectType` value of `Unknown` and then remove those role assignments from Azure.

```azurepowershell
Get-AzRoleAssignment | Where-Object {$_.ObjectType -eq "Unknown"} | Remove-AzRoleAssignment 
```

## Limitation of using managed identities for authorization

Using Microsoft Entra ID **groups** for granting access to services is a great way to simplify the authorization process. The idea is simple – grant permissions to a group and add identities to the group so that they inherit the same permissions. This is a well-established pattern from various on-premises systems and works well when the identities represent users. Another option to control authorization in Microsoft Entra ID is by using [App Roles](../develop/howto-add-app-roles-in-apps.md), which allows you to declare **roles** that are specific to an app (rather than groups, which are a global concept in the directory). You can then [assign app roles to managed identities](how-to-assign-app-role-managed-identity-powershell.md) (as well as users or groups).

In both cases, for non-human identities such as Microsoft Entra Applications and Managed identities, the exact mechanism of how this authorization information is presented to the application is not ideally suited today. Today's implementation with Microsoft Entra ID and Azure Role Based Access Control (Azure RBAC) uses access tokens issued by Microsoft Entra ID for authentication of each identity. If the identity is added to a group or role, this is expressed as claims in the access token issued by Microsoft Entra ID. Azure RBAC uses these claims to further evaluate the authorization rules for allowing or denying access.

Given that the identity's groups and roles are claims in the access token, any authorization changes do not take effect until the token is refreshed. For a human user that's typically not a problem, because a user can acquire a new access token by logging out and in again (or waiting for the token lifetime to expire, which is 1 hour by default). Managed identity tokens on the other hand are cached by the underlying Azure infrastructure for performance and resiliency purposes: the back-end services for managed identities maintain a cache per resource URI for around 24 hours. This means that it can take several hours for changes to a managed identity's group or role membership to take effect. Today, it is not possible to force a managed identity's token to be refreshed before its expiry. If you change a managed identity’s group or role membership to add or remove permissions, you may therefore need to wait several hours for the Azure resource using the identity to have the correct access.

If this delay is not acceptable for your requirements, consider alternatives to using groups or roles in the token. To ensure that changes to permissions for managed identities take effect quickly, we recommend that you group Azure resources using a [user-assigned managed identity](how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azcli) with permissions applied directly to the identity, instead of adding to or removing managed identities from a Microsoft Entra group that has permissions. A user-assigned managed identity can be used like a group because it can be assigned to one or more Azure resources to use it. The assignment operation can be controlled using the [Managed identity contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) and [Managed identity operator role](/azure/role-based-access-control/built-in-roles#managed-identity-operator).
