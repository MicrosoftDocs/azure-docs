---
title: General named entities
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 03/30/2020
ms.author: aahi
---

## General categories:

| Category   | Subcategory | Description                          | Examples                                                    | Available starting in model-version |
|------------|-------------|--------------------------------------|-------------------------------------------------------------|--------------------------------------|
| Person     | N/A         | Names of people.                     | Bill Gates, Marie Curie                                     | `2019-10-01`                         |
| PersonType | N/A         | Job types or roles held by a person. | civil engineer, salesperson, chef, librarian, nursing aide | `2020-02-01`                         |
|Location    | N/A         | Natural and human-made landmarks, structures, geographical features, and geopolitical entities     | Atlantic Ocean, library, Eiffel Tower, Statue of Liberty         | `2019-10-01` |
|Location     | Geopolitical Entity (GPE)        | Cities, countries, states. | Seattle, Pennsylvania, South Africa, Tokyo        | `2020-02-01` |
|Location     | Structural                       | Manmade structures. | Eiffel Tower        | `2020-04-01` |
|Location     | Geographical       | Geographic and natural features such as rivers, oceans, and deserts. |  Atlantic ocean, Rocky Mountains.        | `2020-04-01` |
|Organization  | N/A | Companies, political groups, musical bands, sport clubs, government bodies, and public organizations. Nationalities and religions are not included in this entity type. | Microsoft, NASA | `2019-10-01` |
|Organization | Medical | Medical companies and groups | Contoso Pharmaceuticals | `2020-04-01` |
|Organization | Stock exchange | Stock exchange groups. | Major stock exchange names and abbreviations. | `2020-04-01` |
| Organization | Sports | Sports-related organizations. | Popular leagues, clubs and associations. | `2020-04-01` | 
| Event  | N/A | Historical, social, and naturally occurring events. | wedding, hurricane, car accident, solar eclipse, American Revolution | `2020-02-01` | 
| Event  | Cultural | Cultural events. | Bastille day, Independence day  | `2020-04-01` | 
| Event  | Natural | Natural events. | hurricane, tornado, solar eclipse  | `2020-04-01` | 
| Event  | Sports | Sporting events. | Championships, tournaments, and competitions.   | `2020-04-01` | 
| Product | N/A | Physical objects of various categories. | Microsoft Surface laptop, sunglasses, motorcycle, bag, Xbox | `2020-02-01` |
| Product | Computing products | Computing products. | Azure Cosmos DB, Azure Kubernetes Service | `2020-02-01 ` |
| Skill | N/A | A capability or expertise. | nursing, data mining, linguistics, critical thinking, photography | `2020-02-01` |  
| Address | N/A | Full addresses. | 1234 Main St. Buffalo, NY 98052 | `2020-04-01` |
| Phone Number | N/A | Phone numbers (US Phone numbers only) | (312) 555-0176 | `2019-10-01` |
| Email | N/A | Email addresses. | `support@contoso.com` | `2019-10-01` | 
| URL | N/A | URLs to websites. | `https://www.bing.com` | `2019-10-01` |
| IP Address | N/A | Network addresses. | `10.0.0.101` | `2019-10-01` |
| DateTime | N/A | Date and Time entities. | 6:30PM February 4 2012, 4/1/2011 2:45. | `2019-10-01` | 
| DateTime | Date | Dates in time. | May 2nd 2017, 05/02/2017 | `2019-10-01` |
| DateTime | Time | Times. | 8:15, 6AM | `2019-10-01` |
| DateTime | DateRange | Date ranges. | August 2nd to August 5th | `2019-10-01` |
| DateTime | TimeRange | Time ranges. | 4-6PM, 10:00AM to Noon | `2019-10-01` |
| DateTime | Duration | Durations. | 2.5 minutes, one and a half hours | `2019-10-01` |
| DateTime | Set | Set, repeated times. | every Saturday | `2019-10-01` |
| Quantity | N/A | Numbers and numeric quantities. | | `2019-10-01` |
| Quantity | Number | Numbers. | 6, six | `2019-10-01` |
| Quantity | Percentage | Percentages. | 50%, fifty percent | `2019-10-01` |
| Quantity | Ordinal | Ordinal numbers. | 2nd, second  | `2019-10-01` |
| Quantity | Age | Ages. | 90 day old, 30 years old | `2019-10-01` |
| Quantity | Currency | Currencies. | $10.99, &euro;30.00  | `2019-10-01` |
| Quantity | Dimension | Dimensions and measurements. | 10 miles, 40 cm  | `2019-10-01` |
| Quantity | Temperature | Temperatures. | 32 degrees, 10°C  | `2019-10-01` |
