---
author: baanders
ms.author: baanders
ms.service: iot-pnp
ms.topic: include
ms.date: 10/24/2019
---

## Prepare an IoT hub

You also need an Azure IoT hub in your Azure subscription to complete this quickstart. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. If you don't have an IoT hub, follow [these instructions to create one](../articles/iot-hub/iot-hub-create-using-cli.md).

> [!IMPORTANT]
> During public preview, IoT Plug and Play features are only available on IoT hubs created in the **Central US**, **North Europe**, and **Japan East** regions.

Run the following command to add the Microsoft Azure IoT Extension for Azure CLI to your Cloud Shell instance:

```azurecli-interactive
az extension add --name azure-iot
```

Run the following command to create the device identity in your IoT hub. Replace the **YourIoTHubName** and **YourDeviceID** placeholders with your own _IoT Hub name_ and a _device ID_ of your choice.

```azurecli-interactive
az iot hub device-identity create --hub-name <YourIoTHubName> --device-id <YourDeviceID>
```

Run the following command to get the _device connection string_ for the device you just registered (note for use later):

```azurecli-interactive
az iot hub device-identity show-connection-string --hub-name <YourIoTHubName> --device-id <YourDevice> --output table
```

Run the following command to get the _IoT hub connection string_ for your hub (note for use later):

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```