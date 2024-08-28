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
            "kind": "limitedOrderDiscrepancy",
            "orderType": {
              "coding": [
                {
                  "system": "http://loinc.org",
                  "code": "24558-9",
                  "display": "US Abdomen"
                }
              ]
            },
            "presentBodyParts": [
              {
                "coding": [
                  {
                    "system": "http://radlex.org",
                    "code": "RID58",
                    "display": "Liver"
                  }
                ]
              },
              {
                "coding": [
                  {
                    "system": "http://radlex.org",
                    "code": "RID187",
                    "display": "GALLBLADDER"
                  }
                ]
              },
              {
                "coding": [
                  {
                    "system": "http://radlex.org",
                    "code": "RID199",
                    "display": "COMMON BILE DUCT"
                  }
                ]
              },
              {
                "coding": [
                  {
                    "system": "http://radlex.org",
                    "code": "RID170",
                    "display": "PANCREAS"
                  }
                ]
              },
              {
                "coding": [
                  {
                    "system": "http://radlex.org",
                    "code": "RID86",
                    "display": "SPLEEN"
                  }
                ]
              },
              {
                "coding": [
                  {
                    "system": "http://radlex.org",
                    "code": "RID29663",
                    "display": "LEFT KIDNEY"
                  }
                ]
              },
              {
                "coding": [
                  {
                    "system": "http://radlex.org",
                    "code": "RID29662",
                    "display": "RIGHT KIDNEY"
                  }
                ]
              },
              {
                "coding": [
                  {
                    "system": "http://radlex.org",
                    "code": "RID905",
                    "display": "ABDOMINAL AORTA"
                  }
                ]
              },
              {
                "coding": [
                  {
                    "system": "http://radlex.org",
                    "code": "RID1178",
                    "display": "INFERIOR VENA CAVA"
                  }
                ]
              }
            ],
            "presentBodyPartMeasurements": []
          }
        ]
      }
    ],
    "modelVersion": "2024-04-16"
  },
  "id": "LimitedOrderDiscrepancy",
  "createdAt": "2024-05-14T15:44:52Z",
  "expiresAt": "2024-05-15T15:44:52Z",
  "updatedAt": "2024-05-14T15:44:57Z",
  "status": "succeeded"
}
```