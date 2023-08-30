---
title: Entity resolutions provided by Named Entity Recognition
titleSuffix: Azure AI services
description: Learn about entity resolutions in the NER feature.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 10/12/2022
ms.author: jboback
ms.custom: language-service-ner
---

# Resolve entities to standard formats

A resolution is a standard format for an entity. Entities can be expressed in various forms and resolutions provide standard predictable formats for common quantifiable types. For example, "eighty" and "80" should both resolve to the integer `80`.

You can use NER resolutions to implement actions or retrieve further information. For example, your service can extract datetime entities to extract dates and times that will be provided to a meeting scheduling system. 

> [!NOTE]
> Entity resolution responses are only supported starting from **_api-version=2022-10-01-preview_** and **_"modelVersion": "2022-10-01-preview"_**.

This article documents the resolution objects returned for each entity category or subcategory.

## Age

Examples: "10 years old", "23 months old", "sixty Y.O."

```json
"resolutions": [
                    {
                        "resolutionKind": "AgeResolution",
                        "unit": "Year",
                        "value": 10
                    }
                ]
```              

Possible values for "unit":
- Year
- Month
- Week
- Day


## Currency

Examples: "30 Egyptian pounds", "77 USD"

```json
"resolutions": [
                    {
                        "resolutionKind": "CurrencyResolution",
                        "unit": "Egyptian pound",
                        "ISO4217": "EGP",
                        "value": 30
                    }
                ]
```

Possible values for "unit" and "ISO4217":
- [ISO 4217 reference](https://docs.1010data.com/1010dataReferenceManual/DataTypesAndFormats/currencyUnitCodes.html).

## Datetime

Datetime includes several different subtypes that return different response objects.

### Date

Specific days.

Examples: "January 1 1995", "12 april", "7th of October 2022", "tomorrow"

```json
"resolutions": [
                    {
                        "resolutionKind": "DateTimeResolution",
                        "dateTimeSubKind": "Date",
                        "timex": "1995-01-01",
                        "value": "1995-01-01"
                    }
                ]
```

Whenever an ambiguous date is provided, you're offered different options for your resolution. For example, "12 April" could refer to any year. Resolution provides this year and the next as options. The `timex` value `XXXX` indicates no year was specified in the query.

```json
"resolutions": [
                    {
                        "resolutionKind": "DateTimeResolution",
                        "dateTimeSubKind": "Date",
                        "timex": "XXXX-04-12",
                        "value": "2022-04-12"
                    },
                    {
                        "resolutionKind": "DateTimeResolution",
                        "dateTimeSubKind": "Date",
                        "timex": "XXXX-04-12",
                        "value": "2023-04-12"
                    }
                ]
```

Ambiguity can occur even for a given day of the week. For example, saying "Monday" could refer to last Monday or this Monday. Once again the `timex` value indicates no year or month was specified, and uses a day of the week identifier (W) to indicate the first day of the week. 

```json
"resolutions": [
                    {
                        "resolutionKind": "DateTimeResolution",
                        "dateTimeSubKind": "Date",
                        "timex": "XXXX-WXX-1",
                        "value": "2022-10-03"
                    },
                    {
                        "resolutionKind": "DateTimeResolution",
                        "dateTimeSubKind": "Date",
                        "timex": "XXXX-WXX-1",
                        "value": "2022-10-10"
                    }
                ]
```


### Time

Specific times.

Examples: "9:39:33 AM", "seven AM", "20:03"

```json
"resolutions": [
                    {
                        "resolutionKind": "DateTimeResolution",
                        "dateTimeSubKind": "Time",
                        "timex": "T09:39:33",
                        "value": "09:39:33"
                    }
                ]
```

### Datetime

Specific date and time combinations.

Examples: "6 PM tomorrow", "8 PM on January 3rd", "Nov 1 19:30"

```json
"resolutions": [
                    {
                        "resolutionKind": "DateTimeResolution",
                        "dateTimeSubKind": "DateTime",
                        "timex": "2022-10-07T18",
                        "value": "2022-10-07 18:00:00"
                    }
                ]
```

Similar to dates, you can have ambiguous datetime entities. For example, "May 3rd noon" could refer to any year. Resolution provides this year and the next as options. The `timex` value **XXXX** indicates no year was specified. 

```json
"resolutions": [
                    {
                        "resolutionKind": "DateTimeResolution",
                        "dateTimeSubKind": "DateTime",
                        "timex": "XXXX-05-03T12",
                        "value": "2022-05-03 12:00:00"
                    },
                    {
                        "resolutionKind": "DateTimeResolution",
                        "dateTimeSubKind": "DateTime",
                        "timex": "XXXX-05-03T12",
                        "value": "2023-05-03 12:00:00"
                    }
                ]
```

### Datetime ranges

A datetime range is a period with a beginning and end date, time, or datetime.

Examples: "from january 3rd 6 AM to april 25th 8 PM 2022", "between Monday to Thursday", "June", "the weekend"

The "duration" parameter indicates the time passed in seconds (S), minutes (M), hours (H), or days (D). This parameter is only returned when an explicit start and end datetime are in the query. "Next week" would only return with "begin" and "end" parameters for the week.

```json
"resolutions": [
                    {
                        "resolutionKind": "TemporalSpanResolution",
                        "duration": "PT2702H",
                        "begin": "2022-01-03 06:00:00",
                        "end": "2022-04-25 20:00:00"
                    }
                ]
```

### Set

A set is a recurring datetime period. Sets don't resolve to exact values, as they don't indicate an exact datetime. 

Examples: "every Monday at 6 PM", "every Thursday", "every weekend"

For "every Monday at 6 PM", the `timex` value indicates no specified year with the starting **XXXX**, then every Monday through **WXX-1** to determine first day of every week, and finally **T18** to indicate 6 PM. 

```json
"resolutions": [
                    {
                        "resolutionKind": "DateTimeResolution",
                        "dateTimeSubKind": "Set",
                        "timex": "XXXX-WXX-1T18",
                        "value": "not resolved"
                    }
                ]
```

## Dimensions

Examples: "24 km/hr", "44 square meters", "sixty six kilobytes"

```json
"resolutions": [
                    {
                        "resolutionKind": "SpeedResolution",
                        "unit": "KilometersPerHour",
                        "value": 24
                    }
                ]
```

Possible values for "resolutionKind" and their "unit" values:

- **AreaResolution**:
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

- **InformationResolution**:
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
  
- **LengthResolution**:
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

- **SpeedResolution**:
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

- **VolumeResolution**:
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

- **WeightResolution**:
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


## Number

Examples: "27", "one hundred and three", "38.5", "2/3", "33%"

```json
"resolutions": [
                    {
                        "resolutionKind": "NumberResolution",
                        "numberKind": "Integer",
                        "value": 27
                    }
                ]
```

Possible values for "numberKind":
- Integer
- Decimal
- Fraction
- Power
- Percent


## Ordinal

Examples: "3rd", "first", "last"

```json
"resolutions": [
                    {
                        "resolutionKind": "OrdinalResolution",
                        "offset": "3",
                        "relativeTo": "Start",
                        "value": "3"
                    }
                ]
```

Possible values for "relativeTo":
- Start
- End

## Temperature

Examples: "88 deg fahrenheit", "twenty three degrees celsius"

```json
"resolutions": [
                    {
                        "resolutionKind": "TemperatureResolution",
                        "unit": "Fahrenheit",
                        "value": 88
                    }
                ]
```

Possible values for "unit":
- Celsius
- Fahrenheit
- Kelvin
- Rankine




