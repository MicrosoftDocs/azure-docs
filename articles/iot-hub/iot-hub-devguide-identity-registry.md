---
title: Understand the Azure IoT Hub identity registry
description: This article provides a description of the IoT Hub identity registry and how to use it to manage your devices. Includes information about the import and export of device identities in bulk.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: concept-article
ms.date: 06/29/2021
ms.custom: [amqp, mqtt, 'Role: Cloud Development', 'Role: IoT Device', ignite-2022]
---

# Understand the identity registry in your IoT hub

Every IoT hub has an identity registry that stores information about the devices and modules permitted to connect to the IoT hub. Before a device or module can connect to an IoT hub, there must be an entry for that device or module in the IoT hub's identity registry. A device or module must also authenticate with the IoT hub based on credentials stored in the identity registry.

The device or module ID stored in the identity registry is case-sensitive.

At a high level, the identity registry is a REST-capable collection of device or module identity resources. When you add an entry in the identity registry, IoT Hub creates a set of per-device resources such as the queue that contains in-flight cloud-to-device messages.

Use the identity registry when you need to:

* Provision devices or modules that connect to your IoT hub.
* Control per-device/per-module access to your hub's device or module-facing endpoints.

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

* Doesn't contain any application metadata.

> [!IMPORTANT]
> Only use the identity registry for device management and provisioning operations. High throughput operations at run time should not depend on performing operations in the identity registry. For example, checking the connection state of a device before sending a command is not a supported pattern. Make sure to check the [throttling rates](iot-hub-devguide-quotas-throttling.md) for the identity registry.

> [!NOTE]
> It can take a few seconds for a device or module identity to be available for retrieval after creation. Please retry `get` operation of device or module identities in case of failures.

## Disable devices

You can disable devices by updating the **status** property of an identity in the identity registry. Typically, you use this property in two scenarios:

* During a provisioning orchestration process. For more information, see [Device Provisioning](iot-hub-devguide-identity-registry.md#device-provisioning).

* If you think a device is compromised or has become unauthorized for any reason.

   >[!IMPORTANT]
   >IoT Hub doesn't check certificate revocation lists when authenticating devices with certificate-based authentication. If you have a device that needs to be blocked from connecting to IoT Hub because of a potentially compromised certificate, you should disable the device in the identity registry.

This feature isn't available for modules.

For more information, see [Disable or delete a device in an IoT hub](./iot-hub-create-through-portal.md#disable-or-delete-a-device-in-an-iot-hub).

## Import and export device identities

Use asynchronous operations on the [IoT Hub resource provider endpoint](iot-hub-devguide-endpoints.md) to export device identities in bulk from an IoT hub's identity registry. Exports are long-running jobs that use a customer-supplied blob container to save device identity data read from the identity registry.

Use asynchronous operations on the [IoT Hub resource provider endpoint](iot-hub-devguide-endpoints.md) to import device identities in bulk to an IoT hub's identity registry. Imports are long-running jobs that use data in a customer-supplied blob container to write device identity data into the identity registry.

For more information about the import and export APIs, see [IoT Hub resource provider REST APIs](/rest/api/iothub/iothubresource). To learn more about running import and export jobs, see [Bulk management of IoT Hub device identities](iot-hub-bulk-identity-mgmt.md).

Device identities can also be exported and imported from an IoT hub by using the Service API through either the [REST API](/rest/api/iothub/service/jobs/createimportexportjob) or one of the IoT Hub [Service SDKs](./iot-hub-devguide-sdks.md#azure-iot-hub-service-sdks).

## Device provisioning

The device data that a given IoT solution stores depends on the specific requirements of that solution. But, as a minimum, a solution must store device identities and authentication keys. Azure IoT Hub includes an identity registry that can store values for each device such as IDs, authentication keys, and status codes. A solution can use other Azure services such as Table storage, Blob storage, or Azure Cosmos DB to store other device data.

*Device provisioning* is the process of adding the initial device data to the stores in your solution. To enable a new device to connect to your hub, you must add a device ID and keys to the IoT Hub identity registry. As part of the provisioning process, you might need to initialize device-specific data in other solution stores. You can also use the Azure IoT Hub Device Provisioning Service to enable zero-touch, just-in-time provisioning to one or more IoT hubs without requiring human intervention. To learn more, see the [provisioning service documentation](../iot-dps/index.yml).

## Device and module lifecycle notifications

IoT Hub can notify your IoT solution when a device identity is created or deleted by sending lifecycle notifications. To do so, your IoT solution needs to create a route and set the data source equal to *DeviceLifecycleEvents*. By default, no lifecycle notifications are sent, that is, no such routes pre-exist. By creating a route with Data Source equal to *DeviceLifecycleEvents*, lifecycle events are sent for both device identities and module identities; however, the message contents differ depending on whether the events are generated for module identities or device identities.  It should be noted that for IoT Edge modules, the module identity creation flow is different than for other modules, as a result for IoT Edge modules the create notification is only sent if the corresponding IoT Edge Device for the updated IoT Edge module identity is running. For all other modules, lifecycle notifications are sent whenever the module identity is updated on the IoT Hub side.  To learn more about the properties and body returned in the notification message, see  [Non-telemetry event schemas](iot-hub-non-telemetry-event-schema.md).

## Device identity properties

Device identities are represented as JSON documents with the following properties:

| Property | Options | Description |
| --- | --- | --- |
| deviceId |required, read-only on updates |A case-sensitive string (up to 128 characters long) of ASCII 7-bit alphanumeric characters plus certain special characters: `- . % _ * ? ! ( ) , : = @ $ '`. The special characters: `+ #` are not supported.  |
| generationId |required, read-only |An IoT hub-generated, case-sensitive string up to 128 characters long. This value is used to distinguish devices with the same **deviceId**, when they have been deleted and re-created. |
| etag |required, read-only |A string representing a weak ETag for the device identity, as per [RFC7232](https://tools.ietf.org/html/rfc7232). |
| authentication |optional |A composite object containing authentication information and security materials. For more information, see [Authentication Mechanism](/rest/api/iothub/service/devices/get-identity#authenticationmechanism) in the REST API documentation. |
| capabilities | optional | The set of capabilities of the device. For example, whether the device is an edge device or not. For more information, see [Device Capabilities](/rest/api/iothub/service/devices/get-identity#devicecapabilities) in the REST API documentation. |
| deviceScope | optional | The scope of the device. In edge devices, auto generated and immutable. Deprecated in non-edge devices. However, in child (leaf) devices, set this property to the same value as the **parentScopes** property (the **deviceScope** of the parent device) for backward compatibility with previous versions of the API. For more information, see [IoT Edge as a gateway: Parent and child relationships](../iot-edge/iot-edge-as-gateway.md#parent-and-child-relationships).|
| parentScopes | optional | The scope of a child device's direct parent (the value of the **deviceScope** property of the parent device). In edge devices, the value is empty if the device has no parent. In non-edge devices, the property isn't present if the device has no parent. For more information, see [IoT Edge as a gateway: Parent and child relationships](../iot-edge/iot-edge-as-gateway.md#parent-and-child-relationships). |
| status |required |An access indicator. Can be **Enabled** or **Disabled**. If **Enabled**, the device is allowed to connect. If **Disabled**, this device can't access any device-facing endpoint. |
| statusReason |optional |A 128 character-long string that stores the reason for the device identity status. All UTF-8 characters are allowed. |
| statusUpdateTime |read-only |A temporal indicator, showing the date and time of the last status update. |
| connectionState |read-only |A field indicating connection status: either **Connected** or **Disconnected**. This field represents the IoT Hub view of the device connection status. **Important**: This field should be used only for development/debugging purposes. The connection state is updated only for devices using MQTT or AMQP. Also, it's based on protocol-level pings (MQTT pings, or AMQP pings), and it can have a maximum delay of only 5 minutes. For these reasons, there can be false positives, such as disconnected devices reported as connected. |
| connectionStateUpdatedTime |read-only |A temporal indicator, showing the date and last time the connection state was updated. |
| lastActivityTime |read-only |A temporal indicator, showing the date and last time the device connected, received, or sent a message. This property is eventually consistent, but could be delayed up to 5 to 10 minutes. For this reason, it shouldn't be used in production scenarios. |

> [!NOTE]
> Connection state can only represent the IoT Hub view of the status of the connection. Updates to this state may be delayed, depending on network conditions and configurations.

> [!NOTE]
> Currently the device SDKs do not support using  the `+` and `#` characters in the **deviceId**.

## Module identity properties

Module identities are represented as JSON documents with the following properties:

| Property | Options | Description |
| --- | --- | --- |
| deviceId |required, read-only on updates |A case-sensitive string (up to 128 characters long) of ASCII 7-bit alphanumeric characters plus certain special characters: `- . + % _ # * ? ! ( ) , : = @ $ '`. |
| moduleId |required, read-only on updates |A case-sensitive string (up to 128 characters long) of ASCII 7-bit alphanumeric characters plus certain special characters: `- . + % _ # * ? ! ( ) , : = @ $ '`. |
| generationId |required, read-only |An IoT hub-generated, case-sensitive string up to 128 characters long. This value is used to distinguish devices with the same **deviceId**, when they've been deleted and re-created. |
| etag |required, read-only |A string representing a weak ETag for the device identity, as per [RFC7232](https://tools.ietf.org/html/rfc7232). |
| authentication |optional |A composite object containing authentication information and security materials. For more information, see [Authentication Mechanism](/rest/api/iothub/service/modules/get-identity#authenticationmechanism) in the REST API documentation. |
| managedBy | optional | Identifies who manages this module. For instance, this value is "IoT Edge" if the edge runtime owns this module. |
| cloudToDeviceMessageCount | read-only | The number of cloud-to-module messages currently queued to be sent to the module. |
| connectionState |read-only |A field indicating connection status: either **Connected** or **Disconnected**. This field represents the IoT Hub view of the device connection status. **Important**: This field should be used only for development/debugging purposes. The connection state is updated only for devices using MQTT or AMQP. Also, it's based on protocol-level pings (MQTT pings, or AMQP pings), and it can have a maximum delay of only 5 minutes. For these reasons, there can be false positives, such as disconnected devices reported as connected. |
| connectionStateUpdatedTime |read-only |A temporal indicator, showing the date and last time the connection state was updated. |
| lastActivityTime |read-only |A temporal indicator, showing the date and last time the device connected, received, or sent a message. |

> [!NOTE]
> Currently the device SDKs do not support using  the `+` and `#` characters in the **deviceId** and **moduleId**.

## Additional reference material

Other reference articles in the IoT Hub developer guide include:

* [IoT Hub endpoints](iot-hub-devguide-endpoints.md) describes the various endpoints that each IoT hub exposes for run-time and management operations.

* [Throttling and quotas](iot-hub-devguide-quotas-throttling.md) describes the quotas and throttling behaviors that apply to the IoT Hub service.

* [Azure IoT device and service SDKs](iot-hub-devguide-sdks.md) lists the various language SDKs you can use when you develop both device and service apps that interact with IoT Hub.

* [IoT Hub query language](iot-hub-devguide-query-language.md) describes the query language you can use to retrieve information from IoT Hub about your device twins and jobs.

* [IoT Hub MQTT support](../iot/iot-mqtt-connect-to-iot-hub.md) provides more information about IoT Hub support for the MQTT protocol.

## Next steps

Now that you've learned how to use the IoT Hub identity registry, you may be interested in the following IoT Hub developer guide articles:

* [Control access to IoT Hub](iot-hub-devguide-security.md)

* [Use device twins to synchronize state and configurations](iot-hub-devguide-device-twins.md)

* [Invoke a direct method on a device](iot-hub-devguide-direct-methods.md)

* [Schedule jobs on multiple devices](iot-hub-devguide-jobs.md)

To explore using the IoT Hub Device Provisioning Service to enable zero-touch, just-in-time provisioning, see:

* [Azure IoT Hub Device Provisioning Service](../iot-dps/index.yml)
