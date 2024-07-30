---
author: ggailey777
ms.service: azure-functions
ms.custom:
  - build-2024
ms.topic: include
ms.date: 05/012/2024
ms.author: glenga
---
1. If you haven't done so already, sign in to Azure:

    ```azurecli
    az login
    ```

    The [`az login`](/cli/azure/reference-index#az-login) command signs you into your Azure account.

2. Use the `az functionapp list-flexconsumption-locations` command to review the list of regions that currently support Flex Consumption. 

    ```azurecli-interactive
    az functionapp list-flexconsumption-locations --output table
    ```
