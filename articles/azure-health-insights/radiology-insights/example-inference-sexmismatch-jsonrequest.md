---
title: Radiology Insights Inference Example sexMismatch input
titleSuffix: Azure AI Health Insights
description: Radiology Insights Inference Example sexMismatch input
services: azure-health-insights
author: JanSchietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: quickstart
ms.date: 12/06/2023
ms.author: janschietse
---

# Inference example sexMismatch input

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
    "inferenceTypes" : [ "sexMismatch"],
    "locale" : "en-US",
    "verbose" : false,
    "includeEvidence" : false
  },
  "patients" : [ {
    "id" : "11111",
    "info" : {
      "sex" : "female",
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
        "start" : "2017-10-21T00:00:00",
        "end" : "2017-10-21T00:00:00"
      },
      "class" : "inpatient"
    } ],
    "patientDocuments" : [ {
      "type" : "note",
      "clinicalType" : "radiologyReport",
      "id" : "docid1",
      "language" : "en",
      "authors" : [ {
        "id" : "authorid1",
        "name" : "authorname1"
      } ],
      "specialtyType" : "radiology",
      "createdDateTime" : "2017-10-21T00:00:00",
      "administrativeMetadata" : {
        "orderedProcedures" : [ {
          "code" : {
            "coding" : [ {
              "system" : "Https://loinc.org",
              "code" : "37006-4",
              "display" : "MG BREAST - BILATERAL MLO"
            } ]
          },
          "description" : "MG BREAST - BILATERAL MLO"
        } ],
        "encounterId" : "encounterid1"
      },
      "content" : {
        "sourceType" : "inline",
        "value" : "Clinical indication: Screening mammogram on a 43 year old man.\r\n\r\nTechnique: Bilateral screening digital mammographic views with tomosynthesis.\n\r\n\r\nFindings:\nThe breast demonstrate scattered fibroglandular densities. There is a nodular density 2-3 o'clock posterior left breast. There are no suspicious masses, microcalcifications or areas of architectural distortion suggestive of malignancy. Both visualized axillae are unremarkable.\n\r\n\r\nImpression:\nNodularity 2-3 o'clock posterior left breast. Recommend left mammography in 6 months.\r\n\nFindings were discussed with Jane Doe, MD at 3:15 pm on 2023/09/05.\n \n \n \r\n\r\nRadiology Insights service surfaces insights documented by the radiologist in a radiology report. No new medical conclusions are drawn from it."
      }
    } ]
  } ]
}
```