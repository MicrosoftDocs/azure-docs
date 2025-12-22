---
author: JanSchietse
ms.author: janschietse
ms.date: 03/17/2025
ms.topic: include
ms.service: azure-health-insights
---


```json
{
  "result": {
    "patientResults": [
      {
        "patientId": "111111",
        "inferences": [
          {
            "kind": "criticalResult",
            "result": {
              "description": "NEW FRACTURE",
              "finding": {
                "resourceType": "Observation",
                "id": "872",
                "status": "unknown",
                "code": {
                  "coding": [
                    {
                      "system": "http://snomed.info/sct",
                      "code": "404684003",
                      "display": "CLINICAL FINDING (FINDING)"
                    }
                  ]
                },
                "component": [
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "131195008",
                          "display": "SUBJECT OF INFORMATION (ATTRIBUTE)"
                        }
                      ]
                    },
                    "valueCodeableConcept": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "72704001",
                          "display": "FRACTURE (MORPHOLOGIC ABNORMALITY)"
                        }
                      ]
                    }
                  },
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "131195008",
                          "display": "SUBJECT OF INFORMATION (ATTRIBUTE)"
                        }
                      ]
                    },
                    "valueCodeableConcept": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "417163006",
                          "display": "TRAUMATIC AND/OR NON-TRAUMATIC INJURY (DISORDER)"
                        }
                      ]
                    }
                  },
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "722871000000108",
                          "display": "ANATOMY (QUALIFIER VALUE)"
                        }
                      ]
                    },
                    "valueCodeableConcept": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "30021000",
                          "display": "LOWER LEG STRUCTURE (BODY STRUCTURE)"
                        }
                      ]
                    }
                  },
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "722871000000108",
                          "display": "ANATOMY (QUALIFIER VALUE)"
                        }
                      ]
                    },
                    "valueCodeableConcept": {
                      "coding": [
                        {
                          "system": "http://radlex.org",
                          "code": "RID2871",
                          "display": "FIBULA"
                        }
                      ]
                    }
                  },
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "722871000000108",
                          "display": "ANATOMY (QUALIFIER VALUE)"
                        }
                      ]
                    },
                    "valueCodeableConcept": {
                      "coding": [
                        {
                          "system": "http://radlex.org",
                          "code": "RID28569",
                          "display": "SET OF BONE ORGANS"
                        }
                      ]
                    }
                  },
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "722871000000108",
                          "display": "ANATOMY (QUALIFIER VALUE)"
                        }
                      ]
                    },
                    "valueCodeableConcept": {
                      "coding": [
                        {
                          "system": "http://radlex.org",
                          "code": "RID13197",
                          "display": "BONE ORGAN"
                        }
                      ]
                    }
                  },
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "362981000",
                          "display": "QUALIFIER VALUE (QUALIFIER VALUE)"
                        }
                      ]
                    },
                    "valueCodeableConcept": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "112638000",
                          "display": "DISPLACEMENT (MORPHOLOGIC ABNORMALITY)"
                        }
                      ]
                    }
                  },
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "46150521",
                          "display": "MULTIPLE (QUALIFIER VALUE)"
                        }
                      ]
                    },
                    "valueBoolean": false
                  }
                ]
              }
            },
            "extension": [
              {
                "extension": [
                  {
                    "url": "code",
                    "valueString": "18782-3"
                  },
                  {
                    "url": "codingSystem",
                    "valueString": "2.16.840.1.113883.6.1"
                  },
                  {
                    "url": "codingSystemName",
                    "valueString": "http://loinc.org"
                  },
                  {
                    "url": "displayName",
                    "valueString": "RADIOLOGY STUDY OBSERVATION (NARRATIVE)"
                  }
                ],
                "url": "section"
              }
            ]
          },
          {
            "kind": "criticalResult",
            "result": {
              "description": "NEW FRACTURE",
              "finding": {
                "resourceType": "Observation",
                "id": "874",
                "status": "unknown",
                "code": {
                  "coding": [
                    {
                      "system": "http://snomed.info/sct",
                      "code": "404684003",
                      "display": "CLINICAL FINDING (FINDING)"
                    }
                  ]
                },
                "component": [
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "131195008",
                          "display": "SUBJECT OF INFORMATION (ATTRIBUTE)"
                        }
                      ]
                    },
                    "valueCodeableConcept": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "72704001",
                          "display": "FRACTURE (MORPHOLOGIC ABNORMALITY)"
                        }
                      ]
                    }
                  },
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "131195008",
                          "display": "SUBJECT OF INFORMATION (ATTRIBUTE)"
                        }
                      ]
                    },
                    "valueCodeableConcept": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "417163006",
                          "display": "TRAUMATIC AND/OR NON-TRAUMATIC INJURY (DISORDER)"
                        }
                      ]
                    }
                  },
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "722871000000108",
                          "display": "ANATOMY (QUALIFIER VALUE)"
                        }
                      ]
                    },
                    "valueCodeableConcept": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "30021000",
                          "display": "LOWER LEG STRUCTURE (BODY STRUCTURE)"
                        }
                      ]
                    }
                  },
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "722871000000108",
                          "display": "ANATOMY (QUALIFIER VALUE)"
                        }
                      ]
                    },
                    "valueCodeableConcept": {
                      "coding": [
                        {
                          "system": "http://radlex.org",
                          "code": "RID2871",
                          "display": "FIBULA"
                        }
                      ]
                    }
                  },
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "722871000000108",
                          "display": "ANATOMY (QUALIFIER VALUE)"
                        }
                      ]
                    },
                    "valueCodeableConcept": {
                      "coding": [
                        {
                          "system": "http://radlex.org",
                          "code": "RID28569",
                          "display": "SET OF BONE ORGANS"
                        }
                      ]
                    }
                  },
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "722871000000108",
                          "display": "ANATOMY (QUALIFIER VALUE)"
                        }
                      ]
                    },
                    "valueCodeableConcept": {
                      "coding": [
                        {
                          "system": "http://radlex.org",
                          "code": "RID13197",
                          "display": "BONE ORGAN"
                        }
                      ]
                    }
                  },
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "362981000",
                          "display": "QUALIFIER VALUE (QUALIFIER VALUE)"
                        }
                      ]
                    },
                    "valueCodeableConcept": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "112638000",
                          "display": "DISPLACEMENT (MORPHOLOGIC ABNORMALITY)"
                        }
                      ]
                    }
                  },
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://snomed.info/sct",
                          "code": "46150521",
                          "display": "MULTIPLE (QUALIFIER VALUE)"
                        }
                      ]
                    },
                    "valueBoolean": false
                  }
                ]
              }
            },
            "extension": [
              {
                "extension": [
                  {
                    "url": "code",
                    "valueString": "19005-8"
                  },
                  {
                    "url": "codingSystem",
                    "valueString": "2.16.840.1.113883.6.1"
                  },
                  {
                    "url": "codingSystemName",
                    "valueString": "http://loinc.org"
                  },
                  {
                    "url": "displayName",
                    "valueString": "RADIOLOGY IMAGING STUDY (NARRATIVE)"
                  }
                ],
                "url": "section"
              }
            ]
          }
        ]
      }
    ],
    "modelVersion": "2025-03-17"
  },
  "id": "fca106",
  "createdAt": "2025-04-30T09:37:27Z",
  "expiresAt": "2025-05-01T09:37:27Z",
  "updatedAt": "2025-04-30T09:37:31Z",
  "status": "succeeded"
}
```