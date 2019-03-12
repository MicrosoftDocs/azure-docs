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

You can query [custom measurements](https://analytics.applicationinsights.io/demo?q=H4sIAAAAAAAAA2WLOw6DMAyGd07hZoLeoRPqyMaGGAL8aiPhGCV2kKoeHsHK%2Bj1myyr8LoiaqfrT%2FkUCzRft4LMl8OUeL3LuLLIx%2BxR%2BIF8%2BtcoiNq2o78vgWuFthQaJ1AeGGxt6UlBwKxa1qQ6EpLhAfQAAAA%3D%3D&timespan=PT24H) in Application Analytics:

```
customEvents
| where customMeasurements != ""
| summarize avg(todouble(customMeasurements["Completion Time"]) * itemCount)
```

 > [!NOTE]
 > Custom measurements are associated with the telemetry item they belong to. They are subject to sampling with the telemetry item containing those measurements. To track a measurement that has a value independent from other telemetry types, use [Metric telemetry](../articles/azure-monitor/app/api-custom-events-metrics.md).

Max key length: 150
