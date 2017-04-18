Collection of custom measurements. Use this collection to report named measurement associated with the telemetry item. It may be the size of Dependency Telemetry payload or number of queue items processed by Request Telemetry or the time it take customer to complete the step in wizard step completion Event Telemetry.

You can use query like [this](https://analytics.applicationinsights.io/demo?q=H4sIAAAAAAAAA2WLOw6DMAyGd07hZoLeoRPqyMaGGAL8aiPhGCV2kKoeHsHK%2Bj1myyr8LoiaqfrT%2FkUCzRft4LMl8OUeL3LuLLIx%2BxR%2BIF8%2BtcoiNq2o78vgWuFthQaJ1AeGGxt6UlBwKxa1qQ6EpLhAfQAAAA%3D%3D&timespan=PT24H) to analyze custom measurements:

```
customEvents 
| where customMeasurements != "" 
| summarize avg(todouble(customMeasurements["Completion Time"]) * itemCount)
```

**Note:** Custom measurements associated with the telemetry item they belong to. And they are subject for sampling with the telemetry item containing those measurements. If you want to track metric that will not be sampled and you do not need to associate it to the telemetry item it belongs to - use [Metric Telemetry](#metric-telemetry) document.

Max key length: 150
