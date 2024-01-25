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
    "modelVersion": "2024-01-10-Preview"
  },
  "id": "c09cbea6-cc13-486d-9238-1b0f98598375",
  "createdDateTime": "2024-01-12T07:28:41.1288573Z",
  "expirationDateTime": "2024-01-12T07:45:21.1288573Z",
  "lastUpdateDateTime": "2024-01-12T07:28:46.7075373Z",
  "status": "succeeded"
}
```