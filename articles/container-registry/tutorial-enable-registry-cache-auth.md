---
title: Enable Caching for ACR with authentication- Azure portal
description: Learn how to enable Caching for ACR with authentication using Azure portal.
ms.topic: tutorial
ms.date: 04/19/2022
ms.author: tejaswikolli
---

# Enable Caching for ACR (Preview) with authentication - Azure portal

This article is part four of a five-part tutorial series. [Part one](tutorial-registry-cache.md) provides an overview of Caching for ACR, its features, benefits, and preview limitations. In [part two](tutorial-enable-registry-cache.md), you learn how to enable Caching for ACR feature by using the Azure portal. 

This article walks you through the steps of enabling Caching for ACR with authentication by using the Azure portal. You have to use the Credential set to make an authenticated pull or to access a private repository.

## Prerequisites

* Sign in to the [Azure portal](https://ms.portal.azure.com/). 


## Configure Caching for ACR with authentication - Azure portal

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

## Next steps

* Advance to the [next article](tutorial-troubleshoot-registry-cache.md) to walk through the troubleshoot guide for Registry Cache.

<!-- LINKS - External -->
[create-and-store-keyvault-credentials]: ../key-vault/secrets/quick-create-portal.md
[az-keyvault-set-policy]: /azure/key-vault/general/assign-access-policy.md#assign-an-access-policy