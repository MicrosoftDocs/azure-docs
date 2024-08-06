---
author: JanSchietse
ms.author: janschietse
ms.date: 01/25/2024
ms.topic: include
ms.service: azure-health-insights
---


```json
{
      "jobData": {
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
          "inferenceTypes": ["finding"],
          "locale": "en-US",
          "verbose": false,
          "includeEvidence": false
        },
        "patients": [
          {
            "id": "111111",
            "details": {
              "sex": "female",
			  "birthDate" : "2011-08-31T18:00:00+00:00",
              "clinicalInfo": [
                {
                  "resourceType": "Observation",
                  "status": "unknown",
                  "code": {
                    "coding": [
                      {
                        "system": "http://www.nlm.nih.gov/research/umls",
                        "code": "C0018802",
                        "display": "MalignantNeoplasms"
                      }
                    ]
                  },
                  "valueBoolean": "true"
                }
              ]
            },
            "encounters": [
              {
                "id": "encounterid1",
                "period": {
                  "start": "2021-8-28T00:00:00",
                  "end": "2021-8-28T00:00:00"
                },
                "class": "inpatient"
              }
            ],
            "patientDocuments": [
              {
                "type": "note",
                "clinicalType": "radiologyReport",
                "id": "docid1",
                "language": "en",
                "authors": [
                  {
                    "id": "authorid1",
                    "fullName": "authorname1"
                  }
                ],
                "specialtyType": "radiology",
                "createdAt": "2021-8-28T00:00:00",
                "administrativeMetadata": {
                  "orderedProcedures": [
                    {
                      "code": {
                        "coding": [
                          {
                            "system": "Https://loinc.org",
                            "code": "24627-2",
                            "display": "CT CHEST"
                          }
                        ]
                      },
                      "description": "CT CHEST"
                    }
                  ],
                  "encounterId": "encounterid1"
                },
                "content": {
                  "sourceType": "inline",
                  "value": "\n\n\nFINDINGS:\nIn the right upper lobe, there is a new mass measuring 5.6 x 4.5 x 3.4 cm.\nA lobulated soft tissue mass is identified in the superior right lower lobe abutting the major fissure measuring 5.4 x 4.3 x 3.7 cm (series 3 image 94, coronal image 110).\nA 4 mm nodule in the right lower lobe (series 3, image 72) is increased dating back to 6/29/2012. This may represent lower lobe metastasis.\n\nIMPRESSION: 4 cm pulmonary nodule posterior aspect of the right upper lobe necessitating additional imaging as described.\n\t\t"
                }
              }
            ]
          }
        ]
      }
    }
```