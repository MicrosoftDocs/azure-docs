---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 04/14/2023
ms.author: aahi
---

Submit a **POST** request using the following URL, headers, and JSON body to import your labels file. Make sure that your labels file follow the [accepted format](../../concepts/data-formats.md).

If a project with the same name already exists, the data of that project is replaced.

```rest
{Endpoint}/language/authoring/analyze-text/projects/{projectName}/:import?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{API-VERSION}`     | The version of the API you are calling. The value referenced here is for the latest version released. See [Model lifecycle](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) to learn more about other available API versions.  | `2022-05-01` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


### Body

Use the following JSON in your request. Replace the placeholder values below with your own values. 

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
| `multilingual` | `true`| A boolean value that enables you to have documents in multiple languages in your dataset and when your model is deployed you can query the model in any supported language (not necessarily included in your training documents). See [language support](../../language-support.md) to learn more about multilingual support. | `true`|
|`projectName`|`{PROJECT-NAME}`|Project name|`myproject`|
| `storageInputContainerName` |`{CONTAINER-NAME}`|Container name|`mycontainer`|
| `entities` | | Array containing all the entity types you have in the project. These are the entity types that will be extracted from your documents into.|  |
| `category` | | The name of the entity type, which can be user defined for new entity definitions, or predefined for prebuilt entities. |  |
|`compositionSetting`|`{COMPOSITION-SETTING}`|Rule that defines how to manage multiple components in your entity. Options are `combineComponents` or `separateComponents`. |`combineComponents`|
| `list` | | Array containing all the sublists you have in the project for a specific entity. Lists can be added to prebuilt entities or new entities with learned components.|  |
|`sublists`|`[]`|Array containing sublists. Each sublist is a key and its associated values.|`[]`|
| `listKey`| `One` | A normalized value for the list of synonyms to map back to in prediction. | `One` |
|`synonyms`|`[]`|Array containing all the synonyms|synonym|
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the synonym in your sublist. If your project is a multilingual project and you want to support your list of synonyms for all the languages in your project, you have to explicitly add your synonyms to each language. See [Language support](../../language-support.md) for more information about supported language codes. |`en`|
| `values`| `"EntityNumberone"`, `"FirstEntity"`  | A list of comma separated strings that will be matched exactly for extraction and map to the list key. | `"EntityNumberone"`, `"FirstEntity"` |
| `prebuilts` | `MedicationName` | The name of the prebuilt component populating the prebuilt entity. [Prebuilt entities](../../../text-analytics-for-health/concepts/health-entity-categories.md) are automatically loaded into your project by default but you can extend them with list components in your labels file.  | `MedicationName` |
| `documents` | | Array containing all the documents in your project and list of the entities labeled within each document. | [] |
| `location` | `{DOCUMENT-NAME}` |  The location of the documents in the storage container. Since all the documents are in the root of the container this should be the document name.|`doc1.txt`|
| `dataset` | `{DATASET}` |  The [test set](../../how-to/train-model.md#data-splitting) to which this file will go to when split before training. Possible values for this field are `Train` and `Test`.      |`Train`|
| `regionOffset` |  |  The inclusive character position of the start of the text.      |`0`|
| `regionLength` |  |  The length of the bounding box in terms of UTF16 characters. Training only considers the data in this region.      |`500`|
| `category` |  |  The type of entity associated with the span of text specified. | `Entity1`|
| `offset` |  |  The start position for the entity text. | `25`|
| `length` |  |  The length of the entity in terms of UTF16 characters. | `20`|
| `language` | `{LANGUAGE-CODE}` |  A string specifying the language code for the document used in your project. If your project is a multilingual project, choose the language code of the majority of the documents. See [Language support](../../language-support.md) for more information about supported language codes. |`en`|

Once you send your API request, you’ll receive a `202` response indicating that the job was submitted correctly. In the response headers, extract the `operation-location` value. It will be formatted like this: 

```rest
{ENDPOINT}/language/authoring/analyze-text/projects/{PROJECT-NAME}/import/jobs/{JOB-ID}?api-version={API-VERSION}
``` 

`{JOB-ID}` is used to identify your request, since this operation is asynchronous. You’ll use this URL to get the import job status.  

Possible error scenarios for this request:

* The selected resource doesn't have [proper permissions](../../how-to/create-project.md#using-a-pre-existing-language-resource) for the storage account.
* The `storageInputContainerName` specified doesn't exist.
* Invalid language code is used, or if the language code type isn't string.
* `multilingual` value is a string and not a boolean.
