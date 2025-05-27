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
            "procedureCodes": [
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
                    "code": "70460"
                  }
                ]
              },
              "description": "Ct head/brain w/dye"
            },
            "kind": "radiologyProcedure"
          }
        ]
      }
    ],
    "modelVersion": "2025-03-17"
  },
  "id": "fca113",
  "createdAt": "2025-04-30T11:28:03Z",
  "expiresAt": "2025-05-01T11:28:03Z",
  "updatedAt": "2025-04-30T11:28:09Z",
  "status": "succeeded"
}
```