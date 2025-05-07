---
title: include file
description: include file
author: SoniaLopezBravo
ms.author: sonialopez
ms.service: azure-iot-hub
ms.topic: include
ms.date: 03/28/2025
---

A device must be registered with your IoT hub before it can connect. In this section, you use Azure CLI to create a device identity.

If you already have a device registered in your IoT hub, you can skip this section.

To create a device identity:

1. Run the [az iot hub device-identity create](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-create) command in your CLI shell. This command creates the device identity.

    *YourIoTHubName*. Replace this placeholder and the surrounding braces in the following command, using the name you chose for your IoT hub. An IoT hub name must be globally unique in Azure. 

    *myDevice*. You can use this name for the device ID throughout this article, or provide a different device name.

    ```azurecli-interactive
    az iot hub device-identity create --device-id myDevice --hub-name {YourIoTHubName}
    ```

1. Run the [az iot hub device-identity connection-string show](/cli/azure/iot/hub/device-identity/connection-string#az-iot-hub-device-identity-connection-string-show) command.

    ```azurecli-interactive
    az iot hub device-identity connection-string show --device-id myDevice --hub-name {YourIoTHubName}
    ```

    The connection string output is in the following format:

    ```Output
    HostName=<your IoT Hub name>.azure-devices.net;DeviceId=<your device id>;SharedAccessKey=<some value>
    ```

1. Save the connection string in a secure location.

> [!NOTE]
> Keep your CLI app open. You use it in later steps.
