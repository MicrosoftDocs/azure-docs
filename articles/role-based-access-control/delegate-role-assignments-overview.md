---
title: Delegate Azure access management to others - Azure ABAC
description: Overview of how to delegate the Azure role assignment task to other users by using Azure attribute-based access control (Azure ABAC).
services: active-directory
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: conceptual
ms.workload: identity
ms.date: 09/20/2023
ms.author: rolyon

#Customer intent: As a dev, devops, or it admin, I want to delegate the Azure role assignment task to other users who are closer to the decision, but want to limit the scope of the role assignments.
---

# Delegate Azure access management to others

In [Azure role-based access control (Azure RBAC)](overview.md), to grant access to Azure resources, you assign Azure roles. For example, if a user needs to create and manage websites in a subscription, you assign the Website Contributor role.
 
Assigning Azure roles to grant access to Azure resources is a common task. As an administrator, you might get several requests to grant access that you want to delegate to someone else. However, you want to make sure the delegate has just the permissions they need to do their job. This article describes a more secure way to delegate the role assignment task to other users in your organization.

## Why delegate role assignments?

Here are some reasons why you might want to delegate the role assignment task to others:

- You get several requests to assign roles in your organization.
- Users are blocked waiting for the role assignment they need.
- Users within their respective departments, teams, or projects have more knowledge about who needs access.
- Users have permissions to create Azure resources, but need an additional role assignment to fully use that resource. For example:
    - Users with permission to create virtual machines can't immediately sign in to the virtual machine without the Virtual Machine Administrator Login or Virtual Machine User Login role. Instead of tracking down an administrator to assign them a login role, it's more efficient if the user can assign the login role to themselves.
    - A developer has permissions to create an Azure Kubernetes Service (AKS) cluster and an Azure Container Registry (ACR), but needs to assign the AcrPull role to a managed identity so that it can pull images from the ACR. Instead of tracking down an administrator to assign the AcrPull role, it's more efficient if the developer can assign the role themselves.
    
## How you currently can delegate role assignments

The [Owner](built-in-roles.md#owner) and [User Access Administrator](built-in-roles.md#user-access-administrator) roles are built-in roles that allow users to create role assignments. Members of these roles can decide who can have write, read, and delete permissions for any resource in a subscription. To delegate the role assignment task to another user, you can assign the Owner or User Access Administrator role to a user.

The following diagram shows how Alice can delegate role assignment responsibilities to Dara. For specific steps, see [Assign a user as an administrator of an Azure subscription](role-assignments-portal-subscription-admin.md).

1. Alice assigns the User Access Administrator role to Dara.
1. Dara can now assign any role to any user, group, or service principal at the same scope.

:::image type="content" source="./media/delegate-role-assignments-overview/delegate-role-assignments-steps.png" alt-text="Diagram that shows an example where Dara can assign any role to any user." lightbox="./media/delegate-role-assignments-overview/delegate-role-assignments-steps.png":::

## What are the issues with the current delegation method?

Here are the primary issues with the current method of delegating role assignments to others in your organization.

- Delegate has unrestricted access at the role assignment scope. This violates the principle of least privilege, which exposes you to a wider attack surface.
- Delegate can assign any role to any user within their scope, including themselves.
- Delegate can assign the Owner or User Access Administrator roles to another user, who can then assign roles to other users.

Instead of assigning the Owner or User Access Administrator roles, a more secure method is to constrain a delegate's ability to create role assignments.

## A more secure method: Delegate role assignments with conditions (preview)

> [!IMPORTANT]
> Delegating Azure role assignments with conditions is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Delegating role assignments with conditions is a way to restrict the role assignments a user can create. In the preceding example, Alice can allow Dara to create some role assignments on her behalf, but not all role assignments. For example, Alice can constrain the roles that Dara can assign and constrain the principals that Dara can assign roles to. This delegation with conditions is sometimes referred to as *constrained delegation* and is implemented with [Azure attribute-based access control (Azure ABAC) conditions](conditions-overview.md).

To watch an overview video, see [Delegate Azure role assignments with conditions](https://youtu.be/3eDf2thqeO4?si=rBPW9BxRNtISkAGG).

## Why delegate role assignments with conditions?

Here are some reasons why delegating the role assignment task to others with conditions is more secure:

- You can restrict the role assignments the delegate is allowed to create.
- You can prevent a delegate from allowing another user to assign roles.
- You can enforce compliance of your organization's policies of least privilege.
- You can automate the management of Azure resources without having to grant full permissions to a service account.

## Conditions example

Consider an example where Alice is an administrator with the User Access Administrator role for a subscription. Alice wants to grant Dara the ability to assign specific roles for specific groups. Alice doesn't want Dara to have any other role assignment permissions. The following diagram shows how Alice can delegate role assignment responsibilities to Dara with conditions.

1. Alice assigns the Role Based Access Control Administrator (Preview) role to Dara. Alice adds conditions so that Dara can only assign the Backup Contributor or Backup Reader roles to the Marketing and Sales groups.
1. Dara can now assign the Backup Contributor or Backup Reader roles to the Marketing and Sales groups.
1. If Dara attempts to assign other roles or assign any roles to different principals (such as a user or managed identity), the role assignment fails.

:::image type="content" source="./media/delegate-role-assignments-overview/delegate-role-assignments-conditions-steps.png" alt-text="Diagram that shows an example where Dara can only assign the Backup Contributor or Backup Reader roles to Marketing or Sales groups." lightbox="./media/delegate-role-assignments-overview/delegate-role-assignments-conditions-steps.png":::

## Role Based Access Control Administrator role

The [Role Based Access Control Administrator (Preview)](built-in-roles.md#role-based-access-control-administrator-preview) role is a built-in role that has been designed for delegating the role assignment task to others. It has fewer permissions than [User Access Administrator](built-in-roles.md#user-access-administrator), which follows least privilege best practices. The Role Based Access Control Administrator role has following permissions:

- Create a role assignment at the specified scope
- Delete a role assignment at the specified scope
- Read resources of all types, except secrets
- Create and update a support ticket

## Ways to constrain role assignments

Here are the ways that role assignments can be constrained with conditions. You can also combine these conditions to fit your scenario.

- Constrain the **roles** that can be assigned

    :::image type="content" source="./media/shared/roles-constrained.png" alt-text="Diagram of role assignments constrained to Backup Contributor and Backup Reader roles." lightbox="./media/shared/roles-constrained.png":::

- Constrain the **roles** and **types of principals** (users, groups, or service principals) that can be assigned roles

    :::image type="content" source="./media/shared/principal-types-constrained.png" alt-text="Diagram of role assignments constrained to Backup Contributor or Backup Reader roles and user or group principal types." lightbox="./media/shared/principal-types-constrained.png":::

- Constrain the **roles** and **specific principals** that can be assigned roles

    :::image type="content" source="./media/shared/groups-constrained.png" alt-text="Diagram of role assignments constrained to Backup Contributor or Backup Reader roles and specific groups." lightbox="./media/shared/groups-constrained.png":::

- Specify different conditions for the add and remove **role assignment actions**

    :::image type="content" source="./media/shared/actions-constrained.png" alt-text="Diagram of add and remove role assignments constrained to Backup Contributor or Backup Reader roles." lightbox="./media/shared/actions-constrained.png":::

## How to delegate role assignments with conditions

To delegate role assignments with conditions, you assign roles as you currently do, but you also add a [condition to the role assignment](delegate-role-assignments-portal.md).

1. Determine the permissions the delegate needs

    - What roles can the delegate assign?
    - What types of principals can the delegate assign roles to?
    - Which principals can the delegate assign roles to?
    - Can delegate remove any role assignments?

1. Start a new role assignment

1. Select the [Role Based Access Control Administrator (Preview)](built-in-roles.md#role-based-access-control-administrator-preview) role

    You can select any role that includes the `Microsoft.Authorization/roleAssignments/write` action, but Role Based Access Control Administrator (Preview) has fewer permissions.

1. Select the delegate

    Select the user that you want to delegate the role assignments task to.

1. Add a condition

    There are multiple ways that you can add a condition. For example, you can use a condition template in the Azure portal, the advanced condition editor in the Azure portal, Azure PowerShell, Azure CLI, Bicep, or REST API.

    # [Template](#tab/template)

    Choose from a list of condition templates. Select **Configure** to specify the roles, principal types, or principals.

    For more information, see [Delegate the Azure role assignment task to others with conditions (preview)](delegate-role-assignments-portal.md).
    
    :::image type="content" source="./media/shared/condition-templates.png" alt-text="Screenshot of Add role assignment condition with a list of condition templates." lightbox="./media/shared/condition-templates.png":::

    # [Condition editor](#tab/condition-editor)

    If the condition templates don't work for your scenario or if you want more control, you can use the condition editor.

    For examples, see [Examples to delegate Azure role assignments with conditions (preview)](delegate-role-assignments-examples.md).

    :::image type="content" source="./media/shared/delegate-role-assignments-expression.png" alt-text="Screenshot of condition editor in Azure portal showing a role assignment condition to delegate role assignments with conditions." lightbox="./media/shared/delegate-role-assignments-expression.png":::

    # [Azure PowerShell](#tab/azure-powershell)

    [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment)

    ```azurepowershell
    $roleDefinitionId = "f58310d9-a9f6-439a-9e8d-f62e7b41a168"
    $principalId = "<principalId>"
    $scope = "/subscriptions/<subscriptionId>"
    $condition = "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912} AND @Request[Microsoft.Authorization/roleAssignments:PrincipalType] ForAnyOfAnyValues:StringEqualsIgnoreCase {'User'})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912} AND @Resource[Microsoft.Authorization/roleAssignments:PrincipalType] ForAnyOfAnyValues:StringEqualsIgnoreCase {'User'}))"
    $conditionVersion = "2.0"
    New-AzRoleAssignment -ObjectId $principalId -Scope $scope -RoleDefinitionId $roleDefinitionId -Condition $condition -ConditionVersion $conditionVersion
    ```
    
    # [Azure CLI](#tab/azure-cli)

    [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create)

    ```azurecli
    set roleDefinitionId="f58310d9-a9f6-439a-9e8d-f62e7b41a168"
    set principalId="{principalId}"
    set principalType="User"
    set scope="/subscriptions/{subscriptionId}"
    set condition="((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912} AND @Request[Microsoft.Authorization/roleAssignments:PrincipalType] ForAnyOfAnyValues:StringEqualsIgnoreCase {'User'})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912} AND @Resource[Microsoft.Authorization/roleAssignments:PrincipalType] ForAnyOfAnyValues:StringEqualsIgnoreCase {'User'}))"
    set conditionVersion="2.0"
    az role assignment create --assignee-object-id %principalId% --assignee-principal-type %principalType% --scope %scope% --role %roleDefinitionId% --condition %condition% --condition-version %conditionVersion%
    ```
    
    # [Bicep](#tab/bicep)

    ```Bicep
    param roleDefinitionResourceId string
    param principalId string
    param condition string
    
    targetScope = 'subscription'
    
    resource roleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
      name: guid(subscription().id, principalId, roleDefinitionResourceId)
      properties: {
        roleDefinitionId: roleDefinitionResourceId
        principalId: principalId
        principalType: 'User'
        condition: condition
        conditionVersion:'2.0'
      }
    }
    ```
    
    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "roleDefinitionResourceId": {
          "value": "providers/Microsoft.Authorization/roleDefinitions/f58310d9-a9f6-439a-9e8d-f62e7b41a168"
        },
        "principalId": {
          "value": "{principalId}"
        },
        "condition": {
          "value": "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912} AND @Request[Microsoft.Authorization/roleAssignments:PrincipalType] ForAnyOfAnyValues:StringEqualsIgnoreCase {'User'})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912} AND @Resource[Microsoft.Authorization/roleAssignments:PrincipalType] ForAnyOfAnyValues:StringEqualsIgnoreCase {'User'}))"
        }
      }
    }
    ```
    
    # [REST API](#tab/rest)
    
    [Role Assignments - Create](/rest/api/authorization/role-assignments/create)
    
    ```http
    PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleAssignments/f58310d9-a9f6-439a-9e8d-f62e7b41a168?api-version=2020-04-01-Preview
    
    {
      "properties": {
        "roleDefinitionId": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/f58310d9-a9f6-439a-9e8d-f62e7b41a168",
        "principalId": "{principalId}",
        "condition": "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912} AND @Request[Microsoft.Authorization/roleAssignments:PrincipalType] ForAnyOfAnyValues:StringEqualsIgnoreCase {'User'})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912} AND @Resource[Microsoft.Authorization/roleAssignments:PrincipalType] ForAnyOfAnyValues:StringEqualsIgnoreCase {'User'}))",
        "conditionVersion": "2.0"
      }
    }
    ```

    ---

1. Assign role with condition to delegate

    Once you have specified your condition, complete the role assignment.

1. Contact the delegate

    Let the delegate know that they can now assign roles with conditions.

## Built-in roles with conditions

The [Key Vault Data Access Administrator (Preview)](built-in-roles.md#key-vault-data-access-administrator-preview) role already has a built-in condition to constrain role assignments. This role enables you to manage access to Key Vault secrets, certificates, and keys. It's exclusively focused on access control without the ability to assign privileged roles such as Owner or User Access Administrator roles. It allows better separation of duties for scenarios like managing encryption at rest across data services to further comply with least privilege principle. The condition constrains role assignments to the following Azure Key Vault roles:

- [Key Vault Administrator](built-in-roles.md#key-vault-administrator)
- [Key Vault Certificates Officer](built-in-roles.md#key-vault-certificates-officer)
- [Key Vault Crypto Officer](built-in-roles.md#key-vault-crypto-officer)
- [Key Vault Crypto Service Encryption User](built-in-roles.md#key-vault-crypto-service-encryption-user)
- [Key Vault Crypto User](built-in-roles.md#key-vault-crypto-user)
- [Key Vault Reader](built-in-roles.md#key-vault-reader)
- [Key Vault Secrets Officer](built-in-roles.md#key-vault-secrets-officer)
- [Key Vault Secrets User](built-in-roles.md#key-vault-secrets-user)

:::image type="content" source="./media/delegate-role-assignments-overview/key-vault-roles-constrained.png" alt-text="Diagram of role assignments constrained to Key Vault roles." lightbox="./media/delegate-role-assignments-overview/key-vault-roles-constrained.png":::

If you want to further constrain the Key Vault Data Access Administrator role assignment, you can add your own condition to constrain the **types of principals** (users, groups, or service principals) or **specific principals** that can be assigned the Key Vault roles.

:::image type="content" source="./media/delegate-role-assignments-overview/key-vault-roles-principal-types-constrained.png" alt-text="Diagram of role assignments constrained to Key Vault roles and user principal type." lightbox="./media/delegate-role-assignments-overview/key-vault-roles-principal-types-constrained.png":::

## Known issues

Here are the known issues related to delegating role assignments with conditions (preview):

- You can't delegate role assignments with conditions using [Privileged Identity Management](../active-directory/privileged-identity-management/pim-resource-roles-assign-roles.md).
- You can't have a role assignment with a Microsoft.Storage data action and an ABAC condition that uses a GUID comparison operator. For more information, see [Troubleshoot Azure RBAC](troubleshooting.md#symptom---authorization-failed).
- This preview isn't available in Azure Government or Microsoft Azure operated by 21Vianet.

## License requirements

[!INCLUDE [Azure AD free license](../../includes/active-directory-free-license.md)]

## Next steps

- [Delegate the Azure role assignment task to others with conditions (preview)](delegate-role-assignments-portal.md)
- [What is Azure attribute-based access control (Azure ABAC)?](conditions-overview.md)
- [Examples to delegate Azure role assignments with conditions (preview)](delegate-role-assignments-examples.md)
