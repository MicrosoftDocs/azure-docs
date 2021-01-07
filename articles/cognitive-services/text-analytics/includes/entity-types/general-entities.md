---
title: General named entities
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include 
ms.date: 05/13/2020
ms.author: aahi
---

## NER categories

The NER feature for Text Analytics returns the following general (non identifying) entity categories. for example when sending requests to the `/entities/recognition/general` endpoint.

| Category   | Description                          |
|------------|-------------|
| Person     |  Names of people.  | 
| PersonType | Job types or roles held by a person. | 
|Location    | Natural and human-made landmarks, structures, geographical features, and geopolitical entities     |
|Organization | Companies, political groups, musical bands, sport clubs, government bodies, and public organizations.  |
| Event  | Historical, social, and naturally occurring events. |
| Product | Physical objects of various categories. | 
| Skill | A capability, skill, or expertise. | 
| Address | Full mailing addresses.  | 
| PhoneNumber | Phone numbers (US and EU phone numbers only). |
| Email | Email addresses. | 
| URL |  URLs to websites. | 
| IP | Network IP addresses. | 
| DateTime | Dates and times of day. |


## Person entities

**PERSON** - the names of people.

### Subcategories

**PersonType** - Job types or roles held by a person.

### Available languages

Available in the following languages: `en-us`

## Location entities

**Location** - Natural and human-made landmarks, structures, geographical features, and geopolitical entities.

### Subcategories

**Geopolitical entity (GPE)** - Cities, countries/regions, states.

**Structural** - Manmade structures.

**Geographical** - Geographic and natural features such as rivers, oceans, and deserts.

### Available languages

Available in the following languages: `en-us`

## Organization entities

**Organization** - Companies, political groups, musical bands, sport clubs, government bodies, and public organizations. Nationalities and religions are not included in this entity type.

### Subcategories

**Medical** - Medical companies and groups.

**Stock exchange** - Stock exchange groups.

**Sports** - Sports-related organizations.

### Available languages

Available in the following languages: `en-us`

## Event entities

**event** - Historical, social, and naturally occurring events.

### Subcategories

**Cultural** - Cultural events and holidays.

**Natural** - Naturally occurring events.

**Sports** - Sporting events.

### Available languages

Available in the following languages: `en-us`

## Product entities

**Product** - Physical objects of various categories.

### Subcategories

**Computing products** - Computing products.

### Available languages

Available in the following languages: `en-us`

## Skill entities


**Skill** - A capability, skill, or expertise.

### Available languages

Available in the following languages: `en-us`

## Address entities


**Address** - Full mailing addresses.

### Available languages

Available in the following languages: `en-us`

## PhoneNumber entities


 Phone numbers (US and EU phone numbers only). Also returned by NER v2.1.

### Available languages

Available in the following languages: `en-us`

## Email entities


Email addresses. Also returned by NER v2.1.

### Available languages

Available in the following languages: `en-us`

## URL entities

URLs to websites. Also returned by NER v2.1  

### Available languages

Available in the following languages: `en-us`

## IP entities

Network IP addresses. Also returned by NER v2.1 

### Available languages

Available in the following languages: `en-us`

## DateTime entities

Dates and times of day. Also returned by NER v2.1 

### Subcategories

**Date** - Calender dates.  Also returned by NER v2.1.

**Time** - Times of day. Also returned by NER v2.1.

**DateRange** - Also returned by NER v2.1.

**TimeRange** - Time ranges. Also returned by NER v2.1.

**Duration** - Durations.  Also returned by NER v2.1.

**Set** -  Set, repeated times. Also returned by NER v2.1.

### Available languages

Available in the following languages: `en-us`

## Quantity entities

 Numbers and numeric quantities. Also returned by NER v2.1  

### Subcategories

**Number** - Numbers. Also returned by NER v2.1 

**Percentage** Percentages.  Also returned by NER v2.1 

**Ordinal** - Ordinal numbers. Also returned by NER v2.1.

**Age** - Ages.  Also returned by NER v2.1 

**Currency** - Currencies. Also returned by NER v2.1 

**Dimension** - Dimensions and measurements. Also returned by NER v2.1 

**Temperature** - Temperatures.  Also returned by NER v2.1 

### Available languages

Available in the following languages: `en-us`
