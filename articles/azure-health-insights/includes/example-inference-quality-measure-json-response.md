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
        "patientId": "11111",
        "inferences": [
          {
            "kind": "qualityMeasure",
            "qualityMeasureDenominator": "INCIDENTAL PULMONARY NODULE",
            "complianceType": "performanceMet",
            "qualityCriteria": [
              "APPROPRIATE FOLLOW-UP RECOMMENDATION"
            ]
          },
          {
            "kind": "qualityMeasure",
            "qualityMeasureDenominator": "HIGH DOSE RADIATION IMAGING",
            "complianceType": "performanceMet",
            "qualityCriteria": [
              "DOCUMENTED COUNT"
            ]
          },
          {
            "kind": "qualityMeasure",
            "qualityMeasureDenominator": "DOSE LOWERING TECHNIQUE",
            "complianceType": "performanceMet",
            "qualityCriteria": [
              "AUTOMATED EXPOSURE CONTROL",
              "MA OR KV ADJUSTMENT",
              "ITERATIVE RECONSTRUCTION"
            ]
          }
        ]
      }
    ],
    "modelVersion": "2025-03-17"
  },
  "id": "fca112",
  "createdAt": "2025-04-30T11:25:58Z",
  "expiresAt": "2025-05-01T11:25:58Z",
  "updatedAt": "2025-04-30T11:26:10Z",
  "status": "succeeded"
}
```