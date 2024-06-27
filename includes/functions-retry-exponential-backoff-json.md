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
        "strategy": "exponentialBackoff",
        "maxRetryCount": 5,
        "minimumInterval": "00:00:10",
        "maximumInterval": "00:15:00"
    }
}
```