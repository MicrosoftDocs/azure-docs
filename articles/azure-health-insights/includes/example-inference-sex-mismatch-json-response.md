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
    "modelVersion": "2024-01-10-Preview"
  },
  "id": "9ac3de47-c163-4838-bfe8-c27f127123ae",
  "createdDateTime": "2024-01-12T07:33:22.787062Z",
  "expirationDateTime": "2024-01-12T07:50:02.787062Z",
  "lastUpdateDateTime": "2024-01-12T07:33:29.786962Z",
  "status": "succeeded"
}
```