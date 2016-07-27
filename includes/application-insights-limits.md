There are some limits on the number of metrics and events per application (that is, per instrumentation key). 

Limits depend on the [pricing tier](https://azure.microsoft.com/pricing/details/application-insights/) that you choose.

**Resource** | **Default Limit** | **Maximum Limit**
-------- | ------------- | -------------
Session data points<sup>1, 2</sup> per month | unlimited | 
Total data points per month for request, event, dependency, trace, exception, and page view | 5 million | 50 million<sup>3</sup>
[Trace and Log](../articles/application-insights/app-insights-search-diagnostic-logs.md) data rate | 200 dp/s | 500 dp/s
[Exception](../articles/application-insights/app-insights-asp-net-exceptions.md) data rate | 50 dp/s | 50 dp/s
Total data rate for request, event, dependency, and page view telemetry | 200 dp/s | 500 dp/s
Raw data retention for [Search](../articles/application-insights/app-insights-diagnostic-search.md) and [Analytics](../articles/application-insights/app-insights-analytics.md) | 7 days
Aggregated data retention for [Metrics explorer](../articles/application-insights/app-insights-metrics-explorer.md) | 90 days
[Property](../articles/application-insights/app-insights-api-custom-events-metrics.md#properties) name count | 100 |
Property name length | 150 | 
Property value length | 8192 | 
Trace and Exception message length | 10000 |
[Metric](../articles/application-insights/app-insights-api-custom-events-metrics.md#properties) name count | 100 |
Metric name length |  150 | 
[Availability tests](../articles/application-insights/app-insights-monitor-web-app-availability.md) | 10 | 

<sup>1</sup> A data point is an individual metric value or event, with attached properties and measurements.

<sup>2</sup> A session data point logs the start or end of a session, and logs user identity.

<sup>3</sup> You can purchase additional capacity beyond 50 million.
 
[About pricing and quotas in Application Insights](../articles/application-insights/app-insights-pricing.md)
