---
title: Assertion detection in Text Analytics for health
titleSuffix: Azure AI services
description: Learn about assertion detection.
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 12/19/2023
ms.author: jboback
ms.custom: language-service-health, ignite-fall-2021
---

# Assertion detection

The meaning of medical content is highly affected by modifiers, such as negative or conditional assertions, which can have critical implications if misrepresented. Text Analytics for health supports four categories of assertion detection for entities in the text: 

* Certainty
* Conditional
* Association
* Temporal

## Assertion output

Text Analytics for health returns assertion modifiers, which are informative attributes assigned to medical concepts that provide a deeper understanding of the concepts’ context within the text. These modifiers are divided into four categories, each focusing on a different aspect and containing a set of mutually exclusive values. Only one value per category is assigned to each entity. The most common value for each category is the Default value. The service’s output response contains only assertion modifiers that are different from the default value. In other words, if no assertion is returned, the implied assertion is the default value.

**CERTAINTY**  – provides information regarding the presence (present vs. absent) of the concept and how certain the text is regarding its presence (definite vs. possible).
* **Positive** [Default]: the concept exists or has happened.
* **Negative**: the concept does not exist now or never happened.
* **Positive_Possible**: the concept likely exists but there is some uncertainty.
* **Negative_Possible**: the concept’s existence is unlikely but there is some uncertainty.
* **Neutral_Possible**: the concept may or may not exist without a tendency to either side.

An example of assertion detection is shown below where a negated entity is returned with a negative value for the certainty category:

```json
{
    "offset": 381,
    "length": 3,
    "text": "SOB",
    "category": "SymptomOrSign",
    "confidenceScore": 0.98,
    "assertion": {
        "certainty": "negative"
    },
    "name": "Dyspnea",
    "links": [
        {
            "dataSource": "UMLS",
            "id": "C0013404"
        },
        {
            "dataSource": "AOD",
            "id": "0000005442"
        },
    ...
}
```

**CONDITIONALITY** – provides information regarding whether the existence of a concept depends on certain conditions. 
*	**None** [Default]: the concept is a fact and not hypothetical and does not depend on certain conditions.
*	**Hypothetical**: the concept may develop or occur in the future.
*	**Conditional**: the concept exists or occurs only under certain conditions.

**ASSOCIATION** – describes whether the concept is associated with the subject of the text or someone else.
*	**Subject** [Default]: the concept is associated with the subject of the text, usually the patient.
*	**Other**: the concept is associated with someone who is not the subject of the text.

**TEMPORAL** - provides additional temporal information for a concept detailing whether it is an occurrence related to the past, present, or future.
*   **Current** [Default]: the concept is related to conditions/events that belong to the current encounter. For example, medical symptoms that have brought the patient to seek medical attention (e.g., “started having headaches 5 days prior to their arrival to the ER”). This includes newly made diagnoses, symptoms experienced during or leading to this encounter, treatments and examinations done within the encounter.
*   **Past**: the concept is related to conditions, examinations, treatments, medication events that are mentioned as something that existed or happened prior to the current encounter, as might be indicated by hints like s/p, recently, ago, previously, in childhood, at age X. For example, diagnoses that were given in the past, treatments that were done, past examinations and their results, past admissions, etc. Medical background is considered as PAST.
*   **Future**: the concept is related to conditions/events that are planned/scheduled/suspected to happen in the future, e.g., will be obtained, will undergo, is scheduled in two weeks from now.



## Next steps

[How to call the Text Analytics for health](../how-to/call-api.md)
