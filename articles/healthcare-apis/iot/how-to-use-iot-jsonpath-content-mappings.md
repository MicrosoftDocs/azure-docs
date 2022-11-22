---
title: IotJsonPathContentTemplate mappings in MedTech service device mapping - Azure Health Data Services
description: This article describes how to use IotJsonPathContentTemplate mappings with MedTech service device mapping. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 10/25/2022
ms.author: jasteppe
---

# How to use IotJsonPathContentTemplate mappings

This article describes how to use IoTJsonPathContentTemplate mappings with the MedTech service [device mapping](how-to-use-device-mappings.md).

## IotJsonPathContentTemplate

The IotJsonPathContentTemplate is similar to the JsonPathContentTemplate except the `DeviceIdExpression` and `TimestampExpression` aren't required.

The assumption, when using this template, is the messages being evaluated were sent using the [Azure IoT Hub Device SDKs](../../iot-hub/iot-hub-devguide-sdks.md#azure-iot-hub-device-sdks) or  [Export Data (legacy)](../../iot-central/core/howto-export-data-legacy.md) feature of [Azure IoT Central](../../iot-central/core/overview-iot-central.md). 

When you're using these SDKs, the device identity and the timestamp of the message are known.

> [!IMPORTANT]
> Make sure that you're using a device identifier from Azure Iot Hub or Azure IoT Central that is registered as an identifier for a device resource on the destination Fast Healthcare Interoperability Resource (FHIR&#174;) service.

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
> To avoid device spoofing in device-to-cloud messages, Azure IoT Hub enriches all messages with additional properties. To learn more about these properties, see [Anti-spoofing properties](../../iot-hub/iot-hub-devguide-messages-construct.md#anti-spoofing-properties).

> [!TIP]
> [Visual Studio Code with the Azure IoT Hub extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) is a recommended method for sending IoT device messages to your IoT Hub for testing and troubleshooting.

**Heart rate**

**A valid IoT device message to send to your IoT Hub.**

```json

{“heartRate” : “78”}

```

**An example of what the IoT device message will look like after being received and processed by the IoT Hub.**

> [!NOTE]
> The IoT Hub enriches the device message before sending it to the MedTech service device event hub with all properties starting with `iothub`. For example: `iothub-creation-time-utc`.
>
> `patientIdExpression` is only required for MedTech services in the **Create** mode, however, if **Lookup** is being used, a Device resource with a matching Device Identifier must exist in the FHIR service. These examples assume your MedTech service is in a **Create** mode. For more information on the **Create** and **Lookup** **Destination properties**, see [Configure Destination properties](deploy-05-new-config.md#destination-properties). 

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

**An example of what the MedTech service device message will look like after the normalization process.**

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

**Blood pressure**

**A valid IoT device message to send to your IoT Hub.**

```json

{
  "systolic": "123",
  "diastolic": "87"
}

```

**An example of what the IoT device message will look like after being received and processed by the IoT Hub.**

> [!NOTE]
> The IoT Hub enriches the device message before sending it to the MedTech service device event hub with all properties starting with `iothub`. For example: `iothub-creation-time-utc`.
>
> `patientIdExpression` is only required for MedTech services in the **Create** mode, however, if **Lookup** is being used, a Device resource with a matching Device Identifier must exist in the FHIR service. These examples assume your MedTech service is in a **Create** mode. For more information on the **Create** and **Lookup** **Destination properties**, see [Configure Destination properties](deploy-05-new-config.md#destination-properties).

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
        "patientIdExpression": "$.SystemProperties.iothub-connection-device-id", 
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
    },
    {
        "templateType": "IotJsonPathContentTemplate",
        "template": {
        "typeName": "bloodpressure",
        "typeMatchExpression": "$..[?(@Body.systolic && @Body.diastolic)]",
        "patientIdExpression": "$.SystemProperties.iothub-connection-device-id",
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
> See the MedTech service article [Troubleshoot MedTech service Device and FHIR destination mappings](iot-troubleshoot-mappings.md) for assistance fixing common errors and issues related to MedTech service mappings.

## Next steps

In this article, you learned how to use IotJsonPathContentTemplate mappings with the MedTech service device mapping. To learn how to use MedTech service FHIR destination mapping, see

> [!div class="nextstepaction"]
> [How to use the FHIR destination mapping](how-to-use-fhir-mappings.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.