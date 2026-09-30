---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/27/2025
ms.author: glenga
---

| Metric | Description | Meter calculation |
| ------ | ---------- | ----------------- |
| **On Demand Function Execution Count**    | Total number of function executions in on demand instances.  | `OnDemandFunctionExecutionCount` relates to the **On Demand Total Executions** meter.  |
| **Always Ready Function Execution Count** | Total number of function executions in always ready instances. | `AlwaysReadyFunctionExecutionCount` relates to the **Always Ready Total Executions** meter. |
| **On Demand Function Execution Units**  | Total MB-milliseconds from on demand instances while actively executing functions. | `OnDemandFunctionExecutionUnits / 1,024,000` is the On Demand Execution Time meter, in GB-seconds. |
| **Always Ready Function Execution Units** | Total MB-milliseconds from always ready instances while actively executing functions. | `AlwaysReadyFunctionExecutionUnits / 1,024,000` is the Always Ready Execution Time meter, in GB-seconds. |
| **Always Ready Units** | The total MB-milliseconds of always ready instances assigned to the app, whether or not functions are actively executing. | `AlwaysReadyUnits / 1,024,000` is the Always Ready Baseline meter, in GB-seconds. |