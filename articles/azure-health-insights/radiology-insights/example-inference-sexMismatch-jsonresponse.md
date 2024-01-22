---
title: Radiology Insights Inference Example
titleSuffix: Azure AI Health Insights
description: Radiology Insights Inference Example
services: azure-health-insights
author: JanSchietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: quickstart
ms.date: 12/06/2023
ms.author: janschietse
---

# Inference example

```json
{
  "result": {
    "patientResults": [
      {
        "patientId": "11111",
        "inferences": [
          {
            "kind": "sexMismatch",
            "sexIndication": {
              "coding": [
                {
                  "system": "http://snomed.info/sct",
                  "code": "248153007",
                  "display": "MALE (FINDING)"
                }
              ]
            }
          }
        ]
      }
    ],
    "modelVersion": "2024-01-10-Preview"
  },
  "id": "9ac3de47-c163-4838-bfe8-c27f127123ae",
  "createdDateTime": "2024-01-12T07:33:22.787062Z",
  "expirationDateTime": "2024-01-12T07:50:02.787062Z",
  "lastUpdateDateTime": "2024-01-12T07:33:29.786962Z",
  "status": "succeeded"
}
```