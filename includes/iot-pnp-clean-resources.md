---
author: baanders
ms.author: baanders
ms.service: iot-pnp
ms.topic: include
ms.date: 11/15/2019
---

## Clean up resources

If you plan to continue with additional IoT Plug and Play articles, you can keep and reuse the resources you used in this quickstart. Otherwise, you can delete the resources you created in this quickstart to avoid additional charges.

You can delete both the hub and registered device at once by deleting the entire resource group with the following command for Azure CLI. (Don't use this, however, if these resources are sharing a resource group with other resources you have for different purposes.)

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