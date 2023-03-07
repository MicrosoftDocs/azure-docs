---
title: Entity categories recognized by Text Analytics for health
titleSuffix: Azure Cognitive Services
description: Learn about categories recognized by Text Analytics for health
services: cognitive-services
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: jboback
ms.custom: language-service-health, ignite-fall-2021
---

# Supported Text Analytics for health entity categories

Text Analytics for health processes and extracts insights from unstructured medical data. The service detects and surfaces medical concepts, assigns assertions to concepts, infers semantic relations between concepts and links them to common medical ontologies.

Text Analytics for health detects medical concepts in the following categories.

## Anatomy

### Entities

**BODY_STRUCTURE** - Body systems, anatomic locations or regions, and body sites. For example, arm, knee, abdomen, nose, liver, head, respiratory system, lymphocytes.

:::image type="content" source="../media/entities/anatomy-entities-body-structure.png" alt-text="An example of the body structure entity." lightbox="../media/entities/anatomy-entities-body-structure.png":::

## Demographics

### Entities

**AGE** - All age terms and phrases, including ones for patients, family members, and others. For example, 40-year-old, 51 yo, 3 months old, adult, infant, elderly, young, minor, middle-aged.

**GENDER** - Terms that disclose the gender of the subject. For example, male, female, woman, gentleman, lady.

:::image type="content" source="../media/entities/age-entity.png" alt-text="An example of an age entity." lightbox="../media/entities/age-entity.png":::

## Examinations

### Entities

**EXAMINATION_NAME** – Diagnostic procedures and tests, including vital signs and body measurements. For example, MRI, ECG, HIV test, hemoglobin, platelets count, scale systems such as *Bristol stool scale*.

:::image type="content" source="../media/entities/exam-name-entities.png" alt-text="An example of an exam entity." lightbox="../media/entities/exam-name-entities.png":::

## External Influence

### Entities

**ALLERGEN** – an antigen triggering an allergic reaction. For example, cats, peanuts.

:::image type="content" source="../media/entities/external-influence-allergen.png" alt-text="An example of an external influence entity." lightbox="../media/entities/external-influence-allergen.png":::


## General attributes

### Entities

**COURSE** - Description of a change in another entity over time, such as condition progression (e.g., improvement, worsening, resolution, remission), a course of treatment or medication (e.g., increase in medication dosage). 

:::image type="content" source="../media/entities/course-entity.png" alt-text="An example of a course entity." lightbox="../media/entities/course-entity.png":::

**DATE** - Full date relating to a medical condition, examination, treatment, medication, or administrative event.

:::image type="content" source="../media/entities/date-entity.png" alt-text="An example of a date entity." lightbox="../media/entities/date-entity.png":::

**DIRECTION** – Directional terms that may relate to a body structure, medical condition, examination, or treatment, such as: left, lateral, upper, posterior.

:::image type="content" source="../media/entities/direction-entity.png" alt-text="An example of a direction entity." lightbox="../media/entities/direction-entity.png":::

**FREQUENCY** - Describes how often a medical condition, examination, treatment, or medication occurred, occurs, or should occur.

:::image type="content" source="../media/entities/medication-form.png" alt-text="An example of a medication frequency attribute." lightbox="../media/entities/medication-form.png":::


**TIME** - Temporal terms relating to the beginning and/or length (duration) of a medical condition, examination, treatment, medication, or administrative event. 

**MEASUREMENT_UNIT** – The unit of measurement related to an examination or a medical condition measurement.

**MEASUREMENT_VALUE** – The value related to an examination or a medical condition measurement.

:::image type="content" source="../media/entities/measurement-value-entity.png" alt-text="An example of a measurement value entity." lightbox="../media/entities/measurement-value-entity.png":::

**RELATIONAL_OPERATOR** - Phrases that express the quantitative relation between an entity and some additional information.

:::image type="content" source="../media/entities/measurement-unit.png" alt-text="An example of a measurement unit entity." lightbox="../media/entities/measurement-unit.png"::: 

## Genomics

### Entities

**VARIANT** - All mentions of gene variations and mutations. For example, `c.524C>T`, `(MTRR):r.1462_1557del96`
  
**GENE_OR_PROTEIN** – All mentions of names and symbols of human genes as well as chromosomes and parts of chromosomes and proteins. For example, MTRR, F2.

**MUTATION_TYPE** - Description of the mutation, including its type, effect, and location. For example, trisomy, germline mutation, loss of function.

:::image type="content" source="../media/entities/genomics-entities.png" alt-text="An example of a gene entity." lightbox="../media/entities/genomics-entities.png":::

**EXPRESSION** - Gene expression level. For example, positive for-, negative for-, overexpressed, detected in high/low levels, elevated.

:::image type="content" source="../media/entities/expression.png" alt-text="An example of a gene expression entity." lightbox="../media/entities/expression.png":::


## Healthcare

### Entities
  
**ADMINISTRATIVE_EVENT** – Events that relate to the healthcare system but of an administrative/semi-administrative nature. For example, registration, admission, trial, study entry, transfer, discharge, hospitalization, hospital stay. 

**CARE_ENVIRONMENT** – An environment or location where patients are given care. For example, emergency room, physician’s office, cardio unit, hospice, hospital.

:::image type="content" source="../media/entities/healthcare-event-entity.png" alt-text="An example of a healthcare event entity." lightbox="../media/entities/healthcare-event-entity.png" :::

**HEALTHCARE_PROFESSION** – A healthcare practitioner licensed or non-licensed. For example, dentist, pathologist, neurologist, radiologist, pharmacist, nutritionist, physical therapist, chiropractor.

:::image type="content" source="../media/entities/healthcare-profession-entity-2.png" alt-text="Another example of a healthcare environment entity." lightbox="../media/entities/healthcare-profession-entity-2.png":::

## Medical condition

### Entities

**DIAGNOSIS** – Disease, syndrome, poisoning. For example, breast cancer, Alzheimer’s, HTN, CHF, spinal cord injury.

**SYMPTOM_OR_SIGN** – Subjective or objective evidence of disease or other diagnoses. For example, chest pain, headache, dizziness, rash, SOB, abdomen was soft, good bowel sounds, well nourished.

:::image type="content" source="../media/entities/medical-condition-entity.png" alt-text="An example of a medical condition entity." lightbox="../media/entities/medical-condition-entity.png":::

**CONDITION_QUALIFIER** - Qualitative terms that are used to describe a medical condition. All the following subcategories are considered qualifiers:

* Time-related expressions: those are terms that describe the time dimension qualitatively, such as sudden, acute, chronic, longstanding. 
* Quality expressions:  Those are terms that describe the “nature” of the medical condition, such as burning, sharp.
* Severity expressions: severe, mild, a bit, uncontrolled.
* Extensivity expressions: local, focal, diffuse.

:::image type="content" source="../media/entities/condition-qualifier-diagnosis-3.png" alt-text="This screenshot shows another example of a condition qualifier attribute with a diagnosis entity." lightbox="../media/entities/condition-qualifier-diagnosis-3.png" :::

**CONDITION_SCALE** – Qualitative terms that characterize the condition by a scale, which is a finite ordered list of values.

:::image type="content" source="../media/entities/condition-scale-example.png" alt-text="Another example of a condition qualifier attribute and a diagnosis entity." lightbox="../media/entities/condition-scale-example.png":::

## Medication

### Entities

**MEDICATION_CLASS** – A set of medications that have a similar mechanism of action, a related mode of action, a similar chemical structure, and/or are used to treat the same disease. For example, ACE inhibitor, opioid, antibiotics, pain relievers.

:::image type="content" source="../media/entities/medication-entities-class.png" alt-text="An example of a medication class entity." lightbox="../media/entities/medication-entities-class.png":::

**MEDICATION_NAME** – Medication mentions, including copyrighted brand names, and non-brand names. For example, Ibuprofen.

**DOSAGE** - Amount of medication ordered. For example, Infuse Sodium Chloride solution *1000 mL*.

**MEDICATION_FORM** - The form of the medication. For example, solution, pill, capsule, tablet, patch, gel, paste, foam, spray, drops, cream, syrup.

:::image type="content" source="../media/entities/medication-dosage.png" alt-text="An example of a medication dosage attribute." lightbox="../media/entities/medication-dosage.png":::

**MEDICATION_ROUTE** - The administration method of medication. For example, oral, topical, inhaled.

:::image type="content" source="../media/entities/medication-form.png" alt-text="An example of a medication form attribute." lightbox="../media/entities/medication-form.png"::: 

## Social

### Entities

**FAMILY_RELATION** – Mentions of family relatives of the subject. For example, father, daughter, siblings, parents.

:::image type="content" source="../media/entities/family-relation.png" alt-text="Example of a family relation entity." lightbox="../media/entities/family-relation.png":::

## Treatment

### Entities

**TREATMENT_NAME** – Therapeutic procedures. For example, knee replacement surgery, bone marrow transplant, TAVI, diet.

:::image type="content" source="../media/entities/treatment-entities-name.png" alt-text="An example of a treatment name entity." lightbox="../media/entities/treatment-entities-name.png":::


## Supported Assertions

Assertion modifiers are divided into three categories, each one focuses on a different aspect.
Each category contains a set of mutually exclusive values. Only one value per category is assigned to each entity. The most common value for each category is the Default value. The service’s output response contains only assertion modifiers that are different from the default value.

### Certainty  

provides information regarding the presence (present vs. absent) of the concept and how certain the text is regarding its presence (definite vs. possible).

**Positive** (Default): the concept exists or happened.

**Negative**: the concept does not exist now or never happened.

:::image type="content" source="../media/entities/negative-entity.png" alt-text="An example of a negative entity." lightbox="../media/entities/negative-entity.png":::

**Positive_Possible**: the concept likely exists but there is some uncertainty.

:::image type="content" source="../media/entities/positive-possible-entity.png" alt-text="An example of a positive possible entity." lightbox="../media/entities/positive-possible-entity.png" :::

**Negative_Possible**: the concept’s existence is unlikely but there is some uncertainty.

:::image type="content" source="../media/entities/negative-possible-entity.png" alt-text="An example of a negative possible entity." lightbox="../media/entities/negative-possible-entity.png" :::

**Neutral_Possible**: the concept may or may not exist without a tendency to either side.

:::image type="content" source="../media/entities/neutral-possible-entity.png" alt-text="An example of a neutral possible entity." lightbox="../media/entities/neutral-possible-entity.png":::

### Conditionality

provides information regarding whether the existence of a concept depends on certain conditions. 

**None** (Default): the concept is a fact and not hypothetical and does not depend on certain conditions.

**Hypothetical**: the concept may develop or occur in the future.

:::image type="content" source="../media/entities/hypothetical-entity.png" alt-text="An example of a hypothetical entity." lightbox="../media/entities/hypothetical-entity.png":::

**Conditional**: the concept exists or occurs only under certain conditions.

:::image type="content" source="../media/entities/conditional-entity.png" alt-text="An example of a conditional entity." lightbox="../media/entities/conditional-entity.png":::

### Association

describes whether the concept is associated with the subject of the text or someone else.

**Subject** (Default): the concept is associated with the subject of the text, usually the patient.

**Someone_Else**: the concept is associated with someone who is not the subject of the text.

:::image type="content" source="../media/entities/association-entity.png" alt-text="An example of an association entity." lightbox="../media/entities/association-entity.png":::



## Next steps

* [NER overview](../../named-entity-recognition/overview.md)
