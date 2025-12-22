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
            "kind": "sexMismatch",
            "sexIndication": {
              "coding": [
                {
                  "system": "http://snomed.info/sct",
                  "code": "248153007",
                  "display": "MALE (FINDING)"
                }
              ]
            }
          }
        ]
      }
    ],
    "modelVersion": "2025-03-17"
  },
  "id": "fca116",
  "createdAt": "2025-04-30T11:32:10Z",
  "expiresAt": "2025-05-01T11:32:10Z",
  "updatedAt": "2025-04-30T11:32:13Z",
  "status": "succeeded"
}
```