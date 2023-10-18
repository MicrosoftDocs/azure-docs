---
title: Understand Azure role assignments - Azure RBAC
description: Learn about Azure role assignments in Azure role-based access control (Azure RBAC) for fine-grained access management of Azure resources.
services: active-directory
documentationcenter: ''
author: johndowns
ms.service: role-based-access-control
ms.topic: conceptual
ms.workload: identity
ms.date: 10/03/2022
ms.author: jodowns
---
# Understand Azure role assignments

Role assignments enable you to grant a principal (such as a user, a group, a managed identity, or a service principal) access to a specific Azure resource. This article describes the details of role assignments.

## Role assignment

Access to Azure resources is granted by creating a role assignment, and access is revoked by removing a role assignment.

A role assignment has several components, including:

- The *principal*, or *who* is assigned the role.
- The *role* that they're assigned.
- The *scope* at which the role is assigned.
- The *name* of the role assignment, and a *description* that helps you to explain why the role has been assigned.

For example, you can use Azure RBAC to assign roles like:

- User Sally has owner access to the storage account *contoso123* in the resource group *ContosoStorage*.
- Everybody in the Cloud Administrators group in Azure Active Directory has reader access to all resources in the resource group *ContosoStorage*.
- The managed identity associated with an application is allowed to restart virtual machines within Contoso's subscription.

The following shows an example of the properties in a role assignment when displayed using [Azure PowerShell](role-assignments-list-powershell.md):

```json
{
  "RoleAssignmentName": "00000000-0000-0000-0000-000000000000",
  "RoleAssignmentId": "/subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Authorization/roleAssignments/00000000-0000-0000-0000-000000000000",
  "Scope": "/subscriptions/11111111-1111-1111-1111-111111111111",
  "DisplayName": "User Name",
  "SignInName": "user@contoso.com",
  "RoleDefinitionName": "Contributor",
  "RoleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c",
  "ObjectId": "22222222-2222-2222-2222-222222222222",
  "ObjectType": "User",
  "CanDelegate": false,
  "Description": null,
  "ConditionVersion": null,
  "Condition": null
}
```

The following shows an example of the properties in a role assignment when displayed using the [Azure CLI](role-assignments-list-cli.md), or the [REST API](role-assignments-list-rest.md):

```json
{
  "canDelegate": null,
  "condition": null,
  "conditionVersion": null,
  "description": null,
  "id": "/subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Authorization/roleAssignments/00000000-0000-0000-0000-000000000000",
  "name": "00000000-0000-0000-0000-000000000000",
  "principalId": "22222222-2222-2222-2222-222222222222",
  "principalName": "user@contoso.com",
  "principalType": "User",
  "roleDefinitionId": "/subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c",
  "roleDefinitionName": "Contributor",
  "scope": "/subscriptions/11111111-1111-1111-1111-111111111111",
  "type": "Microsoft.Authorization/roleAssignments"
}
```

The following table describes what the role assignment properties mean.

| Property | Description |
| --- | --- |
| `RoleAssignmentName`<br />`name` | The name of the role assignment, which is a globally unique identifier (GUID). |
| `RoleAssignmentId`<br />`id` | The unique ID of the role assignment, which includes the name. |
| `Scope`<br />`scope` | The Azure resource identifier that the role assignment is scoped to. |
| `RoleDefinitionId`<br />`roleDefinitionId` | The unique ID of the role. |
| `RoleDefinitionName`<br />`roleDefinitionName` | The name of the role. |
| `ObjectId`<br />`principalId` | The Azure Active Directory (Azure AD) object identifier for the principal who has the role assigned. |
| `ObjectType`<br />`principalType` | The type of Azure AD object that the principal represents. Valid values include `User`, `Group`, and `ServicePrincipal`. |
| `DisplayName` | For role assignments for users, the display name of the user. |
| `SignInName`<br />`principalName` | The unique principal name (UPN) of the user, or the name of the application associated with the service principal. |
| `Description`<br />`description` | The description of the role assignment. |
| `Condition`<br />`condition` | Condition statement built using one or more actions from role definition and attributes. |
| `ConditionVersion`<br />`conditionVersion` | The condition version number. Defaults to 2.0 and is the only supported version. |
| `CanDelegate`<br />`canDelegate` | Not implemented. |

## Scope

When you create a role assignment, you need to specify the scope at which it's applied. The scope represents the resource, or set of resources, that the principal is allowed to access. You can scope a role assignment to a single resource, a resource group, a subscription, or a management group.

> [!TIP]
> Use the smallest scope that you need to meet your requirements.
>
> For example, if you need to grant a managed identity access to a single storage account, it's good security practice to create the role assignment at the scope of the storage account, not at the resource group or subscription scope.

For more information about scope, see [Understand scope](scope-overview.md).

## Role to assign

A role assignment is associated with a role definition. The role definition specifies the permissions that the principal should have within the role assignment's scope.

You can assign a built-in role definition or a custom role definition. When you create a role assignment, some tooling requires that you use the role definition ID while other tooling allows you to provide the name of the role.

For more information about role definitions, see [Understand role definitions](role-definitions.md).

## Principal

Principals include users, security groups, managed identities, workload identities, and service principals. Principals are created and managed in your Azure Active Directory (Azure AD) tenant. You can assign a role to any principal. Use the Azure AD *object ID* to identify the principal that you want to assign the role to.

When you create a role assignment by using Azure PowerShell, the Azure CLI, Bicep, or another infrastructure as code (IaC) technology, you specify the *principal type*. Principal types include *User*, *Group*, and *ServicePrincipal*. It's important to specify the correct principal type. Otherwise, you might get intermittent deployment errors, especially when you work with service principals and managed identities.

## Name

A role assignment's resource name must be a globally unique identifier (GUID).

Role assignment resource names must be unique within the Azure Active Directory tenant, even if the scope of the role assignment is narrower.

> [!TIP]
> When you create a role assignment by using the Azure portal, Azure PowerShell, or the Azure CLI, the creation process gives the role assignment a unique name for you automatically.
>
> If you create a role assignment by using Bicep or another infrastructure as code (IaC) technology, you need to carefully plan how you name your role assignments. For more information, see [Create Azure RBAC resources by using Bicep](../azure-resource-manager/bicep/scenarios-rbac.md).

### Resource deletion behavior

When you delete a user, group, service principal, or managed identity from Azure AD, it's a good practice to delete any role assignments. They aren't deleted automatically. Any role assignments that refer to a deleted principal ID become invalid.

If you try to reuse a role assignment's name for another role assignment, the deployment will fail. This issue is more likely to occur when you use Bicep or an Azure Resource Manager template (ARM template) to deploy your role assignments, because you have to explicitly set the role assignment name when you use these tools. To work around this behavior, you should either remove the old role assignment before you recreate it, or ensure that you use a unique name when you deploy a new role assignment.

## Description

You can add a text description to a role assignment. While descriptions are optional, it's a good practice to add them to your role assignments. Provide a short justification for why the principal needs the assigned role. When somebody audits the role assignments, descriptions can help to understand why they've been created and whether they're still applicable.

## Conditions

Some roles support *role assignment conditions* based on attributes in the context of specific actions. A role assignment condition is an additional check that you can optionally add to your role assignment to provide more fine-grained access control.

For example, you can add a condition that requires an object to have a specific tag for the user to read the object.

You typically build conditions using a visual condition editor, but here's what an example condition looks like in code:

```
((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'} AND NOT SubOperationMatches{'Blob.List'})) OR (@resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<$key_case_sensitive$>] StringEqualsIgnoreCase 'Cascade'))
```

The preceding condition allows users to read blobs with a blob index tag key of *Project* and a value of *Cascade*.

For more information about conditions, see [What is Azure attribute-based access control (Azure ABAC)?](conditions-overview.md)

## Next steps

- [Delegate Azure access management to others](delegate-role-assignments-overview.md)
- [Steps to assign an Azure role](role-assignments-steps.md)
