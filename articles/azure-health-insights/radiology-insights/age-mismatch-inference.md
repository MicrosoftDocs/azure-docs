---
title: Radiology Insight inference information age mismatch
titleSuffix: Azure AI Health Insights
description: This article provides Radiology Insights inference information (age mismatch).
services: azure-health-insights
author: JanSchietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: overview
ms.date: 12/12/2023
ms.author: JanSchietse
---



# AgeMismatchInference

An age mismatch occurs when the patient's age mentioned in the document differs from the age in the request. 

Example of an age mismatch:

```json
{
	"kind": "ageMismatch",
	"extension": [
		{
			"url": "http://hl7.org/fhir/StructureDefinition/derivation-reference",
			"extension": [
				{
					"url": "offset",
					"valueInteger": 137
				},
				{
					"url": "length",
					"valueInteger": 2
				},
				{
					"url": "reference",
					"valueReference": {
						"type": "documentId",
						"reference": "json_testinput1"
					}
				}
			]
		},
		{
			"url": "http://hl7.org/fhir/StructureDefinition/derivation-reference",
			"extension": [
				{
					"url": "offset",
					"valueInteger": 139
				},
				{
					"url": "length",
					"valueInteger": 1
				},
				{
					"url": "reference",
					"valueReference": {
						"type": "documentId",
						"reference": "json_testinput1"
					}
				}
			]
		},
		{
			"url": "http://hl7.org/fhir/StructureDefinition/derivation-reference",
			"extension": [
				{
					"url": "offset",
					"valueInteger": 140
				},
				{
					"url": "length",
					"valueInteger": 4
				},
				{
					"url": "reference",
					"valueReference": {
						"type": "documentId",
						"reference": "json_testinput1"
					}
				}
			]
		},
		{
			"url": "http://hl7.org/fhir/StructureDefinition/derivation-reference",
			"extension": [
				{
					"url": "offset",
					"valueInteger": 144
				},
				{
					"url": "length",
					"valueInteger": 1
				},
				{
					"url": "reference",
					"valueReference": {
						"type": "documentId",
						"reference": "json_testinput1"
					}
				}
			]
		},
		{
			"url": "http://hl7.org/fhir/StructureDefinition/derivation-reference",
			"extension": [
				{
					"url": "offset",
					"valueInteger": 145
				},
				{
					"url": "length",
					"valueInteger": 3
				},
				{
					"url": "reference",
					"valueReference": {
						"type": "documentId",
						"reference": "json_testinput1"
					}
				}
			]
		}
	]
}
```

Apart from the `kind` `ageMismatch` at the beginning, only tokens are provided. In this example, the tokens form the string '20-year-old', which the engine splits into several tokens.

The `kind` field of every inference indicates the type of inference.

An age mismatch is identified if the text age differs by a minimum amount from the age in the request. If the text age is given in years, the difference must be of at least one year.

To keep examples concise, token extensions will be omitted from this point onward.


[Back to overview of RI Inferences](inferences.md)


Examples Request/Response JSON:

[!INCLUDE [Example input json](../includes/example-inference-age-mismatch-json-request.md)]

[!INCLUDE [Example output json](../includes/example-inference-age-mismatch-json-response.md)]

