---
 title: include file
 description: include file
 services: iot-central
 author: v-krishnag
 ms.service: iot-central
 ms.topic: include
 ms.date: 04/27/2022
 ms.author: v-krishnag
 ms.custom: include file
---

Use this feature to continuously export filtered and enriched IoT data from your IoT Central application. Data export pushes changes in near real time to other parts of your cloud solution for warm-path insights, analytics, and storage.

For example, you can:

- Continuously export telemetry, property changes, device connectivity, device lifecycle, and device template lifecycle data in JSON format in near real time.
- Filter the data streams to export data that matches custom conditions.
- Enrich the data streams with custom values and property values from the device.
- [Transform the data](../articles/iot-central/core/howto-transform-data-internally.md) streams to modify their shape and content.

> [!Tip]
> When you turn on data export, you get only the data from that moment onward. Currently, data can't be retrieved for a time when data export was off. To retain more historical data, turn on data export early.

## Prerequisites

To use data export features, you must have the [Data export](../articles/iot-central/core/howto-manage-users-roles.md) permission.