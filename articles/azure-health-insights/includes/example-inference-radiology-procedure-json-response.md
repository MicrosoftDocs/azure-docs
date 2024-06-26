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
    "modelVersion": "2024-04-16"
  },
  "id": "radiologyProcedure",
  "createdAt": "2024-05-14T15:46:01Z",
  "expiresAt": "2024-05-15T15:46:01Z",
  "updatedAt": "2024-05-14T15:46:03Z",
  "status": "succeeded"
}
```