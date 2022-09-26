---
title: Send Prometheus metrics to multiple Azure Monitor workspaces in Container insights
description: Describes data collection rules required to send Prometheus metrics from a cluster in Container insights to multiple Azure Monitor workspaces.
ms.topic: conceptual
ms.date: 09/16/2022
ms.reviewer: aul
---

# Send Prometheus metrics to multiple Azure Monitor workspaces in Container insights

Routing metrics to more Azure Monitor Workspaces can be done through the creation of additional data collection rules. All metrics can be sent to all workspaces or different metrics can be sent to different workspaces.

## Send same metrics to multiple Azure Monitor workspaces

You can create multiple Data Collection Rules that point to the same Data Collection Endpoint for metrics to be sent to additional Azure Monitor Workspaces from the same Kubernetes cluster. Currently, this is only available through ARM template deployments [link to Kaveesh's doc]. In your ARM template, add additional DCRs for your additional Azure Monitor Workspaces. Replace `<dcr-name-1>`, `<azure-monitor-workspace-location-1>`, `<dcr-name-2>`, `<azure-monitor-workspace-location-2>`, `<dce-resource-id>` in the sample below:

```json
{
  "type": "Microsoft.Insights/dataCollectionRules",
  "apiVersion": "2021-09-01-preview",
  "name": "<dcr-name-1>",
  "location": "<azure-monitor-workspace-location-1>",
  "kind": "Linux",
  "properties": {
    "dataCollectionEndpointId": "<dce-resource-id>",
    "dataFlows": [
      {
        "destinations": ["MonitoringAccount1"],
        "streams": ["Microsoft-PrometheusMetrics"]
      }
    ],
    "dataSources": {
      "prometheusForwarder": [
        {
          "name": "PrometheusDataSource",
          "streams": ["Microsoft-PrometheusMetrics"],
          "labelIncludeFilter": {}
        }
      ]
    },
    "description": "DCR for Azure Monitor Metrics Profile (Managed Prometheus)",
    "destinations": {
      "monitoringAccounts": [
        {
          "accountResourceId": "<azure-monitor-workspace-resource-id-1>",
          "name": "MonitoringAccount1"
        }
      ]
    }
  },
  "dependsOn": [
    "<dce-resource-id>"
  ]
},
{
  "type": "Microsoft.Insights/dataCollectionRules",
  "apiVersion": "2021-09-01-preview",
  "name": "<dcr-name-2>",
  "location": "<azure-monitor-workspace-location-2>",
  "kind": "Linux",
  "properties": {
    "dataCollectionEndpointId": "<dce-resource-id>",
    "dataFlows": [
      {
        "destinations": ["MonitoringAccount2"],
        "streams": ["Microsoft-PrometheusMetrics"]
      }
    ],
    "dataSources": {
      "prometheusForwarder": [
        {
          "name": "PrometheusDataSource",
          "streams": ["Microsoft-PrometheusMetrics"],
          "labelIncludeFilter": {}
        }
      ]
    },
    "description": "DCR for Azure Monitor Metrics Profile (Managed Prometheus)",
    "destinations": {
      "monitoringAccounts": [
        {
          "accountResourceId": "<azure-monitor-workspace-resource-id-2>",
          "name": "MonitoringAccount2"
        }
      ]
    }
  },
  "dependsOn": [
    "<dce-resource-id>"
  ]
}
```

## Send different metrics to different Azure Monitor workspaces

If you want to send some metrics to one Azure Monitor Workspace and other metrics to a different one, follow the above steps to add additional DCRs. The value of `microsoft_metrics_include_label` under the `labelIncludeFilter` in the DCR is the identifier for the workspace. To then configure which metrics are routed to which workspace, you can add an extra pre-defined label, `microsoft_metrics_account` to the metrics. The value should be the same as the corresponding `microsoft_metrics_include_label` in the DCR for that workspace. To add the label to the metrics, you can utilize `relabel_configs` in your scrape config. To send all metrics from one job to a certain workspace, add the following relabel config:

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

- [Learn more about collecting Prometheus metrics](container-insights-prometheus.md).


