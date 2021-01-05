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

## General NER categories, entities and subcategories

The following entity categories are returned when sending requests to the `/entities/recognition/general` endpoint.

Each category may include two concept groups:

* **Entities** - TBD.
* **Subcategories** - TBD.

## Person

### Entities

**PERSON** - names of people.

### Subcategories

**PersonType** - Job types or roles held by a person.

## Location

### Entities

**Location** - Natural and human-made landmarks, structures, geographical features, and geopolitical entities.

### Subcategories

**Geopolitical entity (GPE)** - Cities, countries/regions, states.

**Structural** - Manmade structures.

**Geographical** - Geographic and natural features such as rivers, oceans, and deserts.

## Organization

### Entities

**Organization** - Companies, political groups, musical bands, sport clubs, government bodies, and public organizations. Nationalities and religions are not included in this entity type.

### Subcategories

**Medical** - Medical companies and groups.

**Stock exchange** - Stock exchange groups.

**Sports** - Sports-related organizations.

## Event

**event** - Historical, social, and naturally occurring events.

### Subcategories

**Cultural** - Cultural events and holidays.

**Natural** - Naturally occurring events.

**Sports** - Sporting events.

## Product

**Product** - Physical objects of various categories.

### Subcategories

**Computing products** - Computing products.

## Skill

**Skill** - A capability, skill, or expertise.

## Address

**Address** - Full mailing addresses.

## PhoneNumber

 Phone numbers (US and EU phone numbers only). Also returned by NER v2.1.

## Email

Email addresses. Also returned by NER v2.1.

## URL

URLs to websites. Also returned by NER v2.1  

## IP 

Network IP addresses. Also returned by NER v2.1 

## DateTime

Dates and times of day. Also returned by NER v2.1 

### Subcategories

**Date** - Calender dates.  Also returned by NER v2.1.

**Time** - Times of day. Also returned by NER v2.1.

**DateRange** - Also returned by NER v2.1.

**TimeRange** - Time ranges. Also returned by NER v2.1.

**Duration** - Durations.  Also returned by NER v2.1.

**Set** -  Set, repeated times. Also returned by NER v2.1.

## Quantity 

 Numbers and numeric quantities. Also returned by NER v2.1  

### Subcategories

**Number** - Numbers. Also returned by NER v2.1 

**Percentage** Percentages.  Also returned by NER v2.1 

**Ordinal** - Ordinal numbers. Also returned by NER v2.1.
**Age** - Ages.  Also returned by NER v2.1 
**Currency** - Currencies. Also returned by NER v2.1 
**Dimension** - Dimensions and measurements. Also returned by NER v2.1 
**Temperature** - Temperatures.  Also returned by NER v2.1 
