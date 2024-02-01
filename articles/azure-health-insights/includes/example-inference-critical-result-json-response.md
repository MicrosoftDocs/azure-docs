---
author: JanSchietse
ms.author: janschietse
ms.date: 01/25/2024
ms.topic: include
ms.service: azure-health-insights
---


```json
{
  "result": {
    "patientResults": [
      {
        "patientId": "11111",
        "inferences": [
          {
            "kind": "criticalResult",
            "result": {
              "description": "NEW FRACTURE",
              "finding": {
                "resourceType": "Observation",
                "id": "722",
                "status": "unknown",
                "category": [
                  {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "439401001",
                        "display": "DIAGNOSIS (OBSERVABLE ENTITY)"
                      }
                    ]
                  }
                ],
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
            }
          },
          {
            "kind": "criticalResult",
            "result": {
              "description": "NEW FRACTURE",
              "finding": {
                "resourceType": "Observation",
                "id": "724",
                "status": "unknown",
                "category": [
                  {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "439401001",
                        "display": "DIAGNOSIS (OBSERVABLE ENTITY)"
                      }
                    ]
                  }
                ],
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
            }
          }
        ]
      }
    ],
    "modelVersion": "2024-01-10-Preview"
  },
  "id": "780e4802-2a64-44d9-a108-bda47f477198",
  "createdDateTime": "2024-01-12T07:35:57.9734608Z",
  "expirationDateTime": "2024-01-12T07:52:37.9734608Z",
  "lastUpdateDateTime": "2024-01-12T07:36:04.755901Z",
  "status": "succeeded"
}
```