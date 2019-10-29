---
author: baanders
ms.author: baanders
ms.service: iot-pnp
ms.topic: include
ms.date: 10/24/2019
---

## Clean up resources

If you plan to continue with later articles, you can keep the resources you used in this quickstart. Otherwise you can delete the resources you've created for this quickstart to avoid additional charges.

To delete the hub and registered device, complete the following steps using the Azure CLI:

```azurecli-interactive
az group delete --name <Your group name>
```

To delete just the device you registered with your IoT Hub, complete the following steps using the Azure CLI:

```azurecli-interactive
az iot hub device-identity delete --hub-name [YourIoTHubName] --device-id [YourDevice]
```