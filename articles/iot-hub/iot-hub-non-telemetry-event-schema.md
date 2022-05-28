---
title: Azure IoT Hub non-telemetry event schemas
description: This article provides the properties and schema for Azure IoT Hub non-telemetry events. It lists the available event types, an example event, and event properties.
author: kgremban
ms.author: kgremban  
ms.topic: conceptual
ms.date: 05/27/2022
ms.service: iot-hub
services: iot-hub
---

# Azure IoT Hub non-telemetry event schemas

This article provides the properties and schema for non-telemetry events emitted by Azure IoT Hub. Non-telemetry events are different from device-to-cloud and cloud-to-device messages in that they are emitted directly by IoT Hub in response to specific kinds of changes on your devices. For example, lifecycle changes like a device or module being created or deleted, or connection state changes like device connects and disconnects. To observe non-telemetry events, you must have an appropriate message route configured. To learn more about IoT Hub message routing, see [IoT Hub message routing](iot-hub-devguide-messages-d2c.md).

## Available event types

Azure IoT Hub emits the following non-telemetry event categories:

| Event category | Description |
| ---------- | ----------- |
| Device Connection State Events | Emitted when a device connects to or disconnects from an IoT hub. |
| Device Lifecycle Events | Emitted when a device or module is created on or deleted from an IoT hub. |
| Device Twin Change Events | Emitted when a device or module twin is changed or replaced. |
| Digital Twin Change Events | Emitted when a device's or module's digital twin is changed or replaced. |

## Common properties

All non-telemetry messages share several common properties.

### System properties

The following system properties are set by IoT Hub on each event. System properties should be preceded with a '$' character when referenced in a routing query.

| Property | Type |Description |
| -------- | ---- | ---------- |
| content_encoding | string | "utf-8" |
| content_type | string |"application/json" |
| correlation_id | string | c598c0e62a |
| user_id | string | contoso-routing-hub |

### Application properties

The following application properties are set by IoT Hub on each event.

| Property | Type |Description |
| -------- | ---- | ---------- |
| deviceId | string | The unique identifier of the device. This case-sensitive string can be up to 128 characters long, and supports ASCII 7-bit alphanumeric characters plus the following special characters: `- : . + % _ # * ? ! ( ) , = @ ; $ '`. |
| hubName | string | The name of the IoT Hub. |
| iothub-message-schema | string | The message schema associated with the event category; for example, "deviceLifecycleNotification". |
| moduleId | string | The unique identifier of the module. This property is output only for module lifecycle and twin events. This case-sensitive string can be up to 128 characters long, and supports ASCII 7-bit alphanumeric characters plus the following special characters: `- : . + % _ # * ? ! ( ) , = @ ; $ '`. |
| operationTimestamp | string | The ISO8601 timestamp of the operation. |
| opType | string | The identifier for the operation that generated the event. For example, "createDeviceIdentity". |

### Annotations

The following annotations are stamped by IoT Hub on each event.

| Property | Type | Description |
| -------- | ---- | ----------- |
| iothub-connection-device-id | string | The unique identifier of the device. This case-sensitive string can be up to 128 characters long, and supports ASCII 7-bit alphanumeric characters plus the following special characters: `- : . + % _ # * ? ! ( ) , = @ ; $ '`.  |
| iothub-connection-module-id | string | The unique identifier of the module. This property is output only for module life cycle and twin events. This case-sensitive string can be up to 128 characters long, and supports ASCII 7-bit alphanumeric characters plus the following special characters: `- : . + % _ # * ? ! ( ) , = @ ; $ '`. |
| iothub-enqueuedtime | integer | Description needed. 1653677358153 |
| iothub-message-source | string | A value corresponding the the event categories that identifies the message source; for example, "deviceLifecycleEvents". |
| x-opt-sequence-number  | number | Description needed. |
| x-opt-offset | string | Description needed. |
| x-opt-enqueued-time | number | Description needed. 1653677358262 |

## Device Lifecycle Events

Device lifecycle events are emitted whenever a device or module is created or deleted from the identity registry.

The following table shows how application property values are set for device lifecycle events:  

| Property | Value |
| ---- | ----------- |
| iothub-message-schema | Always set to: "deviceLifecycleNotification". |
| opType | Can be one of the following values, "createDeviceIdentity", "deleteDeviceIdentity", "createModuleIdentity", or "deleteModuleIdentity". |

The following table shows how annotations are set for device lifecycle events:

| Property | Value |
| ---- | ----------- |
| iothub-message-source |  "deviceLifecycleEvents". |

The message payload represents the twin of the target device or module identity.

### Example

The following JSON shows a device lifecycle event emitted when a module is created.

```json
{
    "event": {
        "origin": "contoso-device-2",
        "module": "module-1",
        "interface": "",
        "component": "",
        "properties": {
            "system": {
                "content_encoding": "utf-8",
                "content_type": "application/json",
                "correlation_id": "c5a4e6986c",
                "user_id": "contoso-routing-hub"
            },
            "application": {
                "hubName": "contoso-routing-hub",
                "deviceId": "contoso-device-2",
                "operationTimestamp": "2022-05-27T18:49:38.4904785Z",
                "moduleId": "module-1",
                "opType": "createModuleIdentity",
                "iothub-message-schema": "moduleLifecycleNotification"
            }
        },
        "annotations": {
            "iothub-connection-device-id": "contoso-device-2",
            "iothub-connection-module-id": "module-1",
            "iothub-enqueuedtime": 1653677378534,
            "iothub-message-source": "deviceLifecycleEvents",
            "x-opt-sequence-number": 62,
            "x-opt-offset": "31768",
            "x-opt-enqueued-time": 1653677378643
        },
        "payload": {
            "deviceId": "contoso-device-2",
            "moduleId": "module-1",
            "etag": "AAAAAAAAAAE=",
            "version": 2,
            "properties": {
                "desired": {
                    "$metadata": {
                        "$lastUpdated": "0001-01-01T00:00:00Z"
                    },
                    "$version": 1
                },
                "reported": {
                    "$metadata": {
                        "$lastUpdated": "0001-01-01T00:00:00Z"
                    },
                    "$version": 1
                }
            }
        }
    }
}
```

## Example event

# [Event Grid event schema](#tab/event-grid-event-schema)

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

The DeviceTelemetry event is raised when a telemetry event is sent to an IoT Hub. A sample schema for this event is shown below.

```json
[{
  "id": "9af86784-8d40-fe2g-8b2a-bab65e106785",
  "topic": "/SUBSCRIPTIONS/<subscription ID>/RESOURCEGROUPS/<resource group name>/PROVIDERS/MICROSOFT.DEVICES/IOTHUBS/<hub name>", 
  "subject": "devices/LogicAppTestDevice", 
  "eventType": "Microsoft.Devices.DeviceTelemetry",
  "eventTime": "2019-01-07T20:58:30.48Z",
  "data": {        
      "body": {            
          "Weather": {                
              "Temperature": 900            
          },
          "Location": "USA"        
      },
        "properties": {            
          "Status": "Active"        
        },
        "systemProperties": {            
            "iothub-content-type": "application/json",
            "iothub-content-encoding": "utf-8",
            "iothub-connection-device-id": "d1",
            "iothub-connection-auth-method": "{\"scope\":\"device\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}",
            "iothub-connection-auth-generation-id": "123455432199234570",
            "iothub-enqueuedtime": "2019-01-07T20:58:30.48Z",
            "iothub-message-source": "Telemetry"        
        }    
    },
  "dataVersion": "",
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

# [Cloud event schema](#tab/cloud-event-schema)

The schema for DeviceConnected and DeviceDisconnected events have the same structure. This sample event shows the schema of an event raised when a device is connected to an IoT hub:

```json
[{
  "id": "f6bbf8f4-d365-520d-a878-17bf7238abd8", 
  "source": "/SUBSCRIPTIONS/<subscription ID>/RESOURCEGROUPS/<resource group name>/PROVIDERS/MICROSOFT.DEVICES/IOTHUBS/<hub name>", 
  "subject": "devices/LogicAppTestDevice", 
  "type": "Microsoft.Devices.DeviceConnected", 
  "time": "2018-06-02T19:17:44.4383997Z", 
  "data": {
    "deviceConnectionStateEventInfo": {
      "sequenceNumber":
        "000000000000000001D4132452F67CE200000002000000000000000000000001"
    },
    "hubName": "egtesthub1",
    "deviceId": "LogicAppTestDevice",
    "moduleId" : "DeviceModuleID"
  }, 
  "specversion": "1.0"
}]
```

The DeviceTelemetry event is raised when a telemetry event is sent to an IoT Hub. A sample schema for this event is shown below.

```json
[{
  "id": "9af86784-8d40-fe2g-8b2a-bab65e106785",
  "source": "/SUBSCRIPTIONS/<subscription ID>/RESOURCEGROUPS/<resource group name>/PROVIDERS/MICROSOFT.DEVICES/IOTHUBS/<hub name>", 
  "subject": "devices/LogicAppTestDevice", 
  "type": "Microsoft.Devices.DeviceTelemetry",
  "time": "2019-01-07T20:58:30.48Z",
  "data": {        
      "body": {            
          "Weather": {                
              "Temperature": 900            
          },
          "Location": "USA"        
      },
        "properties": {            
          "Status": "Active"        
        },
        "systemProperties": {            
            "iothub-content-type": "application/json",
            "iothub-content-encoding": "utf-8",
            "iothub-connection-device-id": "d1",
            "iothub-connection-auth-method": "{\"scope\":\"device\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}",
            "iothub-connection-auth-generation-id": "123455432199234570",
            "iothub-enqueuedtime": "2019-01-07T20:58:30.48Z",
            "iothub-message-source": "Telemetry"        
        }    
    },
  "specversion": "1.0"
}]
```

The schema for DeviceCreated and DeviceDeleted events have the same structure. This sample event shows the schema of an event raised when a device is registered to an IoT hub:

```json
[{
  "id": "56afc886-767b-d359-d59e-0da7877166b2",
  "source": "/SUBSCRIPTIONS/<subscription ID>/RESOURCEGROUPS/<resource group name>/PROVIDERS/MICROSOFT.DEVICES/IOTHUBS/<hub name>",
  "subject": "devices/LogicAppTestDevice",
  "type": "Microsoft.Devices.DeviceCreated",
  "time": "2018-01-02T19:17:44.4383997Z",
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
  "specversion": "1.0"
}]
```

---


### Event properties

# [Event Grid event schema](#tab/event-grid-event-schema)

All events contain the same top-level data: 

| Property | Type | Description |
| -------- | ---- | ----------- |
| `id` | string | Unique identifier for the event. |
| `topic` | string | Full resource path to the event source. This field is not writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `eventType` | string | One of the registered event types for this event source. |
| `eventTime` | string | The time the event is generated based on the provider's UTC time. |
| `data` | object | IoT Hub event data.  |
| `dataVersion` | string | The schema version of the data object. The publisher defines the schema version. |
| `metadataVersion` | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

# [Cloud event schema](#tab/cloud-event-schema)

All events contain the same top-level data: 


| Property | Type | Description |
| -------- | ---- | ----------- |
| `id` | string | Unique identifier for the event. |
| `source` | string | Full resource path to the event source. This field is not writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `type` | string | One of the registered event types for this event source. |
| `time` | string | The time the event is generated based on the provider's UTC time. |
| `data` | object | IoT Hub event data.  |
| `specversion` | string | CloudEvents schema specification version. |

---

For all IoT Hub events, the data object contains the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `hubName` | string | Name of the IoT Hub where the device was created or deleted. |
| `deviceId` | string | The unique identifier of the device. This case-sensitive string can be up to 128 characters long, and supports ASCII 7-bit alphanumeric characters plus the following special characters: `- : . + % _ # * ? ! ( ) , = @ ; $ '`. |

The contents of the data object are different for each event publisher. 

For **Device Connected** and **Device Disconnected** IoT Hub events, the data object contains the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `moduleId` | string | The unique identifier of the module. This field is output only for module devices. This case-sensitive string can be up to 128 characters long, and supports ASCII 7-bit alphanumeric characters plus the following special characters: `- : . + % _ # * ? ! ( ) , = @ ; $ '`. |
| `deviceConnectionStateEventInfo` | object | Device connection state event information
| `sequenceNumber` | string | A number which helps indicate order of device connected or device disconnected events. Latest event will have a sequence number that is higher than the previous event. This number may change by more than 1, but is strictly increasing. See [how to use sequence number](../iot-hub/iot-hub-how-to-order-connection-state-events.md). |

For **Device Telemetry** IoT Hub event, the data object contains the device-to-cloud message in [IoT hub message format](../iot-hub/iot-hub-devguide-messages-construct.md) and has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `body` | string | The content of the message from the device. |
| `properties` | string | Application properties are user-defined strings that can be added to the message. These fields are optional. |
| `system properties` | string | [System properties](../iot-hub/iot-hub-devguide-routing-query-syntax.md#system-properties) help identify contents and source of the messages. Device telemetry message must be in a valid JSON format with the contentType set to JSON and contentEncoding set to UTF-8 in the message system properties. If this is not set, then IoT Hub will write the messages in base 64 encoded format.  |

For **Device Created** and **Device Deleted** IoT Hub events, the data object contains the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `twin` | object | Information about the device twin, which is the cloud representation of application device metadata. | 
| `deviceID` | string | The unique identifier of the device twin. | 
| `etag` | string | A validator for ensuring consistency of updates to a device twin. Each etag is guaranteed to be unique per device twin. |  
| `deviceEtag` | string | A validator for ensuring consistency of updates to a device registry. Each deviceEtag is guaranteed to be unique per device registry. |
| `status` | string | Whether the device twin is enabled or disabled. | 
| `statusUpdateTime` | string | The ISO8601 timestamp of the last device twin status update. |
| `connectionState` | string | Whether the device is connected or disconnected. | 
| `lastActivityTime` | string | The ISO8601 timestamp of the last activity. | 
| `cloudToDeviceMessageCount` | integer | Count of cloud to device messages sent to this device. | 
| `authenticationType` | string | Authentication type used for this device: either `SAS`, `SelfSigned`, or `CertificateAuthority`. |
| `x509Thumbprint` | string | The thumbprint is a unique value for the x509 certificate, commonly used to find a particular certificate in a certificate store. The thumbprint is dynamically generated using the SHA1 algorithm, and does not physically exist in the certificate. | 
| `primaryThumbprint` | string | Primary thumbprint for the x509 certificate. |
| `secondaryThumbprint` | string | Secondary thumbprint for the x509 certificate. | 
| `version` | integer | An integer that is incremented by one each time the device twin is updated. |
| `desired` | object | A portion of the properties that can be written only by the application back-end, and read by the device. | 
| `reported` | object | A portion of the properties that can be written only by the device, and read by the application back-end. |
| `lastUpdated` | string | The ISO8601 timestamp of the last device twin property update. | 
