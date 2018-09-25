---
title: LUIS Prebuilt entities datetimeV2 reference - Azure| Microsoft Docs
titleSuffix: Azure
description: This article has datetimeV2 prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 06/20/2018
ms.author: diberry
---

# DatetimeV2 entity

The **datetimeV2** prebuilt entity extracts date and time values. These values resolve in a standardized format for client programs to consume. When an utterance has a date or time that isn't complete, LUIS includes _both past and future values_ in the endpoint response. Because this entity is already trained, you do not need to add example utterances containing datetimeV2 to the application intents. 

## Types of datetimeV2
DatetimeV2 is managed from the [Recognizers-text](https://github.com/Microsoft/Recognizers-Text/blob/master/Patterns/English/English-DateTime.yaml) Github repository

## Example JSON 
The following example JSON response has a `datetimeV2` entity with a subtype of `datetime`. For examples of other types of datetimeV2 entities, see [Subtypes of datetimeV2](#subtypes-of-datetimev2)</a>.

```JSON
"entities": [
  {
    "entity": "8am on may 2nd 2017",
    "type": "builtin.datetimeV2.datetime",
    "startIndex": 15,
    "endIndex": 30,
    "resolution": {
      "values": [
        {
          "timex": "2017-05-02T08",
          "type": "datetime",
          "value": "2017-05-02 08:00:00"
        }
      ]
    }
  }
]
  ```

## JSON property descriptions

|Property name |Property type and description|
|---|---|
|Entity|**string** - Text extracted from the utterance with type of date, time, date range, or time range.|
|type|**string** - One of the [subtypes of datetimeV2](#subtypes-of-datetimev2)
|startIndex|**int** - The index in the utterance at which the entity begins.|
|endIndex|**int** - The index in the utterance at which the entity ends.|
|resolution|Has a `values` array that has one, two, or four [values of resolution](#values-of-resolution).|
|end|The end value of a time, or date range, in the same format as `value`. Only used if `type` is `daterange`, `timerange`, or `datetimerange`|

## Subtypes of datetimeV2

The **datetimeV2** prebuilt entity has the following subtypes, and examples of each are provided in the table that follows:
* `date`
* `time`
* `daterange`
* `timerange`
* `datetimerange`
* `duration`
* `set`

## Values of resolution
* The array has one element if the date or time in the utterance is fully specified and unambiguous.
* The array has two elements if the datetimeV2 value is ambiguous. Ambiguity includes lack of specific year, time, or time range. See [Ambiguous dates](#ambiguous-dates) for examples. When the time is ambiguous for A.M. or P.M., both values are included.
* The array has four elements if the utterance has two elements with ambiguity. This ambiguity includes elements that have:
  * A date or date range that is ambiguous as to year
  * A time or time range that is ambiguous as to A.M. or P.M. For example, 3:00 April 3rd.

Each element of the `values` array may have the following fields: 

|Property name|Property description|
|--|--|
|timex|time, date, or date range expressed in TIMEX format that follows the [ISO 8601 standard](https://en.wikipedia.org/wiki/ISO_8601) and the TIMEX3 attributes for annotation using the TimeML language. This annotation is described in the [TIMEX guidelines](http://www.timeml.org/tempeval2/tempeval2-trial/guidelines/timex3guidelines-072009.pdf).|
|type|The subtype, which can be one of the following items: datetime, date, time, daterange, timerange, datetimerange, duration, set.|
|value|**Optional.** A datetime object in the Format yyyy:MM:dd  (date), HH:mm:ss (time) yyyy:MM:dd HH:mm:ss (datetime). If `type` is `duration`, the value is the number of seconds (duration) <br/> Only used if `type` is `datetime` or `date`, `time`, or `duration.|

## Valid date values

The **datetimeV2** supports dates between the following ranges:

| Min | Max |
|----------|-------------|
| 1st January 1900   | 31st December 2099 |

## Ambiguous dates

If the date can be in the past or future, LUIS provides both values. An example is an utterance that includes the month and date without the year.  

For example, given the utterance "May 2nd":
* If today's date is May 3rd 2017, LUIS provides both "2017-05-02" and "2018-05-02" as values. 
* When today's date is May 1st 2017, LUIS provides both "2016-05-02" and "2017-05-02" as values.

The following example shows the resolution of the entity "may 2nd". This resolution assumes that today's date is a date between May 2nd 2017 and May 1st 2018.
Fields with `X` in the `timex` field are parts of the date that aren't explicitly specified in the utterance.

```JSON
  "entities": [
    {
      "entity": "may 2nd",
      "type": "builtin.datetimeV2.date",
      "startIndex": 0,
      "endIndex": 6,
      "resolution": {
        "values": [
          {
            "timex": "XXXX-05-02",
            "type": "date",
            "value": "2017-05-02"
          },
          {
            "timex": "XXXX-05-02",
            "type": "date",
            "value": "2018-05-02"
          }
        ]
      }
    }
  ]
```

## Date range resolution examples for numeric date

The `datetimeV2` entity extracts date and time ranges. The `start` and `end` fields specify the beginning and end of the range. For the utterance "May 2nd to May 5th", LUIS provides **daterange** values for both the current year and the next year. In the `timex` field, the `XXXX` values indicate the ambiguity of the year. `P3D` indicates the time period is three days long.

```JSON
"entities": [
    {
      "entity": "may 2nd to may 5th",
      "type": "builtin.datetimeV2.daterange",
      "startIndex": 0,
      "endIndex": 17,
      "resolution": {
        "values": [
          {
            "timex": "(XXXX-05-02,XXXX-05-05,P3D)",
            "type": "daterange",
            "start": "2017-05-02",
            "end": "2017-05-05"
          },
          {
            "timex": "(XXXX-05-02,XXXX-05-05,P3D)",
            "type": "daterange",
            "start": "2018-05-02",
            "end": "2018-05-05"
          }
        ]
      }
    }
  ]
```

## Date range resolution examples for day of week

The following example shows how LUIS uses **datetimeV2** to resolve the utterance "Tuesday to Thursday". In this example, the current date is June 19th. LUIS includes **daterange** values for both of the date ranges that precede and follow the current date.

```JSON
  "entities": [
    {
      "entity": "tuesday to thursday",
      "type": "builtin.datetimeV2.daterange",
      "startIndex": 0,
      "endIndex": 19,
      "resolution": {
        "values": [
          {
            "timex": "(XXXX-WXX-2,XXXX-WXX-4,P2D)",
            "type": "daterange",
            "start": "2017-06-13",
            "end": "2017-06-15"
          },
          {
            "timex": "(XXXX-WXX-2,XXXX-WXX-4,P2D)",
            "type": "daterange",
            "start": "2017-06-20",
            "end": "2017-06-22"
          }
        ]
      }
    }
  ]
```
## Ambiguous time
The values array has two time elements if the time, or time range is ambiguous. When there's an ambiguous time, values have both the A.M. and P.M. times.

## Time range resolution example

The following example shows how LUIS uses **datetimeV2** to resolve the utterance that has a time range.

```
  "entities": [
    {
      "entity": "6pm to 7pm",
      "type": "builtin.datetimeV2.timerange",
      "startIndex": 0,
      "endIndex": 9,
      "resolution": {
        "values": [
          {
            "timex": "(T18,T19,PT1H)",
            "type": "timerange",
            "start": "18:00:00",
            "end": "19:00:00"
          }
        ]
      }
    }
  ]
```

## Deprecated prebuilt datetime

The `datetime` prebuilt entity is deprecated and replaced by **datetimeV2**. 

To replace `datetime` with `datetimeV2` in your LUIS app, complete the following steps:

1. Open the **Entities** pane of the LUIS web interface. 
2. Delete the **datetime** prebuilt entity.
3. Click **Add prebuilt entity**
4. Select **datetimeV2** and click **Save**.

## Next steps

Learn about the [dimension](luis-reference-prebuilt-dimension.md), [email](luis-reference-prebuilt-email.md) entities, and [number](luis-reference-prebuilt-number.md). 

