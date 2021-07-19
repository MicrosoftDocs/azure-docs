---
title: Deprecated cognitive skills
titleSuffix: Azure Cognitive Search
description: This page contains a list of cognitive skills that are considered deprecated and will not be supported in the near future in Azure Cognitive Search skillsets.

manager: nitinme
author: luiscabrer
ms.author: luisca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---

# Deprecated cognitive skills in Azure Cognitive Search

This document describes cognitive skills that are considered deprecated. Use the following guide for the contents:

* Skill Name: The name of the skill that will be deprecated, it maps to the @odata.type attribute.
* Last available api version: The last version of the Azure Cognitive Search public API through which skillsets containing the corresponding deprecated skill can be created/updated.
* End of support: The last day after which the corresponding skill is considered unsupported. Previously created skillsets should still continue to function, but users are recommended to migrate away from a deprecated skill.
* Recommendations: Migration path forward to use a supported skill. Users are advised to follow the recommendations to continue to receive support.

## Microsoft.Skills.Text.EntityRecognitionSkill

### Last available api version

2020-06-30-Preview

### End of support

August 29, 2024

### Recommendations 

Use [Microsoft.Skills.Text.V3.EntityRecognitionSkill](cognitive-search-skill-entity-recognition-v3.md) instead. It provides most of the functionality of the EntityRecognitionSkill at a higher quality. It also has richer information in its complex output fields.

To migrate to the [Entity Recognition Skill V3](cognitive-search-skill-entity-recognition-v3.md), you will have to perform one or more of the following changes to your skill definition. You can update the skill definition using the [Update Skillset API](/rest/api/searchservice/update-skillset).

1. *(Required)* Change the `@odata.type` from `"#Microsoft.Skills.Text.EntityRecognitionSkill"` to `"#Microsoft.Skills.Text.V3.EntityRecognitionSkill"`.

2. *(Optional)* If you are making use of the `entities` output to link entities to well know entities, this feature is now a new skill, the [Microsoft.Skills.Text.V3.EntityLinkingSkill](cognitive-search-skill-entity-linking-v3.md). Add the entity linking skill to your skillset to generate the linked entities.

3. *(Optional)* If you making use of the `namedEntities` output, there are a few minor changes to the property names.
    1. `value` is renamed to `text`
    2. `confidence` is renamed to `confidenceScore`

If you need to generate the exact same property names, you will need to add a [shaper skill](cognitive-search-skill-shaper.md) to reshape the output with the required names. For example, this shaper renames the properties to their old values.
```json
{
  "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
  "name": "NamedEntitiesShaper",
  "description": "NamedEntitiesShaper",
  "context": "/document/namedEntitiesv3",
  "inputs": [
    {
      "name": "old_format",
      "sourceContext": "/document/namedEntitiesv3/*",
      "inputs": [
        {
          "name": "value",
          "source": "/document/namedEntitiesv3/*/text"
        },
        {
          "name": "offset",
          "source": "/document/namedEntitiesv3/*/offset"
        },
        {
          "name": "category",
          "source": "/document/namedEntitiesv3/*/category"
        },
        {
          "name": "confidence",
          "source": "/document/namedEntitiesv3/*/confidenceScore"
        }
      ]
    }
  ],
  "outputs": [
    {
      "name": "output",
      "targetName": "old_named_entities"
    }
  ]
}
```

    _Sample Migration Definitions_

    * Simple migration

        _(Before) EntityRecognition skill definition_
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
        _(After) EntityRecognition skill definition_

```json
        {
            "@odata.type": "#Microsoft.Skills.Text.V3.EntityRecognitionSkill",
            "name": "EntityRecognitionV3",
            "description": null,
            "context": "/document",
            "categories": [
                "Person"
            ],
            "defaultLanguageCode": "en",
            "minimumPrecision": 0.5,
            "modelVersion": null,
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
            "name": "entities",
            "targetName": "entities"
        }
        ]
    }
```

        _(After) EntityRecognition skill definition_
```json
    {
    "@odata.type": "#Microsoft.Skills.Text.EntityRecognitionSkill",
    "name": "#1",
    "description": null,
    "context": "/document/content",
    "categories": [
        "Person",
        "Organization",
        "Location",
    ],
    "defaultLanguageCode": "en",
    "minimumPrecision": null,
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
        "name": "organizations",
        "targetName": "organizations"
        },
        {
        "name": "locations",
        "targetName": "locations"
        }
    ]
    },
    {
    "@odata.type": "#Microsoft.Skills.Text.V3.EntityLinkingSkill",
    "name": "EntityLinkingV3",
    "description": null,
    "context": "/document",
    "defaultLanguageCode": "en",
    "minimumPrecision": 0.5,
    "modelVersion": null,
    "inputs": [
        {
        "name": "text",
        "source": "/document/content"
        },
        {
        "name": "languageCode",
        "source": "/document/language"
        }
    ],
    "outputs": [
        {
        "name": "entities",
        "targetName": "entities"
        }
    ]
    }
```

## MMicrosoft.Skills.Text.SentimentSkill

### Last available api version

2020-06-30-Preview

### End of support

August 29, 2024

### Recommendations 

Use [Microsoft.Skills.Text.V3.SentimentSkill](cognitive-search-skill-sentiment-v3.md) instead. It provides an improved model and includes the option to add opinion mining or aspect based sentiment. As the skill is significantly more complex, the outputs are alos very different.

To migrate to the [SentimentSkill V3](cognitive-search-skill-sentiment-v3.md), you will have to perform one or more of the following changes to your skill definition. You can update the skill definition using the [Update Skillset API](/rest/api/searchservice/update-skillset).

> [!NOTE]
> The skill outputs for the Sentiment Skill V3 is not compatible with the index definition based on the SentimentSkill. You will have to make changes to the index definiton, skillset and indexer output field mappings to replace the sentiment skill with current version.

1. *(Required)* Change the `@odata.type` from `"#Microsoft.Skills.Text.SentimentSkill"` to `"#Microsoft.Skills.Text.V3.SentimentSkill"`.

2. *(Required)* The Sentiment Skill V3 provides a `positive`, `neutral` and `negative` score for th overall text and the same scores for each sentence in the overall text. You will need to update the index definition to accept the three double values in place of a single score.

3. *(Optional)* If you do want to add the opinion mining capability, set the `includeOpinionMining` parameter to true.  You can then map the outputs from the sentences containing the aspect based sentiment.

    _Sample Migration Definitions_

    * Simple migration

        _(Before) Sentiment skill definition_
```json
        {
            "@odata.type": "#Microsoft.Skills.Text.SentimentSkill",
            "name": "Sentiment",
            "description": "Sentiment",
            "context": "/document",
            "defaultLanguageCode": "en",
            "inputs": [
                {
                "name": "text",
                "source": "/document/content"
                },
                {
                "name": "languageCode",
                "source": "/document/language"
                }
            ],
            "outputs": [
                {
                "name": "score",
                "targetName": "score"
                }
            ]
        }
        ```
        _(After) Sentiment skill V3 definition_
    ```json
        {
            "@odata.type": "#Microsoft.Skills.Text.V3.SentimentSkill",
            "name": "SentimentV3",
            "description": null,
            "context": "/document",
            "defaultLanguageCode": "en",
            "modelVersion": null,
            "includeOpinionMining": false,
            "inputs": [
                {
                "name": "text",
                "source": "/document/content"
                },
                {
                "name": "languageCode",
                "source": "/document/languageCode"
                }
            ],
            "outputs": [
                {
                "name": "sentiment",
                "targetName": "sentimentv3"
                },
                {
                "name": "confidenceScores",
                "targetName": "confidenceScores"
                }
            ]
        }
```
    
    * Slightly complicated migration

        _(Before) Sentiment skill definition_
```json
        {
            "@odata.type": "#Microsoft.Skills.Text.SentimentSkill",
            "name": "Sentiment",
            "description": "Sentiment",
            "context": "/document",
            "defaultLanguageCode": "en",
            "inputs": [
                {
                "name": "text",
                "source": "/document/content"
                },
                {
                "name": "languageCode",
                "source": "/document/language"
                }
            ],
            "outputs": [
                {
                "name": "score",
                "targetName": "score"
                }
            ]
        }
```
        _(After) Sentiment skill V3 definition_
```json
        {
  "@odata.type": "#Microsoft.Skills.Text.V3.SentimentSkill",
  "name": "SentimentV3",
  "description": null,
  "context": "/document",
  "defaultLanguageCode": "en",
  "modelVersion": null,
  "includeOpinionMining": true,
  "inputs": [
    {
      "name": "text",
      "source": "/document/content"
    },
    {
      "name": "languageCode",
      "source": "/document/languageCode"
    }
  ],
  "outputs": [
    {
      "name": "sentiment",
      "targetName": "sentimentv3"
    },
    {
      "name": "confidenceScores",
      "targetName": "confidenceScores"
    },
    {
      "name": "sentences",
      "targetName": "sentences"
    }
  ]
}
```
> [!NOTE]
> If you need any additional help updating your enrichment pipeline to use the latest version of the sentiment skill, please contact us directly.   

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Entity Recognition Skill (V3)](cognitive-search-skill-entity-recognition-v3.md)
+ [Sentiment Skill (V3)](cognitive-search-skill-sentiment-v3.md)