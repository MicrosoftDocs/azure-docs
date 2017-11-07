---
title: Authenticate with an Azure container registry
description: Authentication options for an Azure container registry, including Azure Active Directory service principals direct and registry login.
services: container-registry
documentationcenter: ''
author: stevelas
manager: balans
editor: mmacy
tags: ''
keywords: ''

ms.assetid: 128a937a-766a-415b-b9fc-35a6c2f27417
ms.service: container-registry
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/05/2017
ms.author: stevelas
ms.custom: H1Hack27Feb2017
---

# Authenticate with a private Docker container registry

There are several ways to authenticate with an Azure container registry, each of which is applicable to one or more registry usage scenarios.

You can log in to a registry directly via [individual login](#individual-login-with-azure-ad), and your applications and container orchestrators can perform unattended, or "headless," authentication by using an Azure Active Directory (Azure AD) [service principal](#service-principal).

Azure Container Registry does not support unauthenticated Docker operations or anonymous access. For public images, you can use [Docker Hub](https://docs.docker.com/docker-hub/).

## Individual login with Azure AD

When working with your registry directly, such as pulling images to and pushing images from your development workstation, authenticate by using the [az acr login](/cli/azure/acr?view=azure-cli-latest#az_acr_login) command in the [Azure CLI](/cli/azure/install-azure-cli):

```azurecli
az acr login --name <acrName>
```

When you log in with `az acr login`, the CLI uses the token created when you executed `az login` to seamlessly authenticate your session with your registry. Once you've logged in this way, your credentials are cached, and subsequent `docker` commands do not require a username or password. If your token expires, you can refresh it by using the `az acr login` command again to reauthenticate.

## Service principal

You can assign a [service principal](../active-directory/develop/active-directory-application-objects.md) to your registry, and your application or service can use it for headless authentication. Service principals allow [role-based access](../active-directory/role-based-access-control-configure.md) to a registry, and you can assign multiple service principals to a registry. Multiple service principals allow you to define different access for different applications.

The available roles are:

  * **Reader**: pull
  * **Contributor**: pull and push
  * **Owner**: pull, push, and assign roles to other users

Service principals enable headless connectivity to a registry in both push and pull scenarios like the following:

  * *Reader*: Container deployments from a registry to orchestration systems including Kubernetes, DC/OS, and Docker Swarm. You can also pull from container registries to related Azure services such as [AKS](../aks/index.yml), [App Service](../app-service/index.yml), [Batch](../batch/index.md), [Service Fabric](/azure/service-fabric/), and others.

  * *Contributor*: Continuous integration and deployment solutions like Visual Studio Team Services (VSTS) or Jenkins that build container images and push them to a registry.

> [!TIP]
> You can regenerate the password of a service principal by running the [az ad sp reset-credentials](/cli/azure/ad/sp?view=azure-cli-latest#az_ad_sp_reset_credentials) command.
>

You can also log in directly with a service principal. Provide the app ID and password of the service principal to the `docker login` command:

```
docker login myregistry.azurecr.io -u xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -p myPassword
```

Once logged in, Docker caches the credentials, so you don't need to remember the app ID.

Depending on the version of Docker you have installed, you might see a security warning recommending the use of the `--password-stdin` parameter. While its use is outside the scope of this article, we recommend following this best practice. For more information, see the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command reference.

## Admin account

Each container registry includes an admin user account, which is disabled by default. You can enable the admin user and manage its credentials in the [Azure portal](container-registry-get-started-portal.md#create-a-container-registry), or by using the Azure CLI.

The admin account is provided with two passwords, both of which can be regenerated. Two passwords allow you to maintain connection to the registry by using one password while you regenerate the other. If the admin account is enabled, you can pass the username and either password to the `docker login` command for basic authentication to the registry. For example:

```
docker login myregistry.azurecr.io -u myAdminName -p myPassword1
```

Again, Docker recommends that you use the `--password-stdin` parameter instead of supplying it on the command line for increased security. You can also specify only your username, without `-p`, and enter your password when prompted.

To enable the admin user for an existing registry, you can use the `--admin-enabled` parameter of the [az acr update](/cli/azure/acr?view=azure-cli-latest#az_acr_update) command in the Azure CLI:

```azurecli
az acr update -n <acrName> --admin-enabled true
```

You can enable the admin user in the Azure portal by navigating your registry, selecting **Access keys** under **SETTINGS**, then **Enable** under **Admin user**.

![Enable admin user UI in the Azure portal][auth-portal-01]

> [!IMPORTANT]
> The admin account is designed for a single user to access the registry, mainly for testing purposes. We do not recommend sharing the admin account credentials with multiple users. All users authenticating with the admin account appear as a single user to the registry. Changing or disabling this account disables registry access for all users who use its credentials.
>

## Next steps

* [Push your first image using the Azure CLI](container-registry-get-started-azure-cli.md)

<!-- IMAGES -->
[auth-portal-01]: ./media/container-registry-authentication/auth-portal-01.png