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
        "patientId": "11111",
        "inferences": [
          {
            "kind": "guidance",
            "finding": {
              "kind": "finding",
              "finding": {
                "resourceType": "Observation",
                "id": "3781",
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
                          "code": "703248002",
                          "display": "APPEARANCE (OBSERVABLE ENTITY)"
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
                    "valueBoolean": true
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
            "identifier": {
              "coding": [
                {
                  "system": "http://radlex.org",
                  "code": "RID50149",
                  "display": "PULMONARY NODULE"
                }
              ]
            },
            "ranking": "low",
            "missingGuidanceInformation": [
              "SIZE"
            ]
          },
          {
            "kind": "guidance",
            "finding": {
              "kind": "finding",
              "finding": {
                "resourceType": "Observation",
                "id": "3782",
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
                    "valueBoolean": true
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
                      "value": 8,
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
            "identifier": {
              "coding": [
                {
                  "system": "http://radlex.org",
                  "code": "RID50149",
                  "display": "PULMONARY NODULE"
                }
              ]
            },
            "presentGuidanceInformation": [
              {
                "presentGuidanceItem": "LOBE",
                "presentGuidanceValues": [
                  "RIGHT UPPER LOBE"
                ]
              },
              {
                "presentGuidanceItem": "SIZE",
                "sizes": [
                  {
                    "resourceType": "Observation",
                    "component": [
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
                          "value": 8,
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
                  }
                ],
                "presentGuidanceValues": [
                  "SIZE"
                ]
              }
            ],
            "ranking": "low",
            "recommendationProposals": [
              {
                "kind": "followupRecommendation",
                "effectivePeriod": {
                  "start": "2014-08-19",
                  "end": "2015-02-20"
                },
                "findings": [],
                "isConditional": false,
                "isOption": true,
                "isGuideline": false,
                "isHedging": false,
                "recommendedProcedure": {
                  "kind": "imagingProcedureRecommendation",
                  "imagingProcedures": [
                    {
                      "modality": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "77477000",
                            "display": "COMPUTERIZED AXIAL TOMOGRAPHY (PROCEDURE)"
                          }
                        ]
                      },
                      "anatomy": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "39607008",
                            "display": "LUNG STRUCTURE (BODY STRUCTURE)"
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                "kind": "followupRecommendation",
                "effectivePeriod": {
                  "start": "2015-08-14",
                  "end": "2016-02-20"
                },
                "findings": [],
                "isConditional": false,
                "isOption": true,
                "isGuideline": false,
                "isHedging": false,
                "recommendedProcedure": {
                  "kind": "imagingProcedureRecommendation",
                  "imagingProcedures": [
                    {
                      "modality": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "77477000",
                            "display": "COMPUTERIZED AXIAL TOMOGRAPHY (PROCEDURE)"
                          }
                        ]
                      },
                      "anatomy": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "39607008",
                            "display": "LUNG STRUCTURE (BODY STRUCTURE)"
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                "kind": "followupRecommendation",
                "effectivePeriod": {
                  "start": "2015-08-14",
                  "end": "2016-02-20"
                },
                "findings": [],
                "isConditional": false,
                "isOption": true,
                "isGuideline": false,
                "isHedging": true,
                "recommendedProcedure": {
                  "kind": "imagingProcedureRecommendation",
                  "imagingProcedures": [
                    {
                      "modality": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "77477000",
                            "display": "COMPUTERIZED AXIAL TOMOGRAPHY (PROCEDURE)"
                          }
                        ]
                      },
                      "anatomy": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "39607008",
                            "display": "LUNG STRUCTURE (BODY STRUCTURE)"
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            "kind": "guidance",
            "finding": {
              "kind": "finding",
              "finding": {
                "resourceType": "Observation",
                "id": "3783",
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
                    "valueBoolean": true
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
                      "value": 6,
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
            "identifier": {
              "coding": [
                {
                  "system": "http://radlex.org",
                  "code": "RID50149",
                  "display": "PULMONARY NODULE"
                }
              ]
            },
            "presentGuidanceInformation": [
              {
                "presentGuidanceItem": "LOBE",
                "presentGuidanceValues": [
                  "RIGHT LUNG",
                  "RIGHT UPPER LOBE"
                ]
              },
              {
                "presentGuidanceItem": "SIZE",
                "sizes": [
                  {
                    "resourceType": "Observation",
                    "component": [
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
                          "value": 6,
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
                  }
                ],
                "presentGuidanceValues": [
                  "SIZE"
                ]
              }
            ],
            "ranking": "low",
            "recommendationProposals": [
              {
                "kind": "followupRecommendation",
                "effectivePeriod": {
                  "start": "2014-08-19",
                  "end": "2015-02-20"
                },
                "findings": [],
                "isConditional": false,
                "isOption": true,
                "isGuideline": false,
                "isHedging": false,
                "recommendedProcedure": {
                  "kind": "imagingProcedureRecommendation",
                  "imagingProcedures": [
                    {
                      "modality": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "77477000",
                            "display": "COMPUTERIZED AXIAL TOMOGRAPHY (PROCEDURE)"
                          }
                        ]
                      },
                      "anatomy": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "39607008",
                            "display": "LUNG STRUCTURE (BODY STRUCTURE)"
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                "kind": "followupRecommendation",
                "effectivePeriod": {
                  "start": "2015-08-14",
                  "end": "2016-02-20"
                },
                "findings": [],
                "isConditional": false,
                "isOption": true,
                "isGuideline": false,
                "isHedging": false,
                "recommendedProcedure": {
                  "kind": "imagingProcedureRecommendation",
                  "imagingProcedures": [
                    {
                      "modality": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "77477000",
                            "display": "COMPUTERIZED AXIAL TOMOGRAPHY (PROCEDURE)"
                          }
                        ]
                      },
                      "anatomy": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "39607008",
                            "display": "LUNG STRUCTURE (BODY STRUCTURE)"
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                "kind": "followupRecommendation",
                "effectivePeriod": {
                  "start": "2015-08-14",
                  "end": "2016-02-20"
                },
                "findings": [],
                "isConditional": false,
                "isOption": true,
                "isGuideline": false,
                "isHedging": true,
                "recommendedProcedure": {
                  "kind": "imagingProcedureRecommendation",
                  "imagingProcedures": [
                    {
                      "modality": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "77477000",
                            "display": "COMPUTERIZED AXIAL TOMOGRAPHY (PROCEDURE)"
                          }
                        ]
                      },
                      "anatomy": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "39607008",
                            "display": "LUNG STRUCTURE (BODY STRUCTURE)"
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            "kind": "guidance",
            "finding": {
              "kind": "finding",
              "finding": {
                "resourceType": "Observation",
                "id": "3784",
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
                    "valueBoolean": true
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
                      "value": 1.2,
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
            "identifier": {
              "coding": [
                {
                  "system": "http://radlex.org",
                  "code": "RID50149",
                  "display": "PULMONARY NODULE"
                }
              ]
            },
            "presentGuidanceInformation": [
              {
                "presentGuidanceItem": "LOBE",
                "presentGuidanceValues": [
                  "RIGHT UPPER LOBE"
                ]
              },
              {
                "presentGuidanceItem": "SIZE",
                "sizes": [
                  {
                    "resourceType": "Observation",
                    "component": [
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
                          "value": 1.2,
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
                  }
                ],
                "presentGuidanceValues": [
                  "SIZE"
                ]
              }
            ],
            "ranking": "high",
            "recommendationProposals": [
              {
                "kind": "followupRecommendation",
                "effectiveAt": "2014-05-21",
                "findings": [],
                "isConditional": false,
                "isOption": true,
                "isGuideline": false,
                "isHedging": true,
                "recommendedProcedure": {
                  "kind": "imagingProcedureRecommendation",
                  "imagingProcedures": [
                    {
                      "modality": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "450436003",
                            "display": "POSITRON EMISSION TOMOGRAPHY WITH COMPUTED TOMOGRAPHY (PROCEDURE)"
                          }
                        ]
                      },
                      "anatomy": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "39607008",
                            "display": "LUNG STRUCTURE (BODY STRUCTURE)"
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                "kind": "followupRecommendation",
                "effectiveAt": "2014-05-21",
                "findings": [],
                "isConditional": false,
                "isOption": true,
                "isGuideline": false,
                "isHedging": true,
                "recommendedProcedure": {
                  "kind": "imagingProcedureRecommendation",
                  "imagingProcedures": [
                    {
                      "modality": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "277590007",
                            "display": "IMAGING GUIDED BIOPSY (PROCEDURE)"
                          }
                        ]
                      },
                      "anatomy": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "39607008",
                            "display": "LUNG STRUCTURE (BODY STRUCTURE)"
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            "kind": "guidance",
            "finding": {
              "kind": "finding",
              "finding": {
                "resourceType": "Observation",
                "id": "3785",
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
                          "code": "7771000",
                          "display": "LEFT (QUALIFIER VALUE)"
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
                    "valueBoolean": true
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
            "identifier": {
              "coding": [
                {
                  "system": "http://radlex.org",
                  "code": "RID50149",
                  "display": "PULMONARY NODULE"
                }
              ]
            },
            "presentGuidanceInformation": [
              {
                "presentGuidanceItem": "LOBE",
                "presentGuidanceValues": [
                  "LEFT UPPER LOBE"
                ]
              },
              {
                "presentGuidanceItem": "SIZE",
                "sizes": [
                  {
                    "resourceType": "Observation",
                    "component": [
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
                  }
                ],
                "presentGuidanceValues": [
                  "SIZE"
                ]
              }
            ],
            "ranking": "low",
            "recommendationProposals": [
              {
                "kind": "followupRecommendation",
                "effectiveAt": "2015-02-20",
                "findings": [],
                "isConditional": false,
                "isOption": true,
                "isGuideline": false,
                "isHedging": false,
                "recommendedProcedure": {
                  "kind": "imagingProcedureRecommendation",
                  "imagingProcedures": [
                    {
                      "modality": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "77477000",
                            "display": "COMPUTERIZED AXIAL TOMOGRAPHY (PROCEDURE)"
                          }
                        ]
                      },
                      "anatomy": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "39607008",
                            "display": "LUNG STRUCTURE (BODY STRUCTURE)"
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                "kind": "followupRecommendation",
                "findings": [],
                "isConditional": false,
                "isOption": true,
                "isGuideline": false,
                "isHedging": false,
                "recommendedProcedure": {
                  "kind": "imagingProcedureRecommendation",
                  "imagingProcedures": [
                    {
                      "modality": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "266750002",
                            "display": "NO FOLLOW-UP ARRANGED (FINDING)"
                          }
                        ]
                      },
                      "anatomy": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "279495008",
                            "display": "HUMAN BODY STRUCTURE (BODY STRUCTURE)"
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            "kind": "guidance",
            "finding": {
              "kind": "finding",
              "finding": {
                "resourceType": "Observation",
                "id": "3786",
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
                          "code": "RID1327",
                          "display": "UPPER LOBE OF LEFT LUNG"
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
                          "code": "7771000",
                          "display": "LEFT (QUALIFIER VALUE)"
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
                    "valueBoolean": true
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
                      "value": 8,
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
            "identifier": {
              "coding": [
                {
                  "system": "http://radlex.org",
                  "code": "RID50149",
                  "display": "PULMONARY NODULE"
                }
              ]
            },
            "presentGuidanceInformation": [
              {
                "presentGuidanceItem": "LOBE",
                "presentGuidanceValues": [
                  "LEFT UPPER LOBE"
                ]
              },
              {
                "presentGuidanceItem": "SIZE",
                "sizes": [
                  {
                    "resourceType": "Observation",
                    "component": [
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
                          "value": 8,
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
                  }
                ],
                "presentGuidanceValues": [
                  "SIZE"
                ]
              }
            ],
            "ranking": "low",
            "recommendationProposals": [
              {
                "kind": "followupRecommendation",
                "effectivePeriod": {
                  "start": "2014-08-19",
                  "end": "2015-02-20"
                },
                "findings": [],
                "isConditional": false,
                "isOption": true,
                "isGuideline": false,
                "isHedging": false,
                "recommendedProcedure": {
                  "kind": "imagingProcedureRecommendation",
                  "imagingProcedures": [
                    {
                      "modality": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "77477000",
                            "display": "COMPUTERIZED AXIAL TOMOGRAPHY (PROCEDURE)"
                          }
                        ]
                      },
                      "anatomy": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "39607008",
                            "display": "LUNG STRUCTURE (BODY STRUCTURE)"
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                "kind": "followupRecommendation",
                "effectivePeriod": {
                  "start": "2015-08-14",
                  "end": "2016-02-20"
                },
                "findings": [],
                "isConditional": false,
                "isOption": true,
                "isGuideline": false,
                "isHedging": false,
                "recommendedProcedure": {
                  "kind": "imagingProcedureRecommendation",
                  "imagingProcedures": [
                    {
                      "modality": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "77477000",
                            "display": "COMPUTERIZED AXIAL TOMOGRAPHY (PROCEDURE)"
                          }
                        ]
                      },
                      "anatomy": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "39607008",
                            "display": "LUNG STRUCTURE (BODY STRUCTURE)"
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                "kind": "followupRecommendation",
                "effectivePeriod": {
                  "start": "2015-08-14",
                  "end": "2016-02-20"
                },
                "findings": [],
                "isConditional": false,
                "isOption": true,
                "isGuideline": false,
                "isHedging": true,
                "recommendedProcedure": {
                  "kind": "imagingProcedureRecommendation",
                  "imagingProcedures": [
                    {
                      "modality": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "77477000",
                            "display": "COMPUTERIZED AXIAL TOMOGRAPHY (PROCEDURE)"
                          }
                        ]
                      },
                      "anatomy": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "39607008",
                            "display": "LUNG STRUCTURE (BODY STRUCTURE)"
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            "kind": "guidance",
            "finding": {
              "kind": "finding",
              "finding": {
                "resourceType": "Observation",
                "id": "3797",
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
                          "code": "RID1338",
                          "display": "LOWER LOBE OF LEFT LUNG"
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
                          "code": "7771000",
                          "display": "LEFT (QUALIFIER VALUE)"
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
                          "code": "703248002",
                          "display": "APPEARANCE (OBSERVABLE ENTITY)"
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
                    "valueBoolean": true
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
                      "value": 2,
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
            "identifier": {
              "coding": [
                {
                  "system": "http://radlex.org",
                  "code": "RID50149",
                  "display": "PULMONARY NODULE"
                }
              ]
            },
            "presentGuidanceInformation": [
              {
                "presentGuidanceItem": "LOBE",
                "presentGuidanceValues": [
                  "LEFT LOWER LOBE"
                ]
              },
              {
                "presentGuidanceItem": "SIZE",
                "sizes": [
                  {
                    "resourceType": "Observation",
                    "component": [
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
                          "value": 2,
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
                  }
                ],
                "presentGuidanceValues": [
                  "SIZE"
                ]
              }
            ],
            "ranking": "low",
            "recommendationProposals": [
              {
                "kind": "followupRecommendation",
                "effectiveAt": "2015-02-20",
                "findings": [],
                "isConditional": false,
                "isOption": true,
                "isGuideline": false,
                "isHedging": false,
                "recommendedProcedure": {
                  "kind": "imagingProcedureRecommendation",
                  "imagingProcedures": [
                    {
                      "modality": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "77477000",
                            "display": "COMPUTERIZED AXIAL TOMOGRAPHY (PROCEDURE)"
                          }
                        ]
                      },
                      "anatomy": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "39607008",
                            "display": "LUNG STRUCTURE (BODY STRUCTURE)"
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                "kind": "followupRecommendation",
                "findings": [],
                "isConditional": false,
                "isOption": true,
                "isGuideline": false,
                "isHedging": false,
                "recommendedProcedure": {
                  "kind": "imagingProcedureRecommendation",
                  "imagingProcedures": [
                    {
                      "modality": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "266750002",
                            "display": "NO FOLLOW-UP ARRANGED (FINDING)"
                          }
                        ]
                      },
                      "anatomy": {
                        "coding": [
                          {
                            "system": "http://snomed.info/sct",
                            "code": "279495008",
                            "display": "HUMAN BODY STRUCTURE (BODY STRUCTURE)"
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            "kind": "guidance",
            "finding": {
              "kind": "finding",
              "finding": {
                "resourceType": "Observation",
                "id": "3791",
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
                          "code": "51440002",
                          "display": "RIGHT AND LEFT (QUALIFIER VALUE)"
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
                          "code": "703248002",
                          "display": "APPEARANCE (OBSERVABLE ENTITY)"
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
                    "valueBoolean": true
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
            },
            "identifier": {
              "coding": [
                {
                  "system": "http://radlex.org",
                  "code": "RID50149",
                  "display": "PULMONARY NODULE"
                }
              ]
            },
            "presentGuidanceInformation": [
              {
                "presentGuidanceItem": "LOBE",
                "presentGuidanceValues": [
                  "BILATERAL LUNGS"
                ]
              }
            ],
            "ranking": "low",
            "missingGuidanceInformation": [
              "SIZE"
            ]
          }
        ]
      }
    ],
    "modelVersion": "2025-03-17"
  },
  "id": "fca117",
  "createdAt": "2025-04-30T11:44:28Z",
  "expiresAt": "2025-05-01T11:44:28Z",
  "updatedAt": "2025-04-30T11:44:33Z",
  "status": "succeeded"
}
```