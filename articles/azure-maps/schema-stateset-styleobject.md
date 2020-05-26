---
title:  StyleObject for Dynamic Maps
description: Reference guide to the JSON schema and syntax for the StyleObject used in creating Dynamic Maps.
author: anastasia-ms
ms.author: v-stharr
ms.date: 05/25/2020
ms.topic: reference
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Schema reference guide for the StyleObject in Dynamic Maps

This article is a reference guide to the JSON schema and syntax for the `StylesObject`. The `StylesObject` schema is used to define dynamic *state* styles for the [Feature State service](https://docs.microsoft.com/en-us/rest/api/maps/featurestate) and [the Indoor map control](indoor-map-dynamic-styling.md).

## StylesObject

The `StylesObject` is an array of `StyleObject` and represents a feature stateset associated with a dataset. Each `StyleObject` defines a *state* and associated display colors for a specified numeric range or boolean value. A `StyleObject` is defined as a [BooleanTypeStyleRule](#booleantypestylerule) or a [NumericTypeStyleRule](#numerictypestylerule).

The JSON below shows a `StyleObject` for a boolean `occupied` *state* and a numeric `temperature` *state*.

```json
 "styles": [
     {
        "keyname": "occupied",       //BooleanTypeStyleRule
        "type": "boolean",
        "rules": [
        {                      //BooleanRuleObject
            "true": "#FF0000",
            "false": "#00FF00"
        }
        ]
    },
    {
        "keyname": "temperature",     //NumericTypeStyleRule
        "type": "number",
         "rules": [
         {                   //NumberRuleObject
          "range": {
                "minimum": 50,
                "exclusiveMaximum": 70
            },
            "color": "#343deb"
        },
        {
          "range": {
            "minimum": 70,
            "exclusiveMaximum": 90
          },
          "color": "#eba834"
        }
        ]
    }
]
```

## NumericTypeStyleRule

The `NumericTypeStyleRule` is a type of [`StyleObject`](#styleobject) that defines a numeric *state* in a stateset.

| Attribute | Type | Description | Required |
|-----------|----------|-------------|-------------|
| `keyName` | string | The *state* or dynamic property name. A `keyName` should be unique inside `StyleObjects` array.| Yes |
| `type` | string | Value is "numeric". | Yes |
| `rules` | [`NumberRuleObject`](#numberruleobject)[]| Any number of numeric style ranges with associated colors.| Yes |

### Example of NumericTypeStyleRule

The following JSON illustrates a `NumericTypeStyleRule` *state* named `temperature`. In this example, the [`NumberRuleObject`](#numberruleobject) contains two defined temperature ranges.

```json
{
    "keyname": "temperature",
    "type": "number",
        "rules": [
        {
        "range": {
            "minimum": 50,
            "exclusiveMaximum": 70
        },
        "color": "#343deb"
    },
    {
        "range": {
        "minimum": 70,
        "exclusiveMaximum": 90
        },
        "color": "#eba834"
    }
    ]
}
```

## NumberRuleObject

| Attribute | Type | Description | Required |
|-----------|----------|-------------|-------------|
| `range` | [RangeObject](#rangeobject) | The [RangeObject](#rangeobject) defines a set of logical range conditions which, if `true`, change the display color of the *state* to `color`   | Yes |
| `color` | string | The color to use when state value falls into the range. The `color` attribute is a JSON string in any one of following formats: <ul><li> HTML-style hex values </li><li> RGB ("#ff0", "#ffff00", "rgb(255, 255, 0)")</li><li> RGBA ("rgba(255, 255, 0, 1)")</li><li> HSL("hsl(100, 50%, 50%)")</li><li> HSLA("hsla(100, 50%, 50%, 1)")</li><li> Predefined HTML colors names, like yellow and blue.</li></ul> | Yes |

### Example of NumberRuleObject

```json
{
    "range": {
        "minimum": 50,
        "exclusiveMaximum": 70
    },
    "color": "#343deb"
}
```

## RangeObject

The `RangeObject` defines a set of logical range conditions for the current value of *state*.

| Attribute | Type | Description | Required |
|-----------|----------|-------------|-------------|
| `minimum` | double | All the number x that x ≥ minimum.| No |
| `maximum` | double | All the number x that x ≤ maximum. | No |
| `exclusiveMinumum` | double | All the number x that x > exclusiveMinimum.| No |
| `exclusiveMaximum` | double | All the number x that x < exclusiveMaximum.| No |

### Example of RangeObject

```json
{
    "range": {
        "minimum": 50,
        "exclusiveMaximum": 70
    }
}
```

## BooleanTypeStyleRule

The `BooleanTypeStyleRule` is a type of [`StyleObject`](#styleobject) that defines a boolean *state* in a stateset.

| Attribute | Type | Description | Required |
|-----------|----------|-------------|-------------|
| `keyName` | string |  The *state* or dynamic property name.  A `keyName` should be unique inside style array.| Yes |
| `type` | string |Value is "boolean". | Yes |
| `rules` | [`BooleanRuleObject`](#booleanruleobject)[1]| A boolean pair with colors for `true` and `false` *state* values.| Yes |

### Example of BooleanTypeStyleRule

The following JSON illustrates a `BooleanTypeStyleRule` *state* named `occupied`. The [`BooleanRuleObject`](#booleanruleobject) defines colors for `true` and `false` values.

```json
{
    "keyname": "occupied",
    "type": "boolean",
    "rules": [
    {
        "true": "#FF0000",
        "false": "#00FF00"
    }
    ]
}
```

## BooleanRuleObject

The boolean value for this style rule. 

| Attribute | Type | Description | Required |
|-----------|----------|-------------|-------------|
| `true` | string | The color to use when the *state* value is `true`. The color to use when state value falls into the range. The `color` attribute is a JSON string in any one of following formats: <ul><li> HTML-style hex values </li><li> RGB ("#ff0", "#ffff00", "rgb(255, 255, 0)")</li><li> RGBA ("rgba(255, 255, 0, 1)")</li><li> HSL("hsl(100, 50%, 50%)")</li><li> HSLA("hsla(100, 50%, 50%, 1)")</li><li> Predefined HTML colors names, like yellow and blue.</li></ul>| Yes |
| `false` | string | The color to use when the *state* value is `false`. | Yes |

### Example of BooleanRuleObject

```json
{
    "true": "#FF0000",
    "false": "#00FF00"
}
```

## Next Steps