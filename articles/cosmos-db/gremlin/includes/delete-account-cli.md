---
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.topic: include
ms.date: 09/28/2023
---

1. Create a shell variable for *resourceGroupName* if it doesn't already exist.

    ```azurecli-interactive
    # Variable for resource group name
    resourceGroupName="msdocs-cosmos-gremlin-quickstart"
    ```

1. Use `az group delete` to delete the resource group.

    ```azurecli-interactive
    az group delete \
        --name $resourceGroupName
    ```
