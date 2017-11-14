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

![Diagram - simulated device message goes through gateway to IoT Hub][1]

This sample contains three modules that make up the gateway:
1. Protocol ingestion module
1. MAC &lt;-&gt; IoT Hub ID module
1. IoT Hub communication module

The modules do not pass messages directly to each other. The modules publish messages to an internal broker that delivers the messages to the other modules using a subscription mechanism. For more information, see [Get started with Azure IoT Edge][lnk-gw-getstarted].

![Diagram - gateway modules communicate with broker][2]

### Protocol ingestion module

The protocol ingestion module is the starting point for process of taking data from devices, through the gateway, and into the cloud. 

In the sample, this module:

1. Creates simulated temperature data. If you use physical devices, the module reads data from those physical devices.
1. Creates a message.
1. Places the simulated temperature data into the message content.
1. Adds a property with a fake MAC address to the message.
1. Makes the message available to the next module in the chain.

The protocol ingestion module is **simulated_device.c** in the source code.

### MAC &lt;-&gt; IoT Hub ID module

The MAC &lt;-&gt; IoT Hub ID module works as a translator. This sample uses a MAC address as a unique device identifier and correlates it with an IoT Hub device identity. However, you can write your own module that uses a different unique identifier. For example, your devices may have unique serial numbers or the telemetry data may include a unique embedded device name.

In the sample, this module:

1. Scans for messages that have a MAC address property.
1. If there is a MAC address, adds another property with an IoT Hub device key to the message. 
1. Makes the message available to the next module in the chain.

The developer sets up a mapping between MAC addresses and IoT Hub identities to associate the simulated devices with IoT Hub device identities. The developer adds the mapping manually as part of the module configuration.

The MAC &lt;-&gt; IoT Hub ID module is **identitymap.c** in the source code. 

### IoT Hub communication module

The IoT Hub communication module opens a single HTTPS connection from the gateway to the IoT Hub. HTTPS is one of the three protocols understood by IoT Hub. This module keeps you from having to open a connection for each device by multiplexing connections from all the devices over the one connection. This approach enables a single gateway to connect many devices. 

In the sample, this module:

1. Takes messages with an IoT Hub device key property that was assigned by the previous module. 
1. Sends the message content to IoT Hub using the HTTPS protocol. 

The IoT Hub communication module is **iothub.c** in the source code.

## Before you get started

Before you get started, you must:

* [Create an IoT hub][lnk-create-hub] in your Azure subscription. You need the name of your hub for this sample walkthrough. If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.
* Add two devices to your IoT hub and make a note of their IDs and device keys. You can use the [device explorer][lnk-device-explorer] or [iothub-explorer][lnk-iothub-explorer] tools to add devices to the IoT hub and retrieve their keys.


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