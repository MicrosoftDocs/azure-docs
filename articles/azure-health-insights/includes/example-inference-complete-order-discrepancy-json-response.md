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
            "kind": "completeOrderDiscrepancy",
            "orderType": {
              "coding": [
                {
                  "system": "http://loinc.org",
                  "code": "24869-0",
                  "display": "US Pelvis"
                }
              ]
            },
            "missingBodyParts": [],
            "missingBodyPartMeasurements": [
              {
                "coding": [
                  {
                    "system": "http://radlex.org",
                    "code": "RID302",
                    "display": "UTERUS"
                  }
                ]
              },
              {
                "coding": [
                  {
                    "system": "http://radlex.org",
                    "code": "RID30958",
                    "display": "ENDOMETRIUM"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "modelVersion": "2024-04-16"
  },
  "id": "CompleteOrderDiscrepancy",
  "createdAt": "2024-05-14T15:30:29Z",
  "expiresAt": "2024-05-15T15:30:29Z",
  "updatedAt": "2024-05-14T15:30:32Z",
  "status": "succeeded"
}
```