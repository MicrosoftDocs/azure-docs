---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 04/23/2024
ms.author: glenga
---
```json
{
    "disabled": false,
    "bindings": [
        {
            ....
        }
    ],
    "retry": {
        "strategy": "fixedDelay",
        "maxRetryCount": 4,
        "delayInterval": "00:00:10"
    }
}
```