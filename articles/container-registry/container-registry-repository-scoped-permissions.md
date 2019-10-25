---
title: Permissions to repositories in Azure Container Registry
description: Create an Azure Container Registry access token with scoped permissions to specific repositories to pull or push images
services: container-registry
author: dlepow
manager: gwallace

ms.service: container-registry
ms.topic: article
ms.date: 10/22/2019
ms.author: danlep
---

# Repository-scoped permissions in Azure Container Registry 

ACR supports several [authentication options](container-registry-authentication.md) using identities that have [role-based access](container-registry-roles.md) to an entire registry. However, for certain scenarios, you might need to provide access only to specific repositories in a registry. 

This article shows how to create an access token that has permissions scoped to only specific repositories in a registry. With an access token, you can provide users or services with scoped, time-limited access to repositories. 

See [About repository-scoped permissions](#about-repository-scoped-permissions), later in this article, for more about token concepts and scenarios.

> [!IMPORTANT]
> This feature is currently in preview, and some [limitations apply](#preview-limitations). Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Preview limitations

* This feature is only available in a **Premium** container registry. For information about registry service tiers, see [Azure Container Registry SKUs](container-registry-skus.md).
* Permitted registry operations when using an access token are limited to running `docker login`, `docker push`, and `docker pull`. Other operations including tag listing and repository listing aren't currently supported.
* You can't currently assign repository-scoped permissions to Azure Active Directory objects such as a service principal or managed identity.

## Prerequisites

* **Azure CLI** - This article requires a local installation of the Azure CLI (version 2.0.76 or later). Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).
* **Docker** - To test purposes, you also need a local Docker installation. Docker provides installation instructions for [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms) systems.
* **Container registry with repositories** - If you don't have one, create a container registry in your Azure subscription. For example, use the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI](container-registry-get-started-azure-cli.md). 

  For test purposes, [push](container-registry-get-started-docker-cli.md) or [import](container-registry-import-images.md) sample images to the registry. Examples in this article refer to the following images in two repositories: `samples/hello-world:v1` and `samples/nginx:v1`. 


## Create an access token

Create a token using the [az acr token create][az-acr-token-create] command. When creating a token, specify one or more repositories and associated actions on each repository, or specify an existing scope map with those settings.

### Create access token and specify repositories

The following example creates an access token with permissions to perform `content/write` and `content/read` actions on the `samples/hello-world` repository, and `content/read` actions on the `samples/nginx` repository. By default, the command generates two passwords. 

This example sets the token status to `enabled` (the default setting), but you can disable the token at any time.

```azurecli
az acr token create --name MyToken --registry myregistry \
  --repository samples/hello-world content/write content/read \
  --repository samples/nginx content/read --status enabled
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
  "resourceGroup": "myresourcegroup",
  "scopeMapId": "/subscriptions/xxxxxxxx-adbd-4cb4-c864-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.ContainerRegistry/registries/myregistry/scopeMaps/MyToken-scope-map",
  "status": "enabled",
  "type": "Microsoft.ContainerRegistry/registries/tokens"
```

### Create a scope map and associated token

First create a scope map using the [az acr scope-map create][az-acr-scope-map-create] command.

The following example adds a scope map with the same permissions used in the previous example. It allows `content/write` and `content/read` actions on the `samples/hello-world` repository, and `content/read` actions on the `samples/nginx` repository:

```azurecli
az acr scope-map create --name MyScopeMap --registry myregistry \
  --repository samples/hello-world content/write \
  --repository samples/nginx content/read \
  --description "Sample scope map"
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

Now run [az acr token create][az-acr-token-create] to create a token associated with the *MyScopeMap* scope map. By default, the command generates two passwords. This example sets the token status to `enabled` (the default setting), but you can disable the token at any time.

```azurecli
az acr token create --name MyToken --registry myregistry --scope-map MyScopeMap --status enabled
```

The output shows details about the token, including generated passwords and the scope map you applied. It's recommended to save the passwords in a safe place to use later with `docker login`.


## Generate passwords for token

If passwords were created when you created the token, proceed to [Authenticate with registry](#authenticate-using-token).

If you don't have a token password, or you want to generate new passwords, run the [az acr token credential generate][az-acr-token-credential-generate] command.

The following example generates a new password for the token you created, with an expiration period of 30 days. It stores the password in the environment variable TOKEN_PWD. This example is formatted for the bash shell.

```azurecli
TOKEN_PWD=$(az acr token credential generate \
  --name MyToken --registry myregistry --days 30 \
  --password1 --query 'passwords[0].value' --output tsv)
```

## Authenticate using token

Run `docker login` to authenticate with the registry, entering the token name as the user name and one of its passwords. The following example is formatted for the bash shell, and provides the values using environment variables.

```bash
TOKEN_NAME=MyToken
TOKEN_PWD=<token password>

echo $TOKEN_PWD | docker login --username $TOKEN_NAME --password-stdin myregistry.azurecr.io
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

Because the example token only allows the `content/write` action on the `samples/hello-world` repository, `docker push` only succeeds to that repository:

```console
# docker push succeeds
docker pull myregistry.azurecr.io/samples/hello-world:v1

# docker push fails
docker pull myregistry.azurecr.io/samples/nginx:v1
```

## Update scope map and token

To update token permissions, update the permissions in the associated scope map, using [az acr scope-map update][az-acr-scope-map-update]. For example, to update *MyScopeMap* to remove the `content/read` action on the `samples/hello-world` repository:

```azurecli
az acr scope-map update --name MyScopeMap --registry myregistry \
  --remove hello-world content/read
```

If you want to update a token with a different scope map, run [az acr token update][az-acr-token-update]. For example:

```azurecli
az acr token update --name MyToken --registry myregistry \
  --scope-map MyNewScopeMap
```

After updating a token, or a scope map associated with a token, the permission changes take effect at the next `docker login` with the token.

After updating a token, you might want to generate new passwords to access the registry. Run [az acr token credential generate][az-acr-token-credential-generate]. For example:

```azurecli
az acr token credential generate \
  --name MyToken --registry myregistry --days 30
```

## About repository-scoped permissions

### Concepts

To configure repository-scoped permissions, you need to be a registry administrator or individual with at least the Contributor role on the registry. 

To configure the permissions, you create an *access token* using commands in the Azure CLI.

* An **access token** is a credential used with a password to authenticate with the registry. Associated with each token are permitted *actions* scoped to one or more repositories. You can set an expiration time for each token. 

* **Actions** on each specified repository include one or more of the following.

  |Action  |Description  |
  |---------|---------|
  |`content/read`     |  Read data from the repository. For example, pull an artifact.      |
  |`metadata/read`    | Read metadata from the repository    |
  |`content/write`     |  Write data to the repository. Use with `content/read` to push an artifact.    |
  |`metadata/write`     |  Write metadata to the repository       |

* A **scope map** is a registry object that groups repository permissions you apply to a token, or can reapply to other tokens. If you don't apply a scope map when creating a token, a scope map is automatically created for you, to save the permission settings. 

  A scope map helps you configure multiple users with identical access to a set of repositories. Azure Container Registry also provides system-defined scope maps that you can apply when creating access tokens.

The following image summarizes the relationship between tokens and scope maps. 

![Registry scope maps and tokens](media/container-registry-repository-scoped-permissions/token-scope-map-concepts.png)

### Scenarios

Scenarios for using an access token include:

* Provide IoT devices with individual tokens to pull an image from a repository
* Provide an external organization with permissions to a specific repository 
* Limit repository access to specific user groups in your organization. For example, provide write access to developers who build images that target specific repositories, and read access to teams that deploy from those repositories.

## Next steps

* To manage scope maps and access tokens, use additional commands in the [az acr scope-map][az-acr-scope-map] and [az acr token][az-acr-token] command groups.
* See the [authentication overview](container-registry-authentication.md) for scenarios to authenticate with an Azure container registry using an admin account or an Azure Active Directory identity.


<!-- LINKS - External -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - Internal -->
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-acr-scope-map]: /cli/azure/acr/scope-map/
[az-acr-scope-map-create]: /cli/azure/acr/scope-map/#az-acr-scope-map-create
[az-acr-scope-map-update]: /cli/azure/acr/scope-map/#az-acr-scope-map-update
[az-acr-scope-map-list]: /cli/azure/acr/scope-map/#az-acr-scope-map-list
[az-acr-token]: /cli/azure/acr/token/
[az-acr-token-show]: /cli/azure/acr/token/#az-acr-token-show
[az-acr-token-create]: /cli/azure/acr/token/#az-acr-token-create
[az-acr-token-update]: /cli/azure/acr/token/#az-acr-token-update
[az-acr-token-credential-generate]: /cli/azure/acr/token/credential/#az-acr-token-credential-generate
