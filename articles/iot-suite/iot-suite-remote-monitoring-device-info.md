---
title: Device information metadata in the remote monitoring solution | Microsoft Docs
description: A description of the Azure IoT preconfigured solution remote monitoring and its architecture.
services: ''
suite: iot-suite
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 1b334769-103b-4eb0-a293-184f3d1ba9a3
ms.service: iot-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/15/2017
ms.author: dobett

---
# Device information metadata in the remote monitoring preconfigured solution

The Azure IoT Suite remote monitoring preconfigured solution demonstrates an approach for managing device metadata. This article outlines the approach this solution takes to enable you to understand:

* What device metadata the solution stores.
* How the solution manages the device metadata.

## Context

The remote monitoring preconfigured solution uses [Azure IoT Hub][lnk-iot-hub] to enable your devices to send data to the cloud. The solution stores information about devices in three different locations:

| Location | Information stored | Implementation |
| -------- | ------------------ | -------------- |
| Identity registry | Device id, authentication keys, enabled state | Built in to IoT Hub |
| Device twins | Metadata: reported properties, desired properties, tags | Built in to IoT Hub |
| Cosmos DB | Command and method history | Custom for solution |

IoT Hub includes a [device identity registry][lnk-identity-registry] to manage access to an IoT hub and uses [device twins][lnk-device-twin] to manage device metadata. There is also a remote monitoring solution-specific *device registry* that stores command and method history. The remote monitoring solution uses a [Cosmos DB][lnk-docdb] database to implement a custom store for command and method history.

> [!NOTE]
> The remote monitoring preconfigured solution keeps the device identity registry in sync with the information in the Cosmos DB database. Both use the same device id to uniquely identify each device connected to your IoT hub.

## Device metadata

IoT Hub maintains a [device twin][lnk-device-twin] for each simulated and physical device connected to a remote monitoring solution. The solution uses device twins to manage the metadata associated with devices. A device twin is a JSON document maintained by IoT Hub, and the solution uses the IoT Hub API to interact with device twins.

A device twin stores three types of metadata:

- *Reported properties* are sent to an IoT hub by a device. In the remote monitoring solution, simulated devices send reported properties at start-up and in response to **Change device state** commands and methods. You can view reported properties in the **Device list** and **Device details** in the solution portal. Reported properties are read only.
- *Desired properties* are retrieved from the IoT hub by devices. It is the responsibility of the device to make any necessary configuration change on the device. It is also the responsibility of the device to report the change back to the hub as a reported property. You can set a desired property value through the solution portal.
- *Tags* only exist in the device twin and are never synchronized with a device. You can set tag values in the solution portal and use them when you filter the list of devices. The solution also uses a tag to identify the icon to display for a device in the solution portal.

Example reported properties from the simulated devices include manufacturer, model number, latitude, and longitude. Simulated devices also return the list of supported methods as a reported property.

> [!NOTE]
> The simulated device code only uses the **Desired.Config.TemperatureMeanValue** and **Desired.Config.TelemetryInterval** desired properties to update the reported properties sent back to IoT Hub. All other desired property change requests are ignored.

A device information metadata JSON document stored in the device registry Cosmos DB database has the following structure:

```json
{
  "DeviceProperties": {
    "DeviceID": "deviceid1",
    "HubEnabledState": null,
    "CreatedTime": "2016-04-25T23:54:01.313802Z",
    "DeviceState": "normal",
    "UpdatedTime": null
    },
  "SystemProperties": {
    "ICCID": null
  },
  "Commands": [],
  "CommandHistory": [],
  "IsSimulatedDevice": false,
  "id": "fe81a81c-bcbc-4970-81f4-7f12f2d8bda8"
}
```

> [!NOTE]
> Device information can also include metadata to describe the telemetry the device sends to IoT Hub. The remote monitoring solution uses this telemetry metadata to customize how the dashboard displays [dynamic telemetry][lnk-dynamic-telemetry].

## Lifecycle

When you first create a device in the solution portal, the solution creates an entry in the Cosmos DB database to store command and method history. At this point, the solution also creates an entry for the device in the device identity registry, which generates the keys the device uses to authenticate with IoT Hub. It also creates a device twin.

When a device first connects to the solution, it sends reported properties and a device information message. The reported property values are automatically saved in the device twin. The reported properties include the device manufacturer, model number, serial number, and a list of supported methods. The device information message includes the list of the commands the device supports including information about any command parameters. When the solution receives this message, it updates the device information in the Cosmos DB database.

### View and edit device information in the solution portal

The device list in the solution portal displays the following device properties as columns by default: **Status**, **DeviceId**, **Manufacturer**, **Model Number**, **Serial Number**, **Firmware**, **Platform**, **Processor**, and **Installed RAM**. You can customize the columns by clicking **Column editor**. The device properties **Latitude** and **Longitude** drive the location in the Bing Map on the dashboard.

![Column editor in device list][img-device-list]

In the **Device Details** pane in the solution portal, you can edit desired properties and tags (reported properties are read only).

![Device deatils pane][img-device-edit]

You can use the solution portal to remove a device from your solution. When you remove a device, the solution removes the device entry from identity registry and then deletes the device twin. The solution also removes information related to the device from the Cosmos DB database. Before you can remove a device, you must disable it.

![Remove device][img-device-remove]

## Device information message processing

Device information messages sent by a device are distinct from telemetry messages. Device information messages include the commands a device can respond to, and any command history. IoT Hub itself has no knowledge of the metadata contained in a device information message and processes the message in the same way it processes any device-to-cloud message. In the remote monitoring solution, an [Azure Stream Analytics][lnk-stream-analytics] (ASA) job reads the messages from IoT Hub. The **DeviceInfo** stream analytics job filters for messages that contain **"ObjectType": "DeviceInfo"** and forwards them to the **EventProcessorHost** host instance that runs in a web job. Logic in the **EventProcessorHost** instance uses the device id to find the Cosmos DB record for the specific device and update the record.

> [!NOTE]
> A device information message is a standard device-to-cloud message. The solution distinguishes between device information messages and telemetry messages by using ASA queries.

## Next steps

Now you've finished learning how you can customize the preconfigured solutions, you can explore some of the other features and capabilities of the IoT Suite preconfigured solutions:

* [Predictive maintenance preconfigured solution overview][lnk-predictive-overview]
* [Frequently asked questions for IoT Suite][lnk-faq]
* [IoT security from the ground up][lnk-security-groundup]

<!-- Images and links -->
[img-device-list]: media/iot-suite-remote-monitoring-device-info/image1.png
[img-device-edit]: media/iot-suite-remote-monitoring-device-info/image2.png
[img-device-remove]: media/iot-suite-remote-monitoring-device-info/image3.png

[lnk-iot-hub]: https://azure.microsoft.com/documentation/services/iot-hub/
[lnk-identity-registry]: ../iot-hub/iot-hub-devguide-identity-registry.md
[lnk-device-twin]: ../iot-hub/iot-hub-devguide-device-twins.md
[lnk-docdb]: https://azure.microsoft.com/documentation/services/documentdb/
[lnk-stream-analytics]: https://azure.microsoft.com/documentation/services/stream-analytics/
[lnk-dynamic-telemetry]: iot-suite-dynamic-telemetry.md

[lnk-predictive-overview]: iot-suite-predictive-overview.md
[lnk-faq]: iot-suite-faq.md
[lnk-security-groundup]: securing-iot-ground-up.md
