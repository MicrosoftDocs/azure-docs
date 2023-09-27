---
title: Enable Artifact Cache with authentication - Azure CLI
description: Learn how to enable Artifact Cache with authentication using Azure CLI.
ms.topic: tutorial
ms.custom: devx-track-azurecli
ms.date: 06/17/2022
ms.author: tejaswikolli
---

# Enable Artifact Cache with authentication - Azure CLI

This article is part five of a six-part tutorial series. [Part one](tutorial-artifact-cache.md) provides an overview of Artifact Cache, its features, benefits, and limitations. In [part two](tutorial-enable-artifact-cache.md), you learn how to enable Artifact Cache feature by using the Azure portal. In [part three](tutorial-enable-artifact-cache-cli.md), you learn how to enable Artifact Cache feature by using the Azure CLI. In [part four](tutorial-enable-artifact-cache-auth.md), you learn how to enable Artifact Cache feature with authentication by using Azure portal. 

This article walks you through the steps of enabling Artifact Cache with authentication by using the Azure CLI. You have to use the Credentials to make an authenticated pull or to access a private repository.

## Prerequisites

* You can use the [Azure Cloud Shell][Azure Cloud Shell] or a local installation of the Azure CLI to run the command examples in this article. If you'd like to use it locally, version 2.46.0 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][Install Azure CLI].
* You have an existing Key Vault to store the credentials. Learn more about [creating and storing credentials in a Key Vault.][create-and-store-keyvault-credentials]
* You can set and retrieve secrets from your Key Vault. Learn more about [set and retrieve a secret from Key Vault.][set-and-retrieve-a-secret]

## Configure Artifact Cache with authentication - Azure CLI

### Create Credentials - Azure CLI

Before configuring the Credentials, you have to create and store secrets in the Azure KeyVault and retrieve the secrets from the Key Vault. Learn more about [creating and storing credentials in a Key Vault.][create-and-store-keyvault-credentials] and to [set and retrieve a secret from Key Vault.][set-and-retrieve-a-secret].

1. Run [az acr credential set create][az-acr-credential-set-create] command to create the credentials. 

    - For example, To create the credentials for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr credential-set create 
    -r MyRegistry \
    -n MyRule \
    -l docker.io \ 
    -u https://MyKeyvault.vault.azure.net/secrets/usernamesecret \
    -p https://MyKeyvault.vault.azure.net/secrets/passwordsecret
    ```

2. Run [az acr credential set update][az-acr-credential-set-update] to update the username or password KV secret ID on a credential set.

    - For example, to update the username or password KV secret ID on the credentials for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr credential-set update -r MyRegistry -n MyRule -p https://MyKeyvault.vault.azure.net/secrets/newsecretname
    ```

3. Run [az-acr-credential-set-show][az-acr-credential-set-show] to show the credentials. 

    - For example, to show the credentials for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr credential-set show -r MyRegistry -n MyCredSet
    ```

### Create a cache rule with the Credentials - Azure CLI

1. Run [az acr cache create][az-acr-cache-create] command to create a cache rule.

    - For example, to create a cache rule with the credentials for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr cache create -r MyRegistry -n MyRule -s docker.io/library/ubuntu -t ubuntu -c MyCredSet
    ```

2. Run [az acr cache update][az-acr-cache-update] command to update the credentials on a cache rule.

    - For example, to update the credentials on a cache rule for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr cache update -r MyRegistry -n MyRule -c NewCredSet
    ```

    - For example, to remove the credentials from an existing cache rule for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr cache update -r MyRegistry -n MyRule --remove-cred-set
    ```

3. Run [az acr cache show][az-acr-cache-show] command to show a cache rule.

    - For example, to show a cache rule for a given `MyRegistry` Azure Container Registry.
 
    ```azurecli-interactive
     az acr cache show -r MyRegistry -n MyRule
    ```

### Assign permissions to Key Vault

1. Get the principal ID of system identity in use to access Key Vault.

    ```azurecli-interactive
    PRINCIPAL_ID=$(az acr credential-set show 
                    -n MyCredSet \ 
                    -r MyRegistry  \
                    --query 'identity.principalId' \ 
                    -o tsv) 
    ```

2. Run the [az keyvault set-policy][az-keyvault-set-policy] command to assign access to the Key Vault, before pulling the image.

    - For example, to assign permissions for the credentials access the KeyVault secret

    ```azurecli-interactive
    az keyvault set-policy --name MyKeyVault \
    --object-id $PRINCIPAL_ID \
    --secret-permissions get
    ```

### Pull your Image

1. Pull the image from your cache using the Docker command by the registry login server name, repository name, and its desired tag.

    - For example, to pull the image from the repository `hello-world` with its desired tag `latest` for a given registry login server `myregistry.azurecr.io`.

    ```azurecli-interactive
     docker pull myregistry.azurecr.io/hello-world:latest
    ```

## Clean up the resources

1. Run [az acr cache list][az-acr-cache-list] command to list the cache rules in the Azure Container Registry.

    - For example, to list the cache rules for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
     az acr cache list -r MyRegistry
    ```

2.  Run [az acr cache delete][az-acr-cache-delete] command to delete a cache rule.

    - For example, to delete a cache rule for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr cache delete -r MyRegistry -n MyRule
    ```

3. Run[az acr credential set list][az-acr-credential-set-list] to list the credential in an Azure Container Registry. 

    - For example, to list the credentials for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr credential-set list -r MyRegistry
    ```

4. Run [az-acr-credential-set-delete][az-acr-credential-set-delete] to delete the credentials. 

    - For example, to delete the credentials for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr credential-set delete -r MyRegistry -n MyCredSet
    ```

## Next steps

* Advance to the [next article](tutorial-troubleshoot-artifact-cache.md) to walk through the troubleshoot guide for Registry Cache.

<!-- LINKS - External -->
[create-and-store-keyvault-credentials]: ../key-vault/secrets/quick-create-cli.md#add-a-secret-to-key-vault
[set-and-retrieve-a-secret]: ../key-vault/secrets/quick-create-cli.md#retrieve-a-secret-from-key-vault
[az-keyvault-set-policy]: ../key-vault/general/assign-access-policy.md#assign-an-access-policy
[Install Azure CLI]: /cli/azure/install-azure-cli
[Azure Cloud Shell]: /azure/cloud-shell/quickstart
[az-acr-cache-create]:/cli/azure/acr/cache#az-acr-cache-create
[az-acr-cache-show]:/cli/azure/acr/cache#az-acr-cache-show
[az-acr-cache-list]:/cli/azure/acr/cache#az-acr-cache-list
[az-acr-cache-delete]:/cli/azure/acr/cache#az-acr-cache-delete
[az-acr-cache-update]:/cli/azure/acr/cache#az-acr-cache-update
[az-acr-credential-set-create]:/cli/azure/acr/credential-set#az-acr-credential-set-create
[az-acr-credential-set-update]:/cli/azure/acr/credential-set#az-acr-credential-set-update
[az-acr-credential-set-show]: /cli/azure/acr/credential-set#az-acr-credential-set-show
[az-acr-credential-set-list]: /cli/azure/acr/credential-set#az-acr-credential-set-list
[az-acr-credential-set-delete]: /cli/azure/acr/credential-set#az-acr-credential-set-delete
