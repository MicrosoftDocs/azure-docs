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
            "kind": "followupCommunication",
            "dateTime": [
              "2016-07-06T15:00:00"
            ],
            "recipient": [
              "unknown"
            ],
            "wasAcknowledged": false
          },
          {
            "kind": "followupCommunication",
            "recipient": [
              "physicianAssistant"
            ],
            "wasAcknowledged": false
          }
        ]
      }
    ],
    "modelVersion": "2024-01-10-Preview"
  },
  "id": "8c13627c-759c-4753-8aaf-2f021b9587ea",
  "createdDateTime": "2024-01-12T07:13:03.6054891Z",
  "expirationDateTime": "2024-01-12T07:29:43.6054891Z",
  "lastUpdateDateTime": "2024-01-12T07:13:08.9740608Z",
  "status": "succeeded"
}
```