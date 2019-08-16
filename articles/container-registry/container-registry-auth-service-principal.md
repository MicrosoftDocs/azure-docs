---
title: Azure Container Registry authentication with a service principal
description: Provide access to images in your private container registry by using an Azure Active Directory service principal.
services: container-registry
author: dlepow
manager: gwallace

ms.service: container-registry
ms.topic: article
ms.date: 12/13/2018
ms.author: danlep
---

# Azure Container Registry authentication with service principals

You can use an Azure Active Directory (Azure AD) service principal to provide container image `docker push` and `pull` access to your container registry. By using a service principal, you can provide access to "headless" services and applications.

## What is a service principal?

Azure AD *service principals* provide access to Azure resources within your subscription. You can think of a service principal as a user identity for a service, where "service" is any application, service, or platform that needs access to the resources. You can configure a service principal with access rights scoped only to those resources you specify. Then, configure your application or service to use the service principal's credentials to access those resources.

In the context of Azure Container Registry, you can create an Azure AD service principal with pull, push and pull, or other permissions to your private registry in Azure. For a complete list, see [Azure Container Registry roles and permissions](container-registry-roles.md).

## Why use a service principal?

By using an Azure AD service principal, you can provide scoped access to your private container registry. You can create different service principals for each of your applications or services, each with tailored access rights to your registry. And, because you can avoid sharing credentials between services and applications, you can rotate credentials or revoke access for only the service principal (and thus the application) you choose.

For example, your web application can use a service principal that provides it with image `pull` access only, while your build system can use a service principal that provides it with both `push` and `pull` access. If development of your application changes hands, you can rotate its service principle credentials without affecting the build system.

## When to use a service principal

You should use a service principal to provide registry access in **headless scenarios**. That is, any application, service, or script that must push or pull container images in an automated or otherwise unattended manner.

Service principals enable headless connectivity to a registry in both pull and push scenarios like the following:

  * *Pull*: Deploy containers from a registry to orchestration systems including Kubernetes, DC/OS, and Docker Swarm. You can also pull from container registries to related Azure services such as [Azure Kubernetes Service](container-registry-auth-aks.md), [Azure Container Instances](container-registry-auth-aci.md), [App Service](../app-service/index.yml), [Batch](../batch/index.yml), [Service Fabric](/azure/service-fabric/), and others.

  * *Push*: Build container images and push them to a registry using continuous integration and deployment solutions like Azure Pipelines or Jenkins.

For individual access to a registry, such as when you manually pull a container image to your development workstation, we recommend using your own [Azure AD identity](container-registry-authentication.md#individual-login-with-azure-ad) for registry access (for example, with [az acr login][az-acr-login]).

[!INCLUDE [container-registry-service-principal](../../includes/container-registry-service-principal.md)]

## Sample scripts

You can find the preceding sample scripts for Azure CLI on GitHub, as well as versions for Azure PowerShell:

* [Azure CLI][acr-scripts-cli]
* [Azure PowerShell][acr-scripts-psh]

## Authenticate with the service principal

Once you have a service principal that you've granted access to your container registry, you can configure its credentials for access to "headless" services and applications, or enter them using the `docker login` command. Use the following values:

* **User name** - service principal application ID (also called *client ID*)
* **Password** - service principal password (also called *client secret*)

Each value is a GUID of the form `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. 

> [!TIP]
> You can regenerate the password of a service principal by running the [az ad sp reset-credentials](/cli/azure/ad/sp/credential#az-ad-sp-credential-reset) command.
>

### Use credentials with Azure services

You can use service principal credentials from any Azure service that can authenticate with an Azure container registry. Examples include:

* [Authenticate with Azure Container Registry from Azure Kubernetes Service (AKS)](container-registry-auth-aks.md)
* [Authenticate with Azure Container Registry from Azure Container Instances (ACI)](container-registry-auth-aci.md)

### Use with docker login

You can also run `docker login` using a service principal. The following example shows non-interactive login in a Bash shell:

```bash
# Service principal credentials: 
SP_APP_ID=<service-principal-app-id>
SP_PASSWD=<service-principal-password>

# Log in to Docker, taking password from STDIN
echo $SP_PASSWD | docker login myregistry.azurecr.io --username $SP_APP_ID --password-stdin 
```

Once logged in, Docker caches the credentials.

For best practices to manage Docker credentials, see the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command reference.


## Next steps

* See the [authentication overview](container-registry-authentication.md) for other scenarios to authenticate with an Azure container registry.

<!-- LINKS - External -->
[acr-scripts-cli]: https://github.com/Azure/azure-docs-cli-python-samples/tree/master/container-registry
[acr-scripts-psh]: https://github.com/Azure/azure-docs-powershell-samples/tree/master/container-registry

<!-- LINKS - Internal -->
[az-acr-login]: /cli/azure/acr#az-acr-login
