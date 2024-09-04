---
title: Best practices for scaling Azure Monitor Workspaces with Azure Monitor managed service for Prometheus
description: Learn best practices for organizing your Azure Monitor Workspaces to meet your scale and growing volume of data ingestion 
author: EdB-MSFT
ms-service: azure-monitor
ms-subservice: containers
ms.topic: conceptual
ms.date: 07/24/2024

# customer intent: As an azure administrator I want to understand  the best practices for scaling Azure Monitor Workspaces to meet a growing volume of data ingestion

---

# Best practices for scaling Azure Monitor Workspaces with Azure Monitor managed service for Prometheus

Azure Monitor managed service for Prometheus allows you to collect and analyze metrics at scale. Prometheus metrics are stored in Azure Monitor Workspaces. The workspace supports analysis tools like Azure Managed Grafana, Azure Monitor metrics explorer with PromQL, and open source tools such as PromQL and Grafana.

This article provides best practices for organizing your Azure Monitor Workspaces to meet your scale and growing volume of data ingestion.


## Topology design criteria

A single Azure Monitor workspace can be sufficient for many use cases. Some organizations create multiple workspaces to better meet their requirements. As you identify the right criteria to create additional workspaces, create the lowest number of workspaces that match your requirements, while optimizing for minimal administrative management overhead.

The following are scenarios that require splitting an Azure Monitor workspace into multiple workspaces:

| Scenario | Best practice |
|---|---|
|Sovereign clouds.|    When working with more than one sovereign cloud, create an Azure Monitor workspace in each cloud.|
| Compliance or regulatory requirements.|   If you're subject to regulations that mandate the storage of data in specific regions, create an Azure Monitor workspace per region as per your requirements. |
| Regional scaling. |   When you're managing metrics for regionally diverse organizations such as large services or financial institutions with regional accounts, create an Azure Monitor workspace per region.
| Azure tenants.|   For multiple Azure tenants, create an Azure Monitor workspace in each tenant. Querying data across tenants isn't supported.
| Deployment environments. |   Create a separate workspace for each of your deployment environments to maintain discrete metrics for development, test, preproduction, and production environments.|
| Service limits and quotas. | Azure Monitor workspaces have default ingestion limits, which can be increased by opening a support ticket. If you're approaching the limit, or estimate that you'll exceed the ingestion limit, consider requesting an increase, or splitting your workspace into two or more workspaces.|

## Service limits and quotas

Azure Monitor workspaces have default quotas and limitations for metrics of 1 million event ingested per minute. As your usage grows and you need to ingest more metrics, you can request an increase. If your capacity requirements are exceptionally large and your data ingestion needs are exceeding the limits of a single Azure Monitor workspace, consider creating multiple Azure Monitor workspaces. Use the Azure monitor workspace platform metrics to monitor utilization and limits. For more information on limits and quotas, see [Azure Monitor service limits and quotas](/azure/azure-monitor/service-limits#prometheus-metrics).

Consider the following best practices for managing Azure Monitor workspace limits and quotas:

| Best practice | Description |
|---|---|
| Monitor and create an alert on ingestion limits and utilization.| In the Azure portal, navigate to your Azure Monitor Workspace. Go to Metrics and verify that the metrics Active Time Series % Utilization and Events Per Minute Ingested % Utilization are below 100%. Set an Azure Monitor Alert to monitor the utilization and fire when the utilization is greater than 80% of the limit. For more information on monitoring utilization and limits, see [How can I monitor the service limits and quotas](/azure/azure-monitor/essentials/prometheus-metrics-overview#how-can-i-monitor-the-service-limits-and-quota).|
|Request for a limit increase when the utilization exceeds 80% of the current limit.|As your Azure usage grows, the volume of data ingested is likely to increase. We recommend that you request an increase in limits if your data ingestion is exceeding or close to 80% of the ingestion limit. To request a limit increase, open a support ticket. To open a support ticket, see [Create an Azure support request](/azure/azure-supportability/how-to-create-azure-support-request).|
|Estimate your projected scale.|As your usage grows and you ingest more metrics into your workspace, make an estimate of the projected scale and rate of growth. Based on your projections, request an increase in the limit.
|Ingestion with Remote-write using the Azure monitor side-car container. |If you're using the Azure monitor side-car container and remote-write to ingest metrics into an Azure Monitor workspace, consider the following limits: <li>The side-car container can process up to 150,000 unique time series.</li><li> The container might throw errors serving requests over 150,000 due to the high number of concurrent connections. Mitigate this issue by increasing the remote batch size from the 500 default, to 1,000. Changing the remote batch size reduces the number of open connections.</li>|
|DCR/DCE limits. |Limits apply to the data collection rules (DCR) and data collection endpoints (DCE) that send Prometheus metrics to your Azure Monitor workspace. For information on these limits, see  [Prometheus Service limits](/azure/azure-monitor/service-limits#prometheus-metrics). These limits can't be increased. <p> Consider creating additional DCRs and DCEs to distribute the ingestion load across multiple endpoints. This approach helps optimize performance and ensures efficient data handling. For more information about creating DCRs and DCEs, see [How to create custom Data collection endpoint(DCE) and custom Data collection rule(DCR) for an existing Azure monitor workspace to ingest Prometheus metrics](https://github.com/Azure/prometheus-collector/tree/main/Azure-ARM-templates/Prometheus-RemoteWrite-DCR-artifacts)|


## Optimizing performance for high volumes of data

### Ingestion

To optimize ingestion, consider the following best practices:

| Best practice | Description |
|---|---|
| Identify High cardinality Metrics.  |  Identify metrics that have a high cardinality, or metrics that are generating many time series. Once you identify high-cardinality metrics, optimize them to reduce the number of time series by dropping unnecessary labels.|
| Use Prometheus config to optimize ingestion.  |  Azure Managed Prometheus provides Configmaps, which have settings that can be configured and used to optimize ingestion. For more information, see [ama-metrics-settings-configmap](https://aka.ms/azureprometheus-addon-settings-configmap) and [ama-metrics-prometheus-config-configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-prometheus-config-configmap.yaml). These configurations follow the same format as the Prometheus configuration file.<br> For information on customizing collection, see [Customize scraping of Prometheus metrics in Azure Monitor managed service for Prometheus](/azure/azure-monitor/containers/prometheus-metrics-scrape-configuration).<p> For example, consider the following: <li> **Tune Scrape Intervals**.</li> The default scrape frequency is 30 seconds, which can be changed per default target using the configmap.  To balance the trade-off between data granularity and resource usage, adjust the `scrape_interval` and `scrape_timeout` based on the criticality of metrics. <li> **Drop unnecessary labels for high cardinality metrics**.</li> For high cardinality metrics, identify labels that aren't necessary and drop them to reduce the number of time series. Use the `metric_relabel_configs` to drop specific labels from ingestion. For more information, see [Prometheus Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#relabel_config).|

Use the configmap, change the settings as required, and apply the configmap to the kube-system namespace for your cluster. If you're using remote-writing into and Azure Monitor workspace, apply the customizations during ingestion directly in your Prometheus configuration.

### Queries 

To optimize queries, consider the following best practices:

#### Use Recording rules to optimize query performance

Prometheus recording rules are used to precompute frequently used, or computationally expensive queries, making them more efficient and faster to query. Recording rules are especially useful for high volume metrics where querying raw data can be slow and resource-intensive. For more information, see [Recording rules](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/#recording-rules). Azure Managed Prometheus provides a managed and scalable way to create and update recording rules with the help of [Azure Managed Prometheus Rule Groups.](/azure/azure-monitor/essentials/prometheus-rule-groups#rule-types)

Once the rule groups are created, Azure Managed Prometheus automatically loads and starts evaluating them. Query rule groups from the Azure Monitor workspace like other Prometheus metrics.

Recording rules have the following benefits:


- **Improve query performance**  
  Recording rules can be used to precompute complex queries, making them faster to query later. Precomputing complex queries reduces the load on Prometheus when these metrics are queried.

- **Efficiency and Reduced query time**  
  Recording rules precompute the query results, reducing the time taken to query the data. This is especially useful for dashboards with multiple panels or high cardinality metrics.

- **Simplicity**  
  Recording rules simplify queries in Grafana or other visualization tools, as they can reference precomputed metrics.
 
The following example shows a recording rule as defined in Azure Managed Prometheus rule group:
``` yaml
"record": "job:request_duration_seconds:avg ",
"expression": "avg(rate(request_duration_seconds_sum[5m])) by (job)",
"labels": {  "workload_type": "job"
                        },
"enabled": true
```

For more complex metrics, create recording rules that aggregate multiple metrics or perform more advanced calculations. In the following example, `instance:node_cpu_utilisation:rate5m` computes the cpu utilization when the cpu isn't idle

```yaml
"record": "instance:node_cpu_utilisation:rate5m",
 "expression": "1 - avg without (cpu) (sum without (mode)(rate(node_cpu_seconds_total{job=\"node\", mode=~\"idle|iowait|steal\"}[5m])))",
"labels": {
                            "workload_type": "job"
                        },
"enabled": true
```


Consider the following best practices for optimizing recording rules:

| Best practice | Description |
|---|---|
| Identify High Volume Metrics.  |  Focus on metrics that are queried frequently and have a high cardinality. |
| Optimize Rule Evaluation Interval.  |  To balance between data freshness and computational load, adjust the evaluation interval of your recording rules. |
| Monitor Performance.  |  Monitor query performance and adjust recording rules as necessary. |
| Optimize rules by limiting scope.|To make recording rules faster, limit them in scope to a specific cluster. For more information, see [Limiting rules to a specific cluster](/azure/azure-monitor/essentials/prometheus-rule-groups#limiting-rules-to-a-specific-cluster).|


#### Using filters in queries

Optimizing Prometheus queries using filters involves refining the queries to return only the necessary data, reducing the amount of data processed and improving performance. The following are some common techniques to refine Prometheus queries.

| Best practice | Description |
|---|---|
| Use label filters.|Label filters help to narrow down the data to only what you need. Prometheus allows filtering by using `{label_name="label_value"}` syntax. If you have a large number of metrics across multiple clusters, an easy way to limit time series is to use the `cluster` filter.  <p> For example, instead of querying `container_cpu_usage_seconds_total`, filter by cluster  `container_cpu_usage_seconds_total{cluster="cluster1"}`.|
| Apply time range selectors.|Using specific time ranges can significantly reduce the amount of data queried.<p>  For example, instead of querying all data points for the last seven days `http_requests_total{job="myapp"}`, query for the last hour using `http_requests_total{job="myapp"}[1h]`.|
| Use aggregation and grouping.| Aggregation functions can be used to summarize data, which can be more efficient than processing raw data points. When aggregating data, use `by` to group by specific labels, or `without` to exclude specific labels.<p>  For example, sum requests grouped by job: `sum(rate(http_requests_total[5m])) by (job)`.|
|Filter early in the query.| To limit the dataset from the start, apply filters as early as possible in your query.<p>  For example, instead of `sum(rate(http_requests_total[5m])) by (job)`, filter first, then aggregate as follows: `sum(rate(http_requests_total{job="myapp"}[5m])) by (job)`.|
| Avoid regex where possible.| Regex filters can be powerful but are also computationally expensive. Use exact matches whenever possible.<p> For example, instead of `http_requests_total{job=~"myapp.*"}`, use `http_requests_total{job="myapp"}`.|
| Use offset for historical data.| If you're comparing current data with historical data, use the `offset` modifier.<p> For example, to compare current requests against requests from 24 hours ago, use `rate(http_requests_total[5m]) - rate(http_requests_total[5m] offset 24h)`.|
| Limit data points in charts.| When creating charts, limit the number of data points to improve rendering performance. Use the step parameter to control the resolution.<p>    For example, in Grafana: Set a higher step value to reduce data points:`http_requests_total{job="myapp"}[1h:10s]`.|


#### Parallel queries

Running a high number of parallel queries in Prometheus can lead to performance bottlenecks and can affect the stability of your Prometheus server. To handle a large volume of parallel queries efficiently, follow the best practices below:

| Best practice | Description |
|---|---|
|	Query Load Distribution.|   Distribute the query load by spreading the queries across different time intervals or Prometheus instances.|
|Staggered Queries.|  Schedule queries to run at different intervals to avoid peaks of simultaneous query executions.|

If you're still seeing issues with running many parallel queries, create a support ticket to request an increase in the query limits.

### Alerts and recording rules

#### Optimizing alerts and recording rules for high scale

Prometheus alerts and recording rules can be defined as Prometheus rule groups. One rule group can contain up to 20 alerts or recording rules. Create up to 500 rule groups for each workspace to accommodate the number of alerts/rules required. To raise this limit, open a support ticket

When defining the recording rules, take into account the evaluation interval to optimize the number of time series per rule and the performance of rule evaluations. Evaluation intervals can be between 1 minute and 24 hours. The default is 1 minute.

### Use Resource Health to view queries from recording rule status

Set up Resource Health to view the health of your Prometheus rule group in the portal. Resource Health allows you to detect problems in your recording rules, such as incorrect configuration, or query throttling problems. For more information on setting up Resource Health, see [View the resource health states of your Prometheus rule groups](/azure/azure-monitor/essentials/prometheus-rule-groups#view-the-resource-health-states-of-your-prometheus-rule-groups)
