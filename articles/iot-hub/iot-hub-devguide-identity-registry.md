---
title: Understand the Azure IoT Hub identity registry | Microsoft Docs
description: Developer guide - description of the IoT Hub identity registry and how to use it to manage your devices. Includes information about the import and export of device identities in bulk.
author: dominicbetts
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 08/29/2018
ms.author: dobett
---

# Understand the identity registry in your IoT hub

Every IoT hub has an identity registry that stores information about the devices and modules permitted to connect to the IoT hub. Before a device or module can connect to an IoT hub, there must be an entry for that device or module in the IoT hub's identity registry. A device or module must also authenticate with the IoT hub based on credentials stored in the identity registry.

The device or module ID stored in the identity registry is case-sensitive.

At a high level, the identity registry is a REST-capable collection of device or module identity resources. When you add an entry in the identity registry, IoT Hub creates a set of per-device resources such as the queue that contains in-flight cloud-to-device messages.

Use the identity registry when you need to:

* Provision devices or modules that connect to your IoT hub.
* Control per-device/per-module access to your hub's device or module-facing endpoints.

> [!NOTE]
> * The identity registry does not contain any application-specific metadata.
> * Module identity and module twin is in public preview. Below feature will be supported on module identity when it's general available.
>

## Identity registry operations

The IoT Hub identity registry exposes the following operations:

* Create device or module identity
* Update device or module identity
* Retrieve device or module identity by ID
* Delete device or module identity
* List up to 1000 identities
* Export device identities to Azure blob storage
* Import device identities from Azure blob storage

All these operations can use optimistic concurrency, as specified in [RFC7232](https://tools.ietf.org/html/rfc7232).

> [!IMPORTANT]
> The only way to retrieve all identities in an IoT hub's identity registry is to use the [Export](iot-hub-devguide-identity-registry.md#import-and-export-device-identities) functionality.

An IoT Hub identity registry:

* Does not contain any application metadata.
* Can be accessed like a dictionary, by using the **deviceId** or **moduleId** as the key.
* Does not support expressive queries.

An IoT solution typically has a separate solution-specific store that contains application-specific metadata. For example, the solution-specific store in a smart building solution would record the room in which a temperature sensor is deployed.

> [!IMPORTANT]
> Only use the identity registry for device management and provisioning operations. High throughput operations at run time should not depend on performing operations in the identity registry. For example, checking the connection state of a device before sending a command is not a supported pattern. Make sure to check the [throttling rates](iot-hub-devguide-quotas-throttling.md) for the identity registry, and the [device heartbeat](iot-hub-devguide-identity-registry.md#device-heartbeat) pattern.

## Disable devices

You can disable devices by updating the **status** property of an identity in the identity registry. Typically, you use this property in two scenarios:

* During a provisioning orchestration process. For more information, see [Device Provisioning](iot-hub-devguide-identity-registry.md#device-provisioning).

* If, for any reason, you think a device is compromised or has become unauthorized.

This feature is not available for modules.

## Import and export device identities

Use asynchronous operations on the [IoT Hub resource provider endpoint](iot-hub-devguide-endpoints.md) to export device identities in bulk from an IoT hub's identity registry. Exports are long-running jobs that use a customer-supplied blob container to save device identity data read from the identity registry.

Use asynchronous operations on the [IoT Hub resource provider endpoint](iot-hub-devguide-endpoints.md) to import device identities in bulk to an IoT hub's identity registry. Imports are long-running jobs that use data in a customer-supplied blob container to write device identity data into the identity registry.

For more information about the import and export APIs, see [IoT Hub resource provider REST APIs](/rest/api/iothub/iothubresource). To learn more about running import and export jobs, see [Bulk management of IoT Hub device identities](iot-hub-bulk-identity-mgmt.md).

## Device provisioning

The device data that a given IoT solution stores depends on the specific requirements of that solution. But, as a minimum, a solution must store device identities and authentication keys. Azure IoT Hub includes an identity registry that can store values for each device such as IDs, authentication keys, and status codes. A solution can use other Azure services such as table storage, blob storage, or Cosmos DB to store any additional device data.

*Device provisioning* is the process of adding the initial device data to the stores in your solution. To enable a new device to connect to your hub, you must add a device ID and keys to the IoT Hub identity registry. As part of the provisioning process, you might need to initialize device-specific data in other solution stores. You can also use the Azure IoT Hub Device Provisioning Service to enable zero-touch, just-in-time provisioning to one or more IoT hubs without requiring human intervention. To learn more, see the [provisioning service documentation](https://azure.microsoft.com/documentation/services/iot-dps).

## Device heartbeat

The IoT Hub identity registry contains a field called **connectionState**. Only use the **connectionState** field during development and debugging. IoT solutions should not query the field at run time. For example, do not query the **connectionState** field to check if a device is connected before you send a cloud-to-device message or an SMS. We recommend subscribing to the [**device disconnected** event](iot-hub-event-grid.md#event-types) on Event Grid to get alerts and monitor the device connection state. Use this [tutorial](iot-hub-how-to-order-connection-state-events.md) to learn how to integrate Device Connected and Device Disconnected events from IoT Hub in your IoT solution.

If your IoT solution needs to know if a device is connected, you can implement the *heartbeat pattern*.
In the heartbeat pattern, the device sends device-to-cloud messages at least once every fixed amount of time (for example, at least once every hour). Therefore, even if a device does not have any data to send, it still sends an empty device-to-cloud message (usually with a property that identifies it as a heartbeat). On the service side, the solution maintains a map with the last heartbeat received for each device. If the solution does not receive a heartbeat message within the expected time from the device, it assumes that there is a problem with the device.

A more complex implementation could include the information from [Azure Monitor](../azure-monitor/index.yml) and [Azure Resource Health](../service-health/resource-health-overview.md) to identify devices that are trying to connect or communicate but failing, check [Monitor with diagnostics](iot-hub-monitor-resource-health.md) guide. When you implement the heartbeat pattern, make sure to check [IoT Hub Quotas and Throttles](iot-hub-devguide-quotas-throttling.md).

> [!NOTE]
> If an IoT solution uses the connection state solely to determine whether to send cloud-to-device messages, and messages are not broadcast to large sets of devices, consider using the simpler *short expiry time* pattern. This pattern achieves the same result as maintaining a device connection state registry using the heartbeat pattern, while being more efficient. If you request message acknowledgements, IoT Hub can notify you about which devices are able to receive messages and which are not.

## Device and module lifecycle notifications

IoT Hub can notify your IoT solution when an identity is created or deleted by sending lifecycle notifications. To do so, your IoT solution needs to create a route and to set the Data Source equal to *DeviceLifecycleEvents* or *ModuleLifecycleEvents*. By default, no lifecycle notifications are sent, that is, no such routes pre-exist. The notification message includes properties, and body.

Properties: Message system properties are prefixed with the `$` symbol.

Notification message for device:

| Name | Value |
| --- | --- |
|$content-type | application/json |
|$iothub-enqueuedtime |  Time when the notification was sent |
|$iothub-message-source | deviceLifecycleEvents |
|$content-encoding | utf-8 |
|opType | **createDeviceIdentity** or **deleteDeviceIdentity** |
|hubName | Name of IoT Hub |
|deviceId | ID of the device |
|operationTimestamp | ISO8601 timestamp of operation |
|iothub-message-schema | deviceLifecycleNotification |

Body: This section is in JSON format and represents the twin of the created device identity. For example,

```json
{
    "deviceId":"11576-ailn-test-0-67333793211",
    "etag":"AAAAAAAAAAE=",
    "properties": {
        "desired": {
            "$metadata": {
                "$lastUpdated": "2016-02-30T16:24:48.789Z"
            },
            "$version": 1
        },
        "reported": {
            "$metadata": {
                "$lastUpdated": "2016-02-30T16:24:48.789Z"
            },
            "$version": 1
        }
    }
}
```
Notification message for module:

| Name | Value |
| --- | --- |
$content-type | application/json |
$iothub-enqueuedtime |  Time when the notification was sent |
$iothub-message-source | moduleLifecycleEvents |
$content-encoding | utf-8 |
opType | **createModuleIdentity** or **deleteModuleIdentity** |
hubName | Name of IoT Hub |
moduleId | ID of the module |
operationTimestamp | ISO8601 timestamp of operation |
iothub-message-schema | moduleLifecycleNotification |

Body: This section is in JSON format and represents the twin of the created module identity. For example,

```json
{
    "deviceId":"11576-ailn-test-0-67333793211",
    "moduleId":"tempSensor",
    "etag":"AAAAAAAAAAE=",
    "properties": {
        "desired": {
            "$metadata": {
                "$lastUpdated": "2016-02-30T16:24:48.789Z"
            },
            "$version": 1
        },
        "reported": {
            "$metadata": {
                "$lastUpdated": "2016-02-30T16:24:48.789Z"
            },
            "$version": 1
        }
    }
}
```

## Device identity properties

Device identities are represented as JSON documents with the following properties:

| Property | Options | Description |
| --- | --- | --- |
| deviceId |required, read-only on updates |A case-sensitive string (up to 128 characters long) of ASCII 7-bit alphanumeric characters plus certain special characters: `- . + % _ # * ? ! ( ) , = @ $ '`. |
| generationId |required, read-only |An IoT hub-generated, case-sensitive string up to 128 characters long. This value is used to distinguish devices with the same **deviceId**, when they have been deleted and re-created. |
| etag |required, read-only |A string representing a weak ETag for the device identity, as per [RFC7232](https://tools.ietf.org/html/rfc7232). |
| auth |optional |A composite object containing authentication information and security materials. |
| auth.symkey |optional |A composite object containing a primary and a secondary key, stored in base64 format. |
| status |required |An access indicator. Can be **Enabled** or **Disabled**. If **Enabled**, the device is allowed to connect. If **Disabled**, this device cannot access any device-facing endpoint. |
| statusReason |optional |A 128 character-long string that stores the reason for the device identity status. All UTF-8 characters are allowed. |
| statusUpdateTime |read-only |A temporal indicator, showing the date and time of the last status update. |
| connectionState |read-only |A field indicating connection status: either **Connected** or **Disconnected**. This field represents the IoT Hub view of the device connection status. **Important**: This field should be used only for development/debugging purposes. The connection state is updated only for devices using MQTT or AMQP. Also, it is based on protocol-level pings (MQTT pings, or AMQP pings), and it can have a maximum delay of only 5 minutes. For these reasons, there can be false positives, such as devices reported as connected but that are disconnected. |
| connectionStateUpdatedTime |read-only |A temporal indicator, showing the date and last time the connection state was updated. |
| lastActivityTime |read-only |A temporal indicator, showing the date and last time the device connected, received, or sent a message. |

> [!NOTE]
> Connection state can only represent the IoT Hub view of the status of the connection. Updates to this state may be delayed, depending on network conditions and configurations.

> [!NOTE]
> Currently the device SDKs do not support using  the `+` and `#` characters in the **deviceId**.

## Module identity properties

Module identities are represented as JSON documents with the following properties:

| Property | Options | Description |
| --- | --- | --- |
| deviceId |required, read-only on updates |A case-sensitive string (up to 128 characters long) of ASCII 7-bit alphanumeric characters plus certain special characters: `- . + % _ # * ? ! ( ) , = @ $ '`. |
| moduleId |required, read-only on updates |A case-sensitive string (up to 128 characters long) of ASCII 7-bit alphanumeric characters plus certain special characters: `- . + % _ # * ? ! ( ) , = @ $ '`. |
| generationId |required, read-only |An IoT hub-generated, case-sensitive string up to 128 characters long. This value is used to distinguish devices with the same **deviceId**, when they have been deleted and re-created. |
| etag |required, read-only |A string representing a weak ETag for the device identity, as per [RFC7232](https://tools.ietf.org/html/rfc7232). |
| auth |optional |A composite object containing authentication information and security materials. |
| auth.symkey |optional |A composite object containing a primary and a secondary key, stored in base64 format. |
| status |required |An access indicator. Can be **Enabled** or **Disabled**. If **Enabled**, the device is allowed to connect. If **Disabled**, this device cannot access any device-facing endpoint. |
| statusReason |optional |A 128 character-long string that stores the reason for the device identity status. All UTF-8 characters are allowed. |
| statusUpdateTime |read-only |A temporal indicator, showing the date and time of the last status update. |
| connectionState |read-only |A field indicating connection status: either **Connected** or **Disconnected**. This field represents the IoT Hub view of the device connection status. **Important**: This field should be used only for development/debugging purposes. The connection state is updated only for devices using MQTT or AMQP. Also, it is based on protocol-level pings (MQTT pings, or AMQP pings), and it can have a maximum delay of only 5 minutes. For these reasons, there can be false positives, such as devices reported as connected but that are disconnected. |
| connectionStateUpdatedTime |read-only |A temporal indicator, showing the date and last time the connection state was updated. |
| lastActivityTime |read-only |A temporal indicator, showing the date and last time the device connected, received, or sent a message. |

> [!NOTE]
> Currently the device SDKs do not support using  the `+` and `#` characters in the **deviceId** and **moduleId**.

## Additional reference material

Other reference topics in the IoT Hub developer guide include:

* [IoT Hub endpoints](iot-hub-devguide-endpoints.md) describes the various endpoints that each IoT hub exposes for run-time and management operations.

* [Throttling and quotas](iot-hub-devguide-quotas-throttling.md) describes the quotas and throttling behaviors that apply to the IoT Hub service.

* [Azure IoT device and service SDKs](iot-hub-devguide-sdks.md) lists the various language SDKs you can use when you develop both device and service apps that interact with IoT Hub.

* [IoT Hub query language](iot-hub-devguide-query-language.md) describes the query language you can use to retrieve information from IoT Hub about your device twins and jobs.

* [IoT Hub MQTT support](iot-hub-mqtt-support.md) provides more information about IoT Hub support for the MQTT protocol.

## Next steps

Now that you have learned how to use the IoT Hub identity registry, you may be interested in the following IoT Hub developer guide topics:

* [Control access to IoT Hub](iot-hub-devguide-security.md)

* [Use device twins to synchronize state and configurations](iot-hub-devguide-device-twins.md)

* [Invoke a direct method on a device](iot-hub-devguide-direct-methods.md)

* [Schedule jobs on multiple devices](iot-hub-devguide-jobs.md)

To try out some of the concepts described in this article, see the following IoT Hub tutorial:

* [Get started with Azure IoT Hub](quickstart-send-telemetry-dotnet.md)

To explore using the IoT Hub Device Provisioning Service to enable zero-touch, just-in-time provisioning, see: 

* [Azure IoT Hub Device Provisioning Service](https://azure.microsoft.com/documentation/services/iot-dps)
