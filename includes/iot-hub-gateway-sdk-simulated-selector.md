> [AZURE.SELECTOR]
- [Linux](../articles/iot-hub/iot-hub-linux-gateway-sdk-simulated-device.md)
- [Windows](../articles/iot-hub/iot-hub-windows-gateway-sdk-simulated-device.md)

This walkthrough of the [Simulated Device Cloud Upload sample] shows how to use the [Microsoft Azure IoT Gateway SDK][lnk-sdk] to send device-to-cloud telemetry to IoT Hub from simulated devices.

This walkthrough covers:

1. **Architecture**: important architectural information about the Simulated Device Cloud Upload sample.

2. **Build and run**: the steps required to build and run the sample.

## Architecture

The Simulated Device Cloud Upload sample shows how to use the SDK to create a gateway which sends telemetry from simulated devices to an IoT hub. The simulated devices cannot connect directly to IoT Hub because:

- The devices do not use a communications protocol understood by IoT Hub.
- The devices are not smart enough to remember the identity assigned to them by IoT Hub.

The gateway solves these problems for the simulated devices in the following ways:

- The gateway understands the protocol used by the simulated devices, receives device-to-cloud telemetry from the devices, and forwards those messages to IoT Hub using a protocol understood by the hub.
- The gateway stores IoT Hub identities on behalf of the simulated devices and acts as a proxy when the simulated devices send messages to IoT Hub.

The following diagram shows the main components of the sample, including the gateway modules:

![][1]


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


<!-- Images -->
[1]: media/iot-hub-gateway-sdk-simulated-selector/image1.png
[2]: media/iot-hub-gateway-sdk-simulated-selector/image2.png

<!-- Links -->
[Simulated Device Cloud Upload sample]: https://github.com/Azure/azure-iot-gateway-sdk/blob/master/doc/sample_simulated_device_cloud_upload.md
[lnk-sdk]: https://github.com/Azure/azure-iot-gateway-sdk
[lnk-gw-getstarted]: ../articles/iot-hub/iot-hub-linux-gateway-sdk-get-started.md