---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include 
ms.date: 09/30/2021
ms.author: aahi
---

# [Named Entity Recognition](#tab/ner)

Named Entity Recognition detects words and phrases mentioned in unstructured text that can be associated with one or more semantic types, such as diagnosis, medication name, symptom/sign, or age.

> [!div class="mx-imgBorder"]
> ![Health NER](../media/call-api/health-named-entity-recognition.png)

# [Relation Extraction](#tab/relation-extraction)

Relation extraction identifies meaningful connections between concepts mentioned in text. For example, a "time of condition" relation is found by associating a condition name with a time or between an abbreviation and the full description.  

> [!div class="mx-imgBorder"]
> ![Health RE](../media/call-api/health-relation-extraction.png)


# [Entity Linking](#tab/entity-linking)

Entity Linking disambiguates distinct entities by associating named entities mentioned in text to concepts found in a predefined database of concepts including the Unified Medical Language System (UMLS). Medical concepts are also assigned preferred naming, as an additional form of normalization.

> [!div class="mx-imgBorder"]
> ![Health EL](../media/call-api/health-entity-linking.png)

The Health API supports linking to the health and biomedical vocabularies found in the Unified Medical Language System ([UMLS](https://www.nlm.nih.gov/research/umls/sourcereleasedocs/index.html)) Metathesaurus Knowledge Source.

# [Assertion Detection](#tab/assertion-detection) 

The meaning of medical content is highly affected by modifiers, such as negative or conditional assertions which can have critical implications if misrepresented. The Health API supports three categories of assertion detection for entities in the text: 

* Certainty
* Conditional
* Association

> [!div class="mx-imgBorder"]
> ![Health NEG](../media/call-api/assertions.png)

---