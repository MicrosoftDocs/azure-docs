---
title: Manage access to Azure resources using RBAC and Azure CLI | Microsoft Docs
description: Learn how to manage access to Azure resources for users, groups, and applications using role-based access control (RBAC) and Azure CLI. This includes how to list access, grant access, and remove access.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.assetid: 3483ee01-8177-49e7-b337-4d5cb14f5e32
ms.service: role-based-access-control
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/21/2019
ms.author: rolyon
ms.reviewer: bagovind
---
# List role assignments using RBAC and Azure CLI

[Role-based access control (RBAC)](overview.md) is the way that you manage access to Azure resources. This article describes how you manage access for users, groups, and applications using RBAC and Azure CLI.

## Prerequisites

To manage access, you need one of the following:

* [Bash in Azure Cloud Shell](/azure/cloud-shell/overview)
* [Azure CLI](/cli/azure)

## User

To list the role assignments for a specific user, use [az role assignment list](/cli/azure/role/assignment#az-role-assignment-list):

```azurecli
az role assignment list --assignee <assignee>
```

By default, only direct assignments scoped to subscription will be displayed. To view assignments scoped by resource or group, use `--all` and to view inherited assignments, use `--include-inherited`.

The following example lists the role assignments that are assigned directly to the *patlong\@contoso.com* user:

```azurecli
az role assignment list --all --assignee patlong@contoso.com --output json | jq '.[] | {"principalName":.principalName, "roleDefinitionName":.roleDefinitionName, "scope":.scope}'
```

```Output
{
  "principalName": "patlong@contoso.com",
  "roleDefinitionName": "Backup Operator",
  "scope": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/pharma-sales"
}
{
  "principalName": "patlong@contoso.com",
  "roleDefinitionName": "Virtual Machine Contributor",
  "scope": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/pharma-sales"
}
```

## Resource group

To list the role assignments that exist at a resource group scope, use [az role assignment list](/cli/azure/role/assignment#az-role-assignment-list):

```azurecli
az role assignment list --resource-group <resource_group>
```

The following example lists the role assignments for the *pharma-sales* resource group:

```azurecli
az role assignment list --resource-group pharma-sales --output json | jq '.[] | {"principalName":.principalName, "roleDefinitionName":.roleDefinitionName, "scope":.scope}'
```

```Output
{
  "principalName": "patlong@contoso.com",
  "roleDefinitionName": "Backup Operator",
  "scope": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/pharma-sales"
}
{
  "principalName": "patlong@contoso.com",
  "roleDefinitionName": "Virtual Machine Contributor",
  "scope": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/pharma-sales"
}

...
```

## Subscription

To list all role assignments at a subscription scope, use [az role assignment list](/cli/azure/role/assignment#az-role-assignment-list). To get the subscription ID, you can find it on the **Subscriptions** blade in the Azure portal or you can use [az account list](/cli/azure/account#az-account-list).

```azurecli
az role assignment list --subscription <subscription_name_or_id>
```

```Example
az role assignment list --subscription 00000000-0000-0000-0000-000000000000 --output json | jq '.[] | {"principalName":.principalName, "roleDefinitionName":.roleDefinitionName, "scope":.scope}'
```

## Management group

To list all role assignments at a management group scope, use [az role assignment list](/cli/azure/role/assignment#az-role-assignment-list). To get the management group ID, you can find it on the **Management groups** blade in the Azure portal or you can use [az account management-group list](/cli/azure/ext/managementgroups/account/management-group#ext-managementgroups-az-account-management-group-list).

```azurecli
az role assignment list --scope /providers/Microsoft.Management/managementGroups/<group_id>
```

```Example
az role assignment list --scope /providers/Microsoft.Management/managementGroups/marketing-group --output json | jq '.[] | {"principalName":.principalName, "roleDefinitionName":.roleDefinitionName, "scope":.scope}'
```

## Next steps

- [Tutorial: Create a custom role for Azure resources using Azure CLI](tutorial-custom-role-cli.md)
- [Use the Azure CLI to manage Azure resources and resource groups](../azure-resource-manager/cli-azure-resource-manager.md)
