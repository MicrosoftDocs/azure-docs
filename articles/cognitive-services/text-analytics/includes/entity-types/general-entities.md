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

| Category | Description | Supported document languages        | 
|----------|-------------|------------------:|
| Person   | Names of people        | `ar`, `cs`, `da`, `nl`, `en`, `fi`, `fr`, `de`, `he`, `hu`, `it`, `ja`, `ko`, `no`, `pl`, `pt-br`, `pt`-`pt`, `ru`, `es`, `sv`, `tr`|

## PersonType

This category contains the following entities:

| Category | Description | Supported document languages          | 
|----------|-------------|------------------:|
| PersonType   | Job types or roles held by a person. | `ar`, `cs`, `da`, `nl`, `en`, `fi`, `fr`, `de`, `he`, `hu`, `it`, `ja`, `ko`, `no`, `pl`, `pt-br`, `pt-pt`, `ru`, `es`, `sv`, `tr`|

## Location

This category contains the following entities:

| Category | Description | Supported document languages          | 
|----------|-------------|------------------:|
|Location    | Natural and human-made landmarks, structures, geographical features, and geopolitical entities     |  `ar`, `cs`, `da`, `nl`, `en`, `fi`, `fr`, `de`, `he`, `hu`, `it`, `ja`, `ko`, `no`, `pl`, `pt-br`, `pt-pt`, `ru`, `es`, `sv`, `tr` |

Entities in this category can have the following subcategories

| Subcategory | Description | Supported document languages          | 
|----------|-------------|------------------:|
|Geopolitical <br> Entity (GPE)        | Cities, countries/regions, states.      | `en` | 
|Structural                       | Manmade structures. | `en` | 
|Geographical       | Geographic and natural features such as rivers, oceans, and deserts. |  `en` | 

## Organization

This category contains the following entities:

| Category | Description | Supported document languages          | 
|----------|-------------|------------------:|
|Organization  | Companies, political groups, musical bands, sport clubs, government bodies, and public organizations. Nationalities and religions are not included in this entity type.  | `ar`, `cs`, `da`, `nl`, `en`, `fi`, `fr`, `de`, `he`, `hu`, `it`, `ja`, `ko`, `no`, `pl`, `pt-br`, `pt-pt`, `ru`, `es`, `sv`, `tr` |  

Entities in this category can have the following subcategories

| Subcategory | Description | Supported document languages          | 
|----------|-------------|------------------:|
| Medical | Medical companies and groups. | `en` |  
| Stock exchange | Stock exchange groups. | `en` | 
| Sports | Sports-related organizations. | `en` |  

## Event

This category contains the following entities:

| Category | Description | Supported document languages          | 
|----------|-------------|------------------:|
| Event  | Historical, social, and naturally occurring events. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt` and `pt-br` |

Entities in this category can have the following subcategories

| Subcategory | Description | Supported document languages          | 
|----------|-------------|------------------:|
| Cultural | Cultural events and holidays. | `en` |
| Natural | Naturally occurring events. | `en`  |
| Sports | Sporting events.  | `en` |

## Product

This category contains the following entities:

| Category | Description | Supported document languages          | 
|----------|-------------|------------------:|
|Product | Physical objects of various categories. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br` | 

Entities in this category can have the following subcategories

| Subcategory | Description | Supported document languages          | 
|----------|-------------|------------------:|
| Computing products | Computing products. |  `en` |

## Skill

This category contains the following entities:

| Category | Description | Supported document languages          | 
|----------|-------------|------------------:|
| Skill |  A capability, skill, or expertise. | `en` |  |

## Address

This category contains the following entities:

| Category | Description | Supported document languages          | 
|----------|-------------|------------------:|
| Address | Full mailing addresses.  | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`  |

## PhoneNumber

This category contains the following entities:

| Category | Description | Supported document languages          | 
|----------|-------------|------------------:|
| PhoneNumber | Phone numbers (US and EU phone numbers only). | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt` `pt-br` |


## Email

This category contains the following entities:

| Category | Description | Supported document languages          | 
|----------|-------------|------------------:|
| Email | Email addresses.  | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`  |

## URL

This category contains the following entities:

| Category | Description | Supported document languages          | 
|----------|-------------|------------------:|
| Email |  URLs to websites.  | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`  |

## IP

This category contains the following entities:

| Category | Description | Supported document languages          | 
|----------|-------------|------------------:|
| IP |  Network IP addresses.  | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`  |

## DateTime

This category contains the following entities:

| Category | Description | Supported document languages          | 
|----------|-------------|------------------:|
| DateTime | Dates and times of day. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br` |

Entities in this category can have the following subcategories

| Subcategory | Description | Supported document languages          | 
|----------|-------------|------------------:|
| Date | Calender dates. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br` |
| Time | Times of day | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br` |
| DateRange | Date ranges. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br` |
| TimeRange | Time ranges. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br`|
| Duration | Durations. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br` |
| Set | Set, repeated times. |  `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br` |

## Quantity

This category contains the following entities:

| Category | Description | Supported document languages          | 
|----------|-------------|------------------:|
| Quantity | Numbers and numeric quantities. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br` |

Entities in this category can have the following subcategories

| Subcategory | Description | Supported document languages          | 
|----------|-------------|------------------:|
| Number | Numbers. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br` |
| Percentage | Percentages.| `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br` |
| Ordinal | Ordinal numbers. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br` |
| Age | Ages. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br` |
| Currency | Currencies. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br` |
| Dimension | Dimensions and measurements. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br` |
| Temperature | Temperatures. | `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br` |
