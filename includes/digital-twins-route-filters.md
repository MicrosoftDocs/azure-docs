---
author: baanders
description: include file for Azure Digital Twins route filter options
ms.service: digital-twins
ms.topic: include
ms.date: 8/3/2020
ms.author: baanders
---

| Filter name | Description | Filter text schema | Supported values | 
| --- | --- | --- | --- |
| True / False | Allows creating a route with no filtering, or disabling a route so no events are sent | `<true/false>` | `true` = route is enabled with no filtering <br> `false` = route is disabled |
| Type | The [type of event](../articles/digital-twins/concepts-route-events.md#types-of-event-messages) flowing through your digital twin instance | `type = '<eventType>'` | Here are the possible event type values: <br>`Microsoft.DigitalTwins.Twin.Create` <br> `Microsoft.DigitalTwins.Twin.Delete` <br> `Microsoft.DigitalTwins.Twin.Update`<br>`Microsoft.DigitalTwins.Relationship.Create`<br>`Microsoft.DigitalTwins.Relationship.Update`<br> `Microsoft.DigitalTwins.Relationship.Delete` <br> `microsoft.iot.telemetry`  |
| Source | Name of Azure Digital Twins instance | `source = '<hostname>'`| Here are the possible hostname values: <br> **For notifications**: `<yourDigitalTwinInstance>.<yourRegion>.azuredigitaltwins.net` <br> **For telemetry**: `<yourDigitalTwinInstance>.<yourRegion>.azuredigitaltwins.net/digitaltwins/<twinId>`|
| Subject | A description of the event in the context of the event source above | `subject = '<subject>'` | Here are the possible subject values: <br>**For notifications**: The subject is `<twinid>` <br> or a URI format for subjects, which are uniquely identified by multiple parts or IDs:<br>`<twinid>/relationships/<relationshipid>`<br> **For telemetry**: The subject is the component path (if the telemetry is emitted from a twin component), such as `comp1.comp2`. If the telemetry is not emitted from a component, then its subject field is empty. |
| Data schema | DTDL model ID | `dataschema = '<model-dtmi-ID>'` | **For telemetry**: The data schema is the model ID of the twin or the component that emits the telemetry. For example, `dtmi:example:com:floor4;2` <br>**For notifications**: Data schema can be access in the notification body at `$body.$metadata.$model`|
| Content type | Content type of data value | `datacontenttype = '<contentType>'` | The content type is `application/json` |
| Spec version | The version of the event schema you are using | `specversion = '<version>'` | The version must be `1.0`. This indicates the CloudEvents schema version 1.0 |
| Notification body | Reference any property in the `data` field of a notification | `$body.,<property>` | See [How to: Understand event data](https://docs.microsoft.com/azure/digital-twins/how-to-interpret-event-data) for examples of notifications. Any property in the `data` field can be referenced using `$body`

The following data types and comparison operators are supported for the above operations:

| Data Type | Supported Comparisons | Example |
|-|-|-|
|**String**|= != <br>STARTS_WITH(input,text) ENDS_WITH(input,text)<br> CONTAINS(input,text)| `STARTS_WITH($body.$dtId, 'dtmi:example:com:floor4')` <br> `CONTAINS(subject, 'room')`|
|**Integers**|< <= > >= = !=|`$body.$metadata.room.desiredVersion > 1`|
|**Doubles**|< <= > >= = !=|`$body.value <= 5.5`|
|**Bools**|= !=|`$body.isEnabled = true`|
|**Null**|= !=|`$body.prop != null`|

It is also possible to combine filters using the following operations:

| Filter name | Filter text schema | Example | 
| --- | --- | --- |
| AND / OR | `<filter1> AND <filter2>` | `type != 'microsoft.iot.telemetry' AND datacontenttype = 'application/json'` |
| AND / OR | `<filter1> OR <filter2>` | `type != 'microsoft.iot.telemetry' OR datacontenttype = 'application/json'` |
| Nested operations | `(<Comparison1>) AND (<Comparison2>)` | `(type != 'microsoft.iot.telemetry' OR datacontenttype = 'application/json') OR (specversion != '1.0')` |

When you implement or update a filter, the change may take a few minutes to be reflected in the data pipeline.
