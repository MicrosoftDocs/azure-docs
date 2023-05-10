---
title: Enable Caching for ACR (preview) - Azure CLI 
description: Learn how to enable Registry Cache in your Azure Container Registry using Azure CLI.
ms.topic: tutorial
ms.date: 04/19/2022
ms.author: tejaswikolli
---

# Enable Caching for ACR (Preview) - Azure CLI

This article is part three of a six-part tutorial series. [Part one](tutorial-registry-cache.md) provides an overview of Caching for ACR, its features, benefits, and preview limitations. [Part two](tutorial-enable-registry-cache.md), you learn how to enable Caching for ACR feature by using the Azure portal. This article walks you through the steps of enabling Caching for ACR by using the Azure CLI without authentication.

## Prerequisites

* You can use the [Azure Cloud Shell][Azure Cloud Shell] or a local installation of the Azure CLI to run the command examples in this article. If you'd like to use it locally, version 2.0.74 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][Install Azure CLI].

## Configure Caching for ACR (preview)  - Azure CLI

Follow the steps to create a cache rule without using a Credential set.

### Create a Cache rule

1. Run [az acr cache create][az-acr-cache-create] command to create a cache rule.

    - For example, to create a cache rule without a credential set for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr cache create -r MyRegistry -n MyRule -s docker.io/library/ubuntu -t ubuntu-
    ```

2. Run [az acr cache show][az-acr-cache-show] command to show a cache rule.

    - For example, to show a cache rule for a given `MyRegistry` Azure Container Registry.
 
    ```azurecli-interactive
     az acr cache show -r MyRegistry -n MyRule
    ```

### Pull your image

1. Pull the image from your cache using the Docker command `docker pull myregistry.azurecr.io/hello-world`.


## Clean up the resources

1. Run [az acr cache list][az-acr-cache-list] command to list the cache rules in the Azure Container Registry.

    - For example, to list the cache rules for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
     az acr cache list -r MyRegistry
    ```

2. Run [az acr cache delete][az-acr-cache-delete] command to delete a cache rule.

    - For example, to delete a cache rule for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr cache delete -r MyRegistry -n MyRule
    ```

## Next steps

* To enable Caching for ACR (preview) with authentication using the Azure CLI advance to the next article [Enable Caching for ACR - Azure CLI](tutorial-enable-registry-cache-auth-cli.md).

<!-- LINKS - External -->
[Install Azure CLI]: /cli/azure/install-azure-cli
[Azure Cloud Shell]: /azure/cloud-shell/quickstart
[az-acr-cache-create]:/cli/azure/acr/cache#az-acr-cache-create
[az-acr-cache-show]:/cli/azure/acr/cache#az-acr-cache-show
[az-acr-cache-list]:/cli/azure/acr/cache#az-acr-cache-list
[az-acr-cache-delete]:/cli/azure/acr/cache#az-acr-cache-delete