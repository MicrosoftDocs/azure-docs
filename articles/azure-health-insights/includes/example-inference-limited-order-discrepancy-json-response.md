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
    "modelVersion": "2024-01-10-Preview"
  },
  "id": "6d836504-f884-428d-b823-752947387b4a",
  "createdDateTime": "2024-01-12T07:13:58.7944605Z",
  "expirationDateTime": "2024-01-12T07:30:38.7944605Z",
  "lastUpdateDateTime": "2024-01-12T07:14:11.9375243Z",
  "status": "succeeded"
}
```