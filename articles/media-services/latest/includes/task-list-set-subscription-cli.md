---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/17/2020
ms.author: inhenkel
ms.custom: CLI
---
<!-- List and set subscriptions -->

1. Get a list of your subscriptions with the [az account list](/cli/azure/account#az_account_list) command:

    ```
    az account list --output table
    ```

2. Use `az account set` with the subscription ID or name you want to switch to.

    ```
    az account set --subscription "My Demos"
    ```
