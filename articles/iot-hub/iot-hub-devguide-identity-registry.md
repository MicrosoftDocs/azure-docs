---
title: Understand the Azure IoT Hub identity registry
description: This article provides a description of the IoT Hub identity registry and how to use it to manage your devices. Includes information about the import and export of device identities in bulk.
author: SoniaLopezBravo

ms.author: sonialopez
ms.service: azure-iot-hub
ms.topic: concept-article
ms.date: 03/28/2025
ms.custom: [amqp, mqtt, "Role: Cloud Development", "Role: IoT Device"]
---

# Understand the identity registry in your IoT hub

Every IoT hub has an identity registry that stores information about the devices and modules permitted to connect to that IoT hub. Before a device or module can connect to an IoT hub, there must be an entry for that device or module in the IoT hub's identity registry. A device or module authenticates with the IoT hub based on credentials stored in the identity registry.

The device ID or module ID stored in the identity registry is case-sensitive.

The identity registry is a REST-capable collection of identity resources. When you add an entry in the identity registry, IoT Hub creates a set of per-device resources such as the queue that contains in-flight cloud-to-device messages.

Use the identity registry to:

* Provision devices or modules that connect to your IoT hub.
* Control per-device/per-module access to your hub's endpoints.

## Identity registry operations

The IoT Hub identity registry exposes the following operations:

* Create identity
* Update identity
* Retrieve identity by ID
* Delete identity
* List up to 1,000 identities
* Export identities to Azure blob storage
* Import identities from Azure blob storage

All these operations can use optimistic concurrency, as specified in [RFC 7232](https://tools.ietf.org/html/rfc7232).

An IoT Hub identity registry doesn't contain any application metadata.

> [!IMPORTANT]
> Only use the identity registry for device management and provisioning operations. High throughput operations at run time shouldn't depend on performing operations in the identity registry. For example, checking the connection state of a device before sending a command isn't a supported pattern. Make sure to check the [throttling rates](iot-hub-devguide-quotas-throttling.md) for the identity registry.

> [!NOTE]
> It can take a few seconds for a device or module identity to be available for retrieval after creation. If failures occur, you can retry the `get` operation of device or module identities.

## Disable devices

You can disable devices by updating the **status** property of an identity in the identity registry. Typically, you use this property in two scenarios:

* During a provisioning orchestration process. For more information, see [Device Provisioning](iot-hub-devguide-identity-registry.md#device-provisioning).

* If you think a device is compromised or unauthorized for any reason.

   >[!IMPORTANT]
   >IoT Hub doesn't check certificate revocation lists when authenticating devices with certificate-based authentication. If you have a device that needs to be blocked from connecting to IoT Hub because of a potentially compromised certificate, you should disable the device in the identity registry.

This feature isn't available for modules.

For more information, see the [Disable or delete a device](./create-connect-device.md#disable-or-delete-a-device) section of [Create and manage device identities](create-connect-device.md).

## Import and export device identities

The only way to retrieve all identities in an IoT hub's identity registry is to use the export functionality.

Use asynchronous operations on the [IoT Hub resource provider endpoint](iot-hub-devguide-endpoints.md) to import or export device identities in bulk from an IoT hub's identity registry. Imports and exports are long-running jobs that use a customer-supplied blob container.

For more information about the import and export APIs, see [IoT Hub Resource](/rest/api/iothub/iothubresource). To learn more about running import and export jobs, see [Import and export IoT Hub device identities in bulk](iot-hub-bulk-identity-mgmt.md).

Device identities can also be exported and imported from an IoT hub by using the Service API through either the [REST API](/rest/api/iothub/service/jobs/createimportexportjob) or one of the IoT Hub [service SDKs](./iot-hub-devguide-sdks.md#azure-iot-hub-service-sdks).

## Device provisioning

The device data that a given IoT solution stores depends on the specific requirements of that solution. But, as a minimum, a solution must store device identities and authentication keys. The IoT Hub identity registry can store values for each device such as IDs, authentication keys, and status codes. A solution can use other Azure services such as Table storage, Blob storage, or Azure Cosmos DB to store other device data.

*Device provisioning* is the process of adding the initial device data to the stores in your solution. To enable a new device to connect to your hub, you add a device ID and keys to the IoT Hub identity registry. As part of the provisioning process, you might need to initialize device-specific data in other solution stores. You can also use the Azure IoT Hub Device Provisioning Service to enable zero-touch, just-in-time provisioning to one or more IoT hubs. For more information, see [Azure IoT Hub Device Provisioning Service Documentation](../iot-dps/index.yml).

## Device and module lifecycle notifications

IoT Hub can notify your IoT solution when a device identity is created or deleted by sending lifecycle notifications. To do so, your IoT solution needs to create a route and set the data source equal to *DeviceLifecycleEvents*. By default, no lifecycle notifications are sent, that is, no such routes preexist. When you create a route with data source equal to *DeviceLifecycleEvents*, lifecycle events are sent for both device identities and module identities. The message contents differ depending on whether the events are generated for module identities or device identities. For more information about the properties and body returned in the notification message, see [Azure IoT Hub non-telemetry event schemas](iot-hub-non-telemetry-event-schema.md).

Notifications for module identity creation are different for IoT Edge modules than for other modules. For IoT Edge modules, the creation notification is only sent if the corresponding IoT Edge device is running. For all other modules, lifecycle notifications are sent whenever the module identity is updated on the IoT Hub side.

## Device identity properties

Device identities are represented as JSON documents with the following properties:

| Property | Options | Description |
| --- | --- | --- |
| deviceId |required, read-only on updates |A case-sensitive string (up to 128 characters long) of ASCII 7-bit alphanumeric characters plus certain special characters: `- . % _ * ? ! ( ) , : = @ $ '`. The special characters `+ #` aren't supported.  |
| generationId |required, read-only |An IoT Hub-generated, case-sensitive string up to 128 characters long. This value is used to distinguish devices with the same **deviceId**, when they're deleted and re-created. |
| etag |required, read-only |A string representing a weak ETag for the device identity, as per [RFC 7232](https://tools.ietf.org/html/rfc7232). |
| authentication |optional |A composite object containing authentication information and security materials. For more information, see [AuthenticationMechanism](/rest/api/iothub/service/devices/get-identity#authenticationmechanism) in the REST API documentation. |
| capabilities | optional | The set of capabilities of the device. For example, whether the device is an edge device or not. For more information, see [DeviceCapabilities](/rest/api/iothub/service/devices/get-identity#devicecapabilities) in the REST API documentation. |
| deviceScope | optional | The scope of the device. In edge devices, auto generated and immutable. Deprecated in nonedge devices. However, in child (leaf) devices, set this property to the same value as the **parentScopes** property (the **deviceScope** of the parent device) for backward compatibility with previous versions of the API. For more information, see the [Parent and child relationships](../iot-edge/iot-edge-as-gateway.md#parent-and-child-relationships) section of [How an IoT Edge device can be used as a gateway](../iot-edge/iot-edge-as-gateway.md).|
| parentScopes | optional | The scope of a child device's direct parent (the value of the **deviceScope** property of the parent device). In edge devices, the value is empty if the device has no parent. In nonedge devices, the property isn't present if the device has no parent. For more information, see the [Parent and child relationships](../iot-edge/iot-edge-as-gateway.md#parent-and-child-relationships) section of [How an IoT Edge device can be used as a gateway](../iot-edge/iot-edge-as-gateway.md).|
| status |required |An access indicator. Can be `Enabled` or `Disabled`. If `Enabled`, the device is allowed to connect. If `Disabled`, the device can't access any device-facing endpoint. |
| statusReason |optional |A 128 character-long string that stores the reason for the device identity status. All UTF-8 characters are allowed. |
| statusUpdateTime |read-only |A temporal indicator, showing the date and time of the last status update. |
| connectionState |read-only |A field indicating connection status: either `Connected` or `Disconnected`. This field represents the IoT Hub view of the device connection status. **Important**: This field should be used only for development/debugging purposes. The connection state is updated only for devices using MQTT or AMQP. Also, it's based on protocol-level pings (MQTT pings, or AMQP pings), and it can have a maximum delay of only 5 minutes. For these reasons, there can be false positives, such as disconnected devices reported as connected. |
| connectionStateUpdatedTime |read-only |A temporal indicator, showing the date and last time the connection state was updated. |
| lastActivityTime |read-only |A temporal indicator, showing the date and last time the device connected, received, or sent a message. This property is eventually consistent, but could be delayed up to 5 to 10 minutes. For this reason, it shouldn't be used in production scenarios. |

> [!NOTE]
> Connection state can only represent the IoT Hub view of the status of the connection. Updates to this state might be delayed, depending on network conditions and configurations.

## Module identity properties

Module identities are represented as JSON documents with the following properties:

| Property | Options | Description |
| --- | --- | --- |
| deviceId |required, read-only on updates |A case-sensitive string (up to 128 characters long) of ASCII 7-bit alphanumeric characters plus certain special characters: `- . % _ * ? ! ( ) , : = @ $ '`. |
| moduleId |required, read-only on updates |A case-sensitive string (up to 128 characters long) of ASCII 7-bit alphanumeric characters plus certain special characters: `- . % _ * ? ! ( ) , : = @ $ '`. The special characters `+ #` aren't supported. |
| generationId |required, read-only |An IoT hub-generated, case-sensitive string up to 128 characters long. This value is used to distinguish devices with the same **deviceId**, when they're deleted and re-created. |
| etag |required, read-only |A string representing a weak ETag for the device identity, as per [RFC 7232](https://tools.ietf.org/html/rfc7232). |
| authentication |optional |A composite object containing authentication information and security materials. For more information, see [AuthenticationMechanism](/rest/api/iothub/service/modules/get-identity#authenticationmechanism) in the REST API documentation. |
| managedBy | optional | Identifies who manages this module. For instance, this value is `IoT Edge` if the edge runtime owns this module. |
| cloudToDeviceMessageCount | read-only | The number of cloud-to-module messages currently queued to be sent to the module. |
| connectionState |read-only |A field indicating connection status: either `Connected` or `Disconnected`. This field represents the IoT Hub view of the device connection status. **Important**: This field should be used only for development/debugging purposes. The connection state is updated only for devices using MQTT or AMQP. Also, it's based on protocol-level pings (MQTT pings, or AMQP pings), and it can have a maximum delay of only 5 minutes. For these reasons, there can be false positives, such as disconnected devices reported as connected. |
| connectionStateUpdatedTime |read-only |A temporal indicator, showing the date and last time the connection state was updated. |
| lastActivityTime |read-only |A temporal indicator, showing the date and last time the device connected, received, or sent a message. |

## Related content

* [IoT Hub endpoints](iot-hub-devguide-endpoints.md) describes the various endpoints that each IoT hub exposes for run-time and management operations.

* [Azure IoT Hub SDKs](iot-hub-devguide-sdks.md) lists the various language SDKs you can use when you develop both device and service apps that interact with IoT Hub.

* [IoT Hub query language for device and module twins, jobs, and message routing](iot-hub-devguide-query-language.md) describes the query language you can use to retrieve information from IoT Hub about your device twins and jobs.

* [Understand and use device twins in IoT Hub](iot-hub-devguide-device-twins.md)

To explore using the IoT Hub Device Provisioning Service to enable zero-touch, just-in-time provisioning, see:

* [Azure IoT Hub Device Provisioning Service Documentation](../iot-dps/index.yml)
