---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 04/14/2023
ms.author: aahi
---


Use the following **GET** request to query the status/results of the custom entity recognition task. 

```rest
{ENDPOINT}/language/analyze-text/jobs/{JOB-ID}?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{API-VERSION}`     | The version of the API you're calling. The value referenced here is for the latest version released. See [Model lifecycle](../../../concepts/model-lifecycle.md#choose-the-model-version-used-on-your-data) to learn more about other available API versions.  | `2022-05-01` |

#### Headers

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| Your key that provides access to this API.|

### Response Body

The response is a JSON document with the following parameters

```json
{
	"createdDateTime": "2021-05-19T14:32:25.578Z",
	"displayName": "MyJobName",
	"expirationDateTime": "2021-05-19T14:32:25.578Z",
	"jobId": "xxxx-xxxx-xxxxx-xxxxx",
	"lastUpdateDateTime": "2021-05-19T14:32:25.578Z",
	"status": "succeeded",
	"tasks": {
		"completed": 1,
		"failed": 0,
		"inProgress": 0,
		"total": 1,
		"items": [
			{
				"kind": "CustomHealthcareLROResults",
				"taskName": "Custom Text Analytics for Health Test",
				"lastUpdateDateTime": "2020-10-01T15:01:03Z",
				"status": "succeeded",
				"results": {
					"documents": [
						{
							"entities": [
								{
									"entityComponentInformation": [
										{
											"entityComponentKind": "learnedComponent"
										}
									],
									"offset": 0,
									"length": 11,
									"text": "first entity",
									"category": "Entity1",
									"confidenceScore": 0.98
								},
								{
									"entityComponentInformation": [
										{
											"entityComponentKind": "listComponent"
										}
									],
									"offset": 0,
									"length": 11,
									"text": "first entity",
									"category": "Entity1.Dictionary",
									"confidenceScore": 1.0
								},
								{
									"entityComponentInformation": [
										{
											"entityComponentKind": "learnedComponent"
										}
									],
									"offset": 16,
									"length": 9,
									"text": "entity two",
									"category": "Entity2",
									"confidenceScore": 1.0
								},
								{
									"entityComponentInformation": [
										{
											"entityComponentKind": "prebuiltComponent"
										}
									],
									"offset": 37,
									"length": 9,
									"text": "ibuprofen",
									"category": "MedicationName",
									"confidenceScore": 1,
									"assertion": {
										"certainty": "negative"
									},
									"name": "ibuprofen",
									"links": [
										{
											"dataSource": "UMLS",
											"id": "C0020740"
										},
										{
											"dataSource": "AOD",
											"id": "0000019879"
										},
										{
											"dataSource": "ATC",
											"id": "M01AE01"
										},
										{
											"dataSource": "CCPSS",
											"id": "0046165"
										},
										{
											"dataSource": "CHV",
											"id": "0000006519"
										},
										{
											"dataSource": "CSP",
											"id": "2270-2077"
										},
										{
											"dataSource": "DRUGBANK",
											"id": "DB01050"
										},
										{
											"dataSource": "GS",
											"id": "1611"
										},
										{
											"dataSource": "LCH_NW",
											"id": "sh97005926"
										},
										{
											"dataSource": "LNC",
											"id": "LP16165-0"
										},
										{
											"dataSource": "MEDCIN",
											"id": "40458"
										},
										{
											"dataSource": "MMSL",
											"id": "d00015"
										},
										{
											"dataSource": "MSH",
											"id": "D007052"
										},
										{
											"dataSource": "MTHSPL",
											"id": "WK2XYI10QM"
										},
										{
											"dataSource": "NCI",
											"id": "C561"
										},
										{
											"dataSource": "NCI_CTRP",
											"id": "C561"
										},
										{
											"dataSource": "NCI_DCP",
											"id": "00803"
										},
										{
											"dataSource": "NCI_DTP",
											"id": "NSC0256857"
										},
										{
											"dataSource": "NCI_FDA",
											"id": "WK2XYI10QM"
										},
										{
											"dataSource": "NCI_NCI-GLOSS",
											"id": "CDR0000613511"
										},
										{
											"dataSource": "NDDF",
											"id": "002377"
										},
										{
											"dataSource": "PDQ",
											"id": "CDR0000040475"
										},
										{
											"dataSource": "RCD",
											"id": "x02MO"
										},
										{
											"dataSource": "RXNORM",
											"id": "5640"
										},
										{
											"dataSource": "SNM",
											"id": "E-7772"
										},
										{
											"dataSource": "SNMI",
											"id": "C-603C0"
										},
										{
											"dataSource": "SNOMEDCT_US",
											"id": "387207008"
										},
										{
											"dataSource": "USP",
											"id": "m39860"
										},
										{
											"dataSource": "USPMG",
											"id": "MTHU000060"
										},
										{
											"dataSource": "VANDF",
											"id": "4017840"
										}
									]
								},
								{
									"entityComponentInformation": [
										{
											"entityComponentKind": "prebuiltComponent"
										}
									],
									"offset": 30,
									"length": 6,
									"text": "100 mg",
									"category": "Dosage",
									"confidenceScore": 0.98
								}
							],
							"relations": [
								{
									"confidenceScore": 1,
									"relationType": "DosageOfMedication",
									"entities": [
										{
											"ref": "#/documents/0/entities/1",
											"role": "Dosage"
										},
										{
											"ref": "#/documents/0/entities/0",
											"role": "Medication"
										}
									]
								}
							],
							"id": "1",
							"warnings": []
						}
					],
					"errors": [],
					"modelVersion": "2020-04-01"
				}
			}
		]
	}
}

```

|Key|Sample Value|Description|
|--|--|--|
|entities|[]|An array containing all the extracted entities.|
|entityComponentKind|`prebuiltComponent`| A variable that indicates which component returned the specific entity. Possible values: `prebuiltComponent`, `learnedComponent`, `listComponent` |
|offset|`0`| A number denoting the starting point of the extracted entity by indexing over the characters|
|length| `10`| A number denoting the length of the extracted entity in number of characters.|
|text|`first entity`| The text that was extracted for a specific entity.|
|category|`MedicationName`| The name of the entity type or category corresponding to the extracted text.|
|confidenceScore|`0.9`| A number denoting the model's certainty level of the extracted entity ranging from 0 to 1 with higher number denoting higher certainty.|
|assertion|`certainty`| [Assertions](../../../text-analytics-for-health/concepts/assertion-detection.md) associated with the extracted entity. Assertions are only supported for prebuilt [Text Analytics for health entities](../../../text-analytics-for-health/overview.md?tabs=entity-linking#text-analytics-for-health-features).|
|name|`Ibuprofen`| The normalized name for the [entity linking](../../../text-analytics-for-health/overview.md?tabs=entity-linking#text-analytics-for-health-features) associated with the extracted entity. Entity linking is only supported for prebuilt [Text Analytics for health entities](../../../text-analytics-for-health/concepts/health-entity-categories.md).|
|links| [] | An array containing all the results from the [entity linking](../../../text-analytics-for-health/overview.md?tabs=entity-linking#text-analytics-for-health-features) associated with the extracted entity. Entity linking is only supported for prebuilt [Text Analytics for health entities](../../../text-analytics-for-health/concepts/health-entity-categories.md).|
|dataSource| `UMLS` | The reference standard resulting from the [entity linking](../../../text-analytics-for-health/overview.md?tabs=entity-linking#text-analytics-for-health-features) associated with the extracted entity. Entity linking is only supported for prebuilt [Text Analytics for health entities](../../../text-analytics-for-health/concepts/health-entity-categories.md).|
|ID| `C0020740` | The reference code resulting from the [entity linking](../../../text-analytics-for-health/overview.md?tabs=entity-linking#text-analytics-for-health-features) associated with the extracted entity belonging to the extracted data source. Entity linking is only supported for prebuilt [Text Analytics for health entities](../../../text-analytics-for-health/concepts/health-entity-categories.md).|
|relations| [] | Array containing all the extracted relationships. [Relationship extraction](../../../text-analytics-for-health/concepts/relation-extraction.md) is only supported for prebuilt [Text Analytics for health entities](../../../text-analytics-for-health/concepts/health-entity-categories.md).|
|relationType| `DosageOfMedication` | The category of the extracted [relationship](../../../text-analytics-for-health/concepts/relation-extraction.md). Relationship extraction is only supported for prebuilt [Text Analytics for health entities](../../../text-analytics-for-health/concepts/health-entity-categories.md).|
|entities| `"Dosage", "Medication"` | The entities associated with the extracted relationship. Relationship extraction is only supported for prebuilt [Text Analytics for health entities](../../../text-analytics-for-health/concepts/health-entity-categories.md).|
