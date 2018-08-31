---
title: Azure Event Grid schema for IoT Hub | Microsoft Docs
description: Reference page for the event schema format and properties of IoT Hub 
services: iot-hub
documentationcenter: ''
author: kgremban
manager: timlt
editor: ''

ms.service: event-grid
ms.topic: reference
ms.date: 08/17/2018
ms.author: kgremban
---

# Azure Event Grid event schema for IoT Hub

This article provides the properties and schema for Azure IoT Hub events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md). 

For a list of sample scripts and tutorials, see [IoT Hub event source](event-sources.md#iot-hub).

## Available event types

Azure IoT Hub emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.Devices.DeviceCreated | Published when a device is registered to an IoT hub. |
| Microsoft.Devices.DeviceDeleted | Published when a device is deleted from an IoT hub. | 
| Microsoft.Devices.DeviceConnected | Published when a device is connected to an IoT hub. |
| Microsoft.Devices.DeviceDisconnected | Published when a device is disconnected from an IoT hub. | 

## Example event

The schema for DeviceConnected and DeviceDisconnected events have the same structure. This sample event shows the schema of an event raised when a device is connected to an IoT hub:

```json
[{
  "id": "f6bbf8f4-d365-520d-a878-17bf7238abd8", 
  "topic": "/SUBSCRIPTIONS/<subscription ID>/RESOURCEGROUPS/<resource group name>/PROVIDERS/MICROSOFT.DEVICES/IOTHUBS/<hub name>", 
  "subject": "devices/LogicAppTestDevice", 
  "eventType": "Microsoft.Devices.DeviceConnected", 
  "eventTime": "2018-06-02T19:17:44.4383997Z", 
  "data": {
    "deviceConnectionStateEventInfo": {
      "sequenceNumber":
        "000000000000000001D4132452F67CE200000002000000000000000000000001"
    },
    "hubName": "egtesthub1",
    "deviceId": "LogicAppTestDevice",
    "moduleId" : "DeviceModuleID"
  }, 
  "dataVersion": "1", 
  "metadataVersion": "1" 
}]
```

The schema for DeviceCreated and DeviceDeleted events have the same structure. This sample event shows the schema of an event raised when a device is registered to an IoT hub:

```json
[{
  "id": "56afc886-767b-d359-d59e-0da7877166b2",
  "topic": "/SUBSCRIPTIONS/<subscription ID>/RESOURCEGROUPS/<resource group name>/PROVIDERS/MICROSOFT.DEVICES/IOTHUBS/<hub name>",
  "subject": "devices/LogicAppTestDevice",
  "eventType": "Microsoft.Devices.DeviceCreated",
  "eventTime": "2018-01-02T19:17:44.4383997Z",
  "data": {
    "twin": {
      "deviceId": "LogicAppTestDevice",
      "etag": "AAAAAAAAAAE=",
      "deviceEtag": "null",
      "status": "enabled",
      "statusUpdateTime": "0001-01-01T00:00:00",
      "connectionState": "Disconnected",
      "lastActivityTime": "0001-01-01T00:00:00",
      "cloudToDeviceMessageCount": 0,
      "authenticationType": "sas",
      "x509Thumbprint": {
        "primaryThumbprint": null,
        "secondaryThumbprint": null
      },
      "version": 2,
      "properties": {
        "desired": {
          "$metadata": {
            "$lastUpdated": "2018-01-02T19:17:44.4383997Z"
          },
          "$version": 1
        },
        "reported": {
          "$metadata": {
            "$lastUpdated": "2018-01-02T19:17:44.4383997Z"
          },
          "$version": 1
        }
      }
    },
    "hubName": "egtesthub1",
    "deviceId": "LogicAppTestDevice"
  },
  "dataVersion": "1",
  "metadataVersion": "1"
}]
```

### Event properties

All events contain the same top-level data: 

| Property | Type | Description |
| -------- | ---- | ----------- |
| id | string | Unique identifier for the event. |
| topic | string | Full resource path to the event source. This field is not writeable. Event Grid provides this value. |
| subject | string | Publisher-defined path to the event subject. |
| eventType | string | One of the registered event types for this event source. |
| eventTime | string | The time the event is generated based on the provider's UTC time. |
| data | object | IoT Hub event data.  |
| dataVersion | string | The schema version of the data object. The publisher defines the schema version. |
| metadataVersion | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

For all IoT Hub events, the data object contains the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| hubName | string | Name of the IoT Hub where the device was created or deleted. |
| deviceId | string | The unique identifier of the device. This case-sensitive string can be up to 128 characters long, and supports ASCII 7-bit alphanumeric characters plus the following special characters: `- : . + % _ # * ? ! ( ) , = @ ; $ '`. |

The contents of the data object are different for each event publisher. For **Device Connected** and **Device Disconnected** IoT Hub events, the data object contains the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| moduleId | string | The unique identifier of the module. This field is output only for module devices. This case-sensitive string can be up to 128 characters long, and supports ASCII 7-bit alphanumeric characters plus the following special characters: `- : . + % _ # * ? ! ( ) , = @ ; $ '`. |
| deviceConnectionStateEventInfo | object | Device connection state event information
| sequenceNumber | string | A number which helps indicate order of device connected or device disconnected events. Latest event will have a sequence number that is higher than the previous event. This number may change by more than 1, but is strictly increasing. See [how to use sequence number](../iot-hub/iot-hub-how-to-order-connection-state-events.md). |

The contents of the data object are different for each event publisher. For **Device Created** and **Device Deleted** IoT Hub events, the data object contains the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| twin | object | Information about the device twin, which is the cloud represenation of application device metadata. | 
| deviceID | string | The unique identifier of the device twin. | 
| etag | string | A validator for ensuring consistency of updates to a device twin. Each etag is guaranteed to be unique per device twin. |  
| deviceEtag| string | A validator for ensuring consistency of updates to a device registry. Each deviceEtag is guaranteed to be unique per device registry. |
| status | string | Whether the device twin is enabled or disabled. | 
| statusUpdateTime | string | The ISO8601 timestamp of the last device twin status update. |
| connectionState | string | Whether the device is connected or disconnected. | 
| lastActivityTime | string | The ISO8601 timestamp of the last activity. | 
| cloudToDeviceMessageCount | integer | Count of cloud to device messages sent to this device. | 
| authenticationType | string | Authentication type used for this device: either `SAS`, `SelfSigned`, or `CertificateAuthority`. |
| x509Thumbprint | string | The thumbprint is a unique value for the x509 certificate, commonly used to find a particular certificate in a certificate store. The thumbprint is dynamically generated using the SHA1 algorithm, and does not physically exist in the certificate. | 
| primaryThumbprint | string | Primary thumbprint for the x509 certificate. |
| secondaryThumbprint | string | Secondary thumbprint for the x509 certificate. | 
| version | integer | An integer that is incremented by one each time the device twin is updated. |
| desired | object | A portion of the properties that can be written only by the application back-end, and read by the device. | 
| reported | object | A portion of the properties that can be written only by the device, and read by the application back-end. |
| lastUpdated | string | The ISO8601 timestamp of the last device twin property update. | 

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* To learn about how IoT Hub and Event Grid work together, see [React to IoT Hub events by using Event Grid to trigger actions](../iot-hub/iot-hub-event-grid.md).