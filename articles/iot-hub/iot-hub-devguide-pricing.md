---
title: Understand Azure IoT Hub pricing | Microsoft Docs
description: Developer guide - information about how metering and pricing works with IoT Hub including worked examples.
author: eross-msft

ms.author: lizross
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 02/18/2022
ms.custom: [amqp, mqtt]
---

# Azure IoT Hub pricing information

[Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub) provides the general information on different SKUs and pricing for IoT Hub. This article contains additional details on how the various IoT Hub functionalities are metered as messages by IoT Hub.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## Charges per operation

Use the following table to help determine which operations are charged. All billable operations are charged in 4K-byte blocks on basic and standard tier IoT hubs. Operations are metered in 0.5K-byte chunks on free tier IoT hubs. Details for each category are provided in the **Billing information** column. This column includes the following information:

- Details of how billable operations are metered on basic and standard tier IoT hubs. Not all operations are available in the basic tier.
- The operations that result in charges, with either:
  - A link to the REST API documentation if it exists.
  - The operation endpoint if REST API documentation isn't available, or if the operation is only available over MQTT and/or AMQP. The endpoint value omits the leading reference to the target IoT hub; `{fully-qualified-iothubname}.azure-devices.net`.
- One or more terms in *italics* following each operation (or endpoint) that represents terms that may be returned by customer support for billable operations. These terms are provided to help customers relate them to operations that produce the associated charges. If you're not working with customer support, you can ignore them.

| Operation category | Billing information |
| --------- | ------------------- |
| Identity registry operations <br/> (create, retrieve, list, update, delete, bulk update, statistics) | Not charged. **REVIEWER IS [BULK UPDATE REGISTRY](https://docs.microsoft.com/rest/api/iothub/service/bulk-registry/update-registry) NOT CHARGED?** |
| Device-to-cloud messages | Successfully sent messages are charged in 4-KB chunks on ingress into IoT Hub. For example, a 100-byte message is charged as one message, and a 6-KB message is charged as two messages. <br/><br/> [Send Device Event](/rest/api/iothub/device/send-device-event), *Device to Cloud Telemetry*, *Device to Cloud Telemetry Routing* |
| Cloud-to-device messages | Successfully sent messages are charged in 4-KB chunks. For example, a 6-KB message is charged as 2 messages. <br/><br/> [Receive Device Bound Notification](/rest/api/iothub/device/receive-device-bound-notification), *Cloud To Device Command* |
| File uploads | File transfer to Azure Storage is not metered by IoT Hub. File transfer initiation and completion messages are charged as messaged metered in 4-KB increments. For example, transferring a 10-MB file is charged as two messages in addition to the Azure Storage cost. <br/><br/> [Create File Upload Sas Uri](/rest/api/iothub/device/create-file-upload-sas-uri), *Device To Cloud File Upload* <br/> [Update File Upload Status](/rest/api/iothub/device/update-file-upload-status), *Device To Cloud File Upload* |
| Direct methods | Successful method requests are charged in 4-KB chunks, and responses are charged in 4-KB chunks as additional messages. Requests to disconnected devices are charged as messages in 4-KB chunks. For example, a method with a 4-KB body that results in a response with no body from the device is charged as two messages. A method with a 6-KB body that results in a 1-KB response from the device is charged as two messages for the request plus another message for the response. <br/><br/> [Device - Invoke Method](/rest/api/iothub/service/devices/invoke-method), *Device Direct Invoke Method*, <br/> [Module - Invoke Method](/rest/api/iothub/service/modules/invoke-method), *Module Direct Invoke Method* |
| Device and module twin reads | Twin reads from the device or module and from the solution back end are charged as messages in 4-KB chunks. For example, reading a 8-KB twin is charged as 2 messages.   <br/><br/> [Get Twin](/rest/api/iothub/service/devices/get-twin), *Get Twin*  <br/> [Get Module Twin](/rest/api/iothub/service/modules/get-twin), *Get Module Twin* <br/><br/> Read device and module twins from a device: <br/> **Endpoint**: `/devices/{id}/twin` ([MQTT](iot-hub-mqtt-support.md#retrieving-a-device-twins-properties), AMQP only), *D2C Get Twin* <br/> **Endpoint**: `/devices/{deviceid}/modules/{moduleid}/twin` (MQTT, AMQP only), *Module D2C Get Twin* |
| Device and module twin updates (tags and properties) | Twin updates from the device or module and from the solution back end are charged as messages in 4-KB chunks. For example, a 12-KB update to a twin is charged as 3 messages.  <br/><br/> [Update Twin](/rest/api/iothub/service/devices/update-twin), *Update Twin* <br/> [Update Module Twin](/rest/api/iothub/service/modules/update-twin), *Update Module Twin* <br/> [Replace Twin](/rest/api/iothub/service/devices/replace-twin), *Replace Twin* <br/> [Replace Module Twin](/rest/api/iothub/service/modules/replace-twin), *Replace Module Twin* <br/><br/> Update device or module twin reported properties from a device: <br/> **Endpoint**: `/twin/PATCH/properties/reported/` ([MQTT](iot-hub-mqtt-support.md#update-device-twins-reported-properties), AMQP only), *D2 Patch ReportedProperties* or *Module D2 Patch ReportedProperties* <br/><br/> Receive desired properties update notifications on a device: <br/> **Endpoint**: `/twin/PATCH/properties/desired/` ([MQTT](iot-hub-mqtt-support.md#receiving-desired-properties-update-notifications), AMQP only), *D2C Notify DesiredProperties* or *Module D2C Notify DesiredProperties* |
| Device and module twin queries | Queries are charged as messages depending on the result size in 4-KB chunks. <br/><br/> [Get Twins](/rest/api/iothub/service/query/get-twins)  (query against **devices** or **devices.modules** collections), *Query Devices*  |
| Digital twin reads | Digital twin reads from the device and from the solution back end are charged as messages in 4-KB chunks. For example, reading a 8-KB twin is charged as 2 messages. <br/><br/> [Get Digital Twin](/rest/api/iothub/service/digital-twin/get-digital-twin), *Get Digital Twin* |
| Digital twin updates | Digital twin updates from the device and from the solution back end are charged as messages in 4-KB chunks. For example, reading a 12-KB twin is charged as 3 messages. <br/><br/> [Update Digital Twin](/rest/api/iothub/service/digital-twin/get-digital-twin), *Patch Digital Twin* |
| Digital twin commands | Successful commands are charged in 4-KB chunks, and responses are charged in 4-KB chunks as additional messages. Commands to disconnected devices are charged as messages in 4-KB chunks. For example, a command with a 4-KB body that results in a response with no body from the device is charged as two messages. A command with a 6-KB body that results in a 1-KB response from the device is charged as two messages for the command plus another message for the response.<br/><br/> [Invoke Component Command](/rest/api/iothub/service/digital-twin/invoke-component-command), *Digital Twin Component Command*  <br/> [Invoke Root Level Command](/rest/api/iothub/service/digital-twin/invoke-root-level-command), *Digital Twin Root Command*  |
| Jobs operations <br/> (create, cancel,retrieve) | **REVIEWER ARE ANY OF THESE OPERATIONS CHARGED? IF SO, DETAILS ARE NEEDED. IF NOT, WHY ARE THE QUERY TERMS INCLUDED?** <br/><br/> [Cancel Import Export Job](/rest/api/iothub/service/jobs/cancel-import-export-job), **REVIEWER CHARGING DETAILS NEEDED**  <br/> [Cancel Scheduled Job](/rest/api/iothub/service/jobs/cancel-scheduled-job), *Cancel Job* <br/> [Create Import Export Job](/rest/api/iothub/service/jobs/create-import-export-job) **REVIEWER CHARGING DETAILS NEEDED** <br/> [Create Scheduled Job](/rest/api/iothub/service/jobs/create-scheduled-job), *Create Job* <br/> [Get Import Export Job](/rest/api/iothub/service/jobs/get-import-export-job) **REVIEWER CHARGING DETAILS NEEDED** <br/> [Get Scheduled Job](/rest/api/iothub/service/jobs/get-scheduled-job), *Get Job* |
| Jobs per-device operations | Jobs operations (such as twin updates, and methods) are charged as normal in 4-KB chunks. For example, a job resulting in 1000 method calls with 1-KB requests and empty-body responses is charged 1000 messages. <br/> **REVIEWER: THIS CONFLICTS WITH THE INFORMATION IN DIRECT METHODS ABOVE, WHICH STATES THAT EMPTY RESPONSES ARE CHARGED AS 1 MESSAGE. WHICH IS IT?** <br/><br/> *Update Twin Device Job* <br/> *Invoke Method Device Job* |
| Jobs queries | Queries are charged as messages depending on the result size in 4-KB chunks. <br/><br/> [Query Scheduled Jobs](/rest/api/iothub/service/configuration/query-scheduled-jobs), *Query Jobs* <br/> [Get Twins](/rest/api/iothub/service/query/get-twins) (query against **jobs** collection), *Query Device Jobs*  |
| Configuration operations <br/> (create, update, list, delete, test query) | Not charged. **REVIEWER NEVER GOT CONFIRMATION ON WHETHER AND HOW TEST QUERY IS CHARGED**|
| Configuration per-device operations | Configuration operations are charged as messages in 4-KB chunks. For example, an apply configuration operation with a 6-KB body and an empty-body response is charged as two messages. <br/><br/> [Apply on Edge Device](/rest/api/iothub/service/configuration/apply-on-edge-device), *Configuration Service Apply* |
| Keep-alive messages | When using AMQP or MQTT protocols, messages exchanged to establish the connection and messages exchanged in the negotiation or to keep the connection open and alive are not charged. |
| Device streams (preview) | Device streams is in preview and operations are not yet charged. <br/><br/> **Endpoint**: `/twins/{deviceId}/streams/{streamName}`, *Device Streams* <br/> **Endpoint**: `/twins/{deviceId}/modules/{moduleId}/streams/{streamName}`, *Device Streams Module* |

> [!NOTE]
> All sizes are computed considering the payload size in bytes (protocol framing is ignored). For messages, which have properties and body, the size is computed in a protocol-agnostic way. For more information, see [IoT Hub message format](iot-hub-devguide-messages-construct.md).
>
> Maximum message sizes differ for different types of operations. To learn more, see [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md).
>
> For some operations, you can use batching and compression strategies to reduce costs. For an example using device-to-cloud telemetry, see [Example #3](#example-3).  

## Example #1

A device sends one 1-KB device-to-cloud message per minute to IoT Hub, which is then read by Azure Stream Analytics. The solution back end invokes a method (with a 512-byte payload) on the device every 10 minutes to trigger a specific action. The device responds to the method with a result of 200 bytes.

The device consumes:

* One message * 60 minutes * 24 hours = 1440 messages per day for the device-to-cloud messages.
* Two messages (request plus response) * 6 times per hour * 24 hours = 288 messages for the methods.

This calculation gives a total of 1728 messages per day.

## Example #2

A device sends one 100-KB device-to-cloud message every hour. It also updates its device twin with 1-KB payloads every four hours. The solution back end, once per day, reads the 14-KB device twin and updates it with 512-byte payloads to change configurations.

The device consumes:

* 25 (100 KB / 4 KB) messages * 24 hours for device-to-cloud messages.
* Two messages (1 KB / 0.5 KB) * six times per day for device twin updates.

This calculation gives a total of 612 messages per day.

The solution back end consumes 28 messages (14 KB / 0.5 KB) to read the device twin, plus one message to update it, for a total of 29 messages.

In total, the device and the solution back end consume 641 messages per day.

## Example #3

Depending on your scenario, batching messages can reduce your quota usage.

For example, consider a device that has a sensor that only generates 100 bytes of data each time it's read:

- If the device batches 40 sensor reads into a single device-to-cloud message with a 4-KB payload (40 * 100 bytes), then only one message is charged against quota.

- If the device sends a device-to-cloud message with a 100-byte payload for each sensor read, then it consumes 40 messages against quota for the same amount of data.

Your batching strategy will depend on your scenario and on how time-critical the data is. If you're sending large amounts of data, you can also consider implementing data compression to further reduce the impact on message quota.
