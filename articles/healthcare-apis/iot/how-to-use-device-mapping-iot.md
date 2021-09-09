---
title: Device mapping template in IoT Connector - Azure Healthcare APIs
description: This article describes how to use the device mapping template in the IoT Connector. 
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 08/06/2021
ms.author: rabhaiya
---

# How to use the device mapping template

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The IoT Connector requires two types of JSON-based mapping templates. The first type, **Device mapping**, is responsible for mapping the device payloads sent to the `devicedata` Azure Event Hub end point. It extracts types, device identifiers, measurement date time, and the measurement value(s). 

The second type, **FHIR mapping**, controls the mapping for FHIR resource. It allows configuration of the length of the observation period, FHIR data type used to store the values, and terminology code(s). 

The two types of mapping templates are composed into a JSON document based on their type. These JSON documents are then added to your Azure IoT Connector for FHIR through the Azure portal. The Device mapping document is added through the **Configure Device mapping** page and the FHIR mapping document through the **Configure FHIR mapping** page.

> [!NOTE]
> Mapping templates are stored in an underlying blob storage and loaded from blob per compute execution. Once updated they should take effect immediately. 

## Device mapping

Device mapping provides mapping functionality to extract device content into a common format for further evaluation. Each message received is evaluated against all templates. This approach allows a single inbound message to be projected to multiple outbound messages, which are later mapped to different observations in FHIR. The result is a normalized data object representing the value or values parsed by the templates. The normalized data model has a few required properties that must be found and extracted:

| Property | Description |
| - | - |
|**Type**|The name/type to classify the measurement. This value is used to bind to the required FHIR mapping template.  Multiple templates can output to the same type allowing you to map different representations across multiple devices to a single common output.|
|**OccurenceTimeUtc**|The time the measurement occurred.|
|**DeviceId**|The identifier for the device. This value should match an identifier on the device resource that exists on the destination FHIR server.|
 |**Properties**|Extract at least one property so the value can be saved in the Observation resource created.  Properties are a collection of key value pairs extracted during normalization.|

Below is a conceptual example of what happens during normalization.

[ ![Normalization Example](media/concepts-iot-mapping-templates/normalization-example.png) ](media/concepts-iot-mapping-templates/normalization-example.png#lightbox)

The content payload itself is an Azure Event Hub message, which is composed of three parts: Body, Properties, and SystemProperties. The `Body` is a byte array representing an UTF-8 encoded string. During template evaluation, the byte array is automatically converted into the string value. `Properties` is a key value collection for use by the message creator. `SystemProperties` is also a key value collection reserved by the Azure Event Hub framework with entries automatically populated by it.

```json
{
	"Body": {
		"content": "value"
	},
	"Properties": {
		"key1": "value1",
		"key2": "value2"
	},
	"SystemProperties": {
		"x-opt-sequence-number": 1,
		"x-opt-enqueued-time": "2021-02-01T22:46:01.8750000Z",
		"x-opt-offset": 1,
		"x-opt-partition-key": "1"
	}
}
```
### Mapping with JSON path

The three device content template types supported today rely on JSON Path to both match the required template and extracted values. More information on JSON Path can be found [here](https://goessner.net/articles/JsonPath/). All three template types use the [JSON .NET implementation](https://www.newtonsoft.com/json/help/html/QueryJsonSelectTokenJsonPath.htm) for resolving JSON Path expressions.

#### JsonPathContentTemplate

The JsonPathContentTemplate allows matching on and extracting values from an Event Hub message using JSON Path.

| Property | Description |<div style="width:150px">Example</div>
| --- | --- | --- 
|**TypeName**|The type to associate with measurements that match the template.|`heartrate`
|**TypeMatchExpression**|The JSON Path expression that is evaluated against the Event Hub payload. If a matching JToken is found, the template is considered a match. All subsequent expressions are evaluated against the extracted JToken matched here.|`$..[?(@heartRate)]`
|**TimestampExpression**|The JSON Path expression to extract the timestamp value for the measurement's OccurenceTimeUtc.|`$.endDate`
|**DeviceIdExpression**|The JSON Path expression to extract the device identifier.|`$.deviceId`
|**PatientIdExpression**|*Optional*: The JSON Path expression to extract the patient identifier.|`$.patientId`
|**EncounterIdExpression**|*Optional*: The JSON Path expression to extract the encounter identifier.|`$.encounterId`
|**Values[].ValueName**|The name to associate with the value extracted by the subsequent expression. Used to bind the required value/component in the FHIR mapping template. |`hr`
|**Values[].ValueExpression**|The JSON Path expression to extract the required value.|`$.heartRate`
|**Values[].Required**|Will require the value to be present in the payload.  If not found, a measurement will not be generated and an InvalidOperationException will be thrown.|`true`

##### Examples

**Heart rate**

*Message*

```json
{
    "Body": {
        "heartRate": "78",
        "endDate": "2021-02-01T22:46:01.8750000Z",
        "deviceId": "device123"
    },
    "Properties": {},
    "SystemProperties": {}
}
```
*Template*
```json
{
    "templateType": "JsonPathContent",
    "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@heartRate)]",
        "deviceIdExpression": "$.deviceId",
        "timestampExpression": "$.endDate",
        "values": [
            {
                "required": "true",
                "valueExpression": "$.heartRate",
                "valueName": "hr"
            }
        ]
    }
}
```
**Blood pressure**

*Message*

```json
{
    "Body": {
        "systolic": "123",
        "diastolic" : "87",
        "endDate": "2021-02-01T22:46:01.8750000Z",
        "deviceId": "device123"
    },
    "Properties": {},
    "SystemProperties": {}
}
```
*Template*

```json
{
    "typeName": "bloodpressure",
    "typeMatchExpression": "$..[?(@systolic && @diastolic)]",
    "deviceIdExpression": "$.deviceId",
    "timestampExpression": "$.endDate",
    "values": [
        {
            "required": "true",
            "valueExpression": "$.systolic",
            "valueName": "systolic"
        },
        {
            "required": "true",
            "valueExpression": "$.diastolic",
            "valueName": "diastolic"
        }
    ]
}
```
**Project multiple measurements from single message**

*Message*

```json
{
    "Body": {
        "heartRate": "78",
        "steps": "2",
        "endDate": "2021-02-01T22:46:01.8750000Z",
        "deviceId": "device123"
    },
    "Properties": {},
    "SystemProperties": {}
}
```
*Template 1*

```json
{
    "templateType": "JsonPathContent",
    "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@heartRate)]",
        "deviceIdExpression": "$.deviceId",
        "timestampExpression": "$.endDate",
        "values": [
            {
                "required": "true",
                "valueExpression": "$.heartRate",
                "valueName": "hr"
            }
        ]
    }
}
```

*Template 2*

```json
{
    "templateType": "JsonPathContent",
    "template": {
        "typeName": "stepcount",
        "typeMatchExpression": "$..[?(@steps)]",
        "deviceIdExpression": "$.deviceId",
        "timestampExpression": "$.endDate",
        "values": [
            {
                "required": "true",
                "valueExpression": "$.steps",
                "valueName": "steps"
            }
        ]
    }
}
```
**Project multiple measurements from array in message**

*Message*

```json
{
    "Body": [
        {
            "heartRate": "78",
            "endDate": "2021-02-01T22:46:01.8750000Z",
            "deviceId": "device123"
        },
        {
            "heartRate": "81",
            "endDate": "2021-02-01T23:46:01.8750000Z",
            "deviceId": "device123"
        },
        {
            "heartRate": "72",
            "endDate": "2021-02-01T24:46:01.8750000Z",
            "deviceId": "device123"
        }
    ],
    "Properties": {},
    "SystemProperties": {}
}
```
*Template*

```json
{
    "templateType": "JsonPathContent",
    "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@heartRate)]",
        "deviceIdExpression": "$.deviceId",
        "timestampExpression": "$.endDate",
        "values": [
            {
                "required": "true",
                "valueExpression": "$.heartRate",
                "valueName": "hr"
            }
        ]
    }
}
```
#### IotJsonPathContentTemplate

The IotJsonPathContentTemplate is similar to the JsonPathContentTemplate except the DeviceIdExpression and TimestampExpression aren't required.

The assumption when using this template is the messages being evaluated were sent using the [Azure IoT Hub Device SDKs](../../iot-hub/iot-hub-devguide-sdks.md#azure-iot-hub-device-sdks) or  [Export Data (legacy)](../../iot-central/core/howto-export-data-legacy.md) feature of [Azure IoT Central](../../iot-central/core/overview-iot-central.md). When using these SDKs, the device identity (assuming the device identifier from Azure Iot Hub/Central is registered as an identifer for a device resource on the destination FHIR server) and the timestamp of the message are known. If you're using Azure IoT Hub Device SDKs but are using custom properties in the message body for the device identity or measurement timestamp, you can still use the JsonPathContentTemplate.

> [!NOTE]
> When using the `IotJsonPathContentTemplate`, the `TypeMatchExpression` should resolve to the entire message as a JToken. Refer to the following examples for more details.

##### Examples

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

    "templateType": "JsonPathContent",
    "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@Body.heartRate)]",
        "deviceIdExpression": "$.deviceId",
        "timestampExpression": "$.endDate",
        "values": [
            {
                "required": "true",
                "valueExpression": "$.Body.heartRate",
                "valueName": "hr"
            }
        ]
    }
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
```
#### IotCentralJsonPathContentTemplate

The IotCentralJsonPathContentTemplate also doesn't require DeviceIdExpression and TimestampExpression. It gets used when the messages being evaluated are sent through the [Export Data](../../iot-central/core/howto-export-data.md) feature of [Azure IoT Central](../../iot-central/core/overview-iot-central.md). When you're using this feature, the device identity (assuming the device identifier from Azure Iot Central is registered as an identifer for a device resource on the destination FHIR server) and the timestamp of the message are known. If you're using Azure IoT Central's Data Export feature but are using custom properties in the message body for the device identity or measurement timestamp, you can still use the JsonPathContentTemplate.

> [!NOTE]
> When using the IotCentralJsonPathContentTemplate, the TypeMatchExpression should resolve to the entire message as a JToken. Refer to the following examples for more details.
 
##### Examples

**Heart rate**

*Message*

```json
{
    "applicationId": "1dffa667-9bee-4f16-b243-25ad4151475e",
    "messageSource": "telemetry",
    "deviceId": "1vzb5ghlsg1",
    "schema": "default@v1",
    "templateId": "urn:qugj6vbw5:___qbj_27r",
    "enqueuedTime": "2021-08-05T22:26:55.455Z",
    "telemetry": {
        "HeartRate": "88",
    },
    "enrichments": {
      "userSpecifiedKey": "sampleValue"
    },
    "messageProperties": {
      "messageProp": "value"
    }
}
```
*Template*

```json
{
    "templateType": "IotCentralJsonPathContent",
    "template": {
        "typeName": "heartrate",
        "typeMatchExpression": "$..[?(@telemetry.HeartRate)]",
        "values": [
            {
                "required": "true",
                "valueExpression": "$.telemetry.HeartRate",
                "valueName": "hr"
            }
        ]
    }
}
```

**Blood pressure**

*Message*

```json
{
    "applicationId": "1dffa667-9bee-4f16-b243-25ad4151475e",
    "messageSource": "telemetry",
    "deviceId": "1vzb5ghlsg1",
    "schema": "default@v1",
    "templateId": "urn:qugj6vbw5:___qbj_27r",
    "enqueuedTime": "2021-08-05T22:26:55.455Z",
    "telemetry": {
        "BloodPressure": {
            "Diastolic": "87",
            "Systolic": "123"
        }
    },
    "enrichments": {
      "userSpecifiedKey": "sampleValue"
    },
    "messageProperties": {
      "messageProp": "value"
    }
}
```
*Template*

```json
{
    "templateType": "IotCentralJsonPathContent",
    "template": {
        "typeName": "bloodPressure",
        "typeMatchExpression": "$..[?(@telemetry.BloodPressure.Diastolic && @telemetry.BloodPressure.Systolic)]",
        "values": [
            {
                "required": "true",
                "valueExpression": "$.telemetry.BloodPressure.Diastolic",
                "valueName": "bp_diastolic"
            },
            {
                "required": "true",
                "valueExpression": "$.telemetry.BloodPressure.Systolic",
                "valueName": "bp_systolic"
            }
        ]
    }
}
```

## Next steps

>[!div class="nextstepaction"]
>[How to use IoT FHIR mapping](how-to-use-fhir-mapping-iot.md)

