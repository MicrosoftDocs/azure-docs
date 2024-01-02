---
 title: Include file to clean up IoT resources. 
 description: include file
 author: timlt
 ms.service: iot-develop
 ms.topic: include
 ms.date: 07/27/2023
 ms.author: timlt
 ms.custom: include file
---

## Clean up resources

If you no longer need the Azure resources created in this quickstart, you can use the Azure CLI to delete the resource group and all of its resources.

> [!IMPORTANT] 
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources.

To delete a resource group by name:

1. Run the [az group delete](/cli/azure/group#az-group-delete) command. This command removes the resource group, the IoT Hub, and the device registration you created.

    ```azurecli-interactive
    az group delete --name MyResourceGroup
    ```

1. Run the [az group list](/cli/azure/group#az-group-list) command to confirm the resource group is deleted.  

    ```azurecli-interactive
    az group list
    ```
