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
                    "display": "LIVER"
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
    "modelVersion": "2025-03-17"
  },
  "id": "fca111",
  "createdAt": "2025-04-30T11:20:48Z",
  "expiresAt": "2025-05-01T11:20:48Z",
  "updatedAt": "2025-04-30T11:20:53Z",
  "status": "succeeded"
}
```