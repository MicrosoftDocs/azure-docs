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
    "modelVersion": "2024-04-16"
  },
  "id": "SexMismatch",
  "createdAt": "2024-05-14T15:46:58Z",
  "expiresAt": "2024-05-15T15:46:58Z",
  "updatedAt": "2024-05-14T15:47:01Z",
  "status": "succeeded"
}
```