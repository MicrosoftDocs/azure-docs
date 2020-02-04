---
title: Registry authentication options
description: Authentication options for an Azure container registry, including signing in with an Azure Active Directory identity, using service principals, and using optional admin credentials.
ms.topic: article
ms.date: 12/21/2018
ms.custom: H1Hack27Feb2017
---

# Authenticate with a private Docker container registry

There are several ways to authenticate with an Azure container registry, each of which is applicable to one or more registry usage scenarios.

Recommended ways include authenticating to a registry directly via [individual login](#individual-login-with-azure-ad), or your applications and container orchestrators can perform unattended, or "headless," authentication by using an Azure Active Directory (Azure AD) [service principal](#service-principal).

## Individual login with Azure AD

When working with your registry directly, such as pulling images to and pushing images from a development workstation, authenticate by using the [az acr login](/cli/azure/acr?view=azure-cli-latest#az-acr-login) command in the [Azure CLI](/cli/azure/install-azure-cli):

```azurecli
az acr login --name <acrName>
```

When you log in with `az acr login`, the CLI uses the token created when you executed [az login](/cli/azure/reference-index#az-login) to seamlessly authenticate your session with your registry. Once you've logged in this way, your credentials are cached, and subsequent `docker` commands in your session do not require a username or password. 

For registry access, the token used by `az acr login` is valid for **3 hours**, so we recommend that you always log in to the registry before running a `docker` command. If your token expires, you can refresh it by using the `az acr login` command again to reauthenticate. 

Using `az acr login` with Azure identities provides [role-based access](../role-based-access-control/role-assignments-portal.md). For some scenarios, you may want to log in to a registry with your own individual identity in Azure AD. For cross-service scenarios or to handle the needs of a workgroup where you don't want to manage individual access, you can also log in with a [managed identity for Azure resources](container-registry-authentication-managed-identity.md).

## Service principal

If you assign a [service principal](../active-directory/develop/app-objects-and-service-principals.md) to your registry, your application or service can use it for headless authentication. Service principals allow [role-based access](../role-based-access-control/role-assignments-portal.md) to a registry, and you can assign multiple service principals to a registry. Multiple service principals allow you to define different access for different applications.

The available roles for a container registry include:

* **AcrPull**: pull

* **AcrPush**: pull and push

* **Owner**: pull, push, and assign roles to other users

For a complete list of roles, see [Azure Container Registry roles and permissions](container-registry-roles.md).

For CLI scripts to create a service principal for authenticating with an Azure container registry, and guidance on using a service principal, see [Azure Container Registry authentication with service principals](container-registry-auth-service-principal.md).

## Admin account

Each container registry includes an admin user account, which is disabled by default. You can enable the admin user and manage its credentials in the Azure portal, or by using the Azure CLI or other Azure tools.

> [!IMPORTANT]
> The admin account is designed for a single user to access the registry, mainly for testing purposes. We do not recommend sharing the admin account credentials among multiple users. All users authenticating with the admin account appear as a single user with push and pull access to the registry. Changing or disabling this account disables registry access for all users who use its credentials. Individual identity is recommended for users and service principals for headless scenarios.
>

The admin account is provided with two passwords, both of which can be regenerated. Two passwords allow you to maintain connection to the registry by using one password while you regenerate the other. If the admin account is enabled, you can pass the username and either password to the `docker login` command when prompted for basic authentication to the registry. For example:

```
docker login myregistry.azurecr.io 
```

For best practices to manage login credentials, see the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command reference.

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
