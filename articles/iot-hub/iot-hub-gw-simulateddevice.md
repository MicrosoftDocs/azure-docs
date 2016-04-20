<properties
	pageTitle="Simulate a device with the Gateway SDK | Microsoft Azure"
	description="Azure IoT Hub Gateway SDK walkthrough to illustrate sending telemetry from a simulated device using the Azure IoT Hub Gateway SDK."
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


# Azure IoT Gateway SDK – send device-to-cloud messages with a simulated device

This walkthrough of the [Simulated Device Cloud Upload sample] shows how to use the [Microsoft Azure IoT Gateway SDK for C][lnk-sdk] to send device-to-cloud telemetry to IoT Hub from simulated devices.

This walkthrough covers:

1. **Architecture**: important architectural information about the Simulated Device Cloud Upload sample.

2. **Build and run**: the steps required to build and run the sample.

## Architecture

The Simulated Device Cloud Upload sample shows how to use the SDK to create a gateway which sends telemetry from simulated devices to an IoT hub. The simulated devices cannot connect directly to IoT Hub because:

- The devices do not use a communications protocol understood by IoT Hub.
- The devices are not smart enough to remember the identity assigned to them by IoT Hub.

The gateway solves these problems for the simulated devices in the following ways:

- The gateway understands the protocol used by the simulated devices, receives device-to-cloud telemetry from the devices, and forwards those messages to IoT Hub using a protocol understood by the hub.
- The gateway stores IoT Hub identities fon behalf of the simulated devices and acts as a proxy when the simulated devices send messages to IoT Hub.

The following diagram shows the main components of the sample, including the gateway modules:

![1]


> [AZURE.NOTE] The modules do not pass messages directly to each other. The modules publish messages to an internal message bus that delivers the messages to the other modules using a subscription mechanism as shown in the diagram below. For more information see [Get started with the Gateway SDK][lnk-gw-getstarted].

### Protocol ingestion module

This module is the starting point for getting data from devices, through the gateway, and into the cloud. In the sample, the module performs four tasks:

1.  It creates simulated temperature data.
    
    Note: if you were using real devices, the module would read data from those physical devices.

2.  It places the simulated temperature data into the contents of a message.

3.  It adds a property with a fake MAC address to the message that contains the simulated temperatue data.

4.  It makes the message available to the next module in the chain.

> [AZURE.NOTE] The module called **Protocol X ingestion** in the diagram above is called **Simulated device** in the source code.

### MAC &lt;-&gt; IoT Hub ID module

This module scans for messages that include a property that contains the MAC address, added by the protocol ingestion module, of the simulated device. If the module finds such a property, it adds another property with an IoT Hub device key to the message and then makes the message available to the next module in the chain. This is how the sample associates IoT Hub device identities with simulated devices. The developer sets up the mapping between MAC addresses and IoT Hub identities manually as part of the module configuration. 

> [AZURE.NOTE]  This sample uses a MAC address as a unique device identifier and correlates it with an IoT Hub device identity. However, you can write your own module that uses a different unique identifier. For example, you may have devices with unique serial numbers or telemetry data that has a unique device name embedded in it that you could use to determine the IoT Hub device identity.

### IoT Hub communication module

This module takes messages with an IoT Hub device identity assigned by the previous module and sends the message content to IoT Hub using HTTPS. HTTPS is one of the three protocols understood by IoT Hub.

Instead of opening a connection to IoT Hub for each simulated device, this module opens a single HTTP connection from the gateway to the IoT hub and multiplexes connections from all the simulated devices over that connection. This enables a single gateway to connect many more devices, simulated or otherwise, than would be possible if it opened a unique connection for every device.

![][2]

## Build and run the sample

Before you get started, you must:

- [Set up your C development environment][lnk-setupdevbox] for working with the SDK on either Windows or Linux.
- [Create an IoT hub][lnk-create-hub] in your Azure subscription, you will need the name of your hub to complete this walkthrough. If you don't already have an Azure subscription, you can get a [free account][lnk-free-trial].
- Add two devices to your IoT hub and make a note of their ids and device keys. You can use the [Device Explorer or iothub-explorer][lnk-explorer-tools] tool to add your devices to the IoT hub you created in the previous step and retrieve their keys.

### Windows instructions

To build the sample:

1. Open a **Developer Command Prompt for VS2015** command prompt.
2. Navigate to the **azure-iot-gateway-sdk\build\** folder in your local copy of the repository.
3. Run the **build.cmd** script.

To run the sample:

In a text editor, open the file **azure-iot-gateway-sdk\samples\simple_device_cloud_upload\src\simple_device_cloud_upload_win.json** in your local copy of the repository. This file configures the modules in the sample gateway:

- The **IoTHub** module which connects to your IoT hub. Make sure that the **IoTHubName** value is set to the name of your IoT hub. The value of **IoTHubSuffix** should be **azure-devices.net**.
- The **mapping** module which maps the MAC addresses of your simulated devices to you IoT Hub device ids. Make sure that **deviceId** values match the ids of the two devices you added to your IoT hub, and that the **deviceKey** values contain the keys of your two devices.
- The **BLE1** and **BLE2** modules are the simulated devices. Note how their MAC addresses match those in the **mapping** module.
- The **Logger** module logs your gateway activity to a file.

```
{
    "modules" :
    [ 
        {
            "module name" : "IoTHub",
            "module path" : "modules\\iothubhttp\\Debug\\iothubhttp_hl.dll",
            "args" : 
            {
                "IoTHubName" : "{Your IoT hub name}",
                "IoTHubSuffix" : "azure-devices.net"
            }
        },
        {
            "module name" : "mapping",
            "module path" : "modules\\identitymap\\Debug\\identity_map_hl.dll",
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
            "module path" : "modules\\ble_fake\\Debug\\ble_fake_hl.dll",
            "args":
            {
                "macAddress" : "01-01-01-01-01-01"
            }
        },
        {
            "module name":"BLE2",
            "module path" : "modules\\ble_fake\\Debug\\ble_fake_hl.dll",
            "args":
            {
                "macAddress" : "02-02-02-02-02-02"
            }
        },
        {
            "module name":"Logger",
            "module path" : "modules\\logger\\Debug\\logger_hl.dll",
            "args":
            {
                "filename":"deviceCloudUploadGatewaylog.log"
            }
        }
    ]
}
```

Save any changes you made to the configuration file.

To run the sample:

1. In your **Developer Command Prompt for VS2015** command prompt, navigate to the **azure-iot-gateway-sdk\.cmake\samples\simple_device_cloud_upload** folder in your local copy of the repository.
2. Run the following command:

    ```
    Debug\simple_device_cloud_upload.exe ..\samples\simple_device_cloud_upload\src\simple_device_cloud_upload_win.json
    ```

3. You can use the [Device Explorer or iothub-explorer][lnk-explorer-tools] tool monitor the messages that IoT hub receives from the gateway.

### Linux instructions

To build the sample:

1. Open a shell.
2. Navigate to the **azure-iot-gateway-sdk\build\** folder in your local copy of the repository.
3. Run the **build.sh** script.

To run the sample:

In a text editor, open the file **azure-iot-gateway-sdk/samples/simple_device_cloud_upload/src/simple_device_cloud_upload_lin.json** in your local copy of the repository. This file configures the modules in the sample gateway:

- The **IoTHub** module which connects to your IoT hub. Make sure that the **IoTHubName** value is set to the name of your IoT hub. The value of **IoTHubSuffix** should be **azure-devices.net**.
- The **mapping** module which maps the MAC addresses of your simulated devices to you IoT Hub device ids. Make sure that **deviceId** values match the ids of the two devices you added to your IoT hub, and that the **deviceKey** values contain the keys of your two devices.
- The **BLE1** and **BLE2** modules are the simulated devices. Note how their MAC addresses match those in the **mapping** module.
- The **Logger** module logs your gateway activity to a file.

```
{
    "modules" :
    [ 
        {
            "module name" : "IoTHub",
            "module path" : "./modules/iothubhttp/libiothubhttp_hl.so",
            "args" : 
            {
                "IoTHubName" : "{Your IoT hub name}",
                "IoTHubSuffix" : "azure-devices.net"
            }
        },
        {
            "module name" : "mapping",
            "module path" : "./modules/identitymap/libidentity_map_hl.so",
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
            "module path" : "./modules/simulated_device/libsimulated_device_hl.so",
            "args":
            {
                "macAddress" : "01-01-01-01-01-01"
            }
        },
        {
            "module name":"BLE2",
            "module path" : "./modules/simulated_device/libsimulated_device_hl.so",
            "args":
            {
                "macAddress" : "02-02-02-02-02-02"
            }
        },
        {
            "module name":"Logger",
            "module path" : "./modules/logger/liblogger_hl.so",
            "args":
            {
                "filename":"deviceCloudUploadGatewaylog.log"
            }
        }
    ]
}

```

Save any changes you made to the configuration file.

To run the sample:

1. In your shell, navigate to the **~/cmake/gateway** folder in your local copy of the repository.
2. Run the following command:

    ```
    ./samples/simple_device_cloud_upload/simple_device_cloud_upload {Path to your local copy of the repository}/azure-iot-field-gateway-sdk/samples/simple_device_cloud_upload/src/simple_device_cloud_upload_lin.json
    ```

3. You can use the [Device Explorer or iothub-explorer][lnk-explorer-tools] tool monitor the messages that IoT hub receives from the gateway.

<!-- Images -->
[1]: media/iot-hub-gw-simulateddevice/image1.png
[2]: media/iot-hub-gw-simulateddevice/image2.png

<!-- Links -->
[Simulated Device Cloud Upload sample]: https://github.com/Azure/azure-iot-gateway-sdk/blob/master/doc/sample_simulated_device_cloud_upload.md
[lnk-setupdevbox]: https://github.com/Azure/azure-iot-field-gateway-sdk/blob/master/doc/devbox_setup.md
[lnk-sdk]: https://github.com/Azure/azure-iot-field-gateway-sdk
[lnk-gw-getstarted]: iot-hub-gw-getstarted.md
[lnk-create-hub]: iot-hub-manage-through-portal.md
[lnk-free-trial]: https://azure.microsoft.com/pricing/free-trial/
[lnk-explorer-tools]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/manage_iot_hub.md