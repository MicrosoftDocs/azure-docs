---
title: Understand Azure IoT Hub pricing
description: This article provides information about how metering and pricing works with IoT Hub including worked examples.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: concept-article
ms.date: 02/09/2023
ms.custom: [amqp, mqtt]
---

# Azure IoT Hub billing information

[Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub) provides the general information on different SKUs and pricing for IoT Hub. This article contains details on how the various IoT Hub functionalities are metered as messages by IoT Hub.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## Charges per operation

Use the following table to help determine which operations are charged. All billable operations are charged in 4K-byte blocks on basic and standard tier IoT hubs. Operations are metered in 0.5K-byte chunks on free tier IoT hubs. Details for each category are provided in the **Billing information** column. This column includes the following information:

- Details of how billable operations are metered on basic and standard tier IoT hubs. Not all operations are available in the basic tier.
- The operations that result in charges, with either:
  - A link to the REST API documentation if it exists.
  - The operation endpoint if REST API documentation isn't available, or if the operation is only available over MQTT and/or AMQP. The endpoint value omits the leading reference to the target IoT hub; `{fully-qualified-iothubname}.azure-devices.net`.
- One or more terms in *italics* following each operation (or endpoint). These terms represent billable operations that are charged against quota for your IoT hub. You may see these terms supplied as part of a quota usage insight when you initiate a support request on Azure portal. They may also be returned by customer support. You can use the table below to cross-reference these terms with the corresponding operation to help you understand quota usage and billing for your IoT solution. For more information, see [Example 4](#example-4).

| Operation category | Billing information |
| --------- | ------------------- |
| Identity registry operations <br/> (create, update, get, list, delete, bulk update, statistics) | Not charged. |
| Device-to-cloud messages | Successfully sent messages are charged in 4-KB chunks on ingress into IoT Hub. For example, a 100-byte message is charged as one message, and a 6-KB message is charged as two messages. <br/><br/> [Send Device Event](/rest/api/iothub/device/send-device-event): either *Device to Cloud Telemetry* or *Device to Cloud Telemetry Routing* depending on whether the IoT hub has message routing features configured. |
| Cloud-to-device messages | Successfully sent messages are charged in 4-KB chunks. For example, a 6-KB message is charged as two messages. <br/><br/> [Receive Device Bound Notification](/rest/api/iothub/device/receive-device-bound-notification): *Cloud To Device Command* |
| File uploads | File transfer to Azure Storage isn't metered by IoT Hub. File transfer initiation and completion messages are charged as messaged metered in 4-KB increments. For example, transferring a 10-MB file is charged as two messages in addition to the Azure Storage cost. <br/><br/> [Create File Upload Sas Uri](/rest/api/iothub/device/create-file-upload-sas-uri): *Device To Cloud File Upload* <br/> [Update File Upload Status](/rest/api/iothub/device/update-file-upload-status): *Device To Cloud File Upload* |
| Direct methods | Successful method requests are charged in 4-KB chunks, and responses are charged in 4-KB chunks as additional messages. Requests or responses with no payload are charged as one message. For example, a method with a 4-KB body that results in a response with no payload from the device is charged as two messages. A method with a 6-KB body that results in a 1-KB response from the device is charged as two messages for the request plus another message for the response. Requests to disconnected devices are charged as messages in 4-KB chunks plus one message for a response that indicates the device isn't online. <br/><br/> [Device - Invoke Method](/rest/api/iothub/service/devices/invoke-method): *Device Direct Invoke Method*, <br/> [Module - Invoke Method](/rest/api/iothub/service/modules/invoke-method): *Module Direct Invoke Method* |
| Device and module twin reads | Twin reads from the device or module and from the solution back end are charged as messages in 4-KB chunks. For example, reading an 8-KB twin is charged as two messages.   <br/><br/> [Get Twin](/rest/api/iothub/service/devices/get-twin): *Get Twin*  <br/> [Get Module Twin](/rest/api/iothub/service/modules/get-twin): *Get Module Twin* <br/><br/> Read device and module twins from a device: <br/> **Endpoint**: `/devices/{id}/twin` ([MQTT](../iot/iot-mqtt-connect-to-iot-hub.md#retrieving-a-device-twins-properties), AMQP only): *D2C Get Twin* <br/> **Endpoint**: `/devices/{deviceid}/modules/{moduleid}/twin` (MQTT, AMQP only): *Module D2C Get Twin* |
| Device and module twin updates (tags and properties) | Twin updates from the device or module and from the solution back end are charged as messages in 4-KB chunks. For example, a 12-KB update to a twin is charged as three messages.  <br/><br/> [Update Twin](/rest/api/iothub/service/devices/update-twin): *Update Twin* <br/> [Update Module Twin](/rest/api/iothub/service/modules/update-twin): *Update Module Twin* <br/> [Replace Twin](/rest/api/iothub/service/devices/replace-twin): *Replace Twin* <br/> [Replace Module Twin](/rest/api/iothub/service/modules/replace-twin): *Replace Module Twin* <br/><br/> Update device or module twin reported properties from a device: <br/> **Endpoint**: `/twin/PATCH/properties/reported/` ([MQTT](../iot/iot-mqtt-connect-to-iot-hub.md#update-device-twins-reported-properties), AMQP only): *D2 Patch ReportedProperties* or *Module D2 Patch ReportedProperties* <br/><br/> Receive desired properties update notifications on a device: <br/> **Endpoint**: `/twin/PATCH/properties/desired/` ([MQTT](../iot/iot-mqtt-connect-to-iot-hub.md#receiving-desired-properties-update-notifications), AMQP only): *D2C Notify DesiredProperties* or *Module D2C Notify DesiredProperties* |
| Device and module twin queries | Queries against **devices** or **devices.modules** are charged as messages depending on the result size in 4-KB chunks. Queries against **jobs** aren't charged. <br/><br/> [Get Twins](/rest/api/iothub/service/query/get-twins)  (query against **devices** or **devices.modules** collections): *Query Devices* |
| Digital twin reads | Digital twin reads from the solution back end are charged as messages in 4-KB chunks. For example, reading an 8-KB twin is charged as two messages. <br/><br/> [Get Digital Twin](/rest/api/iothub/service/digital-twin/get-digital-twin): *Get Digital Twin* |
| Digital twin updates | Digital twin updates from the solution back end are charged as messages in 4-KB chunks. For example, a 12-KB update to a twin is charged as three messages. <br/><br/> [Update Digital Twin](/rest/api/iothub/service/digital-twin/update-digital-twin): *Patch Digital Twin* |
| Digital twin commands | Successful commands are charged in 4-KB chunks, and responses are charged in 4-KB chunks as additional messages.  Requests or responses with no body are charged as one message. For example, a command with a 4-KB body that results in a response with no body from the device is charged as two messages. A command with a 6-KB body that results in a 1-KB response from the device is charged as two messages for the command plus another message for the response. Commands to disconnected devices are charged as messages in 4-KB chunks plus one message for a response that indicates the device isn't online. <br/><br/> [Invoke Component Command](/rest/api/iothub/service/digital-twin/invoke-component-command): *Digital Twin Component Command*  <br/> [Invoke Root Level Command](/rest/api/iothub/service/digital-twin/invoke-root-level-command): *Digital Twin Root Command*  |
| Jobs operations <br/> (create, cancel, get, query) | Not charged. |
| Jobs per-device operations | Jobs operations (such as twin updates, and methods) are charged in 4-KB chunks. For example, a job resulting in 1000 method calls with 1-KB requests and empty-payload responses is charged 2000 messages (one message for each request and response). <br/><br/> *Update Twin Device Job* <br/> *Invoke Method Device Job* |
| Configuration operations <br/> (create, update, get, list, delete, test query) | Not charged.|
| Configuration per-device operations | Configuration operations are charged as messages in 4-KB chunks. Responses aren't charged. For example, an apply configuration operation with a 6-KB body is charged as two messages. <br/><br/> [Apply on Edge Device](/rest/api/iothub/service/configuration/apply-on-edge-device): *Configuration Service Apply*. |
| Keep-alive messages | When using AMQP or MQTT protocols, messages exchanged to establish the connection and messages exchanged in the negotiation, or to keep the connection open and alive, aren't charged. |
| Device streams (preview) | Device streams is in preview and operations aren't charged yet. <br/><br/> **Endpoint**: `/twins/{deviceId}/streams/{streamName}`: *Device Streams* <br/> **Endpoint**: `/twins/{deviceId}/modules/{moduleId}/streams/{streamName}`: *Device Streams Module* |

> [!NOTE]
> All sizes are computed considering the payload size in bytes (protocol framing is ignored). For messages, which have properties and body, the size is computed in a protocol-agnostic way. For more information, see [IoT Hub message format](iot-hub-devguide-messages-construct.md).
>
> Maximum message sizes differ for different types of operations. To learn more, see [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md).
>
> For some operations, you can use batching and compression strategies to reduce costs. For an example using device-to-cloud telemetry, see [Example #3](#example-3).  

## Example #1

A device sends one 1-KB device-to-cloud message per minute to IoT Hub, which is then read by Azure Stream Analytics. The solution back end invokes a method (with a 512-byte payload) on the device every 10 minutes to trigger a specific action. The device responds to the method with a result of 200 bytes.

The device consumes:

- One message * 60 minutes * 24 hours = 1440 messages per day for the device-to-cloud messages.

- Two messages (request plus response) * 6 times per hour * 24 hours = 288 messages for the methods.

This calculation gives a total of 1728 messages per day.

## Example #2

A device sends one 100-KB device-to-cloud message every hour. It also updates its device twin with 1-KB payloads every four hours. The solution back end, once per day, reads the 14-KB device twin and updates it with 512-byte payloads to change configurations.

The device consumes:

- 25 (100 KB / 4 KB) messages * 24 hours for device-to-cloud messages.

- One message (1 KB / 4 KB) * six times per day for device twin updates.

This calculation gives a total of 606 messages per day.

The solution back end consumes 4 messages (14 KB / 4 KB) to read the device twin, plus one message (512 / 4 KB) to update it, for a total of 5 messages.

In total, the device and the solution back end consume 611 messages per day.

## Example #3

Depending on your scenario, batching messages can reduce your quota usage.

For example, consider a device that has a sensor that only generates 100 bytes of data each time it's read:

- If the device batches 40 sensor reads into a single device-to-cloud message with a 4-KB payload (40 * 100 bytes), then only one message is charged against quota. If the device reads the sensor 40 times each hour and batches those reads into a single device-to-cloud message per hour, it would send 24 messages/day.

- If the device sends a device-to-cloud message with a 100-byte payload for each sensor read, then it consumes 40 messages against quota for the same amount of data. If the device reads the sensor 40 times each hour and sends each message individually, it would send 960 messages/day (40 messages * 24).

Your batching strategy depends on your scenario and on how time-critical the data is. If you're sending large amounts of data, you can also consider implementing data compression to further reduce the impact on message quota.

## Example #4

When you open a support request on Azure portal, diagnostics specific to your reported issue are run. The result is displayed as an insight on the **Solutions** tab of your request. One such insight reports quota usage for your IoT hub using the terms in italics in the table earlier. Whether this particular insight is returned will depend on the results of the diagnostics performed on your IoT hub for the problem you're reporting. If the quota usage insight is reported, you can use the table to cross-reference the reported usage term or terms with the operation(s) that they refer to.

For example, the following screenshot shows a support request initiated for a problem with device-to-cloud telemetry.

:::image type="content" source="./media/iot-hub-devguide-pricing/self-help-select-problem.png" alt-text="Screenshot that shows selecting an issue in Azure portal support request.":::

After selecting **Next Solutions**, the quota usage insight is returned by the diagnostics under **IoT Hub daily message quota breakdown**. It shows the breakdown for device to cloud messages sent to the IoT hub. In this case, message routing is enabled on the IoT hub, so the messages are shown as *Device to Cloud Telemetry Routing*. Be aware that the quota usage insight may not be returned for the same problem on a different IoT hub. What is returned will depend on the activity and state of that IoT hub.

:::image type="content" source="./media/iot-hub-devguide-pricing/self-help-solutions.png" alt-text="Screenshot that shows quota usage in Azure portal support request.":::
