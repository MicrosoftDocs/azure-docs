---
title: Radiology Insight inference information (sex mismatch)
titleSuffix: Azure AI Health Insights
description: This article provides Radiology Insights inference information (sex mismatch).
services: azure-health-insights
author: JanSchietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: overview
ms.date: 12/12/2023
ms.author: JanSchietse
---

# SexMismatchInference


[Back to overview of RI Inferences](inferences.md)


A sex mismatch occurs when the document gives a different gender for the patient than stated in the request. It can be, for example, "patient is a 20-year-old male," or "she has been having leg pain" where "she" refers to the patient. It can also be flagged because of a body part, or medical problem or procedure, that can't occur for the gender stated in the request. For example, "prostate normal" or "last menstrual period was 2 weeks ago."

Example (with token extensions):

```json
{
	"kind": "sexMismatch",
	"extension": [
		{
			"url": "http://hl7.org/fhir/StructureDefinition/derivation-reference",
			"extension": [
				{
					"url": "offset",
					"valueInteger": 149
				},
				{
					"url": "length",
					"valueInteger": 6
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
	],
	"sexIndication": {
		"extension": [
			{
				"url": "http://hl7.org/fhir/StructureDefinition/derivation-reference",
				"extension": [
					{
						"url": "offset",
						"valueInteger": 149
					},
					{
						"url": "length",
						"valueInteger": 6
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
		],
		"coding": [
			{
				"code": "248152002",
				"system": "http://snomed.info/sct",
				"display": "FEMALE (FINDING)"
			}
		]
	}
}
```

The kind is `sexMismatch`. Apart from fields `kind` and `extension`, there's also a field `sexIndication` which contains a CodeableConcept. It contains one coding with a SNOMED concept for either MALE (FINDING) (if the concept refers to a male) or FEMALE (FINDING). In this case, the extension token is "female" while the request gender is male. That is why the mismatch is made with concept FEMALE (FINDING). The inference token extension is repeated for field `sexIndication`.

Examples request/response JSON:

[!INCLUDE [Example input json](../includes/example-inference-sex-mismatch-json-request.md)]

[!INCLUDE [Example output json](../includes/example-inference-sex-mismatch-json-response.md)]