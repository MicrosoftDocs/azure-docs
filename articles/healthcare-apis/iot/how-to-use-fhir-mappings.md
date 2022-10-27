---
title: FHIR destination mappings in the MedTech service - Azure Health Data Services
description: This article describes how to configure and use the FHIR destination mappings in Azure Health Data Services MedTech service. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 10/25/2022
ms.author: jasteppe
---

# How to use the FHIR destination mappings

This article describes how to configure the MedTech service using the Fast Healthcare Interoperability Resources (FHIR&#174;) destination mappings.

Below is a conceptual example of what happens during the normalization and transformation process within the MedTech service:

:::image type="content" source="media/iot-data-transformation/iot-data-normalization-high-level.png" alt-text="Diagram of IoT data normalization flow." lightbox="media/iot-data-transformation/iot-data-normalization-high-level.png":::

## FHIR destination mappings

Once the device content is extracted into a normalized model, the data is collected and grouped according to device identifier, measurement type, and time period. The output of this grouping is sent for conversion into a FHIR resource ([Observation](https://www.hl7.org/fhir/observation.html) currently). The FHIR destination mapping template controls how the data is mapped into a FHIR observation. Should an observation be created for a point in time or over a period of an hour? What codes should be added to the observation? Should the value be represented as [SampledData](https://www.hl7.org/fhir/datatypes.html#SampledData) or a [Quantity](https://www.hl7.org/fhir/datatypes.html#Quantity)? These data types are all options the FHIR destination mappings 
configuration controls.

> [!NOTE]
> Mappings are stored in an underlying blob storage and loaded from blob per compute execution. Once updated they should take effect immediately. 

### CodeValueFhirTemplate

The CodeValueFhirTemplate is currently the only template supported in FHIR destination mapping at this time.  It allows you to define codes, the effective period, and the value of the observation. Multiple value types are supported: [SampledData](https://www.hl7.org/fhir/datatypes.html#SampledData), [CodeableConcept](https://www.hl7.org/fhir/datatypes.html#CodeableConcept), and [Quantity](https://www.hl7.org/fhir/datatypes.html#Quantity). Along with these configurable values, the identifier for the Observation resource and linking to the proper Device and Patient resources are handled automatically.

| Property | Description 
| --- | ---
|**TypeName**| The type of measurement this template should bind to. There should be at least one Device mapping template that outputs this type.
|**PeriodInterval**|The period of time the observation created should represent. Supported values are 0 (an instance), 60 (an hour), 1440 (a day).
|**Category**|Any number of [CodeableConcepts](http://hl7.org/fhir/datatypes-definitions.html#codeableconcept) to classify the type of observation created.
|**Codes**|One or more [Codings](http://hl7.org/fhir/datatypes-definitions.html#coding) to apply to the observation created.
|**Codes[].Code**|The code for the [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding).
|**Codes[].System**|The system for the [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding).
|**Codes[].Display**|The display for the [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding).
|**Value**|The value to extract and represent in the observation. For more information, see [Value Type Templates](#value-type-templates).
|**Components**|*Optional:* One or more components to create on the observation.
|**Components[].Codes**|One or more [Codings](http://hl7.org/fhir/datatypes-definitions.html#coding) to apply to the component.
|**Components[].Value**|The value to extract and represent in the component. For more information, see [Value Type Templates](#value-type-templates).

### Value type templates

Below are the currently supported value type templates:

#### SampledData

Represents the [SampledData](http://hl7.org/fhir/datatypes.html#SampledData) FHIR data type. Observation measurements are written to a value stream starting at a point in time and incrementing forward using the period defined. If no value is present, an `E` will be written into the data stream. If the period is such that two more values occupy the same position in the data stream, the latest value is used. The same logic is applied when an observation using the SampledData is updated.

| Property | Description 
| --- | ---
|**DefaultPeriod**|The default period in milliseconds to use. 
|**Unit**|The unit to set on the origin of the SampledData. 

#### Quantity

Represents the [Quantity](http://hl7.org/fhir/datatypes.html#Quantity) FHIR data type. If more than one value is present in the grouping, only the first value is used. When new value arrives that maps to the same observation it will overwrite the old value.

| Property | Description 
| --- | --- 
|**Unit**| Unit representation.
|**Code**| Coded form of the unit.
|**System**| System that defines the coded unit form.

### CodeableConcept

Represents the [CodeableConcept](http://hl7.org/fhir/datatypes.html#CodeableConcept) FHIR data type. The actual value isn't used.

| Property | Description 
| --- | --- 
|**Text**|Plain text representation. 
|**Codes**|One or more [Codings](http://hl7.org/fhir/datatypes-definitions.html#coding) to apply to the observation created.
|**Codes[].Code**|The code for the [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding).
|**Codes[].System**|The system for the [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding).
|**Codes[].Display**|The display for the [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding).

### Examples

**Heart rate - SampledData**

```json
{
    "templateType": "CodeValueFhir",
    "template": {
        "codes": [
            {
                "code": "8867-4",
                "system": "http://loinc.org",
                "display": "Heart rate"
            }
        ],
        "periodInterval": 60,
        "typeName": "heartrate",
        "value": {
            "defaultPeriod": 5000,
            "unit": "count/min",
            "valueName": "hr",
            "valueType": "SampledData"
        }
    }
}
```

**Steps - SampledData**

```json
{
    "templateType": "CodeValueFhir",
    "template": {
        "codes": [
            {
                "code": "55423-8",
                "system": "http://loinc.org",
                "display": "Number of steps"
            }
        ],        
        "periodInterval": 60,
        "typeName": "stepsCount",
        "value": {
            "defaultPeriod": 5000,
            "unit": "",
            "valueName": "steps",
            "valueType": "SampledData"
        }
    }
}
```

**Blood pressure - SampledData**

```json
{
    "templateType": "CodeValueFhir",
    "template": {
        "codes": [
            {
                "code": "85354-9",
                "display": "Blood pressure panel with all children optional",
                "system": "http://loinc.org"
            }
        ],
        "periodInterval": 60,
        "typeName": "bloodpressure",
        "components": [
            {
                "codes": [
                    {
                        "code": "8867-4",
                        "display": "Diastolic blood pressure",
                        "system": "http://loinc.org"
                    }
                ],
                "value": {
                    "defaultPeriod": 5000,
                    "unit": "mmHg",
                    "valueName": "diastolic",
                    "valueType": "SampledData"
                }
            },
            {
                "codes": [
                    {
                        "code": "8480-6",
                        "display": "Systolic blood pressure",
                        "system": "http://loinc.org"
                    }
                ],
                "value": {
                    "defaultPeriod": 5000,
                    "unit": "mmHg",
                    "valueName": "systolic",
                    "valueType": "SampledData"
                }
            }
        ]
    }
}
```

**Blood pressure - Quantity**

```json
{
    "templateType": "CodeValueFhir",
    "template": {
        "codes": [
            {
                "code": "85354-9",
                "display": "Blood pressure panel with all children optional",
                "system": "http://loinc.org"
            }
        ],
        "periodInterval": 0,
        "typeName": "bloodpressure",
        "components": [
            {
                "codes": [
                    {
                        "code": "8867-4",
                        "display": "Diastolic blood pressure",
                        "system": "http://loinc.org"
                    }
                ],
                "value": {
                    "unit": "mmHg",
                    "valueName": "diastolic",
                    "valueType": "Quantity"
                }
            },
            {
                "codes": [
                    {
                        "code": "8480-6",
                        "display": "Systolic blood pressure",
                        "system": "http://loinc.org"
                    }
                ],
                "value": {
                    "unit": "mmHg",
                    "valueName": "systolic",
                    "valueType": "Quantity"
                }
            }
        ]
    }
}
```

**Device removed - CodeableConcept**

```json
{
    "templateType": "CodeValueFhir",
    "template": {
        "codes": [
            {
                "code": "deviceEvent",
                "system": "https://www.mydevice.com/v1",
                "display": "Device Event"
            }
        ],
        "periodInterval": 0,
        "typeName": "deviceRemoved",
        "value": {
            "text": "Device Removed",
            "codes": [
                {
                    "code": "deviceRemoved",
                    "system": "https://www.mydevice.com/v1",
                    "display": "Device Removed"
                }
            ],
            "valueName": "deviceRemoved",
            "valueType": "CodeableConcept"
        }
    }
}
```

> [!TIP]
> See the MedTech service article [Troubleshoot MedTech service device and FHIR destination mappings](iot-troubleshoot-mappings.md) for assistance fixing common errors and issues related to MedTech service mappings.

## Next steps

In this article, you learned how to use FHIR destination mappings. To learn how to use device mappings, see

> [!div class="nextstepaction"]
> [How to use device mappings](how-to-use-device-mappings.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
