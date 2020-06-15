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

The following entity categories are returned by [Text Analytics for health](../../how-tos/text-analytics-for-healthcare.md).

### Named Entity Recognition

|Category  |Description   |Notes  |
|---------|---------|---------|---------|
| `AGE` | `tbd` |  | 
| `BODY_STRUCTURE` | `tbd` | |
| `CONDITION_QUALIFIER` | `tbd` | |
| `DIAGNOSIS` | `tbd` | |
| `DIRECTION` | `tbd` | |
| `DOSAGE` | `tbd` | |
| `EXAMINATION_NAME` | `tbd` | |
| `EXAMINATION_RELATION` | `tbd` | |
| `EXAMINATION_UNIT` | `tbd` | |
| `EXAMINATION_VALUE` | `tbd` | |
| `FAMILY_RELATION` | `tbd` | |
| `FREQUENCY` | `tbd` | |
| `GENDER` | `tbd` | |
| `GENE` | `tbd` | |
| `MEDICATION_CLASS` | `tbd` | |
| `MEDICATION_NAME`  | `tbd` | |
| `ROUTE_OR_MODE`  | `tbd` | |
| `SYMPTOM_OR_SIGN`  | `tbd` | |
| `TIME`  | `tbd` | |
| `TREATMENT_NAME`  | `tbd` | |
| `VARIANT`  | `tbd` | |

### Relation extraction

|Category  |Description |Starting model version  |Notes  |
|---------|---------|---------|---------|
|  `DIRECTION_OF_BODY_STRUCTURE` | | | |
|  `TIME_OF_CONDITION` | | | |
|  `QUALIFIER_OF_CONDITION` | | | |
|  `DOSAGE_OF_MEDICATION` | | | |
|  `FORM_OF_MEDICATION` | | | |
|  `ROUTE_OR_MODE_OF_MEDICATION` | | | |
|  `STRENGTH_OF_MEDICATION` | | | |
|  `ADMINISTRATION_RATE_OF_MEDICATION` | | | |
|  `FREQUENCY_OF_MEDICATION` | | | |
|  `TIME_OF_MEDICATION` | | | |
|  `TIME_OF_TREATMENT` | | | |
|  `FREQUENCY_OF_TREATMENT` | | | |
|  `VALUE_OF_EXAMINATION` | | | |
|  `UNIT_OF_EXAMINATION` | | | |
|  `RELATION_OF_EXAMINATION` | | | |
|  `TIME_OF_EXAMINATION` | | | |
|  `ABBREVIATION` | | | |

### entity linking


|Category  |Description |Starting model version  |Notes  |
|---------|---------|---------|---------|
|  `CPT` | | | |
|  `ICD-10-CM` | | | |
|  `ICPC2` | | | |
|  `MeSH` | | | |
|  `RxNorm` | | | |
|  `SNOMEDCT_US` | | | |