---
title: include file
description: include file
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.topic: include
ms.date: 01/31/2023
---

A device must be registered with your IoT hub before it can connect. In this section, you use Azure CLI to create a device identity.

If you already have a device registered in your IoT hub, you can skip this section.

To create a device identity:

1. Run the [az iot hub device-identity create](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-create) command in your CLI shell. This command creates the device identity.

    *your_iot_hub_name*. Replace this placeholder below with the name you chose for your IoT hub.

    *myDevice*. You can use this name for the device ID throughout this article, or provide a different device name.

    ```azurecli-interactive
    az iot hub device-identity create --device-id myDevice --hub-name {your_iot_hub_name}
    ```

1. Run the [az iot hub device-identity connection-string show](/cli/azure/iot/hub/device-identity/connection-string#az-iot-hub-device-identity-connection-string-show) command.

    ```azurecli-interactive
    az iot hub device-identity connection-string show --device-id myDevice --hub-name {your_iot_hub_name}
    ```

    The connection string output is in the following format:

    ```Output
    HostName=<your IoT Hub name>.azure-devices.net;DeviceId=<your device id>;SharedAccessKey=<some value>
    ```

1. Save the connection string in a secure location.

> [!NOTE]
> Keep your CLI app open. You'll use it in later steps.
