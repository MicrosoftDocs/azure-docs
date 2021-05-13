---
author: baanders
description: include file for cleaning up an Azure Digital Twins instance
ms.service: digital-twins
ms.topic: include
ms.date: 2/4/2021
ms.author: baanders
---

* **If you do not need any of the resources you created in this tutorial**, you can delete the Azure Digital Twins instance and all other resources from this article with the [az group delete](/cli/azure/group#az_group_delete) command. This deletes all Azure resources in a resource group, as well as the resource group itself.
    
    > [!IMPORTANT]
    > Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you don't accidentally delete the wrong resource group or resources.
    
    Open [Azure Cloud Shell](https://shell.azure.com), and run the following command to delete the resource group and everything it contains.
    
    ```azurecli-interactive
    az group delete --name <your-resource-group>
    ```