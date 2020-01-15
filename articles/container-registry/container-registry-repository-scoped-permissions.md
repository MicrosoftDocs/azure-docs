---
title: Permissions to repositories
description: Create a token with permissions scoped to specific repositories in a registry to pull or push images
ms.topic: article
ms.date: 10/31/2019
---

# Repository-scoped permissions in Azure Container Registry 

Azure Container Registry supports several [authentication options](container-registry-authentication.md) using identities that have [role-based access](container-registry-roles.md) to an entire registry. However, for certain scenarios, you might need to provide access only to specific *repositories* in a registry. 

This article shows how to create and use an access token that has permissions to perform actions on only specific repositories in a registry. With an access token, you can provide users or services with scoped, time-limited access to repositories to pull or push images or perform other actions. 

See [About repository-scoped permissions](#about-repository-scoped-permissions), later in this article, for background about token concepts and scenarios.

> [!IMPORTANT]
> This feature is currently in preview, and some [limitations apply](#preview-limitations). Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Preview limitations

* This feature is only available in a **Premium** container registry. For information about registry service tiers and limits, see [Azure Container Registry SKUs](container-registry-skus.md).
* You can't currently assign repository-scoped permissions to an Azure Active Directory object such as a service principal or managed identity.

## Prerequisites

* **Azure CLI** - This article requires a local installation of the Azure CLI (version 2.0.76 or later). Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).
* **Docker** - To authenticate with the registry, you also need a local Docker installation. Docker provides installation instructions for [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms) systems.
* **Container registry with repositories** - If you don't have one, create a container registry in your Azure subscription. For example, use the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI](container-registry-get-started-azure-cli.md). 

  For test purposes, [push](container-registry-get-started-docker-cli.md) or [import](container-registry-import-images.md) one or more sample images to the registry. Examples in this article refer to the following images in two repositories: `samples/hello-world:v1` and `samples/nginx:v1`. 

## Create an access token

Create a token using the [az acr token create][az-acr-token-create] command. When creating a token, specify one or more repositories and associated actions on each repository, or specify an existing scope map with those settings.

### Create access token and specify repositories

The following example creates an access token with permissions to perform `content/write` and `content/read` actions on the `samples/hello-world` repository, and the `content/read` action on the `samples/nginx` repository. By default, the command generates two passwords. 

This example sets the token status to `enabled` (the default setting), but you can update the token at any time and set the status to `disabled`.

```azurecli
az acr token create --name MyToken --registry myregistry \
  --repository samples/hello-world content/write content/read \
  --repository samples/nginx content/read --status enabled
```

The output shows details about the token, including generated passwords and scope map. It's recommended to save the passwords in a safe place to use later with `docker login`. The passwords can't be retrieved again but new ones can be generated.

The output also shows that a scope map is automatically created, named `MyToken-scope-map`. You can use the scope map to apply the same repository actions to other tokens. Or, update the scope map later to change the token permissions.

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

Alternatively, specify a scope map with repositories and associated actions when creating a token. To create a scope map, use the [az acr scope-map create][az-acr-scope-map-create] command.

The following example command creates a scope map with the same permissions used in the previous example. It allows `content/write` and `content/read` actions on the `samples/hello-world` repository, and the `content/read` action on the `samples/nginx` repository:

```azurecli
az acr scope-map create --name MyScopeMap --registry myregistry \
  --repository samples/hello-world content/write content/read \
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

Run [az acr token create][az-acr-token-create] to create a token associated with the *MyScopeMap* scope map. By default, the command generates two passwords. This example sets the token status to `enabled` (the default setting), but you can update the token at any time and set the status to `disabled`.

```azurecli
az acr token create --name MyToken --registry myregistry --scope-map MyScopeMap --status enabled
```

The output shows details about the token, including generated passwords and the scope map you applied. It's recommended to save the passwords in a safe place to use later with `docker login`. The passwords can't be retrieved again but new ones can be generated.

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

Run `docker login` to authenticate with the registry using the token credentials. Enter the token name as the user name and provide one of its passwords. The following example is formatted for the bash shell, and provides the values using environment variables.

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

You can verify that the token provides scoped permissions to the repositories in the registry. In this example, the following `docker pull` commands complete successfully to pull images available in the `samples/hello-world` and `samples/nginx` repositories:

```console
docker pull myregistry.azurecr.io/samples/hello-world:v1
docker pull myregistry.azurecr.io/samples/nginx:v1
```

Because the example token allows the `content/write` action only on the `samples/hello-world` repository, `docker push` succeeds to that repository but fails for `samples/nginx`:

```console
# docker push succeeds
docker pull myregistry.azurecr.io/samples/hello-world:v1

# docker push fails
docker pull myregistry.azurecr.io/samples/nginx:v1
```

## Update scope map and token

To update token permissions, update the permissions in the associated scope map, using [az acr scope-map update][az-acr-scope-map-update]. For example, to update *MyScopeMap* to remove the `content/write` action on the `samples/hello-world` repository:

```azurecli
az acr scope-map update --name MyScopeMap --registry myregistry \
  --remove samples/hello-world content/write
```

If the scope map is associated with more than one token, the command updates the permission of all associated tokens.

If you want to update a token with a different scope map, run [az acr token update][az-acr-token-update]. For example:

```azurecli
az acr token update --name MyToken --registry myregistry \
  --scope-map MyNewScopeMap
```

After updating a token, or a scope map associated with a token, the permission changes take effect at the next `docker login` or other authentication using the token.

After updating a token, you might want to generate new passwords to access the registry. Run [az acr token credential generate][az-acr-token-credential-generate]. For example:

```azurecli
az acr token credential generate \
  --name MyToken --registry myregistry --days 30
```

## About repository-scoped permissions

### Concepts

To configure repository-scoped permissions, you create an *access token* and an associated *scope map* using commands in the Azure CLI.

* An **access token** is a credential used with a password to authenticate with the registry. Associated with each token are permitted *actions* scoped to one or more repositories. You can set an expiration time for each token. 

* **Actions** on each specified repository include one or more of the following.

  |Action  |Description  |
  |---------|---------|
  |`content/read`     |  Read data from the repository. For example, pull an artifact.  |
  |`metadata/read`    | Read metadata from the repository. For example, list tags or show manifest metadata.   |
  |`content/write`     |  Write data to the repository. Use with `content/read` to push an artifact.    |
  |`metadata/write`     |  Write metadata to the repository. For example, update manifest attributes.  |
  |`content/delete`    | Remove data from the repository. For example, delete a repository or a manifest. |

* A **scope map** is a registry object that groups repository permissions you apply to a token, or can reapply to other tokens. If you don't apply a scope map when creating a token, a scope map is automatically created for you, to save the permission settings. 

  A scope map helps you configure multiple users with identical access to a set of repositories. Azure Container Registry also provides system-defined scope maps that you can apply when creating access tokens.

The following image summarizes the relationship between tokens and scope maps. 

![Registry scope maps and tokens](media/container-registry-repository-scoped-permissions/token-scope-map-concepts.png)

### Scenarios

Scenarios for using an access token include:

* Provide IoT devices with individual tokens to pull an image from a repository
* Provide an external organization with permissions to a specific repository 
* Limit repository access to specific user groups in your organization. For example, provide write and read access to developers who build images that target specific repositories, and read access to teams that deploy from those repositories.

### Authentication using token

Use a token name as a user name and one of its associated passwords to authenticate with the target registry. The authentication method depends on the configured actions.

### content/read or content/write

If the token permits only `content/read` or `content/write` actions, provide token credentials in either of the following authentication flows:

* Authenticate with Docker using `docker login`
* Authenticate with the registry using the [az acr login][az-acr-login] command in the Azure CLI

Following authentication, the token permits the configured actions on the scoped repository or repositories. For example, if the token permits the `content/read` action on a repository, `docker pull` operations are permitted on images in that repository.

#### metadata/read, metadata/write, or content/delete

If the token permits `metadata/read`, `metadata/write`, or `content/delete` actions on a repository, token credentials must be provided as parameters with the related [az acr repository][az-acr-repository] commands in the Azure CLI.

For example, if `metadata/read` actions are permitted on a repository, pass the token credentials when running the [az acr repository show-tags][az-acr-repository-show-tags] command to list tags.

## Next steps

* To manage scope maps and access tokens, use additional commands in the [az acr scope-map][az-acr-scope-map] and [az acr token][az-acr-token] command groups.
* See the [authentication overview](container-registry-authentication.md) for scenarios to authenticate with an Azure container registry using an admin account or an Azure Active Directory identity.


<!-- LINKS - External -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - Internal -->
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-acr-repository]: /cli/azure/acr/repository/
[az-acr-repository-show-tags]: /cli/azure/acr/repository/#az-acr-repository-show-tags
[az-acr-scope-map]: /cli/azure/acr/scope-map/
[az-acr-scope-map-create]: /cli/azure/acr/scope-map/#az-acr-scope-map-create
[az-acr-scope-map-update]: /cli/azure/acr/scope-map/#az-acr-scope-map-update
[az-acr-scope-map-list]: /cli/azure/acr/scope-map/#az-acr-scope-map-list
[az-acr-token]: /cli/azure/acr/token/
[az-acr-token-show]: /cli/azure/acr/token/#az-acr-token-show
[az-acr-token-create]: /cli/azure/acr/token/#az-acr-token-create
[az-acr-token-update]: /cli/azure/acr/token/#az-acr-token-update
[az-acr-token-credential-generate]: /cli/azure/acr/token/credential/#az-acr-token-credential-generate
