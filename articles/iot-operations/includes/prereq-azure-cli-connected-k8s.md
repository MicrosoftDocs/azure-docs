---
author: dominicbetts
ms.author: dobett
ms.date: 05/14/2026
ms.topic: include
ms.service: azure-iot-operations
---

- The Azure CLI installed on your development machine. Check [Available Azure CLI extensions](/cli/azure/azure-cli-extensions-list) for the minimum required version for the **connectedk8s** extension. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli).
- The **connectedk8s** extension for the Azure CLI. Use the following command to add the extension or update it to the latest version:

  ```azurecli
  az extension add --upgrade --name connectedk8s
  ```
