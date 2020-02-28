---
title: General named entities
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 02/06/2020
ms.author: aahi
---

## General entity types:

### Person

Recognize person names in text.

Languages:
* Public preview: `Arabic`, `Czech`, `Chinese-Simplified`, `Danish`, `Dutch`, `English`, `Finnish`, `French`, `German`, `Hungarian`, `Italian`, `Japanese`, `Korean`, `Norwegian (Bokmål)`, `Polish`, `Portuguese (Portugal)`, `Portuguese (Brazil)`, `Russian`, `Spanish`, `Swedish` and `Turkish`

| Subtype name | Description                                                      | Available starting with model version |
|--------------|------------------------------------------------------------------|---------------------------------------|
| N/A          | Recognized person names, for example `Bill Gates`, `Marie Curie` | `2019-10-01`                          | 

### PersonType
Job type or role held by a person.

Languages:
* Public preview: `English`

| Subtype name | Description                                                                                | Available starting with model version |
|--------------|--------------------------------------------------------------------------------------------|----------------------------------------|
| N/A          | Job types for example `civil engineer`, `salesperson`, `chef`, `librarian`, `nursing aide` | `2020-02-01`                           |

### Location

Natural and human-made landmarks, structures, geographical features and geopolitical entities.

Languages:

* Public preview: `Arabic`, `Czech`, `Chinese-Simplified`, `Danish`, `Dutch`, `English`, `Finnish`, `French`, `German`, `Hungarian`, `Italian`, `Japanese`, `Korean`, `Norwegian (Bokmål)`, `Polish`, `Portuguese (Portugal)`, `Portuguese (Brazil)`, `Russian`, `Spanish`, `Swedish` and `Turkish`

| Subtype name              | Description                                                                              | Available starting with model version |
|---------------------------|------------------------------------------------------------------------------------------|----------------------------------------|
| N/A                       | locations, for example `Atlantic Ocean`, `library`, `Eiffel Tower`, `Statue of Liberty`  | `2019-10-01`                           |
| Geopolitical Entity (GPE) - English only| Cities, countries, states for example `Seattle`, `Pennsylvania`, `South Africa`, `Tokyo` | `2020-02-01`                           |

### Organization  

Recognized organizations, corporations, agencies, and other groups of people. For example: companies, political groups, musical bands, sport clubs, government bodies, and public organizations. Nationalities and religions are not included in this entity type. 

Languages: 

* Public preview: `Arabic`, `Czech`, `Chinese-Simplified`, `Danish`, `Dutch`, `English`, `Finnish`, `French`, `German`, `Hungarian`, `Italian`, `Japanese`, `Korean`, `Norwegian (Bokmål)`, `Polish`, `Portuguese (Portugal)`, `Portuguese (Brazil)`, `Russian`, `Spanish`, `Swedish` and `Turkish`

| Subtype name | Description                                                                                             | Available starting with model version |
|--------------|---------------------------------------------------------------------------------------------------------|----------------------------------------|
| N/A          | organizations, for example `Microsoft`, `NASA`, `National Oceanic and Atmospheric Administration`,`VOA` | `2019-10-01`                           |

### Event  

Historical, social and natural-occuring events.  

Languages: 

* Public preview: `English`

| Subtype name | Description                                                            | Available starting with model version |
|--------------|------------------------------------------------------------------------|----------------------------------------|
| N/A          | Events such as `wedding`, `hurricane`, `car accident`, `solar eclipse`, `American Revolution` | `2020-02-01`                           |

### Product  

Physical objects of various categories.  

Languages: 

* Public preview: `English`

| Subtype name | Description                                                                        | Available starting with model version |
|--------------|------------------------------------------------------------------------------------|----------------------------------------|
| N/A          | For example, `Microsoft Surface laptop`, `sunglasses`, `motorcycle`, `bag`, `Xbox` | `2020-02-01`                           |
| Computing    | `Azure Cosmos DB`, `Azure Kubernetes Service`                                     | `2020-02-01`                           |

### Skill  

An entity describing a capability or expertise.  

Languages: 

* Public preview: `English`

| Subtype name | Description                                                                 | Available starting with model version |
|--------------|-----------------------------------------------------------------------------|----------------------------------------|
| N/A          | `nursing`, `data mining`, `linguistics`, `critical thinking`, `photography` | `2020-02-01`                           |

### Phone Number

Phone numbers (US Phone numbers only). 

Languages:

* Public preview: `English`

| Subtype name | Description                                    | Available starting with model version |
|--------------|------------------------------------------------|----------------------------------------|
| N/A          | US phone numbers, for example `(312) 555-0176` | `2019-10-01`                           |

### Email

Email address. 

Languages:

* Public preview: `English`

| Subtype name | Description                                      | Available starting with model version |
|--------------|--------------------------------------------------|----------------------------------------|
| N/A          | Email address, for example `support@contoso.com` | `2019-10-01`                           |

### URL

Internet URLs.

Languages:

* Public preview: `English`

| Subtype name | Description                                          | Available starting with model version |
|--------------|------------------------------------------------------|----------------------------------------|
| N/A          | URLs to websites, for example `https://www.bing.com` | `2019-10-01`                           |

### IP Address

Internet Protocol Address

Languages:

* Public preview: `English`

| Subtype name | Description                              | Available starting with model version |
|--------------|------------------------------------------|----------------------------------------|
| N/A          | Network address for example `10.0.0.101` | `2019-10-01`                           |

###  DateTime

Date and Time entities. 

* Available starting with model version `2019-10-01`

Languages:

* Public preview: `Chinese-Simplified`, `English`, `French`, `German` and `Spanish`

| Subtype name    | Examples                     |
|-------------|------------------------------|
| N/A         | `6:30PM February 4, 2012`, `4/1/2011 2:45`                   |
| Date  | `May 2nd, 2017`, `05/02/2017`       |
| Time     | `8:15`, `6AM`              |
| DateRange    | `August 2nd to August 5th`         |
| TimeRange   | `4-6PM`, `10:00AM to Noon`          |
| Duration | `2.5 minutes`, `one and a half hours`         |
| Set | `every Saturday`         |

###  Quantity

Numbers and numeric quantities. 

* Available starting with model version `2019-10-01`

Languages:

* Public preview: `Chinese-Simplified`, `English`, `French`, `German` and `Spanish`

| Subtype name    | Examples                     |
|-------------|------------------------------|
| Number         | `6`, `six`                   |
| Percentage  | `50%`, `fifty percent`       |
| Ordinal     | `2nd`, `second`              |
| Age         | `90 day old`, `30 years old` |
| Currency    | `$10.99`, `€30.00`           |
| Dimension   | `10 miles`, `40 cm`          |
| Temperature | `32 degrees`, `10°C`         |
