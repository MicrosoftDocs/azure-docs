---
title: Enable Registry Cache
description: Learn how to enable Registry Cache in your Azure Container Registry using Azure portal.
ms.topic: tutorial
ms.date: 04/19/2022
ms.author: tejaswikolli
---

# Enable Registry Cache

This article is part two of a three-part tutorial series. [Part one](tutorial-registry-cache.md) provides an overview of Caching for ACR, its features, benefits, and preview limitations. This article walks you through the steps of enabling Caching for ACR by using the Azure portal.

## Prerequisites

* Sign in to the [Azure portal](https://ms.portal.azure.com/). 

## Terminology 

- Cache Rule
    - A cache rule is a set of rules. You can create to pull artifacts from a public Registry into your cache. A cache rule contains four parts
        
        1. A Rule Name - The name of your cache rule. For example, `Hello-World-Cache`.

        2. A Source - The name of the Source Registry. We support **Docker Hub** and **Microsoft Artifact Registry** only. 

        3. A Repository Path - The source path of the repository to find and retrieve artifacts you want to cache. For example, `docker.io/library/hello-world`.

        4. ACR Repository Path - The name of the new repository path to place and store artifacts. For example, `hello-world`. The Repository can't already exist inside ACR. 

- Credential Set
    - A credential set is a username and password for the source registry. A credential set is needed if a cache is pulling from a private repository. A credential set contains four parts

        1. A Credential Set Name - The name of your credential set.

        2. A Source registry Login Server - The login server of your source registry. Only `docker.io` private repositories are supported. 

        3. A Source Authentication - The source to store and grant permissions. We support **Secret URI** or **Key Vault** only.
        
        4. Username and Password secret's: The secrets containing the username and password. 

## Configure Registry Cache - Azure portal

Follow the steps to create cache rule in the [Azure portal](https://portal.azure.com). 

1. Navigate to your Azure Container Registry. 

2. In the side **Menu**, under the **Services**, select **Cache**(Preview).

        :::image type="content" source="./media/container-registry-registry-cache/cache-preview-01.png" alt-text="Screenshot for Registry cache preview blade.":::

3. Select on **Create Rule**.

        :::image type="content" source="./media/container-registry-registry-cache/cache-blade-02.png" alt-text="Screenshot for Create Rule.":::

4. A window for **New cache rule** pops up.

        :::image type="content" source="./media/container-registry-registry-cache/new-cache-rule-03.png" alt-text="Screenshot for new Cache Rule.":::

5. Specify the **Rule name**.

6. Select **Source** Registry from the dropdown menu options. Currently ACR supports **Docker Hub** and **Microsoft Artifact Registry**. 

7. Specify the **Repository Path** to cache the artifacts.

8. For adding authentication to the repository, check the **Authentication** box. If authentication isn't required, skip to step 11.

9. Choose **Create new credentials** to create a new set of credentials to store the username and password for your source registry. Learn how to [create new credentials](###Create-new-credentials)

10. If you have the credentials ready, **Select credentials** from the drop-down menu.

11. Under the **Destination**, specify the name of the **New ACR repository path** to store cached artifacts.

        :::image type="content" source="./media/container-registry-registry-cache/save-cache-rule-04.png.png" alt-text="Screenshot to save Cache Rule.":::

12. Select on **Save** 

13. Pull the image from your cache using the Docker command `docker pull myregistry.azurecr.io/hello-world`

### Create new credentials

1. Navigate to **Credentials** > **Add credential set** > **Create new credentials**.

        :::image type="content" source="./media/container-registry-registry-cache/add-credential-set-05.png" alt-text="Screenshot for adding credential set.":::


        :::image type="content" source="./media/container-registry-registry-cache/create-credential-set-06.png" alt-text="Screenshot for create new credential set.":::


1. Specify **Name** for the new credentials for your source registry.

1. Select a **Source Authentication**. Caching for ACR currently supports **Select from Key Vault** and **Enter secret URI's**.

1. For the  **Select from Key Vault** option, Learn more about [creating credentials using key vault][create-and-store-keyvault-credentials]. 

1. For the **Enter secret URI's** option, type in the Secret URI for the Username and Password. 

1. Select on **Create**

## Next steps

* Advance to the [next article](tutorial-troubleshoot-registry-cache.md) to walk through the troubleshoot guide for Registry Cache.

<!-- LINKS - External -->
[create-and-store-keyvault-credentials]:https://learn.microsoft.com/azure/key-vault/secrets/quick-create-portal