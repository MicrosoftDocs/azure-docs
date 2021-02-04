---
author: baanders
description: include file for cleaning up an Azure Digital Twins instance
ms.service: digital-twins
ms.topic: include
ms.date: 2/4/2021
ms.author: baanders
---

1. Using [Azure Cloud Shell](https://shell.azure.com), you can delete all Azure resources in a resource group with the [az group delete](/cli/azure/group?preserve-view=true&view=azure-cli-latest#az-group-delete) command. This command removes the resource group and all of the resources inside it.
    
    > [!IMPORTANT]
    > Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you don't accidentally delete the wrong resource group or resources.
    
    Open Azure Cloud Shell, and run the following command to delete the resource group and everything it contains.
    
    ```azurecli-interactive
    az group delete --name <your-resource-group>
    ```

2. Then, delete the project folder from your local machine.
