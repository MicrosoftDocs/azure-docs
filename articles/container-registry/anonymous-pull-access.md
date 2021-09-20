---
title: Enable anonymous pull access
description: Optionally enable anonymous pull access to make content in your Azure container registry publicly available
ms.topic: how-to
ms.date: 09/17/2021
ms.custom: ""
---

# Make your container registry content publicly available

Setting up an Azure container registry for anonymous (unauthenticated) pull access is an optional feature that allows any user with internat access the ability to pull any content from the registry.

Anonymous pull access is a preview feature, available in the Standard and Premium [service tiers](container-registry-skus.md). To confgure anonymous pull access, update a registry using the Azure CLI (version 2.21.0 or later). To install or upgrade, see [Install Azure CLI](/cli/azure-install-cli).

## About anonymous pull access

Content in an Azure container registry is not publicly available by default. Access to pull or push registry content is only available to [authenticated](container-registry-authentiation.md) users. Enabling anonymous (unauthenticated) pull access makes all registry content publicly available for read (pull) actions. Anonymous pull access can be used in scenarios such as distributing public container images that do not require user authentication.

> * Enable anonymous pull access by updating the properties of an existing registry.
> * After enabling anonymous pull access, you may disable that access at any time.
> * Only data-plane operations are available to unauthenticated clients.
> * The registry may throttle a high rate of unauthenticated requests.

> [!WARNING]
> Anonymous pull access currently applies to all repositories in the registry. If you manage repository access using [repository-scoped tokens](container-registry-repository-scoped-permissions.md), all users may pull from those repositories in a registry enabled for anonymous pull. We recommend deleting tokens when anonymous pull access is enabled.

## Configure anonymous pull access 

### Enable anonymous pull access
Update a registry using the [az acr update](/cli/azure/acr#az_acr_update) command and pass the `--anonymous-pull-enabled` parameter. By default, anonymous pull is disabled in the registry.
          
```azurecli
az acr update --name myregistry --anonymous-pull-enabled
``` 

> [!IMPORTANT]
> Before attempting an anonymous pull operation, run `docker logout` to ensure that you clear any existing Docker credentials.

### Disable anonymous pull access
Disable anonymous pull access by setting `--anonymous-pull-enabled` to `false`.

```azurecli
az acr update --name myregistry --anonymous-pull-enabled false
```

## Next steps

* Learn about using [repository-scoped tokens](container-registry-repository-scoped-permissions.md).
* Learn about options to [authenticate](container-registry-authentication.md) to an Azure container registry.
