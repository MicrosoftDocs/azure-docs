---
ms.topic: include
ms.date: 12/22/2022
author: cebundy
ms.author: v-bcatherine
manager: mcclean
ms.custom: devx-track-azurecli
---

## Azure CLI setup for local development

Follow these steps to set up Azure CLI and your project environment.

1. Open a command shell.

1. Upgrade to the latest version of the Azure CLI.

    ```azurecli
    az upgrade
    ```

1. Install the Azure CLI extension for Web PubSub. 

    ```azurecli
    az extension add --name webpubsub
    ```

1. Sign in to Azure CLI.  Following the prompts, enter your Azure credentials.

    ```azurecli
    az login
    ```

