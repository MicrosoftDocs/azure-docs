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

## Person

This category contains the following entities:

:::row:::
   :::column span="":::
      **Category or subcategory**

      Person
   :::column-end:::
   :::column span="2":::
      **Details**

      Names of people.
      
   :::column-end:::
:::column span="1":::
      **Languages**

      `en`, `en`, `en`, `en`, `en`, `en`, `en`, `en`, `en`,  `en`    
      
   :::column-end:::

:::row-end:::
:::row:::
   :::column span="":::
      PersonType
   :::column-end:::
   :::column span="2":::

      Job types or roles held by a person. Subcategory of the **Person** entity.    
   :::column-end:::

    :::column span="1":::

      `en`, `en`, `en`, `en`, `en`, `en`, `en`, `en`, `en`,  `en`       
      
   :::column-end:::
:::row-end:::
### Supported relations

TBD 

## Organization

This category contains the following entities:

:::row:::
   :::column span="":::
      **Category or subcategory**

      Organization
   :::column-end:::
   :::column span="2":::
      **Details**

      Companies, political groups, musical bands, sport clubs, government bodies, and public organizations. 
      
   :::column-end:::
   :::column span="1":::
      **Languages**

      `en`, `en`, `en`, `en`, `en`, `en`, `en`, `en`, `en`,  `en`    
      
   :::column-end:::

:::row-end:::
:::row:::
   :::column span="":::
      Medical
   :::column-end:::
   :::column span="2":::

      Medical companies and groups. Subcategory of **Organization**.  
   :::column-end:::
    :::column span="1":::
      **Languages**

       `en`, `en`, `en`, `en`, `en`, `en`, `en`, `en`, `en`,  `en`        
          
    :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      Stock exchange
   :::column-end:::
   :::column span="2":::

      Stock exchange groups. Subcategory of **Organization**.  
   :::column-end:::
    :::column span="1":::
      **Languages**

       `en`, `en`, `en`, `en`, `en`, `en`, `en`, `en`, `en`,  `en`        
          
    :::column-end:::
:::row-end:::

:::row:::
   :::column span="":::
      Sports
   :::column-end:::
   :::column span="2":::

      Sports-related organizations. Subcategory of **Organization**.  
      Available in the following languages: `en-us`
   :::column-end:::
    :::column span="1":::
      **Languages**

       `en`, `en`, `en`, `en`, `en`, `en`, `en`, `en`, `en`,  `en`        
          
    :::column-end:::
:::row-end:::

### Supported relations

TBD


<!--| Category   | Description                          |
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


## Category: Person 

### Entities

**PERSON** - the names of people.

### Subcategories

**PersonType** - Job types or roles held by a person.

### Available languages

Available in the following languages: `en-us`

## Category: Location

### Entities

**Location** - Natural and human-made landmarks, structures, geographical features, and geopolitical entities.

### Subcategories

**Geopolitical entity (GPE)** - Cities, countries/regions, states.

**Structural** - Manmade structures.

**Geographical** - Geographic and natural features such as rivers, oceans, and deserts.

### Available languages

Available in the following languages: `en-us`

## Category: Organization

### Entities

**Organization** - Companies, political groups, musical bands, sport clubs, government bodies, and public organizations. Nationalities and religions are not included in this entity type.

### Subcategories

**Medical** - Medical companies and groups.

**Stock exchange** - Stock exchange groups.

**Sports** - Sports-related organizations.

### Available languages

Available in the following languages: `en-us`

## Category: Event

### Entities

**event** - Historical, social, and naturally occurring events.

### Subcategories

**Cultural** - Cultural events and holidays.

**Natural** - Naturally occurring events.

**Sports** - Sporting events.

### Available languages

Available in the following languages: `en-us`

## Category: Product 

### Entities

**Product** - Physical objects of various categories.

### Subcategories

**Computing products** - Computing products.

### Available languages

Available in the following languages: `en-us`

## Category: Skill

### Entities

**Skill** - A capability, skill, or expertise.

### Available languages

Available in the following languages: `en-us`

## Category: Address

**Address** - Full mailing addresses.

### Available languages

Available in the following languages: `en-us`

## Category: PhoneNumber

### Entities

Phone numbers (US and EU phone numbers only). Also returned by NER v2.1.

### Available languages

Available in the following languages: `en-us`

## Category: Email 

### Entities

Email addresses. Also returned by NER v2.1.

### Available languages

Available in the following languages: `en-us`

## Category: URL 

## Entities

URLs to websites. Also returned by NER v2.1  

### Available languages

Available in the following languages: `en-us`

## Category: IP 

### Entities

Network IP addresses. Also returned by NER v2.1 

### Available languages

Available in the following languages: `en-us`

## Category: DateTime 

### Entities

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

## Category: Quantity 

### Entities

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

Available in the following languages: `en-us`-->
