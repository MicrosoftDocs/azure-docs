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

The following entity categories are returned when sending requests to the `/entities/recognition/general` endpoint.

## Person

This category contains the following entities:

| Category | Description | Languages        | 
|----------|-------------|------------------|
| Person   | Names of people        | `ar`, `cs`, `da`, `nl`, `en`, `fi`, `fr`, `de`, `he`, `hu`, `it`, `ja`, `ko`, `no`, `pl`, `pt-br`, `pt`-`pt`, `ru`, `es`, `sv`, `tr`|

## PersonType

This category contains the following entities:

| Category | Description | Languages        | 
|----------|-------------|------------------|
| PersonType   | Job types or roles held by a person. | `ar`, `cs`, `da`, `nl`, `en`, `fi`, `fr`, `de`, `he`, `hu`, `it`, `ja`, `ko`, `no`, `pl`, `pt-br`, `pt-pt`, `ru`, `es`, `sv`, `tr`|

## Location

This category contains the following entities:

| Category | Description | Languages        | 
|----------|-------------|------------------|
|Location    | Natural and human-made landmarks, structures, geographical features, and geopolitical entities     |  `ar`, `cs`, `da`, `nl`, `en`, `fi`, `fr`, `de`, `he`, `hu`, `it`, `ja`, `ko`, `no`, `pl`, `pt-br`, `pt-pt`, `ru`, `es`, `sv`, `tr` |

Entities in this category can have the following subcategories

| Subcategory | Description | Languages        | 
|----------|-------------|------------------|
|Geopolitical Entity (GPE)        | Cities, countries/regions, states.      | `en` | 
|Structural                       | Manmade structures. | `en` | 
|Geographical       | Geographic and natural features such as rivers, oceans, and deserts. |  `en` | 

## Organization

This category contains the following entities:

| Category | Description | Languages        | 
|----------|-------------|------------------|
|Organization  | Companies, political groups, musical bands, sport clubs, government bodies, and public organizations. Nationalities and religions are not included in this entity type.  | `ar`, `cs`, `da`, `nl`, `en`, `fi`, `fr`, `de`, `he`, `hu`, `it`, `ja`, `ko`, `no`, `pl`, `pt-br`, `pt-pt`, `ru`, `es`, `sv`, `tr` |  

Entities in this category can have the following subcategories

| Subcategory | Description | Languages        | 
|----------|-------------|------------------|
|Organization | Medical | Medical companies and groups. | `en` |  
|Organization | Stock exchange | Stock exchange groups. | `en` | 
| Organization | Sports | Sports-related organizations. | `en` |  

## Event

This category contains the following entities:

| Category | Description | Languages        | 
|----------|-------------|------------------|
| Event  | Historical, social, and naturally occurring events. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt` and `pt-br` |

Entities in this category can have the following subcategories

| Subcategory | Description | Languages        | 
|----------|-------------|------------------|
| Cultural | Cultural events and holidays. | `en` |
| Natural | Naturally occurring events. | `en`  |
| Sports | Sporting events.  | `en` |

## Product

This category contains the following entities:

| Category | Description | Languages        | 
|----------|-------------|------------------|
| Physical objects of various categories. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br` | 

Entities in this category can have the following subcategories

| Subcategory | Description | Languages        | 
|----------|-------------|------------------|
| Computing products | Computing products. |  `en` |

## Skill

This category contains the following entities:

| Category | Description | Languages        | 
|----------|-------------|------------------|
| Skill |  A capability, skill, or expertise. | `en` |  |

## Address

This category contains the following entities:

| Category | Description | Languages        | 
|----------|-------------|------------------|
| Address | N/A | Full mailing addresses.  | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`  |

## PhoneNumber

This category contains the following entities:

| Category | Description | Languages        | 
|----------|-------------|------------------|
| PhoneNumber | Phone numbers (US and EU phone numbers only). | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt` `pt-br` |


## Email

This category contains the following entities:

| Category | Description | Languages        | 
|----------|-------------|------------------|
| Email | Email addresses.  | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`  |

## URL

This category contains the following entities:

| Category | Description | Languages        | 
|----------|-------------|------------------|
| Email |  URLs to websites.  | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`  |

## IP

This category contains the following entities:

| Category | Description | Languages        | 
|----------|-------------|------------------|
| IP |  Network IP addresses.  | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`  |

## DateTime

This category contains the following entities:

| Category | Description | Languages        | 
|----------|-------------|------------------|
| DateTime | Dates and times of day. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br` |

Entities in this category can have the following subcategories

| Subcategory | Description | Languages        | 
|----------|-------------|------------------|
| Date | Calender dates. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br` |
| Time | Times of day | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br` |
| DateRange | Date ranges. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br` |
| TimeRange | Time ranges. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br`|
| Duration | Durations. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br` |
| Set | Set, repeated times. |  `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br` |



| Quantity | N/A | Numbers and numeric quantities. | `2019-10-01` | Also returned by NER v2.1  |
| Quantity | Number | Numbers. | `2019-10-01` | Also returned by NER v2.1 |
| Quantity | Percentage | Percentages.| `2019-10-01` | Also returned by NER v2.1 |
| Quantity | Ordinal | Ordinal numbers. | `2019-10-01` | Also returned by NER v2.1 |
| Quantity | Age | Ages. | `2019-10-01` |  Also returned by NER v2.1 |
| Quantity | Currency | Currencies. | `2019-10-01` | Also returned by NER v2.1 |
| Quantity | Dimension | Dimensions and measurements. | `2019-10-01` | Also returned by NER v2.1 |
| Quantity | Temperature | Temperatures. | `2019-10-01` | Also returned by NER v2.1 |
-->