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
 > Custom measurements associated with the telemetry item they belong to. And they are subject for sampling with the telemetry item containing those measurements. Use [Metric Telemetry](#metric-telemetry) to track the measurement that has value independent from other telemetry type. 

Max key length: 150
