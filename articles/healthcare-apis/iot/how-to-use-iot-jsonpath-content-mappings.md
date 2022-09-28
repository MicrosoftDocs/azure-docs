---
title: IotJsonPathContentTemplate mappings in MedTech service device mapping - Azure Health Data Services
description: This article describes how to use IotJsonPathContentTemplate mappings with MedTech service device mapping. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 09/26/2022
ms.author: jasteppe
---

# How to use IotJsonPathContentTemplate mappings

This article describes how to use IoTJsonPathContentTemplate mappings with the MedTech service [device mapping](how-to-use-device-mappings.md).

## IotJsonPathContentTemplate

The IotJsonPathContentTemplate is similar to the JsonPathContentTemplate except the `DeviceIdExpression` and `TimestampExpression` aren't required.

The assumption, when using this template, is the messages being evaluated were sent using the [Azure IoT Hub Device SDKs](../../iot-hub/iot-hub-devguide-sdks.md#azure-iot-hub-device-sdks) or  [Export Data (legacy)](../../iot-central/core/howto-export-data-legacy.md) feature of [Azure IoT Central](../../iot-central/core/overview-iot-central.md). 

When you're using these SDKs, the device identity and the timestamp of the message are known.

>[!IMPORTANT]
>Make sure that you're using a device identifier from Azure Iot Hub or Azure IoT Central that is registered as an identifier for a device resource on the destination Fast Healthcare Interoperability Resource (FHIR&#174;) service.

If you're using Azure IoT Hub Device SDKs, you can still use the JsonPathContentTemplate, assuming that you're using custom properties in the message body for the device identity or measurement timestamp.

> [!NOTE]
> When using `IotJsonPathContentTemplate`, the `TypeMatchExpression` should resolve to the entire message as a JToken. For more information, see the following examples:

### Examples

With each of these examples, you're provided with:
 * A valid IoT device message.
 * An example of what the IoT device message will look like after being received and processed by the IoT Hub.
 * A valid MedTech service device mapping for normalizing the IoT device message after IoT Hub processing.
 * An example of what the MedTech service device message will look like after normalization.

> [!IMPORTANT]
> To avoid device spoofing in device-to-cloud messages, Azure IoT Hub enriches all messages with additional properties. To learn more about these properties, see [Anti-spoofing properties](/azure/iot-hub/iot-hub-devguide-messages-construct#anti-spoofing-properties)

**Heart rate**

**A valid IoT device message.**

```json

{“heartrate” : “78”}

```

**An example of what the IoT device message will look like after being received and processed by the IoT Hub.**

> [!NOTE]
> The IoT Hub enriches the device message before sending it to the MedTech service device event hub with all properties starting with **iothub**. For example: **iothub-creation-time-utc**.

```json

{
   "Body": {
   "heartRate": "78"        
    },
    "Properties": {
        "iothub-creation-time-utc" : "2021-02-01T22:46:01.8750000Z"
    },
    "SystemProperties": {
        "iothub-connection-device-id" : "device123"
   }
}     

```

**A valid MedTech service device mapping for normalizing the IoT device message after IoT Hub processing.**

```json

{
    "templateType": "CollectionContent",
    "template": [
      {
        "templateType": "IotJsonPathContentTemplate",
        "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@Body.heartRate)]",
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

**An example of what the MedTech service device message will look like after the normalization process.**

```json

{
   "type": "heartrate",
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

**Blood pressure**

**A valid IoT device message.**

```json

{
  "systolic": "123",
  "diastolic": "87"
}

```

**An example of what the IoT device message will look like after being received and processed by the IoT Hub.**

> [!NOTE]
> The IoT Hub enriches the device message before sending it to the MedTech service device event hub with all properties starting with **iothub**. For example: **iothub-creation-time-utc**.

```json

{
   "Body": {
   "systolic": "123",
   "diastolic" : "87"
    },
     "Properties": {
       "iothub-creation-time-utc" : "2021-02-01T22:46:01.8750000Z"
    },
     "SystemProperties": {
        "iothub-connection-device-id" : "device123"
   }
}   

```

**A valid MedTech service device mapping for normalizing the IoT device message after IoT Hub processing.**

```json

{
    "templateType": "CollectionContent",
    "template": [
      { 
        "templateType": "IotJsonPathContentTemplate",
        "template": {
        "typeName": "bloodpressure",
        "typeMatchExpression": "$..[?(@Body.systolic && @Body.diastolic)]",
        "values": [
          {
             "required": "true",
             "valueExpression": "$.Body.systolic",
             "valueName": "systolic"
          },
          {
             "required": "true",
             "valueExpression": "$.Body.diastolic",
             "valueName": "diastolic"
          }
        ]
      }
    }
  ]
}

```

**An example of what the MedTech service device message will look like after the normalization process.**

```json

{
   "type": "bloodpressure",
   "occurrenceTimeUtc": "2021-02-01T22:46:01.875Z",
   "deviceId": "device123",
   "properties": [
      {
         "name": "systolic",
         "value": "123"
      },
      {  
         "name": "diastolic",
         "value": "87"
      }
   ]
}

```

> [!TIP]
> The IotJsonPathTemplate device mapping examples provided in this article may be combined into a single MedTech service device mapping as shown below.
>
> Additionally, the IotJasonPathTemplates can also be combined with with other template types such as [JasonPathContentTemplate mappings](how-to-use-jsonpath-content-mappings.md) to further expand your MedTech service device mapping. 

**Combined heart rate and blood pressure MedTech service device mapping example.**

```json

{
   "templateType": "CollectionContent",
   "template": [
     {  
        "templateType": "IotJsonPathContentTemplate",
        "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@Body.heartRate)]",
        "values": [
             {
               "required": "true",
               "valueExpression": "$.Body.heartRate",
               "valueName": "hr"
             }
          ]  
       }  
    },
    {
        "templateType": "IotJsonPathContentTemplate",
        "template": {
        "typeName": "bloodpressure",
        "typeMatchExpression": "$..[?(@Body.systolic && @Body.diastolic)]",
        "values": [
             {  
               "required": "true",
               "valueExpression": "$.Body.systolic",
               "valueName": "systolic"
             },
             {
               "required": "true",
               "valueExpression": "$.Body.diastolic",
               "valueName": "diastolic"
             }
         ]
       }
     }
   ]
}

```

> [!TIP]
> See the MedTech service [troubleshooting guide](./iot-troubleshoot-guide.md) for assistance fixing common errors and issues.

## Next steps

In this article, you learned how to use IotJsonPathContentTemplate mappings with the MedTech service device mapping. To learn how to use MedTech service FHIR destination mapping, see

>[!div class="nextstepaction"]
>[How to use the FHIR destination mapping](how-to-use-fhir-mappings.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
