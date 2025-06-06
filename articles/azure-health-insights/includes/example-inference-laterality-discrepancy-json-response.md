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
    "modelVersion": "2025-03-17"
  },
  "id": "fca110",
  "createdAt": "2025-04-30T11:18:36Z",
  "expiresAt": "2025-05-01T11:18:36Z",
  "updatedAt": "2025-04-30T11:18:41Z",
  "status": "succeeded"
}
```