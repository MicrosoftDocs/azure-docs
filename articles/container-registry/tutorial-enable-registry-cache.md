---
title: Enable Caching for ACR (preview) - Azure CLI and Azure portal
description: Learn how to enable Registry Cache in your Azure Container Registry using Azure CLI and Azure portal.
ms.topic: tutorial
ms.date: 04/19/2022
ms.author: tejaswikolli
---

# Enable Caching for ACR (Preview) 

This article is part two of a four-part tutorial series. [Part one](tutorial-registry-cache.md) provides an overview of Caching for ACR, its features, benefits, and preview limitations. This article walks you through the steps of enabling Caching for ACR by using the Azure CLI and Azure portal.

## Prerequisites

>* You can use the [Azure Cloud Shell][Azure Cloud Shell] or a local installation of the Azure CLI to run the command examples in this article. If you'd like to use it locally, version 2.0.74 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][Install Azure CLI].
>* You have an existing Key Vault to store credentials. Learn more about [creating and storing credentials in a Key Vault.][create-and-store-keyvault-credentials]
>* Sign in to the [Azure portal](https://ms.portal.azure.com/). 

## Configure Caching for ACR (preview) without a Credential set  - Azure CLI

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

3. Pull the image from your cache using the Docker command `docker pull myregistry.azurecr.io/hello-world`.

## Configure Caching for ACR (preview) - Azure portal

Follow the steps to create cache rule in the [Azure portal](https://portal.azure.com). 

1. Navigate to your Azure Container Registry. 

2. In the side **Menu**, under the **Services**, select **Cache** (Preview).


    :::image type="content" source="./media/container-registry-registry-cache/cache-preview-01.png" alt-text="Screenshot for Registry cache preview.":::


3. Select **Create Rule**.


    :::image type="content" source="./media/container-registry-registry-cache/cache-blade-02.png" alt-text="Screenshot for Create Rule.":::


4. A window for **New cache rule** appears.


    :::image type="content" source="./media/container-registry-registry-cache/new-cache-rule-03.png" alt-text="Screenshot for new Cache Rule.":::


5. Enter the **Rule name**.

6. Select **Source** Registry from the dropdown menu. Currently, Caching for ACR only supports **Docker Hub** and **Microsoft Artifact Registry**. 

7. Enter the **Repository Path** to the artifacts you want to cache.

8. You can skip **Authentication**, if you aren't accessing a private repository or performing an authenticated pull.

9. Under the **Destination**, Enter the name of the **New ACR Repository Namespace** to store cached artifacts.


    :::image type="content" source="./media/container-registry-registry-cache/save-cache-rule-04.png" alt-text="Screenshot to save Cache Rule.":::


10. Select on **Save** 

11. Pull the image from your cache using the Docker command `docker pull myregistry.azurecr.io/hello-world`

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

* Advance to the [next article](tutorial-enable-registry-cache-auth.md) to enable the Caching for ACR (preview) with authentication using Azure portal.

<!-- LINKS - External -->
[create-and-store-keyvault-credentials]:../key-vault/secrets/quick-create-portal.md
[Install Azure CLI]: /cli/azure/install-azure-cli
[Azure Cloud Shell]: /azure/cloud-shell/quickstart
[az-acr-cache-create]:/cli/azure/acr/cache#az-acr-cache-create
[az-acr-cache-show]:/cli/azure/acr/cache#az-acr-cache-show
[az-acr-cache-list]:/cli/azure/acr/cache#az-acr-cache-list
[az-acr-cache-delete]:/cli/azure/acr/cache#az-acr-cache-delete