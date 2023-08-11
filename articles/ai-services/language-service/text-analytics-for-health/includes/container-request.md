---
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 04/20/2022
ms.author: jboback
---



# [Language API (Preview)](#tab/language)

> [!NOTE]
> Fast Healthcare Interoperability Resources (FHIR) feature is available in the latest container, and is exposed through the new language REST API. 

```bash
curl -i -X POST 'http://<serverURL>:5000/language/analyze-text/jobs?api-version=2022-04-01-preview' --header 'Content-Type: application/json' --header --data-binary @example.json
```
The following JSON is an example of a JSON file attached to the Language request's POST body:

```json
example.json

{
    "analysisInput": {
        "documents": [
            {
                "text": "The doctor prescried 200mg Ibuprofen.",
                "language": "en",
                "id": "1"
            }
        ]
    },
    "tasks": [
        {
            "taskName": "analyze 1",
            "kind": "Healthcare",
            "parameters": {
                "fhirVersion": "4.0.1"
            }
        }
    ]
}
```
### Container response body

The following JSON is an example of the Language response body from the containerized synchronous call:

```json
{
  "jobId": "{JOB-ID}",
  "lastUpdateDateTime": "2022-04-18T15:50:16Z",
  "createdDateTime": "2022-04-18T15:50:14Z",
  "expirationDateTime": "2022-04-19T15:50:14Z",
  "status": "succeeded",
  "errors": [],
  "tasks": {
    "completed": 1,
    "failed": 0,
    "inProgress": 0,
    "total": 1,
    "items": [
      {
        "kind": "HealthcareLROResults",
        "taskName": "analyze 1",
        "lastUpdateDateTime": "2022-04-18T15:50:16.7046515Z",
        "status": "succeeded",
        "results": {
          "documents": [
            {
              "id": "1",
              "entities": [
                {
                  "offset": 4,
                  "length": 6,
                  "text": "doctor",
                  "category": "HealthcareProfession",
                  "confidenceScore": 0.76
                },
                {
                  "offset": 21,
                  "length": 5,
                  "text": "200mg",
                  "category": "Dosage",
                  "confidenceScore": 0.99
                },
                {
                  "offset": 27,
                  "length": 9,
                  "text": "Ibuprofen",
                  "category": "MedicationName",
                  "confidenceScore": 1.0,
                  "name": "ibuprofen",
                  "links": [
                    { "dataSource": "UMLS", "id": "C0020740" },
                    { "dataSource": "AOD", "id": "0000019879" },
                    { "dataSource": "ATC", "id": "M01AE01" },
                    { "dataSource": "CCPSS", "id": "0046165" },
                    { "dataSource": "CHV", "id": "0000006519" },
                    { "dataSource": "CSP", "id": "2270-2077" },
                    { "dataSource": "DRUGBANK", "id": "DB01050" },
                    { "dataSource": "GS", "id": "1611" },
                    { "dataSource": "LCH_NW", "id": "sh97005926" },
                    { "dataSource": "LNC", "id": "LP16165-0" },
                    { "dataSource": "MEDCIN", "id": "40458" },
                    { "dataSource": "MMSL", "id": "d00015" },
                    { "dataSource": "MSH", "id": "D007052" },
                    { "dataSource": "MTHSPL", "id": "WK2XYI10QM" },
                    { "dataSource": "NCI", "id": "C561" },
                    { "dataSource": "NCI_CTRP", "id": "C561" },
                    { "dataSource": "NCI_DCP", "id": "00803" },
                    { "dataSource": "NCI_DTP", "id": "NSC0256857" },
                    { "dataSource": "NCI_FDA", "id": "WK2XYI10QM" },
                    { "dataSource": "NCI_NCI-GLOSS", "id": "CDR0000613511" },
                    { "dataSource": "NDDF", "id": "002377" },
                    { "dataSource": "PDQ", "id": "CDR0000040475" },
                    { "dataSource": "RCD", "id": "x02MO" },
                    { "dataSource": "RXNORM", "id": "5640" },
                    { "dataSource": "SNM", "id": "E-7772" },
                    { "dataSource": "SNMI", "id": "C-603C0" },
                    { "dataSource": "SNOMEDCT_US", "id": "387207008" },
                    { "dataSource": "USP", "id": "m39860" },
                    { "dataSource": "USPMG", "id": "MTHU000060" },
                    { "dataSource": "VANDF", "id": "4017840" }
                  ]
                }
              ],
              "relations": [
                {
                  "relationType": "DosageOfMedication",
                  "entities": [
                    {
                      "ref": "#/results/documents/0/entities/1",
                      "role": "Dosage"
                    },
                    {
                      "ref": "#/results/documents/0/entities/2",
                      "role": "Medication"
                    }
                  ]
                }
              ],
              "warnings": [],
              "fhirBundle": {
                "resourceType": "Bundle",
                "id": "bae9d4e0-191e-48e6-9c24-c1ff6097c439",
                "meta": {
                  "profile": [
                    "http://hl7.org/fhir/4.0.1/StructureDefinition/Bundle"
                  ]
                },
                "identifier": {
                  "system": "urn:ietf:rfc:3986",
                  "value": "urn:uuid:bae9d4e0-191e-48e6-9c24-c1ff6097c439"
                },
                "type": "document",
                "entry": [
                  {
                    "fullUrl": "Composition/9044c2cc-dcec-4b9d-b005-bfa8be978aa8",
                    "resource": {
                      "resourceType": "Composition",
                      "id": "9044c2cc-dcec-4b9d-b005-bfa8be978aa8",
                      "status": "final",
                      "type": {
                        "coding": [
                          {
                            "system": "http://loinc.org",
                            "code": "11526-1",
                            "display": "Pathology study"
                          }
                        ],
                        "text": "Pathology study"
                      },
                      "subject": {
                        "reference": "Patient/5c554347-4290-4b05-83ac-6637ff3bfb40",
                        "type": "Patient"
                      },
                      "encounter": {
                        "reference": "Encounter/6fe12f5b-e35c-4c92-a492-96feda5a1a3b",
                        "type": "Encounter",
                        "display": "unknown"
                      },
                      "date": "2022-04-18",
                      "author": [
                        {
                          "reference": "Practitioner/fb5da4d8-e0f0-4434-8d29-4419b065c4d7",
                          "type": "Practitioner",
                          "display": "Unknown"
                        }
                      ],
                      "title": "Pathology study",
                      "section": [
                        {
                          "title": "General",
                          "code": {
                            "coding": [
                              {
                                "system": "",
                                "display": "Unrecognized Section"
                              }
                            ],
                            "text": "General"
                          },
                          "text": {
                            "div": "<div>\r\n\t\t\t\t\t\t\t<h1>General</h1>\r\n\t\t\t\t\t\t\t<p>The doctor prescried 200mg Ibuprofen.</p>\r\n\t\t\t\t\t</div>"
                          },
                          "entry": [
                            {
                              "reference": "List/db388912-b5fb-4073-a74c-2751fd3374dd",
                              "type": "List",
                              "display": "General"
                            }
                          ]
                        }
                      ]
                    }
                  },
                  {
                    "fullUrl": "Practitioner/fb5da4d8-e0f0-4434-8d29-4419b065c4d7",
                    "resource": {
                      "resourceType": "Practitioner",
                      "id": "fb5da4d8-e0f0-4434-8d29-4419b065c4d7",
                      "extension": [
                        {
                          "extension": [
                            { "url": "offset", "valueInteger": -1 },
                            { "url": "length", "valueInteger": 7 }
                          ],
                          "url": "http://hl7.org/fhir/StructureDefinition/derivation-reference"
                        }
                      ],
                      "name": [{ "text": "Unknown", "family": "Unknown" }]
                    }
                  },
                  {
                    "fullUrl": "Patient/5c554347-4290-4b05-83ac-6637ff3bfb40",
                    "resource": {
                      "resourceType": "Patient",
                      "id": "5c554347-4290-4b05-83ac-6637ff3bfb40",
                      "gender": "unknown"
                    }
                  },
                  {
                    "fullUrl": "Encounter/6fe12f5b-e35c-4c92-a492-96feda5a1a3b",
                    "resource": {
                      "resourceType": "Encounter",
                      "id": "6fe12f5b-e35c-4c92-a492-96feda5a1a3b",
                      "meta": {
                        "profile": [
                          "http://hl7.org/fhir/us/core/StructureDefinition/us-core-encounter"
                        ]
                      },
                      "status": "finished",
                      "class": {
                        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                        "display": "unknown"
                      },
                      "subject": {
                        "reference": "Patient/5c554347-4290-4b05-83ac-6637ff3bfb40",
                        "type": "Patient"
                      }
                    }
                  },
                  {
                    "fullUrl": "MedicationStatement/24e860ce-2fdc-4745-aa9e-7d30bb487c4e",
                    "resource": {
                      "resourceType": "MedicationStatement",
                      "id": "24e860ce-2fdc-4745-aa9e-7d30bb487c4e",
                      "extension": [
                        {
                          "extension": [
                            { "url": "offset", "valueInteger": 27 },
                            { "url": "length", "valueInteger": 9 }
                          ],
                          "url": "http://hl7.org/fhir/StructureDefinition/derivation-reference"
                        }
                      ],
                      "status": "active",
                      "medicationCodeableConcept": {
                        "coding": [
                          {
                            "system": "http://www.nlm.nih.gov/research/umls",
                            "code": "C0020740",
                            "display": "Ibuprofen"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/aod",
                            "code": "0000019879"
                          },
                          {
                            "system": "http://www.whocc.no/atc",
                            "code": "M01AE01"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/ccpss",
                            "code": "0046165"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/chv",
                            "code": "0000006519"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/csp",
                            "code": "2270-2077"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/drugbank",
                            "code": "DB01050"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/gs",
                            "code": "1611"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/lch_nw",
                            "code": "sh97005926"
                          },
                          { "system": "http://loinc.org", "code": "LP16165-0" },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/medcin",
                            "code": "40458"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/mmsl",
                            "code": "d00015"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/msh",
                            "code": "D007052"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/mthspl",
                            "code": "WK2XYI10QM"
                          },
                          {
                            "system": "http://ncimeta.nci.nih.gov",
                            "code": "C561"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/nci_ctrp",
                            "code": "C561"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/nci_dcp",
                            "code": "00803"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/nci_dtp",
                            "code": "NSC0256857"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/nci_fda",
                            "code": "WK2XYI10QM"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/nci_nci-gloss",
                            "code": "CDR0000613511"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/nddf",
                            "code": "002377"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/pdq",
                            "code": "CDR0000040475"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/rcd",
                            "code": "x02MO"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
                            "code": "5640"
                          },
                          {
                            "system": "http://snomed.info/sct",
                            "code": "E-7772"
                          },
                          {
                            "system": "http://snomed.info/sct/900000000000207008",
                            "code": "C-603C0"
                          },
                          {
                            "system": "http://snomed.info/sct/731000124108",
                            "code": "387207008"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/usp",
                            "code": "m39860"
                          },
                          {
                            "system": "http://www.nlm.nih.gov/research/umls/uspmg",
                            "code": "MTHU000060"
                          },
                          {
                            "system": "http://hl7.org/fhir/ndfrt",
                            "code": "4017840"
                          }
                        ],
                        "text": "Ibuprofen"
                      },
                      "subject": {
                        "reference": "Patient/5c554347-4290-4b05-83ac-6637ff3bfb40",
                        "type": "Patient"
                      },
                      "context": {
                        "reference": "Encounter/6fe12f5b-e35c-4c92-a492-96feda5a1a3b",
                        "type": "Encounter",
                        "display": "unknown"
                      },
                      "dosage": [
                        {
                          "text": "200mg",
                          "doseAndRate": [{ "doseQuantity": { "value": 200 } }]
                        }
                      ]
                    }
                  },
                  {
                    "fullUrl": "List/db388912-b5fb-4073-a74c-2751fd3374dd",
                    "resource": {
                      "resourceType": "List",
                      "id": "db388912-b5fb-4073-a74c-2751fd3374dd",
                      "status": "current",
                      "mode": "snapshot",
                      "title": "General",
                      "subject": {
                        "reference": "Patient/5c554347-4290-4b05-83ac-6637ff3bfb40",
                        "type": "Patient"
                      },
                      "encounter": {
                        "reference": "Encounter/6fe12f5b-e35c-4c92-a492-96feda5a1a3b",
                        "type": "Encounter",
                        "display": "unknown"
                      },
                      "entry": [
                        {
                          "item": {
                            "reference": "MedicationStatement/24e860ce-2fdc-4745-aa9e-7d30bb487c4e",
                            "type": "MedicationStatement",
                            "display": "Ibuprofen"
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ],
          "errors": [],
          "modelVersion": "2022-03-01"
        }
      }
    ]
  }
}

```


# [Text Analytics API](#tab/text-analytics-api)

```bash
curl -X POST 'http://<serverURL>:5000/text/analytics/v3.1/entities/health' --header 'Content-Type: application/json' --header 'accept: application/json' --data-binary @example.json

```

The following JSON is an example of a JSON file attached to the Text Analytics for health request's POST body:

```json
example.json

{
  "documents": [
    {
      "language": "en",
      "id": "1",
      "text": "Patient reported itchy sores after swimming in the lake."
    },
    {
      "language": "en",
      "id": "2",
      "text": "Prescribed 50mg benadryl, taken twice daily."
    }
  ]
}
```

### Container response body

The following JSON is an example of the Text Analytics for health response body from the containerized synchronous call:

```json
{
    "documents": [
        {
            "id": "1",
            "entities": [
                {
                    "offset": 25,
                    "length": 5,
                    "text": "100mg",
                    "category": "Dosage",
                    "confidenceScore": 1.0
                },
                {
                    "offset": 31,
                    "length": 10,
                    "text": "remdesivir",
                    "category": "MedicationName",
                    "confidenceScore": 1.0,
                    "name": "remdesivir",
                    "links": [
                        {
                            "dataSource": "UMLS",
                            "id": "C4726677"
                        },
                        {
                            "dataSource": "DRUGBANK",
                            "id": "DB14761"
                        },
                        {
                            "dataSource": "GS",
                            "id": "6192"
                        },
                        {
                            "dataSource": "MEDCIN",
                            "id": "398132"
                        },
                        {
                            "dataSource": "MMSL",
                            "id": "d09540"
                        },
                        {
                            "dataSource": "MSH",
                            "id": "C000606551"
                        },
                        {
                            "dataSource": "MTHSPL",
                            "id": "3QKI37EEHE"
                        },
                        {
                            "dataSource": "NCI",
                            "id": "C152185"
                        },
                        {
                            "dataSource": "NCI_FDA",
                            "id": "3QKI37EEHE"
                        },
                        {
                            "dataSource": "NDDF",
                            "id": "018308"
                        },
                        {
                            "dataSource": "RXNORM",
                            "id": "2284718"
                        },
                        {
                            "dataSource": "SNOMEDCT_US",
                            "id": "870592005"
                        },
                        {
                            "dataSource": "VANDF",
                            "id": "4039395"
                        }
                    ]
                },
                {
                    "offset": 42,
                    "length": 13,
                    "text": "intravenously",
                    "category": "MedicationRoute",
                    "confidenceScore": 1.0
                },
                {
                    "offset": 73,
                    "length": 7,
                    "text": "120 min",
                    "category": "Time",
                    "confidenceScore": 0.94
                }
            ],
            "relations": [
                {
                    "relationType": "DosageOfMedication",
                    "entities": [
                        {
                            "ref": "#/documents/0/entities/0",
                            "role": "Dosage"
                        },
                        {
                            "ref": "#/documents/0/entities/1",
                            "role": "Medication"
                        }
                    ]
                },
                {
                    "relationType": "RouteOfMedication",
                    "entities": [
                        {
                            "ref": "#/documents/0/entities/1",
                            "role": "Medication"
                        },
                        {
                            "ref": "#/documents/0/entities/2",
                            "role": "Route"
                        }
                    ]
                },
                {
                    "relationType": "TimeOfMedication",
                    "entities": [
                        {
                            "ref": "#/documents/0/entities/1",
                            "role": "Medication"
                        },
                        {
                            "ref": "#/documents/0/entities/3",
                            "role": "Time"
                        }
                    ]
                }
            ],
            "warnings": []
        }
    ],
    "errors": [],
    "modelVersion": "2021-03-01"
}
```

---
