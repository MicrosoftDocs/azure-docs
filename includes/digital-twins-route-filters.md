| Filter name | Description | Filter schema | Supported values | 
| --- | --- | --- | --- |
| Type | The [type of event](../articles/digital-twins/concepts-route-events.md#types-of-event-messages) flowing through your digital twin instance | `"filter" : "type = '<eventType>'"` | `Microsoft.DigitalTwins.Twin.Create` <br> `Microsoft.DigitalTwins.Twin.Delete` <br> `Microsoft.DigitalTwins.Twin.Update`<br>`Microsoft.DigitalTwins.Relationship.Create`<br>`Microsoft.DigitalTwins.Relationship.Update`<br> `Microsoft.DigitalTwins.Relationship.Delete` <br> `microsoft.iot.telemetry`  |
| Source | Name of Azure Digital Twins instance | `"filter text" : "source = '<hostname>'"`|  **For notifications**: `<yourDigitalTwinInstance>.<yourRegion>.azuredigitaltwins.net` <br> **For telemetry**: `<yourDigitalTwinInstance>.<yourRegion>.azuredigitaltwins.net/digitaltwins/<twinId>`|
| Subject | A description of the event in the context of the event source above | `"filter text": " subject = '<subject>'"` | **For notifications**: The subject is `<twinid>` <br> or a URI format for subjects, which are uniquely identified by multiple parts or IDs:<br>`<twinid>/relationships/<relationshipid>`<br> **For telemetry**: The subject is the component path (if the telemetry is emitted from a twin component), such as `comp1.comp2`. If the telemetry is not emitted from a component, then its subject field is empty. |
| Data schema | DTDL model ID | `"filter text": "dataschema = 'dtmi:example:com:floor4;2'"` | **For telemetry**: The data schema is the model ID of the twin or the component that emits the telemetry <br>**For notifications**: Data schema is not supported|
| Content type | Content type of data value | `"filter text": "datacontenttype = '<contentType>'"` | `application/json` |
| Spec version | The version of the event schema you are using | `"filter text": "specversion = '<version>'"` | Must be `1.0`. This indicates the CloudEvents schema version 1.0 |
| True / False | Allows creating a route with no filtering, or disabling a route | `"filter text" : "<true/false>"` | `true` = route is enabled with no filtering <br> `false` = route is disabled |
<!--
| ID | *Not implemented for public preview* | "filter": "id = '…'" | |
| Schema | *Not implemented for public preview*  | "filter": "dataschema = '…'" | |
-->

It is also possible to combine filters using the following operations:

| Filter name | Filter schema | Example | 
| --- | --- | --- |
| AND / OR | `"filter text": "<filter1> AND <filter2>"` | `"filter text": "type != 'microsoft.iot.telemetry' AND datacontenttype = 'application/json'"` |
| AND / OR | `"filter text": "<filter1> OR <filter2>"` | `"filter text": "type != 'microsoft.iot.telemetry' OR datacontenttype = 'application/json'"` |
| Nested operations | `"filter text": "(<Comparison1>) AND (<Comparison2>)"` | `"filter text": "(type != 'microsoft.iot.telemetry' OR datacontenttype = 'application/json') OR (specversion != '1.0')"` |