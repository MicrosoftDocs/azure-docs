---
title: Authenticate with Azure Container Registry from Azure Container Instances
description: Learn how to provide access to images in your private container registry from Azure Container Instances by using an Azure Active Directory service principal.
services: container-registry
author: mmacy
manager: timlt

ms.service: container-registry
ms.topic: article
ms.date: 01/15/2018
ms.author: marsma
---

# Authenticate with Azure Container Registry from Azure Container Instances

You can use an Azure Active Directory (Azure AD) service principal to provide access to your private container registries in Azure Container Registry.

In this article, you learn to create and configure an Azure AD service principal with push and pull permissions to your registry. Then, you start a container in Azure Container Instances that pulls its image from your private registry, using the service principal for authentication.

[!INCLUDE [container-registry-service-principal](../../includes/container-registry-service-principal.md)]

## Authenticate using the service principal

```azurecli
az container create blah
```

## Next steps

**Azure Container Registry Roadmap**

Visit the [ACR Roadmap][acr-roadmap] on GitHub to find information about upcoming features in the service.

**Azure Container Registry UserVoice**

Submit and vote on new feature suggestions in [ACR UserVoice][container-registry-uservoice].

<!-- IMAGES -->
[update-registry-sku]: ./media/container-registry-skus/update-registry-sku.png

<!-- LINKS - External -->
[acr-roadmap]: https://aka.ms/acr/roadmap
[container-registry-pricing]: https://azure.microsoft.com/pricing/details/container-registry/
[container-registry-uservoice]: https://feedback.azure.com/forums/903958-azure-container-registry

<!-- LINKS - Internal -->
[az-acr-update]: /cli/azure/acr#az_acr_update
[container-registry-geo-replication]: container-registry-geo-replication.md
[container-registry-upgrade]: container-registry-upgrade.md
[container-registry-webhook]: container-registry-webhook.md
