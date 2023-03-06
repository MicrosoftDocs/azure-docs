---
title: Enable Caching for ACR (preview)- Azure CLI
description: Learn how to enable Registry Cache in your Azure Container Registry using Azure CLI.
ms.topic: tutorial
ms.date: 04/19/2022
ms.author: tejaswikolli
---

# Enable Caching for ACR (Preview) - Azure CLI

This article is part two of a five-part tutorial series. [Part one](tutorial-registry-cache.md) provides an overview of Caching for ACR, its features, benefits, and preview limitations. This article walks you through the steps of enabling Caching for ACR by using the Azure CLI.

## Prerequisites

You can use the Azure Cloud Shell or a local installation of the Azure CLI to run the command examples in this article. If you'd like to use it locally, version 2.0.74 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Enable Caching for ACR (preview) - Azure CLI

### Configure a cache rule

Run `az acr cache` command to manage cache rules in  Azure Container Registry.

1. Show a cache rule for a given `MyRegistry` Azure Container Registry.
 
    ```azurecli-interactive
     az acr cache show -r MyRegistry -n MyRule""" 
    ```

2. List the cache rules for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
     az acr cache list -r MyRegistry
    ```

3. Create a cache rule without a credential set for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr cache create -r MyRegistry -n MyRule -s docker.io/library/ubuntu -t ubuntu-
    ```

4. Create a cache rule with a credential set for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr cache create -r MyRegistry -n MyRule -s docker.io/library/ubuntu -t ubuntu -c MyCredSet
    ```

5. Update  the credential set on a cache rule for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr cache update -r MyRegistry -n MyRule -c NewCredSet-
    ```

6. Remove a credential set from an existing cache rule for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr cache update -r MyRegistry -n MyRule --remove-cred-set
    ```

7. Delete a cache rule for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr cache delete -r MyRegistry -n MyRule
    ```

### Configure Credential Set

Run `az acr credential-set`command to manage Credential Sets in  Azure Container Registry.

1.  Show a credential set rule for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr credential-set show -r MyRegistry -n MyCredSet
    ```

2. List the credential sets for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr credential-set list -r MyRegistry
    ```

3. Create a credential set for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr credential-set create -r MyRegistry -n MyRule -l docker.io -u https://MyKeyvault.vault.azure.net/secrets/usernamesecret -p https://MyKeyvault.vault.azure.net/secrets/passwordsecret
    ```

4. Update the username or password KV secret ID on a credential set for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr credential-set update -r MyRegistry -n MyRule -p https://MyKeyvault.vault.azure.net/secrets/newsecretname
    ```

5. Delete a credential set for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr credential-set delete -r MyRegistry -n MyCredSet
    ```

## Next steps

* To enable Caching for ACR (preview) using the Azure portal advance to the next article: [Enable Caching for ACR](tutorial-enable-registry-cache.md).