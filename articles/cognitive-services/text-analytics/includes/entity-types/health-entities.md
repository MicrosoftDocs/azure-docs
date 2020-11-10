---
title: Named entities for healthcare
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include 
ms.date: 10/02/2020
ms.author: aahi
---

## Text Analytics for health categories, entities and attributes

[Text Analytics for health](../../how-tos/text-analytics-for-health.md) detects medical concepts in the following categories.  (Please note that only English text is supported in this container preview and only a single model-version is provided in each container image.)


| Category  | Description  |
|---------|---------|
| ANATOMY | concepts that capture information about body and anatomic systems, sites, locations or regions. |
 | DEMOGRAPHICS | concepts that capture information about gender and age. |
 | EXAMINATION | concepts that capture information about diagnostic procedures and tests. |
 | GENOMICS | concepts that capture information about genes and variants. |
 | HEALTHCARE | concepts that capture information about administrative events, care environments and healthcare professions. |
 | MEDICAL CONDITION | concepts that capture information about diagnoses, symptoms or signs. |
 | MEDICATION | concepts that capture information about medication including medication names, classes, dosage and route of administration. |
 | SOCIAL | concepts that capture information about medically relevant social aspects such as family relation. |
 | TREATMENT | concepts that capture information about therapeutic procedures. |
  
Each category may include two concept groups:

* **Entities** - terms that capture medical concepts such as diagnosis, medication name, or treatment name.  For example, *bronchitis* is a diagnosis and *aspirin* is a medication name.  Mentions in this group may be linked to a UMLS concept ID.
* **Attributes** - phrases that provide more information about the detected entity, for example, *severe* is a condition qualifier for *bronchitis* or *81 mg* is a dosage for *aspirin*.  Mentions in this category will NOT be linked to a UMLS concept ID.

Additionally, the service recognizes relations between the different concepts including relations between attributes and entities for example, *direction* to *body structure* or *dosage* to *medication name* and relations between entities for example in abbreviation detection.

## Anatomy

### Entities

**BODY_STRUCTURE** - Body systems, anatomic locations or regions, and body sites. For example, arm, knee, abdomen, nose, liver, head, respiratory system, lymphocytes.

:::image type="content" source="../../media/ta-for-health/anatomy-entities-body-structure.png" alt-text="An example of the body structure entity.":::


:::image type="content" source="../../media/ta-for-health/anatomy-entities-body-structure-2.png" alt-text="An expanded example of the body structure entity.":::

### Attributes

**DIRECTION** - Directional terms, such as: left, lateral, upper, posterior, that characterizes a body structure.

:::image type="content" source="../../media/ta-for-health/anatomy-attributes.png" alt-text="An example of a directional attribute.":::

### Supported relations

* **DIRECTION_OF_BODY_STRUCTURE**

## Demographics

### Entities

**AGE** - All age terms and phrases, including those of a patient, family members, and others. For example, 40-year-old, 51 yo, 3 months old, adult, infant, elderly, young, minor, middle-aged.

:::image type="content" source="../../media/ta-for-health/age-entity.png" alt-text="An example of an age entity.":::

:::image type="content" source="../../media/ta-for-health/age-entity-2.png" alt-text="Another example of an age entity.":::


**GENDER** - Terms that disclose the gender of the subject. For example, male, female, woman, gentleman, lady.

:::image type="content" source="../../media/ta-for-health/gender-entity.png" alt-text="An example of a gender entity.":::

### Attributes

**RELATIONAL_OPERATOR** - Phrases that express the relation between a demographic entity and additional information.

:::image type="content" source="../../media/ta-for-health/relational-operator.png" alt-text="An example of a relational operator.":::

## Examinations

### Entities

**EXAMINATION_NAME** – Diagnostic procedures and tests. For example, MRI, ECG, HIV test, hemoglobin, platelets count, scale systems such as *Bristol stool scale*.

:::image type="content" source="../../media/ta-for-health/exam-name-entities.png" alt-text="An example of an exam entity.":::

:::image type="content" source="../../media/ta-for-health/exam-name-entities-2.png" alt-text="Another example of an examination name entity.":::

### Attributes

**DIRECTION** – Directional terms that characterizes an examination.

:::image type="content" source="../../media/ta-for-health/exam-direction-attribute.png" alt-text="An example of a direction attribute with an examination name entity.":::

**MEASUREMENT_UNIT** – The unit of the examination. For example, in *hemoglobin > 9.5 g/dL*, the term *g/dL* is the unit for the *hemoglobin* test.

:::image type="content" source="../../media/ta-for-health/exam-unit-attribute.png" alt-text="An example of a measurement unit attribute with an examination name entity.":::

**MEASUREMENT_VALUE** – The value of the examination. For example, in *hemoglobin > 9.5 g/dL*, the term *9.5* is the value for the *hemoglobin* test.

:::image type="content" source="../../media/ta-for-health/exam-value-attribute.png" alt-text="An example of a measurement value attribute with an examination name entity.":::

**RELATIONAL_OPERATOR** – Phrases that express the relation between an examination and additional information. For example, the required measurement value for a target examination.

:::image type="content" source="../../media/ta-for-health/exam-relational-operator-attribute.png" alt-text="An example of a relational operator with an examination name entity.":::

**TIME** – Temporal terms relating to the beginning and/or length (duration) of an examination. For example, when the test occurred.

:::image type="content" source="../../media/ta-for-health/exam-time-attribute.png" alt-text="An example of a time attribute with an examination name entity.":::

### Supported relations

+ **DIRECTION_OF_EXAMINATION**
+	**RELATION_OF_EXAMINATION**
+	**TIME_OF_EXAMINATION**
+	**UNIT_OF_EXAMINATION**
+	**VALUE_OF_EXAMINATION**

## Genomics

### Entities

**GENE** – All mentions of genes. For example, MTRR, F2.

:::image type="content" source="../../media/ta-for-health/genomics-entities.png" alt-text="An example of a gene entity.":::

**VARIANT** – All mentions of gene variations. For example, c.524C>T, (MTRR):r.1462_1557del96
  
## Healthcare

### Entities
  
**ADMINISTRATIVE_EVENT** – Events that relate to the healthcare system but of an administrative/semi-administrative nature. For example, registration, admission, trial, study entry, transfer, discharge, hospitalization, hospital stay. 

:::image type="content" source="../../media/ta-for-health/healthcare-event-entity.png" alt-text="An example of a healthcare event entity.":::

**CARE_ENVIRONMENT** – An environment or location where patients are given care. For example, emergency room, physician’s office, cardio unit, hospice, hospital.

:::image type="content" source="../../media/ta-for-health/healthcare-environment-entity.png" alt-text="This screenshot shows an example of a healthcare environment entity.":::

**HEALTHCARE_PROFESSION** – A healthcare practitioner licensed or non-licensed. For example, dentist, pathologist, neurologist, radiologist, pharmacist, nutritionist, physical therapist, chiropractor.

:::image type="content" source="../../media/ta-for-health/healthcare-profession-entity.png" alt-text="This screenshot shows an example of a healthcare environment entity.":::

:::image type="content" source="../../media/ta-for-health/healthcare-profession-entity-2.png" alt-text="Another example of a healthcare environment entity.":::

## Medical condition

### Entities

**DIAGNOSIS** – Disease, syndrome, poisoning. For example, breast cancer, Alzheimer’s, HTN, CHF, spinal cord injury.

:::image type="content" source="../../media/ta-for-health/medical-condition-entity.png" alt-text="An example of a medical condition entity.":::

:::image type="content" source="../../media/ta-for-health/medical-condition-entity-2.png" alt-text="Another example of a medical condition entity.":::

**SYMPTOM_OR_SIGN** – Subjective or objective evidence of disease or other diagnoses. For example, chest pain, headache, dizziness, rash, SOB, abdomen was soft, good bowel sounds, well nourished.

:::image type="content" source="../../media/ta-for-health/medical-condition-symptom-entity.png" alt-text="An example of a medical condition sign or symptom entity.":::

:::image type="content" source="../../media/ta-for-health/medical-condition-symptom-entity-2.png" alt-text="Another example of a medical condition sign or symptom entity.":::

### Attributes

**CONDITION_QUALIFIER** - Quality terms that are used to describe a medical condition. All the following sub-categories are considered qualifiers:

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

**DIRECTION** - Directional terms that characterizes a body medical condition.

:::image type="content" source="../../media/ta-for-health/medical-condition-direction-attribute.png" alt-text="An example of a direction attribute with a medical condition entity.":::

**FREQUENCY** - How often a medical condition occurred, occurs, or should occur.

:::image type="content" source="../../media/ta-for-health/medical-condition-frequency-attribute.png" alt-text="An example of a frequency attribute with a medical condition entity.":::

:::image type="content" source="../../media/ta-for-health/medical-condition-frequency-attribute-2.png" alt-text="Another example of a direction attribute with a symptom or sign entity.":::

**MEASUREMENT_UNIT** - The unit that characterizes a medical condition. For example, in *1.5x2x1 cm tumor*, the term *cm* is the measurement unit for the *tumor*. 

:::image type="content" source="../../media/ta-for-health/medical-condition-measure-unit-attribute.png" alt-text="An example of a measurement unit attribute with medical condition entity.":::

**MEASUREMENT_VALUE** - The value that characterizes a medical condition. For example, in *1.5x2x1 cm tumor*, the term *1.5x2x1* is the measurement value for the *tumor*. 

:::image type="content" source="../../media/ta-for-health/medical-condition-measure-value-attribute.png" alt-text="Screenshot shows an example of a direction attribute with a symptom or sign entity.":::

**RELATIONAL_OPERATOR** - Phrases that express the relation between medical condition additional information. For example, time or measurement value. 

:::image type="content" source="../../media/ta-for-health/medical-condition-relational-operator.png" alt-text="Screenshot shows another example of a direction attribute with a symptom or sign entity.":::

**TIME** - Temporal terms relating to the beginning and/or length (duration) of a medical condition. For example, when a symptom started (onset) or when a disease occurred.

:::image type="content" source="../../media/ta-for-health/medical-condition-time-attribute.png" alt-text="Screenshot shows an additional example of a direction attribute with a symptom or sign entity.":::

### Supported relations

+ **DIRECTION_OF_CONDITION**
+	**QUALIFIER_OF_CONDITION**
+	**TIME_OF_CONDITION**
+	**UNIT_OF_CONDITION**
+	**VALUE_OF_CONDITION**

## Medication

### Entities

**MEDICATION_CLASS** – A set of medications that have a similar mechanism of action, a related mode of action, a similar chemical structure, and/or are used to treat the same disease. For example, ACE inhibitor, opioid, antibiotics, pain relievers.

:::image type="content" source="../../media/ta-for-health/medication-entities-class.png" alt-text="An example of a medication class entity.":::

**MEDICATION_NAME** – Medication mentions, including copyrighted brand names, and non-brand names. For example, Advil, Ibuprofen.

:::image type="content" source="../../media/ta-for-health/medication-entities-name.png" alt-text="An example of a medication name entity.":::

### Attributes

**DOSAGE** - Amount of medication ordered. For example, Infuse Sodium Chloride solution *1000 mL*.

:::image type="content" source="../../media/ta-for-health/medication-dosage.png" alt-text="An example of a medication dosage attribute.":::

**FREQUENCY** - How often a medication should be taken.

:::image type="content" source="../../media/ta-for-health/medication-frequency.png" alt-text="An example of a medication frequency attribute.":::

:::image type="content" source="../../media/ta-for-health/medication-frequency-2.png" alt-text="Another example of a medication frequency attribute.":::

**MEDICATION_FORM** - The form of the medication. For example, solution, pill, capsule, tablet, patch, gel, paste, foam, spray, drops, cream, syrup.

:::image type="content" source="../../media/ta-for-health/medication-form.png" alt-text="An example of a medication form attribute.":::

**MEDICATION_ROUTE** - The administration method of medication. For example, oral, vaginal, IV, epidural, topical, inhaled.

:::image type="content" source="../../media/ta-for-health/medication-route.png" alt-text="An example of a medication route attribute.":::

**RELATIONAL_OPERATOR** - Phrases that express the relation between medication and additional information. For example, the required measurement value.

:::image type="content" source="../../media/ta-for-health/medication-relational-operator.png" alt-text="Screenshot shows an example of a relational operator attribute with a medication entity.":::

:::image type="content" source="../../media/ta-for-health/medication-time.png" alt-text="Screenshot shows an example of a relational operator attribute with a medication entity.":::

### Supported relations

+ **DOSAGE_OF_MEDICATION**
+	**FORM_OF_MEDICATION**
+	**FREQUENCY_OF_MEDICATION**
+	**ROUTE_OF_MEDICATION**
+	**TIME_OF_MEDICATION**
  
## Treatment

### Entities

**TREATMENT_NAME** – Therapeutic procedures. For example, knee replacement surgery, bone marrow transplant, TAVI, diet.

:::image type="content" source="../../media/ta-for-health/treatment-entities-name.png" alt-text="An example of a treatment name entity.":::

### Attributes

**DIRECTION** - Directional terms that characterizes a treatment.

:::image type="content" source="../../media/ta-for-health/treatment-direction.png" alt-text="Screenshot shows an example of a treatment direction attribute.":::

**FREQUENCY** - How often a treatment occurs or should occur.

:::image type="content" source="../../media/ta-for-health/treatment-frequency.png" alt-text="Screenshot shows another example of a treatment direction attribute.":::
 
**RELATIONAL_OPERATOR** - Phrases that express the relation between treatment and additional information.  For example, how much time passed from the previous procedure.

:::image type="content" source="../../media/ta-for-health/treatment-relational-operator.png" alt-text="An example of a treatment relational operator attribute.":::

**TIME** - Temporal terms relating to the beginning and/or length (duration) of a treatment. For example, the date the treatment was given.

:::image type="content" source="../../media/ta-for-health/treatment-time.png" alt-text="Screenshot shows an example of a treatment time attribute.":::


### Supported relations

+ **DIRECTION_OF_TREATMENT**
+	**TIME_OF_TREATMENT**
+	**FREQUENCY_OF_TREATMENT**

## Social

### Entities

**FAMILY_RELATION** – Mentions of family relatives of the subject. For example, father, daughter, siblings, parents.

:::image type="content" source="../../media/ta-for-health/family-relation.png" alt-text="Screenshot shows another example of a treatment time attribute.":::
