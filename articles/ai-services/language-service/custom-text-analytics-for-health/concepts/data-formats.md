---
title: Custom Text Analytics for health data formats
titleSuffix: Azure AI services
description: Learn about the data formats accepted by custom text analytics for health.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 04/14/2023
ms.author: aahi
ms.custom: language-service-custom-ta4h
---

# Accepted data formats in custom text analytics for health

Use this article to learn about formatting your data to be imported into custom text analytics for health.

If you are trying to [import your data](../how-to/create-project.md#import-project) into custom Text Analytics for health, it has to follow a specific format. If you don't have data to import, you can [create your project](../how-to/create-project.md) and use the Language Studio to [label your documents](../how-to/label-data.md).

Your Labels file should be in the `json` format below to be used when importing your labels into a project.

```json
{
	"projectFileVersion": "{API-VERSION}",
	"stringIndexType": "Utf16CodeUnit",
	"metadata": {
		"projectName": "{PROJECT-NAME}",
		"projectKind": "CustomHealthcare",
		"description": "Trying out custom Text Analytics for health",
		"language": "{LANGUAGE-CODE}",
		"multilingual": true,
		"storageInputContainerName": "{CONTAINER-NAME}",
		"settings": {}
	},
	"assets": {
		"projectKind": "CustomHealthcare",
		"entities": [
			{
				"category": "Entity1",
				"compositionSetting": "{COMPOSITION-SETTING}",
				"list": {
					"sublists": [
						{
							"listKey": "One",
							"synonyms": [
								{
									"language": "en",
									"values": [
										"EntityNumberOne",
										"FirstEntity"
									]
								}
							]
						}
					]
				}
			},
			{
				"category": "Entity2"
			},
			{
				"category": "MedicationName",
				"list": {
					"sublists": [
						{
							"listKey": "research drugs",
							"synonyms": [
								{
									"language": "en",
									"values": [
										"rdrug a",
										"rdrug b"
									]
								}
							]

						}
					]
				}
				"prebuilts": "MedicationName"
			}
		],
		"documents": [
			{
				"location": "{DOCUMENT-NAME}",
				"language": "{LANGUAGE-CODE}",
				"dataset": "{DATASET}",
				"entities": [
					{
						"regionOffset": 0,
						"regionLength": 500,
						"labels": [
							{
								"category": "Entity1",
								"offset": 25,
								"length": 10
							},
							{
								"category": "Entity2",
								"offset": 120,
								"length": 8
							}
						]
					}
				]
			},
			{
				"location": "{DOCUMENT-NAME}",
				"language": "{LANGUAGE-CODE}",
				"dataset": "{DATASET}",
				"entities": [
					{
						"regionOffset": 0,
						"regionLength": 100,
						"labels": [
							{
								"category": "Entity2",
								"offset": 20,
								"length": 5
							}
						]
					}
				]
			}
		]
	}
}

```

|Key  |Placeholder  |Value  | Example |
|---------|---------|----------|--|
| `multilingual` | `true`| A boolean value that enables you to have documents in multiple languages in your dataset and when your model is deployed you can query the model in any supported language (not necessarily included in your training documents). See [language support](../language-support.md#) to learn more about multilingual support. | `true`|
|`projectName`|`{PROJECT-NAME}`|Project name|`myproject`|
| `storageInputContainerName` |`{CONTAINER-NAME}`|Container name|`mycontainer`|
| `entities` | | Array containing all the entity types you have in the project. These are the entity types that will be extracted from your documents into.|  |
| `category` | | The name of the entity type, which can be user defined for new entity definitions, or predefined for prebuilt entities. For more information, see the entity naming rules below.|  |
|`compositionSetting`|`{COMPOSITION-SETTING}`|Rule that defines how to manage multiple components in your entity. Options are `combineComponents` or `separateComponents`. |`combineComponents`|
| `list` | | Array containing all the sublists you have in the project for a specific entity. Lists can be added to prebuilt entities or new entities with learned components.|  |
|`sublists`|`[]`|Array containing sublists. Each sublist is a key and its associated values.|`[]`|
| `listKey`| `One` | A normalized value for the list of synonyms to map back to in prediction. | `One` |
|`synonyms`|`[]`|Array containing all the synonyms|synonym|
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the synonym in your sublist. If your project is a multilingual project and you want to support your list of synonyms for all the languages in your project, you have to explicitly add your synonyms to each language. See [Language support](../language-support.md) for more information about supported language codes. |`en`|
| `values`| `"EntityNumberone"`, `"FirstEntity"`  | A list of comma separated strings that will be matched exactly for extraction and map to the list key. | `"EntityNumberone"`, `"FirstEntity"` |
| `prebuilts` | `MedicationName` | The name of the prebuilt component populating the prebuilt entity. [Prebuilt entities](../../text-analytics-for-health/concepts/health-entity-categories.md) are automatically loaded into your project by default but you can extend them with list components in your labels file.  | `MedicationName` |
| `documents` | | Array containing all the documents in your project and list of the entities labeled within each document. | [] |
| `location` | `{DOCUMENT-NAME}` |  The location of the documents in the storage container. Since all the documents are in the root of the container this should be the document name.|`doc1.txt`|
| `dataset` | `{DATASET}` |  The test set to which this file goes to when split before training. Learn more about data splitting [here](../how-to/train-model.md#data-splitting). Possible values for this field are `Train` and `Test`.      |`Train`|
| `regionOffset` |  |  The inclusive character position of the start of the text.      |`0`|
| `regionLength` |  |  The length of the bounding box in terms of UTF16 characters. Training only considers the data in this region.      |`500`|
| `category` |  |  The type of entity associated with the span of text specified. | `Entity1`|
| `offset` |  |  The start position for the entity text. | `25`|
| `length` |  |  The length of the entity in terms of UTF16 characters. | `20`|
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the document used in your project. If your project is a multilingual project, choose the language code of the majority of the documents. See [Language support](../language-support.md) for more information about supported language codes. |`en`|

## Entity naming rules

1. [Prebuilt entity names](../../text-analytics-for-health/concepts/health-entity-categories.md) are predefined. They must be populated with a prebuilt component and it must match the entity name.
2. New user defined entities (entities with learned components or labeled text) can't use prebuilt entity names.
3. New user defined entities can't be populated with prebuilt components as prebuilt components must match their associated entities names and have no labeled data assigned to them in the documents array.



## Next steps
* You can import your labeled data into your project directly. Learn how to [import project](../how-to/create-project.md#import-project)
* See the [how-to article](../how-to/label-data.md)  more information about labeling your data. 
* When you're done labeling your data, you can [train your model](../how-to/train-model.md).  
