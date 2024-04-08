---
title: Overview of the MedTech service FHIR destination mapping - Azure Health Data Services
description: Learn about the MedTech service FHIR destination mapping.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: overview
ms.date: 08/01/2023
ms.author: jasteppe
---

# Overview of the MedTech service FHIR destination mapping

This article provides an overview of the MedTech service FHIR&reg; destination mapping.

The MedTech service requires two types of [JSON](https://www.json.org/) mappings that are added to your MedTech service through the Azure portal or Azure Resource Manager API. The [device mapping](overview-of-device-mapping.md) is the first type and controls mapping values in the device data sent to the MedTech service to an internal, normalized data object. The device mapping contains expressions that the MedTech service uses to extract types, device identifiers, measurement date time, and measurement value(s). The FHIR destination mapping is the second type and controls how the normalized data is mapped to [FHIR Observations](https://www.hl7.org/fhir/observation.html).

> [!NOTE]
> The device and FHIR destination mappings are re-evaluated each time a device message is processed. Any updates to either mapping will take effect immediately.

## FHIR destination mapping basics

The FHIR destination mapping controls how the normalized data extracted from a device message is mapped into a FHIR Observation.

* Should an observation be created for a point in time or over a period of an hour?
* What codes should be added to the observation?
* Should the value be represented as [SampledData](https://www.hl7.org/fhir/datatypes.html#SampledData) or a [Quantity](https://www.hl7.org/fhir/datatypes.html#Quantity)?

These data types are all options the FHIR destination mapping configuration controls.

Once device data is transformed into a normalized data model, the normalized data is collected for transformation to a [FHIR Observation](https://www.hl7.org/fhir/observation.html). If the Observation type is [SampledData](https://www.hl7.org/fhir/datatypes.html#SampledData), the data is grouped according to device identifier, measurement type, and time period (time period can be either 1 hour or 24 hours). The output of this grouping is sent for conversion into a single [FHIR Observation](https://www.hl7.org/fhir/observation.html) that represents the time period for that data type. For other Observation types ([Quantity](https://www.hl7.org/fhir/datatypes.html#Quantity), [CodeableConcept](https://www.hl7.org/fhir/datatypes.html#CodeableConcept) and [String](https://www.hl7.org/fhir/datatypes.html#string)) data isn't grouped, but instead each measurement is transformed into a single Observation representing a point in time.

> [!TIP]
> For more information about how the MedTech service processes device message data into FHIR Observations for persistence on the FHIR service, see [Overview of the MedTech service device message processing stages](overview-of-device-message-processing-stages.md).

This diagram provides an illustration of what happens during the transformation stage within the MedTech service.

:::image type="content" source="media/overview-of-fhir-destination-mapping/transformation-stage-diagram.png" alt-text="Diagram example of the MedTech service device message transformation stage." lightbox="media/overview-of-fhir-destination-mapping/transformation-stage-diagram.png":::

> [!NOTE]
> The FHIR Observation in this diagram is not the complete resource. See [Example](#example) in this overview for the entire FHIR Observation.

## CollectionFhir

CollectionFhir is the root template type used by the MedTech service FHIR destination mapping. CollectionFhir is a list of all templates that are used during the transformation stage. You can define one or more templates within CollectionFhir, with each normalized message evaluated against all templates.

:::image type="content" source="media/overview-of-fhir-destination-mapping/fhir-destination-mapping-templates-diagram.png" alt-text="Diagram showing MedTech service FHIR destination mapping template and code architecture." lightbox="media/overview-of-fhir-destination-mapping/fhir-destination-mapping-templates-diagram.png":::

### CodeValueFhir

CodeValueFhir is currently the only template supported in the FHIR destination mapping.  It allows you to define codes, the effective period, and the value of the observation. Multiple value types are supported: [SampledData](https://www.hl7.org/fhir/datatypes.html#SampledData), [CodeableConcept](https://www.hl7.org/fhir/datatypes.html#CodeableConcept), [Quantity](https://www.hl7.org/fhir/datatypes.html#Quantity), and [String](https://www.hl7.org/fhir/datatypes.html#string). Along with these configurable values, the identifier for the Observation resource and linking to the proper Device and Patient resources are handled automatically.

> [!IMPORTANT]
> The **Resolution type** specifies how the MedTech service associates device data with Device resources and Patient resources. The MedTech service reads Device and Patient resources from the FHIR service using [device identifiers](https://www.hl7.org/fhir/r4/device-definitions.html#Device.identifier) and [patient identifiers](https://www.hl7.org/fhir/r4/patient-definitions.html#Patient.identifier). If an [encounter identifier](https://hl7.org/fhir/r4/encounter-definitions.html#Encounter.identifier) is specified and extracted from the device data payload, it's linked to the observation if an encounter exists on the FHIR service with that identifier.  If the [encounter identifier](../../healthcare-apis/release-notes.md#medtech-service) is successfully normalized, but no FHIR Encounter exists with that encounter identifier, a **FhirResourceNotFound** exception is thrown. For more information on configuring the MedTech service **Resolution type**, see [Configure the Destination tab](deploy-manual-portal.md#configure-the-destination-tab).

|Element|Description|Required| 
|:------|:----------|:-------|
|**typeName**| The type of measurement this template should bind to. Note: There should be at least one device mapping template that has this same `typeName`. The `typeName` element is used to link a FHIR destination mapping template to one or more device mapping templates. Device mapping templates with the same `typeName` element generate normalized data that is evaluated with a FHIR destination mapping template that has the same `typeName`.|True|
|**periodInterval**|The period of time the observation created should represent. Supported values are 0 (an instance), 60 (an hour), 1440 (a day).|True when the Observation type is SampledData; Ignored for other Observation types.| 
|**category**|Any number of [CodeableConcepts](http://hl7.org/fhir/datatypes-definitions.html#codeableconcept) to classify the type of observation created.|False|
|**codes**|One or more [Codings](http://hl7.org/fhir/datatypes-definitions.html#coding) to apply to the observation created.|True|
|**codes[].code**|The code for a [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding) in the `codes` element.|True|
|**codes[].system**|The system for a [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding) in the `codes` element.|False|
|**codes[].display**|The display for a [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding) in the `codes` element.|False|
|**value**|The value to extract and represent in the observation. For more information on the elements that the `value` element contains, see [Value types](#value-types).|True when the `components` element isn't used (unless the Observation type is CodebleConcept, in which case this element isn't only 'not required' but also ignored).|
|**components**|One or more components to create on the observation.|True when the `value` element isn't used instead.|
|**components[].codes**|One or more [Codings](http://hl7.org/fhir/datatypes-definitions.html#coding) to apply to the component.|False|
|**components[].value**|The value to extract and represent in the component. For more information on the elements that the `components[].value` element contains, see [Value types](#value-types).|True when the `components` element is used (unless the Observation type is CodebleConcept, in which case this element isn't only 'not required' but also ignored).|

#### Value types

All CodeValueFhir templates' `value` element contains these elements:

|Element|Description|Required|
|:------|:----------|:-------|
|**valueType**|Type of the value. This value would be "SampledData", "Quantity", "CodeableConcept", or "String" depending on the value type.|True|
|**valueName**|Name of the value.|True unless `valueType` is CodeableConcept.|

These value types are supported in the MedTech service FHIR destination mapping:

#### SampledData

Represents the [SampledData](http://hl7.org/fhir/datatypes.html#SampledData) FHIR data type. Observation measurements are written to a value stream starting at a point in time and incrementing forward using the period defined. If no value is present, an `E` is written into the data stream. If the period is such that two or more values occupy the same position in the data stream, the latest value is used. The same logic is applied when an observation using the SampledData is updated. For a CodeValueFhir template with the SampledData value type, the template's `value` element contains the following elements:

|Element|Description|Required| 
|:------|:----------|:-------|
|**defaultPeriod**|The default period in milliseconds to use.|True|
|**unit**|The unit to set on the origin of the SampledData.|True|

#### Quantity

Represents the [Quantity](http://hl7.org/fhir/datatypes.html#Quantity) FHIR data type. This type creates a single, point in time, Observation. If a new value arrives that contains the same device identifier, measurement type, and timestamp, the previous Observation is updated to the new value. For a CodeValueFhir template with the Quantity value type, the template's `value` element contains the following elements:

|Element|Description|Required|
|:------|:----------|:-------| 
|**unit**|Unit representation.|False|
|**code**|Coded form of the unit.|False|
|**system**|System that defines the coded unit form.|False|

#### CodeableConcept

Represents the [CodeableConcept](http://hl7.org/fhir/datatypes.html#CodeableConcept) FHIR data type. The value in the normalized data model isn't used, and instead when this type of data is received, an Observation is created with a specific code representing that an observation was recorded at a specific point in time. For a CodeValueFhir template with the CodeableConcept value type, the template's `value` element contains the following elements:

|Element|Description|Required|
|:------|:----------|:-------|
|**text**|Plain text representation.|False|
|**codes**|One or more [Codings](http://hl7.org/fhir/datatypes-definitions.html#coding) to apply to the observation created.|True|
|**codes[].code**|The code for a [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding) in the `codes` element.|True|
|**codes[].system**|The system for a [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding) in the `codes` element.|False|
|**codes[].display**|The display for a [Coding](http://hl7.org/fhir/datatypes-definitions.html#coding) in the `codes` element.|False|

#### String

Represents the [String](https://www.hl7.org/fhir/datatypes.html#string) FHIR data type. This type creates a single, point in time, Observation. If a new value arrives that contains the same device identifier, measurement type, and timestamp, the previous Observation is updated to the new value. No other elements are defined.

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

[Overview of the MedTech service device mapping](overview-of-device-mapping.md)

[How to use CalculatedContent templates with the MedTech service device mapping](how-to-use-calculatedcontent-templates.md)

[How to use IotJsonPathContent templates with the MedTech service device mapping](how-to-use-iotjsonpathcontent-templates.md)

[How to use custom functions with the MedTech service device mapping](how-to-use-custom-functions.md)

[Overview of the MedTech service scenario-based mappings samples](overview-of-samples.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
