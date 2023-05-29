---
title: Entity categories recognized by Named Entity Recognition in Azure Cognitive Service for Language
titleSuffix: Azure Cognitive Services
description: Learn about the entities the NER feature can recognize from unstructured text.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: jboback
ms.custom: language-service-ner, ignite-fall-2021
---

# Supported Named Entity Recognition (NER) entity categories and entity types

Use this article to find the entity categories that can be returned by [Named Entity Recognition](../how-to-call.md) (NER). NER runs a predictive model to identify and categorize named entities from an input document. 

> [!NOTE]
> * Starting form API version 2023-04-15-preview, the category and subcategory fields are replaced with entity types and tags to introduce better flexibility. 
> * __Entity types__ represent the lowest (or finest) granuality at which the entity has been detected and can be considered to be the base class that has been detected.
> * __Entity tags__ are used to further identify an entity where a detected entity is tagged by the entity type and additional tags to differentiate the identified entity. The entity tags list could be considered to include categories, subcategories, sub-subcategories, and so on.

::: zone pivot="Generally Available API"

## Category: Person

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Person

    :::column-end:::
    :::column span="2":::
        **Details**

        Names of people.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `ar`, `cs`, `da`, `nl`, `en`, `fi`, `fr`, `de`, `he`, <br> `hu`, `it`, `ja`, `ko`, `no`, `pl`, `pt-br`, `pt`-`pt`, `ru`, `es`, `sv`, `tr`   
      
   :::column-end:::
:::row-end:::

## Category: PersonType

This category contains the following entity:


:::row:::
    :::column span="":::
        **Entity**

        PersonType

    :::column-end:::
    :::column span="2":::
        **Details**

        Job types or roles held by a person
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`  
      
   :::column-end:::
:::row-end:::

## Category: Location

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Location

    :::column-end:::
    :::column span="2":::
        **Details**

        Natural and human-made landmarks, structures, geographical features, and geopolitical entities.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `ar`, `cs`, `da`, `nl`, `en`, `fi`, `fr`, `de`, `he`, `hu`, `it`, `ja`, `ko`, `no`, `pl`, `pt-br`, `pt-pt`, `ru`, `es`, `sv`, `tr`   
      
   :::column-end:::
:::row-end:::

#### Subcategories

The entity in this category can have the following subcategories.

:::row:::
    :::column span="":::
        **Entity subcategory**

        Geopolitical Entity (GPE)

    :::column-end:::
    :::column span="2":::
        **Details**

        Cities, countries/regions, states.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`   
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Structural

    :::column-end:::
    :::column span="2":::

        Manmade structures. 
      
    :::column-end:::
    :::column span="2":::

      `en`   
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Geographical

    :::column-end:::
    :::column span="2":::

        Geographic and natural features such as rivers, oceans, and deserts.
      
    :::column-end:::
    :::column span="2":::

      `en`   
      
   :::column-end:::
:::row-end:::

## Category: Organization

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Organization

    :::column-end:::
    :::column span="2":::
        **Details**

        Companies, political groups, musical bands, sport clubs, government bodies, and public organizations. Nationalities and religions are not included in this entity type.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `ar`, `cs`, `da`, `nl`, `en`, `fi`, `fr`, `de`, `he`, `hu`, `it`, `ja`, `ko`, `no`, `pl`, `pt-br`, `pt-pt`, `ru`, `es`, `sv`, `tr`   
      
   :::column-end:::
:::row-end:::

#### Subcategories

The entity in this category can have the following subcategories.

:::row:::
    :::column span="":::
        **Entity subcategory**

        Medical

    :::column-end:::
    :::column span="2":::
        **Details**

        Medical companies and groups.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`   
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Stock exchange

    :::column-end:::
    :::column span="2":::

        Stock exchange groups. 
      
    :::column-end:::
    :::column span="2":::

      `en`   
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Sports

    :::column-end:::
    :::column span="2":::

        Sports-related organizations.
      
    :::column-end:::
    :::column span="2":::

      `en`   
      
   :::column-end:::
:::row-end:::

## Category: Event

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Event

    :::column-end:::
    :::column span="2":::
        **Details**

        Historical, social, and naturally occurring events.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt` and `pt-br`  
      
   :::column-end:::
:::row-end:::

#### Subcategories

The entity in this category can have the following subcategories.

:::row:::
    :::column span="":::
        **Entity subcategory**

        Cultural

    :::column-end:::
    :::column span="2":::
        **Details**

        Cultural events and holidays.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`   
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Natural

    :::column-end:::
    :::column span="2":::

        Naturally occurring events.
      
    :::column-end:::
    :::column span="2":::

      `en`   
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Sports

    :::column-end:::
    :::column span="2":::

        Sporting events.
      
    :::column-end:::
    :::column span="2":::

      `en`   
      
   :::column-end:::
:::row-end:::

## Category: Product

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Product

    :::column-end:::
    :::column span="2":::
        **Details**

        Physical objects of various categories.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`  
      
   :::column-end:::
:::row-end:::


#### Subcategories

The entity in this category can have the following subcategories.

:::row:::
    :::column span="":::
        **Entity subcategory**

        Computing products
    :::column-end:::
    :::column span="2":::
        **Details**

        Computing products.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`   
      
   :::column-end:::
:::row-end:::

## Category: Skill

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Skill

    :::column-end:::
    :::column span="2":::
        **Details**

        A capability, skill, or expertise.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en` , `es`, `fr`, `de`, `it`, `pt-pt`, `pt-br` 
      
   :::column-end:::
:::row-end:::

## Category: Address

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Address

    :::column-end:::
    :::column span="2":::
        **Details**

        Full mailing address.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::

## Category: PhoneNumber

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        PhoneNumber

    :::column-end:::
    :::column span="2":::
        **Details**

        Phone numbers (US and EU phone numbers only).
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt` `pt-br`
      
   :::column-end:::
:::row-end:::

## Category: Email

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Email

    :::column-end:::
    :::column span="2":::
        **Details**

        Email addresses.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::

## Category: URL

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        URL

    :::column-end:::
    :::column span="2":::
        **Details**

        URLs to websites. 
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::

## Category: IP

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        IP

    :::column-end:::
    :::column span="2":::
        **Details**

        network IP addresses. 
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::

## Category: DateTime

This category contains the following entities:

:::row:::
    :::column span="":::
        **Entity**

        DateTime

    :::column-end:::
    :::column span="2":::
        **Details**

        Dates and times of day. 
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::

Entities in this category can have the following subcategories

#### Subcategories

The entity in this category can have the following subcategories.

:::row:::
    :::column span="":::
        **Entity subcategory**

        Date

    :::column-end:::
    :::column span="2":::
        **Details**

        Calender dates.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br`   
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Time

    :::column-end:::
    :::column span="2":::

        Times of day.
      
    :::column-end:::
    :::column span="2":::

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br`   
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        DateRange

    :::column-end:::
    :::column span="2":::

        Date ranges.
      
    :::column-end:::
    :::column span="2":::

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br`  
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        TimeRange

    :::column-end:::
    :::column span="2":::

        Time ranges.
      
    :::column-end:::
    :::column span="2":::

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br`  
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Duration

    :::column-end:::
    :::column span="2":::

        Durations.
      
    :::column-end:::
    :::column span="2":::

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br`  
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Set

    :::column-end:::
    :::column span="2":::

        Set, repeated times.
      
    :::column-end:::
    :::column span="2":::

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br`  
      
   :::column-end:::
:::row-end:::

## Category: Quantity

This category contains the following entities:

:::row:::
    :::column span="":::
        **Entity**

        Quantity

    :::column-end:::
    :::column span="2":::
        **Details**

        Numbers and numeric quantities.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `ja`, `ko`, `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::

#### Subcategories

The entity in this category can have the following subcategories.

:::row:::
    :::column span="":::
        **Entity subcategory**

        Number

    :::column-end:::
    :::column span="2":::
        **Details**

        Numbers.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br`   
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
        Percentage

    :::column-end:::
    :::column span="2":::

        Percentages
      
    :::column-end:::
    :::column span="2":::

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br`   
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
        Ordinal numbers

    :::column-end:::
    :::column span="2":::

        Ordinal numbers.
      
    :::column-end:::
    :::column span="2":::

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br`   
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
        Age

    :::column-end:::
    :::column span="2":::

        Ages.
      
    :::column-end:::
    :::column span="2":::

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br`   
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
        Currency

    :::column-end:::
    :::column span="2":::

        Currencies
      
    :::column-end:::
    :::column span="2":::

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br`   
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
        Dimensions

    :::column-end:::
    :::column span="2":::

        Dimensions and measurements.
      
    :::column-end:::
    :::column span="2":::

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br`   
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
        Temperature

    :::column-end:::
    :::column span="2":::

        Temperatures.
      
    :::column-end:::
    :::column span="2":::

      `en`, `es`, `fr`, `de`, `it`, `zh-hans`, `pt-pt`, `pt-br`   
      
   :::column-end:::
:::row-end:::

::: zone-end

::: zone pivot="Preview API"

---
title: Entity types recognized by new Named Entity Recognition model in Azure Cognitive Service for Language
titleSuffix: Azure Cognitive Services
description: Learn about the entities the NER feature can recognize from unstructured text.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: jboback
ms.custom: language-service-ner, ignite-fall-2021
---

# Supported Named Entity Recognition (NER) entity categories 

Use this article to find the entity types and the additional tags that can be returned by [Named Entity Recognition](../how-to-call.md) (NER). NER runs a predictive model to identify and categorize named entities from an input document.

## Type: Address

Specific street-level mentions of locations: house/building numbers, streets, avenues, highways, intersections referenced by name.

## Type: Numeric

Numeric values.

This entity type could be tagged by the following entity tags:
#### Age

**Description:** Ages

#### Currency

**Description:** Currencies

#### Number

**Description:** Numbers without a unit

#### NumberRange

**Description:** Range of numbers

#### Percentage

**Description:** Percentages

#### Ordinal

**Description:** Ordinal Numbers

#### Temperature

**Description:** Temperatures

#### Dimension

**Description:** Dimensions or measurements

This entity tag also supports tagging the entity type with the following tags:

:::row:::

    :::column span="":::

        **Entity tag**

        Length

    :::column-end:::

    :::column span="2":::

        **Details**

        Length of an object

    :::column-end:::

:::row-end:::

:::row:::

    :::column span="":::

        **Entity tag**

        Weight

    :::column-end:::

    :::column span="2":::

        **Details**

        Weight of an object

    :::column-end:::

:::row-end:::

:::row:::

    :::column span="":::

        **Entity tag**

        Height

    :::column-end:::

    :::column span="2":::

        **Details**

        Height of an object

    :::column-end:::

:::row-end:::

:::row:::

    :::column span="":::

        **Entity tag**

        Speed

    :::column-end:::

    :::column span="2":::

        **Details**

        Speed of an object

    :::column-end:::

:::row-end:::

:::row:::

    :::column span="":::

        **Entity tag**

        Area

    :::column-end:::

    :::column span="2":::

        **Details**

        Area of an object

    :::column-end:::

:::row-end:::

:::row:::

    :::column span="":::

        **Entity tag**

        Volume

    :::column-end:::

    :::column span="2":::

        **Details**

        Volume of an object

    :::column-end:::

:::row-end:::

:::row:::

    :::column span="":::

        **Entity tag**

        Information

    :::column-end:::

    :::column span="2":::

        **Details**

        Unit of measure for digital information

    :::column-end:::

:::row-end:::

## Type: Temporal

Dates and times of day

This entity type could be tagged by the following entity tags:
#### Date

**Description:** Calendar dates

#### Time

**Description:** Times of day

#### DateTime

**Description:** Calendar dates with time

#### DateRange

**Description:** Date range

#### TimeRange

**Description:** Time range

#### DateTimeRange

**Description:** Date Time range

#### Duration

**Description:** Durations

#### SetTemporal

**Description:** Set, repeated times

## Type: Event

Events with a timed period

This entity type could be tagged by the following entity tags:
#### SocialEvent

**Description:** Social events

#### CulturalEvent

**Description:** Cultural events

#### NaturalEvent

**Description:** Natural events

## Type: Location

Particular point or place in physical space

This entity type could be tagged by the following entity tags:
#### GPE

**Description:** GeoPolitialEntity

This entity tag also supports tagging the entity type with the following tags:

:::row:::

    :::column span="":::

        **Entity tag**

        City

    :::column-end:::

    :::column span="2":::

        **Details**
        
        Cities

    :::column-end:::

:::row-end:::

:::row:::

    :::column span="":::

        **Entity tag**

        State

    :::column-end:::

    :::column span="2":::

        **Details**
        
        States

    :::column-end:::

:::row-end:::

:::row:::

    :::column span="":::

        **Entity tag**

        CountryRegion

    :::column-end:::

    :::column span="2":::

        **Details**
        
        Countries/Regions.

    :::column-end:::

:::row-end:::

:::row:::

    :::column span="":::

        **Entity tag**

        Continent

    :::column-end:::

    :::column span="2":::

        **Details**
        
        Continents

    :::column-end:::

:::row-end:::

#### Structural

**Description:** Manmade structures

This entity tag also supports tagging the entity type with the following tags:

:::row:::

    :::column span="":::

        **Entity tag**

        Airport

    :::column-end:::

    :::column span="2":::

        **Details**

        Airports

    :::column-end:::

:::row-end:::

#### Geological

**Description:** Geographic and natural features

This entity tag also supports tagging the entity type with the following tags:

:::row:::

    :::column span="":::

        **Entity tag**

        River

    :::column-end:::

    :::column span="2":::

        **Details**

        Rivers

    :::column-end:::

:::row-end:::


:::row:::

    :::column span="":::

        **Entity tag**

        Ocean

    :::column-end:::

    :::column span="2":::

        **Details**

        Oceans

    :::column-end:::

:::row-end:::


:::row:::

    :::column span="":::

        **Entity tag**

        Desert

    :::column-end:::

    :::column span="2":::

        **Details**

        Deserts
    
    :::column-end:::

:::row-end:::

## Type: Organization

Corporations, agencies, and other groups of people defined by some established organizational structure

This entity type could be tagged by the following entity tags:
#### MedicalOrganization

**Description:** Medical companies and groups

#### StockExchange

**Description:** Stock exchange groups

#### SportsOrganization

**Description:** Sports-related organizations

## Type: Person

Names of individuals

## Type: PersonType

Human roles classified by group membership

## Type: Email

Email addresses

## Type: URL

URLs to websites

## Type: IP

Network IP addresses

## Type: PhoneNumber

Phone numbers

## Type: Product

Commercial, consumable objects

This entity type could be tagged by the following entity tags:
#### ComputingProduct

**Description:** Computing products

## Type: Skill

Capabilities, skills, or expertise

::: zone-end

::: zone pivot="Generally Available to Preview API Mappings"
| Type           | Tags                                   |
|----------------|----------------------------------------|
| Date           | Temporal, Date                         |
| DateRange      | Temporal, DateRange                    |
| DateTime       | Temporal, DateTime                     |
| DateTimeRange  | Temporal, DateTimeRange                |
| Duration       | Temporal, Duration                     |
| SetTemporal    | Temporal, SetTemporal                  |
| Time           | Temporal, Time                         |
| TimeRange      | Temporal, TimeRange                    |
| City           | GPE, Location, City                    |
| State          | GPE, Location, State                   |
| CountryRegion  | GPE, Location, CountryRegion           |
| Continent      | GPE, Location, Continent               |
| GPE            | Location, GPE                          |
| Location       | Location                               |
| Airport        | Structural, Location                   |
| Structural     | Location, Structural                   |
| Geological     | Location, Geological                   |
| Age            | Numeric, Age                           |
| Currency       | Numeric, Currency                      |
| Number         | Numeric, Number                        |
| NumberRange    | Numeric, NumberRange                   |
| Percentage     | Numeric, Percentage                    |
| Ordinal        | Numeric, Ordinal                       |
| Temperature    | Numeric, Dimension, Temperature         |
| Speed          | Numeric, Dimension, Speed               |
| Weight         | Numeric, Dimension, Weight              |
| Height         | Numeric, Dimension, Height              |
| Length         | Numeric, Dimension, Length              |
| Volume         | Numeric, Dimension, Volume              |
| Area           | Numeric, Dimension, Area                |
| Information    | Numeric, Dimension, Information         |
| Address        | Address                                |
| Person         | Person                                 |
| PersonType     | PersonType                             |
| Organization   | Organization                           |
| Product        | Product                                |
| ComputingProduct | Product, ComputingProduct             |
| IP             | IP                                     |
| Email          | Email                                  |
| URL            | URL                                    |
| Skill          | Skill                                  |
| Event          | Event                                  |
| CulturalEvent  | Event, CulturalEvent                   |
| SportsEvent    | Event, SportsEvent                     |
| NaturalEvent   | Event, NaturalEvent                    |

::: zone-end



## Next steps

* [NER overview](../overview.md)
