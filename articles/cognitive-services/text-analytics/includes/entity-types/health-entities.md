---
title: Named entities for healthcare
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include 
ms.date: 03/11/2021
ms.author: aahi
---

[Text Analytics for health](../../how-tos/text-analytics-for-health.md) processes and extracts insights from unstructured medical data. The service detects and surfaces medical concepts, assigns assertions to concepts, infers semantic relations between concepts and links them to common medical ontologies.

Text Analytics for health detects medical concepts in the following categories. Only English text is supported in this preview and only a single model-version is available.

| Category  | Description  |
|---------|---------|
| [ANATOMY](#anatomy) | concepts that capture information about body and anatomic systems, sites, locations, or regions. |
 | [DEMOGRAPHICS](#demographics) | concepts that capture information about gender and age. |
 | [EXAMINATION](#examinations) | concepts that capture information about diagnostic procedures and tests. |
 | [GENERAL ATTRIBUTES](#general-attributes) | concepts that provide more information about other concepts from the above categories. |
 | [GENOMICS](#genomics) | concepts that capture information about genes and variants. |
 | [HEALTHCARE](#healthcare) | concepts that capture information about administrative events, care environments, and healthcare professions. |
 | [MEDICAL CONDITION](#medical-condition) | concepts that capture information about diagnoses, symptoms, or signs. |
 | [MEDICATION](#medication) | concepts that capture information about medication including medication names, classes, dosage, and route of administration. |
 | [SOCIAL](#social) | concepts that capture information about medically relevant social aspects such as family relation. |
 | [TREATMENT](#treatment) | concepts that capture information about therapeutic procedures. |

You will find more information and examples below.

## Anatomy

### Entities

**BODY_STRUCTURE** - Body systems, anatomic locations or regions, and body sites. For example, arm, knee, abdomen, nose, liver, head, respiratory system, lymphocytes.

:::image type="content" source="../../media/ta-for-health/anatomy-entities-body-structure.png" alt-text="An example of the body structure entity.":::


:::image type="content" source="../../media/ta-for-health/anatomy-entities-body-structure-2.png" alt-text="An expanded example of the body structure entity.":::

## Demographics

### Entities

**AGE** - All age terms and phrases, including ones for patients, family members, and others. For example, 40-year-old, 51 yo, 3 months old, adult, infant, elderly, young, minor, middle-aged.

:::image type="content" source="../../media/ta-for-health/age-entity.png" alt-text="An example of an age entity.":::

:::image type="content" source="../../media/ta-for-health/age-entity-2.png" alt-text="Another example of an age entity.":::


**GENDER** - Terms that disclose the gender of the subject. For example, male, female, woman, gentleman, lady.

:::image type="content" source="../../media/ta-for-health/gender-entity.png" alt-text="An example of a gender entity.":::

## Examinations

### Entities

**EXAMINATION_NAME** – Diagnostic procedures and tests, including vital signs and body measurements. For example, MRI, ECG, HIV test, hemoglobin, platelets count, scale systems such as *Bristol stool scale*.

:::image type="content" source="../../media/ta-for-health/exam-name-entities.png" alt-text="An example of an exam entity.":::

:::image type="content" source="../../media/ta-for-health/exam-name-entities-2.png" alt-text="Another example of an examination name entity.":::

## General attributes

### Entities

**DATE** - Full date relating to a medical condition, examination, treatment, medication, or administrative event.

**DIRECTION** – Directional terms that may relate to a body structure, medical condition, examination, or treatment, such as: left, lateral, upper, posterior.

**FREQUENCY** - Describes how often a medical condition, examination, treatment, or medication occurred, occurs, or should occur.

**MEASUREMENT_VALUE** – The value related to an examination or a medical condition measurement.

**MEASUREMENT_UNIT** – The unit of measurement related to an examination or a medical condition measurement.

**RELATIONAL_OPERATOR** - Phrases that express the quantitative relation between an entity and some additional information.

**TIME** - Temporal terms relating to the beginning and/or length (duration) of a medical condition, examination, treatment, medication, or administrative event. 

## Genomics

### Entities

**GENE_OR_PROTEIN** – All mentions of names and symbols of human genes as well as chromosomes and parts of chromosomes and proteins. For example, MTRR, F2.

:::image type="content" source="../../media/ta-for-health/genomics-entities.png" alt-text="An example of a gene entity.":::

**VARIANT** – All mentions of gene variations and mutations. For example, `c.524C>T`, `(MTRR):r.1462_1557del96`
  
## Healthcare

### Entities
  
**ADMINISTRATIVE_EVENT** – Events that relate to the healthcare system but of an administrative/semi-administrative nature. For example, registration, admission, trial, study entry, transfer, discharge, hospitalization, hospital stay. 

:::image type="content" source="../../media/ta-for-health/healthcare-event-entity.png" alt-text="An example of a healthcare event entity.":::

**CARE_ENVIRONMENT** – An environment or location where patients are given care. For example, emergency room, physician’s office, cardio unit, hospice, hospital.

:::image type="content" source="../../media/ta-for-health/healthcare-environment-entity.png" alt-text="This screenshot shows an example of a healthcare environment entity.":::

**HEALTHCARE_PROFESSION** – A healthcare practitioner licensed or non-licensed. For example, dentist, pathologist, neurologist, radiologist, pharmacist, nutritionist, physical therapist, chiropractor.

:::image type="content" source="../../media/ta-for-health/healthcare-profession-entity.png" alt-text="This screenshot shows another example of a healthcare environment entity.":::

:::image type="content" source="../../media/ta-for-health/healthcare-profession-entity-2.png" alt-text="Another example of a healthcare environment entity.":::

## Medical condition

### Entities

**DIAGNOSIS** – Disease, syndrome, poisoning. For example, breast cancer, Alzheimer’s, HTN, CHF, spinal cord injury.

:::image type="content" source="../../media/ta-for-health/medical-condition-entity.png" alt-text="An example of a medical condition entity.":::

:::image type="content" source="../../media/ta-for-health/medical-condition-entity-2.png" alt-text="Another example of a medical condition entity.":::

**SYMPTOM_OR_SIGN** – Subjective or objective evidence of disease or other diagnoses. For example, chest pain, headache, dizziness, rash, SOB, abdomen was soft, good bowel sounds, well nourished.

:::image type="content" source="../../media/ta-for-health/medical-condition-symptom-entity.png" alt-text="An example of a medical condition sign or symptom entity.":::

:::image type="content" source="../../media/ta-for-health/medical-condition-symptom-entity-2.png" alt-text="Another example of a medical condition sign or symptom entity.":::

**CONDITION_QUALIFIER** - Qualitative terms that are used to describe a medical condition. All the following subcategories are considered qualifiers:

1.	Time-related expressions: those are terms that describe the time dimension qualitatively, such as sudden, acute, chronic, longstanding. 
2.	Quality expressions:  Those are terms that describe the “nature” of the medical condition, such as burning, sharp.
3.	Severity expressions: severe, mild, a bit, uncontrolled.
4.	Extensivity expressions: local, focal, diffuse.
5.	Radiation expressions: radiates, radiation.
6.	Condition scale: In some cases, a condition is characterized by a scale, which is a finite ordered list of values. For example, Patients with stage III pancreatic cancer.
7.	Condition course: A term that relates to the course or progression of a condition, such as improvement, worsening, resolution, remission. 

:::image type="content" source="../../media/ta-for-health/condition-qualifier-diagnosis.png" alt-text="An example of a condition qualifier attribute and a diagnosis entity.":::

:::image type="content" source="../../media/ta-for-health/condition-qualifier-diagnosis-2.png" alt-text="Another example of a condition qualifier attribute and a diagnosis entity.":::

:::image type="content" source="../../media/ta-for-health/conditional-qualifier-symptom-medication.png" alt-text="An example of a condition qualifier attribute with symptom and medication entities.":::

:::image type="content" source="../../media/ta-for-health/condition-qualifier-diagnosis-3.png" alt-text="This screenshot shows another example of a condition qualifier attribute with a diagnosis entity.":::

:::image type="content" source="../../media/ta-for-health/condition-qualifier-symptom.png" alt-text="This screenshot shows an additional example of a condition qualifier attribute with a diagnosis entity.":::

## Medication

### Entities

**MEDICATION_CLASS** – A set of medications that have a similar mechanism of action, a related mode of action, a similar chemical structure, and/or are used to treat the same disease. For example, ACE inhibitor, opioid, antibiotics, pain relievers.

:::image type="content" source="../../media/ta-for-health/medication-entities-class.png" alt-text="An example of a medication class entity.":::

**MEDICATION_NAME** – Medication mentions, including copyrighted brand names, and non-brand names. For example, Ibuprofen.

:::image type="content" source="../../media/ta-for-health/medication-entities-name.png" alt-text="An example of a medication name entity.":::

**DOSAGE** - Amount of medication ordered. For example, Infuse Sodium Chloride solution *1000 mL*.

:::image type="content" source="../../media/ta-for-health/medication-dosage.png" alt-text="An example of a medication dosage attribute.":::

**MEDICATION_FORM** - The form of the medication. For example, solution, pill, capsule, tablet, patch, gel, paste, foam, spray, drops, cream, syrup.

:::image type="content" source="../../media/ta-for-health/medication-form.png" alt-text="An example of a medication form attribute.":::

**MEDICATION_ROUTE** - The administration method of medication. For example, oral, vaginal, IV, epidural, topical, inhaled.

:::image type="content" source="../../media/ta-for-health/medication-route.png" alt-text="An example of a medication route attribute.":::

## Social

### Entities

**FAMILY_RELATION** – Mentions of family relatives of the subject. For example, father, daughter, siblings, parents.

:::image type="content" source="../../media/ta-for-health/family-relation.png" alt-text="Screenshot shows another example of a treatment time attribute.":::

## Treatment

### Entities

**TREATMENT_NAME** – Therapeutic procedures. For example, knee replacement surgery, bone marrow transplant, TAVI, diet.

:::image type="content" source="../../media/ta-for-health/treatment-entities-name.png" alt-text="An example of a treatment name entity.":::
