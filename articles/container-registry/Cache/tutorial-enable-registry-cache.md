---
title: Enable Registry Cache
description: Learn how to enable Registry Cache in your Azure Container Registry using Azure Cli, and Azure portal.
ms.topic: tutorial
ms.date: 04/19/2022
ms.author: tejaswikolli
---

# Enable Registry Cache

This article is part two in a three-part tutorial series. [Part one](tutorial-registry-cache.md) provides an overview of Registry Cache, their features, benefit's, and preview limitations. This article walks you through the steps of enabling a Registry Cache by using the Azure CLI, and Azure portal.

## Prerequisites

* [Install the Azure CLI][azure-cli] or prepare to use [Azure Cloud Shell](../cloud-shell/quickstart.md).
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

1. Navigate to your Azure Container Registry. 

<br>

2. In the **Side Menu**, find **Cache** (Preview).

<br>

3. Click on **Create Rule**

:::image type="content" source="./media/container-registry-registry-cache/01-demo.png" alt-text="Screenshot for Registry Cache Demo.":::

<br>

4. Name your **Cache rule**

:::image type="content" source="./media/container-registry-registry-cache/01-demo.png" alt-text="Screenshot for Registry Cache Demo.":::

<br>

5. Select a Source Registry from the dropdown menu to cache artifacts from. Caching for ACR current supports Docker Hub and Microsoft Artifact Registry 

:::image type="content" source="./media/container-registry-registry-cache/01-demo.png" alt-text="Screenshot for Registry Cache Demo.":::

<br>

6. Specfiy the path of the artifacts you'd like cached

:::image type="content" source="./media/container-registry-registry-cache/01-demo.png" alt-text="Screenshot for Registry Cache Demo.":::

<br>

7. If the repository being cached needs authenication check the Authentication box. If not, skip to step 12


8. Click on **create new credentials** 

:::image type="content" source="./media/container-registry-registry-cache/01-demo.png" alt-text="Screenshot for Registry Cache Demo.":::

<br>

9. Choose a **Source Authentication**. Caching for ACR currently supports Key Vault Credentials and Secert URIs 

:::image type="content" source="./media/container-registry-registry-cache/01-demo.png" alt-text="Screenshot for Registry Cache Demo.":::

<br>

10. Click on **Create**

:::image type="content" source="./media/container-registry-registry-cache/01-demo.png" alt-text="Screenshot for Registry Cache Demo.":::

<br>

12. Name the Repository you will be storing cached artifacts 

:::image type="content" source="./media/container-registry-registry-cache/01-demo.png" alt-text="Screenshot for Registry Cache Demo.":::

<br>

13. Pull the image from your cache using the Azure CLI command <br> `docker pull MyRegistry.azurecr.io/hello-world`

## Next steps

* Advance to the [next article](tutorial-troubleshoot-registry-cache.md) to walk through the troubleshoot guide for Registry Cache.