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

## Entity type: Address

Specific street-level mentions of locations: house/building numbers, streets, avenues, highways, intersections referenced by name.

## Entity type: Numeric

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

## Entity type: Temporal

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

## Entity type: Event

Events with a timed period

This entity type could be tagged by the following entity tags:
#### SocialEvent

**Description:** Social events

#### CulturalEvent

**Description:** Cultural events

#### NaturalEvent

**Description:** Natural events

## Entity type: Location

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
        
        Regions in countries.

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

## Entity type: Organization

Corporations, agencies, and other groups of people defined by some established organizational structure

This entity type could be tagged by the following entity tags:
#### MedicalOrganization

**Description:** Medical companies and groups

#### StockExchange

**Description:** Stock exchange groups

#### SportsOrganization

**Description:** Sports-related organizations

## Entity type: Person

Names of individuals

## Entity type: PersonType

Human roles classified by group membership

## Entity type: Email

Email addresses

## Entity type: URL

URLs to websites

## Entity type: IP

Network IP addresses

## Entity type: PhoneNumber

Phone numbers

## Entity type: Product

Commercial, consumable objects

This entity type could be tagged by the following entity tags:
#### ComputingProduct

**Description:** Computing products

## Entity type: Skill

Capabilities, skills, or expertise

## Next steps

* [NER overview](../overview.md)
