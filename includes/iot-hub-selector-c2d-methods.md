> [!div class="op_single_selector"]
> * [Node.js](../articles/iot-hub/quickstart-control-device-node.md)
> * [C#](../articles/iot-hub/quickstart-control-device-dotnet.md)
> * [Java](../articles/iot-hub/quickstart-control-device-java.md)
> * [Python](../articles/iot-hub/quickstart-control-device-python.md)

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of devices and a solution back end. Previous tutorials ([Get started with IoT Hub] and [Send Cloud-to-Device messages with IoT Hub]) illustrate the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub. IoT Hub also gives you the ability to invoke non-durable methods on devices from the cloud. Direct methods represent a request-reply interaction with a device similar to an HTTPS call in that they succeed or fail immediately (after a user-specified timeout) to let the user know the status of the call. The article [Invoke a direct method on a device][lnk-devguide-methods] describes direct methods in more detail and offers guidance about when to use direct methods rather than cloud-to-device messages or desired properties.

[!INCLUDE [iot-hub-basic](iot-hub-basic-whole.md)]

This tutorial shows you how to:

* Use the Azure portal to create an IoT hub and create a device identity in your IoT hub.
* Create a simulated device app that has a direct method that can be called by the cloud.
* Create a console app that calls a direct method in the simulated device app through your IoT hub.


[lnk-devguide-methods]: ../articles/iot-hub/iot-hub-devguide-direct-methods.md
[lnk-devguide-mqtt]: ../articles/iot-hub/iot-hub-mqtt-support.md

[Send Cloud-to-Device messages with IoT Hub]: ../articles/iot-hub/iot-hub-csharp-csharp-c2d.md
[Get started with IoT Hub]: ../articles/iot-hub/quickstart-send-telemetry-node.md