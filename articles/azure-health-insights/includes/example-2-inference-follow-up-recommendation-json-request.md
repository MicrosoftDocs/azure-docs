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
              "includeRecommendationsInReferences": true,
              "provideFocusedSentenceEvidence": true
            },
            "findingOptions": {
              "provideFocusedSentenceEvidence": false
            }
          },
          "inferenceTypes": ["followupRecommendation"],
          "locale": "en-US",
          "verbose": false,
          "includeEvidence": true
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
                  "start": "2014-2-20T00:00:00",
                  "end": "2014-2-20T00:00:00"
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
                "createdAt": "2014-2-20T00:00:00",
                "administrativeMetadata": {
                  "orderedProcedures": [
                    {
                      "code": {
                        "coding": [
                          {
                            "system": "Https://loinc.org",
                            "code": "LP207608-3",
                            "display": "ULTRASOUND"
                          }
                        ]
                      },
                      "description": "ULTRASOUND"
                    }
                  ],
                  "encounterId": "encounterid1"
                },
                "content": {
                  "sourceType": "inline",
                   "value" : " \n\nIMPRESSION:   \n \n1. Given its size, surgical \nconsultation is recommended.\n2. Recommend ultrasound.\n3. Recommend screening.\n\nRECOMMENDATION:\n\nTHIS IS A (AAA) CASE. An aneurysm follow up program has been developed to facilitate the monitoring of your patient and the next ultrasound will be arranged based on approved guidelines. \nKP NW Practice Guidelines for Surveillance of a AAA: Recommended Imaging Intervals \n<3cm No need for followup \n3-3.9cm Every 3 years \n4-4.4cm Every 2 years \n4.5-4.9cm Female every 6 months, Male every year \n5.0-5.5cm Male every 6 months \nReferral to Vascular Surgery: \nFemale >5cm \nMale <60 years of age; >5cm \nMale >61 years of age; >5.5cm.\nIf infrarenal aorta not well seen on US, repeat in 1 month with 24 hour liquid diet. If still not well seen, CT non-contrast abd/pelvis.\n"
				}
              }
            ]
          }
        ]
      }
    }
```