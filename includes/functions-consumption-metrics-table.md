---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/27/2025
ms.author: glenga
---

| Metric | Description |
| ---- | ---- |
| **FunctionExecutionCount** | Function execution count indicates the number of times your function app executed. This value correlates to the number of times a function runs in your app. This metric isn't currently supported for Premium and Dedicated (App Service) plans running on Linux.|
| **FunctionExecutionUnits** | Function execution units are a combination of execution time and your memory usage. Memory data isn't a metric currently available through Azure Monitor. However, if you want to optimize the memory usage of your app, can use the performance counter data collected by Application Insights. This metric isn't currently supported for Premium and Dedicated (App Service) plans running on Linux.|