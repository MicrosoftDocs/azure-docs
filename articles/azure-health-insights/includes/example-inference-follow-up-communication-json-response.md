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
    "modelVersion": "2025-03-17"
  },
  "id": "fca108",
  "createdAt": "2025-04-30T09:49:47Z",
  "expiresAt": "2025-05-01T09:49:47Z",
  "updatedAt": "2025-04-30T09:49:50Z",
  "status": "succeeded"
}
```