---
title: Azure Container Registry authentication with service principals
description: Learn how to provide access to images in your private container registry by using an Azure Active Directory service principal.
services: container-registry
author: mmacy
manager: timlt

ms.service: container-registry
ms.topic: article
ms.date: 01/15/2018
ms.author: marsma
---

# Azure Container Registry authentication with service principals

You can use an Azure Active Directory (Azure AD) service principal to provide container image `push` and `pull` access to your container registry. By using a service principal, you can provide access to your registry to services and applications, or even individual users.

## Service principal

Azure AD *service principals* provide access to Azure resources within your subscription. You can think of a service principal as a user identity for a service, where "service" is any application, service, or platform that needs access to the resources.

You can configure a service principal with access rights scoped only to those resources you specify. Then, you can configure your application or service to use the service principal's credentials to access those resources.

[!INCLUDE [container-registry-service-principal](../../includes/container-registry-service-principal.md)]

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
