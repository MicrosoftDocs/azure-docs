---
title: IotJsonPathContentTemplate mappings in MedTech service device mapping - Azure Health Data Services
description: This article describes how to use IotJsonPathContentTemplate mappings with MedTech service device mapping. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 09/06/2022
ms.author: jasteppe
---

# How to use IotJsonPathContentTemplate mappings

This article describes how to use IoTJsonPathContentTemplate mappings with the MedTech service [device mapping](how-to-use-device-mappings.md).

> [!TIP]
> Check out the [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) tool for editing, testing, and troubleshooting the MedTech service Device and FHIR destination mappings. Export mappings for uploading to the MedTech service in the Azure portal or use with the [open-source version](https://github.com/microsoft/iomt-fhir) of the MedTech service.

## IotJsonPathContentTemplate

The IotJsonPathContentTemplate is similar to the JsonPathContentTemplate except the `DeviceIdExpression` and `TimestampExpression` aren't required.

The assumption, when using this template, is the messages being evaluated were sent using the [Azure IoT Hub Device SDKs](../../iot-hub/iot-hub-devguide-sdks.md#azure-iot-hub-device-sdks) or  [Export Data (legacy)](../../iot-central/core/howto-export-data-legacy.md) feature of [Azure IoT Central](../../iot-central/core/overview-iot-central.md). 

When you're using these SDKs, the device identity and the timestamp of the message are known.

>[!IMPORTANT]
>Make sure that you're using a device identifier from Azure Iot Hub or Azure IoT Central that is registered as an identifier for a device resource on the destination FHIR service.

If you're using Azure IoT Hub Device SDKs, you can still use the JsonPathContentTemplate, assuming that you're using custom properties in the message body for the device identity or measurement timestamp.

> [!NOTE]
> When using `IotJsonPathContentTemplate`, the `TypeMatchExpression` should resolve to the entire message as a JToken. For more information, see the following examples:

### Examples

**Heart rate**

*Message*

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

*Template*

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

**Blood pressure**

*Message*

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

*Template*

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

> [!TIP]
> The above IotJsonPathTemplate examples will work separately with your MedTech service device mapping or you can combine them into a single MedTech service device mapping as shown below. Additionally, the IotJasonPathTemplates can also be combined with with other template types such as [JasonPathContentTemplate mappings](how-to-use-jsonpath-content-mappings.md) to create and tune your MedTech service device mapping to meet your individual needs and scenarios. 

*Template*

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
