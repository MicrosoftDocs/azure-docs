---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 04/23/2024
ms.author: glenga
---
| Property  | Description |
|---------|-------------|
|strategy|Required. The retry strategy to use. Valid values are `fixedDelay` or `exponentialBackoff`.|
|maxRetryCount|Required. The maximum number of retries allowed per function execution. `-1` means to retry indefinitely.|
|delayInterval|The delay used between retries when you're using a `fixedDelay` strategy. Specify it as a string with the format `HH:mm:ss`.|
|minimumInterval|The minimum retry delay when you're using an `exponentialBackoff` strategy. Specify it as a string with the format `HH:mm:ss`.|
|maximumInterval|The maximum retry delay when you're using `exponentialBackoff` strategy. Specify it as a string with the format `HH:mm:ss`.|