---
title: CollectionContentTemplate mappings in MedTech service Device mappings - Azure Health Data Services
description: This article describes how to use CollectionContentTemplate mappings with MedTech service Device mappings. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 03/22/2022
ms.author: jasteppe
---

# How to use CollectionContentTemplate mappings

> [!TIP]
> Check out the [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) tool for editing, testing, and troubleshooting MedTech service Device and FHIR destination mappings. Export mappings for uploading to the MedTech service in the Azure portal or use with the [open-source version](https://github.com/microsoft/iomt-fhir) of the MedTech service.

This article describes how to use CollectionContentTemplate mappings with the MedTech service Device mappings templates.

## CollectionContentTemplate

The CollectionContentTemplate may be used to represent a list of templates that will be used during normalization.
                                                             
### Example

```json
{
  "templateType": "CollectionContent",
  "template": [
    {
      "templateType": "CalculatedContent",
      "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@heartRate)]",
        "deviceIdExpression": "$.matchedToken.deviceId",
        "timestampExpression": "$.matchedToken.endDate",
        "values": [
          {
            "required": "true",
            "valueExpression": "$.matchedToken.heartRate",
            "valueName": "hr"
          }
        ]
      }
    },
    {
      "templateType": "CalculatedContent",
      "template": {
        "typeName": "stepcount",
        "typeMatchExpression": "$..[?(@steps)]",
        "deviceIdExpression": "$.matchedToken.deviceId",
        "timestampExpression": "$.matchedToken.endDate",
        "values": [
          {
            "required": "true",
            "valueExpression": "$.matchedToken.steps",
            "valueName": "steps"
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

In this article, you learned how to use Device mappings. To learn how to use FHIR destination mappings, see

>[!div class="nextstepaction"]
>[How to use FHIR destination mappings](how-to-use-fhir-mappings.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
