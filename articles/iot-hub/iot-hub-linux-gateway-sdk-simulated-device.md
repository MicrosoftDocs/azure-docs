<properties
	pageTitle="Simulate a device with the Gateway SDK | Microsoft Azure"
	description="Azure IoT Hub Gateway SDK walkthrough using Linux to illustrate sending telemetry from a simulated device using the Azure IoT Hub Gateway SDK."
	services="iot-hub"
	documentationCenter=""
	authors="chipalost"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="cpp"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="04/20/2016"
     ms.author="cstreet"/>


# IoT Gateway SDK (beta) – send device-to-cloud messages with a simulated device using Linux

[AZURE.INCLUDE [iot-hub-gateway-sdk-simulated-selector](../../includes/iot-hub-gateway-sdk-simulated-selector.md)]

## Build and run the sample

Before you get started, you must:

- [Set up your development environment][lnk-setupdevbox] for working with the SDK on Linux.
- [Create an IoT hub][lnk-create-hub] in your Azure subscription, you will need the name of your hub to complete this walkthrough. If you don't already have an Azure subscription, you can get a [free account][lnk-free-trial].
- Add two devices to your IoT hub and make a note of their ids and device keys. You can use the [Device Explorer or iothub-explorer][lnk-explorer-tools] tool to add your devices to the IoT hub you created in the previous step and retrieve their keys.

To build the sample:

1. Open a shell.
2. Navigate to the root folder in your local copy of the **azure-iot-gateway-sdk** repository.
3. Run the **tools/build.sh** script. This script uses the **cmake** utility to create a folder called **build** in the root folder of your local copy of the **azure-iot-gateway-sdk** repository and generate a makefile. The script then builds the solution and runs the tests.

> [AZURE.NOTE]  Every time you run the **build.sh** script, it deletes and then recreates the **build** folder in the root folder of your local copy of the **azure-iot-gateway-sdk** repository.

To run the sample:

In a text editor, open the file **samples/simulated_device_cloud_upload/src/simulated_device_cloud_upload_lin.json** in your local copy of the **azure-iot-gateway-sdk** repository. This file configures the modules in the sample gateway:

- The **IoTHub** module connects to your IoT hub. You must configure it to send data to your IoT hub. Specifically, set the **IoTHubName** value to the name of your IoT hub and set the value of **IoTHubSuffix** to **azure-devices.net**.
- The **mapping** module maps the MAC addresses of your simulated devices to your IoT Hub device ids. Make sure that **deviceId** values match the ids of the two devices you added to your IoT hub, and that the **deviceKey** values contain the keys of your two devices.
- The **BLE1** and **BLE2** modules are the simulated devices. Note how their MAC addresses match those in the **mapping** module.
- The **Logger** module logs your gateway activity to a file.
- The **module path** values shown below assume that you will run the sample from the root of your local copy of the **azure-iot-gateway-sdk** repository.

```
{
    "modules" :
    [ 
        {
            "module name" : "IoTHub",
            "module path" : "./build/modules/iothubhttp/libiothubhttp_hl.so",
            "args" : 
            {
                "IoTHubName" : "{Your IoT hub name}",
                "IoTHubSuffix" : "azure-devices.net"
            }
        },
        {
            "module name" : "mapping",
            "module path" : "./build/modules/identitymap/libidentitymap_hl.so",
            "args" : 
            [
                {
                    "macAddress" : "01-01-01-01-01-01",
                    "deviceId"   : "GW-ble1-demo",
                    "deviceKey"  : "{Device key}"
                },
                {
                    "macAddress" : "02-02-02-02-02-02",
                    "deviceId"   : "GW-ble2-demo",
                    "deviceKey"  : "{Device key}"
                }
            ]
        },
        {
            "module name":"BLE1",
            "module path" : "./build/modules/simulated_device/libsimulated_device_hl.so",
            "args":
            {
                "macAddress" : "01-01-01-01-01-01"
            }
        },
        {
            "module name":"BLE2",
            "module path" : "./build/modules/simulated_device/libsimulated_device_hl.so",
            "args":
            {
                "macAddress" : "02-02-02-02-02-02"
            }
        },
        {
            "module name":"Logger",
            "module path" : "./build/modules/logger/liblogger_hl.so",
            "args":
            {
                "filename":"./deviceCloudUploadGatewaylog.log"
            }
        }
    ]
}

```

Save any changes you made to the configuration file.

To run the sample:

1. In your shell, navigate to the root folder in your local copy of the **azure-iot-gateway-sdk** repository.
2. Run the following command:

    ```
    ./build/samples/simulated_device_cloud_upload/simulated_device_cloud_upload_sample ./samples/simulated_device_cloud_upload/src/simulated_device_cloud_upload_lin.json
    ```

3. You can use the [Device Explorer or iothub-explorer][lnk-explorer-tools] tool to monitor the messages that IoT hub receives from the gateway.

## Next steps

If you want to gain a more advanced understanding of the Gateway SDK and experiment with some code examples, visit the following developer tutorials and resources:

- [Send device-to-cloud messages from a real device with the Gateway SDK][lnk-physical-device]
- [Manage a gateway device][lnk-manage-devices]
- [Azure IoT Gateway SDK][lnk-gateway-sdk]

To further explore the capabilities of IoT Hub, see:

- [Designing your solution][lnk-design]
- [Developer guide][lnk-devguide]
- [Exploring device management using the sample UI][lnk-dmui]
- [Using the Azure Portal to manage IoT Hub][lnk-portal]
- [Secure your IoT solution from the ground up][lnk-securing]

<!-- Links -->
[lnk-setupdevbox]: https://github.com/Azure/azure-iot-gateway-sdk/blob/master/doc/devbox_setup.md
[lnk-create-hub]: iot-hub-manage-through-portal.md
[lnk-free-trial]: https://azure.microsoft.com/pricing/free-trial/
[lnk-explorer-tools]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/manage_iot_hub.md
[lnk-gateway-sdk]: https://github.com/Azure/azure-iot-gateway-sdk/

[lnk-physical-device]: iot-hub-gateway-sdk-physical-device.md
[lnk-manage-devices]: iot-hub-gateway-sdk-device-management.md

[lnk-design]: iot-hub-guidance.md
[lnk-devguide]: iot-hub-devguide.md
[lnk-dmui]: iot-hub-device-management-ui-sample.md
[lnk-portal]: iot-hub-manage-through-portal.md
[lnk-securing]: iot-hub-security-ground-up.md