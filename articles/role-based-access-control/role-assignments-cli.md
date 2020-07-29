---
title: Add or remove Azure role assignments using Azure CLI - Azure RBAC
description: Learn how to grant access to Azure resources for users, groups, service principals, or managed identities using Azure CLI and Azure role-based access control (Azure RBAC).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.assetid: 3483ee01-8177-49e7-b337-4d5cb14f5e32
ms.service: role-based-access-control
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/25/2019
ms.author: rolyon
ms.reviewer: bagovind
---
# Add or remove Azure role assignments using Azure CLI

[!INCLUDE [Azure RBAC definition grant access](../../includes/role-based-access-control-definition-grant.md)] This article describes how to assign roles using Azure CLI.

## Prerequisites

To add or remove role assignments, you must have:

- `Microsoft.Authorization/roleAssignments/write` and `Microsoft.Authorization/roleAssignments/delete` permissions, such as [User Access Administrator](built-in-roles.md#user-access-administrator) or [Owner](built-in-roles.md#owner)
- [Bash in Azure Cloud Shell](/azure/cloud-shell/overview) or [Azure CLI](/cli/azure)

## Get object IDs

To add or remove role assignments, you might need to specify the unique ID of an object. The ID has the format: `11111111-1111-1111-1111-111111111111`. You can get the ID using the Azure portal or Azure CLI.

### User

To get the object ID for an Azure AD user, you can use [az ad user show](/cli/azure/ad/user#az-ad-user-show).

```azurecli
az ad user show --id "{email}" --query objectId --output tsv
```

### Group

To get the object ID for an Azure AD group, you can use [az ad group show](/cli/azure/ad/group#az-ad-group-show) or [az ad group list](/cli/azure/ad/group#az-ad-group-list).

```azurecli
az ad group show --group "{name}" --query objectId --output tsv
```

### Application

To get the object ID for an Azure AD service principal (identity used by an application), you can use [az ad sp list](/cli/azure/ad/sp#az-ad-sp-list). For a service principal, use the object ID and **not** the application ID.

```azurecli
az ad sp list --display-name "{name}" --query [].objectId --output tsv
```

## Add a role assignment

In Azure RBAC, to grant access, you add a role assignment.

### User at a resource group scope

To add a role assignment for a user at a resource group scope, use [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create).

```azurecli
az role assignment create --role <role_name_or_id> --assignee <assignee> --resource-group <resource_group>
```

The following example assigns the *Virtual Machine Contributor* role to *patlong\@contoso.com* user at the *pharma-sales* resource group scope:

```azurecli
az role assignment create --role "Virtual Machine Contributor" --assignee patlong@contoso.com --resource-group pharma-sales
```

### Using the unique role ID

There are a couple of times when a role name might change, for example:

- You are using your own custom role and you decide to change the name.
- You are using a preview role that has **(Preview)** in the name. When the role is released, the role is renamed.

> [!IMPORTANT]
> A preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Even if a role is renamed, the role ID does not change. If you are using scripts or automation to create your role assignments, it's a best practice to use the unique role ID instead of the role name. Therefore, if a role is renamed, your scripts are more likely to work.

To add a role assignment using the unique role ID instead of the role name, use [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create).

```azurecli
az role assignment create --role <role_id> --assignee <assignee> --resource-group <resource_group>
```

The following example assigns the [Virtual Machine Contributor](built-in-roles.md#virtual-machine-contributor) role to the *patlong\@contoso.com* user at the *pharma-sales* resource group scope. To get the unique role ID, you can use [az role definition list](/cli/azure/role/definition#az-role-definition-list) or see [Azure built-in roles](built-in-roles.md).

```azurecli
az role assignment create --role 9980e02c-c2be-4d73-94e8-173b1dc7cf3c --assignee patlong@contoso.com --resource-group pharma-sales
```

### Group at a subscription scope

To add a role assignment for a group, use [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create). For information about how to get the object ID of the group, see [Get object IDs](#get-object-ids).

```azurecli
az role assignment create --role <role_name_or_id> --assignee-object-id <assignee_object_id> --resource-group <resource_group> --scope </subscriptions/subscription_id>
```

The following example assigns the *Reader* role to the *Ann Mack Team* group with ID 22222222-2222-2222-2222-222222222222 at a subscription scope.

```azurecli
az role assignment create --role Reader --assignee-object-id 22222222-2222-2222-2222-222222222222 --scope /subscriptions/00000000-0000-0000-0000-000000000000
```

### Group at a resource scope

To add a role assignment for a group, use [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create). For information about how to get the object ID of the group, see [Get object IDs](#get-object-ids).

The following example assigns the *Virtual Machine Contributor* role to the *Ann Mack Team* group with ID 22222222-2222-2222-2222-222222222222 at a resource scope for a virtual network named *pharma-sales-project-network*.

```azurecli
az role assignment create --role "Virtual Machine Contributor" --assignee-object-id 22222222-2222-2222-2222-222222222222 --scope /subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/pharma-sales/providers/Microsoft.Network/virtualNetworks/pharma-sales-project-network
```

### Application at a resource group scope

To add a role assignment for an application, use [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create). For information about how to get the object ID of the application, see [Get object IDs](#get-object-ids).

```azurecli
az role assignment create --role <role_name_or_id> --assignee-object-id <assignee_object_id> --resource-group <resource_group>
```

The following example assigns the *Virtual Machine Contributor* role to an application with object ID 44444444-4444-4444-4444-444444444444 at the *pharma-sales* resource group scope.

```azurecli
az role assignment create --role "Virtual Machine Contributor" --assignee-object-id 44444444-4444-4444-4444-444444444444 --resource-group pharma-sales
```

### User at a subscription scope

To add a role assignment for a user at a subscription scope, use [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create). To get the subscription ID, you can find it on the **Subscriptions** blade in the Azure portal or you can use [az account list](/cli/azure/account#az-account-list).

```azurecli
az role assignment create --role <role_name_or_id> --assignee <assignee> --subscription <subscription_name_or_id>
```

The following example assigns the *Reader* role to the *annm\@example.com* user at a subscription scope.

```azurecli
az role assignment create --role "Reader" --assignee annm@example.com --subscription 00000000-0000-0000-0000-000000000000
```

### User at a management group scope

To add a role assignment for a user at a management group scope, use [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create). To get the management group ID, you can find it on the **Management groups** blade in the Azure portal or you can use [az account management-group list](/cli/azure/account/management-group#az-account-management-group-list).

```azurecli
az role assignment create --role <role_name_or_id> --assignee <assignee> --scope /providers/Microsoft.Management/managementGroups/<group_id>
```

The following example assigns the *Billing Reader* role to the *alain\@example.com* user at a management group scope.

```azurecli
az role assignment create --role "Billing Reader" --assignee alain@example.com --scope /providers/Microsoft.Management/managementGroups/marketing-group
```

### New service principal

If you create a new service principal and immediately try to assign a role to that service principal, that role assignment can fail in some cases. For example, if you use a script to create a new managed identity and then try to assign a role to that service principal, the role assignment might fail. The reason for this failure is likely a replication delay. The service principal is created in one region; however, the role assignment might occur in a different region that hasn't replicated the service principal yet. To address this scenario, you should specify the principal type when creating the role assignment.

To add a role assignment, use [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create), specify a value for `--assignee-object-id`, and then set `--assignee-principal-type` to `ServicePrincipal`.

```azurecli
az role assignment create --role <role_name_or_id> --assignee-object-id <assignee_object_id> --assignee-principal-type <assignee_principal_type> --resource-group <resource_group> --scope </subscriptions/subscription_id>
```

The following example assigns the *Virtual Machine Contributor* role to the *msi-test* managed identity at the *pharma-sales* resource group scope:

```azurecli
az role assignment create --role "Virtual Machine Contributor" --assignee-object-id 33333333-3333-3333-3333-333333333333 --assignee-principal-type ServicePrincipal --resource-group pharma-sales
```

## Remove a role assignment

In Azure RBAC, to remove access, you remove a role assignment by using [az role assignment delete](/cli/azure/role/assignment#az-role-assignment-delete):

```azurecli
az role assignment delete --assignee <assignee> --role <role_name_or_id> --resource-group <resource_group>
```

The following example removes the *Virtual Machine Contributor* role assignment from the *patlong\@contoso.com* user on the *pharma-sales* resource group:

```azurecli
az role assignment delete --assignee patlong@contoso.com --role "Virtual Machine Contributor" --resource-group pharma-sales
```

The following example removes the *Reader* role from the *Ann Mack Team* group with ID 22222222-2222-2222-2222-222222222222 at a subscription scope. For information about how to get the object ID of the group, see [Get object IDs](#get-object-ids).

```azurecli
az role assignment delete --assignee 22222222-2222-2222-2222-222222222222 --role "Reader" --subscription 00000000-0000-0000-0000-000000000000
```

The following example removes the *Billing Reader* role from the *alain\@example.com* user at the management group scope. To get the ID of the management group, you can use [az account management-group list](/cli/azure/account/management-group#az-account-management-group-list).

```azurecli
az role assignment delete --assignee alain@example.com --role "Billing Reader" --scope /providers/Microsoft.Management/managementGroups/marketing-group
```

## Next steps

- [List Azure role assignments using Azure CLI](role-assignments-list-cli.md)
- [Use the Azure CLI to manage Azure resources and resource groups](../azure-resource-manager/cli-azure-resource-manager.md)
