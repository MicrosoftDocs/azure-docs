---
title:  StylesObject Schema reference guide for Dynamic Azure Maps
description: Reference guide to the dynamic Azure Maps StylesObject schema and syntax.
author: brendansco 
ms.author: brendanc 
ms.date: 02/17/2023
ms.topic: reference
ms.service: azure-maps
services: azure-maps
---

# StylesObject Schema reference guide for dynamic Maps

 The `StylesObject` is a `StyleObject` array representing stateset styles. Use the Azure Maps Creator [Feature State service] to apply your stateset styles to indoor map data features. Once you've created your stateset styles and associated them with indoor map features, you can use them to create dynamic indoor maps. For more information on creating dynamic indoor maps, see [Implement dynamic styling for Creator  indoor maps].

## StyleObject

A `StyleObject` is one of the following style rules:

* [`BooleanTypeStyleRule`]
* [`NumericTypeStyleRule`]
* [`StringTypeStyleRule`]

The following JSON shows example usage of each of the three style types.  The `BooleanTypeStyleRule` is used to determine the dynamic style for features whose `occupied` property is true and false.  The `NumericTypeStyleRule` is used to determine the style for features whose `temperature` property falls within a certain range. Finally, the `StringTypeStyleRule` is used to match specific styles to `meetingType`.

```json
 "styles": [
     {
        "keyname": "occupied",
        "type": "boolean",
        "rules": [
            {
                "true": "#FF0000",
                "false": "#00FF00"
            }
        ]
    },
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
                "maximum": 70,
                "exclusiveMinimum": 30
              },
              "color": "#eba834"
            }
        ]
    },
    {
      "keyname": "meetingType",
      "type": "string",
      "rules": [
        {
          "private": "#FF0000",
          "confidential": "#FF00AA",
          "allHands": "#00FF00",
          "brownBag": "#964B00"
        }
      ]
    }
]
```

## NumericTypeStyleRule

 A `NumericTypeStyleRule` is a  [`StyleObject`] and consists of the following properties:

| Property | Type | Description | Required |
|-----------|----------|-------------|-------------|
| `keyName` | string | The *state* or dynamic property name. A `keyName` should be unique inside the `StyleObject` array.| Yes |
| `type` | string | Value is `numeric`. | Yes |
| `rules` | [`NumberRuleObject`][]| An array of numeric style ranges with associated colors. Each range defines a color that's to be used when the *state* value satisfies the range.| Yes |

### NumberRuleObject

A `NumberRuleObject` consists of a [`RangeObject`](#rangeobject) and a `color` property. If the *state* value falls into the range, its color for display is the color specified in the `color` property.

If you define multiple overlapping ranges, the color chosen will be the color that's defined in the first range that is satisfied.

In the following JSON sample, both ranges hold true when the *state* value is between 50-60. However, the color that is used is `#343deb` because it's the first range in the list that has been satisfied.

```json

    {
        "rules":[
            {
                "range": {
                "minimum": 50,
                "exclusiveMaximum": 70
                },
                "color": "#343deb"
            },
            {
                "range": {
                "minimum": 50,
                "maximum": 60
                },
                "color": "#eba834"
            }
        ]
    }
]
```

| Property | Type | Description | Required |
|-----------|----------|-------------|-------------|
| `range` | [RangeObject] | The [RangeObject] defines a set of logical range conditions, which, if `true`, change the display color of the *state* to the color specified in the `color` property. If `range` is unspecified, then the color defined in the `color` property is always used.   | No |
| `color` | string | The color to use when state value falls into the range. The `color` property is a JSON string in any one of following formats: <ul><li> HTML-style hex values </li><li> RGB ("#ff0", "#ffff00", "rgb(255, 255, 0)")</li><li> RGBA ("rgba(255, 255, 0, 1)")</li><li> HSL("hsl(100, 50%, 50%)")</li><li> HSLA("hsla(100, 50%, 50%, 1)")</li><li> Predefined HTML colors names, like yellow, and blue.</li></ul> | Yes |

### RangeObject

The `RangeObject` defines a numeric range value of a [`NumberRuleObject`]. For the *state* value to fall into the range, all defined conditions must hold true.

| Property | Type | Description | Required |
|-----------|----------|-------------|-------------|
| `minimum` | double | All the number x that x ≥ `minimum`.| No |
| `maximum` | double | All the number x that x ≤ `maximum`. | No |
| `exclusiveMinimum` | double | All the number x that x > `exclusiveMinimum`.| No |
| `exclusiveMaximum` | double | All the number x that x < `exclusiveMaximum`.| No |

### Example of NumericTypeStyleRule

The following JSON illustrates a `NumericTypeStyleRule` *state* named `temperature`. In this example, the [`NumberRuleObject`] contains two defined temperature ranges and their associated color styles. If the temperature range is 50-69, the display should use the color `#343deb`.  If the temperature range is 31-70, the display should use the color `#eba834`.

```json
{
    "keyname": "temperature",
    "type": "number",
    "rules":[
        {
            "range": {
            "minimum": 50,
            "exclusiveMaximum": 70
            },
            "color": "#343deb"
        },
        {
            "range": {
            "maximum": 70,
            "exclusiveMinimum": 30
            },
            "color": "#eba834"
        }
    ]
}
```

## StringTypeStyleRule

A `StringTypeStyleRule` is a [`StyleObject`] and consists of the following properties:

| Property | Type | Description | Required |
|-----------|----------|-------------|-------------|
| `keyName` | string |  The *state* or dynamic property name.  A `keyName` should be unique inside the  `StyleObject` array.| Yes |
| `type` | string |Value is `string`. | Yes |
| `rules` | [`StringRuleObject`][]| An array of N number of *state* values.| Yes |

### StringRuleObject

A `StringRuleObject` consists of up to N number of state values that are the possible string values of a feature's property. If the feature's property value doesn't match any of the defined state values, that feature won't have a dynamic style. If duplicate state values are given, the first one takes precedence.

The string value matching is case-sensitive.

| Property      | Type   | Description                                | Required |
|---------------|--------|--------------------------------------------|----------|
| `stateValue1` | string | The color when value string is stateValue1.| No |
| `stateValue2` | string | The color when value string is stateValue. | No |
| `stateValueN` | string | The color when value string is stateValueN.| No |

### Example of StringTypeStyleRule

The following JSON illustrates a `StringTypeStyleRule` that defines styles associated with specific meeting types.

```json
    {
      "keyname": "meetingType",
      "type": "string",
      "rules": [
        {
          "private": "#FF0000",
          "confidential": "#FF00AA",
          "allHands": "#00FF00",
          "brownBag": "#964B00"
        }
      ]
    }

```

## BooleanTypeStyleRule

A `BooleanTypeStyleRule` is a [`StyleObject`] and consists of the following properties:

| Property | Type | Description | Required |
|-----------|----------|-------------|-------------|
| `keyName` | string |  The *state* or dynamic property name.  A `keyName` should be unique inside the `StyleObject`  array.| Yes |
| `type` | string |Value is `boolean`. | Yes |
| `rules` | [`BooleanRuleObject`]| A boolean pair with colors for `true` and `false` *state* values.| Yes |

### BooleanRuleObject

A `BooleanRuleObject` defines colors for `true` and `false` values.

| Property | Type | Description | Required |
|-----------|----------|-------------|-------------|
| `true` | string | The color to use when the *state* value is `true`. The `color` property is a JSON string in any one of following formats: <ul><li> HTML-style hex values </li><li> RGB ("#ff0", "#ffff00", "rgb(255, 255, 0)")</li><li> RGBA ("rgba(255, 255, 0, 1)")</li><li> HSL("hsl(100, 50%, 50%)")</li><li> HSLA("hsla(100, 50%, 50%, 1)")</li><li> Predefined HTML colors names, like yellow, and blue.</li></ul>| Yes |
| `false` | string | The color to use when the *state* value is `false`. | Yes |

### Example of BooleanTypeStyleRule

The following JSON illustrates a `BooleanTypeStyleRule` *state* named `occupied`. The [`BooleanRuleObject`] defines colors for `true` and `false` values.

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

## Next steps

Learn more about Creator for indoor maps by reading:

> [!div class="nextstepaction"]
> [What is Azure Maps Creator?]

> [!div class="nextstepaction"]
> [Creator for indoor maps]

[`BooleanRuleObject`]: #booleanruleobject
[`BooleanTypeStyleRule`]: #booleantypestylerule
[`NumberRuleObject`]: #numberruleobject
[`NumericTypeStyleRule`]: #numerictypestylerule
[`StringRuleObject`]: #stringruleobject
[`StringTypeStyleRule`]: #stringtypestylerule
[`StyleObject`]: #styleobject
[Creator for indoor maps]: creator-indoor-maps.md
[Feature State service]: /rest/api/maps/v2/feature-state
[Implement dynamic styling for Creator  indoor maps]: indoor-map-dynamic-styling.md
[RangeObject]: #rangeobject
[What is Azure Maps Creator?]: about-creator.md
