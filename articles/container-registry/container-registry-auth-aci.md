---
title: Authenticate with Azure Container Registry from Azure Container Instances
description: Learn how to provide access to images in your private container registry from Azure Container Instances by using an Azure Active Directory service principal.
services: container-registry
author: mmacy
manager: timlt

ms.service: container-registry
ms.topic: article
ms.date: 01/23/2018
ms.author: marsma
---

# Authenticate with Azure Container Registry from Azure Container Instances

You can use an Azure Active Directory (Azure AD) service principal to provide access to your private container registries in Azure Container Registry.

In this article, you learn to create and configure an Azure AD service principal with push and pull permissions to your registry. Then, you start a container in Azure Container Instances that pulls its image from your private registry, using the service principal for authentication.

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
    --registry-password  <service-principal-password>
```

## Next steps

The following articles contain additional details on working with service principals and ACR:

* [Azure Container Registry authentication with service principals](container-registry-auth-service-principal.md)
* [Authenticate with Azure Container Registry from Azure Container Service (AKS)](container-registry-auth-aks.md)

<!-- IMAGES -->

<!-- LINKS - External -->

<!-- LINKS - Internal -->
