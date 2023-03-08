---
title: Enable Caching for ACR (preview)- Azure CLI
description: Learn how to enable Registry Cache in your Azure Container Registry using Azure CLI.
ms.topic: tutorial
ms.date: 04/19/2022
ms.author: tejaswikolli
---

# Enable Caching for ACR (Preview) - Azure CLI

This article is part two of a five-part tutorial series. [Part one](tutorial-registry-cache.md) provides an overview of Caching for ACR, its features, benefits, and preview limitations. This article walks you through the steps of enabling Caching for ACR by using the Azure CLI.

## Enable Caching for ACR without a Credential Set - Azure CLI

## Prerequisites

>* You can use the [Azure Cloud Shell][Azure Cloud Shell] or a local installation of the Azure CLI to run the command examples in this article. If you'd like to use it locally, version 2.0.74 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][Install Azure CLI].
>* You have an existing Key Vault to store credentials. Learn more about [creating and storing credentials in a Key Vault.][create-and-store-keyvault-credentials]

## Create a cache rule without a Credential Set

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

3. Run [az acr cache list][az-acr-cache-list] command to list the cache rules in the Azure Container Registry.

    - For example, to list the cache rules for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
     az acr cache list -r MyRegistry
    ```

4. Run [az acr cache delete][az-acr-cache-delete] command to delete a cache rule.

    - For example, to delete a cache rule for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr cache delete -r MyRegistry -n MyRule
    ```
## Enable Caching for ACR (preview) with a Credential Set - Azure CLI

Learn more about [creating credentials using key vault][create-and-store-keyvault-credentials]. 

### Configure a Credential Set

1. Run [az acr credential set create][az-acr-credential-set-create] command to create a credential set. 

    - For example, To create a credential set for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr credential-set create -r MyRegistry -n MyRule -l docker.io -u https://MyKeyvault.vault.azure.net/secrets/usernamesecret -p https://MyKeyvault.vault.azure.net/secrets/passwordsecret
    ```

2. Run [az acr credential set update][az-acr-credential-set-update] to update the username or password KV secret ID on a credential set.

    - For example, to update the username or password KV secret ID on a credential set a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr credential-set update -r MyRegistry -n MyRule -p https://MyKeyvault.vault.azure.net/secrets/newsecretname
    ```

3. Run [az-acr-credential-set-show][az-acr-credential-set-show] to show a credential set. 

    - For example, to show a credential set for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr credential-set show -r MyRegistry -n MyCredSet
    ```

4. Run[az acr credential set list][az-acr-credential-set-list] to list the credential sets in an Azure Container Registry. 

    - For example, to list the credential sets for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr credential-set list -r MyRegistry
    ```

5. Run [az-acr-credential-set-delete][az-acr-credential-set-delete] to delete a credential set. 

    - For example, to delete a credential set for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr credential-set delete -r MyRegistry -n MyCredSet
    ```

### Create a cache rule with a Credential Set

1. Run [az acr cache create][az-acr-cache-create] command to create a cache rule.

    - For example, to create a cache rule with a credential set for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr cache create -r MyRegistry -n MyRule -s docker.io/library/ubuntu -t ubuntu -c MyCredSet
    ```

2. Run [az acr cache update][az-acr-cache-update] command to update the credential set on a cache rule.

    - For example, to update the credential set on a cache rule for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr cache update -r MyRegistry -n MyRule -c NewCredSet-
    ```

    - For example, to remove a credential set from an existing cache rule for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr cache update -r MyRegistry -n MyRule --remove-cred-set
    ```

3. Run [az acr cache show][az-acr-cache-show] command to show a cache rule.

    - For example, to show a cache rule for a given `MyRegistry` Azure Container Registry.
 
    ```azurecli-interactive
     az acr cache show -r MyRegistry -n MyRule""" 
    ```

4. Run [az acr cache list][az-acr-cache-list] command to list the cache rules in the Azure Container Registry.

    - For example, to list the cache rules for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
     az acr cache list -r MyRegistry
    ```

5.  Run [az acr cache delete][az-acr-cache-delete] command to delete a cache rule.

    - For example, to delete a cache rule for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr cache delete -r MyRegistry -n MyRule
    ```

6. Run the [az keyvault set-policy][az-keyvault-set-policy] command to assign access to the Key Vault, before pulling the image.

    ```azurecli-interactive
    az keyvault set-policy --name myKeyVaultName --object-id myObjID --secret-permissions get
    ```

7. Pull the image from your cache using the Docker command `docker pull docker.io/library/ubuntu`

## Next steps

* To enable Caching for ACR (preview) using the Azure portal advance to the next article: [Enable Caching for ACR](tutorial-enable-registry-cache.md).

<!-- LINKS - External -->
[create-and-store-keyvault-credentials]: ../key-vault/secrets/quick-create-cli.md
[az-keyvault-set-policy]: /azure/key-vault/general/assign-access-policy.md#assign-an-access-policy
[Install Azure CLI]: /cli/azure/install-azure-cli
[Azure Cloud Shell]: /azure/cloud-shell/quickstart
[az-acr-cache-create]:/cli/azure/acr/cache#az-acr-cache-create
[az-acr-cache-show]:/cli/azure/acr/cache#az-acr-cache-show
[az-acr-cache-list]:/cli/azure/acr/cache#az-acr-cache-list
[az-acr-cache-delete]:/cli/azure/acr/cache#az-acr-cache-delete
[az-acr-cache-update]:/cli/azure/acr/cache#az-acr-cache-update
[az-acr-credential-set-create]:/cli/azure/acr/credential-set#az-acr-credential-set-create
[az-acr-credential-set-update]:cli/azure/acr/credential-set#az-acr-credential-set-update
[az-acr-credential-set-show]: /cli/azure/acr/credential-set#az-acr-credential-set-show
[az-acr-credential-set-list]: /cli/azure/acr/credential-set#az-acr-credential-set-list
[az-acr-credential-set-delete]: /cli/azure/acr/credential-set#az-acr-credential-set-delete