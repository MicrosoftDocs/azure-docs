> [!div class="op_single_selector"]
> * [Node.js](../articles/iot-hub/iot-hub-node-node-direct-methods.md)
> * [C#](../articles/iot-hub/iot-hub-csharp-node-direct-methods.md)
> * [Java](../articles/iot-hub/iot-hub-java-java-direct-methods.md)

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of devices and a solution back end. Previous tutorials ([Get started with IoT Hub] and [Send Cloud-to-Device messages with IoT Hub]) illustrate the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub. IoT Hub also gives you the ability to invoke non-durable methods on devices from the cloud. Direct methods represent a request-reply interaction with a device similar to an HTTP call in that they succeed or fail immediately (after a user-specified timeout) to let the user know the status of the call. [Invoke a direct method on a device][lnk-devguide-methods] describes direct methods in more detail and offers guidance about when to use direct methods rather than cloud-to-device messages or desired properties.

This tutorial shows you how to:

* Use the Azure portal to create an IoT hub and create a device identity in your IoT hub.
* Create a simulated device app that has a direct method which can be called by the cloud.
* Create a console app that calls a direct method in the simulated device app through your IoT hub.

> [!NOTE]
> At this time, direct methods are only supported on devices that connect to IoT Hub using the MQTT protocol. Please refer to the [MQTT support][lnk-devguide-mqtt] article for instructions on how to convert existing device app to use MQTT.


[lnk-devguide-methods]: ../articles/iot-hub/iot-hub-devguide-direct-methods.md
[lnk-devguide-mqtt]: ../articles/iot-hub/iot-hub-mqtt-support.md

[Send Cloud-to-Device messages with IoT Hub]: ../articles/iot-hub/iot-hub-csharp-csharp-c2d.md
[Get started with IoT Hub]: ../articles/iot-hub/iot-hub-node-node-getstarted.md