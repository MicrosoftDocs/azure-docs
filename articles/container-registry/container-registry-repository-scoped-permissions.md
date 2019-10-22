---
title: Permissions to repositories in Azure Container Registry
description: Create an Azure Container Registry access token with scoped permissions to specific repositories to pull or push images
services: container-registry
author: dlepow
manager: gwallace

ms.service: container-registry
ms.topic: article
ms.date: 10/21/2019
ms.author: danlep
---

# Repository-scoped permissions in Azure Container Registry 

ACR supports several [authentication options](container-registry-authentication.md) with identities that have [role-based access](container-registry-roles.md) to an entire registry. However, for certain scenarios, you might need to limit access to specific repositories in a registry. 

This article shows how to create a registry access token with permissions only on specific repositories in a registry. With an access token, you can provide users or services with scoped, time-limited access to repositories without requiring an Azure Active Directory identity. 

Scenarios for using an access token with registry-scoped permissions include:

* Provide IoT devices with individual tokens to pull an image from a repository
* Provide an external organization with permissions to a specific repository 
* Limit repository access to specific user groups in your organization. For example, provide write access to developers building images targeting specific repositories, and read access to teams or services deploying from those repositories to production.

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

To configure repository-scoped permissions, you need to be a registry administrator or individual with at least the Contributor role. To configure the permissions, you create access tokens using commands in the Azure CLI.

An **access token** is a credential used with a password to authenticate with the registry, with permitted *actions* scoped to one or more repositories. You set an expiration time for each token. Actions on each specified repository include one or more of the following.

|Action  |Description  |
|---------|---------|
|`content/read`     |  Read data from the repository. For example, pull an artifact.      |
|`metadata/read`    | Read metadata from the repository    |
|`content/write`     |  Write data to the repository. Use with `content/read` to push an artifact.    |
|`metadata/write`     |  Write metadata to the repository       |

A **scope map** is a related setting that helps you apply scoped repository permissions to a token, or reapply them to other tokens. If you don't apply a scope map when creating a token, a scope map is automatically created for you, to save the permission settings. A scope map helps you configure multiple users with identical access to a set of repositories. Azure Container Registry also provides system-defined scope maps that you can apply when creating access tokens.

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
  "id": "/subscriptions/xxxxxxxx-adbd-4cb4-c864-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.ContainerRegistry/registries/myregistry/tokens/MyToken",
  "name": "MyToken",
  "objectId": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "danlepow",
  "scopeMapId": "/subscriptions/xxxxxxxx-adbd-4cb4-c864-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.ContainerRegistry/registries/myregistry/scopeMaps/MyToken-scope-map",
  "status": "enabled",
  "type": "Microsoft.ContainerRegistry/registries/tokens"
```

### Create a scope map and associated token

First create a scope map using the [az acr scope-map create][az-acr-scope-map-create] command.

The following example adds a scope map with the same permissions used in the previous example. It allows `content/write` and `content/read` actions on the `samples/hello-world` repository, and `content/read` actions on the `samples/nginx` repository:

```azurecli
az acr scope-map create --name MyScopeMap --registry myregistry --repository samples/hello-world content/write --repository samples/nginx content/read --description "Sample scope map."
```

Output is similar to the following:

```console
{
  "actions": [
    "repositories/samples/hello-world/content/write",
    "repositories/samples/nginx/content/read"
  ],
  "creationDate": "2019-10-22T05:07:35.194413+00:00",
  "description": "Sample scope map.",
  "id": "/subscriptions/fxxxxxxxx-adbd-4cb4-c864-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.ContainerRegistry/registries/myregistry/scopeMaps/MyScopeMap",
  "name": "MyScopeMap",
  "provisioningState": "Succeeded",
  "resourceGroup": "myresourcegroup",
  "scopeMapType": "UserDefined",
  "type": "Microsoft.ContainerRegistry/registries/scopeMaps"
```

Now create a token associated with the *MyScopeMap* scope map. By default, the command generates two passwords. This sample enables the token (the default setting), but you can disable the token at any time.

```azurecli
az acr token create --name MyToken --registry myregistry --scope-map MyScopeMap --status enabled
```

The output shows details about the token, including generated passwords and scope map. It's recommended to save the passwords in a safe place to use later with `docker login`.


## Get password for the token

If passwords were created when you created the token, proceed to [Authenticate with registry](#authenticate-with-registry).

If you don't have a token password, or you want to generate new passwords, run the [az acr token credential generate][az-acr-token-credential-generate] command.

The following example generates two password for the token you created, with an expiration period of one month. It stores the first password in the environment variable TOKEN_PWD. This example is formatted for the bash shell.

```azurecli
TOKEN_PWD=$(az acr token credential generate --name MyToken --registry myregistry --months 1 --query 'passwords[0].value' --output tsv)
```

## Authenticate using token

Use the name of the token and one of its passwords to authenticate with the registry, using `docker login`. The following example is formatted for the bash shell, and passes the password with an environment variable.

```bash
TOKEN_PWD=<token password>

echo $TOKEN_PWD | docker login --username MyToken --password-stdin myregistry.azurecr.io
```

Output should show successful authentication:

```console
Login Succeeded
```

## Verify scoped access

You can verify that the token provides scoped permissions to the repositories in the registry. In this example, the following `docker pull` commands complete successfully, assuming the `v1` image tags are present in the `samples/hello-world` and `samples/nginx` repositories:

```console
docker pull myregistry.azurecr.io/samples/hello-world:v1
docker pull myregistry.azurecr.io/samples/nginx:v1
```

Because the example token allows the `content/write` action only on the `samples/hello-world` repository, `docker push` only succeeds to that repository:

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
