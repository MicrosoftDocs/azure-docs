---
title:  StyleObject for Dynamic Maps
description: Reference guide to the JSON schema and syntax for the StyleObject used in creating Dynamic Maps.
author: v-stharr
ms.author: v-stharr
ms.date: 05/25/2020
ms.topic: reference
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Schema reference guide for the StyleObject in Dynamic Maps

APIs for managing the dynamic feature states in Azure Maps.

## StylesObject

The `StylesObject` defines the stateset style model. It contains an array of `StyleObjects`. Each `StyleObject` is one of the following two types:

* [BooleanTypeStyleRule](#booleantypestylerule).
* [NumericTypeStyleRule](#numerictypestylerule)

```json
 "styles": [
     {
        "keyname": "s1",       //BooleanTypeStyleRule
        "type": "boolean",
        "rules": [
        {                      //BooleanRuleObject
            "true": "#FF0000",
            "false": "#00FF00"
        }
        ]
    },
    {
        "keyname": "s2",     //NumericTypeStyleRule
        "type": "number",
         "rules": [
         {                   //NumberRuleObject
          "range": {
                "exclusiveMaximum": 50
            },
            "color": "#343deb"
        }
 ]
```

## NumericTypeStyleRule

| Attribute | Type | Description | Required |
|-----------|----------|-------------|-------------|
| `keyName` | string | Stateset style key name. Key names are random strings but they should be unique inside style array.| Yes |
| `type` | string | Value is "numeric". | Yes |
| `rules` | array ([`NumberRuleObject`](#numberruleobject))| Numeric style rules.| Yes |

## BooleanTypeStyleRule

| Attribute | Type | Description | Required |
|-----------|----------|-------------|-------------|
| `keyName` | string | Stateset style key name. Key names are random strings but they should be unique inside style array.| Yes |
| `type` | string |Value is "boolean". | Yes |
| `rules` | array ([`BooleanRuleObject`](#booleanruleobject))| Boolean style rules.| Yes |

## NumberRuleObject

The numeric rule.

| Attribute | Type | Description | Required |
|-----------|----------|-------------|-------------|
| `range` | [RangeObject](#rangeobject) | Stateset style key name. Key names are random strings but they should be unique inside style array.| Yes |
| `color` | string | The color to use when state value falls into the range. Color is a JSON string in a variety of permitted formats, HTML-style hex values, RGB ("#ff0", "#ffff00", "rgb(255, 255, 0)"), RGBA ("rgba(255, 255, 0, 1)"), HSL("hsl(100, 50%, 50%)"), and HSLA("hsla(100, 50%, 50%, 1)"). Predefined HTML colors names, like yellow and blue, are also permitted. | Yes |

## RangeObject

The numeric value range for this style rule, To make the state value falls into the range, all the conditions must hold true.

| Attribute | Type | Description | Required |
|-----------|----------|-------------|-------------|
| `minimum` | double | All the number x that x ≥ minimum.| Yes |
| `maximum` | double | All the number x that x ≤ maximum. | Yes |
| `exclusiveMinumum` | double | All the number x that x > exclusiveMinimum.| Yes |
| `exclusiveMaximum` | double | All the number x that x < exclusiveMaximum.| Yes |

## BooleanRuleObject

| Attribute | Type | Description | Required |
|-----------|----------|-------------|-------------|
| `true` | string | The color to use when value is true.| Yes |
| `false` | string | The color to use when value is false. | Yes |