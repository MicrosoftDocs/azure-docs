---
title: Advanced filtering - Azure Event Grid IoT Edge | Microsoft Docs 
description: Advanced filtering in Event Grid on IoT Edge.
manager: rajarv
ms.reviewer: spelluru
ms.subservice: iot-edge
ms.date: 02/15/2022
ms.topic: article
---

# Advanced filtering
Event Grid allows specifying filters on any property in the json payload. These filters are modeled as set of `AND` conditions, with each outer condition having optional inner `OR` conditions. For each `AND` condition, you specify the following values:

* `OperatorType` - The type of comparison.
* `Key` - The json path to the property on which to apply the filter.
* `Value` - The reference value against which the filter is run (or) `Values` - The set of reference values against which the filter is run.

> [!IMPORTANT]
> On March 31, 2023, Event Grid on Azure IoT Edge support will be retired, so make sure to transition to IoT Edge native capabilities prior to that date. For more information, see [Transition from Event Grid on Azure IoT Edge to Azure IoT Edge](transition.md). 


## JSON syntax

The JSON syntax for an advanced filter is as follows:

```json
{
    "filter": {
        "advancedFilters": [{
                "operatorType": "NumberGreaterThanOrEquals",
                "key": "Data.Key1",
                "value": 5
            }, {
                "operatorType": "StringContains",
                "key": "Subject",
                "values": ["container1", "container2"]
            }
        ]
    }
}
```

## Filtering on array values

Event Grid doesn't support filtering on an array of values today. If an incoming event has an array value for the advanced filter's key, the matching operation fails. The incoming event ends up not matching with the event subscription.

## AND-OR-NOT semantics

Notice that in the json example given earlier, `AdvancedFilters` is an array. Think of each `AdvancedFilter` array element as an `AND` condition.

For the operators that support multiple values (such as `NumberIn`, `NumberNotIn`, `StringIn`, etc.), each value is treated as an `OR` condition. So, a `StringBeginsWith("a", "b", "c")` will match any string value that starts with either `a` or `b` or `c`.

> [!CAUTION]
> The NOT operators - `NumberNotIn` and `StringNotIn` behave as AND conditions on each value given in the `Values` field.
>
> Not doing so will make the filter an Accept-All filter and defeat the purpose of filtering.

## Floating-point rounding behavior

Event Grid uses the `decimal` .NET type to handle all numeric values. The number values specified in the event subscription JSON aren't subject to floating point rounding behavior.

## Case sensitivity of string filters

All string comparisons are case-insensitive. There's no way to change this behavior today.

## Allowed advanced filter keys

The `Key` property can either be a well-known top-level property, or be a json path with multiple dots, where each dot signifies stepping into a nested json object.

Event Grid doesn't have any special meaning for the `$` character in the Key, unlike the JSONPath specification.

### Event Grid schema

For events in the Event Grid schema:

* ID
* Topic
* Subject
* EventType
* DataVersion
* Data.Prop1
* Data.Prop*Prop2.Prop3.Prop4.Prop5

### Custom event schema

There's no restriction on the `Key` in custom event schema since Event Grid doesn't enforce any envelope schema on the payload.

## Numeric single-value filter examples

* NumberGreaterThan
* NumberGreaterThanOrEquals
* NumberLessThan
* NumberLessThanOrEquals

```json
{
    "filter": {
        "advancedFilters": [
            {
                "operatorType": "NumberGreaterThan",
                "key": "Data.Key1",
                "value": 5
            },
            {
                "operatorType": "NumberGreaterThanOrEquals",
                "key": "Data.Key2",
                "value": *456
            },
            {
                "operatorType": "NumberLessThan",
                "key": "Data.P*P2.P3",
                "value": 1000
            },
            {
                "operatorType": "NumberLessThanOrEquals",
                "key": "Data.P*P2",
                "value": 999
            }
        ]
    }
}
```

## Numeric range-value filter examples

* NumberIn
* NumberNotIn

```json
{
    "filter": {
        "advancedFilters": [
            {
                "operatorType": "NumberIn",
                "key": "Data.Key1",
                "values": [1, 10, 100]
            },
            {
                "operatorType": "NumberNotIn",
                "key": "Data.Key2",
                "values": [2, 3, 4.56]
            }
        ]
    }
}
```

## String range-value filter examples

* StringContains
* StringBeginsWith
* StringEndsWith
* StringIn
* StringNotIn

```json
{
    "filter": {
        "advancedFilters": [
            {
                "operatorType": "StringContains",
                "key": "Data.Key1",
                "values": ["microsoft", "azure"]
            },
            {
                "operatorType": "StringBeginsWith",
                "key": "Data.Key2",
                "values": ["event", "grid"]
            },
            {
                "operatorType": "StringEndsWith",
                "key": "Data.P3.P4",
                "values": ["jpg", "jpeg", "png"]
            },
            {
                "operatorType": "StringIn",
                "key": "RootKey",
                "values": ["exact", "string", "matches"]
            },
            {
                "operatorType": "StringNotIn",
                "key": "RootKey",
                "values": ["aws", "bridge"]
            }
        ]
    }
}
```

## Boolean single-value filter examples

* BoolEquals

```json
{
    "filter": {
        "advancedFilters": [
            {
                "operatorType": "BoolEquals",
                "key": "BoolKey1",
                "value": true
            },
            {
                "operatorType": "BoolEquals",
                "key": "BoolKey2",
                "value": false
            }
        ]
    }
}
```
