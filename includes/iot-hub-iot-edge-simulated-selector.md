> [!div class="op_single_selector"]
> * [Linux](../articles/iot-hub/iot-hub-linux-iot-edge-simulated-device.md)
> * [Windows](../articles/iot-hub/iot-hub-windows-iot-edge-simulated-device.md)

This walkthrough of the [Simulated Device Cloud Upload sample] shows you how to use [Azure IoT Edge][lnk-sdk] to send device-to-cloud telemetry to IoT Hub from simulated devices.

This walkthrough covers:

* **Architecture**: architectural information about the [Simulated Device Cloud Upload sample].
* **Build and run**: the steps required to build and run the sample.

## Architecture

The [Simulated Device Cloud Upload sample] shows how to create a gateway that sends telemetry from simulated devices to an IoT hub. A device may not be able to connect directly to IoT Hub because the device:

* Does not use a communications protocol understood by IoT Hub.
* Is not smart enough to remember the identity assigned to it by IoT Hub.

An IoT Edge gateway can solve these problems in the following ways:

* The gateway understands the protocol used by the device, receives device-to-cloud telemetry from the device, and forwards those messages to IoT Hub using a protocol understood by the IoT hub.

* The gateway maps IoT Hub identities to devices and acts as a proxy when a device sends messages to IoT Hub.

The following diagram shows the main components of the sample, including the IoT Edge modules:

![][1]

The modules do not pass messages directly to each other. The modules publish messages to an internal broker that delivers the messages to the other modules using a subscription mechanism. For more information, see [Get started with Azure IoT Edge][lnk-gw-getstarted].

### Protocol ingestion module

This module is the starting point for receiving data from devices, through the gateway, and into the cloud. In the sample, the module:

1. Creates simulated temperature data. If you use physical devices, the module reads data from those physical devices.
1. Creates a message.
1. Places the simulated temperature data into the message content.
1. Adds a property with a fake MAC address to the message.
1. Makes the message available to the next module in the chain.

The module called **Protocol X ingestion** in the previous diagram is called **Simulated device** in the source code.

### MAC &lt;-&gt; IoT Hub ID module

This module scans for messages that have a Mac address property. In the sample, the protocol ingestion module adds the MAC address property. If the module finds such a property, it adds another property with an IoT Hub device key to the message. The module then makes the message available to the next module in the chain.

The developer sets up a mapping between MAC addresses and IoT Hub identities to associate the simulated devices with IoT Hub device identities. The developer adds the mapping manually as part of the module configuration.

> [!NOTE]
> This sample uses a MAC address as a unique device identifier and correlates it with an IoT Hub device identity. However, you can write your own module that uses a different unique identifier. For example, your devices may have unique serial numbers or the telemetry data may include a unique embedded device name.

### IoT Hub communication module

This module takes messages with an IoT Hub device key property that was assigned by the previous module. The module sends the message content to IoT Hub using the HTTP protocol. HTTP is one of the three protocols understood by IoT Hub.

Instead of opening a connection for each simulated device, this module opens a single HTTP connection from the gateway to the IoT hub. The module then multiplexes connections from all the simulated devices over that connection. This approach enables a single gateway to connect many more devices.

## Before you get started

Before you get started, you must:

* [Create an IoT hub][lnk-create-hub] in your Azure subscription, you need the name of your hub to complete this walkthrough. If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.
* Add two devices to your IoT hub and make a note of their ids and device keys. You can use the [device explorer][lnk-device-explorer] or [iothub-explorer][lnk-iothub-explorer] tool to add your devices to the IoT hub you created in the previous step and retrieve their keys.

![][2]

<!-- Images -->
[1]: media/iot-hub-iot-edge-simulated-selector/image1.png
[2]: media/iot-hub-iot-edge-simulated-selector/image2.png

<!-- Links -->
[Simulated Device Cloud Upload sample]: https://github.com/Azure/iot-edge/blob/master/samples/simulated_device_cloud_upload/README.md
[lnk-sdk]: https://github.com/Azure/iot-edge
[lnk-gw-getstarted]: ../articles/iot-hub/iot-hub-linux-iot-edge-get-started.md
[lnk-free-trial]: https://azure.microsoft.com/pricing/free-trial/
[lnk-device-explorer]: https://github.com/Azure/azure-iot-sdk-csharp/tree/master/tools/DeviceExplorer
[lnk-iothub-explorer]: https://github.com/Azure/iothub-explorer/blob/master/readme.md
[lnk-create-hub]: ../articles/iot-hub/iot-hub-create-through-portal.md