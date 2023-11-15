---
title: Deprecated Cognitive Skills
titleSuffix: Azure AI Search
description: This page contains a list of cognitive skills that are considered deprecated and won't be supported moving forward.
author: LiamCavanagh
ms.author: liamca
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: reference
ms.date: 08/17/2022
---

# Deprecated Cognitive Skills in Azure AI Search

This document describes cognitive skills that are considered deprecated (retired). Use the following guide for the contents:

* Skill Name: The name of the skill that will be deprecated; it maps to the @odata.type attribute.
* Last available api version: The last version of the Azure AI Search public API through which skillsets containing the corresponding deprecated skill can be created/updated. Indexers with attached skillsets with these skills will continue to run even in future API versions until the "End of support" date, at which point they start failing.
* End of support: The day after which the corresponding skill is considered unsupported and stops working. Previously created skillsets should still continue to function, but users are recommended to migrate away from a deprecated skill.
* Recommendations: Migration path forward to use a supported skill. Users are advised to follow the recommendations to continue to receive support.

If you're using the [Microsoft.Skills.Text.EntityRecognitionSkill](#microsoftskillstextentityrecognitionskill) (Entity Recognition cognitive skill (v2)), this article helps you upgrade your skillset to use the [Microsoft.Skills.Text.V3.EntityRecognitionSkill](cognitive-search-skill-entity-recognition-v3.md) which is generally available and introduces new features. 

If you're using the [Microsoft.Skills.Text.SentimentSkill](#microsoftskillstextsentimentskill) (Sentiment cognitive skill (v2)), this article helps you upgrade your skillset to use the [Microsoft.Skills.Text.V3.SentimentSkill](cognitive-search-skill-sentiment-v3.md) which is generally available and introduces new features. 

If you're using the [Microsoft.Skills.Text.NamedEntityRecognitionSkill](#microsoftskillstextnamedentityrecognitionskill) (Named Entity Recognition cognitive skill (v2)), this article helps you upgrade your skillset to use the [Microsoft.Skills.Text.V3.EntityRecognitionSkill](cognitive-search-skill-entity-recognition-v3.md) which is generally available and introduces new features.

## Microsoft.Skills.Text.EntityRecognitionSkill

### Last available api version

2021-04-30-Preview

### End of support

August 31, 2024

### Recommendations 

Use [Microsoft.Skills.Text.V3.EntityRecognitionSkill](cognitive-search-skill-entity-recognition-v3.md) instead. It provides most of the functionality of the EntityRecognitionSkill at a higher quality. It also has richer information in its complex output fields.

To migrate to the [Microsoft.Skills.Text.V3.EntityRecognitionSkill](cognitive-search-skill-entity-recognition-v3.md), make one or more of the following changes to your skill definition. You can update the skill definition using the [Update Skillset API](/rest/api/searchservice/update-skillset).

1. *(Required)* Change the `@odata.type` from `"#Microsoft.Skills.Text.EntityRecognitionSkill"` to `"#Microsoft.Skills.Text.V3.EntityRecognitionSkill"`.

2. *(Optional)* The `includeTypelessEntities` parameter is no longer supported as the new skill only returns entities with known types, so if your previous skill definition referenced it, it should now be removed.

3. *(Optional)* If you're making use of the `namedEntities` output, there are a few minor changes to the property names.
    1. `value` is renamed to `text`
    2. `confidence` is renamed to `confidenceScore`

    If you need to generate the exact same property names, add a [ShaperSkill](cognitive-search-skill-shaper.md) to reshape the output with the required names. For example, this ShaperSkill renames the properties to their old values.

    ```json
    {
        "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
        "name": "NamedEntitiesShaper",
        "description": "NamedEntitiesShaper",
        "context": "/document/namedEntitiesV3",
        "inputs": [
            {
                "name": "old_format",
                "sourceContext": "/document/namedEntitiesV3/*",
                "inputs": [
                    {
                        "name": "value",
                        "source": "/document/namedEntitiesV3/*/text"
                    },
                    {
                        "name": "offset",
                        "source": "/document/namedEntitiesV3/*/offset"
                    },
                    {
                        "name": "category",
                        "source": "/document/namedEntitiesV3/*/category"
                    },
                    {
                        "name": "confidence",
                        "source": "/document/namedEntitiesV3/*/confidenceScore"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "name": "output",
                "targetName": "namedEntities"
            }
        ]
    }
    ```

4. *(Optional)* If you're making use of the `entities` output to link entities to well-known entities, this feature is now a new skill, the [Microsoft.Skills.Text.V3.EntityLinkingSkill](cognitive-search-skill-entity-linking-v3.md). Add the entity linking skill to your skillset to generate the linked entities. There are also a few minor changes to the property names of the `entities` output between the `EntityRecognitionSkill` and the new `EntityLinkingSkill`.
    1. `wikipediaId` is renamed to `id`
    2. `wikipediaLanguage` is renamed to `language`
    3. `wikipediaUrl` is renamed to `url`
    4. The `type` and `subtype` properties are no longer returned.

    If you need to generate the exact same property names, add a [ShaperSkill](cognitive-search-skill-shaper.md) to reshape the output with the required names. For example, this ShaperSkill renames the properties to their old values.

    ```json
    {
        "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
        "name": "LinkedEntitiesShaper",
        "description": "LinkedEntitiesShaper",
        "context": "/document/linkedEntitiesV3",
        "inputs": [
            {
                "name": "old_format",
                "sourceContext": "/document/linkedEntitiesV3/*",
                "inputs": [
                    {
                        "name": "name",
                        "source": "/document/linkedEntitiesV3/*/name"
                    },
                    {
                        "name": "wikipediaId",
                        "source": "/document/linkedEntitiesV3/*/id"
                    },
                    {
                        "name": "wikipediaLanguage",
                        "source": "/document/linkedEntitiesV3/*/language"
                    },
                    {
                        "name": "wikipediaUrl",
                        "source": "/document/linkedEntitiesV3/*/url"
                    },
                    {
                        "name": "bingId",
                        "source": "/document/linkedEntitiesV3/*/bingId"
                    },
                    {
                        "name": "matches",
                        "source": "/document/linkedEntitiesV3/*/matches"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "name": "output",
                "targetName": "entities"
            }
        ]
    }
    ```

5. *(Optional)* If you don't explicitly specify the `categories`, the `EntityRecognitionSkill V3` can return different type of categories besides those that were supported by the `EntityRecognitionSkill`. If this behavior is undesirable, make sure to explicitly set the `categories` parameter to `["Person", "Location", "Organization", "Quantity", "Datetime", "URL", "Email"]`.

    _Sample Migration Definitions_

    * Simple migration

        _(Before) EntityRecognition skill definition_

        ```json
        {   
            "@odata.type": "#Microsoft.Skills.Text.EntityRecognitionSkill",
            "categories": [ "Person" ],
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

        _(After) EntityRecognition skill V3 definition_

        ```json
        {
            "@odata.type": "#Microsoft.Skills.Text.V3.EntityRecognitionSkill",
            "categories": [ "Person" ],
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
    
    * Complicated migration

        _(Before) EntityRecognition skill definition_
    
        ```json
        {
            "@odata.type": "#Microsoft.Skills.Text.EntityRecognitionSkill",
            "categories": [ "Person", "Location", "Organization" ],
            "defaultLanguageCode": "en",
            "minimumPrecision": 0.1,
            "includeTypelessEntities": true,
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
                    "targetName": "namedEntities"
                },
                {
                    "name": "entities",
                    "targetName": "entities"
                }
            ]
        }
        ```
    
        _(After) EntityRecognition skill V3 definition_
    
        ```json
        {
            "@odata.type": "#Microsoft.Skills.Text.V3.EntityRecognitionSkill",
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
                    "targetName": "namedEntitiesV3"
                }
            ]
        },
        {
            "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
            "name": "NamedEntitiesShaper",
            "description": "NamedEntitiesShaper",
            "context": "/document/namedEntitiesV3",
            "inputs": [
                {
                    "name": "old_format",
                    "sourceContext": "/document/namedEntitiesV3/*",
                    "inputs": [
                        {
                            "name": "value",
                            "source": "/document/namedEntitiesV3/*/text"
                        },
                        {
                            "name": "offset",
                            "source": "/document/namedEntitiesV3/*/offset"
                        },
                        {
                            "name": "category",
                            "source": "/document/namedEntitiesV3/*/category"
                        },
                        {
                            "name": "confidence",
                            "source": "/document/namedEntitiesV3/*/confidenceScore"
                        }
                    ]
                }
            ],
            "outputs": [
                {
                    "name": "output",
                    "targetName": "namedEntities"
                }
            ]
        },
        {
            "@odata.type": "#Microsoft.Skills.Text.V3.EntityLinkingSkill",
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
                    "name": "entities",
                    "targetName": "linkedEntities"
                }
            ]
        },
        {
            "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
            "name": "LinkedEntitiesShaper",
            "description": "LinkedEntitiesShaper",
            "context": "/document/linkedEntitiesV3",
            "inputs": [
                {
                    "name": "old_format",
                    "sourceContext": "/document/linkedEntitiesV3/*",
                    "inputs": [
                        {
                            "name": "name",
                            "source": "/document/linkedEntitiesV3/*/name"
                        },
                        {
                            "name": "wikipediaId",
                            "source": "/document/linkedEntitiesV3/*/id"
                        },
                        {
                            "name": "wikipediaLanguage",
                            "source": "/document/linkedEntitiesV3/*/language"
                        },
                        {
                            "name": "wikipediaUrl",
                            "source": "/document/linkedEntitiesV3/*/url"
                        },
                        {
                            "name": "bingId",
                            "source": "/document/linkedEntitiesV3/*/bingId"
                        },
                        {
                            "name": "matches",
                            "source": "/document/linkedEntitiesV3/*/matches"
                        }
                    ]
                }
            ],
            "outputs": [
                {
                    "name": "output",
                    "targetName": "entities"
                }
            ]
        }
        ```

## Microsoft.Skills.Text.SentimentSkill

### Last available api version

2021-04-30-Preview

### End of support

August 31, 2024

### Recommendations 

Use [Microsoft.Skills.Text.V3.SentimentSkill](cognitive-search-skill-sentiment-v3.md) instead. It provides an improved model and includes the option to add opinion mining or aspect-based sentiment. As the skill is significantly more complex, the outputs are also very different.

To migrate to the [Microsoft.Skills.Text.V3.SentimentSkill](cognitive-search-skill-sentiment-v3.md), make one or more of the following changes to your skill definition. You can update the skill definition using the [Update Skillset API](/rest/api/searchservice/update-skillset).

> [!NOTE]
> The skill outputs for the Sentiment Skill V3 are not compatible with the index definition based on the SentimentSkill. You will have to make changes to the index definition, skillset (later skill inputs and/or knowledge store projections) and indexer output field mappings to replace the sentiment skill with the new version.

1. *(Required)* Change the `@odata.type` from `"#Microsoft.Skills.Text.SentimentSkill"` to `"#Microsoft.Skills.Text.V3.SentimentSkill"`.

2. *(Required)* The Sentiment Skill V3 provides a `positive`, `neutral`, and `negative` score for the overall text and the same scores for each sentence in the overall text, whereas the previous SentimentSkill only provided a single double that ranged from 0.0 (negative) to 1.0 (positive) for the overall text. You will need to update your index definition to accept the three double values in place of a single score, and make sure all of your downstream skill inputs, knowledge store projections, and output field mappings are consistent with the naming changes.

It's recommended to replace the old SentimentSkill with the SentimentSkill V3 entirely, update your downstream skill inputs, knowledge store projections, indexer output field mappings, and index definition to match the new output format, and reset your indexer so that all of your documents have consistent sentiment results going forward.

> [!NOTE]
> If you need any additional help updating your enrichment pipeline to use the latest version of the sentiment skill or if resetting your indexer is not an option for you, please open a [new support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) where we can work with you directly.

## Microsoft.Skills.Text.NamedEntityRecognitionSkill

### Last available api version

2017-11-11-Preview

### End of support

August 31, 2024

### Recommendations 

Use [Microsoft.Skills.Text.V3.EntityRecognitionSkill](cognitive-search-skill-entity-recognition-v3.md) instead. It provides most of the functionality of the NamedEntityRecognitionSkill at a higher quality. It also has richer information in its complex output fields.

To migrate to the [Microsoft.Skills.Text.V3.EntityRecognitionSkill](cognitive-search-skill-entity-recognition-v3.md), make one or more of the following changes to your skill definition. You can update the skill definition using the [Update Skillset API](/rest/api/searchservice/update-skillset).

1. *(Required)* Change the `@odata.type` from `"#Microsoft.Skills.Text.NamedEntityRecognitionSkill"` to `"#Microsoft.Skills.Text.V3.EntityRecognitionSkill"`.

2. *(Optional)* If you're making use of the `entities` output, use the `namedEntities` complex collection output from the `EntityRecognitionSkill V3` instead. There are a few minor changes to the property names of the new `namedEntities` complex output:
    1. `value` is renamed to `text`
    2. `confidence` is renamed to `confidenceScore`
    
    If you need to generate the exact same property names, add a [ShaperSkill](cognitive-search-skill-shaper.md) to reshape the output with the required names. For example, this ShaperSkill renames the properties to their old values.

    ```json
    {
        "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
        "name": "NamedEntitiesShaper",
        "description": "NamedEntitiesShaper",
        "context": "/document/namedEntities",
        "inputs": [
            {
                "name": "old_format",
                "sourceContext": "/document/namedEntities/*",
                "inputs": [
                    {
                        "name": "value",
                        "source": "/document/namedEntities/*/text"
                    },
                    {
                        "name": "offset",
                        "source": "/document/namedEntities/*/offset"
                    },
                    {
                        "name": "category",
                        "source": "/document/namedEntities/*/category"
                    },
                    {
                        "name": "confidence",
                        "source": "/document/namedEntities/*/confidenceScore"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "name": "output",
                "targetName": "entities"
            }
        ]
    }
    ```

3. *(Optional)* If you don't explicitly specify the `categories`, the `EntityRecognitionSkill V3` can return different type of categories besides those that were supported by the `NamedEntityRecognitionSkill`. If this behavior is undesirable, make sure to explicitly set the `categories` parameter to `["Person", "Location", "Organization"]`.

    _Sample Migration Definitions_

    * Simple migration

        _(Before) NamedEntityRecognition skill definition_

        ```json
        {
            "@odata.type": "#Microsoft.Skills.Text.NamedEntityRecognitionSkill",
            "categories": [ "Person" ],
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

        _(After) EntityRecognition skill V3 definition_

        ```json
        {
            "@odata.type": "#Microsoft.Skills.Text.V3.EntityRecognitionSkill",
            "categories": [ "Person" ],
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

        _(After) EntityRecognition skill V3 definition_

        ```json
        {
            "@odata.type": "#Microsoft.Skills.Text.V3.EntityRecognitionSkill",
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
                    "name": "namedEntities"
                }
            ]
        },
        {
            "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
            "name": "NamedEntitiesShaper",
            "description": "NamedEntitiesShaper",
            "context": "/document/namedEntities",
            "inputs": [
                {
                    "name": "old_format",
                    "sourceContext": "/document/namedEntities/*",
                    "inputs": [
                        {
                            "name": "value",
                            "source": "/document/namedEntities/*/text"
                        },
                        {
                            "name": "offset",
                            "source": "/document/namedEntities/*/offset"
                        },
                        {
                            "name": "category",
                            "source": "/document/namedEntities/*/category"
                        },
                        {
                            "name": "confidence",
                            "source": "/document/namedEntities/*/confidenceScore"
                        }
                    ]
                }
            ],
            "outputs": [
                {
                    "name": "output",
                    "targetName": "entities"
                }
            ]
        }
        ```

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Entity Recognition Skill (V3)](cognitive-search-skill-entity-recognition-v3.md)
+ [Sentiment Skill (V3)](cognitive-search-skill-sentiment-v3.md)
