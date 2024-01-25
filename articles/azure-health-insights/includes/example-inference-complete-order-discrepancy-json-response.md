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
    "modelVersion": "2024-01-10-Preview"
  },
  "id": "debe34dc-2c52-49d0-aac3-0ab4630b460d",
  "createdDateTime": "2024-01-12T07:16:59.2847076Z",
  "expirationDateTime": "2024-01-12T07:33:39.2847076Z",
  "lastUpdateDateTime": "2024-01-12T07:17:07.153749Z",
  "status": "succeeded"
}
```