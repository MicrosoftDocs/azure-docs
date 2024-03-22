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
            "kind": "finding",
            "finding": {
              "resourceType": "Observation",
              "id": "943",
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
                    "valueString": "Findings"
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
              "id": "944",
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
                    "valueString": "Findings"
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
              "id": "945",
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
                    "valueString": "Findings"
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
              "id": "946",
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
                    "valueString": "Findings"
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
              "id": "947",
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
                    "valueString": "Impresssions"
                  }
                ],
                "url": "section"
              }
            ]
          }
        ]
      }
    ],
    "modelVersion": "2024-01-10-Preview"
  },
  "id": "dbff77ce-e28f-4c24-a298-53db82c2e37c",
  "createdDateTime": "2024-01-12T07:24:44.9837229Z",
  "expirationDateTime": "2024-01-12T07:41:24.9837229Z",
  "lastUpdateDateTime": "2024-01-12T07:24:52.5370766Z",
  "status": "succeeded"
}
```