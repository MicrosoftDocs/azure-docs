---
title: Best Practices for scaling Azure Monitor Workspaces with Azure Monitor managed service for Prometheus
description: Learn best practices for organizing your Azure Monitor Workspaces to meet your scale and growing volume of data ingestion 
author: EdB-MSFT
ms-service: azure-monitor
ms-subservice: containers
ms.topic: conceptual
ms.date: 7/20/2024

# customer intent: As an azure adminitstrator I want to understand  the best practices for scaling Azure Monitor Workspaces to meet a growing volume of data ingestion

---

# Best Practices for scaling Azure Monitor Workspaces with Azure Monitor managed service for Prometheus

Azure Monitor managed service for Prometheus allows you to collect and analyze metrics at scale. Prometheus metrics are stored in Azure Monitor Workspaces. The workspace supports analysis tools like Azure Managed Grafana, Azure Monitor metrics explorer with PromQL, and open source tools such as PromQL and Grafana.

In this article, provides best practices for organizing your Azure Monitor Workspaces to meet your scale and growing volume of data ingestion.


## Topology design criteria

A single Azure Monitor workspace can be sufficient for many use cases. Some organizations create multiple workspaces to better meet their requirements. As you identify the right criteria to create additional workspaces, create the lowest number of workspaces that match your requirements, while optimizing for minimal administrative management overhead.

The following are scenarios that require splitting an Azure Monitor workspace into multiple workspaces:

- Sovereign clouds.  
    When working with more than one sovereign cloud, create an Azure Monitor workspace in each cloud.

- Compliance or regulatory requirements.   
    You may be subject to regulations that mandate the storage of data in specific regions. Create an Azure Monitor workspace per region as per your requirements. 
- Regional scaling.  
    When you need to manage metrics for regionally diverse organizations such as large services or financial institutions with regional accounts, create an Azure Monitor workspace per region.
- Azure tenants.
    For multiple Azure tenants, create an Azure Monitor workspace in each tenant. Querying data across tenants isn't supported.
- Deployment environments.
    Create a separate workspace for each of your deployment environments to maintain discrete metrics for development, test, pre-production, and production environments.
- Service limits and quotas
  There's no degradation in performance in terms of availability and efficiency due to the volume of data in your Azure Monitor workspace. Multiple services can send data to the same workspace simultaneously. There is however, a limit on how much data can be ingested into an workspace. If the volume of ingestion is expected to be more than 1 Bn active time series or 1 Bn events/min, consider using multiple workspaces to meet that scale. 

## Service limits and quotas

Azure Monitor workspaces have default quotas and limitations for metrics. As your product grows and you need more metrics, you can request an increase to 50 million events or active time series. If your capacity requirements are exceptionally large and your data ingestion needs can no longer be met by a single Azure Monitor workspace, consider creating multiple Azure Monitor workspaces. Use the Azure monitor workspace platform metrics to monitor utilization and limits. For more information on limits and quotas, see [Azure Monitor service limits and quotas](/azure/azure-monitor/service-limits#prometheus-metrics).

Consider the following best practices for managing Azure Monitor workspace limits ????:

### Monitor and create an alert on Azure Monitor workspace ingestion limits and utilization

In the Azure portal, navigate to your Azure Monitor Workspace. Go to Metrics and verify that the metrics Active Time Series % Utilization and Events Per Minute Ingested % Utilization are below 100%. Set an Azure Monitor Alert to monitor the utilization and fire when the utilization is greater than 80% of the limit. For mor information on monitoring utilization and limits, see [How can I monitor the service limits and quotas](/azure/azure-monitor/essentials/prometheus-metrics-overview#how-can-i-monitor-the-service-limits-and-quota)

### Request for a limit increase when the utilization is more than 80% of the current limit

As your Azure usage grows, the volume of data ingested is likely to increase. We recommend that you request an increase in limits if your data ingestion is exceeding or close to 80% of the ingestion limit. To request a limit increase, open a support ticket.  To open a support ticket, see [Create an Azure support request](/azure/azure-supportability/how-to-create-azure-support-request).


### Estimate your projected scale

As your usage grows and you ingest into your workspace, make an estimate of the projected scale and rate of growth. Based on your projections, request an increase in the limit.

### Ingestion with Remote-write 

If you're using the Azure monitor side-car container and remote-write to ingest metrics into an Azure Monitor wporkspace, Considder the following 
- The side-car container can process up to 150,000 unique time series. 
- The container might throw errors serving requests over 150,000 due to the high number of concurrent connections. Mitigate this issue by increasing the remote batch size from the 500 default, to 1,000. Changing the remote batch size reduces the number of open connections.
 
### DCR/DCE limits

Limits apply to the data collection rules (DCR) and data collection endpoints (DCE) sending Prometheus metrics to your Azure Monitor workspace. For information on these limits, see  [Prometheus Service limits](/azure/azure-monitor/service-limits#prometheus-metrics).  These limits can't be increased. Consider creating additional DCRs and DCEs to distribute the ingestion load across multiple endpoints. This approach helps optimize performance and ensures efficient data handling. For more information about creating DCRs and DCEs, see [How to create custom Data collection endpoint(DCE) and custom Data collection rule(DCR) for an existing Azure monitor workspace to ingest Prometheus metrics](https://github.com/Azure/prometheus-collector/tree/main/Azure-ARM-templates/Prometheus-RemoteWrite-DCR-artifacts)


## Optimizing performance for high volume data

### Ingestion

To optimize ingestion, consider the following best practices:

- Identify High cardinality Metrics.  
  Identify metrics that have a high cardinality (or are generating a lot of timeseries). Once you have identified high-cardinality metrics, you can then optimize them to reduce the number of timeseries by dropping unnecessary labels.

- Use Prometheus config to optimize ingestion.  
  Azure Managed Prometheus provides Configmaps which have settings that can be configured and used to optimize ingestion. For more information, see [ama-metrics-settings-configmap](https://aka.ms/azureprometheus-addon-settings-configmap) and [ama-metrics-prometheus-config-configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-prometheus-config-configmap.yaml) These configurations follow the same format as the Prometheus configuration file.  
FOr information on customizing collection, see [Customize scraping of Prometheus metrics in Azure Monitor managed service for Prometheus](/azure/azure-monitor/containers/prometheus-metrics-scrape-configuration). For example, consider the following:
    -  **Tune Scrape Intervals**. The default scrape frequency is 30 seconds, which can be changed per default target using the configmap. Adjust the `scrape_interval` and `scrape_timeout` based on the criticality of metrics to balance the trade-off between data granularity and resource usage. 
    - **Drop unnecessary labels for high cardinality metrics**. For high cardinality metrics, identify labels that aren't necessary and drop them to reduce the number of timeseries. Use the `metric_relabel_configs` to drop specific labels from ingestion. For more information, see [Prometheus Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#relabel_config).

Use the configmap, changing the settings as required, and apply the configmap to kube-system namespace for your cluster. If you're using remote-writing into and Azure Monitor workspace, apply the customizations during ingestion directly in your Prometheus configuration

### Queries 

