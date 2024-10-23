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
          "inferenceTypes": ["completeOrderDiscrepancy"],
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
                            "code": "76856",
                            "display": "USPELVIS - US PELVIS COMPLETE"
                          }
                        ]
                      },
                      "description": "USPELVIS - US PELVIS COMPLETE"
                    }
                  ],
                  "encounterId": "encounterid1"
                },
                "content": {
                  "sourceType": "inline",
                  "value" : "\r\n\r\n\r\nCLINICAL HISTORY:   \r\n20-year-old female presenting with abdominal pain. Surgical history \r\nsignificant for appendectomy.\r\n \r\nCOMPARISON:   \r\nRight upper quadrant sonographic performed 1 day prior.\r\n \r\nTECHNIQUE:   \r\nTransabdominal grayscale pelvic sonography with duplex color Doppler \r\nand spectral waveform analysis of the ovaries.\r\n \r\nFINDINGS:   \r\nThe uterus is unremarkable given the transabdominal technique with \r\nendometrial echo complex within physiologic normal limits. The \r\novaries are symmetric in size. The right ovary measures 2.5 x 1.2 x 3.0 cm. The \r\nleft ovary measures 2.8 x 1.5 x 1.9 cm.\n \r\nOn duplex imaging, symmetrical signal.\r\n \r\nIMPRESSION:   \r\n1. Normal pelvic sonography. Findings of testicular torsion.\r\n\nA new US pelvis within the next 6 months is recommended.\n\nRecommend clinical follow up in 1-2 weeks.\n\nThese results have been discussed with Dr. Doe at 3 PM on November 1 2020.\n \r\n"
				}
              }
            ]
          }
        ]
      }
    }
```