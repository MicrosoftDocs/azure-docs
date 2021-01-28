---
author: baanders
description: include file for Azure Digital Twins route filter options
ms.service: digital-twins
ms.topic: include
ms.date: 12/04/2020
ms.author: baanders
---

| Filter name | Description | Filter text schema | Supported values | 
| --- | --- | --- | --- |
| True / False | Allows creating a route with no filtering, or disabling a route so no events are sent | `<true/false>` | `true` = route is enabled with no filtering <br> `false` = route is disabled |
| Type | The [type of event](../articles/digital-twins/concepts-route-events.md#types-of-event-messages) flowing through your digital twin instance | `type = '<eventType>'` | Here are the possible event type values: <br>`Microsoft.DigitalTwins.Twin.Create` <br> `Microsoft.DigitalTwins.Twin.Delete` <br> `Microsoft.DigitalTwins.Twin.Update`<br>`Microsoft.DigitalTwins.Relationship.Create`<br>`Microsoft.DigitalTwins.Relationship.Update`<br> `Microsoft.DigitalTwins.Relationship.Delete` <br> `microsoft.iot.telemetry`  |
| Source | Name of Azure Digital Twins instance | `source = '<hostname>'`| Here are the possible hostname values: <br> **For notifications**: `<yourDigitalTwinInstance>.api.<yourRegion>.digitaltwins.azure.net` <br> **For telemetry**: `<yourDigitalTwinInstance>.api.<yourRegion>.digitaltwins.azure.net/<twinId>`|
| Subject | A description of the event in the context of the event source above | `subject = '<subject>'` | Here are the possible subject values: <br>**For notifications**: The subject is `<twinid>` <br> or a URI format for subjects, which are uniquely identified by multiple parts or IDs:<br>`<twinid>/relationships/<relationshipid>`<br> **For telemetry**: The subject is the component path (if the telemetry is emitted from a twin component), such as `comp1.comp2`. If the telemetry is not emitted from a component, then its subject field is empty. |
| Data schema | DTDL model ID | `dataschema = '<model-dtmi-ID>'` | **For telemetry**: The data schema is the model ID of the twin or the component that emits the telemetry. For example, `dtmi:example:com:floor4;2` <br>**For notifications (create/delete)**: Data schema can be accessed in the notification body at `$body.$metadata.$model`. <br>**For notifications (update)**: Data schema can be accessed in the notification body at `$body.modelId`|
| Content type | Content type of data value | `datacontenttype = '<contentType>'` | The content type is `application/json` |
| Spec version | The version of the event schema you are using | `specversion = '<version>'` | The version must be `1.0`. This indicates the CloudEvents schema version 1.0 |
| Notification body | Reference any property in the `data` field of a notification | `$body.<property>` | See [*How-to: Understand event data*](../articles/digital-twins/how-to-interpret-event-data.md) for examples of notifications. Any property in the `data` field can be referenced using `$body`

The following data types are supported as values returned by references to the data above:

| Data type | Example |
|-|-|-|
|**String**| `STARTS_WITH($body.$metadata.$model, 'dtmi:example:com:floor')` <br> `CONTAINS(subject, '<twinID>')`|
|**Integer**|`$body.errorCode > 200`|
|**Double**|`$body.temperature <= 5.5`|
|**Bool**|`$body.poweredOn = true`|
|**Null**|`$body.prop != null`|

The following operators are supported when defining route filters:

|Family|Operators|Example|
|-|-|-|
|Logical|AND, OR, ( )|`(type != 'microsoft.iot.telemetry' OR datacontenttype = 'application/json') OR (specversion != '1.0')`|
|Comparison|<, <=, >, >=, =, !=|`$body.temperature <= 5.5`

The following functions are supported when defining route filters:

|Function|Description|Example|
|--|--|--|
|STARTS_WITH(x,y)|Returns true if the value `x` starts with the string `y`.|`STARTS_WITH($body.$metadata.$model, 'dtmi:example:com:floor')`|
|ENDS_WITH(x,y) | Returns true if the value `x` ends with the string `y`.|`ENDS_WITH($body.$metadata.$model, 'floor;1')`|
|CONTAINS(x,y)| Returns true if the value `x` contains the string `y`.|`CONTAINS(subject, '<twinID>')`|

When you implement or update a filter, the change may take a few minutes to be reflected in the data pipeline.