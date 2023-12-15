---
title: Preview API overview
titleSuffix: Azure AI services
description: Learn about the NER preview API.
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 06/14/2023
ms.author: jboback
ms.custom: language-service-ner, ignite-fall-2021
---

# Preview API changes

Use this article to get an overview of the new API changes starting from `2023-04-15-preview` version. This API change mainly introduces two new concepts (`entity types` and `entity tags`) replacing the `category` and `subcategory` fields in the current Generally Available API.

## Entity types
Entity types represent the lowest (or finest) granularity at which the entity has been detected and can be considered to be the base class that has been detected.

## Entity tags
Entity tags are used to further identify an entity where a detected entity is tagged by the entity type and additional tags to differentiate the identified entity. The entity tags list could be considered to include categories, subcategories, sub-subcategories, and so on.

## Changes from generally available API to preview API
The changes introduce better flexibility for named entity recognition, including:
* More granular entity recognition through introducing the tags list where an entity could be tagged by more than one entity tag.
* Overlapping entities where entities could be recognized as more than one entity type and if so, this entity would be returned twice. If an entity was recognized to belong to two entity tags under the same entity type, both entity tags are returned in the tags list.
* Filtering entities using entity tags, you can learn more about this by navigating to [this article](../how-to-call.md#select-which-entities-to-be-returned-preview-api-only).
* Metadata Objects which contain additional information about the entity but currently only act as a wrapper for the existing entity resolution feature. You can learn more about this new feature [here](entity-metadata.md).

## Generally available to preview API entity mappings
You can see a comparison between the structure of the entity categories/types in the [Supported Named Entity Recognition (NER) entity categories and entity types article](./named-entity-categories.md). Below is a table describing the mappings between the results you would expect to see from the Generally Available API and the Preview API.

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

