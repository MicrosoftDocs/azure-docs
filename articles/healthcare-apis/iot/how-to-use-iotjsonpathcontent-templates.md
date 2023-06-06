---
title: How to use IotJsonPathContent templates with the MedTech service device mapping - Azure Health Data Services
description: Learn how to use IotJsonPathContent templates with the MedTech service device mapping. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 06/05/2023
ms.author: jasteppe
---

# How to use IotJsonPathContent templates with the MedTech service device mapping

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

This article provides an overview of how to use IotJsonPathContent templates within a MedTech service device mapping.

## IotJsonPathContent template basics

IotJsonPathContent templates are similar to the JsonPathContent templates except the `DeviceIdExpression` and `TimestampExpression` aren't required.

The assumption, when using IotJsonPathContent templates, is the device messages being evaluated were sent using the [Azure IoT Hub Device SDKs](../../iot-hub/iot-hub-devguide-sdks.md#azure-iot-hub-device-sdks) or  [Export Data (legacy)](../../iot-central/core/howto-export-data-legacy.md) feature of [Azure IoT Central](../../iot-central/core/overview-iot-central.md). 

When you're using these SDKs, the device identity and the timestamp of the message are known.

> [!IMPORTANT]
> Make sure that you're using a device identifier from Azure Iot Hub or Azure IoT Central that is registered as an identifier for a device resource on the destination FHIR service.

If you're using Azure IoT Hub Device SDKs, you can still use JsonPathContent templates, assuming that you're using custom properties in the device message body for the device identity or measurement timestamp.

> [!NOTE]
> When using `IotJsonPathContent`, the `TypeMatchExpression` should resolve to the entire device message as a JToken. For more information, see the following examples:

### Example

> [!TIP]
> [Visual Studio Code with the Azure IoT Hub extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) is a recommended method for sending IoT device messages to your IoT hub for testing and troubleshooting.
> 
> You can use the MedTech service [Mapping debugger](how-to-use-mapping-debugger.md) for assistance creating, updating, and troubleshooting the MedTech service device and FHIR destination mappings. The Mapping debugger enables you to easily view and make inline adjustments in real-time, without ever having to leave the Azure portal. The Mapping debugger can also be used for uploading test device messages to see how they'll look after being processed into normalized messages and transformed into FHIR Observations.

In this example, we're using a device message that is capturing `heartRate` data:

```json
{“heartRate” : “78”}
```

> [!IMPORTANT]
> To avoid device spoofing in device-to-cloud (D2C) messages, Azure IoT Hub enriches all device messages with additional properties before routing them to the event hub. For example: **Properties**: `iothub-creation-time-utc` and **SystemProperties**: `iothub-connection-device-id`. For more information, see [Anti-spoofing properties](../../iot-hub/iot-hub-devguide-messages-construct.md#anti-spoofing-properties). 
>
> You do not want to send this example device message to your IoT hub as the enrichments will be duplicated by the IoT hub and cause an error with your MedTech service. This is only an example of how your device messages are enriched by the IoT hub. 
>
> Example:
>
> :::image type="content" source="media\how-to-use-iotjsonpathcontent-templates\iot-hub-enriched-device-message.png" alt-text="Screenshot of an Azure IoT Hub enriched device message." lightbox="media\how-to-use-iotjsonpathcontent-templates\iot-hub-enriched-device-message.png":::
>
> `patientIdExpression` is only required for MedTech services in the **Create** mode, however, if **Lookup** is being used, a Device resource with a matching Device Identifier must exist in the FHIR service. These examples assume your MedTech service is in a **Create** mode. For more information on the **Create** and **Lookup** **Destination properties**, see [Configure Destination properties](deploy-new-config.md#destination-properties).

The IoT hub enriches the device message and routes the enriched device message to the event hub before the MedTech service reads the device message from the event hub:

```json
{
  "Body": {
    "heartRate": "78"
  },
  "Properties": {
    "iothub-creation-time-utc": "2021-02-01T22:46:01.8750000Z"
  },
  "SystemProperties": {
    "iothub-connection-device-id": "device123"
  }
}    
```

We're using this device mapping for the normalization stage:

```json
{
  "templateType": "CollectionContent",
  "template": [
    {
      "templateType": "IotJsonPathContent",
      "template": {
        "typeName": "heartRate",
        "typeMatchExpression": "$..[?(@Body.heartRate)]",
        "patientIdExpression": "$.SystemProperties.iothub-connection-device-id",
        "values": [
          {
            "required": "true",
            "valueExpression": "$.Body.heartRate",
            "valueName": "hr"
          }
        ]
      }
    }
  ]
}
```

The resulting normalized message will look like this after the normalization stage:

```json
{
  "type": "heartRate",
  "occurrenceTimeUtc": "2021-02-01T22:46:01.875Z",
  "deviceId": "device123",
  "properties": [
    {
      "name": "hr",
      "value": "78"
    }
  ]
}
```

> [!TIP]
> For assistance fixing common MedTech service deployment errors, see [Troubleshoot MedTech service deployment errors](troubleshoot-errors-deployment.md).
>
> For assistance fixing MedTech service errors, see [Troubleshoot errors using the MedTech service logs](troubleshoot-errors-logs.md).

## Next steps

In this article, you learned how to use IotJsonPathContent templates with the MedTech service device mapping. 

For and overview of the MedTech service FHIR destination mapping, see

> [!div class="nextstepaction"]
> [Overview of the FHIR destination mapping](overview-of-fhir-destination-mapping.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
