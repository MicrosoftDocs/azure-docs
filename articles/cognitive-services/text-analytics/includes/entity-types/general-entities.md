---
title: General named entities
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 05/13/2020
ms.author: aahi
---

The following entity categories are returned when sending requests to the `/entities/recognition/general` endpoint.

| Category   | Subcategory | Description                          | Starting model version                                                    | Notes |
|------------|-------------|--------------------------------------|-------------------------------------------------------------|--------------------------------------|
| Person     | N/A         | Names of people.  | `2019-10-01`  | Also returned by NER v2.1 |
| PersonType | N/A         | Job types or roles held by a person. | `2020-02-01` | |
|Location    | N/A         | Natural and human-made landmarks, structures, geographical features, and geopolitical entities     |  `2019-10-01` | Also returned by NER v2.1 |
|Location     | Geopolitical Entity (GPE)        | Cities, countries/regions, states.      | `2020-02-01` | |
|Location     | Structural                       | Manmade structures. | `2020-04-01` | |
|Location     | Geographical       | Geographic and natural features such as rivers, oceans, and deserts. |  `2020-04-01` | |
|Organization  | N/A | Companies, political groups, musical bands, sport clubs, government bodies, and public organizations.  | `2019-10-01` | Nationalities and religions are not included in this entity type. Also returned by NER v2.1 |
|Organization | Medical | Medical companies and groups. | `2020-04-01` |  |
|Organization | Stock exchange | Stock exchange groups. | `2020-04-01` | |
| Organization | Sports | Sports-related organizations. | `2020-04-01` |  |
| Event  | N/A | Historical, social, and naturally occurring events. | `2020-02-01` |  |
| Event  | Cultural | Cultural events and holidays. | `2020-04-01` | |
| Event  | Natural | Naturally occurring events. | `2020-04-01` |  |
| Event  | Sports | Sporting events.  | `2020-04-01` | |
| Product | N/A | Physical objects of various categories. | `2020-02-01` | |
| Product | Computing products | Computing products. |  `2020-02-01 ` | |
| Skill | N/A | A capability, skill, or expertise. | `2020-02-01` |  |
| Address | N/A | Full mailing addresses.  | `2020-04-01` |  |
| PhoneNumber | N/A | Phone numbers (US and EU phone numbers only). | `2019-10-01` | Also returned by NER v2.1 |
| Email | N/A | Email addresses. | `2019-10-01` | Also returned by NER v2.1 |
| URL | N/A | URLs to websites. | `2019-10-01` | Also returned by NER v2.1  |
| IP | N/A | Network IP addresses. | `2019-10-01` | Also returned by NER v2.1 |
| DateTime | N/A | Dates and times of day. | `2019-10-01` | Also returned by NER v2.1 | 
| DateTime | Date | Calender dates. | `2019-10-01` | Also returned by NER v2.1 |
| DateTime | Time | Times of day | `2019-10-01` | Also returned by NER v2.1 |
| DateTime | DateRange | Date ranges. | `2019-10-01` | Also returned by NER v2.1 |
| DateTime | TimeRange | Time ranges. | `2019-10-01` | Also returned by NER v2.1 |
| DateTime | Duration | Durations. | `2019-10-01` | Also returned by NER v2.1 |
| DateTime | Set | Set, repeated times. |  `2019-10-01` | Also returned by NER v2.1 |
| Quantity | N/A | Numbers and numeric quantities. | `2019-10-01` | Also returned by NER v2.1  |
| Quantity | Number | Numbers. | `2019-10-01` | Also returned by NER v2.1 |
| Quantity | Percentage | Percentages.| `2019-10-01` | Also returned by NER v2.1 |
| Quantity | Ordinal | Ordinal numbers. | `2019-10-01` | Also returned by NER v2.1 |
| Quantity | Age | Ages. | `2019-10-01` |  Also returned by NER v2.1 |
| Quantity | Currency | Currencies. | `2019-10-01` | Also returned by NER v2.1 |
| Quantity | Dimension | Dimensions and measurements. | `2019-10-01` | Also returned by NER v2.1 |
| Quantity | Temperature | Temperatures. | `2019-10-01` | Also returned by NER v2.1 |
