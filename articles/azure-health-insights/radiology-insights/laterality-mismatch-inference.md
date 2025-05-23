---
title: Radiology Insight inference information (laterality)
titleSuffix: Azure AI Health Insights
description: This article provides Radiology Insights inference information (laterality).
services: azure-health-insights
author: JanSchietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: overview
ms.date: 04/04/2025
ms.author: JanSchietse
---

# LateralityMismatchInference


[Back to overview of RI Inferences](inferences.md)


A laterality mismatch is flagged when the order specifies a body part with a laterality (for example, 'x-ray right foot') and the text refers to the opposite laterality (for example, 'left foot is normal'). The mismatch is also flagged when there's a body part with left or right in the finding section, and the same body part occurs with the opposite laterality in the impression section.

There are some restrictions to the code, because in many cases, when a body part is visualized, part of the contralateral body part is visible as well. See the standards for that.

Example (without token extensions):

```json
{
	"kind": "lateralityDiscrepancy",
	"discrepancyType": "orderLateralityMismatch",
	"lateralityIndication": {
		"coding": [
			{
				"code": "7771000",
				"system": "http://snomed.info/sct",
				"display": "LEFT (QUALIFIER VALUE)"
			}
		]
	}
}
```

There are three possible discrepancy types:
-	`orderLateralityMismatch` means that the laterality in the text conflicts with the one in the order.
-	`textLateralityContradiction` means that there's a body part with left or right in the finding section, and the same body part occurs with the opposite laterality in the impression section. This occurs less often than an orderLateralityMismatch.
-	`textLateralityMissing` means there's no mismatch of the other two kinds, but the laterality mentioned in the order never occurs in the text.

The lateralityIndication is:
-	For `orderLateralityMismatch`: the concept in the text that the laterality was flagged for. This is either SNOMED code 24028007 ("RIGHT (QUALIFIER VALUE)") or 7771000 ("LEFT (QUALIFIER VALUE)").
-	For `textLateralityContradiction`: the concept in the impression section that the laterality was flagged for. As for `orderLateralityMismatch`, this is either snomed code 24028007 or 7771000.
-	For `textLateralityMissing`, this isn't filled in.
A mismatch with discrepancy type `textLaterityMissing` has no token extensions. Also, for such a mismatch, if there are several orders, the JSON output doesn't show which order caused the mismatch.



Examples request/response JSON:

[!INCLUDE [Example input json](../includes/example-inference-laterality-discrepancy-json-request.md)]

[!INCLUDE [Example output json](../includes/example-inference-laterality-discrepancy-json-response.md)]

