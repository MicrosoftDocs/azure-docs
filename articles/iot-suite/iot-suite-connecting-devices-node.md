---
title: Connect a device using Node.js | Microsoft Docs
description: Describes how to connect a device to the Azure IoT Suite preconfigured remote monitoring solution using an application written in Node.js.
services: ''
suite: iot-suite
documentationcenter: na
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: fc50a33f-9fb9-42d7-b1b8-eb5cff19335e
ms.service: iot-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/04/2017
ms.author: dobett

---
# Connect your device to the remote monitoring preconfigured solution (Node.js)
[!INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

## Build and run the node.js sample solution
1. To clone the *Microsoft Azure IoT SDK for Node.js* GitHub repository and install it in your desktop environment, follow the [Prepare your development environment][lnk-github-prepare] instructions.
2. From your local copy of the [azure-iot-sdk-node][lnk-github-repo] repository, copy the following two files from the device/samples folder to a folder on your device:
   
   * package.json
   * remote_monitoring.js
3. Open the remote_monitoring.js file and look for the following variable:
   
    ```
    var connectionString = "[IoT Hub device connection string]";
    ```
4. Replace **[IoT Hub device connection string]** with your device connection string. You can find the values for your IoT Hub hostname, device id, and device key in the remote monitoring solution dashboard. A device connection string has the following format:
   
    ```
    HostName={your IoT Hub hostname};DeviceId={your device id};SharedAccessKey={your device key}
    ```
   
    If your IoT Hub hostname is **contoso** and your device id is **mydevice**, your connection string looks like:
   
    ```
    var connectionString = "HostName=contoso.azure-devices.net;DeviceId=mydevice;SharedAccessKey=2s ... =="
    ```
5. Save the file. Run the following commands at a command prompt in the folder that contains these files to install the necessary packages and then run the sample application:
   
    ```
    npm install --save
    node remote_monitoring.js
    ```

[!INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]

[lnk-github-repo]: https://github.com/azure/azure-iot-sdk-node
[lnk-github-prepare]: https://github.com/Azure/azure-iot-sdk-node/blob/master/doc/node-devbox-setup.md
