 Limits depend on the [pricing tier](http://azure.microsoft.com/pricing/details/application-insights/) that you choose.

**Resource** | **Default Limit** | **Maximum Limit**
-------- | ------------- | -------------
Session data points<sup>1</sup> per month | unlimited | unlimited
Other data points per month | 5 million | 50 million<sup>2</sup>
Trace or Log data rate | 200 dp/s | 500 dp/s
Exception data rate | 50 dp/s | 50 dp/s
Other telemetry data rate | 200 dp/s | 500 dp/s
Raw  data retention |7 days| 30 days
Aggregated data retention | 13 months | unlimited
Property name count across the app | 100 | 100
Property name length | 100 | 100
Property value length | 1000 | 1000
Trace and Exception message length | 10000 | 10000
Metric name length |  100 | 100

<sup>1</sup> A data point is an individual metric value or event, with attached properties and measurements.

<sup>2</sup> You can purchase additional capacity beyond 50 million.
 
[About pricing and quotas in Application Insights](app-insights-pricing.md)