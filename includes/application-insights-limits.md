There are some limits on the number of metrics and events per application (that is, per instrumentation key). 

Limits depend on the [pricing plan](https://azure.microsoft.com/pricing/details/application-insights/) that you choose.

| **Resource** | **Default Limit** | **Note**
| --- | --- | --- |
| Total data per day | 500 GB | You can reduce by setting a cap. If you need more, mail AIDataCap@microsoft.com 
| Free data per month<br/> (Basic price plan) | 1 GB | Additional data charged per GB
| Throttling | 16 k events/second | Measured over a minute. 
| Data retention | 90 days | for [Search](../articles/application-insights/app-insights-diagnostic-search.md), [Analytics](../articles/application-insights/app-insights-analytics.md) and [Metrics explorer](../articles/application-insights/app-insights-metrics-explorer.md)
| [Availability multi-step test](../articles/application-insights/app-insights-monitor-web-app-availability.md#multi-step-web-tests) detailed results retention | 90 days | Detailed results of each step
| Property and metric name length | 150 |
| Property value string length | 8192 |
| Trace and Exception message length | 10000 |
| [Availability tests](../articles/application-insights/app-insights-monitor-web-app-availability.md) count per app  | 10 |

1. All these numbers are per instrumentation key.

[About pricing and quotas in Application Insights](../articles/application-insights/app-insights-pricing.md)
