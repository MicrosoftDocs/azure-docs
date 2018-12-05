---
title: Azure Container Registry authentication with service principals
description: Learn how to provide access to images in your private container registry by using an Azure Active Directory service principal.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 04/23/2018
ms.author: danlep
---

# Azure Container Registry authentication with service principals

You can use an Azure Active Directory (Azure AD) service principal to provide container image `docker push` and `pull` access to your container registry. By using a service principal, you can provide access to "headless" services and applications.

## What is a service principal?

Azure AD *service principals* provide access to Azure resources within your subscription. You can think of a service principal as a user identity for a service, where "service" is any application, service, or platform that needs access to the resources. You can configure a service principal with access rights scoped only to those resources you specify. Then, you can configure your application or service to use the service principal's credentials to access those resources.

In the context of Azure Container Registry, you can create an Azure AD service principal with pull, push and pull, or owner permissions to your private Docker registry in Azure.

## Why use a service principal?

By using an Azure AD service principal, you can provide scoped access to your private container registry. You can create different service principals for each of your applications or services, each with tailored access rights to your registry. And, because you can avoid sharing credentials between services and applications, you can rotate credentials or revoke access for only the service principal (and thus the application) you choose.

For example, your web application can use a service principal that provides it with image `pull` access only, while your build system can use a service principal that provides it with both `push` and `pull` access. If development of your application changes hands, you can rotate its service principle credentials without affecting the build system.

## When to use a service principal

You should use a service principal to provide registry access in **headless scenarios**. That is, any application, service, or script that must push or pull container images in an automated or otherwise unattended manner.

For individual access to a registry, such as when you manually pull a container image to your development workstation, you should instead use your own [Azure AD identity](container-registry-authentication.md#individual-login-with-azure-ad) for registry access (for example, with [az acr login][az-acr-login]).

[!INCLUDE [container-registry-service-principal](../../includes/container-registry-service-principal.md)]

## Sample scripts

You can find the preceding sample scripts for Azure CLI on GitHub, as well versions for Azure PowerShell:

* [Azure CLI][acr-scripts-cli]
* [Azure PowerShell][acr-scripts-psh]

## Next steps

Once you have a service principal that you've granted access to your container registry, you can use its credentials in your applications and services for registry interaction.

While configuring individual applications to use service principal credentials is outside the scope of this article, you can find instructions for some specific services and platforms here:

* [Authenticate with Azure Container Registry from Azure Kubernetes Service (AKS)](container-registry-auth-aks.md)
* [Authenticate with Azure Container Registry from Azure Container Instances (ACI)](container-registry-auth-aci.md)

<!-- LINKS - External -->
[acr-scripts-cli]: https://github.com/Azure/azure-docs-cli-python-samples/tree/master/container-registry
[acr-scripts-psh]: https://github.com/Azure/azure-docs-powershell-samples/tree/master/container-registry

<!-- LINKS - Internal -->
[az-acr-login]: /cli/azure/acr#az-acr-login