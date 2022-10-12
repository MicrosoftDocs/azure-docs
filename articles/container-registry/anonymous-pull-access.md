---
title: Enable anonymous pull access
description: Optionally enable anonymous pull access to make content in your Azure container registry publicly available
ms.topic: how-to
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
---

# Make your container registry content publicly available

Setting up an Azure container registry for anonymous (unauthenticated) pull access is an optional feature that allows any user with internet access the ability to pull any content from the registry.

Anonymous pull access is a preview feature, available in the Standard and Premium [service tiers](container-registry-skus.md). To configure anonymous pull access, update a registry using the Azure CLI (version 2.21.0 or later). To install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## About anonymous pull access

By default, access to pull or push content from an Azure container registry is only available to [authenticated](container-registry-authentication.md) users. Enabling anonymous (unauthenticated) pull access makes all registry content publicly available for read (pull) actions. Anonymous pull access can be used in scenarios that do not require user authentication such as distributing public container images.

- Enable anonymous pull access by updating the properties of an existing registry.
- After enabling anonymous pull access, you may disable that access at any time.
- Only data-plane operations are available to unauthenticated clients.
- The registry may throttle a high rate of unauthenticated requests.
- If you previously authenticated to the registry, make sure you clear the credentials before attempting an anonymous pull operation.

> [!WARNING]
> Anonymous pull access currently applies to all repositories in the registry. If you manage repository access using [repository-scoped tokens](container-registry-repository-scoped-permissions.md), all users may pull from those repositories in a registry enabled for anonymous pull. We recommend deleting tokens when anonymous pull access is enabled.

## Configure anonymous pull access 

### Enable anonymous pull access
Update a registry using the [az acr update](/cli/azure/acr#az-acr-update) command and pass the `--anonymous-pull-enabled` parameter. By default, anonymous pull is disabled in the registry.
          
```azurecli
az acr update --name myregistry --anonymous-pull-enabled
``` 

> [!IMPORTANT]
> If you previously authenticated to the registry with Docker credentials, run `docker logout` to ensure that you clear the existing credentials before attempting anonymous pull operations. Otherwise, you might see an error message similar to "pull access denied".

### Disable anonymous pull access
Disable anonymous pull access by setting `--anonymous-pull-enabled` to `false`.

```azurecli
az acr update --name myregistry --anonymous-pull-enabled false
```

## Next steps

* Learn about using [repository-scoped tokens](container-registry-repository-scoped-permissions.md).
* Learn about options to [authenticate](container-registry-authentication.md) to an Azure container registry.
