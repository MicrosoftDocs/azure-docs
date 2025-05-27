---
title: Radiology Insight inference information (limited order)
titleSuffix: Azure AI Health Insights
description: This article provides Radiology Insights inference information (limited order).
services: azure-health-insights
author: JanSchietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: overview
ms.date: 12/12/2023
ms.author: JanSchietse
---

# LimitedOrderDiscrepancyInference


[Back to overview of RI Inferences](inferences.md)


Field `kind` is `limitedOrderDiscrepancy`.  
It's created if there's a limited order, meaning that not all body parts and measurements for a corresponding complete order (see [Complete Order Discrepancy inference](complete-order-discrepancy-inference.md)) should be in the text – but all body parts and measurements for the complete order are present in the text.  
Example without token extensions:
```json
{
	"kind": "limitedOrderDiscrepancy",
	"orderType": {
		"extension": [],
		"coding": [
			{
				"code": "76705",
				"system": "Current Procedural Terminology",
				"display": "ULTRASOUND, ABDOMINAL, REAL TIME WITH IMAGE DOCUMENTATION; LIMITED (EG, SINGLE ORGAN, QUADRANT, FOLLOW-UP)"
			}
		]
	},
	"presentBodyParts": [
		{
			"extension": [],
			"coding": [
				{
					"code": "RID58",
					"system": "RADLEX ONTOLOGY",
					"display": "Liver"
				}
			]
		},
		{
			"extension": [],
			"coding": [
				{
					"code": "RID187",
					"system": "RADLEX ONTOLOGY",
					"display": "GALLBLADDER"
				}
			]
		},
		{
			"extension": [],
			"coding": [
				{
					"code": "RID199",
					"system": "RADLEX ONTOLOGY",
					"display": "COMMON BILE DUCT"
				}
			]
		},
		{
			"extension": [],
			"coding": [
				{
					"code": "RID170",
					"system": "RADLEX ONTOLOGY",
					"display": "PANCREAS"
				}
			]
		},
		{
			"extension": [],
			"coding": [
				{
					"code": "RID86",
					"system": "RADLEX ONTOLOGY",
					"display": "SPLEEN"
				}
			]
		},
		{
			"extension": [],
			"coding": [
				{
					"code": "RID29663",
					"system": "RADLEX ONTOLOGY",
					"display": "LEFT KIDNEY"
				}
			]
		},
		{
			"extension": [],
			"coding": [
				{
					"code": "RID29662",
					"system": "RADLEX ONTOLOGY",
					"display": "RIGHT KIDNEY"
				}
			]
		},
		{
			"extension": [],
			"coding": [
				{
					"code": "RID905",
					"system": "RADLEX ONTOLOGY",
					"display": "ABDOMINAL AORTA"
				}
			]
		},
		{
			"extension": [],
			"coding": [
				{
					"code": "RID1178",
					"system": "RADLEX ONTOLOGY",
					"display": "INFERIOR VENA CAVA"
				}
			]
		}
	],
	"presentBodyPartMeasurements": []
}
```
In this example, the order is limited, but the document is complete (it contains all body parts required for a complete order), hence the discrepancy.  
Field `ordertype` contains one Coding, with one of the following CPT codes:  

| Code | Display |
|------------|--------------|
|76705| ULTRASOUND, ABDOMINAL, REAL TIME WITH IMAGE DOCUMENTATION; LIMITED (EG, SINGLE ORGAN, QUADRANT, FOLLOW-UP)
|76857| ULTRASOUND, PELVIC, REAL TIME WITH IMAGE DOCUMENTATION; LIMITED OR FOLLOW-UP
|76775| ULTRASOUND, RETROPERITONEAL (EG, RENAL, AORTA, NODES), REAL TIME WITH IMAGE DOCUMENTATION; LIMITED
|76642| ULTRASOUND BREAST LIMITED

Each of these corresponds to one of the complete orders in [Complete Order Discrepancy inference](complete-order-discrepancy-inference.md). Fields `presentBodyParts` and/or `presentBodyPartsMeasurements` are set, containing body parts (radlex codes) that are present or whose measurements are present. The token extensions refer to body parts or measurements that are present (or words that imply them.)  

See [Complete Order Discrepancy inference](complete-order-discrepancy-inference.md) about complete order discrepancies for when a text is considered complete.

Examples request/response json:

[!INCLUDE [Example input json](../includes/example-inference-limited-order-discrepancy-json-request.md)]

[!INCLUDE [Example output json](../includes/example-inference-limited-order-discrepancy-json-response.md)]