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
| Age | Ages. For example *30 years old*. |
| AdministrativeEvent | An administrative event. |
| BodyStructure | Parts of the human body including organs and other structures. For example *arm*, or *heart*. | 
| CareEnvironment | The environment where care or treatment is administered. For example *emergency room* | 
| ConditionQualifier | Condition levels. For example *mild*, *extended*, or *diffuse*. | 
| Diagnosis | Medical conditions. For example *hypertension*. | 
| Direction | Directions. For example *left* or *anterior*. | 
| Dosage | Size or quantity of a medication. For example *25mg*.  | 
| ExaminationName | A method or procedure of examination. For example *X-ray*. | 
| RelationalOperator | An operator that defines a relation between two entities. For example *less than*, or `>=`.  | 
| MeasurementUnit | A measurement unit (like a percentage). | 
| MeasurementValue | The numerical value of a measurement unit. | 
| FamilyRelation | A familial relationship. For example *sister*.  | 
| Frequency | Frequencies.   | 
| Gender | Genders. | 
| Gene | A gene entity such as *TP53*.   | 
| HealthcareProfession | Method of administering medication. For example *oral administration*. | 
| MedicationClass | Medication classes. For example *antibiotics*.  | 
| MedicationForm | A Form of medication. For example *capsule*. | 
| MedicationName  | Generic and brand named medications. For example *ibuprofen*. | 
| MedicationRoute | Method of administering medication. For example *oral administration*. | 
| SymptomOrSign  | Illness symptoms. For example *sore throat*. | 
| Time | Times. For example *8 years* or *2:30AM this morning* |
| TreatmentName  | Treatment names. For example *therapy*. | 
| Variant | A genetic variant of the gene entity. | 

### Relation extraction

Relation extraction identifies meaningful connections between concepts mentioned in text. For example, a "time of condition" relation is found by associating a condition name with a time. Text Analytics for health can identify the following relations:

|Category  |Description   |
|----------|--------------|
| DirectionOfBodyStructure | Direction of a body structure. |
| DirectionOfCondition | Direction of a condition. |
| DirectionOfExamination | Direction of an examination. |
| DirectionOfTreatment | Direction of a treatment. |
| TimeOfCondition | The time associated with the onset of a condition. |
| QualifierOfCondition | The associated qualifier for a condition. |
| DosageOfMedication | A dosage of medication. |
| FormOfMedication | A form of medication. |
| RouteOfMedication | A route or mode of consuming a medicine. For example *oral*. |
| FrequencyOfMedication | The frequency at which a medication is consumed. | 
| ValueOfCondition | A numerical value associated with a condition. |
| UnitOfCondition | A unit (such as time) associated with a condition. |
| TimeOfMedication | The time at which a medication was consumed. |
| TimeOfTreatment | The time at which a treatment was administered. | 
| FrequencyOfTreatment | The frequency at which a treatment is administered. |
| ValueOfExamination | A numerical value associated with an examination. | 
| UnitOfExamination | A unit (such as a percentage) associated with an examination. |
| RelationOfExamination | A relation between an entity and an examination. | 
| TimeOfExamination | The time associated with an examination. |
| Abbreviation | An abbreviation.  | 
