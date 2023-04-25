---
author: mrbullwinkle
ms.service: application-insights
ms.topic: include
ms.date: 11/09/2018
ms.author: mbullwin
---
**Collection of custom measurements:** Use this collection to report named measurements associated with the telemetry item. Typical use cases are:

- The size of the dependency telemetry payload.
- The number of queue items processed by request telemetry.
- The time that a customer took to finish the wizard step completing event telemetry.

You can query custom measurements in Application Analytics:

```
customEvents
| where customMeasurements != ""
| summarize avg(todouble(customMeasurements["Completion Time"]) * itemCount)
```

 > [!NOTE]
 > Custom measurements are associated with the telemetry item they belong to. They're subject to sampling with the telemetry item that contains those measurements. To track a measurement that has a value independent from other telemetry types, use [metric telemetry](../articles/azure-monitor/app/api-custom-events-metrics.md).

**Maximum key length**: 150
