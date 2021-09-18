---
title: Enable anonymous pull access
description: Optionally enable anonymous pull access to content in your Azure container registry
ms.topic: how-to
ms.date: 09/17/2021
ms.custom: ""
---

# Make your container registry content publicly available

Setting up an Azure container registry for anonymous (unauthenticated) pull access is an optional feature that provides any user with internet access the ability to pull content from the registry.

Anonymous pull access is a preview feature, available in the Standard and Premium [service tiers](container-registry-skus.md). 

## About anonymous pull access

Content in an Azure container registry is not publicly available by default. Access to pull or push content is only available to [authenticated](container-registry-authentiation.md) users. Enabling anonymous (unauthenticated) pull access makes all registry content publicly available for read (pull) actions. Anonymous pull access supports scenarios such as distributing public container images where you do not need to configure user authentication.

> You can enable anonymous pull access only by updating the properties of an existing registry.
> * Only data-plane operations are available to unauthenticated clients.
> * The registry may throttle a high rate of unauthenticated requests.
> * After enabling anonymous pull access, you may disable that access at any time.

> [!WARNING]
> Anonymous pull access currently applies to all repositories in the registry. If you manage repository access using [repository-scoped tokens](container-registry-repository-scoped-permissions.md), be aware that all users may pull from those repositories in a registry enabled for anonymous pull. We recommend deleting tokens when anonymous pull access is enabled.

## Configure anonymous pull access
     
Update a registry using the Azure CLI (version 2.21.0 or later) and pass the `--anonymous-pull-enabled` parameter to the [az acr update](/cli/azure/acr#az_acr_update) command:
          
```azurecli
az acr update --name myregistry --anonymous-pull-enabled
``` 
          
You may disable anonymous pull access at any time by setting `--anonymous-pull-enabled` to `false`.
          
> [!NOTE]
> * Before attempting an anonymous pull operation, run `docker logout` to ensure that you clear any existing Docker credentials.
          




## Next steps



<!-- LINKS - external -->

