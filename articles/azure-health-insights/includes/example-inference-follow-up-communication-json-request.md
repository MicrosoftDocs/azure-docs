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
          "inferenceTypes": ["followupCommunication"],
          "locale": "en-US",
          "verbose": false,
          "includeEvidence": false
        },
        "patients": [
          {
            "id": "111111",
            "details": {
              "sex": "female",
			  "birthDate" : "1959-11-11T19:00:00+00:00",
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
                            "code": "36572-6",
                            "display": "XR CHEST AP"
                          }
                        ]
                      },
                      "description": "XR CHEST AP"
                    }
                  ],
                  "encounterId": "encounterid1"
                },
                "content": {
                  "sourceType": "inline",
                  "value" : "\r\n\r\n\r\n\nThe results were faxed to Julie Carter on July 6 2016 at 3 PM.\n\nThe results were sent via Powerscribe to George Brown, PA.\n\n\t\t"
				}
              }
            ]
          }
        ]
      }
    }
```