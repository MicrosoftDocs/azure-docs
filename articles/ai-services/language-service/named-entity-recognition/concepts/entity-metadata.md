---
title: Entity Metadata provided by Named Entity Recognition
titleSuffix: Azure AI services
description: Learn about entity metadata in the NER feature.
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 06/13/2023
ms.author: jboback
ms.custom: language-service-ner
---

# Entity Metadata

The Entity Metadata object captures optional additional information about detected entities, providing resolutions specifically for numeric and temporal entities. This attribute is populated only when there's supplementary data available, enhancing the comprehensiveness of the detected entities. The Metadata component encompasses resolutions designed for both numeric and temporal entities. It's important to handle cases where the Metadata attribute may be empty or absent, as its presence isn't guaranteed for every entity.

Currently, metadata components handle resolutions to a standard format for an entity. Entities can be expressed in various forms and resolutions provide standard predictable formats for common quantifiable types. For example, "eighty" and "80" should both resolve to the integer `80`.

You can use NER resolutions to implement actions or retrieve further information. For example, your service can extract datetime entities to extract dates and times that are provided to a meeting scheduling system. 

> [!NOTE]
>  Entity Metadata are only supported starting from **_api-version=2023-04-15-preview_**. For older API versions, you may check the [Entity Resolutions article](./entity-resolutions.md).

This article documents the resolution objects returned for each entity category or subcategory under the metadata object.

## Numeric Entities

### Age

Examples: "10 years old", "23 months old", "sixty Y.O."

```json
"metadata": {
                "unit": "Year",
                "value": 10
            }
```              

Possible values for "unit":
- Year
- Month
- Week
- Day


### Currency

Examples: "30 Egyptian pounds", "77 USD"

```json
"metadata": {
                "unit": "Egyptian pound",
                "ISO4217": "EGP",
                "value": 30
            }
```

Possible values for "unit" and "ISO4217":
- [ISO 4217 reference](https://docs.1010data.com/1010dataReferenceManual/DataTypesAndFormats/currencyUnitCodes.html).

## Datetime/Temporal entities

Datetime includes several different subtypes that return different response objects.

### Date

Specific days.

Examples: "January 1 1995", "12 april", "7th of October 2022", "tomorrow"

```json
"metadata": {
                "dateValues": [
                    {
                        "timex": "1995-01-01",
                        "value": "1995-01-01"
                    }
                ]
            }
```

Whenever an ambiguous date is provided, you're offered different options for your resolution. For example, "12 April" could refer to any year. Resolution provides this year and the next as options. The `timex` value `XXXX` indicates no year was specified in the query.

```json
"metadata": {
                "dateValues": [
                    {
                        "timex": "XXXX-04-12",
                        "value": "2022-04-12"
                    },
                    {
                        "timex": "XXXX-04-12",
                        "value": "2023-04-12"
                    }
                ]
            }
```

Ambiguity can occur even for a given day of the week. For example, saying "Monday" could refer to last Monday or this Monday. Once again the `timex` value indicates no year or month was specified, and uses a day of the week identifier (W) to indicate the first day of the week. 

```json
"metadata" :{
                "dateValues": [
                    {
                        "timex": "XXXX-WXX-1",
                        "value": "2022-10-03"
                    },
                    {
                        "timex": "XXXX-WXX-1",
                        "value": "2022-10-10"
                    }
                ]
            }
```


### Time

Specific times.

Examples: "9:39:33 AM", "seven AM", "20:03"

```json
"metadata": {
                "timex": "T09:39:33",
                "value": "09:39:33"
            }
```

### Datetime

Specific date and time combinations.

Examples: "6 PM tomorrow", "8 PM on January 3rd", "Nov 1 19:30"

```json
"metadata": {
                "timex": "2022-10-07T18",
                "value": "2022-10-07 18:00:00"
            }
```

Similar to dates, you can have ambiguous datetime entities. For example, "May 3rd noon" could refer to any year. Resolution provides this year and the next as options. The `timex` value **XXXX** indicates no year was specified. 

```json
"metadata": {
                 "dateValues": [ 
                       {
                           "timex": "XXXX-05-03T12",
                           "value": "2022-05-03 12:00:00"
                       },
                       {
                           "timex": "XXXX-05-03T12",
                           "value": "2023-05-03 12:00:00"
                       }
                  ]
              }
```

### Datetime ranges

A datetime range is a period with a beginning and end date, time, or datetime.

Examples: "from january 3rd 6 AM to april 25th 8 PM 2022", "between Monday to Thursday", "June", "the weekend"

The "duration" parameter indicates the time passed in seconds (S), minutes (M), hours (H), or days (D). This parameter is only returned when an explicit start and end datetime are in the query. "Next week" would only return with "begin" and "end" parameters for the week.

```json
"metadata": {
                "duration": "PT2702H",
                "begin": "2022-01-03 06:00:00",
                "end": "2022-04-25 20:00:00"
            }
```

### Set

A set is a recurring datetime period. Sets don't resolve to exact values, as they don't indicate an exact datetime. 

Examples: "every Monday at 6 PM", "every Thursday", "every weekend"

For "every Monday at 6 PM", the `timex` value indicates no specified year with the starting **XXXX**, then every Monday through **WXX-1** to determine first day of every week, and finally **T18** to indicate 6 PM. 

```json
"metadata": {
                "timex": "XXXX-WXX-1T18",
                "value": "not resolved"
            }
```

## Dimensions

Examples: "24 km/hr", "44 square meters", "sixty six kilobytes"

```json
"metadata": {
                "unit": "KilometersPerHour",
                "value": 24
            }
```

Possible values for the "unit" field values:

- **For Measurements**:
  - SquareKilometer
  - SquareHectometer
  - SquareDecameter
  - SquareMeter
  - SquareDecimeter
  - SquareCentimeter
  - SquareMillimeter
  - SquareInch
  - SquareFoot
  - SquareMile
  - SquareYard
  - Acre

- **For Information**:
  - Bit
  - Kilobit
  - Megabit
  - Gigabit
  - Terabit
  - Petabit
  - Byte
  - Kilobyte
  - Megabyte
  - Gigabyte
  - Terabyte
  - Petabyte
  
- **For Length, width, height**:
  - Kilometer
  - Hectometer
  - Decameter
  - Meter
  - Decimeter
  - Centimeter
  - Millimeter
  - Micrometer
  - Nanometer
  - Picometer
  - Mile
  - Yard
  - Inch
  - Foot
  - Light year
  - Pt

- **For Speed**:
  - MetersPerSecond
  - KilometersPerHour
  - KilometersPerMinute
  - KilometersPerSecond
  - MilesPerHour
  - Knot
  - FootPerSecond
  - FootPerMinute
  - YardsPerMinute
  - YardsPerSecond
  - MetersPerMillisecond
  - CentimetersPerMillisecond
  - KilometersPerMillisecond

- **For Volume**:
  - CubicMeter
  - CubicCentimeter
  - CubicMillimiter
  - Hectoliter
  - Decaliter
  - Liter
  - Deciliter
  - Centiliter
  - Milliliter
  - CubicYard
  - CubicInch
  - CubicFoot
  - CubicMile
  - FluidOunce
  - Teaspoon
  - Tablespoon
  - Pint
  - Quart
  - Cup
  - Gill
  - Pinch
  - FluidDram
  - Barrel
  - Minim
  - Cord
  - Peck
  - Bushel
  - Hogshead

- **For Weight**:
  - Kilogram
  - Gram
  - Milligram
  - Microgram
  - Gallon
  - MetricTon
  - Ton
  - Pound
  - Ounce
  - Grain
  - Pennyweight
  - LongTonBritish
  - ShortTonUS
  - ShortHundredweightUS
  - Stone
  - Dram


## Ordinal

Examples: "3rd", "first", "last"

```json
"metadata": {
                "offset": "3",
                "relativeTo": "Start",
                "value": "3"
            }
```

Possible values for "relativeTo":
- Start
- End

## Temperature

Examples: "88 deg fahrenheit", "twenty three degrees celsius"

```json
"metadata": {
                "unit": "Fahrenheit",
                "value": 88
            }
```

Possible values for "unit":
- Celsius
- Fahrenheit
- Kelvin
- Rankine