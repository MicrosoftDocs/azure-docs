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
    "modelVersion": "2025-03-17"
  },
  "id": "fca105",
  "createdAt": "2025-04-30T09:34:51Z",
  "expiresAt": "2025-05-01T09:34:51Z",
  "updatedAt": "2025-04-30T09:34:55Z",
  "status": "succeeded"
}
```