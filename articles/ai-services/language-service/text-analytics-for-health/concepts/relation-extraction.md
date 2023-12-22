---
title: Relation extraction in Text Analytics for health
titleSuffix: Azure AI services
description: Learn about relation extraction
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 12/19/2023
ms.author: jboback
ms.custom: language-service-health, ignite-fall-2021
---

# Relation extraction

Text Analytics for health features relation extraction, which is used to  identify meaningful connections between concepts, or entities, mentioned in the text. For example, a "time of condition" relation is found by associating a condition name with a time. Another example is a "dosage of medication" relation, which is found by relating an extracted medication to its extracted dosage. The following example shows how relations are expressed in the JSON output.

> [!NOTE]
> * Relations referring to CONDITION may refer to either the DIAGNOSIS entity type or the SYMPTOM_OR_SIGN entity type.
> * Relations referring to MEDICATION may refer to either the MEDICATION_NAME entity type or the MEDICATION_CLASS entity type.
> * Relations referring to TIME may refer to either the TIME entity type or the DATE entity type.

Relation extraction output contains URI references and assigned roles of the entities of the relation type. For example, in the following JSON:

```json
"relations": [
    {
        "relationType": "DosageOfMedication",
        "entities": [
            {
                "ref": "#/results/documents/0/entities/0",
                "role": "Dosage"
            },
            {
                "ref": "#/results/documents/0/entities/1",
                "role": "Medication"
            }
        ]
    },
    {
        "relationType": "RouteOfMedication",
        "entities": [
            {
                "ref": "#/results/documents/0/entities/1",
                "role": "Medication"
            },
            {
                "ref": "#/results/documents/0/entities/2",
                "role": "Route"
            }
        ]
    }
]
```

## Recognized relations

The following list presents all the recognized relations by the Text Analytics for health API. 

**ABBREVIATION**

**AMOUNT_OF_SUBSTANCE_USE**

**BODY_SITE_OF_CONDITION**

**BODY_SITE_OF_TREATMENT**

**COURSE_OF_CONDITION**

**COURSE_OF_EXAMINATION**

**COURSE_OF_MEDICATION**

**COURSE_OF_TREATMENT**

**DIRECTION_OF_BODY_STRUCTURE**

**DIRECTION_OF_CONDITION**

**DIRECTION_OF_EXAMINATION**

**DIRECTION_OF_TREATMENT**

**DOSAGE_OF_MEDICATION**

**EXAMINATION_FINDS_CONDITION**

**EXPRESSION_OF_GENE**

**EXPRESSION_OF_VARIANT**

**FORM_OF_MEDICATION**

**FREQUENCY_OF_CONDITION**

**FREQUENCY_OF_MEDICATION**

**FREQUENCY_OF_SUBSTANCE_USE**

**FREQUENCY_OF_TREATMENT**

**MUTATION_TYPE_OF_GENE**

**MUTATION_TYPE_OF_VARIANT**

**QUALIFIER_OF_CONDITION**

**RELATION_OF_EXAMINATION**

**ROUTE_OF_MEDICATION**	

**SCALE_OF_CONDITION**

**TIME_OF_CONDITION**

**TIME_OF_EVENT**

**TIME_OF_EXAMINATION**

**TIME_OF_MEDICATION**

**TIME_OF_TREATMENT**

**UNIT_OF_CONDITION**

**UNIT_OF_EXAMINATION**

**VALUE_OF_CONDITION**	

**VALUE_OF_EXAMINATION**

**VARIANT_OF_GENE**

## Next steps

* [How to call the Text Analytics for health](../how-to/call-api.md)
