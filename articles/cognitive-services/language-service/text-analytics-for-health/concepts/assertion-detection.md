---
title: Assertion detection in Text Analytics for health
titleSuffix: Azure Cognitive Services
description: Learn about assertion detection.
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

# Assertion detection

The meaning of medical content is highly affected by modifiers, such as negative or conditional assertions which can have critical implications if misrepresented. Text Analytics for health supports three categories of assertion detection for entities in the text: 

* Certainty
* Conditional
* Association

## Assertion output

Text Analytics for health returns assertion modifiers, which are informative attributes assigned to medical concepts that provide deeper understanding of the concepts’ context within the text. These modifiers are divided into three categories, each focusing on a different aspect, and containing a set of mutually exclusive values. Only one value per category is assigned to each entity. The most common value for each category is the Default value. The service’s output response contains only assertion modifiers that are different from the default value.

**CERTAINTY**  – provides information regarding the presence (present vs. absent) of the concept and how certain the text is regarding its presence (definite vs. possible).
*	**Positive** [Default]: the concept exists or happened.
* **Negative**: the concept does not exist now or never happened.
* **Positive_Possible**: the concept likely exists but there is some uncertainty.
* **Negative_Possible**: the concept’s existence is unlikely but there is some uncertainty.
* **Neutral_Possible**: the concept may or may not exist without a tendency to either side.

**CONDITIONALITY** – provides information regarding whether the existence of a concept depends on certain conditions. 
*	**None** [Default]: the concept is a fact and not hypothetical and does not depend on certain conditions.
*	**Hypothetical**: the concept may develop or occur in the future.
*	**Conditional**: the concept exists or occurs only under certain conditions.

**ASSOCIATION** – describes whether the concept is associated with the subject of the text or someone else.
*	**Subject** [Default]: the concept is associated with the subject of the text, usually the patient.
*	**Someone_Else**: the concept is associated with someone who is not the subject of the text.


Assertion detection represents negated entities as a negative value for the certainty category, for example:

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

## Next steps

[How to call the Text Analytics for health](../how-to/call-api.md)
