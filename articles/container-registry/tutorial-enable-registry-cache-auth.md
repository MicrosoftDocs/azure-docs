---
title: Enable Caching for ACR with authentication- Azure CLI, Azure portal
description: Learn how to enable Caching for ACR with authentication using Azure CLI, Azure portal.
ms.topic: tutorial
ms.date: 04/19/2022
ms.author: tejaswikolli
---

# Enable Caching for ACR (Preview) with authentication - Azure portal

This article is part three of a four-part tutorial series. [Part one](tutorial-registry-cache.md) provides an overview of Caching for ACR, its features, benefits, and preview limitations. In [part two](tutorial-enable-registry-cache.md), you learn how to enable Caching for ACR feature by using the Azure CLI and the Azure portal. 

This article walks you through the steps of enabling Caching for ACR with authentication by using the Azure CLI and Azure portal. You have to use the Credential set to make an authenticated pull or to access a private repository.

## Prerequisites

>* You can use the [Azure Cloud Shell][Azure Cloud Shell] or a local installation of the Azure CLI to run the command examples in this article. If you'd like to use it locally, version 2.0.74 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][Install Azure CLI].
>* You have an existing Key Vault to store credentials. Learn more about [creating and storing credentials in a Key Vault.][create-and-store-keyvault-credentials]
>* Sign in to the [Azure portal](https://ms.portal.azure.com/). 

## Configure Caching for ACR (preview) with authentication - Azure CLI

### Configure a Credential Set - Azure CLI

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

### Create a cache rule with a Credential Set - Azure CLI

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

4. Run the [az keyvault set-policy][az-keyvault-set-policy] command to assign access to the Key Vault, before pulling the image.

    ```azurecli-interactive
    az keyvault set-policy --name myKeyVaultName --object-id myObjID --secret-permissions get
    ```

5. Pull the image from your cache using the Docker command `docker pull myregistry.azurecr.io/hello-world`

## Configure Caching for ACR (preview) with authentication - Azure portal

Follow the steps to create cache rule in the [Azure portal](https://portal.azure.com). 

1. Navigate to your Azure Container Registry. 

2. In the side **Menu**, under the **Services**, select **Cache** (Preview).


    :::image type="content" source="./media/container-registry-registry-cache/cache-preview-01.png" alt-text="Screenshot for Registry cache preview.":::


3. Select **Create Rule**.


    :::image type="content" source="./media/container-registry-registry-cache/cache-blade-02.png" alt-text="Screenshot for Create Rule.":::


4. A window for **New cache rule** appears.


    :::image type="content" source="./media/container-registry-registry-cache/new-cache-rule-auth-03.png" alt-text="Screenshot for new Cache Rule.":::


5. Enter the **Rule name**.

6. Select **Source** Registry from the dropdown menu. Currently, Caching for ACR only supports **Docker Hub** and **Microsoft Artifact Registry**. 

7. Enter the **Repository Path** to the artifacts you want to cache.

8. For adding authentication to the repository, check the **Authentication** box. 

9. Choose **Create new credentials** to create a new set of credentials to store the username and password for your source registry. Learn how to [create new credentials](tutorial-enable-registry-cache-auth.md#create-new-credentials)

10. If you have the credentials ready, **Select credentials** from the drop-down menu.

11. Under the **Destination**, Enter the name of the **New ACR Repository Namespace** to store cached artifacts.


    :::image type="content" source="./media/container-registry-registry-cache/save-cache-rule-04.png" alt-text="Screenshot to save Cache Rule.":::


12. Select on **Save** 

13. Run the [az keyvault set-policy][az-keyvault-set-policy] command to assign access to the Key Vault, before pulling the image.

```azurecli-interactive
az keyvault set-policy --name myKeyVaultName --object-id myObjID --secret-permissions get
```

14. Pull the image from your cache using the Docker command `docker pull myregistry.azurecr.io/hello-world`

### Create new credentials

1. Navigate to **Credentials** > **Add credential set** > **Create new credentials**.


    :::image type="content" source="./media/container-registry-registry-cache/add-credential-set-05.png" alt-text="Screenshot for adding credential set.":::


    :::image type="content" source="./media/container-registry-registry-cache/create-credential-set-06.png" alt-text="Screenshot for create new credential set.":::


1. Enter **Name** for the new credentials for your source registry.

1. Select a **Source Authentication**. Caching for ACR currently supports **Select from Key Vault** and **Enter secret URI's**.

1. For the  **Select from Key Vault** option, Learn more about [creating credentials using key vault][create-and-store-keyvault-credentials]. 

1. Select on **Create**

## Clean up the resources

1. Run[az acr credential set list][az-acr-credential-set-list] to list the credential sets in an Azure Container Registry. 

    - For example, to list the credential sets for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr credential-set list -r MyRegistry
    ```

2. Run [az-acr-credential-set-delete][az-acr-credential-set-delete] to delete a credential set. 

    - For example, to delete a credential set for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr credential-set delete -r MyRegistry -n MyCredSet
    ```

3. Run [az acr cache list][az-acr-cache-list] command to list the cache rules in the Azure Container Registry.

    - For example, to list the cache rules for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
     az acr cache list -r MyRegistry
    ```

4.  Run [az acr cache delete][az-acr-cache-delete] command to delete a cache rule.

    - For example, to delete a cache rule for a given `MyRegistry` Azure Container Registry.

    ```azurecli-interactive
    az acr cache delete -r MyRegistry -n MyRule
    ```

## Next steps

* Advance to the [next article](tutorial-troubleshoot-registry-cache.md) to walk through the troubleshoot guide for Registry Cache.

<!-- LINKS - External -->
[create-and-store-keyvault-credentials]: ../key-vault/secrets/quick-create-portal.md
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