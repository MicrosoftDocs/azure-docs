---
title: Deprecated cognitive skills - Azure Search
description: This page contains a list of cognitive search skills that are considered deprecated and will not be supported in the near future.
services: search
manager: pablocas
author: luiscabrer

ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: luisca
ms.custom: seodec2018
---

# Deprecated cognitive search skills

This document describes cognitive skills that are considered deprecated. Use the following guide for the contents:

* Skill Name: The name of the skill that will be deprecated, it maps to the @odata.type attribute.
* Last available api version: The last version of the Azure search public API through which skillsets containing the corresponding deprecated skill can be created/updated.
* End of support: The last day after which the corresponding skill is considered unsupported. Previously created skillsets should still continue to function, but users are recommended to migrate away from a deprecated skill.
* Recommendations: Migration path forward to use a supported skill. Users are advised to follow the recommendations to continue to receive support.

## Microsoft.Skills.Text.NamedEntityRecognitionSkill

### Last available api version

2019-05-06-Preview

### End of support

February 15, 2019

### Recommendations 

Use [Microsoft.Skills.Text.EntityRecognitionSkill](cognitive-search-skill-entity-recognition.md) instead. It provides most of the functionality of the NamedEntityRecognitionSkill at a higher quality. It also has richer information in its complex output fields.

To migrate to the [Entity Recognition Skill](cognitive-search-skill-entity-recognition.md), you will have to perform one or more of the following changes to your skill definition. You can update the skill definition using the [Update Skillset API](https://docs.microsoft.com/rest/api/searchservice/update-skillset).

> [!NOTE]
> Currently, confidence score as a concept is not supported. The `minimumPrecision` parameter exists on the `EntityRecognitionSkill` for future use and for backwards compatibility.

1. *(Required)* Change the `@odata.type` from `"#Microsoft.Skills.Text.NamedEntityRecognitionSkill"` to `"#Microsoft.Skills.Text.EntityRecognitionSkill"`.

2. *(Optional)* If you are making use of the `entities` output, use the `namedEntities` complex collection output from the `EntityRecognitionSkill` instead. You can use the `targetName` in the skill definition to map it to an annotation called `entities`.

3. *(Optional)* If you do not explicitly specify the `categories`, the `EntityRecognitionSkill` can return different type of categories besides those that were supported by the `NamedEntityRecognitionSkill`. If this behavior is undesirable, make sure to explicitly set the `categories` parameter to `["Person", "Location", "Organization"]`.

    _Sample Migration Definitions_

    * Simple migration

        _(Before) NamedEntityRecognition skill definition_
        ```json
        {
            "@odata.type": "#Microsoft.Skills.Text.NamedEntityRecognitionSkill",
            "categories": [ "Person"],
            "defaultLanguageCode": "en",
            "inputs": [
            {
                "name": "text",
                "source": "/document/content"
            }
            ],
            "outputs": [
            {
                "name": "persons",
                "targetName": "people"
            }
            ]
        }
        ```
        _(After) EntityRecognition skill definition_
        ```json
        {
            "@odata.type": "#Microsoft.Skills.Text.EntityRecognitionSkill",
            "categories": [ "Person"],
            "defaultLanguageCode": "en",
            "inputs": [
            {
                "name": "text",
                "source": "/document/content"
            }
            ],
            "outputs": [
            {
                "name": "persons",
                "targetName": "people"
            }
            ]
        }
        ```
    
    * Slightly complicated migration

        _(Before) NamedEntityRecognition skill definition_
        ```json
        {
            "@odata.type": "#Microsoft.Skills.Text.NamedEntityRecognitionSkill",
            "defaultLanguageCode": "en",
            "minimumPrecision": 0.1,
            "inputs": [
            {
                "name": "text",
                "source": "/document/content"
            }
            ],
            "outputs": [
            {
                "name": "persons",
                "targetName": "people"
            },
            {
                "name": "entities"
            }
            ]
        }
        ```
        _(After) EntityRecognition skill definition_
        ```json
        {
            "@odata.type": "#Microsoft.Skills.Text.EntityRecognitionSkill",
            "categories": [ "Person", "Location", "Organization" ],
            "defaultLanguageCode": "en",
            "minimumPrecision": 0.1,
            "inputs": [
            {
                "name": "text",
                "source": "/document/content"
            }
            ],
            "outputs": [
            {
                "name": "persons",
                "targetName": "people"
            },
            {
                "name": "namedEntities",
                "targetName": "entities"
            }
            ]
        }
        ```

## See also

+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Entity Recognition Skill](cognitive-search-skill-entity-recognition.md)
