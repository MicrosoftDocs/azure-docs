---
title: Advanced Filtering - Azure Event Grid IoT Edge | Microsoft Docs 
description: Advanced filtering in Event Grid on IoT Edge.
author: HiteshMadan
manager: rajarv
ms.author: himad
ms.reviewer: 
ms.date: 08/29/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Advanced Filtering

Event Grid allows specifying filters on any property in the json payload. These filters are modeled as set of `AND` conditions, with each outer condition having optional inner `OR` conditions. For each `AND` condition, you specify the:

* `OperatorType` - The type of comparison.
* `Key` - The json path to the property on which to apply the filter.
* (either) `Value` - The reference value against which the filter is run.
* (or) `Values` - The set of reference values against which the filter is run.

## JSON Syntax
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

## Filtering on Array values 
Event Grid does not support filtering on array values today. If an incoming event has an array value for the advanced filter's key, matching fails. The incoming event ends up not matching with the Event Subscription.

## AND-OR-NOT Semantics
Notice in the json above that `AdvancedFilters` is an array. Think of each `AdvancedFilter` array element as an `AND` condition.

For the operators that support multiple values (such as `NumberIn`, `NumberNotIn`, `StringIn`, etc.), each value is treated as an `OR` condition. Thus a `StringBeginsWith("a", "b", "c")` will match any string value that starts with either `a` or `b` or `c`.

> [!CAUTION]
> The NOT operators - `NumberNotIn` and `StringNotIn` behave as AND conditions on each value given in the `Values` field.<br>
> Not doing so will make the filter an Accept-All filter and defeat the purpose of filtering.

## Floating Point Rounding Behavior
Event Grid uses the `decimal` .NET type to handle all numeric values. Thus number values specified on the Event Subscription JSON are not subject to floating point rounding behavior.

## Case Sensitivity of String filters
All String comparisons are case-insensitive. There is no way to change this behavior today.

## Allowed Advanced Filter Keys
The `Key` property can either be a well-known top-level property, or be a json path with multiple dots, where each dot signifies stepping into a nested json object.

Event Grid does not have any special meaning for the `$` character in the Key, unlike the JSONPath specification.

### Event Grid Schema

For events in the Event Grid schema:

* Id
* Topic
* Subject
* EventType
* DataVersion
* Data.Prop1
* Data.Prop1.Prop2.Prop3.Prop4.Prop5

### Custom Event Schema
There is no restriction on the `Key` in Custom Event Schema since Event Grid does not enforce any envelope schema on the payload.

## Numeric Single-Value Filter Examples

1. NumberGreaterThan
1. NumberGreaterThanOrEquals
1. NumberLessThan
1. NumberLessThanOrEquals

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
                "value": 1.456
            },
            {
                "operatorType": "NumberLessThan",
                "key": "Data.P1.P2.P3",
                "value": 1000
            },
            {
                "operatorType": "NumberLessThanOrEquals",
                "key": "Data.P1.P2",
                "value": 999
            }
        ]
    }
}
```

## Numeric Range-Value Filter Examples

5. NumberIn
1. NumberNotIn

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
## String Range-Value Filter Examples

7. StringContains
1. StringBeginsWith
1. StringEndsWith
1. StringIn
1. StringNotIn

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

## Boolean Single-Value Filter Examples

12. BoolEquals
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