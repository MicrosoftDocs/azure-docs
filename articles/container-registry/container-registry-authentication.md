---
title: Authenticate with an Azure container registry
description: Authentication options for an Azure container registry, including Azure Active Directory service principals direct and registry login.
services: container-registry
author: stevelas
manager: jeconnoc

ms.service: container-registry
ms.topic: article
ms.date: 01/23/2018
ms.author: stevelas
ms.custom: H1Hack27Feb2017
---

# Authenticate with a private Docker container registry

There are several ways to authenticate with an Azure container registry, each of which is applicable to one or more registry usage scenarios.

You can log in to a registry directly via [individual login](#individual-login-with-azure-ad), and your applications and container orchestrators can perform unattended, or "headless," authentication by using an Azure Active Directory (Azure AD) [service principal](#service-principal).

Azure Container Registry does not support unauthenticated Docker operations or anonymous access. For public images, you can use [Docker Hub](https://docs.docker.com/docker-hub/).

## Individual login with Azure AD

When working with your registry directly, such as pulling images to and pushing images from your development workstation, authenticate by using the [az acr login](/cli/azure/acr?view=azure-cli-latest#az-acr-login) command in the [Azure CLI](/cli/azure/install-azure-cli):

```azurecli
az acr login --name <acrName>
```

When you log in with `az acr login`, the CLI uses the token created when you executed `az login` to seamlessly authenticate your session with your registry. Once you've logged in this way, your credentials are cached, and subsequent `docker` commands do not require a username or password. If your token expires, you can refresh it by using the `az acr login` command again to reauthenticate. Using `az acr login` with Azure identities provides [role-based access](../role-based-access-control/role-assignments-portal.md).

## Service principal

You can assign a [service principal](../active-directory/develop/app-objects-and-service-principals.md) to your registry, and your application or service can use it for headless authentication. Service principals allow [role-based access](../role-based-access-control/role-assignments-portal.md) to a registry, and you can assign multiple service principals to a registry. Multiple service principals allow you to define different access for different applications.

The available roles are:

  * **Reader**: pull
  * **Contributor**: pull and push
  * **Owner**: pull, push, and assign roles to other users

Service principals enable headless connectivity to a registry in both push and pull scenarios like the following:

  * *Reader*: Container deployments from a registry to orchestration systems including Kubernetes, DC/OS, and Docker Swarm. You can also pull from container registries to related Azure services such as [AKS](../aks/index.yml), [App Service](../app-service/index.yml), [Batch](../batch/index.yml), [Service Fabric](/azure/service-fabric/), and others.

  * *Contributor*: Continuous integration and deployment solutions like Azure Pipelines or Jenkins that build container images and push them to a registry.

> [!TIP]
> You can regenerate the password of a service principal by running the [az ad sp reset-credentials](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-reset-credentials) command.
>

You can also log in directly with a service principal. Provide the app ID and password of the service principal to the `docker login` command:

```
docker login myregistry.azurecr.io -u xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -p myPassword
```

Once logged in, Docker caches the credentials, so you don't need to remember the app ID.

Depending on the version of Docker you have installed, you might see a security warning recommending the use of the `--password-stdin` parameter. While its use is outside the scope of this article, we recommend following this best practice. For more information, see the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command reference.

For more information on using a service principal for headless authentication to ACR, see [Azure Container Registry authentication with service principals](container-registry-auth-service-principal.md).

## Admin account

Each container registry includes an admin user account, which is disabled by default. You can enable the admin user and manage its credentials in the [Azure portal](container-registry-get-started-portal.md#create-a-container-registry), or by using the Azure CLI.

> [!IMPORTANT]
> The admin account is designed for a single user to access the registry, mainly for testing purposes. We do not recommend sharing the admin account credentials with multiple users. All users authenticating with the admin account appear as a single user with push and pull access to the registry. Changing or disabling this account disables registry access for all users who use its credentials. Individual identity is recommended for users and service principals for headless scenarios.
>

The admin account is provided with two passwords, both of which can be regenerated. Two passwords allow you to maintain connection to the registry by using one password while you regenerate the other. If the admin account is enabled, you can pass the username and either password to the `docker login` command for basic authentication to the registry. For example:

```
docker login myregistry.azurecr.io -u myAdminName -p myPassword1
```

Again, Docker recommends that you use the `--password-stdin` parameter instead of supplying it on the command line for increased security. You can also specify only your username, without `-p`, and enter your password when prompted.

To enable the admin user for an existing registry, you can use the `--admin-enabled` parameter of the [az acr update](/cli/azure/acr?view=azure-cli-latest#az-acr-update) command in the Azure CLI:

```azurecli
az acr update -n <acrName> --admin-enabled true
```

You can enable the admin user in the Azure portal by navigating your registry, selecting **Access keys** under **SETTINGS**, then **Enable** under **Admin user**.

![Enable admin user UI in the Azure portal][auth-portal-01]

## Next steps

* [Push your first image using the Azure CLI](container-registry-get-started-azure-cli.md)

<!-- IMAGES -->
[auth-portal-01]: ./media/container-registry-authentication/auth-portal-01.png
