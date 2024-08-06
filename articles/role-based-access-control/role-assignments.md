---
title: Understand Azure role assignments - Azure RBAC
description: Learn about Azure role assignments in Azure role-based access control (Azure RBAC) for fine-grained access management of Azure resources.
author: johndowns
ms.service: role-based-access-control
ms.topic: conceptual
ms.date: 08/01/2024
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
- Everybody in the Cloud Administrators group in Microsoft Entra ID has reader access to all resources in the resource group *ContosoStorage*.
- The managed identity associated with an application is allowed to restart virtual machines within Contoso's subscription.

The following shows an example of the properties in a role assignment when displayed using [Azure PowerShell](role-assignments-list-powershell.yml):

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

The following shows an example of the properties in a role assignment when displayed using the [Azure CLI](role-assignments-list-cli.yml), or the [REST API](role-assignments-list-rest.md):

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
| `ObjectId`<br />`principalId` | The Microsoft Entra object identifier for the principal who has the role assigned. |
| `ObjectType`<br />`principalType` | The type of Microsoft Entra object that the principal represents. Valid values include `User`, `Group`, and `ServicePrincipal`. |
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

Principals include users, security groups, managed identities, workload identities, and service principals. Principals are created and managed in your Microsoft Entra tenant. You can assign a role to any principal. Use the Microsoft Entra ID *object ID* to identify the principal that you want to assign the role to.

When you create a role assignment by using Azure PowerShell, the Azure CLI, Bicep, or another infrastructure as code (IaC) technology, you specify the *principal type*. Principal types include *User*, *Group*, and *ServicePrincipal*. It's important to specify the correct principal type. Otherwise, you might get intermittent deployment errors, especially when you work with service principals and managed identities.

## Name

A role assignment's resource name must be a globally unique identifier (GUID).

Role assignment resource names must be unique within the Microsoft Entra tenant, even if the scope of the role assignment is narrower.

> [!TIP]
> When you create a role assignment by using the Azure portal, Azure PowerShell, or the Azure CLI, the creation process gives the role assignment a unique name for you automatically.
>
> If you create a role assignment by using Bicep or another infrastructure as code (IaC) technology, you need to carefully plan how you name your role assignments. For more information, see [Create Azure RBAC resources by using Bicep](../azure-resource-manager/bicep/scenarios-rbac.md).

### Resource deletion behavior

When you delete a user, group, service principal, or managed identity from Microsoft Entra ID, it's a good practice to delete any role assignments. They aren't deleted automatically. Any role assignments that refer to a deleted principal ID become invalid.

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

## Integration with Privileged Identity Management (Preview)

> [!IMPORTANT]
> Azure role assignment integration with Privileged Identity Management is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

If you have a Microsoft Entra ID P2 or Microsoft Entra ID Governance license, [Microsoft Entra Privileged Identity Management (PIM)](/entra/id-governance/privileged-identity-management/pim-configure) is integrated into role assignment steps. For example, you can assign roles to users for a limited period of time. You can also make users eligible for role assignments so that they must activate to use the role, such as request approval. Eligible role assignments provide just-in-time access to a role for a limited period of time. You can't create eligible role assignments for applications, service principals, or managed identities because they can't perform the activation steps. You can create eligible role assignments at management group, subscription, and resource group scope, but not at resource scope. This capability is being deployed in stages, so it might not be available yet in your tenant or your interface might look different.

The assignment type options available to you might vary depending or your PIM policy. For example, PIM policy defines whether permanent assignments can be created, maximum duration for time-bound assignments, roles activations requirements (approval, multifactor authentication, or Conditional Access authentication context), and other settings. For more information, see [Configure Azure resource role settings in Privileged Identity Management](/entra/id-governance/privileged-identity-management/pim-resource-roles-configure-role-settings).

:::image type="content" source="./media/shared/assignment-type-eligible.png" alt-text="Screenshot of Add role assignment with Assignment type options displayed." lightbox="./media/shared/assignment-type-eligible.png":::

To better understand PIM, you should review the following terms.

| Term or concept | Role assignment category | Description |
| --- | --- | --- |
| eligible | Type | A role assignment that requires a user to perform one or more actions to use the role. If a user has been made eligible for a role, that means they can activate the role when they need to perform privileged tasks. There's no difference in the access given to someone with a permanent versus an eligible role assignment. The only difference is that some people don't need that access all the time. |
| active | Type | A role assignment that doesn't require a user to perform any action to use the role. Users assigned as active have the privileges assigned to the role. |
| activate |  | The process of performing one or more actions to use a role that a user is eligible for. Actions might include performing a multifactor authentication (MFA) check, providing a business justification, or requesting approval from designated approvers. |
| permanent eligible | Duration | A role assignment where a user is always eligible to activate the role. |
| permanent active | Duration | A role assignment where a user can always use the role without performing any actions. |
| time-bound eligible | Duration | A role assignment where a user is eligible to activate the role only within start and end dates. |
| time-bound active | Duration | A role assignment where a user can use the role only within start and end dates. |
| just-in-time (JIT) access |  | A model in which users receive temporary permissions to perform privileged tasks, which prevents malicious or unauthorized users from gaining access after the permissions have expired. Access is granted only when users need it. |
| principle of least privilege access |  | A recommended security practice in which every user is provided with only the minimum privileges needed to accomplish the tasks they're authorized to perform. This practice minimizes the number of Global Administrators and instead uses specific administrator roles for certain scenarios. |

For more information, see [What is Microsoft Entra Privileged Identity Management?](/entra/id-governance/privileged-identity-management/pim-configure).

## Next steps

- [Delegate Azure access management to others](delegate-role-assignments-overview.md)
- [Steps to assign an Azure role](role-assignments-steps.md)
