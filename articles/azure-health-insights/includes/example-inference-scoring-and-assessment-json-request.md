---
author: JanSchietse
ms.author: janschietse
ms.date: 03/17/2025
ms.topic: include
ms.service: azure-health-insights
---


```json
{
  "jobData" : {
    "configuration" : {
      "inferenceOptions" : {
        "followupRecommendationOptions" : {
          "includeRecommendationsWithNoSpecifiedModality" : false,
          "includeRecommendationsInReferences" : false,
          "provideFocusedSentenceEvidence" : true
        },
        "findingOptions" : {
          "provideFocusedSentenceEvidence" : true
        }
      },
      "inferenceTypes" : [ "scoringAndAssessment"],
      "locale" : "en-US",
      "verbose" : false,
      "includeEvidence" : false
    },
    "patients" : [ {
      "id" : "11111",
      "details" : {
        "sex" : "female",
        "birthDate" : "1939-05-25",
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
          "start" : "2014-2-20T00:00:00",
          "end" : "2014-2-20T00:00:00"
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
        "createdAt" : "2014-2-20T00:00:00",
        "administrativeMetadata" : {
          "orderedProcedures" : [ {
            "code" : {
              "coding" : [ {
                "system" : "http://loinc.org",
                "code" : "USTHY",
                "display" : "US THYROID    "
              } ]
            },
            "description" : "US THYROID    "
          } ],
          "encounterId" : "encounterid1"
        },
        "content" : {
          "sourceType" : "inline",
          "value" : "\n\n\n\r\n\nExam: US THYROID\n\nClinical History: Thyroid nodules. 76 year old patient.\n\nComparison: none.\n\nFindings:\n\nRight lobe: 4.8 x 1.6 x 1.4 cm\n\nLeft Lobe: 4.1 x 1.3 x 1.3 cm\n\nIsthmus: 4 mm\n\nThere are multiple cystic and partly cystic sub-5 mm nodules noted within the right lobe (TIRADS 2).  \n\nIn the lower pole of the left lobe there is a 9 x 8 x 6 mm predominantly solid isoechoic nodule (TIRADS 3).\n\nImpression:\nMultiple bilateral small cystic benign thyroid nodules. A low suspicion 9 mm left lobe thyroid nodule (TI-RADS 3) which, given its small size, does not warrant follow-up.\n\n\r\n"
        }
      } ]
    } ]
  }
}
```