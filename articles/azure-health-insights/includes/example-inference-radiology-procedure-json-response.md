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
            "procedureCodes": [
              {
                "coding": [
                  {
                    "system": "http://loinc.org",
                    "code": "24727-0",
                    "display": "CT HEAD W CONTRAST IV"
                  }
                ]
              },
              {
                "coding": [
                  {
                    "system": "http://loinc.org",
                    "code": "24727-0",
                    "display": "CT HEAD W CONTRAST IV"
                  }
                ]
              }
            ],
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
                      "code": "69536005",
                      "display": "HEAD STRUCTURE (BODY STRUCTURE)"
                    }
                  ]
                }
              },
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
                      "code": "69536005",
                      "display": "HEAD STRUCTURE (BODY STRUCTURE)"
                    }
                  ]
                }
              },
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
                      "code": "12738006",
                      "display": "BRAIN STRUCTURE (BODY STRUCTURE)"
                    }
                  ]
                }
              }
            ],
            "orderedProcedure": {
              "code": {
                "coding": [
                  {
                    "code": "24727-0"
                  },
                  {
                    "code": "70460"
                  }
                ]
              },
              "description": "CT HEAD W CONTRAST IV.;;Ct head/brain w/dye."
            },
            "kind": "radiologyProcedure"
          }
        ]
      }
    ],
    "modelVersion": "2024-01-10-Preview"
  },
  "id": "89d4d36c-a8ce-444d-807b-333f3b7c08ec",
  "createdDateTime": "2024-01-12T07:22:56.1444627Z",
  "expirationDateTime": "2024-01-12T07:39:36.1444627Z",
  "lastUpdateDateTime": "2024-01-12T07:23:04.9333715Z",
  "status": "succeeded"
}
```