---
author: mrbullwinkle
ms.service: application-insights
ms.topic: include
ms.date: 11/09/2018
ms.author: mbullwin
---
Collection of custom measurements. Use this collection to report named measurement associated with the telemetry item. Typical use cases are:
- the size of Dependency Telemetry payload
- the number of queue items processed by Request Telemetry
- time that customer took to complete the step in wizard step completion Event Telemetry.

You can query custom measurements in Application Analytics:

```
customEvents
| where customMeasurements != ""
| summarize avg(todouble(customMeasurements["Completion Time"]) * itemCount)
```

 > [!NOTE]
 > Custom measurements are associated with the telemetry item they belong to. They are subject to sampling with the telemetry item containing those measurements. To track a measurement that has a value independent from other telemetry types, use [Metric telemetry](../articles/azure-monitor/app/api-custom-events-metrics.md).

Max key length: 150
