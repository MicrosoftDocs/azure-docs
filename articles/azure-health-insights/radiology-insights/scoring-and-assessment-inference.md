---
title: Radiology Insight inference information (scoring)
titleSuffix: Azure AI Health Insights
description: This article provides Radiology Insights inference information (scoring).
services: azure-health-insights
author: JanSchietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: overview
ms.date: 04/04/2025
ms.author: JanSchietse
---

# ScoringAndAssessmentInference

[Back to overview of RI Inferences](inferences.md)


This inference gives the score on a classification category like BIRADS. A BIRADS ("breast imaging reporting and data system") is assigned a score that indicates how suspicious the breast scan is. For example, a document with text "BIRADS 2" has a Scoring and Assessment Inference with category "BIRADS" and singleValue "2".  
- Field "kind" is `ScoringAndAssessment`.  
- The values of field `category` are in [Appendix A](#appendix-a-possible-values-of-field-category)
.  
- Field `categoryDescription` gives, in most cases, the expansion of the category abbreviation, for example for BIRADS it is "ACR BREAST IMAGING REPORTING AND DATA SYSTEM".  
- Field `singleValue` contains the value of the field if there's just one value, for example for "BIRADS 2".  
- Field `rangeValue` contains the minimum and/or maximum value if the value is a range. It's theoretically possible that there's only a minimum or maximum value, for example "BIRADS 4- ".  
The value isn't always (only) numeric, it can contain letters as well, for example "4a".  
Fields `kind`, `category`, and `categoryDescription` are required. Either `singleValue` or at least one field of `rangeValue` is filled.

Example of a scoring and assessment inference, without token extensions:

```json
{
	"kind": "scoringAndAssessment",
	"category": "TI-RADS",
	"categoryDescription": "ACR THYROID IMAGING REPORTING AND DATA SYSTEM",
	"singleValue": "2"
}
```

## Appendix A: possible values of field "category"

- BIRADS
- C-RADS COLONIC FINDINGS
- CAD-RADS
- LI-RADS
- LUNG-RADS
- NI-RADS
- O-RADS
- PI-RADS
- TI-RADS
- C-RADS EXTRACOLONIC FINDINGS
- LIFETIME BREAST CANCER RISK
- ASCVD RISK
- MODIFIED GAIL MODEL RISK
- TYRER CUSICK MODEL RISK
- AGATSTON SCORE
- 10 YEAR CHD RISK
- Z-SCORE
- T-SCORE
- CALCIUM VOLUME SCORE
- US LI-RADS VISUALIZATION SCORE
- US LI-RADS
- CEUS LI-RADS
- TREATMENT RESPONSE LI-RADS
- O-RADS MRI
- CALCIUM MASS SCORE
- RISK OF MALIGNANCY INDEX
- HNPCC MUTATION RISK
- ALBERTA STROKE PROGRAM EARLY CT SCORE
- KELLGREN-LAWRENCE GRADING SCALE
- TONNIS CLASSIFICATION
- CALCIUM SCORE (UNSPECIFIED)

Examples Request/Response JSON:

[!INCLUDE [Example input json](../includes/example-inference-scoring-and-assessment-json-request.md)]

[!INCLUDE [Example output json](../includes/example-inference-scoring-and-assessment-json-response.md)]
