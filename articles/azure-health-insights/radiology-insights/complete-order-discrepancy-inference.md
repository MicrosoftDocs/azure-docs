---
title: Radiology Insight inference information (complete order)
titleSuffix: Azure AI Health Insights
description: This article provides Radiology Insights inference information (complete order).
services: azure-health-insights
author: JanSchietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: overview
ms.date: 12/12/2023
ms.author: JanSchietse
---

# CompleteOrderDiscrepancyInference


[Back to overview of RI Inferences](inferences.md)


The `kind` is `completeOrderDiscrepancy`.   
This inference is created when there's a complete order - meaning that a specific set of body parts must be mentioned in the text, and possibly measurements for some of them - and not all required body parts or their measurements are present in the text.
For example, a document about a complete breast scan must include documentation of the entire breast, including the subareolar region.  

Example without token extensions: 
```json
{
	"kind": "completeOrderDiscrepancy",
	"orderType": {
		"extension": [],
		"coding": [
			{
				"code": "76856",
				"system": "Current Procedural Terminology",
				"display": "ULTRASOUND, PELVIC (NONOBSTETRIC), REAL TIME WITH IMAGE DOCUMENTATION; COMPLETE"
			}
		]
	},
	"missingBodyParts": [],
	"missingBodyPartMeasurements": [
		{
			"extension": [],
			"coding": [
				{
					"code": "RID302",
					"system": "RADLEX ONTOLOGY",
					"display": "UTERUS"
				}
			]
		},
		{
			"extension": [],
			"coding": [
				{
					"code": "RID30958",
					"system": "RADLEX ONTOLOGY",
					"display": "ENDOMETRIUM"
				}
			]
		}
	]
}
```
In this example, a discrepancy is identified because the uterus and the endometrium aren't  mentioned in the text.  
The  `ordertype` field contains one coding with one of the following CPT codes:

| Code | Display |
|------------|--------------|
|76700| ULTRASOUND, ABDOMINAL, REAL TIME WITH IMAGE DOCUMENTATION; COMPLETE|
|76856| ULTRASOUND, PELVIC (NONOBSTETRIC), REAL TIME WITH IMAGE DOCUMENTATION; COMPLETE|
|76770| ULTRASOUND, RETROPERITONEAL (EG, RENAL, AORTA, NODES), REAL TIME WITH IMAGE DOCUMENTATION; COMPLETE|
|76641| ULTRASOUND BREAST COMPLETE|

The `missingBodyParts` and/or `missingBodyPartsMeasurements` fields are populated with body parts (RadLex  codes) that are missing or whose measurements are missing. The token extensions refer to body parts or measurements that are present, or words that imply them.
The following table lists the body parts and measurements that must be present for a document to be considered complete, based on the type of ultrasound. The body parts are listed as RadLex codes, which is how they are in the `missingBodyParts` and `missingBodyPartsMeasurements` fields:


| Code | Display | Required body parts | Required body part measurements|
|--------|--------------|--------------|-----------|
|76700| ULTRASOUND, ABDOMINAL, REAL TIME WITH IMAGE DOCUMENTATION; COMPLETE| liver;<br> gallbladder;<br>common bile duct;<br>pancreas;<br>spleen;<br>left kidney;<br>right kidney;<br>aorta;<br>inferior vena cava
|76856| ULTRASOUND, PELVIC (NONOBSTETRIC), REAL TIME WITH IMAGE DOCUMENTATION; COMPLETE _(for a male patient)_|urinary bladder;<br>prostate;<br>seminal vesicle
|76856| ULTRASOUND, PELVIC (NONOBSTETRIC), REAL TIME WITH IMAGE DOCUMENTATION; COMPLETE _(for a female patient)_|uterus;<br>left ovary;<br>right ovary;<br>endometrium|uterus;<br>left ovary;<br>right ovary;<br>endometrium
|76770| ULTRASOUND, RETROPERITONEAL (EG, RENAL, AORTA, NODES), REAL TIME WITH IMAGE DOCUMENTATION; COMPLETE _(first possibility, see below)_|left kidney;<br>right kidney;<br>abdominal aorta;<br>common iliac artery;<br>inferior vena cava
|76770| ULTRASOUND, RETROPERITONEAL (EG, RENAL, AORTA, NODES), REAL TIME WITH IMAGE DOCUMENTATION; COMPLETE _(second possibility, see below)_|left kidney;<br>right kidney;<br>urinary bladder;<br>_plus a reference to a form of urinary pathology, in the broad sense of the word_
|76641| ULTRASOUND BREAST COMPLETE|breast;<br>subareolar region of breast

As indicated in the table, only code 76856 for a female patient requires measurements.

For code 76770, the text is considered complete if all the body parts of the 'first possibility' are found. Alternatively, the text is considered complete if the body parts of the 'second possibility' are found, but in this case, the text must also include a reference to a urinary pathology.

Examples Request/Response JSON:

[!INCLUDE [Example input json](../includes/example-inference-complete-order-discrepancy-json-request.md)]

[!INCLUDE [Example output json](../includes/example-inference-complete-order-discrepancy-json-response.md)]