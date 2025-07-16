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
            "kind": "finding",
            "finding": {
              "resourceType": "Observation",
              "id": "1071",
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
              "interpretation": [
                {
                  "coding": [
                    {
                      "system": "http://snomed.info/sct",
                      "code": "60022001",
                      "display": "POSSIBLE DIAGNOSIS (CONTEXTUAL QUALIFIER) (QUALIFIER VALUE)"
                    }
                  ]
                }
              ],
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
                        "code": "128462008",
                        "display": "SECONDARY MALIGNANT NEOPLASTIC DISEASE (DISORDER)"
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
                        "code": "39607008",
                        "display": "LUNG STRUCTURE (BODY STRUCTURE)"
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
                        "code": "RID13406",
                        "display": "ANATOMICAL LOBE"
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
                        "code": "RID1301",
                        "display": "LUNG"
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
                        "code": "RID13437",
                        "display": "LUNGS"
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
            "kind": "finding",
            "finding": {
              "resourceType": "Observation",
              "id": "1072",
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
              "interpretation": [
                {
                  "coding": [
                    {
                      "system": "http://snomed.info/sct",
                      "code": "7147002",
                      "display": "NEW (QUALIFIER VALUE)"
                    }
                  ]
                }
              ],
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
                        "code": "4147007",
                        "display": "MASS (MORPHOLOGIC ABNORMALITY)"
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
                        "code": "39607008",
                        "display": "LUNG STRUCTURE (BODY STRUCTURE)"
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
                        "code": "RID13406",
                        "display": "ANATOMICAL LOBE"
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
                        "code": "RID1301",
                        "display": "LUNG"
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
                        "code": "RID13437",
                        "display": "LUNGS"
                      }
                    ]
                  }
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "45651917",
                        "display": "LATERALITY (ATTRIBUTE)"
                      }
                    ]
                  },
                  "valueCodeableConcept": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "24028007",
                        "display": "RIGHT (QUALIFIER VALUE)"
                      }
                    ]
                  }
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "723851000000107",
                        "display": "GUIDANCE (QUALIFIER VALUE)"
                      }
                    ]
                  },
                  "valueCodeableConcept": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "258319005",
                        "display": "LUNG INVOLVEMENT STAGES (TUMOR STAGING)"
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
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://radlex.org",
                        "code": "246115007",
                        "display": "SIZE (ATTRIBUTE)"
                      }
                    ]
                  },
                  "valueQuantity": {
                    "value": 5.6,
                    "unit": "CENTIMETER"
                  },
                  "interpretation": [
                    {
                      "coding": [
                        {
                          "code": "15240007",
                          "display": "CURRENT"
                        }
                      ]
                    }
                  ]
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://radlex.org",
                        "code": "246115007",
                        "display": "SIZE (ATTRIBUTE)"
                      }
                    ]
                  },
                  "valueQuantity": {
                    "value": 4.5,
                    "unit": "CENTIMETER"
                  },
                  "interpretation": [
                    {
                      "coding": [
                        {
                          "code": "15240007",
                          "display": "CURRENT"
                        }
                      ]
                    }
                  ]
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://radlex.org",
                        "code": "246115007",
                        "display": "SIZE (ATTRIBUTE)"
                      }
                    ]
                  },
                  "valueQuantity": {
                    "value": 3.4,
                    "unit": "CENTIMETER"
                  },
                  "interpretation": [
                    {
                      "coding": [
                        {
                          "code": "15240007",
                          "display": "CURRENT"
                        }
                      ]
                    }
                  ]
                }
              ]
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
            "kind": "finding",
            "finding": {
              "resourceType": "Observation",
              "id": "1073",
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
                        "code": "4147007",
                        "display": "MASS (MORPHOLOGIC ABNORMALITY)"
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
                        "code": "39607008",
                        "display": "LUNG STRUCTURE (BODY STRUCTURE)"
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
                        "code": "RID13406",
                        "display": "ANATOMICAL LOBE"
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
                        "code": "RID1301",
                        "display": "LUNG"
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
                        "code": "RID13437",
                        "display": "LUNGS"
                      }
                    ]
                  }
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "45851105",
                        "display": "REGION (ATTRIBUTE)"
                      }
                    ]
                  },
                  "valueCodeableConcept": {
                    "coding": [
                      {
                        "system": "http://radlex.org",
                        "code": "RID1301",
                        "display": "LUNG"
                      }
                    ]
                  }
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "45851105",
                        "display": "REGION (ATTRIBUTE)"
                      }
                    ]
                  },
                  "valueCodeableConcept": {
                    "coding": [
                      {
                        "system": "http://radlex.org",
                        "code": "RID13437",
                        "display": "LUNGS"
                      }
                    ]
                  }
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "45651917",
                        "display": "LATERALITY (ATTRIBUTE)"
                      }
                    ]
                  },
                  "valueCodeableConcept": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "24028007",
                        "display": "RIGHT (QUALIFIER VALUE)"
                      }
                    ]
                  }
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "723851000000107",
                        "display": "GUIDANCE (QUALIFIER VALUE)"
                      }
                    ]
                  },
                  "valueCodeableConcept": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "258319005",
                        "display": "LUNG INVOLVEMENT STAGES (TUMOR STAGING)"
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
                  "valueString": "lobulated"
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
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://radlex.org",
                        "code": "246115007",
                        "display": "SIZE (ATTRIBUTE)"
                      }
                    ]
                  },
                  "valueQuantity": {
                    "value": 5.4,
                    "unit": "CENTIMETER"
                  },
                  "interpretation": [
                    {
                      "coding": [
                        {
                          "code": "15240007",
                          "display": "CURRENT"
                        }
                      ]
                    }
                  ]
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://radlex.org",
                        "code": "246115007",
                        "display": "SIZE (ATTRIBUTE)"
                      }
                    ]
                  },
                  "valueQuantity": {
                    "value": 4.3,
                    "unit": "CENTIMETER"
                  },
                  "interpretation": [
                    {
                      "coding": [
                        {
                          "code": "15240007",
                          "display": "CURRENT"
                        }
                      ]
                    }
                  ]
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://radlex.org",
                        "code": "246115007",
                        "display": "SIZE (ATTRIBUTE)"
                      }
                    ]
                  },
                  "valueQuantity": {
                    "value": 3.7,
                    "unit": "CENTIMETER"
                  },
                  "interpretation": [
                    {
                      "coding": [
                        {
                          "code": "15240007",
                          "display": "CURRENT"
                        }
                      ]
                    }
                  ]
                }
              ]
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
            "kind": "finding",
            "finding": {
              "resourceType": "Observation",
              "id": "1074",
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
              "interpretation": [
                {
                  "coding": [
                    {
                      "system": "http://snomed.info/sct",
                      "code": "36692007",
                      "display": "KNOWN (QUALIFIER VALUE)"
                    }
                  ]
                }
              ],
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
                        "code": "27925004",
                        "display": "NODULE (MORPHOLOGIC ABNORMALITY)"
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
                        "code": "39607008",
                        "display": "LUNG STRUCTURE (BODY STRUCTURE)"
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
                        "code": "RID13406",
                        "display": "ANATOMICAL LOBE"
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
                        "code": "RID1301",
                        "display": "LUNG"
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
                        "code": "RID13437",
                        "display": "LUNGS"
                      }
                    ]
                  }
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "45651917",
                        "display": "LATERALITY (ATTRIBUTE)"
                      }
                    ]
                  },
                  "valueCodeableConcept": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "24028007",
                        "display": "RIGHT (QUALIFIER VALUE)"
                      }
                    ]
                  }
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "288533004",
                        "display": "CHANGE VALUES (QUALIFIER VALUE)"
                      }
                    ]
                  },
                  "valueCodeableConcept": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "35105006",
                        "display": "INCREASED (QUALIFIER VALUE)"
                      }
                    ]
                  }
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "723851000000107",
                        "display": "GUIDANCE (QUALIFIER VALUE)"
                      }
                    ]
                  },
                  "valueCodeableConcept": {
                    "coding": [
                      {
                        "system": "http://radlex.org",
                        "code": "RID50149",
                        "display": "PULMONARY NODULE"
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
                        "code": "260369004",
                        "display": "INCREASING (QUALIFIER VALUE)"
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
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "46083823",
                        "display": "DATE AND TIME OF DAY (PROPERTY) (QUALIFIER VALUE)"
                      }
                    ]
                  },
                  "valueDateTime": "2012-06-29"
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://radlex.org",
                        "code": "246115007",
                        "display": "SIZE (ATTRIBUTE)"
                      }
                    ]
                  },
                  "valueQuantity": {
                    "value": 4,
                    "unit": "MILLIMETER"
                  },
                  "interpretation": [
                    {
                      "coding": [
                        {
                          "code": "15240007",
                          "display": "CURRENT"
                        }
                      ]
                    }
                  ]
                }
              ]
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
            "kind": "finding",
            "finding": {
              "resourceType": "Observation",
              "id": "1075",
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
                        "code": "27925004",
                        "display": "NODULE (MORPHOLOGIC ABNORMALITY)"
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
                        "code": "39607008",
                        "display": "LUNG STRUCTURE (BODY STRUCTURE)"
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
                        "code": "RID1303",
                        "display": "UPPER LOBE OF RIGHT LUNG"
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
                        "code": "RID13406",
                        "display": "ANATOMICAL LOBE"
                      }
                    ]
                  }
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "45651917",
                        "display": "LATERALITY (ATTRIBUTE)"
                      }
                    ]
                  },
                  "valueCodeableConcept": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "24028007",
                        "display": "RIGHT (QUALIFIER VALUE)"
                      }
                    ]
                  }
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "723851000000107",
                        "display": "GUIDANCE (QUALIFIER VALUE)"
                      }
                    ]
                  },
                  "valueCodeableConcept": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "258319005",
                        "display": "LUNG INVOLVEMENT STAGES (TUMOR STAGING)"
                      }
                    ]
                  }
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "723851000000107",
                        "display": "GUIDANCE (QUALIFIER VALUE)"
                      }
                    ]
                  },
                  "valueCodeableConcept": {
                    "coding": [
                      {
                        "system": "http://radlex.org",
                        "code": "RID50149",
                        "display": "PULMONARY NODULE"
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
                },
                {
                  "code": {
                    "coding": [
                      {
                        "system": "http://radlex.org",
                        "code": "246115007",
                        "display": "SIZE (ATTRIBUTE)"
                      }
                    ]
                  },
                  "valueQuantity": {
                    "value": 4,
                    "unit": "CENTIMETER"
                  },
                  "interpretation": [
                    {
                      "coding": [
                        {
                          "code": "15240007",
                          "display": "CURRENT"
                        }
                      ]
                    }
                  ]
                }
              ]
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
  "id": "fca107",
  "createdAt": "2025-04-30T09:48:01Z",
  "expiresAt": "2025-05-01T09:48:01Z",
  "updatedAt": "2025-04-30T09:48:05Z",
  "status": "succeeded"
}
```