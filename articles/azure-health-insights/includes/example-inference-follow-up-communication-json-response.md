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
            "kind": "followupCommunication",
            "communicatedAt": [
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
    "modelVersion": "2024-04-16"
  },
  "id": "followupCommunication",
  "createdAt": "2024-05-14T15:34:48Z",
  "expiresAt": "2024-05-15T15:34:48Z",
  "updatedAt": "2024-05-14T15:34:51Z",
  "status": "succeeded"
}
```