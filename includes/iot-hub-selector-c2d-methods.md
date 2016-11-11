> [!div class="op_single_selector"]
> * [Node.js](../articles/iot-hub/iot-hub-c2d-methods.md)
> * [C#](../articles/iot-hub/iot-hub-csharp-csharp-direct-methods.md.md)
> 
> 

## Introduction
Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of IoT devices and an application back end. Previous tutorials ([Get started with IoT Hub] and [Send Cloud-to-Device messages with IoT Hub]) illustrate the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub. IoT Hub also gives you the ability to invoke non-durable methods on devices from the cloud. Methods represent a request-reply interaction with a device similar to an HTTP call in that they succeed or fail immediately (after a user-specified timeout) to let the user know the status of the call. [Invoke a direct method on a device][lnk-devguide-methods] describes methods in more detail and offers guidance about when to use methods versus cloud-to-device messages.

This tutorial shows you how to:

* Use the Azure portal to create an IoT hub and create a device identity in your IoT hub.
* Create a simulated device that has a direct method which can be called by the cloud.
* Create a console application that calls a direct method on the simulated device via your IoT hub.

> [!NOTE]
> At this time, direct methods are accessible only from devices that connect to IoT Hub using the MQTT protocol. Please refer to the [MQTT support][lnk-devguide-mqtt] article for instructions on how to convert existing device app to use MQTT.
> 
> 