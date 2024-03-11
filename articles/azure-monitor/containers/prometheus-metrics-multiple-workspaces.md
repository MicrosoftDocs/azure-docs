---
title: Send Prometheus metrics to multiple Azure Monitor workspaces
description: Describes data collection rules required to send Prometheus metrics from a cluster in Azure Monitor to multiple Azure Monitor workspaces.
ms.topic: conceptual
ms.date: 2/28/2024
ms.reviewer: aul
---

# Send Prometheus metrics to multiple Azure Monitor workspaces

Routing metrics to more Azure Monitor workspaces can be done through the creation of additional data collection rules.

## Send different metrics to different Azure Monitor workspaces

If you want to send some metrics to one Azure Monitor workspace and other metrics to a different one, follow the above steps to add additional DCRs. The value of `microsoft_metrics_include_label` under the `labelIncludeFilter` in the DCR is the identifier for the workspace. To then configure which metrics are routed to which workspace, you can add an extra pre-defined label, `microsoft_metrics_account` to the metrics. The value should be the same as the corresponding `microsoft_metrics_include_label` in the DCR for that workspace. To add the label to the metrics, you can utilize `relabel_configs` in your scrape config. To send all metrics from one job to a certain workspace, add the following relabel config:

```yaml
relabel_configs:
- source_labels: [__address__]
  target_label: microsoft_metrics_account
  action: replace
  replacement: "MonitoringAccountLabel1"
```

The source label is `__address__` because this label will always exist so this relabel config will always be applied. The target label will always be `microsoft_metrics_account` and its value should be replaced with the corresponding label value for the workspace.



### Example

If you want to configure three different jobs to send the metrics to three different workspaces, then include the following in each data collection rule:

```json
"labelIncludeFilter": {
  "microsoft_metrics_include_label": "MonitoringAccountLabel1"
}
```

```json
"labelIncludeFilter": {
  "microsoft_metrics_include_label": "MonitoringAccountLabel2"
}
```

```json
"labelIncludeFilter": {
  "microsoft_metrics_include_label": "MonitoringAccountLabel3"
}
```

Then in your scrape config, include the same label value for each:
```yaml
scrape_configs:
- job_name: prometheus_ref_app_1
  kubernetes_sd_configs:
    - role: pod
  relabel_configs:
    - source_labels: [__meta_kubernetes_pod_label_app]
      action: keep
      regex: "prometheus-reference-app-1"
    - source_labels: [__address__]
      target_label: microsoft_metrics_account
      action: replace
      replacement: "MonitoringAccountLabel1"
- job_name: prometheus_ref_app_2
  kubernetes_sd_configs:
    - role: pod
  relabel_configs:
    - source_labels: [__meta_kubernetes_pod_label_app]
      action: keep
      regex: "prometheus-reference-app-2"
    - source_labels: [__address__]
      target_label: microsoft_metrics_account
      action: replace
      replacement: "MonitoringAccountLabel2"
- job_name: prometheus_ref_app_3
  kubernetes_sd_configs:
    - role: pod
  relabel_configs:
    - source_labels: [__meta_kubernetes_pod_label_app]
      action: keep
      regex: "prometheus-reference-app-3"
    - source_labels: [__address__]
      target_label: microsoft_metrics_account
      action: replace
      replacement: "MonitoringAccountLabel3"
```


## Next steps

- [Learn more about Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md).
- [Collect Prometheus metrics from AKS cluster](kubernetes-monitoring-enable.md#enable-prometheus-and-grafana).
