---
title: Registry roles and permissions
description: Use Azure role-based access control (Azure RBAC) and identity and access management (IAM) to provide fine-grained permissions to resources in an Azure container registry.
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
---

# Azure Container Registry roles and permissions

The Azure Container Registry service supports a set of [built-in Azure roles](../role-based-access-control/built-in-roles.md) that provide different levels of permissions to an Azure container registry. Use [Azure role-based access control (Azure RBAC)](../role-based-access-control/index.yml) to assign specific permissions to users, service principals, or other identities that need to interact with a registry, for example to pull or push container images. You can also define [custom roles](#custom-roles) with fine-grained permissions to a registry for different operations.

| Role/Permission       | [Access Resource Manager](#access-resource-manager) | [Create/delete registry](#create-and-delete-registry) | [Push image](#push-image) | [Pull image](#pull-image) | [Delete image data](#delete-image-data) | [Change policies](#change-policies) |   [Sign images](#sign-images)  |
| ---------| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| Owner | X | X | X | X | X | X |  |
| Contributor | X | X | X |  X | X | X |  |
| Reader | X |  |  | X |  |  |  |
| AcrPush |  |  | X | X | |  |  |
| AcrPull |  |  |  | X |  |  |  |
| AcrDelete |  |  |  |  | X |  |  |
| AcrImageSigner |  |  |  |  |  |  | X |

## Assign roles

See [Steps to add a role assignment](../role-based-access-control/role-assignments-steps.md) for high-level steps to add a role assignment to an existing user, group, service principal, or managed identity. You can use the Azure portal, Azure CLI, Azure PowerShell, or other Azure tools.

When creating a service principal, you also configure its access and permissions to Azure resources such as a container registry. For an example script using the Azure CLI, see [Azure Container Registry authentication with service principals](container-registry-auth-service-principal.md#create-a-service-principal).

## Differentiate users and services

Any time permissions are applied, a best practice is to provide the most limited set of permissions for a person, or service, to accomplish a task. The following permission sets represent a set of capabilities that may be used by humans and headless services.

### CI/CD solutions

When automating `docker build` commands from CI/CD solutions, you need `docker push` capabilities. For these headless service scenarios, we recommend assigning the **AcrPush** role. This role, unlike the broader **Contributor** role, prevents the account from performing other registry operations or accessing Azure Resource Manager.

### Container host nodes

Likewise, nodes running your containers need the **AcrPull** role, but shouldn't require **Reader** capabilities.

### Visual Studio Code Docker extension

For tools like the Visual Studio Code [Docker extension](https://code.visualstudio.com/docs/azure/docker), additional resource provider access is required to list the available Azure container registries. In this case, provide your users access to the **Reader** or **Contributor** role. These roles allow `docker pull`, `docker push`, `az acr list`, `az acr build`, and other capabilities.

## Access Resource Manager

### [Azure CLI](#tab/azure-cli)

Azure Resource Manager access is required for the Azure portal and registry management with the [Azure CLI](/cli/azure/). For example, to get a list of registries by using the `az acr list` command, you need this permission set.

### [Azure PowerShell](#tab/azure-powershell)

Azure Resource Manager access is required for the Azure portal and registry management with [Azure PowerShell](/powershell/azure/). For example, to get a list of registries by using the `Get-AzContainerRegistry` cmdlet, you need this permission set.

---

## Create and delete registry

The ability to create and delete Azure container registries.

## Push image

The ability to `docker push` an image, or push another [supported artifact](container-registry-image-formats.md) such as a Helm chart, to a registry. Requires [authentication](container-registry-authentication.md) with the registry using the authorized identity.

## Pull image

The ability to `docker pull` a non-quarantined image, or pull another [supported artifact](container-registry-image-formats.md) such as a Helm chart, from a registry. Requires [authentication](container-registry-authentication.md) with the registry using the authorized identity.

## Delete image data

The ability to [delete container images](container-registry-delete.md), or delete other [supported artifacts](container-registry-image-formats.md) such as Helm charts, from a registry.

## Change policies

The ability to configure policies on a registry. Policies include image purging, enabling quarantine, and image signing.

## Sign images

The ability to sign images, usually assigned to an automated process, which would use a service principal. This permission is typically combined with [push image](#push-image) to allow pushing a trusted image to a registry. For details, see [Content trust in Azure Container Registry](container-registry-content-trust.md).

## Custom roles

As with other Azure resources, you can create [custom roles](../role-based-access-control/custom-roles.md) with fine-grained permissions to Azure Container Registry. Then assign the custom roles to users, service principals, or other identities that need to interact with a registry.

To determine which permissions to apply to a custom role, see the list of Microsoft.ContainerRegistry [actions](../role-based-access-control/resource-provider-operations.md#microsoftcontainerregistry), review the permitted actions of the [built-in ACR roles](../role-based-access-control/built-in-roles.md), or run the following command:

# [Azure CLI](#tab/azure-cli)

```azurecli
az provider operation show --namespace Microsoft.ContainerRegistry
```

To define a custom role, see [Steps to create a custom role](../role-based-access-control/custom-roles.md#steps-to-create-a-custom-role).

> [!NOTE]
> In tenants configured with [Azure Resource Manager private link](../azure-resource-manager/management/create-private-link-access-portal.md), Azure Container Registry supports wildcard actions such as `Microsoft.ContainerRegistry/*/read` or `Microsoft.ContainerRegistry/registries/*/write` in custom roles, granting access to all matching actions. In a tenant without an ARM private link, specify all required registry actions individually in a custom role.

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzProviderOperation -OperationSearchString Microsoft.ContainerRegistry/*
```

To define a custom role, see [Steps to create a custom role](../role-based-access-control/custom-roles.md#steps-to-create-a-custom-role).

> [!NOTE]
> In tenants configured with [Azure Resource Manager private link](../azure-resource-manager/management/create-private-link-access-portal.md), Azure Container Registry supports wildcard actions such as `Microsoft.ContainerRegistry/*/read` or `Microsoft.ContainerRegistry/registries/*/write` in custom roles, granting access to all matching actions. In a tenant without an ARM private link, specify all required registry actions individually in a custom role.

---

### Example: Custom role to import images

For example, the following JSON defines the minimum actions for a custom role that permits [importing images](container-registry-import-images.md) to a registry.

```json
{
   "assignableScopes": [
     "/subscriptions/<optional, but you can limit the visibility to one or more subscriptions>"
   ],
   "description": "Can import images to registry",
   "Name": "AcrImport",
   "permissions": [
     {
       "actions": [
         "Microsoft.ContainerRegistry/registries/push/write",
         "Microsoft.ContainerRegistry/registries/pull/read",
         "Microsoft.ContainerRegistry/registries/read",
         "Microsoft.ContainerRegistry/registries/importImage/action"
       ],
       "dataActions": [],
       "notActions": [],
       "notDataActions": []
     }
   ],
   "roleType": "CustomRole"
 }
```

To create or update a custom role using the JSON description, use the [Azure CLI](../role-based-access-control/custom-roles-cli.md), [Azure Resource Manager template](../role-based-access-control/custom-roles-template.md), [Azure PowerShell](../role-based-access-control/custom-roles-powershell.md), or other Azure tools. Add or remove role assignments for a custom role in the same way that you manage role assignments for built-in Azure roles.

## Next steps

* Learn more about assigning Azure roles to an Azure identity by using the [Azure portal](../role-based-access-control/role-assignments-portal.md), the [Azure CLI](../role-based-access-control/role-assignments-cli.md), [Azure PowerShell](../role-based-access-control/role-assignments-powershell.md), or other Azure tools.

* Learn about [authentication options](container-registry-authentication.md) for Azure Container Registry.

* Learn about enabling [repository-scoped permissions](container-registry-repository-scoped-permissions.md) in a container registry.
