---
title: Enable Registry Cache
description: Learn how to enable Registry Cache in your Azure Container Registry using Azure portal.
ms.topic: tutorial
ms.date: 04/19/2022
ms.author: tejaswikolli
---

# Enable Registry Cache

This article is part two in a three-part tutorial series. [Part one](tutorial-registry-cache.md) provides an overview of Registry Cache, their features, benefit's, and preview limitations. This article walks you through the steps of enabling a Registry Cache by using the Azure portal.

## Prerequisites

* Sign in to the [Azure portal](https://ms.portal.azure.com/). 

## Terminology 

- Cache Rule
    - A cache rule is a set of rules used to pull artifacts from a public Registry into your cache. A cache rule contains four parts
        
        1. A Rule Name - This is the name of your cache rule.

        2. A Source - This is the name of the Source Registry.

        3. A Repository Path - This is the fully qualified path of the artifact you want cached.

        4. A ACR Repository Path - This is the repository path where cached artifacts will be stored.

- Credential Set
    - A credential set is a username and password in key vault for the source registry. A credential set is needed if a cached is pulling from a private repository. A credential set contains three parts

        1. A Credential Set Name - This is the name of your credential set.

        2. A Source registry Login Server - This is the login server of your source registry.

        3. A username and password - This is the username and password for your source repository from Secert URI or Key Vault.

## Configure Registry Cache - Azure portal

Follow the steps to create cache rule in the [Azure portal](https://portal.azure.com). 

1. Navigate to your Azure Container Registry. 

2. In the side **Menu**, under the **Services**, select **Cache**(Preview).

        :::image type="content" source="./media/container-registry-registry-cache/cache-preview-01.png" alt-text="Screenshot for Registry cache preview blade.":::

3. Click on **Create Rule**.

        :::image type="content" source="./media/container-registry-registry-cache/cache-blade-02.png" alt-text="Screenshot for Create Rule.":::

4. A **New cache rule** window pops up.

        :::image type="content" source="./media/container-registry-registry-cache/new-cache-rule-03.png" alt-text="Screenshot for new Cache Rule.":::

5. Specify the **Rule name**.

6. Select **Source** Registry from the dropdown menu options. Currently ACR supports **Docker Hub** and **Microsoft Artifact Registry**. 

7. Specify the **Repository Path** to cache the artifacts.

8. If the repository requires authentication, check the **Authentication** box. If not, skip to step 11.

9. Choose **Create new credentials** to create a new set of credentials to store the username and password for your source registry. Learn how to [create new credentials](###Create-new-credentials)

10. If you have the credentials ready, **Select credentials** from the drop down menu.

11. Under the **Destination**, specify the name of the **New ACR repository path** to store cached artifacts.

        :::image type="content" source="./media/container-registry-registry-cache/save-cache-rule-04.png.png" alt-text="Screenshot to save Cache Rule.":::

12. Click on **Save** 

13. Pull the image from your cache using the Azure CLI command <br> `docker pull MyRegistry.azurecr.io/hello-world`

### Create new credentials

1. Navigate to **Credentials** > **Add credential set** > **Create new credentials**.

        :::image type="content" source="./media/container-registry-registry-cache/add-credential-set-05.png" alt-text="Screenshot for adding credential set.":::


        :::image type="content" source="./media/container-registry-registry-cache/create-credential-set-06.png" alt-text="Screenshot for create new credential set.":::


1. Specify **Name** for the new credentials for your source registry.

1. Select a **Source Authentication**. Caching for ACR currently supports **Select from Key Vault** and **Enter secret URI's**.

1. For the  **Select from Key Vault** option, Learn more about [creating credentials using key vault][create-and-store-keyvault-credentials]. 

1. For the **Enter secret URI's** option,, Learn more about [securing secret URI's][secure-authentication-secrets].

1. Click on **Create**

## Next steps

* Advance to the [next article](tutorial-troubleshoot-registry-cache.md) to walk through the troubleshoot guide for Registry Cache.

<!-- LINKS - External -->
[create-and-store-keyvault-credentials]: https://learn.microsoft.com/en-us/azure/data-factory/store-credentials-in-key-vault
[secure-authentication-secrets]: https://learn.microsoft.com/en-us/azure/static-web-apps/key-vault-secrets