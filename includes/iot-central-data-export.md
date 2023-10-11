---
 title: include file
 description: include file
 services: iot-central
 author: dominicbetts
 ms.service: iot-central
 ms.topic: include
 ms.date: 05/22/2023
 ms.author: dobett
 ms.custom: include file
---

Use this feature to continuously export filtered and enriched IoT data from your IoT Central application. Data export pushes changes in near real time to other parts of your cloud solution for warm-path insights, analytics, and storage.

For example, you can:

- Continuously export telemetry, property changes, device connectivity, device lifecycle, device template lifecycle, and audit log data in JSON format in near real time.
- Filter the data streams to export data that matches custom conditions.
- Enrich the data streams with custom values and property values from the device.
- [Transform the data](../articles/iot-central/core/howto-transform-data-internally.md) streams to modify their shape and content.

> [!TIP]
> When you turn on data export, you get only the data from that moment onward. Currently, data can't be retrieved for a time when data export was off. To retain more historical data, turn on data export early.

> [!NOTE]
> In some circumstances it could take up to 60 seconds for for messages to be exported. This time is measured from when IoT Central receives the message from the underlying IoT hub to when the message is delivered to the destination endpoint.

## Prerequisites

To use data export features, you must have the [Data export](../articles/iot-central/core/howto-manage-users-roles.md) permission.
