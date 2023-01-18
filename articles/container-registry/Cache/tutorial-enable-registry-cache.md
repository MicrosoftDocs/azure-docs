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

        3. A username and password - This is the username and password for your source repository from key vault.

## Configure Registry Cache - Azure CLI

1. Description of the step.

    ```azurecli-interactive

    ```

2. Description of the step.

    ```azurecli-interactive

    ```

3. Description of the step.

    ```azurecli-interactive

    ```

4. Description of the step.

    ```azurecli-interactive

    ```
5. Description of the step.

    ```azurecli-interactive

    ```

## Configure Registry Cache - Azure portal

1. Navigate to your Azure Container Registry. . 
2. In the **Overview tab**, find **Registry Cache** (Preview).
3. If the **Status** is **Disabled**, Select **Update**.



:::image type="content" source="./media/container-registry-registry-cache/01-demo.png" alt-text="Screenshot for Registry Cache Demo.":::



4. Select the checkbox to **Enable Registry Cache**.
1. 
1. 
1. 
1. 
1. 
1. 
1. 

## Next steps

* Advance to the [next article](tutorial-troubleshoot-registry-cache.md) to walk through the troubleshoot guide for Registry Cache.