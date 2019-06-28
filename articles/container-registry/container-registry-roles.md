---
title: Azure Container Registry - roles and permissions
description: Use Azure role-based access control (RBAC) and identity and access management (IAM) to provide fine-grained permissions to resources in an Azure container registry.
services: container-registry
author: dlepow
manager: jeconnoc

ms.service: container-registry
ms.topic: article
ms.date: 03/20/2019
ms.author: danlep
---

# Azure Container Registry roles and permissions

The Azure Container Registry service supports a set of Azure roles that provide different levels of permissions to an Azure container registry. Use Azure [role-based access control](../role-based-access-control/index.yml) (RBAC) to assign specific permissions to users or service principals that need to interact with a registry.

| Role/Permission       | [Access Resource Manager](#access-resource-manager) | [Create/delete registry](#create-and-delete-registry) | [Push image](#push-image) | [Pull image](#pull-image) | [Delete image data](#delete-image-data) | [Change policies](#change-policies) |   [Sign images](#sign-images)  |
| ---------| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| Owner | X | X | X | X | X | X |  |  
| Contributor | X | X | X |  X | X | X |  |  
| Reader | X |  |  |  |  |  |  |
| AcrPush |  |  | X | X | |  |  |  
| AcrPull |  |  |  | X |  |  |  |  
| AcrDelete |  |  |  |  | X |  |  |
| AcrImageSigner |  |  |  |  |  |  | X |

## Differentiate users and services

Any time permissions are applied, a best practice is to provide the most limited set of permissions for a person, or service, to accomplish a task. The following permission sets represent a set of capabilities that may be used by humans and headless services.

### CI/CD solutions

When automating `docker build` commands from CI/CD solutions, you need `docker push` capabilities. For these headless service scenarios, we suggest assigning the **AcrPush** role. This role, unlike the broader **Contributor** role, prevents the account from performing other registry operations or accessing Azure Resource Manager.

### Container host nodes

Likewise, nodes running your containers need the **AcrPull** role, but shouldn't require **Reader** capabilities.

### Visual Studio Code Docker extension

For tools like the Visual Studio Code [Docker extension](https://code.visualstudio.com/docs/azure/docker), additional resource provider access is required to list the available Azure container registries. In this case, provide your users access to the **Reader** or **Contributor** role. These roles allow `docker pull`, `docker push`, `az acr list`, `az acr build`, and other capabilities. 

## Access Resource Manager

Azure Resource Manager access is required for the Azure portal and registry management with the [Azure CLI](/cli/azure/). For example, to get a list of registries by using the `az acr list` command, you need this permission set. 

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

## Next steps

* Learn more about assigning RBAC roles to an Azure identity by using the [Azure portal](../role-based-access-control/role-assignments-portal.md), the [Azure CLI](../role-based-access-control/role-assignments-cli.md), or other Azure tools.

* Learn about [authentication options](container-registry-authentication.md) for Azure Container Registry.
