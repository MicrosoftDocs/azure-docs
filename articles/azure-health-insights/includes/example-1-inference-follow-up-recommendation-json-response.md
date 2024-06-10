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
        "patientId": "111111",
        "inferences": [
          {
            "kind": "followupRecommendation",
            "findings": [],
            "isConditional": false,
            "isOption": false,
            "isGuideline": false,
            "isHedging": false,
            "recommendedProcedure": {
              "kind": "imagingProcedureRecommendation",
              "procedureCodes": [
                {
                  "coding": [
                    {
                      "system": "http://loinc.org",
                      "code": "25061-3",
                      "display": "US UNSPECIFIED BODY REGION"
                    }
                  ]
                }
              ],
              "imagingProcedures": [
                {
                  "modality": {
                    "extension": [
                      {
                        "extension": [
                          {
                            "url": "reference",
                            "valueReference": {
                              "reference": "docid1"
                            }
                          },
                          {
                            "url": "offset",
                            "valueInteger": 91
                          },
                          {
                            "url": "length",
                            "valueInteger": 10
                          }
                        ],
                        "url": "http://hl7.org/fhir/StructureDefinition/derivation-reference"
                      }
                    ],
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "16310003",
                        "display": "DIAGNOSTIC ULTRASONOGRAPHY (PROCEDURE)"
                      }
                    ]
                  },
                  "anatomy": {
                    "extension": [
                      {
                        "extension": [
                          {
                            "url": "reference",
                            "valueReference": {
                              "reference": "docid1"
                            }
                          },
                          {
                            "url": "offset",
                            "valueInteger": 91
                          },
                          {
                            "url": "length",
                            "valueInteger": 10
                          }
                        ],
                        "url": "http://hl7.org/fhir/StructureDefinition/derivation-reference"
                      }
                    ],
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
            },
            "extension": [
              {
                "extension": [
                  {
                    "url": "reference",
                    "valueReference": {
                      "reference": "docid1"
                    }
                  },
                  {
                    "url": "offset",
                    "valueInteger": 91
                  },
                  {
                    "url": "length",
                    "valueInteger": 10
                  }
                ],
                "url": "http://hl7.org/fhir/StructureDefinition/derivation-reference"
              }
            ]
          },
          {
            "kind": "followupRecommendation",
            "findings": [],
            "isConditional": false,
            "isOption": false,
            "isGuideline": false,
            "isHedging": false,
            "recommendedProcedure": {
              "kind": "imagingProcedureRecommendation",
              "imagingProcedures": [
                {
                  "modality": {
                    "extension": [
                      {
                        "extension": [
                          {
                            "url": "reference",
                            "valueReference": {
                              "reference": "docid1"
                            }
                          },
                          {
                            "url": "offset",
                            "valueInteger": 116
                          },
                          {
                            "url": "length",
                            "valueInteger": 9
                          }
                        ],
                        "url": "http://hl7.org/fhir/StructureDefinition/derivation-reference"
                      }
                    ],
                    "coding": [
                      {
                        "system": "http://snomed.info/sct",
                        "code": "363680008",
                        "display": "RADIOGRAPHIC IMAGING PROCEDURE (PROCEDURE)"
                      }
                    ]
                  },
                  "anatomy": {
                    "extension": [
                      {
                        "extension": [
                          {
                            "url": "reference",
                            "valueReference": {
                              "reference": "docid1"
                            }
                          },
                          {
                            "url": "offset",
                            "valueInteger": 116
                          },
                          {
                            "url": "length",
                            "valueInteger": 9
                          }
                        ],
                        "url": "http://hl7.org/fhir/StructureDefinition/derivation-reference"
                      }
                    ],
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
            },
            "extension": [
              {
                "extension": [
                  {
                    "url": "reference",
                    "valueReference": {
                      "reference": "docid1"
                    }
                  },
                  {
                    "url": "offset",
                    "valueInteger": 116
                  },
                  {
                    "url": "length",
                    "valueInteger": 9
                  }
                ],
                "url": "http://hl7.org/fhir/StructureDefinition/derivation-reference"
              }
            ]
          },
          {
            "kind": "followupRecommendation",
            "findings": [],
            "isConditional": false,
            "isOption": false,
            "isGuideline": false,
            "isHedging": false,
            "recommendedProcedure": {
              "kind": "genericProcedureRecommendation",
              "code": {
                "extension": [
                  {
                    "extension": [
                      {
                        "url": "reference",
                        "valueReference": {
                          "reference": "docid1"
                        }
                      },
                      {
                        "url": "offset",
                        "valueInteger": 39
                      },
                      {
                        "url": "length",
                        "valueInteger": 8
                      }
                    ],
                    "url": "http://hl7.org/fhir/StructureDefinition/derivation-reference"
                  },
                  {
                    "extension": [
                      {
                        "url": "reference",
                        "valueReference": {
                          "reference": "docid1"
                        }
                      },
                      {
                        "url": "offset",
                        "valueInteger": 49
                      },
                      {
                        "url": "length",
                        "valueInteger": 12
                      }
                    ],
                    "url": "http://hl7.org/fhir/StructureDefinition/derivation-reference"
                  }
                ],
                "coding": [
                  {
                    "system": "http://snomed.info/sct",
                    "code": "11429006",
                    "display": "CONSULTATION (PROCEDURE)"
                  }
                ]
              },
              "description": "CONSULTATION (PROCEDURE)"
            },
            "extension": [
              {
                "extension": [
                  {
                    "url": "reference",
                    "valueReference": {
                      "reference": "docid1"
                    }
                  },
                  {
                    "url": "offset",
                    "valueInteger": 39
                  },
                  {
                    "url": "length",
                    "valueInteger": 8
                  }
                ],
                "url": "http://hl7.org/fhir/StructureDefinition/derivation-reference"
              },
              {
                "extension": [
                  {
                    "url": "reference",
                    "valueReference": {
                      "reference": "docid1"
                    }
                  },
                  {
                    "url": "offset",
                    "valueInteger": 49
                  },
                  {
                    "url": "length",
                    "valueInteger": 12
                  }
                ],
                "url": "http://hl7.org/fhir/StructureDefinition/derivation-reference"
              }
            ]
          }
        ]
      }
    ],
    "modelVersion": "2024-04-16"
  },
  "id": "followupRecommendation1",
  "createdAt": "2024-05-14T15:48:01Z",
  "expiresAt": "2024-05-15T15:48:01Z",
  "updatedAt": "2024-05-14T15:48:05Z",
  "status": "succeeded"
}
```