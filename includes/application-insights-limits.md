There are some limits on the number of metrics and events per application (that is, per instrumentation key). 

Limits depend on the [pricing tier](https://azure.microsoft.com/pricing/details/application-insights/) that you choose.

**Resource** | **Default Limit** | **Maximum Limit**
-------- | ------------- | -------------
Session data points<sup>1</sup> per month | unlimited | 
Other data points per month | 5 million | 50 million<sup>2</sup>
[Trace or Log](../articles/app-insights-search-diagnostic-logs.md) data rate | 200 dp/s | 500 dp/s
[Exception](../articles/app-insights-asp-net-exceptions.md) data rate | 50 dp/s | 50 dp/s
Other telemetry data rate | 200 dp/s | 500 dp/s
[Raw data](../articles/app-insights-diagnostic-search.md) retention | 7 days
[Aggregated data](../articles/app-insights-metrics-explorer.md) retention | 90 days
[Property](../articles/app-insights-api-custom-events-metrics.md#properties) name count | 100 |
Property name length | 100 | 
Property value length | 1000 | 
Trace and Exception message length | 10000 |
[Metric](../articles/app-insights-api-custom-events-metrics.md#properties) name count | 100 |
Metric name length |  100 | 
[Availability tests](../articles/app-insights-monitor-web-app-availability.md) | 10 | 

<sup>1</sup> A data point is an individual metric value or event, with attached properties and measurements.

<sup>2</sup> You can purchase additional capacity beyond 50 million.
 
[About pricing and quotas in Application Insights](../articles/application-insights/app-insights-pricing.md)
