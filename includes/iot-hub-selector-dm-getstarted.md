> [!div class="op_single_selector"]
> * [Device: Node.js Service: Node.js](../articles/iot-hub/iot-hub-node-node-device-management-get-started.md)
> * [Device: Node.js Service: C#](../articles/iot-hub/iot-hub-csharp-node-device-management-get-started.md)
> * [Device: Java Service: Java](../articles/iot-hub/iot-hub-java-java-device-management-getstarted.md)

Back-end apps can use Azure IoT Hub primitives, such as [device twin][lnk-devtwin] and [direct methods][lnk-c2dmethod], to remotely start and monitor device management actions on devices. This tutorial shows you how a back-end app and a device app can work together to initiate and monitor a remote device reboot using IoT Hub.

Use a direct method to initiate device management actions (such as reboot, factory reset, and firmware update) from a back-end app in the cloud. The device is responsible for:

* Handling the method request sent from IoT Hub.
* Initiating the corresponding device-specific action on the device.
* Providing status updates through *reported properties* to IoT Hub.

You can use a back-end app in the cloud to run device twin queries to report on the progress of your device management actions.

[lnk-devtwin]: ../articles/iot-hub/iot-hub-devguide-device-twins.md
[lnk-c2dmethod]: ../articles/iot-hub/iot-hub-devguide-direct-methods.md
