---
title: Transform data inside Azure IoT Central | Microsoft Docs
description: IoT devices send data in various formats that you may need to transform. This article describes how to transform data inside of IoT Central before exporting it.
author: dominicbetts
ms.author: dobett
ms.date: 10/28/2021
ms.topic: how-to
ms.service: iot-central
services: iot-central

# This topic applies to solution builders.
---

# Transform data inside your IoT Central application

IoT devices send data in various formats. To use the device data in your IoT solution, you may need to transform your device data before it's exported to other services.

This article shows you how to transform device data inside of an IoT Central application as part of a data export definition.

## Transform and export data

Transforms in IoT Central data export enable you to manipulate the device data including the data format prior to exporting the data to a destination. In your data export, you can specify a transform for each of your destination. Each message being exported will pass through the transform creating an output, which will be exported to the destination. 

You can leverage transforms to restructure JSON payloads, rename fields, filter out fields, and run simple calculations on telemetry values before exporting the data to a destination. For example, you can use the transforms to map your messages into tabular format so your data can match the schema of your destination (example: a table in Azure Data Explorer).

### Add a Transform

To add a transform for a destination in your data export, select '+ Transform' as shown in the following screenshot

The Data Transformation panel will enable you to specify the transformation. In section '**1. Add input message**', you can type an input message that you want to pass through the transformation. Alternatively, you can also generate a sample message by selecting a device template. In section '**2. Build transformation query**', you can add the query that transforms the input message. You can see the output of the transformation query in section '**3. Preview output messages(s)**'.

### Build Transformation query

The transform engine is powered by [JQ](https://stedolan.github.io/jq/) – an open-source JSON transformation engine that specializes in restructuring and formatting JSON payloads. You can specify a Transform by writing a query in JQ and can leverage different in-built filters, functions, and features of JQ. For query examples, see below section ‘Transform query examples’ and visit [JQ manual](https://stedolan.github.io/jq/manual/) for more information on writing queries using JQ.

### Pre-transformation message structure

Each stream of data (telemetry, properties, device connectivity, device lifecycle) contains information including telemetry values, application info, device metadata, and property values.

Following message is the overall shape of the input message for the telemetry stream. You can use all this data in your transformation. The overall structure of the message is similar for other streams (properties, device lifecycle, etc.) but there are some stream-specific fields for each stream type. Try using the “Generate sample input message” feature in the IoT Central application UI to see sample message structures for other stream types.

```json
{
"applicationId": "93d68c98-9a22-4b28-94d1-06625d4c3d0f",
    "device": {
      "id": "31edabe6-e0b9-4c83-b0df-d12e95745b9f",
      "name": "Scripted Device - 31edabe6-e0b9-4c83-b0df-d12e95745b9f",
      "cloudProperties": [],
      "properties": {
        "reported": [
          {
            "id": "urn:smartKneeBrace:Smart_Vitals_Patch_wr:FirmwareVersion:1",
            "name": "FirmwareVersion",
            "value": 1.0
          }
        ]
      },
      "templateId": "urn:sbq3croo:modelDefinition:nf7st1wn3",
      "templateName": "Smart Knee Brace"
    },
    "telemetry": [
        {
          "id": "urn:continuousPatientMonitoringTemplate:Smart_Knee_Brace_6wm:Acceleration:1",
          "name": "Acceleration",
          "value": {
            "x": 19.212770659918583,
            "y": 20.596296675217335,
            "z": 54.04859440697045
          }
        },
        {
          "id": "urn:continuousPatientMonitoringTemplate:Smart_Knee_Brace_6wm:RangeOfMotion:1",
          "name": "RangeOfMotion",
          "value": 110
        }
    ],
    "enqueuedTime": "2021-03-23T19:55:56.971Z",
    "enrichments": {
        "your-enrichment-key": "enrichment-value"
    },
    "messageProperties": {
        "prop1": "prop-value"
    },
    "messageSource": "telemetry"
}
```

### Transform query examples

In the following examples, we will use the above pre-transformed message as input device message.

Example-1: Following JQ query outputs each piece of telemetry from the input message as a separate output message/row. (To output them as an array in a single message, change your query to .telemetry)

``` transform query
.telemetry[]
```

Output, in JSON format:
```json
{
"id": "urn:continuousPatientMonitoringTemplate:Smart_Knee_Brace_6wm:Acceleration:1",
    "name": "Acceleration",
    "value": {
        "x": 19.212770659918583,
        "y": 20.596296675217335,
        "z": 54.04859440697045
    }
},
{
    "id": "urn:continuousPatientMonitoringTemplate:Smart_Knee_Brace_6wm:RangeOfMotion:1",
    "name": "RangeOfMotion",
    "value": 110
}
```

Example-2: Following JQ query converts the telemetry array into an object keyed on the telemetry name    

``` transform query
     .telemetry | map({ key: .name, value: .value }) | from_entries
```

Output, in JSON format:
```json
{
    "Acceleration": {
        "x": 19.212770659918583,
        "y": 20.596296675217335,
        "z": 54.04859440697045
    },
    "RangeOfMotion": 110
}
```

Example-3: Following JQ query finds the telemetry value for "RangeOfMotion" and converts it from degree to radian (formula: rad = degree * pi / 180)

``` transform query
import "iotc" as iotc;
{
    rangeOfMotion: (
        .telemetry
        | iotc::find(.name == "RangeOfMotion").value
        | . * 3.14159265358979323846 / 180
    )
}
```

Output, in JSON format:
```json
{
    "rangeOfMotion": 1.9198621771937625
}
```

Example-4: To manipulate the input message into a tabular format (e.g. when exporting to Azure Data Explorer), you can map each exported message into one or more “rows”. A row output is logically represented as a JSON object where the column name is the key and the column value is the value, like this:
{
    <column 1 name>: <column 1 value>,
    <column 2 name>: <column 2 value>,
    ...
}

Following JQ query writes rows into a table that stores range of motion telemetry across different devices. It maps device ID, enqueuedTime, RangeOfMotion into a table with these 3 columns.

``` transform query
import "iotc" as iotc;
{
    deviceId: .deviceId,
    timestamp: .enqueuedTime,
    rangeOfMotion: .telemetry | iotc::find(.name == "RangeOfMotion").value
}
```

Output in JSON format:
```json
{
    "deviceId": "31edabe6-e0b9-4c83-b0df-d12e95745b9f",
    "timestamp": "2021-03-23T19:55:56.971Z",
    "rangeOfMotion": 110
}
```

### IoT Central Module

A module in JQ is a collection of custom functions. As part of your transform query, you can import a built-in IoT Central specific module containing functions that makes it easier for you to write transform queries. To import the IoT Central module, use the following directive before you write the query.

``` transform query
import "iotc" as iotc;
```

#### Supported functions in “iotc” module:
a.	find(expression): The “find” function helps you find a specific array element such as telemetry or property entry in your payload. The input to it is an array and the parameter defines a JQ filter which is run against each element in the array and evaluates to true for the element you want to return 

Example: find a specific telemetry value with name “RangeOfMotion”:

``` transform query
.telemetry | iotc::find(.name == “RangeOfMotion”)
```

### Scenarios
Following scenarios leverage the Transform functionality in IoT Central data export to customize the format of device data specific to a destination.

### Scenario 1: Export device data to ADX

In this scenario, the device data is transformed to match the following fixed schema in Azure Data Explorer, where each telemetry value appears as a column in the table and each row represents a single message.
| DeviceId | Timestamp | T1 |	T2 |T3 |
| :------------- | :---------- | :----------- | :---------- | :----------- |
| "31edabe6-e0b9-4c83-b0df-d12e95745b9f" |"2021-03-23T19:55:56.971Z	| 1.18898	| 1.434709	| 2.97008 |

To export data that is compatible with this table, each message needs to look like the following object. The object represents a single row, where object keys are column names and object values are the value to place in each column:

```json
{
    "Timestamp": <value-of-Timestamp>,
    "DeviceId": <value-of-deviceId>,
    "T1": <value-of-T1>,
    "T2": <value-of-T2>,
    "T3": <value-of-T3>,
}
```
In this example, the device sends three telemetry values (T1, T2, and T3) and the input message is in the following format

```json
{
    "applicationId": "c57fe8d9-d15d-4659-9814-d3cc38ca9e1b",
    "enqueuedTime": "1933-01-26T03:10:44.480001324Z",
    "messageSource": "telemetry",
    "telemetry": [
        {
            "id": "dtmi:sekharjsonbugbash288:sekharbugbash1lr:t1;1",
            "name": "t1",
            "value": 1.1889838348731093e+308
        },
        {
            "id": "dtmi:sekharjsonbugbash288:sekharbugbash1lr:t2;1",
            "name": "t2",
            "value": 1.4347093391531383e+308
        },
        {
            "id": "dtmi:sekharjsonbugbash288:sekharbugbash1lr:t3;1",
            "name": "t3",
            "value": 2.9700885230380616e+307
        }
    ],
    "device": {
        "id": "oozrnl1zs857",
        "name": "haptic alarm",
        "templateId": "dtmi:modelDefinition:nhhbjotee:qytxnp8hi",
        "templateName": "sekharbugbash",
        "properties": {
            "reported": []
        },
        "cloudProperties": [],
        "simulated": true,
        "approved": false,
        "blocked": false,
        "provisioned": true
    }
}
```

Following JQ query outputs the telemetry values (T1, T2 and T3) along with ‘enqueuedTime’ and the device id. The query then creates a message with key-value pairs that matches the ADX table schema.

``` transform query
import "iotc" as iotc;
{
    deviceId: .device.id,
    Timestamp: .enqueuedTime,
    T1: .telemetry | iotc::find(.name == "t1").value,
    T2: .telemetry | iotc::find(.name == "t2").value,
    T3: .telemetry | iotc::find(.name == "t3").value,
}
```

Output, in JSON format:

```json
{
    "T1": 1.1889838348731093e+308,
    "T2": 1.4347093391531383e+308,
    "T3": 2.9700885230380616e+307,
    "Timestamp": "1933-01-26T03:10:44.480001324Z",
    "deviceId": "oozrnl1zs857"
}
```
For more details on adding an Azure Data Explorer cluster and database as destination, See [Creating Azure Data Explorer as destination].

### Scenario 2: Breaking apart array telemetry

In this scenario, the device sends the following array of telemetry in one message.

```json
{
    "applicationId": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "enqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "messageSource": "telemetry",
    "telemetry": [
        {
            "id": "dtmi:sample1:data;1",
            "name": "data",
            "value": [
                {
                    "id": "subdevice1",
                    "values": {
                        "running": true,
                        "cycleCount": 2315
                    }
                },
                {
                    "id": "subdevice2",
                    "values": {
                        "running": false,
                        "cycleCount": 824567
                    }
                }
            ]
        },
        {
            "id": "dtmi:sample1:parentStatus;1",
            "name": "parentStatus",
            "value": "healthy"
        }
    ],
    "device": {
        "id": "9xwhr7khkfri",
        "name": "wireless port",
        "templateId": "dtmi:hpzy1kfcbt2:umua7dplmbd",
        "templateName": "Smart Vitals Patch",
        "properties": {
            "reported": [
                {
                    "id": "dtmi:sample1:prop;1",
                    "name": "Connectivity",
                    "value": "Tenetur ut quasi minus ratione voluptatem."
                }
            ]
        },
        "cloudProperties": [],
        "simulated": true,
        "approved": true,
        "blocked": false,
        "provisioned": false
    }
}
```

This device data is transformed to match the following table schema 

Field1	Field2	Field3
Value1	Value2	Value3
AnotherValue1	AnotherValue2	AnotherValue3

Following JQ query creates a separate output message/row for each subdevice entry in the message, while also including some common information from the base message and parent device in each output message. This allows you to flatten the output and separate out logical divisions in your data which may have arrived as a single message.

``` transform query
import "iotc" as iotc;
{
    enqueuedTime: .enqueuedTime,
    deviceId: .device.id,
    parentStatus: .telemetry | iotc::find(.name == "parentStatus").value
} + (
    .telemetry
    | iotc::find(.name == "data").value[]
    | {
        subdeviceId: .id,
        running: .values.running,
        cycleCount: .values.cycleCount
    }
)
```

Output, in JSON format:

```json
{
    "cycleCount": 2315,
    "deviceId": "9xwhr7khkfri",
    "enqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "parentStatus": "healthy",
    "running": true,
    "subdeviceId": "subdevice1"
},
{
    "cycleCount": 824567,
    "deviceId": "9xwhr7khkfri",
    "enqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "parentStatus": "healthy",
    "running": false,
    "subdeviceId": "subdevice2"
}
```

### Scenario 3: Power BI Streaming
Power BI real-time streaming feature allows you to view data in a dashboard, which is updated in real-time with ultra-low latency. For more information, visit [Real-time streaming in Power BI](https://docs.microsoft.com/en-us/power-bi/connect-data/service-real-time-streaming) for more information 

To use IoT Central with Power BI Streaming, you need to set up a webhook export which sends request bodies in a specific format. In this example, a Power BI Streaming dataset has been set up with the following data schema:

```
[
{
        "bloodPressureDiastolic": 161438124,
        "bloodPressureSystolic": -966387879,
        "deviceId": "9xwhr7khkfri",
        "deviceName": "wireless port",
        "heartRate": -633994413,
        "heartRateVariability": -37514094,
        "respiratoryRate": 1582211310,
        "timestamp": "1909-10-10T07:11:56.078161042Z"
    }
]
```

 A IoT Central data export with a transform to the webhook destination is setup so that an output message that matches the PowerBI streaming dataset schema can be exported.In this example, following is the input message

```json
{
    "applicationId": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "enqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "messageSource": "telemetry",
    "telemetry": [
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:HeartRate;1",
            "name": "HeartRate",
            "value": -633994413
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:RespiratoryRate;1",
            "name": "RespiratoryRate",
            "value": 1582211310
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:HeartRateVariability;1",
            "name": "HeartRateVariability",
            "value": -37514094
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:BodyTemperature;1",
            "name": "BodyTemperature",
            "value": 5.323322666478241e+307
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:FallDetection;1",
            "name": "FallDetection",
            "value": "Earum est nobis at voluptas id qui."
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:BloodPressure;1",
            "name": "BloodPressure",
            "value": {
                "Diastolic": 161438124,
                "Systolic": -966387879
            }
        }
    ],
    "device": {
        "id": "9xwhr7khkfri",
        "name": "wireless port",
        "templateId": "dtmi:hpzy1kfcbt2:umua7dplmbd",
        "templateName": "Smart Vitals Patch",
        "properties": {
            "reported": [
                {
                    "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_wr:DeviceStatus;1",
                    "name": "DeviceStatus",
                    "value": "Id optio iste vero et neque sit."
                }
            ]
        },
        "cloudProperties": [],
        "simulated": true,
        "approved": true,
        "blocked": false,
        "provisioned": false
    }
}
```

Following JQ query transforms the input message and provides an output that can be exported to a webhook for Power BI streaming of the data. In this example, an additional filter condition is added to only produce output messages for a specific device template that has the appropriate information. Alternatively, you can also use the filter feature of Data Export to perform this filtering.

``` transform query
import "iotc" as iotc;
if .device.templateId == "dtmi:hpzy1kfcbt2:umua7dplmbd" then 
    [{
        deviceId: .device.id,
        timestamp: .enqueuedTime,
        deviceName: .device.name,
        bloodPressureSystolic: .telemetry | iotc::find(.name == "BloodPressure").value.Systolic,
        bloodPressureDiastolic: .telemetry | iotc::find(.name == "BloodPressure").value.Diastolic,
        heartRate: .telemetry | iotc::find(.name == "HeartRate").value,
        heartRateVariability: .telemetry | iotc::find(.name == "HeartRateVariability").value,
        respiratoryRate: .telemetry | iotc::find(.name == "RespiratoryRate").value
    }]
else
    empty
end
```

Output in JSON format

```json
{
        "bloodPressureDiastolic": 161438124,
        "bloodPressureSystolic": -966387879,
        "deviceId": "9xwhr7khkfri",
        "deviceName": "wireless port",
        "heartRate": -633994413,
        "heartRateVariability": -37514094,
        "respiratoryRate": 1582211310,
        "timestamp": "1909-10-10T07:11:56.078161042Z"
    }
```


### Scenario 4: Export data to Azure Data Explorer and visualize in Power BI

In this scenario, data is exported to Azure Data Explorer and then a connector is used  to visualize the data in Power BI.
Visit section [Creating Azure Data Explorer as destination] for setting up Azure Data Explorer. This example uses a table with the following schema

``` kusto
.create table $TABLENAME (
    EnqueuedTime:datetime,
    Message:string,
    Application:string,
    Device:string,
    Simulated:boolean,
    Template:string,
    Module:string,
    Component:string,
    Capability:string,
    Value:dynamic
)
```

Following is the input message:

```json
{
    "applicationId": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "enqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "messageSource": "telemetry",
    "telemetry": [
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:HeartRate;1",
            "name": "HeartRate",
            "value": -633994413
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:RespiratoryRate;1",
            "name": "RespiratoryRate",
            "value": 1582211310
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:HeartRateVariability;1",
            "name": "HeartRateVariability",
            "value": -37514094
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:BodyTemperature;1",
            "name": "BodyTemperature",
            "value": 5.323322666478241e+307
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:FallDetection;1",
            "name": "FallDetection",
            "value": "Earum est nobis at voluptas id qui."
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:BloodPressure;1",
            "name": "BloodPressure",
            "value": {
                "Diastolic": 161438124,
                "Systolic": -966387879
            }
        }
    ],
    "device": {
        "id": "9xwhr7khkfri",
        "name": "wireless port",
        "templateId": "dtmi:hpzy1kfcbt2:umua7dplmbd",
        "templateName": "Smart Vitals Patch",
        "properties": {
            "reported": [
                {
                    "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_wr:DeviceStatus;1",
                    "name": "DeviceStatus",
                    "value": "Id optio iste vero et neque sit."
                }
            ]
        },
        "cloudProperties": [],
        "simulated": true,
        "approved": true,
        "blocked": false,
        "provisioned": false
    }
}
```
Following JQ query transforms the input message to a separate output message for each telemetry value. This transform (produces an output that matches Azure Data Explorer table schema) allows to represent arbitrary telemetry in tabular form. It uses an EAV (entity-attribute-value) schema where each row holds a single telemetry value and the name of the telemetry is a value in a separate column in the same row. 

``` transform query
. as $in | .telemetry[] | {
    EnqueuedTime: $in.enqueuedTime,
    Message: $in.messageId,
    Application: $in.applicationId,
    Device: $in.device.id,
    Simulated: $in.device.simulated,
    Template: ($in.device.templateName // ""),
    Module: ($in.module // ""),
    Component: ($in.component // ""),
    Capability: .name,
    Value: .value
}
```

Output in JSON format

```json
{
    "Application": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "Capability": "HeartRate",
    "Component": "",
    "Device": "9xwhr7khkfri",
    "EnqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "Message": null,
    "Module": "",
    "Simulated": true,
    "Template": "Smart Vitals Patch",
    "Value": -633994413
},
{
    "Application": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "Capability": "RespiratoryRate",
    "Component": "",
    "Device": "9xwhr7khkfri",
    "EnqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "Message": null,
    "Module": "",
    "Simulated": true,
    "Template": "Smart Vitals Patch",
    "Value": 1582211310
},
{
    "Application": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "Capability": "HeartRateVariability",
    "Component": "",
    "Device": "9xwhr7khkfri",
    "EnqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "Message": null,
    "Module": "",
    "Simulated": true,
    "Template": "Smart Vitals Patch",
    "Value": -37514094
},
{
    "Application": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "Capability": "BodyTemperature",
    "Component": "",
    "Device": "9xwhr7khkfri",
    "EnqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "Message": null,
    "Module": "",
    "Simulated": true,
    "Template": "Smart Vitals Patch",
    "Value": 5.323322666478241e+307
},
{
    "Application": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "Capability": "FallDetection",
    "Component": "",
    "Device": "9xwhr7khkfri",
    "EnqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "Message": null,
    "Module": "",
    "Simulated": true,
    "Template": "Smart Vitals Patch",
    "Value": "Earum est nobis at voluptas id qui."
},
{
    "Application": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "Capability": "BloodPressure",
    "Component": "",
    "Device": "9xwhr7khkfri",
    "EnqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "Message": null,
    "Module": "",
    "Simulated": true,
    "Template": "Smart Vitals Patch",
    "Value": {
        "Diastolic": 161438124,
        "Systolic": -966387879
    }
}
```

The output data is exported to Azure Data Explorer. To visualize the exported data stored in the Power BI, follow these steps
1. Ensure you installed the Power BI application. You can download a desktop Power BI from [here](https://powerbi.microsoft.com/en-us/desktop/).
2. Download file - IoT Central ADX connector. 
3. Open the file downloaded in step-2 using Power BI app and enter the ADX cluster/database/table information when prompted

Now you can visualize the data in Power BI. 

## Comparison of legacy data export and data export

The following table shows the differences between the [legacy data export](howto-export-data-legacy.md) and data export features:

| Capabilities  | Legacy data export | New data export |
| :------------- | :---------- | :----------- |
| Available data types | Telemetry, Devices, Device templates | Telemetry, Property changes, Device connectivity changes, Device lifecycle changes, Device template lifecycle changes |
| Filtering | None | Depends on the data type exported. For telemetry, filtering by telemetry, message properties, property values |
| Enrichments | None | Enrich with a custom string or a property value on the device |
| Destinations | Azure Event Hubs, Azure Service Bus queues and topics, Azure Blob Storage | Same as for legacy data export plus webhooks|
| Supported application versions | V2, V3 | V3 only |
| Notable limits | Five exports per app, one destination per export | 10 exports-destination connections per app |


## Next steps

<!-- TODO: Need to update this -->

In this article, you learned about the different options for transforming device data for IoT Central, both at ingress and egress. The article included walkthroughs for two specific scenarios:

- Use an IoT Edge module to transform data from downstream devices before the data is sent to your IoT Central application.
- Use Azure Functions to transform data outside of IoT Central. In this scenario, IoT Central uses a data export to send incoming data to an Azure function to be transformed. The function sends the transformed data back to your IoT Central application.

Now that you've learned how to transform device data outside of your Azure IoT Central application, you can learn [How to use analytics to analyze device data in IoT Central](howto-create-analytics.md).
