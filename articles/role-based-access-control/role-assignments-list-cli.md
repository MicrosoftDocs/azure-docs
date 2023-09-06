---
title: List Azure role assignments using Azure CLI - Azure RBAC
description: Learn how to determine what resources users, groups, service principals, or managed identities have access to using Azure CLI and Azure role-based access control (Azure RBAC).
services: active-directory
documentationcenter: ''
author: rolyon
manager: amycolannino
ms.assetid: 3483ee01-8177-49e7-b337-4d5cb14f5e32
ms.service: role-based-access-control
ms.topic: how-to
ms.tgt_pltfrm: na
ms.custom: devx-track-azurecli
ms.workload: identity
ms.date: 05/23/2023
ms.author: rolyon
ms.reviewer: bagovind
---
# List Azure role assignments using Azure CLI

[!INCLUDE [Azure RBAC definition list access](../../includes/role-based-access-control/definition-list.md)] This article describes how to list role assignments using Azure CLI.

> [!NOTE]
> If your organization has outsourced management functions to a service provider who uses [Azure Lighthouse](../lighthouse/overview.md), role assignments authorized by that service provider won't be shown here.

## Prerequisites

- [Bash in Azure Cloud Shell](../cloud-shell/overview.md) or [Azure CLI](/cli/azure)

## List role assignments for a user

To list the role assignments for a specific user, use [az role assignment list](/cli/azure/role/assignment#az-role-assignment-list):

```azurecli
az role assignment list --assignee {assignee}
```

By default, only role assignments for the current subscription will be displayed. To view role assignments for the current subscription and below, add the `--all` parameter. To include role assignments at parent scopes, add the `--include-inherited` parameter. To include role assignments for groups of which the user is a member transitively, add the `--include-groups` parameter.

The following example lists the role assignments that are assigned directly to the *patlong\@contoso.com* user:

```azurecli
az role assignment list --all --assignee patlong@contoso.com --output json --query '[].{principalName:principalName, roleDefinitionName:roleDefinitionName, scope:scope}'
```

```json
[
  {
    "principalName": "patlong@contoso.com",
    "roleDefinitionName": "Backup Operator",
    "scope": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/pharma-sales"
  },
  {
    "principalName": "patlong@contoso.com",
    "roleDefinitionName": "Virtual Machine Contributor",
    "scope": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/pharma-sales"
  }
]
```

## List role assignments for a resource group

To list the role assignments that exist at a resource group scope, use [az role assignment list](/cli/azure/role/assignment#az-role-assignment-list):

```azurecli
az role assignment list --resource-group {resourceGroup}
```

The following example lists the role assignments for the *pharma-sales* resource group:

```azurecli
az role assignment list --resource-group pharma-sales --output json --query '[].{principalName:principalName, roleDefinitionName:roleDefinitionName, scope:scope}'
```

```json
[
  {
    "principalName": "patlong@contoso.com",
    "roleDefinitionName": "Backup Operator",
    "scope": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/pharma-sales"
  },
  {
    "principalName": "patlong@contoso.com",
    "roleDefinitionName": "Virtual Machine Contributor",
    "scope": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/pharma-sales"
  },
  
  ...

]
```

## List role assignments for a subscription

To list all role assignments at a subscription scope, use [az role assignment list](/cli/azure/role/assignment#az-role-assignment-list). To get the subscription ID, you can find it on the **Subscriptions** blade in the Azure portal or you can use [az account list](/cli/azure/account#az-account-list).

```azurecli
az role assignment list --subscription {subscriptionNameOrId}
```

Example:

```azurecli
az role assignment list --subscription 00000000-0000-0000-0000-000000000000 --output json --query '[].{principalName:principalName, roleDefinitionName:roleDefinitionName, scope:scope}'
```

```json
[
  {
    "principalName": "admin@contoso.com",
    "roleDefinitionName": "Owner",
    "scope": "/subscriptions/00000000-0000-0000-0000-000000000000"
  },
  {
    "principalName": "Subscription Admins",
    "roleDefinitionName": "Owner",
    "scope": "/subscriptions/00000000-0000-0000-0000-000000000000"
  },
  {
    "principalName": "alain@contoso.com",
    "roleDefinitionName": "Reader",
    "scope": "/subscriptions/00000000-0000-0000-0000-000000000000"
  },

  ...

]
```

## List role assignments for a management group

To list all role assignments at a management group scope, use [az role assignment list](/cli/azure/role/assignment#az-role-assignment-list). To get the management group ID, you can find it on the **Management groups** blade in the Azure portal or you can use [az account management-group list](/cli/azure/account/management-group#az-account-management-group-list).

```azurecli
az role assignment list --scope /providers/Microsoft.Management/managementGroups/{groupId}
```

Example:

```azurecli
az role assignment list --scope /providers/Microsoft.Management/managementGroups/sales-group --output json --query '[].{principalName:principalName, roleDefinitionName:roleDefinitionName, scope:scope}'
```

```json
[
  {
    "principalName": "admin@contoso.com",
    "roleDefinitionName": "Owner",
    "scope": "/providers/Microsoft.Management/managementGroups/sales-group"
  },
  {
    "principalName": "alain@contoso.com",
    "roleDefinitionName": "Reader",
    "scope": "/providers/Microsoft.Management/managementGroups/sales-group"
  }
]
```

## List role assignments for a managed identity

1. Get the principal ID of the system-assigned or user-assigned managed identity.

    To get the principal ID of a user-assigned managed identity, you can use [az ad sp list](/cli/azure/ad/sp#az-ad-sp-list) or [az identity list](/cli/azure/identity#az-identity-list).

    ```azurecli
    az ad sp list --display-name "{name}" --query [].id --output tsv
    ```

    To get the principal ID of a system-assigned managed identity, you can use [az ad sp list](/cli/azure/ad/sp#az-ad-sp-list).

    ```azurecli
    az ad sp list --display-name "{vmname}" --query [].id --output tsv
    ```

1. To list the role assignments, use [az role assignment list](/cli/azure/role/assignment#az-role-assignment-list).

    By default, only role assignments for the current subscription will be displayed. To view role assignments for the current subscription and below, add the `--all` parameter. To view inherited role assignments, add the `--include-inherited` parameter.

    ```azurecli
    az role assignment list --assignee {objectId}
    ```

## Next steps

- [Assign Azure roles using Azure CLI](role-assignments-cli.md)
