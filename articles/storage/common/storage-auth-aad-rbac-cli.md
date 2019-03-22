---
title: Use Azure CLI to manage Azure AD access rights to containers and queues with RBAC - Azure Storage
description: Use Azure CLI to assign access to containers and queues with role-based access control (RBAC). Azure Storage supports built-in and custom RBAC roles for authentication via Azure AD.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 03/21/2019
ms.author: tamram
ms.subservice: common
---

# Grant access to Azure containers and queues with RBAC using Azure CLI

Azure Active Directory (Azure AD) authorizes access rights to secured resources through [role-based access control (RBAC)](../../role-based-access-control/overview.md). Azure Storage defines a set of built-in RBAC roles that encompass common sets of permissions used to access containers or queues. 

When an RBAC role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. Access can be scoped to the level of the subscription, the resource group, the storage account, or an individual container or queue. An Azure AD security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

This article describes how to use Azure CLI to assign RBAC roles that are scoped to a container or queue. 

## RBAC roles for blobs and queues

[!INCLUDE [storage-auth-rbac-roles-include](../../../includes/storage-auth-rbac-roles-include.md)]

## Determine resource scope 

[!INCLUDE [storage-auth-resource-scope-include](../../../includes/storage-auth-resource-scope-include.md)]

## List available RBAC roles

To list available built-in RBAC roles with Azure CLI, use the [az role assignment list](https://docs.microsoft.com/cli/azure/role/assignment?view=azure-cli-latest#az-role-assignment-list) command:

```azurecli-interactive
az role definition list --out table
```

## Assign an RBAC role to a user

To assign an RBAC role to a user, use the [az role assignment create]() command. The format of the command can differ based on the scope of the assignment. The following examples show how to assign a role to a user at various scopes.

### Container or queue 

To assign a role at the scope of the container or queue, you need to specify the full scope of the resource for the `--scope` parameter. The full scope is in the form:

```
/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/blobServices/default/containers/[<container-name>|<queue-name>]
```

The following example assigns the **Storage Blob Data Reader** role to a user, scoped to a container named *sample-container*. Make sure to replace the sample values and the placeholder in brackets with your own values: 

```azurecli-interactive
az role assignment create --role "Storage Blob Data Reader" --assignee user@azure.com --scope "/subscriptions/<subscription-id>/resourceGroups/sample-resource-group/providers/Microsoft.Storage/storageAccounts/storagesamples/blobServices/default/containers/sample-container"
```


## Next steps

For more information about RBAC roles for storage resources, see [Authenticate access to Azure blobs and queues using Azure Active Directory](storage-auth-aad.md). 
