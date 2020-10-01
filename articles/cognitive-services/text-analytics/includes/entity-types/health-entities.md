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

## Text Analytics for health categories, entities and attributes

[Text Analytics for health](../../how-tos/text-analytics-for-health.md) detects medical concepts in the following categories.  (Please note that only English text is supported in this container preview and only a single model-version is provided in each container image.)

  + **ANATOMY** - concepts that capture information about body and anatomic systems, sites, locations or regions.
  + **DEMOGRAPHICS** - concepts that capture information about gender and age.
  + **EXAMINATION** - concepts that capture information about diagnostic procedures and tests.
  + **GENOMICS** - concepts that capture information about genes and variants.
  + **HEALTHCARE** - concepts that capture information about administrative events, care environments and healthcare professions.
  + **MEDICAL CONDITION** - concepts that capture information about diagnoses, symptoms or signs.
  + **MEDICATION** - concepts that capture information about medication including medication names, classes, dosage and route of administration.
  + **SOCIAL** - concepts that capture information about medically relevant social aspects such as family relation.
  + **TREATMENT** - concepts that capture information about therapeutic procedures.
  
Each category may include two concept groups:

1. **Entities** - terms that capture medical concepts such as diagnosis, medication name, or treatment name.  For example, *bronchitis* is a diagnosis and *aspirin* is a medication name.  Mentions in this group may be linked to a UMLS concept ID.
2. **Attributes** - phrases that provide more information about the detected entity, for example, *severe* is a condition qualifier for *bronchitis* or *81 mg* is a dosage for *aspirin*.  Mentions in this category will NOT be linked to a UMLS concept ID.

Additionally, the service recognizes relations between the different concepts including relations between attributes and entities for example, *direction* to *body structure* or *dosage* to *medication name* and relations between entities for example in abbreviation detection.

## ANATOMY
### Entities
  + **BODY_STRUCTURE** - Body systems, anatomic locations or regions, and body sites. For example, arm, knee, abdomen, nose, liver, head, respiratory system, lymphocytes.
> [!div class="mx-imgBorder"]
> ![Anatomy_Entities1](../media/ta-for-health/anatomy_entities_body_str_1.png)

> ![Anatomy_Entities2](../media/ta-for-health/anatomy_entities_body_str_2.png)

### Attributes
  + **DIRECTION** - Directional terms, such as: left, lateral, upper, posterior, that characterizes a body structure.
> [!div class="mx-imgBorder"]
> ![Anatomy_Attributes](../media/ta-for-health/Anatomy_Attributes.png)

### Supported Relations
  + **DIRECTION_OF_BODY_STRUCTURE**

## DEMOGRAPHICS
### Entities
  + **AGE** - All age terms and phrases, including those of a patient, family members, and others. For example, 40-year-old, 51 yo, 3 months old, adult, infant, elderly, young, minor, middle-aged.
> [!div class="mx-imgBorder"]
> ![DEMO_AGE1](../media/ta-for-health/demo_entities_age_1.png)

> ![DEMO_AGE2](../media/ta-for-health/demo_entities_age_2.png)
  + **GENDER** - Terms that disclose the gender of the subject. For example, male, female, woman, gentleman, lady.
> [!div class="mx-imgBorder"]
> ![DEMO_GENDER](../media/ta-for-health/demo_entities_gender.png)
### Attributes
  + **RELATIONAL_OPERATOR** - Phrases that express the relation between a demographic entity and additional information.
> [!div class="mx-imgBorder"]
> ![DEMO_REL_OP](../media/ta-for-health/demo_attr_relation_op.png)

## EXAMINATION
### Entities
  + **EXAMINATION_NAME** – Diagnostic procedures and tests. For example, MRI, ECG, HIV test, hemoglobin, platelets count, scale systems such as *Bristol stool scale*.
> [!div class="mx-imgBorder"]
> ![EXAM_NAME1](../media/ta-for-health/exam_entities_name_1.png)

> ![EXAM_NAME2](../media/ta-for-health/exam_entities_name_2.png)
### Attributes
  + **DIRECTION** – Directional terms that characterizes an examination.
> [!div class="mx-imgBorder"]
> ![EXAM_DIR](../media/ta-for-health/exam_attr_direction.png)  
  + **MEASUREMENT_UNIT** – The unit of the examination. For example, in *hemoglobin > 9.5 g/dL*, the term *g/dL* is the unit for the *hemoglobin* test.
> [!div class="mx-imgBorder"]
> ![EXAM_UNIT](../media/ta-for-health/exam_attr_unit.png)  
  + **MEASUREMENT_VALUE** – The value of the examination. For example, in *hemoglobin > 9.5 g/dL*, the term *9.5* is the value for the *hemoglobin* test.
> [!div class="mx-imgBorder"]
> ![EXAM_VALUE](../media/ta-for-health/exam_attr_value.png)  
  + **RELATIONAL_OPERATOR** – Phrases that express the relation between an examination and additional information. For example, the required measurement value for a target examination.
> [!div class="mx-imgBorder"]
> ![EXAM_RELOPR](../media/ta-for-health/exam_attr_rel_op.png)  
  + **TIME** – Temporal terms relating to the beginning and/or length (duration) of an examination. For example, when the test occurred.
> [!div class="mx-imgBorder"]
> ![EXAM_TIME](../media/ta-for-health/exam_attr_time.png)  

### Supported Relations
  + **DIRECTION_OF_EXAMINATION**
  +	**RELATION_OF_EXAMINATION**
  +	**TIME_OF_EXAMINATION**
  +	**UNIT_OF_EXAMINATION**
  +	**VALUE_OF_EXAMINATION**




