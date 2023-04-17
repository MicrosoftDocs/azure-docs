---
author: dominicbetts
ms.author: dominicbetts
ms.service: iot-develop
ms.topic: include
ms.date: 11/17/2022
---

If you plan to continue with more device developer articles, you can keep and reuse the resources you used in this article. Otherwise, you can delete the resources you created in this article to avoid more charges.

You can delete both the hub and registered device at once by deleting the entire resource group with the following Azure CLI command. Don't use this command if these resources are sharing a resource group with other resources you want to keep.

```azurecli-interactive
az group delete --name <YourResourceGroupName>
```

To delete just the IoT hub, run the following command using Azure CLI:

```azurecli-interactive
az iot hub delete --name <YourIoTHubName>
```

To delete just the device identity you registered with your IoT hub, run the following command using Azure CLI:

```azurecli-interactive
az iot hub device-identity delete --hub-name <YourIoTHubName> --device-id <YourDeviceID>
```

You may also want to remove the cloned sample files from your development machine.
