---
ms.topic: include
ms.date: 12/22/2022
author: cebundy
ms.author: v-bcatherine
manager: mcclean
ms.custom: devx-track-azurecli
---

## Azure CLI setup for local development

Follow these steps to set up the Azure CLI and your project environment.

1. Upgrade to the latest version of the Azure CLI.

    ```bash
    az upgrade
    ```

1. Install the Azure CLI extension for Web PubSub. 

    ```bash
    az extension add --name webpubsub
    ```

1. Sign in to the Azure CLI.  Following the prompts, enter your Azure credentials.

    ```bash
    az login
    ```

1. Create a resource group.

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
