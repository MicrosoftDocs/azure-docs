---
title: Named entities for healthcare
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 06/15/2020
ms.author: aahi
---

## Health entity categories:

The following entity categories are returned by [Text Analytics for Health](../../how-tos/text-analytics-for-healthcare.md).  Please note that only ENGLISH text is supported in this container preview and only a single model-version is provided in each container image.

### Named Entity Recognition

|Category  |Description   |Notes  |
|----------|--------------|-------|
| AGE | Age |  | 
| BODY_STRUCTURE | Part of the human body such _upper arm_, _kidneys_, _heart tissue_, etc.| |
| CONDITION_QUALIFIER | Condition level such as _mild_, _extended_, _diffuse_, etc. | |
| DIAGNOSIS | Medical condition such as _hypertension_, _asthma_, _CAD_, etc. | |
| DIRECTION | For example _Right_, _left_, _anterior_, _posterior_, _bilateral_, etc. | |
| DOSAGE | Size or quantity of a medication  | |
| EXAMINATION_NAME | A method or procedure of examination such as _biopsy_, _histopathology_, _CBC lab test_, etc. | |
| EXAMINATION_RELATION | An entity linking a measurement unit to an examination  | |
| EXAMINATION_UNIT | A measurement unit for an examination | |
| EXAMINATION_VALUE | The value of the examination measurement unit | |
| FAMILY_RELATION | An entity representing a family relationship for example _sister_, _spouse_, _aunt_, etc.  | |
| FREQUENCY | An entity describing the   | |
| GENDER |  | |
| GENE | A gene entity for example _TP53_, _EGFR_, _ESR1_, etc.   | |
| MEDICATION_CLASS |  | |
| MEDICATION_NAME  |  | |
| ROUTE_OR_MODE  | Method of administering medication for example _inhaled_, _IV_, _oral_, etc. | |
| SYMPTOM_OR_SIGN  |  | |
| TIME  | Time for example _"8 years"_ or _"2:30AM this morning"_| |
| TREATMENT_NAME  |  | |
| VARIANT  | A genetic variant of the gene entity | |

### Relation extraction

|Category  |Description  |Notes  |
|----------|-------------|-------|
|  DIRECTION_OF_BODY_STRUCTURE | | | 
|  TIME_OF_CONDITION | | | 
|  QUALIFIER_OF_CONDITION | | | 
|  DOSAGE_OF_MEDICATION | | | 
|  FORM_OF_MEDICATION | | | 
|  ROUTE_OR_MODE_OF_MEDICATION | | | 
|  STRENGTH_OF_MEDICATION | | | 
|  ADMINISTRATION_RATE_OF_MEDICATION | | | 
|  FREQUENCY_OF_MEDICATION | | | 
|  TIME_OF_MEDICATION | | | 
|  TIME_OF_TREATMENT | | | 
|  FREQUENCY_OF_TREATMENT | | | 
|  VALUE_OF_EXAMINATION | | | 
|  UNIT_OF_EXAMINATION | | | 
|  RELATION_OF_EXAMINATION | | | 
|  TIME_OF_EXAMINATION | | | 
|  ABBREVIATION | | | 
