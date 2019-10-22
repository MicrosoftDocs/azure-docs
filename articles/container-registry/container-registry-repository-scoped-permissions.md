---
title: Permissions to repositories in Azure Container Registry
description: Create Azure Container Registry access tokens to permit scoped access to specific repositories
services: container-registry
author: dlepow
manager: gwallace

ms.service: container-registry
ms.topic: article
ms.date: 10/21/2019
ms.author: danlep
---

# Repository-scoped permissions in Azure Container Registry 

As an alternative to using admin or service principal credentials with [role-based access]() to an entire container registry, you can create an access token with permissions to perform actions only on specific repositories. This feature allows you to configure scoped, time-limited access to repositories in a registry without relying on an Azure Active Directory identity. 

Set up an access token with registry-scoped permissions in scenarios like the following:

* Provide IoT devices with individual tokens to pull an image from a repository
* Provide scoped registry access to an external organization that needs permissions only to a specific repository 
* Limit repository access in a registry in your organization to specific user groups. For example, provide write access to developers building images targeting specific repositories, and only read access to teams deploying from those repositories to production.


> [!IMPORTANT]
> This feature is currently in preview, and some [limitations apply](#preview-limitations). Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Preview limitations

* This feature is only available in a **Premium** container registry. For information about registry service tiers, see [Azure Container Registry SKUs](container-registry-skus.md).
* With repository-scoped permissions, registry operations are limited to using the Docker CLI, such as running `docker login`, `docker push`, and `docker pull`. Other operations including tag listing and repository listing aren't currently supported.
* You can't currently assign repository-scoped permissions to Azure Active Directory objects such as a service principal or managed identity.

## Prerequisites

* **Azure CLI** - This article requires a local installation of the Azure CLI (version 2.0.76 or later). Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).
* **Docker** - You also need a local Docker installation. Docker provides installation instructions for [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms) systems.
* **Container registry with repositories** - If you don't have one, create a container registry in your Azure subscription. For example, use the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI](container-registry-get-started-azure-cli.md). 

  For test purposes, [push](container-registry-get-started-docker-cli.md) or [import](container-registry-import-images.md) sample images to the registry. Examples in this article refer to the following images in two repositories: `samples/hello-world:v1` and `samples/nginx:v1`. 

## About repository-scoped permissions

To configure repository-scoped permissions, you need to be a registry administrator or individual with at least the Contributor role. To configure the permissions, you create repository access tokens using commands in the Azure CLI.

An **access token** is a credential used with a password to authenticate with the registry, with permitted *actions* scoped to one or more repositories. You set an expiration time for each token. Actions on each specified repository include one or more of the following.

|Action  |Description  |
|---------|---------|
|`content/read`     |  Read data from the repository. For example, pull an artifact.      |
|`metadata/read`    | Read metadata from the repository    |
|`content/write`     |  Write data to the repository. Use with `content/read` to push an artifact.    |
|`metadata/write`     |  Write metadata to the repository       |

A **scope map** is a related setting that helps you apply scoped repository permissions to a token, or reapply them to other tokens. If you don't apply a scope map when creating a token, a scope map is automatically created for you, to save the repository permission settings. A scope map helps you configure multiple users with identical access to a set of repositories. Azure Container Registry also provides system-defined scope maps that you can apply when creating access tokens.

## Create an access token

Create a token using the [az acr token create][az-acr-token-create] command. When creating a token, specify one or more repositories and associated actions, or specify an existing scope map with those settings.

### Create access token and specify repositories

The following example creates an access token with permissions to perform `content/write` and `content/read` actions on the `samples/hello-world` repository, and `content/read` actions on the `samples/nginx` repository. By default, the command generates two passwords. This sample enables the token (the default setting), but you can disable the token at any time.

```azurecli
az acr token create --name MyToken --registry myregistry --repository samples/hello-world content/write content/read --repository samples/nginx content/read --status enabled
```

The output shows details about the token, including generated passwords and scope map. It's recommended to save the passwords in a safe place to use later with `docker login`.

```console
{
  "creationDate": "2019-10-22T00:15:34.066221+00:00",
  "credentials": {
    "certificates": [],
    "passwords": [
      {
        "creationTime": "2019-10-22T00:15:52.837651+00:00",
        "expiry": null,
        "name": "password1",
        "value": "uH54BxxxxK7KOxxxxRbr26dAs8JXxxxx"
      },
      {
        "creationTime": "2019-10-22T00:15:52.837651+00:00",
        "expiry": null,
        "name": "password2",
        "value": "kPX6Or/xxxxLXpqowxxxxkA0idwLtmxxxx"
      }
    ],
    "username": "MyToken"
  },
  "id": "/subscriptions/xxxxxxxx-adbd-4cb4-c864-xxxxxxxxxxxx/resourceGroups/myregistry/providers/Microsoft.ContainerRegistry/registries/myregistry/tokens/MyToken",
  "name": "MyToken",
  "objectId": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "danlepow",
  "scopeMapId": "/subscriptions/xxxxxxxx-adbd-4cb4-c864-xxxxxxxxxxxx/resourceGroups/myregistry/providers/Microsoft.ContainerRegistry/registries/myregistry/scopeMaps/MyToken-scope-map",
  "status": "enabled",
  "type": "Microsoft.ContainerRegistry/registries/tokens"
```

### Create access token and specify a scope map

First create a scope map using the [az acr scope-map create][az-acr-scope-map-create] command.

The following example adds a scope map with the same permissions used in the previous example. It allows `content/write` and `content/read` actions on the `samples/hello-world` repository, and `content/read` actions on the `samples/nginx` repository:

```azurecli
az acr scope-map create --name MyScopeMap --registry myregistry --add samples/hello-world content/write --add samples/nginx content/read --description "Sample scope map."
```

Output is similar to the following:

```console
# ADD SAMPLE OUTPUT HERE
```

Now create a token associated with the *MyScopeMap* scope map. By default, the command generates two passwords. This sample enables the token (the default setting), but you can disable the token at any time.

```azurecli
az acr token create --name MyToken --registry myregistry --scope-map MyScopeMap --status enabled
```

## Get password for the token

If passwords were created when you created the token, you can obtain one using the [az acr token show][az-acr-token-show] command. The following example stores the first password in the environment variable TOKEN_PWD. This example is formatted for the bash shell.

```azurecli
# VERIFY THIS EXAMPLE
TOKEN_PWD=$(az acr token show --name MyToken --registry myregistry --query 'passwords[0].value' --output tsv)
```

At any time, you can generate or replace a password for the token using [az acr token credential generate][az-acr-token-credential-generate] command.

The following example generates two password for the token you created, with an expiration period of one month. It stores the first password in the environment variable TOKEN_PWD. This example is formatted for the bash shell.

```azurecli
TOKEN_PWD=$(az acr token credential generate --name MyToken --registry myregistry --months 1 --query 'passwords[0].value' --output tsv)
```

## Authenticate with registry

Use the name of the token and the password to authenticate with the registry, using `docker login`. In this example, pass the password using the environment variable you created:

```console
echo $TOKEN_PWD | docker login --username MyToken --password-stdin myregistry.azurecr.io
```

If the token is configured properly, you should see the following output:

```console
Login Succeeded
```

## Verify scoped access

You can verify that the token provides scoped permissions to the repositories in the registry. In this example, the following `docker pull` commands complete successfully, assuming the `v1` image tags are present in the `samples/hello-world` and `samples/nginx` repositories:

```console
docker pull myregistry.azurecr.io/samples/hello-world:v1
docker pull myregistry.azurecr.io/samples/nginx:v1
```

However, because the token only allows the `content/write` action  on the `samples/hello-world` repository, `docker push` only succeeds to that repository:

```console
# docker push succeeds
docker pull myregistry.azurecr.io/samples/hello-world:v1

# docker push fails
docker pull myregistry.azurecr.io/samples/nginx:v1
```


## Next steps

* To manage scope maps and access tokens, use additional commands in the [az acr scope-map][az-acr-scope-map] and [az acr token][az-acr-token] command groups.
* See the [authentication overview](container-registry-authentication.md) for scenarios to authenticate with an Azure container registry using an admin account or an Azure Active Directory identity.


<!-- LINKS - External -->

<!-- LINKS - Internal -->
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-acr-scope-map]: /cli/azure/acr/scope-map/
[az-acr-scope-map-create]: /cli/azure/acr/scope-map/#az-acr-scope-map-create
[az-acr-scope-map-list]: /cli/azure/acr/scope-map/#az-acr-scope-map-list
[az-acr-token]: /cli/azure/acr/token/
[az-acr-token-show]: /cli/azure/acr/token/#az-acr-token-show
[az-acr-token-create]: /cli/azure/acr/token/#az-acr-token-create
[az-acr-token-credential-generate]: /cli/azure/acr/token/credential/#az-acr-token-credential-generate
