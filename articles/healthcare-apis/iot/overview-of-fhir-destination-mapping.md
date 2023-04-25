---
title: Overview of the MedTech service FHIR destination mapping - Azure Health Data Services
description: This article provides an overview of the MedTech service FHIR destination mapping.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 04/17/2023
ms.author: jasteppe
---

# Overview of the MedTech service FHIR destination mapping

> [!NOTE] 
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

This article provides an overview of the MedTech service FHIR destination mapping.

The MedTech service requires two types of [JSON](https://www.json.org/) mappings that are added to your MedTech service through the Azure portal or Azure Resource Manager API. The [device mapping](overview-of-device-mapping.md) is the first type and controls mapping values in the device data sent to the MedTech service to an internal, normalized data object. The device mapping contains expressions that the MedTech service uses to extract types, device identifiers, measurement date time, and measurement value(s). The FHIR destination mapping is the second type and controls how the normalized data is mapped to [FHIR Observations](https://www.hl7.org/fhir/observation.html).

> [!NOTE]
> The device and FHIR destination mappings are re-evaluated each time a device message is processed. Any updates to either mapping will take effect immediately.

## FHIR destination mapping basics

The FHIR destination mapping controls how the normalized data extracted from a device message is mapped into a FHIR observation.

- Should an observation be created for a point in time or over a period of an hour?
- What codes should be added to the observation?
- Should the value be represented as [SampledData](https://www.hl7.org/fhir/datatypes.html#SampledData) or a [Quantity](https://www.hl7.org/fhir/datatypes.html#Quantity)?

These data types are all options the FHIR destination mapping configuration controls.

Once device data is transformed into a normalized data model, the normalized data is collected for transformation to a [FHIR Observation](https://www.hl7.org/fhir/observation.html). If the Observation type is [SampledData](https://www.hl7.org/fhir/datatypes.html#SampledData), the data is grouped according to device identifier, measurement type, and time period (time period can be either 1 hour or 24 hours). The output of this grouping is sent for conversion into a single [FHIR Observation](https://www.hl7.org/fhir/observation.html) that represents the time period for that data type. For other Observation types ([Quantity](https://www.hl7.org/fhir/datatypes.html#Quantity), [CodeableConcept](https://www.hl7.org/fhir/datatypes.html#CodeableConcept) and [string](https://www.hl7.org/fhir/datatypes.html#string)) data isn't grouped, but instead each measurement is transformed into a single Observation representing a point in time.

> [!TIP]
> For more information about how the MedTech service processes device message data into FHIR Observations for persistence on the FHIR service, see [Overview of the MedTech service device message processing stages](overview-of-device-message-processing-stages.md).

This diagram provides an illustration of what happens during the transformation stage within the MedTech service.

:::image type="content" source="media/overview-of-fhir-destination-mapping/transformation-stage-diagram.png" alt-text="Diagram example of the MedTech service device message transformation stage." lightbox="media/overview-of-fhir-destination-mapping/transformation-stage-diagram.png":::

> [!NOTE]
> The FHIR Observation in this diagram is not the complete resource. See [Example](#example) in this overview for the entire FHIR Observation.

## FHIR destination mapping validations

The validation process validates the FHIR destination mapping before allowing them to be saved for use. These elements are required in the FHIR destination mapping.

**FHIR destination mapping**

|Element|Required|
|:------|:-------|
|typeName|True|

> [!NOTE]
> The 'typeName' element is used to link a FHIR destination mapping template to one or more device mapping templates. Device mapping templates with the same 'typeName' element generate normalized data that will be evaluated with a FHIR destination mapping template that has the same 'typeName'.

## CollectionFhir

CollectionFhir is the root template type used by the MedTech service FHIR destination mapping. CollectionFhir is a list of all templates that are used during the transformation stage. You can define one or more templates within CollectionFhir, with each normalized message evaluated against all templates.

### CodeValueFhir

CodeValueFhir is currently the only template supported in FHIR destination mapping at this time.  It allows you to define codes, the effective period, and the value of the observation. Multiple value types are supported: [SampledData](https://www.hl7.org/fhir/datatypes.html#SampledData), [CodeableConcept](https://www.hl7.org/fhir/datatypes.html#CodeableConcept), [Quantity](https://www.hl7.org/fhir/datatypes.html#Quantity), and [String](https://www.hl7.org/fhir/datatypes.html#primitive). Along with these configurable values, the identifier for the Observation resource and linking to the proper Device and Patient resources are handled automatically.

> [!NOTE]
> 

|Property|Description| 
|:-------|-----------|
|**typeName**| The type of measurement this template should bind to. There should be at least one Device mapping template that outputs this type.
|**periodInterval**|The period of time the observation created should represent. Supported values are 0 (an instance), 60 (an hour), 1440 (a day). Note: `periodInterval` is required when the Observation type is "SampledData" and is ignored for any other Observation types.
|**category**|Any number of [CodeableConcepts](http://hl7.org/fhir/datatypes-definitions.html#codeableconcept) to classify the type of observation created.
|**codes**|One or more [Codings](http://hl7.org/fhir/datatypes-definitions.html#coding) to apply to the observation created.
|**codes[].code**|The code for the [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding).
|**codes[].system**|The system for the [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding).
|**codes[].display**|The display for the [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding).
|**value**|The value to extract and represent in the observation. For more information, see [Value type codes](#value-type-codes).
|**components**|*Optional:* One or more components to create on the observation.
|**components[].codes**|One or more [Codings](http://hl7.org/fhir/datatypes-definitions.html#coding) to apply to the component.
|**components[].value**|The value to extract and represent in the component. For more information, see [Value type codes](#value-type-codes).

:::image type="content" source="media/overview-of-fhir-destination-mapping/fhir-destination-mapping-templates-diagram.png" alt-text="Diagram showing MedTech service FHIR destination mapping template and code architecture." lightbox="media/overview-of-fhir-destination-mapping/fhir-destination-mapping-templates-diagram.png":::

### Value type codes

The supported value type codes for the MedTech service FHIR destination mapping:

### SampledData

Represents the [SampledData](http://hl7.org/fhir/datatypes.html#SampledData) FHIR data type. Observation measurements are written to a value stream starting at a point in time and incrementing forward using the period defined. If no value is present, an `E` is written into the data stream. If the period is such that two more values occupy the same position in the data stream, the latest value is used. The same logic is applied when an observation using the SampledData is updated.

| Property | Description 
| --- | ---
|**DefaultPeriod**|The default period in milliseconds to use. 
|**Unit**|The unit to set on the origin of the SampledData. 

### Quantity

Represents the [Quantity](http://hl7.org/fhir/datatypes.html#Quantity) FHIR data type. This type creates a single, point in time, Observation. If a new value arrives that contains the same device identifier, measurement type, and timestamp, the previous Observation is updated to the new value.

| Property | Description 
| --- | --- 
|**Unit**| Unit representation.
|**Code**| Coded form of the unit.
|**System**| System that defines the coded unit form.

### CodeableConcept

Represents the [CodeableConcept](http://hl7.org/fhir/datatypes.html#CodeableConcept) FHIR data type. The value in the normalized data model isn't used, and instead when this type of data is received, an Observation is created with a specific code representing that an observation was recorded at a specific point in time.

| Property | Description 
| --- | --- 
|**Text**|Plain text representation. 
|**Codes**|One or more [Codings](http://hl7.org/fhir/datatypes-definitions.html#coding) to apply to the observation created.
|**Codes[].Code**|The code for the [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding).
|**Codes[].System**|The system for the [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding).
|**Codes[].Display**|The display for the [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding).

### String

Represents the [string](https://www.hl7.org/fhir/datatypes.html#string) FHIR data type. This type creates a single, point in time, Observation. If new value arrives that contains the same device identifier, measurement type, and timestamp, the previous Observation is updated to the new value.

### Example

> [!TIP]
> You can use the MedTech service [Mapping debugger](how-to-use-mapping-debugger.md) for assistance creating, updating, and troubleshooting the MedTech service device and FHIR destination mappings. The Mapping debugger enables you to easily view and make inline adjustments in real-time, without ever having to leave the Azure portal. The Mapping debugger can also be used for uploading test device messages to see how they'll look after being processed into normalized messages and transformed into FHIR Observations.

> [!NOTE]
> This example and normalized message is a continuation from [Overview of the MedTech service device mapping](overview-of-device-mapping.md#example).

In this example, we're using a normalized message capturing `heartRate` data:

```json
[
  {
    "type": "heartrate",
    "occurrenceTimeUtc": "2023-03-13T22:46:01.875Z",
    "deviceId": "device01",
    "properties": [
      {
        "name": "hr",
        "value": "78"
      }
    ]
  }
]
```

We're using this FHIR destination mapping for the transformation stage:

```json
{
  "templateType": "CollectionFhir",
  "template": [
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
        "typeName": "heartrate",
        "value": {
          "system": "http://unitsofmeasure.org",
          "code": "count/min",
          "unit": "count/min",
          "valueName": "hr",
          "valueType": "Quantity"
        }
      }
    }
  ]
}

```

The resulting FHIR Observation will look like this after the transformation stage:

```json
[
  {
    "code": {
      "coding": [
        {
          "system": {
            "value": "http://loinc.org"
          },
          "code": {
            "value": "8867-4"
          },
          "display": {
            "value": "Heart rate"
          }
        }
      ],
      "text": {
        "value": "heartrate"
      }
    },
    "effective": {
      "start": {
        "value": "2023-03-13T22:46:01.8750000Z"
      },
      "end": {
        "value": "2023-03-13T22:46:01.8750000Z"
      }
    },
    "issued": {
      "value": "2023-04-05T21:02:59.1650841+00:00"
    },
    "value": {
      "value": {
        "value": 78
      },
      "unit": {
        "value": "count/min"
      },
      "system": {
        "value": "http://unitsofmeasure.org"
      },
      "code": {
        "value": "count/min"
      }
    }
  }
]
```

> [!TIP]
> For assistance fixing common MedTech service deployment errors, see [Troubleshoot MedTech service deployment errors](troubleshoot-errors-deployment.md).
>
> For assistance fixing MedTech service errors, see [Troubleshoot errors using the MedTech service logs](troubleshoot-errors-logs.md).

## Next steps

In this article, you've been provided an overview of the MedTech service FHIR destination mapping. 

To get an overview of the MedTech service device mapping, see

> [!div class="nextstepaction"] 
> [Overview of the MedTech service device mapping](overview-of-device-mapping.md)

To learn how to use CalculatedContent with the MedTech service device mapping, see

> [!div class="nextstepaction"] 
> [How to use CalculatedContent with the MedTech service device mapping](how-to-use-calculatedcontent-mappings.md)

To learn how to use IotJsonPathContent with the MedTech service device mapping, see

> [!div class="nextstepaction"] 
> [How to use IotJsonPathContent with the MedTech service device mapping](how-to-use-iotjsonpathcontenttemplate-mappings.md)

To learn how to use custom functions with the MedTech service device mapping, see

> [!div class="nextstepaction"] 
> [How to use custom functions with the MedTech service device mapping](how-to-use-custom-functions.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
