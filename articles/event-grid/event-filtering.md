---
title: Event filtering for Azure Event Grid
description: Describes how to filter events when creating an Azure Event Grid subscription.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 09/09/2022
---

# Understand event filtering for Event Grid subscriptions

This article describes the different ways to filter which events are sent to your endpoint. When creating an event subscription, you have three options for filtering:

* Event types
* Subject begins with or ends with
* Advanced fields and operators

## Azure Resource Manager template
The examples shown in this article are JSON snippets for defining filters in Azure Resource Manager (ARM) templates. For an example of a complete ARM template and deploying an ARM template, see [Quickstart: Route Blob storage events to web endpoint by using an ARM template](blob-event-quickstart-template.md). Here's some more sections around the `filter` section from the example in the quickstart. The ARM template defines the following resources.

- Azure storage account
- System topic for the storage account
- Event subscription for the system topic. You'll see the `filter` subsection in the event subscription section. 

In the following example, the event subscription filters for `Microsoft.Storage.BlobCreated` and `Microsoft.Storage.BlobDeleted` events. 

```json
{
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-08-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2",
      "properties": {
        "accessTier": "Hot"
      }
    },
    {
      "type": "Microsoft.EventGrid/systemTopics",
      "apiVersion": "2021-12-01",
      "name": "[parameters('systemTopicName')]",
      "location": "[parameters('location')]",
      "properties": {
        "source": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
        "topicType": "Microsoft.Storage.StorageAccounts"
      },
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
      ]
    },
    {
      "type": "Microsoft.EventGrid/systemTopics/eventSubscriptions",
      "apiVersion": "2021-12-01",
      "name": "[format('{0}/{1}', parameters('systemTopicName'), parameters('eventSubName'))]",
      "properties": {
        "destination": {
          "properties": {
            "endpointUrl": "[parameters('endpoint')]"
          },
          "endpointType": "WebHook"
        },
        "filter": {
          "includedEventTypes": [
            "Microsoft.Storage.BlobCreated",
            "Microsoft.Storage.BlobDeleted"
          ]
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.EventGrid/systemTopics', parameters('systemTopicName'))]"
      ]
    }
  ]
}
```

## Event type filtering

By default, all [event types](event-schema.md) for the event source are sent to the endpoint. You can decide to send only certain event types to your endpoint. For example, you can get notified of updates to your resources, but not notified for other operations like deletions. In that case, filter by the `Microsoft.Resources.ResourceWriteSuccess` event type. Provide an array with the event types, or specify `All` to get all event types for the event source.

The JSON syntax for filtering by event type is:

```json
"filter": {
  "includedEventTypes": [
    "Microsoft.Resources.ResourceWriteFailure",
    "Microsoft.Resources.ResourceWriteSuccess"
  ]
}
```

## Subject filtering

For simple filtering by subject, specify a starting or ending value for the subject. For example, you can specify the subject ends with `.txt` to only get events related to uploading a text file to storage account. Or, you can filter the subject begins with `/blobServices/default/containers/testcontainer` to get all events for that container but not other containers in the storage account.

When publishing events to custom topics, create subjects for your events that make it easy for subscribers to know whether they're interested in the event. Subscribers use the **subject** property to filter and route events. Consider adding the path for where the event happened, so subscribers can filter by segments of that path. The path enables subscribers to narrowly or broadly filter events. If you provide a three segment path like `/A/B/C` in the subject, subscribers can filter by the first segment `/A` to get a broad set of events. Those subscribers get events with subjects like `/A/B/C` or `/A/D/E`. Other subscribers can filter by `/A/B` to get a narrower set of events.

### Examples (Blob Storage events)
Blob events can be filtered by the event type, container name, or name of the object that was created or deleted. 

The subject of Blob storage events uses the format:

```
/blobServices/default/containers/<containername>/blobs/<blobname>
```

To match all events for a storage account, you can leave the subject filters empty.

To match events from blobs created in a set of containers sharing a prefix, use a `subjectBeginsWith` filter like:

```
/blobServices/default/containers/containerprefix
```

To match events from blobs created in specific container, use a `subjectBeginsWith` filter like:

```
/blobServices/default/containers/containername/
```

To match events from blobs created in specific container sharing a blob name prefix, use a `subjectBeginsWith` filter like:

```
/blobServices/default/containers/containername/blobs/blobprefix
```
To match events from blobs create in a specific subfolder of a container, use a `subjectBeginsWith` filter like:

```
/blobServices/default/containers/{containername}/blobs/{subfolder}/
```

To match events from blobs created in specific container sharing a blob suffix, use a `subjectEndsWith` filter like ".log" or ".jpg". 

## Advanced filtering

To filter by values in the data fields and specify the comparison operator, use the advanced filtering option. In advanced filtering, you specify the:

* operator type - The type of comparison.
* key - The field in the event data that you're using for filtering. It can be a number, boolean, string, or an array.
* values - The value or values to compare to the key.

## Key
Key is the field in the event data that you're using for filtering. It can be one of the following types:

- Number
- Boolean
- String
- Array. You need to set the `enableAdvancedFilteringOnArrays` property to true to use this feature. 

    ```json
    "filter":
    {
        "subjectBeginsWith": "/blobServices/default/containers/mycontainer/blobs/log",
        "subjectEndsWith": ".jpg",
        "enableAdvancedFilteringOnArrays": true
    }
    ```

For events in the **Event Grid schema**, use the following values for the key: `ID`, `Topic`, `Subject`, `EventType`, `DataVersion`, or event data (like `data.key1`).

For events in **Cloud Events schema**, use the following values for the key: `id`, `source`, `type`, `specversion`, or custom properties using `.` as the nesting separator (example: `data.appEventTypeDetail.action`).

For **custom input schema**, use the event data fields (like `data.key1`). To access fields in the data section, use the `.` (dot) notation. For example, `data.siteName`, `data.appEventTypeDetail.action` to access `siteName` or `action` for the following sample event.

```json
	"data": {
		"appEventTypeDetail": {
			"action": "Started"
		},
		"siteName": "<site-name>",
		"clientRequestId": "None",
		"correlationRequestId": "None",
		"requestId": "292f499d-04ee-4066-994d-c2df57b99198",
		"address": "None",
		"verb": "None"
	},
```

> [!NOTE]
> Event Grid doesn't support filtering on an array of objects. It only allows String, Boolean, Numbers, and Array of the same types (like integer array or string array).
 

## Values
The values can be: number, string, boolean, or array

## Operators

The available operators for **numbers** are:

## NumberIn
The NumberIn operator evaluates to true if the **key** value is one of the specified **filter** values. In the following example, it checks whether the value of the `counter` attribute in the `data` section is 5 or 1. 

```json
"advancedFilters": [{
    "operatorType": "NumberIn",
    "key": "data.counter",
    "values": [
        5,
        1
    ]
}]
```


If the key is an array, all the values in the array are checked against the array of filter values. Here's the pseudo code with the key: `[v1, v2, v3]` and the filter: `[a, b, c]`. Any key values with data types that don’t match the filter’s data type are ignored.

```
FOR_EACH filter IN (a, b, c)
    FOR_EACH key IN (v1, v2, v3)
        IF filter == key
            MATCH
```

## NumberNotIn
The NumberNotIn evaluates to true if the **key** value is **not** any of the specified **filter** values. In the following example, it checks whether the value of the `counter` attribute in the `data` section isn't 41 and 0. 

```json
"advancedFilters": [{
    "operatorType": "NumberNotIn",
    "key": "data.counter",
    "values": [
        41,
        0
    ]
}]
```

If the key is an array, all the values in the array are checked against the array of filter values. Here's the pseudo code with the key: `[v1, v2, v3]` and the filter: `[a, b, c]`. Any key values with data types that don’t match the filter’s data type are ignored.

```
FOR_EACH filter IN (a, b, c)
    FOR_EACH key IN (v1, v2, v3)
        IF filter == key
            FAIL_MATCH
```

## NumberLessThan
The NumberLessThan operator evaluates to true if the **key** value is **less than** the specified **filter** value. In the following example, it checks whether the value of the `counter` attribute in the `data` section is less than 100. 

```json
"advancedFilters": [{
    "operatorType": "NumberLessThan",
    "key": "data.counter",
    "value": 100
}]
```

If the key is an array, all the values in the array are checked against the filter value. Here's the pseudo code with the key: `[v1, v2, v3]`. Any key values with data types that don’t match the filter’s data type are ignored.

```
FOR_EACH key IN (v1, v2, v3)
    IF key < filter
        MATCH
```

## NumberGreaterThan
The NumberGreaterThan operator evaluates to true if the **key** value is **greater than** the specified **filter** value. In the following example, it checks whether the value of the `counter` attribute in the `data` section is greater than 20. 

```json
"advancedFilters": [{
    "operatorType": "NumberGreaterThan",
    "key": "data.counter",
    "value": 20
}]
```

If the key is an array, all the values in the array are checked against the filter value. Here's the pseudo code with the key: `[v1, v2, v3]`. Any key values with data types that don’t match the filter’s data type are ignored.

```
FOR_EACH key IN (v1, v2, v3)
    IF key > filter
        MATCH
```

## NumberLessThanOrEquals
The NumberLessThanOrEquals operator evaluates to true if the **key** value is **less than or equal** to the specified **filter** value. In the following example, it checks whether the value of the `counter` attribute in the `data` section is less than or equal to 100. 

```json
"advancedFilters": [{
    "operatorType": "NumberLessThanOrEquals",
    "key": "data.counter",
    "value": 100
}]
```

If the key is an array, all the values in the array are checked against the filter value. Here's the pseudo code with the key: `[v1, v2, v3]`. Any key values with data types that don’t match the filter’s data type are ignored.

```
FOR_EACH key IN (v1, v2, v3)
    IF key <= filter
        MATCH
```

## NumberGreaterThanOrEquals
The NumberGreaterThanOrEquals operator evaluates to true if the **key** value is **greater than or equal** to the specified **filter** value. In the following example, it checks whether the value of the `counter` attribute in the `data` section is greater than or equal to 30. 

```json
"advancedFilters": [{
    "operatorType": "NumberGreaterThanOrEquals",
    "key": "data.counter",
    "value": 30
}]
```

If the key is an array, all the values in the array are checked against the filter value. Here's the pseudo code with the key: `[v1, v2, v3]`. Any key values with data types that don’t match the filter’s data type are ignored.

```
FOR_EACH key IN (v1, v2, v3)
    IF key >= filter
        MATCH
```

## NumberInRange
The NumberInRange operator evaluates to true if the **key** value is in one of the specified **filter ranges**. In the following example, it checks whether the value of the `key1` attribute in the `data` section is in one of the two ranges: 3.14159 - 999.95, 3000 - 4000. 

```json
{
    "operatorType": "NumberInRange",
    "key": "data.key1",
    "values": [[3.14159, 999.95], [3000, 4000]]
}
```

The `values` property is an array of ranges. In the previous example, it's an array of two ranges. Here's an example of an array with one range to check. 

**Array with one range:** 
```json
{
    "operatorType": "NumberInRange",
    "key": "data.key1",
    "values": [[3000, 4000]]
}
```

If the key is an array, all the values in the array are checked against the array of filter values. Here's the pseudo code with the key: `[v1, v2, v3]` and the filter: an array of ranges. In this pseudo code, `a` and `b` are low and high values of each range in the array. Any key values with data types that don’t match the filter’s data type are ignored.

```
FOR_EACH (a,b) IN filter.Values
    FOR_EACH key IN (v1, v2, v3)
       IF key >= a AND key <= b
           MATCH
```


## NumberNotInRange
The NumberNotInRange operator evaluates to true if the **key** value is **not** in any of the specified **filter ranges**. In the following example, it checks whether the value of the `key1` attribute in the `data` section is in one of the two ranges: 3.14159 - 999.95, 3000 - 4000. If it's, the operator returns false. 

```json
{
    "operatorType": "NumberNotInRange",
    "key": "data.key1",
    "values": [[3.14159, 999.95], [3000, 4000]]
}
```
The `values` property is an array of ranges. In the previous example, it's an array of two ranges. Here's an example of an array with one range to check.

**Array with one range:** 
```json
{
    "operatorType": "NumberNotInRange",
    "key": "data.key1",
    "values": [[3000, 4000]]
}
```

If the key is an array, all the values in the array are checked against the array of filter values. Here's the pseudo code with the key: `[v1, v2, v3]` and the filter: an array of ranges. In this pseudo code, `a` and `b` are low and high values of each range in the array. Any key values with data types that don’t match the filter’s data type are ignored.

```
FOR_EACH (a,b) IN filter.Values
    FOR_EACH key IN (v1, v2, v3)
        IF key >= a AND key <= b
            FAIL_MATCH
```


The available operator for **booleans** is: 

## BoolEquals
The BoolEquals operator evaluates to true if the **key** value is the specified boolean value **filter**. In the following example, it checks whether the value of the `isEnabled` attribute in the `data` section is `true`. 

```json
"advancedFilters": [{
    "operatorType": "BoolEquals",
    "key": "data.isEnabled",
    "value": true
}]
```

If the key is an array, all the values in the array are checked against the filter boolean value. Here's the pseudo code with the key: `[v1, v2, v3]`. Any key values with data types that don’t match the filter’s data type are ignored.

```
FOR_EACH key IN (v1, v2, v3)
    IF filter == key
        MATCH
```

The available operators for **strings** are:

## StringContains
The **StringContains** evaluates to true if the **key** value **contains** any of the specified **filter** values (as substrings). In the following example, it checks whether the value of the `key1` attribute in the `data` section contains one of the specified substrings: `microsoft` or `azure`. For example, `azure data factory` has `azure` in it. 

```json
"advancedFilters": [{
    "operatorType": "StringContains",
    "key": "data.key1",
    "values": [
        "microsoft", 
        "azure"
    ]
}]
```

If the key is an array, all the values in the array are checked against the array of filter values. Here's the pseudo code with the key: `[v1, v2, v3]` and the filter: `[a,b,c]`. Any key values with data types that don’t match the filter’s data type are ignored.

```
FOR_EACH filter IN (a, b, c)
    FOR_EACH key IN (v1, v2, v3)
        IF key CONTAINS filter
            MATCH
```

## StringNotContains
The **StringNotContains** operator evaluates to true if the **key** does **not contain** the specified **filter** values as substrings. If the key contains one of the specified values as a substring, the operator evaluates to false. In the following example, the operator returns true only if the value of the `key1` attribute in the `data` section doesn't have `contoso` and `fabrikam` as substrings. 

```json
"advancedFilters": [{
    "operatorType": "StringNotContains",
    "key": "data.key1",
    "values": [
        "contoso", 
        "fabrikam"
    ]
}]
```

If the key is an array, all the values in the array are checked against the array of filter values. Here's the pseudo code with the key: `[v1, v2, v3]` and the filter: `[a,b,c]`. Any key values with data types that don’t match the filter’s data type are ignored.

```
FOR_EACH filter IN (a, b, c)
    FOR_EACH key IN (v1, v2, v3)
        IF key CONTAINS filter
            FAIL_MATCH
```
See [Limitations](#limitations) section for current limitation of this operator.

## StringBeginsWith
The **StringBeginsWith** operator evaluates to true if the **key** value **begins with** any of the specified **filter** values. In the following example, it checks whether the value of the `key1` attribute in the `data` section begins with `event` or `message`. For example, `event hubs` begins with `event`.  

```json
"advancedFilters": [{
    "operatorType": "StringBeginsWith",
    "key": "data.key1",
    "values": [
        "event", 
        "message"
    ]
}]
```

If the key is an array, all the values in the array are checked against the array of filter values. Here's the pseudo code with the key: `[v1, v2, v3]` and the filter: `[a,b,c]`. Any key values with data types that don’t match the filter’s data type are ignored.

```
FOR_EACH filter IN (a, b, c)
    FOR_EACH key IN (v1, v2, v3)
        IF key BEGINS_WITH filter
            MATCH
```

## StringNotBeginsWith
The **StringNotBeginsWith** operator evaluates to true if the **key** value does **not begin with** any of the specified **filter** values. In the following example, it checks whether the value of the `key1` attribute in the `data` section doesn't begin with `event` or `message`.

```json
"advancedFilters": [{
    "operatorType": "StringNotBeginsWith",
    "key": "data.key1",
    "values": [
        "event", 
        "message"
    ]
}]
```

If the key is an array, all the values in the array are checked against the array of filter values. Here's the pseudo code with the key: `[v1, v2, v3]` and the filter: `[a,b,c]`. Any key values with data types that don’t match the filter’s data type are ignored.

```
FOR_EACH filter IN (a, b, c)
    FOR_EACH key IN (v1, v2, v3)
        IF key BEGINS_WITH filter
            FAIL_MATCH
```

## StringEndsWith
The **StringEndsWith** operator evaluates to true if the **key** value **ends with** one of the specified **filter** values. In the following example, it checks whether the value of the `key1` attribute in the `data` section ends with `jpg` or `jpeg` or `png`. For example, `eventgrid.png` ends with `png`.


```json
"advancedFilters": [{
    "operatorType": "StringEndsWith",
    "key": "data.key1",
    "values": [
        "jpg", 
        "jpeg", 
        "png"
    ]
}]
```

If the key is an array, all the values in the array are checked against the array of filter values. Here's the pseudo code with the key: `[v1, v2, v3]` and the filter: `[a,b,c]`. Any key values with data types that don’t match the filter’s data type are ignored.

```
FOR_EACH filter IN (a, b, c)
    FOR_EACH key IN (v1, v2, v3)
        IF key ENDS_WITH filter
            MATCH
```

## StringNotEndsWith
The **StringNotEndsWith** operator evaluates to true if the **key** value does **not end with** any of the specified **filter** values. In the following example, it checks whether the value of the `key1` attribute in the `data` section doesn't end with `jpg` or `jpeg` or `png`. 


```json
"advancedFilters": [{
    "operatorType": "StringNotEndsWith",
    "key": "data.key1",
    "values": [
        "jpg", 
        "jpeg", 
        "png"
    ]
}]
```

If the key is an array, all the values in the array are checked against the array of filter values. Here's the pseudo code with the key: `[v1, v2, v3]` and the filter: `[a,b,c]`. Any key values with data types that don’t match the filter’s data type are ignored.

```
FOR_EACH filter IN (a, b, c)
    FOR_EACH key IN (v1, v2, v3)
        IF key ENDS_WITH filter
            FAIL_MATCH
```

## StringIn
The **StringIn** operator checks whether the **key** value **exactly matches** one of the specified **filter** values. In the following example, it checks whether the value of the `key1` attribute in the `data` section is `contoso` or `fabrikam` or `factory`. 

```json
"advancedFilters": [{
    "operatorType": "StringIn",
    "key": "data.key1",
    "values": [
        "contoso", 
        "fabrikam", 
        "factory"
    ]
}]
```

If the key is an array, all the values in the array are checked against the array of filter values. Here's the pseudo code with the key: `[v1, v2, v3]` and the filter: `[a,b,c]`. Any key values with data types that don’t match the filter’s data type are ignored.

```
FOR_EACH filter IN (a, b, c)
    FOR_EACH key IN (v1, v2, v3)
        IF filter == key
            MATCH
```

## StringNotIn
The **StringNotIn** operator checks whether the **key** value **does not match** any of the specified **filter** values. In the following example, it checks whether the value of the `key1` attribute in the `data` section isn't `aws` and `bridge`. 

```json
"advancedFilters": [{
    "operatorType": "StringNotIn",
    "key": "data.key1",
    "values": [
        "aws", 
        "bridge"
    ]
}]
```

If the key is an array, all the values in the array are checked against the array of filter values. Here's the pseudo code with the key: `[v1, v2, v3]` and the filter: `[a,b,c]`. Any key values with data types that don’t match the filter’s data type are ignored.

```
FOR_EACH filter IN (a, b, c)
    FOR_EACH key IN (v1, v2, v3)
        IF filter == key
            FAIL_MATCH
```


All string comparisons aren't case-sensitive.

> [!NOTE]
> If the event JSON doesn't contain the advanced filter key, filter is evaluated as **not matched** for the following operators: NumberGreaterThan, NumberGreaterThanOrEquals, NumberLessThan, NumberLessThanOrEquals, NumberIn, BoolEquals, StringContains, StringNotContains, StringBeginsWith, StringNotBeginsWith, StringEndsWith, StringNotEndsWith, StringIn.
> 
>The filter is evaluated as **matched** for the following operators: NumberNotIn, StringNotIn.


## IsNullOrUndefined
The IsNullOrUndefined operator evaluates to true if the key's value is NULL or undefined. 

```json
{
    "operatorType": "IsNullOrUndefined",
    "key": "data.key1"
}
```

In the following example, key1 is missing, so the operator would evaluate to true. 

```json
{ 
    "data": 
    { 
        "key2": 5 
    } 
}
```

In the following example, key1 is set to null, so the operator would evaluate to true.

```json
{
    "data": 
    { 
        "key1": null
    }
}
```

if key1 has any other value in these examples, the operator would evaluate to false. 

## IsNotNull
The IsNotNull operator evaluates to true if the key's value isn't NULL or undefined. 

```json
{
    "operatorType": "IsNotNull",
    "key": "data.key1"
}
```

## OR and AND
If you specify a single filter with multiple values, an **OR** operation is performed, so the value of the key field must be one of these values. Here's an example:

```json
"advancedFilters": [
    {
        "operatorType": "StringContains",
        "key": "Subject",
        "values": [
            "/providers/microsoft.devtestlab/",
            "/providers/Microsoft.Compute/virtualMachines/"
        ]
    }
]
```

If you specify multiple different filters, an **AND** operation is done, so each filter condition must be met. Here's an example: 

```json
"advancedFilters": [
    {
        "operatorType": "StringContains",
        "key": "Subject",
        "values": [
            "/providers/microsoft.devtestlab/"
        ]
    },
    {
        "operatorType": "StringContains",
        "key": "Subject",
        "values": [
            "/providers/Microsoft.Compute/virtualMachines/"
        ]
    }
]
```

## CloudEvents 
For events in the **CloudEvents schema**, use the following values for the key: `id`, `source`, `type`, `specversion`, or custom properties using `.` as the nesting operator (example: `data.appinfoA`). 

You can also use [extension context attributes in CloudEvents 1.0](https://github.com/cloudevents/spec/blob/v1.0.1/spec.md#extension-context-attributes). In the following example, `comexampleextension1` and `comexampleothervalue` are extension context attributes.

```json
{
    "specversion" : "1.0",
    "type" : "com.example.someevent",
    "source" : "/mycontext",
    "id" : "C234-1234-1234",
    "time" : "2018-04-05T17:31:00Z",
    "subject": null,
    "comexampleextension1" : "value",
    "comexampleothervalue" : 5,
    "datacontenttype" : "application/json",
    "data" : {
        "appinfoA" : "abc",
        "appinfoB" : 123,
        "appinfoC" : true
    }
}
```

Here's an example of using an extension context attribute in a filter.

```json
"advancedFilters": [{
    "operatorType": "StringBeginsWith",
    "key": "comexampleothervalue",
    "values": [
        "5", 
        "1"
    ]
}]
```


## Limitations

Advanced filtering has the following limitations:

* 25 advanced filters and 25 filter values across all the filters per Event Grid subscription
* 512 characters per string value
* Keys with **`.` (dot)** character in them. For example: `http://schemas.microsoft.com/claims/authnclassreference` or `john.doe@contoso.com`. Currently, there's no support for escape characters in keys. 

The same key can be used in more than one filter.





## Next steps

* To learn about filtering events with PowerShell and Azure CLI, see [Filter events for Event Grid](how-to-filter-events.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
