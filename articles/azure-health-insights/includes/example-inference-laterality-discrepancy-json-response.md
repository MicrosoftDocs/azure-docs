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
            "kind": "lateralityDiscrepancy",
            "lateralityIndication": {
              "coding": [
                {
                  "system": "http://snomed.info/sct",
                  "code": "24028007",
                  "display": "RIGHT (QUALIFIER VALUE)"
                }
              ]
            },
            "discrepancyType": "orderLateralityMismatch"
          }
        ]
      }
    ],
    "modelVersion": "2024-04-16"
  },
  "id": "LateralityDiscrepancy",
  "createdAt": "2024-05-14T15:40:03Z",
  "expiresAt": "2024-05-15T15:40:03Z",
  "updatedAt": "2024-05-14T15:40:07Z",
  "status": "succeeded"
}
```