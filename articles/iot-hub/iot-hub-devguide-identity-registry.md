---
title: Understand the Azure IoT Hub identity registry | Microsoft Docs
description: Developer guide - description of the IoT Hub identity registry and how to use it to manage your devices. Includes information about the import and export of device identities in bulk.
services: iot-hub
documentationcenter: .net
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 0706eccd-e84c-4ae7-bbd4-2b1a22241147
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/04/2017
ms.author: dobett
ms.custom: H1Hack27Feb2017

---
# Understand identity registry in your IoT hub

## Overview

Every IoT hub has an identity registry that stores information about the devices that are permitted to connect to the IoT hub. Before a device can connect to an IoT hub, there must be an entry for that device in the IoT hub's identity registry. A device must also authenticate with the IoT hub based on credentials stored in the identity registry.

At a high level, the identity registry is a REST-capable collection of device identity resources. When you add an entry to the identity registry, IoT Hub creates a set of per-device resources in the service such as the queue that contains in-flight cloud-to-device messages.

### When to use

Use the identity registry when you need to provision devices that connect to your IoT hub and when you need to control per-device access to your hub's device-facing endpoints.

> [!NOTE]
> The identity registry does not contain any application-specific metadata.

## Identity registry operations

The IoT Hub identity registry exposes the following operations:

* Create device identity
* Update device identity
* Retrieve device identity by ID
* Delete device identity
* List up to 1000 identities
* Export all identities to Azure blob storage
* Import identities from Azure blob storage

All these operations can use optimistic concurrency, as specified in [RFC7232][lnk-rfc7232].

> [!IMPORTANT]
> The only way to retrieve all identities in an IoT hub's identity registry is to use the [Export][lnk-export] functionality.

An IoT Hub identity registry:

* Does not contain any application metadata.
* Can be accessed like a dictionary, by using the **deviceId** as the key.
* Does not support expressive queries.

An IoT solution typically has a separate solution-specific store that contains application-specific metadata. For example, the solution-specific store in a smart building solution would record the room in which a temperature sensor is deployed.

> [!IMPORTANT]
> Only use the identity registry for device management and provisioning operations. High throughput operations at run time should not depend on performing operations in the identity registry. For example, checking the connection state of a device before sending a command is not a supported pattern. Make sure to check the [throttling rates][lnk-quotas] for the identity registry, and the [device heartbeat][lnk-guidance-heartbeat] pattern.

## Disable devices

You can disable devices by updating the **status** property of an identity in the identity registry. Typically, you use this property in two scenarios:

* During a provisioning orchestration process. For more information, see [Device Provisioning][lnk-guidance-provisioning].
* If, for any reason, you consider a device is compromised or has become unauthorized.

## Import and export device identities

You can export device identities in bulk from an IoT hub's identity registry, by using asynchronous operations on the [IoT Hub resource provider endpoint][lnk-endpoints]. Exports are long-running jobs that use a customer-supplied blob container to save device identity data read from the identity registry.

You can import device identities in bulk to an IoT hub's identity registry, by using asynchronous operations on the [IoT Hub resource provider endpoint][lnk-endpoints]. Imports are long-running jobs that use data in a customer-supplied blob container to write device identity data into the identity registry.

* For detailed information about the import and export APIs, see [IoT Hub resource provider REST APIs][lnk-resource-provider-apis].
* To learn more about running import and export jobs, see [Bulk management of IoT Hub device identities][lnk-bulk-identity].

## Device provisioning

The device data that a given IoT solution stores depends on the specific requirements of that solution. But, as a minimum, a solution must store device identities and authentication keys. Azure IoT Hub includes an identity registry that can store values for each device such as IDs, authentication keys, and status codes. A solution can use other Azure services such as Azure table storage, Azure blob storage, or Azure DocumentDB to store any additional device data.

*Device provisioning* is the process of adding the initial device data to the stores in your solution. To enable a new device to connect to your hub, you must add a device ID and keys to the IoT Hub identity registry. As part of the provisioning process, you might need to initialize device-specific data in other solution stores.

## Device heartbeat

The IoT Hub identity registry contains a field called **connectionState**. Only use the **connectionState** field during development and debugging. IoT solutions should not query the field at run time (for example, to check if a device is connected to decide whether to send a cloud-to-device message or an SMS).

If your IoT solution needs to know if a device is connected (either at run time, or with more accuracy than the **connectionState** property provides), you should implement the *heartbeat pattern*.

In the heartbeat pattern, the device sends device-to-cloud messages at least once every fixed amount of time (for example, at least once every hour). Therefore, even if a device does not have any data to send, it still sends an empty device-to-cloud message (usually with a property that identifies it as a heartbeat). On the service side, the solution maintains a map with the last heartbeat received for each device. The solution assumes that there is a problem with a device if it does not receive a heartbeat message within the expected time.

A more complex implementation could include the information from [operations monitoring][lnk-devguide-opmon] to identify devices that are trying to connect or communicate but failing. When you implement the heartbeat pattern, make sure to check [IoT Hub Quotas and Throttles][lnk-quotas].

> [!NOTE]
> If an IoT solution needs the device connection state solely to determine whether to send cloud-to-device messages, and messages are not broadcast to large sets of devices, a simpler pattern to consider is using a short Expiry time. This pattern achieves the same result as maintaining a device connection state registry using the heartbeat pattern, while being more efficient. It is also possible, by requesting message acknowledgements, to be notified by IoT Hub of which devices are able to receive messages and which are not online or are failed.

## Reference topics:

The following reference topics provide you with more information about the identity registry.

## Device identity properties

Device identities are represented as JSON documents with the following properties:

| Property | Options | Description |
| --- | --- | --- |
| deviceId |required, read-only on updates |A case-sensitive string (up to 128 characters long) of ASCII 7-bit alphanumeric characters + `{'-', ':', '.', '+', '%', '_', '#', '*', '?', '!', '(', ')', ',', '=', '@', ';', '$', '''}`. |
| generationId |required, read-only |An IoT hub-generated, case-sensitive string up to 128 characters long. This value is used to distinguish devices with the same **deviceId**, when they have been deleted and re-created. |
| etag |required, read-only |A string representing a weak ETag for the device identity, as per [RFC7232][lnk-rfc7232]. |
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

## Additional reference material

Other reference topics in the IoT Hub developer guide include:

* [IoT Hub endpoints][lnk-endpoints] describes the various endpoints that each IoT hub exposes for run-time and management operations.
* [Throttling and quotas][lnk-quotas] describes the quotas that apply to the IoT Hub service and the throttling behavior to expect when you use the service.
* [Azure IoT device and service SDKs][lnk-sdks] lists the various language SDKs you can use when you develop both device and service apps that interact with IoT Hub.
* [IoT Hub query language for device twins and jobs][lnk-query] describes the IoT Hub query language you can use to retrieve information from IoT Hub about your device twins and jobs.
* [IoT Hub MQTT support][lnk-devguide-mqtt] provides more information about IoT Hub support for the MQTT protocol.

## Next steps

Now you have learned how to use the IoT Hub identity registry, you may be interested in the following IoT Hub developer guide topics:

* [Control access to IoT Hub][lnk-devguide-security]
* [Use device twins to synchronize state and configurations][lnk-devguide-device-twins]
* [Invoke a direct method on a device][lnk-devguide-directmethods]
* [Schedule jobs on multiple devices][lnk-devguide-jobs]

If you would like to try out some of the concepts described in this article, you may be interested in the following IoT Hub tutorial:

* [Get started with Azure IoT Hub][lnk-getstarted-tutorial]

<!-- Links and images -->

[lnk-endpoints]: iot-hub-devguide-endpoints.md
[lnk-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-sdks]: iot-hub-devguide-sdks.md
[lnk-query]: iot-hub-devguide-query-language.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md
[lnk-resource-provider-apis]: https://docs.microsoft.com/rest/api/iothub/iothubresource
[lnk-guidance-provisioning]: iot-hub-devguide-identity-registry.md#device-provisioning
[lnk-guidance-heartbeat]: iot-hub-devguide-identity-registry.md#device-heartbeat
[lnk-rfc7232]: https://tools.ietf.org/html/rfc7232
[lnk-bulk-identity]: iot-hub-bulk-identity-mgmt.md
[lnk-export]: iot-hub-devguide-identity-registry.md#import-and-export-device-identities
[lnk-devguide-opmon]: iot-hub-operations-monitoring.md

[lnk-devguide-security]: iot-hub-devguide-security.md
[lnk-devguide-device-twins]: iot-hub-devguide-device-twins.md
[lnk-devguide-directmethods]: iot-hub-devguide-direct-methods.md
[lnk-devguide-jobs]: iot-hub-devguide-jobs.md

[lnk-getstarted-tutorial]: iot-hub-csharp-csharp-getstarted.md
