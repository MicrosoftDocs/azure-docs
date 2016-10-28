> [AZURE.SELECTOR]
- [Node.js](../articles/iot-hub/iot-hub-node-node-twin-getstarted.md)
- [C#](../articles/iot-hub/iot-hub-csharp-node-twin-getstarted.md)

## Introduction

Device twins are JSON documents that store device state information (meta-data, configurations, and conditions). IoT Hub persists a device twin for each device that you connect to IoT Hub.

Use device twins to:

* Store device meta-data from your back end.
* Report current state information such as available capabilities and conditions (for example, the connectivity method used) from your device app.
* Synchronize the state of long-running workflows (such as firmware and configuration updates) between device app and back end.
* Query your device meta-data, configuration, or state.

> [AZURE.NOTE] Device twins are designed for synchronization and for querying device configurations and conditions. Use [device-to-cloud messages][lnk-d2c] for sequences of timestamped events (such as telemetry streams of time-based sensor data) and [cloud-to-device methods][lnk-methods] for interactive control of devices, such as turning on a fan from a user-controlled app.

Device twins are stored in an IoT hub and contain:

* *tags*, device meta-data accessible only by the back end;
* *desired properties*, JSON objects modifiable by the back end and observable by the device app; and
* *reported properties*, JSON objects modifiable by the device app and readable by the back end. Tags and properties cannot contain arrays, but objects can be nested.

![][img-twin]

Additionally, the app back end can query device twins based on all the above data.
Refer to [Understand device twins][lnk-twins] for more information about device twins and to the [IoT Hub query language][lnk-query] reference for querying.

> [AZURE.NOTE] At this time, device twins are accessible only from devices that connect to IoT Hub using the MQTT protocol. Please refer to the [MQTT support][lnk-devguide-mqtt] article for instructions on how to convert existing device app to use MQTT.

This tutorial shows you how to:

- Create a back-end app that adds *tags* to a device twin, and a simulated device that reports its connectivity channel as a *reported property* on the device twin.
- Query devices from your back end app using filters on the tags and properties previously created.


<!-- images -->
[img-twin]: media/iot-hub-selector-twin-get-started/twin.png

<!-- links -->
[lnk-query]: ../articles/iot-hub/iot-hub-devguide-query-language.md
[lnk-twins]: ../articles/iot-hub/iot-hub-devguide-device-twins.md
[lnk-d2c]: ../articles/iot-hub/iot-hub-devguide-messaging.md#device-to-cloud-messages
[lnk-methods]: ../articles/iot-hub/iot-hub-devguide-direct-methods.md
[lnk-devguide-mqtt]: ../articles/iot-hub/iot-hub-mqtt-support.md