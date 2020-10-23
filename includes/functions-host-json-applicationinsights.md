---
title: include file
description: include file
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/19/2018
ms.author: glenga
ms.custom: include file
---

Controls the [sampling feature in Application Insights](../articles/azure-functions/configure-monitoring.md#configure-sampling).

```json
{
    "applicationInsights": {
        "sampling": {
          "isEnabled": true,
          "maxTelemetryItemsPerSecond" : 5
        }
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|isEnabled|true|Enables or disables sampling.| 
|maxTelemetryItemsPerSecond|5|The threshold at which sampling begins.| 
