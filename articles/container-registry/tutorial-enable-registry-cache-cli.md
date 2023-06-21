---
title: Enable Cache for ACR (preview) - Azure CLI 
description: Learn how to enable Registry Cachein your Azure Container Registry using Azure CLI.
ms.topic: tutorial
ms.custom: devx-track-azurecli
ms.date: 06/17/2022
ms.author: tejaswikolli
---

# Enable Cache for ACR (Preview) - Azure CLI

This article is part three of a six-part tutorial series. [Part one](tutorial-registry-cache.md) provides an overview of Cache for ACR, its features, benefits, and preview limitations. [Part two](tutorial-enable-registry-cache.md), you learn how to enable Cache for ACR feature by using the Azure portal. This article walks you through the steps of enabling Cache for ACR by using the Azure CLI without authentication.

## Prerequisites

* You can use the [Azure Cloud Shell][Azure Cloud Shell] or a local installation of the Azure CLI to run the command examples in this article. If you'd like to use it locally, version 2.46.0 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][Install Azure CLI].

## Configure Cache for ACR (preview)  - Azure CLI

Follow the steps to create a Cache rule without using a Credential set.

### Create a Cache rule

1. Run [az acr Cache create][az-acr-cache-create] command to create a Cache rule.

    - For example, to create a Cache rule without a credential set for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr Cache create -r MyRegistry -n MyRule -s docker.io/library/ubuntu -t ubuntu-
    ```

2. Run [az acr Cache show][az-acr-cache-show] command to show a Cache rule.

    - For example, to show a Cache rule for a given `MyRegistry` Azure Container Registry.
 
    ```azurecli-interactive
     az acr Cache show -r MyRegistry -n MyRule
    ```

### Pull your image

1. Pull the image from your cache using the Docker command by the registry login server name, repository name, and its desired tag.

    - For example, to pull the image from the repository `hello-world` with its desired tag `latest` for a given registry login server `myregistry.azurecr.io`.

    ```azurecli-interactive
     docker pull myregistry.azurecr.io/hello-world:latest
    ```

## Clean up the resources

1. Run [az acr Cache list][az-acr-cache-list] command to list the Cache rules in the Azure Container Registry.

    - For example, to list the Cache rules for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
     az acr Cache list -r MyRegistry
    ```

2. Run [az acr Cache delete][az-acr-cache-delete] command to delete a Cache rule.

    - For example, to delete a Cache rule for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr Cache delete -r MyRegistry -n MyRule
    ```

## Next steps

* To enable Cache for ACR (preview) with authentication using the Azure CLI advance to the next article [Enable Cache for ACR - Azure CLI](tutorial-enable-registry-cache-auth-cli.md).

<!-- LINKS - External -->
[Install Azure CLI]: /cli/azure/install-azure-cli
[Azure Cloud Shell]: /azure/cloud-shell/quickstart
[az-acr-cache-create]:/cli/azure/acr/cache#az-acr-cache-create
[az-acr-cache-show]:/cli/azure/acr/cache#az-acr-cache-show
[az-acr-cache-list]:/cli/azure/acr/cache#az-acr-cache-list
[az-acr-cache-delete]:/cli/azure/acr/cache#az-acr-cache-delete
