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

  + **HEALTHCARE** - concepts that capture information about administrative events, care environments and healthcare professions.
  + **DEMOGRAPHICS** - concepts that capture information about gender and age.
  + **ANATOMY** - concepts that capture information about body and anatomic systems, sites, locations or regions.
  + **MEDICAL CONDITION** - concepts that capture information about diagnoses, symptoms or signs.
  + **EXAMINATION** - concepts that capture information about diagnostic procedures and tests.
  + **TREATMENT** - concepts that capture information about therapeutic procedures.
  + **MEDICATION** - concepts that capture information about medication including medication names, classes, dosage and route of administration.
  + **GENOMICS** - concepts that capture information about genes and variants.
  + **SOCIAL** - concepts that capture information about medically relevant social aspects such as family relation.
  
Each category may include two concept groups:

1. **Entities** - terms that capture medical concepts such as diagnosis, medication name, or treatment name.  For example, *bronchitis* is a diagnosis and *aspirin* is a medication name.  Mentions in this group may be linked to a UMLS concept ID.
2. **Attributes** - phrases that provide more information about the detected entity, for example, *severe* is a condition qualifier for *bronchitis* or *81 mg* is a dosage for *aspirin*.  Mentions in this category will NOT be linked to a UMLS concept ID.

Additionally, the service recognizes relations between the different concepts including relations between attributes and entities for example, *direction* to *body structure* or *dosage* to *medication name* and relations between entities for example in abbreviation detection.

## ANATOMY
### Entities
  + **BODY_STRUCTURE** - Body systems, anatomic locations or regions, and body sites. For example, arm, knee, abdomen, nose, liver, head, respiratory system, lymphocytes.

### Attributes
  + **DIRECTION** - Directional terms, such as: left, lateral, upper, posterior, that characterizes a body structure.
  
### Supported Relations
  + **DIRECTION_OF_BODY_STRUCTURE**
  



