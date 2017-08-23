---
title: Simulate a device with Azure IoT Edge (Windows) | Microsoft Docs
description: How to use Azure IoT Edge on Windows to create a simulated device that sends telemetry through an Azure IoT Edge gateway to an IoT hub.
services: iot-hub
documentationcenter: ''
author: chipalost
manager: timlt
editor: ''

ms.assetid: 6a2aeda0-696a-4732-90e1-595d2e2fadc6
ms.service: iot-hub
ms.devlang: cpp
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/09/2017
ms.author: andbuc

---

# Use Azure IoT Edge to send device-to-cloud messages with a simulated device (Windows)

[!INCLUDE [iot-hub-iot-edge-simulated-selector](../../includes/iot-hub-iot-edge-simulated-selector.md)]

[!INCLUDE [iot-hub-iot-edge-install-build-windows](../../includes/iot-hub-iot-edge-install-build-windows.md)]

## How to run the sample

The **build.cmd** script generates its output in the **build** folder in your local copy of the **iot-edge** repository. This output includes the four IoT Edge modules used in this sample.

The build script places the:

* **logger.dll** in the **build\\modules\\logger\\Debug** folder.
* **iothub.dll** in the **build\\modules\\iothub\\Debug** folder.
* **identity\_map.dll** in the **build\\modules\\identitymap\\Debug** folder.
* **simulated\_device.dll** in the **build\\modules\\simulated\_device\\Debug** folder.

Use these paths for the **module path** values as shown in the following JSON settings file:

The simulated\_device\_cloud\_upload\_sample process takes the path to a JSON configuration file as a command-line argument. The following example JSON file is provided in the SDK repository at **samples\\simulated\_device\_cloud\_upload\_sample\\src\\simulated\_device\_cloud\_upload\_sample\_win.json**. This configuration file works as is unless you modify the build script to place the IoT Edge modules or sample executables in non-default locations.

> [!NOTE]
> The module paths are relative to the directory where the simulated\_device\_cloud\_upload\_sample.exe is located. The sample JSON configuration file defaults to writing to 'deviceCloudUploadGatewaylog.log' in your current working directory.

In a text editor, open the file **samples\\simulated\_device\_cloud\_upload\_sample\\src\\simulated\_device\_cloud\_upload\_win.json** in your local copy of the **iot-edge** repository. This file configures the IoT Edge modules in the sample gateway:

* The **IoTHub** module connects to your IoT hub. You configure it to send data to your IoT hub. Specifically, set the **IoTHubName** value to the name of your IoT hub and set the **IoTHubSuffix** value to **azure-devices.net**. Set the **Transport** value to one of: **HTTP**, **AMQP**, or **MQTT**. Currently, only **HTTP** shares one TCP connection for all device messages. If you set the value to **AMQP**, or **MQTT**, the gateway maintains a separate TCP connection to IoT Hub for each device.
* The **mapping** module maps the MAC addresses of your simulated devices to your IoT Hub device ids. Make sure that **deviceId** values match the ids of the two devices you added to your IoT hub, and that the **deviceKey** values contain the keys of your two devices.
* The **BLE1** and **BLE2** modules are the simulated devices. Note how the module MAC addresses match the addresses in the **mapping** module.
* The **Logger** module logs your gateway activity to a file.
* The **module path** values shown in the following example are relative to the directory where the simulated\_device\_cloud\_upload\_sample.exe is located.
* The **links** array at the bottom of the JSON file connects the **BLE1** and **BLE2** modules to the **mapping** module, and the **mapping** module to the **IoTHub** module. It also ensures that all messages are logged by the **Logger** module.

```json
{
    "modules" :
    [
      {
        "name": "IotHub",
        "loader": {
          "name": "native",
          "entrypoint": {
            "module.path": "..\\..\\..\\modules\\iothub\\Debug\\iothub.dll"
          }
          },
          "args": {
            "IoTHubName": "<<insert here IoTHubName>>",
            "IoTHubSuffix": "<<insert here IoTHubSuffix>>",
            "Transport": "HTTP"
          }
        },
      {
        "name": "mapping",
        "loader": {
          "name": "native",
          "entrypoint": {
            "module.path": "..\\..\\..\\modules\\identitymap\\Debug\\identity_map.dll"
          }
          },
          "args": [
            {
              "macAddress": "01:01:01:01:01:01",
              "deviceId": "<<insert here deviceId>>",
              "deviceKey": "<<insert here deviceKey>>"
            },
            {
              "macAddress": "02:02:02:02:02:02",
              "deviceId": "<<insert here deviceId>>",
              "deviceKey": "<<insert here deviceKey>>"
            }
          ]
        },
      {
        "name": "BLE1",
        "loader": {
          "name": "native",
          "entrypoint": {
            "module.path": "..\\..\\..\\modules\\simulated_device\\Debug\\simulated_device.dll"
          }
          },
          "args": {
            "macAddress": "01:01:01:01:01:01"
          }
        },
      {
        "name": "BLE2",
        "loader": {
          "name": "native",
          "entrypoint": {
            "module.path": "..\\..\\..\\modules\\simulated_device\\Debug\\simulated_device.dll"
          }
          },
          "args": {
            "macAddress": "02:02:02:02:02:02"
          }
        },
      {
        "name": "Logger",
        "loader": {
          "name": "native",
          "entrypoint": {
            "module.path": "..\\..\\..\\modules\\logger\\Debug\\logger.dll"
          }
        },
        "args": {
          "filename": "deviceCloudUploadGatewaylog.log"
        }
      }
    ],
    "links" : [
        { "source" : "*", "sink" : "Logger" },
        { "source" : "BLE1", "sink" : "mapping" },
        { "source" : "BLE2", "sink" : "mapping" },
        { "source" : "mapping", "sink" : "IotHub" }
    ]
}
```

Save the changes you made to the configuration file.

To run the sample:

1. At a command prompt, navigate to the **build** folder in your local copy of the **iot-edge** repository.
2. Run the following command:
   
    ```cmd
    samples\simulated_device_cloud_upload\Debug\simulated_device_cloud_upload_sample.exe ..\samples\simulated_device_cloud_upload\src\simulated_device_cloud_upload_win.json
    ```
3. You can use the [device explorer][lnk-device-explorer] or [iothub-explorer][lnk-iothub-explorer] tool to monitor the messages that IoT hub receives from the gateway. For example, using iothub-explorer you can monitor device-to-cloud messages using the following command:

    ```cmd
    iothub-explorer monitor-events --login "HostName={Your iot hub name}.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey={Your IoT Hub key}"
    ```

## Next steps

To gain a more advanced understanding of IoT Edge and experiment with some code examples, visit the following developer tutorials and resources:

* [Send device-to-cloud messages from a physical device with IoT Edge][lnk-physical-device]
* [Azure IoT Edge][lnk-iot-edge]

To further explore the capabilities of IoT Hub, see:

* [IoT Hub developer guide][lnk-devguide]
* [Secure your IoT solution from the ground up][lnk-securing]

<!-- Links -->
[lnk-iot-edge]: https://github.com/Azure/iot-edge/
[lnk-physical-device]: iot-hub-iot-edge-physical-device.md
[lnk-devguide]: iot-hub-devguide.md
[lnk-securing]: iot-hub-security-ground-up.md
[lnk-device-explorer]: https://github.com/Azure/azure-iot-sdk-csharp/tree/master/tools/DeviceExplorer
[lnk-iothub-explorer]: https://github.com/Azure/iothub-explorer/blob/master/readme.md