---
title: Customize scraping of Prometheus metrics in Container insights
description: Customize metrics scraping for a Kubernetes cluster with the metrics addon in Container insights.
ms.topic: conceptual
ms.date: 09/16/2022
ms.reviewer: aul
---

# Customize scraping of Prometheus metrics in Container insights

This article provides instructions on customizing metrics scraping for a Kubernetes cluster with the metrics addon in Container insights. 

## Default targets
The following table has a list of all the default targets that the Container insights metrics addon can scrape by default and whether it's initially enabled. Default targets are scraped every 30 seconds.

| Key | Type | Enabled | Description |
|-----|------|----------|-------------|
| kubelet | bool | `true` | Scrape kubelet in every node in the k8s cluster without any extra scrape config. |
| cadvisor | bool | `true` | Scrape cAdvisor in every node in the k8s cluster without any extra scrape config.<br>Linux only. |
| kubestate | bool | `true` | Scrape kube-state-metrics in the k8s cluster (installed as a part of the addon) without any extra scrape config. |
| nodeexporter | bool | `true` | Scrape node metrics without any extra scrape config.<br>Linux only. |
| coredns | bool | `false` | Scrape coredns service in the k8s cluster without any extra scrape config. |
| kubeproxy | bool | `false` | Scrape kube-proxy in every linux node discovered in the k8s cluster without any extra scrape config.<br>Linux only. |
| apiserver | bool | `false` | Scrape the kubernetes api server in the k8s cluster without any extra scrape config. |
| prometheuscollectorhealth | bool | `false` | Scrape info about the prometheus-collector container such as the amount and size of timeseries scraped. |

If you want to turn on the scraping of the default targets that aren't enabled by default, create this [configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-settings-configmap.yaml) or edit an existing one, and update the targets listed under `default-scrape-settings-enabled` to `true`.

## Customizing default targets
By default, only minimal metrics are ingested as described in [Minimal ingestion profile]([minimal-ingestion-profile](container-insights-prometheus-scrape-configuration-minimal.md)). To filter out metrics for any default targets, edit the settings under `default-targets-metrics-keep-list` in this [configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-settings-configmap.yaml) or edit an existing one. This setting is per job. 

For example, `kubelet` is the metric filtering setting for the default target kubelet. Use the following to filter IN metrics collected for the default targets using regex based filtering. 

```
kubelet = "metricX|metricY"
apiserver = "mymetric.*"
```

> [!NOTE]
> If you use quotes or backslashes in the regex, you will need to escape them using a backslash. For example `"test\'smetric\"s\""` and `testbackslash\\*`.

To further customize the default jobs to change properties such as collection frequency or labels, disable the corresponding default target by setting the configmap value for the target to `false`  and then apply the job using custom configmap. For details on custom configuration, see [Customize scraping of Prometheus metrics in Container insights](container-insights-prometheus-scrape-configuration.md).


## Cluster alias
The cluster label appended to every time series scraped will use the last part of the full ARM resourceID. For example, if the resource ID is `/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/rg-name/providers/Microsoft.ContainerService/managedClusters/clustername`, the cluster label is `clustername`. 

To override the cluster label in the time series scraped, update the setting `cluster_alias` to any string under `prometheus-collector-settings` in this [configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-settings-configmap.yaml). You can either create this configmap or edit an exsiting one.

The new label will also show up in the grafana instance in the cluster dropdown instead of the default one.

> [!NOTE]
> Only alphanumeric characters are allowed. Any other characters else will be replaced with `_`. This is to ensure that different components that consume this label will adhere to the basic alphanumeric convention.

## Debug mode 
The metrics addon agent can be configured to run in debug mode by updating the setting `enabled` to `true` under the `debug-mode` setting in this [configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-settings-configmap.yaml). You can either create this configmap or edit an existing one. See [Troubleshoot collection of Prometheus metrics](container-insights-prometheus-metrics-troubleshoot.md#debug-mode) for more details.




## Configure custom scrape jobs

To configure the metrics addon to scrape targets other than the default, create this [configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-prometheus-config-configmap.yaml) and update the `prometheus-config` section with your custom configuration. The format specified in the configmap will be the same as a prometheus.yml following the [configuration format](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#configuration-file). The following sections are currently supported:

```yaml
global:
  scrape_interval: <duration>
  scrape_timeout: <duration>
scrape_configs:
  - <scrape_config>
  ...
```

Before applying the configuration as a configmap, validate it using the [promconfigvalidator tool](container-insights-prometheus-scrape-validate.md), which is the same tool that is run at the container startup to perform validation of custom configuration. If the config isn't valid, then the custom configuration given won't be used by the agent.

Any other unsupported sections need to be removed from the config before applying as a configmap. If not, the promconfigvalidator tool validation will fail, and the custom scrape configuration won't be applied

The `scrape_config` setting `honor_labels` is `false` by default. It should be `true` for scrape configs where labels that are normally added by Prometheus, such as `job` and `instance`, are already labels of the scraped metrics and shouldn't be overridden. This setting is only applicable for cases like [federation](https://prometheus.io/docs/prometheus/latest/federation/) or scraping the [Pushgateway](https://github.com/prometheus/pushgateway), where the scraped metrics already have `job` and `instance` labels. For more information, see the [Prometheus documentation](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config).



## Scraping metrics at high scale

## Advanced Mode: Scraping custom targets with the Daemonset pods

When you scrape custom targets, the scraping is done by the ama-metrics replicaset pod. For a cluster with a large number of nodes and pods running on it, custom scrape targets can be off-loaded to the daemonset. A [configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-prometheus-config-node-configmap.yaml) similar to the regular configmap can be created to have static scrape configs on each node. The scrape config should only target a single node and not try to use service discovery; otherwise each node will try to scrape all targets. The node-exporter config is a good example of using the `$NODE_IP` environment variable (already set for every prometheus-collector container) to target a specific endpoint on the node:

  ```yaml
  - job_name: node
    scrape_interval: 30s
    scheme: http
    metrics_path: /metrics
    relabel_configs:
    - source_labels: [__metrics_path__]
      regex: (.*)
      target_label: metrics_path
    - source_labels: [__address__]
      replacement: '$NODE_NAME'
      target_label: instance
    static_configs:
    - targets: ['$NODE_IP:9100']
  ```

Custom scrape targets can follow the same format using `static_configs` with targets using the `$NODE_IP` environment variable and specifying the port to scrape. Each pod of the daemonset will take the config and scrape and send the metrics for that node.








## Configuration File
The configuration format is the same as the [Prometheus configuration file](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#configuration-file). Currently supported are the following sections:
```yaml
global:
  scrape_interval: <duration>
  scrape_timeout: <duration>
  external_labels:
    <labelname1>: <labelvalue>
    <labelname2>: <labelvalue>
scrape_configs:
  - <scrape_config1>
  - <scrape_config2>
```

Any other unsupported sections need to be removed from the config before applying as a configmap; otherwise the custom configuration will fail validation and won't be applied.

## Scrape Configs
The currently supported methods of target discovery for a [scrape config](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) are either [`static_configs`](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#static_config) or [`kubernetes_sd_configs`](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#kubernetes_sd_config) for specifying or discovering targets.

### Static Config

A static config has a list of static targets and any extra labels to add to them.

```yaml
scrape_configs:
  - job_name: example
    - targets: [ '10.10.10.1:9090', '10.10.10.2:9090', '10.10.10.3:9090' ... ]
    - labels: [ label1: value1, label1: value2, ... ]
```

### Kubernetes Service Discovery Config

Targets discovered using [`kubernetes_sd_configs`](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#kubernetes_sd_config) will each have different `__meta_*` labels depending on what role is specified. These can be used in the `relabel_configs` section to filter targets or replace labels for the targets.

See the [Prometheus examples](https://github.com/prometheus/prometheus/blob/main/documentation/examples/prometheus-kubernetes.yml) of scrape configs for a Kubernetes cluster.

## Relabel Configs
The `relabel_configs` section is applied at the time of target discovery and applies to each target for the job. Below are examples showing ways to use `relabel_configs`.

### Adding a Label
Add a new label called `example_label` with value `example_value` to every metric of the job. Use `__address__` as the source label only because that label will always exist. This will add the label for every target of the job.

```yaml
relabel_configs:
- source_labels: [__address__]
  target_label: example_label
  replacement: 'example_value'
```

### Use Kubernetes Service Discovery Labels

If a job is using [`kubernetes_sd_configs`](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#kubernetes_sd_config) to discover targets, each role has associated `__meta_*` labels for metrics. The `__*` labels are dropped after discovering the targets. To filter by them at the metrics level, first keep them using `relabel_configs` by assigning a label name and then use `metric_relabel_configs` to filter.

```yaml
# Use the kubernetes namespace as a label called 'kubernetes_namespace'
relabel_configs:
- source_labels: [__meta_kubernetes_namespace]
  action: replace
  target_label: kubernetes_namespace

# Keep only metrics with the kubernetes namespace 'default'
metric_relabel_configs:
- source_labels: [kubernetes_namespace]
  action: keep
  regex: 'default'
```

### Job and Instance Relabeling

The `job` and `instance` label values can be changed based on the source label, just like any other label.

```yaml
# Replace the job name with the pod label 'k8s app'
relabel_configs:
- source_labels: [__meta_kubernetes_pod_label_k8s_app]
  target_label: job

# Replace the instance name with the node name. This is helpful to replace a node IP
# and port with a value that is more readable
relabel_configs:
- source_labels: [__meta_kubernetes_node_name]]
  target_label: instance
```

## Metric Relabel Configs

Metric relabel configs are applied after scraping and before ingestion. Use the `metric_relabel_configs` section to filter metrics after scraping. Below are examples of how to do so.

### Drop Metrics by Name

```yaml
# Drop the metric named 'example_metric_name'
metric_relabel_configs:
- source_labels: [__name__]
  action: drop
  regex: 'example_metric_name'
```

### Keep Only Certain Metrics by Name

```yaml
# Keep only the metric named 'example_metric_name'
metric_relabel_configs:
- source_labels: [__name__]
  action: keep
  regex: 'example_metric_name'
```

```yaml
# Keep only metrics that start with 'example_'
metric_relabel_configs:
- source_labels: [__name__]
  action: keep
  regex: '(example_.*)'
```

### Rename Metrics
Metric renaming isn't supported.

### Filter Metrics by Labels

```yaml
# Keep only metrics with where example_label = 'example'
metric_relabel_configs:
- source_labels: [example_label]
  action: keep
  regex: 'example'
```

```yaml
# Keep metrics only if `example_label` equals `value_1` or `value_2`
metric_relabel_configs:
- source_labels: [example_label]
  action: keep
  regex: '(value_1|value_2)'
```

```yaml
# Keep metric only if `example_label_1 = value_1` and `example_label_2 = value_2`
metric_relabel_configs:
- source_labels: [example_label_1, example_label_2]
  separator: ';'
  action: keep
  regex: 'value_1;value_2'
```

```yaml
# Keep metric only if `example_label` exists as a label
metric_relabel_configs:
- source_labels: [example_label_1]
  action: keep
  regex: '.+'
```

## Pod Annotation Based Scraping

If you're currently using Azure Monitor Container Insights Prometheus scraping with the setting `monitor_kubernetes_pods = true`, adding this job to your custom config will allow you to scrape the same pods and metrics.

The scrape config below uses the `__meta_*` labels added from the `kubernetes_sd_configs` for the `pod` role to filter for pods with certain annotations.

To scrape certain pods, specify the port, path, and scheme through annotations for the pod and the below job will scrape only the address specified by the annotation:
- `prometheus.io/scrape`: Enable scraping for this pod
- `prometheus.io/scheme`: If the metrics endpoint is secured, then you will need to set this to `https` & most likely set the tls config.
- `prometheus.io/path`: If the metrics path isn't /metrics, define it with this annotation.
- `prometheus.io/port`: Specify a single, desired port to scrape

```yaml
scrape_configs:
  - job_name: 'kubernetes-pods'

    kubernetes_sd_configs:
    - role: pod

    relabel_configs:
    # Scrape only pods with the annotation: prometheus.io/scrape = true
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
      action: keep
      regex: true

    # If prometheus.io/path is specified, scrape this path instead of /metrics
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
      action: replace
      target_label: __metrics_path__
      regex: (.+)

    # If prometheus.io/port is specified, scrape this port instead of the default
    - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
      action: replace
      regex: ([^:]+)(?::\d+)?;(\d+)
      replacement: $1:$2
      target_label: __address__
        
    # If prometheus.io/scheme is specified, scrape with this scheme instead of http
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scheme]
      action: replace
      regex: (http|https)
      target_label: __scheme__

    # Include the pod namespace as a label for each metric
    - source_labels: [__meta_kubernetes_namespace]
      action: replace
      target_label: kubernetes_namespace

    # Include the pod name as a label for each metric
    - source_labels: [__meta_kubernetes_pod_name]
      action: replace
      target_label: kubernetes_pod_name
    
    # [Optional] Include all pod labels as labels for each metric
    - action: labelmap
      regex: __meta_kubernetes_pod_label_(.+)
```



## Next steps

- [Learn more about collecting Prometheus metrics](container-insights-prometheus.md).