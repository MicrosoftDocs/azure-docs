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
                "url": "modality_sentences",
                "valueString": "81-102"
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
            "isGuideline": true,
            "isHedging": false,
            "recommendedProcedure": {
              "kind": "imagingProcedureRecommendation",
              "procedureCodes": [
                {
                  "coding": [
                    {
                      "system": "http://loinc.org",
                      "code": "86995-8",
                      "display": "GUIDANCE FOR ABSCESS"
                    }
                  ]
                },
                {
                  "coding": [
                    {
                      "system": "http://loinc.org",
                      "code": "25061-3",
                      "display": "US UNSPECIFIED BODY REGION"
                    }
                  ]
                },
                {
                  "coding": [
                    {
                      "system": "http://loinc.org",
                      "code": "25045-6",
                      "display": "CT UNSPECIFIED BODY REGION"
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
                            "valueInteger": 167
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 170
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
                            "valueInteger": 179
                          },
                          {
                            "url": "length",
                            "valueInteger": 6
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
                            "valueInteger": 186
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 189
                          },
                          {
                            "url": "length",
                            "valueInteger": 7
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
                            "valueInteger": 197
                          },
                          {
                            "url": "length",
                            "valueInteger": 3
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
                            "valueInteger": 201
                          },
                          {
                            "url": "length",
                            "valueInteger": 4
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
                            "valueInteger": 206
                          },
                          {
                            "url": "length",
                            "valueInteger": 9
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
                            "valueInteger": 216
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 219
                          },
                          {
                            "url": "length",
                            "valueInteger": 10
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
                            "valueInteger": 230
                          },
                          {
                            "url": "length",
                            "valueInteger": 3
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
                            "valueInteger": 234
                          },
                          {
                            "url": "length",
                            "valueInteger": 10
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
                            "valueInteger": 245
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 248
                          },
                          {
                            "url": "length",
                            "valueInteger": 4
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
                            "valueInteger": 253
                          },
                          {
                            "url": "length",
                            "valueInteger": 7
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
                            "valueInteger": 261
                          },
                          {
                            "url": "length",
                            "valueInteger": 3
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
                            "valueInteger": 265
                          },
                          {
                            "url": "length",
                            "valueInteger": 3
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
                            "valueInteger": 269
                          },
                          {
                            "url": "length",
                            "valueInteger": 4
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
                            "valueInteger": 274
                          },
                          {
                            "url": "length",
                            "valueInteger": 10
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
                            "valueInteger": 285
                          },
                          {
                            "url": "length",
                            "valueInteger": 4
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
                            "valueInteger": 290
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 293
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
                            "valueInteger": 302
                          },
                          {
                            "url": "length",
                            "valueInteger": 5
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
                            "valueInteger": 308
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 311
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
                            "valueInteger": 320
                          },
                          {
                            "url": "length",
                            "valueInteger": 10
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
                            "valueInteger": 330
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 333
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 336
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 339
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
                            "valueInteger": 348
                          },
                          {
                            "url": "length",
                            "valueInteger": 10
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
                            "valueInteger": 359
                          },
                          {
                            "url": "length",
                            "valueInteger": 3
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
                            "valueInteger": 363
                          },
                          {
                            "url": "length",
                            "valueInteger": 12
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
                            "valueInteger": 376
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 379
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 381
                          },
                          {
                            "url": "length",
                            "valueInteger": 3
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
                            "valueInteger": 384
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 386
                          },
                          {
                            "url": "length",
                            "valueInteger": 11
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
                            "valueInteger": 398
                          },
                          {
                            "url": "length",
                            "valueInteger": 7
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
                            "valueInteger": 406
                          },
                          {
                            "url": "length",
                            "valueInteger": 9
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
                            "valueInteger": 417
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 418
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 419
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 422
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 425
                          },
                          {
                            "url": "length",
                            "valueInteger": 4
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
                            "valueInteger": 430
                          },
                          {
                            "url": "length",
                            "valueInteger": 3
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
                            "valueInteger": 434
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
                            "valueInteger": 444
                          },
                          {
                            "url": "length",
                            "valueInteger": 5
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
                            "valueInteger": 449
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 452
                          },
                          {
                            "url": "length",
                            "valueInteger": 13
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
                            "valueInteger": 467
                          },
                          {
                            "url": "length",
                            "valueInteger": 5
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
                            "valueInteger": 472
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 475
                          },
                          {
                            "url": "length",
                            "valueInteger": 13
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
                            "valueInteger": 490
                          },
                          {
                            "url": "length",
                            "valueInteger": 7
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
                            "valueInteger": 497
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 500
                          },
                          {
                            "url": "length",
                            "valueInteger": 6
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
                            "valueInteger": 507
                          },
                          {
                            "url": "length",
                            "valueInteger": 14
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
                            "valueInteger": 521
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 523
                          },
                          {
                            "url": "length",
                            "valueInteger": 4
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
                            "valueInteger": 528
                          },
                          {
                            "url": "length",
                            "valueInteger": 10
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
                            "valueInteger": 540
                          },
                          {
                            "url": "length",
                            "valueInteger": 7
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
                            "valueInteger": 547
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 550
                          },
                          {
                            "url": "length",
                            "valueInteger": 4
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
                            "valueInteger": 555
                          },
                          {
                            "url": "length",
                            "valueInteger": 14
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
                            "valueInteger": 571
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
                            "valueInteger": 580
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 583
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
                            "valueInteger": 592
                          },
                          {
                            "url": "length",
                            "valueInteger": 7
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
                            "valueInteger": 599
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 602
                          },
                          {
                            "url": "length",
                            "valueInteger": 6
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
                            "valueInteger": 609
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 610
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 611
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 615
                          },
                          {
                            "url": "length",
                            "valueInteger": 4
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
                            "valueInteger": 620
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 621
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 624
                          },
                          {
                            "url": "length",
                            "valueInteger": 5
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
                            "valueInteger": 630
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 633
                          },
                          {
                            "url": "length",
                            "valueInteger": 3
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
                            "valueInteger": 636
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 638
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 639
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 640
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 644
                          },
                          {
                            "url": "length",
                            "valueInteger": 4
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
                            "valueInteger": 649
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 650
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 653
                          },
                          {
                            "url": "length",
                            "valueInteger": 5
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
                            "valueInteger": 659
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 662
                          },
                          {
                            "url": "length",
                            "valueInteger": 3
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
                            "valueInteger": 665
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 667
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 668
                          },
                          {
                            "url": "length",
                            "valueInteger": 3
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
                            "valueInteger": 671
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 673
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 675
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 678
                          },
                          {
                            "url": "length",
                            "valueInteger": 10
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
                            "valueInteger": 689
                          },
                          {
                            "url": "length",
                            "valueInteger": 5
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
                            "valueInteger": 695
                          },
                          {
                            "url": "length",
                            "valueInteger": 3
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
                            "valueInteger": 699
                          },
                          {
                            "url": "length",
                            "valueInteger": 4
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
                            "valueInteger": 704
                          },
                          {
                            "url": "length",
                            "valueInteger": 4
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
                            "valueInteger": 709
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 712
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 714
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 716
                          },
                          {
                            "url": "length",
                            "valueInteger": 6
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
                            "valueInteger": 723
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 726
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 728
                          },
                          {
                            "url": "length",
                            "valueInteger": 5
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
                            "valueInteger": 734
                          },
                          {
                            "url": "length",
                            "valueInteger": 4
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
                            "valueInteger": 739
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 742
                          },
                          {
                            "url": "length",
                            "valueInteger": 4
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
                            "valueInteger": 747
                          },
                          {
                            "url": "length",
                            "valueInteger": 6
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
                            "valueInteger": 754
                          },
                          {
                            "url": "length",
                            "valueInteger": 4
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
                            "valueInteger": 758
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 760
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 763
                          },
                          {
                            "url": "length",
                            "valueInteger": 5
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
                            "valueInteger": 769
                          },
                          {
                            "url": "length",
                            "valueInteger": 3
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
                            "valueInteger": 773
                          },
                          {
                            "url": "length",
                            "valueInteger": 4
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
                            "valueInteger": 778
                          },
                          {
                            "url": "length",
                            "valueInteger": 4
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
                            "valueInteger": 782
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 784
                          },
                          {
                            "url": "length",
                            "valueInteger": 2
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
                            "valueInteger": 787
                          },
                          {
                            "url": "length",
                            "valueInteger": 12
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
                            "valueInteger": 800
                          },
                          {
                            "url": "length",
                            "valueInteger": 3
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
                            "valueInteger": 803
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                            "valueInteger": 804
                          },
                          {
                            "url": "length",
                            "valueInteger": 6
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
                            "valueInteger": 810
                          },
                          {
                            "url": "length",
                            "valueInteger": 1
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
                "url": "modality_sentences",
                "valueString": "167-331;333-415;417-442;444-465;467-488;490-538;540-569;571-613;615-642;644-674;675-759;760-811"
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
                    "valueInteger": 167
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 170
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
                    "valueInteger": 179
                  },
                  {
                    "url": "length",
                    "valueInteger": 6
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
                    "valueInteger": 186
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 189
                  },
                  {
                    "url": "length",
                    "valueInteger": 7
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
                    "valueInteger": 197
                  },
                  {
                    "url": "length",
                    "valueInteger": 3
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
                    "valueInteger": 201
                  },
                  {
                    "url": "length",
                    "valueInteger": 4
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
                    "valueInteger": 206
                  },
                  {
                    "url": "length",
                    "valueInteger": 9
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
                    "valueInteger": 216
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 219
                  },
                  {
                    "url": "length",
                    "valueInteger": 10
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
                    "valueInteger": 230
                  },
                  {
                    "url": "length",
                    "valueInteger": 3
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
                    "valueInteger": 234
                  },
                  {
                    "url": "length",
                    "valueInteger": 10
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
                    "valueInteger": 245
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 248
                  },
                  {
                    "url": "length",
                    "valueInteger": 4
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
                    "valueInteger": 253
                  },
                  {
                    "url": "length",
                    "valueInteger": 7
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
                    "valueInteger": 261
                  },
                  {
                    "url": "length",
                    "valueInteger": 3
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
                    "valueInteger": 265
                  },
                  {
                    "url": "length",
                    "valueInteger": 3
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
                    "valueInteger": 269
                  },
                  {
                    "url": "length",
                    "valueInteger": 4
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
                    "valueInteger": 274
                  },
                  {
                    "url": "length",
                    "valueInteger": 10
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
                    "valueInteger": 285
                  },
                  {
                    "url": "length",
                    "valueInteger": 4
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
                    "valueInteger": 290
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 293
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
                    "valueInteger": 302
                  },
                  {
                    "url": "length",
                    "valueInteger": 5
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
                    "valueInteger": 308
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 311
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
                    "valueInteger": 320
                  },
                  {
                    "url": "length",
                    "valueInteger": 10
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
                    "valueInteger": 330
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 333
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 336
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 339
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
                    "valueInteger": 348
                  },
                  {
                    "url": "length",
                    "valueInteger": 10
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
                    "valueInteger": 359
                  },
                  {
                    "url": "length",
                    "valueInteger": 3
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
                    "valueInteger": 363
                  },
                  {
                    "url": "length",
                    "valueInteger": 12
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
                    "valueInteger": 376
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 379
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 381
                  },
                  {
                    "url": "length",
                    "valueInteger": 3
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
                    "valueInteger": 384
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 386
                  },
                  {
                    "url": "length",
                    "valueInteger": 11
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
                    "valueInteger": 398
                  },
                  {
                    "url": "length",
                    "valueInteger": 7
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
                    "valueInteger": 406
                  },
                  {
                    "url": "length",
                    "valueInteger": 9
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
                    "valueInteger": 417
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 418
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 419
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 422
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 425
                  },
                  {
                    "url": "length",
                    "valueInteger": 4
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
                    "valueInteger": 430
                  },
                  {
                    "url": "length",
                    "valueInteger": 3
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
                    "valueInteger": 434
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
                    "valueInteger": 444
                  },
                  {
                    "url": "length",
                    "valueInteger": 5
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
                    "valueInteger": 449
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 452
                  },
                  {
                    "url": "length",
                    "valueInteger": 13
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
                    "valueInteger": 467
                  },
                  {
                    "url": "length",
                    "valueInteger": 5
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
                    "valueInteger": 472
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 475
                  },
                  {
                    "url": "length",
                    "valueInteger": 13
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
                    "valueInteger": 490
                  },
                  {
                    "url": "length",
                    "valueInteger": 7
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
                    "valueInteger": 497
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 500
                  },
                  {
                    "url": "length",
                    "valueInteger": 6
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
                    "valueInteger": 507
                  },
                  {
                    "url": "length",
                    "valueInteger": 14
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
                    "valueInteger": 521
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 523
                  },
                  {
                    "url": "length",
                    "valueInteger": 4
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
                    "valueInteger": 528
                  },
                  {
                    "url": "length",
                    "valueInteger": 10
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
                    "valueInteger": 540
                  },
                  {
                    "url": "length",
                    "valueInteger": 7
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
                    "valueInteger": 547
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 550
                  },
                  {
                    "url": "length",
                    "valueInteger": 4
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
                    "valueInteger": 555
                  },
                  {
                    "url": "length",
                    "valueInteger": 14
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
                    "valueInteger": 571
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
                    "valueInteger": 580
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 583
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
                    "valueInteger": 592
                  },
                  {
                    "url": "length",
                    "valueInteger": 7
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
                    "valueInteger": 599
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 602
                  },
                  {
                    "url": "length",
                    "valueInteger": 6
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
                    "valueInteger": 609
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 610
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 611
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 615
                  },
                  {
                    "url": "length",
                    "valueInteger": 4
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
                    "valueInteger": 620
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 621
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 624
                  },
                  {
                    "url": "length",
                    "valueInteger": 5
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
                    "valueInteger": 630
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 633
                  },
                  {
                    "url": "length",
                    "valueInteger": 3
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
                    "valueInteger": 636
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 638
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 639
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 640
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 644
                  },
                  {
                    "url": "length",
                    "valueInteger": 4
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
                    "valueInteger": 649
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 650
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 653
                  },
                  {
                    "url": "length",
                    "valueInteger": 5
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
                    "valueInteger": 659
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 662
                  },
                  {
                    "url": "length",
                    "valueInteger": 3
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
                    "valueInteger": 665
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 667
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 668
                  },
                  {
                    "url": "length",
                    "valueInteger": 3
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
                    "valueInteger": 671
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 673
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 675
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 678
                  },
                  {
                    "url": "length",
                    "valueInteger": 10
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
                    "valueInteger": 689
                  },
                  {
                    "url": "length",
                    "valueInteger": 5
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
                    "valueInteger": 695
                  },
                  {
                    "url": "length",
                    "valueInteger": 3
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
                    "valueInteger": 699
                  },
                  {
                    "url": "length",
                    "valueInteger": 4
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
                    "valueInteger": 704
                  },
                  {
                    "url": "length",
                    "valueInteger": 4
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
                    "valueInteger": 709
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 712
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 714
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 716
                  },
                  {
                    "url": "length",
                    "valueInteger": 6
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
                    "valueInteger": 723
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 726
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 728
                  },
                  {
                    "url": "length",
                    "valueInteger": 5
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
                    "valueInteger": 734
                  },
                  {
                    "url": "length",
                    "valueInteger": 4
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
                    "valueInteger": 739
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 742
                  },
                  {
                    "url": "length",
                    "valueInteger": 4
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
                    "valueInteger": 747
                  },
                  {
                    "url": "length",
                    "valueInteger": 6
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
                    "valueInteger": 754
                  },
                  {
                    "url": "length",
                    "valueInteger": 4
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
                    "valueInteger": 758
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 760
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 763
                  },
                  {
                    "url": "length",
                    "valueInteger": 5
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
                    "valueInteger": 769
                  },
                  {
                    "url": "length",
                    "valueInteger": 3
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
                    "valueInteger": 773
                  },
                  {
                    "url": "length",
                    "valueInteger": 4
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
                    "valueInteger": 778
                  },
                  {
                    "url": "length",
                    "valueInteger": 4
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
                    "valueInteger": 782
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 784
                  },
                  {
                    "url": "length",
                    "valueInteger": 2
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
                    "valueInteger": 787
                  },
                  {
                    "url": "length",
                    "valueInteger": 12
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
                    "valueInteger": 800
                  },
                  {
                    "url": "length",
                    "valueInteger": 3
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
                    "valueInteger": 803
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
                    "valueInteger": 804
                  },
                  {
                    "url": "length",
                    "valueInteger": 6
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
                    "valueInteger": 810
                  },
                  {
                    "url": "length",
                    "valueInteger": 1
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
  "id": "followupRecommendation2",
  "createdAt": "2024-05-14T15:48:58Z",
  "expiresAt": "2024-05-15T15:48:58Z",
  "updatedAt": "2024-05-14T15:49:01Z",
  "status": "succeeded"
}
```