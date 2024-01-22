---
title: Radiology Insights Inference Example
titleSuffix: Azure AI Health Insights
description: Radiology Insights Inference Example
services: azure-health-insights
author: JanSchietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: quickstart
ms.date: 12/06/2023
ms.author: janschietse
---

# Inference example

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
    "inferenceTypes" : [  "followupCommunication" ],
    "locale" : "en-US",
    "verbose" : false,
    "includeEvidence" : false
  },
  "patients" : [ {
    "id" : "11111",
    "info" : {
      "sex" : "female",
      "birthDate" : "1959-11-11T19:00:00+00:00",
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
        "start" : "2021-8-28T00:00:00",
        "end" : "2021-8-28T00:00:00"
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
      "createdDateTime" : "2021-8-28T00:00:00",	  
      "administrativeMetadata" : {
        "orderedProcedures" : [ {
          "code" : {
            "coding" : [ {
              "system" : "Https://loinc.org",
              "code" : "36572-6",
              "display" : "XR CHEST AP"
            } ]
          },
          "description" : "XR CHEST AP"
        } ],
        "encounterId" : "encounterid1"
      },
      "content" : {
        "sourceType" : "inline",
        "value" : "\r\n\r\n\r\n\nThe results were faxed to Julie Carter on July 6 2016 at 3 PM.\n\nThe results were sent via Powerscribe to George Brown, PA.\n\n\t\t"
      }
    } ]
  } ]
}
```