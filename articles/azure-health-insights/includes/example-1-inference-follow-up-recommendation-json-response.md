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
    "modelVersion": "2024-01-10-Preview"
  },
  "id": "555fe1b1-6d60-4ec3-b784-7056128139b9",
  "createdDateTime": "2024-01-12T07:10:40.1744625Z",
  "expirationDateTime": "2024-01-12T07:27:20.1744625Z",
  "lastUpdateDateTime": "2024-01-12T07:10:48.1815422Z",
  "status": "succeeded"
}
```