---
title: Deprecated cognitive skills (Azure Search) | Microsoft Docs
description: This page contains a list of cognitive search skills that are considered deprecated and will not be supported in the near future.
services: search
manager: pablocas
author: luiscabrer

ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: conceptual
ms.date: 11/27/2018
ms.author: luisca
---

#	 Deprecated Cognitive Seach Skills

This page contains a list of cognitive search skills that are considered deprecated and will not be supported in the near future. Use the following guide for the contents:

* Skill Name: The name of the skill that will be deprecated. This maps to the @odata.type attribute
* Last available api version: This is the last version of the Azure search public api through which skillsets containing the corresponding deprecated skill can be created/updated.
* End of support: The last day after which the corresponding skill is considered unsupported. Previously created skillsets should still continue to function, but users are recommended to migrate away from a deprecated skill.
* Recommendations: For a deprecated skill, we attempt to provide a simple migration path forward to using a supported skill. Users are advised to follow the recommendations as soon as possible to continue to receive support for cognitive search skills.

## Microsoft.Skills.Text.NamedEntityRecognitionSkill
__Last available api version__

2017-11-11-preview

__End of support__

February 15, 2019

__Recommendations__

[Microsoft.Skills.Text.EntityRecognitionSkill](cognitive-search-skill-entity-recognition.md) is the supported skill going forward that will provide most of the functionality of the NamedEntityRecognitionSkill at a higher quality. It also has richer information in its complex output fields which can be leveraged by users if they so choose.

To migrate to the `EntityRecognitionSkill` you will have to perform one or more of the following changes to your skill definition in your skillset. You can make these changes and update the skillset definition using the [Public API](https://docs.microsoft.com/en-us/rest/api/searchservice/update-skillset)

_Note_: Currently, confidence score as a concept is not supported. Once we ensure that the confidence score returned is of high quality, this will be enabled in the near future. Thus, the `minimumPrecision` parameter exists on the `EntityRecognitionSkill` for future use and for backwards compatibility.

1. \[_Required_\] Change the `@odata.type` from `"#Microsoft.Skills.Text.NamedEntityRecognitionSkill"` to `"#Microsoft.Skills.Text.EntityRecognitionSkill"`

2. \[_Optional_\] If you are making use of the `entities` complex collection output, you will need to make use of the `namedEntities` complex collection output from the `EntityRecognitionSkill` and leverage `targetName` to map it to the `entities` output.

3. \[_Optional_\] If you do not explicitly specify the `categories`, note that `EntityRecognitionSkill` can return entities in more categories. If this behavior is undesirable, make sure to explicitly set the `categories` parameter to `["Person", "Location", "Organization"]`

    _Sample Migration Definitions_

    * Simple migration

        _NamedEntityRecognition skill definition_
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
        _EntityRecognition skill definition_
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

        _NamedEntityRecognition skill definition_
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
        _EntityRecognition skill definition_
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
