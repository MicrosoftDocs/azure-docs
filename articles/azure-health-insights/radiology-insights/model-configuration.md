---
title: Radiology Insights model configuration
titleSuffix: Azure AI Health Insights
description: This article provides Radiology Insights model configuration information.
services: azure-health-insights
author: JanSchietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: overview
ms.date: 12/06/2023
ms.author: bJanSchietse
---

# Radiology Insights model configuration

To interact with the Radiology Insights model, you can provide several model configurations parameters that modify the outcome of the responses.

> [!IMPORTANT]
> Model configuration is applied to ALL the patients within a request.

```json
  "configuration": {
    "inferenceOptions": {
      "followupRecommendationOptions": {
        "includeRecommendationsWithNoSpecifiedModality": false,
        "includeRecommendationsInReferences": false,
        "provideFocusedSentenceEvidence": false
      },
      "findingOptions": {
        "provideFocusedSentenceEvidence": false
      }
    },
    "locale": "en-US",
    "verbose": false,
    "includeEvidence": true
  }
```

# Case finding

Through the model configuration, the API allows you to seek evidence from the provided clinical documents as part of the inferences.

**Include Evidence** |**Behavior** 
---------------------- |-----------------------
true | Evidence is returned as part of the inferences
false  | No Evidence is returned

# Inference Options

**FindingOptions**
- provideFocusedSentenceEvidence
- type: boolean
- Provide a single focused sentence as evidence for the finding, default is false.

**FollowupRecommendationOptions**
- includeRecommendationsWithNoSpecifiedModality
    - type: boolean
    - description: Include/Exclude followup recommendations with no specific radiologic modality, default is false.


- includeRecommendationsInReferences
    - type: boolean
    - description: Include/Exclude followup recommendations in references to a guideline or article, default is false.

- provideFocusedSentenceEvidence
    - type: boolean
    - description: Provide a single focused sentence as evidence for the recommendation, default is false.

When includeEvidence is false, no evidence is returned. 

This configuration overrules includeRecommendationsWithNoSpecifiedModality and provideFocusedSentenceEvidence and no evidence will be shown at all. 

When includeEvidence is true it depends on the value set on the two other configurations whether the evidence of the inference or a single focused sentence is given as evidence. 

# Examples 


**Example 1** 

CDARecommendation_GuidelineFalseUnspecTrueLimited

The includeRecommendationsWithNoSpecifiedModality has been set to true, includeRecommendationsInReferences has been set to false,  provideFocusedSentenceEvidence for recommendations has been set to true and includeEvidence has been set to true. 

As a result, the model will include evidence for all inferences. It also means that the model checks for follow up recommendations with a specified modality and for follow up recommendations with no specific radiologic modality and provides a single focused sentence as evidence for the recommendation. 

### Todo add input output json
```json
{
  "configuration" : {
    "inferenceOptions" : {
      "followupRecommendationOptions" : {
        "includeRecommendationsWithNoSpecifiedModality" : false,
        "includeRecommendationsInReferences" : false,
        "provideFocusedSentenceEvidence" : false
      },
      "findingOptions" : {
        "provideFocusedSentenceEvidence" : false
      }
    },
    "inferenceTypes" : [ "lateralityDiscrepancy" ],
    "locale" : "en-US",
    "verbose" : false,
    "includeEvidence" : false
  },
  "patients" : [ {
    "id" : "11111",
    "info" : {
      "sex" : "female",
      "birthDate" : "1986-07-01T21:00:00+00:00",
      "clinicalInfo" : [ {
        "resourceType" : "Observation",
        "status" : "unknown",
        "code" : {
          "coding" : [ {
            "system" : "http://www.nlm.nih.gov/research/umls",
            "code" : "C0018802",
            "display" : "MalignantNeoplasms"
          } ]
        },
        "valueBoolean" : "true"
      } ]
    },
    "encounters" : [ {
      "id" : "encounterid1",
      "period" : {
        "start" : "2021-08-28T00:00:00",
        "end" : "2021-08-28T00:00:00"
      },
      "class" : "inpatient"
    } ],
    "patientDocuments" : [ {
      "type" : "note",
      "clinicalType" : "radiologyReport",
      "id" : "docid1",
      "language" : "en-US",
      "authors" : [ {
        "id" : "authorid1",
        "name" : "authorname1"
      } ],
      "specialtyType" : "radiology",
      "administrativeMetadata" : {
        "orderedProcedures" : [ {
          "code" : {
            "coding" : [ {
              "system" : "Http://hl7.org/fhir/ValueSet/cpt-all",
              "code" : "76645A",
              "display" : "US LT BREAST TARGETED"
            } ]
          },
          "description" : "US LT BREAST TARGETED"
        } ],
        "encounterId" : "encounterid1"
      },
      "content" : {
        "sourceType" : "inline",
        "value" : "Exam:   US LT BREAST TARGETED\r\n\r\nTechnique:  Targeted imaging of the  right breast  is performed.\r\n\r\nFindings:\r\n\r\nTargeted imaging of the left breast is performed from the 6:00 to the 9:00 position.  \r\n\r\nAt the 6:00 position, 5 cm from the nipple, there is a 3 x 2 x 4 mm minimally hypoechoic mass with a peripheral calcification. This may correspond to the mammographic finding. No other cystic or solid masses visualized.\r\n"
      }
    } ]
  } ]
}
```
*output:*
```json
{
  "result": {
    "patientResults": [
      {
        "patientId": "11111",
        "inferences": [
          {
            "kind": "lateralityDiscrepancy",
            "lateralityIndication": {
              "coding": [
                {
                  "system": "*SNOMED",
                  "code": "24028007",
                  "display": "RIGHT (QUALIFIER VALUE)"
                }
              ]
            },
            "discrepancyType": "orderLateralityMismatch"
          }
        ]
      }
    ]
  },
  "id": "862768cf-0590-4953-966b-1cc0ef8b8256",
  "createdDateTime": "2023-12-18T12:25:37.8942771Z",
  "expirationDateTime": "2023-12-18T12:42:17.8942771Z",
  "lastUpdateDateTime": "2023-12-18T12:25:49.7221986Z",
  "status": "succeeded"
}
```

**Example 2**

CDARecommendation_GuidelineTrueUnspecFalseLimited

The includeRecommendationsWithNoSpecifiedModality has been set to false, includeRecommendationsInReferences has been set to true, provideFocusedSentenceEvidence for findings has been set to true and includeEvidence has been set to true. 

As a result, the model will include evidence for all inferences. It also means that the model checks for follow up recommendations with a specified modality and for a recommendation in a guideline,  and it provides a single focused sentence as evidence for the finding. 

### Todo add input output json

## Next steps

Refer to the following page to get better insights into the request and responses:

>[!div class="nextstepaction"]
> [Inference information](inferences.md) 
