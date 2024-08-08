---
title: Manage access to the de-identification service (preview) with Azure role-based access control (RBAC) in Azure Health Data Services
description: Learn how to manage access to the de-identification service (preview) using Azure role-based access control.
author: jovinson-ms
ms.author: jovinson
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: how-to
ms.date: 07/16/2024
---

# Use Azure role-based access control with the de-identification service (preview)

Microsoft Entra ID authorizes access rights to secured resources through Azure role-based access control (RBAC). The de-identification service (preview) defines a set of
built-in roles that encompass common sets of permissions used to access de-identification functionality.

Microsoft Entra ID uses the concept of a security principal, which can be a user, a group, an application service principal, or a [managed identity for Azure resources](/entra/identity/managed-identities-azure-resources/overview).

When an Azure role is assigned to a Microsoft Entra ID security principal over a specific scope, Azure grants access to that scope for that security principal. For more information about scopes, see
[Understand scope for Azure RBAC](/azure/role-based-access-control/scope-overview).

## Prerequisites

- A de-identification service (preview) in your Azure subscription. If you don't have a de-identification service, follow the steps in [Quickstart: Deploy the de-identification service](quickstart.md).

## Available built-in roles

The de-identification service (preview) has the following built-in roles available:

|Role |Description |
|-----|------------|
|DeID Data Owner |Full access to de-identification functionality. |
|DeID Real-time Data User |Execute requests against de-identification API endpoints. |
|DeID Batch Owner |Create and manage de-identification batch jobs. |
|DeID Batch Reader |Read-only access to de-identification batch jobs. |

## Assign a built-in role

Keep in mind the following points about Azure role assignments with the de-identification service (preview):

- When you create a de-identification service, you aren't automatically assigned permissions to access data via Microsoft Entra ID. You need to explicitly assign yourself an applicable Azure role. You can assign it at the level of your subscription, resource group, or de-identification service.
- It takes up to 10 minutes for changes role assignments to take effect.
- When the de-identification service is locked with an [Azure Resource Manager read-only lock](/azure/azure-resource-manager/management/lock-resources), the lock prevents the assignment of Azure roles that are scoped to the de-identification service.
- Azure deny assignments might block your access even if you have a role assignment. For more information, see [Understand Azure deny assignments](/azure/role-based-access-control/deny-assignments).

You can use different tools to assign built-in roles.

# [Azure portal](#tab/azure-portal)

To use the de-identification service (preview), with Microsoft Entra ID credentials, a security principal must be assigned one of the built-in roles. To learn how to assign these roles to a security
principal, follow the steps in [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

# [Azure PowerShell](#tab/azure-powershell)

To assign an Azure role to a security principal with PowerShell, call the [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) command. In order to run the command, you must have a role that includes **Microsoft.Authorization/roleAssignments/write** permissions assigned to you at the corresponding scope or higher.

The format of the command can differ based on the scope of the assignment, but `ObjectId` and `RoleDefinitionName` are required parameters. Passing a value for the `Scope` parameter, while not 
required, is highly recommended to retain the principle of least privilege. By limiting roles and scopes, you limit the resources that are at risk if the security principal is ever compromised.

The scope for a de-identification service (preview) is in the form `/subscriptions/<Subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.HealthDataAIServices/deidServices/<Deidentification Service Name>`

The example assigns the **DeID Data Owner** built-in role to a user, scoped to a specific de-identification service. Make sure to replace the placeholder values 
in angle brackets `<>` with your own values:

```azurepowershell
New-AzRoleAssignment 
	-SignInName <Email> `
	-RoleDefinitionName "DeID Data Owner" `
	-Scope "/subscriptions/<Subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.HealthDataAIServices/deidServices/<Deidentification Service Name>"
```

A successful response should look like:

```

console
RoleAssignmentId   : /subscriptions/<Subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.HealthDataAIServices/deidServices/<Deidentification Service Name>/providers/Microsoft.Authorization/roleAssignments/<Role Assignment ID>
Scope              : /subscriptions/<Subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.HealthDataAIServices/deidServices/<Deidentification Service Name>
DisplayName        : Mark Patrick
SignInName         : markpdaniels@contoso.com
RoleDefinitionName : DeID Data Owner
RoleDefinitionId   : <Role Definition ID>
ObjectId           : <Object ID>
ObjectType         : User
CanDelegate        : False

```

For more information, see [Assign Azure roles using Azure PowerShell](/azure/role-based-access-control/role-assignments-powershell).

# [Azure CLI](#tab/azure-pcli)

To assign an Azure role to a security principal with Azure CLI, use the [az role assignment create](/cli/azure/role/assignment) command. In order to run the command, you must have a role that includes
**Microsoft.Authorization/roleAssignments/write** permissions assigned to you at the corresponding scope or higher.

The format of the command can differ based on the type of security principal, but `role` and `scope` are required parameters.

The scope for a de-identification service (preview) is in the form `/subscriptions/<Subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.HealthDataAIServices/deidServices/<Deidentification Service Name>`

The following example assigns the **DeID Data Owner** built-in role to a user, scoped to a specific de-identification service. Make sure to replace the placeholder values 
in angle brackets `<>` with your own values:

```

azurecli
az role assignment create \
	--assignee <Email> \
	--role "DeID Data Owner" \
	--scope "/subscriptions/<Subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.HealthDataAIServices/deidServices/<Deidentification Service Name>"
```

For more information, see [Assign Azure roles using Azure PowerShell](/azure/role-based-access-control/role-assignments-cli).

# [ARM template](#tab/azure-resource-manager)

To learn how to use an Azure Resource Manager template to assign an Azure role, see [Assign Azure roles using Azure Resource Manager templates](/azure/role-based-access-control/role-assignments-template).

---

## Related content

- [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview)
- [Best practices for Azure RBAC](/azure/role-based-access-control/best-practices)
