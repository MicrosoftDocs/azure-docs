---
title: Access from Container Instances
description: Learn how to provide access to images in your private container registry from Azure Container Instances by using a Microsoft Entra service principal.
ms.topic: article
ms.custom: devx-track-azurecli
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
---

# Authenticate with Azure Container Registry from Azure Container Instances

You can use a Microsoft Entra service principal to provide access to your private container registries in Azure Container Registry.

In this article, you learn to create and configure a Microsoft Entra service principal with *pull* permissions to your registry. Then, you start a container in Azure Container Instances (ACI) that pulls its image from your private registry, using the service principal for authentication.

## When to use a service principal

You should use a service principal for authentication from ACI in **headless scenarios**, such as in applications or services that create container instances in an automated or otherwise unattended manner.

For example, if you have an automated script that runs nightly and creates a [task-based container instance](../container-instances/container-instances-restart-policy.md) to process some data, it can use a service principal with pull-only permissions to authenticate to the registry. You can then rotate the service principal's credentials or revoke its access completely without affecting other services and applications.

Service principals should also be used when the registry [admin user](container-registry-authentication.md#admin-account) is disabled.

[!INCLUDE [container-registry-service-principal](../../includes/container-registry-service-principal.md)]

## Authenticate using the service principal

To launch a container in Azure Container Instances using a service principal, specify its ID for `--registry-username`, and its password for `--registry-password`.

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer \
    --image mycontainerregistry.azurecr.io/myimage:v1 \
    --registry-login-server mycontainerregistry.azurecr.io \
    --registry-username <service-principal-ID> \
    --registry-password <service-principal-password>
```

>[!Note]
> We recommend running the commands in the most recent version of the Azure Cloud Shell. Set `export MSYS_NO_PATHCONV=1` for running on-perm bash environment.

## Sample scripts

You can find the preceding sample scripts for Azure CLI on GitHub, as well versions for Azure PowerShell:

* [Azure CLI][acr-scripts-cli]
* [Azure PowerShell][acr-scripts-psh]

## Next steps

The following articles contain additional details on working with service principals and ACR:

* [Azure Container Registry authentication with service principals](container-registry-auth-service-principal.md)
* [Authenticate with Azure Container Registry from Azure Kubernetes Service (AKS)](../aks/cluster-container-registry-integration.md)

<!-- IMAGES -->

<!-- LINKS - External -->
[acr-scripts-cli]: https://github.com/Azure/azure-docs-cli-python-samples/tree/master/container-registry/create-registry/create-registry-service-principal-assign-role.sh
[acr-scripts-psh]: https://github.com/Azure/azure-docs-powershell-samples/tree/master/container-registry

<!-- LINKS - Internal -->
