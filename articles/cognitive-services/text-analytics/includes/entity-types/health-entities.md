---
title: Named entities for healthcare
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 07/28/2020
ms.author: aahi
---

## Health entity categories:

The following entity categories are returned by [Text Analytics for health](../../how-tos/text-analytics-for-health.md).  Please note that only English text is supported in this container preview and only a single model-version is provided in each container image.

### Named Entity Recognition

|Category  |Description   |
|----------|--------------|
| AGE | Ages. |
| BODY_STRUCTURE | Parts of the human body including organs and other structures. | 
| CONDITION_QUALIFIER | Condition levels such as *mild*, *extended*, or *diffuse*. | 
| DIAGNOSIS | Medical conditions. For example *hypertension* . | 
| DIRECTION | Directions such as *left* or *anterior*. | 
| DOSAGE | Size or quantity of a medication.  | 
| EXAMINATION_NAME | A method or procedure of examination. | 
| EXAMINATION_RELATION | an association between a measurement unit and an examination.  | 
| EXAMINATION_UNIT | A measurement unit for an examination. | 
| EXAMINATION_VALUE | The value of the examination measurement unit. | 
| FAMILY_RELATION | A familial relationship,  such as *sister*.  | 
| FREQUENCY | Frequencies.   | 
| GENDER | Genders. | 
| GENE | A gene entity such as *TP53*.   | 
| MEDICATION_CLASS | Medication classes. For example *antibiotics*.  | 
| MEDICATION_NAME  | Generic and brand named medications.| 
| ROUTE_OR_MODE  | Method of administering medication. | 
| SYMPTOM_OR_SIGN  | Illness symptoms. | 
| TIME  | Times. For example "8 years" or "2:30AM this morning" |
| TREATMENT_NAME  | Treatment names. | 
| VARIANT  | A genetic variant of the gene entity | 

### Relation extraction

Relation extraction identifies meaningful connections between concepts mentioned in text. For example, a "time of condition" relation is found by associating a condition name with a time. Text Analytics for health can identify the following relations:

* DIRECTION_OF_BODY_STRUCTURE  
* TIME_OF_CONDITION
* QUALIFIER_OF_CONDITION  
* DOSAGE_OF_MEDICATION 
* FORM_OF_MEDICATION  
* ROUTE_OR_MODE_OF_MEDICATION   
* STRENGTH_OF_MEDICATION 
* ADMINISTRATION_RATE_OF_MEDICATION   
* FREQUENCY_OF_MEDICATION 
* TIME_OF_MEDICATION 
* TIME_OF_TREATMENT 
* FREQUENCY_OF_TREATMENT  
* VALUE_OF_EXAMINATION
* UNIT_OF_EXAMINATION 
* RELATION_OF_EXAMINATION 
* TIME_OF_EXAMINATION  
* ABBREVIATION 
