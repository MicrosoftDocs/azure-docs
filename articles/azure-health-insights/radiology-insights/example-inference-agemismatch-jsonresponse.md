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
        "patientId": "111111",
        "inferences": [
          {
            "kind": "ageMismatch"
          }
        ]
      }
    ],
    "modelVersion": "2024-01-10-Preview"
  },
  "id": "7fc4bd1a-9321-45ea-845e-158a3ab222de",
  "createdDateTime": "2024-01-12T07:08:21.109402Z",
  "expirationDateTime": "2024-01-12T07:25:01.109402Z",
  "lastUpdateDateTime": "2024-01-12T07:08:26.8320889Z",
  "status": "succeeded"
}
```