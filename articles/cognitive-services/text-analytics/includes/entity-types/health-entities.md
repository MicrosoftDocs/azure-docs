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

## GENOMICS
### Entities
  + **GENE** – All mentions of genes. For example, MTRR, F2.
> [!div class="mx-imgBorder"]
> ![GENOMICS_GENE](../media/ta-for-health/genomics_entities.png)
  + **VARIANT** – All mentions of gene variations. For example, c.524C>T, (MTRR):r.1462_1557del96
  
## HEALTHCARE
### Entities
  + **ADMINISTRATIVE_EVENT** – Events that relate to the healthcare system but of an administrative/semi-administrative nature. For example, registration, admission, trial, study entry, transfer, discharge, hospitalization, hospital stay. 
> [!div class="mx-imgBorder"]
> ![HC_EVENT](../media/ta-for-health/healthcare_entities_1.png)
  + **CARE_ENVIRONMENT** – An environment or location where patients are given care. For example, emergency room, physician’s office, cardio unit, hospice, hospital.
> [!div class="mx-imgBorder"]
> ![HC_ENV](../media/ta-for-health/healthcare_entities_2.png)
  + **HEALTHCARE_PROFESSION** – A healthcare practitioner licensed or non-licensed. For example, dentist, pathologist, neurologist, radiologist, pharmacist, nutritionist, physical therapist, chiropractor.
> [!div class="mx-imgBorder"]
> ![HC_PROFESS1](../media/ta-for-health/healthcare_entities_3.png)

> ![HC_PROFESS2](../media/ta-for-health/healthcare_entities_4.png)

## MEDICAL CONDITION
### Entities
  + **DIAGNOSIS** – Disease, syndrome, poisoning. For example, breast cancer, Alzheimer’s, HTN, CHF, spinal cord injury.
> [!div class="mx-imgBorder"]
> ![MEDCON_DIAG1](../media/ta-for-health/medcond_entities_diag_1.png)

> ![MEDCON_DIAG2](../media/ta-for-health/medcond_entities_diag_2.png)
  + **SYMPTOM_OR_SIGN** – Subjective or objective evidence of disease or other diagnoses. For example, chest pain, headache, dizziness, rash, SOB, abdomen was soft, good bowel sounds, well nourished.
> [!div class="mx-imgBorder"]
> ![MEDCON_SYM1](../media/ta-for-health/medcond_entities_sym_1.png)

> ![MEDCON_SYM2](../media/ta-for-health/medcond_entities_sym_2.png)
### Attributes
  + **CONDITION_QUALIFIER** - Quality terms that are used to describe a medical condition. All the following sub-categories are considered qualifiers:
    1.	Time-related expressions: those are terms that describe the time dimension qualitatively, such as sudden, acute, chronic, longstanding. 
    2.	Quality expressions:  Those are terms that describe the “nature” of the medical condition, such as burning, sharp.
    3.	Severity expressions: severe, mild, a bit, uncontrolled.
    4.	Extensivity expressions: local, focal, diffuse.
    5.	Radiation expressions: radiates, radiation.
    6.	Condition scale: In some cases, a condition is characterized by a scale, which is a finite ordered list of values. For example, Patients with stage III pancreatic cancer.
    7.	Condition course: A term that relates to the course or progression of a condition, such as improvement, worsening, resolution, remission. 
> [!div class="mx-imgBorder"]
> ![MEDCON_CONDQUAL1](../media/ta-for-health/medcond_attr_condqual_1.png)

> ![MEDCON_CONDQUAL2](../media/ta-for-health/medcond_attr_condqual_2.png)

> ![MEDCON_CONDQUAL3](../media/ta-for-health/medcond_attr_condqual_3.png)

> ![MEDCON_CONDQUAL4](../media/ta-for-health/medcond_attr_condqual_4.png)

> ![MEDCON_CONDQUAL5](../media/ta-for-health/medcond_attr_condqual_5.png)
  + **DIRECTION** - Directional terms that characterizes a body medical condition.
> [!div class="mx-imgBorder"]
> ![MEDCON_DIRECT](../media/ta-for-health/medcond_attr_directions.png)
  + **FREQUENCY** - How often a medical condition occurred, occurs, or should occur.
> [!div class="mx-imgBorder"]
> ![MEDCON_FREQ1](../media/ta-for-health/medcond_attr_freq_1.png)

> ![MEDCON_FREQ2](../media/ta-for-health/medcond_attr_freq_2.png)
  + **MEASUREMENT_UNIT** - The unit that characterizes a medical condition. For example, in *1.5x2x1 cm tumor*, the term *cm* is the measurement unit for the *tumor*. 
> [!div class="mx-imgBorder"]
> ![MEDCON_UNIT](../media/ta-for-health/medcond_attr_measure_unit.png)
  + **MEASUREMENT_VALUE** - The value that characterizes a medical condition. For example, in *1.5x2x1 cm tumor*, the term *1.5x2x1* is the measurement value for the *tumor*. 
> [!div class="mx-imgBorder"]
> ![MEDCON_VALUE](../media/ta-for-health/medcond_attr_measure_value.png)
  + **RELATIONAL_OPERATOR** - Phrases that express the relation between medical condition additional information. For example, time or measurement value. 
> [!div class="mx-imgBorder"]
> ![MEDCON_REL_OPR](../media/ta-for-health/medcond_attr_rel_opr.png)
  + **TIME** - Temporal terms relating to the beginning and/or length (duration) of a medical condition. For example, when a symptom started (onset) or when a disease occurred.
> [!div class="mx-imgBorder"]
> ![MEDCON_TIME](../media/ta-for-health/medcond_attr_time.png)

### Supported Relations
  + **DIRECTION_OF_CONDITION**
  +	**QUALIFIER_OF_CONDITION**
  +	**TIME_OF_CONDITION**
  +	**UNIT_OF_CONDITION**
  +	**VALUE_OF_CONDITION**
