<properties
   pageTitle="Connect a device using Node.js | Microsoft Azure"
   description="Describes how to connect a device to the Azure IoT Suite preconfigured remote monitoring solution using an application written in Node.js."
   services=""
   documentationCenter="na"
   authors="dominicbetts"
   manager="timlt"
   editor=""/>

<tags
   ms.service="na"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="11/10/2015"
   ms.author="dobett"/>


# Connect your device to the IoT Suite remote monitoring preconfigured solution

[AZURE.INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

## Sending device data to the remote monitoring solution using node.js

1. To clone the *Microsoft Azure IoT SDKs* GitHub repository and install the *Microsoft Azure IoT device SDK for Node.js* in your desktop environment, follow the [Prepare your development environment][lnk-github-prepare] instructions.

2. In your local copy of the [azure-iot-sdks][lnk-github-repo] repository, locate the following files:

  - packages.json (located in the node/device/samples folder) 
  - remote_monitoring.js (located in the node/device/samples folder)

  Copy these two files to a folder on your device and put them in the same folder.

2. Open the remote_monitoring.js file and look for the following variable:

   ```
   var connectionString = "[IoT Hub device connection string]";
   ```

3. Replace **[IoT Hub device connection string]** with your device connection string. A device connection string has the following format:

  ```
  HostName={your IoT Hub hostname};DeviceId={your device id};SharedAccessKey={your device key}
  ```
  
  You can find the values for your IoT Hub hostname, device id, and device key in the the remote monitoring solution dashboard. For example:
  
  ```
  var connectionString = "HostName=contoso.azure-devices.net;DeviceId=mydevice;SharedAccessKey=2s ... =="
  ```

5. Save the file. Run the following command in the folder that contains these files:

```
npm install
node remote_monitoring.js
```

[AZURE.INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]

[lnk-github-repo]: https://github.com/azure/azure-iot-sdks
[lnk-node-installers]: https://nodejs.org/download/
[lnk-github-prepare]: https://github.com/Azure/azure-iot-sdks/blob/master/node/device/doc/devbox_setup.md