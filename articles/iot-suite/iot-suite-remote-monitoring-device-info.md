<properties
 pageTitle="Device information metadata in the remote monitoring solution | Microsoft Azure"
 description="A description of the Azure IoT preconfigured solution remote monitoring and its architecture."
 services=""
 suite="iot-suite"
 documentationCenter=""
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-suite"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="06/20/2016"
 ms.author="dobett"/>

# Device information metadata in the remote monitoring preconfigured solution

The Azure IoT Suite remote monitoring preconfigured solution demonstrates an approach for managing device metadata. This article outlines the approach this solution takes to enable you to understand:

- What device metadata the solution stores.
- How the solution manages the device metadata.

## Context

The remote monitoring preconfigured solution uses [Azure IoT Hub][lnk-iot-hub] to enable your devices to send data to the cloud. IoT Hub includes a [device identity registry][lnk-identity-registry] to control access to IoT Hub. The IoT Hub device identity registry is separate from the remote monitoring solution-specific *device registry* that stores device information metadata. The remote monitoring solution uses a [DocumentDB][lnk-docdb] database to implement its device registry for storing device information metadata. The [Microsoft Azure IoT Reference Architecture][lnk-ref-arch] describes the role of the device registry in a typical IoT solution.

> [AZURE.NOTE] The remote monitoring preconfigured solution keeps the device identity registry in sync with the device registry. Both use the same device id to uniquely identify each device connected to your IoT hub.

The [IoT Hub device management preview][lnk-dm-preview] adds features to IoT Hub that are similar to the device information management features in the remote monitoring preconfigured solution described in this article. At this time however, the remote monitoring solution only makes use of the generally available (GA) features in IoT Hub.

## Device information metadata

A device information metadata JSON document stored in the device registry DocumentDB database has the following structure:

```
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

- **DeviceProperties**: The device itself writes these properties and the device is the authority for this data. Other example device properties include manufacturer, model number, and serial number. 
- **DeviceID**: The unique device id. This value is the same in the IoT Hub device identity registry.
- **HubEnabledState**: The status of the device in IoT Hub. This is initially set to **null** until the device first connects. In the solution portal this is represented as the device being "registered but not present".
- **CreatedTime**: The time the device was created.
- **DeviceState**: The state reported by the device.
- **UpdatedTime**: The time the device was last updated through the solution portal.
- **SystemProperties**: The solution portal writes the system properties and the device has no knowledge of these properties. An example system property is the **ICCID** if the solution is authorized with and connected to a service managing SIM-enabled devices.
- **Commands**: A list of the commands the device supports. The device supplies this information to the solution.
- **CommandHistory**: A list of the commands sent by the remote monitoring solution to the device and the status of those commands.
- **IsSimulatedDevice**: A flag that identifies a device as a simulated device.
- **id**: The unique DocumentDB identifier for this device document.

> [AZURE.NOTE] Device information can also include metadata to describe the telemetry the device sends to IoT Hub. The remote monitoring solution uses this telemetry metadata to customize how the dashboard displays [dynamic telemetry][lnk-dynamic-telemetry].

## Lifecycle

When you first create a device in the solution portal, the solution creates an entry in its device registry as shown above. Much of the information is initially stubbed out and the **HubEnabledState** is set to **null**. At this point the solution also creates an entry for the device in the IoT Hub device identity registry which generates the keys the device uses to authenticate with IoT Hub.

When a device first connects to the solution, it sends a device information message. This device information message includes device properties such as the device manufacturer, model number, and serial number. A device information message also includes a list of the commands the device supports including information about any command parameters. When the solution receives this message, it updates the device information metadata in the device registry.

### View and edit device information in the solution portal

The device list in the solution portal displays the following device properties as columns: **Status**, **DeviceId**, **Manufacturer**, **Model Number**, **Serial Number**, **Firmware**, **Platform**, **Processor**, and **Installed RAM**. The device properties **Latitude** and **Longitude** drive the location in the Bing Map on the dashboard. 

![Device list][img-device-list]

If you click on **Edit** in the **Device Details** pane in the solution portal, you can edit all of these properties. Editing these properties updates the record for the device in the DocumentDB database; however, if a device sends an updated device info message, it overwrites any changes made in the solution portal. You cannot edit the **DeviceId**, **Hostname**, **HubEnabledState**, **CreatedTime**, **DeviceState**, and **UpdatedTime** properties in the solution portal because only the device has authority over these properties.

![Device edit][img-device-edit]

You can use the solution portal to remove a device from your solution. When you remove a device, the solution removes the device information metadata from the solution device registry and removes the device entry in the IoT Hub device identity registry. Before you can remove a device you must disable it.

![Device remove][img-device-remove]

## Device information message processing

Device information messages sent by a device are distinct from telemetry messages in that they include information such as device properties, the commands a device can respond to, and any command history. IoT Hub itself has no knowledge of the metadata contained in a device information message and processes the message in the same way it processes any device-to-cloud message. In the remote monitoring solution, an [Azure Stream Analytics][lnk-stream-analytics] (ASA) job reads the messages from IoT Hub. The **DeviceInfo** stream analytics job filters for messages that contain **"ObjectType": "DeviceInfo"** and forwards them to the **EventProcessorHost** host instance that runs in a web job. Logic in the **EventProcessorHost** instance uses the device id to find the DocumentDB record for the specific device and update the record. The device registry record now includes information such as device properties, commands, and command history.

> [AZURE.NOTE] A device information message is a standard device-to-cloud message. The solution distinguishes between device information messages and telemetry messages by using ASA queries.

## Example device information records

The remote monitoring preconfigured solution uses two types of device information records: records for the simulated devices deployed with the solution and records for the custom devices you connect to the solution.

### Simulated device

The following example shows the JSON device information record for a simulated device. This record has a value set for **UpdatedTime** which indicates the device has sent a **DeviceInfo** message to IoT Hub. The record includes some common device properties, defines the six commands the simulated devices support, and has the **IsSimulatedDevice** flag set to **1**.

```
{
  "DeviceProperties": {
    "DeviceID": "SampleDevice001_455",
    "HubEnabledState": true,
    "CreatedTime": "2016-01-26T19:02:01.4550695Z",
    "DeviceState": "normal",
    "UpdatedTime": "2016-06-01T15:28:41.8105157Z",
    "Manufacturer": "Contoso Inc.",
    "ModelNumber": "MD-369",
    "SerialNumber": "SER9009",
    "FirmwareVersion": "1.39",
    "Platform": "Plat-34",
    "Processor": "i3-2191",
    "InstalledRAM": "3 MB",
    "Latitude": 47.583582,
    "Longitude": -122.130622
  },
  "Commands": [
    {
      "Name": "PingDevice",
      "Parameters": null
    },
    {
      "Name": "StartTelemetry",
      "Parameters": null
    },
    {
      "Name": "StopTelemetry",
      "Parameters": null
    },
    {
      "Name": "ChangeSetPointTemp",
      "Parameters": [
        {
          "Name": "SetPointTemp",
          "Type": "double"
        }
      ]
    },
    {
      "Name": "DiagnosticTelemetry",
      "Parameters": [
        {
          "Name": "Active",
          "Type": "boolean"
        }
      ]
    },
    {
      "Name": "ChangeDeviceState",
      "Parameters": [
        {
          "Name": "DeviceState",
          "Type": "string"
        }
      ]
    }
  ],
  "CommandHistory": [],
  "IsSimulatedDevice": 1,
  "Version": "1.0",
  "ObjectType": "DeviceInfo",
  "IoTHub": {
    "MessageId": null,
    "CorrelationId": null,
    "ConnectionDeviceId": "SampleDevice001_455",
    "ConnectionDeviceGenerationId": "635894317219942540",
    "EnqueuedTime": "0001-01-01T00:00:00",
    "StreamId": null
  },
  "SystemProperties": {
    "ICCID": null
  },
  "id": "7101c002-085f-4954-b9aa-7466980a2aaf"
}
```

### Custom device

The following example shows the JSON device information record for a custom device and has the **IsSimulatedDevice** flag set to **0**. You can see that this custom device supports two commands and that the solution portal has sent a **SetTemperature** command to the device:

```
{
  "DeviceProperties": {
    "DeviceID": "mydevice01",
    "HubEnabledState": true,
    "CreatedTime": "2016-03-28T21:05:06.6061104Z",
    "DeviceState": "normal",
    "UpdatedTime": "2016-06-07T22:05:34.2802549Z"
  },
  "SystemProperties": {
    "ICCID": null
  },
  "Commands": [
    {
      "Name": "SetHumidity",
      "Parameters": [
        {
          "Name": "humidity",
          "Type": "int"
        }
      ]
    },
    {
      "Name": "SetTemperature",
      "Parameters": [
        {
          "Name": "temperature",
          "Type": "int"
        }
      ]
    }
  ],
  "CommandHistory": [
    {
      "Name": "SetTemperature",
      "MessageId": "2a0cec61-5eca-4de7-92dc-9c0bc4211c46",
      "CreatedTime": "2016-06-07T21:05:18.140796Z",
      "Parameters": {
        "temperature": 20
      },
      "UpdatedTime": "2016-06-07T21:05:18.716076Z",
      "Result": "Expired"
    }
  ],
  "IsSimulatedDevice": 0,
  "id": "6184ae0f-2d94-4fbd-91cd-4b193aecc9d1",
  "ObjectType": "DeviceInfo",
  "Version": "1.0",
  "IoTHub": {
    "MessageId": null,
    "CorrelationId": null,
    "ConnectionDeviceId": "SampleCustom",
    "ConnectionDeviceGenerationId": "635947959068246845",
    "EnqueuedTime": "0001-01-01T00:00:00",
    "StreamId": null
  }
}
```

The following shows the JSON **DeviceInfo** message the device sent to update the device information metadata:

```
{ "ObjectType":"DeviceInfo",
  "Version":"1.0",
  "IsSimulatedDevice":false,
  "DeviceProperties": { "DeviceID":"mydevice01", "HubEnabledState":true },
  "Commands": [
    {"Name":"SetHumidity", "Parameters":[{"Name":"humidity","Type":"double"}]},
    {"Name":"SetTemperature", "Parameters":[{"Name":"temperature","Type":"double"}]}
  ]
}
```

## Next steps

Now you've finished learning how you can customize the preconfigured solutions, you can explore some of the other features and capabilities of the IoT Suite preconfigured solutions:

- [Predictive maintenance preconfigured solution overview][lnk-predictive-overview]
- [Frequently asked questions for IoT Suite][lnk-faq]
- [IoT security from the ground up][lnk-security-groundup]



<!-- Images and links -->
[img-device-list]: media/iot-suite-remote-monitoring-device-info/image1.png
[img-device-edit]: media/iot-suite-remote-monitoring-device-info/image2.png
[img-device-remove]: media/iot-suite-remote-monitoring-device-info/image3.png

[lnk-iot-hub]: https://azure.microsoft.com/documentation/services/iot-hub/
[lnk-identity-registry]: ../iot-hub/iot-hub-devguide.md#device-identity-registry
[lnk-docdb]: https://azure.microsoft.com/documentation/services/documentdb/
[lnk-ref-arch]: http://download.microsoft.com/download/A/4/D/A4DAD253-BC21-41D3-B9D9-87D2AE6F0719/Microsoft_Azure_IoT_Reference_Architecture.pdf
[lnk-stream-analytics]: https://azure.microsoft.com/documentation/services/stream-analytics/
[lnk-dm-preview]: ../iot-hub/iot-hub-device-management-overview.md
[lnk-dynamic-telemetry]: iot-suite-dynamic-telemetry.md

[lnk-predictive-overview]: iot-suite-predictive-overview.md
[lnk-faq]: iot-suite-faq.md
[lnk-security-groundup]: securing-iot-ground-up.md
