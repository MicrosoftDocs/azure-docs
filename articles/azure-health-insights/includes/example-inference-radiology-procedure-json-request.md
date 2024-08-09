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
          "inferenceTypes": ["radiologyProcedure"],
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
                            "system": "Http://hl7.org/fhir/ValueSet/cpt-all",
                            "code": "70460",
                            "display": "Ct head/brain w/dye"
                          }
                        ]
                      },
                      "description": "Ct head/brain w/dye"
                    }
                  ],
                  "encounterId": "encounterid1"
                },
                "content": {
                  "sourceType": "inline",
                  "value" : "\nExam:  Head CT with Contrast\r\n\r\nHistory:  Headaches for 2 months\r\n\r\nTechnique: Axial, sagittal, and coronal images were reconstructed from helical CT through the head without IV contrast.\r\n\r\nIV contrast:  100 mL IV Omnipaque 300.\r\n\r\nFindings: There is no mass effect. There is no abnormal enhancement of the brain or within injuries with IV contrast.\nHowever, there is no evidence of enhancing lesion in either internal auditory canal.\n\r\nImpression: Negative CT of the brain without IV contrast.\r I recommend a new brain CT within nine months.\n"
				}
              }
            ]
          }
        ]
      }
    }
```